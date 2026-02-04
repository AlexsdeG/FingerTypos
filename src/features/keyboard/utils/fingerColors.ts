import { FingerName } from '../../../types';

export const getFingerColor = (finger?: FingerName): string => {
  if (!finger) return 'border-slate-700 bg-slate-800';

  switch (finger) {
    // Left Hand
    case 'pinky-left':
      return 'border-red-500/50 bg-red-900/20 text-red-200';
    case 'ring-left':
      return 'border-orange-500/50 bg-orange-900/20 text-orange-200';
    case 'middle-left':
      return 'border-yellow-500/50 bg-yellow-900/20 text-yellow-200';
    case 'index-left':
      return 'border-emerald-500/50 bg-emerald-900/20 text-emerald-200';
    case 'thumb-left':
      return 'border-slate-500/50 bg-slate-800 text-slate-300';

    // Right Hand
    case 'thumb-right':
      return 'border-slate-500/50 bg-slate-800 text-slate-300';
    case 'index-right':
      return 'border-cyan-500/50 bg-cyan-900/20 text-cyan-200';
    case 'middle-right':
      return 'border-blue-500/50 bg-blue-900/20 text-blue-200';
    case 'ring-right':
      return 'border-indigo-500/50 bg-indigo-900/20 text-indigo-200';
    case 'pinky-right':
      return 'border-fuchsia-500/50 bg-fuchsia-900/20 text-fuchsia-200';

    default:
      return 'border-slate-700 bg-slate-800';
  }
};

export const getFingerHighlight = (finger?: FingerName): string => {
  if (!finger) return 'bg-slate-500';

  switch (finger) {
    case 'pinky-left': return 'bg-red-500 shadow-red-500/50';
    case 'ring-left': return 'bg-orange-500 shadow-orange-500/50';
    case 'middle-left': return 'bg-yellow-500 shadow-yellow-500/50';
    case 'index-left': return 'bg-emerald-500 shadow-emerald-500/50';
    
    case 'index-right': return 'bg-cyan-500 shadow-cyan-500/50';
    case 'middle-right': return 'bg-blue-500 shadow-blue-500/50';
    case 'ring-right': return 'bg-indigo-500 shadow-indigo-500/50';
    case 'pinky-right': return 'bg-fuchsia-500 shadow-fuchsia-500/50';
    
    default: return 'bg-slate-500';
  }
};