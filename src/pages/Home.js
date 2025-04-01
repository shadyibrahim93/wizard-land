import Header from '../components/Header';
import GameCards from '../components/GameCards';
import { useState, useEffect } from 'react';
import { introStarConfetti } from '../hooks/useConfetti';

export default function Home() {
  // Define the static game data
  const gamesData = [
    {
      url: 'wizard-land/games/memory-quest',
      imgSrc: 'memory_quest.png',
      alt: 'Memory Game',
      title: 'Brain Vault'
    },
    {
      url: 'wizard-land/games/bingo-quest',
      imgSrc: 'bingo_quest.png',
      alt: 'Bingo Game',
      title: 'Bingo'
    },
    {
      url: 'wizard-land/games/connect-four-quest',
      imgSrc: 'connect_four_quest.png',
      alt: 'Connect Four Game',
      title: 'Connect 4'
    },
    {
      url: 'wizard-land/games/tic-tac-toe-quest',
      imgSrc: 'tictactoe_quest.png',
      alt: 'Tic Tac Toe Game',
      title: 'Tic Tac Toe'
    },
    {
      url: 'wizard-land/games/dropzone-quest',
      imgSrc: 'dropzone_quest.png',
      alt: 'Drop Game',
      title: 'Perfect Fit'
    },
    {
      url: 'wizard-land/games/scramble-quest',
      imgSrc: 'scramble_quest.png',
      alt: 'Scramble Game',
      title: 'Scrambled'
    },
    {
      url: 'wizard-land/games/sudoku-quest',
      imgSrc: 'sudoku_quest.png',
      alt: 'Sudoku Game',
      title: 'Sudoku'
    },
    {
      url: 'wizard-land/games/math-quest',
      imgSrc: 'math_quest.png',
      alt: 'Math Game',
      title: 'Math Marathon'
    },
    {
      url: 'wizard-land/games/puzzle-quest',
      imgSrc: 'puzzle_quest.png',
      alt: 'Puzzle Game',
      title: 'Jigsaw'
    },
    {
      url: 'wizard-land/games/personal-puzzle-quest',
      imgSrc: 'personal_puzzle_quest.png',
      alt: 'Personal Puzzle Game',
      title: 'Personal Jigsaw'
    },
    {
      url: 'wizard-land/games/match-quest',
      imgSrc: 'match_quest.png',
      alt: 'Matching Game',
      title: 'Pair Pursuit'
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
        suppressLevel
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
