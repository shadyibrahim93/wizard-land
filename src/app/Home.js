import Header from '../components/Header.jsx';
import GameCards from '../components/GameCards';
import { useState, useEffect } from 'react';
import { introStarConfetti } from '../hooks/useConfetti';
import LeaderBoard from '../components/leaderBoard';
import GameChat from '../components/chatRoom';
import { playBGMusic } from '../hooks/useSound.js';
import Footer from '../components/Footer';
import Head from 'next/head';
import useSelectedRealm from '@/hooks/userSelectedRealm.js';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

export default function Home() {
  const { realm, resolved } = useSelectedRealm();

  const gamesData = [
    {
      url: '/games/bingo-quest',
      imgSrc: 'bingo',
      alt: 'Bingo Game',
      title: 'Bingo',
      type: 'Singleplayer',
      genres: ['Board Game', 'Single Player Game', 'Casual Game', 'Family Game']
    },
    {
      url: '/games/orbito-quest',
      imgSrc: 'orbito',
      alt: 'Orbito Game',
      title: 'Orbito',
      type: 'Multiplayer',
      genres: [
        'Board Game',
        'Multiplayer Game',
        'Strategy Game',
        'Online Game',
        'Social Game',
        'Competitive Game',
        'Family Game'
      ]
    },
    {
      url: '/games/chess-quest',
      imgSrc: 'chess',
      alt: 'Chess Game',
      title: 'Chess',
      type: 'Multiplayer',
      genres: [
        'Board Game',
        'Multiplayer Game',
        'Strategy Game',
        'Classic Game',
        'Online Game',
        'Social Game',
        'Competitive Game',
        'Family Game'
      ]
    },
    {
      url: '/games/connect-four-quest',
      imgSrc: 'connect_four',
      alt: 'Connect Four Game',
      title: 'Connect 4',
      type: 'Multiplayer',
      genres: [
        'Board Game',
        'Multiplayer Game',
        'Casual Game',
        'Online Game',
        'Social Game',
        'Competitive Game',
        'Family Game'
      ]
    },
    {
      url: '/games/tic-tac-toe-quest',
      imgSrc: 'tictactoe',
      alt: 'Tic Tac Toe Game',
      title: 'Tic Tac Toe',
      type: 'Multiplayer',
      genres: [
        'Board Game',
        'Multiplayer Game',
        'Casual Game',
        'Classic Game',
        'Online Game',
        'Social Game',
        'Competitive Game',
        'Family Game'
      ]
    },
    {
      url: '/games/checker-quest',
      imgSrc: 'checkers',
      alt: 'Checkers Game',
      title: 'Checkers',
      type: 'Multiplayer',
      genres: [
        'Board Game',
        'Multiplayer Game',
        'Strategy Game',
        'Classic Game',
        'Online Game',
        'Social Game',
        'Competitive Game',
        'Family Game'
      ]
    },
    {
      url: '/games/scramble-quest',
      imgSrc: 'scramble',
      alt: 'Scramble Game',
      title: 'Scrambled',
      type: 'Singleplayer',
      genres: ['Puzzle Game', 'Single Player Game', 'Word Game', 'Family Game']
    },
    {
      url: '/games/sudoku-quest',
      imgSrc: 'sudoku',
      alt: 'Sudoku Game',
      title: 'Sudoku',
      type: 'Singleplayer',
      genres: ['Puzzle Game', 'Single Player Game', 'Logic Game', 'Family Game']
    },
    {
      url: '/games/puzzle-quest',
      imgSrc: 'jigsaw',
      alt: 'Puzzle Game',
      title: 'Jigsaw',
      type: 'Singleplayer',
      genres: [
        'Puzzle Game',
        'Single Player Game',
        'Casual Game',
        'Family Game'
      ]
    },
    {
      url: '/games/personal-puzzle-quest',
      imgSrc: 'personal_jigsaw',
      alt: 'Personal Puzzle Game',
      title: 'Personal Jigsaw',
      type: 'Singleplayer',
      genres: [
        'Puzzle Game',
        'Single Player Game',
        'Casual Game',
        'Family Game'
      ]
    },
    {
      url: '/games/match-quest',
      imgSrc: 'matching',
      alt: 'Matching Game',
      title: 'Pair Pursuit',
      type: 'Singleplayer',
      genres: [
        'Puzzle Game',
        'Single Player Game',
        'Memory Game',
        'Family Game'
      ]
    },
    {
      url: '/games/memory-quest',
      imgSrc: 'memory',
      alt: 'Memory Game',
      title: 'Brain Vault',
      type: 'Singleplayer',
      genres: [
        'Puzzle Game',
        'Single Player Game',
        'Memory Game',
        'Family Game'
      ]
    },
    {
      url: '/games/dropzone-quest',
      imgSrc: 'dropzone',
      alt: 'Drop Game',
      title: 'Perfect Fit',
      type: 'Singleplayer',
      genres: [
        'Puzzle Game',
        'Single Player Game',
        'Casual Game',
        'Family Game'
      ]
    }
  ];

  const [multiplayerGames, setMultiplayerGames] = useState([]);
  const [singleplayerGames, setSingleplayerGames] = useState([]);

  useEffect(() => {
    setMultiplayerGames(
      gamesData.filter((game) => game.type === 'Multiplayer')
    );
    setSingleplayerGames(
      gamesData.filter((game) => game.type === 'Singleplayer')
    );
    introStarConfetti();
  }, []);

  useEffect(() => {
    if (realm) {
      playBGMusic(realm);
    }
  }, [realm]);

  const gameListItemSchema = gamesData.map((game, index) => ({
    '@type': 'ListItem',
    'position': index + 1,
    'item': {
      '@type': ['VideoGame', 'WebApplication'],
      'name': game.title,
      'url': `https://shadyibrahim93.github.io/wizard-land${game.url}`,
      'image': `https://shadyibrahim93.github.io/wizard-land/assets/images/games/${game.imgSrc}.jpg`, // Ensure correct path and extension
      'applicationCategory': 'GameApplication',
      'operatingSystem': 'Any',
      'browserRequirements': 'Requires a modern web browser with HTML5 support',
      'playMode':
        game.type === 'Multiplayer'
          ? 'https://schema.org/MultiPlayer'
          : 'https://schema.org/SinglePlayer',
      'genre': game.genres,
      'description': `Play the online game ${game.title} on Wizard Land.`,
      'publisher': {
        '@type': 'Organization',
        'name': 'Wizard Land',
        'url': 'https://shadyibrahim93.github.io/wizard-land'
      }
    }
  }));

  const homePageSchema = {
    '@context': 'https://schema.org',
    '@type': ['Website', 'CollectionPage'],
    'name': 'Wizard Land | Ad-Free Online Multiplayer Board Games',
    'url': 'https://shadyibrahim93.github.io/wizard-land',
    'description':
      'Play classic ad-free online multiplayer board games like Chess, Checkers, Orbito, Connect 4, Tic Tac Toe, and more on Wizard Land! Connect with friends and family worldwide for a magical gaming experience.',
    'keywords': [
      'online board games',
      'multiplayer board games',
      'ad-free games',
      'classic board games online',
      'play board games with friends',
      'free online games',
      'Wizard Land',
      'Chess online',
      'Checkers online',
      'Orbito online',
      'Connect 4 online',
      'Tic Tac Toe online',
      'online puzzle games',
      'online memory games'
    ],
    'publisher': {
      '@type': 'Organization',
      'name': 'Wizard Land',
      'url': 'https://shadyibrahim93.github.io/wizard-land',
      'logo': {
        '@type': 'ImageObject',
        'url':
          'https://shadyibrahim93.github.io/wizard-land/assets/images/logo.png'
      },
      'sameAs': [
        'https://www.facebook.com/people/Wizard-Land-Online-Board-Games/61575617324879/',
        'https://discord.com/channels/1369090826109452368/1369092092579680276',
        'https://buymeacoffee.com/wizardland'
      ]
    },
    'mainEntity': {
      '@type': 'ItemList',
      'itemListElement': gameListItemSchema
    }
  };

  return (
    <div className='mq-home'>
      <Head>
        <title>Wizard Land | Ad-Free Online Multiplayer Board Games</title>
        <meta
          name='description'
          content='Play classic ad-free online multiplayer board games like Chess, Checkers, Orbito, Connect 4, Tic Tac Toe, and more on Wizard Land! Connect with friends and family worldwide for a magical gaming experience.'
        />
        <meta
          property='og:url'
          content='https://shadyibrahim93.github.io/wizard-land'
        />
        <meta
          property='og:type'
          content='website'
        />
        <meta
          property='og:title'
          content='Wizard Land | Ad-Free Online Multiplayer Board Games'
        />
        <meta
          property='og:description'
          content='Play classic ad-free online multiplayer board games like Chess, Checkers, Orbito, Connect 4, Tic Tac Toe, and more on Wizard Land! Connect with friends and family worldwide for a magical gaming experience.'
        />
        <meta
          name='twitter:card'
          content='summary_large_image'
        />
        <meta
          name='twitter:title'
          content='Wizard Land | Ad-Free Online Multiplayer Board Games'
        />
        <meta
          name='twitter:description'
          content='Play classic ad-free online multiplayer board games like Chess, Checkers, Orbito, Connect 4, Tic Tac Toe, and more on Wizard Land! Connect with friends and family worldwide for a magical gaming experience.'
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
            <h1 className='mq-section-title mq-section-title--multiplayer'>
              {realm && realm !== 'fantasy' ? (
                <img
                  src={`/assets/images/${realm}/elements/multiplayer.png`}
                  alt='Multiplayer Games | Wizard Land'
                  title='Multiplayer Games | Wizard Land'
                />
              ) : (
                '⚔️'
              )}{' '}
              Multiplayer Games
            </h1>
            <hr></hr>
            <div className='mq-cards-grid'>
              {resolved
                ? multiplayerGames.map((game, index) => (
                    <GameCards
                      key={index}
                      target={game.url}
                      imgSrc={`${game.imgSrc}`}
                      alt={game.alt}
                      title={game.title}
                    />
                  ))
                : Array(multiplayerGames.length)
                    .fill()
                    .map((_, index) => (
                      <Skeleton
                        key={index}
                        height={200}
                        width={300}
                        className='mq-game-skeleton'
                        containerClassName='mq-skeleton-container'
                      />
                    ))}
            </div>
          </section>
          <section>
            <h1 className='mq-section-title mq-section-title--solo'>
              {realm && realm !== 'fantasy' ? (
                <img
                  src={`/assets/images/${realm}/elements/solo.png`}
                  alt='Single Player Games | Wizard Land'
                  title='Single Player Games | Wizard Land'
                />
              ) : (
                '🗡️'
              )}{' '}
              Single Player Games
            </h1>
            <hr></hr>
            <div className='mq-cards-grid'>
              {resolved
                ? singleplayerGames.map((game, index) => (
                    <GameCards
                      key={index}
                      target={game.url}
                      imgSrc={`${game.imgSrc}`}
                      alt={game.alt}
                      title={game.title}
                    />
                  ))
                : Array(singleplayerGames.length)
                    .fill()
                    .map((_, index) => (
                      <Skeleton
                        key={index}
                        height={200}
                        width={300}
                        className='mq-game-skeleton'
                        containerClassName='mq-skeleton-container'
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
      <Footer />
    </div>
  );
}
