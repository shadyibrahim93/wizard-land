// app/not-found.tsx
'use client';
import { useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function NotFound() {
  const router = useRouter();

  useEffect(() => {
    const redirect = () => {
      const path =
        window.location.pathname +
        window.location.search +
        window.location.hash;
      router.replace('/?' + path);
    };
    redirect();
  }, [router]);

  return null;
}
