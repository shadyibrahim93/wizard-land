// src/hooks/userSelectedRealm.js
'use client';
import { useEffect, useState } from 'react';
import useSelectedItems from './useSelectedItems.js';
import { useUser } from '../context/UserContext.js';

// Make sure you're using default export
export default function useSelectedRealm() {
  const { userId = null, loading = true } = useUser() || {};
  const selected = useSelectedItems(userId);
  // Initialize with localStorage value immediately (SSR-safe)
  const [realm, setRealm] = useState(() => {
    try {
      if (typeof window !== 'undefined') {
        return localStorage.getItem('realm');
      }
      return 'fantasy';
    } catch (error) {
      return 'fantasy';
    }
  });

  useEffect(() => {
    if (!loading) {
      // Only run when user data is loaded
      try {
        const userRealm = selected?.realm?.className;
        if (userRealm && userRealm !== realm) {
          localStorage.setItem('realm', userRealm);
          setRealm(userRealm);
        }
      } catch (error) {
        console.error('Error updating realm:', error);
      }
    }
  }, [userId, selected?.realm?.className, loading, realm]);

  return realm;
}
