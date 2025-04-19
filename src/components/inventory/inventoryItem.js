import React from 'react';
import { activateItem } from '../../apiService';
import Button from '../Button';
import { playEquip } from '../../hooks/useSound';

const InventoryItem = ({ item, userId, refreshInventory, isActive }) => {
  const getImagePath = (fileName) =>
    require(`../../assets/images/elements/${fileName}`);

  const handleEquip = async () => {
    if (!userId || !item?.id) return;

    await activateItem(userId, item.id);
    refreshInventory?.(); // optional callback to refresh UI after activation
  };

  return (
    <div className='mq-modal-item'>
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
            src={getImagePath('board_pieces/' + item.image_url)}
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
