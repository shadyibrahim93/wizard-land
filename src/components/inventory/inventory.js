import React, { useEffect, useState } from 'react';
import InventoryItem from './inventoryItem';
import { getUserInventoryGroupedByType } from '../../apiService';
import { useUser } from '../../context/UserContext';

const Inventory = ({ onClose }) => {
  const { userId, loading } = useUser();
  const [inventoryItems, setInventoryItems] = useState({});

  const categoryOrder = ['theme', 'piece', 'background']; // whatever your types are

  const sortedEntries = Object.entries(inventoryItems).sort(
    ([a], [b]) => categoryOrder.indexOf(b) - categoryOrder.indexOf(a)
  );

  useEffect(() => {
    if (!userId) return;

    const fetchInventory = async () => {
      try {
        const groupedInventory = await getUserInventoryGroupedByType(userId);
        setInventoryItems(groupedInventory);
      } catch (error) {
        console.error('Failed to load inventory:', error);
      }
    };

    fetchInventory();
  }, [userId]);

  // Function to refresh the inventory by re-fetching it
  const refreshInventory = async () => {
    if (!userId) return;
    const groupedInventory = await getUserInventoryGroupedByType(userId);
    setInventoryItems(groupedInventory);
  };

  return (
    <div className='mq-modal-overlay'>
      <div className='mq-container'>
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
                <h2 className='mq-modal-category-title'>
                  Board {category.charAt(0).toUpperCase() + category.slice(1)}s
                </h2>
                <hr />
                <div className='mq-modal-items-container'>
                  {items.map((item) => (
                    <InventoryItem
                      key={item.id}
                      item={item}
                      userId={userId}
                      isActive={item.is_active}
                      refreshInventory={refreshInventory} // Pass down refresh function
                    />
                  ))}
                </div>
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
