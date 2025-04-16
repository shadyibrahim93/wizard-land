import useSelectedItems from './useSelectedItems';

export const useSelectedPiece = (userId, fallback = '🔥') => {
  const selected = useSelectedItems(userId);

  const emoji = selected.piece?.emoji || null;
  const image = selected.piece?.image_url || null;
  const name = selected.piece?.className || null;

  return {
    key: name || emoji || fallback, // used for comparison
    display: emoji,
    image: image ? (
      <img
        src={`wizard-land/assets/elements/board_pieces/${image}`}
        className='mq-piece--img'
      />
    ) : (
      fallback
    )
  };
};
