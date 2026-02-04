
import { useEffect, useCallback } from 'react';
import { useGameStore } from '../store/gameStore';
import { useProfileStore } from '../../profile/store/profileStore';
import { playSound } from '../../../utils/sound';

export const useTypingEngine = () => {
  const state = useGameStore();
  const { activeProfileId, profiles } = useProfileStore();

  // Get Sound Settings
  const profile = activeProfileId ? profiles[activeProfileId] : null;
  const soundEnabled = profile?.settings.soundEnabled ?? true;

  const {
    isActive,
    isPaused,
    isFinished,
    text,
    cursorIndex,
    handleKeyStroke,
    tickTimer,
    startGame,
    stopGame,
    resetGame
  } = state;

  // Timer Loop: Updates WPM every second
  useEffect(() => {
    let interval: number;
    if (isActive && !isPaused && !isFinished) {
      interval = window.setInterval(() => {
        tickTimer();
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isActive, isPaused, isFinished, tickTimer]);

  // Key Handler
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!isActive || isPaused || isFinished) return;

    // Ignore modifier keys and specific control keys
    if (e.ctrlKey || e.altKey || e.metaKey) return;
    if (['Shift', 'CapsLock', 'Tab', 'Escape', 'Control', 'Alt'].includes(e.key)) return;

    // Prevent default scrolling for Space
    if (e.code === 'Space') {
      e.preventDefault();
    }

    // Prevent Quick Find on Firefox (/)
    if (e.key === '/') {
      e.preventDefault();
    }

    // Handle Backspace
    if (e.key === 'Backspace') {
      handleKeyStroke('Backspace');
      return;
    }

    // Determine Input Char
    let inputChar = e.key;
    if (e.key === 'Enter') {
      inputChar = '\n';
    }

    // Sound Logic: Check correctness before updating state
    // Compare input key against the *target* at the current index
    const expectedChar = text[cursorIndex];
    const isCorrect = inputChar === expectedChar;

    if (soundEnabled) {
      playSound(isCorrect ? 'click' : 'error');
    }

    // Pass the actual char string to the store
    handleKeyStroke(inputChar);

  }, [isActive, isPaused, isFinished, text, cursorIndex, handleKeyStroke, soundEnabled]);

  // Attach Listener
  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleKeyDown]);

  // Derived state helper
  const currentCharacter = text[cursorIndex] || '';
  const nextCharacter = text[cursorIndex + 1] || '';

  return {
    ...state,
    currentCharacter,
    nextCharacter,
    startGame,
    stopGame,
    resetGame
  };
};
