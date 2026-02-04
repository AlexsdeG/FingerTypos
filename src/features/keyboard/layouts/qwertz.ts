import { KeyMap } from '../../../types';

export const QWERTZ_LAYOUT: KeyMap[] = [
  // Row 1 (Numbers)
  { code: 'Backquote', char: '^', finger: 'pinky-left', row: 1, hand: 'left' },
  { code: 'Digit1', char: '1', finger: 'pinky-left', row: 1, hand: 'left' },
  { code: 'Digit2', char: '2', finger: 'ring-left', row: 1, hand: 'left' },
  { code: 'Digit3', char: '3', finger: 'middle-left', row: 1, hand: 'left' },
  { code: 'Digit4', char: '4', finger: 'index-left', row: 1, hand: 'left' },
  { code: 'Digit5', char: '5', finger: 'index-left', row: 1, hand: 'left' },
  { code: 'Digit6', char: '6', finger: 'index-right', row: 1, hand: 'right' },
  { code: 'Digit7', char: '7', finger: 'index-right', row: 1, hand: 'right' },
  { code: 'Digit8', char: '8', finger: 'middle-right', row: 1, hand: 'right' },
  { code: 'Digit9', char: '9', finger: 'ring-right', row: 1, hand: 'right' },
  { code: 'Digit0', char: '0', finger: 'pinky-right', row: 1, hand: 'right' },
  { code: 'Minus', char: 'ß', finger: 'pinky-right', row: 1, hand: 'right' },
  { code: 'Equal', char: '´', finger: 'pinky-right', row: 1, hand: 'right' },
  { code: 'Backspace', char: 'Backspace', label: '⌫', width: 2, row: 1, hand: 'right', style: 'special' },

  // Row 2 (Top)
  { code: 'Tab', char: 'Tab', width: 1.5, row: 2, hand: 'left', style: 'special' },
  { code: 'KeyQ', char: 'q', finger: 'pinky-left', row: 2, hand: 'left' },
  { code: 'KeyW', char: 'w', finger: 'ring-left', row: 2, hand: 'left' },
  { code: 'KeyE', char: 'e', finger: 'middle-left', row: 2, hand: 'left' },
  { code: 'KeyR', char: 'r', finger: 'index-left', row: 2, hand: 'left' },
  { code: 'KeyT', char: 't', finger: 'index-left', row: 2, hand: 'left' },
  { code: 'KeyY', char: 'z', finger: 'index-right', row: 2, hand: 'right' }, // Z is here
  { code: 'KeyU', char: 'u', finger: 'index-right', row: 2, hand: 'right' },
  { code: 'KeyI', char: 'i', finger: 'middle-right', row: 2, hand: 'right' },
  { code: 'KeyO', char: 'o', finger: 'ring-right', row: 2, hand: 'right' },
  { code: 'KeyP', char: 'p', finger: 'pinky-right', row: 2, hand: 'right' },
  { code: 'BracketLeft', char: 'ü', finger: 'pinky-right', row: 2, hand: 'right' },
  { code: 'BracketRight', char: '+', finger: 'pinky-right', row: 2, hand: 'right' },
  { code: 'Backslash', char: '#', width: 1.5, finger: 'pinky-right', row: 2, hand: 'right' }, // Often varies on physical ISO keyboards

  // Row 3 (Home)
  { code: 'CapsLock', char: 'Caps', width: 1.75, row: 3, hand: 'left', style: 'special' },
  { code: 'KeyA', char: 'a', finger: 'pinky-left', row: 3, hand: 'left' },
  { code: 'KeyS', char: 's', finger: 'ring-left', row: 3, hand: 'left' },
  { code: 'KeyD', char: 'd', finger: 'middle-left', row: 3, hand: 'left' },
  { code: 'KeyF', char: 'f', finger: 'index-left', row: 3, hand: 'left' },
  { code: 'KeyG', char: 'g', finger: 'index-left', row: 3, hand: 'left' },
  { code: 'KeyH', char: 'h', finger: 'index-right', row: 3, hand: 'right' },
  { code: 'KeyJ', char: 'j', finger: 'index-right', row: 3, hand: 'right' },
  { code: 'KeyK', char: 'k', finger: 'middle-right', row: 3, hand: 'right' },
  { code: 'KeyL', char: 'l', finger: 'ring-right', row: 3, hand: 'right' },
  { code: 'Semicolon', char: 'ö', finger: 'pinky-right', row: 3, hand: 'right' },
  { code: 'Quote', char: 'ä', finger: 'pinky-right', row: 3, hand: 'right' },
  { code: 'Enter', char: 'Enter', label: 'Enter', width: 2.25, row: 3, hand: 'right', style: 'special' },

  // Row 4 (Bottom)
  { code: 'ShiftLeft', char: 'Shift', width: 2.25, row: 4, hand: 'left', style: 'special' },
  { code: 'IntlBackslash', char: '<', finger: 'pinky-left', row: 4, hand: 'left' }, // Common on ISO
  { code: 'KeyZ', char: 'y', finger: 'pinky-left', row: 4, hand: 'left' }, // Y is here
  { code: 'KeyX', char: 'x', finger: 'ring-left', row: 4, hand: 'left' },
  { code: 'KeyC', char: 'c', finger: 'middle-left', row: 4, hand: 'left' },
  { code: 'KeyV', char: 'v', finger: 'index-left', row: 4, hand: 'left' },
  { code: 'KeyB', char: 'b', finger: 'index-left', row: 4, hand: 'left' },
  { code: 'KeyN', char: 'n', finger: 'index-right', row: 4, hand: 'right' },
  { code: 'KeyM', char: 'm', finger: 'index-right', row: 4, hand: 'right' },
  { code: 'Comma', char: ',', finger: 'middle-right', row: 4, hand: 'right' },
  { code: 'Period', char: '.', finger: 'ring-right', row: 4, hand: 'right' },
  { code: 'Slash', char: '-', finger: 'pinky-right', row: 4, hand: 'right' },
  { code: 'ShiftRight', char: 'Shift', width: 1.75, row: 4, hand: 'right', style: 'special' },

  // Row 5 (Space)
  { code: 'ControlLeft', char: 'Strg', width: 1.5, row: 5, hand: 'left', style: 'special' },
  { code: 'MetaLeft', char: 'Win', width: 1.25, row: 5, hand: 'left', style: 'special' },
  { code: 'AltLeft', char: 'Alt', width: 1.25, row: 5, hand: 'left', style: 'special' },
  { code: 'Space', char: ' ', width: 6.25, finger: 'thumb-right', row: 5, hand: 'right' },
  { code: 'AltRight', char: 'Alt Gr', width: 1.25, row: 5, hand: 'right', style: 'special' },
  { code: 'MetaRight', char: 'Win', width: 1.25, row: 5, hand: 'right', style: 'special' },
  { code: 'ContextMenu', char: 'Menu', width: 1.25, row: 5, hand: 'right', style: 'special' },
  { code: 'ControlRight', char: 'Strg', width: 1.5, row: 5, hand: 'right', style: 'special' },
];