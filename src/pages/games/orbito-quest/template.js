import React, { useState, useEffect } from 'react';
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
import MultiplayerConfirmModal from '../../../components/confirmation';
import { useNavigate } from 'react-router-dom';

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
  const [extraShifts, setExtraShifts] = useState(0);
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
      if (winner || (!winner && isBoardFull(board) && extraShifts >= 5)) {
        setGameOver(true);
        setWinner(winner || 'draw');

        if (gameMode === 'Multiplayer' && winner) {
          // send the winner ID up to supabase; backend will fill in `name`
          updateBoardState(room.room, board, gameId, winner);
        }

        if (winner === userId) {
          playNextLevel();
          triggerConfetti();
          setShowCoinAnimation(true);
          await updateUserWinsByGame(winner, gameId);
        } else if (winner !== userId) {
          playDefeat();
          await updateUserLosesByGame(userId, gameId);
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

  // --- human & computer turns ---

  const handleCellClick = (idx) => {
    if (gameMode === 'Single' && currentTurn === 'Ice') return;
    if (gameOver || isBoardFull(board)) return;
    if (gamePhase !== 'place') return;
    if (board[idx] !== null) return;

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
      const nextTurn = userId === player1 ? player2 : player1;

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

    if (gameMode === 'Multiplayer') {
      const multiplayerWinner = calculateWinner(newBoard);
      const nextTurn = userId === player1 ? player2 : player1;
      setCurrentMultiplayerTurn(nextTurn);
      setGamePhase('place');
      updateBoardState(room.room, newBoard, gameId, nextTurn);
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
    } else {
      setBoard(newBoard);
      setCurrentTurn('Ice');
      setGamePhase('place');

      setTimeout(handleComputerTurn, 500);
    }

    if (isBoardFull(newBoard)) {
      setExtraShifts((prev) => prev + 1);
    }
  };

  const handleComputerTurn = () => {
    // Don't proceed if game is already over
    if (gameOver) return;

    setBoard((prevBoard) => {
      // 1) Check for winner before making any moves
      const currentWinner = calculateWinner(prevBoard);
      if (currentWinner) {
        return prevBoard; // Return unchanged board if there's already a winner
      }

      // 2) clone previous board
      const nextBoard = [...prevBoard];

      // 3) place Ice marble only if board isn't full
      if (!isBoardFull(nextBoard)) {
        const empties = nextBoard
          .map((v, i) => (v === null ? i : null))
          .filter((i) => i !== null);

        if (empties.length > 0) {
          const idx = empties[Math.floor(Math.random() * empties.length)];
          nextBoard[idx] = player2Symbol.key; // computer = Ice
          playPlaceObject();
        }
      }

      // 4) Check for winner after placement but before rotation
      const placementWinner = calculateWinner(nextBoard);
      if (placementWinner) {
        return nextBoard; // Return board with placement if it created a winner
      }

      // 5) Only rotate if no winner after placement
      const rotated = orbitShift(nextBoard);

      // Check for winner after rotation

      return rotated;
    });

    // 6) prepare for human turn if game isn't over
    if (!gameOver) {
      setGamePhase('place');
      setCurrentTurn('Fire');
    }
  };

  // --- restart, reset, quit ---

  const handleRestart = () => {
    setBoard(Array(16).fill(null));
    setGameOver(false);
    setWinner(null);
    setShowTitle(false);
    setShowModal(false);
    setGamePhase('place');
    setExtraShifts(0);

    if (gameMode === 'Single') {
      setCurrentTurn('Fire');
    } else {
      const nextStarter = winner === player2 ? player2 : player1;
      setCurrentMultiplayerTurn(nextStarter);
      updateBoardState(room.room, Array(16).fill(null), gameId, nextStarter);
    }

    playDisappear();
    setTimeout(() => {
      clearThumbsChoices(room.room);
    }, 2000);
  };

  const resetScore = () => {
    setPlayerWins(0);
    setComputerWins(0);
    setOpponentWins(0);
  };

  const handleQuit = () => {
    if (gameMode === 'Multiplayer') {
      clearGameData(room.room, gameId);
      unsubscribeFromChannels(room.room);
    }
    navigate('/');
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
          console.log('🔔 board update:', gameState);
          if (gameState.board_state) {
            setBoard(gameState.board_state);
          }
          if (
            gameState.current_turn !== undefined &&
            gameState.current_turn !== null
          ) {
            setCurrentMultiplayerTurn(gameState.current_turn);
          }
          if (gameState.winner) {
            console.log('🏆 winner payload:', gameState.winner, gameState.name);
            setWinnerName(gameState.name);
            setWinner(gameState.winner);
            handleMultiplayerWin(gameState.winner, 'easy');
            clearGameState(gameState.room, gameState.game_id);
          }
          if (
            gameState.board_state &&
            isBoardFull(gameState.board_state) &&
            !gameState.winner
          ) {
            setShowTitle(true);
            setTimeout(() => {
              setShowTitle(false);
            }, 2000);
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
    return () => {
      if (gameMode === 'Multiplayer') {
        unsubscribeFromChannels(channels);
      }
    };
  }, [channels, gameMode]);

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

  useEffect(() => {
    const handleBeforeUnload = async () => {
      if (gameMode === 'Multiplayer' && room?.room) {
        await clearGameData(room.room, gameId);
        resetScore();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);

      // If the component unmounts and game mode is Multiplayer, clear the game data
      if (gameMode === 'Multiplayer' && room?.room) {
        clearGameData(room.room, gameId);
      }

      // Also unsubscribe from any channels if you do that elsewhere
      unsubscribeFromChannels();
    };
  }, [gameMode, room, gameId]);

  const title =
    winner === null && isBoardFull(board) && extraShifts >= 5
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
            text={
              isBoardFull(board) && extraShifts < 5 ? `${5 - extraShifts}` : '↺'
            }
            onClick={handleOrbitShift}
            isDisabled={
              (gamePhase !== 'orbit' && !isBoardFull(board)) ||
              (isBoardFull(board) && gameOver) ||
              extraShifts >= 5
            }
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
    </>
  );
};

export default Orbito;
