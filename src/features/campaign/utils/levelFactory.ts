
import { LevelConfig, KeyMap } from '../../../types';
import { getLayout } from '../../keyboard/layouts';

// Helper to extract chars from layout based on filters
const getChars = (layout: KeyMap[], filter: (k: KeyMap) => boolean): string[] => {
  const charSet = new Set(
    layout
      .filter(k => k.char.length === 1 && filter(k)) 
      .map(k => k.char)
  );
  return Array.from(charSet);
};

export const getCampaignLevels = (layoutId: string): LevelConfig[] => {
  const layout = getLayout(layoutId);

  // Define Tiers
  // Tier 1: Home Row Basics (Rank 1+) - CHAR mode
  // Tier 2: Top Row (Rank 3+) - CHAR mode
  // Tier 3: Bottom Row (Rank 5+) - CHAR/WORDS mode
  // Tier 4: Capitalization & Punctuation (Rank 10+) - WORDS mode
  // Tier 5: Mastery (Rank 15+) - SENTENCE mode
  
  const levels: LevelConfig[] = [
    // --- TIER 1: HOME ROW (Chars) ---
    {
      id: 'c-1-1',
      tier: 1,
      tierName: 'Foundation',
      requiredLevel: 1,
      name: 'Index Fingers',
      description: 'Start your journey with the anchors: F and J.',
      allowedChars: getChars(layout, k => k.row === 3 && (k.finger === 'index-left' || k.finger === 'index-right')),
      minWordLength: 2,
      maxWordLength: 4,
      targetTextLength: 60,
      includePunctuation: false,
      includeNumbers: false,
      adaptiveWeight: 0.5,
      generationMode: 'chars'
    },
    {
      id: 'c-1-2',
      tier: 1,
      tierName: 'Foundation',
      requiredLevel: 1,
      name: 'Middle Fingers',
      description: 'Adding D and K to the mix.',
      allowedChars: getChars(layout, k => k.row === 3 && (k.finger === 'index-left' || k.finger === 'index-right' || k.finger === 'middle-left' || k.finger === 'middle-right')),
      minWordLength: 3,
      maxWordLength: 5,
      targetTextLength: 80,
      includePunctuation: false,
      includeNumbers: false,
      adaptiveWeight: 0.6,
      generationMode: 'chars'
    },
    {
      id: 'c-1-3',
      tier: 1,
      tierName: 'Foundation',
      requiredLevel: 1,
      name: 'Ring & Pinky',
      description: 'Complete the Home Row.',
      allowedChars: getChars(layout, k => k.row === 3), 
      minWordLength: 3,
      maxWordLength: 6,
      targetTextLength: 100,
      includePunctuation: false,
      includeNumbers: false,
      adaptiveWeight: 0.7,
      generationMode: 'chars'
    },

    // --- TIER 2: TOP ROW (Chars) ---
    {
      id: 'c-2-1',
      tier: 2,
      tierName: 'Reaching Up',
      requiredLevel: 3, 
      name: 'Top Row Index',
      description: 'Stretching up to R, T, Y, U.',
      allowedChars: getChars(layout, k => (k.row === 3 || k.row === 2) && (k.finger === 'index-left' || k.finger === 'index-right')),
      minWordLength: 3,
      maxWordLength: 5,
      targetTextLength: 100,
      includePunctuation: false,
      includeNumbers: false,
      adaptiveWeight: 0.7,
      generationMode: 'chars'
    },
    {
      id: 'c-2-2',
      tier: 2,
      tierName: 'Reaching Up',
      requiredLevel: 3,
      name: 'Full Top Row',
      description: 'Mastering the upper deck.',
      allowedChars: getChars(layout, k => k.row === 2 || k.row === 3),
      minWordLength: 3,
      maxWordLength: 7,
      targetTextLength: 120,
      includePunctuation: false,
      includeNumbers: false,
      adaptiveWeight: 0.8,
      generationMode: 'chars'
    },

    // --- TIER 3: BOTTOM ROW (Chars/Mixed) ---
    {
      id: 'c-3-1',
      tier: 3,
      tierName: 'The Basement',
      requiredLevel: 5, 
      name: 'Bottom Row Index',
      description: 'Folding down to V, B, N, M.',
      allowedChars: getChars(layout, k => (k.row === 3 || k.row === 4) && (k.finger === 'index-left' || k.finger === 'index-right')),
      minWordLength: 3,
      maxWordLength: 5,
      targetTextLength: 100,
      includePunctuation: false,
      includeNumbers: false,
      adaptiveWeight: 0.7,
      generationMode: 'chars'
    },
    {
      id: 'c-3-2',
      tier: 3,
      tierName: 'The Basement',
      requiredLevel: 5,
      name: 'Full Alphabet',
      description: 'All letters combined. The ultimate test.',
      allowedChars: getChars(layout, k => k.row >= 2 && k.row <= 4),
      minWordLength: 4,
      maxWordLength: 8,
      targetTextLength: 150,
      includePunctuation: false,
      includeNumbers: false,
      adaptiveWeight: 0.8,
      generationMode: 'words' // Switch to words now that we have all letters
    },

    // --- TIER 4: REAL WORLD (Words/Punct) ---
    {
      id: 'c-4-1',
      tier: 4,
      tierName: 'Real World',
      requiredLevel: 8,
      name: 'Capitalization',
      description: 'Using Shift to capitalize names and starts of sentences.',
      allowedChars: getChars(layout, k => k.row >= 2 && k.row <= 4),
      minWordLength: 4,
      maxWordLength: 8,
      targetTextLength: 150,
      includePunctuation: false,
      includeNumbers: false,
      adaptiveWeight: 0.5,
      generationMode: 'mixed' // Mixed will inject capitals
    },
    {
      id: 'c-4-2',
      tier: 4,
      tierName: 'Real World',
      requiredLevel: 8,
      name: 'Punctuation Basics',
      description: 'Periods, commas, and questions.',
      allowedChars: getChars(layout, k => k.row >= 2 && k.row <= 4),
      minWordLength: 5,
      maxWordLength: 10,
      targetTextLength: 180,
      includePunctuation: true,
      includeNumbers: false,
      adaptiveWeight: 0.6,
      generationMode: 'mixed'
    },

    // --- TIER 5: MASTERY (Sentences) ---
    {
        id: 'c-5-1',
        tier: 5,
        tierName: 'Mastery',
        requiredLevel: 12,
        name: 'Full Sentences',
        description: 'Type meaningful, complex sentences.',
        allowedChars: getChars(layout, k => k.row >= 1 && k.row <= 4),
        minWordLength: 2,
        maxWordLength: 15,
        targetTextLength: 250,
        includePunctuation: true,
        includeNumbers: false,
        adaptiveWeight: 0,
        generationMode: 'sentence'
      },
  ];

  return levels;
};

export const getTrainingLevels = (layoutId: string): LevelConfig[] => {
  const layout = getLayout(layoutId);
  const allChars = getChars(layout, k => k.row >= 2 && k.row <= 4);

  return [
    {
      id: 'train-easy',
      name: 'Easy',
      description: 'Common English words. Lowercase only. No punctuation.',
      allowedChars: allChars,
      minWordLength: 3,
      maxWordLength: 6,
      includePunctuation: false,
      includeNumbers: false,
      targetTextLength: 120,
      adaptiveWeight: 0.2,
      generationMode: 'words'
    },
    {
      id: 'train-medium',
      name: 'Medium',
      description: 'Complex words with mixed capitalization.',
      allowedChars: allChars,
      minWordLength: 5,
      maxWordLength: 10,
      includePunctuation: false, // Mixed mode will handle capitalization
      includeNumbers: false,
      targetTextLength: 200,
      adaptiveWeight: 0.5,
      generationMode: 'mixed'
    },
    {
      id: 'train-hard',
      name: 'Hard',
      description: 'Full sentences with punctuation.',
      allowedChars: allChars,
      minWordLength: 6,
      maxWordLength: 12,
      includePunctuation: true,
      includeNumbers: false,
      targetTextLength: 250,
      adaptiveWeight: 0.8,
      generationMode: 'sentence'
    },
    {
      id: 'train-elite',
      name: 'Elite',
      description: 'Complex strings with numbers, symbols, and leet speak. Good luck.',
      allowedChars: getChars(layout, k => k.row >= 1 && k.row <= 4),
      minWordLength: 8,
      maxWordLength: 15,
      includePunctuation: true,
      includeNumbers: true,
      targetTextLength: 300,
      adaptiveWeight: 1.0,
      generationMode: 'mixed'
    },
    // New Alternative Modes
    {
      id: 'train-numbers',
      name: 'Numbers',
      description: 'Pure numeric data entry practice. Random groups of digits.',
      allowedChars: getChars(layout, k => k.row === 1),
      minWordLength: 2,
      maxWordLength: 6,
      includePunctuation: false,
      includeNumbers: true,
      targetTextLength: 100,
      adaptiveWeight: 0,
      generationMode: 'numbers'
    },
    {
      id: 'train-code',
      name: 'Code Syntax',
      description: 'JavaScript/React snippets with brackets, indentation, and keywords.',
      allowedChars: getChars(layout, k => k.row >= 1 && k.row <= 4),
      minWordLength: 2,
      maxWordLength: 10,
      includePunctuation: true,
      includeNumbers: true,
      targetTextLength: 250,
      adaptiveWeight: 0,
      generationMode: 'code'
    },
    {
      id: 'train-boss',
      name: 'Boss Rush',
      description: 'Defeat the Glitch Monster! Type fast to deal damage. Speed is your weapon.',
      allowedChars: allChars,
      minWordLength: 5,
      maxWordLength: 10,
      includePunctuation: true,
      includeNumbers: false,
      targetTextLength: 200,
      adaptiveWeight: 0,
      generationMode: 'words',
      isBoss: true
    }
  ];
};
