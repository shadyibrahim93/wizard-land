'use client';

import React, { useEffect, useState } from 'react';
import ShopItem from './shopItem';
import { getShopItemsGroupedByType } from '../../apiService';
import { useUser } from '../../context/UserContext';
import { RxCaretDown, RxCaretUp } from 'react-icons/rx';
import ShopItemLazyWrapper from './ShopItemLazyWrapper.js';

const Shop = ({ onClose }) => {
  const [shopItems, setShopItems] = useState({});
  const [loading, setLoading] = useState(true);
  const [collapsedCategories, setCollapsedCategories] = useState({});
  const { userId } = useUser();

  useEffect(() => {
    const fetchShopItems = async () => {
      const groupedItems = await getShopItemsGroupedByType(userId);
      setShopItems(groupedItems);
      // Initialize collapsed state for all categories (default: expanded)
      const initialCollapsed = Object.keys(groupedItems).reduce(
        (acc, category) => {
          acc[category] = false;
          return acc;
        },
        {}
      );
      setCollapsedCategories(initialCollapsed);
      setLoading(false);
    };

    fetchShopItems();
  }, []);

  const toggleCategory = (category) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

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
    <div
      className='mq-modal-overlay'
      onClick={onClose}
    >
      <div
        className='mq-container'
        onClick={(e) => e.stopPropagation()}
      >
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
              <div
                className='mq-modal-category-header'
                onClick={() => toggleCategory(category)}
                style={{
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center'
                }}
              >
                <h2 className='mq-modal-category-title'>
                  {category !== 'realm' ? 'Board' : 'Game'}{' '}
                  {category.charAt(0).toUpperCase() + category.slice(1)}s
                </h2>
                <span className={`mq-toggle-caret`}>
                  {collapsedCategories[category] ? (
                    <RxCaretDown />
                  ) : (
                    <RxCaretUp />
                  )}
                </span>
              </div>
              {!collapsedCategories[category] && (
                <>
                  <hr />
                  <div className='mq-modal-items-container'>
                    {items.map((item, index) =>
                      index < 5 ? (
                        <ShopItem
                          key={item.id}
                          item={item}
                          purchased={item.purchased}
                        />
                      ) : (
                        <ShopItemLazyWrapper
                          key={item.id}
                          item={item}
                        />
                      )
                    )}
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
        <div className='mq-modal-footer'></div>
      </div>
    </div>
  );
};

export default Shop;
