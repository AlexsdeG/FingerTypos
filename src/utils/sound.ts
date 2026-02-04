import { Howl } from 'howler';

const SOUNDS = {
  // Howler handles falling back to supported formats if multiple are provided
  // We look for files in the /sounds directory (served from public/sounds)
  click: new Howl({
    src: ['/sounds/click.wav', '/sounds/click.mp3'],
    format: ['wav', 'mp3'],
    volume: 0.5,
    preload: true,
    html5: true,
    onloaderror: (id, err) => {
      console.warn(`Audio load error [click] (ID: ${id}):`, err);
    }
  }),
  error: new Howl({
    src: ['/sounds/error.wav', '/sounds/error.mp3'],
    format: ['wav', 'mp3'],
    volume: 0.5,
    preload: true,
    html5: true,
    onloaderror: (id, err) => {
      console.warn(`Audio load error [error] (ID: ${id}):`, err);
    }
  }),
  applause: new Howl({
    src: ['/sounds/applause.wav', '/sounds/applause.mp3'],
    format: ['wav', 'mp3'],
    volume: 0.6,
    preload: true,
    html5: true,
    onloaderror: (id, err) => {
      console.warn(`Audio load error [applause] (ID: ${id}):`, err);
    }
  }),
};

export const playSound = (type: 'click' | 'error' | 'applause') => {
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
