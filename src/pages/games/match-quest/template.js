import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../components/Button';
import shuffleArray from '../../../utils/ShuffleChildren';
import cardBackImage from '../../../assets/images/background.jpg';
import { playUncover, playDisappear } from '../../../hooks/useSound';
import { getMemoryShapes } from '../../../apiService';
import GameOver from '../../gameFlow/gameover';
import GameIntro from '../../gameFlow/gameintro';

const Game = ({
  setCurrentLevel,
  setCurrentLevelPassed,
  setFinalLevelOver,
  setMaxLevel
}) => {
  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [level, setLevel] = useState(1);
  const [originalShapes, setOriginalShapes] = useState([]); // Store original shapes for level
  const [gameOver, setGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false); // New state to manage game start
  const maxLevel = 3;

  const introText = `Get ready to test your memory! In this game, you will match pairs of cards. Each card has a hidden symbol, and your goal is to uncover the cards and find their matching pairs. The challenge? Each level will add more pairs, and the game gets more difficult as you progress. Can you match all the pairs without making a mistake? Stay focused, remember the cards, and see how far you can go!`;

  // Fetch cards when level changes
  useEffect(() => {
    async function fetchData() {
      const data = await getMemoryShapes(level);
      if (data.length > 0) {
        const shuffledShapes = shuffleArray(data);
        setCards(shuffledShapes);
        setOriginalShapes(shuffledShapes); // Save the original shuffled state for the level
      }
      setCurrentLevel(level);
    }

    fetchData();
  }, [level, setCurrentLevel]);

  useEffect(() => {
    if (matchedCards.length === cards.length && cards.length > 0) {
      setCurrentLevelPassed(true);
      setCurrentLevel(level);

      setTimeout(() => {
        if (level < maxLevel) {
          setMatchedCards([]);
          setFlippedCards([]);
          setLevel((prevLevel) => prevLevel + 1);
          setFinalLevelOver(false);
        } else {
          setFinalLevelOver(true);
          setGameOver(true);
          setMaxLevel(maxLevel - 1);
        }
      }, 1000);
    }
  }, [matchedCards, cards, setCurrentLevelPassed]);

  const handleCardClick = (index) => {
    playUncover();

    // Prevent flipping if there are already 2 flipped cards, or the card is already flipped, or the card is already matched
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(index) ||
      matchedCards.includes(index)
    )
      return;

    const newFlippedCards = [...flippedCards, index];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      const [firstIndex, secondIndex] = newFlippedCards;

      // Check if the emojis match (compare based on emoji, not the whole object)
      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        setMatchedCards([...matchedCards, firstIndex, secondIndex]);
        playDisappear();
      }
      setTimeout(() => setFlippedCards([]), 1000); // Reset flipped cards after a delay
    }
  };

  const reset = () => {
    setMatchedCards([]); // Reset matched cards
    setFlippedCards([]); // Reset flipped cards
    setCurrentLevelPassed(false);
  };

  const resetLevel = () => {
    // Reset the state, but keep the current level
    reset();
    // Reset the cards to the original state of the current level
    setCards([...originalShapes]); // Reset the cards to the original shapes for this level
  };

  const resetGame = () => {
    reset();
    setLevel(1); // Reset level to 1
    setCards([]); // Temporarily clear the cards
    setGameOver(false);
  };

  return !startGame ? (
    <GameIntro
      introText={introText} // Pass intro text
      onStart={() => setStartGame(true)} // Pass start callback
    />
  ) : !gameOver ? (
    <>
      <div
        className='mq-game-board'
        id='mq-game-board'
      >
        {cards.map((card, index) => (
          <div
            key={card.id}
            className={`mq-match-card ${
              flippedCards.includes(index) ? 'flipped' : ''
            } ${matchedCards.includes(index) ? 'flipped matched' : ''}`}
            onClick={() => handleCardClick(index)}
          >
            <div className='mq-match-card-container'>
              <div className='mq-match-card--front'>
                <img
                  src={cardBackImage}
                  alt='Card Front'
                  className='mq-match-card-image'
                />
              </div>
              <div className='mq-match-card--back'>{card.emoji}</div>
            </div>
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

Game.propTypes = {
  setCurrentLevel: PropTypes.func.isRequired,
  setCurrentLevelPassed: PropTypes.func.isRequired
};

export default Game;
