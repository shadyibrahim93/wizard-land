// hooks/useOnlineStatus.js
import { useState, useEffect } from 'react';
import { supabase } from '../apiService.js';

// A simple in-module cache:
const statusCache = new Map();

export function useOnlineStatus(userId) {
  const [isOnline, setIsOnline] = useState(
    () => statusCache.get(userId)?.status ?? null
  );

  useEffect(() => {
    if (userId === 'Fire') {
      setIsOnline(null);
      return;
    }

    let entry = statusCache.get(userId);

    // First component for this user?
    if (!entry) {
      entry = {
        status: null,
        subs: new Set(),
        subscription: null
      };
      statusCache.set(userId, entry);

      // Fetch initial status once
      supabase
        .from('profiles')
        .select('is_online')
        .eq('id', userId)
        .single()
        .then(({ data, error }) => {
          if (!error && data) {
            entry.status = data.is_online;
            entry.subs.forEach((fn) => fn(data.is_online));
          }
        });

      // Subscribe once
      entry.subscription = supabase
        .channel(`online-status:${userId}`)
        .on(
          'postgres_changes',
          {
            event: 'UPDATE',
            schema: 'public',
            table: 'profiles',
            filter: `id=eq.${userId}`
          },
          (payload) => {
            const newStatus = payload.new.is_online;
            entry.status = newStatus;
            entry.subs.forEach((fn) => fn(newStatus));
          }
        )
        .subscribe();
    }

    // Add this component’s setter to the subscribers set
    entry.subs.add(setIsOnline);
    // Immediately send current cached status
    setIsOnline(entry.status);

    return () => {
      entry.subs.delete(setIsOnline);
      // If no more listeners, tear down
      if (entry.subs.size === 0) {
        supabase.removeChannel(entry.subscription);
        statusCache.delete(userId);
      }
    };
  }, [userId]);

  return isOnline;
}
