'use client';

import { useState, useEffect } from 'react';
import { playNextLevel, playWinning } from './useSound.js';
import { triggerConfetti } from './useConfetti.js';

const useLevelProgression = () => {
  const [currentLevel, setCurrentLevel] = useState(1); // Manage current level state
  const [nextLevel, setNextLevel] = useState(2); // Manage next level state
  const [currentLevelPassed, setCurrentLevelPassed] = useState(false); // Flag if current level passed
  const [finalLevelOver, setFinalLevelOver] = useState(false); // Flag if the final level is over

  // Logic to check level completion and progress
  useEffect(() => {
    if (currentLevelPassed && !finalLevelOver) {
      playNextLevel();
      triggerConfetti();

      // Ensure the progression logic runs only if the game is not over
      setTimeout(() => {
        if (!finalLevelOver) {
          // Check again inside setTimeout
          setCurrentLevel(currentLevel + 1);
          setNextLevel(nextLevel + 1);
        }
      }, 2000);

      setCurrentLevelPassed(false);
    } else if (currentLevel != 1 && finalLevelOver) {
      playWinning();
    }
  }, [currentLevelPassed, finalLevelOver, currentLevel, nextLevel]);

  return {
    currentLevel,
    setCurrentLevel,
    setNextLevel,
    setCurrentLevelPassed,
    setFinalLevelOver
  };
};

export default useLevelProgression;
