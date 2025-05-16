// src/components/ThemeInitializer.jsx
'use client';
import { useEffect, useState } from 'react';
import useSelectedRealm from '../hooks/userSelectedRealm.js';

export default function ThemeInitializer() {
  const realm = useSelectedRealm();
  const [initialized, setInitialized] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined' || initialized) return;

    const themeToApply = realm || 'fantasy';

    try {
      document.documentElement.setAttribute('data-theme', themeToApply);
    } catch (e) {
      console.error('Failed to set theme:', e);
    }

    document.documentElement.classList.add('theme-initialized');
    setInitialized(true);
  }, [realm, initialized]);

  return null;
}
