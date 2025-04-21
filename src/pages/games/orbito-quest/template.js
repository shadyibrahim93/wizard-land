import React, { useState, useEffect } from 'react';
import { useBeforeUnload } from 'react-router-dom';
import GameIntro from '../../gameFlow/gameintro';
import {
  playUncover,
  playDisappear,
  playPlaceObject,
  playNextLevel,
  playDefeat,
  playShift
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
  updateUserWinsByGame,
  updateUserLosesByGame,
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

const Orbito = () => {
  // --- state & setup ---
  const [board, setBoard] = useState(Array(16).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('Fire');
  const [currentMultiplayerTurn, setCurrentMultiplayerTurn] = useState(null);
  const [gameMode, setGameMode] = useState('Single');
  const [gamePhase, setGamePhase] = useState('place');
  const [extraShifts, setExtraShifts] = useState(5);
  const [gameId] = useState(12);
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

  // rings defined clockwise
  const outerRing = [0, 1, 2, 3, 7, 11, 15, 14, 13, 12, 8, 4];
  const innerRing = [5, 6, 10, 9];

  const introText = `
    Welcome to Orbito! Align 4 of your marbles in a row.
    1) Place your marble on any free square.
    2) Press Shift to rotate all marbles once around the rings.
    First to 4 in a row wins!`;

  // --- utility functions ---

  const isBoardFull = (b) => b.every((cell) => cell !== null);

  const calculateWinner = (b) => {
    const lines = [
      [0, 1, 2, 3],
      [4, 5, 6, 7],
      [8, 9, 10, 11],
      [12, 13, 14, 15],
      [0, 4, 8, 12],
      [1, 5, 9, 13],
      [2, 6, 10, 14],
      [3, 7, 11, 15],
      [0, 5, 10, 15],
      [3, 6, 9, 12]
    ];

    for (let [a, b1, c, d] of lines) {
      if (b[a] && b[a] === b[b1] && b[a] === b[c] && b[a] === b[d]) {
        if (gameMode === 'Multiplayer') {
          return b[a] === player1Symbol.key ? player1 : player2;
        }

        return b[a] === player1Symbol.key ? 'Fire' : 'Ice'; // Use Fire/Ice
      }
    }

    return null;
  };

  const orbitShift = (curr) => {
    playShift();
    const b = [...curr];
    const shiftCCW = (idxs) => {
      const tmp = b[idxs[0]];
      for (let i = 0; i < idxs.length - 1; i++) {
        b[idxs[i]] = b[idxs[i + 1]];
      }
      b[idxs[idxs.length - 1]] = tmp;
    };
    shiftCCW(outerRing);
    shiftCCW(innerRing);
    return b;
  };

  // --- scoring & endgame ---
  useEffect(() => {
    const handleScoreUpdate = async () => {
      if (gameOver) return;

      if (isBoardFull(board) && extraShifts === 0) {
        setGameOver(true);
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

      if (winner) {
        setGameOver(true);

        if (gameMode === 'Multiplayer' && winner) {
          // Update the board state with the winner once
          updateBoardState(room.room, board, gameId, winner);
        }

        // Handle win/lose updates and UI effects
        if (winner === userId) {
          playNextLevel();
          triggerConfetti();
          setShowCoinAnimation(true);
          await updateUserWinsByGame(winner, gameId);
        } else if (winner) {
          playDefeat();
          await updateUserLosesByGame(userId, gameId);
        }

        // Update score counters
        if (gameMode === 'Multiplayer') {
          if (player1 === winner) {
            setPlayerWins((prev) => prev + 1);
          } else if (player2 === winner) {
            setOpponentWins((prev) => prev + 1);
          }
        } else {
          if (winner === 'Fire') setPlayerWins((prev) => prev + 1);
          if (winner === 'Ice') setComputerWins((prev) => prev + 1);
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
  }, [
    winner,
    board,
    extraShifts,
    gameOver,
    room,
    gameMode,
    userId,
    player1,
    player2
  ]);

  // --- human & computer turns ---

  const handleCellClick = (idx) => {
    if (
      (gameMode === 'Single' && currentTurn === 'Ice') ||
      gameOver ||
      isBoardFull(board) ||
      gamePhase !== 'place' ||
      board[idx] !== null
    )
      return;

    const symbol =
      gameMode === 'Multiplayer'
        ? currentMultiplayerTurn === player1
          ? player1Symbol.key
          : player2Symbol.key
        : currentTurn === 'Fire'
        ? player1Symbol.key
        : player2Symbol.key;

    if (gameMode === 'Single') {
      const newBoard = [...board];
      newBoard[idx] = symbol;
      setBoard(newBoard);

      const userWinner = calculateWinner(newBoard);
      if (userWinner) {
        setWinner(userWinner);
        return;
      }
      setGamePhase('orbit');
    } else if (gameMode === 'Multiplayer') {
      if (!opponentJoined) return;
      if (!userId) return;

      if (currentMultiplayerTurn !== userId) {
        alert('Not your turn!');
        return;
      }

      const newBoard = [...board];
      newBoard[idx] =
        userId === player1 ? player1Symbol.key : player2Symbol.key;
      setBoard(newBoard);

      setGamePhase('orbit');

      const multiplayerWinner = calculateWinner(newBoard);
      updateBoardState(room.room, newBoard, gameId, currentMultiplayerTurn);

      if (multiplayerWinner) {
        setWinner(multiplayerWinner);
        updateBoardState(
          room.room,
          newBoard,
          gameId,
          null, // No next turn (game over)
          multiplayerWinner
        );
        return;
      }
    }

    playPlaceObject();
  };

  const handleOrbitShift = () => {
    const newBoard = orbitShift(board);

    if (gameMode === 'Single') {
      // consume an extra shift if the board was full
      if (isBoardFull(newBoard) && extraShifts > 0) {
        setExtraShifts((es) => es - 1);
      }
      // check for a winner right after the shift
      const shiftWinner = calculateWinner(newBoard);
      if (shiftWinner) {
        setWinner(shiftWinner);
        return;
      }
      // back to “place” phase and hand turn to computer
      setGamePhase('place');
      setCurrentTurn('Ice');
      return;
    }

    if (isBoardFull(board) && extraShifts > 0) {
      const newExtraShifts = extraShifts - 1;
      setExtraShifts(newExtraShifts);

      // Update the board state with the new extraShifts
      updateBoardState(room.room, newBoard, gameId, null, null, newExtraShifts);

      if (newExtraShifts === 0) {
        const winner = calculateWinner(newBoard);
        if (winner) {
          setWinner(winner);
          updateBoardState(
            room.room,
            newBoard,
            gameId,
            null,
            winner,
            newExtraShifts
          );
        }
        return;
      }

      const multiplayerWinner = calculateWinner(newBoard);
      if (multiplayerWinner) {
        setWinner(multiplayerWinner);
        updateBoardState(
          room.room,
          newBoard,
          gameId,
          null,
          multiplayerWinner,
          newExtraShifts
        );
        return;
      }

      const nextTurn = userId === player1 ? player2 : player1;
      setCurrentMultiplayerTurn(nextTurn);
      setGamePhase('place');
      updateBoardState(
        room.room,
        newBoard,
        gameId,
        nextTurn,
        null,
        newExtraShifts
      );
    } else if (gameMode === 'Multiplayer') {
      // Handle cases when the board isn't full
      const multiplayerWinner = calculateWinner(newBoard);
      const nextTurn = userId === player1 ? player2 : player1;
      setCurrentMultiplayerTurn(nextTurn);
      setGamePhase('place');
      updateBoardState(room.room, newBoard, gameId, nextTurn);

      if (multiplayerWinner) {
        setWinner(multiplayerWinner);
        updateBoardState(room.room, newBoard, gameId, null, multiplayerWinner);
        return;
      }
    }
  };

  const handleComputerTurn = () => {
    if (gameOver) return;

    // 1) If there's already a winner on the *current* board, bail out
    const currentWinner = calculateWinner(board);
    if (currentWinner) return;

    // 2) Clone the current board
    let nextBoard = [...board];

    // 3) Place the Ice marble if there's space
    if (!isBoardFull(nextBoard)) {
      const empties = nextBoard
        .map((v, i) => (v === null ? i : null))
        .filter((i) => i !== null);

      if (empties.length > 0) {
        const idx = empties[Math.floor(Math.random() * empties.length)];
        nextBoard[idx] = player2Symbol.key;
        playPlaceObject();
      }
    }

    // 4) If that placement just won the game, set it and stop
    const placementWinner = calculateWinner(nextBoard);
    if (placementWinner) {
      setBoard(nextBoard);
      setWinner(placementWinner);
      return;
    }

    // 5) Otherwise do the ring‑shift and commit it
    const rotated = orbitShift(nextBoard);
    setBoard(rotated);

    // 6) Finally hand control back to the human
    setGamePhase('place');
    setCurrentTurn('Fire');
  };

  useEffect(() => {
    if (
      gameMode === 'Single' &&
      gamePhase === 'place' &&
      currentTurn === 'Ice' &&
      !gameOver
    ) {
      handleComputerTurn();
    }
  }, [gameMode, gamePhase, currentTurn, gameOver]);

  // --- restart, reset, quit ---

  const handleRestart = () => {
    setBoard(Array(16).fill(null));
    setGameOver(false);
    setWinner(null);
    setShowTitle(false);
    setShowModal(false);
    setGamePhase('place');

    if (gameMode === 'Single') {
      setCurrentTurn('Fire');
    } else {
      const nextStarter = winner === player2 ? player2 : player1;
      setCurrentMultiplayerTurn(nextStarter);
      updateBoardState(room.room, Array(16).fill(null), gameId, nextStarter);
    }

    playDisappear();
    setTimeout(() => {
      if (gameMode === 'Multiplayer') {
        clearThumbsChoices(room.room);
      }
    }, 2000);
  };

  // --- multiplayer setup & teardown ---

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
            currentBoard.every((square) => square === null)
          ) {
            updateBoardState(
              roomData.room,
              Array(16).fill(null),
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
          }
          if (gameState.extraShifts !== undefined) {
            setExtraShifts(gameState.extraShifts);
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

  useEffect(() => {
    if (!room?.room) return;
    const sub = subscribeToThumbs(room.room, ({ user_id, choice }) => {
      if (user_id === userId) setMyChoice(choice);
      else setOppChoice(choice);
    });
    return () => supabase.realtime.removeChannel(sub);
  }, [room, userId]);

  useEffect(() => {
    if (myChoice && oppChoice) {
      if (myChoice === 'up' && oppChoice === 'up') {
        handleRestart();
      } else {
        handleQuit();
      }
    }
  }, [myChoice, oppChoice]);

  const handleQuit = () => {
    setIsConfirmationModalOpen(false);
    if (gameMode === 'Multiplayer') {
      clearGameData(room.room, gameId);
      unsubscribeFromChannels(room.room);
    }
    navigate('/');
  };

  const handleLeave = () => {
    setIsConfirmationModalOpen(false);
    alert('Ops, Opponent left the game! What a bummer!');
    if (gameMode === 'Multiplayer') {
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

  useEffect(() => {
    let timeoutId;

    // 1) resetTimer — shows modal after 30s of no activity
    const resetTimer = () => {
      clearTimeout(timeoutId);
      timeoutId = setTimeout(() => {
        setIsConfirmationModalOpen(true);
      }, 30000);
    };

    // 2) handlePop — traps back/forward nav and shows modal
    const handlePop = (e) => {
      e.preventDefault();
      // re‑push so the user stays on the same page
      window.history.pushState(null, '', window.location.href);
      setIsConfirmationModalOpen(true);
    };

    // Prime history so popstate will fire at least once
    window.history.pushState(null, '', window.location.href);

    // Listen for activity events
    const activityEvents = ['mousemove', 'keydown', 'mousedown', 'touchstart'];
    activityEvents.forEach((ev) => window.addEventListener(ev, resetTimer));

    // Listen for back/forward
    window.addEventListener('popstate', handlePop);

    // Kick off the first timer
    resetTimer();

    return () => {
      // Clean up timeout
      clearTimeout(timeoutId);

      // Remove all listeners
      activityEvents.forEach((ev) =>
        window.removeEventListener(ev, resetTimer)
      );
      window.removeEventListener('popstate', handlePop);
    };
  }, []);

  useBeforeUnload((event) => {
    if (!gameOver) {
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
        handleLeave();
      }
    }, 10000); // Check every 5 seconds

    return () => clearInterval(checkInterval);
  }, [board]);

  const shiftDisabled = () => {
    if (gameOver) return true;
    if (gameMode === 'Multiplayer' && currentMultiplayerTurn !== userId)
      return true;
    // only allow when in orbit phase or in extra shift mode
    if (!isBoardFull(board) && gamePhase !== 'orbit') return true;
    if (isBoardFull(board) && extraShifts <= 0) return true;
    return false;
  };

  const title =
    winner === null && isBoardFull(board) && extraShifts <= 0
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
        onStartGame={onStartGame}
      />
    </>
  ) : (
    <>
      <div className='mq-global-container'>
        <div className='mq-score-container'>
          <span className='mq-score-player'>Fire: {playerWins}</span>
          <span className='mq-room-number'>{room?.room}</span>
          <span className='mq-score-computer'>
            Ice: {gameMode === 'Multiplayer' ? opponentWins : computerWins}
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
                winner === 'Ice' || winner === player2 ? 'glowingBlue-text' : ''
              }`}
            >
              {title}
            </h1>
          )}

          {board.map((cell, idx) => (
            <div
              key={idx}
              className={`mq-square
                ${cell ? `mq-${cell}` : ''}
                ${innerRing.includes(idx) ? 'mq-inner' : 'mq-outer'}
                ${
                  (cell === player1Symbol.key && !player1Symbol.display) ||
                  (cell === player2Symbol.key && !player2Symbol.display)
                    ? 'mq-image'
                    : ''
                }`}
              onClick={() => handleCellClick(idx)}
            >
              {cell}
            </div>
          ))}
          <Button
            text={isBoardFull(board) ? `${extraShifts}` : '↺'}
            onClick={handleOrbitShift}
            isDisabled={shiftDisabled()}
          />
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
        onClose={() => setShowModal(false)}
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
        title='Leave Game?'
      />
    </>
  );
};

export default Orbito;
