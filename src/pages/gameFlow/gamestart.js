import Header from '../../components/Header';
import useLevelProgression from '../../hooks/useLevelProgression';
import { useEffect, useState } from 'react';
import { playBGMusic } from '../../hooks/useSound';
import GameChat from '../chatRoom';

const GameStart = ({
  title,
  GameComponent,
  gameClass,
  gameChatRoomId,
  chatTitle
}) => {
  const [maxLevel, setMaxLevel] = useState(); // Default max level

  const {
    currentLevel,
    setCurrentLevel,
    setNextLevel,
    setCurrentLevelPassed,
    setFinalLevelOver
  } = useLevelProgression();

  useEffect(() => {
    playBGMusic();
  }, []);

  return (
    <div className={gameClass}>
      <Header
        title={title}
        backTarget='/'
        level={currentLevel > maxLevel ? 'Completed' : currentLevel}
      />
      <div className='mq-main'>
        <div
          className='mq-game-wrapper'
          data-level={currentLevel}
        >
          <GameComponent
            setMaxLevel={setMaxLevel}
            setCurrentLevel={setCurrentLevel}
            setNextLevel={setNextLevel}
            setCurrentLevelPassed={setCurrentLevelPassed}
            setFinalLevelOver={setFinalLevelOver}
          />
        </div>
        <GameChat
          gameChatRoomId={gameChatRoomId}
          chatTitle={chatTitle}
        />
      </div>
    </div>
  );
};

export default GameStart;
