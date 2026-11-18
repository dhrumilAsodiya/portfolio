import { useState } from 'react';
import {
  MINE_BOMB_COUNT,
  MINE_GRID_COLS,
  MINE_GRID_ROWS,
  useMinesweeper,
} from '@/src/os/useMinesweeper';

const NUMBER_COLOR_CLASSES: Record<number, string> = {
  1: 'text-[#0000ff]',
  2: 'text-[#008000]',
  3: 'text-[#ff0000]',
  4: 'text-[#000080]',
  5: 'text-[#800000]',
  6: 'text-[#008080]',
  7: 'text-[#000000]',
  8: 'text-[#808080]',
};

function formatLedCounter(value: number): string {
  if (value < 0) {
    const abs = Math.min(99, Math.abs(value));
    return `-${String(abs).padStart(2, '0')}`;
  }
  return String(Math.min(999, value)).padStart(3, '0');
}

export function MinesweeperApp() {
  const {
    grid,
    status,
    explodedCell,
    remainingMines,
    elapsedSeconds,
    revealCell,
    toggleFlag,
    resetGame,
  } = useMinesweeper();

  const [isPressingCell, setIsPressingCell] = useState(false);

  const smileyFace =
    status === 'lost'
      ? '😵'
      : status === 'won'
        ? '😎'
        : isPressingCell
          ? '😮'
          : '🙂';

  const statusText =
    status === 'won'
      ? 'Cleared all mines!'
      : status === 'lost'
        ? 'Boom! Mine triggered.'
        : 'Left-click reveal · Right-click flag';

  return (
    <div
      onMouseUp={() => setIsPressingCell(false)}
      onMouseLeave={() => setIsPressingCell(false)}
      className="flex h-full w-full flex-col items-center justify-between overflow-hidden bg-[#c0c0c0] p-2.5 text-black select-none"
    >
      {/* Classic Raised Windows Bevel Frame */}
      <div className="flex min-h-0 w-full max-w-[332px] flex-1 flex-col justify-center gap-2 border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] p-2 shadow-sm">
        {/* Top LED Scoreboard + Smiley Reset */}
        <div className="flex shrink-0 items-center justify-between border-2 border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#c0c0c0] px-2 py-1">
          <div
            aria-label={`Remaining mines: ${remainingMines}`}
            className="min-w-[52px] border border-[#808080] bg-black px-1.5 py-0.5 text-right font-mono text-lg font-bold leading-none tracking-wider text-[#ff1a1a] tabular-nums"
          >
            {formatLedCounter(remainingMines)}
          </div>

          <button
            type="button"
            onClick={resetGame}
            aria-label="Restart Minesweeper"
            title="New Game"
            className="grid size-8 cursor-pointer place-items-center border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] text-base leading-none active:border-t-[#808080] active:border-l-[#808080] active:border-r-white active:border-b-white"
          >
            {smileyFace}
          </button>

          <div
            aria-label={`Elapsed seconds: ${elapsedSeconds}`}
            className="min-w-[52px] border border-[#808080] bg-black px-1.5 py-0.5 text-right font-mono text-lg font-bold leading-none tracking-wider text-[#ff1a1a] tabular-nums"
          >
            {formatLedCounter(elapsedSeconds)}
          </div>
        </div>

        {/* 10x10 Sunken Bevel Minefield */}
        <div
          role="grid"
          aria-label={`${MINE_GRID_ROWS} by ${MINE_GRID_COLS} Minesweeper Grid`}
          className="grid aspect-square w-full grid-cols-10 grid-rows-10 border-[3px] border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#808080]"
        >
          {grid.map((row, rIdx) =>
            row.map((cell, cIdx) => {
              const isExploded =
                explodedCell?.row === rIdx && explodedCell?.col === cIdx;
              const isMisflagged =
                status === 'lost' && cell.isFlagged && !cell.isBomb;

              if (cell.isRevealed) {
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    role="gridcell"
                    aria-label={
                      cell.isBomb
                        ? 'Mine'
                        : cell.neighborBombs > 0
                          ? `${cell.neighborBombs} nearby mines`
                          : 'Empty cell'
                    }
                    className={`flex items-center justify-center border border-[#808080]/70 font-mono text-sm font-extrabold leading-none ${
                      isExploded ? 'bg-[#ff0000]' : 'bg-[#c0c0c0]'
                    }`}
                  >
                    {cell.isBomb ? (
                      <span className="text-sm leading-none" aria-hidden="true">
                        💣
                      </span>
                    ) : cell.neighborBombs > 0 ? (
                      <span className={NUMBER_COLOR_CLASSES[cell.neighborBombs] ?? 'text-black'}>
                        {cell.neighborBombs}
                      </span>
                    ) : null}
                  </div>
                );
              }

              return (
                <button
                  key={`${rIdx}-${cIdx}`}
                  type="button"
                  role="gridcell"
                  disabled={status === 'won' || status === 'lost'}
                  onMouseDown={(e) => {
                    if (e.button === 0 && !cell.isFlagged) {
                      setIsPressingCell(true);
                    }
                  }}
                  onClick={() => revealCell(rIdx, cIdx)}
                  onContextMenu={(e) => {
                    e.preventDefault();
                    toggleFlag(rIdx, cIdx);
                  }}
                  aria-label={
                    cell.isFlagged
                      ? `Flagged cell row ${rIdx + 1} column ${cIdx + 1}`
                      : `Hidden cell row ${rIdx + 1} column ${cIdx + 1}`
                  }
                  className="flex cursor-pointer items-center justify-center border-2 border-t-white border-l-white border-r-[#808080] border-b-[#808080] bg-[#c0c0c0] text-sm leading-none hover:brightness-[1.03] active:border-[#808080] disabled:cursor-default"
                >
                  {isMisflagged ? (
                    <span className="text-xs font-bold text-[#ff0000]" title="Wrong flag">
                      ❌
                    </span>
                  ) : cell.isFlagged ? (
                    <span className="text-sm leading-none" aria-hidden="true">
                      🚩
                    </span>
                  ) : null}
                </button>
              );
            })
          )}
        </div>
      </div>

      {/* Classic Windows Status Strip */}
      <div className="mt-2 flex w-full max-w-[348px] items-center justify-between border border-t-[#808080] border-l-[#808080] border-r-white border-b-white bg-[#c0c0c0] px-2.5 py-1 font-mono text-[11px] text-[#222222]">
        <span className="truncate">{statusText}</span>
        <span className="shrink-0 pl-2 font-semibold tabular-nums">
          {MINE_GRID_ROWS}×{MINE_GRID_COLS} · {MINE_BOMB_COUNT} Mines
        </span>
      </div>
    </div>
  );
}
