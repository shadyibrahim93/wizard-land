'use client';

import Header from '../Header.jsx';
import useLevelProgression from '../../hooks/useLevelProgression.js';
import { useState } from 'react';
import GameChat from '../chatRoom.jsx';
import Footer from '../Footer.jsx';

const GameStart = ({ title, GameComponent, gameClass, gameId, chatTitle }) => {
  const [maxLevel, setMaxLevel] = useState(); // Default max level

  const {
    currentLevel,
    setCurrentLevel,
    setNextLevel,
    setCurrentLevelPassed,
    setFinalLevelOver
  } = useLevelProgression();

  const imageUrl = chatTitle
    .replace(/chat\s*room/i, '') // remove 'Chat Room' (case-insensitive)
    .toLowerCase()
    .replace(/\s+/g, ''); // remove all spaces

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
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': ['VideoGame', 'WebApplication'],
            'name': title,
            'image': `https://wizardland.net/assets/images/${imageUrl}.jpg`,
            'url': typeof window !== 'undefined' ? window.location.href : '',
            'description': `Play ${title}, an ad-free online multiplayer board game on Wizard Land! Connect with players worldwide and enjoy strategic fantasy gameplay.`,
            'applicationCategory': 'GameApplication',
            'operatingSystem': 'Any',
            'browserRequirements': `Requires a modern web browser with HTML5 support`,
            'playMode': [
              'https://schema.org/SinglePlayer',
              'https://schema.org/MultiPlayer'
            ],
            'author': {
              '@type': 'Person',
              'name': 'Shady Ibrahim',
              'affiliation': {
                '@type': 'Organization',
                'name': 'Wizard Land',
                'url': 'https://wizardland.net'
              }
            },
            'genre': [
              'Board Game',
              'Strategy Game',
              'Multiplayer Game',
              'Single Player Game',
              'Family Game',
              'Online Game',
              'Social Game',
              'Competitive Game',
              'Casual Game',
              'Fantasy Game'
            ],
            'keywords': [
              title,
              'online board game',
              'multiplayer game',
              'strategy game',
              'turn-based strategy',
              'competitive',
              'free to play',
              'play online',
              'worldwide multiplayer',
              'ad-free game'
            ],
            'isFamilyFriendly': true,
            'contentRating': 'E for Everyone',
            'gamePlatform': ['http://schema.org/BrowserApplication'],
            'numberOfPlayers': {
              '@type': 'QuantitativeValue',
              'minValue': 1,
              'maxValue': 2
            },
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land',
              'url': 'https://wizardland.net'
            },
            'offers': {
              '@type': 'Offer',
              'price': '0',
              'priceCurrency': 'USD',
              'availability': 'https://schema.org/InStock',
              'url': typeof window !== 'undefined' ? window.location.href : ''
            },
            'gameLocation': {
              '@type': 'Place',
              'name': 'Online'
            }
          })
        }}
      />
      <Footer />
    </>
  );
};

export default GameStart;
