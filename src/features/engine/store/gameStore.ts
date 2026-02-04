
import { create } from 'zustand';
import { GameState } from '../../../types';

interface GameStore extends GameState {
  totalTypedChars: number; // New: Tracks total attempts for Gross Accuracy
  // Actions
  startGame: (text: string) => void;
  stopGame: () => void;
  resetGame: () => void;
  handleKeyStroke: (char: string) => void;
  tickTimer: () => void;
}

const INITIAL_STATE: GameState & { totalTypedChars: number } = {
  isActive: false,
  isPaused: false,
  isFinished: false,
  hasStartedTyping: false,
  text: '',
  typedText: '',
  cursorIndex: 0,
  startTime: null,
  elapsedSeconds: 0,
  wpm: 0,
  accuracy: 100,
  errors: 0,
  totalTypedChars: 0,
  keystrokeHistory: [],
};

export const useGameStore = create<GameStore>((set, get) => ({
  ...INITIAL_STATE,

  startGame: (text) => set({ 
    ...INITIAL_STATE, 
    isActive: true, 
    text, 
    typedText: '',
    startTime: null, // Wait for first key
    hasStartedTyping: false,
    elapsedSeconds: 0
  }),

  // Abort/Quit Game:
  stopGame: () => set({ isActive: false, isFinished: false }),
  
  resetGame: () => set({ ...INITIAL_STATE }),

  tickTimer: () => {
    const { startTime, typedText, isActive, hasStartedTyping } = get();
    
    // Only tick if game is active AND user has started typing
    if (!isActive || !hasStartedTyping || !startTime) return;

    const now = Date.now();
    const elapsedSeconds = Math.floor((now - startTime) / 1000);
    const elapsedMinutes = (now - startTime) / 1000 / 60;
    
    if (elapsedMinutes <= 0) return;

    // Standard WPM calculation: (all typed characters / 5) / time in minutes
    const wpm = Math.round((typedText.length / 5) / elapsedMinutes);
    
    set({ wpm, elapsedSeconds });
  },

  handleKeyStroke: (inputKey) => {
    let { 
      text, 
      typedText, 
      keystrokeHistory, 
      isActive, 
      isPaused, 
      isFinished, 
      errors, 
      totalTypedChars,
      hasStartedTyping, 
      startTime 
    } = get();
    
    if (!isActive || isPaused || isFinished) return;
    
    const now = Date.now();

    // --- First Keystroke Logic ---
    if (!hasStartedTyping) {
      startTime = now;
      hasStartedTyping = true;
      set({ startTime, hasStartedTyping });
    }

    let newTypedText = typedText;
    let newHistory = [...keystrokeHistory];
    let newErrors = errors;
    let newTotalChars = totalTypedChars;
    
    const timestamp = now;
    let expectedChar = '';
    let isCorrect = false;

    // Handle Backspace
    if (inputKey === 'Backspace') {
      newTypedText = typedText.slice(0, -1);
      // We don't log backspaces in history for heatmap purposes
      // We don't increment totalTypedChars for backspace (usually)
    } 
    // Handle Character Input
    else if (inputKey.length === 1) {
      newTotalChars++; // Increment total attempts

      if (typedText.length < text.length) {
        expectedChar = text[typedText.length];
        isCorrect = inputKey === expectedChar;
        
        if (!isCorrect) {
          const nextChar = text[typedText.length + 1];
          const prevChar = text[typedText.length - 1]; 
          const lastLog = newHistory[newHistory.length - 1];

          // 1. LOOKAHEAD: Missed Space / Skipped Char
          if (expectedChar === ' ' && inputKey === nextChar) {
            // Assume missed space
            newErrors++; // Penalize for missed space
            
            const skippedChar = '_'; 
            newHistory.push({
               char: 'MISSING_SPACE',
               expected: ' ',
               timestamp,
               isCorrect: false
            });

            newTypedText = typedText + skippedChar + inputKey;
            
            newHistory.push({
               char: inputKey,
               expected: nextChar,
               timestamp,
               isCorrect: true
            });
          } 
          // 2. LOOKBEHIND: Extra Char / Insertion Fix
          // If input matches the PREVIOUS target, and the PREVIOUS typed char was an error
          else if (typedText.length > 0 && inputKey === prevChar && lastLog && !lastLog.isCorrect) {
             // Retroactive Fix:
             // We replace the text to align it visually.
             newTypedText = typedText.slice(0, -1) + inputKey;
             
             // Update history for visual/ghost consistency
             newHistory[newHistory.length - 1] = {
                 char: inputKey,
                 expected: prevChar,
                 timestamp,
                 isCorrect: true
             };
             
             // CRITICAL: We do NOT decrement newErrors. 
             // The previous keypress was an error, and it stays an error in the stats.
             // This enforces "Gross Accuracy".
          }
          else {
             // 3. Standard Error
             newErrors++;
             newTypedText = typedText + inputKey;
             newHistory.push({ 
                char: inputKey, 
                expected: expectedChar, 
                timestamp, 
                isCorrect: false 
             });
          }
        } else {
           // Standard Success
           newTypedText = typedText + inputKey;
           newHistory.push({ 
              char: inputKey, 
              expected: expectedChar, 
              timestamp, 
              isCorrect: true 
           });
        }
      }
    } else {
      return;
    }

    // Calculate Accuracy (Gross Accuracy)
    // Formula: (TotalAttempts - TotalErrors) / TotalAttempts
    const accuracy = newTotalChars === 0 
      ? 100 
      : Math.max(0, Math.round(((newTotalChars - newErrors) / newTotalChars) * 100));

    // Check Finish Condition
    const isNowFinished = newTypedText.length === text.length;

    set({
      typedText: newTypedText,
      cursorIndex: newTypedText.length,
      errors: newErrors,
      totalTypedChars: newTotalChars,
      accuracy,
      isFinished: isNowFinished,
      isActive: !isNowFinished,
      keystrokeHistory: newHistory
    });
  }
}));
