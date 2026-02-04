import { FingerName } from '../../../types';

// Maps each finger to its resting "Home Row" physical key code.
export const HOME_KEYS: Record<FingerName, string> = {
  'pinky-left': 'KeyA',
  'ring-left': 'KeyS',
  'middle-left': 'KeyD',
  'index-left': 'KeyF',
  'thumb-left': 'Space',
  
  'thumb-right': 'Space',
  'index-right': 'KeyJ',
  'middle-right': 'KeyK',
  'ring-right': 'KeyL',
  'pinky-right': 'Semicolon', // Standard QWERTY position (variable in ISO, but physical code remains similar)
};