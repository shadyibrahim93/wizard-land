import React, { useState, useEffect } from 'react';
import { activateItem } from '../../apiService';
import Button from '../Button';

const InventoryItem = ({ item, userId, refreshInventory, isActive }) => {
  const handleEquip = async () => {
    if (!userId || !item?.id) return;

    await activateItem(userId, item.id);
    refreshInventory?.(); // optional callback to refresh UI after activation
  };

  return (
    <div className='mq-modal-item'>
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className='mq-piece mq-piece-image'
        />
      )}

      {item.emoji && <span className='mq-piece'>{item.emoji}</span>}

      <Button
        onClick={handleEquip}
        className='mq-btn'
        isDisabled={isActive}
        text={isActive ? 'Active' : 'Equip'} // Disable button if the item is active
      ></Button>
    </div>
  );
};

export default InventoryItem;
