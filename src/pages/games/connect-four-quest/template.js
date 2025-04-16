import React, { useState, useEffect } from 'react';
import GameIntro from '../../gameFlow/gameintro';
import {
  playUncover,
  playDisappear,
  playPlaceObject,
  playNextLevel
} from '../../../hooks/useSound';
import Button from '../../../components/Button';
import { triggerConfetti } from './../../../hooks/useConfetti';
import {
  subscribeToOpponentJoin,
  updateBoardState,
  subscribeToBoardUpdates,
  unsubscribeFromChannels,
  clearGameData
} from '../../../apiService';
import MultiplayerModal from '../../../components/generalModals/multiplayerModal';
import { useSelectedPiece } from '../../../hooks/userSelectedPiece';
import { useUser } from '../../../context/UserContext';
import { handleMultiplayerWin } from '../../../hooks/handleProgressUpdate';

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
  const [hoveredIndex, setHoveredIndex] = useState(null);
  const [gameId, setGameId] = useState(4);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [room, setRoom] = useState(null);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [opponentWins, setOpponentWins] = useState(0);
  const [channels, setChannels] = useState([]);
  const { userId, userName } = useUser();
  const player1Symbol = useSelectedPiece(player1 || userId, '🔥');
  const player2Symbol = useSelectedPiece(player2, '❄️');

  const introText = `Welcome to Wizards Land Connect 4! Take turns dropping your element into the corresponding column. A helper will show you where the element will land when you hover over a column. Align four in a row, column, or diagonal to win. Good luck!`;

  useEffect(() => {
    const handleScoreUpdate = async () => {
      if (winner || (isBoardFull(board) && !winner)) {
        setGameOver(true);
        playUncover();
        setShowTitle(true);

        if (gameMode === 'Multiplayer') {
          if (player1 === winner) {
            setPlayerWins((prev) => prev + 1);
          } else if (player2 === winner) {
            setOpponentWins((prev) => prev + 1);
          }
          updateBoardState(
            room.room,
            board,
            gameId,
            currentMultiplayerTurn,
            winner
          );
        } else {
          if (winner === 'Fire') {
            setPlayerWins((prev) => prev + 1);
          }
          if (winner === 'Ice') {
            setComputerWins((prev) => prev + 1);
            setComputerStarts(true);
          }
        }

        setTimeout(() => {
          handleRestart();
          setShowTitle(false);
        }, 3500);
      }
    };

    handleScoreUpdate();
  }, [winner]);

  const calculateWinner = (board) => {
    if (!board || !Array.isArray(board) || board.length === 0) return null;

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
              return winnerSymbol === player1Symbol.key ? player1 : player2;
            } else {
              return winnerSymbol === player1Symbol.key ? 'Fire' : 'Ice';
            }
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
    playPlaceObject();
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

      newBoard[placedRow][col] = player1Symbol.key;
      setBoard(newBoard);

      const currentWinner = calculateWinner(newBoard);
      if (currentWinner) {
        playNextLevel();
        triggerConfetti();
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

      const playerSymbol =
        userId === player1 ? player1Symbol.key : player2Symbol.key;
      newBoard[placedRow][col] = playerSymbol;
      setBoard(newBoard);

      const multiplayerWinner = calculateWinner(newBoard);
      const nextTurn = userId === player1 ? player2 : player1;

      setCurrentMultiplayerTurn(nextTurn);

      if (multiplayerWinner) {
        setWinner(multiplayerWinner);
        playNextLevel();
        triggerConfetti();
        updateBoardState(room.room, newBoard, gameId, null, multiplayerWinner);
        return;
      }

      if (isBoardFull(newBoard)) {
        updateBoardState(room.room, newBoard, gameId, null, null);
        setWinner(null);
        setGameOver(true);
        setTimeout(() => {
          handleRestart();
        }, 2000);
        return;
      }

      updateBoardState(room.room, newBoard, gameId, nextTurn);
    }
  };

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
      playPlaceObject();

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

      const blockingMove = checkForWinOrBlock(player1Symbol.key);
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
          }
          if (
            gameState.current_turn !== undefined &&
            gameState.current_turn !== null
          ) {
            setCurrentMultiplayerTurn(gameState.current_turn);
          }
          if (gameState.winner) {
            setWinner(gameState.winner);
            handleMultiplayerWin(gameState.winner, 'easy');
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
    winner === null && isBoardFull(board)
      ? "It's a Draw!"
      : winner
      ? `${winner} wins!`
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
      <div className={`mq-global-container mq-${currentTurn.toLowerCase()}`}>
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

          {board.map((row, rowIndex) =>
            row.map((cell, colIndex) => (
              <div
                key={`${rowIndex}-${colIndex}`}
                className={`mq-square ${
                  cell
                    ? `mq-${
                        cell === player1Symbol.key
                          ? player1Symbol.key
                          : cell === player2Symbol.key
                          ? player2Symbol.key
                          : 'ice'
                      }`
                    : ''
                }  ${
                  hoveredColumn === colIndex &&
                  rowIndex === getLowestOpenRow(colIndex)
                    ? 'mq-preview' // Ice's turn preview (only in Multiplayer mode)
                    : ''
                } ${
                  (cell === player1Symbol.key && !player1Symbol.display) ||
                  (cell === player2Symbol.key && !player2Symbol.display)
                    ? 'mq-image'
                    : ''
                }`}
                onClick={() => handleClick(colIndex)}
                onMouseEnter={() => setHoveredColumn(colIndex)}
                onMouseLeave={() => setHoveredColumn(null)}
              >
                {cell}
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
    </>
  );
};

export default Game;
