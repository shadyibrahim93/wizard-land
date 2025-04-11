import Header from '../components/Header';
import GameCards from '../components/GameCards';
import { useState, useEffect } from 'react';
import { introStarConfetti } from '../hooks/useConfetti';

export default function Home() {
  // Define the static game data
  const gamesData = [
    {
      url: '/games/bingo-quest',
      imgSrc: 'bingo_quest.jpg',
      alt: 'Bingo Game',
      title: 'Bingo'
    },
    {
      url: '/games/connect-four-quest',
      imgSrc: 'connect_four_quest.jpg',
      alt: 'Connect Four Game',
      title: 'Connect 4'
    },
    {
      url: '/games/tic-tac-toe-quest',
      imgSrc: 'tictactoe_quest.jpg',
      alt: 'Tic Tac Toe Game',
      title: 'Tic Tac Toe'
    },
    {
      url: '/games/scramble-quest',
      imgSrc: 'scramble_quest.jpg',
      alt: 'Scramble Game',
      title: 'Scrambled'
    },
    {
      url: '/games/sudoku-quest',
      imgSrc: 'sudoku_quest.jpg',
      alt: 'Sudoku Game',
      title: 'Sudoku'
    },
    {
      url: '/games/checker-quest',
      imgSrc: 'checker_quest.jpg',
      alt: 'Checker Game',
      title: 'Checker'
    },
    {
      url: '/games/math-quest',
      imgSrc: 'math_quest.jpg',
      alt: 'Math Game',
      title: 'Math Marathon'
    },
    {
      url: '/games/puzzle-quest',
      imgSrc: 'puzzle_quest.jpg',
      alt: 'Puzzle Game',
      title: 'Jigsaw'
    },
    {
      url: '/games/personal-puzzle-quest',
      imgSrc: 'personal_puzzle_quest.jpg',
      alt: 'Personal Puzzle Game',
      title: 'Personal Jigsaw'
    },
    {
      url: '/games/match-quest',
      imgSrc: 'match_quest.jpg',
      alt: 'Matching Game',
      title: 'Pair Pursuit'
    },
    {
      url: '/games/memory-quest',
      imgSrc: 'memory_quest.jpg',
      alt: 'Memory Game',
      title: 'Brain Vault'
    },
    {
      url: '/games/dropzone-quest',
      imgSrc: 'dropzone_quest.jpg',
      alt: 'Drop Game',
      title: 'Perfect Fit'
    }
  ];

  const [games, setGames] = useState([]);

  useEffect(() => {
    // Set the static games data to the state
    setGames(gamesData);
    introStarConfetti();
  }, []);

  return (
    <div className='mq-home'>
      <Header
        title='Arcane Quests'
        homePage
        showSignUpLink
        showSignInLink
      />
      <main className='mq-dashboard-cards-wrapper'>
        {games.map((game, index) => (
          <GameCards
            key={index}
            target={game.url}
            imgSrc={game.imgSrc}
            alt={game.alt}
            title={game.title}
          />
        ))}
      </main>
    </div>
  );
}
