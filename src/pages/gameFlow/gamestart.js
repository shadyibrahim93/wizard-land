import Header from '../../components/Header';
import useLevelProgression from '../../hooks/useLevelProgression';
import { useEffect, useState } from 'react';
import { playBGMusic } from '../../hooks/useSound';
import GameChat from '../../components/chatRoom';
import { Helmet } from 'react-helmet-async';

const GameStart = ({ title, GameComponent, gameClass, gameId, chatTitle }) => {
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
      <Helmet prioritizeSeoTags>
        <title>{title} | Wizard Land</title>
        <meta
          name='description'
          content={`Play ${title} on Wizard Land`}
        />

        {/* Open Graph/Facebook */}
        <meta
          property='og:url'
          content={window.location.href}
        />
        <meta
          property='og:type'
          content='game'
        />
        <meta
          property='og:title'
          content={`${title} | Wizard Land`}
        />
        <meta
          property='og:description'
          content={`Play ${title} on Wizard Land`}
        />

        {/* Twitter */}
        <meta
          name='twitter:card'
          content='summary_large_image'
        />
        <meta
          name='twitter:title'
          content={`${title} | Wizard Land`}
        />
        <meta
          name='twitter:description'
          content={`Play ${title} on Wizard Land`}
        />
      </Helmet>
      <Header
        title={title}
        backTarget='/'
        level={currentLevel > maxLevel ? 'Completed' : currentLevel}
        gameId={gameId}
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
          gameId={gameId}
          chatTitle={chatTitle}
        />
      </div>
    </div>
  );
};

export default GameStart;
