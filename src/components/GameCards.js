'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import useSelectedRealm from '@/hooks/userSelectedRealm.js';
import { useUser } from '@/context/UserContext.js';

export default function GameCards({ target, imgSrc, title }) {
  const { userId } = useUser();
  const { realm } = useSelectedRealm();

  return (
    <Link
      href={target} // The URL to navigate to when clicked
      className='mq-dashboard-card'
      passHref
      title={`${title} Online Game | Wizard Land`}
    >
      {realm && <h2 className='mq-ending-title glowingFire-text'>{title}</h2>}
      <Image
        src={`/assets/images/${realm}/${imgSrc}.webp`} // Image source path
        alt={`${title} Online Game | Wizard Land`}
        title={`${title} Online Game | Wizard Land`}
        width={300} // adjust as needed
        height={300} // adjust as needed
        loading='lazy' // Helps with performance optimization
      />
    </Link>
  );
}
