'use client';
import { useEffect, useState } from 'react';
import useSelectedRealm from '../hooks/userSelectedRealm.js';
import { useUser } from '../context/UserContext.js';

export default function ThemeInitializer() {
  const { realm, resolved } = useSelectedRealm();
  const [initialized, setInitialized] = useState(false);
  const [storedRealm, setStoredRealm] = useState(null);
  const { userId } = useUser();

  // Load realm from localStorage and listen for changes
  useEffect(() => {
    const loadStoredRealm = () => {
      const stored = localStorage.getItem('realm');
      setStoredRealm(stored);
      setInitialized(false); // retrigger the theme
    };

    loadStoredRealm(); // on mount

    window.addEventListener('realm-changed', loadStoredRealm);

    return () => {
      window.removeEventListener('realm-changed', loadStoredRealm);
    };
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined' || initialized) return;

    if (!resolved) return;

    const themeToApply = storedRealm || realm || 'fantasy';

    document.documentElement.setAttribute('data-theme', themeToApply);
    document.documentElement.classList.add('theme-initialized');

    console.log(
      'ThemeToApply:',
      themeToApply,
      '| Realm:',
      realm,
      '| Resolved:',
      resolved
    );

    setInitialized(true);
  }, [resolved, realm, initialized, storedRealm]);

  // Reset when user changes
  useEffect(() => {
    setInitialized(false);
  }, [userId]);

  return null;
}
