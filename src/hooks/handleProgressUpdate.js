import { updateUserGameProgress } from '../apiService';

export async function handleMultiplayerWin(userId, winner) {
  if (!userId || !winner) return;

  const exp = 25;
  const stars = 2;

  const success = await updateUserGameProgress(userId, stars, exp);

  if (!success) {
    console.error('Failed to update user progress');
  }
}
