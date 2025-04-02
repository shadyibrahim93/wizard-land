import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../components/Button';
import { playClick, playPop } from '../../../hooks/useSound';
import { getMemorySequence } from '../../../apiService'; // API to fetch sequence
import GameOver from '../../gameover';
import shuffleArray from '../../../utils/ShuffleChildren'; // Shuffle function
import GameIntro from '../../gameintro';

const Game = ({
  setCurrentLevel,
  setNextLevel,
  setCurrentLevelPassed,
  setFinalLevelOver,
  setMaxLevel
}) => {
  const [sequence, setSequence] = useState([]); // Full sequence for the level
  const [highlightedSequence, setHighlightedSequence] = useState([]); // Order of highlighted items
  const [userInput, setUserInput] = useState([]); // Tracks the user's input
  const [level, setLevel] = useState(1); // Current level
  const [gameOver, setGameOver] = useState(false); // Tracks if the game is over
  const [showingSequence, setShowingSequence] = useState(true); // Controls sequence display
  const [highlightedIndex, setHighlightedIndex] = useState(-1); // Currently highlighted item index
  const [startGame, setStartGame] = useState(false); // State to manage game start
  const [retry, setRetry] = useState(false);
  const maxLevel = 10; // Number of levels

  const introText = `Welcome to the Memory Sequence game! Remember and repeat the shown sequence by clicking on the dots in the correct order. Each level gets tougher as the sequence grows. Test your memory and see how far you can go!`;

  // Fetch sequence data for the current level
  useEffect(() => {
    async function fetchSequence() {
      setMaxLevel(maxLevel);

      const data = await getMemorySequence(level); // Get level data

      if (data.length > 0) {
        const shuffledSequence = shuffleArray(data.map((item) => item.item)); // Shuffle items
        setSequence(shuffledSequence);

        // Generate a shuffled highlight sequence
        const highlightOrder = shuffleArray([...shuffledSequence]);
        setHighlightedSequence(highlightOrder);
      }

      setCurrentLevel(level);
    }

    if (startGame) {
      fetchSequence();
    }
  }, [level, startGame, setCurrentLevel, setNextLevel]);

  // Display the sequence to the user in random order
  useEffect(() => {
    if (
      highlightedSequence.length > 0 &&
      (startGame || retry) &&
      showingSequence // Ensure sequence is not already showing
    ) {
      let index = 0;
      setHighlightedIndex(-1); // Reset highlight

      const interval = setInterval(() => {
        if (index < highlightedSequence.length) {
          setHighlightedIndex(sequence.indexOf(highlightedSequence[index])); // Highlight randomly
          index++;
          playPop();
        } else {
          clearInterval(interval);
          setTimeout(() => {
            setHighlightedIndex(-1); // Remove highlight
            setShowingSequence(false); // Allow user input
            setRetry(false); // Reset retry after re-showing sequence
          }, 500);
        }
      }, 800);

      return () => clearInterval(interval);
    }
  }, [highlightedSequence, sequence, startGame, retry, showingSequence]);

  // Check if the user's input matches the exact highlight sequence
  useEffect(() => {
    if (
      userInput.length === highlightedSequence.length &&
      highlightedSequence.length > 0
    ) {
      if (JSON.stringify(userInput) === JSON.stringify(highlightedSequence)) {
        setCurrentLevelPassed(true);

        setTimeout(async () => {
          if (level < maxLevel) {
            setUserInput([]); // Reset input
            const nextLevel = level + 1;
            setLevel(nextLevel);
            setFinalLevelOver(false);
            setRetry(false); // No retry needed on success

            // Fetch the sequence for the next level
            setShowingSequence(true); // Enable sequence display for the next level
            const data = await getMemorySequence(nextLevel);
            if (data.length > 0) {
              const shuffledSequence = shuffleArray(
                data.map((item) => item.item)
              );
              setSequence(shuffledSequence);
              const highlightOrder = shuffleArray([...shuffledSequence]);
              setHighlightedSequence(highlightOrder);
            }
          } else {
            setFinalLevelOver(true);
            setGameOver(true);
            setMaxLevel(maxLevel - 1);
            setRetry(false); // No retry needed on success
          }
        }, 1000);
      } else {
        setUserInput([]); // Reset input on failure
        setRetry(true); // Retry needed on failure
        setShowingSequence(true); // Trigger sequence re-display
      }
    }
  }, [userInput, highlightedSequence, setCurrentLevelPassed, level, maxLevel]);

  const handleInput = (item) => {
    if (!showingSequence) {
      playClick();
      setUserInput([...userInput, item]); // Add selected item to input
    }
  };

  const resetGame = async () => {
    setUserInput([]);
    setLevel(1);
    setSequence([]);
    setHighlightedSequence([]);
    setGameOver(false);
    setShowingSequence(true); // Enable sequence display
    setRetry(false); // No retry during game reset

    const data = await getMemorySequence(level);
    if (data.length > 0) {
      const shuffledSequence = shuffleArray(data.map((item) => item.item));
      setSequence(shuffledSequence);
      const highlightOrder = shuffleArray([...shuffledSequence]);
      setHighlightedSequence(highlightOrder);
    }
  };

  const resetLevel = async () => {
    setUserInput([]);
    setGameOver(false);
    setShowingSequence(true);

    // Fetch the same level's sequence again
    const data = await getMemorySequence(level);
    if (data.length > 0) {
      const shuffledSequence = shuffleArray(data.map((item) => item.item));
      setSequence(shuffledSequence);

      // Generate a shuffled highlight sequence
      const highlightOrder = shuffleArray([...shuffledSequence]);
      setHighlightedSequence(highlightOrder);
    }
  };

  return !startGame ? (
    <GameIntro
      introText={introText} // Pass intro text
      onStart={() => setStartGame(true)} // Pass start callback
    />
  ) : !gameOver ? (
    <>
      <div className='mq-memory-game-board'>
        {sequence.length > 0 && (
          <div className='mq-memory-row'>
            {sequence.map((item, index) => (
              <button
                key={index}
                className={`mq-memory-item ${
                  userInput.includes(item) ? 'selected' : ''
                } 
                ${highlightedIndex === index ? 'highlighted' : ''}`}
                onClick={() => handleInput(item)}
                disabled={showingSequence}
              >
                {item}
              </button>
            ))}
          </div>
        )}
      </div>
      <div className='mq-btns-container'>
        <Button
          text='Restart Level'
          onClick={resetLevel}
        ></Button>
        <Button
          text='Restart Game'
          onClick={resetGame}
        />
      </div>
    </>
  ) : (
    <GameOver resetGame={resetGame} />
  );
};

Game.propTypes = {
  setCurrentLevel: PropTypes.func.isRequired,
  setNextLevel: PropTypes.func.isRequired,
  setCurrentLevelPassed: PropTypes.func.isRequired
};

export default Game;
