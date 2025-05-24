'use client';
import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button.js';
import GameOver from '../../../components/gameFlow/gameover.jsx';
import GameIntro from '../../../components/gameFlow/gameintro.jsx';
import { toast } from 'react-toastify';

// Hardcoded levels
const sudokuLevels = {
  1: {
    puzzle:
      '530070000600195000098000060800060003400803001700020006060000280000419005000080079',
    solution:
      '534678912672195348198342567859761423426853791713924856961537284287419635345286179'
  },
  2: {
    puzzle:
      '200080300060070084030500209000105408000000000402706000301007040720040060004010003',
    solution:
      '245986371169372584837541269973125468658439127412768935391657842726894653584213796'
  },
  3: {
    puzzle:
      '600120384008459072000006005000264030070000290091003000500010000402000600000058001',
    solution:
      '697128384318459672254376915845267139736841295291583746569312847472985613183654927'
  },
  4: {
    puzzle:
      '005300000800000020070010500400005300010070006003200080060500009004000030000009700',
    solution:
      '145327698839654127672918543426895371918473256753261984367542819594186732281739465'
  },
  5: {
    puzzle:
      '000000907000420180000705026100904000050000040000507009920108000034059000507000000',
    solution:
      '643218957795426183281735426176934852359862741842517639928143675134659278567381294'
  },
  6: {
    puzzle:
      '300200000000107000706030500070009080900020004010800050009040301000702000000008006',
    solution:
      '385294167429157638716836549572469183968523714143875952859642371631782495247918326'
  },
  7: {
    puzzle:
      '000260701680070090190004500820100040004602900050003028009300074040050036703018000',
    solution:
      '345269781682571493197834562826195347734682915951743628519326874248957136763418259'
  },
  8: {
    puzzle:
      '008000000600020050090003008000100007002806300500009000900600030070050006000000800',
    solution:
      '218465973637928154495713268389142567742856391561379482954687321873251649126934875'
  },
  9: {
    puzzle:
      '000900003040002000600005007030000080200418006090000020500700009000800070100006000',
    solution:
      '812974563745362198639185247437629581251418736698537424563741829924853671176296354'
  },
  10: {
    puzzle:
      '003000400000605000010002060060000020800401003020000050030700080000509000009000200',
    solution:
      '673218495248675319915342867467853921859421673321967854532794186184529736796136542'
  }
};

const Game = ({
  setCurrentLevel,
  setCurrentLevelPassed,
  setFinalLevelOver,
  setMaxLevel
}) => {
  const [level, setLevel] = useState(1);
  const [board, setBoard] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [solution, setSolution] = useState('');
  const [startGame, setStartGame] = useState(false);
  const maxLevel = 10;

  const introText =
    'Welcome to Sudoku! Your mission is to fill the 9x9 grid with numbers from 1 to 9. Click on any empty box, enter a number between 1 and 9, and make sure each row, column, and 3x3 subgrid contains all the numbers without any repeats. Once the board is complete, hit the "Check" button to see if you’ve cracked the puzzle. Ready to challenge your mind and solve the mystery? Good luck!';

  useEffect(() => {
    fetchBoard();
  }, [level]);

  const fetchBoard = () => {
    setMaxLevel(maxLevel);
    const levelData = sudokuLevels[level];

    if (
      levelData &&
      typeof levelData.puzzle === 'string' &&
      typeof levelData.solution === 'string' &&
      levelData.puzzle.length === 81
    ) {
      const puzzleString = levelData.puzzle;
      const solutionString = levelData.solution;
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
    fetchBoard();
  };

  const resetGame = () => {
    setLevel(1);
    setGameOver(false);
    fetchBoard();
  };

  const checkCompletion = () => {
    const isSolved = board.every((row) =>
      row.every((cell) => cell.value === cell.solution)
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
      toast.warn('The puzzle is not solved correctly!');
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
      introText={introText}
      onStart={() => setStartGame(true)}
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
                type='number'
                value={cell.value}
                onChange={(e) => {
                  const newValue = e.target.value;
                  if (cell.isEditable && /^[1-9]?$/.test(newValue)) {
                    setBoard((prevBoard) => {
                      const newBoard = [...prevBoard];
                      newBoard[rowIndex][cellIndex].value = newValue;
                      return newBoard;
                    });
                  }
                }}
                className='mq-sudoku-cell'
                disabled={!cell.isEditable}
              />
            ))}
          </div>
        ))}
      </div>
      <div className='mq-btns-container'>
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
