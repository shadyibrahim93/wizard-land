'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

import Button from '../Button.js';
import SendEmailModal from '../authModals/sendEmail.js';
import { useState } from 'react';
import { playButtonHover } from '../../hooks/useSound.js';
import Image from 'next/image'; // Import next/image for optimized images
import { useSelectedPiece } from '../../hooks/userSelectedPiece.js';

const UserStats = ({ loading, exp, euro, stars, userId }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const player = useSelectedPiece(userId);

  if (loading) {
    return (
      <h3 className='mq-user-progress'>
        <Skeleton
          width={30}
          height={18}
          className='mq-user-amount'
        />
        <Skeleton
          width={30}
          height={18}
          className='mq-user-amount'
        />
        <Skeleton
          width={30}
          height={18}
          className='mq-user-amount'
        />
      </h3>
    );
  }

  return (
    <>
      <h3 className='mq-user-progress'>
        {userId && (
          <>
            {/* <span className='mq-user-progress--exp'>
              <span className='mq-user-icon'>
                <Image
                  src={`/assets/images/${player.realm}/elements/exp.png`}
                  alt='Experience'
                  width={24} // Adjust the width
                  height={24} // Adjust the height
                />
              </span>
              <span
                className='mq-user-amount'
                id='expCounterRef'
              >
                {exp}
              </span>
            </span> */}

            <span className='mq-user-progress--euro'>
              <span className='mq-user-amount'>
                <span className='mq-user-icon'>
                  <Image
                    src={`/assets/images/${player.realm}/elements/euro.png`}
                    alt='Euro'
                    width={24} // Adjust the width
                    height={24} // Adjust the height
                  />
                </span>
                {euro}
              </span>
              <Button
                text='+'
                className='mq-user-add'
                onClick={() => {
                  const bmcButton = document.getElementById('bmc-wbtn');
                  if (bmcButton) {
                    bmcButton.click();
                  }
                }}
              />
            </span>

            <span className='mq-user-progress--star'>
              <span
                className='mq-user-amount'
                id='coinCounterRef'
              >
                <span className='mq-user-icon'>
                  <Image
                    src={`/assets/images/${player.realm}/elements/star.png`}
                    alt='Stars'
                    width={24} // Adjust the width
                    height={24} // Adjust the height
                  />
                </span>
                {stars}
              </span>
            </span>
          </>
        )}
        <span className='mq-user-progress--contact'>
          <a
            type='button'
            id='send-email'
            className='mq-user-amount'
            onClick={() => setShowEmailModal(true)}
            onMouseEnter={playButtonHover}
          >
            <span className='mq-user-icon'>
              <Image
                src={`/assets/images/${player.realm}/elements/email.png`}
                alt='Send feedback'
                width={24} // Adjust the width
                height={24} // Adjust the height
              />
            </span>
            Feedback
          </a>
        </span>
        <span className='mq-user-progress--contact'>
          <a
            className='mq-user-amount'
            href='https://www.buymeacoffee.com/wizardland'
            target='_blank'
            onMouseEnter={playButtonHover}
          >
            <span className='mq-user-icon'>
              <Image
                src={`/assets/images/${player.realm}/elements/support.png`}
                alt='Support us'
                width={24} // Adjust the width
                height={24} // Adjust the height
              />
            </span>
            Support My Work
          </a>
        </span>
      </h3>
      <SendEmailModal
        showEmailModal={showEmailModal}
        onClose={() => setShowEmailModal(false)}
      />
    </>
  );
};

export default UserStats;
