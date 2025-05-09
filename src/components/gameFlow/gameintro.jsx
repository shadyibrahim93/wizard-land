'use client';

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../Button.js';
import { playBGMusic, playTeleport } from '../../hooks/useSound.js';

export default function GameIntro({
  introText,
  onStart,
  firstButtonText = 'Start Game',
  onSecondButtonClick,
  secondButtonText
}) {
  const [formattedText, setFormattedText] = useState('');

  useEffect(() => {
    const words = introText.split(' ');
    const formattedWords = words
      .map((word) => `<span class="word">${word}</span>`)
      .join(' ');
    setFormattedText(formattedWords);
  }, [introText]);

  const handleFirstButtonClick = () => {
    playTeleport();
    onStart();
  };

  const handleSecondButtonClick = () => {
    playTeleport();
    onSecondButtonClick();
  };

  useEffect(() => {
    playBGMusic('bgmusic');
  }, []);

  return (
    <>
      <div
        className='mq-game-intro-text mq-text--white'
        dangerouslySetInnerHTML={{ __html: formattedText }}
      ></div>
      <div className='mq-btns-container'>
        {onStart && (
          <Button
            text={firstButtonText}
            onClick={handleFirstButtonClick}
          />
        )}
        {secondButtonText && onSecondButtonClick && (
          <Button
            text={secondButtonText}
            onClick={handleSecondButtonClick}
          />
        )}
      </div>
    </>
  );
}

GameIntro.propTypes = {
  introText: PropTypes.string.isRequired,
  onStart: PropTypes.func.isRequired,
  firstButtonText: PropTypes.string,
  onSecondButtonClick: PropTypes.func,
  secondButtonText: PropTypes.string
};
