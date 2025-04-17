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

let doorAudio = null; // This will hold the audio reference

export const playDoor = (isPlaying) => {
  if (isPlaying) {
    if (!doorAudio) {
      // If audio is not already playing, play it
      doorAudio = new Audio(`${BASE_PATH}door.mp3`);
      doorAudio.play();
    }
  } else {
    if (doorAudio) {
      // If audio is playing, stop it
      doorAudio.pause();
      doorAudio.currentTime = 0; // Reset audio to start position
      doorAudio = null; // Reset reference
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
      // If audio is playing, stop it
      equipAudio.pause();
      equipAudio.currentTime = 0; // Reset audio to start position
      equipAudio = null; // Reset reference
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
      // If audio is playing, stop it
      hornAudio.pause();
      hornAudio.currentTime = 0; // Reset audio to start position
      hornAudio = null; // Reset reference
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
      // If audio is playing, stop it
      chestAudio.pause();
      chestAudio.currentTime = 0; // Reset audio to start position
      chestAudio = null; // Reset reference
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
      // If audio is playing, stop it
      logInOutAudio.pause();
      logInOutAudio.currentTime = 0; // Reset audio to start position
      logInOutAudio = null; // Reset reference
    }
  }
};

let pageFlip = null; // This will hold the audio reference

export const playPageFlip = (isPlaying) => {
  if (isPlaying) {
    if (!pageFlip) {
      // If audio is not already playing, play it
      pageFlip = new Audio(`${BASE_PATH}page-flip.mp3`);
      pageFlip.currentTime = 1;
      pageFlip.play();
    }
  } else {
    if (pageFlip) {
      // If audio is playing, stop it
      pageFlip.pause();
      pageFlip.currentTime = 0; // Reset audio to start position
      pageFlip = null; // Reset reference
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

let bgMusicInstance = null; // Global variable to track the audio instance

export const playBGMusic = () => {
  if (bgMusicInstance) {
    // If an instance already exists, exit to prevent overlapping
    return;
  }

  bgMusicInstance = new Audio(`${BASE_PATH}bgmusic.mp3`);
  bgMusicInstance.loop = true;
  bgMusicInstance.volume = 0.5;
  bgMusicInstance.play();
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
