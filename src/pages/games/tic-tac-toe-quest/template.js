import React, { useState, useEffect } from 'react';
import GameIntro from '../../gameintro';
import {
  playUncover,
  playDisappear,
  playPlaceObject,
  playNextLevel
} from '../../../hooks/useSound';
import Button from '../../../components/Button';
import { triggerConfetti } from '../../../hooks/useConfetti';

const Game = ({ setCurrentLevel }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('Fire'); // Track the current turn
  const [computerStarts, setComputerStarts] = useState(false);
  const [gameMode, setGameMode] = useState('Single'); // Track whether it's Single or Multiplayer mode

  const introText = `Welcome to Tic Tac Toe! Play as '🔥', and the computer will play as '❄️'. Take turns placing your marks, aiming to align three in a row. Good luck!`;

  useEffect(() => {
    setCurrentLevel('∞');

    if (winner || isBoardFull(board)) {
      setGameOver(true);
      playUncover();
      setShowTitle(true);

      if (winner === 'Fire') {
        setPlayerWins(playerWins + 1); // Increment player wins
      }

      if (winner === 'Ice') {
        setComputerWins(computerWins + 1);
        setComputerStarts(true); // Computer starts next game
      }

      // Automatically restart the game after 3.5 seconds
      setTimeout(() => {
        handleRestart();
      }, 3500);
    }
  }, [winner, board]);

  const findBestMove = (squares, player) => {
    const lines = [
      [0, 1, 2], // Rows
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6], // Columns
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8], // Diagonals
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] === player && squares[b] === player && squares[c] === null)
        return c;
      if (squares[a] === player && squares[c] === player && squares[b] === null)
        return b;
      if (squares[b] === player && squares[c] === player && squares[a] === null)
        return a;
    }

    return null; // No move found
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        playNextLevel();
        triggerConfetti();
        return squares[a] === '🔥' ? 'Fire' : 'Ice'; // Use Fire/Ice
      }
    }
    return null;
  };

  const isBoardFull = (squares) => {
    return squares.every((square) => square !== null);
  };

  const handleClick = (index) => {
    playPlaceObject();
    if (
      board[index] ||
      gameOver ||
      (gameMode === 'Single' && currentTurn !== 'Fire')
    )
      return;

    const newBoard = [...board];
    newBoard[index] = currentTurn === 'Fire' ? '🔥' : '❄️'; // Assign based on current turn
    setBoard(newBoard);

    const userWinner = calculateWinner(newBoard);
    if (userWinner) {
      setWinner(userWinner);
      return;
    }

    if (isBoardFull(newBoard)) {
      setWinner(null); // Mark as a draw (no winner)
      return;
    }

    if (gameMode === 'Single' && currentTurn === 'Fire') {
      setCurrentTurn('Ice'); // Switch to Computer's turn
      handleComputerMove(newBoard);
    } else {
      setCurrentTurn(currentTurn === 'Fire' ? 'Ice' : 'Fire'); // Alternate turns in Multiplayer
    }
  };

  const handleComputerMove = (currentBoard) => {
    const newBoard = [...currentBoard];

    setTimeout(() => {
      playPlaceObject();
      const winningMove = findBestMove(newBoard, '❄️');
      if (winningMove !== null) {
        newBoard[winningMove] = '❄️'; // Computer's move
        setBoard(newBoard);

        const computerWinner = calculateWinner(newBoard);
        if (computerWinner) {
          setWinner(computerWinner);
        } else {
          setCurrentTurn('Fire'); // Switch turn back to Fire
        }
        return;
      }

      const blockingMove = findBestMove(newBoard, '🔥');
      if (blockingMove !== null) {
        newBoard[blockingMove] = '❄️';
        setBoard(newBoard);

        const computerWinner = calculateWinner(newBoard);
        if (computerWinner) {
          setWinner(computerWinner);
        } else {
          setCurrentTurn('Fire'); // Switch turn back to Fire
        }
        return;
      }

      const emptySquares = newBoard
        .map((value, idx) => (value === null ? idx : null))
        .filter((v) => v !== null);

      if (emptySquares.length > 0) {
        const computerMove =
          emptySquares[Math.floor(Math.random() * emptySquares.length)];
        newBoard[computerMove] = '❄️';

        setBoard(newBoard);

        const computerWinner = calculateWinner(newBoard);
        if (computerWinner) {
          setWinner(computerWinner);
        } else {
          setCurrentTurn('Fire'); // Switch turn back to Fire
        }
      }
    }, 2000); // Adds a 2-second delay
  };

  const handleRestart = () => {
    const initialBoard = Array(9).fill(null);
    setBoard(initialBoard);
    setGameOver(false);
    setWinner(null);
    setShowTitle(false);

    // Set first turn dynamically based on previous winner
    if (gameMode === 'Single' && winner === 'Ice') {
      setCurrentTurn('Ice');
      setTimeout(() => {
        handleComputerMove(initialBoard);
      }, 500); // Delay for smooth restart
    } else {
      setCurrentTurn('Fire');
    }

    playDisappear();
  };

  const resetScore = () => {
    setComputerWins(0);
    setPlayerWins(0);
  };

  const title =
    winner === null && isBoardFull(board)
      ? "It's a Draw!"
      : winner
      ? `${winner} wins!`
      : `Your Turn: ${currentTurn}`;

  return !startGame ? (
    <GameIntro
      introText={introText}
      onStart={() => {
        setGameMode('Single'); // Default to Single Player
        setStartGame(true);
      }}
      firstButtonText='Single Player'
      onSecondButtonClick={() => {
        setGameMode('Multiplayer'); // Set Multiplayer mode
        setStartGame(true);
      }}
      secondButtonText='Multiplayer'
    />
  ) : (
    <>
      <div className={`mq-global-container mq-${currentTurn.toLowerCase()}`}>
        <div className='mq-score-container'>
          <span className='mq-score-player'>Fire: {playerWins}</span>
          <span className='mq-score-computer'>Ice: {computerWins}</span>
        </div>
        <div className={`mq-board mq-${currentTurn.toLowerCase()}`}>
          {showTitle && (
            <h1
              className={`mq-ending-title ${
                winner === 'Ice' && 'glowingBlue-text'
              }`}
            >
              {title}
            </h1>
          )}

          {board.map((square, index) => (
            <div
              key={index}
              className={`mq-square ${
                square ? `mq-${square === '🔥' ? 'Fire' : 'Ice'}` : ''
              }`}
              onClick={() => handleClick(index)}
            >
              {square}
            </div>
          ))}
        </div>
      </div>
      <Button
        text='Reset Score'
        onClick={resetScore}
      />
    </>
  );
};

export default Game;
