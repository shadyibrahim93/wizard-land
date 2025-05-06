import Header from '../../components/Header';
import useLevelProgression from '../../hooks/useLevelProgression';
import { useState } from 'react';
import GameChat from '../../components/chatRoom';
import { Title, Meta } from 'react-head';
import Footer from '../../components/Footer.js';

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
      <div className={gameClass}>
        <Title>{`Play ${title} Online | Wizard Land`}</Title>
        <Meta
          name='description'
          content={`Play ${title} on Wizard Land`}
        />

        {/* Open Graph / Facebook */}
        <Meta
          property='og:url'
          content={window.location.href}
        />
        <Meta
          property='og:type'
          content='game'
        />
        <Meta
          property='og:title'
          content={`${title} | Wizard Land`}
        />
        <Meta
          property='og:description'
          content={`Play ${title} on Wizard Land`}
        />

        {/* Twitter */}
        <Meta
          name='twitter:card'
          content='summary_large_image'
        />
        <Meta
          name='twitter:title'
          content={`${title} | Wizard Land`}
        />
        <Meta
          name='twitter:description'
          content={`Play ${title} on Wizard Land`}
        />
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
      <script
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
      <script
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
                'url': 'https://wizardland.net/privacy-policy'
              },
              {
                '@type': 'WebPage',
                'name': 'Terms of Service',
                'url': 'https://wizardland.net/terms-of-service'
              },
              {
                '@type': 'WebPage',
                'name': 'Contact Us',
                'url': 'https://wizardland.net/contact-us'
              },
              {
                '@type': 'WebPage',
                'name': 'About Us',
                'url': 'https://wizardland.net/about-us'
              },
              {
                '@type': 'WebPage',
                'name': 'Login',
                'url': 'https://wizardland.net/login'
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
