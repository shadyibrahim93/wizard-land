'use client';

import React, { useState, useRef } from 'react';
import { purchaseItem } from '../../apiService';
import { useUser } from '../../context/UserContext';
import {
  playPurchase,
  playPieceSound,
  pauseBGMusic,
  resumeBGMusic
} from '../../hooks/useSound';
import Button from '../Button';
import Image from 'next/image'; // Import next/image for optimized images
import useSelectedRealm from '../../hooks/userSelectedRealm.js';

const ShopItem = ({ item }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const { userId, loading } = useUser(); // Directly use your useUser hook
  const bgMusicTimeRef = useRef(0);
  const wasPlayingRef = useRef(false);
  const { realm } = useSelectedRealm();

  // Build URL array for realm images
  const realmImages =
    item.type === 'realm'
      ? [1, 2, 3].map(
          (n) => `/assets/images/board_pieces/${item.className}-${n}.webp`
        )
      : [];

  const handlePurchase = async (item) => {
    if (loading) {
      alert('Please wait while we verify your account...');
      return;
    }

    if (!userId) {
      alert('You must be logged in to make a purchase.');
      return;
    }

    try {
      const { success, error } = await purchaseItem(
        userId,
        item.id,
        item.stars
      );

      if (success) {
        alert(`You successfully purchased ${item.name || item.id}!`);
      } else {
        alert(`Purchase failed: ${error}`);
      }
    } catch (err) {
      alert('An unexpected error occurred. Please try again.');
      console.error('Purchase error:', err);
    }
  };

  const audioRef = useRef(null);

  const shouldPlaySound = item.image_url;

  const handleMouseEnter = () => {
    if (shouldPlaySound) {
      // Play appropriate sound
      if (item.type === 'realm') {
        bgMusicTimeRef.current = pauseBGMusic();
        wasPlayingRef.current = bgMusicTimeRef.current > 0;

        audioRef.current = playPieceSound(item.image_url);
      } else {
        audioRef.current = playPieceSound(item.image_url);
      }
    }
  };

  const handleMouseLeave = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }

    // Resume BG music if we paused it
    if (wasPlayingRef.current) {
      resumeBGMusic(bgMusicTimeRef.current);
      wasPlayingRef.current = false;
    }
  };

  const nextImage = () =>
    setCurrentImageIndex((idx) =>
      realmImages.length ? (idx + 1) % realmImages.length : 0
    );
  const prevImage = () =>
    setCurrentImageIndex((idx) =>
      realmImages.length
        ? (idx - 1 + realmImages.length) % realmImages.length
        : 0
    );

  return (
    <div
      className='mq-modal-item'
      onMouseEnter={shouldPlaySound ? handleMouseEnter : undefined}
      onMouseLeave={shouldPlaySound ? handleMouseLeave : undefined}
    >
      <span
        className={`mq-piece ${
          !item.emoji &&
          !item.image_url &&
          item.className &&
          'mq-theme mq-' + item.className
        }`}
      >
        {item.emoji && item.emoji}
        {item.image_url && item.type !== 'realm' && (
          <Image
            src={`/assets/images/board_pieces/${item.image_url}.webp`}
            alt={`Board Piece - ${item.className}`}
            width={100} // Adjust the width as needed
            height={90} // Adjust the height as needed
            loading='lazy'
          />
        )}
        {item.type === 'realm' && realmImages.length > 0 && (
          <div className='mq-screenshot-grid'>
            <button
              className='modal-nav prev'
              onClick={prevImage}
              aria-label='Previous image'
            >
              ‹
            </button>

            <Image
              key={currentImageIndex}
              src={realmImages[currentImageIndex]}
              alt={`Realm View ${currentImageIndex + 1}`}
              width={100}
              height={90}
              loading='lazy'
            />

            <button
              className='modal-nav next'
              onClick={nextImage}
              aria-label='Next image'
            >
              ›
            </button>
          </div>
        )}
      </span>
      <p className='mq-modal-price'>
        {item.stars !== 0 && (
          <>
            <Image
              src={`/assets/images/${realm}/elements/star.png`}
              alt='Star Icon'
              width={10} // Adjust width of the star image as needed
              height={20} // Adjust height of the star image as needed
            />
            {item.stars}
          </>
        )}
        {item.euro !== 0 && (
          <>
            <Image
              src={`/assets/images/${realm}/elements/euro.png`}
              alt='Euro Icon'
              className='mq-sparkle'
              width={10} // Adjust width of the euro image as needed
              height={20} // Adjust height of the euro image as needed
            />
            {item.euro}
          </>
        )}
      </p>
      <Button
        onClick={() => {
          handlePurchase(item);
          playPurchase();
        }}
        className={`mq-btn ${item.type === 'realm' ? 'mq-realm' : ''} `}
        isDisabled={item.purchased || item.image_url === 'crown'}
        text={
          item.purchased
            ? 'Bound'
            : item.image_url === 'crown'
            ? 'Legend'
            : 'Buy'
        }
      />
    </div>
  );
};

export default ShopItem;
