'use client';
import { useInView } from 'react-intersection-observer';
import InventoryItem from './inventoryitem';

const InventoryItemLazyWrapper = ({ item, userId, isActive }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '25px'
  });

  return (
    <div ref={ref}>
      {inView ? (
        <InventoryItem
          item={item}
          purchased={item.purchased}
          userId={userId}
          isActive={isActive}
        />
      ) : null}
    </div>
  );
};

export default InventoryItemLazyWrapper;
