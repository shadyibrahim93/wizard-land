import { React, useRef, useState, useEffect } from 'react';
import Button from '../../../components/Button';
import { playDisappear } from '../../../hooks/useSound';
import useDragAndDrop from '../../../utils/DragAndDrop';
import shuffleArray from '../../../utils/ShuffleChildren';
import { getDropZoneShapes } from '../../../apiService';
import GameOver from '../../gameFlow/gameover';
import GameIntro from '../../gameFlow/gameintro';

const Game = ({
  setCurrentLevel,
  setCurrentLevelPassed,
  setFinalLevelOver,
  setMaxLevel
}) => {
  const shapesContainerRef = useRef(null);
  const dropZonesRef = useRef(null);
  const [level, setLevel] = useState(1);
  const [shapesState, setShapesState] = useState([]);
  const [dropZone, setDropZone] = useState([]);
  const [shapes, setShapes] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const maxLevel = 3;
  const { handleDragStart, handleDrop, handleDragOver } = useDragAndDrop();

  const introText = `Get ready to test your spatial awareness and precision! In this game, you will need to pick up shapes and drop them into their matching outlines. The challenge? Each level will bring new shapes and more complex arrangements to keep you on your toes. Your goal is to complete each level with accuracy and care. Can you match all the shapes without making a mistake? Stay focused, think ahead, and see how far you can go! Are you ready to put your shape-matching skills to the test?`;

  useEffect(() => {
    async function fetchData() {
      setShapesState([]);
      setDropZone([]);
      setMaxLevel(maxLevel);

      const data = await getDropZoneShapes(level);
      if (data.length > 0) {
        setShapes(shuffleArray(data));
        const shuffledShapes = shuffleArray(data);
        setShapesState(shuffledShapes);
        setDropZone(data);
      }

      setCurrentLevel(level);
    }

    fetchData();
  }, [level]);

  const reset = () => {
    if (shapes.length > 0) {
      const shuffledShapes = shuffleArray(shapes);
      setShapesState(shuffledShapes);
      setDropZone(shapes);
    }

    const allDropZones = document.querySelectorAll('.mq-shape--drop');
    allDropZones.forEach((zone) => zone.classList.remove('passed'));
  };

  const resetGame = () => {
    reset();
    setLevel(1);
    setGameOver(false);
  };

  const resetLevel = () => {
    reset();
  };

  // **Handle drop event**
  const handleShapeDrop = (e, shape) => {
    const { isValid } = handleDrop(
      e,
      shape.id + '-drop',
      (draggedItem, dropZoneId) => draggedItem.id + '-drop' === dropZoneId
    );

    if (isValid) {
      e.currentTarget.classList.add('passed');
      playDisappear();

      // Remove the shape from draggable list but keep dropZone intact
      setShapesState((prevState) => prevState.filter((s) => s.id !== shape.id));
    }

    // Check if all drop zones are filled
    if (dropZonesRef.current) {
      const dropZones =
        dropZonesRef.current.querySelectorAll('.mq-shape--drop');
      const allPassed = Array.from(dropZones).every((zone) =>
        zone.classList.contains('passed')
      );

      if (allPassed) {
        if (level < maxLevel) {
          setCurrentLevelPassed(true);
          setLevel((prevLevel) => prevLevel + 1);
          setFinalLevelOver(false);
        } else {
          setFinalLevelOver(true);
          setGameOver(true);
          setMaxLevel(maxLevel - 1);
        }
      }
    }
  };

  return !startGame ? (
    <GameIntro
      introText={introText} // Pass intro text
      onStart={() => setStartGame(true)} // Pass start callback
    />
  ) : !gameOver ? (
    <>
      <div
        className='mq-shapes-container'
        ref={shapesContainerRef}
      >
        {shapesState.map((shape) => (
          <div
            key={shape.id}
            id={shape.id}
            className={shape.classname}
            draggable='true'
            onDragStart={(e) => handleDragStart(e, shape)}
            dangerouslySetInnerHTML={{ __html: shape.svgpick }}
          ></div>
        ))}
      </div>

      <div
        className='mq-shapes-container--drop'
        ref={dropZonesRef}
      >
        {dropZone.map((shape) => (
          <div
            key={shape.id + '-drop'}
            id={shape.id + '-drop'}
            className='mq-shape--drop'
            onDragOver={handleDragOver}
            onDrop={(e) => handleShapeDrop(e, shape)} // Now using extracted function
          >
            <svg
              width='120'
              height='120'
              dangerouslySetInnerHTML={{ __html: shape.svgdrop }}
            />
          </div>
        ))}
      </div>

      <div className='mq-btns-container'>
        <Button
          text='Restart Level'
          onClick={resetLevel}
        />
        {level >= 2 && (
          <Button
            text='Restart Game'
            onClick={resetGame}
          />
        )}
      </div>
    </>
  ) : (
    // ✅ GameOver only appears when maxLevel is reached
    <GameOver resetGame={resetGame} />
  );
};

export default Game;
