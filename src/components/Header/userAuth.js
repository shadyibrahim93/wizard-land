import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CustomLink from '../CustomLink';
import { FaDoorOpen } from 'react-icons/fa6';
import { FaDoorClosed } from 'react-icons/fa6';
import { IoMdPersonAdd } from 'react-icons/io';

const UserAuth = ({
  loading,
  userId,
  userName,
  onSignIn,
  onSignUp,
  onLogout
}) => {
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
    <h3 className='mq-user-name'>
      <div className='mq-user-sign'>
        {!userId ? (
          <>
            <CustomLink
              Icon={<IoMdPersonAdd />}
              text='SIGN UP'
              onClick={onSignUp}
              className='sign-up'
            />
            {' | '}
            <CustomLink
              Icon={<FaDoorOpen />}
              text='LOG IN'
              onClick={onSignIn}
              className='log-in'
            />
          </>
        ) : (
          <>
            <span>{userName}!</span>{' '}
            <CustomLink
              Icon={<FaDoorClosed />}
              text='LOG OUT'
              onClick={onLogout}
              className='log-out'
            />
          </>
        )}
      </div>
    </h3>
  );
};

export default UserAuth;
