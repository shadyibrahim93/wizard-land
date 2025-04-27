import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import expIcon from '../../assets/images/elements/exp.png';
import euroIcon from '../../assets/images/elements/euro.png';
import starIcon from '../../assets/images/elements/star.png';
import emailIcon from '../../assets/images/elements/email.png';
import supportIcon from '../../assets/images/elements/support.png';

import Button from '../Button';
import SendEmailModal from '../authModals/sendEmail';
import { useState } from 'react';
import { playButtonHover } from '../../hooks/useSound';

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
    userId && (
      <>
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
            <Button
              text='+'
              className='mq-user-add'
            />
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
          <span className='mq-user-progress--contact'>
            <span className='mq-user-icon'>
              <img src={emailIcon} />
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
              <img src={supportIcon} />
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
    )
  );
};

export default UserStats;
