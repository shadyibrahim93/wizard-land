import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CustomLink from '../CustomLink';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { playDoor } from '../../hooks/useSound';
import emailIcon from '../../assets/images/elements/email.png';
import supportIcon from '../../assets/images/elements/support.png';
import SendEmailModal from '../authModals/sendEmail';

const UserAuth = ({ loading, userId, userName, onSignUp }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [showEmailModal, setShowEmailModal] = useState(false);
  const navigate = useNavigate();

  const imageSrc = `/wizard-land/assets/images/elements/${
    isHovered ? 'home_active.png' : 'home.png'
  }`;

  const handleClick = () => {
    navigate('/'); // home path
  };

  const handleMouseEnter = () => {
    setIsHovered(true);
    playDoor(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    playDoor(false);
  };

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
            <img
              src={emailIcon}
              alt='Send feedback'
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
            <img
              src={supportIcon}
              alt='Support us'
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
                <img
                  src={imageSrc}
                  alt='Home'
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                  onClick={handleClick}
                  title='Home'
                />
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
