// src/hooks/userSelectedRealm.js
'use client';
import { useEffect, useState } from 'react';
import useSelectedItems from './useSelectedItems.js';
import { useUser } from '../context/UserContext.js';

export default function useSelectedRealm() {
  const { userId = null, loading: userLoading = true } = useUser() || {};
  const selected = useSelectedItems(userId);
  const [realm, setRealm] = useState(null);
  const [resolved, setResolved] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || userLoading) return;

    try {
      const storedRealm = localStorage.getItem('realm');
      const selectedRealm = selected?.realm?.class_name;
      const userRealm = storedRealm || selectedRealm;

      // Always validate realm value
      const validatedRealm = [storedRealm, selectedRealm, 'cartoonia'].find(
        (value) => value && typeof value === 'string'
      );

      if (resolved && selectedRealm && selectedRealm !== storedRealm) {
        const newRealm = selectedRealm || 'cartoonia';
        localStorage.setItem('realm', newRealm);
        window.dispatchEvent(new Event('realm-changed'));
        setRealm(newRealm);
      } else if (userRealm) {
        localStorage.setItem('realm', userRealm);
        setRealm(userRealm);
      } else {
        setRealm('cartoonia');
      }
    } catch (error) {
      console.error('Error resolving realm:', error);
      setRealm('cartoonia');
    } finally {
      setResolved(true);
    }
  }, [userId, selected?.realm?.class_name, userLoading]);

  return { realm: realm || 'cartoonia', resolved }; // Final fallback
}
