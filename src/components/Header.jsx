'use client';

import { useState, useEffect } from 'react';
import {
  fetchUserGameProgress,
  fetchUserWallet,
  subscribeToUserData,
  unsubscribeFromChannels,
  clearGameDataByUserId,
  signOut
} from '../apiService.js';
import { useUser } from '../context/UserContext.js';
import UserStats from './Header/UserStats.jsx';
import UserAuth from './Header/userAuth.jsx';
import AuthModals from './Header/AuthModals.jsx';
import HeaderContent from './Header/GameHeader.jsx';
import Shop from './shop/shop.js';
import Inventory from './inventory/inventory.js';
import About from './about.js';
import { useRouter } from 'next/navigation';

export default function Header({ title, backTarget, level, homePage, gameId }) {
  const [showSignUpModal, setShowSignUpModal] = useState(false);
  const [showSignInModal, setShowSignInModal] = useState(false);
  const [showShop, setShowShop] = useState(false);
  const [showInventory, setShowInventory] = useState(false);
  const [showAbout, setShowAbout] = useState(false);
  const [exp, setExp] = useState(0);
  const [euro, setEuro] = useState(0);
  const [stars, setStars] = useState(0);
  const { userId, userName, loading } = useUser();
  const [inventory, setInventory] = useState(null);
  const [channels, setChannels] = useState(null);
  const router = useRouter();

  useEffect(() => {
    if (!userId) return;

    const channel = subscribeToUserData(userId, {
      onWalletChange: (euro) => setEuro(euro),
      onStarsChange: (stars) => setStars(stars),
      onExpChange: (exp) => setExp(exp),
      onInventoryChange: (newItem) => {
        setInventory((prev) => [...(prev || []), newItem]);
      }
    });

    setChannels(channel); // Store it for cleanup

    return () => {
      if (channel) {
        unsubscribeFromChannels(channel); // Cleanup
      }
    };
  }, [userId]);

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

  const handleLogout = async () => {
    await clearGameDataByUserId(userId);
    await signOut();
    router('/'); // Add navigation
  };

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
        showAbout={() => setShowAbout(true)}
        showShop={() => setShowShop(true)}
        showInventory={() => setShowInventory(true)}
      />

      <AuthModals
        showSignUpModal={showSignUpModal}
        setShowSignUpModal={setShowSignUpModal}
        onSignUpSuccess={() => {
          setShowSignUpModal(false); // Close sign-up modal
          setShowAbout(true); // Show About modal
        }}
        showSignInModal={showSignInModal}
        setShowSignInModal={setShowSignInModal}
      />

      {showShop && <Shop onClose={() => setShowShop(false)} />}
      {showInventory && <Inventory onClose={() => setShowInventory(false)} />}
      {showAbout && <About onClose={() => setShowAbout(false)} />}
    </>
  );
}
