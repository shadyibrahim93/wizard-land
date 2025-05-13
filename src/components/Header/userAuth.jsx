'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CustomLink from '../CustomLink.js';
import { useState } from 'react';
import Image from 'next/image'; // Import next/image for optimized images
import SendEmailModal from '../authModals/sendEmail.js';
import useSelectedRealm from '../../hooks/userSelectedRealm.js';

const UserAuth = ({ loading, userId, userName, onSignUp }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const realm = useSelectedRealm();

  if (loading) {
    return (
      <h3 className='mq-user-name'>
        <Skeleton
          width={80}
          height={24}
          inline
          style={{ marginRight: 8 }}
        />
      </h3>
    );
  }

  return (
    <>
      <div className='mq-user-container'>
        <div>
          {/* Open feedback modal */}
          <div className='mq-user-progress--contact'>
            <Image
              src={`/assets/images/${realm}/elements/email.png`}
              alt='Send feedback'
              width={24} // Adjust the width
              height={24} // Adjust the height
            />
            <a
              type='button'
              id='send-email'
              className='icon-button'
              onClick={() => setShowEmailModal(true)}
            >
              Feedback
            </a>
          </div>

          {/* Buy Me a Coffee link */}
          <div className='mq-user-progress--contact'>
            <Image
              src={`/assets/images/${realm}/elements/support.png`}
              alt='Support us'
              width={24} // Adjust the width
              height={24} // Adjust the height
            />
            <a
              href='https://www.buymeacoffee.com/wizardland'
              target='_blank'
              rel='noopener noreferrer'
            >
              Contribute
            </a>
          </div>
        </div>

        <h3 className='mq-user-name'>
          <div className='mq-user-sign'>
            {!userId ? (
              <CustomLink
                text='SIGN UP'
                onClick={onSignUp}
                className='sign-up'
              />
            ) : (
              <>
                {/* <Image
                  src={imageSrc}
                  alt='Home'
                  width={24} // Adjust width as needed
                  height={24} // Adjust height as needed
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleClick}
                  title='Home'
                /> */}
                {userName}
              </>
            )}
          </div>
        </h3>
      </div>

      <SendEmailModal
        showEmailModal={showEmailModal}
        onClose={() => setShowEmailModal(false)}
      />
    </>
  );
};

export default UserAuth;
