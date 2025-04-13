import React, { useEffect, useState } from 'react';
import ShopItem from './shopItem';
import { getShopItemsGroupedByType } from '../../apiService';

const Shop = ({ onClose }) => {
  const [shopItems, setShopItems] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchShopItems = async () => {
      const groupedItems = await getShopItemsGroupedByType();
      setShopItems(groupedItems);
      setLoading(false);
    };

    fetchShopItems();
  }, []);

  if (loading) {
    return (
      <div className='mq-modal-overlay'>
        <div className='mq-container'>
          <h1 className='mq-modal-title'>Loading Shop...</h1>
        </div>
      </div>
    );
  }

  return (
    <div className='mq-modal-overlay'>
      <div className='mq-container'>
        <div className='mq-modal-header'>
          <h1 className='mq-modal-title'>Shop</h1>
          <button
            className='mq-close-btn'
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <hr />
        <div className='mq-modal-body'>
          {Object.entries(shopItems).map(([category, items]) => (
            <div
              key={category}
              className='mq-modal-category'
            >
              <h2 className='mq-modal-category-title'>Board {category}s</h2>
              <hr></hr>
              <div className='mq-modal-items-container'>
                {items.map((item) => (
                  <ShopItem
                    key={item.id}
                    item={item}
                    purchased={item.purchased}
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

export default Shop;
