'use client';

import React, { useState } from 'react';
import useSelectedRealm from '../../hooks/userSelectedRealm.js';
import { useUser } from '../../context/UserContext.js';

const MenuItem = ({
  imgSrc,
  onHoverImgSrc,
  title,
  onClick,
  playHoverSound,
  id
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { userId } = useUser();
  const realm = useSelectedRealm();

  const imageSrc = `/assets/images/${realm}/elements/${
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
      id={id}
    >
      <img
        src={imageSrc}
        alt={title}
        loading='lazy'
      />
      {realm === 'vintage' ? '' : title}
    </div>
  );
};

export default MenuItem;
