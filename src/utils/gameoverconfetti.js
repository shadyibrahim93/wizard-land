import confetti from 'canvas-confetti';

const triggerGameOverConfetti = () => {
  confetti({
    particleCount: 1000,
    spread: 500,
    origin: { x: 0.5, y: 0.5 },
    colors: ['#ff0', '#f0f', '#0ff', '#ff6347', '#32cd32']
  });
};

export default triggerGameOverConfetti;
