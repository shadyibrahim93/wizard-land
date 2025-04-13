import React, { useState } from 'react';

const MenuItem = ({ imgSrc, onHoverImgSrc, title, onClick }) => {
  const [isHovered, setIsHovered] = useState(false);

  const imageSrc = `/wizard-land/assets/elements/${
    isHovered ? onHoverImgSrc : imgSrc
  }`;

  return (
    <div
      className='mq-menu-item'
      onClick={onClick}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
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
