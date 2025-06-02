'use client';
import React, { useEffect, useState } from 'react';
import InventoryItem from './inventoryItem';
import { getUserInventoryGroupedByType } from '../../apiService';
import { useUser } from '../../context/UserContext';
import { RxCaretDown, RxCaretUp } from 'react-icons/rx';

const Inventory = ({ onClose }) => {
  const { userId, loading } = useUser();
  const [inventoryItems, setInventoryItems] = useState({});
  const [collapsedCategories, setCollapsedCategories] = useState({});

  const categoryOrder = ['theme', 'piece', 'background'];

  const sortedEntries = Object.entries(inventoryItems).sort(
    ([a], [b]) => categoryOrder.indexOf(b) - categoryOrder.indexOf(a)
  );

  useEffect(() => {
    if (userId === 'Fire') return;

    const fetchInventory = async () => {
      try {
        const groupedInventory = await getUserInventoryGroupedByType(userId);
        setInventoryItems(groupedInventory);

        const isMobileApp =
          document.querySelector('[data-mobile-app="true"]') !== null;

        // Initialize collapsed state
        const initialCollapsed = Object.keys(groupedInventory).reduce(
          (acc, category) => {
            acc[category] = isMobileApp ? category !== 'piece' : false;
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
    const isMobileApp =
      document.querySelector('[data-mobile-app="true"]') !== null;

    setCollapsedCategories((prev) => {
      const isCurrentlyCollapsed = prev[category];

      if (isMobileApp) {
        // Collapse all categories except the one toggled
        const updated = Object.keys(prev).reduce((acc, key) => {
          acc[key] = true;
          return acc;
        }, {});
        updated[category] = !isCurrentlyCollapsed;
        return updated;
      } else {
        // Desktop behavior — toggle only the selected category
        return {
          ...prev,
          [category]: !isCurrentlyCollapsed
        };
      }
    });

    // Scroll to the category after expanding
    if (collapsedCategories[category]) {
      setTimeout(() => {
        document.getElementById(`category-${category}`)?.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }, 100); // Slight delay to ensure collapse state updates first
    }
  };

  const handleItemActivate = (activatedItemId, itemType) => {
    setInventoryItems((prev) => {
      const updated = { ...prev };

      if (!updated[itemType]) return prev;

      updated[itemType] = updated[itemType].map((item) => ({
        ...item,
        is_active: item.id === activatedItemId // Activate one, deactivate others
      }));

      return updated;
    });
  };

  return (
    <div
      className='mq-modal-overlay mq-inventory'
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
          {userId !== 'Fire' ? (
            sortedEntries.map(([category, items]) => (
              <div
                key={category}
                id={`category-${category}`}
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
                      {items.map((item) => (
                        <InventoryItem
                          key={item.id}
                          item={item}
                          userId={userId}
                          isActive={item.is_active}
                          onActivate={handleItemActivate}
                        />
                      ))}
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
