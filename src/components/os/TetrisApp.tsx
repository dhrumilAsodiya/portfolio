import { useEffect, useRef, useState } from 'react';
import {
  ArrowDownToLine,
  ArrowLeft,
  ArrowRight,
  Pause,
  Play,
  RotateCcw,
  RotateCw,
} from 'lucide-react';
import { useOSStore } from '@/src/os/useOSStore';
import {
  BOARD_COLS,
  BOARD_ROWS,
  CellValue,
  TETROMINO_COLORS,
  TETROMINO_SHAPES,
  useTetris,
} from '@/src/os/useTetris';

interface TetrisAppProps {
  windowId: string;
}

export function TetrisApp({ windowId }: TetrisAppProps) {
  const currentOS = useOSStore((s) => s.currentOS);
  const activeWindowId = useOSStore((s) => s.activeWindowId);
  const openWindows = useOSStore((s) => s.openWindows);

  const containerRef = useRef<HTMLDivElement>(null);
  const [isMobileViewport, setIsMobileViewport] = useState<boolean>(() =>
    typeof window !== 'undefined' ? window.innerWidth < 768 : false
  );

  const {
    board,
    activePiece,
    nextType,
    ghostY,
    score,
    highScore,
    lines,
    level,
    status,
    moveLeft,
    moveRight,
    moveDown,
    rotate,
    hardDrop,
    togglePause,
    restart,
  } = useTetris();

  useEffect(() => {
    const onResize = () => setIsMobileViewport(window.innerWidth < 768);
    window.addEventListener('resize', onResize);
    return () => window.removeEventListener('resize', onResize);
  }, []);

  const isMobile =
    isMobileViewport || currentOS === 'android' || currentOS === 'ios';

  const topMobileWindowId =
    openWindows.length > 0
      ? [...openWindows].sort((a, b) => b.zIndex - a.zIndex)[0]?.id
      : null;

  const isFocused = isMobile
    ? topMobileWindowId === windowId
    : activeWindowId === windowId;

  useEffect(() => {
    if (!isFocused) return;
    const raf = window.requestAnimationFrame(() => {
      containerRef.current?.focus({ preventScroll: true });
    });
    return () => window.cancelAnimationFrame(raf);
  }, [isFocused]);

  useEffect(() => {
    if (!isFocused) return;

    const onKeyDown = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      if (target?.closest('input, textarea, select')) return;

      switch (e.key) {
        case 'ArrowLeft':
        case 'a':
        case 'A':
          e.preventDefault();
          moveLeft();
          break;
        case 'ArrowRight':
        case 'd':
        case 'D':
          e.preventDefault();
          moveRight();
          break;
        case 'ArrowDown':
        case 's':
        case 'S':
          e.preventDefault();
          moveDown();
          break;
        case 'ArrowUp':
        case 'w':
        case 'W':
          e.preventDefault();
          rotate();
          break;
        case ' ':
          e.preventDefault();
          hardDrop();
          break;
        case 'p':
        case 'P':
          e.preventDefault();
          togglePause();
          break;
        case 'r':
        case 'R':
          e.preventDefault();
          restart();
          break;
      }
    };

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isFocused, moveLeft, moveRight, moveDown, rotate, hardDrop, togglePause, restart]);

  // Compose render cells cleanly (locked board + ghost preview + active piece)
  const renderGrid: { type: CellValue; isGhost: boolean }[][] = board.map((row) =>
    row.map((cell) => ({ type: cell, isGhost: false }))
  );

  for (let r = 0; r < activePiece.matrix.length; r++) {
    for (let c = 0; c < activePiece.matrix[r].length; c++) {
      if (!activePiece.matrix[r][c]) continue;
      const gx = activePiece.x + c;
      const gy = ghostY + r;
      if (gy >= 0 && gy < BOARD_ROWS && gx >= 0 && gx < BOARD_COLS && !renderGrid[gy][gx].type) {
        renderGrid[gy][gx] = { type: activePiece.type, isGhost: true };
      }
    }
  }

  for (let r = 0; r < activePiece.matrix.length; r++) {
    for (let c = 0; c < activePiece.matrix[r].length; c++) {
      if (!activePiece.matrix[r][c]) continue;
      const ax = activePiece.x + c;
      const ay = activePiece.y + r;
      if (ay >= 0 && ay < BOARD_ROWS && ax >= 0 && ax < BOARD_COLS) {
        renderGrid[ay][ax] = { type: activePiece.type, isGhost: false };
      }
    }
  }

  const nextShape = TETROMINO_SHAPES[nextType];

  return (
    <div
      ref={containerRef}
      tabIndex={0}
      aria-label="Trinity OS Tetris Game"
      onMouseDown={() => containerRef.current?.focus({ preventScroll: true })}
      className="flex h-full w-full flex-col justify-between overflow-hidden bg-[#090d16] text-slate-100 outline-none select-none"
    >
      {/* Top HUD */}
      <div className="flex shrink-0 items-center justify-between gap-2 border-b border-white/10 bg-black/30 px-3 py-2 font-mono text-xs">
        <div className="flex items-center gap-3">
          <div>
            <span className="text-[10px] uppercase opacity-55">Score </span>
            <span className="font-semibold text-[var(--os-accent)] tabular-nums">
              {score}
            </span>
          </div>
          <div>
            <span className="text-[10px] uppercase opacity-55">Lines </span>
            <span className="font-semibold tabular-nums">{lines}</span>
          </div>
          <div>
            <span className="text-[10px] uppercase opacity-55">Lvl </span>
            <span className="font-semibold tabular-nums">{level}</span>
          </div>
          <div className="hidden sm:block">
            <span className="text-[10px] uppercase opacity-55">Best </span>
            <span className="font-semibold tabular-nums">{highScore}</span>
          </div>
        </div>

        <div className="flex items-center gap-1.5">
          <button
            type="button"
            onClick={togglePause}
            disabled={status === 'gameover'}
            aria-label={status === 'paused' ? 'Resume game' : 'Pause game'}
            className="inline-flex h-7 cursor-pointer items-center gap-1 rounded border border-white/15 bg-white/8 px-2 text-[11px] hover:bg-white/15 disabled:cursor-not-allowed disabled:opacity-40"
          >
            {status === 'paused' ? <Play className="size-3" /> : <Pause className="size-3" />}
            <span>{status === 'paused' ? 'Resume' : 'Pause'}</span>
          </button>
          <button
            type="button"
            onClick={restart}
            aria-label="Restart Tetris"
            className="inline-flex h-7 cursor-pointer items-center gap-1 rounded border border-white/15 bg-white/8 px-2 text-[11px] hover:bg-white/15"
          >
            <RotateCcw className="size-3" />
            <span>Reset</span>
          </button>
        </div>
      </div>

      {/* Main Board + Side Preview */}
      <div className="flex min-h-0 flex-1 items-center justify-center gap-3 overflow-hidden p-2.5 sm:gap-4 sm:p-4">
        {/* 10x20 Matrix Board */}
        <div className="relative flex h-full max-h-full items-center justify-center">
          <div
            role="grid"
            aria-label="10 by 20 Tetris Board"
            className="grid h-full max-h-[440px] max-w-full w-auto aspect-[10/20] grid-cols-10 grid-rows-20 gap-[1px] rounded-md border border-white/20 bg-[#04060b] p-1 shadow-[inset_0_0_24px_rgba(0,0,0,0.85)]"
          >
            {renderGrid.map((row, rIdx) =>
              row.map((cell, cIdx) => {
                const fillColor = cell.type ? TETROMINO_COLORS[cell.type] : undefined;
                return (
                  <div
                    key={`${rIdx}-${cIdx}`}
                    className={`rounded-[2px] border ${
                      cell.type
                        ? cell.isGhost
                          ? 'border-dashed bg-transparent opacity-35'
                          : 'border-white/30 shadow-[inset_0_1px_0_rgba(255,255,255,0.45)]'
                        : 'border-white/[0.03] bg-white/[0.025]'
                    }`}
                    style={
                      cell.type
                        ? cell.isGhost
                          ? { borderColor: fillColor }
                          : { backgroundColor: fillColor }
                        : undefined
                    }
                  />
                );
              })
            )}
          </div>

          {/* Pause / Game Over Overlay */}
          {status !== 'playing' && (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 rounded-md bg-black/80 p-4 text-center backdrop-blur-xs">
              <p className="font-mono text-base font-bold tracking-wider uppercase text-white">
                {status === 'gameover' ? 'Game Over' : 'Paused'}
              </p>
              <p className="font-mono text-xs text-slate-300">
                Score: {score} · Lines: {lines}
              </p>
              <button
                type="button"
                onClick={status === 'gameover' ? restart : togglePause}
                className="cursor-pointer rounded bg-[var(--os-accent)] px-4 py-1.5 font-mono text-xs font-semibold text-black uppercase hover:opacity-90"
              >
                {status === 'gameover' ? 'Play Again' : 'Resume'}
              </button>
            </div>
          )}
        </div>

        {/* Right Info Panel (Next Piece + Desktop Controls) */}
        <aside className="flex w-24 shrink-0 flex-col gap-3 sm:w-28">
          <div className="rounded-lg border border-white/12 bg-white/[0.04] p-2.5">
            <p className="mb-2 font-mono text-[10px] uppercase tracking-wider opacity-65">
              Next
            </p>
            <div className="grid aspect-square w-full grid-cols-4 grid-rows-4 gap-1">
              {Array.from({ length: 4 }, (_, r) =>
                Array.from({ length: 4 }, (__, c) => {
                  const filled = nextShape[r]?.[c] === 1;
                  return (
                    <div
                      key={`next-${r}-${c}`}
                      className={`rounded-[2px] ${
                        filled ? 'border border-white/35' : 'bg-transparent'
                      }`}
                      style={
                        filled ? { backgroundColor: TETROMINO_COLORS[nextType] } : undefined
                      }
                    />
                  );
                })
              )}
            </div>
          </div>

          <div className="rounded-lg border border-white/12 bg-white/[0.04] p-2.5 font-mono text-[10px] leading-relaxed">
            <p className="mb-1 uppercase tracking-wider opacity-65">Keys</p>
            <p>← → : Move</p>
            <p>↓ : Soft</p>
            <p>↑ : Rotate</p>
            <p>Space : Drop</p>
            <p>P : Pause</p>
          </div>

          {!isMobile && (
            <button
              type="button"
              onClick={hardDrop}
              className="cursor-pointer rounded border border-white/15 bg-white/8 px-2 py-1.5 font-mono text-[11px] hover:bg-white/15"
            >
              Drop [Space]
            </button>
          )}
        </aside>
      </div>

      {/* Mobile On-Screen Arcade Controls (Left, Right, Rotate, Drop) */}
      {isMobile && (
        <div
          aria-label="Mobile Tetris Touch Controls"
          className="grid shrink-0 grid-cols-4 gap-2 border-t border-white/12 bg-black/45 px-3 py-2.5"
        >
          <button
            type="button"
            onClick={moveLeft}
            aria-label="Move Left"
            className="flex min-h-[48px] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border border-white/20 bg-white/10 text-xs font-semibold active:scale-95 active:bg-white/20"
          >
            <ArrowLeft className="size-4" />
            <span className="text-[10px] uppercase">Left</span>
          </button>
          <button
            type="button"
            onClick={moveRight}
            aria-label="Move Right"
            className="flex min-h-[48px] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border border-white/20 bg-white/10 text-xs font-semibold active:scale-95 active:bg-white/20"
          >
            <ArrowRight className="size-4" />
            <span className="text-[10px] uppercase">Right</span>
          </button>
          <button
            type="button"
            onClick={rotate}
            aria-label="Rotate Piece"
            className="flex min-h-[48px] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border border-white/20 bg-white/10 text-xs font-semibold active:scale-95 active:bg-white/20"
          >
            <RotateCw className="size-4" />
            <span className="text-[10px] uppercase">Rotate</span>
          </button>
          <button
            type="button"
            onClick={hardDrop}
            aria-label="Hard Drop Piece"
            className="flex min-h-[48px] cursor-pointer flex-col items-center justify-center gap-0.5 rounded-xl border border-[var(--os-accent)]/50 bg-[var(--os-accent)]/25 text-xs font-semibold text-white active:scale-95 active:bg-[var(--os-accent)]/40"
          >
            <ArrowDownToLine className="size-4" />
            <span className="text-[10px] uppercase">Drop</span>
          </button>
        </div>
      )}
    </div>
  );
}
