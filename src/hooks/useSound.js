import { useRef } from 'react';

// Sound functions
export const playCelebrationSound = () => {
  const audio = new Audio('../assets/sounds/tada.mp3');
  audio.play();
};

export const playDisappear = () => {
  const audio = new Audio('../assets/sounds/disappear.mp3');
  audio.volume = 0.5;
  audio.play();
};

export const playAppear = () => {
  const audio = new Audio('../assets/sounds/appear.mp3');
  audio.play();
};

export const playPlaceObject = () => {
  const audio = new Audio('../assets/sounds/place-object.mp3');
  audio.currentTime = 0.26;
  audio.play();
};

export const playCardFlip = () => {
  const audio = new Audio('../assets/sounds/card-flip.mp3');
  audio.play();
};

export const playAnswerCorrect = () => {
  const audio = new Audio('../assets/sounds/correct-answer.mp3');
  audio.play();
};

export const playAnswerInCorrect = () => {
  const audio = new Audio('../assets/sounds/fail.mp3');
  audio.play();
};

export const playDefeat = () => {
  const audio = new Audio('../assets/sounds/defeat.mp3');
  audio.play();
};

export const playNextLevel = () => {
  const audio = new Audio('../assets/sounds/appear.mp3');
  audio.play();
};

export const playButtonHover = () => {
  const audio = new Audio('../assets/sounds/button-hover-3.mp3');
  audio.currentTime = 0.1;
  audio.play();
};

export const playUncover = () => {
  const audio = new Audio('../assets/sounds/uncover.mp3');
  audio.currentTime = 0.8;
  audio.play();
};

export const playClick = () => {
  const audio = new Audio('../assets/sounds/click.mp3');
  audio.currentTime = 0;
  audio.play();
};

export const playTeleport = () => {
  const audio = new Audio('../assets/sounds/teleport.mp3');
  audio.currentTime = 0;
  audio.play();
};

export const playWinning = () => {
  const audio = new Audio('../assets/sounds/happy-ending.mp3');
  audio.currentTime = 0;
  audio.play();
};

export const playPop = () => {
  const audio = new Audio('../assets/sounds/pop.mp3');
  audio.currentTime = 0;
  audio.play();
};

export const playIntro = () => {
  const audio = new Audio('../assets/sounds/intro.mp3');
  audio.play();
};

let bgMusicInstance = null; // Global variable to track the audio instance

export const playBGMusic = () => {
  if (bgMusicInstance) {
    // If an instance already exists, exit to prevent overlapping
    return;
  }

  bgMusicInstance = new Audio('../assets/sounds/bgmusic.mp3');
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
