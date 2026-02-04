import { Howl } from 'howler';

const SOUNDS = {
  // Howler handles falling back to supported formats if multiple are provided
  // We look for files in the /sounds directory (served from public/sounds)
  click: new Howl({
    src: ['/sounds/click.mp3', '/sounds/click.wav'],
    volume: 0.5,
    preload: true,
    onloaderror: (_id, _err) => {
      // Silently ignore missing files to prevent app crashes
      // console.warn('Audio file not found:', err); 
    }
  }),
  error: new Howl({
    src: ['/sounds/error.mp3', '/sounds/error.wav'],
    volume: 0.5,
    preload: true,
    onloaderror: (_id, _err) => {
      // Silently ignore missing files
    }
  }),
};

export const playSound = (type: 'click' | 'error') => {
  try {
    const sound = SOUNDS[type];
    if (sound && sound.state() === 'loaded') {
      sound.play();
    } else if (sound) {
      // Attempt play even if loading state isn't perfect (Howler handles queueing)
      sound.play();
    }
  } catch (e) {
    // Fail gracefully if audio context is blocked or files missing
  }
};
