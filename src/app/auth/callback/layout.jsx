'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../../../apiService.js'; // Ensure this exports your Supabase client

export default function OAuthCallbackPage() {
  const [deepLink, setDeepLink] = useState('');

  useEffect(() => {
    (async () => {
      const { data, error } = await supabase.auth.getSession();

      if (error || !data.session) {
        console.error('Failed to fetch Supabase session:', error);
        return;
      }

      const { access_token, refresh_token } = data.session;

      const encodedDeepLink = `wizardland://auth/callback#access_token=${encodeURIComponent(
        access_token
      )}&refresh_token=${encodeURIComponent(refresh_token)}`;

      setDeepLink(encodedDeepLink);

      // Try auto-redirect after short delay
      setTimeout(() => {
        window.location.href = encodedDeepLink;
      }, 500);
    })();
  }, []);

  return (
    <div style={{ textAlign: 'center', marginTop: '2rem' }}>
      <p style={{ color: 'white' }}>Redirecting to the app...</p>
      <p style={{ color: 'yellow' }}>
        If you are not redirected automatically,
      </p>
      <button
        onClick={() => {
          if (deepLink) window.location.href = deepLink;
        }}
        disabled={!deepLink}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: deepLink ? 'pointer' : 'not-allowed',
          borderRadius: '5px',
          border: 'none',
          backgroundColor: deepLink ? '#4CAF50' : '#999',
          color: 'white'
        }}
      >
        Click here to open the app
      </button>
    </div>
  );
}
