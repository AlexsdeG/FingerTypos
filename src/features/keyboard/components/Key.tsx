import { forwardRef } from 'react';
import { motion } from 'framer-motion';
import { KeyMap } from '../../../types';
import { cn } from '../../../utils/cn';
import { getFingerColor, getFingerHighlight } from '../utils/fingerColors';

interface KeyProps {
  data: KeyMap;
  isPressed: boolean;
  isActive: boolean;
  showFingerHint?: boolean;
}

export const Key = forwardRef<HTMLDivElement, KeyProps>(({ data, isPressed, isActive, showFingerHint = true }, ref) => {
  // Calculate relative width (base unit approx 3rem)
  const widthStyle = {
    flexGrow: data.width || 1,
    flexBasis: `${(data.width || 1) * 3}rem`,
  };

  const fingerStyle = showFingerHint ? getFingerColor(data.finger) : 'border-slate-700 bg-slate-800 text-slate-400';
  const activeHighlight = isActive ? getFingerHighlight(data.finger) : '';

  // Cast motion.div to any to avoid TypeScript errors with 'animate' prop
  const MotionDiv = motion.div as any;

  return (
    <div
      ref={ref}
      className="relative p-1 select-none"
      style={widthStyle}
      data-code={data.code} // Helper for debugging/selection
    >
      <MotionDiv
        animate={{
          scale: isPressed ? 0.95 : 1,
          y: isPressed ? 2 : 0,
        }}
        transition={{ duration: 0.05 }}
        className={cn(
          "h-12 md:h-14 rounded-lg border-b-4 flex items-center justify-center transition-colors duration-150 relative overflow-hidden",
          fingerStyle,
          isActive ? "border-b-0 translate-y-[2px] brightness-125" : "border-opacity-50",
          isPressed ? "border-b-0 brightness-90" : ""
        )}
      >
        {/* Active Indicator Glow */}
        {isActive && (
          <div className={cn(
            "absolute inset-0 opacity-20 animate-pulse",
            activeHighlight.split(' ')[0] // extract bg color
          )} />
        )}

        <span className={cn(
          "font-bold z-10",
          data.style === 'special' ? "text-[10px] md:text-xs uppercase tracking-wider" : "text-sm md:text-lg"
        )}>
          {data.label || data.char.toUpperCase()}
        </span>

        {/* Tactile bump for F and J */}
        {(data.code === 'KeyF' || data.code === 'KeyJ') && (
          <div className="absolute bottom-2 w-4 h-1 bg-white/20 rounded-full" />
        )}
      </MotionDiv>
    </div>
  );
});

Key.displayName = 'Key';