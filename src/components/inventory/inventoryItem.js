import React, { useRef } from 'react';
import { activateItem } from '../../apiService';
import Button from '../Button';
import { playEquip, playPieceSound } from '../../hooks/useSound';

const InventoryItem = ({ item, userId, refreshInventory, isActive }) => {
  const getImagePath = (fileName) =>
    require(`../../assets/images/elements/${fileName}`);

  const handleEquip = async () => {
    if (!userId || !item?.id) return;

    await activateItem(userId, item.id);
    refreshInventory?.(); // optional callback to refresh UI after activation
  };

  const audioRef = useRef(null);

  const shouldPlaySound = item.image_url;

  const handleMouseEnter = () => {
    if (shouldPlaySound) {
      audioRef.current = playPieceSound(item.image_url);
    }
  };

  const handleMouseLeave = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
      audioRef.current = null;
    }
  };

  return (
    <div
      className='mq-modal-item'
      onMouseEnter={shouldPlaySound ? handleMouseEnter : undefined}
      onMouseLeave={shouldPlaySound ? handleMouseLeave : undefined}
    >
      {/* {!item.emoji && !item.image_url && item.className && (
        <p className='mq-modal-title'>{item.className.toUpperCase()}</p>
      )} */}
      <span
        className={`mq-piece ${
          !item.emoji &&
          !item.image_url &&
          item.className &&
          'mq-theme mq-' + item.className
        }`}
      >
        {item.emoji && item.emoji}
        {item.image_url && (
          <img
            src={getImagePath('board_pieces/' + item.image_url + '.webp')}
            alt={`Board Piece - ${item.className}`}
          />
        )}
      </span>

      <Button
        onClick={() => {
          handleEquip();
          playEquip();
        }}
        className='mq-btn'
        isDisabled={isActive}
        text={isActive ? 'Active' : 'Equip'} // Disable button if the item is active
      ></Button>
    </div>
  );
};

export default InventoryItem;
