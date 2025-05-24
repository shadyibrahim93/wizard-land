// components/PresenceTracker.js
import { useEffect } from 'react';
import { supabase } from '../apiService.js'; // Adjust import path
import { useUser } from '../context/UserContext.js';

export default function PresenceTracker() {
  const { userId } = useUser();

  useEffect(() => {
    if (!userId) return;

    // Immediate update on mount
    const updatePresence = async (isOnline = true) => {
      const { error } = await supabase
        .from('profiles')
        .update({
          last_seen: new Date().toISOString(),
          is_online: isOnline
        })
        .eq('id', userId);

      if (error) console.error('Presence update failed:', error);
    };

    updatePresence();

    // Set up interval (every 10 seconds)
    const interval = setInterval(() => updatePresence(true), 60000);

    // Handle tab visibility changes
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        updatePresence(true);
      }
    };

    document.addEventListener('visibilitychange', handleVisibilityChange);

    // Cleanup
    return () => {
      clearInterval(interval);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
      updatePresence(false);
    };
  }, [userId]);

  return null;
}
