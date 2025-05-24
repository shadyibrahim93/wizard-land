'use client';
import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../../components/Button.js';
import shuffleArray from '../../../utils/ShuffleChildren.js';
import cardBackImage from '../../../assets/images/background.jpg';
import { playUncover, playDisappear } from '../../../hooks/useSound.js';
import GameOver from '../../../components/gameFlow/gameover.jsx';
import GameIntro from '../../../components/gameFlow/gameintro.jsx';

const Game = ({
  setCurrentLevel,
  setCurrentLevelPassed,
  setFinalLevelOver,
  setMaxLevel
}) => {
  const memoryShapes = {
    1: ['✨', '🔮', '🧙‍♂️', '✨', '🔮', '🧙‍♂️'],
    2: ['🦉', '🔥', '📚', '🏰', '🕯️', '🧹', '🦉', '🔥', '📚', '🏰', '🕯️', '🧹'],
    3: [
      '🕊️',
      '⛪',
      '🙏',
      '🧎‍♀️',
      '🎅🏻',
      '🎄',
      '🎁',
      '☃️',
      '🦌',
      '📕',
      '🕊️',
      '⛪',
      '🙏',
      '🧎‍♀️',
      '🎅🏻',
      '🎄',
      '🎁',
      '☃️',
      '🦌',
      '📕'
    ]
  };

  const [cards, setCards] = useState([]);
  const [flippedCards, setFlippedCards] = useState([]);
  const [matchedCards, setMatchedCards] = useState([]);
  const [level, setLevel] = useState(1);
  const [originalShapes, setOriginalShapes] = useState([]);
  const [gameOver, setGameOver] = useState(false);
  const [startGame, setStartGame] = useState(false);
  const maxLevel = 3;

  const introText = `Get ready to test your memory! In this game, you will match pairs of cards. Each card has a hidden symbol, and your goal is to uncover the cards and find their matching pairs. The challenge? Each level will add more pairs, and the game gets more difficult as you progress. Can you match all the pairs without making a mistake? Stay focused, remember the cards, and see how far you can go!`;

  useEffect(() => {
    function fetchData() {
      const emojis = memoryShapes[level] || [];
      const data = emojis.map((emoji, index) => ({
        id: `${level}-${index}`,
        emoji
      }));
      const shuffled = shuffleArray(data);
      setCards(shuffled);
      setOriginalShapes(shuffled);
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

      if (cards[firstIndex].emoji === cards[secondIndex].emoji) {
        setMatchedCards([...matchedCards, firstIndex, secondIndex]);
        playDisappear();
      }

      setTimeout(() => setFlippedCards([]), 1000);
    }
  };

  const reset = () => {
    setMatchedCards([]);
    setFlippedCards([]);
    setCurrentLevelPassed(false);
  };

  const resetLevel = () => {
    reset();
    setCards([...originalShapes]);
  };

  const resetGame = () => {
    reset();
    setLevel(1);
    setCards([]);
    setGameOver(false);
  };

  return !startGame ? (
    <GameIntro
      introText={introText}
      onStart={() => setStartGame(true)}
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
                  src={cardBackImage.src}
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
