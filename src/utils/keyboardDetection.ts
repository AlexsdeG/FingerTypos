
/**
 * Attempts to detect the user's physical keyboard layout using the Keyboard Map API.
 * Currently distinguishes between QWERTY and QWERTZ based on the Y and Z keys.
 */
export const detectKeyboardLayout = async (): Promise<'qwerty' | 'qwertz' | null> => {
  if (typeof navigator === 'undefined') return null;
  
  // Check if API is supported
  // @ts-ignore - The API is experimental in some contexts
  if (!navigator.keyboard || !navigator.keyboard.getLayoutMap) {
    return null;
  }

  try {
    // @ts-ignore
    const keyboardMap = await navigator.keyboard.getLayoutMap();
    
    // In QWERTY: KeyZ -> z, KeyY -> y
    // In QWERTZ: KeyZ -> y, KeyY -> z
    const zValue = keyboardMap.get('KeyZ');
    const yValue = keyboardMap.get('KeyY');

    if (zValue === 'y' && yValue === 'z') {
      return 'qwertz';
    }
    
    // Default assumption if not QWERTZ (could expand logic for AZERTY etc later)
    return 'qwerty';
  } catch (error) {
    console.warn('Keyboard layout detection failed:', error);
    return null;
  }
};
