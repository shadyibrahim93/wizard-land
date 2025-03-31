import { playCelebrationSound } from '../hooks/useSound';
import { triggerConfetti } from '../hooks/useConfetti';

const checkLevelCompletion = (currentLevelPassed) => {
  // Only run when explicitly called
  if (currentLevelPassed) {
    // Play celebration sound
    playCelebrationSound();

    // Trigger confetti after 400ms
    setTimeout(() => {
      triggerConfetti();
    }, 400);
  }
};

export default checkLevelCompletion;
