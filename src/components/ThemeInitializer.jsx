// src/components/ThemeInitializer.jsx
'use client';
import { useEffect } from 'react';
import useSelectedRealm from '../hooks/userSelectedRealm.js'; // Remove curly braces

export default function ThemeInitializer() {
  const realm = useSelectedRealm();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    try {
      document.documentElement.setAttribute('data-theme', realm || 'fantasy');
      document.documentElement.classList.add('theme-initialized');
    } catch (e) {
      console.error('Failed to set theme:', e);
      document.documentElement.setAttribute('data-theme', 'fantasy');
    }
  }, [realm]);

  return null;
}
