import { useEffect, useRef } from 'react';

export const CollectionBurst = ({ count = 15, onComplete }) => {
  const coinContainerRef = useRef();
  const expContainerRef = useRef();

  const getImagePath = (fileName) =>
    require(`../assets/images/elements/${fileName}`);

  useEffect(() => {
    const animateBurst = (items, target) => {
      if (!target || items.length === 0) return;

      const targetRect = target.getBoundingClientRect();
      const startX = window.innerWidth / 2;
      const startY = window.innerHeight / 2;

      items.forEach((item, i) => {
        item.style.left = `${startX}px`;
        item.style.top = `${startY}px`;

        const offsetX = (Math.random() - 0.5) * 100;
        const offsetY = (Math.random() - 0.5) * 100;

        setTimeout(() => {
          item.style.transform = `translate(${
            targetRect.left - startX + offsetX
          }px, ${targetRect.top - startY + offsetY}px)`;
          item.style.opacity = '0';
        }, i * 100);
      });
    };

    const coinItems = coinContainerRef.current?.querySelectorAll('.mq-coin');
    const expItems = expContainerRef.current?.querySelectorAll('.mq-exp');
    const coinTarget = document.querySelector('#coinCounterRef');
    const expTarget = document.querySelector('#expCounterRef');

    if (coinItems && coinTarget) {
      animateBurst(coinItems, coinTarget);
    }

    if (expItems && expTarget) {
      animateBurst(expItems, expTarget);
    }

    const timeout = setTimeout(() => {
      onComplete?.();
    }, 1000 + count * 100);

    return () => clearTimeout(timeout);
  }, [count, onComplete]);

  return (
    <>
      <div ref={coinContainerRef}>
        {[...Array(count)].map((_, i) => (
          <div
            key={`coin-${i}`}
            className='coin'
          >
            <img
              src={getImagePath('star_single.png')}
              alt='coin'
              className='mq-coin'
            />
          </div>
        ))}
      </div>
      <div ref={expContainerRef}>
        {[...Array(count)].map((_, i) => (
          <div
            key={`exp-${i}`}
            className='exp'
          >
            <img
              src={getImagePath('exp.png')}
              alt='exp'
              className='mq-exp'
            />
          </div>
        ))}
      </div>
    </>
  );
};
