import React, { useState, useEffect } from 'react';
import GameIntro from '../../gameintro';
import { playUncover, playDisappear } from '../../../hooks/useSound';
import Button from '../../../components/Button';
import { triggerConfetti } from '../../../hooks/useConfetti';

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
    generateBingoBoard(),
    generateBingoBoard()
  ]);
  const [drawnNumbers, setDrawnNumbers] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [markedCells, setMarkedCells] = useState([]);

  const introText = `Welcome to Wizards Land Bingo! A magical game where numbers are drawn and marked on your board. Be the first to complete a row, column, or diagonal to shout ‘Bingo!’ and win. Let’s see who’s the luckiest wizard today!`;

  useEffect(() => {
    setCurrentLevel('∞');
  }, []);

  useEffect(() => {
    if (drawnNumbers.length > 0) {
      checkWin();
    }
  }, [drawnNumbers]);

  useEffect(() => {
    if (winner) {
      setGameOver(true);
      playUncover();
      triggerConfetti();

      setTimeout(() => {
        playDisappear();
        handleRestart();
      }, 5000);
    }
  }, [winner]);

  const drawNumber = () => {
    if (gameOver) return;
    let newNumber;
    do {
      newNumber = Math.floor(Math.random() * 75) + 1;
    } while (drawnNumbers.includes(newNumber));

    setDrawnNumbers((prev) => [...prev, newNumber]); // Triggers checkWin via useEffect
    markBoards(newNumber);
  };

  const markPlayerBoard = (number) => {
    if (!drawnNumbers.includes(number)) return;
    setPlayerBoard((prev) =>
      prev.map((row) => row.map((cell) => (cell === number ? cell : cell)))
    );
    setMarkedCells((prev) => [...prev, number]);
    checkWin();
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
    checkWin();
  };

  const checkWin = () => {
    const checkBingo = (board) => {
      const checkRow = board.some((row) =>
        row.every((cell) => drawnNumbers.includes(cell))
      );
      const checkColumn = [...Array(5)].some((_, colIndex) =>
        board.every((row) => drawnNumbers.includes(row[colIndex]))
      );
      const checkDiagonalLeftToRight = board.every((row, rowIndex) =>
        drawnNumbers.includes(row[rowIndex])
      );
      const checkDiagonalRightToLeft = board.every((row, rowIndex) =>
        drawnNumbers.includes(row[4 - rowIndex])
      );

      return (
        checkRow ||
        checkColumn ||
        checkDiagonalLeftToRight ||
        checkDiagonalRightToLeft
      );
    };

    // Check for winners
    const players = ['You', 'Computer1', 'Computer2'];
    for (let i = 0; i < players.length; i++) {
      const board = i === 0 ? playerBoard : computerBoards[i - 1];
      if (checkBingo(board)) {
        setWinner(players[i]);
        return;
      }
    }
    console.log('No winner yet.');
  };

  const handleRestart = () => {
    setPlayerBoard(generateBingoBoard());
    setComputerBoards([
      generateBingoBoard(),
      generateBingoBoard(),
      generateBingoBoard()
    ]);
    setDrawnNumbers([]);
    setGameOver(false);
    setWinner(null);
    setMarkedCells([]);
    playDisappear();
  };

  const renderBoard = (board, playerName) => (
    <div
      className={`mq-board ${
        playerName === 'You'
          ? 'mq-board--player'
          : `mq-board--${playerName.toLowerCase()}`
      }`}
    >
      {winner === playerName && <h1 className='mq-ending-title'>Bingo</h1>}
      {['B', 'I', 'N', 'G', 'O'].map((letter, colIndex) => (
        <div
          key={colIndex}
          className='mq-column'
        >
          <div className='mq-square mq-square--bingo'>{letter}</div>
          {board.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className={`mq-square ${
                drawnNumbers.includes(row[colIndex]) ||
                markedCells.includes(row[colIndex])
                  ? 'drawn'
                  : ''
              }`}
              onClick={() =>
                playerName === 'You' && markPlayerBoard(row[colIndex])
              }
            >
              {row[colIndex]}
            </div>
          ))}
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
            {renderBoard(computerBoards[0], 'Computer1')}
          </div>
          <div>
            <h1 className='mq-bingo-title'>Fire</h1>
            {renderBoard(playerBoard, 'You')}
          </div>
          <div>
            <h1 className='mq-bingo-title--computer'>Ice 2</h1>
            {renderBoard(computerBoards[1], 'Computer2')}
          </div>
        </div>
      </div>
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
      <div className='mq-draw-button-container'>
        <Button
          text='Draw Number'
          onClick={drawNumber}
        />
      </div>
    </div>
  );
};

export default Game;
