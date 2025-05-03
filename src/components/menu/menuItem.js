import React, { useState } from 'react';

const MenuItem = ({
  imgSrc,
  onHoverImgSrc,
  title,
  onClick,
  playHoverSound
}) => {
  const [isHovered, setIsHovered] = useState(false);

  const imageSrc = `${process.env.PUBLIC_URL}/assets/images/elements/${
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
      />
      {title}
    </div>
  );
};

export default MenuItem;
