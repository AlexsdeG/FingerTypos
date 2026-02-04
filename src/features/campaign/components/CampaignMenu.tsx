import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Lock, Star, CheckCircle2, Play } from 'lucide-react';
import { useProfileStore } from '../../profile/store/profileStore';
import { getCampaignLevels } from '../utils/levelFactory';
import { cn } from '../../../utils/cn';

export const CampaignMenu = () => {
  const navigate = useNavigate();
  const { activeProfileId, profiles } = useProfileStore();
  const profile = activeProfileId ? profiles[activeProfileId] : null;

  if (!profile) return <div>Loading Profile...</div>;

  const layoutId = profile.settings.keyboardLayout;
  const levels = getCampaignLevels(layoutId);

  // Group by Tier
  const levelsByTier: Record<number, typeof levels> = {};
  levels.forEach(l => {
    const t = l.tier || 1;
    if (!levelsByTier[t]) levelsByTier[t] = [];
    levelsByTier[t].push(l);
  });

  const handleLevelSelect = (levelId: string) => {
    navigate(`/play/campaign/${levelId}`);
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-white mb-2">Campaign</h2>
        <p className="text-slate-400">Master touch typing step-by-step. Earn stars to prove your mastery.</p>
      </div>

      <div className="space-y-12">
        {Object.entries(levelsByTier).map(([tierStr, tierLevels]) => {
          const tier = parseInt(tierStr);
          const firstLevel = tierLevels[0];
          const isTierLocked = profile.level < (firstLevel.requiredLevel || 1);

          return (
            <div key={tier} className="relative">
              <div className="flex items-center gap-4 mb-6">
                 <div className="bg-brand-900/50 text-brand-300 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider border border-brand-500/30">
                   Tier {tier}
                 </div>
                 <h3 className="text-xl font-bold text-white">{firstLevel.tierName}</h3>
                 {isTierLocked && (
                   <div className="flex items-center gap-2 text-red-400 text-sm bg-red-900/20 px-3 py-1 rounded-lg border border-red-900/50">
                     <Lock size={14} />
                     <span>Requires Level {firstLevel.requiredLevel}</span>
                   </div>
                 )}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {tierLevels.map((level, index) => {
                  const progress = profile.campaignProgress[level.id];
                  const stars = progress?.stars || 0;
                  
                  // Level Locking Logic:
                  // 1. Tier must be unlocked
                  // 2. Previous level must be completed (at least 1 star)
                  // Exception: First level of a tier is unlocked if tier is unlocked.
                  let isLocked = isTierLocked;
                  if (!isLocked && index > 0) {
                     const prevLevelId = tierLevels[index - 1].id;
                     const prevProgress = profile.campaignProgress[prevLevelId];
                     if (!prevProgress || prevProgress.stars < 1) {
                        isLocked = true;
                     }
                  }

                  return (
                    <button
                      key={level.id}
                      disabled={isLocked}
                      onClick={() => handleLevelSelect(level.id)}
                      className={cn(
                        "group relative flex flex-col items-start p-5 rounded-xl border transition-all text-left",
                        isLocked 
                          ? "bg-slate-900/50 border-slate-800 opacity-70 cursor-not-allowed" 
                          : "bg-slate-800 border-slate-700 hover:border-brand-500 hover:bg-slate-750 shadow-lg"
                      )}
                    >
                      <div className="flex justify-between w-full mb-2">
                         <span className={cn(
                           "text-xs font-bold uppercase", 
                           isLocked ? "text-slate-600" : "text-brand-400"
                         )}>
                           Level {index + 1}
                         </span>
                         {progress && !isLocked && (
                            <div className="flex gap-0.5">
                              {[1, 2, 3].map(s => (
                                <Star 
                                  key={s} 
                                  size={14} 
                                  className={s <= stars ? "fill-yellow-500 text-yellow-500" : "text-slate-700"} 
                                />
                              ))}
                            </div>
                         )}
                      </div>
                      
                      <h4 className={cn("text-lg font-bold mb-1", isLocked ? "text-slate-500" : "text-white")}>
                        {level.name}
                      </h4>
                      <p className="text-xs text-slate-500 line-clamp-2 mb-4">
                        {level.description}
                      </p>

                      {isLocked ? (
                        <div className="mt-auto pt-2 flex items-center gap-2 text-slate-600 text-sm font-medium">
                          <Lock size={16} /> Locked
                        </div>
                      ) : (
                        <div className="mt-auto pt-2 flex items-center gap-2 text-sm font-medium">
                           {progress ? (
                             <span className="text-emerald-400 flex items-center gap-1">
                               <CheckCircle2 size={16} /> Best: {progress.bestWpm} WPM
                             </span>
                           ) : (
                             <span className="text-brand-400 group-hover:text-brand-300 flex items-center gap-1">
                               <Play size={16} /> Start
                             </span>
                           )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
