import { useState } from 'react';

export default function GameCards({ target, imgSrc, alt, title }) {
  const getImagePath = (fileName) => require(`../assets/images/${fileName}`);
  const [showTitle, setShowTitle] = useState(false);

  return (
    <a
      href={target}
      className='mq-dashboard-card'
      onMouseEnter={() => setShowTitle(true)} // Corrected: Use a function to set state
      onMouseLeave={() => setShowTitle(false)} // Added: Hides the title on mouse leave
    >
      {showTitle && <h1 className='mq-ending-title'>{title}</h1>}
      <img
        src={getImagePath(imgSrc)}
        alt={alt}
      />
    </a>
  );
}
