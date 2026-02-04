
import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import { ArrowLeft, Play, AlertTriangle, Ghost } from 'lucide-react';
import { useTypingEngine } from '../hooks/useTypingEngine';
import { generateLesson } from '../generators/textGenerator';
import { VirtualKeyboard } from '../../keyboard/components/VirtualKeyboard';
import { TextDisplay } from './TextDisplay';
import { BossBattle } from './BossBattle';
import { ResultsDashboard } from '../../analytics/components/ResultsDashboard';
import { useProfileStore } from '../../profile/store/profileStore';
import { getCampaignLevels, getTrainingLevels } from '../../campaign/utils/levelFactory';
import { LevelConfig, ReplayEvent } from '../../../types';
import { cn } from '../../../utils/cn';
import { useGhostCursor } from '../hooks/useGhostCursor';
import { playSound } from '../../../utils/sound';

export const GameStage: React.FC = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { mode, levelId } = useParams<{ mode: string, levelId: string }>();

  // Extract length modifier from navigation state (default to medium if missing)
  const lengthMode = (location.state as any)?.lengthMode || 'medium';

  const { activeProfileId, profiles, completeSession } = useProfileStore();
  const profile = activeProfileId ? profiles[activeProfileId] : null;
  const engine = useTypingEngine();

  const [levelConfig, setLevelConfig] = useState<LevelConfig | null>(null);
  const [ghostReplayData, setGhostReplayData] = useState<ReplayEvent[] | undefined>(undefined);

  const [showQuitModal, setShowQuitModal] = useState(false);
  const [hasStarted, setHasStarted] = useState(false);
  const [sessionXp, setSessionXp] = useState(0);

  const hasSavedRef = useRef(false);

  // Hook for Ghost Cursor Position
  // Ghost only starts moving if engine.startTime is set (handled inside useGhostCursor)
  const showGhost = profile?.settings.showGhost ?? true;
  const ghostCursorIndex = useGhostCursor(
    showGhost ? ghostReplayData : undefined,
    engine.startTime,
    engine.isActive,
    engine.isPaused
  );

  // Load Level Config & Ghost Data
  useEffect(() => {
    if (!profile || !mode || !levelId) return;

    const layout = profile.settings.keyboardLayout;
    let foundLevel: LevelConfig | undefined;
    let loadedGhost: ReplayEvent[] | undefined;

    if (mode === 'campaign') {
      const levels = getCampaignLevels(layout);
      foundLevel = levels.find(l => l.id === levelId);
      loadedGhost = profile.campaignProgress[levelId]?.replayData;
    } else {
      const levels = getTrainingLevels(layout);
      foundLevel = levels.find(l => l.id === levelId);

      // Load ghost specifically for this length setting
      const statsKey = `${levelId}_${lengthMode}`;
      loadedGhost = profile.trainingStats[statsKey]?.replayData;
    }

    if (foundLevel) {
      setLevelConfig(foundLevel);
      setGhostReplayData(loadedGhost);
    } else {
      navigate('/');
    }

    // Reset Game Logic:
    // If we haven't started this specific session instance (hasStarted is false), 
    // force a reset to clear any stale state from the store (e.g. from a previous finished game).
    // This ensures that when coming from the menu, we always start fresh.
    if (!hasStarted) {
      engine.resetGame();
      setSessionXp(0);
      hasSavedRef.current = false;
    }

    // Adding profile to dependency ensures ghost data reloads immediately after a PB is set
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [mode, levelId, profile, lengthMode]);

  const handleStart = useCallback(() => {
    if (!profile || !levelConfig) return;

    // Pass lengthMode to generator
    const text = generateLesson(levelConfig, profile.stats, lengthMode);

    engine.startGame(text);
    setHasStarted(true);
    hasSavedRef.current = false;
    setSessionXp(0);
  }, [profile, levelConfig, engine, lengthMode]);

  // Spacebar to Start Listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!hasStarted && !showQuitModal && levelConfig && e.code === 'Space') {
        e.preventDefault(); // Prevent scrolling
        handleStart();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [hasStarted, showQuitModal, levelConfig, handleStart]);

  const handleQuit = () => {
    engine.stopGame();
    if (mode === 'campaign') navigate('/campaign');
    else navigate('/training');
  };

  const handleRestart = () => {
    engine.resetGame();
    setHasStarted(false);
    hasSavedRef.current = false;
    setSessionXp(0);
    // Logic for start will be handled by the user pressing space again or button
  };

  const handleBackClick = () => {
    if (engine.isFinished) {
      handleQuit();
    } else {
      setShowQuitModal(true);
    }
  };

  useEffect(() => {
    if (engine.isFinished && hasStarted && !hasSavedRef.current && levelConfig) {
      hasSavedRef.current = true;

      // Play success sound
      if (profile?.settings.soundEnabled ?? true) {
        playSound('applause');
      }

      const errorMap: Record<string, number> = {};
      engine.keystrokeHistory.forEach(k => {
        if (!k.isCorrect && k.expected) {
          errorMap[k.expected] = (errorMap[k.expected] || 0) + 1;
        }
      });

      const effectiveWpm = engine.wpm * (engine.accuracy / 100);
      const xp = Math.round((effectiveWpm * 2) + (engine.text.length / 2));
      setSessionXp(xp);

      const duration = (Date.now() - (engine.startTime || 0)) / 1000;
      const startTime = engine.startTime || Date.now();

      // Normalize History for Replay (Relative Time)
      const replayData: ReplayEvent[] = engine.keystrokeHistory.map(k => ({
        time: k.timestamp - startTime,
        char: k.char,
        isCorrect: k.isCorrect
      }));

      completeSession({
        mode: mode as 'campaign' | 'training',
        lengthMode: lengthMode,
        wpm: engine.wpm,
        accuracy: engine.accuracy,
        errors: engine.errors,
        totalChars: engine.text.length,
        durationSeconds: duration,
        levelId: levelConfig.id,
        errorMap,
        xpEarned: xp,
        replayData
      });
    }
  }, [engine.isFinished, hasStarted, engine.wpm, engine.accuracy, engine.errors, engine.text, engine.startTime, engine.keystrokeHistory, levelConfig, completeSession, mode, lengthMode]);

  if (!profile || !levelConfig) return <div className="p-8 text-center text-slate-500">Loading Level...</div>;

  const isBossMode = levelConfig.isBoss;

  // Format Elapsed Time (MM:SS)
  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="flex flex-col h-full max-w-6xl mx-auto relative">

      {showQuitModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 p-6 rounded-2xl max-w-sm w-full text-center shadow-2xl">
            <AlertTriangle className="mx-auto text-yellow-500 mb-4" size={48} />
            <h3 className="text-xl font-bold text-white mb-2">Quit Session?</h3>
            <p className="text-slate-400 mb-6">Progress will be lost.</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowQuitModal(false)}
                className="flex-1 py-3 bg-slate-800 text-white rounded-lg hover:bg-slate-700 font-medium"
              >
                Resume
              </button>
              <button
                onClick={handleQuit}
                className="flex-1 py-3 bg-red-600 text-white rounded-lg hover:bg-red-500 font-medium"
              >
                Quit
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center mb-4 min-h-[60px]">
        <button
          onClick={handleBackClick}
          className="flex items-center gap-2 text-slate-400 hover:text-white px-4 py-2 rounded-lg hover:bg-slate-800 transition-colors"
        >
          <ArrowLeft size={20} />
          <span className="font-medium hidden md:inline">End Session</span>
        </button>

        {/* Standard HUD (Hidden in Boss Mode as BossBattle has its own HUD) */}
        {!isBossMode && (engine.isActive || engine.isFinished) && (
          <div className="flex gap-2 md:gap-6 bg-slate-800/80 backdrop-blur-md px-6 py-2 rounded-full border border-slate-700 shadow-lg relative min-w-[300px] justify-center">
            <div className="text-center">
              <span className="text-xs text-slate-500 font-bold block">TIME</span>
              <span className="text-xl font-mono text-white tabular-nums">
                {formatTime(engine.elapsedSeconds || 0)}
              </span>
            </div>
            <div className="w-px bg-slate-700" />
            <div className="text-center">
              <span className="text-xs text-slate-500 font-bold block">WPM</span>
              <span className="text-xl font-mono text-brand-400">{engine.wpm}</span>
            </div>
            <div className="w-px bg-slate-700" />
            <div className="text-center">
              <span className="text-xs text-slate-500 font-bold block">ACC</span>
              <span className="text-xl font-mono text-emerald-400">{engine.accuracy}%</span>
            </div>

            {/* Ghost Indicator */}
            {ghostReplayData && showGhost && !engine.isFinished && (
              <div className="absolute -right-10 top-1/2 -translate-y-1/2 text-slate-600" title="Ghost Active">
                <Ghost size={20} />
              </div>
            )}
          </div>
        )}

        <div className="w-[100px] hidden md:block"></div>
      </div>

      <div className={cn(
        "relative flex-1 flex flex-col bg-slate-900 rounded-2xl border border-slate-800 shadow-inner overflow-hidden",
        isBossMode ? "bg-black border-slate-900" : "" // Darker theme for boss
      )}>
        {engine.isFinished ? (
          <div className="flex-1 overflow-y-auto custom-scrollbar p-8">
            <ResultsDashboard
              wpm={engine.wpm}
              accuracy={engine.accuracy}
              errors={engine.errors}
              xpEarned={sessionXp}
              timeSeconds={engine.elapsedSeconds}
              totalXp={profile.xp}
              lengthMode={lengthMode}
              onRestart={handleRestart}
              onHome={handleQuit}
            />
          </div>
        ) : (
          <>
            <div className="flex-1 flex items-center justify-center min-h-[250px] relative">
              {!hasStarted ? (
                <div className="text-center z-10 animate-in fade-in slide-in-from-bottom-4">
                  <div className="w-20 h-20 bg-brand-900/30 rounded-full flex items-center justify-center mx-auto mb-6 ring-4 ring-brand-500/20">
                    <Play size={40} className="text-brand-500 ml-2" />
                  </div>
                  <h2 className="text-3xl font-bold text-white mb-2">{levelConfig.name}</h2>
                  <p className="text-slate-400 mb-8 max-w-md mx-auto">{levelConfig.description}</p>

                  {ghostReplayData && (
                    <div className="mb-6 flex items-center justify-center gap-2 text-slate-500 text-sm">
                      <Ghost size={16} />
                      <span>Racing against Personal Best</span>
                    </div>
                  )}

                  <button
                    onClick={handleStart}
                    className="px-10 py-4 bg-brand-600 hover:bg-brand-500 text-white text-lg font-bold rounded-xl transition-all hover:scale-105 shadow-xl shadow-brand-900/40"
                  >
                    {isBossMode ? "Fight!" : "Start Practice"}
                  </button>
                  <p className="text-xs text-slate-600 mt-4 animate-pulse">Press Space to Start</p>

                  {mode === 'training' && (
                    <p className="text-[10px] text-slate-700 mt-2 uppercase tracking-widest font-bold">
                      Length: {lengthMode}
                    </p>
                  )}
                </div>
              ) : (
                // CONDITIONAL RENDER: BOSS BATTLE VS TEXT DISPLAY
                isBossMode ? (
                  <div className="w-full h-full p-4">
                    <BossBattle
                      text={engine.text}
                      typedText={engine.typedText}
                      wpm={engine.wpm}
                      errors={engine.errors}
                      accuracy={engine.accuracy}
                    />
                  </div>
                ) : (
                  <TextDisplay
                    text={engine.text}
                    typedText={engine.typedText}
                    cursorIndex={engine.cursorIndex}
                    ghostCursorIndex={showGhost ? ghostCursorIndex : -1}
                  />
                )
              )}
            </div>

            {/* Virtual Keyboard (Hidden in Boss Mode) */}
            {!isBossMode && (
              <div className="bg-slate-950 p-4 border-t border-slate-800">
                <VirtualKeyboard targetCharacter={engine.currentCharacter} />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};
