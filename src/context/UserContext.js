'use client';
import { createContext, useContext, useEffect, useState } from 'react';
import { supabase } from '@/apiService';

const UserContext = createContext();

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState(null);
  const [userType, setUserType] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const updateUserState = (user) => {
      if (!isMounted) return;
      setUser(user);
      const name = user.user_metadata?.full_name || user.email || 'Unknown';
      const type = user.user_metadata?.env || 'prod';
      setUserName(name);
      setUserType(type);
    };

    const fetchUser = async () => {
      const {
        data: { session }
      } = await supabase.auth.getSession();
      if (session?.user) updateUserState(session.user);

      const {
        data: { user }
      } = await supabase.auth.getUser();
      if (user) updateUserState(user);

      if (isMounted) setLoading(false);
    };

    fetchUser();

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session?.user) updateUserState(session.user);
      else {
        setUser(null);
        setUserName(null);
        setUserType(null);
      }
      setLoading(false);
    });

    return () => {
      isMounted = false;
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{ userId: user?.id, userName, userType, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

export const useUser = () => useContext(UserContext);
