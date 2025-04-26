import React, { useState, useEffect, useMemo, useRef } from 'react';
import { useBeforeUnload } from 'react-router-dom';
import GameIntro from '../../gameFlow/gameintro';
import {
  playUncover,
  playDisappear,
  playPlaceObject,
  playNextLevel,
  playSwallow,
  playDefeat
} from '../../../hooks/useSound';
import Button from '../../../components/Button';
import { triggerConfetti } from '../../../hooks/useConfetti';
import {
  subscribeToOpponentJoin,
  updateBoardState,
  subscribeToBoardUpdates,
  unsubscribeFromChannels,
  clearGameData,
  clearGameState,
  updateUserLosesByGame,
  updateUserWinsByGame,
  subscribeToThumbs,
  sendThumbsChoice,
  clearThumbsChoices,
  supabase
} from '../../../apiService';
import MultiplayerModal from '../../../components/generalModals/multiplayerModal';
import { useSelectedPiece } from '../../../hooks/userSelectedPiece';
import { useUser } from '../../../context/UserContext';
import { handleMultiplayerWin } from '../../../hooks/handleProgressUpdate';
import { CollectionBurst } from '../../../components/collect';
import MultiplayerConfirmModal from '../../../components/playAgain';
import { useNavigate } from 'react-router-dom';
import ConfirmationModal from '../../../components/confirmation';

// Chess piece Unicode symbols
const CHESS_SYMBOLS = {
  white: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♙'
  },
  black: {
    king: '♚',
    queen: '♛',
    rook: '♜',
    bishop: '♝',
    knight: '♞',
    pawn: '♟'
  }
};

// Initial chess board setup
const initialBoard = () => {
  const board = Array(8)
    .fill(null)
    .map(() => Array(8).fill(null));

  // Setup black and white pieces
  const backRank = (color) => [
    { type: 'rook', color, moved: false },
    { type: 'knight', color, moved: false },
    { type: 'bishop', color, moved: false },
    { type: 'queen', color, moved: false },
    { type: 'king', color, moved: false },
    { type: 'bishop', color, moved: false },
    { type: 'knight', color, moved: false },
    { type: 'rook', color, moved: false }
  ];
  board[0] = backRank('black');
  board[7] = backRank('white');
  board[1] = Array(8)
    .fill(null)
    .map(() => ({ type: 'pawn', color: 'black', moved: false }));
  board[6] = Array(8)
    .fill(null)
    .map(() => ({ type: 'pawn', color: 'white', moved: false }));
  return board;
};

const Chess = () => {
  const [board, setBoard] = useState(initialBoard());
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('white');
  const [currentMultiplayerTurn, setCurrentMultiplayerTurn] = useState(null);
  const [gameMode, setGameMode] = useState('Single');
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [gameId, setGameId] = useState(14);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [room, setRoom] = useState(null);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [opponentWins, setOpponentWins] = useState(0);
  const [channels, setChannels] = useState([]);
  const { userId, userName } = useUser();
  const [winnerName, setWinnerName] = useState('');
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [myChoice, setMyChoice] = useState(null);
  const [oppChoice, setOppChoice] = useState(null);
  const navigate = useNavigate();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const player1Symbol = useSelectedPiece(player1 || userId, '🔥', 'fire');
  const player2Symbol = useSelectedPiece(player2, '❄️', 'ice');
  const [lastMove, setLastMove] = useState(null);

  const introText = `Welcome to Chess! Play as White. Take turns moving your pieces according to chess rules. Valid moves will be highlighted. Checkmate your opponent to win! Good luck!`;

  const isWithinBounds = (row, col) =>
    row >= 0 && row < 8 && col >= 0 && col < 8;

  const clearValidMoves = (b) => {
    if (!Array.isArray(b)) return initialBoard();
    return b.map((row) => {
      if (!Array.isArray(row)) return Array(8).fill(null);
      return row.map((cell) => {
        if (!cell) return null;
        const { validMove, ...rest } = cell;
        return rest.type ? rest : null;
      });
    });
  };

  // Calculate valid moves for any piece
  const getValidMoves = (row, col, b) => {
    const piece = b[row][col];
    if (!piece) return [];
    const moves = [];

    const pawnDir = piece.color === 'white' ? -1 : 1;

    if (piece.type === 'pawn') {
      // 1-step forward
      if (isWithinBounds(row + pawnDir, col) && !b[row + pawnDir][col]) {
        moves.push([row + pawnDir, col]);
        // 2-step on first move
        if (
          !piece.moved &&
          isWithinBounds(row + 2 * pawnDir, col) &&
          !b[row + pawnDir][col] &&
          !b[row + 2 * pawnDir][col]
        ) {
          moves.push([row + 2 * pawnDir, col]);
        }
      }
      // Diagonal captures
      for (const dc of [-1, 1]) {
        const r2 = row + pawnDir;
        const c2 = col + dc;
        if (
          isWithinBounds(r2, c2) &&
          b[r2][c2]?.color &&
          b[r2][c2].color !== piece.color
        ) {
          moves.push([r2, c2]);
        }
      }
      return moves;
    }

    if (piece.type === 'knight') {
      const knightDirs = [
        [-2, -1],
        [-2, 1],
        [-1, -2],
        [-1, 2],
        [1, -2],
        [1, 2],
        [2, -1],
        [2, 1]
      ];
      knightDirs.forEach(([dr, dc]) => {
        const r2 = row + dr;
        const c2 = col + dc;
        if (
          isWithinBounds(r2, c2) &&
          (!b[r2][c2] || b[r2][c2].color !== piece.color)
        ) {
          moves.push([r2, c2]);
        }
      });
      return moves;
    }

    // Sliding pieces: bishop, rook, queen, king
    const directions = {
      bishop: [
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
      ],
      rook: [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1]
      ],
      queen: [
        [-1, 0],
        [1, 0],
        [0, -1],
        [0, 1],
        [-1, -1],
        [-1, 1],
        [1, -1],
        [1, 1]
      ],
      king: [
        [-1, -1],
        [-1, 0],
        [-1, 1],
        [0, -1],
        [0, 1],
        [1, -1],
        [1, 0],
        [1, 1]
      ]
    }[piece.type];

    directions.forEach(([dr, dc]) => {
      let r2 = row + dr;
      let c2 = col + dc;
      while (isWithinBounds(r2, c2)) {
        if (!b[r2][c2]) {
          moves.push([r2, c2]);
        } else {
          if (b[r2][c2].color !== piece.color) {
            moves.push([r2, c2]);
          }
          break;
        }
        if (!['queen', 'rook', 'bishop'].includes(piece.type)) break;
        r2 += dr;
        c2 += dc;
      }
    });

    return moves;
  };

  const highlightValidMoves = (r, c) => {
    const piece = board[r][c];
    if (!piece) return;

    const color = piece.color;
    const rawMoves = getValidMoves(r, c, board);
    const legalMoves = rawMoves.filter(([mr, mc]) => {
      const simulated = simulateMove(board, { from: [r, c], to: [mr, mc] });
      return !isInCheck(color, simulated);
    });

    const newBoard = clearValidMoves(board);
    legalMoves.forEach(([rr, cc]) => {
      newBoard[rr][cc] = { ...(newBoard[rr][cc] || {}), validMove: true };
    });
    setBoard(newBoard);
  };

  const movePiece = async (sr, sc, er, ec) => {
    const newBoard = board.map((row) =>
      row.map((cell) => (cell?.type ? { ...cell } : null))
    );
    const p = { ...newBoard[sr][sc], moved: true };

    if (p.type === 'king' && Math.abs(sc - ec) === 2) {
      const rookCol = ec > sc ? 7 : 0,
        newRookCol = ec > sc ? 5 : 3;
      newBoard[sr][newRookCol] = { ...newBoard[sr][rookCol], moved: true };
      newBoard[sr][rookCol] = null;
    }

    if (newBoard[er][ec] && newBoard[er][ec].color !== p.color) {
      playSwallow();
    } else {
      playPlaceObject();
    }

    newBoard[er][ec] = p;
    newBoard[sr][sc] = null;

    if (p.type === 'pawn' && (er === 0 || er === 7))
      newBoard[er][ec].type = 'queen';

    setBoard(clearValidMoves(newBoard));
    setSelectedPiece(null);

    const newLastMove = {
      from: { row: sr, col: sc },
      to: { row: er, col: ec }
    };
    setLastMove(newLastMove);
    setTimeout(() => setLastMove(null), 3000);

    if (gameMode === 'Multiplayer') {
      const next = currentMultiplayerTurn === player1 ? player2 : player1;
      setCurrentMultiplayerTurn(next);

      updateBoardState(
        room.room,
        {
          board: newBoard,
          lastMove: newLastMove
        },
        gameId,
        next
      );

      // Remove the checkGameOver call and winner assignment here
    } else {
      setCurrentTurn(currentTurn === 'white' ? 'black' : 'white');
      checkGameOver(newBoard);
    }
  };

  const handleCellClick = (r, c) => {
    if (gameOver) return;
    // Block clicks on computer's turn
    if (gameMode === 'Single' && currentTurn === 'black') return;
    // Block if multiplayer and not your turn
    if (gameMode === 'Multiplayer' && currentMultiplayerTurn !== userId) {
      alert('Not your turn!');
      return;
    }

    const cell = board[r][c];
    const myColor =
      gameMode === 'Multiplayer'
        ? userId === player1
          ? 'white'
          : 'black'
        : 'white';

    if (selectedPiece?.row === r && selectedPiece?.col === c) {
      setSelectedPiece(null);
      setBoard(clearValidMoves(board));
      return;
    }

    if (!selectedPiece) {
      if (cell?.color === myColor) {
        setSelectedPiece({ row: r, col: c });
        highlightValidMoves(r, c);
      }
      return;
    }

    // Only check for check after piece is selected
    const simulatedBoard = simulateMove(board, {
      from: [selectedPiece.row, selectedPiece.col],
      to: [r, c]
    });

    if (isInCheck(myColor, simulatedBoard)) {
      // Show error or prevent move
      return;
    }

    if (cell?.validMove) {
      movePiece(selectedPiece.row, selectedPiece.col, r, c);
      return;
    }

    if (cell?.color === myColor) {
      setSelectedPiece({ row: r, col: c });
      highlightValidMoves(r, c);
      return;
    }

    setSelectedPiece(null);
    setBoard(clearValidMoves(board));
  };

  const evaluateBoard = (board) => {
    const pieceValues = {
      pawn: 1,
      knight: 3,
      bishop: 3,
      rook: 5,
      queen: 9,
      king: 100
    };

    let score = 0;
    board.forEach((row) => {
      row.forEach((cell) => {
        if (cell) {
          const value = pieceValues[cell.type];
          score += cell.color === 'black' ? value : -value;
        }
      });
    });
    return score;
  };

  const simulateMove = (currentBoard, move) => {
    const newBoard = currentBoard.map((row) =>
      row.map((cell) => (cell ? { ...cell } : null))
    );
    const [sr, sc] = move.from;
    const [er, ec] = move.to;
    const piece = newBoard[sr][sc];

    if (!piece) return newBoard;

    // Handle castling
    if (piece.type === 'king' && Math.abs(sc - ec) === 2) {
      const rookCol = ec > sc ? 7 : 0;
      const newRookCol = ec > sc ? 5 : 3;
      newBoard[sr][newRookCol] = { ...newBoard[sr][rookCol], moved: true };
      newBoard[sr][rookCol] = null;
    }

    // Handle pawn promotion
    if (piece.type === 'pawn' && (er === 0 || er === 7)) {
      newBoard[er][ec] = { ...piece, type: 'queen', moved: true };
    } else {
      newBoard[er][ec] = { ...piece, moved: true };
    }

    newBoard[er][ec] = { ...piece, moved: true };
    newBoard[sr][sc] = null;

    return newBoard;
  };

  const handleComputerMove = () => {
    // Get only legal moves that protect the king
    const allLegalMoves = getAllLegalMoves('black', board);

    if (allLegalMoves.length === 0) return;

    let bestScore = -Infinity;
    let bestMoves = [];

    allLegalMoves.forEach((move) => {
      const simulatedBoard = simulateMove(board, move);
      let score = evaluateBoard(simulatedBoard);

      // Add bonus for getting out of check
      if (!isInCheck('black', simulatedBoard)) {
        score += 50;
      }

      // Prioritize checkmate
      const isCheckmate = checkGameOver(simulatedBoard);
      if (isCheckmate) score += 1000;

      if (score > bestScore) {
        bestScore = score;
        bestMoves = [move];
      } else if (score === bestScore) {
        bestMoves.push(move);
      }
    });

    if (bestMoves.length > 0) {
      const choice = bestMoves[Math.floor(Math.random() * bestMoves.length)];
      movePiece(choice.from[0], choice.from[1], choice.to[0], choice.to[1]);
    }
  };

  useEffect(() => {
    if (gameMode === 'Single' && !gameOver && currentTurn === 'black') {
      const t = setTimeout(handleComputerMove, 500);
      return () => clearTimeout(t);
    }
  }, [board, currentTurn, gameMode, gameOver]);

  const findKingPosition = (color, boardState) => {
    if (!boardState || !Array.isArray(boardState)) return false;

    for (let r = 0; r < 8; r++) {
      const row = boardState[r];
      if (!row) continue;
      for (let c = 0; c < 8; c++) {
        const piece = row[c];
        if (piece?.type === 'king' && piece.color === color) {
          return { row: r, col: c };
        }
      }
    }
    return null;
  };

  const isInCheck = (color, boardState) => {
    if (!boardState || !Array.isArray(boardState)) return false;

    const kingPos = findKingPosition(color, boardState);
    if (!kingPos) return false;
    return isSquareUnderAttack(kingPos.row, kingPos.col, color, boardState);
  };

  const isSquareUnderAttack = (row, col, color, boardState) => {
    if (!boardState || !Array.isArray(boardState)) return false;

    const opponentColor = color === 'white' ? 'black' : 'white';

    // Check all opponent pieces
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = boardState[r][c];
        if (piece?.color === opponentColor) {
          const moves = getValidMoves(r, c, boardState);
          if (moves.some(([mr, mc]) => mr === row && mc === col)) {
            return true;
          }
        }
      }
    }
    return false;
  };

  const getAllLegalMoves = (color, boardState) => {
    if (!Array.isArray(boardState) || boardState.length !== 8) return [];
    if (!boardState.every((row) => Array.isArray(row) && row.length === 8))
      return [];

    const allMoves = [];
    const currentBoard = boardState.map((row) => [...row]);

    // Generate all possible moves
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const piece = currentBoard[r][c];
        if (piece?.color === color) {
          // Get raw possible moves first
          const possibleMoves = getValidMoves(r, c, currentBoard);

          possibleMoves.forEach(([mr, mc]) => {
            // Simulate move and check if king remains safe
            const simulatedBoard = simulateMove(currentBoard, {
              from: [r, c],
              to: [mr, mc]
            });

            // Check if move protects the king
            if (!isInCheck(color, simulatedBoard)) {
              allMoves.push({ from: [r, c], to: [mr, mc] });
            }
          });
        }
      }
    }
    return allMoves;
  };

  const checkGameOver = (boardState) => {
    if (!Array.isArray(boardState) || boardState.length !== 8) return false;
    if (!boardState.every((row) => Array.isArray(row) && row.length === 8))
      return false;

    const currentColor =
      gameMode === 'Multiplayer'
        ? currentMultiplayerTurn === player1
          ? 'white'
          : 'black'
        : currentTurn;

    // Check for checkmate
    if (isInCheck(currentColor, boardState)) {
      const legalMoves = getAllLegalMoves(currentColor, boardState);
      if (legalMoves.length === 0) {
        const winnerColor = currentColor === 'white' ? 'black' : 'white';
        updateBoardState(
          room.room,
          board,
          gameId,
          null,
          gameMode === 'Multiplayer'
            ? winnerColor === 'white'
              ? player1
              : player2
            : winnerColor
        );
        return true;
      }
    }

    // Check for stalemate
    const legalMoves = getAllLegalMoves(currentColor, boardState);
    if (legalMoves.length === 0) {
      const winnerColor = currentColor === 'white' ? 'black' : 'white';
      if (gameMode === 'Multiplayer') {
        updateBoardState(
          room.room,
          board,
          gameId,
          null,
          winnerColor === 'white' ? player1 : player2
        );
      } else {
        setWinner(winnerColor);
      }
      return true;
    }

    return false;
  };

  useEffect(() => {
    if (gameMode === 'Multiplayer' && !gameOver && board) {
      checkGameOver(board);
    }
  }, [board, currentMultiplayerTurn, gameMode, gameOver]);

  useEffect(() => {
    const handleScoreUpdate = async () => {
      if (winner) {
        setGameOver(true);

        if (gameMode === 'Multiplayer') {
          if (winner === userId) {
            setShowCoinAnimation(true);
            await updateUserWinsByGame(winner, gameId);
          } else if (winner !== userId) {
            await updateUserLosesByGame(userId, gameId);
          }
        }

        if (winner === userId || winner === 'Fire') {
          playNextLevel();
          triggerConfetti();
        } else if (winner !== userId) {
          playDefeat();
        }

        // Update score counters
        if (gameMode === 'Multiplayer') {
          if (player1 === winner) {
            setPlayerWins((prev) => prev + 1);
          } else if (player2 === winner) {
            setOpponentWins((prev) => prev + 1);
          }
        } else {
          if (winner === 'White') setPlayerWins((prev) => prev + 1);
          if (winner === 'Black') setComputerWins((prev) => prev + 1);
        }

        // Show win title and schedule reset
        playUncover();
        setShowTitle(true);
        setTimeout(() => {
          if (gameMode === 'Multiplayer') {
            setShowModal(true);
          } else {
            handleRestart();
          }
          setShowTitle(false);
          setWinnerName('');
        }, 3500);
      }
    };

    handleScoreUpdate();
  }, [winner, room, gameMode, userId, player1, player2]);

  useEffect(() => {
    if (!room?.room) return;

    const subscription = subscribeToThumbs(room.room, ({ user_id, choice }) => {
      if (user_id === userId) {
        setMyChoice(choice);
      } else {
        setOppChoice(choice);
      }
    });

    return () => {
      supabase.realtime.removeChannel(subscription);
    };
  }, [room, userId]);

  useEffect(() => {
    if (myChoice && oppChoice) {
      if (myChoice === 'up' && oppChoice === 'up') {
        handleRestart();
      } else {
        handleQuit();
      }
      setMyChoice(null);
      setOppChoice(null);
    }
  }, [myChoice, oppChoice]);

  const onStartGame = async (roomData) => {
    if (roomData && roomData.room) {
      setRoom(roomData);
      setPlayer1(roomData.player1);
      setPlayer2(roomData.player2);
      setGameMode('Multiplayer');
      setStartGame(true);
      setCurrentMultiplayerTurn(roomData.player1);
      setOpponentJoined(!!roomData.player1 && !!roomData.player2);

      const opponentChannel = subscribeToOpponentJoin(
        roomData.room,
        (updatedRoom) => {
          setPlayer1(updatedRoom.player1);
          setPlayer2(updatedRoom.player2);
          setOpponentJoined(!!updatedRoom.player1 && !!updatedRoom.player2);

          const currentBoard = board;
          if (
            updatedRoom.player1 &&
            updatedRoom.player2 &&
            currentBoard.every((row) => row.every((cell) => cell === null))
          ) {
            updateBoardState(roomData.room, board, gameId, updatedRoom.player1);
          }
        }
      );

      const boardChannel = subscribeToBoardUpdates(
        roomData.room,
        (gameState) => {
          if (gameState.board_state) {
            const isValidBoard =
              Array.isArray(gameState.board_state.board) &&
              gameState.board_state.board.length === 8 &&
              gameState.board_state.board.every((row) => Array.isArray(row));

            setBoard(
              isValidBoard ? gameState.board_state.board : initialBoard()
            );
            setLastMove(gameState.board_state.lastMove);
          }
          if (
            gameState.current_turn !== undefined &&
            gameState.current_turn !== null
          ) {
            setCurrentMultiplayerTurn(gameState.current_turn);
          }
          if (gameState.winner) {
            setWinnerName(gameState.name);
            setWinner(gameState.winner);
            handleMultiplayerWin(gameState.winner, 'hard');
            clearGameState(gameState.room, gameState.game_id);
          }
        }
      );

      setChannels([opponentChannel, boardChannel]);
    } else {
      setGameMode('Single');
      setStartGame(true);
    }
  };

  const handleRestart = () => {
    const newBoard = initialBoard();
    setBoard(newBoard);
    setGameOver(false);
    setWinner(null);
    setShowTitle(false);
    setShowModal(false);
    setSelectedPiece(null);
    setMyChoice(null);
    setOppChoice(null);

    if (gameMode === 'Single') {
      setCurrentTurn('white');
    } else if (gameMode === 'Multiplayer') {
      const newStartingPlayer = winner === player2 ? player2 : player1;
      setCurrentMultiplayerTurn(newStartingPlayer);
      updateBoardState(room.room, newBoard, gameId, newStartingPlayer);
      setTimeout(() => {
        clearThumbsChoices(room.room);
      }, 1000);
    }

    playDisappear();
  };

  const handleQuit = () => {
    setIsConfirmationModalOpen(false);
    if (gameMode === 'Multiplayer') {
      clearGameData(room.room, gameId);
      unsubscribeFromChannels(room.room);
    }
    navigate('/');
  };

  const resetScore = () => {
    setComputerWins(0);
    setPlayerWins(0);
  };

  useEffect(() => {
    return () => {
      if (gameMode === 'Multiplayer') {
        unsubscribeFromChannels(channels);
      }
    };
  }, [channels]);

  useEffect(() => {
    if (gameMode !== 'Multiplayer') return;

    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsConfirmationModalOpen(true);
      }, 30000);
    };

    const handlePop = (e) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
      setIsConfirmationModalOpen(true);
    };

    window.history.pushState(null, '', window.location.href);

    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    activityEvents.forEach((ev) => window.addEventListener(ev, resetTimer));

    window.addEventListener('popstate', handlePop);

    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((ev) =>
        window.removeEventListener(ev, resetTimer)
      );
      window.removeEventListener('popstate', handlePop);
    };
  }, [gameMode]);

  useBeforeUnload((event) => {
    if (!gameOver && gameMode === 'Multiplayer') {
      setIsConfirmationModalOpen(true);
      event.preventDefault();
      event.returnValue = '';
    }
  });

  useEffect(() => {
    if (!room?.room || gameMode !== 'Multiplayer') return;

    let lastUpdate = Date.now();
    const checkInterval = setInterval(() => {
      if (Date.now() - lastUpdate > 60000) {
        alert('Ops, Opponent left the game! What a bummer!');
        handleQuit();
      }
    }, 10000);

    return () => clearInterval(checkInterval);
  }, [board]);

  const title =
    winner === null
      ? "It's a Draw!"
      : winner
      ? gameMode === 'Multiplayer'
        ? `${winnerName} wins!`
        : `${winner} wins!`
      : `Opponent Turn`;

  return !startGame ? (
    <>
      <GameIntro introText={introText} />
      <MultiplayerModal
        gameId={gameId}
        setGameMode={setGameMode}
        onStartGame={(roomData) => onStartGame(roomData)}
      />
    </>
  ) : (
    <>
      <div className='mq-global-container'>
        <div className='mq-score-container'>
          <span className='mq-score-player'>White: {playerWins}</span>
          <span className='mq-room-number'>{room && room.room}</span>
          <span className='mq-score-computer'>
            Black: {gameMode === 'Multiplayer' ? opponentWins : computerWins}
          </span>
        </div>
        <div
          className={`mq-board mq-${
            gameMode === 'Multiplayer'
              ? currentMultiplayerTurn === player1
                ? player1Symbol.theme
                : player2Symbol.theme
              : currentTurn === 'white'
              ? player1Symbol.theme
              : 'black'
          }`}
        >
          {showTitle && (
            <h1
              className={`mq-ending-title ${
                (winner === 'black' || winner === player2) && 'glowingBlue-text'
              }`}
            >
              {title}
            </h1>
          )}

          {board.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className='mq-row'
            >
              {row.map((cell, colIndex) => (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`mq-square ${
                    (rowIndex + colIndex) % 2 === 1 ? 'mq-dark' : 'mq-light'
                  }${cell?.validMove ? ' valid' : ''}${
                    selectedPiece?.row === rowIndex &&
                    selectedPiece?.col === colIndex
                      ? ' mq-selected'
                      : ''
                  } ${
                    (lastMove?.from.row === rowIndex &&
                      lastMove?.from.col === colIndex) ||
                    (lastMove?.to.row === rowIndex &&
                      lastMove?.to.col === colIndex)
                      ? ' mq-last-move'
                      : ''
                  }${cell?.color === 'white' ? ' white-piece' : ''}${
                    cell?.color === 'black' ? ' black-piece' : ''
                  }${
                    cell?.type === 'king' && isInCheck(cell.color, board)
                      ? ' in-check'
                      : ''
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell?.type && CHESS_SYMBOLS[cell.color][cell.type]}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      <Button
        text='Reset Score'
        onClick={resetScore}
      />

      {showCoinAnimation && (
        <CollectionBurst onComplete={() => setShowCoinAnimation(false)} />
      )}

      <MultiplayerConfirmModal
        isOpen={showModal}
        onClose={() => {
          setShowModal(false);
          setMyChoice(null);
          setOppChoice(null);
          if (gameMode === 'Multiplayer') clearThumbsChoices(room.room);
        }}
        onThumbsUp={() => {
          setMyChoice('up');
          sendThumbsChoice(room.room, userId, 'up');
        }}
        onThumbsDown={() => {
          setMyChoice('down');
          sendThumbsChoice(room.room, userId, 'down');
        }}
      />

      <ConfirmationModal
        isOpen={isConfirmationModalOpen}
        onConfirm={handleQuit}
        onCancel={() => setIsConfirmationModalOpen(false)}
        title='Leave Game? Auto-quit in '
      />
    </>
  );
};

export default Chess;
