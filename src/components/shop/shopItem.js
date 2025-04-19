import React from 'react';
import { purchaseItem } from '../../apiService';
import { useUser } from '../../context/UserContext';
import { playPurchase } from '../../hooks/useSound';
import Button from '../Button';

const ShopItem = ({ item }) => {
  const { userId, loading } = useUser(); // Directly use your useUser hook
  const getImagePath = (fileName) =>
    require(`../../assets/images/elements/${fileName}`);

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
    <div className={`mq-modal-item `}>
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
      <p className='mq-modal-price'>
        {item.stars !== 0 && (
          <>
            <img src={getImagePath('star_single.png')} />
            {item.stars}
          </>
        )}
        {item.euro !== 0 && (
          <>
            <img
              src={getImagePath('euro_single.png')}
              className='mq-sparkle'
            />
            {item.euro}
          </>
        )}
      </p>
      <Button
        onClick={() => {
          handlePurchase(item);
          playPurchase();
        }}
        className='mq-btn'
        isDisabled={item.purchased}
        text={item.purchased ? 'Bound' : 'Buy'}
      ></Button>
    </div>
  );
};

export default ShopItem;
