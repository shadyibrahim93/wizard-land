import React, { useState, useEffect } from 'react';
import GameIntro from '../../gameintro';
import Button from '../../../components/Button';
import iceKing from '../../../assets/images/pieces/iceKing.gif';
import fireKing from '../../../assets/images/pieces/fireKing.gif';
import {
  playDefeat,
  playDisappear,
  playNextLevel,
  playUncover,
  playUpgrade,
  playClick,
  playSwallow
} from '../../../hooks/useSound';
import { triggerConfetti } from './../../../hooks/useConfetti';

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
  const [selectedPiece, setSelectedPiece] = useState(null);
  const [board, setBoard] = useState(initialBoard());
  const [currentTurn, setCurrentTurn] = useState('Fire');
  const [gameOver, setGameOver] = useState(false);
  const [winner, setWinner] = useState(null);
  const [startGame, setStartGame] = useState(false);
  const [playerWins, setPlayerWins] = useState(0);
  const [computerWins, setComputerWins] = useState(0);
  const [mode, setMode] = useState(null); // single or multiplayer
  const [mustCapture, setMustCapture] = useState(null); // Track if player must continue capturing
  const [computerChainCapture, setComputerChainCapture] = useState(null);
  const [playerChainCapture, setPlayerChainCapture] = useState(null);
  const [upgradingPieces, setUpgradingPieces] = useState([]); // Track pieces that are upgrading

  const introText = `Welcome to Wizards Land Checkers Game! Play as '🔥', and the computer will play as '❄️'. Take turns moving your pieces into the corresponding box. A helper will show you where the piece can be dropped. Be the first to capture all pieces or block the opponent from making any more and win the game. Good luck!`;

  const isWithinBounds = (row, col) =>
    row >= 0 && row < 8 && col >= 0 && col < 8;

  const clearValidMoves = (b) =>
    b.map((r) => r.map((c) => ({ ...c, validMove: false })));

  const handleGameOver = (winner, playVictorySound, playDefeatSound) => {
    // Play appropriate sound and trigger confetti if necessary
    if (winner === 'Fire') {
      playNextLevel(); // Always play victory sound for Fire player (human)
      triggerConfetti();
      setPlayerWins(playerWins + 1);
      setCurrentTurn('Fire');
    } else {
      setCurrentTurn('Ice');
      // Only play defeat sound in single player mode when computer wins
      if (mode === 'Single') {
        playDefeatSound();
        setComputerWins(computerWins + 1);
      } else {
        // In multiplayer, both players are human so we play victory sound
        playNextLevel();
        setPlayerWins(playerWins + 1); // In multiplayer, this would be Player 2's win
      }
    }
    setWinner(winner);

    setTimeout(() => {
      playUncover();
      setGameOver(true);
    }, 2000);

    setTimeout(() => {
      handleRestart();
      playDisappear();
    }, 5000); // Delay to show the winner before restarting
  };

  const checkGameOver = (b) => {
    const playerCount = b.flat().filter((c) => c.piece === 'Fire').length;
    const computerCount = b.flat().filter((c) => c.piece === 'Ice').length;

    if (playerCount === 0 || !playerHasValidMoves('Fire')) {
      handleGameOver(
        'Ice',
        mode === 'Single' ? playDefeat : playNextLevel, // Use playNextLevel for multiplayer
        mode === 'Single' ? playDefeat : null
      );
    } else if (computerCount === 0 || !playerHasValidMoves('Ice')) {
      handleGameOver(
        'Fire',
        playNextLevel,
        mode === 'Single' ? playDefeat : null // Don't use defeat sound in multiplayer
      );
    }
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

  const playerHasValidMoves = (player) => {
    for (let r = 0; r < 8; r++) {
      for (let c = 0; c < 8; c++) {
        const cell = board[r][c];
        if (cell.piece === player) {
          // Check if this piece has any valid moves
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

          // Check for regular moves
          for (const [dx, dy] of dirs) {
            const nr = r + dx,
              nc = c + dy;
            if (isWithinBounds(nr, nc)) {
              if (!board[nr][nc].piece) {
                return true; // Found at least one valid move
              }
            }
          }

          // Check for capture moves
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
              return true; // Found at least one valid capture
            }
          }
        }
      }
    }
    return false; // No valid moves found
  };

  const movePiece = (sr, sc, er, ec) => {
    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    const piece = newBoard[sr][sc].piece;
    const king = newBoard[sr][sc].king;

    newBoard[er][ec].piece = piece;

    // Check if piece is being promoted to king
    const isPromoted =
      !king &&
      ((piece === 'Fire' && er === 0) || (piece === 'Ice' && er === 7));
    newBoard[er][ec].king = king || isPromoted;
    newBoard[sr][sc].piece = null;
    newBoard[sr][sc].king = false;

    playClick();

    if (isPromoted) {
      playUpgrade();
    }

    if (Math.abs(sr - er) === 2) {
      const cr = (sr + er) / 2,
        cc = (sc + ec) / 2;
      newBoard[cr][cc].piece = null;
      playSwallow();

      const canContinue = checkForAdditionalCaptures(er, ec, newBoard);
      if (canContinue) {
        setBoard(clearValidMoves(newBoard));
        if (mode === 'Single' && piece === 'Ice') {
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

    // Check if the next player has any moves available
    const nextTurn = currentTurn === 'Fire' ? 'Ice' : 'Fire';
    const hasMoves = playerHasValidMoves(nextTurn);

    if (!hasMoves) {
      // Current player wins because opponent can't move
      handleGameOver(
        currentTurn,
        currentTurn === 'Fire' ? playNextLevel : playDefeat,
        currentTurn === 'Fire' ? playDefeat : null
      );
    } else {
      // Continue the game normally
      setCurrentTurn(nextTurn);
      checkGameOver(newBoard);
    }
  };

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

    if (!hasCapture && !mustCapture) {
      dirs.forEach(([dx, dy]) => {
        const nr = r + dx,
          nc = c + dy;
        if (isWithinBounds(nr, nc) && !b[nr][nc].piece)
          newBoard[nr][nc].validMove = true;
      });
    }

    if (hasCapture) {
      newBoard.forEach((r) =>
        r.forEach((c) => {
          if (!c.validMove) c.validMove = false;
        })
      );
    }

    setBoard(newBoard);
  };

  const checkForAnyCaptures = (who) => {
    const opp = who === 'Fire' ? 'Ice' : 'Fire';
    let captureExists = false;

    board.forEach((row, ri) => {
      row.forEach((cell, ci) => {
        if (cell.piece === who) {
          const dirs = cell.king
            ? [
                [-1, -1],
                [-1, 1],
                [1, -1],
                [1, 1]
              ]
            : who === 'Fire'
            ? [
                [-1, -1],
                [-1, 1]
              ]
            : [
                [1, -1],
                [1, 1]
              ];

          dirs.forEach(([dx, dy]) => {
            const nr = ri + dx,
              nc = ci + dy;
            const jr = ri + 2 * dx,
              jc = ci + 2 * dy;
            if (
              isWithinBounds(jr, jc) &&
              board[nr]?.[nc]?.piece === opp &&
              !board[jr][jc].piece
            ) {
              captureExists = true;
            }
          });
        }
      });
    });

    return captureExists;
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

  const handleCellClick = (r, c) => {
    const cell = board[r][c];
    if (gameOver) return;

    // Check if it's the current player's turn
    if (
      (currentTurn === 'Fire' && cell.piece !== 'Fire' && !selectedPiece) ||
      (currentTurn === 'Ice' && cell.piece !== 'Ice' && !selectedPiece)
    ) {
      return;
    }

    // If we have a selected piece and clicked on a valid move
    if (selectedPiece && cell.validMove) {
      movePiece(selectedPiece.row, selectedPiece.col, r, c);
      return;
    }

    // If clicking on own piece during chain capture, allow switching only if it has captures
    if (playerChainCapture && cell.piece === currentTurn) {
      const captureExists = checkForAnyCaptures(currentTurn);
      if (captureExists) {
        const opp = currentTurn === 'Fire' ? 'Ice' : 'Fire';
        const directions = cell.king
          ? [
              [-1, -1],
              [-1, 1],
              [1, -1],
              [1, 1]
            ]
          : currentTurn === 'Fire'
          ? [
              [-1, -1],
              [-1, 1]
            ]
          : [
              [1, -1],
              [1, 1]
            ];

        const canCapture = directions.some(([dx, dy]) => {
          const nr = r + dx,
            nc = c + dy;
          const jr = r + 2 * dx,
            jc = c + 2 * dy;
          return (
            isWithinBounds(jr, jc) &&
            board[nr]?.[nc]?.piece === opp &&
            !board[jr][jc].piece
          );
        });

        if (canCapture) {
          setSelectedPiece({ row: r, col: c });
          setPlayerChainCapture({ row: r, col: c });
          highlightValidMoves(r, c);
          return;
        }
      }
    }

    // Normal piece selection
    if (cell.piece === currentTurn) {
      const captureExists = checkForAnyCaptures(currentTurn);

      // If captures exist, only allow selecting pieces that can capture
      if (captureExists) {
        const opp = currentTurn === 'Fire' ? 'Ice' : 'Fire';
        const directions = cell.king
          ? [
              [-1, -1],
              [-1, 1],
              [1, -1],
              [1, 1]
            ]
          : currentTurn === 'Fire'
          ? [
              [-1, -1],
              [-1, 1]
            ]
          : [
              [1, -1],
              [1, 1]
            ];

        const canCapture = directions.some(([dx, dy]) => {
          const nr = r + dx,
            nc = c + dy;
          const jr = r + 2 * dx,
            jc = c + 2 * dy;
          return (
            isWithinBounds(jr, jc) &&
            board[nr]?.[nc]?.piece === opp &&
            !board[jr][jc].piece
          );
        });
        if (!canCapture) return;
      }

      setSelectedPiece({ row: r, col: c });
      highlightValidMoves(r, c);
    }
  };

  useEffect(() => {
    if (currentTurn === 'Ice' && !gameOver && mode === 'Single') {
      const timer = setTimeout(handleComputerTurn, 400);
      return () => clearTimeout(timer);
    }
  }, [
    currentTurn,
    gameOver,
    mode,
    board,
    computerChainCapture,
    playerChainCapture
  ]);

  const handleRestart = () => {
    setBoard(initialBoard());
    setGameOver(false);
    setWinner(null);
    setCurrentTurn('Fire');
    setSelectedPiece(null);
    setPlayerChainCapture(null);
    setComputerChainCapture(null);
  };

  const resetScore = () => {
    setComputerWins(0);
    setPlayerWins(0);
  };

  return !startGame ? (
    <GameIntro
      introText={introText}
      onStart={() => {
        setMode('Single');
        setStartGame(true);
      }}
      firstButtonText='Single Player'
      onSecondButtonClick={() => {
        setMode('Multiplayer');
        setStartGame(true);
      }}
      secondButtonText='Multiplayer'
    />
  ) : (
    <>
      <div className='mq-global-container'>
        <div className='mq-score-container'>
          <span className='mq-score-player'>Fire: {playerWins}</span>
          {mode === 'Single' ? (
            <span className='mq-score-computer'>Ice: {computerWins}</span>
          ) : (
            <span className='mq-score-computer'>Ice: {playerWins}</span>
          )}
        </div>
        <div className={`mq-board mq-${currentTurn.toLowerCase()}`}>
          {gameOver && <h2 className='mq-ending-title'>{winner} wins!</h2>}

          {board.map((row, r) => (
            <div
              key={r}
              className='mq-row'
            >
              {row.map((cell, c) => (
                <div
                  key={c}
                  className={`mq-square ${!cell.piece ? 'empty' : ''} ${
                    cell.validMove ? 'valid' : ''
                  } ${
                    selectedPiece?.row === r && selectedPiece?.col === c
                      ? 'selected'
                      : ''
                  }`}
                  onClick={() => handleCellClick(r, c)}
                >
                  {cell.piece === 'Fire' &&
                    (cell.king ? (
                      <img
                        className='upgrade'
                        src={fireKing}
                        alt='Fire King'
                      />
                    ) : (
                      '🔥'
                    ))}
                  {cell.piece === 'Ice' &&
                    (cell.king ? (
                      <img
                        className='upgrade'
                        src={iceKing}
                        alt='Ice King'
                      />
                    ) : (
                      '❄️'
                    ))}
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
    </>
  );
};

export default Checkers;
