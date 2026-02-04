import React, { useEffect, useState, useRef } from 'react';
import { getLayout } from '../layouts';
import { Key } from './Key';
import { FingerPath } from './FingerPath';
import { useProfileStore } from '../../profile/store/profileStore';
import { KeyMap } from '../../../types';

interface VirtualKeyboardProps {
  targetCharacter: string;
}

export const VirtualKeyboard: React.FC<VirtualKeyboardProps> = ({ targetCharacter }) => {
  const { activeProfileId, profiles } = useProfileStore();
  const profile = activeProfileId ? profiles[activeProfileId] : null;
  const layoutId = profile?.settings?.keyboardLayout || 'qwerty';
  const showVirtualKeyboard = profile?.settings?.showVirtualKeyboard ?? true;
  const showHands = profile?.settings?.showHands ?? true;

  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set());
  const [layout, setLayout] = useState<KeyMap[]>([]);
  
  // Refs for calculating finger path coordinates
  const containerRef = useRef<HTMLDivElement>(null);
  const keyRefs = useRef<Map<string, HTMLDivElement>>(new Map());

  // Force re-render to update SVG coordinates when layout is fully mounted
  const [, setMounted] = useState(false);

  useEffect(() => {
    setLayout(getLayout(layoutId));
    setMounted(true);
  }, [layoutId]);

  // Track physical key presses
  useEffect(() => {
    const handleDown = (e: KeyboardEvent) => {
      setPressedKeys(prev => new Set(prev).add(e.code));
    };
    
    const handleUp = (e: KeyboardEvent) => {
      setPressedKeys(prev => {
        const next = new Set(prev);
        next.delete(e.code);
        return next;
      });
    };

    window.addEventListener('keydown', handleDown);
    window.addEventListener('keyup', handleUp);
    return () => {
      window.removeEventListener('keydown', handleDown);
      window.removeEventListener('keyup', handleUp);
    };
  }, []);

  if (!showVirtualKeyboard) return null;

  // Determine Target Key
  // Note: We search case-insensitive for letters, but sensitive for symbols if possible
  const targetKey = layout.find(k => {
    if (k.char === targetCharacter) return true;
    if (k.char.toLowerCase() === targetCharacter.toLowerCase()) return true;
    return false;
  });
  
  // Group by row
  const rows: Record<number, KeyMap[]> = {};
  layout.forEach(key => {
    if (!rows[key.row]) rows[key.row] = [];
    rows[key.row].push(key);
  });

  return (
    <div 
      ref={containerRef}
      className="relative w-full max-w-5xl mx-auto p-2 bg-slate-900/50 rounded-xl border border-slate-800 shadow-2xl"
    >
      {/* Finger Motion Path Overlay */}
      {showHands && (
        <FingerPath 
          targetKey={targetKey} 
          keyElements={keyRefs.current} 
          containerElement={containerRef.current} 
        />
      )}

      <div className="flex flex-col gap-1 md:gap-2 relative z-10">
        {[1, 2, 3, 4, 5].map(rowNum => (
          <div key={rowNum} className="flex w-full justify-center">
            {rows[rowNum]?.map(keyData => (
              <Key
                key={keyData.code}
                ref={(el) => {
                  if (el) keyRefs.current.set(keyData.code, el);
                  else keyRefs.current.delete(keyData.code);
                }}
                data={keyData}
                isPressed={pressedKeys.has(keyData.code)}
                isActive={targetKey?.code === keyData.code}
                showFingerHint={showHands}
              />
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};