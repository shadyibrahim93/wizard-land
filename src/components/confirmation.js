import React, { useState, useEffect } from 'react';
import Button from './Button';

const MultiplayerConfirmModal = ({
  isOpen, // ← parent controls show/hide
  onClose, // ← called when the “×” is clicked
  onThumbsUp, // ← called when local player clicks 👍
  onThumbsDown // ← called when local player clicks 👎
}) => {
  const [active, setActive] = useState(null);

  useEffect(() => {
    if (!isOpen) {
      setActive(null); // Reset active state when modal is closed
    }
  }, [isOpen]);

  if (!isOpen) return null;

  if (!isOpen) return null;

  const handleUp = () => {
    setActive('up');
    onThumbsUp?.();
  };

  const handleDown = () => {
    setActive('down');
    onThumbsDown?.();
  };

  return (
    <div className='mq-modal-overlay'>
      <div className='mq-container mq-signin-page'>
        <div className='mq-modal-header'>
          <h1 className='mq-modal-title'>Play another round?</h1>
          <button
            className='mq-close-btn'
            onClick={onClose}
          >
            ✕
          </button>
        </div>
        <hr />
        <div className='modal-buttons thumbs-btns'>
          <Button
            onClick={handleUp}
            text='👍'
            className={active === 'up' ? 'active' : ''}
          />
          <Button
            onClick={handleDown}
            text='👎'
            className={active === 'down' ? 'active' : ''}
          />
        </div>
      </div>
    </div>
  );
};

export default MultiplayerConfirmModal;
