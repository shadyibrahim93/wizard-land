import { updateUserGameProgress } from '../apiService';

export async function handleMultiplayerWin(userId, winner, gameId) {
  if (!userId || !winner) return;

  const exp = 25;
  const stars = 2;

  const success = await updateUserGameProgress(userId, gameId, stars, exp);

  if (!success) {
    console.error('Failed to update user progress');
  }
}
