import { useCallback, useEffect, useState } from 'react';

export const MINE_GRID_ROWS = 10;
export const MINE_GRID_COLS = 10;
export const MINE_BOMB_COUNT = 10;

export interface MinesweeperCell {
  isBomb: boolean;
  isRevealed: boolean;
  isFlagged: boolean;
  neighborBombs: number;
}

export type MinesweeperGrid = MinesweeperCell[][];
export type MinesweeperStatus = 'idle' | 'playing' | 'won' | 'lost';

const DIRECTIONS = [
  [-1, -1],
  [-1, 0],
  [-1, 1],
  [0, -1],
  [0, 1],
  [1, -1],
  [1, 0],
  [1, 1],
] as const;

function cloneGrid(grid: MinesweeperGrid): MinesweeperGrid {
  return grid.map((row) => row.map((cell) => ({ ...cell })));
}

function recalculateNeighborCounts(grid: MinesweeperGrid): void {
  const rows = grid.length;
  const cols = grid[0].length;

  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      if (grid[r][c].isBomb) {
        grid[r][c].neighborBombs = 0;
        continue;
      }
      let count = 0;
      for (const [dr, dc] of DIRECTIONS) {
        const nr = r + dr;
        const nc = c + dc;
        if (nr >= 0 && nr < rows && nc >= 0 && nc < cols && grid[nr][nc].isBomb) {
          count += 1;
        }
      }
      grid[r][c].neighborBombs = count;
    }
  }
}

export function createMinesweeperGrid(
  rows = MINE_GRID_ROWS,
  cols = MINE_GRID_COLS,
  bombCount = MINE_BOMB_COUNT
): MinesweeperGrid {
  const grid: MinesweeperGrid = Array.from({ length: rows }, () =>
    Array.from({ length: cols }, () => ({
      isBomb: false,
      isRevealed: false,
      isFlagged: false,
      neighborBombs: 0,
    }))
  );

  // Shuffle linear indices to place exactly `bombCount` unique bombs
  const totalCells = rows * cols;
  const indices = Array.from({ length: totalCells }, (_, i) => i);
  for (let i = indices.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [indices[i], indices[j]] = [indices[j], indices[i]];
  }

  for (let i = 0; i < Math.min(bombCount, totalCells); i++) {
    const idx = indices[i];
    const r = Math.floor(idx / cols);
    const c = idx % cols;
    grid[r][c].isBomb = true;
  }

  recalculateNeighborCounts(grid);
  return grid;
}

/**
 * Recursive flood-fill reveal starting at (row, col).
 * Automatically expands across all connected cells with 0 neighboring bombs.
 */
function floodFillReveal(grid: MinesweeperGrid, row: number, col: number): void {
  if (row < 0 || row >= grid.length || col < 0 || col >= grid[0].length) {
    return;
  }

  const cell = grid[row][col];
  if (cell.isRevealed || cell.isFlagged || cell.isBomb) {
    return;
  }

  cell.isRevealed = true;

  if (cell.neighborBombs === 0) {
    for (const [dr, dc] of DIRECTIONS) {
      floodFillReveal(grid, row + dr, col + dc);
    }
  }
}

function checkAllBombsFlaggedCorrectly(grid: MinesweeperGrid): boolean {
  let bombTotal = 0;
  let flaggedCorrect = 0;

  for (const row of grid) {
    for (const cell of row) {
      if (cell.isBomb) {
        bombTotal += 1;
        if (cell.isFlagged) flaggedCorrect += 1;
      } else if (cell.isFlagged) {
        return false;
      }
    }
  }

  return bombTotal > 0 && flaggedCorrect === bombTotal;
}

function checkAllSafeCellsRevealed(grid: MinesweeperGrid): boolean {
  for (const row of grid) {
    for (const cell of row) {
      if (!cell.isBomb && !cell.isRevealed) {
        return false;
      }
    }
  }
  return true;
}

interface GameSnapshot {
  grid: MinesweeperGrid;
  status: MinesweeperStatus;
  explodedCell: { row: number; col: number } | null;
  hasInteracted: boolean;
}

function createInitialSnapshot(): GameSnapshot {
  return {
    grid: createMinesweeperGrid(),
    status: 'idle',
    explodedCell: null,
    hasInteracted: false,
  };
}

export function useMinesweeper() {
  const [snapshot, setSnapshot] = useState<GameSnapshot>(createInitialSnapshot);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);

  useEffect(() => {
    if (snapshot.status !== 'playing') return;
    const id = window.setInterval(() => {
      setElapsedSeconds((prev) => Math.min(999, prev + 1));
    }, 1000);
    return () => window.clearInterval(id);
  }, [snapshot.status]);

  const resetGame = useCallback(() => {
    setSnapshot(createInitialSnapshot());
    setElapsedSeconds(0);
  }, []);

  const revealCell = useCallback((row: number, col: number) => {
    setSnapshot((prev) => {
      if (prev.status === 'won' || prev.status === 'lost') return prev;
      const target = prev.grid[row]?.[col];
      if (!target || target.isRevealed || target.isFlagged) return prev;

      const nextGrid = cloneGrid(prev.grid);

      // Guarantee the very first left-click is safe by relocating a bomb if needed
      if (!prev.hasInteracted && nextGrid[row][col].isBomb) {
        outer: for (let r = 0; r < nextGrid.length; r++) {
          for (let c = 0; c < nextGrid[r].length; c++) {
            if (!nextGrid[r][c].isBomb && (r !== row || c !== col)) {
              nextGrid[r][c].isBomb = true;
              nextGrid[row][col].isBomb = false;
              break outer;
            }
          }
        }
        recalculateNeighborCounts(nextGrid);
      }

      if (nextGrid[row][col].isBomb) {
        for (const gridRow of nextGrid) {
          for (const cell of gridRow) {
            if (cell.isBomb) {
              cell.isRevealed = true;
            }
          }
        }
        return {
          grid: nextGrid,
          status: 'lost',
          explodedCell: { row, col },
          hasInteracted: true,
        };
      }

      floodFillReveal(nextGrid, row, col);

      const wonByReveal = checkAllSafeCellsRevealed(nextGrid);
      if (wonByReveal) {
        for (const gridRow of nextGrid) {
          for (const cell of gridRow) {
            if (cell.isBomb) cell.isFlagged = true;
          }
        }
      }

      return {
        grid: nextGrid,
        status:
          wonByReveal || checkAllBombsFlaggedCorrectly(nextGrid) ? 'won' : 'playing',
        explodedCell: null,
        hasInteracted: true,
      };
    });
  }, []);

  const toggleFlag = useCallback((row: number, col: number) => {
    setSnapshot((prev) => {
      if (prev.status === 'won' || prev.status === 'lost') return prev;
      const target = prev.grid[row]?.[col];
      if (!target || target.isRevealed) return prev;

      const nextGrid = cloneGrid(prev.grid);
      nextGrid[row][col].isFlagged = !nextGrid[row][col].isFlagged;

      const won = checkAllBombsFlaggedCorrectly(nextGrid);

      return {
        grid: nextGrid,
        status: won ? 'won' : 'playing',
        explodedCell: null,
        hasInteracted: true,
      };
    });
  }, []);

  const flaggedCount = snapshot.grid.reduce(
    (sum, row) => sum + row.filter((cell) => cell.isFlagged).length,
    0
  );

  const remainingMines = MINE_BOMB_COUNT - flaggedCount;

  return {
    grid: snapshot.grid,
    status: snapshot.status,
    explodedCell: snapshot.explodedCell,
    remainingMines,
    elapsedSeconds,
    revealCell,
    toggleFlag,
    resetGame,
  };
}
