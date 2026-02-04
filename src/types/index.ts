
export interface UserSettings {
  keyboardLayout: 'qwertz' | 'qwerty' | 'dvorak' | 'colemak';
  showVirtualKeyboard: boolean;
  showHands: boolean;
  showGhost: boolean; // New setting
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  soundEnabled: boolean;
}

export interface UserStats {
  charsTyped: number;
  timePlayedSeconds: number;
  errorHeatmap: Record<string, number>; // char -> error count
  lessonsCompleted: number;
  averageWpm: number;
}

export interface MatchHistory {
  id: string;
  timestamp: number;
  levelId: string;
  mode: 'campaign' | 'training';
  lengthMode?: 'short' | 'medium' | 'long'; // Added lengthMode
  wpm: number;
  accuracy: number;
  errors: number;
  durationSeconds: number;
  xpEarned: number;
}

export interface ReplayEvent {
  time: number; // Relative time in ms
  char: string;
  isCorrect: boolean;
}

export interface LevelResult {
  stars: number; // 0-3
  bestWpm: number;
  bestAccuracy: number;
  completedAt: number;
  replayData?: ReplayEvent[]; // Ghost data
}

export interface TrainingLevelStats {
  bestWpm: number;
  replayData?: ReplayEvent[]; // Ghost data
}

export interface UserProfile {
  id: string;
  name: string;
  xp: number;
  rank: string; // e.g. "Novice 5"
  level: number;
  settings: UserSettings;
  stats: UserStats;
  history: MatchHistory[];
  campaignProgress: Record<string, LevelResult>; // levelId -> result
  trainingStats: Record<string, TrainingLevelStats>; // difficulty -> stats
  createdAt: number;
  lastActiveAt: number;
  unlockedLayouts?: string[];
}

export type FingerName = 'thumb-left' | 'thumb-right' | 'index-left' | 'index-right' | 'middle-left' | 'middle-right' | 'ring-left' | 'ring-right' | 'pinky-left' | 'pinky-right';

export interface KeyMap {
  code: string; // Physical key code e.g. "KeyA"
  char: string; // Character produced e.g. "a"
  label?: string; // Optional display label (e.g. "Tab", "Shift") if different from char
  finger?: FingerName;
  row: 1 | 2 | 3 | 4 | 5; // 1 = number row, 3 = home row
  hand?: 'left' | 'right';
  width?: number; // Visual width relative to standard key (1.0). e.g. Space is 6.0
  style?: 'default' | 'special'; // Special for modifier keys
}

export interface LevelConfig {
  id: string;
  tier?: number; // For campaign grouping
  tierName?: string;
  name: string;
  description: string;
  allowedChars: string[];
  minWordLength: number;
  maxWordLength: number;
  includePunctuation: boolean;
  includeNumbers: boolean;
  durationSeconds?: number; // If time based
  targetTextLength?: number; // If length based
  adaptiveWeight: number; // 0-1
  requiredLevel?: number; // To unlock this tier/level
  generationMode?: 'chars' | 'words' | 'mixed' | 'sentence' | 'code' | 'numbers';
  isBoss?: boolean; // If true, triggers BossBattle view
}

export interface KeystrokeLog {
  char: string;
  expected: string;
  timestamp: number;
  isCorrect: boolean;
}

export interface GameState {
  isActive: boolean;
  isPaused: boolean;
  isFinished: boolean;
  hasStartedTyping: boolean;
  text: string;
  typedText: string; // Track what the user actually typed
  cursorIndex: number;
  startTime: number | null;
  elapsedSeconds: number;
  wpm: number;
  accuracy: number;
  errors: number;
  keystrokeHistory: KeystrokeLog[];
}
