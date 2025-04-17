import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CustomLink from '../CustomLink';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { playDoor } from '../../hooks/useSound';

const UserAuth = ({ loading, userId, userName, onSignUp }) => {
  const [isHovered, setIsHovered] = useState(false);
  const navigate = useNavigate();

  const imageSrc = `/wizard-land/assets/elements/${
    isHovered ? 'home_active.png' : 'home.png'
  }`;

  const handleClick = () => {
    navigate('/'); // Change '/' to your desired home path
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
    <div className='mq-user-container'>
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
  );
};

export default UserAuth;
