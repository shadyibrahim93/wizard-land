'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Image from 'next/image'; // Import Next.js Image component
import Button from '../Button.js';
import { triggerGameOverConfetti } from '../../hooks/useConfetti.js';

const GameOver = ({ resetGame }) => {
  const router = useRouter();

  useEffect(() => {
    triggerGameOverConfetti();
  }, []);

  return (
    <div className='mq-gameover-container'>
      <Image
        src='/assets/gif/game_over.webp'
        alt='Game Over Screen'
        width={600} // Set actual image width
        height={400} // Set actual image height
        priority // Preload important above-the-fold image
      />
      <div className='mq-btns-container'>
        <Button
          text='Games List'
          onClick={() => router.push('/')}
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
