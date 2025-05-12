'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';

export default function GameCards({ target, imgSrc, alt, title }) {
  const [showTitle, setShowTitle] = useState(false);

  return (
    <Link
      href={target} // The URL to navigate to when clicked
      className='mq-dashboard-card'
      passHref
      onMouseEnter={() => setShowTitle(true)}
      onMouseLeave={() => setShowTitle(false)}
    >
      <Image
        src={`/assets/images/${imgSrc}`} // Image source path
        alt={alt}
        width={300} // adjust as needed
        height={300} // adjust as needed
        loading='lazy' // Helps with performance optimization
      />
      <h1 className='mq-ending-title'>{title}</h1>
    </Link>
  );
}
