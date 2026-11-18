import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

export const BOARD_COLS = 10;
export const BOARD_ROWS = 20;

export type TetrominoType = 'I' | 'O' | 'T' | 'S' | 'Z' | 'J' | 'L';
export type CellValue = TetrominoType | null;
export type TetrisBoard = CellValue[][];
export type GameStatus = 'playing' | 'paused' | 'gameover';

export interface ActivePiece {
  type: TetrominoType;
  matrix: number[][];
  x: number;
  y: number;
}

export const TETROMINO_SHAPES: Record<TetrominoType, number[][]> = {
  I: [
    [0, 0, 0, 0],
    [1, 1, 1, 1],
    [0, 0, 0, 0],
    [0, 0, 0, 0],
  ],
  O: [
    [1, 1],
    [1, 1],
  ],
  T: [
    [0, 1, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  S: [
    [0, 1, 1],
    [1, 1, 0],
    [0, 0, 0],
  ],
  Z: [
    [1, 1, 0],
    [0, 1, 1],
    [0, 0, 0],
  ],
  J: [
    [1, 0, 0],
    [1, 1, 1],
    [0, 0, 0],
  ],
  L: [
    [0, 0, 1],
    [1, 1, 1],
    [0, 0, 0],
  ],
};

export const TETROMINO_COLORS: Record<TetrominoType, string> = {
  I: '#22d3ee',
  O: '#facc15',
  T: '#c084fc',
  S: '#4ade80',
  Z: '#f87171',
  J: '#3b82f6',
  L: '#fb923c',
};

const ALL_TYPES: TetrominoType[] = ['I', 'O', 'T', 'S', 'Z', 'J', 'L'];
const LINE_SCORES = [0, 100, 300, 500, 800] as const;

export function createEmptyBoard(): TetrisBoard {
  return Array.from({ length: BOARD_ROWS }, () =>
    Array<CellValue>(BOARD_COLS).fill(null)
  );
}

function createShuffledBag(): TetrominoType[] {
  const bag = [...ALL_TYPES];
  for (let i = bag.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [bag[i], bag[j]] = [bag[j], bag[i]];
  }
  return bag;
}

function cloneMatrix(matrix: number[][]): number[][] {
  return matrix.map((row) => [...row]);
}

function rotateMatrixCW(matrix: number[][]): number[][] {
  const size = matrix.length;
  const rotated = Array.from({ length: size }, () => Array<number>(size).fill(0));
  for (let r = 0; r < size; r++) {
    for (let c = 0; c < size; c++) {
      rotated[c][size - 1 - r] = matrix[r][c];
    }
  }
  return rotated;
}

function spawnPiece(type: TetrominoType): ActivePiece {
  const matrix = cloneMatrix(TETROMINO_SHAPES[type]);
  const x = Math.floor((BOARD_COLS - matrix[0].length) / 2);
  const y = type === 'I' ? -1 : 0;
  return { type, matrix, x, y };
}

export function checkCollision(
  board: TetrisBoard,
  matrix: number[][],
  offsetX: number,
  offsetY: number
): boolean {
  for (let r = 0; r < matrix.length; r++) {
    for (let c = 0; c < matrix[r].length; c++) {
      if (!matrix[r][c]) continue;
      const nx = offsetX + c;
      const ny = offsetY + r;

      if (nx < 0 || nx >= BOARD_COLS || ny >= BOARD_ROWS) {
        return true;
      }
      if (ny >= 0 && board[ny][nx] !== null) {
        return true;
      }
    }
  }
  return false;
}

function mergePieceToBoard(board: TetrisBoard, piece: ActivePiece): TetrisBoard {
  const next = board.map((row) => [...row]);
  for (let r = 0; r < piece.matrix.length; r++) {
    for (let c = 0; c < piece.matrix[r].length; c++) {
      if (!piece.matrix[r][c]) continue;
      const bx = piece.x + c;
      const by = piece.y + r;
      if (by >= 0 && by < BOARD_ROWS && bx >= 0 && bx < BOARD_COLS) {
        next[by][bx] = piece.type;
      }
    }
  }
  return next;
}

function clearCompletedRows(board: TetrisBoard): {
  nextBoard: TetrisBoard;
  clearedCount: number;
} {
  const remaining = board.filter((row) => row.some((cell) => cell === null));
  const clearedCount = BOARD_ROWS - remaining.length;
  if (clearedCount === 0) {
    return { nextBoard: board, clearedCount: 0 };
  }
  const newTopRows = Array.from({ length: clearedCount }, () =>
    Array<CellValue>(BOARD_COLS).fill(null)
  );
  return {
    nextBoard: [...newTopRows, ...remaining],
    clearedCount,
  };
}

/**
 * Custom interval-based game loop hook that avoids stale closures.
 */
export function useGameLoop(callback: () => void, delayMs: number | null) {
  const savedCallback = useRef(callback);

  useEffect(() => {
    savedCallback.current = callback;
  }, [callback]);

  useEffect(() => {
    if (delayMs === null) return;
    const id = window.setInterval(() => {
      savedCallback.current();
    }, delayMs);
    return () => window.clearInterval(id);
  }, [delayMs]);
}

interface EngineState {
  board: TetrisBoard;
  activePiece: ActivePiece;
  nextType: TetrominoType;
  bag: TetrominoType[];
  score: number;
  lines: number;
  level: number;
  status: GameStatus;
}

function createInitialEngineState(): EngineState {
  const bag = createShuffledBag();
  const firstType = bag.pop() as TetrominoType;
  const secondType = bag.pop() as TetrominoType;
  return {
    board: createEmptyBoard(),
    activePiece: spawnPiece(firstType),
    nextType: secondType,
    bag,
    score: 0,
    lines: 0,
    level: 1,
    status: 'playing',
  };
}

export function useTetris() {
  const [engine, setEngine] = useState<EngineState>(createInitialEngineState);
  const [persistedBest, setPersistedBest] = useState<number>(() => {
    try {
      const saved = window.localStorage.getItem('trinity_tetris_best');
      return saved ? Math.max(0, Number(saved) || 0) : 0;
    } catch {
      return 0;
    }
  });

  const highScore = Math.max(persistedBest, engine.score);

  useEffect(() => {
    if (engine.score > persistedBest) {
      try {
        window.localStorage.setItem('trinity_tetris_best', String(engine.score));
      } catch {
        // Ignore storage quota errors
      }
    }
  }, [engine.score, persistedBest]);

  const lockPieceAndAdvance = useCallback(
    (prev: EngineState, settledPiece: ActivePiece, bonusPoints = 0): EngineState => {
      // If any block locked above the visible ceiling, end the game
      const toppedOut = settledPiece.matrix.some((row, r) =>
        row.some((cell) => cell !== 0 && settledPiece.y + r < 0)
      );

      const merged = mergePieceToBoard(prev.board, settledPiece);
      const { nextBoard, clearedCount } = clearCompletedRows(merged);
      const nextLines = prev.lines + clearedCount;
      const nextLevel = Math.floor(nextLines / 10) + 1;
      const linePoints = (LINE_SCORES[clearedCount] ?? 800) * prev.level;
      const nextScore = prev.score + linePoints + bonusPoints;

      const workingBag = prev.bag.length > 0 ? [...prev.bag] : createShuffledBag();
      const upcomingNextType = workingBag.pop() as TetrominoType;
      const spawned = spawnPiece(prev.nextType);

      // Adjust spawn down 1 row if I-piece at -1 collides only with ceiling-free space, or test gameover
      const spawnBlocked =
        toppedOut || checkCollision(nextBoard, spawned.matrix, spawned.x, spawned.y);

      return {
        board: nextBoard,
        activePiece: spawned,
        nextType: upcomingNextType,
        bag: workingBag,
        score: nextScore,
        lines: nextLines,
        level: nextLevel,
        status: spawnBlocked ? 'gameover' : 'playing',
      };
    },
    []
  );

  const moveLeft = useCallback(() => {
    setEngine((prev) => {
      if (prev.status !== 'playing') return prev;
      const nextX = prev.activePiece.x - 1;
      if (checkCollision(prev.board, prev.activePiece.matrix, nextX, prev.activePiece.y)) {
        return prev;
      }
      return {
        ...prev,
        activePiece: { ...prev.activePiece, x: nextX },
      };
    });
  }, []);

  const moveRight = useCallback(() => {
    setEngine((prev) => {
      if (prev.status !== 'playing') return prev;
      const nextX = prev.activePiece.x + 1;
      if (checkCollision(prev.board, prev.activePiece.matrix, nextX, prev.activePiece.y)) {
        return prev;
      }
      return {
        ...prev,
        activePiece: { ...prev.activePiece, x: nextX },
      };
    });
  }, []);

  const moveDown = useCallback(() => {
    setEngine((prev) => {
      if (prev.status !== 'playing') return prev;
      const nextY = prev.activePiece.y + 1;
      if (!checkCollision(prev.board, prev.activePiece.matrix, prev.activePiece.x, nextY)) {
        return {
          ...prev,
          activePiece: { ...prev.activePiece, y: nextY },
        };
      }
      return lockPieceAndAdvance(prev, prev.activePiece);
    });
  }, [lockPieceAndAdvance]);

  const rotate = useCallback(() => {
    setEngine((prev) => {
      if (prev.status !== 'playing' || prev.activePiece.type === 'O') return prev;
      const rotated = rotateMatrixCW(prev.activePiece.matrix);
      const wallKicks = [0, -1, 1, -2, 2];

      for (const kickX of wallKicks) {
        if (!checkCollision(prev.board, rotated, prev.activePiece.x + kickX, prev.activePiece.y)) {
          return {
            ...prev,
            activePiece: {
              ...prev.activePiece,
              matrix: rotated,
              x: prev.activePiece.x + kickX,
            },
          };
        }
      }
      return prev;
    });
  }, []);

  const hardDrop = useCallback(() => {
    setEngine((prev) => {
      if (prev.status !== 'playing') return prev;
      let dropY = prev.activePiece.y;
      while (!checkCollision(prev.board, prev.activePiece.matrix, prev.activePiece.x, dropY + 1)) {
        dropY += 1;
      }
      const distance = Math.max(0, dropY - prev.activePiece.y);
      return lockPieceAndAdvance(
        prev,
        { ...prev.activePiece, y: dropY },
        distance * 2
      );
    });
  }, [lockPieceAndAdvance]);

  const togglePause = useCallback(() => {
    setEngine((prev) => {
      if (prev.status === 'gameover') return prev;
      return {
        ...prev,
        status: prev.status === 'playing' ? 'paused' : 'playing',
      };
    });
  }, []);

  const restart = useCallback(() => {
    setPersistedBest((prev) => Math.max(prev, engine.score));
    setEngine(createInitialEngineState());
  }, [engine.score]);

  const tickRateMs =
    engine.status === 'playing' ? Math.max(110, 720 - (engine.level - 1) * 55) : null;

  useGameLoop(moveDown, tickRateMs);

  const ghostY = useMemo(() => {
    let y = engine.activePiece.y;
    while (!checkCollision(engine.board, engine.activePiece.matrix, engine.activePiece.x, y + 1)) {
      y += 1;
    }
    return y;
  }, [engine.board, engine.activePiece]);

  return {
    board: engine.board,
    activePiece: engine.activePiece,
    nextType: engine.nextType,
    ghostY,
    score: engine.score,
    highScore,
    lines: engine.lines,
    level: engine.level,
    status: engine.status,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    togglePause,
    restart,
  };
}
