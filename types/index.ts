export interface UserSettings {
  keyboardLayout: 'qwertz' | 'qwerty' | 'dvorak' | 'colemak';
  showVirtualKeyboard: boolean;
  showHands: boolean;
  difficulty: 'easy' | 'medium' | 'hard' | 'adaptive';
  soundEnabled: boolean;
}

export interface UserStats {
  charsTyped: number;
  timePlayedSeconds: number;
  errorHeatmap: Record<string, number>; // char -> error count
  lessonsCompleted: number;
  averageWpm: number;
}

export interface UserProfile {
  id: string;
  name: string;
  xp: number;
  rank: string; // e.g. "Novice"
  level: number;
  settings: UserSettings;
  stats: UserStats;
  createdAt: number;
  lastActiveAt: number;
}

export interface KeyMap {
  code: string; // Physical key code e.g. "KeyA"
  char: string; // Character produced e.g. "a"
  finger: 'thumb-left' | 'thumb-right' | 'index-left' | 'index-right' | 'middle-left' | 'middle-right' | 'ring-left' | 'ring-right' | 'pinky-left' | 'pinky-right';
  row: 1 | 2 | 3 | 4 | 5; // 1 = number row, 3 = home row
  hand: 'left' | 'right';
}

export interface LevelConfig {
  id: string;
  name: string;
  description: string;
  allowedChars: string[];
  minWordLength: number;
  maxWordLength: number;
  includePunctuation: boolean;
  includeNumbers: boolean;
  durationSeconds?: number; // If time based
  targetTextLength?: number; // If length based
  adaptiveWeight: number; // 0-1
}

export interface GameState {
  isActive: boolean;
  isPaused: boolean;
  isFinished: boolean;
  text: string;
  cursorIndex: number;
  startTime: number | null;
  wpm: number;
  accuracy: number;
  errors: number;
  keystrokeHistory: Array<{char: string, timestamp: number, isCorrect: boolean}>;
}
