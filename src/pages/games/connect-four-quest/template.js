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
  const [board, setBoard] = useState(
    Array(6)
      .fill(null)
      .map(() => Array(7).fill(null))
  );
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('Fire'); // Track the current turn
  const [gameMode, setGameMode] = useState('Single'); // Tracks Single or Multiplayer mode
  const [hoveredColumn, setHoveredColumn] = useState(null);

  const introText = `Welcome to Wizard Land Connect 4! Take turns dropping your discs into columns, aiming to align four in a row. Good luck!`;

  useEffect(() => {
    setCurrentLevel('∞');

    if (winner) {
      setGameOver(true);
      playUncover();
      setShowTitle(true);

      if (winner === 'Fire') setPlayerWins(playerWins + 1);
      if (winner === 'Ice') setComputerWins(computerWins + 1);

      setTimeout(() => {
        playDisappear();
        handleRestart();
      }, 3500);
    }
  }, [winner]);

  const calculateWinner = (board) => {
    const checkDirection = (row, col, deltaRow, deltaCol) => {
      let count = 0;
      const player = board[row][col];

      for (let i = 0; i < 4; i++) {
        const r = row + deltaRow * i;
        const c = col + deltaCol * i;

        if (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === player) {
          count++;
        } else {
          break;
        }
      }

      return count === 4 ? player : null;
    };

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        if (board[row][col]) {
          if (
            checkDirection(row, col, 0, 1) || // Horizontal
            checkDirection(row, col, 1, 0) || // Vertical
            checkDirection(row, col, 1, 1) || // Diagonal down-right
            checkDirection(row, col, 1, -1) // Diagonal down-left
          ) {
            return board[row][col] === '🔥' ? 'Fire' : 'Ice';
          }
        }
      }
    }

    return null;
  };

  const isBoardFull = (squares) => {
    return squares.every((square) => square !== null);
  };

  const handleClick = (col) => {
    playPlaceObject();
    if (gameOver || (gameMode === 'Single' && currentTurn !== 'Fire')) return;

    // Check if the column is full
    if (board[0][col] !== null) {
      return; // Do nothing if the column is full
    }

    const newBoard = board.map((row) => [...row]);

    for (let row = 5; row >= 0; row--) {
      if (!newBoard[row][col]) {
        newBoard[row][col] = currentTurn === 'Fire' ? '🔥' : '❄️';
        break;
      }
    }

    setBoard(newBoard);

    const currentWinner = calculateWinner(newBoard);
    if (currentWinner) {
      setWinner(currentWinner);
      playNextLevel();
      triggerConfetti();
      return;
    }

    if (isBoardFull(newBoard.flat())) {
      setWinner(null); // No winner indicates a draw
      setGameOver(true);
      playUncover();
      setShowTitle(true);
      setTimeout(() => {
        playDisappear();
        handleRestart();
      }, 3500);
      return;
    }

    if (gameMode === 'Single' && currentTurn === 'Fire') {
      setCurrentTurn('Ice');
      handleComputerMove(newBoard);
    } else if (gameMode === 'Multiplayer') {
      setCurrentTurn(currentTurn === 'Fire' ? 'Ice' : 'Fire'); // Alternate turns
    }
  };

  const handleComputerMove = (currentBoard) => {
    const newBoard = currentBoard.map((row) => [...row]);

    const checkForWinOrBlock = (player) => {
      for (let col = 0; col < 7; col++) {
        for (let row = 5; row >= 0; row--) {
          if (!newBoard[row][col]) {
            newBoard[row][col] = player;
            const isWinningMove =
              calculateWinner(newBoard) === (player === '❄️' ? 'Ice' : 'Fire');
            newBoard[row][col] = null;

            if (isWinningMove) return col;
            break;
          }
        }
      }
      return null;
    };

    setTimeout(() => {
      playPlaceObject();

      const winningMove = checkForWinOrBlock('❄️');
      if (winningMove !== null) {
        for (let row = 5; row >= 0; row--) {
          if (!newBoard[row][winningMove]) {
            newBoard[row][winningMove] = '❄️';
            setBoard(newBoard);
            const computerWinner = calculateWinner(newBoard);
            if (computerWinner) setWinner(computerWinner);
            setCurrentTurn('Fire');
            return;
          }
        }
      }

      const blockingMove = checkForWinOrBlock('🔥');
      if (blockingMove !== null) {
        for (let row = 5; row >= 0; row--) {
          if (!newBoard[row][blockingMove]) {
            newBoard[row][blockingMove] = '❄️';
            setBoard(newBoard);
            setCurrentTurn('Fire');
            return;
          }
        }
      }

      const emptyColumns = [];
      for (let col = 0; col < 7; col++) {
        for (let row = 5; row >= 0; row--) {
          if (!newBoard[row][col]) {
            emptyColumns.push(col);
            break;
          }
        }
      }

      if (emptyColumns.length > 0) {
        const randomCol =
          emptyColumns[Math.floor(Math.random() * emptyColumns.length)];
        for (let row = 5; row >= 0; row--) {
          if (!newBoard[row][randomCol]) {
            newBoard[row][randomCol] = '❄️';
            setBoard(newBoard);
            setCurrentTurn('Fire');
            return;
          }
        }
      }
    }, 2000);
  };

  const getLowestOpenRow = (col) => {
    for (let row = 5; row >= 0; row--) {
      if (!board[row][col]) return row;
    }
    return -1;
  };

  const handleRestart = () => {
    const newBoard = Array(6)
      .fill(null)
      .map(() => Array(7).fill(null));

    setBoard(newBoard);
    setGameOver(false);
    setWinner(null);
    setShowTitle(false);

    if (winner === 'Fire') {
      setCurrentTurn('Fire');
    } else if (winner === 'Ice') {
      setCurrentTurn('Ice');
      if (gameMode === 'Single') {
        setTimeout(() => {
          handleComputerMove(newBoard);
        }, 500);
      }
    } else {
      // For a draw, reset and Fire starts the next game
      setCurrentTurn('Fire');
    }

    playDisappear();
  };

  const resetScore = () => {
    setComputerWins(0);
    setPlayerWins(0);
  };

  const title =
    gameOver && winner === null
      ? "It's a Draw!"
      : winner
      ? `${winner} wins!`
      : `Your Turn: ${currentTurn}`;

  return !startGame ? (
    <GameIntro
      introText={introText}
      onStart={() => {
        setGameMode('Single');
        setStartGame(true);
      }}
      firstButtonText='Single Player'
      onSecondButtonClick={() => {
        setGameMode('Multiplayer');
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

          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`mq-square ${
                  cell ? `mq-${cell.toLowerCase()}` : ''
                } ${
                  hoveredColumn === colIndex &&
                  rowIndex === getLowestOpenRow(colIndex)
                    ? 'mq-fire-preview'
                    : ''
                }`}
                onClick={() => handleClick(colIndex)}
                onMouseEnter={() => setHoveredColumn(colIndex)}
                onMouseLeave={() => setHoveredColumn(null)}
              >
                {cell}
              </div>
            ))
          )}
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
