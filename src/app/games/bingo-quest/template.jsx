'use client';
import React, { useState, useEffect, useRef } from 'react';
import GameIntro from '../../../components/gameFlow/gameintro.jsx';
import {
  playUncover,
  playDisappear,
  playClick,
  playDefeat,
  playNextLevel
} from '../../../hooks/useSound.js';
import Button from '../../../components/Button.js';
import { triggerConfetti } from '../../../hooks/useConfetti.js';

const generateBingoBoard = () => {
  const numbers = Array.from({ length: 75 }, (_, i) => i + 1);
  for (let i = numbers.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [numbers[i], numbers[j]] = [numbers[j], numbers[i]];
  }
  return Array.from({ length: 5 }, () => numbers.splice(0, 5));
};

const Game = ({ setCurrentLevel }) => {
  const [playerBoard, setPlayerBoard] = useState(generateBingoBoard());
  const [computerBoards, setComputerBoards] = useState([
    generateBingoBoard(),
    generateBingoBoard()
  ]);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [markedCells, setMarkedCells] = useState([]);
  const [winningNumbers, setWinningNumbers] = useState([]);

  // Refs for scrolling to winner
  const playerRef = useRef(null);
  const computer1Ref = useRef(null);
  const computer2Ref = useRef(null);

  const introText = `Welcome to Wizard Land Bingo! Click on the Draw a number button, then click on the matching number on your board to mark it. Be the first to complete a row, column, or diagonal to shout ‘Bingo!’ and win. Let’s see who’s the luckiest wizard today!`;

  useEffect(() => {
    if (drawnNumbers.length > 0) {
      checkComputerWin();
    }
  }, [drawnNumbers]);

  useEffect(() => {
    if (winner) {
      if (winner != 'You') {
        playDefeat();
      } else {
        playNextLevel();
        triggerConfetti();
      }

      // Scroll to the winner's board
      const winnerRef =
        winner === 'You'
          ? playerRef
          : winner === 'Computer1'
          ? computer1Ref
          : computer2Ref;
      winnerRef?.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });

      setTimeout(() => {
        setGameOver(true);
        playUncover();
      }, 4000);

      setTimeout(() => {
        playDisappear();
        handleRestart();
        setDrawnNumbers([]);
      }, 8000);
    }
  }, [winner]);

  const drawNumber = () => {
    if (gameOver) return;
    let newNumber;
    do {
      newNumber = Math.floor(Math.random() * 75) + 1;
    } while (drawnNumbers.includes(newNumber));

    playDisappear();
    setDrawnNumbers((prev) => [...prev, newNumber]);
    markBoards(newNumber);
  };

  const markPlayerBoard = (number) => {
    if (!drawnNumbers.includes(number) || markedCells.includes(number)) return; // Ensure it's valid and not already marked
    setMarkedCells((prev) => [...prev, number]);
    playClick();
    checkPlayerWin();
  };

  const markComputerBoard = (board, number) => {
    return board.map((row) =>
      row.map((cell) => (cell === number ? cell : cell))
    );
  };

  const markBoards = (number) => {
    setComputerBoards((prevBoards) =>
      prevBoards.map((board) => markComputerBoard(board, number))
    );
    checkComputerWin();
  };

  const checkBingo = (board, drawnNumbers) => {
    for (let row of board) {
      if (row.every((cell) => drawnNumbers.includes(cell))) {
        setWinningNumbers(row);
        return true;
      }
    }

    for (let colIndex = 0; colIndex < 5; colIndex++) {
      const column = board.map((row) => row[colIndex]);
      if (column.every((cell) => drawnNumbers.includes(cell))) {
        setWinningNumbers(column);
        return true;
      }
    }

    const diagonalLeftToRight = board.map((row, index) => row[index]);
    if (diagonalLeftToRight.every((cell) => drawnNumbers.includes(cell))) {
      setWinningNumbers(diagonalLeftToRight);
      return true;
    }

    const diagonalRightToLeft = board.map((row, index) => row[4 - index]);
    if (diagonalRightToLeft.every((cell) => drawnNumbers.includes(cell))) {
      setWinningNumbers(diagonalRightToLeft);
      return true;
    }

    return false;
  };

  const checkComputerWin = () => {
    const players = ['Computer1', 'Computer2'];
    for (let i = 0; i < players.length; i++) {
      const board = computerBoards[i];
      if (checkBingo(board, drawnNumbers)) {
        playUncover();
        setWinner(players[i]);
        return;
      }
    }
  };

  const checkPlayerWin = () => {
    const player = 'You';
    const board = playerBoard;
    if (checkBingo(board, drawnNumbers)) {
      playUncover();
      setWinner(player);
      return;
    }
  };

  const handleRestart = () => {
    setDrawnNumbers([]);
    setGameOver(false);
    setWinner(null);
    setMarkedCells([]);
    playDisappear();
    setPlayerBoard(generateBingoBoard());
    setComputerBoards([generateBingoBoard(), generateBingoBoard()]);
    setWinningNumbers([]);
  };

  const renderBoard = (board, playerName, ref) => (
    <div
      ref={ref}
      className={`mq-board ${
        playerName === 'You'
          ? 'mq-board--player'
          : `mq-board--${playerName.toLowerCase()}`
      } ${gameOver && 'mq-board-game-over'}`}
    >
      {gameOver && winner === playerName && (
        <h1 className='mq-ending-title'>Bingo</h1>
      )}
      {['B', 'I', 'N', 'G', 'O'].map((letter, colIndex) => (
        <div
          key={colIndex}
          className='mq-column'
        >
          <div className='mq-square mq-square--bingo'>{letter}</div>
          {board.map((row, rowIndex) => {
            const cellValue = row[colIndex];
            return (
              <div
                key={rowIndex}
                className={`mq-square ${
                  (playerName !== 'You' && drawnNumbers.includes(cellValue)) ||
                  (playerName === 'You' && markedCells.includes(cellValue))
                    ? 'drawn'
                    : ''
                } ${
                  winner === playerName && winningNumbers.includes(cellValue)
                    ? 'winner-number'
                    : ''
                }`}
                onClick={() =>
                  playerName === 'You' && markPlayerBoard(cellValue)
                }
              >
                {cellValue}
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );

  return !startGame ? (
    <GameIntro
      introText={introText}
      onStart={() => setStartGame(true)}
    />
  ) : (
    <div className='mq-game-container'>
      <div className='mq-bingo-game'>
        <div className='mq-global-container mq-bingo-row'>
          <div>
            <h1 className='mq-bingo-title--computer'>Ice 1</h1>
            {renderBoard(computerBoards[0], 'Computer1', computer1Ref)}
          </div>
          <div>
            <h1 className='mq-bingo-title'>Fire</h1>
            {renderBoard(playerBoard, 'You', playerRef)}
          </div>
          <div>
            <h1 className='mq-bingo-title--computer'>Ice 2</h1>
            {renderBoard(computerBoards[1], 'Computer2', computer2Ref)}
          </div>
        </div>
      </div>
      <div className='mq-control-container'>
        {!gameOver && (
          <div className='mq-drawn-numbers-container'>
            {drawnNumbers.map((num, index) => (
              <span
                key={index}
                className='mq-drawn-number'
              >
                {num}
              </span>
            ))}
          </div>
        )}
        <div className='mq-draw-button-container'>
          <Button
            text='Draw Number'
            onClick={drawNumber}
          />
        </div>
      </div>
    </div>
  );
};

export default Game;
