import useSelectedItems from './useSelectedItems';

export const useSelectedPiece = (userId, fallback, themefallback) => {
  const selected = useSelectedItems(userId);

  const emoji = selected.piece?.emoji || null;
  const image = selected.piece?.image_url || null;
  const name = selected.piece?.className || null;
  const theme = selected.theme?.className || null;

  const getImagePath = (fileName) =>
    `/assets/images/elements/board_pieces/${fileName}.webp`;

  return {
    key: name || emoji || fallback, // used for comparison
    display: emoji,
    image: image ? (
      <img
        src={getImagePath(image)}
        className='mq-piece--img'
      />
    ) : (
      fallback
    ),
    theme: theme || themefallback
  };
};
