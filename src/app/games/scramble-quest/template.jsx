'use client';
import React, { useState, useEffect } from 'react';
import Button from '../../../components/Button.js';
import { playDisappear } from '../../../hooks/useSound.js';
import useDragAndDrop from '../../../utils/DragAndDrop.js';
import { getScrambleWords } from '../../../apiService.js';
import shuffleArray from '../../../utils/ShuffleChildren.js';
import GameOver from '../../../components/gameFlow/gameover.jsx';
import GameIntro from '../../../components/gameFlow/gameintro.jsx';

const WordScrambleGame = ({
  setCurrentLevel,
  setCurrentLevelPassed,
  setFinalLevelOver,
  setMaxLevel
}) => {
  const [level, setLevel] = useState(1);
  const [word, setWord] = useState('');
  const [scrambledLetters, setScrambledLetters] = useState([]);
  const [userInput, setUserInput] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false); // New state to manage game start
  const maxLevel = 10;
  const { handleDragStart, handleDrop, handleDragOver } = useDragAndDrop();

  const introText = `Welcome to Word Scramble! Click on a letter and watch it magically jump to the next open spot in the word boxes. Rearrange the scrambled letters to form the correct word. Each level gets trickier, so stay sharp and complete all the levels to claim victory!`;

  useEffect(() => {
    async function fetchWord() {
      const fetchedWords = await getScrambleWords(level);
      if (fetchedWords && fetchedWords.length > 0) {
        const word = fetchedWords[0].word;
        setWord(word);
        setScrambledLetters(
          shuffleArray(word.split('').map((l, i) => ({ letter: l, id: i })))
        );
        setUserInput(new Array(word.length).fill(null));
      }
      setCurrentLevel(level);
      setMaxLevel(maxLevel);
    }

    fetchWord();
  }, [level]);

  const handleLetterDrop = (e, index) => {
    const { draggedItem } = handleDrop(e, index);

    if (draggedItem) {
      playDisappear();

      setUserInput((prevInput) => {
        const newInput = [...prevInput];
        const replacedLetter = newInput[index]; // Get the existing letter at the drop index

        // Replace with the new dragged item
        newInput[index] = draggedItem;

        // If there was a letter in the drop zone, return it back to scrambled letters
        if (replacedLetter) {
          setScrambledLetters((prevLetters) => [
            ...prevLetters,
            replacedLetter
          ]);
        }

        return newInput;
      });

      setScrambledLetters(
        (prevLetters) =>
          prevLetters.filter((item) => item.id !== draggedItem.id) // Remove the dragged letter from scrambled
      );

      // Check if all slots are filled
      setTimeout(() => {
        setUserInput((prevInput) => {
          if (prevInput.every((item) => item !== null)) {
            const assembledWord = prevInput.map((item) => item.letter).join('');
            if (assembledWord === word) {
              setCurrentLevelPassed(true);
              setTimeout(() => {
                if (level < maxLevel) {
                  setLevel(level + 1);
                  setFinalLevelOver(false);
                } else {
                  setFinalLevelOver(true);
                  setGameOver(true);
                  setMaxLevel(maxLevel - 1);
                }
              }, 2000);
            } else {
              // Reset letters and reshuffle before showing again
              setScrambledLetters(
                shuffleArray(
                  word.split('').map((l, i) => ({ letter: l, id: i }))
                )
              );
              return new Array(word.length).fill(null);
            }
          }
          return prevInput;
        });
      }, 500);
    }
  };

  const handleLetterClick = (clickedItem) => {
    // Find the first empty slot
    const emptyIndex = userInput.findIndex((slot) => slot === null);

    if (emptyIndex !== -1) {
      playDisappear();

      setUserInput((prevInput) => {
        const newInput = [...prevInput];
        newInput[emptyIndex] = clickedItem; // Place letter in the first available slot
        return newInput;
      });

      setScrambledLetters(
        (prevLetters) =>
          prevLetters.filter((item) => item.id !== clickedItem.id) // Remove the clicked letter
      );

      // Check if word is complete after placing a letter
      setTimeout(() => {
        setUserInput((prevInput) => {
          if (prevInput.every((item) => item !== null)) {
            const assembledWord = prevInput.map((item) => item.letter).join('');
            if (assembledWord === word) {
              setCurrentLevelPassed(true);
              setTimeout(() => {
                if (level < maxLevel) {
                  setLevel(level + 1);
                  setFinalLevelOver(false);
                } else {
                  setFinalLevelOver(true);
                  setGameOver(true);
                  setMaxLevel(maxLevel - 1);
                }
              }, 1000);
            } else {
              // Reset letters and reshuffle before showing again
              setScrambledLetters(
                shuffleArray(
                  word.split('').map((l, i) => ({ letter: l, id: i }))
                )
              );
              return new Array(word.length).fill(null);
            }
          }
          return prevInput;
        });
      }, 500);
    }
  };

  const resetLevel = () => {
    setUserInput(new Array(word.length).fill(null));
    setScrambledLetters(
      shuffleArray(word.split('').map((l, i) => ({ letter: l, id: i })))
    );
  };

  const resetGame = () => {
    setUserInput([]);
    setLevel(1);
    setGameOver(false);
  };

  return !startGame ? (
    <GameIntro
      introText={introText} // Pass intro text
      onStart={() => setStartGame(true)} // Pass start callback
    />
  ) : !gameOver ? (
    <>
      <div className='mq-shapes-container'>
        {scrambledLetters.map((item) => (
          <div
            key={item.id}
            className='mq-letter mq-shape'
            draggable='true'
            onDragStart={(e) => handleDragStart(e, item)}
            onClick={() => handleLetterClick(item)} // Handle letter click
          >
            {item.letter}
          </div>
        ))}
      </div>
      <div className='mq-shapes-container--drop'>
        {userInput.map((item, index) => (
          <div
            key={index}
            className='mq-shape--drop'
            onDragOver={handleDragOver}
            onDrop={(e) => handleLetterDrop(e, index)}
          >
            {item ? item.letter : ''}
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
    <GameOver resetGame={resetGame} />
  );
};

export default WordScrambleGame;
