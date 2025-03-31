import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../components/Button';
import { triggerGameOverConfetti } from '../hooks/useConfetti';
const GameOver = ({ resetGame }) => {
  const navigate = useNavigate();

  useEffect(() => {
    triggerGameOverConfetti();
  });

  return (
    <div className='mq-gameover-container'>
      <img src='/assets/gif/game_over.gif' />
      <div className='mq-btns-container'>
        <Button
          text='Games List'
          onClick={() => navigate('/')}
        />
        <Button
          text='Play Again'
          onClick={resetGame}
        />
      </div>
    </div>
  );
};

export default GameOver;
