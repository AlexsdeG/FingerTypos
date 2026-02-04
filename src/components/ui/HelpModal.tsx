
import React from 'react';
import { X, Keyboard, Ghost, Activity, Eye } from 'lucide-react';

interface HelpModalProps {
  onClose: () => void;
}

export const HelpModal: React.FC<HelpModalProps> = ({ onClose }) => {
  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-2xl bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden max-h-[90vh] overflow-y-auto">

        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-800 bg-slate-900/50 sticky top-0 backdrop-blur-md z-10">
          <h2 className="text-xl font-bold text-white">How to Play</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Content */}
        <div className="p-8 space-y-8">

          {/* Section 1: Visual Guides */}
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-brand-900/30 rounded-xl text-brand-400 shrink-0">
              <Eye size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Finger Guides</h3>
              <p className="text-slate-400 text-sm leading-relaxed mb-4">
                FingerTypos uses dynamic visual cues to teach you the correct finger movement.
                An <strong className="text-white">animated line</strong> appears on the virtual keyboard, tracing the path from your finger's home position (e.g., 'F') to the target key (e.g., 'T').
              </p>
              <ul className="text-sm text-slate-500 list-disc pl-5 space-y-1">
                <li><strong className="text-emerald-400">Green:</strong> Index Fingers</li>
                <li><strong className="text-yellow-400">Yellow:</strong> Middle Fingers</li>
                <li><strong className="text-orange-400">Orange:</strong> Ring Fingers</li>
                <li><strong className="text-red-400">Red:</strong> Pinky Fingers</li>
              </ul>
            </div>
          </div>

          {/* Section 2: Ghost Replay */}
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-slate-800 rounded-xl text-slate-300 shrink-0">
              <Ghost size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Ghost Replay</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                When you achieve a new Personal Best (PB) on a level, the game saves your exact keystroke timing.
                On subsequent attempts, a <strong className="text-white">Ghost Cursor</strong> will replay your best run in real-time.
                Race against yourself to improve!
              </p>
            </div>
          </div>

          {/* Section 3: Keyboard Detection */}
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-slate-800 rounded-xl text-slate-300 shrink-0">
              <Keyboard size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Layout Support</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                The game supports both <strong>QWERTY</strong> and <strong>QWERTZ</strong> layouts.
                You can manually switch in settings or use the <strong>Auto-Detect</strong> button which uses the browser API to detect your physical keyboard layout.
              </p>
            </div>
          </div>

          {/* Section 4: Scoring */}
          <div className="flex gap-4 items-start">
            <div className="p-3 bg-slate-800 rounded-xl text-slate-300 shrink-0">
              <Activity size={24} />
            </div>
            <div>
              <h3 className="text-lg font-bold text-white mb-2">Scoring & XP</h3>
              <p className="text-slate-400 text-sm leading-relaxed">
                You earn XP for every character typed, with bonuses for high speed and accuracy.
                Level up to unlock new ranks from <strong>Novice</strong> to <strong>FingerTypos</strong>.
              </p>
            </div>
          </div>

        </div>

        <div className="p-4 bg-slate-900 border-t border-slate-800 text-center">
          <button
            onClick={onClose}
            className="px-8 py-2 bg-brand-600 hover:bg-brand-500 text-white rounded-lg font-bold transition-colors"
          >
            Got it
          </button>
        </div>

      </div>
    </div>
  );
};
