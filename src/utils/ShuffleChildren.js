// Shuffle function to shuffle an array in place
const shuffleArray = (array) => {
  return array.slice().sort(() => Math.random() - 0.5);
};

export default shuffleArray;
