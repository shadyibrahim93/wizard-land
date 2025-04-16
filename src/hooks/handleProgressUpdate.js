import { updateUserGameProgress } from '../apiService';

export async function handleMultiplayerWin(userId, difficulty) {
  if (!userId || !difficulty) return;

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

  try {
    const success = await updateUserGameProgress(userId, stars, exp);

    if (!success) {
      throw new Error(`Failed to update stars for user ${userId}`);
    }
  } catch (error) {
    console.error(error.message);
    // You can rethrow the error or handle it accordingly
    throw error;
  }
}
