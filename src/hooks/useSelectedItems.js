'use client';

import { useEffect, useState } from 'react';
import { supabase } from '../apiService.js';

const useSelectedItems = (userId) => {
  const [selectedItems, setSelectedItems] = useState({});

  useEffect(() => {
    if (!userId) return;

    const fetchActiveItems = async () => {
      const { data, error } = await supabase
        .from('user_inventory')
        .select('*')
        .eq('user_id', userId)
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching active items:', error);
        return {};
      }

      // Group active items by type (last active item per type wins)
      const grouped = data.reduce((acc, item) => {
        acc[item.type] = {
          id: item.id,
          euro: item.euro,
          type: item.type,
          emoji: item.emoji,
          stars: item.stars,
          image_url: item.image_url,
          is_active: item.is_active,
          class_name: item.class_name
        };
        return acc;
      }, {});

      return grouped;
    };

    const updateItems = async () => {
      const groupedItems = await fetchActiveItems();
      setSelectedItems(groupedItems);
    };

    // Initial fetch
    updateItems();
  }, [userId]);

  return selectedItems;
};

export default useSelectedItems;
