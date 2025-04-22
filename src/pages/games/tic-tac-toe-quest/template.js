import React, { useState, useEffect } from 'react';
import { useBeforeUnload } from 'react-router-dom';
import GameIntro from '../../gameFlow/gameintro';
import {
  playUncover,
  playDisappear,
  playPlaceObject,
  playNextLevel,
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
const Game = () => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('Fire');
  const [currentMultiplayerTurn, setCurrentMultiplayerTurn] = useState(null); // Track the current turn
  const [gameMode, setGameMode] = useState('Single'); // Track whether it's Single or Multiplayer mode
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [gameId, setGameId] = useState(9);
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

  const introText = `Welcome to Tic Tac Toe!. Take turns placing your marks, aiming to align three in a row, column, or diagonal. A helper will show you where your mark will go when you hover over a box. Good luck!`;

  useEffect(() => {
    const handleScoreUpdate = async () => {
      if (winner || isBoardFull(board)) {
        setGameOver(true);

        if (board.every((cell) => cell === null)) {
          setWinner(null);
        }

        if (gameMode === 'Multiplayer') {
          if (winner === userId) {
            setShowCoinAnimation(true);
            await updateUserWinsByGame(winner, gameId);
          } else if (winner !== userId) {
            await updateUserLosesByGame(userId, gameId);
          }
        }

        if (winner === userId) {
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
    // don’t subscribe until we know the room ID
    if (!room?.room) return;

    const subscription = subscribeToThumbs(room.room, ({ user_id, choice }) => {
      // the payload gives you user_id and choice
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
      // Reset choices after handling
      setMyChoice(null);
      setOppChoice(null);
    }
  }, [myChoice, oppChoice]);

  const findBestMove = (squares, player) => {
    const lines = [
      [0, 1, 2], // Rows
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6], // Columns
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8], // Diagonals
      [2, 4, 6]
    ];

    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (squares[a] === player && squares[b] === player && squares[c] === null)
        return c;
      if (squares[a] === player && squares[c] === player && squares[b] === null)
        return b;
      if (squares[b] === player && squares[c] === player && squares[a] === null)
        return a;
    }

    return null; // No move found
  };

  const calculateWinner = (squares) => {
    const lines = [
      [0, 1, 2],
      [3, 4, 5],
      [6, 7, 8],
      [0, 3, 6],
      [1, 4, 7],
      [2, 5, 8],
      [0, 4, 8],
      [2, 4, 6]
    ];
    for (let i = 0; i < lines.length; i++) {
      const [a, b, c] = lines[i];
      if (
        squares[a] &&
        squares[a] === squares[b] &&
        squares[a] === squares[c]
      ) {
        if (gameMode === 'Multiplayer') {
          return squares[a] === player1Symbol.key ? player1 : player2;
        }

        return squares[a] === player1Symbol.key ? 'Fire' : 'Ice'; // Use Fire/Ice
      }
    }
    return null;
  };

  const isBoardFull = (squares) => {
    return squares.every((square) => square !== null);
  };

  const handleClick = async (index) => {
    playPlaceObject();

    // Prevent clicking on filled cell, if game over, or not Fire's turn in Single mode
    if (board[index] || gameOver) return;

    if (gameMode === 'Single') {
      if (currentTurn !== 'Fire') return;

      const newBoard = [...board];
      newBoard[index] = player1Symbol.key; // Always Fire in Single mode for player
      setBoard(newBoard);

      const userWinner = calculateWinner(newBoard);
      if (userWinner) {
        setWinner(userWinner);
        return;
      }

      if (isBoardFull(newBoard)) {
        setWinner(null);
        setGameOver(true);
        setShowTitle(true);
        setTimeout(() => {
          handleRestart();
        }, 2000);
        return;
      }

      setCurrentTurn('Ice'); // Switch to computer
      handleComputerMove(newBoard);
    } else if (gameMode === 'Multiplayer') {
      if (!opponentJoined) return;
      if (!userId) return;

      // Check if it's the current player's turn
      if (currentMultiplayerTurn !== userId) {
        alert('Not your turn!');
        return;
      }

      const newBoard = [...board];
      newBoard[index] =
        userId === player1 ? player1Symbol.key : player2Symbol.key;
      setBoard(newBoard);

      const multiplayerWinner = calculateWinner(newBoard);
      const nextTurn = userId === player1 ? player2 : player1;

      // Update turn immediately for responsiveness
      setCurrentMultiplayerTurn(nextTurn);

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

      if (isBoardFull(newBoard)) {
        updateBoardState(room.room, newBoard, gameId, null, multiplayerWinner);
        setWinner(null);
        setGameOver(true);
        setTimeout(() => {
          handleRestart();
        }, 2000);

        return;
      }

      // Update server with new state and turn
      updateBoardState(room.room, newBoard, gameId, nextTurn);
    }
  };

  const handleComputerMove = (currentBoard) => {
    const newBoard = [...currentBoard];

    setTimeout(() => {
      playPlaceObject();
      const winningMove = findBestMove(newBoard, '❄️');
      if (winningMove !== null) {
        newBoard[winningMove] = '❄️'; // Computer's move
        setBoard(newBoard);

        const computerWinner = calculateWinner(newBoard);
        if (computerWinner) {
          setWinner(computerWinner);
        } else {
          setCurrentTurn('Fire'); // Switch turn back to Fire
        }
        return;
      }

      const blockingMove = findBestMove(newBoard, player1Symbol.key);
      if (blockingMove !== null) {
        newBoard[blockingMove] = '❄️';
        setBoard(newBoard);

        const computerWinner = calculateWinner(newBoard);
        if (computerWinner) {
          setWinner(computerWinner);
        } else {
          setCurrentTurn('Fire'); // Switch turn back to Fire
        }
        return;
      }

      const emptySquares = newBoard
        .map((value, idx) => (value === null ? idx : null))
        .filter((v) => v !== null);

      if (emptySquares.length > 0) {
        const computerMove =
          emptySquares[Math.floor(Math.random() * emptySquares.length)];
        newBoard[computerMove] = '❄️';

        setBoard(newBoard);

        const computerWinner = calculateWinner(newBoard);
        if (computerWinner) {
          setWinner(computerWinner);
        } else {
          setCurrentTurn('Fire'); // Switch turn back to Fire
        }
      }
    }, 2000); // Adds a 2-second delay
  };

  const handleRestart = () => {
    const initialBoard = Array(9).fill(null);
    setBoard(initialBoard);
    setGameOver(false);
    setWinner(null);
    setShowTitle(false);
    setShowModal(false);
    setMyChoice(null);
    setOppChoice(null);

    // Set first turn dynamically based on previous winner
    if (gameMode === 'Single') {
      if (winner === 'Ice') {
        setCurrentTurn('Ice');
        setTimeout(() => {
          handleComputerMove(initialBoard);
        }, 500); // Delay for smooth restart
      } else {
        setCurrentTurn('Fire');
      }
    } else if (gameMode === 'Multiplayer') {
      // Alternate starting player based on previous winner
      const newStartingPlayer = winner === player2 ? player2 : player1;
      setCurrentMultiplayerTurn(newStartingPlayer);
      updateBoardState(room.room, initialBoard, gameId, newStartingPlayer);
      setTimeout(() => {
        clearThumbsChoices(room.room);
      }, 1000);
    }

    playDisappear();
  };

  const onStartGame = async (roomData) => {
    if (roomData && roomData.room) {
      // Multiplayer logic
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
              Array(9).fill(null),
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

  const handleLeave = () => {
    setIsConfirmationModalOpen(false);
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
    if (gameMode !== 'Multiplayer') return;
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
  }, [gameMode]);

  useBeforeUnload((event) => {
    if (gameMode === 'Multiplayer' && !gameOver) {
      // Show modal for both modes
      setIsConfirmationModalOpen(true);
      // Force show browser's default prompt as fallback
      event.preventDefault();
      event.returnValue = '';
    }
  });

  useEffect(() => {
    if (!room?.room || gameMode !== 'Multiplayer') return;

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
          <span className='mq-score-player'>Fire: {playerWins}</span>
          <span className='mq-room-number'>{room && room.room}</span>
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
                (winner === 'Ice' || winner === player2) && 'glowingBlue-text'
              }`}
            >
              {title}
            </h1>
          )}

          {board.map((square, index) => (
            <div
              key={index}
              className={`mq-square 
                      ${
                        square
                          ? `mq-${
                              square === player1Symbol.key
                                ? player1Symbol.key
                                : square === player2Symbol.key
                                ? player2Symbol.key
                                : 'ice'
                            }`
                          : ''
                      } 
                      ${!square && hoveredIndex === index ? 'mq-preview' : ''} 
                      ${
                        (square === player1Symbol.key &&
                          !player1Symbol.display) ||
                        (square === player2Symbol.key && !player2Symbol.display)
                          ? 'mq-image'
                          : ''
                      }`}
              onClick={() => handleClick(index)}
              onMouseEnter={() => setHoveredIndex(index)} // Track hover
              onMouseLeave={() => setHoveredIndex(null)} // Remove hover effect
            >
              {square}
              <span>
                {gameMode === 'Single' ||
                (gameMode === 'Multiplayer' &&
                  currentMultiplayerTurn === player1)
                  ? player1Symbol.display || player1Symbol.image
                  : player2Symbol.display || player2Symbol.image}
              </span>
            </div>
          ))}
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
          // Reset choices when closing modal
          setMyChoice(null);
          setOppChoice(null);
          if (gameMode === 'Multiplayer') {
            clearThumbsChoices(room.room);
          }
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
