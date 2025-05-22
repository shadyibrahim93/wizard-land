'use client';

import React, { useRef, useState } from 'react';
import { activateItem } from '../../apiService';
import Button from '../Button';
import {
  playPieceSound,
  pauseBGMusic,
  resumeBGMusic,
  playEquip
} from '../../hooks/useSound';
import Image from 'next/image';

const InventoryItem = ({ item, userId, refreshInventory, isActive }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const audioRef = useRef(null);
  const bgMusicTimeRef = useRef(0);
  const wasPlayingRef = useRef(false);

  // Build URL array for realm images
  const realmImages =
    item.type === 'realm'
      ? [1, 2, 3].map(
          (n) => `/assets/images/board_pieces/${item.className}-${n}.webp`
        )
      : [];

  const handleEquip = async () => {
    if (!userId || !item?.id) return;
    try {
      await activateItem(userId, item.id);
      if (item.type === 'realm') {
        localStorage.setItem('realm', item.className);
        document.documentElement.setAttribute('data-theme', item.className);
        window.location.reload();
      }
      refreshInventory?.();
    } catch (error) {
      console.error('Error equipping item:', error);
    }
  };

  const shouldPlaySound = item.image_url;

  const handleMouseEnter = () => {
    if (shouldPlaySound) {
      // Play appropriate sound
      if (item.type === 'realm') {
        // Store BG music state and pause
        bgMusicTimeRef.current = pauseBGMusic();
        wasPlayingRef.current = bgMusicTimeRef.current > 0;

        // For realms, use a special sound logic if needed
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
    <>
      <div
        className='mq-modal-item'
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
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
              width={100}
              height={90}
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

              <div className='mq-image-wrapper'>
                <Image
                  src={`${realmImages[currentImageIndex]}?v=${currentImageIndex}`}
                  alt={`Realm View ${currentImageIndex + 1}`}
                  width={100}
                  height={90}
                  loading='lazy'
                />
              </div>

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

        <Button
          onClick={() => {
            handleEquip();
            playEquip();
          }}
          className={`mq-btn ${item.type === 'realm' ? 'mq-realm' : ''} `}
          isDisabled={isActive}
          text={
            isActive
              ? `${
                  item.type === 'realm' ? item.className + ' realm' : ''
                } Active`
              : `Equip ${
                  item.type === 'realm' ? item.className + ' realm' : ''
                }`
          }
        />
      </div>
    </>
  );
};

export default InventoryItem;
