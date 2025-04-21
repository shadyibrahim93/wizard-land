import React, { useEffect, useState } from 'react';
import Button from './Button';

const ConfirmationModal = ({ isOpen = false, onConfirm, onCancel, title }) => {
  const [counter, setCounter] = useState(10);

  useEffect(() => {
    let timer;

    if (isOpen) {
      setCounter(10); // Reset when modal opens

      timer = setInterval(() => {
        setCounter((prev) => {
          if (prev === 1) {
            clearInterval(timer);
            onConfirm(); // Auto confirm
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      setCounter(10); // Reset when modal closes
    }

    return () => clearInterval(timer);
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className='mq-modal-overlay'>
      <div className='mq-container mq-signin-page'>
        <div className='mq-modal-header'>
          <h1 className='mq-modal-title'>
            {title} {counter}s
          </h1>
        </div>
        <hr />
        <div className='modal-buttons thumbs-btns'>
          <Button
            onClick={onConfirm}
            text='Yes'
          />
          <Button
            onClick={onCancel}
            text='No'
            secondaryButton
          />
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
