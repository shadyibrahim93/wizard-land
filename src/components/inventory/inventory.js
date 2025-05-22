'use client';
import React, { useEffect, useState } from 'react';
import InventoryItem from './inventoryItem';
import { getUserInventoryGroupedByType } from '../../apiService';
import { useUser } from '../../context/UserContext';
import { RxCaretDown, RxCaretUp } from 'react-icons/rx';
import InventoryItemLazyWrapper from './InventoryItemLazyWrapper.js';

const Inventory = ({ onClose }) => {
  const { userId, loading } = useUser();
  const [inventoryItems, setInventoryItems] = useState({});
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const categoryOrder = ['theme', 'piece', 'background'];

  const sortedEntries = Object.entries(inventoryItems).sort(
    ([a], [b]) => categoryOrder.indexOf(b) - categoryOrder.indexOf(a)
  );

  useEffect(() => {
    if (!userId) return;

    const fetchInventory = async () => {
      try {
        const groupedInventory = await getUserInventoryGroupedByType(userId);
        setInventoryItems(groupedInventory);
        // Initialize collapsed state for all categories
        const initialCollapsed = Object.keys(groupedInventory).reduce(
          (acc, category) => {
            acc[category] = false;
            return acc;
          },
          {}
        );
        setCollapsedCategories(initialCollapsed);
      } catch (error) {
        console.error('Failed to load inventory:', error);
      }
    };

    fetchInventory();
  }, [userId]);

  const toggleCategory = (category) => {
    setCollapsedCategories((prev) => ({
      ...prev,
      [category]: !prev[category]
    }));
  };

  const refreshInventory = async () => {
    if (!userId) return;
    const groupedInventory = await getUserInventoryGroupedByType(userId);
    setInventoryItems(groupedInventory);
  };

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
          <h1 className='mq-modal-title'>
            {loading ? 'Loading Inventory...' : `Inventory`}
          </h1>
          <button
            className='mq-close-btn'
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <hr />
        <div className='mq-modal-body'>
          {userId ? (
            sortedEntries.map(([category, items]) => (
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
                  <span className='mq-toggle-caret'>
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
                          <InventoryItem
                            key={item.id}
                            item={item}
                            purchased={item.purchased}
                            userId={userId}
                            isActive={item.is_active}
                          />
                        ) : (
                          <InventoryItemLazyWrapper
                            key={item.id}
                            item={item}
                            purchased={item.purchased}
                            userId={userId}
                            isActive={item.is_active}
                          />
                        )
                      )}
                    </div>
                  </>
                )}
              </div>
            ))
          ) : (
            <h2 className='mq-modal-category-title mq-modal-category-title--no-user'>
              Must be signed in to view inventory!
            </h2>
          )}
        </div>
        <div className='mq-modal-footer'></div>
      </div>
    </div>
  );
};

export default Inventory;
