import { useState, useEffect } from 'react';
import Header from '../../../components/Header';
import checkLevelCompletion from '../../../utils/checkLevelCompletion';
import { useNavigate } from 'react-router-dom';
import Game from './template';

const MathQuest = () => {
  const [currentLevel, setCurrentLevel] = useState(1); // Manage level state
  const [nextLevel, setNextLevel] = useState(2); // Manage next level state
  const [currentLevelPassed, setCurrentLevelPassed] = useState(false);
  const navigate = useNavigate();

  // ✅ Trigger checkLevelCompletion when nextLevel is currentLevel + 1
  useEffect(() => {
    if (currentLevelPassed) {
      checkLevelCompletion(currentLevelPassed);
      setTimeout(() => {
        setCurrentLevel(currentLevel + 1);
        setNextLevel(nextLevel + 1);
      }, 1000);
      setCurrentLevelPassed(false);
    } else if (currentLevel === 4) {
      navigate('/');
      setCurrentLevel(1);
      setNextLevel(2);
      setCurrentLevelPassed(false);
    }
  }, [nextLevel, currentLevel, currentLevelPassed]);

  return (
    <div className='mq-math-game'>
      <Header
        title={`Math Quest`}
        backTarget='/'
        level='∞'
      />

      {currentLevel === 1 ? (
        <Game
          setCurrentLevel={setCurrentLevel}
          setNextLevel={setNextLevel}
          setCurrentLevelPassed={setCurrentLevelPassed}
        />
      ) : (
        ''
      )}
    </div>
  );
};

export default MathQuest;
