'use client';
import { useRef } from 'react';

// Base path for GitHub Pages deployment
const BASE_PATH = `/assets/sounds/`;

// Helper to check sound setting
const isSoundEnabled = () => {
  return localStorage.getItem('sound') !== 'off';
};

// Sound functions
export const playCelebrationSound = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}tada.mp3`);
  audio.play();
};

export const playDisappear = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}disappear.mp3`);
  audio.volume = 0.2;
  audio.play();
};

export const playPurchase = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}item-purchase.mp3`);
  audio.play();
};

export const playCoinCollection = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}coin.mp3`);
  audio.currentTime = 0.3;
  audio.play();
};

let doorAudio = null;
let fadeOutInterval = null;

export const playDoor = (isPlaying) => {
  if (!isSoundEnabled()) return;
  if (isPlaying) {
    if (!doorAudio) {
      doorAudio = new Audio(`${BASE_PATH}door.mp3`);
      doorAudio.volume = 1;
      doorAudio.play();
    }
  } else {
    if (doorAudio) {
      clearInterval(fadeOutInterval);
      fadeOutInterval = setInterval(() => {
        if (doorAudio.volume > 0.05) {
          doorAudio.volume -= 0.05;
        } else {
          doorAudio.pause();
          doorAudio.currentTime = 0;
          doorAudio = null;
          clearInterval(fadeOutInterval);
        }
      }, 20);
    }
  }
};

let arrowAudio = null;

export const playArrow = (isPlaying) => {
  if (!isSoundEnabled()) return;
  if (isPlaying) {
    if (!arrowAudio) {
      arrowAudio = new Audio(`${BASE_PATH}arrow.mp3`);
      arrowAudio.volume = 1;
      arrowAudio.play();
    }
  } else {
    if (arrowAudio) {
      clearInterval(fadeOutInterval);
      fadeOutInterval = setInterval(() => {
        if (arrowAudio.volume > 0.05) {
          arrowAudio.volume -= 0.05;
        } else {
          arrowAudio.pause();
          arrowAudio.currentTime = 0;
          arrowAudio = null;
          clearInterval(fadeOutInterval);
        }
      }, 20);
    }
  }
};

let equipAudio = null;

export const playEquip = (isPlaying) => {
  if (!isSoundEnabled()) return;
  if (isPlaying) {
    if (!equipAudio) {
      equipAudio = new Audio(`${BASE_PATH}item-equip.mp3`);
      equipAudio.currentTime = 1.3;
      equipAudio.play();
    }
  } else {
    if (equipAudio) {
      clearInterval(fadeOutInterval);
      fadeOutInterval = setInterval(() => {
        if (equipAudio.volume > 0.05) {
          equipAudio.volume -= 0.05;
        } else {
          equipAudio.pause();
          equipAudio.currentTime = 0;
          equipAudio = null;
          clearInterval(fadeOutInterval);
        }
      }, 20);
    }
  }
};

let hornAudio = null;

export const playHorn = (isPlaying) => {
  if (!isSoundEnabled()) return;
  if (isPlaying) {
    if (!hornAudio) {
      hornAudio = new Audio(`${BASE_PATH}horn.mp3`);
      hornAudio.play();
    }
  } else {
    if (hornAudio) {
      clearInterval(fadeOutInterval);
      fadeOutInterval = setInterval(() => {
        if (hornAudio.volume > 0.05) {
          hornAudio.volume -= 0.05;
        } else {
          hornAudio.pause();
          hornAudio.currentTime = 0;
          hornAudio = null;
          clearInterval(fadeOutInterval);
        }
      }, 20);
    }
  }
};

let chestAudio = null;

export const playChest = (isPlaying) => {
  if (!isSoundEnabled()) return;
  if (isPlaying) {
    if (!chestAudio) {
      chestAudio = new Audio(`${BASE_PATH}chest.mp3`);
      chestAudio.currentTime = 0.5;
      chestAudio.play();
    }
  } else {
    if (chestAudio) {
      clearInterval(fadeOutInterval);
      fadeOutInterval = setInterval(() => {
        if (chestAudio.volume > 0.05) {
          chestAudio.volume -= 0.05;
        } else {
          chestAudio.pause();
          chestAudio.currentTime = 0;
          chestAudio = null;
          clearInterval(fadeOutInterval);
        }
      }, 20);
    }
  }
};

let logInOutAudio = null;

export const playLogInOut = (isPlaying) => {
  if (!isSoundEnabled()) return;
  if (isPlaying) {
    if (!logInOutAudio) {
      logInOutAudio = new Audio(`${BASE_PATH}log-in-out.mp3`);
      logInOutAudio.play();
    }
  } else {
    if (logInOutAudio) {
      clearInterval(fadeOutInterval);
      fadeOutInterval = setInterval(() => {
        if (logInOutAudio.volume > 0.05) {
          logInOutAudio.volume -= 0.05;
        } else {
          logInOutAudio.pause();
          logInOutAudio.currentTime = 0;
          logInOutAudio = null;
          clearInterval(fadeOutInterval);
        }
      }, 20);
    }
  }
};

let pageFlip = null;

export const playPageFlip = (isPlaying) => {
  if (!isSoundEnabled()) return;
  if (isPlaying) {
    if (!pageFlip) {
      pageFlip = new Audio(`${BASE_PATH}page-flip.mp3`);
      pageFlip.currentTime = 1.3;
      pageFlip.play();
    }
  } else {
    if (pageFlip) {
      clearInterval(fadeOutInterval);
      fadeOutInterval = setInterval(() => {
        if (pageFlip.volume > 0.05) {
          pageFlip.volume -= 0.05;
        } else {
          pageFlip.pause();
          pageFlip.currentTime = 0;
          pageFlip = null;
          clearInterval(fadeOutInterval);
        }
      }, 20);
    }
  }
};

export const playAppear = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}appear.mp3`);
  audio.play();
};

export const playSwallow = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}swallow.mp3`);
  audio.play();
};

export const playUpgrade = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}upgrade.mp3`);
  audio.play();
};

export const playPieceSound = (fileName) => {
  if (!isSoundEnabled()) return;
  const isEmoji = (str) => /\p{Emoji}/u.test(str);

  fileName = fileName || 'place-object';

  if (['nosee', 'nohear', 'nospeak'].includes(fileName)) {
    fileName = 'monkey';
  }

  if (isEmoji(fileName)) {
    fileName = 'place-object';
  }

  const audio = new Audio(`${BASE_PATH}${fileName}.mp3`);
  audio.currentTime = 0;
  audio.play();
  return audio;
};

export const playCardFlip = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}card-flip.mp3`);
  audio.play();
};

export const playAnswerCorrect = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}correct-answer.mp3`);
  audio.play();
};

export const playAnswerInCorrect = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}fail.mp3`);
  audio.play();
};

export const playDefeat = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}defeat.mp3`);
  audio.play();
};

export const playShift = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}shift.mp3`);
  audio.play();
};

export const playNextLevel = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}appear.mp3`);
  audio.play();
};

export const playButtonHover = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}button-hover-3.mp3`);
  audio.currentTime = 0.1;
  audio.play();
};

export const playUncover = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}uncover.mp3`);
  audio.currentTime = 0.8;
  audio.play();
};

export const playClick = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}click.mp3`);
  audio.currentTime = 0;
  audio.play();
};

export const playTeleport = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}teleport.mp3`);
  audio.currentTime = 0;
  audio.play();
};

export const playWinning = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}happy-ending.mp3`);
  audio.currentTime = 0;
  audio.play();
};

export const playPop = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}pop.mp3`);
  audio.currentTime = 0;
  audio.play();
};

export const playIntro = () => {
  if (!isSoundEnabled()) return;
  const audio = new Audio(`${BASE_PATH}intro.mp3`);
  audio.play();
};

let bgMusicInstance = null;
let currentFileName = null;
let bgMusicPausedTime = 0;

export const playBGMusic = (fileName) => {
  if (!isSoundEnabled()) return;
  if (
    bgMusicInstance &&
    !bgMusicInstance.paused &&
    currentFileName === fileName
  ) {
    return;
  }
  if (bgMusicInstance) {
    bgMusicInstance.pause();
    bgMusicInstance.currentTime = 0;
    bgMusicInstance = null;
  }
  currentFileName = fileName;
  bgMusicInstance = new Audio(`${BASE_PATH}${fileName}.mp3`);
  bgMusicInstance.loop = true;
  bgMusicInstance.volume = 0.5;
  bgMusicInstance.addEventListener('error', (e) => {
    console.error('BG music failed to play:', e);
    bgMusicInstance = null;
  });
  bgMusicInstance.addEventListener('ended', () => {
    bgMusicInstance = null;
  });
  bgMusicInstance.play().catch((err) => {
    console.warn('Auto-play failed or was interrupted:', err);
  });
  return bgMusicInstance;
};
export const pauseBGMusic = () => {
  if (bgMusicInstance && !bgMusicInstance.paused) {
    bgMusicPausedTime = bgMusicInstance.currentTime;
    bgMusicInstance.pause();
    return bgMusicPausedTime;
  }
  return 0;
};

export const resumeBGMusic = (seekTime) => {
  if (bgMusicInstance) {
    bgMusicInstance.currentTime = seekTime || bgMusicPausedTime;
    bgMusicInstance.play().catch((e) => console.error('Resume failed:', e));
  }
};

// React Hook for managing sounds
const useSound = () => {
  const successSoundRef = useRef(null);
  const cardFlipRef = useRef(null);
  const celebrationSoundRef = useRef(null);

  const playSuccessSound = () => {
    if (!isSoundEnabled()) return;
    const sound = successSoundRef.current;
    if (sound) {
      sound.pause();
      sound.currentTime = 0;
      sound.play();
    }
  };

  return {
    playSuccessSound,
    playCardFlip,
    playCelebrationSound,
    playAnswerCorrect,
    playAnswerInCorrect,
    successSoundRef,
    cardFlipRef,
    celebrationSoundRef
  };
};

export default useSound;
