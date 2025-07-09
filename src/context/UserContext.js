'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/apiService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userId, setUserId] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const updateUserState = (user) => {
      if (!isMounted) return;
      setUser(user);

      const fullName = user.user_metadata?.full_name;
      const displayName =
        user.user_metadata?.display_name || user.user_metadata?.name;

      const name = (
        fullName && displayName && fullName !== displayName
          ? displayName
          : fullName || displayName
      ).split(' ')[0];

      const id = user.id;
      const type = user.user_metadata?.env || 'prod';
      setUserName(name);
      setUserId(id);
      setUserType(type);
    };

    const fetchUser = async () => {
      try {
        const {
          data: { session }
        } = await supabase.auth.getSession();
        if (session?.user) updateUserState(session.user);

        const {
          data: { user }
        } = await supabase.auth.getUser();
        if (user) updateUserState(user);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (session?.user) {
        // For SIGNED_IN events, we might want to refresh the user data
        if (event === 'SIGNED_IN') {
          const {
            data: { user }
          } = await supabase.auth.getUser();
          updateUserState(user || session.user);
        } else {
          updateUserState(session.user);
        }
      } else {
        setUser(null);
        setUserName(null);
        setUserType(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription?.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{
        userId: !loading && userId ? userId : !loading ? 'Fire' : null,
        userName: userName,
        userType,
        loading,
        userEmail: user?.email
      }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
