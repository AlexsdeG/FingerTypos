
import { LevelConfig, UserStats } from '../../../types';
import { COMMON_WORDS, COMPLEX_WORDS, SENTENCES, CODE_SNIPPETS, ELITE_PATTERNS, NAMES } from './dictionaries';

/**
 * Generates a practice lesson based on configuration.
 * Supports multiple modes: 'chars', 'words', 'mixed', 'sentence', 'code', 'numbers'.
 * Accepts an optional lengthModifier ('short', 'medium', 'long').
 */
export const generateLesson = (config: LevelConfig, stats: UserStats, lengthModifier?: 'short' | 'medium' | 'long'): string => {
  const {
    allowedChars,
    minWordLength,
    maxWordLength,
    targetTextLength: baseLength = 100,
    includePunctuation,
    includeNumbers,
    generationMode = 'chars'
  } = config;

  // Calculate actual target length based on modifier
  let targetTextLength = baseLength;
  if (lengthModifier === 'short') targetTextLength = Math.max(20, Math.floor(baseLength * 0.5));
  if (lengthModifier === 'long') targetTextLength = Math.floor(baseLength * 2.0);

  // MODE: CODE
  if (generationMode === 'code') {
    let result = "";
    while (result.length < targetTextLength) {
      const snippet = CODE_SNIPPETS[Math.floor(Math.random() * CODE_SNIPPETS.length)];
      result += (result ? "\n" : "") + snippet;
    }
    return result.slice(0, targetTextLength + 50);
  }

  // MODE: NUMBERS
  if (generationMode === 'numbers') {
    let result = "";
    while (result.length < targetTextLength) {
      // Generate group of random digits (2 to 6 length)
      const len = Math.floor(Math.random() * 5) + 2;
      let group = "";
      for (let i = 0; i < len; i++) {
        group += Math.floor(Math.random() * 10);
      }
      result += (result ? " " : "") + group;
    }
    return result;
  }

  // MODE: SENTENCE
  if (generationMode === 'sentence') {
    const sentences = [...SENTENCES];
    let result = "";
    let lastSentence = "";

    while (result.length < targetTextLength) {
      let sentence = sentences[Math.floor(Math.random() * sentences.length)];

      // Prevent immediate repeat
      if (sentence === lastSentence) {
        // Try one more time to get a different one
        sentence = sentences[Math.floor(Math.random() * sentences.length)];
      }
      lastSentence = sentence;

      // 30% chance of Newline instead of Space for multi-line practice in sentence mode
      const separator = (result.length > 0 && Math.random() > 0.8) ? "\n" : " ";
      result += (result ? separator : "") + sentence;
    }
    return result.slice(0, targetTextLength + 50);
  }

  // PREPARE DICTIONARIES FOR WORD MODES
  const allowedSet = new Set(allowedChars.map(c => c.toLowerCase()));

  const filterWords = (list: string[]) => {
    if (allowedChars.length > 24) return list; // Assume full alphabet if many chars

    return list.filter(word =>
      word.split('').every(c => allowedSet.has(c.toLowerCase())) &&
      word.length >= minWordLength &&
      word.length <= maxWordLength
    );
  };

  // MODE: WORDS or MIXED
  if (generationMode === 'words' || generationMode === 'mixed') {
    let wordPool = filterWords([...COMMON_WORDS]);

    if (generationMode === 'mixed') {
      wordPool = [...wordPool, ...filterWords(COMPLEX_WORDS)];
    }

    if (wordPool.length === 0) {
      return generateCharBasedLesson(config, stats, targetTextLength);
    }

    const words: string[] = [];
    let currentLength = 0;
    let lastWord = "";

    while (currentLength < targetTextLength) {
      let word = "";

      // Elite / Mixed Logic
      if (generationMode === 'mixed' && includeNumbers && includePunctuation && Math.random() > 0.7) {
        // Use a special elite pattern 30% of time in elite mode
        word = ELITE_PATTERNS[Math.floor(Math.random() * ELITE_PATTERNS.length)];
      } else {
        word = wordPool[Math.floor(Math.random() * wordPool.length)];

        // Prevent duplicates
        if (word === lastWord) continue;
      }

      lastWord = word;

      if (generationMode === 'mixed') {
        // Transformations (Caps, Numbers, Punctuation)

        // Context aware replacements
        if (includeNumbers) {
          if (word === "for") word = "4";
          else if (word === "to") word = "2";
          else if (word === "you") word = "u";
          else if (word === "are") word = "r";
          else if (word === "at") word = "@";
          else if (word === "and") word = "&";
        }

        // Capitalization: Start of "sentence" (simulation) or Names
        const isStart = words.length === 0 || words[words.length - 1].endsWith('.');
        if (isStart || Math.random() > 0.8) {
          word = word.charAt(0).toUpperCase() + word.slice(1);
        }

        // Insert Names
        if (!includeNumbers && Math.random() > 0.9) {
          word = NAMES[Math.floor(Math.random() * NAMES.length)];
        }

        // Punctuation
        if (includePunctuation && Math.random() > 0.85) {
          const puncts = ['.', ',', '!', '?', ';', ':', '"'];
          const p = puncts[Math.floor(Math.random() * puncts.length)];

          if (p === '"') word = `"${word}"`;
          else word = word + p;
        }

        // Leet Speak / Symbols
        if (includeNumbers && includePunctuation && Math.random() > 0.85) {
          if (word.includes('a')) word = word.replace('a', '4');
          if (word.includes('e')) word = word.replace('e', '3');
          if (word.includes('l')) word = word.replace('l', '1');
          if (word.includes('s')) word = word.replace('s', '$');
        }
      }

      words.push(word);
      currentLength += word.length + 1;
    }

    // In Mixed/Elite mode, insert newlines occasionally
    if (generationMode === 'mixed' && includePunctuation && includeNumbers) {
      return words.reduce((acc, curr, idx) => {
        // 10% chance of newline
        const separator = (idx > 0 && Math.random() > 0.9) ? "\n" : " ";
        return acc + separator + curr;
      });
    }

    return words.join(' ');
  }

  return generateCharBasedLesson(config, stats, targetTextLength);
};

const generateCharBasedLesson = (config: LevelConfig, stats: UserStats, targetTextLength: number): string => {
  const { allowedChars, minWordLength, maxWordLength, adaptiveWeight } = config;
  const validChars = allowedChars.filter(c => c !== ' ');
  const charPool: string[] = [];

  validChars.forEach(char => {
    charPool.push(char);
    const errorCount = stats.errorHeatmap[char] || 0;
    if (errorCount > 0 && adaptiveWeight > 0) {
      const extraCopies = Math.min(Math.floor(errorCount * adaptiveWeight), 10);
      for (let i = 0; i < extraCopies; i++) charPool.push(char);
    }
  });

  if (charPool.length === 0) return "Error: No allowed characters.";
  const getChar = () => charPool[Math.floor(Math.random() * charPool.length)];

  const words: string[] = [];
  let currentLength = 0;

  while (currentLength < targetTextLength) {
    const wordLength = Math.floor(Math.random() * (maxWordLength - minWordLength + 1)) + minWordLength;
    let word = '';
    for (let i = 0; i < wordLength; i++) word += getChar();
    words.push(word);
    currentLength += wordLength + 1;
  }
  return words.join(' ').trim();
}
