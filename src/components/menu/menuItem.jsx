'use client';

import React, { useState } from 'react';
import useSelectedRealm from '../../hooks/userSelectedRealm.js';

const MenuItem = ({
  imgSrc,
  onHoverImgSrc,
  title,
  alt,
  onClick,
  playHoverSound,
  id,
  itemTitle
}) => {
  const [isHovered, setIsHovered] = useState(false);
  const { realm } = useSelectedRealm();

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
        alt={alt}
        title={title}
        loading='lazy'
      />
      {realm === 'vintage' ? '' : itemTitle}
    </div>
  );
};

export default MenuItem;
