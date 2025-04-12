import { useState, useEffect } from 'react';
import { signOut } from '../apiService';
import {
  fetchUserGameProgress,
  fetchUserWallet,
  fetchAllUserGameProgress
} from '../apiService';
import useUser from '../hooks/useUser';
import UserStats from './Header/UserStats';
import UserAuth from './Header/userAuth';
import AuthModals from './Header/AuthModals';
import HeaderContent from './Header/GameHeader';

export default function Header({ title, backTarget, level, homePage, gameId }) {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [exp, setExp] = useState(0);
  const [euro, setEuro] = useState(0);
  const [stars, setStars] = useState(0);
  const { userId, userName, loading } = useUser();

  useEffect(() => {
    if (userId) {
      if (homePage) fetchUserTotalProgress(userId);
      else if (gameId) {
        fetchUserGameProgressData(userId, gameId);
        fetchUserWalletData(userId);
      }
    }
  }, [userId, gameId, homePage]);

  const fetchUserGameProgressData = async (userId, gameId) => {
    const data = await fetchUserGameProgress(userId, gameId);
    if (data) {
      setExp(data.exp || 0);
      setStars(data.stars || 0);
    }
  };

  const fetchUserWalletData = async (userId) => {
    const data = await fetchUserWallet(userId);
    if (data) setEuro(data.euro || 0);
  };

  const fetchUserTotalProgress = async (userId) => {
    const progressData = await fetchAllUserGameProgress(userId);
    const walletData = await fetchUserWallet(userId);
    let totalExp = 0;
    let totalStars = 0;

    if (progressData?.length) {
      progressData.forEach((entry) => {
        totalExp += entry.exp || 0;
        totalStars += entry.stars || 0;
      });
    }

    setExp(totalExp);
    setStars(totalStars);
    setEuro(walletData?.euro || 0);
  };

  const handleLogout = () => signOut();

  return (
    <>
      <div className='mq-user-greeting'>
        <UserStats
          loading={loading}
          userId={userId}
          exp={exp}
          euro={euro}
          stars={stars}
        />
        <UserAuth
          loading={loading}
          userId={userId}
          userName={userName}
          onSignIn={() => setShowSignInModal(true)}
          onSignUp={() => setShowSignUpModal(true)}
          onLogout={handleLogout}
        />
      </div>

      <HeaderContent
        title={title}
        backTarget={backTarget}
        level={level}
        homePage={homePage}
      />

      <AuthModals
        showSignUpModal={showSignUpModal}
        setShowSignUpModal={setShowSignUpModal}
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />
    </>
  );
}
