// app/oauth-callback/page.jsx
'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/router';
import { completeOAuthUser } from '../../../apiService.js';

export default function OAuthCallbackPage() {
  const router = useRouter();

  useEffect(() => {
    (async () => {
      const { success, error } = await completeOAuthUser();

      if (success) {
        alert("You've successfully signed in!");
      } else {
        console.error(error);
        alert(error || 'OAuth sign-in failed.');
      }

      // send them home
      router.replace('/');
    })();
  }, [router]);

  return <p>Signing you in…</p>;
}
