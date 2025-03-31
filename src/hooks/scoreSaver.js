const saveScoreToLocalStorage = (gameName, scoreEntry) => {
  const existingScores = JSON.parse(localStorage.getItem(gameName)) || [];
  const updatedScores = [...existingScores, scoreEntry]
    .sort((a, b) => b.score - a.score)
    .slice(0, 10);

  localStorage.setItem(gameName, JSON.stringify(updatedScores));
};

export default saveScoreToLocalStorage;
