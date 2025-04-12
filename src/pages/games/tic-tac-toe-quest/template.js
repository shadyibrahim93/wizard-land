import React, { useState, useEffect } from 'react';
import GameIntro from '../../gameFlow/gameintro';
import {
  playUncover,
  playDisappear,
  playPlaceObject,
  playNextLevel
} from '../../../hooks/useSound';
import Button from '../../../components/Button';
import { triggerConfetti } from '../../../hooks/useConfetti';
import MultiplayerModal from '../../../components/generalModals/multiplayerModal';
import {
  subscribeToOpponentJoin,
  updateBoardState,
  subscribeToBoardUpdates,
  unsubscribeFromChannels,
  getCurrentUser
} from '../../../apiService';

const Game = ({ setCurrentLevel }) => {
  const [board, setBoard] = useState(Array(9).fill(null));
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('Fire');
  const [currentMultiplayerTurn, setCurrentMultiplayerTurn] = useState(null); // Track the current turn
  const [computerStarts, setComputerStarts] = useState(false);
  const [gameMode, setGameMode] = useState('Single'); // Track whether it's Single or Multiplayer mode
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [gameId, setGameId] = useState(9);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [room, setRoom] = useState(null);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [opponentWins, setOpponentWins] = useState(0);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [channels, setChannels] = useState([]);

  const introText = `Welcome to Tic Tac Toe! Play as '🔥', and the opponent will play as '❄️'. Take turns placing your marks, aiming to align three in a row, column, or diagonal. A helper will show you where your mark will go when you hover over a box. Good luck!`;

  useEffect(() => {
    setCurrentLevel('∞');

    if (winner || isBoardFull(board)) {
      setGameOver(true);
      playUncover();
      setShowTitle(true);

      if (gameMode === 'Multiplayer') {
        if (winner === player1) {
          setPlayerWins(playerWins + 1);
        }
        if (winner === player2) {
          setOpponentWins(opponentWins + 1); // You may need to track this
        }
      } else {
        if (winner === 'Fire') {
          setPlayerWins(playerWins + 1);
        }

        if (winner === 'Ice') {
          setComputerWins(computerWins + 1);
          setComputerStarts(true); // Computer starts next game
        }
      }

      // Automatically restart the game after 3.5 seconds
      setTimeout(() => {
        handleRestart();
      }, 3500);
    }
  }, [winner, board]);

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
        playNextLevel();
        triggerConfetti();
        if (gameMode === 'Multiplayer') {
          return squares[a] === '🔥' ? player1 : player2;
        }

        return squares[a] === '🔥' ? 'Fire' : 'Ice'; // Use Fire/Ice
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
      newBoard[index] = '🔥'; // Always Fire in Single mode for player
      setBoard(newBoard);

      const userWinner = calculateWinner(newBoard);
      if (userWinner) {
        setWinner(userWinner);
        return;
      }

      if (isBoardFull(newBoard)) {
        setWinner(null); // It's a draw
        return;
      }

      setCurrentTurn('Ice'); // Switch to computer
      handleComputerMove(newBoard);
    } else if (gameMode === 'Multiplayer') {
      if (!opponentJoined) return;

      const currentUser = await getCurrentUser();
      if (!currentUser) return;

      console.log(
        'Current turn:',
        currentMultiplayerTurn,
        'Current user:',
        currentUser.id,
        'Player1:',
        player1,
        'Player2:',
        player2
      );

      // Check if it's the current player's turn
      if (currentMultiplayerTurn !== currentUser.id) {
        console.log('Not your turn!');
        return;
      }

      const newBoard = [...board];
      newBoard[index] = currentUser.id === player1 ? '🔥' : '❄️';
      setBoard(newBoard);

      const multiplayerWinner = calculateWinner(newBoard);
      const nextTurn = currentUser.id === player1 ? player2 : player1;

      // Update turn immediately for responsiveness
      setCurrentMultiplayerTurn(nextTurn);
      console.log('Turn updated locally to:', nextTurn);

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
        updateBoardState(room.room, newBoard, gameId, null, null);
        setWinner(null);
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

      const blockingMove = findBestMove(newBoard, '🔥');
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
    }

    playDisappear();
  };

  const resetScore = () => {
    setComputerWins(0);
    setPlayerWins(0);
  };

  const onSecondButtonClick = () => {
    setGameMode('Multiplayer');
    setIsModalOpen(true);
  };

  const onStartGame = async (roomData) => {
    console.log('Game started with room:', roomData);
    setRoom(roomData);

    const currentUser = await getCurrentUser();
    if (!currentUser) {
      console.error('No user logged in');
      return;
    }

    // Set players from room data
    setPlayer1(roomData.player1);
    setPlayer2(roomData.player2);

    setGameMode('Multiplayer');
    setStartGame(true);

    // Determine initial turn - creator goes first
    const initialTurn = roomData.player1;
    setCurrentMultiplayerTurn(initialTurn);

    console.log(
      'Initial turn set to:',
      initialTurn,
      'Player1:',
      roomData.player1,
      'Player2:',
      roomData.player2
    );

    // Immediately set opponentJoined if both players are present
    setOpponentJoined(!!roomData.player1 && !!roomData.player2);

    const opponentChannel = subscribeToOpponentJoin(
      roomData.room,
      (updatedRoom) => {
        console.log('Room update:', updatedRoom);
        setPlayer1(updatedRoom.player1);
        setPlayer2(updatedRoom.player2);

        // More reliable opponent detection
        const bothPlayersPresent =
          !!updatedRoom.player1 && !!updatedRoom.player2;
        setOpponentJoined(bothPlayersPresent);

        if (bothPlayersPresent && board.every((square) => square === null)) {
          updateBoardState(roomData.room, Array(9).fill(null), gameId, player1);
        }
      }
    );

    const boardChannel = subscribeToBoardUpdates(roomData.room, (gameState) => {
      console.log('Board update received:', gameState);

      // Always update board state if present
      if (gameState.board_state) {
        setBoard(gameState.board_state);
      }

      // Update current turn if present
      if (
        gameState.current_turn !== undefined &&
        gameState.current_turn !== null
      ) {
        console.log('Updating turn to:', gameState.current_turn);
        setCurrentMultiplayerTurn(gameState.current_turn);
      }

      // Handle winner if present
      if (gameState.winner) {
        setWinner(gameState.winner);
        if (gameState.winner === player1) {
          setPlayerWins((prev) => prev + 1);
        } else {
          setOpponentWins((prev) => prev + 1);
        }
      }
    });

    setChannels([opponentChannel, boardChannel]);
  };

  // Add cleanup for channels in useEffect
  useEffect(() => {
    return () => {
      // Unsubscribe from all channels when component unmounts
      if (channels) {
        unsubscribeFromChannels(channels);
      }
    };
  }, [channels]);

  useEffect(() => {
    console.log('Current multiplayer turn updated:', currentMultiplayerTurn);
  }, [currentMultiplayerTurn]);

  useEffect(() => {
    console.log('Players updated - Player1:', player1, 'Player2:', player2);
  }, [player1, player2]);

  const title =
    winner === null && isBoardFull(board)
      ? "It's a Draw!"
      : winner
      ? `${winner} wins!`
      : `Your Turn: ${currentTurn}`;

  return !startGame ? (
    <>
      <GameIntro
        introText={introText}
        onStart={() => {
          setGameMode('Single');
          setStartGame(true);
        }}
        firstButtonText='Single Player'
        onSecondButtonClick={onSecondButtonClick}
        secondButtonText='Multiplayer'
      />
      <MultiplayerModal
        isOpen={isModalOpen}
        gameId={gameId}
        onClose={() => setIsModalOpen(false)}
        onStartGame={(roomData, playerId) => onStartGame(roomData, playerId)}
      />
    </>
  ) : (
    <>
      <div
        className={`mq-global-container mq-${
          gameMode === 'Multiplayer'
            ? currentMultiplayerTurn === player1
              ? 'fire'
              : 'ice'
            : currentTurn === 'Fire'
            ? 'fire'
            : 'ice'
        }`}
      >
        <div className='mq-score-container'>
          <span className='mq-score-player'>Fire: {playerWins}</span>
          <span className='mq-score-computer'>Ice: {computerWins}</span>
        </div>
        <div
          className={`mq-board mq-${
            gameMode === 'Multiplayer'
              ? currentMultiplayerTurn === player1
                ? 'fire'
                : 'ice'
              : currentTurn === 'Fire'
              ? 'fire'
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
              className={`mq-square ${
                square ? `mq-${square === '🔥' ? 'Fire' : 'Ice'}` : ''
              } ${
                !square && hoveredIndex === index
                  ? gameMode === 'Single'
                    ? currentTurn === 'Fire'
                      ? 'mq-fire-preview'
                      : ''
                    : gameMode === 'Multiplayer'
                    ? currentMultiplayerTurn === player1
                      ? 'mq-fire-preview'
                      : 'mq-ice-preview'
                    : ''
                  : ''
              }`}
              onClick={() => handleClick(index)}
              onMouseEnter={() => setHoveredIndex(index)} // Track hover
              onMouseLeave={() => setHoveredIndex(null)} // Remove hover effect
            >
              {square}
            </div>
          ))}
        </div>
      </div>
      <Button
        text='Reset Score'
        onClick={resetScore}
      />
    </>
  );
};

export default Game;
