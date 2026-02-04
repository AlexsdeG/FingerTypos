
import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  ReferenceDot
} from 'recharts';
import { RotateCcw, Home, Trophy, Activity, Target, Zap, Star } from 'lucide-react';
import { getLevelProgress, calculateRank } from '../../profile/store/profileStore';

interface ResultsDashboardProps {
  wpm: number;
  accuracy: number;
  errors: number;
  timeSeconds: number; // Duration of the run
  xpEarned: number;
  totalXp?: number; // Added to calculate bar
  lengthMode?: string; // Added prop
  onRestart: () => void;
  onHome: () => void;
}

// Statistical Constants for WPM Distribution
const MEAN_WPM = 40;
const STD_DEV = 15;
const SCALING_FACTOR = 500;

const getDensity = (x: number) => {
  return (1 / (STD_DEV * Math.sqrt(2 * Math.PI))) *
    Math.exp(-0.5 * Math.pow((x - MEAN_WPM) / STD_DEV, 2)) *
    SCALING_FACTOR;
};

const generateDistributionData = () => {
  const data = [];
  for (let x = 0; x <= 140; x += 5) {
    data.push({ wpm: x, density: getDensity(x) });
  }
  return data;
};

const DISTRIBUTION_DATA = generateDistributionData();

const calculatePercentile = (score: number) => {
  const z = (score - MEAN_WPM) / STD_DEV;
  // Approximation CDF
  const p = 0.3275911;
  const a1 = 0.254829592;
  const a2 = -0.284496736;
  const a3 = 1.421413741;
  const a4 = -1.453152027;
  const a5 = 1.061405429;

  const sign = (z < 0) ? -1 : 1;
  const x = Math.abs(z) / Math.sqrt(2);
  const t = 1.0 / (1.0 + p * x);
  const erf = 1.0 - (((((a5 * t + a4) * t) + a3) * t + a2) * t + a1) * t * Math.exp(-x * x);

  const probability = 0.5 * (1.0 + sign * erf);
  return probability * 100;
};

export const ResultsDashboard: React.FC<ResultsDashboardProps> = ({
  wpm,
  accuracy,
  errors,
  timeSeconds,
  xpEarned,
  totalXp = 0,
  lengthMode,
  onRestart,
  onHome
}) => {
  // Stats calculations
  const effectiveWpm = Math.max(0, wpm * (accuracy / 100));
  const percentile = calculatePercentile(effectiveWpm);
  const isAboveAverage = percentile >= 50;
  const topVal = 100 - percentile;
  const formattedTop = topVal < 0.01 ? "< 0.01" : topVal.toFixed(2);
  const formattedPercentile = percentile.toFixed(2);
  const userDensity = getDensity(effectiveWpm);

  const headlineMain = isAboveAverage
    ? `Top ${formattedTop}%`
    : `Faster than ${formattedPercentile}%`;

  const subText = isAboveAverage
    ? `You are faster than ${formattedPercentile}% of users!`
    : `Keep practicing to climb the ranks!`;

  // Time Formatting (mm:ss)
  const minutes = Math.floor(timeSeconds / 60);
  const seconds = Math.floor(timeSeconds % 60);
  const timeString = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  // XP Progress Calculation
  const {
    progressPercent,
    currentLevel,
    nextLevel,
    xpInLevel,
    xpRequiredForNext
  } = getLevelProgress(totalXp);

  const { title: rankTitle, division: rankDivision } = calculateRank(currentLevel);

  return (
    <div className="flex flex-col items-center justify-center w-full max-w-5xl mx-auto animate-in fade-in zoom-in duration-300">

      {/* Header Badge */}
      <div className="mb-8 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-slate-800 border border-slate-700 text-slate-300 text-sm mb-4">
          <Trophy size={14} className="text-yellow-500" />
          <span className="capitalize">{lengthMode ? `${lengthMode} Session` : 'Session'} Complete</span>
        </div>
        <h2 className="text-4xl md:text-5xl font-bold text-white mb-2">
          {headlineMain} <span className="text-slate-500 text-2xl font-normal">of typists</span>
        </h2>
        <p className="text-slate-400">{subText}</p>
      </div>

      {/* XP / Level Progress Bar */}
      <div className="w-full mb-8 bg-slate-800/50 p-6 rounded-2xl border border-slate-700">
        <div className="flex justify-between items-end mb-2">
          <div>
            <div className="text-2xl font-bold text-white flex items-center gap-2">
              {rankTitle} <span className="text-brand-400">{rankDivision}</span>
            </div>
            <div className="text-sm text-slate-400">Level {currentLevel}</div>
          </div>
          <div className="text-right">
            <div className="text-sm font-medium text-brand-300">
              +{xpEarned} XP
            </div>
            <div className="text-xs text-slate-500">
              {Math.round(xpInLevel)} / {Math.round(xpRequiredForNext)} to Level {nextLevel}
            </div>
          </div>
        </div>

        {/* Bar Track */}
        <div className="h-4 bg-slate-900 rounded-full overflow-hidden border border-slate-700 relative">
          <div
            className="h-full bg-brand-500 relative transition-all duration-1000 ease-out"
            style={{ width: `${progressPercent}%` }}
          >
            <div className="absolute inset-0 bg-white/20 animate-pulse" />
          </div>
        </div>
      </div>

      {/* Main Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-4 w-full mb-8">
        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col items-center">
          <div className="p-3 bg-brand-900/30 rounded-full text-brand-400 mb-2">
            <Zap size={24} />
          </div>
          <div className="text-4xl font-bold text-white">{wpm}</div>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Gross WPM</div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col items-center">
          <div className="p-3 bg-emerald-900/30 rounded-full text-emerald-400 mb-2">
            <Target size={24} />
          </div>
          <div className="text-4xl font-bold text-white">{accuracy}%</div>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Accuracy</div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col items-center">
          <div className="p-3 bg-red-900/30 rounded-full text-red-400 mb-2">
            <Activity size={24} />
          </div>
          <div className="text-4xl font-bold text-white">{errors}</div>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">Errors</div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col items-center">
          <div className="p-3 bg-yellow-900/30 rounded-full text-yellow-400 mb-2">
            <Star size={24} />
          </div>
          <div className="text-4xl font-bold text-white">{xpEarned}</div>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold">XP Earned</div>
        </div>

        <div className="bg-slate-800/50 p-6 rounded-2xl border border-slate-700 flex flex-col items-center">
          <div className="text-4xl font-bold text-white mt-auto">{timeString}</div>
          <div className="text-xs uppercase tracking-wider text-slate-500 font-semibold mt-2">Time</div>
        </div>
      </div>

      {/* Graph Section */}
      <div className="w-full bg-slate-900/50 p-6 rounded-2xl border border-slate-800 mb-8">
        <h3 className="text-lg font-bold text-white mb-6 flex items-center gap-2">
          <Activity size={20} className="text-brand-500" />
          Global Speed Distribution
        </h3>
        <div className="h-[250px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <AreaChart data={DISTRIBUTION_DATA} margin={{ top: 10, right: 30, left: 0, bottom: 0 }}>
              <defs>
                <linearGradient id="colorWpm" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#0ea5e9" stopOpacity={0.3} />
                  <stop offset="95%" stopColor="#0ea5e9" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
              <XAxis
                dataKey="wpm"
                type="number"
                domain={[0, 140]}
                stroke="#64748b"
                tickLine={false}
                axisLine={false}
                tickFormatter={(val) => `${val}`}
              />
              <YAxis hide />
              <Tooltip
                contentStyle={{ backgroundColor: '#0f172a', borderColor: '#334155', color: '#f8fafc' }}
                itemStyle={{ color: '#38bdf8' }}
                formatter={(_value: number) => [``, '']}
                labelFormatter={(label) => `${label} WPM`}
                filterNull={true}
              />
              <Area
                type="monotone"
                dataKey="density"
                stroke="#0ea5e9"
                strokeWidth={2}
                fillOpacity={1}
                fill="url(#colorWpm)"
              />
              {/* Vertical line for Effective WPM */}
              <ReferenceLine x={effectiveWpm} stroke="#f59e0b" strokeDasharray="3 3">
                {/* REMOVED LABEL "YOU" */}
              </ReferenceLine>
              {/* The colored dot on the user's Effective WPM */}
              <ReferenceDot
                x={effectiveWpm}
                y={userDensity}
                r={6}
                fill="#f59e0b"
                stroke="#fff"
                strokeWidth={2}
              />
            </AreaChart>
          </ResponsiveContainer>
        </div>
        <p className="text-xs text-center text-slate-500 mt-2">
          * Your position is calculated based on accuracy-adjusted WPM ({Math.round(effectiveWpm)}).
        </p>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onRestart}
          className="flex items-center gap-2 px-8 py-4 bg-white text-slate-900 hover:bg-slate-200 font-bold rounded-xl transition-all shadow-lg hover:scale-105"
        >
          <RotateCcw size={20} /> Play Again
        </button>
        <button
          onClick={onHome}
          className="flex items-center gap-2 px-8 py-4 bg-slate-800 hover:bg-slate-700 text-white font-bold rounded-xl border border-slate-700 transition-all hover:scale-105"
        >
          <Home size={20} /> Home
        </button>
      </div>
    </div>
  );
};
