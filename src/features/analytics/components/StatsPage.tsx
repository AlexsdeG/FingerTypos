
import { useMemo } from 'react';
import {
   LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
   TooltipProps
} from 'recharts';
import { Clock, Activity, Target, Zap, Trophy, History, Keyboard } from 'lucide-react';
import { useProfileStore, getLevelProgress, calculateRank } from '../../profile/store/profileStore';
import { getCampaignLevels, getTrainingLevels } from '../../campaign/utils/levelFactory';
import { cn } from '../../../utils/cn';

// Custom Tooltip for Recharts
const CustomTooltip = ({ active, payload }: TooltipProps<number, string>) => {
   if (active && payload && payload.length) {
      const data = payload[0].payload;
      return (
         <div className="bg-slate-900 border border-slate-700 p-3 rounded-lg shadow-xl text-xs">
            <p className="font-bold text-white mb-1">{data.levelName} <span className="text-slate-500 font-normal">({data.mode})</span></p>
            <div className="space-y-1">
               <p className="flex justify-between gap-4 text-brand-400 font-bold">
                  <span>WPM:</span>
                  <span>{data.wpm}</span>
               </p>
               <p className="flex justify-between gap-4 text-slate-300">
                  <span>Errors:</span>
                  <span className="text-red-400">{data.errors}</span>
               </p>
               <p className="flex justify-between gap-4 text-slate-300">
                  <span>Accuracy:</span>
                  <span className={data.accuracy >= 95 ? "text-emerald-400" : "text-yellow-400"}>{data.accuracy}%</span>
               </p>
               <p className="flex justify-between gap-4 text-slate-400 capitalize">
                  <span>Length:</span>
                  <span>{data.lengthMode || 'Default'}</span>
               </p>
            </div>
         </div>
      );
   }
   return null;
};

export const StatsPage = () => {
   const { activeProfileId, profiles } = useProfileStore();
   const profile = activeProfileId ? profiles[activeProfileId] : null;

   // Generate Level Name Map
   const levelNames = useMemo(() => {
      if (!profile) return {};
      const layout = profile.settings.keyboardLayout;
      const allLevels = [...getCampaignLevels(layout), ...getTrainingLevels(layout)];
      return allLevels.reduce((acc, level) => {
         acc[level.id] = level.name;
         return acc;
      }, {} as Record<string, string>);
   }, [profile]);

   // Process data for charts
   const historyData = useMemo(() => {
      if (!profile) return [];
      // Sort chronological: oldest first
      const sorted = [...profile.history].sort((a, b) => a.timestamp - b.timestamp);
      // Use the last 20 games for the graph
      return sorted.slice(-20).map((h, i) => ({
         index: i + 1,
         levelId: h.levelId,
         levelName: levelNames[h.levelId] || h.levelId, // Map ID to Name
         mode: h.mode,
         lengthMode: h.lengthMode,
         wpm: h.wpm,
         accuracy: h.accuracy,
         errors: h.errors,
         date: new Date(h.timestamp).toLocaleDateString()
      }));
   }, [profile, levelNames]);

   // Process data for Error Heatmap (Top 10 Worst Keys)
   const worstKeys = useMemo(() => {
      if (!profile?.stats?.errorHeatmap) return [];
      return Object.entries(profile.stats.errorHeatmap)
         .sort(([, a], [, b]) => b - a)
         .slice(0, 10)
         .map(([char, count]) => ({ char, count }));
   }, [profile]);

   if (!profile) return <div className="text-center p-10 text-slate-500">Loading Stats...</div>;

   const { title: rankTitle, division } = calculateRank(profile.level);
   const { progressPercent } = getLevelProgress(profile.xp);

   // Formatting helper for duration
   const formatDuration = (seconds: number) => {
      const hours = Math.floor(seconds / 3600);
      const mins = Math.floor((seconds % 3600) / 60);
      return hours > 0 ? `${hours}h ${mins}m` : `${mins}m`;
   };

   return (
      <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in duration-300">

         {/* Header Profile Summary */}
         <div className="bg-slate-900 border border-slate-800 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 shadow-xl relative overflow-hidden">
            {/* Decorative Background */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-900/10 to-transparent pointer-events-none" />

            {/* Avatar/Rank */}
            <div className="flex-shrink-0 text-center relative z-10">
               <div className="w-24 h-24 rounded-full bg-brand-600 flex items-center justify-center text-4xl font-bold text-white shadow-lg mx-auto mb-4 border-4 border-slate-800">
                  {profile.name[0].toUpperCase()}
               </div>
               <h2 className="text-2xl font-bold text-white">{profile.name}</h2>
               <div className="inline-block mt-2 px-3 py-1 rounded-full bg-slate-800 border border-slate-700 text-brand-400 font-bold text-sm uppercase tracking-wide">
                  {rankTitle} {division}
               </div>
            </div>

            {/* Level Progress */}
            <div className="flex-1 w-full relative z-10">
               <div className="flex justify-between text-sm text-slate-400 mb-2 font-medium">
                  <span>Level {profile.level}</span>
                  <span className="text-white font-mono">{Math.round(profile.xp).toLocaleString()} XP</span>
               </div>
               <div className="h-4 bg-slate-800 rounded-full overflow-hidden border border-slate-700">
                  <div className="h-full bg-brand-500" style={{ width: `${progressPercent}%` }} />
               </div>
               <p className="text-xs text-slate-500 mt-2 text-right">Keep training to unlock next rank</p>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 gap-4 w-full md:w-auto relative z-10">
               <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                  <div className="text-slate-400 text-xs uppercase font-bold mb-1">Time Played</div>
                  <div className="text-2xl font-mono text-white flex items-center gap-2">
                     <Clock size={18} className="text-brand-500" />
                     {formatDuration(profile.stats.timePlayedSeconds)}
                  </div>
               </div>
               <div className="bg-slate-800/80 p-4 rounded-2xl border border-slate-700/50 backdrop-blur-sm">
                  <div className="text-slate-400 text-xs uppercase font-bold mb-1">Keys Typed</div>
                  <div className="text-2xl font-mono text-white flex items-center gap-2">
                     <Keyboard size={18} className="text-emerald-500" />
                     {profile.stats.charsTyped.toLocaleString()}
                  </div>
               </div>
            </div>
         </div>

         {/* Main Stats Grid */}
         <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

            {/* WPM Trend Chart */}
            <div className="bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-lg">
               <div className="flex items-center justify-between mb-6">
                  <h3 className="text-xl font-bold text-white flex items-center gap-2">
                     <Activity className="text-brand-400" />
                     Performance Trend
                  </h3>
                  <span className="text-xs text-slate-500 bg-slate-800 px-2 py-1 rounded">Last 20 Games</span>
               </div>

               <div className="h-[250px] w-full">
                  {historyData.length > 1 ? (
                     <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={historyData}>
                           <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
                           <XAxis dataKey="index" hide />
                           <YAxis
                              stroke="#64748b"
                              fontSize={12}
                              tickLine={false}
                              axisLine={false}
                              domain={['auto', 'auto']}
                           />
                           <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#334155' }} />
                           <Line
                              type="monotone"
                              dataKey="wpm"
                              stroke="#0ea5e9"
                              strokeWidth={3}
                              dot={{ r: 4, fill: '#0ea5e9', strokeWidth: 2, stroke: '#0f172a' }}
                              activeDot={{ r: 6 }}
                           />
                        </LineChart>
                     </ResponsiveContainer>
                  ) : (
                     <div className="h-full flex items-center justify-center text-slate-600 italic">
                        Not enough data yet. Play more games!
                     </div>
                  )}
               </div>
            </div>

            {/* Metrics Overview */}
            <div className="grid grid-cols-2 gap-4">
               {/* Avg WPM */}
               <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between hover:border-brand-500/30 transition-colors">
                  <div className="p-3 bg-brand-900/30 w-fit rounded-xl text-brand-400 mb-4">
                     <Zap size={24} />
                  </div>
                  <div>
                     <div className="text-4xl font-bold text-white mb-1">{profile.stats.averageWpm}</div>
                     <div className="text-sm text-slate-400 font-medium">Average WPM</div>
                  </div>
               </div>

               {/* Games Played */}
               <div className="bg-slate-800 border border-slate-700 rounded-3xl p-6 flex flex-col justify-between hover:border-emerald-500/30 transition-colors">
                  <div className="p-3 bg-emerald-900/30 w-fit rounded-xl text-emerald-400 mb-4">
                     <Trophy size={24} />
                  </div>
                  <div>
                     <div className="text-4xl font-bold text-white mb-1">{profile.stats.lessonsCompleted}</div>
                     <div className="text-sm text-slate-400 font-medium">Sessions Completed</div>
                  </div>
               </div>

               {/* Error Analysis (Top 5) */}
               <div className="col-span-2 bg-slate-900 border border-slate-800 rounded-3xl p-6">
                  <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                     <Target className="text-red-400" size={20} />
                     Trouble Keys
                  </h3>

                  {worstKeys.length > 0 ? (
                     <div className="grid grid-cols-5 gap-2">
                        {worstKeys.slice(0, 5).map(({ char, count }, _idx) => (
                           <div key={char} className="flex flex-col items-center">
                              <div className="w-10 h-10 rounded-lg bg-slate-800 border border-red-500/30 flex items-center justify-center text-lg font-mono font-bold text-white mb-1 relative overflow-hidden group">
                                 <span className="relative z-10">{char === ' ' ? '␣' : char.toUpperCase()}</span>
                                 <div className="absolute inset-0 bg-red-500/10 group-hover:bg-red-500/20 transition-colors" />
                              </div>
                              <div className="text-xs text-red-400 font-bold">{count} err</div>
                           </div>
                        ))}
                     </div>
                  ) : (
                     <div className="text-slate-500 text-sm italic py-4 text-center">No errors recorded yet. Perfect!</div>
                  )}
               </div>
            </div>

         </div>

         {/* Recent Activity Log */}
         <div className="bg-slate-900 border border-slate-800 rounded-3xl overflow-hidden">
            <div className="p-6 border-b border-slate-800 flex items-center gap-2">
               <History className="text-slate-400" />
               <h3 className="text-lg font-bold text-white">Recent Activity</h3>
            </div>
            <div className="divide-y divide-slate-800 max-h-[400px] overflow-y-auto custom-scrollbar">
               {profile.history.length > 0 ? (
                  profile.history.slice(0, 10).map((game) => (
                     <div key={game.id} className="p-4 flex items-center justify-between hover:bg-slate-800/50 transition-colors">
                        <div className="flex items-center gap-4">
                           <div className={cn(
                              "w-2 h-12 rounded-full",
                              game.mode === 'campaign' ? "bg-brand-500" : "bg-emerald-500"
                           )} />
                           <div>
                              <div className="text-white font-bold text-sm flex items-center gap-2">
                                 {levelNames[game.levelId] || game.levelId}
                                 <span className="text-slate-500 font-normal capitalize">({game.mode})</span>
                                 <span className="text-[10px] bg-slate-800 border border-slate-700 px-1.5 py-0.5 rounded text-slate-400 uppercase tracking-wider">
                                    {game.lengthMode || 'Default'}
                                 </span>
                              </div>
                              <div className="text-xs text-slate-500">
                                 {new Date(game.timestamp).toLocaleString()}
                              </div>
                           </div>
                        </div>

                        <div className="flex gap-6 text-right">
                           <div>
                              <div className="text-white font-mono font-bold">{game.wpm}</div>
                              <div className="text-xs text-slate-500 uppercase">WPM</div>
                           </div>
                           <div>
                              <div className={cn(
                                 "font-mono font-bold",
                                 game.accuracy >= 95 ? "text-emerald-400" : "text-yellow-400"
                              )}>{game.accuracy}%</div>
                              <div className="text-xs text-slate-500 uppercase">ACC</div>
                           </div>
                           <div className="hidden sm:block">
                              <div className="text-brand-300 font-mono font-bold">+{game.xpEarned}</div>
                              <div className="text-xs text-slate-500 uppercase">XP</div>
                           </div>
                        </div>
                     </div>
                  ))
               ) : (
                  <div className="p-8 text-center text-slate-500 italic">No matches played yet.</div>
               )}
            </div>
         </div>

      </div>
   );
};
