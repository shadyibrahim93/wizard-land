'use client';

import Link from 'next/link';
import Image from 'next/image';
import useSelectedRealm from '@/hooks/userSelectedRealm.js';

export default function GameCards({ target, imgSrc, title }) {
  const { realm, resolved } = useSelectedRealm();

  return (
    <Link
      href={target} // The URL to navigate to when clicked
      className='mq-dashboard-card'
      passHref
      title={`${title} Online Game | Wizard Land`}
    >
      {realm && resolved && (
        <h2 className='mq-ending-title glowingFire-text'>{title}</h2>
      )}
      {realm && resolved && (
        <img
          src={`/assets/images/${realm}/${imgSrc}.webp`} // Image source path
          alt={`${title} Online Game | Wizard Land`}
          title={`${title} Online Game | Wizard Land`}
        />
      )}
    </Link>
  );
}
