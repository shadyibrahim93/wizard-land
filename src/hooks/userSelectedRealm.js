// src/hooks/userSelectedRealm.js
'use client';
import { useEffect, useState } from 'react';
import useSelectedItems from './useSelectedItems.js';
import { useUser } from '../context/UserContext.js';

export default function useSelectedRealm() {
  const { userId = null, loading: userLoading = true } = useUser() || {};
  const selected = useSelectedItems(userId);
  const [realm, setRealm] = useState(null); // null = unresolved
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || userLoading) return;

    try {
      const userRealm =
        localStorage.getItem('realm') || selected?.realm?.className;

      if (userRealm) {
        localStorage.setItem('realm', userRealm);
        window.dispatchEvent(new Event('realm-changed'));
        setRealm(userRealm);
      } else {
        setRealm('fantasy');
      }
    } catch (error) {
      console.error('Error resolving realm:', error);
      setRealm('fantasy');
    } finally {
      setResolved(true);
    }
  }, [userId, selected?.realm?.className, userLoading]);

  return { realm, resolved };
}
