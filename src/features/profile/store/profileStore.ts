
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { UserProfile, UserSettings, MatchHistory, LevelResult, ReplayEvent } from '../../../types';

interface SessionResults {
  mode: 'campaign' | 'training';
  levelId: string;
  lengthMode: 'short' | 'medium' | 'long'; // Added lengthMode
  wpm: number;
  accuracy: number;
  errors: number;
  totalChars: number;
  durationSeconds: number;
  errorMap: Record<string, number>;
  xpEarned: number;
  replayData: ReplayEvent[]; // Normalized relative timestamps
}

interface ProfileState {
  activeProfileId: string | null;
  profiles: Record<string, UserProfile>;

  // Actions
  createProfile: (name: string, layout?: 'qwerty' | 'qwertz') => void;
  setActiveProfile: (id: string) => void;
  updateSettings: (settings: Partial<UserSettings>) => void;
  completeSession: (results: SessionResults) => void;
  importProfile: (profile: UserProfile) => void;
}

const DEFAULT_SETTINGS: UserSettings = {
  keyboardLayout: 'qwerty',
  showVirtualKeyboard: true,
  showHands: true,
  showGhost: true,
  difficulty: 'medium',
  soundEnabled: true,
};

const INITIAL_STATS = {
  charsTyped: 0,
  timePlayedSeconds: 0,
  errorHeatmap: {},
  lessonsCompleted: 0,
  averageWpm: 0,
};

const RANKS = [
  "Novice",
  "Apprentice",
  "Keyboard Warrior",
  "Speed Demon",
  "Cyber Scribe",
  "FingerTypos"
];

// Calculate Rank Title and Division (5 down to 1) based on Level
export const calculateRank = (level: number) => {
  const rankIndex = Math.floor((level - 1) / 5);
  const division = 5 - ((level - 1) % 5);

  if (rankIndex >= RANKS.length) {
    return { title: RANKS[RANKS.length - 1], division: 1 };
  }

  return { title: RANKS[rankIndex], division };
};

export const getLevelProgress = (xp: number) => {
  const currentLevel = Math.floor(Math.sqrt(xp / 100)) + 1;
  const currentLevelBaseXp = 100 * Math.pow(currentLevel - 1, 2);
  const nextLevelXp = 100 * Math.pow(currentLevel, 2);
  const xpInLevel = xp - currentLevelBaseXp;
  const xpRequiredForNext = nextLevelXp - currentLevelBaseXp;
  const progressPercent = Math.min(100, Math.max(0, (xpInLevel / xpRequiredForNext) * 100));

  return {
    currentLevel,
    nextLevel: currentLevel + 1,
    currentLevelBaseXp,
    nextLevelXp,
    progressPercent,
    xpInLevel,
    xpRequiredForNext
  };
};

// Star Calculation Helper
const calculateStars = (wpm: number, accuracy: number): number => {
  if (accuracy < 80) return 0; // Failed
  if (wpm >= 40 && accuracy >= 95) return 3;
  if (wpm >= 25 && accuracy >= 90) return 2;
  return 1;
};

export const useProfileStore = create<ProfileState>()(
  persist(
    (set, get) => ({
      activeProfileId: null,
      profiles: {},

      createProfile: (name, layout = 'qwerty') => {
        const id = crypto.randomUUID();
        const { title, division } = calculateRank(1);

        const newProfile: UserProfile = {
          id,
          name,
          xp: 0,
          rank: `${title} ${division}`,
          level: 1,
          settings: { ...DEFAULT_SETTINGS, keyboardLayout: layout },
          stats: { ...INITIAL_STATS },
          history: [],
          campaignProgress: {},
          trainingStats: {},
          createdAt: Date.now(),
          lastActiveAt: Date.now(),
        };

        set((state) => ({
          profiles: { ...state.profiles, [id]: newProfile },
          activeProfileId: id,
        }));
      },

      setActiveProfile: (id) => {
        set({ activeProfileId: id });
      },

      updateSettings: (newSettings) => {
        const { activeProfileId } = get();
        if (!activeProfileId) return;

        set((state) => ({
          profiles: {
            ...state.profiles,
            [activeProfileId]: {
              ...state.profiles[activeProfileId],
              settings: { ...state.profiles[activeProfileId].settings, ...newSettings },
            },
          },
        }));
      },

      completeSession: (results) => {
        const { activeProfileId } = get();
        if (!activeProfileId) return;

        set((state) => {
          const profile = state.profiles[activeProfileId];
          const currentStats = profile.stats;

          // 1. Update XP and Level
          const newXp = profile.xp + results.xpEarned;
          const { currentLevel } = getLevelProgress(newXp);
          const { title, division } = calculateRank(currentLevel);
          const newRank = `${title} ${division}`;

          // 2. Merge Error Heatmap
          const newHeatmap = { ...currentStats.errorHeatmap };
          Object.entries(results.errorMap).forEach(([char, count]) => {
            newHeatmap[char] = (newHeatmap[char] || 0) + count;
          });

          // 3. Update General Stats
          const newAvgWpm = currentStats.lessonsCompleted === 0
            ? results.wpm
            : ((currentStats.averageWpm * currentStats.lessonsCompleted) + results.wpm) / (currentStats.lessonsCompleted + 1);

          // 4. Update Mode Specific Stats & SAVE GHOST
          let newCampaignProgress = { ...profile.campaignProgress };
          let newTrainingStats = { ...profile.trainingStats };

          if (results.mode === 'campaign') {
            const stars = calculateStars(results.wpm, results.accuracy);
            const prevBest = newCampaignProgress[results.levelId];

            // Update if better stars OR same stars but better WPM
            if (!prevBest || stars > prevBest.stars || (stars === prevBest.stars && results.wpm > prevBest.bestWpm)) {
              newCampaignProgress[results.levelId] = {
                stars,
                bestWpm: Math.max(results.wpm, prevBest?.bestWpm || 0),
                bestAccuracy: Math.max(results.accuracy, prevBest?.bestAccuracy || 0),
                completedAt: Date.now(),
                replayData: results.replayData // Save Ghost
              };
            }
          } else if (results.mode === 'training') {
            // For Training, key is separate by length mode
            const statsKey = `${results.levelId}_${results.lengthMode}`;
            const prev = newTrainingStats[statsKey];
            // Update if better WPM
            if (!prev || results.wpm > prev.bestWpm) {
              newTrainingStats[statsKey] = {
                bestWpm: results.wpm,
                replayData: results.replayData // Save Ghost
              };
            }
          }

          // 5. Create History Entry
          const historyEntry: MatchHistory = {
            id: crypto.randomUUID(),
            timestamp: Date.now(),
            levelId: results.levelId,
            mode: results.mode,
            lengthMode: results.lengthMode, // Save length mode
            wpm: results.wpm,
            accuracy: results.accuracy,
            errors: results.errors,
            durationSeconds: results.durationSeconds,
            xpEarned: results.xpEarned
          };

          return {
            profiles: {
              ...state.profiles,
              [activeProfileId]: {
                ...profile,
                xp: newXp,
                level: currentLevel,
                rank: newRank,
                history: [historyEntry, ...profile.history],
                campaignProgress: newCampaignProgress,
                trainingStats: newTrainingStats,
                lastActiveAt: Date.now(),
                stats: {
                  ...currentStats,
                  charsTyped: currentStats.charsTyped + results.totalChars,
                  lessonsCompleted: currentStats.lessonsCompleted + 1,
                  timePlayedSeconds: currentStats.timePlayedSeconds + results.durationSeconds,
                  errorHeatmap: newHeatmap,
                  averageWpm: Math.round(newAvgWpm),
                },
              },
            },
          };
        });
      },

      importProfile: (profile) => {
        if (!profile.id || !profile.name || !profile.stats) {
          console.error("Invalid profile data");
          return;
        }

        const newId = crypto.randomUUID();
        const newProfile = { ...profile, id: newId };

        set((state) => ({
          profiles: { ...state.profiles, [newId]: newProfile },
          activeProfileId: newId
        }));
      }
    }),
    {
      name: 'FingerTypos-storage',
    }
  )
);
