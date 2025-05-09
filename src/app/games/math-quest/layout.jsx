import { useState, useEffect } from 'react';
import Header from '../../../components/Header.jsx';
import checkLevelCompletion from '../../../utils/checkLevelCompletion.js';
import { useRouter } from 'next/navigation';
import Game from './template.jsx';

const MathQuest = () => {
  const [currentLevel, setCurrentLevel] = useState(1); // Manage level state
  const [nextLevel, setNextLevel] = useState(2); // Manage next level state
  const [currentLevelPassed, setCurrentLevelPassed] = useState(false);
  const router = useRouter();

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
      router.push('/');
      setCurrentLevel(1);
      setNextLevel(2);
      setCurrentLevelPassed(false);
    }
  }, [nextLevel, currentLevel, currentLevelPassed]);

  return (
    <>
      <head>{metadata}</head>
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
    </>
  );
};

export default MathQuest;
