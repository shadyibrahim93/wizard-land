'use client';

import { React, useRef, useState, useEffect } from 'react';
import Button from '../../../components/Button.js';
import { playDisappear } from '../../../hooks/useSound.js';
import useDragAndDrop from '../../../utils/DragAndDrop.js';
import shuffleArray from '../../../utils/ShuffleChildren.js';
import { getDropZoneShapes } from '../../../apiService.js';
import GameOver from '../../../components/gameFlow/gameover.jsx';
import GameIntro from '../../../components/gameFlow/gameintro.jsx';

const hardcodedShapes = [
  {
    id: 'apple',
    classname: 'mq-shape',
    color: 'mq-shape--red',
    svgpick:
      '<svg width="120" height="120" viewBox="0 0 100 100" ><circle cx="50" cy="50" r="30" /><rect x="47" y="20" width="6" height="15" /><ellipse cx="50" cy="15" rx="10" ry="5" /></svg>',
    svgdrop:
      '<svg width="120" height="120" viewBox="0 0 100 100" class="mq-shape--red"><circle cx="50" cy="50" r="30" stroke="#FF6666" stroke-width="2"/><rect x="47" y="20" width="6" height="15" stroke="#8B5C3B" stroke-width="2"/><ellipse cx="50" cy="15" rx="10" ry="5" stroke="#A5E48C" stroke-width="2"/></svg>',
    level: 2
  },
  {
    id: 'balloon',
    classname: 'mq-shape balloon',
    color: 'mq-shape--pink',
    svgpick:
      '<svg width="120" height="120" viewBox="0 0 100 100" ><path d="M50 90 C20 70 0 40 25 15 C40 0 60 0 75 15 C100 40 80 70 50 90 Z"/></svg>',
    svgdrop:
      '<svg width="120" height="120" viewBox="0 0 100 100" class="drop-svg mq-shape--pink"><path d="M50 90 C20 70 0 40 25 15 C40 0 60 0 75 15 C100 40 80 70 50 90 Z"/></svg>',
    level: 1
  },
  {
    id: 'bottle',
    classname: 'mq-shape',
    color: 'mq-shape--blue',
    svgpick:
      '<svg width="120" height="120" viewBox="0 0 100 100"><rect x="30" y="20" width="40" height="55" rx="10"/><rect x="40" y="10" width="20" height="10" rx="5"/></svg>',
    svgdrop:
      '<svg width="120" height="120" viewBox="0 0 100 100" class="mq-shape--blue"><rect x="30" y="20" width="40" height="55" rx="10"/><rect x="40" y="10" width="20" height="10" rx="5"/></svg>',
    level: 2
  },
  {
    id: 'circle',
    classname: 'mq-shape circle',
    color: 'mq-shape--yellow',
    svgpick:
      '<svg width="120" height="120" ><circle cx="60" cy="60" r="50"/></svg>',
    svgdrop:
      '<svg width="120" height="120" class="drop-svg mq-shape--yellow"><circle cx="60" cy="60" r="50"/></svg>',
    level: 1
  },
  {
    id: 'diamond',
    classname: 'mq-shape diamond',
    color: 'mq-shape--green',
    svgpick:
      '<svg width="120" height="120" viewBox="0 0 100 100"><path d="M50 0 L100 50 L50 100 L0 50 Z"/></svg>',
    svgdrop:
      '<svg width="120" height="120" viewBox="0 0 100 100" class="drop-svg mq-shape--green"><path d="M50 0 L100 50 L50 100 L0 50 Z"/></svg>',
    level: 1
  },
  {
    id: 'notebook',
    classname: 'mq-shape',
    color: 'mq-shape--green',
    svgpick:
      '<svg width="120" height="120" viewBox="0 0 100 100"><rect x="20" y="20" width="60" height="60"/><line x1="20" y1="40" x2="80" y2="40" stroke="#FFFFFF" stroke-width="2"/><line x1="20" y1="60" x2="80" y2="60" stroke="#FFFFFF" stroke-width="2"/></svg>',
    svgdrop:
      '<svg width="120" height="120" viewBox="0 0 100 100" class="mq-shape--green"><rect x="20" y="20" width="60" height="60"/><line x1="20" y1="40" x2="80" y2="40" stroke="#FFFFFF" stroke-width="2"/><line x1="20" y1="60" x2="80" y2="60" stroke="#FFFFFF" stroke-width="2"/></svg>',
    level: 2
  },
  {
    id: 'number-1',
    classname: 'mq-shape',
    color: 'mq-shape--yellow',
    svgpick:
      '<svg width="120" height="120" viewBox="0 0 100 100"><path d="M20 30 Q50 5, 80 30 Q50 50, 20 70 Q50 90, 80 60 Q50 40, 20 30 Z" stroke-width="8"/></svg>',
    svgdrop:
      '<svg width="120" height="120" viewBox="0 0 100 100" class="mq-shape--yellow"><path d="M20 30 Q50 5, 80 30 Q50 50, 20 70 Q50 90, 80 60 Q50 40, 20 30 Z"/></svg>',
    level: 3
  },
  {
    id: 'number-2',
    classname: 'mq-shape',
    color: 'mq-shape--blue',
    svgpick:
      '<svg width="120" height="120" viewBox="0 0 100 100"><path d="M30 30 C40 10, 60 10, 70 30 C60 50, 50 70, 30 60 C40 50, 50 30, 30 30 Z" stroke-width="8"/></svg>',
    svgdrop:
      '<svg width="120" height="120" viewBox="0 0 100 100" class="mq-shape--blue"><path d="M30 30 C40 10, 60 10, 70 30 C60 50, 50 70, 30 60 C40 50, 50 30, 30 30 Z"/></svg>',
    level: 3
  },
  {
    id: 'number-3',
    classname: 'mq-shape',
    color: 'mq-shape--red',
    svgpick:
      '<svg width="120" height="120" viewBox="0 0 100 100"><path d="M50 10 L20 30 L40 50 L20 70 L50 90 L80 70 L60 50 L80 30 Z" stroke-width="8"/></svg>',
    svgdrop:
      '<svg width="120" height="120" viewBox="0 0 100 100" class="mq-shape--red"><path d="M50 10 L20 30 L40 50 L20 70 L50 90 L80 70 L60 50 L80 30 Z"/></svg>',
    level: 3
  },
  {
    id: 'number-4',
    classname: 'mq-shape',
    color: 'mq-shape--pink',
    svgpick:
      '<svg width="120" height="120" viewBox="0 0 100 100"><path d="M30 20 L50 50 L30 80 L70 80 L50 50 L70 20 Z" stroke-width="8"/></svg>',
    svgdrop:
      '<svg width="120" height="120" viewBox="0 0 100 100" class="mq-shape--pink"><path d="M30 20 L50 50 L30 80 L70 80 L50 50 L70 20 Z"/></svg>',
    level: 3
  },
  {
    id: 'number-5',
    classname: 'mq-shape',
    color: 'mq-shape--green',
    svgpick:
      '<svg width="120" height="120" viewBox="0 0 100 100"><path d="M10 30 Q30 10, 50 30 Q70 10, 90 30 Q70 50, 50 70 Q30 50, 10 30 Z" stroke-width="8"/></svg>',
    svgdrop:
      '<svg width="120" height="120" viewBox="0 0 100 100" class="mq-shape--green"><path d="M10 30 Q30 10, 50 30 Q70 10, 90 30 Q70 50, 50 70 Q30 50, 10 30 Z"/></svg>',
    level: 3
  },
  {
    id: 'number-6',
    classname: 'mq-shape',
    color: 'mq-shape--purple',
    svgpick:
      '<svg width="120" height="120" viewBox="0 0 100 100"><path d="M50 10 C30 10, 30 30, 50 30 C70 30, 70 50, 50 50 C30 50, 30 70, 50 70 C70 70, 70 90, 50 90 C30 90, 30 70, 50 70" stroke-width="8"/></svg>',
    svgdrop:
      '<svg width="120" height="120" viewBox="0 0 100 100" class="mq-shape--purple"><path d="M50 10 C30 10, 30 30, 50 30 C70 30, 70 50, 50 50 C30 50, 30 70, 50 70 C70 70, 70 90, 50 90 C30 90, 30 70, 50 70"/></svg>',
    level: 3
  },
  {
    id: 'pencil',
    classname: 'mq-shape',
    color: 'mq-shape--yellow',
    svgpick:
      '<svg width="120" height="120" viewBox="0 0 100 100"><rect x="45" y="20" width="10" height="60"/><polygon points="40,20 60,20 50,0" fill="gray"/><rect x="45" y="80" width="10" height="5" fill="pink"/></svg>',
    svgdrop:
      '<svg width="120" height="120" viewBox="0 0 100 100" class="mq-shape--yellow"><rect x="45" y="20" width="10" height="60" stroke="yellow" stroke-width="2"/><polygon points="40,20 60,20 50,0" stroke="gray" stroke-width="2" class="mq-shape--gray"/><rect x="45" y="80" width="10" height="5" stroke="pink" stroke-width="2"/></svg>',
    level: 2
  },
  {
    id: 'pentagon',
    classname: 'mq-shape pentagon',
    color: 'mq-shape--purple',
    svgpick:
      '<svg width="120" height="120" viewBox="0 0 100 100"><path d="M50 0 L100 38 L82 100 L18 100 L0 38 Z"/></svg>',
    svgdrop:
      '<svg width="120" height="120" viewBox="0 0 100 100" class="drop-svg mq-shape--purple"><path d="M50 0 L100 38 L82 100 L18 100 L0 38 Z"/></svg>',
    level: 1
  },
  {
    id: 'square',
    classname: 'mq-shape square',
    color: 'mq-shape--blue',
    svgpick:
      '<svg width="120" height="120"><rect width="120" height="120"/></svg>',
    svgdrop:
      '<svg width="120" height="120" class="drop-svg mq-shape--blue"><rect width="120" height="120" stroke-width="4"/></svg>',
    level: 1
  },
  {
    id: 'star',
    classname: 'mq-shape star',
    color: 'mq-shape--red',
    svgpick:
      '<svg width="120" height="120" viewBox="0 0 100 100"><path d="M50 5 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z"/></svg>',
    svgdrop:
      '<svg width="120" height="120" viewBox="0 0 100 100" class="drop-svg mq-shape--red"><path d="M50 5 L61 35 L98 35 L68 57 L79 91 L50 70 L21 91 L32 57 L2 35 L39 35 Z"/></svg>',
    level: 1
  },
  {
    id: 'umbrella',
    classname: 'mq-shape',
    color: 'mq-shape--purple',
    svgpick:
      '<svg width="120" height="120" viewBox="0 0 100 100"><path d="M20 35 Q50 10, 80 35"/><rect x="48" y="35" width="4" height="40" fill="#C17F5D"/></svg>',
    svgdrop:
      '<svg width="120" height="120" viewBox="0 0 100 100" class="mq-shape--purple"><path d="M20 35 Q50 10, 80 35"/><rect x="48" y="35" width="4" height="40" stroke="#C17F5D"/></svg>',
    level: 2
  },
  {
    id: 'watch',
    classname: 'mq-shape',
    color: 'mq-shape--yellow',
    svgpick:
      '<svg width="120" height="120" viewBox="0 0 100 100"><circle cx="50" cy="50" r="40"/><line x1="50" y1="50" x2="50" y2="30" stroke="#808080" stroke-width="3"/><line x1="50" y1="50" x2="70" y2="50" stroke="#808080" stroke-width="3"/></svg>',
    svgdrop:
      '<svg width="120" height="120" viewBox="0 0 100 100" class="mq-shape--yellow"><circle cx="50" cy="50" r="40"/><line x1="50" y1="50" x2="50" y2="30" stroke="#808080" stroke-width="3"/><line x1="50" y1="50" x2="70" y2="50" stroke="#808080" stroke-width="3"/></svg>',
    level: 2
  }
];

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
    function initializeData() {
      setShapesState([]);
      setDropZone([]);
      setMaxLevel(maxLevel);

      const data = hardcodedShapes.filter((shape) => shape.level === level);
      if (data.length > 0) {
        setShapes(shuffleArray(data));
        const shuffledShapes = shuffleArray(data);
        setShapesState(shuffledShapes);
        setDropZone(data);
      }

      setCurrentLevel(level);
    }

    initializeData();
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
