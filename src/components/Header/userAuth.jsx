'use client';

import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CustomLink from '../CustomLink.js';
import { useState } from 'react';
import Image from 'next/image'; // Import next/image for optimized images
import SendEmailModal from '../authModals/sendEmail.js';
import useSelectedRealm from '../../hooks/userSelectedRealm.js';
import ProfileModal from '../Profile.js';
import { FaUserCircle } from 'react-icons/fa';

const UserAuth = ({ loading, userId, userName, onSignUp }) => {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [showProfileModal, setShowProfileModal] = useState(false);
  const { realm } = useSelectedRealm();

  const [sound, setSound] = useState(() => {
    if (typeof window !== 'undefined') {
      return localStorage.getItem('sound') || 'on';
    }
    return 'on';
  });

  const handleSoundToggle = () => {
    const newSoundState = sound === 'on' ? 'off' : 'on';
    setSound(newSoundState);
    localStorage.setItem('sound', newSoundState);
    window.location.reload();
  };

  const imageSrc =
    sound === 'on'
      ? `/assets/images/sound_on.png`
      : `/assets/images/sound_off.png`;

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
          {/* Buy Me a Coffee link */}
          <div className='mq-user-progress--contact'>
            <a
              href='https://www.buymeacoffee.com/wizardland'
              target='_blank'
              rel='noopener noreferrer'
            >
              <Image
                src={`/assets/images/${realm}/elements/support.png`}
                alt='Support our work | Wizard Land'
                title='Support our work | Wizard Land'
                width={24} // Adjust the width
                height={24} // Adjust the height
              />{' '}
              Contribute
            </a>
          </div>
        </div>

        <div>
          <span className='mq-sound-toggle'>
            <Image
              src={imageSrc}
              alt='Sound Control'
              width={24}
              height={24}
              onClick={handleSoundToggle}
              title='Toggle Sound'
            />
          </span>
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
                  <div
                    className='mq-user-username'
                    onClick={() => setShowProfileModal(true)}
                  >
                    {userName} <FaUserCircle className='mq-edit-icon' />
                  </div>
                </>
              )}
            </div>
          </h3>
        </div>
      </div>

      <SendEmailModal
        showEmailModal={showEmailModal}
        onClose={() => setShowEmailModal(false)}
      />
      <ProfileModal
        showProfileModal={showProfileModal}
        onClose={() => setShowProfileModal(false)}
      />
    </>
  );
};

export default UserAuth;
