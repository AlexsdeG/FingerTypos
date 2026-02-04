import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { KeyMap } from '../../../types';
import { HOME_KEYS } from '../utils/homeKeys';

interface FingerPathProps {
  targetKey: KeyMap | undefined;
  keyElements: Map<string, HTMLDivElement>;
  containerElement: HTMLDivElement | null;
}

interface Point {
  x: number;
  y: number;
}

export const FingerPath: React.FC<FingerPathProps> = ({ targetKey, keyElements, containerElement }) => {
  const [coords, setCoords] = useState<{ start: Point; end: Point } | null>(null);

  // Calculate coordinates
  useEffect(() => {
    if (!targetKey || !containerElement || !targetKey.finger) {
      setCoords(null);
      return;
    }

    const homeKeyCode = HOME_KEYS[targetKey.finger];
    if (!homeKeyCode) return;

    // If target is the home key, don't show arrow
    if (homeKeyCode === targetKey.code) {
      setCoords(null);
      return;
    }

    const startEl = keyElements.get(homeKeyCode);
    const endEl = keyElements.get(targetKey.code);

    if (startEl && endEl) {
      const containerRect = containerElement.getBoundingClientRect();
      const startRect = startEl.getBoundingClientRect();
      const endRect = endEl.getBoundingClientRect();

      // Ensure elements are actually visible/measured
      if (startRect.width === 0 || endRect.width === 0) return;

      const start: Point = {
        x: startRect.left - containerRect.left + startRect.width / 2,
        y: startRect.top - containerRect.top + startRect.height / 2,
      };

      const end: Point = {
        x: endRect.left - containerRect.left + endRect.width / 2,
        y: endRect.top - containerRect.top + endRect.height / 2,
      };

      setCoords({ start, end });
    }
  }, [targetKey, keyElements, containerElement, typeof window !== 'undefined' ? window.innerWidth : 0]);

  if (!coords || !targetKey) return null;

  // Map finger names to Hex colors for SVG stroke
  const colorMap: Record<string, string> = {
    'pinky-left': '#ef4444', // red-500
    'ring-left': '#f97316',   // orange-500
    'middle-left': '#eab308', // yellow-500
    'index-left': '#10b981',  // emerald-500
    'thumb-left': '#64748b',  // slate-500
    'thumb-right': '#64748b',
    'index-right': '#06b6d4', // cyan-500
    'middle-right': '#3b82f6', // blue-500
    'ring-right': '#6366f1',  // indigo-500
    'pinky-right': '#d946ef', // fuchsia-500
  };

  const strokeColor = targetKey.finger ? colorMap[targetKey.finger] : '#cbd5e1';
  // Unique ID for the marker to ensure it updates correctly when color changes
  const markerId = `arrowhead-${targetKey.code}-${targetKey.finger}`;

  // Cast motion components to any to avoid TypeScript errors with 'initial' and 'animate' props
  const MotionG = motion.g as any;
  const MotionLine = motion.line as any;

  return (
    <svg className="absolute inset-0 w-full h-full pointer-events-none z-20 overflow-visible">
      <defs>
        <marker
          id={markerId}
          markerWidth="6"
          markerHeight="6"
          refX="5"
          refY="3"
          orient="auto"
          markerUnits="strokeWidth"
        >
          <path d="M0,0 L0,6 L6,3 z" fill={strokeColor} />
        </marker>
        <filter id="glow">
          <feGaussianBlur stdDeviation="2" result="coloredBlur"/>
          <feMerge>
            <feMergeNode in="coloredBlur"/>
            <feMergeNode in="SourceGraphic"/>
          </feMerge>
        </filter>
      </defs>

      <AnimatePresence mode="wait">
        <MotionG
          key={targetKey.code}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
        >
          {/* Background Glow Line (Thicker, Low Opacity) */}
          <line
            x1={coords.start.x}
            y1={coords.start.y}
            x2={coords.end.x}
            y2={coords.end.y}
            stroke={strokeColor}
            strokeWidth="6"
            strokeOpacity="0.15"
            strokeLinecap="round"
          />
          
          {/* Main Animated Path */}
          <MotionLine
            x1={coords.start.x}
            y1={coords.start.y}
            x2={coords.end.x}
            y2={coords.end.y}
            stroke={strokeColor}
            strokeWidth="2.5"
            strokeDasharray="6 4"
            markerEnd={`url(#${markerId})`}
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />

          {/* Start Dot */}
          <circle cx={coords.start.x} cy={coords.start.y} r="3" fill={strokeColor} fillOpacity="0.8" />
        </MotionG>
      </AnimatePresence>
    </svg>
  );
};