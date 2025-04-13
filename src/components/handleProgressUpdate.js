import { updateUserGameProgress } from '../../../utils/supabase/updateUserGameProgress';

export async function handleMultiplayerWin(userId, winner) {
  if (!userId || !winner) return;

  const exp = 25;
  const stars = 2;

  const success = await updateUserGameProgress(userId, stars, exp);

  if (!success) {
    console.error('Failed to update user progress');
  }
}

export async function handleSingleplayerWin(userId, winner) {
  if (!userId || !winner) return;

  const exp = 10;
  const stars = 1;

  const success = await updateUserGameProgress(userId, stars, exp);

  if (!success) {
    console.error('Failed to update user progress');
  }
}
