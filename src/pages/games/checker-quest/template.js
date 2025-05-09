import React, { useState, useEffect, useRef } from 'react';
import { useBeforeUnload } from 'react-router-dom';
import GameIntro from '../../gameFlow/gameintro';
import {
  playUncover,
  playDisappear,
  playPieceSound,
  playNextLevel,
  playSwallow,
  playDefeat,
  playBGMusic
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

// Initial board setup
const initialBoard = () => {
  const board = [];
  for (let i = 0; i < 8; i++) {
    const row = [];
    for (let j = 0; j < 8; j++) {
      if ((i + j) % 2 === 1) {
        if (i < 3) row.push({ piece: 'Ice', king: false, validMove: false });
        else if (i > 4)
          row.push({ piece: 'Fire', king: false, validMove: false });
        else row.push({ piece: null, king: false, validMove: false });
      } else {
        row.push({ piece: null, king: false, validMove: false });
      }
    }
    board.push(row);
  }
  return board;
};

const Checkers = () => {
  const [board, setBoard] = useState(initialBoard());
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('Fire');
  const [currentMultiplayerTurn, setCurrentMultiplayerTurn] = useState(null);
  const [gameMode, setGameMode] = useState('Single');
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [playerChainCapture, setPlayerChainCapture] = useState(null);
  const [computerChainCapture, setComputerChainCapture] = useState(null);
  const [gameId, setGameId] = useState(3);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [room, setRoom] = useState(null);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [opponentWins, setOpponentWins] = useState(0);
  const [channels, setChannels] = useState([]);
  const { userId, userName } = useUser();
  const player1Symbol = useSelectedPiece(player1 || userId, '🔥', 'fire');
  const player2Symbol = useSelectedPiece(player2, '❄️', 'ice');
  const [winnerName, setWinnerName] = useState('');
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [myChoice, setMyChoice] = useState(null);
  const [oppChoice, setOppChoice] = useState(null);
  const navigate = useNavigate();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [thumbsResetKey, setThumbsResetKey] = useState(0);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  const introText = `Welcome to Wizard Land Checkers Game! Play as '🔥'. Take turns moving your pieces into the corresponding box. A helper will show you where the piece can be dropped. Be the first to capture all pieces or block the opponent from making any more and win the game. Good luck!`;

  const isWithinBounds = (row, col) =>
    row >= 0 && row < 8 && col >= 0 && col < 8;

  const clearValidMoves = (b) =>
    b.map((r) => r.map((c) => ({ ...c, validMove: false })));

  useEffect(() => {
    const handleScoreUpdate = async () => {
      const gameEnded = checkGameOver(board);
      if (gameEnded || winner) {
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

        if (gameMode === 'Multiplayer') {
          if (player1 === winner) {
            setPlayerWins(playerWins + 1);
          } else if (player2 === winner) {
            setOpponentWins(opponentWins + 1);
          }
        } else {
          if (winner === 'Fire') {
            setPlayerWins(playerWins + 1);
          }
          if (winner === 'Ice') {
            setComputerWins(computerWins + 1);
          }
        }

        playUncover();
        setShowTitle(true);

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
  }, [winner]);

  useEffect(() => {
    if (!room?.room) return;

    const subscription = subscribeToThumbs(room.room, ({ user_id, choice }) => {
      // only accept the first vote per slot per round
      if (user_id === userId) {
        if (myChoice == null) setMyChoice(choice);
      } else {
        if (oppChoice == null) setOppChoice(choice);
      }
    });

    return () => supabase.realtime.removeChannel(subscription);
  }, [room, userId, thumbsResetKey]);

  useEffect(() => {
    if (myChoice == null || oppChoice == null) return;

    const bothUp = myChoice === 'up' && oppChoice === 'up';
    const roomId = room.room;

    clearThumbsChoices(roomId)
      .then(() => {
        // 1) clear local
        setMyChoice(null);
        setOppChoice(null);
        setShowModal(false);

        // 2) bump the key to force a fresh subscription
        setThumbsResetKey((k) => k + 1);

        // 3) now restart or quit
        if (bothUp) {
          handleRestart();
        } else handleQuit();
      })
      .catch(console.error);
  }, [myChoice, oppChoice]);

  const checkGameOver = (b) => {
    const fireCount = b.flat().filter((c) => c.piece === 'Fire').length;
    const iceCount = b.flat().filter((c) => c.piece === 'Ice').length;
    const fireCanMove = playerHasValidMoves('Fire');
    const iceCanMove = playerHasValidMoves('Ice');

    if (fireCount === 0 || !fireCanMove) {
      setWinner(gameMode === 'Multiplayer' ? player2 : 'Ice');
      return true;
    } else if (iceCount === 0 || !iceCanMove) {
      setWinner(gameMode === 'Multiplayer' ? player1 : 'Fire');
      return true;
    }
    return false;
  };

  const playerHasValidMoves = (player) => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = board[r][c];
        if (cell.piece === player) {
          const dirs = cell.king
            ? [
                [-1, -1],
                [-1, 1],
                [1, -1],
                [1, 1]
              ]
            : player === 'Fire'
            ? [
                [-1, -1],
                [-1, 1]
              ]
            : [
                [1, -1],
                [1, 1]
              ];

          for (const [dx, dy] of dirs) {
            const nr = r + dx,
              nc = c + dy;
            const jr = r + 2 * dx,
              jc = c + 2 * dy;
            const opponent = player === 'Fire' ? 'Ice' : 'Fire';

            if (isWithinBounds(nr, nc)) {
              if (!board[nr][nc].piece) {
                return true;
              } else if (
                isWithinBounds(jr, jc) &&
                board[nr][nc].piece === opponent &&
                !board[jr][jc].piece
              ) {
                return true;
              }
            }
          }
        }
      }
    }
    return false;
  };

  const checkForAdditionalCaptures = (r, c, b) => {
    const { piece, king } = b[r][c];
    const opp = piece === 'Fire' ? 'Ice' : 'Fire';
    const dirs = king
      ? [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1]
        ]
      : piece === 'Fire'
      ? [
          [-1, -1],
          [-1, 1]
        ]
      : [
          [1, -1],
          [1, 1]
        ];
    return dirs.some(([dx, dy]) => {
      const nr = r + dx,
        nc = c + dy;
      const jr = r + 2 * dx,
        jc = c + 2 * dy;
      return (
        isWithinBounds(jr, jc) && b[nr]?.[nc]?.piece === opp && !b[jr][jc].piece
      );
    });
  };

  const movePiece = async (sr, sc, er, ec) => {
    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    const piece = newBoard[sr][sc].piece;
    const king = newBoard[sr][sc].king;

    newBoard[er][ec].piece = piece;
    newBoard[er][ec].king =
      king ||
      (!king &&
        ((piece === 'Fire' && er === 0) || (piece === 'Ice' && er === 7)));
    newBoard[sr][sc].piece = null;
    newBoard[sr][sc].king = false;

    if (Math.abs(sr - er) === 2) {
      const cr = (sr + er) / 2,
        cc = (sc + ec) / 2;
      newBoard[cr][cc].piece = null;
      playSwallow();

      const canContinue = checkForAdditionalCaptures(er, ec, newBoard);
      if (canContinue) {
        setBoard(clearValidMoves(newBoard));
        if (gameMode === 'Single' && piece === 'Ice') {
          setComputerChainCapture({ row: er, col: ec });
        } else {
          setSelectedPiece({ row: er, col: ec });
          setPlayerChainCapture({ row: er, col: ec });
        }
        highlightValidMoves(er, ec, newBoard);
        return;
      }
    }

    setBoard(clearValidMoves(newBoard));
    setSelectedPiece(null);
    setPlayerChainCapture(null);
    setComputerChainCapture(null);

    if (gameMode === 'Multiplayer') {
      const nextTurn = currentMultiplayerTurn === player1 ? player2 : player1;
      setCurrentMultiplayerTurn(nextTurn);
      const winner = checkGameOver(newBoard)
        ? newBoard[er][ec].piece === 'Fire'
          ? player1
          : player2
        : null;
      updateBoardState(room.room, newBoard, gameId, nextTurn, winner);
    } else {
      setCurrentTurn(piece === 'Fire' ? 'Ice' : 'Fire');
      checkGameOver(newBoard);
    }
  };

  const firstBoardUpdate = useRef(true);

  useEffect(() => {
    // 1) Skip the very first render:
    if (firstBoardUpdate.current) {
      firstBoardUpdate.current = false;
      return;
    }

    // 2) If the game just ended or board is full, don’t play:
    if (winner) return;

    // 3) Determine which sound to play:
    let soundKey = '';
    if (gameMode === 'Multiplayer' && player1) {
      soundKey =
        currentMultiplayerTurn === player2
          ? player1Symbol.key
          : player2Symbol.key;
    } else if (gameMode === 'Single' && currentTurn === 'Ice') {
      soundKey = player1Symbol.key;
    }

    // 4) Fire it off:
    playPieceSound(soundKey);
  }, [currentMultiplayerTurn, currentTurn]);

  const highlightValidMoves = (r, c, b = board) => {
    const newBoard = b.map((r) => r.map((c) => ({ ...c, validMove: false })));
    const { piece, king } = b[r][c];
    const opp = piece === 'Fire' ? 'Ice' : 'Fire';
    const dirs = king
      ? [
          [-1, -1],
          [-1, 1],
          [1, -1],
          [1, 1]
        ]
      : piece === 'Fire'
      ? [
          [-1, -1],
          [-1, 1]
        ]
      : [
          [1, -1],
          [1, 1]
        ];
    let hasCapture = false;

    dirs.forEach(([dx, dy]) => {
      const nr = r + dx,
        nc = c + dy;
      const jr = r + 2 * dx,
        jc = c + 2 * dy;

      if (
        isWithinBounds(jr, jc) &&
        b[nr]?.[nc]?.piece === opp &&
        !b[jr][jc].piece
      ) {
        newBoard[jr][jc].validMove = true;
        hasCapture = true;
      }
    });

    if (!hasCapture) {
      dirs.forEach(([dx, dy]) => {
        const nr = r + dx,
          nc = c + dy;
        if (isWithinBounds(nr, nc) && !b[nr][nc].piece)
          newBoard[nr][nc].validMove = true;
      });
    }

    setBoard(newBoard);
  };

  const handleComputerTurn = () => {
    setTimeout(() => {
      // If we're in the middle of a chain capture, continue it
      if (computerChainCapture) {
        const { row, col } = computerChainCapture;
        const captureMoves = [];
        const cell = board[row][col];
        const dirs = cell.king
          ? [
              [-1, -1],
              [-1, 1],
              [1, -1],
              [1, 1]
            ]
          : [
              [1, -1],
              [1, 1]
            ];

        // Find all possible continuation captures
        for (const [dx, dy] of dirs) {
          const nr = row + dx,
            nc = col + dy;
          const jr = row + 2 * dx,
            jc = col + 2 * dy;

          if (
            isWithinBounds(jr, jc) &&
            board[nr]?.[nc]?.piece === 'Fire' &&
            !board[jr][jc].piece
          ) {
            captureMoves.push({
              from: { r: row, c: col },
              to: { r: jr, c: jc }
            });
          }
        }

        if (captureMoves.length > 0) {
          const randomMove =
            captureMoves[Math.floor(Math.random() * captureMoves.length)];
          movePiece(
            randomMove.from.r,
            randomMove.from.c,
            randomMove.to.r,
            randomMove.to.c
          );
          return;
        } else {
          // Chain capture complete
          setComputerChainCapture(null);
          setCurrentTurn('Fire');
          return;
        }
      }

      // Regular computer currentTurn logic
      const captureMoves = [];
      const regularMoves = [];

      for (let r = 0; r < 8; r++) {
        for (let c = 0; c < 8; c++) {
          const cell = board[r][c];
          if (cell.piece === 'Ice') {
            const dirs = cell.king
              ? [
                  [-1, -1],
                  [-1, 1],
                  [1, -1],
                  [1, 1]
                ]
              : [
                  [1, -1],
                  [1, 1]
                ];

            for (const [dx, dy] of dirs) {
              const nr = r + dx,
                nc = c + dy;
              const jr = r + 2 * dx,
                jc = c + 2 * dy;

              if (
                isWithinBounds(jr, jc) &&
                board[nr]?.[nc]?.piece === 'Fire' &&
                !board[jr][jc].piece
              ) {
                captureMoves.push({ from: { r, c }, to: { r: jr, c: jc } });
              } else if (isWithinBounds(nr, nc) && !board[nr][nc].piece) {
                regularMoves.push({ from: { r, c }, to: { r: nr, c: nc } });
              }
            }
          }
        }
      }

      if (captureMoves.length > 0) {
        const randomMove =
          captureMoves[Math.floor(Math.random() * captureMoves.length)];
        movePiece(
          randomMove.from.r,
          randomMove.from.c,
          randomMove.to.r,
          randomMove.to.c
        );
        return;
      }

      if (regularMoves.length > 0) {
        const randomMove =
          regularMoves[Math.floor(Math.random() * regularMoves.length)];
        movePiece(
          randomMove.from.r,
          randomMove.from.c,
          randomMove.to.r,
          randomMove.to.c
        );
      } else {
        setCurrentTurn('Fire');
      }
    }, 1000);
  };

  const checkForAnyCaptures = (player) => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = board[r][c];
        if (cell.piece === player) {
          const dirs = cell.king
            ? [
                [-1, -1],
                [-1, 1],
                [1, -1],
                [1, 1]
              ]
            : player === 'Fire'
            ? [
                [-1, -1],
                [-1, 1]
              ]
            : [
                [1, -1],
                [1, 1]
              ];

          for (const [dx, dy] of dirs) {
            const nr = r + dx,
              nc = c + dy;
            const jr = r + 2 * dx,
              jc = c + 2 * dy;
            const opponent = player === 'Fire' ? 'Ice' : 'Fire';

            if (
              isWithinBounds(jr, jc) &&
              board[nr]?.[nc]?.piece === opponent &&
              !board[jr][jc].piece
            ) {
              return true;
            }
          }
        }
      }
    }
    return false;
  };

  const handleCellClick = (r, c) => {
    const cell = board[r][c];
    if (gameOver) return;

    if (gameMode === 'Multiplayer') {
      if (!opponentJoined) return;
      if (currentMultiplayerTurn !== userId) {
        alert('Not your turn!');
        return;
      }
    } else {
      if (
        (currentTurn === 'Fire' && cell.piece !== 'Fire' && !selectedPiece) ||
        (currentTurn === 'Ice' && cell.piece !== 'Ice' && !selectedPiece)
      ) {
        return;
      }
    }

    if (selectedPiece && cell.validMove) {
      movePiece(selectedPiece.row, selectedPiece.col, r, c);
      return;
    }

    if (
      (gameMode === 'Multiplayer' &&
        cell.piece === (userId === player1 ? 'Fire' : 'Ice')) ||
      (gameMode === 'Single' && cell.piece === currentTurn)
    ) {
      const currentPlayer =
        gameMode === 'Multiplayer'
          ? userId === player1
            ? 'Fire'
            : 'Ice'
          : currentTurn;

      const captureExists = checkForAnyCaptures(currentPlayer);

      if (captureExists) {
        const canCapture = checkForAdditionalCaptures(r, c, board);
        if (!canCapture) {
          alert('You must make a capture move if available!');
          return;
        }
      }

      setSelectedPiece({ row: r, col: c });
      highlightValidMoves(r, c);
    }
  };

  useEffect(() => {
    if (
      gameMode === 'Single' &&
      currentTurn === 'Ice' &&
      computerChainCapture &&
      !gameOver
    ) {
      handleComputerTurn();
    }
  }, [computerChainCapture, currentTurn, gameOver, gameMode]);

  useEffect(() => {
    if (gameMode === 'Single' && currentTurn === 'Ice' && !gameOver) {
      handleComputerTurn();
    }
  }, [currentTurn, gameOver, gameMode]);

  const onStartGame = async (roomData) => {
    if (roomData && roomData.room) {
      setRoom(roomData);
      setPlayer1(roomData.player1);
      setPlayer2(roomData.player2);
      setPlayer1Name(roomData.player1name || '');
      setPlayer2Name(roomData.player2name || '');
      setGameMode('Multiplayer');
      setStartGame(true);
      setCurrentMultiplayerTurn(roomData.player1);
      setOpponentJoined(!!roomData.player1 && !!roomData.player2);

      const opponentChannel = subscribeToOpponentJoin(
        roomData.room,
        (updatedRoom) => {
          setPlayer1(updatedRoom.player1);
          setPlayer2(updatedRoom.player2);
          setPlayer1Name(updatedRoom.player1name || '');
          setPlayer2Name(updatedRoom.player2name || '');
          setOpponentJoined(!!updatedRoom.player1 && !!updatedRoom.player2);
          playBGMusic('battle');

          const currentBoard = board;
          if (
            updatedRoom.player1 &&
            updatedRoom.player2 &&
            currentBoard.every((row) =>
              row.every((cell) => cell.piece === null)
            )
          ) {
            updateBoardState(
              roomData.room,
              initialBoard(),
              gameId,
              updatedRoom.player1
            );
          }
        }
      );

      const boardChannel = subscribeToBoardUpdates(
        roomData.room,
        (gameState) => {
          if (gameState.board_state) {
            setBoard(gameState.board_state);
            setGameOver(false);
            setWinner(null);
            setShowTitle(false);
            setShowModal(false);
            setWinnerName('');
            setMyChoice(null);
            setOppChoice(null);
            clearThumbsChoices(gameState.room);
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
            handleMultiplayerWin(gameState.winner, 'easy');
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
    setSelectedPiece(null);
    setPlayerChainCapture(null);
    setComputerChainCapture(null);

    if (gameMode === 'Single') {
      setCurrentTurn('Fire');
    } else if (gameMode === 'Multiplayer') {
      const newStartingPlayer = winner === player2 ? player2 : player1;
      setCurrentMultiplayerTurn(newStartingPlayer);
      updateBoardState(room.room, newBoard, gameId, newStartingPlayer);
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

  // Add cleanup for channels in useEffect
  useEffect(() => {
    return () => {
      if (gameMode === 'Multiplayer') {
        unsubscribeFromChannels(channels); // Clean up listeners
      }
    };
  }, [channels]);

  // 1️⃣ Inactivity timer (30s → show modal)
  useEffect(() => {
    if (gameMode !== 'Multiplayer') return;
    let timeoutId;

    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = window.setTimeout(() => {
        setIsConfirmationModalOpen(true);
      }, 30000);
    };

    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    activityEvents.forEach((ev) => window.addEventListener(ev, resetTimer));

    // kick off
    resetTimer();

    return () => {
      clearTimeout(timeoutId);
      activityEvents.forEach((ev) =>
        window.removeEventListener(ev, resetTimer)
      );
    };
  }, [player2]);

  // 2️⃣ Back/forward nav (popstate) → show modal
  useEffect(() => {
    if (gameMode !== 'Multiplayer') return;

    // prime history
    window.history.pushState(null, '', window.location.href);

    const handlePop = (e) => {
      e.preventDefault();
      window.history.pushState(null, '', window.location.href);
      setIsConfirmationModalOpen(true);
    };

    window.addEventListener('popstate', handlePop);
    return () => window.removeEventListener('popstate', handlePop);
  }, [gameMode]);

  // 3️⃣ Tab/window close or refresh → show modal
  useEffect(() => {
    if (gameMode !== 'Multiplayer') return;

    const handleBeforeUnload = (e) => {
      setIsConfirmationModalOpen(true);
      //’show browser prompt’
      e.preventDefault();
      e.returnValue = '';
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, [gameMode]);

  useBeforeUnload((event) => {
    if (!gameOver && gameMode === 'Multiplayer') {
      // Show modal for both modes
      setIsConfirmationModalOpen(true);
      // Force show browser's default prompt as fallback
      event.preventDefault();
      event.returnValue = '';
    }
  });

  useEffect(() => {
    if (!room?.room || gameMode !== 'Multiplayer') return;

    // Track last update timestamp
    let lastUpdate = Date.now();
    const checkInterval = setInterval(() => {
      // If no updates for 10 seconds, assume opponent left
      if (Date.now() - lastUpdate > 60000) {
        alert('Ops, Opponent left the game! What a bummer!');
        handleQuit();
      }
    }, 10000); // Check every 5 seconds

    return () => clearInterval(checkInterval);
  }, [board]);

  const title =
    winner === null && checkGameOver(board)
      ? "It's a Draw!"
      : winner
      ? gameMode === 'Multiplayer'
        ? `${winnerName} wins!`
        : `${winner} wins!`
      : gameMode === 'Multiplayer'
      ? currentMultiplayerTurn === userId
        ? 'Your Turn'
        : 'Opponent Turn'
      : currentTurn === 'Fire'
      ? 'Your Turn'
      : 'Computer Turn';

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
      <div className={`mq-global-container`}>
        <div className='mq-score-container'>
          <span className='mq-score-player'>
            <span className='mq-score-player'>
              {player1Name || userName}: {playerWins}
            </span>
          </span>
          <span className='mq-room-number'>
            {room && room.room} {room && room.password && `- ${room.password}`}
          </span>
          <span className='mq-score-computer'>
            {gameMode === 'Multiplayer'
              ? player2Name
                ? `${player2Name}: ${opponentWins}`
                : 'Waiting opponent...'
              : `Ice: ${computerWins}`}
          </span>
        </div>
        <div
          className={`mq-board mq-${
            gameMode === 'Multiplayer'
              ? currentMultiplayerTurn === player1
                ? player1Symbol.theme
                : player2Symbol.theme
              : currentTurn === 'Fire'
              ? player1Symbol.theme
              : 'ice'
          }`}
        >
          {showTitle && (
            <h1
              className={`mq-ending-title ${
                (winner === 'Ice' || winner === player2) && 'glowingBlue-text'
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
                  }       
                  ${
                    cell.piece
                      ? `mq-${
                          !cell.king
                            ? cell.piece === 'Fire'
                              ? player1Symbol.key + ' mq-fire'
                              : player2Symbol.key + ' mq-ice'
                            : cell.piece === 'Fire'
                            ? `${player1Symbol.key}-king`
                            : `${player2Symbol.key}-king`
                        }`
                      : ''
                  } 
                  ${cell.validMove ? 'valid' : ''} 
                  ${
                    selectedPiece?.row === rowIndex &&
                    selectedPiece?.col === colIndex
                      ? 'mq-selected'
                      : ''
                  } 
                  ${
                    (cell.piece === 'Fire' &&
                      !player1Symbol.display &&
                      !cell.king) ||
                    (cell.piece === 'Ice' &&
                      !player2Symbol.display &&
                      !cell.king)
                      ? 'mq-image'
                      : ''
                  }`}
                  onClick={() => handleCellClick(rowIndex, colIndex)}
                >
                  {cell.piece === 'Fire' &&
                    (cell.king
                      ? '♔'
                      : player1Symbol.display || player1Symbol.image || '🔥')}
                  {cell.piece === 'Ice' &&
                    (cell.king
                      ? '♚'
                      : player2Symbol.display || player2Symbol.image || '❄️')}
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

export default Checkers;
