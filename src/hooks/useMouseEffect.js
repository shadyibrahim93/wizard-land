import { useEffect } from 'react';

const useMouseEffect = () => {
  useEffect(() => {
    let start = new Date().getTime();
    const originPosition = { x: 0, y: 0 };
    const last = {
      starTimestamp: start,
      starPosition: originPosition,
      mousePosition: originPosition
    };
    const config = {
      starAnimationDuration: 1500,
      minimumTimeBetweenStars: 250,
      minimumDistanceBetweenStars: 75,
      glowDuration: 75,
      maximumGlowPointSpacing: 10,
      colors: ['92 94 61', '196 127 60', '255 255 255'],
      sizes: ['1.4rem', '1rem', '0.6rem'],
      animations: ['fall-1', 'fall-2', 'fall-3']
    };
    let count = 0;

    const rand = (min, max) =>
      Math.floor(Math.random() * (max - min + 1)) + min;
    const selectRandom = (items) => items[rand(0, items.length - 1)];

    const px = (value) => `${value}px`;

    const calcDistance = (a, b) => {
      const diffX = b.x - a.x,
        diffY = b.y - a.y;
      return Math.sqrt(Math.pow(diffX, 2) + Math.pow(diffY, 2));
    };

    const appendElement = (element) => document.body.appendChild(element);
    const removeElement = (element, delay) =>
      setTimeout(() => document.body.removeChild(element), delay);

    const clampPosition = (position) => ({
      x: Math.max(0, Math.min(position.x, window.innerWidth - 20)), // Prevents going off-screen
      y: Math.max(0, Math.min(position.y, window.innerHeight - 20)) // Prevents going off-screen
    });

    const createStar = (position) => {
      const star = document.createElement('span'),
        color = selectRandom(config.colors);

      star.className = 'stars fa-solid fa-sparkle';

      const clampedPos = clampPosition(position);
      star.style.left = px(clampedPos.x);
      star.style.top = px(clampedPos.y);
      star.style.fontSize = selectRandom(config.sizes);
      star.style.color = `rgb(${color})`;
      star.style.textShadow = `0px 0px 1.5rem rgb(${color} / 0.5)`;
      star.style.animationName = config.animations[count++ % 3];
      star.style.animationDuration = `${config.starAnimationDuration}ms`;

      appendElement(star);
      removeElement(star, config.starAnimationDuration);
    };

    const createMagicTrail = (position) => {
      const scatterCount = rand(1, 2); // Number of particles to create per flicker

      Array.from(Array(scatterCount)).forEach(() => {
        const magicParticle = document.createElement('div');

        magicParticle.className = 'magic-particle';

        const offsetX = rand(-15, 15); // Random horizontal offset
        const offsetY = rand(-15, 15); // Random vertical offset

        const clampedPos = clampPosition({
          x: position.x + offsetX,
          y: position.y + offsetY
        });

        magicParticle.style.left = px(clampedPos.x);
        magicParticle.style.top = px(clampedPos.y);
        magicParticle.style.width = `${rand(2, 5)}px`; // Small sparkling particles
        magicParticle.style.height = magicParticle.style.width;
        magicParticle.style.background = `radial-gradient(circle, rgba(255, 255, 255, 0.5), rgba(0, 150, 255, 0.2))`; // Glow effect with fading gradient
        magicParticle.style.borderRadius = '50%';
        magicParticle.style.position = 'absolute';
        magicParticle.style.boxShadow = `0px 0px 10px rgba(250,250,250, 0.5)`; // Glowing edges
        magicParticle.style.animation = `magic-flicker ${rand(
          500,
          1000
        )}ms ease-out forwards`; // Dynamic animation

        appendElement(magicParticle);
        removeElement(magicParticle, 1000); // Short-lived particles
      });
    };

    const createSmokeTrail = (last, current) => {
      const distance = calcDistance(last, current),
        quantity = determinePointQuantity(distance);

      const dx = (current.x - last.x) / quantity,
        dy = (current.y - last.y) / quantity;

      Array.from(Array(quantity)).forEach((_, index) => {
        const x = last.x + dx * index,
          y = last.y + dy * index;

        createMagicTrail({ x, y });
      });
    };

    const determinePointQuantity = (distance) =>
      Math.max(Math.floor(distance / config.maximumGlowPointSpacing), 1);

    const updateLastStar = (position) => {
      last.starTimestamp = new Date().getTime();
      last.starPosition = position;
    };

    const updateLastMousePosition = (position) => {
      last.mousePosition = position;
    };

    const adjustLastMousePosition = (position) => {
      if (last.mousePosition.x === 0 && last.mousePosition.y === 0) {
        last.mousePosition = position;
      }
    };

    const handleOnMove = (e) => {
      const mousePosition = clampPosition({ x: e.clientX, y: e.clientY });

      adjustLastMousePosition(mousePosition);

      const now = new Date().getTime(),
        hasMovedFarEnough =
          calcDistance(last.starPosition, mousePosition) >=
          config.minimumDistanceBetweenStars,
        hasBeenLongEnough =
          now - last.starTimestamp > config.minimumTimeBetweenStars;

      if (hasMovedFarEnough || hasBeenLongEnough) {
        createStar(mousePosition);
        updateLastStar(mousePosition);
      }

      createSmokeTrail(last.mousePosition, mousePosition);
      updateLastMousePosition(mousePosition);
    };

    window.addEventListener('mousemove', handleOnMove);
    window.addEventListener('touchmove', (e) => handleOnMove(e.touches[0]));
    document.body.addEventListener('mouseleave', () =>
      updateLastMousePosition(originPosition)
    );

    return () => {
      window.removeEventListener('mousemove', handleOnMove);
      window.removeEventListener('touchmove', (e) =>
        handleOnMove(e.touches[0])
      );
      document.body.removeEventListener('mouseleave', () =>
        updateLastMousePosition(originPosition)
      );
    };
  }, []);
};

export default useMouseEffect;
