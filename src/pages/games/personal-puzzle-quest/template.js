import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import { playUncover } from '../../../hooks/useSound';
import GameIntro from '../../gameintro';

const PersonalPuzzleQuest = ({ setCurrentLevel }) => {
  const [pieces, setPieces] = useState([]);
  const [level, setLevel] = useState('∞'); // Start from level 1
  const [glow, setGlow] = useState(false); // State for glow effect
  const [title, setTitle] = useState('Well Done!'); // State to control h1 visibility
  const [showTitle, setShowTitle] = useState(false); // State to control h1 visibility
  const [uploadedImage, setUploadedImage] = useState(null);
  const [startGame, setStartGame] = useState(false); // New state to manage game start
  const [boardSize, setBoardSize] = useState(600);

  const [customDifficulty, setCustomDifficulty] = useState(3); // Default difficulty is 3

  const introText = `Welcome to the Custom Jigsaw Puzzle! In this game, you can upload your own image and turn it into a puzzle. Your goal is to piece together the scattered puzzle pieces to form the complete image. Drag and drop the pieces into their correct spots. The pieces that are in the right position will appear brighter than the others, helping guide you along the way. Enjoy the challenge of creating your own puzzle and solving it!`;

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
    setCurrentLevel(level);
    initializePuzzlePieces(customDifficulty); // Ensure pieces reinitialize on board size change
  }, [boardSize, level]); // Add boardSize as a dependency

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

  const initializePuzzlePieces = (
    difficulty = Math.min(3 + (level - 1), 10)
  ) => {
    const puzzleSize = difficulty; // Level 1 starts at 3x3, increases up to 6x6
    const pieceWidth = boardSize / puzzleSize;
    const pieceHeight = boardSize / puzzleSize;
    const puzzlePieces = [];

    // Generate the initial positions
    for (let row = 0; row < puzzleSize; row++) {
      for (let col = 0; col < puzzleSize; col++) {
        puzzlePieces.push({
          id: puzzlePieces.length,
          originalPosition: {
            x: col * pieceWidth,
            y: row * pieceHeight
          },
          currentPosition: {
            x: col * pieceWidth, // Temporarily set to originalPosition
            y: row * pieceHeight
          },
          width: pieceWidth,
          height: pieceHeight,
          backgroundPosition: `-${col * pieceWidth}px -${row * pieceHeight}px`, // Offset for background image
          dropped: false,
          correct: false // Track if the piece is correctly placed
        });
      }
    }

    // Shuffle by swapping positions between pieces
    for (let i = 0; i < puzzlePieces.length; i++) {
      const randomIndex = Math.floor(Math.random() * puzzlePieces.length);

      // Swap currentPosition of the current piece and the randomly selected piece
      const tempPosition = puzzlePieces[i].currentPosition;
      puzzlePieces[i].currentPosition =
        puzzlePieces[randomIndex].currentPosition;
      puzzlePieces[randomIndex].currentPosition = tempPosition;
    }

    // Ensure no piece remains in its originalPosition
    for (let piece of puzzlePieces) {
      if (
        piece.currentPosition.x === piece.originalPosition.x &&
        piece.currentPosition.y === piece.originalPosition.y
      ) {
        // Find another piece to swap with
        const otherPiece = puzzlePieces.find(
          (p) =>
            p.id !== piece.id &&
            (p.currentPosition.x !== p.originalPosition.x ||
              p.currentPosition.y !== p.originalPosition.y)
        );

        if (otherPiece) {
          // Swap positions with the other piece
          const tempPosition = piece.currentPosition;
          piece.currentPosition = otherPiece.currentPosition;
          otherPiece.currentPosition = tempPosition;
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
      setLevel('∞');
      playUncover();
      setShowTitle(true);
      setTimeout(() => {
        setGlow(false);
        initializePuzzlePieces();
        setTitle('Upload an Image to Play Again!');
      }, 5000);
    }
  };

  const handleImageUpload = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          // Create a canvas element to resize the image
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');

          // Set the canvas size to 600x600
          canvas.width = 600;
          canvas.height = 600;

          // Draw the image onto the canvas with the desired size
          ctx.drawImage(img, 0, 0, 600, 600);

          // Get the resized image as a data URL
          const resizedImage = canvas.toDataURL('image/jpeg');

          // Set the resized image as the background
          setUploadedImage(resizedImage);
        };

        img.src = e.target.result; // Set the source of the image to the uploaded file
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDifficultyChange = (e) => {
    const value = e.target.value;
    if (value === '' || (value >= 3 && value <= 10)) {
      setCustomDifficulty(value);
    }
  };

  const applySettings = () => {
    setTitle('Well Done!');
    setShowTitle(false);
    initializePuzzlePieces(customDifficulty); // Apply chosen difficulty
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
  ) : (
    <>
      <div className={`mq-settings-container ${glow ? 'glowing' : ''}`}>
        <div className='mq-upload'>
          <input
            className='mq-file-input mq-btn'
            type='file'
            onChange={handleImageUpload}
            accept='image/*'
            id={`mq-upload-input`}
          />
          <label className='mq-settings-label'>Between 3 - 10</label>
          <input
            className='mq-settings-input'
            type='number'
            id='difficulty'
            value={customDifficulty}
            onChange={(e) => handleDifficultyChange(e)}
            min='3'
            max='10'
          />
          <Button
            text='Apply Settings'
            onClick={applySettings}
          />
        </div>
      </div>
      <div
        className={`mq-jigsaw`}
        style={{
          backgroundImage: `url(${uploadedImage})`
        }}
      >
        <div
          className={`mq-board ${glow ? 'glowing' : ''}`}
          onDragOver={handleDragOver}
          onDrop={handleDrop}
        >
          {showTitle && <h1 className={`mq-ending-title`}>{title}</h1>}
          {pieces.map((piece) => (
            <div
              key={piece.id}
              className={`mq-piece ${piece.correct ? 'correct' : ''}`}
              style={{
                backgroundImage: `url(${uploadedImage})`,
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
      <div className='mq-btns-container'>
        <Button
          text='Restart Level'
          onClick={() => initializePuzzlePieces(customDifficulty)}
        />
      </div>
    </>
  );
};

export default PersonalPuzzleQuest;
