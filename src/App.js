import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
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
import CheckerQuest from './pages/games/checker-quest';
import OrbitoQuest from './pages/games/orbito-quest';
import ChessQuest from './pages/games/chess-quest';
import ThreeMenMorrisQuest from './pages/games/three-men-morris-quest';
import LandingPage from './pages/LandingPage';
import { UserProvider, useUser } from './context/UserContext';
import './styles/sass/main.scss';
import useMouseEffect from './hooks/useMouseEffect';

function AppRoutes() {
  const { userType } = useUser();
  useMouseEffect();

  // Only LandingPage in prod
  if (userType !== 'test') {
    return (
      <BrowserRouter>
        <Routes>
          <Route
            path='/'
            element={<LandingPage />}
          />
        </Routes>
      </BrowserRouter>
    );
  }

  // In test (or any other userType), show all routes
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path='/'
          element={<Home />}
        />
        <Route
          path='/games/dropzone-quest'
          element={<DropZoneQuest />}
        />
        <Route
          path='/games/match-quest'
          element={<MatchQuest />}
        />
        <Route
          path='/games/math-quest'
          element={<MathQuest />}
        />
        <Route
          path='/games/memory-quest'
          element={<MemoryQuest />}
        />
        <Route
          path='/games/scramble-quest'
          element={<ScrambleQuest />}
        />
        <Route
          path='/games/sudoku-quest'
          element={<SudokuQuest />}
        />
        <Route
          path='/games/puzzle-quest'
          element={<PuzzleQuest />}
        />
        <Route
          path='/games/personal-puzzle-quest'
          element={<PersonalPuzzleQuest />}
        />
        <Route
          path='/games/tic-tac-toe-quest'
          element={<TicTacToeQuest />}
        />
        <Route
          path='/games/connect-4-quest'
          element={<ConnectFourQuest />}
        />
        <Route
          path='/games/bingo-quest'
          element={<BingoQuest />}
        />
        <Route
          path='/games/checker-quest'
          element={<CheckerQuest />}
        />
        <Route
          path='/games/orbito-quest'
          element={<OrbitoQuest />}
        />
        <Route
          path='/games/chess-quest'
          element={<ChessQuest />}
        />
        <Route
          path='/games/three-men-morris-quest'
          element={<ThreeMenMorrisQuest />}
        />
      </Routes>
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <UserProvider>
      <AppRoutes />
    </UserProvider>
  );
}
