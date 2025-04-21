import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import expIcon from '../../assets/images/elements/exp.png';
import euroIcon from '../../assets/images/elements/euro.png';
import starIcon from '../../assets/images/elements/star.png';
import Button from '../Button';

const UserStats = ({ loading, exp, euro, stars, userId }) => {
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
    userId && (
      <h3 className='mq-user-progress'>
        <span className='mq-user-progress--exp'>
          <span className='mq-user-icon'>
            <img src={expIcon} />
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
            <img src={euroIcon} />
          </span>
          <span className='mq-user-amount'>{euro}</span>
          {/* <Button
            text='+'
            className='mq-user-add'
          /> */}
        </span>
        <span className='mq-user-progress--star'>
          <span className='mq-user-icon'>
            <img src={starIcon} />
          </span>
          <span
            className='mq-user-amount'
            id='coinCounterRef'
          >
            {stars}
          </span>
        </span>
      </h3>
    )
  );
};

export default UserStats;
