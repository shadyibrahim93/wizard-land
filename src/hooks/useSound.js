import { useRef } from 'react';

// Base path for GitHub Pages deployment
const BASE_PATH = '/wizard-land/assets/sounds/';

// Sound functions
export const playCelebrationSound = () => {
  const audio = new Audio(`${BASE_PATH}tada.mp3`);
  audio.play();
};

export const playDisappear = () => {
  const audio = new Audio(`${BASE_PATH}disappear.mp3`);
  audio.volume = 0.2;
  audio.play();
};

export const playPurchase = () => {
  const audio = new Audio(`${BASE_PATH}item-purchase.mp3`);
  audio.play();
};

export const playCoinCollection = () => {
  const audio = new Audio(`${BASE_PATH}coin.mp3`);
  audio.currentTime = 0.3;
  audio.play();
};

let doorAudio = null;
let fadeOutInterval = null;

export const playDoor = (isPlaying) => {
  if (isPlaying) {
    if (!doorAudio) {
      doorAudio = new Audio(`${BASE_PATH}door.mp3`);
      doorAudio.volume = 1;
      doorAudio.play();
    }
  } else {
    if (doorAudio) {
      // Clear any previous fade out
      clearInterval(fadeOutInterval);

      // Start fade out
      fadeOutInterval = setInterval(() => {
        if (doorAudio.volume > 0.05) {
          doorAudio.volume -= 0.05;
        } else {
          // Stop and clean up
          doorAudio.pause();
          doorAudio.currentTime = 0;
          doorAudio = null;
          clearInterval(fadeOutInterval);
        }
      }, 20); // Adjust this for faster/slower fade
    }
  }
};

let equipAudio = null; // This will hold the audio reference

export const playEquip = (isPlaying) => {
  if (isPlaying) {
    if (!equipAudio) {
      // If audio is not already playing, play it
      equipAudio = new Audio(`${BASE_PATH}item-equip.mp3`);
      equipAudio.currentTime = 1.3;
      equipAudio.play();
    }
  } else {
    if (equipAudio) {
      // Clear any previous fade out
      clearInterval(fadeOutInterval);

      // Start fade out
      fadeOutInterval = setInterval(() => {
        if (equipAudio.volume > 0.05) {
          equipAudio.volume -= 0.05;
        } else {
          // Stop and clean up
          equipAudio.pause();
          equipAudio.currentTime = 0;
          equipAudio = null;
          clearInterval(fadeOutInterval);
        }
      }, 20); // Adjust this for faster/slower fade
    }
  }
};

let hornAudio = null; // This will hold the audio reference

export const playHorn = (isPlaying) => {
  if (isPlaying) {
    if (!hornAudio) {
      // If audio is not already playing, play it
      hornAudio = new Audio(`${BASE_PATH}horn.mp3`);
      hornAudio.play();
    }
  } else {
    if (hornAudio) {
      // Clear any previous fade out
      clearInterval(fadeOutInterval);

      // Start fade out
      fadeOutInterval = setInterval(() => {
        if (hornAudio.volume > 0.05) {
          hornAudio.volume -= 0.05;
        } else {
          // Stop and clean up
          hornAudio.pause();
          hornAudio.currentTime = 0;
          hornAudio = null;
          clearInterval(fadeOutInterval);
        }
      }, 20); // Adjust this for faster/slower fade
    }
  }
};

let chestAudio = null; // This will hold the audio reference

export const playChest = (isPlaying) => {
  if (isPlaying) {
    if (!chestAudio) {
      // If audio is not already playing, play it
      chestAudio = new Audio(`${BASE_PATH}chest.mp3`);
      chestAudio.currentTime = 0.5;
      chestAudio.play();
    }
  } else {
    if (chestAudio) {
      // Clear any previous fade out
      clearInterval(fadeOutInterval);

      // Start fade out
      fadeOutInterval = setInterval(() => {
        if (chestAudio.volume > 0.05) {
          chestAudio.volume -= 0.05;
        } else {
          // Stop and clean up
          chestAudio.pause();
          chestAudio.currentTime = 0;
          chestAudio = null;
          clearInterval(fadeOutInterval);
        }
      }, 20); // Adjust this for faster/slower fade
    }
  }
};

let logInOutAudio = null; // This will hold the audio reference

export const playLogInOut = (isPlaying) => {
  if (isPlaying) {
    if (!logInOutAudio) {
      // If audio is not already playing, play it
      logInOutAudio = new Audio(`${BASE_PATH}log-in-out.mp3`);
      logInOutAudio.play();
    }
  } else {
    if (logInOutAudio) {
      // Clear any previous fade out
      clearInterval(fadeOutInterval);

      // Start fade out
      fadeOutInterval = setInterval(() => {
        if (logInOutAudio.volume > 0.05) {
          logInOutAudio.volume -= 0.05;
        } else {
          // Stop and clean up
          logInOutAudio.pause();
          logInOutAudio.currentTime = 0;
          logInOutAudio = null;
          clearInterval(fadeOutInterval);
        }
      }, 20); // Adjust this for faster/slower fade
    }
  }
};

let pageFlip = null; // This will hold the audio reference

export const playPageFlip = (isPlaying) => {
  if (isPlaying) {
    if (!pageFlip) {
      // If audio is not already playing, play it
      pageFlip = new Audio(`${BASE_PATH}page-flip.mp3`);
      pageFlip.currentTime = 1.3;
      pageFlip.play();
    }
  } else {
    if (pageFlip) {
      // Clear any previous fade out
      clearInterval(fadeOutInterval);

      // Start fade out
      fadeOutInterval = setInterval(() => {
        if (pageFlip.volume > 0.05) {
          pageFlip.volume -= 0.05;
        } else {
          // Stop and clean up
          pageFlip.pause();
          pageFlip.currentTime = 0;
          pageFlip = null;
          clearInterval(fadeOutInterval);
        }
      }, 20); // Adjust this for faster/slower fade
    }
  }
};

export const playAppear = () => {
  const audio = new Audio(`${BASE_PATH}appear.mp3`);
  audio.play();
};

export const playSwallow = () => {
  const audio = new Audio(`${BASE_PATH}swallow.mp3`);
  audio.play();
};

export const playUpgrade = () => {
  const audio = new Audio(`${BASE_PATH}upgrade.mp3`);
  audio.play();
};

export const playPlaceObject = () => {
  const audio = new Audio(`${BASE_PATH}place-object.mp3`);
  audio.currentTime = 0.26;
  audio.play();
};

export const playCardFlip = () => {
  const audio = new Audio(`${BASE_PATH}card-flip.mp3`);
  audio.play();
};

export const playAnswerCorrect = () => {
  const audio = new Audio(`${BASE_PATH}correct-answer.mp3`);
  audio.play();
};

export const playAnswerInCorrect = () => {
  const audio = new Audio(`${BASE_PATH}fail.mp3`);
  audio.play();
};

export const playDefeat = () => {
  const audio = new Audio(`${BASE_PATH}defeat.mp3`);
  audio.play();
};

export const playShift = () => {
  const audio = new Audio(`${BASE_PATH}shift.mp3`);
  audio.play();
};

export const playNextLevel = () => {
  const audio = new Audio(`${BASE_PATH}appear.mp3`);
  audio.play();
};

export const playButtonHover = () => {
  const audio = new Audio(`${BASE_PATH}button-hover-3.mp3`);
  audio.currentTime = 0.1;
  audio.play();
};

export const playUncover = () => {
  const audio = new Audio(`${BASE_PATH}uncover.mp3`);
  audio.currentTime = 0.8;
  audio.play();
};

export const playClick = () => {
  const audio = new Audio(`${BASE_PATH}click.mp3`);
  audio.currentTime = 0;
  audio.play();
};

export const playTeleport = () => {
  const audio = new Audio(`${BASE_PATH}teleport.mp3`);
  audio.currentTime = 0;
  audio.play();
};

export const playWinning = () => {
  const audio = new Audio(`${BASE_PATH}happy-ending.mp3`);
  audio.currentTime = 0;
  audio.play();
};

export const playPop = () => {
  const audio = new Audio(`${BASE_PATH}pop.mp3`);
  audio.currentTime = 0;
  audio.play();
};

export const playIntro = () => {
  const audio = new Audio(`${BASE_PATH}intro.mp3`);
  audio.play();
};

let bgMusicInstance = null;

export const playBGMusic = () => {
  if (bgMusicInstance && !bgMusicInstance.paused) {
    // Already playing, don't start again
    return;
  }

  if (!bgMusicInstance) {
    bgMusicInstance = new Audio(`${BASE_PATH}bgmusic.mp3`);
    bgMusicInstance.loop = true;
    bgMusicInstance.volume = 0.5;

    // Optional: handle audio errors
    bgMusicInstance.addEventListener('error', (e) => {
      console.error('BG music failed to play:', e);
      bgMusicInstance = null;
    });

    // Optional: clean up on end (though loop is true, this is just extra safety)
    bgMusicInstance.addEventListener('ended', () => {
      bgMusicInstance = null;
    });
  }

  bgMusicInstance.play().catch((err) => {
    console.warn('Auto-play failed or was interrupted:', err);
  });
};

// React Hook for managing sounds
const useSound = () => {
  const successSoundRef = useRef(null);
  const cardFlipRef = useRef(null);
  const celebrationSoundRef = useRef(null);

  const playSuccessSound = () => {
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
