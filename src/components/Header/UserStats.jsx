'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import expIcon from '../../assets/images/elements/exp.png';
import euroIcon from '../../assets/images/elements/euro.png';
import starIcon from '../../assets/images/elements/star.png';
import emailIcon from '../../assets/images/elements/email.png';
import supportIcon from '../../assets/images/elements/support.png';

import Button from '../Button.js';
import SendEmailModal from '../authModals/sendEmail.js';
import { useState } from 'react';
import { playButtonHover } from '../../hooks/useSound.js';
import Image from 'next/image'; // Import next/image for optimized images

const UserStats = ({ loading, exp, euro, stars, userId }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);

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
            <span className='mq-user-progress--exp'>
              <span className='mq-user-icon'>
                <Image
                  src={expIcon}
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
            </span>

            <span className='mq-user-progress--euro'>
              <span className='mq-user-icon'>
                <Image
                  src={euroIcon}
                  alt='Euro'
                  width={24} // Adjust the width
                  height={24} // Adjust the height
                />
              </span>
              <span className='mq-user-amount'>{euro}</span>
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
              <span className='mq-user-icon'>
                <Image
                  src={starIcon}
                  alt='Stars'
                  width={24} // Adjust the width
                  height={24} // Adjust the height
                />
              </span>
              <span
                className='mq-user-amount'
                id='coinCounterRef'
              >
                {stars}
              </span>
            </span>
          </>
        )}
        <span className='mq-user-progress--contact'>
          <span className='mq-user-icon'>
            <Image
              src={emailIcon}
              alt='Send feedback'
              width={24} // Adjust the width
              height={24} // Adjust the height
            />
          </span>
          <a
            type='button'
            id='send-email'
            className='icon-button'
            onClick={() => setShowEmailModal(true)}
            onMouseEnter={playButtonHover}
          >
            Feedback
          </a>
        </span>
        <span className='mq-user-progress--contact'>
          <span className='mq-user-icon'>
            <Image
              src={supportIcon}
              alt='Support us'
              width={24} // Adjust the width
              height={24} // Adjust the height
            />
          </span>
          <a
            href='https://www.buymeacoffee.com/wizardland'
            target='_blank'
            onMouseEnter={playButtonHover}
          >
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
