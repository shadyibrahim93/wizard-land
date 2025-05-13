// src/hooks/userSelectedRealm.js
'use client';
import { useEffect, useState } from 'react';
import useSelectedItems from './useSelectedItems.js';
import { useUser } from '../context/UserContext.js';

// Make sure you're using default export
export default function useSelectedRealm() {
  const { userId = null, loading = true } = useUser() || {};
  const selected = useSelectedItems(userId);
  const [realm, setRealm] = useState('fantasy');

  useEffect(() => {
    if (typeof window === 'undefined' || loading) return;

    try {
      const storedRealm = localStorage.getItem('realm');
      const userRealm = selected?.realm?.className;
      const newRealm = storedRealm || userRealm || 'fantasy';

      setRealm(newRealm);
      if (userRealm && userRealm !== storedRealm) {
        localStorage.setItem('realm', userRealm);
      }
    } catch (error) {
      console.error('Error initializing realm:', error);
      setRealm('fantasy');
    }
  }, [userId, selected?.realm?.className, loading]);

  return realm;
}
