import useSelectedItems from './useSelectedItems';

export const useSelectedPiece = (userId, fallback = '🔥') => {
  const selected = useSelectedItems(userId);
  return selected.piece?.emoji || fallback;
};
