import useSelectedItems from './useSelectedItems';

export const useSelectedPiece = (userId, fallback, themefallback) => {
  const selected = useSelectedItems(userId);

  const emoji = selected.piece?.emoji || null;
  const image = selected.piece?.image_url || null;
  const name = selected.piece?.class_name || null;
  const theme = selected.theme?.class_name || null;

  return {
    key: name || emoji || fallback, // used for comparison
    display: emoji,
    image: image ? (
      <img
        src={`/assets/images/board_pieces/${image}.webp`}
        className='mq-piece--img'
      />
    ) : (
      fallback
    ),
    theme: theme || themefallback
  };
};
