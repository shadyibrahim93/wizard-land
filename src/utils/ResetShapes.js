const useResetShapes = ({
  shapes,
  shapesContainerRef,
  dropZonesRef,
  handleDragStart,
  handleDragOver,
  handleDrop,
  validateDrop,
  setShapesState
}) => {
  const resetShapes = () => {
    if (shapesContainerRef.current && dropZonesRef.current) {
      // Clear existing elements
      shapesContainerRef.current.innerHTML = '';
      dropZonesRef.current.innerHTML = '';

      if (Array.isArray(shapes.levels.one)) {
        shapes.levels.one.forEach((shape) => {
          // Create shape element
          const shapeDiv = document.createElement('div');
          shapeDiv.id = shape.id;
          shapeDiv.className = shape.className;
          shapeDiv.draggable = true;
          shapeDiv.innerHTML = shape.svgPick;
          shapeDiv.ondragstart = (e) => handleDragStart(e, shape);

          // Create drop zone element
          const dropZoneDiv = document.createElement('div');
          dropZoneDiv.id = shape.id + '-drop';
          dropZoneDiv.className = 'mq-shape--drop';
          dropZoneDiv.ondragover = handleDragOver;
          dropZoneDiv.onDrop = (e) => {
            const { isValid } = handleDrop(e, shape.id + '-drop', validateDrop);
            if (isValid) {
              e.currentTarget.classList.add('passed');
              // 🟢 Remove shape from shapesState after successful drop
              setShapesState((prevState) => ({
                ...prevState,
                levels: {
                  ...prevState.levels,
                  one: prevState.levels.one.filter((s) => s.id !== shape.id)
                }
              }));
            }
          };

          // Append elements to containers
          shapesContainerRef.current.appendChild(shapeDiv);
          dropZonesRef.current.appendChild(dropZoneDiv);
        });
      } else {
        console.error('shapes.levels.one is not an array');
      }
    }
  };

  return { resetShapes };
};

export default useResetShapes;
