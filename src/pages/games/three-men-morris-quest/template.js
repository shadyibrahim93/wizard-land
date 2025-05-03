import React, { useState, useEffect, useRef } from 'react';
import { useBeforeUnload } from 'react-router-dom';
import GameIntro from '../../gameFlow/gameintro';
import {
  playUncover,
  playDisappear,
  playPieceSound,
  playNextLevel,
  playDefeat
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
    Array(3)
      .fill(null)
      .map(() => Array(3).fill(null))
  );
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [showTitle, setShowTitle] = useState(false);
  const [currentTurn, setCurrentTurn] = useState('Fire');
  const [gameMode, setGameMode] = useState('Single');
  const [currentMultiplayerTurn, setCurrentMultiplayerTurn] = useState(null);
  const [computerStarts, setComputerStarts] = useState(false);
  const [gameId, setGameId] = useState(5);
  const [player1, setPlayer1] = useState(null);
  const [player2, setPlayer2] = useState(null);
  const [room, setRoom] = useState(null);
  const [opponentJoined, setOpponentJoined] = useState(false);
  const [opponentWins, setOpponentWins] = useState(0);
  const [channels, setChannels] = useState([]);
  const { userId } = useUser();
  const player1Symbol = useSelectedPiece(player1 || userId, '🔥', 'fire');
  const player2Symbol = useSelectedPiece(player2, '❄️', 'ice');
  const [winnerName, setWinnerName] = useState('');
  const [showCoinAnimation, setShowCoinAnimation] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [myChoice, setMyChoice] = useState(null);
  const [oppChoice, setOppChoice] = useState(null);
  const navigate = useNavigate();
  const [isConfirmationModalOpen, setIsConfirmationModalOpen] = useState(false);
  const [phase, setPhase] = useState('placement');
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [piecesPlaced, setPiecesPlaced] = useState({ fire: 0, ice: 0 });

  const introText = `Welcome to Three Men's Morris! Place your three pieces strategically, then move them to form a line of three. First to create a mill (horizontal, vertical, or diagonal) wins!`;

  // Multiplayer subscription handlers
  useEffect(() => {
    if (!room?.room) return;

    const subscription = subscribeToThumbs(room.room, ({ user_id, choice }) => {
      if (user_id === userId) {
        setMyChoice(choice);
      } else {
        setOppChoice(choice);
      }
    });

    return () => supabase.realtime.removeChannel(subscription);
  }, [room, userId]);

  useEffect(() => {
    if (myChoice && oppChoice) {
      if (myChoice === 'up' && oppChoice === 'up') {
        handleRestart();
        setShowModal(false);
      } else {
        handleQuit();
        setShowModal(false);
      }
      setMyChoice(null);
      setOppChoice(null);
    }
  }, [myChoice, oppChoice]);

  const calculateWinner = (board) => {
    // Check rows
    for (let row = 0; row < 3; row++) {
      if (
        board[row][0] &&
        board[row][0] === board[row][1] &&
        board[row][0] === board[row][2]
      ) {
        return board[row][0];
      }
    }

    // Check columns
    for (let col = 0; col < 3; col++) {
      if (
        board[0][col] &&
        board[0][col] === board[1][col] &&
        board[0][col] === board[2][col]
      ) {
        return board[0][col];
      }
    }

    // Check diagonals
    if (
      board[0][0] &&
      board[0][0] === board[1][1] &&
      board[0][0] === board[2][2]
    ) {
      return board[0][0];
    }

    if (
      board[0][2] &&
      board[0][2] === board[1][1] &&
      board[0][2] === board[2][0]
    ) {
      return board[0][2];
    }

    return null;
  };

  const isBoardFull = () =>
    board.every((row) => row.every((cell) => cell !== null));

  const handleCellClick = async (row, col) => {
    if (
      gameOver ||
      (gameMode === 'Multiplayer' && currentMultiplayerTurn !== userId)
    )
      return;

    if (phase === 'placement') {
      if (board[row][col]) return;

      const newBoard = board.map((row) => [...row]);
      const playerSymbol =
        gameMode === 'Single'
          ? currentTurn === 'Fire'
            ? userId
            : 'Ice'
          : userId === player1
          ? player1
          : player2;

      newBoard[row][col] = playerSymbol;
      setBoard(newBoard);

      const winner = calculateWinner(newBoard);
      if (winner) {
        handleGameEnd(winner, newBoard);
        return;
      }

      // Update placement counts
      const newPieces = { ...piecesPlaced };
      newPieces[
        gameMode === 'Single'
          ? currentTurn.toLowerCase()
          : userId === player1
          ? 'fire'
          : 'ice'
      ]++;
      setPiecesPlaced(newPieces);

      // Check phase transition
      if (Object.values(newPieces).reduce((a, b) => a + b) === 6) {
        setPhase('movement');
      }

      if (gameMode === 'Multiplayer') {
        const nextTurn = userId === player1 ? player2 : player1;
        await updateBoardState(room.room, newBoard, gameId, nextTurn, null, {
          phase:
            Object.values(newPieces).reduce((a, b) => a + b) === 6
              ? 'movement'
              : 'placement',
          piecesPlaced: newPieces
        });
        setCurrentMultiplayerTurn(nextTurn);
      } else {
        setCurrentTurn(currentTurn === 'Fire' ? 'Ice' : 'Fire');
        if (currentTurn === 'Ice') handleComputerPlacement(newBoard);
      }
    } else {
      // Movement phase
      if (!selectedPiece) {
        // Select piece
        if (
          board[row][col] === (gameMode === 'Single' ? currentTurn : userId)
        ) {
          setSelectedPiece([row, col]);
        }
      } else {
        // Move piece
        const [selectedRow, selectedCol] = selectedPiece;
        const isAdjacent =
          Math.abs(row - selectedRow) <= 1 && Math.abs(col - selectedCol) <= 1;

        if (isAdjacent && !board[row][col]) {
          const newBoard = board.map((row) => [...row]);
          const playerSymbol = newBoard[selectedRow][selectedCol];
          newBoard[selectedRow][selectedCol] = null;
          newBoard[row][col] = playerSymbol;
          setBoard(newBoard);

          const winner = calculateWinner(newBoard);
          if (winner) {
            handleGameEnd(winner, newBoard);
          } else if (gameMode === 'Multiplayer') {
            const nextTurn = userId === player1 ? player2 : player1;
            await updateBoardState(room.room, newBoard, gameId, nextTurn);
            setCurrentMultiplayerTurn(nextTurn);
          } else {
            setCurrentTurn(currentTurn === 'Fire' ? 'Ice' : 'Fire');
            setTimeout(() => handleComputerMove(newBoard), 1000);
          }
        }
        setSelectedPiece(null);
      }
    }
  };

  const handleGameEnd = (winner, board) => {
    setWinner(winner);
    setGameOver(true);

    if (gameMode === 'Multiplayer') {
      updateBoardState(room.room, board, gameId, null, winner);
      handleMultiplayerWin(winner, 'three-mens-morris');
    }

    if (winner === userId || winner === 'Fire') {
      playNextLevel();
      triggerConfetti();
    } else {
      playDefeat();
    }

    setTimeout(() => {
      if (gameMode === 'Multiplayer') setShowModal(true);
      else handleRestart();
    }, 3500);
  };

  // Computer AI Logic
  const handleComputerPlacement = (currentBoard) => {
    const emptyCells = [];
    for (let row = 0; row < 3; row++) {
      for (let col = 0; col < 3; col++) {
        if (!currentBoard[row][col]) emptyCells.push({ row, col });
      }
    }

    const randomCell =
      emptyCells[Math.floor(Math.random() * emptyCells.length)];
    const newBoard = currentBoard.map((row) => [...row]);
    newBoard[randomCell.row][randomCell.col] = 'Ice';
    setBoard(newBoard);

    const newPieces = { ...piecesPlaced, ice: piecesPlaced.ice + 1 };
    setPiecesPlaced(newPieces);

    if (newPieces.fire + newPieces.ice === 6) {
      setPhase('movement');
    }
    setCurrentTurn('Fire');
  };

  const handleComputerMove = (currentBoard) => {
    const icePieces = [];
    currentBoard.forEach((row, r) =>
      row.forEach((cell, c) => {
        if (cell === 'Ice') icePieces.push([r, c]);
      })
    );

    const possibleMoves = [];
    icePieces.forEach(([r, c]) => {
      [
        [r - 1, c],
        [r + 1, c],
        [r, c - 1],
        [r, c + 1]
      ].forEach(([nr, nc]) => {
        if (nr >= 0 && nr < 3 && nc >= 0 && nc < 3 && !currentBoard[nr][nc]) {
          possibleMoves.push({ from: [r, c], to: [nr, nc] });
        }
      });
    });

    if (possibleMoves.length === 0) {
      setGameOver(true);
      setWinner('Fire');
      return;
    }

    const randomMove =
      possibleMoves[Math.floor(Math.random() * possibleMoves.length)];
    const newBoard = currentBoard.map((row) => [...row]);
    newBoard[randomMove.from[0]][randomMove.from[1]] = null;
    newBoard[randomMove.to[0]][randomMove.to[1]] = 'Ice';
    setBoard(newBoard);

    const winner = calculateWinner(newBoard);
    if (winner) setWinner(winner);
    else setCurrentTurn('Fire');
  };

  // Multiplayer Board Updates
  useEffect(() => {
    if (!room?.room) return;

    const boardChannel = subscribeToBoardUpdates(room.room, (gameState) => {
      if (gameState.board_state) {
        setBoard(gameState.board_state);
        setPhase(gameState.phase || 'placement');
        setPiecesPlaced(gameState.piecesPlaced || { fire: 0, ice: 0 });
      }
      if (gameState.current_turn)
        setCurrentMultiplayerTurn(gameState.current_turn);
      if (gameState.winner) {
        setWinner(gameState.winner);
        setGameOver(true);
      }
    });

    return () => supabase.realtime.removeChannel(boardChannel);
  }, [room]);

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

  const resetScore = () => {
    setComputerWins(0);
    setPlayerWins(0);
  };

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
      <div className={`mq-global-container three-mens-morris`}>
        <div className='mq-score-container'>
          <span className='mq-score-player'>Fire: {playerWins}</span>
          <span className='mq-room-number'>
            {room && room.room} {room && room.password && `- ${room.password}`}
          </span>
          <span className='mq-score-computer'>
            Ice: {gameMode === 'Multiplayer' ? opponentWins : computerWins}
          </span>
        </div>
        <div
          className={`mq-board ${
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
              {winner
                ? gameMode === 'Multiplayer'
                  ? `${winnerName} wins!`
                  : `${winner} wins!`
                : "It's a Draw!"}
            </h1>
          )}

          {board.map((row, rowIndex) => (
            <div
              key={rowIndex}
              className='mq-row'
            >
              {row.map((cell, colIndex) => {
                const isSelected =
                  selectedPiece?.[0] === rowIndex &&
                  selectedPiece?.[1] === colIndex;
                const isFire =
                  cell === (gameMode === 'Multiplayer' ? userId : 'Fire');
                const cellClass = cell ? `mq-${isFire ? 'fire' : 'ice'}` : '';

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`mq-square ${cellClass} ${
                      isSelected ? 'selected' : ''
                    }`}
                    onClick={() => handleCellClick(rowIndex, colIndex)}
                  >
                    {cell &&
                      (gameMode === 'Single'
                        ? cell === userId
                          ? player1Symbol.display
                          : '❄️'
                        : cell)}
                  </div>
                );
              })}
            </div>
          ))}
        </div>
      </div>

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

      <Button
        text='Reset Score'
        onClick={resetScore}
        className='mq-reset-button'
      />
    </>
  );
};

export default Game;
