import { QWERTY_LAYOUT } from './qwerty';
import { QWERTZ_LAYOUT } from './qwertz';
import { KeyMap } from '../../../types';

export const layouts: Record<string, KeyMap[]> = {
  qwerty: QWERTY_LAYOUT,
  qwertz: QWERTZ_LAYOUT,
  // placeholders for future implementation
  dvorak: QWERTY_LAYOUT, 
  colemak: QWERTY_LAYOUT
};

export const getLayout = (id: string): KeyMap[] => {
  return layouts[id] || QWERTY_LAYOUT;
};