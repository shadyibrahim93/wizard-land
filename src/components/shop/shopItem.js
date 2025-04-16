import React from 'react';
import { purchaseItem } from '../../apiService';
import { useUser } from '../../context/UserContext';

const ShopItem = ({ item, purchased }) => {
  const { userId, loading } = useUser(); // Directly use your useUser hook

  const handlePurchase = async (item) => {
    if (loading) {
      alert('Please wait while we verify your account...');
      return;
    }

    if (!userId) {
      alert('You must be logged in to make a purchase.');
      return;
    }

    try {
      const { success, error } = await purchaseItem(
        userId,
        item.id,
        item.stars
      );

      if (success) {
        alert(`You successfully purchased ${item.name || item.id}!`);
      } else {
        alert(`Purchase failed: ${error}`);
      }
    } catch (err) {
      alert('An unexpected error occurred. Please try again.');
      console.error('Purchase error:', err);
    }
  };

  return (
    <div className={`mq-modal-item ${purchased}`}>
      {item.image && (
        <img
          src={item.image}
          alt={item.name}
          className='mq-piece mq-piece-image'
        />
      )}

      <span className='mq-piece'>
        {item.emoji && item.emoji}
        {item.image_url && (
          <img
            src={`wizard-land/assets/elements/board_pieces/${item.image_url}`}
            alt={`Board Piece - ${item.className}`}
          />
        )}
      </span>
      <p className='mq-modal-price'>
        <img src='wizard-land/assets/elements/star_single.png' />
        {item.stars}
      </p>
      <button
        onClick={() => handlePurchase(item)}
        className='mq-btn'
      >
        Buy
      </button>
    </div>
  );
};

export default ShopItem;
