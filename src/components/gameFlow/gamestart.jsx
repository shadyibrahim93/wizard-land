'use client';

import Header from '../Header.jsx';
import useLevelProgression from '../../hooks/useLevelProgression.js';
import { useState } from 'react';
import GameChat from '../chatRoom.jsx';
import Footer from '../Footer.jsx';
import Script from 'next/script';

const GameStart = ({ title, GameComponent, gameClass, gameId, chatTitle }) => {
  const [maxLevel, setMaxLevel] = useState(); // Default max level

  const {
    currentLevel,
    setCurrentLevel,
    setNextLevel,
    setCurrentLevelPassed,
    setFinalLevelOver
  } = useLevelProgression();

  return (
    <>
      <Header
        title={title}
        backTarget='/'
        level={currentLevel > maxLevel ? 'Completed' : currentLevel}
        gameId={gameId}
      />
      <div className={gameClass}>
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
      <Script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Game',
            'name': title,
            'url': typeof window !== 'undefined' ? window.location.href : '',
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'All',
            'playMode': ['SinglePlayer', 'Multiplayer'],
            'numberOfPlayers': {
              '@type': 'QuantitativeValue',
              'minValue': 1,
              'maxValue': 2
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land'
            },
            'description': `Enter the world of magic and challenge—play ${title} now on Wizard Land, where fun meets fantasy!`
          })
        }}
      />
      <Script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            'name': `Play ${title} Online | Wizard Land`,
            'url': typeof window !== 'undefined' ? window.location.href : '',
            'hasPart': [
              {
                '@type': 'WebPage',
                'name': 'Privacy Policy',
                'url': 'https://wizardland.net'
              },
              {
                '@type': 'WebPage',
                'name': 'Terms of Service',
                'url': 'https://wizardland.net'
              },
              {
                '@type': 'WebPage',
                'name': 'Contact Us',
                'url': 'https://wizardland.net'
              },
              {
                '@type': 'WebPage',
                'name': 'About Us',
                'url': 'https://wizardland.net'
              },
              {
                '@type': 'WebPage',
                'name': 'Login',
                'url': 'https://wizardland.net'
              }
            ]
          })
        }}
      />
      <Footer />
    </>
  );
};

export default GameStart;
