'use client';
import { useEffect, useState } from 'react';
import { useUser } from '../context/UserContext.js';
import { useSelectedPiece } from '../hooks/userSelectedPiece.js';

export default function RealmSetter() {
  const { userId } = useUser();
  const player = useSelectedPiece(userId);

  useEffect(() => {
    if (!player) return; // Wait until player data is available

    const localStorageRealm = localStorage.getItem('realm');
    const playerRealm = localStorageRealm || player?.realm || 'fantasy';

    // Update DOM and storage
    document.documentElement.setAttribute('data-theme', playerRealm);
    localStorage.setItem('realm', playerRealm);

    console.log('Realm initialized:', playerRealm);
  }, [player]); // Only re-run when player data changes

  return null;
}
