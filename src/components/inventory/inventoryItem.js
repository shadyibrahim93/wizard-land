import React from 'react';

const ShopItem = ({ item, onActivate }) => {
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
      <button
        onClick={() => onActivate(item)}
        className='mq-btn'
      >
        Activate
      </button>
    </div>
  );
};

export default ShopItem;
