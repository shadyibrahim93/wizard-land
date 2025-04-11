import { Link } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Button from '../components/Button';
import SignUpModal from './../components/authModals/signUpModal';
import SignInModal from './../components/authModals/signInModal';
import { signOut } from '../apiService';
import {
  fetchUserGameProgress,
  fetchUserWallet,
  fetchAllUserGameProgress
} from '../apiService';
import expIcon from '../assets/images/elements/exp.png';
import euroIcon from '../assets/images/elements/euro.png';
import starIcon from '../assets/images/elements/star.png';
import useUser from '../hooks/useUser';
import CustomLink from '../components/CustomLink';
import { FaDoorOpen } from 'react-icons/fa6';
import { FaDoorClosed } from 'react-icons/fa6';
import { IoMdPersonAdd } from 'react-icons/io';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Header({ title, backTarget, level, homePage, gameId }) {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [exp, setExp] = useState(0); // Track user's experience
  const [euro, setEuro] = useState(0); // Track user's euro
  const [stars, setStars] = useState(0); // Track user's stars
  const { userId, userName, loading } = useUser();

  useEffect(() => {
    if (userId) {
      if (homePage) {
        fetchUserTotalProgress(userId);
      } else if (gameId) {
        fetchUserGameProgressData(userId, gameId);
        fetchUserWalletData(userId);
      }
    }
  }, [userId, gameId, homePage]);

  // Fetch user's game progress (exp, stars) from the `user_game_progress` table
  const fetchUserGameProgressData = async (userId, gameId) => {
    const data = await fetchUserGameProgress(userId, gameId);
    if (data) {
      setExp(data.exp || 0); // Set to 0 if no data is found
      setStars(data.stars || 0); // Set to 0 if no data is found
    }
  };

  // Fetch user's euro from `user_wallet` table
  const fetchUserWalletData = async (userId) => {
    const data = await fetchUserWallet(userId);
    if (data) {
      setEuro(data.euro || 0); // Set to 0 if no euro data is found
    }
  };

  const fetchUserTotalProgress = async (userId) => {
    const progressData = await fetchAllUserGameProgress(userId);
    const walletData = await fetchUserWallet(userId);

    let totalExp = 0;
    let totalStars = 0;

    if (progressData && progressData.length > 0) {
      progressData.forEach((entry) => {
        totalExp += entry.exp || 0;
        totalStars += entry.stars || 0;
      });
    }

    setExp(totalExp);
    setStars(totalStars);
    setEuro(walletData?.euro || 0);
  };

  const handleLogout = () => {
    signOut(); // Sign the user out from Supabase
  };

  return (
    <>
      <div className='mq-user-greeting'>
        {loading ? (
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
        ) : (
          userId && (
            <h3 className='mq-user-progress'>
              <span className='mq-user-progress--exp'>
                <span className='mq-user-icon'>
                  <img src={expIcon} />
                </span>
                <span className='mq-user-amount'>{exp}</span>
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
                <span className='mq-user-amount'>{stars}</span>
              </span>
            </h3>
          )
        )}
        <h3 className='mq-user-name'>
          <div className='mq-user-sign'>
            {loading ? (
              <>
                <Skeleton
                  width={80}
                  height={24}
                  inline
                  style={{ marginRight: 8 }}
                />
              </>
            ) : !userId ? (
              <>
                <CustomLink
                  Icon={<IoMdPersonAdd />}
                  text='SIGN UP'
                  onClick={() => setShowSignUpModal(true)}
                  className='sign-up'
                />
                {' | '}
                <CustomLink
                  Icon={<FaDoorOpen />}
                  text='LOG IN'
                  onClick={() => setShowSignInModal(true)}
                  className='log-in'
                />
              </>
            ) : (
              <>
                <span> {userName}!</span>{' '}
                <CustomLink
                  Icon={<FaDoorClosed />}
                  text='LOG OUT'
                  onClick={handleLogout}
                  className='log-out'
                />
              </>
            )}
          </div>
        </h3>
      </div>
      <header>
        <div className='mq-header-container'>
          {backTarget ? (
            <Link
              to={`${backTarget}`}
              className='mq-back-arrow'
            >
              ← Games
            </Link>
          ) : null}
          <h1>{title}</h1>
          {!homePage && <h2 className='mq-level'>Level {level}</h2>}
        </div>
      </header>
      {showSignUpModal && (
        <SignUpModal
          showSignUpModal={showSignUpModal}
          onClose={() => setShowSignUpModal(false)}
        />
      )}
      {showSignInModal && (
        <SignInModal
          showSignInModal={showSignInModal}
          onClose={() => setShowSignInModal(false)}
        />
      )}
    </>
  );
}
