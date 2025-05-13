'use client';
import { useEffect } from 'react';
import { useUser } from '../context/UserContext.js';
import { useSelectedPiece } from '../hooks/userSelectedPiece.js';

export default function RealmSetter() {
  const { userId } = useUser();
  const player = useSelectedPiece(userId);

  useEffect(() => {
    if (!player) return; // Wait until player data is available
    const localStorageRealm = localStorage.getItem('realm');
    const defaultRealm = player?.realm || 'fantasy';
    const playerRealm = localStorageRealm || player?.realm || defaultRealm;

    // Update DOM and storage
    document.documentElement.setAttribute('data-theme', playerRealm);

    console.log('Realm initialized:', playerRealm);
  }, [player]); // Only re-run when player data changes

  useEffect(() => {
    if (player?.realm) {
      localStorage.setItem('realm', player.realm);
    }
  }, [player]);

  return null;
}
