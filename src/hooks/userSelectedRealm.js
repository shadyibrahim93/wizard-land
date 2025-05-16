// src/hooks/userSelectedRealm.js
'use client';
import { useEffect, useState } from 'react';
import useSelectedItems from './useSelectedItems.js';
import { useUser } from '../context/UserContext.js';

export default function useSelectedRealm() {
  const { userId = null, loading = true } = useUser() || {};
  const selected = useSelectedItems(userId);
  const [realm, setRealm] = useState(null); // Start with null, not fantasy

  useEffect(() => {
    if (typeof window === 'undefined' || loading) return;

    try {
      const userRealm = selected?.realm?.className;

      if (userRealm) {
        // Valid realm found
        localStorage.setItem('realm', userRealm);
        setRealm(userRealm);
      } else {
        // Nothing returned — fallback
        localStorage.setItem('realm', 'fantasy');
        setRealm('fantasy');
      }
    } catch (error) {
      console.error('Error resolving realm:', error);
      localStorage.setItem('realm', 'fantasy');
      setRealm('fantasy');
    }
  }, [userId, selected?.realm?.className, loading]);

  return realm;
}
