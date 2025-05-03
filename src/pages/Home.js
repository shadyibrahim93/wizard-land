import Header from '../components/Header';
import GameCards from '../components/GameCards';
import { useState, useEffect } from 'react';
import { introStarConfetti } from '../hooks/useConfetti';
import LeaderBoard from '../components/leaderBoard';
import GameChat from '../components/chatRoom';
import { Title, Meta } from 'react-head';

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
      url: '/games/connect-4-quest',
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
    {
      url: '/games/math-quest',
      imgSrc: 'math_quest.jpg',
      alt: 'Math Game',
      title: 'Math Marathon',
      type: 'Singleplayer'
    },
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

  useEffect(() => {
    setMultiplayerGames(
      gamesData.filter((game) => game.type === 'Multiplayer')
    );
    setSingleplayerGames(
      gamesData.filter((game) => game.type === 'Singleplayer')
    );
    introStarConfetti();
  }, []);

  return (
    <div className='mq-home'>
      <Title>Wizard Land: Play Classic Board Games with Friends Online</Title>
      <Meta
        name='description'
        content='Wizard Land offers classic online board games like Chess, Checkers, Orbito, Connect 4, Tic Tac Toe, and more! Play with friends and family in a magical online multiplayer environment.'
      />
      <Meta
        property='og:url'
        content={window.location.origin}
      />
      <Meta
        property='og:type'
        content='website'
      />
      <Meta
        property='og:title'
        content='Wizard Land | Play Classic Board Games Online'
      />
      <Meta
        property='og:description'
        content='Wizard Land offers classic online board games like Chess, Checkers, Orbito, Connect 4, Tic Tac Toe, and more! Play with friends and family in a magical online multiplayer environment.'
      />
      <Meta
        name='twitter:card'
        content='summary_large_image'
      />
      <Meta
        name='twitter:title'
        content='Wizard Land | Play Classic Board Games Online'
      />
      <Meta
        name='twitter:description'
        content='Wizard Land offers classic online board games like Chess, Checkers, Orbito, Connect 4, Tic Tac Toe, and more! Play with friends and family in a magical online multiplayer environment.'
      />
      <Header
        title='Wizard Land'
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
    </div>
  );
}
