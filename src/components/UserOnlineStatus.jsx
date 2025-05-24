'use client';
import { useState, useEffect } from 'react';
import { supabase } from '../apiService.js';

const UserOnlineStatus = ({ userId }) => {
  const [isOnline, setIsOnline] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const fetchOnlineStatus = async () => {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('is_online')
          .eq('id', userId)
          .single();

        if (!error && data) {
          setIsOnline(data.is_online);
        }
      } catch (error) {
        console.error('Error fetching online status:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchOnlineStatus();

    // Set up real-time subscription
    const subscription = supabase
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
          setIsOnline(payload.new.is_online);
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(subscription);
    };
  }, [userId]);

  if (loading) return null;

  return (
    <span
      className={`mq-player-status ${
        isOnline ? 'mq-player-online' : 'mq-player-offline'
      }`}
    ></span>
  );
};

export default UserOnlineStatus;
