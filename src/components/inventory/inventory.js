import React, { useEffect, useState } from 'react';
import ShopItem from './shopItem';
import {
  getUserInventoryGroupedByType,
  getCurrentUser
} from '../../apiService';

const Inventory = ({ onClose }) => {
  const [inventoryItems, setInventoryItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      const user = await getCurrentUser();
      if (!user) return;

      const groupedInventory = await getUserInventoryGroupedByType(user.id);
      setInventoryItems(groupedInventory);
      setLoading(false);
    };

    fetchInventory();
  }, []);

  const handleUseItem = (item) => {
    console.log('Using', item.name || item.emoji || item.image);
    // Add logic for equipping or activating the item
  };

  if (loading) {
    return (
      <div className='mq-modal-overlay'>
        <div className='mq-container'>
          <h1 className='mq-modal-title'>Loading Inventory...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className='mq-modal-overlay'>
      <div className='mq-container'>
        <div className='mq-modal-header'>
          <h1 className='mq-modal-title'>Inventory</h1>
          <button
            className='mq-close-btn'
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <hr />
        <div className='mq-modal-body'>
          {Object.entries(inventoryItems).map(([category, items]) => (
            <div
              key={category}
              className='mq-modal-category'
            >
              <h2 className='mq-modal-category-title'>Owned {category}s</h2>
              <hr />
              <div className='mq-modal-items-container'>
                {items.map((item) => (
                  <ShopItem
                    key={item.id}
                    item={item}
                    onActivate={handleUseItem}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
        <div className='mq-modal-footer'></div>
      </div>
    </div>
  );
};

export default Inventory;
