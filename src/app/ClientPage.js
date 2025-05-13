'use client';

import { useEffect, useState } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import emailjs from '@emailjs/browser';
import Home from './Home';
import Landing from './landing';
import { useUser } from '../context/UserContext';
import BuyMeACoffee from '../components/BuyMeACoffee.js';

export default function ClientPage() {
  const { userType, loading } = useUser();
  const searchParams = useSearchParams();
  const router = useRouter();

  const [showLanding, setShowLanding] = useState(null);

  useEffect(() => {
    if (loading) return;

    const cutoff = new Date('2025-06-01T00:00:00-04:00');
    const now = new Date();
    const fallbackPath = searchParams.get('path');

    if (fallbackPath) {
      router.replace(fallbackPath);
      return;
    }

    emailjs.init(process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY);
    const shouldShowLanding = now < cutoff && userType !== 'test';
    setShowLanding(shouldShowLanding);
  }, [searchParams, router, userType, loading]);

  if (loading || showLanding === null) return null;

  return showLanding ? (
    <Landing />
  ) : (
    <>
      <Home /> {showLanding ? '' : <BuyMeACoffee />}
    </>
  );
}
