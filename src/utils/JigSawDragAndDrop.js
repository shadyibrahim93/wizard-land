import { useState } from 'react';

const JigSawDragAndDrop = (pieces, setPieces) => {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
    console.log('Drag Started', item); // Debugging
  };

  const handleDrop = (e, dropZoneId, validateDrop) => {
    e.preventDefault();
    console.log('Drop Event Triggered', draggedItem); // Debugging

    if (draggedItem) {
      const isValid = validateDrop(draggedItem, dropZoneId);
      console.log('Drop Validity:', isValid); // Debugging

      if (isValid) {
        // Get drop zone position and normalize the drop (e.g., to snap pieces to grid)
        const { offsetX, offsetY } = e.nativeEvent;
        const dropX =
          Math.round(offsetX / draggedItem.dimensions_width) *
          draggedItem.dimensions_width;
        const dropY =
          Math.round(offsetY / draggedItem.dimensions_height) *
          draggedItem.dimensions_height;
        console.log('Calculated Drop Position', dropX, dropY); // Debugging

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
