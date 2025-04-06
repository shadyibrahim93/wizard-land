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
  audio.volume = 0.5;
  audio.play();
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
