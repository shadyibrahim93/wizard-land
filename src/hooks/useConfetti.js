export const launchStarConfetti = () => {
  const colors = ['#5c5e3d', '#c47f3c', '#ffffff']; // Your colors
  const canvas = document.createElement('canvas');
  document.body.appendChild(canvas);
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  canvas.style.position = 'fixed'; // Keep the canvas in place on the screen
  canvas.style.top = '0';
  canvas.style.left = '0';
  canvas.style.pointerEvents = 'none'; // Ensure it doesn't interfere with other interactions
  canvas.style.zIndex = '9999'; // Set high z-index to ensure it's on top of other elements
  const ctx = canvas.getContext('2d');

  // Function to generate a new star with random properties
  const generateStar = () => ({
    x: Math.random() * canvas.width,
    y: Math.random() * canvas.height,
    size: Math.random() * 10 + 1, // Random size between 1px and 10px
    color: colors[Math.floor(Math.random() * colors.length)],
    speed: Math.random() * 2 + 1,
    glowProgress: 0, // New property to track glow progression
    startDelay: Math.random() * 2000, // Random delay for each star's glow start
    alpha: 1 // Start with full opacity
  });

  // Create an initial batch of stars
  const stars = Array.from({ length: 2 }).map(generateStar);

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

    // Gradually increase the glow effect from 0 to 100
    ctx.shadowBlur = glowProgress; // Use glowProgress to set shadow blur intensity
    ctx.shadowColor = color; // Set the shadow color to match the star color

    ctx.fillStyle = color;
    ctx.globalAlpha = alpha; // Apply alpha to make the star fade out
    ctx.fill();
    ctx.restore();
  };

  let animationFrameId;

  const animateStars = () => {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    stars.forEach((star, index) => {
      // Decrease opacity (alpha) as the star moves
      if (star.alpha > 0) {
        star.alpha -= 0.01; // Make fading a bit slower
      } else {
        star.alpha = 0; // Ensure it doesn't go negative
      }

      // Draw the star with its fading opacity
      drawStar(
        ctx,
        star.x,
        star.y,
        star.size,
        star.color,
        star.glowProgress,
        star.alpha
      );

      // Move the star down
      star.y += star.speed;

      // If the star has gone off the canvas or faded out, regenerate a new star
      if (star.y > canvas.height || star.alpha === 0) {
        stars[index] = generateStar(); // Replace the old star with a new one
      }

      // Increase glow intensity after the delay
      if (star.glowProgress < 100 && star.startDelay <= 0) {
        star.glowProgress += 1; // Increase the glow intensity gradually
      } else if (star.startDelay > 0) {
        star.startDelay -= 16; // Decrease the start delay gradually (based on frame rate)
      }
    });

    // Use requestAnimationFrame to optimize the animation
    animationFrameId = requestAnimationFrame(animateStars);
  };

  animateStars();

  // Clean up after the animation ends
  setTimeout(() => {
    cancelAnimationFrame(animationFrameId); // Stop the animation
    document.body.removeChild(canvas); // Remove the canvas from the DOM
  }, 5000);
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
