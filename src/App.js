import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import '../src/styles/main.css';
import Home from './pages/Home';
import DropZoneQuest from './pages/games/dropzone-quest';
import MatchQuest from './pages/games/match-quest';
import MathQuest from './pages/games/math-quest';
import MemoryQuest from './pages/games/memory-quest';
import ScrambleQuest from './pages/games/scramble-quest';
import SudokuQuest from './pages/games/sudoku-quest';
import PuzzleQuest from './pages/games/puzzle-quest';
import PersonalPuzzleQuest from './pages/games/personal-puzzle-quest';
import TicTacToeQuest from './pages/games/tic-tac-toe-quest';
import ConnectFourQuest from './pages/games/connect-four-quest';
import BingoQuest from './pages/games/bingo-quest';

import '../src/styles/sass/main.scss';
import useMouseEffect from '../src/hooks/useMouseEffect';

export default function App() {
  useMouseEffect();

  return (
    <Router>
      <Routes>
        <Route
          path='/wizard-land'
          element={<Home />}
        />
        <Route
          path='wizard-land/games/dropzone-quest'
          element={<DropZoneQuest />}
        />
        <Route
          path='wizard-land/games/match-quest'
          element={<MatchQuest />}
        />
        <Route
          path='wizard-land/games/math-quest'
          element={<MathQuest />}
        />
        <Route
          path='wizard-land/games/memory-quest'
          element={<MemoryQuest />}
        />
        <Route
          path='wizard-land/games/scramble-quest'
          element={<ScrambleQuest />}
        />
        <Route
          path='wizard-land/games/sudoku-quest'
          element={<SudokuQuest />}
        />
        <Route
          path='wizard-land/games/puzzle-quest'
          element={<PuzzleQuest />}
        />
        <Route
          path='wizard-land/games/personal-puzzle-quest'
          element={<PersonalPuzzleQuest />}
        />
        <Route
          path='wizard-land/games/tic-tac-toe-quest'
          element={<TicTacToeQuest />}
        />
        <Route
          path='wizard-land/games/connect-four-quest'
          element={<ConnectFourQuest />}
        />
        <Route
          path='wizard-land/games/bingo-quest'
          element={<BingoQuest />}
        />
      </Routes>
    </Router>
  );
}
