import { updateUserGameProgress } from '../apiService';

export async function handleMultiplayerWin(userId, winner, difficulty) {
  if (!userId || !winner || !difficulty) return;

  let exp = 0;
  let stars = 0;

  switch (difficulty.toLowerCase()) {
    case 'easy':
      exp = 500;
      stars = 50;
      break;
    case 'medium':
      exp = 1000;
      stars = 100;
      break;
    case 'hard':
      exp = 1500;
      stars = 150;
      break;
    default:
      console.warn(`Unknown difficulty: ${difficulty}`);
      return;
  }

  const success = await updateUserGameProgress(userId, stars, exp);

  if (!success) {
    console.error('Failed to update user progress');
  }
}
