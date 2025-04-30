import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../../components/Button';
import saveScoreToLocalStorage from '../../../hooks/scoreSaver';
import ScoreBoard from '../scoreBoard';
import {
  playBGMusic,
  playAnswerInCorrect,
  playDisappear,
  playDefeat,
  playNextLevel
} from '../../../hooks/useSound';

import { triggerConfetti } from '../../../hooks/useConfetti';

const gameName = 'math-quest';

const generateRandomEquation = (difficultyLevel) => {
  const num1 = Math.floor(Math.random() * difficultyLevel) + 1;
  const num2 = Math.floor(Math.random() * difficultyLevel) + 1;
  const operations = ['+', '-', '*'];
  const operation = operations[Math.floor(Math.random() * operations.length)];

  let correctAnswer;
  switch (operation) {
    case '+':
      correctAnswer = num1 + num2;
      break;
    case '-':
      correctAnswer = num1 - num2;
      break;
    case '*':
      correctAnswer = num1 * num2;
      break;
    default:
      break;
  }

  const options = [
    correctAnswer,
    correctAnswer + Math.floor(Math.random() * 5) + 1,
    correctAnswer - Math.floor(Math.random() * 5) - 1
  ].sort(() => Math.random() - 0.5);

  return {
    question: (
      <span>
        <span className='mq-number'>{num1}</span>{' '}
        <span className='mq-operation'>{operation}</span>{' '}
        <span className='mq-number'>{num2}</span>
        <span className='mq-operation'> =</span>
        <span className='mq-number'> ?</span>
      </span>
    ),
    options,
    correctAnswer
  };
};

const Template = () => {
  const [score, setScore] = useState(0);
  const [difficultyLevel, setDifficultyLevel] = useState(1);
  const [equation, setEquation] = useState(generateRandomEquation(5));
  const [startTime, setStartTime] = useState(null); // Track when the game starts
  const [elapsedTime, setElapsedTime] = useState(0); // Track time in seconds
  const [isPaused, setIsPaused] = useState(false); // State to track if the timer is paused
  const [gameOverMessage, setGameOverMessage] = useState(null); // State to store game-over message
  const [scoreBoard, setScoreBoard] = useState([]);
  const [formattedText, setFormattedText] = useState('');
  const [topScores, setTopScores] = useState([]);
  const [bestScorePassed, setBestScorePassed] = useState(false);

  const navigate = useNavigate(); // Initialize the navigate hook

  useEffect(() => {
    playBGMusic();
  }, []);

  useEffect(() => {
    const introText = `Sharpen your mind and put your math skills to the test! In this game, you will solve math problems that get harder every 10 questions. The challenge? Keep going for as long as you can! Your time will be tracked, measuring how long you can answer correctly before making a mistake. Stay sharp, think fast, and see how far you can go. Are you ready to take on the challenge?`;

    const words = introText.split(' '); // split by whitespace
    const formattedWords = words
      .map((word) => `<span class="word">${word}</span>`)
      .join(' ');
    setFormattedText(formattedWords);
  }, []);

  useEffect(() => {
    if (startTime && !isPaused) {
      const timer = setInterval(() => {
        setElapsedTime(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [startTime, isPaused]);

  const formatTime = (totalSeconds) => {
    const minutes = String(Math.floor(totalSeconds / 60)).padStart(2, '0');
    const seconds = String(totalSeconds % 60).padStart(2, '0');
    return `${minutes}:${seconds}`;
  };

  const getTopScoresFromLocalStorage = () => {
    return JSON.parse(localStorage.getItem('math-quest')) || [];
  };

  const handleAnswer = (selectedAnswer) => {
    if (selectedAnswer === equation.correctAnswer) {
      playDisappear();
      const newScore = score + 1;
      setScore(newScore);

      if (newScore % 10 === 0) {
        setDifficultyLevel(difficultyLevel + 1);
      }

      setEquation(generateRandomEquation(difficultyLevel * 5));

      // Check the highest score in the top scores list
      const topScore = Math.max(
        ...getTopScoresFromLocalStorage().map((entry) => entry.score || 0),
        0 // Default to 0 if the list is empty
      );

      // Trigger playNextLevel only if the new score surpasses the highest score
      if (newScore > topScore && !bestScorePassed) {
        playNextLevel();
        triggerConfetti();
        setBestScorePassed(true);
      }
    } else {
      playDefeat();
      playAnswerInCorrect();
      setIsPaused(true);
      setBestScorePassed(false);

      const finalScore = { score, time: formatTime(elapsedTime) };

      saveScoreToLocalStorage(gameName, finalScore);
      setTopScores(getTopScoresFromLocalStorage());

      setScoreBoard((prev) => [...prev, finalScore]);

      setGameOverMessage(
        <span className='mq-gameover-message-container'>
          <span>
            <span className='mq-label'>LEVEL: </span>
            <span className='mq-value'>{difficultyLevel}</span>{' '}
          </span>
          <span>
            <span className='mq-label'>TIME: </span>
            <span className='mq-value'>{formatTime(elapsedTime)}</span>{' '}
          </span>
          <span>
            <span className='mq-label'>SCORE: </span>
            <span className='mq-value'>{score}</span>
          </span>
        </span>
      );
    }
  };

  const startGame = () => {
    setScore(0);
    setDifficultyLevel(1);
    setEquation(generateRandomEquation(5));
    setStartTime(Date.now());
    setElapsedTime(0);
    setIsPaused(false); // Resume the timer
    setGameOverMessage(null); // Clear any game-over message
  };

  const restartGame = () => {
    setStartTime(null);
  };

  if (!startTime) {
    return (
      <div className='mq-main'>
        <div className='mq-game-wrapper'>
          <p
            className={`mq-game-intro-text mq-text--white`}
            dangerouslySetInnerHTML={{ __html: formattedText }}
          />
          <Button
            text='Start Game'
            onClick={startGame}
          ></Button>
        </div>
        <ScoreBoard
          gameName={gameName}
          setScoreBoard={setScoreBoard}
          scoreBoard={scoreBoard}
        />
      </div>
    );
  }

  if (gameOverMessage) {
    return (
      <div className='mq-gameover-overlay mq-gameover-container'>
        <h1>Game Over</h1>
        <img
          className='mq-fade-in-out'
          src='/wizard-land/assets/gif/smoke-disappear3.webp'
        />

        <h2>{gameOverMessage}</h2>
        <div className='mq-btns-container'>
          <Button
            text='Play Again'
            onClick={restartGame}
          ></Button>
          <Button
            text='More Games'
            onClick={() => navigate('/')}
          ></Button>
        </div>
      </div>
    );
  }

  return (
    <div className='mq-main'>
      <div className='mq-game-wrapper'>
        <div className='mq-math-game-header'>
          <p className='mq-label'>
            Score: <span className='mq-value'>{score}</span>
          </p>
          <p className='mq-label'>
            Difficulty: <span className='mq-value'>{difficultyLevel}</span>
          </p>
          <p className='mq-label'>
            Time: <span className='mq-value'>{formatTime(elapsedTime)}</span>
          </p>
        </div>
        <div className='mq-equation-wrapper'>
          <div className='mq-equation-question'>{equation.question}</div>
          <div className='mq-equation-answer'>
            {equation.options.map((option, idx) => (
              <button
                key={idx}
                className='mq-btn math-button'
                onClick={() => handleAnswer(option)}
              >
                {option}
              </button>
            ))}
          </div>
        </div>
      </div>
      <ScoreBoard
        gameName={gameName}
        setScoreBoard={setScoreBoard}
        scoreBoard={scoreBoard}
      />
    </div>
  );
};

export default Template;
