'use client';

import React, { useState } from 'react';
import { useSelectedPiece } from '../../hooks/userSelectedPiece.js';
import { useUser } from '../../context/UserContext.js';

const MenuItem = ({
  imgSrc,
  onHoverImgSrc,
  title,
  onClick,
  playHoverSound
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { userId } = useUser();
  const player = useSelectedPiece(userId);

  const imageSrc = `/assets/images/${player.realm}/elements/${
    isHovered ? onHoverImgSrc : imgSrc
  }`;

  const handleMouseEnter = () => {
    setIsHovered(true);
    if (playHoverSound) {
      playHoverSound(true); // Play the hover sound when mouse enters
    }
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    if (playHoverSound) {
      playHoverSound(false); // Stop the hover sound when mouse leaves
    }
  };

  return (
    <div
      className='mq-menu-item'
      onClick={onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <img
        src={imageSrc}
        alt={title}
        loading='lazy'
      />
      {player.realm === 'vintage' ? '' : title}
    </div>
  );
};

export default MenuItem;
