import { useEffect, useState } from 'react';
import { supabase } from '../apiService';

const useUser = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const getCurrentUser = async () => {
      try {
        // 1. First check for existing session (instant)
        const {
          data: { session },
          error: sessionError
        } = await supabase.auth.getSession();

        if (sessionError) throw sessionError;
        if (session?.user) {
          updateUserState(session.user);
          if (isMounted) setLoading(false);
        }

        // 2. Verify with server (async)
        const {
          data: { user },
          error
        } = await supabase.auth.getUser();
        if (error) throw error;
        if (user) updateUserState(user);
      } catch (err) {
        console.error('Error getting current user:', err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    const updateUserState = (user) => {
      if (!isMounted) return;

      setUserId(user.id);
      const name = user.user_metadata?.full_name || user.email || 'Unknown';
      setUserName(name);

      // Fetch profile only if name is missing
      if (!user.user_metadata?.full_name) {
        fetchUserProfile(user.id);
      }
    };

    const fetchUserProfile = async (userId) => {
      try {
        const { data: profile, error } = await supabase
          .from('users')
          .select('full_name')
          .eq('id', userId)
          .single();

        if (error) throw error;
        if (profile?.full_name) {
          if (isMounted) setUserName(profile.full_name);
          // Update metadata for future sessions
          await supabase.auth.updateUser({
            data: { full_name: profile.full_name }
          });
        }
      } catch (err) {
        console.error('Error fetching profile:', err);
      }
    };

    // Initial fetch
    getCurrentUser();

    // 3. Subscribe to auth changes
    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (session?.user) {
        updateUserState(session.user);
      } else {
        setUserId(null);
        setUserName(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return { userId, userName, loading };
};

export default useUser;
