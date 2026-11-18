import { useCallback, useState } from 'react';

export const GRID_SIZE_2048 = 4;

export type SwipeDirection = 'up' | 'down' | 'left' | 'right';
export type Game2048Status = 'playing' | 'won' | 'gameover';

export interface Tile2048 {
  id: number;
  value: number;
  row: number;
  col: number;
  isNew?: boolean;
  justMerged?: boolean;
}

export type Matrix2048 = number[][];

let nextTileUid = 1;

function allocateTileId(): number {
  const id = nextTileUid;
  nextTileUid += 1;
  return id;
}

function buildMatrixFromTiles(tiles: Tile2048[]): Matrix2048 {
  const matrix = Array.from({ length: GRID_SIZE_2048 }, () =>
    Array<number>(GRID_SIZE_2048).fill(0)
  );
  for (const tile of tiles) {
    matrix[tile.row][tile.col] = tile.value;
  }
  return matrix;
}

function findEmptyCells(tiles: Tile2048[]): { row: number; col: number }[] {
  const occupied = new Set(tiles.map((t) => `${t.row}-${t.col}`));
  const empty: { row: number; col: number }[] = [];
  for (let r = 0; r < GRID_SIZE_2048; r++) {
    for (let c = 0; c < GRID_SIZE_2048; c++) {
      if (!occupied.has(`${r}-${c}`)) {
        empty.push({ row: r, col: c });
      }
    }
  }
  return empty;
}

function spawnRandomTile(tiles: Tile2048[]): Tile2048 | null {
  const empty = findEmptyCells(tiles);
  if (empty.length === 0) return null;
  const pick = empty[Math.floor(Math.random() * empty.length)];
  const value = Math.random() < 0.9 ? 2 : 4;
  return {
    id: allocateTileId(),
    value,
    row: pick.row,
    col: pick.col,
    isNew: true,
    justMerged: false,
  };
}

function hasValidMoves(tiles: Tile2048[]): boolean {
  if (tiles.length < GRID_SIZE_2048 * GRID_SIZE_2048) return true;
  const matrix = buildMatrixFromTiles(tiles);

  for (let r = 0; r < GRID_SIZE_2048; r++) {
    for (let c = 0; c < GRID_SIZE_2048; c++) {
      const val = matrix[r][c];
      if (r + 1 < GRID_SIZE_2048 && matrix[r + 1][c] === val) return true;
      if (c + 1 < GRID_SIZE_2048 && matrix[r][c + 1] === val) return true;
    }
  }

  return false;
}

interface Game2048Snapshot {
  tiles: Tile2048[];
  matrix: Matrix2048;
  score: number;
  status: Game2048Status;
  hasContinuedAfterWin: boolean;
}

function createInitialGame(): Game2048Snapshot {
  const tiles: Tile2048[] = [];
  const first = spawnRandomTile(tiles);
  if (first) tiles.push(first);
  const second = spawnRandomTile(tiles);
  if (second) tiles.push(second);

  return {
    tiles,
    matrix: buildMatrixFromTiles(tiles),
    score: 0,
    status: 'playing',
    hasContinuedAfterWin: false,
  };
}

function slideAndMergeLine(
  orderedTiles: Tile2048[],
  getTargetCoords: (slotIndex: number) => { row: number; col: number }
): {
  nextLineTiles: Tile2048[];
  pointsEarned: number;
  moved: boolean;
  reached2048: boolean;
} {
  const nextLineTiles: Tile2048[] = [];
  let pointsEarned = 0;
  let moved = false;
  let reached2048 = false;
  let targetSlot = 0;
  let i = 0;

  while (i < orderedTiles.length) {
    const first = orderedTiles[i];
    const second = orderedTiles[i + 1];
    const dest = getTargetCoords(targetSlot);

    if (second && first.value === second.value) {
      const mergedValue = first.value * 2;
      pointsEarned += mergedValue;
      moved = true;
      if (mergedValue === 2048) {
        reached2048 = true;
      }
      // Keep incoming sliding tile id so Framer Motion animates it into the target slot
      nextLineTiles.push({
        id: second.id,
        value: mergedValue,
        row: dest.row,
        col: dest.col,
        isNew: false,
        justMerged: true,
      });
      i += 2;
    } else {
      if (first.row !== dest.row || first.col !== dest.col) {
        moved = true;
      }
      nextLineTiles.push({
        id: first.id,
        value: first.value,
        row: dest.row,
        col: dest.col,
        isNew: false,
        justMerged: false,
      });
      i += 1;
    }

    targetSlot += 1;
  }

  return { nextLineTiles, pointsEarned, moved, reached2048 };
}

export function useGame2048() {
  const [game, setGame] = useState<Game2048Snapshot>(createInitialGame);
  const [bestScore, setBestScore] = useState<number>(() => {
    try {
      const saved = window.localStorage.getItem('trinity_2048_best');
      const parsed = saved ? Number(saved) : 0;
      return Number.isFinite(parsed) && parsed > 0 ? parsed : 0;
    } catch {
      return 0;
    }
  });

  const move = useCallback((direction: SwipeDirection) => {
    setGame((prev) => {
      if (prev.status !== 'playing') return prev;

      const collectedTiles: Tile2048[] = [];
      let totalPoints = 0;
      let anyMoved = false;
      let anyReached2048 = false;

      for (let lineIdx = 0; lineIdx < GRID_SIZE_2048; lineIdx++) {
        let lineTiles: Tile2048[] = [];

        if (direction === 'left' || direction === 'right') {
          lineTiles = prev.tiles
            .filter((t) => t.row === lineIdx)
            .sort((a, b) => (direction === 'left' ? a.col - b.col : b.col - a.col));
        } else {
          lineTiles = prev.tiles
            .filter((t) => t.col === lineIdx)
            .sort((a, b) => (direction === 'up' ? a.row - b.row : b.row - a.row));
        }

        const result = slideAndMergeLine(lineTiles, (slot) => {
          if (direction === 'left') return { row: lineIdx, col: slot };
          if (direction === 'right') return { row: lineIdx, col: GRID_SIZE_2048 - 1 - slot };
          if (direction === 'up') return { row: slot, col: lineIdx };
          return { row: GRID_SIZE_2048 - 1 - slot, col: lineIdx };
        });

        collectedTiles.push(...result.nextLineTiles);
        totalPoints += result.pointsEarned;
        if (result.moved) anyMoved = true;
        if (result.reached2048) anyReached2048 = true;
      }

      if (!anyMoved) return prev;

      const spawned = spawnRandomTile(collectedTiles);
      const nextTiles = spawned ? [...collectedTiles, spawned] : collectedTiles;
      const nextScore = prev.score + totalPoints;

      setBestScore((currentBest) => {
        const updated = Math.max(currentBest, nextScore);
        if (updated > currentBest) {
          try {
            window.localStorage.setItem('trinity_2048_best', String(updated));
          } catch {
            // Ignore storage quota errors
          }
        }
        return updated;
      });

      const wonNow = !prev.hasContinuedAfterWin && anyReached2048;
      const nextStatus: Game2048Status = wonNow
        ? 'won'
        : hasValidMoves(nextTiles)
          ? 'playing'
          : 'gameover';

      return {
        tiles: nextTiles,
        matrix: buildMatrixFromTiles(nextTiles),
        score: nextScore,
        status: nextStatus,
        hasContinuedAfterWin: prev.hasContinuedAfterWin,
      };
    });
  }, []);

  const continueAfterWin = useCallback(() => {
    setGame((prev) => ({
      ...prev,
      status: hasValidMoves(prev.tiles) ? 'playing' : 'gameover',
      hasContinuedAfterWin: true,
    }));
  }, []);

  const restart = useCallback(() => {
    setGame(createInitialGame());
  }, []);

  return {
    tiles: game.tiles,
    matrix: game.matrix,
    score: game.score,
    bestScore,
    status: game.status,
    move,
    continueAfterWin,
    restart,
  };
}
