import { useState } from 'react';

const useDragAndDrop = () => {
  const [draggedItem, setDraggedItem] = useState(null);

  const handleDragStart = (e, item) => {
    setDraggedItem(item);
  };

  const handleDrop = (e, dropZoneId, validateDrop) => {
    e.preventDefault();
    if (draggedItem) {
      const isValid = validateDrop
        ? validateDrop(draggedItem, dropZoneId)
        : false;
      return { draggedItem, isValid };
    }
    return { draggedItem: null, isValid: false };
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return { handleDragStart, handleDrop, handleDragOver };
};

export default useDragAndDrop;
