export const launchStarConfetti = () => {
  const colors = ['#5c5e3d', '#c47f3c', '#ffffff'];
  const canvas = document.createElement('canvas');
  const ctx = canvas.getContext('2d');

  // Canvas setup with device pixel ratio consideration
  const dpr = window.devicePixelRatio || 1;
  canvas.width = window.innerWidth * dpr;
  canvas.height = window.innerHeight * dpr;
  canvas.style.width = '100%';
  canvas.style.height = '100%';
  canvas.style.position = 'fixed';
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none';
  canvas.style.zIndex = '19';
  ctx.scale(dpr, dpr);

  // Performance optimizations
  const MAX_STARS = 15; // Reduced number of particles
  const STAR_SIZE = 4; // Smaller base size
  const DURATION = 4000; // Shorter duration

  // Simplified star structure
  const stars = Array.from({ length: MAX_STARS }).map(() => ({
    x: Math.random() * canvas.width,
    y: -50, // Start above viewport
    size: STAR_SIZE + Math.random() * 3,
    color: colors[(Math.random() * colors.length) | 0],
    speed: 1 + Math.random() * 2,
    alpha: 0.8 + Math.random() * 0.2
  }));

  let lastFrameTime = performance.now();

  const render = (currentTime) => {
    const deltaTime = currentTime - lastFrameTime;
    lastFrameTime = currentTime;

    // Clear canvas efficiently
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    stars.forEach((star) => {
      // Update position
      star.y += star.speed * (deltaTime / 16);

      // Fade out as they reach bottom
      const progress = Math.min(1, star.y / (canvas.height * 0.7));
      const currentAlpha = star.alpha * (1 - progress);

      // Draw simple circles instead of complex stars
      ctx.beginPath();
      ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);

      // Use fill instead of shadow for better performance
      ctx.fillStyle = `rgba(${parseInt(star.color.slice(1, 3), 16)}, 
                           ${parseInt(star.color.slice(3, 5), 16)}, 
                           ${parseInt(star.color.slice(5, 7), 16)}, 
                           ${currentAlpha})`;
      ctx.fill();

      // Reset stars when they leave screen
      if (star.y > canvas.height + 50 || currentAlpha <= 0) {
        star.x = Math.random() * canvas.width;
        star.y = -50;
        star.alpha = 0.8 + Math.random() * 0.2;
      }
    });

    if (performance.now() - startTime < DURATION) {
      requestAnimationFrame(render);
    }
  };

  const startTime = performance.now();
  document.body.appendChild(canvas);
  requestAnimationFrame(render);

  // Cleanup
  setTimeout(() => {
    canvas.remove();
  }, DURATION + 1000);
};

let hasIntroStarConfettiPlayed = false; // Flag to ensure the animation plays only once

export const introStarConfetti = () => {
  if (hasIntroStarConfettiPlayed) return; // If already played, exit the function
  hasIntroStarConfettiPlayed = true; // Set flag to true after it starts

  const colors = ['#5c5e3d', '#c47f3c', '#ffffff']; // Your colors
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = 170; // Limit the height to top 170px of the screen
  canvas.style.position = 'fixed'; // Keep the canvas in place on the screen
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none'; // Ensure it doesn't interfere with other interactions
  canvas.style.zIndex = '-1'; // Set high z-index to ensure it's on top of other elements
  const ctx = canvas.getContext('2d');

  // Function to generate a new star with random properties
  const generateStar = () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * 170, // Limit initial Y position to the top 170px
    size: Math.random() * 10 + 1, // Random size between 1px and 10px
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: Math.random() * 1 + 1,
    glowProgress: 0, // New property to track glow progression
    startDelay: Math.random() * 2000, // Random delay for each star's glow start
    alpha: 1 // Start with full opacity
  });

  const stars = Array.from({ length: 10 }).map(generateStar);

  const drawStar = (ctx, x, y, size, color, glowProgress, alpha) => {
    ctx.save();
    ctx.beginPath();
    ctx.translate(x, y);
    ctx.moveTo(0, -size);
    for (let i = 0; i < 5; i++) {
      ctx.rotate((Math.PI * 2) / 5);
      ctx.lineTo(0, -size * 0.5);
      ctx.rotate((Math.PI * 2) / 5);
      ctx.lineTo(0, -size);
    }
    ctx.closePath();

    ctx.shadowBlur = glowProgress; // Glow effect
    ctx.shadowColor = color;
    ctx.fillStyle = color;
    ctx.globalAlpha = alpha;
    ctx.fill();
    ctx.restore();
  };

  const animateStars = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((star, index) => {
      star.alpha = Math.max(0, star.alpha - 0.01);
      drawStar(
        ctx,
        star.x,
        star.y,
        star.size,
        star.color,
        star.glowProgress,
        star.alpha
      );
      star.y += star.speed;
      if (star.y > canvas.height || star.alpha === 0) {
        stars[index] = generateStar();
      }
      if (star.glowProgress < 100 && star.startDelay <= 0) {
        star.glowProgress += 1;
      } else if (star.startDelay > 0) {
        star.startDelay -= 16;
      }
    });
    requestAnimationFrame(animateStars);
  };

  animateStars();
};

// Regular confetti effect
export const triggerConfetti = () => {
  const duration = 1.5 * 1000;
  const interval = setInterval(() => {
    launchStarConfetti();
  }, 100);

  setTimeout(() => clearInterval(interval), duration);
};

// Game over confetti effect
export const triggerGameOverConfetti = () => {
  const duration = 4 * 1000;
  const interval = setInterval(() => {
    launchStarConfetti(3); // Launch star confetti
  }, 100);

  setTimeout(() => clearInterval(interval), duration);
};
