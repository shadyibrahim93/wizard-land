'use client';
import { useInView } from 'react-intersection-observer';
import ShopItem from './shopItem';

const ShopItemLazyWrapper = ({ item }) => {
  const { ref, inView } = useInView({
    triggerOnce: true,
    rootMargin: '50px'
  });

  return (
    <div ref={ref}>
      {inView ? (
        <ShopItem
          item={item}
          purchased={item.purchased}
        />
      ) : null}
    </div>
  );
};

export default ShopItemLazyWrapper;
