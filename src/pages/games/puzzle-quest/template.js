import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import GameOver from '../../gameFlow/gameover';
import level1Image from '../../../assets/images/jigsaw/puzzlelevel1.jpg';
import level2Image from '../../../assets/images/jigsaw/puzzlelevel2.jpg';
import level3Image from '../../../assets/images/jigsaw/puzzlelevel3.jpg';
import level4Image from '../../../assets/images/jigsaw/puzzlelevel4.jpg';
import level5Image from '../../../assets/images/jigsaw/puzzlelevel5.jpg';
import level6Image from '../../../assets/images/jigsaw/puzzlelevel6.jpg';
import { playTeleport, playUncover } from '../../../hooks/useSound';
import GameIntro from '../../gameFlow/gameintro';

const levelImages = [
  { image: level1Image, title: 'Cairo - Egypt' },
  { image: level2Image, title: 'Paris - France' },
  { image: level3Image, title: 'Beijing - China' },
  { image: level4Image, title: 'Rome - Italy' },
  { image: level5Image, title: 'Rio de Janeiro - Brazil' },
  { image: level6Image, title: 'Dubai - Emirates' }
];

const PuzzleQuest = ({
  setCurrentLevel,
  setCurrentLevelPassed,
  setFinalLevelOver,
  setMaxLevel
}) => {
  const [pieces, setPieces] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [level, setLevel] = useState(1);
  const [glow, setGlow] = useState(false); // State for glow effect
  const [showTitle, setShowTitle] = useState(false); // State to control h1 visibility
  const [startGame, setStartGame] = useState(false); // New state to manage game start
  const [boardSize, setBoardSize] = useState(600);
  const maxLevel = 6;

  const introText = `Welcome to the Jigsaw Puzzle! Your goal is to piece together the scattered puzzle pieces to form a complete image. Drag and drop the pieces into their correct spots. The pieces that are in the right position will appear brighter than the others, helping guide you along the way. Take your time, and enjoy the challenge of completing the picture!`;

  useEffect(() => {
    const updateBoardSize = () => {
      const isSmallScreen = window.matchMedia('(max-width: 480px)').matches;
      setBoardSize(isSmallScreen ? 300 : 600);
    };

    updateBoardSize(); // Set board size on mount
    window.addEventListener('resize', updateBoardSize);

    return () => {
      window.removeEventListener('resize', updateBoardSize);
    };
  }, []); // Runs only on mount

  useEffect(() => {
    initializePuzzlePieces();
    setCurrentLevel(level);
    setMaxLevel(maxLevel);
  }, [boardSize, level]);

  const validatePieces = () => {
    setPieces((prevPieces) =>
      prevPieces.map((piece) => ({
        ...piece,
        correct:
          piece.currentPosition.x === piece.originalPosition.x &&
          piece.currentPosition.y === piece.originalPosition.y
      }))
    );
  };

  const initializePuzzlePieces = () => {
    const puzzleSize = Math.min(3 + (level - 1), 10); // Level 1 starts at 3x3, increases up to 6x6
    const pieceWidth = boardSize / puzzleSize;
    const pieceHeight = boardSize / puzzleSize;
    const puzzlePieces = [];

    // Generate the initial positions
    for (let row = 0; row < puzzleSize; row++) {
      for (let col = 0; col < puzzleSize; col++) {
        puzzlePieces.push({
          id: puzzlePieces.length,
          originalPosition: { x: col * pieceWidth, y: row * pieceHeight },
          currentPosition: { x: col * pieceWidth, y: row * pieceHeight },
          width: pieceWidth,
          height: pieceHeight,
          backgroundPosition: `-${col * pieceWidth}px -${row * pieceHeight}px`,
          dropped: false,
          correct: false
        });
      }
    }

    // Shuffle by swapping positions between pieces
    for (let i = 0; i < puzzlePieces.length; i++) {
      const randomIndex = Math.floor(Math.random() * puzzlePieces.length);
      [
        puzzlePieces[i].currentPosition,
        puzzlePieces[randomIndex].currentPosition
      ] = [
        puzzlePieces[randomIndex].currentPosition,
        puzzlePieces[i].currentPosition
      ];
    }

    // Ensure no piece remains in its original position
    for (let piece of puzzlePieces) {
      if (
        piece.currentPosition.x === piece.originalPosition.x &&
        piece.currentPosition.y === piece.originalPosition.y
      ) {
        const otherPiece = puzzlePieces.find(
          (p) =>
            p.id !== piece.id &&
            (p.currentPosition.x !== p.originalPosition.x ||
              p.currentPosition.y !== p.originalPosition.y)
        );

        if (otherPiece) {
          [piece.currentPosition, otherPiece.currentPosition] = [
            otherPiece.currentPosition,
            piece.currentPosition
          ];
        }
      }
    }

    setPieces(puzzlePieces);
    validatePieces();
  };

  const handleDragStart = (e, piece) => {
    e.dataTransfer.setData('pieceId', piece.id);
    validatePieces();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const pieceId = parseInt(e.dataTransfer.getData('pieceId'), 10);
    const droppedPiece = pieces.find((p) => p.id === pieceId);

    const puzzleBoardRect = e.target
      .closest('.mq-board')
      .getBoundingClientRect();
    const dropX = e.clientX - puzzleBoardRect.left;
    const dropY = e.clientY - puzzleBoardRect.top;

    const newPosX = Math.min(
      Math.max(0, dropX - (dropX % droppedPiece.width)),
      puzzleBoardRect.width - droppedPiece.width
    );
    const newPosY = Math.min(
      Math.max(0, dropY - (dropY % droppedPiece.height)),
      puzzleBoardRect.height - droppedPiece.height
    );

    const newPieces = [...pieces];
    // Check for overlap with other pieces
    const overlappedPiece = newPieces.find(
      (p) =>
        p.id !== droppedPiece.id &&
        p.currentPosition.x < newPosX + droppedPiece.width &&
        p.currentPosition.x + droppedPiece.width > newPosX &&
        p.currentPosition.y < newPosY + droppedPiece.height &&
        p.currentPosition.y + droppedPiece.height > newPosY
    );

    if (overlappedPiece) {
      // Swap positions if overlap is detected
      const tempPosition = droppedPiece.currentPosition;
      droppedPiece.currentPosition = overlappedPiece.currentPosition;
      overlappedPiece.currentPosition = tempPosition;
    } else {
      // If no overlap, update position of the dropped piece
      droppedPiece.currentPosition = { x: newPosX, y: newPosY };
    }

    // Check if piece is in the correct position
    droppedPiece.correct =
      droppedPiece.currentPosition.x === droppedPiece.originalPosition.x &&
      droppedPiece.currentPosition.y === droppedPiece.originalPosition.y;

    setPieces(newPieces);
    checkCompletion(newPieces);
    validatePieces();
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const checkCompletion = (newPieces) => {
    const isComplete = newPieces.every(
      (piece) =>
        piece.currentPosition.x === piece.originalPosition.x &&
        piece.currentPosition.y === piece.originalPosition.y
    );

    if (isComplete) {
      // Trigger glow effect immediately
      setGlow(true);

      // Handle level progression or game over
      if (level < maxLevel) {
        setCurrentLevelPassed(true);
        setTimeout(() => {
          playUncover();
          setShowTitle(true); // Show title
        }, 2000);
        setTimeout(() => {
          setGlow(false);
          setLevel((prevLevel) => prevLevel + 1);
          setFinalLevelOver(false);
          setShowTitle(false);
          playTeleport();
        }, 5000); // Remove glow after 2 seconds
      } else {
        setTimeout(() => {
          playUncover();
          setShowTitle(true); // Show title
        }, 2000);
        setTimeout(() => {
          setFinalLevelOver(true);
          setGameOver(true);
          setShowTitle(false);
          setMaxLevel(maxLevel - 1);
        }, 5000);
      }
    }
  };

  const restartGame = () => {
    setLevel(1);
    setGameOver(false);
    setGlow(false); // Reset glow when restarting game
    initializePuzzlePieces();
  };

  // Solve Puzzle for testing
  const solvePuzzle = () => {
    setPieces((prevPieces) =>
      prevPieces.map((piece) => ({
        ...piece,
        currentPosition: { ...piece.originalPosition }, // Set pieces to their original positions
        correct: true // Mark all pieces as correct
      }))
    );
    checkCompletion(pieces);
  };

  return !startGame ? (
    <GameIntro
      introText={introText} // Pass intro text
      onStart={() => setStartGame(true)} // Pass start callback
    />
  ) : !gameOver ? (
    <>
      <div
        className='mq-jigsaw'
        style={{
          backgroundImage: `url(${levelImages[level - 1].image})`
        }}
      >
        {/* Puzzle Board */}
        <div
          className={`mq-board ${glow ? 'glowing' : ''}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {showTitle && (
            <h1 className='mq-ending-title'>{levelImages[level - 1].title}</h1>
          )}{' '}
          {pieces.map((piece) => (
            <div
              key={piece.id}
              className={`mq-piece ${piece.correct ? 'correct' : ''}`}
              style={{
                backgroundImage: `url(${levelImages[level - 1].image})`,
                backgroundPosition: piece.backgroundPosition,
                width: `${piece.width}px`,
                height: `${piece.height}px`,
                position: 'absolute',
                top: `${piece.currentPosition.y}px`,
                left: `${piece.currentPosition.x}px`,
                zIndex: piece.dropped ? 1 : 0
              }}
              draggable
              onDragStart={(e) => handleDragStart(e, piece)}
            />
          ))}
        </div>
      </div>

      {/* Control Buttons */}
      <div className='mq-btns-container'>
        <Button
          text='Restart Level'
          onClick={initializePuzzlePieces}
        />
        {level > 1 && (
          <Button
            text='Restart Game'
            onClick={restartGame}
          />
        )}
      </div>
    </>
  ) : (
    <GameOver resetGame={restartGame} />
  );
};

export default PuzzleQuest;
