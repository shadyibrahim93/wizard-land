// useSelectedItems.js
import { useEffect, useState } from 'react';
import { supabase } from '../apiService';

const useSelectedItems = (userId) => {
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    if (!userId) return;

    const fetchSelectedItems = async () => {
      const { data, error } = await supabase
        .from('user_inventory')
        .select('*, shop_items!user_inventory_item_id_fkey(*)')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching selected items:', error);
        return;
      }

      const result = {};
      data.forEach((entry) => {
        const item = entry.shop_items;
        if (item && item.type) {
          result[item.type] = item;
        }
      });

      setSelectedItems(result);
    };

    fetchSelectedItems();
  }, [userId]);

  return selectedItems;
};

export default useSelectedItems;
