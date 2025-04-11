import { useEffect, useState } from 'react';
import { getCurrentUser } from '../apiService'; // adjust the import if needed

const useUser = () => {
  const [userId, setUserId] = useState(null);
  const [userName, setUserName] = useState(null);
  const [loading, setLoading] = useState(true); // ✅ new loading state

  useEffect(() => {
    const fetchUser = async () => {
      const user = await getCurrentUser();

      if (user) {
        const { id, user_metadata } = user;
        setUserId(id);
        setUserName(
          user_metadata?.full_name || user_metadata?.email || 'Unknown'
        );
      }

      setLoading(false); // ✅ whether user is found or not, we’re done loading
    };

    fetchUser();
  }, []);

  return { userId, userName, loading }; // ✅ return loading
};

export default useUser;
