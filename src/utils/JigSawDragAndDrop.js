import { useState } from 'react';

const JigSawDragAndDrop = (pieces, setPieces) => {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
  };

  const handleDrop = (e, dropZoneId, validateDrop) => {
    e.preventDefault();

    if (draggedItem) {
      const isValid = validateDrop(draggedItem, dropZoneId);

      if (isValid) {
        // Get drop zone position and normalize the drop (e.g., to snap pieces to grid)
        const { offsetX, offsetY } = e.nativeEvent;
        const dropX =
          Math.round(offsetX / draggedItem.dimensions_width) *
          draggedItem.dimensions_width;
        const dropY =
          Math.round(offsetY / draggedItem.dimensions_height) *
          draggedItem.dimensions_height;

        // Update piece position in state
        setPieces((prevPieces) =>
          prevPieces.map((piece) =>
            piece.id === draggedItem.id
              ? {
                  ...piece,
                  current_position_x: dropX,
                  current_position_y: dropY
                }
              : piece
          )
        );
      }

      return { draggedItem, isValid };
    }

    return { draggedItem: null, isValid: false };
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return { handleDragStart, handleDrop, handleDragOver };
};

export default JigSawDragAndDrop;
