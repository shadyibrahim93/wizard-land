import React, { useState, useEffect, useRef } from 'react';
import { useBeforeUnload } from 'react-router-dom';
import GameIntro from '../../gameFlow/gameintro';
import {
  playUncover,
  playDisappear,
  playPieceSound,
  playNextLevel,
  playDefeat,
  playBGMusic
} from '../../../hooks/useSound';
import Button from '../../../components/Button';
import { triggerConfetti } from './../../../hooks/useConfetti';
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

const Game = () => {
  const [board, setBoard] = useState(
    Array(6)
      .fill(null)
      .map(() => Array(7).fill(null))
  );
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('Fire');
  const [gameMode, setGameMode] = useState('Single'); // Track whether it's Single or Multiplayer mode
  const [hoveredColumn, setHoveredColumn] = useState(null);
  const [currentMultiplayerTurn, setCurrentMultiplayerTurn] = useState(null); // Track the current turn
  const [computerStarts, setComputerStarts] = useState(false);
  const [gameId, setGameId] = useState(4);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [room, setRoom] = useState(null);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [opponentWins, setOpponentWins] = useState(0);
  const [channels, setChannels] = useState([]);
  const { userId, userName } = useUser();
  const player1Symbol = useSelectedPiece(player1 || userId, '🔥', 'fire');
  const player2Symbol = useSelectedPiece(player2, '❄️', 'ice');
  const [winnerName, SetWinnerName] = useState('');
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [myChoice, setMyChoice] = useState(null);
  const [oppChoice, setOppChoice] = useState(null);
  const navigate = useNavigate();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [thumbsResetKey, setThumbsResetKey] = useState(0);
  const [player1Name, setPlayer1Name] = useState('');
  const [player2Name, setPlayer2Name] = useState('');

  const introText = `Welcome to Wizard Land Connect 4! Take turns dropping your element into the corresponding column. A helper will show you where the element will land when you hover over a column. Align four in a row, column, or diagonal to win. Good luck!`;

  useEffect(() => {
    const handleScoreUpdate = async () => {
      if (winner || isBoardFull(board)) {
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
          if (winner === userId) {
            setPlayerWins(playerWins + 1);
          }
          if (winner === 'Ice') {
            setComputerWins(computerWins + 1);
            setComputerStarts(true);
          }
        }

        playUncover();
        setShowTitle(true);

        setTimeout(() => {
          if (gameMode === 'Multiplayer') {
            setShowModal(true);
          } else {
            handleRestart();
          }
          setShowTitle(false);
          SetWinnerName('');
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

  const calculateWinner = (board) => {
    const checkDirection = (row, col, deltaRow, deltaCol) => {
      let count = 0;
      const player = board[row][col];

      for (let i = 0; i < 4; i++) {
        const r = row + deltaRow * i;
        const c = col + deltaCol * i;

        if (r >= 0 && r < 6 && c >= 0 && c < 7 && board[r][c] === player) {
          count++;
        } else {
          break;
        }
      }

      return count === 4 ? player : null;
    };

    for (let row = 0; row < 6; row++) {
      for (let col = 0; col < 7; col++) {
        if (board[row][col]) {
          const winnerSymbol =
            checkDirection(row, col, 0, 1) || // Horizontal
            checkDirection(row, col, 1, 0) || // Vertical
            checkDirection(row, col, 1, 1) || // Diagonal down-right
            checkDirection(row, col, 1, -1); // Diagonal down-left

          if (winnerSymbol) {
            if (gameMode === 'Multiplayer') {
              // Return player1 or player2 ID based on the symbol
              return winnerSymbol === player1 ? player1 : player2;
            } else {
              return winnerSymbol === userId ? 'Fire' : 'Ice';
            }
          }

          if (isBoardFull(board)) {
            return null;
          }
        }
      }
    }

    return null;
  };

  const isBoardFull = (board) => {
    // First check if board exists and has rows
    if (!board || !Array.isArray(board) || board.length === 0) return false;

    // Then check if all cells are filled
    return board.every(
      (row) => Array.isArray(row) && row.every((cell) => cell !== null)
    );
  };

  const handleClick = (col) => {
    if (gameOver || board[0][col] !== null) return;

    const newBoard = board.map((row) => [...row]);
    let placedRow = null;

    for (let r = 5; r >= 0; r--) {
      if (!newBoard[r][col]) {
        placedRow = r;
        break;
      }
    }

    if (placedRow === null) return;

    // === SINGLE PLAYER MODE ===
    if (gameMode === 'Single') {
      if (currentTurn !== 'Fire') return;

      newBoard[placedRow][col] = userId;
      setBoard(newBoard);

      const currentWinner = calculateWinner(newBoard);
      if (currentWinner) {
        setWinner(currentWinner);
        return;
      }

      if (isBoardFull(newBoard.flat())) {
        setWinner(null);
        setGameOver(true);
        playUncover();
        setShowTitle(true);
        setTimeout(() => {
          playDisappear();
          handleRestart();
        }, 3500);
        return;
      }

      setCurrentTurn('Ice');
      handleComputerMove(newBoard);
    }

    // === MULTIPLAYER MODE ===
    else if (gameMode === 'Multiplayer') {
      if (!opponentJoined || !userId || currentMultiplayerTurn !== userId) {
        alert('Not your turn!');
        return;
      }

      const playerSymbol = userId === player1 ? player1 : player2;
      newBoard[placedRow][col] = playerSymbol;
      setBoard(newBoard);

      const multiplayerWinner = calculateWinner(newBoard);
      const nextTurn = userId === player1 ? player2 : player1;

      setCurrentMultiplayerTurn(nextTurn);

      if (multiplayerWinner) {
        setWinner(multiplayerWinner);
        updateBoardState(room.room, newBoard, gameId, null, multiplayerWinner);
        return;
      }

      if (isBoardFull(newBoard)) {
        updateBoardState(room.room, newBoard, gameId, null, null);
        setWinner(null);
        setGameOver(true);
        setShowTitle(true);
        setTimeout(() => {
          handleRestart();
        }, 2000);
        return;
      }

      updateBoardState(room.room, newBoard, gameId, nextTurn);
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
    if (winner || isBoardFull(board)) return;

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

  const handleComputerMove = (currentBoard) => {
    const newBoard = currentBoard.map((row) => [...row]);

    const checkForWinOrBlock = (player) => {
      for (let col = 0; col < 7; col++) {
        for (let row = 5; row >= 0; row--) {
          if (!newBoard[row][col]) {
            newBoard[row][col] = player;
            const isWinningMove =
              calculateWinner(newBoard) === (player === '❄️' ? 'Ice' : 'Fire');
            newBoard[row][col] = null;

            if (isWinningMove) return col;
            break;
          }
        }
      }
      return null;
    };

    setTimeout(() => {
      playPieceSound();

      const winningMove = checkForWinOrBlock('❄️');
      if (winningMove !== null) {
        for (let row = 5; row >= 0; row--) {
          if (!newBoard[row][winningMove]) {
            newBoard[row][winningMove] = '❄️';
            setBoard(newBoard);
            const computerWinner = calculateWinner(newBoard);
            if (computerWinner) setWinner(computerWinner);
            setCurrentTurn('Fire');
            return;
          }
        }
      }

      const blockingMove = checkForWinOrBlock(userId);
      if (blockingMove !== null) {
        for (let row = 5; row >= 0; row--) {
          if (!newBoard[row][blockingMove]) {
            newBoard[row][blockingMove] = '❄️';
            setBoard(newBoard);
            setCurrentTurn('Fire');
            return;
          }
        }
      }

      const emptyColumns = [];
      for (let col = 0; col < 7; col++) {
        for (let row = 5; row >= 0; row--) {
          if (!newBoard[row][col]) {
            emptyColumns.push(col);
            break;
          }
        }
      }

      if (emptyColumns.length > 0) {
        const randomCol =
          emptyColumns[Math.floor(Math.random() * emptyColumns.length)];
        for (let row = 5; row >= 0; row--) {
          if (!newBoard[row][randomCol]) {
            newBoard[row][randomCol] = '❄️';
            setBoard(newBoard);
            setCurrentTurn('Fire');
            return;
          }
        }
      }
    }, 2000);
  };

  const getLowestOpenRow = (col) => {
    for (let row = 5; row >= 0; row--) {
      if (!board[row][col]) return row;
    }
    return -1;
  };

  const handleRestart = () => {
    const newBoard = Array(6)
      .fill(null)
      .map(() => Array(7).fill(null));

    setBoard(newBoard);
    setGameOver(false);
    setWinner(null);
    setShowTitle(false);

    // Set first turn dynamically based on previous winner
    if (gameMode === 'Single') {
      if (winner === 'Ice') {
        setCurrentTurn('Ice');
        setTimeout(() => {
          handleComputerMove(newBoard);
        }, 500); // Delay for smooth restart
      } else {
        setCurrentTurn('Fire');
      }
    } else if (gameMode === 'Multiplayer') {
      // Alternate starting player based on previous winner
      const newStartingPlayer = winner === player2 ? player2 : player1;
      setCurrentMultiplayerTurn(newStartingPlayer);
      updateBoardState(room.room, newBoard, gameId, newStartingPlayer);
    }

    playDisappear();
  };

  const onStartGame = async (roomData) => {
    if (roomData && roomData.room) {
      // Multiplayer logic
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
            currentBoard.every((square) => square === null)
          ) {
            updateBoardState(
              roomData.room,
              Array(6)
                .fill(null)
                .map(() => Array(7).fill(null)),
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
            SetWinnerName(gameState.name);
            setWinner(gameState.winner);
            handleMultiplayerWin(gameState.winner, 'easy');
            clearGameState(gameState.room, gameState.game_id);
          }
        }
      );

      setChannels([opponentChannel, boardChannel]);
    } else {
      // Single player fallback logic
      setGameMode('Single');
      setStartGame(true);
    }
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
    winner === null && isBoardFull(board)
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
        onStartGame={(roomData, playerId) => onStartGame(roomData, playerId)}
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

          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`mq-square mq-${
                  cell
                    ? gameMode === 'Single'
                      ? cell === userId
                        ? 'fire'
                        : 'ice'
                      : cell === player1
                      ? 'fire'
                      : cell === player2
                      ? 'ice'
                      : ''
                    : ''
                }  ${
                  hoveredColumn === colIndex &&
                  rowIndex === getLowestOpenRow(colIndex)
                    ? 'mq-preview' // Ice's turn preview (only in Multiplayer mode)
                    : ''
                } ${
                  (cell === userId && !player1Symbol.display) ||
                  (cell === player2 && !player2Symbol.display)
                    ? 'mq-image'
                    : ''
                }`}
                onClick={() => handleClick(colIndex)}
                onMouseEnter={() => setHoveredColumn(colIndex)}
                onMouseLeave={() => setHoveredColumn(null)}
              >
                {cell &&
                  (gameMode === 'Single'
                    ? cell === userId
                      ? player1Symbol.display || player1Symbol.image
                      : player2Symbol.display || player2Symbol.image
                    : cell === player1
                    ? player1Symbol.display || player1Symbol.image
                    : cell === player2
                    ? player2Symbol.display || player2Symbol.image
                    : cell)}
                <span>
                  {gameMode === 'Single' ||
                  (gameMode === 'Multiplayer' &&
                    currentMultiplayerTurn === player1)
                    ? player1Symbol.display || player1Symbol.image
                    : player2Symbol.display || player2Symbol.image}
                </span>
              </div>
            ))
          )}
        </div>
      </div>
      <Button
        text='Reset Score'
        onClick={resetScore}
      />
      {showCoinAnimation && (
        <CollectionBurst
          onComplete={() => setShowCoinAnimation(false)} // Hide animation after completion
        />
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

export default Game;
