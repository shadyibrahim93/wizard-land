import Header from '../components/Header.jsx';
import GameCards from '../components/GameCards';
import { useState, useEffect } from 'react';
import { introStarConfetti } from '../hooks/useConfetti';
import LeaderBoard from '../components/leaderBoard';
import GameChat from '../components/chatRoom';
import { playBGMusic } from '../hooks/useSound.js';
import Footer from '../components/Footer';
import Head from 'next/head';

export default function Home() {
  const gamesData = [
    {
      url: '/games/bingo-quest',
      imgSrc: 'bingo_quest.jpg',
      alt: 'Bingo Game',
      title: 'Bingo',
      type: 'Singleplayer'
    },
    {
      url: '/games/orbito-quest',
      imgSrc: 'orbito_quest.jpg',
      alt: 'Orbito Game',
      title: 'Orbito',
      type: 'Multiplayer'
    },
    {
      url: '/games/chess-quest',
      imgSrc: 'chess_quest.jpg',
      alt: 'Chess Game',
      title: 'Chess',
      type: 'Multiplayer'
    },
    {
      url: '/games/connect-four-quest',
      imgSrc: 'connect_four_quest.jpg',
      alt: 'Connect Four Game',
      title: 'Connect 4',
      type: 'Multiplayer'
    },
    {
      url: '/games/tic-tac-toe-quest',
      imgSrc: 'tictactoe_quest.jpg',
      alt: 'Tic Tac Toe Game',
      title: 'Tic Tac Toe',
      type: 'Multiplayer'
    },
    {
      url: '/games/checker-quest',
      imgSrc: 'checker_quest.jpg',
      alt: 'Checker Game',
      title: 'Checker',
      type: 'Multiplayer'
    },
    {
      url: '/games/scramble-quest',
      imgSrc: 'scramble_quest.jpg',
      alt: 'Scramble Game',
      title: 'Scrambled',
      type: 'Singleplayer'
    },
    {
      url: '/games/sudoku-quest',
      imgSrc: 'sudoku_quest.jpg',
      alt: 'Sudoku Game',
      title: 'Sudoku',
      type: 'Singleplayer'
    },
    /*
    {
      url: '/games/math-quest',
      imgSrc: 'math_quest.jpg',
      alt: 'Math Game',
      title: 'Math Marathon',
      type: 'Singleplayer'
    },
    */
    {
      url: '/games/puzzle-quest',
      imgSrc: 'puzzle_quest.jpg',
      alt: 'Puzzle Game',
      title: 'Jigsaw',
      type: 'Singleplayer'
    },
    {
      url: '/games/personal-puzzle-quest',
      imgSrc: 'personal_puzzle_quest.jpg',
      alt: 'Personal Puzzle Game',
      title: 'Personal Jigsaw',
      type: 'Singleplayer'
    },
    {
      url: '/games/match-quest',
      imgSrc: 'match_quest.jpg',
      alt: 'Matching Game',
      title: 'Pair Pursuit',
      type: 'Singleplayer'
    },
    {
      url: '/games/memory-quest',
      imgSrc: 'memory_quest.jpg',
      alt: 'Memory Game',
      title: 'Brain Vault',
      type: 'Singleplayer'
    },
    {
      url: '/games/dropzone-quest',
      imgSrc: 'dropzone_quest.jpg',
      alt: 'Drop Game',
      title: 'Perfect Fit',
      type: 'Singleplayer'
    }
  ];

  const [multiplayerGames, setMultiplayerGames] = useState([]);
  const [singleplayerGames, setSingleplayerGames] = useState([]);
  const [webPageSchema, setWebPageSchema] = useState(null);

  useEffect(() => {
    setWebPageSchema({
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      'name': `Play Board Games Online | Wizard Land`,
      'url': window.location.href,
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
    });
  }, []);

  useEffect(() => {
    setMultiplayerGames(
      gamesData.filter((game) => game.type === 'Multiplayer')
    );
    setSingleplayerGames(
      gamesData.filter((game) => game.type === 'Singleplayer')
    );
    introStarConfetti();
    playBGMusic('bgmusic');
  }, []);

  const gameSchema = gamesData.map((game) => ({
    '@type': 'Game',
    'name': game.title,
    'url': `https://wizardland.net${game.url}`,
    'image': `https://wizardland.net/images/games/${game.imgSrc}`, // Update image path if necessary
    'gameMode': game.type === 'Multiplayer' ? 'Multiplayer' : 'SinglePlayer',
    'description': `Play the game ${game.title} in Wizard Land`,
    'genre': game.type === 'Multiplayer' ? 'Multiplayer' : 'SinglePlayer',
    'applicationCategory': 'GameApplication',
    'publisher': {
      '@type': 'Organization',
      'name': 'Wizard Land'
    }
  }));

  return (
    <div className='mq-home'>
      <Head>
        <title>
          Wizard Land | Play Classic Board Games with Friends Online
        </title>
        <meta
          name='description'
          content='Wizard Land offers classic online board games like Chess, Checkers, Orbito, Connect 4, Tic Tac Toe, and more! Play with friends and family in a magical online multiplayer environment.'
        />
        <meta
          property='og:url'
          content='https://wizardland.net'
        />
        <meta
          property='og:type'
          content='website'
        />
        <meta
          property='og:title'
          content='Wizard Land | Play Classic Board Games Online'
        />
        <meta
          property='og:description'
          content='Wizard Land offers classic online board games like Chess, Checkers, Orbito, Connect 4, Tic Tac Toe, and more! Play with friends and family in a magical online multiplayer environment.'
        />
        <meta
          name='twitter:card'
          content='summary_large_image'
        />
        <meta
          name='twitter:title'
          content='Wizard Land | Play Classic Board Games Online'
        />
        <meta
          name='twitter:description'
          content='Wizard Land offers classic online board games like Chess, Checkers, Orbito, Connect 4, Tic Tac Toe, and more! Play with friends and family in a magical online multiplayer environment.'
        />
      </Head>

      <Header
        title='Wizard Land | Play Classic Board Games with Friends Online'
        homePage
        showSignUpLink
        showSignInLink
      />
      <main className='mq-dashboard-cards-wrapper'>
        <div className='mq-dashboard-container'>
          <section>
            <h2 className='mq-section-title mq-section-title--multiplayer'>
              ⚔️ Multiplayer Games
            </h2>
            <hr></hr>
            <div className='mq-cards-grid'>
              {multiplayerGames.map((game, index) => (
                <GameCards
                  key={index}
                  target={game.url}
                  imgSrc={game.imgSrc}
                  alt={game.alt}
                  title={game.title}
                />
              ))}
            </div>
          </section>
          <section>
            <h2 className='mq-section-title mq-section-title--solo'>
              🗡️ Solo Games
            </h2>
            <hr></hr>
            <div className='mq-cards-grid'>
              {singleplayerGames.map((game, index) => (
                <GameCards
                  key={index}
                  target={game.url}
                  imgSrc={game.imgSrc}
                  alt={game.alt}
                  title={game.title}
                />
              ))}
            </div>
          </section>
        </div>
        <div className='mq-side-container'>
          <LeaderBoard />
          <GameChat
            gameId='12'
            chatTitle='World Chat'
          />
        </div>
      </main>
      <script
        type='application/ld+json'
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'Website',
            'name': 'Wizard Land',
            'url': 'https://wizardland.net',
            'description':
              'Wizard Land offers classic online board games like Chess, Checkers, Orbito, Connect 4, Tic Tac Toe, and more! Play with friends and family in a magical online multiplayer environment.',
            'mainEntityOfPage': 'https://wizardland.net',
            'publisher': {
              '@type': 'Organization',
              'name': 'Wizard Land'
            },
            'game': gameSchema
          })
        }}
      />
      {webPageSchema && (
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(webPageSchema) }}
        />
      )}
      <Footer />
    </div>
  );
}
