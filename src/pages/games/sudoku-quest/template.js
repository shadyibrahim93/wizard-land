import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button';
import { getSudokuBoard } from '../../../apiService';
import GameOver from '../../gameover';
import GameIntro from '../../gameintro';

const Game = ({
  setCurrentLevel,
  setCurrentLevelPassed,
  setFinalLevelOver,
  setMaxLevel
}) => {
  const [level, setLevel] = useState(1);
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [solution, setSolution] = useState(''); // Solution to compare against
  const [startGame, setStartGame] = useState(false); // New state to manage game start
  const maxLevel = 10;

  const introText =
    'Welcome to Sudoku! The goal of the game is to fill the 9x9 grid with numbers from 1 to 9. Each row, column, and 3x3 subgrid must contain all the numbers from 1 to 9 without repetition. Use logic and deduction to solve the puzzle. Good luck!';

  useEffect(() => {
    fetchBoard();
  }, [level]); // Refetch board when level changes

  const fetchBoard = async () => {
    setMaxLevel(maxLevel);

    const data = await getSudokuBoard(level);

    if (
      data &&
      data[0] &&
      typeof data[0].puzzle === 'string' &&
      typeof data[0].solution === 'string' &&
      data[0].puzzle.length === 81
    ) {
      const puzzleString = data[0].puzzle;
      const solutionString = data[0].solution;
      const newBoard = [];

      for (let i = 0; i < 9; i++) {
        newBoard.push(
          puzzleString
            .slice(i * 9, (i + 1) * 9)
            .split('')
            .map((value, index) => ({
              value: value === '0' ? '' : value,
              solution: solutionString[i * 9 + index],
              isEditable: value === '0'
            }))
        );
      }

      setBoard(newBoard);
      setSolution(solutionString);
      setCurrentLevel(level);
    }
  };

  const resetLevel = () => {
    setGameOver(false);
    fetchBoard(); // Refetch the same level's board
  };

  const resetGame = () => {
    setLevel(1);
    setGameOver(false);
    fetchBoard(); // Fetch the first level's board
  };

  const checkCompletion = () => {
    // Logic to check if the board is correctly filled by comparing with the solution
    const isSolved = board.every(
      (row) => row.every((cell) => cell.value === cell.solution) // Compare value with the solution
    );
    if (isSolved) {
      if (level < maxLevel) {
        setCurrentLevelPassed(true);
        setLevel((prevLevel) => prevLevel + 1);
        setFinalLevelOver(false);
      } else {
        setFinalLevelOver(true);
        setGameOver(true);
        setMaxLevel(maxLevel - 1);
      }
    } else {
      alert('The puzzle is not solved correctly!');
    }
  };

  const solvePuzzle = () => {
    setBoard((prevBoard) =>
      prevBoard.map((row) =>
        row.map((cell) => ({
          ...cell,
          value: cell.solution
        }))
      )
    );
  };

  return !startGame ? (
    <GameIntro
      introText={introText} // Pass intro text
      onStart={() => setStartGame(true)} // Pass start callback
    />
  ) : !gameOver ? (
    <>
      <div className='mq-sudoku-board'>
        {board.map((row, rowIndex) => (
          <div
            key={rowIndex}
            className='mq-sudoku-row'
          >
            {row.map((cell, cellIndex) => (
              <input
                key={cellIndex}
                type='text'
                value={cell.value}
                onChange={(e) => {
                  const newValue = e.target.value;

                  // Only allow editing empty cells
                  if (cell.isEditable) {
                    setBoard((prevBoard) => {
                      const newBoard = [...prevBoard];
                      newBoard[rowIndex][cellIndex].value = newValue;
                      return newBoard;
                    });
                  }
                }}
                className='mq-sudoku-cell'
                disabled={!cell.isEditable} // Disable input for non-editable cells
              />
            ))}
          </div>
        ))}
      </div>
      <div className='mq-sudoku-btns'>
        <Button
          text='Check'
          onClick={checkCompletion}
        />
        <Button
          text='Restart Level'
          onClick={resetLevel}
        />
      </div>
    </>
  ) : (
    <GameOver resetGame={resetGame} />
  );
};

export default Game;
