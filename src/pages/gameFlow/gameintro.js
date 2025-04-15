import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Button from '../../components/Button';
import { playTeleport } from '../../hooks/useSound';

const GameIntro = ({
  introText,
  onStart,
  firstButtonText = 'Start Game',
  onSecondButtonClick,
  secondButtonText
}) => {
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
};

GameIntro.propTypes = {
  introText: PropTypes.string.isRequired,
  onStart: PropTypes.func.isRequired,
  firstButtonText: PropTypes.string,
  onSecondButtonClick: PropTypes.func,
  secondButtonText: PropTypes.string
};

export default GameIntro;
