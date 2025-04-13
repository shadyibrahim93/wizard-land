import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import CustomLink from '../CustomLink';
import { FaDoorOpen } from 'react-icons/fa6';
import { FaDoorClosed } from 'react-icons/fa6';
import { IoMdPersonAdd } from 'react-icons/io';

const UserAuth = ({ loading, userId, userName, onSignUp }) => {
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
              text='SIGN UP'
              onClick={onSignUp}
              className='sign-up'
            />
          </>
        ) : (
          userName
        )}
      </div>
    </h3>
  );
};

export default UserAuth;
