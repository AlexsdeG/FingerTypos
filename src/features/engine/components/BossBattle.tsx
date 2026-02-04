
import React, { useEffect, useState, useRef } from 'react';
import { Skull, Zap, Heart, ShieldAlert, Swords } from 'lucide-react';
import { cn } from '../../../utils/cn';

interface BossBattleProps {
  text: string;
  typedText: string;
  wpm: number;
  errors: number;
  accuracy: number;
  combo?: number; // Potential future feature
  activeChar: string;
}

export const BossBattle: React.FC<BossBattleProps> = ({ 
  text, 
  typedText, 
  wpm, 
  errors, 
  activeChar
}) => {
  const [bossHp, setBossHp] = useState(100);
  const [playerHp, setPlayerHp] = useState(100);
  const [isHit, setIsHit] = useState(false); // Boss got hit
  const [isPlayerHit, setIsPlayerHit] = useState(false); // Player got hit (error)
  
  const prevTypedLength = useRef(typedText.length);
  const prevErrors = useRef(errors);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // 1. Calculate Damage to Boss (based on progress)
    const progress = (typedText.length / text.length) * 100;
    setBossHp(Math.max(0, 100 - progress));

    // 2. Check for successful hit (typed length increased)
    if (typedText.length > prevTypedLength.current) {
      setIsHit(true);
      setTimeout(() => setIsHit(false), 150);
    }
    prevTypedLength.current = typedText.length;

    // 3. Check for Player Damage (errors increased)
    if (errors > prevErrors.current) {
      const damage = 5; // Fixed damage per error
      setPlayerHp(prev => Math.max(0, prev - damage));
      setIsPlayerHit(true);
      setTimeout(() => setIsPlayerHit(false), 200);
    }
    prevErrors.current = errors;

  }, [typedText, text.length, errors]);

  // Extract current word for display
  const words = text.split(' ');
  // Estimate current word index based on spaces count in typed text
  // This is a rough approximation for visualization
  const currentWordIndex = typedText.split(' ').length - 1;
  const currentWord = words[Math.min(currentWordIndex, words.length - 1)];
  const nextWord = words[Math.min(currentWordIndex + 1, words.length - 1)];
  
  // Find which part of the current word is typed
  // We need to find the start index of the current word in the full text
  let charCount = 0;
  for (let i = 0; i < currentWordIndex; i++) {
    charCount += words[i].length + 1; // +1 for space
  }
  
  const relativeIndex = typedText.length - charCount;
  const safeRelativeIndex = Math.max(0, Math.min(relativeIndex, currentWord.length));
  
  const typedSlice = currentWord.slice(0, safeRelativeIndex);
  const untypedSlice = currentWord.slice(safeRelativeIndex);

  return (
    <div ref={containerRef} className="relative w-full h-[500px] bg-slate-950 rounded-2xl overflow-hidden border-4 border-slate-800 flex flex-col shadow-2xl">
      
      {/* HUD Layer */}
      <div className="absolute top-0 left-0 right-0 p-6 flex justify-between z-20">
        
        {/* Boss HP Bar */}
        <div className="w-1/2 max-w-md">
           <div className="flex justify-between text-red-400 font-bold mb-1 uppercase tracking-wider text-sm">
             <span>Glitch Monster</span>
             <span>{Math.round(bossHp)}%</span>
           </div>
           <div className="h-4 bg-slate-900 border border-red-900 rounded-full overflow-hidden relative">
              <div 
                className="h-full bg-red-600 transition-all duration-300" 
                style={{ width: `${bossHp}%` }}
              />
           </div>
        </div>

        {/* Player Stats */}
        <div className="flex gap-4">
           <div className="flex flex-col items-center">
             <div className="flex items-center gap-1 text-brand-400 font-bold">
               <Zap size={20} className="fill-brand-400" />
               <span>{wpm} DPS</span>
             </div>
           </div>
           <div className="flex flex-col items-center">
             <div className="flex items-center gap-1 text-emerald-400 font-bold">
               <Heart size={20} className="fill-emerald-400" />
               <span>{playerHp}%</span>
             </div>
           </div>
        </div>
      </div>

      {/* Battle Scene */}
      <div className="flex-1 relative flex items-center justify-center">
        
        {/* Background Grid Animation */}
        <div className="absolute inset-0 bg-[linear-gradient(rgba(15,23,42,0.9),rgba(15,23,42,0.9)),url('https://images.unsplash.com/photo-1550751827-4bd374c3f58b?q=80&w=2070&auto=format&fit=crop')] bg-cover bg-center opacity-20 pointer-events-none" />

        {/* The Boss */}
        <div className={cn(
          "relative transition-transform duration-100",
          isHit ? "scale-95 brightness-150 grayscale-0" : "scale-100 grayscale-[0.3]",
          bossHp <= 0 ? "opacity-0 scale-50" : "opacity-100"
        )}>
           <div className="relative z-10 p-8 rounded-full bg-slate-900/50 backdrop-blur-sm border-4 border-red-500/30 shadow-[0_0_50px_rgba(239,68,68,0.2)]">
             <Skull size={120} className={cn("text-red-500", isHit ? "animate-shake" : "animate-pulse")} />
           </div>
           
           {/* Damage Number Popup (Simple implementation) */}
           {isHit && (
             <div className="absolute -top-10 left-1/2 -translate-x-1/2 text-4xl font-black text-white animate-bounce-short drop-shadow-[0_2px_2px_rgba(220,38,38,1)]">
               CRIT!
             </div>
           )}
        </div>

        {/* Player Hit Effect */}
        {isPlayerHit && (
           <div className="absolute inset-0 bg-red-500/20 z-30 animate-flash pointer-events-none flex items-center justify-center">
              <ShieldAlert size={100} className="text-red-500 animate-ping" />
           </div>
        )}

      </div>

      {/* Typing Interface (Stream) */}
      <div className="h-32 bg-slate-900/90 border-t border-slate-700 backdrop-blur-md z-20 flex flex-col items-center justify-center relative">
         <div className="text-xs text-slate-500 uppercase tracking-widest mb-2 font-bold">Command Stream</div>
         
         <div className="flex items-baseline gap-4">
             {/* Main Word */}
             <div className="text-5xl font-mono font-bold">
                <span className="text-emerald-500 opacity-50">{typedSlice}</span>
                <span className="text-white relative">
                   {/* Cursor */}
                   <span className="absolute -left-[2px] top-0 bottom-0 w-[3px] bg-brand-400 animate-pulse" />
                   {untypedSlice}
                </span>
             </div>
             
             {/* Next Word Preview */}
             {nextWord && (
               <div className="text-2xl font-mono text-slate-600 blur-[1px]">
                  {nextWord}
               </div>
             )}
         </div>
         
         {/* Instructions */}
         <div className="absolute bottom-2 right-4 text-slate-600 text-xs flex items-center gap-1">
            <Swords size={12} />
            Type to attack
         </div>
      </div>
    </div>
  );
};
