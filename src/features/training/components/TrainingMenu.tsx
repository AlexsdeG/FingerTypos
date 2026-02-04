
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Dumbbell, Trophy, Zap, Skull, Code2, Binary, Swords } from 'lucide-react';
import { useProfileStore } from '../../profile/store/profileStore';
import { getTrainingLevels } from '../../campaign/utils/levelFactory';
import { cn } from '../../../utils/cn';

export const TrainingMenu = () => {
  const navigate = useNavigate();
  const { activeProfileId, profiles } = useProfileStore();
  const profile = activeProfileId ? profiles[activeProfileId] : null;
  const [lengthSelection, setLengthSelection] = useState<Record<string, 'short' | 'medium' | 'long'>>({});

  if (!profile) return <div>Loading...</div>;

  const layoutId = profile.settings.keyboardLayout;
  const levels = getTrainingLevels(layoutId);

  const getIcon = (id: string) => {
    if (id.includes('easy')) return <Dumbbell className="text-emerald-400" size={32} />;
    if (id.includes('medium')) return <Zap className="text-yellow-400" size={32} />;
    if (id.includes('hard')) return <Trophy className="text-orange-400" size={32} />;
    if (id.includes('elite')) return <Skull className="text-red-500" size={32} />;
    if (id.includes('code')) return <Code2 className="text-blue-400" size={32} />;
    if (id.includes('numbers')) return <Binary className="text-purple-400" size={32} />;
    if (id.includes('boss')) return <Swords className="text-red-600" size={32} />;
    return <Dumbbell className="text-slate-400" size={32} />;
  };

  const getGradient = (id: string) => {
    if (id.includes('easy')) return "hover:border-emerald-500/50 hover:shadow-emerald-900/20";
    if (id.includes('medium')) return "hover:border-yellow-500/50 hover:shadow-yellow-900/20";
    if (id.includes('hard')) return "hover:border-orange-500/50 hover:shadow-orange-900/20";
    if (id.includes('elite')) return "hover:border-red-500/50 hover:shadow-red-900/20";
    if (id.includes('code')) return "hover:border-blue-500/50 hover:shadow-blue-900/20";
    if (id.includes('numbers')) return "hover:border-purple-500/50 hover:shadow-purple-900/20";
    if (id.includes('boss')) return "hover:border-red-600/50 hover:shadow-red-900/30 bg-red-950/20";
    return "hover:border-slate-500/50";
  };

  const setLength = (levelId: string, len: 'short' | 'medium' | 'long') => {
    setLengthSelection(prev => ({ ...prev, [levelId]: len }));
  };

  const handleSelect = (levelId: string) => {
    const len = lengthSelection[levelId] || 'medium';
    navigate(`/play/training/${levelId}`, { state: { lengthMode: len } });
  };

  return (
    <div className="max-w-5xl mx-auto">
      <div className="mb-10 text-center">
        <h2 className="text-4xl font-bold text-white mb-2">Free Training</h2>
        <p className="text-slate-400">Push your limits with infinite procedural generation.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pb-12">
        {levels.map((level) => {
          const currentLength = lengthSelection[level.id] || 'medium';

          // Construct composite key for stats lookup
          const statsKey = `${level.id}_${currentLength}`;
          const stats = profile.trainingStats[statsKey];
          const bestWpm = stats?.bestWpm || 0;

          return (
            <div
              key={level.id}
              className={cn(
                "group relative bg-slate-800 rounded-2xl border border-slate-700 transition-all duration-300 shadow-lg flex flex-col",
                getGradient(level.id)
              )}
            >
              <div
                className="p-8 cursor-pointer flex-1"
                onClick={() => handleSelect(level.id)}
              >
                <div className="absolute top-6 right-6 opacity-50 group-hover:opacity-100 transition-opacity group-hover:scale-110 duration-300">
                  {getIcon(level.id)}
                </div>

                <div className="relative z-10">
                  <h3 className="text-2xl font-bold text-white mb-2">{level.name}</h3>
                  <p className="text-slate-400 mb-6 max-w-[80%]">{level.description}</p>

                  <div className="flex items-center gap-4">
                    {bestWpm > 0 && (
                      <div className="px-3 py-1 bg-slate-900 rounded-lg border border-slate-700 text-sm text-brand-400 font-bold animate-in fade-in">
                        PB ({currentLength}): {bestWpm} WPM
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Length Selector Footer */}
              <div className="px-8 pb-6 pt-0 relative z-20">
                <div className="flex items-center gap-2 bg-slate-900/50 p-1 rounded-lg w-fit border border-slate-700/50" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setLength(level.id, 'short')}
                    className={cn(
                      "px-3 py-1 text-xs font-bold rounded-md transition-colors",
                      currentLength === 'short' ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    Short
                  </button>
                  <button
                    onClick={() => setLength(level.id, 'medium')}
                    className={cn(
                      "px-3 py-1 text-xs font-bold rounded-md transition-colors",
                      currentLength === 'medium' ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    Medium
                  </button>
                  <button
                    onClick={() => setLength(level.id, 'long')}
                    className={cn(
                      "px-3 py-1 text-xs font-bold rounded-md transition-colors",
                      currentLength === 'long' ? "bg-slate-700 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                    )}
                  >
                    Long
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
