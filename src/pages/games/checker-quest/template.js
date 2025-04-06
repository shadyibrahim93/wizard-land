import React, { useState, useEffect } from 'react';
import GameIntro from '../../gameintro';
import Button from '../../../components/Button';
import iceKing from '../../../assets/images/pieces/iceKing.gif';
import fireKing from '../../../assets/images/pieces/fireKing.gif';

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

  const introText = `Welcome to Wizards Land Checkers Game! Play as '🔥', and the computer will play as '❄️'. Take turns moving your pieces into the corresponding box. A helper will show you where the piece can be dropped. Be the first to capture all pieces or block the opponent from making any more and win the game. Good luck!`;

  const isWithinBounds = (row, col) =>
    row >= 0 && row < 8 && col >= 0 && col < 8;

  const clearValidMoves = (b) =>
    b.map((r) => r.map((c) => ({ ...c, validMove: false })));

  const checkGameOver = (b) => {
    const player = b.flat().filter((c) => c.piece === 'Fire').length;
    const computer = b.flat().filter((c) => c.piece === 'Ice').length;
    if (player === 0) {
      setWinner('Ice');
      setComputerWins(computerWins + 1);
      setGameOver(true);
      setTimeout(() => handleRestart(), 2000); // Delay to show the winner before restarting
    } else if (computer === 0) {
      setWinner('Fire');
      setPlayerWins(playerWins + 1);
      setGameOver(true);
      setTimeout(() => handleRestart(), 2000); // Delay to show the winner before restarting
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

  const movePiece = (sr, sc, er, ec) => {
    const newBoard = board.map((r) => r.map((c) => ({ ...c })));
    const piece = newBoard[sr][sc].piece;
    const king = newBoard[sr][sc].king;

    newBoard[er][ec].piece = piece;
    newBoard[er][ec].king =
      king || (piece === 'Fire' && er === 0) || (piece === 'Ice' && er === 7);
    newBoard[sr][sc].piece = null;
    newBoard[sr][sc].king = false;

    if (Math.abs(sr - er) === 2) {
      const cr = (sr + er) / 2,
        cc = (sc + ec) / 2;
      newBoard[cr][cc].piece = null;

      const canContinue = checkForAdditionalCaptures(er, ec, newBoard);
      if (canContinue) {
        setBoard(clearValidMoves(newBoard));
        if (piece === 'Ice') {
          setComputerChainCapture({ row: er, col: ec });
        } else {
          setSelectedPiece({ row: er, col: ec });
          setPlayerChainCapture({ row: er, col: ec }); // Track player's chain capture
        }
        highlightValidMoves(er, ec, newBoard);
        return;
      }
    }

    setBoard(clearValidMoves(newBoard));
    setSelectedPiece(null);
    setPlayerChainCapture(null); // Reset player chain capture if no more captures
    setComputerChainCapture(null);
    checkGameOver(newBoard);
    setCurrentTurn(currentTurn === 'Fire' ? 'Ice' : 'Fire');
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
          captureMoves.push({ from: { r: row, c: col }, to: { r: jr, c: jc } });
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
  };

  const findAdditionalCaptures = (r, c, b, player) => {
    const opp = player === 'Fire' ? 'Ice' : 'Fire';
    const cell = b[r][c];
    const sequences = [];

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

      if (
        isWithinBounds(jr, jc) &&
        b[nr]?.[nc]?.piece === opp &&
        !b[jr][jc].piece
      ) {
        // Simulate this capture
        const simulatedBoard = JSON.parse(JSON.stringify(b));
        simulatedBoard[jr][jc] = { ...simulatedBoard[r][c] };
        simulatedBoard[r][c] = { piece: null, king: false, validMove: false };
        simulatedBoard[(r + jr) / 2][(c + jc) / 2] = {
          piece: null,
          king: false,
          validMove: false
        };

        const sequence = [{ from: { r, c }, to: { r: jr, c: jc } }];
        const additionalCaptures = findAdditionalCaptures(
          jr,
          jc,
          simulatedBoard,
          player
        );
        if (additionalCaptures.length > 0) {
          sequence.push(...additionalCaptures);
        }
        sequences.push(sequence);
      }
    }

    if (sequences.length === 0) return [];

    // Return the sequence with most captures
    sequences.sort((a, b) => b.length - a.length);
    return sequences[0];
  };

  const handleCellClick = (r, c) => {
    const cell = board[r][c];
    if (gameOver || currentTurn !== 'Fire') return;

    // If player must continue capturing, only allow moves from that piece
    if (
      playerChainCapture &&
      (r !== playerChainCapture.row || c !== playerChainCapture.col)
    ) {
      return;
    }

    const captureExists = checkForAnyCaptures('Fire');

    // If the player has no captures to make, proceed with regular move
    if (!captureExists && selectedPiece && cell.validMove) {
      movePiece(selectedPiece.row, selectedPiece.col, r, c);
      return;
    }

    // If a player piece is selected, handle the click and highlight valid moves
    if (cell.piece === 'Fire') {
      // If captures exist, only allow selecting pieces that can capture
      if (captureExists) {
        const directions = cell.king
          ? [
              [-1, -1],
              [-1, 1],
              [1, -1],
              [1, 1]
            ]
          : [
              [-1, -1],
              [-1, 1]
            ];

        const canCapture = directions.some(([dx, dy]) => {
          const nr = r + dx,
            nc = c + dy;
          const jr = r + 2 * dx,
            jc = c + 2 * dy;
          return (
            isWithinBounds(jr, jc) &&
            board[nr]?.[nc]?.piece === 'Ice' &&
            !board[jr][jc].piece
          );
        });
        if (!canCapture) return;
      }

      setSelectedPiece({ row: r, col: c });
      highlightValidMoves(r, c);
    } else if (selectedPiece && cell.validMove) {
      movePiece(selectedPiece.row, selectedPiece.col, r, c);
      return;
    }

    // Check for chain capture if player has made a capture move
    if (selectedPiece && captureExists) {
      const { row, col } = selectedPiece;
      const captureMoves = [];
      const dirs = cell.king
        ? [
            [-1, -1],
            [-1, 1],
            [1, -1],
            [1, 1]
          ]
        : [
            [-1, -1],
            [-1, 1]
          ];

      // Find all possible continuation captures
      for (const [dx, dy] of dirs) {
        const nr = row + dx,
          nc = col + dy;
        const jr = row + 2 * dx,
          jc = col + 2 * dy;

        if (
          isWithinBounds(jr, jc) &&
          board[nr]?.[nc]?.piece === 'Ice' &&
          !board[jr][jc].piece
        ) {
          captureMoves.push({ from: { r: row, c: col }, to: { r: jr, c: jc } });
        }
      }

      // If there are captures to make, force the player to make one
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
        if (!captureMoves) {
          setPlayerChainCapture(null);
          setCurrentTurn('Ice');
        }
      }
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
    setCurrentTurn(winner);
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
      <div className={`mq-global-container`}>
        <div className='mq-score-container'>
          <span className='mq-score-player'>Fire: {playerWins}</span>
          <span className='mq-score-computer'>Ice: {computerWins}</span>
        </div>
        <div className='mq-board'>
          {gameOver && <h2 className='mq-ending-title'>{winner} wins!</h2>}

          {board.map((row, r) => (
            <div
              key={r}
              className='mq-row'
            >
              {row.map((cell, c) => (
                <div
                  key={c}
                  className={`mq-square ${cell.validMove ? 'valid' : ''}`}
                  onClick={() => handleCellClick(r, c)}
                >
                  {cell.piece === 'Fire' &&
                    (cell.king ? <img src={fireKing} /> : '🔥')}
                  {cell.piece === 'Ice' &&
                    (cell.king ? <img src={iceKing} /> : '❄️')}
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
