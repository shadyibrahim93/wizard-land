'use client';

import Home from './Home';
import { useUser } from '../context/UserContext';
import BuyMeACoffee from '../components/BuyMeACoffee.js';

export default function ClientPage() {
  const { loading } = useUser();

  if (loading) return null;

  return (
    <>
      <Home />
      <BuyMeACoffee />
    </>
  );
}
