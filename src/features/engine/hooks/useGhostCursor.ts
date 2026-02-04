import { useState, useEffect, useRef } from 'react';
import { ReplayEvent } from '../../../types';

export const useGhostCursor = (
  replayData: ReplayEvent[] | undefined,
  startTime: number | null,
  isActive: boolean,
  isPaused: boolean
) => {
  const [ghostIndex, setGhostIndex] = useState(0);
  const requestRef = useRef<number | null>(null);

  useEffect(() => {
    if (!replayData || replayData.length === 0 || !startTime || !isActive || isPaused) {
      setGhostIndex(0);
      return;
    }

    const animate = () => {
      const elapsed = Date.now() - startTime;
      
      // Find the last event that happened before or at the current elapsed time
      // Since replayData is sorted by time, we can filter or search efficiently.
      // For short arrays, filtering length is fine.
      
      let index = 0;
      for (let i = 0; i < replayData.length; i++) {
        if (replayData[i].time <= elapsed) {
          index = i + 1; // Cursor is after the character
        } else {
          break; // Optimization: replayData is sorted
        }
      }
      
      setGhostIndex(index);
      requestRef.current = requestAnimationFrame(animate);
    };

    requestRef.current = requestAnimationFrame(animate);

    return () => {
      if (requestRef.current) cancelAnimationFrame(requestRef.current);
    };
  }, [replayData, startTime, isActive, isPaused]);

  return ghostIndex;
};