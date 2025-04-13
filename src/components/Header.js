import { useState, useEffect } from 'react';
import { signOut } from '../apiService';
import {
  fetchUserGameProgress,
  fetchUserWallet,
  subscribeToUserData,
  unsubscribeFromChannels
} from '../apiService';
import useUser from '../hooks/useUser';
import UserStats from './Header/UserStats';
import UserAuth from './Header/userAuth';
import AuthModals from './Header/AuthModals';
import HeaderContent from './Header/GameHeader';
import Shop from './shop/shop';

export default function Header({ title, backTarget, level, homePage, gameId }) {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [exp, setExp] = useState(0);
  const [euro, setEuro] = useState(0);
  const [stars, setStars] = useState(0);
  const { userId, userName, loading } = useUser();
  const [inventory, setInventory] = useState(null);
  const [channels, setChannels] = useState(null);

  useEffect(() => {
    if (!userId) return;

    const unsubscribe = subscribeToUserData(userId, {
      onWalletChange: (euro) => setEuro(euro),
      onStarsChange: (stars) => setStars(stars),
      onInventoryChange: (newItem) => {
        setInventory((prev) => [...prev, newItem]);
      }
    });
  }, [userId]);

  useEffect(() => {
    return () => {
      // Unsubscribe from all channels when component unmounts
      if (channels) {
        unsubscribeFromChannels(channels);
      }
    };
  }, [channels]);

  useEffect(() => {
    if (userId) {
      fetchUserTotalProgress(userId);
    }
  }, [userId, gameId, homePage]);

  const fetchUserTotalProgress = async (userId) => {
    const progressData = await fetchUserGameProgress(userId);
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
        loading={loading}
        userId={userId}
        userName={userName}
        title={title}
        backTarget={backTarget}
        level={level}
        homePage={homePage}
        onSignIn={() => setShowSignInModal(true)}
        onSignUp={() => setShowSignUpModal(true)}
        onLogout={handleLogout}
        showShop={() => setShowShop(true)}
      />

      <AuthModals
        showSignUpModal={showSignUpModal}
        setShowSignUpModal={setShowSignUpModal}
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />

      {showShop && <Shop onClose={() => setShowShop(false)} />}
    </>
  );
}
