import { useRef } from 'react';
import { RotateCcw, Trophy } from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { GRID_SIZE_2048, SwipeDirection, useGame2048 } from '@/src/os/useGame2048';

const TILE_COLOR_CLASSES: Record<number, string> = {
  2: 'bg-[#eee4da] text-[#5c534a]',
  4: 'bg-[#ede0c8] text-[#5c534a]',
  8: 'bg-[#f2b179] text-white',
  16: 'bg-[#f59563] text-white',
  32: 'bg-[#f67c5f] text-white',
  64: 'bg-[#f65e3b] text-white',
  128: 'bg-[#edcf72] text-[#3f382e]',
  256: 'bg-[#edcc61] text-[#3f382e]',
  512: 'bg-[#edc850] text-[#3f382e]',
  1024: 'bg-[#edc53f] text-white',
  2048: 'bg-[#edc22e] text-white shadow-[0_0_24px_rgba(237,194,46,0.55)]',
};

function getTileFontClass(value: number): string {
  if (value >= 1024) return 'text-xl sm:text-2xl';
  if (value >= 128) return 'text-2xl sm:text-3xl';
  return 'text-3xl sm:text-4xl';
}

export function Mobile2048App() {
  const {
    tiles,
    score,
    bestScore,
    status,
    move,
    continueAfterWin,
    restart,
  } = useGame2048();

  const shouldReduceMotion = useReducedMotion();

  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const pointerStartRef = useRef<{ x: number; y: number } | null>(null);
  const lastTouchTimestampRef = useRef<number>(0);

  const dispatchSwipe = (dx: number, dy: number) => {
    const absX = Math.abs(dx);
    const absY = Math.abs(dy);
    const minSwipeDistance = 24;

    if (Math.max(absX, absY) < minSwipeDistance) return;

    const direction: SwipeDirection =
      absX > absY ? (dx > 0 ? 'right' : 'left') : dy > 0 ? 'down' : 'up';

    move(direction);
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    const touch = e.touches[0];
    if (!touch) return;
    lastTouchTimestampRef.current = Date.now();
    touchStartRef.current = { x: touch.clientX, y: touch.clientY };
  };

  const handleTouchEnd = (e: React.TouchEvent<HTMLDivElement>) => {
    const start = touchStartRef.current;
    touchStartRef.current = null;
    const touch = e.changedTouches[0];
    if (!start || !touch) return;

    lastTouchTimestampRef.current = Date.now();
    dispatchSwipe(touch.clientX - start.x, touch.clientY - start.y);
  };

  // Optional mouse drag fallback when testing Android/iOS mode on desktop browser
  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>) => {
    if (Date.now() - lastTouchTimestampRef.current < 500) return;
    pointerStartRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = (e: React.MouseEvent<HTMLDivElement>) => {
    if (Date.now() - lastTouchTimestampRef.current < 500) return;
    const start = pointerStartRef.current;
    pointerStartRef.current = null;
    if (!start) return;
    dispatchSwipe(e.clientX - start.x, e.clientY - start.y);
  };

  return (
    <div className="flex h-full w-full flex-col justify-between overflow-hidden px-4 py-4 text-white select-none">
      {/* Top Score Header */}
      <header className="mx-auto flex w-full max-w-[380px] shrink-0 items-center justify-between gap-3">
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight text-white">2048</h2>
          <p className="text-xs text-white/65">Swipe tiles to merge up to 2048</p>
        </div>

        <div className="flex items-center gap-2">
          <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-center backdrop-blur-md">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-white/65">
              Score
            </span>
            <span className="font-mono text-base font-bold tabular-nums">{score}</span>
          </div>
          <div className="rounded-xl border border-white/15 bg-white/10 px-3 py-1.5 text-center backdrop-blur-md">
            <span className="block font-mono text-[10px] uppercase tracking-wider text-white/65">
              Best
            </span>
            <span className="font-mono text-base font-bold text-[var(--os-accent)] tabular-nums">
              {bestScore}
            </span>
          </div>
          <button
            type="button"
            onClick={restart}
            aria-label="Restart 2048 game"
            title="New Game"
            className="grid size-11 cursor-pointer place-items-center rounded-xl border border-white/20 bg-white/12 transition-colors hover:bg-white/20 active:scale-95"
          >
            <RotateCcw className="size-4.5" />
          </button>
        </div>
      </header>

      {/* Center Touch-Swipe 4x4 Arena */}
      <div className="my-3 flex min-h-0 flex-1 items-center justify-center">
        <div
          role="region"
          aria-label="2048 Touch Swipe Game Board"
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onMouseDown={handleMouseDown}
          onMouseUp={handleMouseUp}
          className="relative aspect-square w-full max-w-[min(100%,380px)] touch-none overscroll-contain rounded-2xl border border-white/20 bg-[#1a2234]/90 p-2.5 shadow-2xl backdrop-blur-xl"
        >
          <div className="relative h-full w-full">
            {/* Background 4x4 Recessed Grid */}
            <div className="grid h-full w-full grid-cols-4 grid-rows-4">
              {Array.from({ length: GRID_SIZE_2048 * GRID_SIZE_2048 }, (_, idx) => (
                <div key={idx} className="p-1.5">
                  <div className="h-full w-full rounded-xl bg-white/[0.08]" />
                </div>
              ))}
            </div>

            {/* Foreground Animated Sliding Tiles */}
            <div className="pointer-events-none absolute inset-0">
              {tiles.map((tile) => {
                const colorClass =
                  TILE_COLOR_CLASSES[tile.value] ?? 'bg-[#3c3a32] text-white';
                return (
                  <motion.div
                    key={tile.id}
                    initial={
                      shouldReduceMotion
                        ? false
                        : tile.isNew
                          ? {
                              x: `${tile.col * 100}%`,
                              y: `${tile.row * 100}%`,
                              scale: 0.3,
                              opacity: 0,
                            }
                          : {
                              x: `${tile.col * 100}%`,
                              y: `${tile.row * 100}%`,
                            }
                    }
                    animate={{
                      x: `${tile.col * 100}%`,
                      y: `${tile.row * 100}%`,
                      scale: tile.justMerged ? [1, 1.12, 1] : 1,
                      opacity: 1,
                    }}
                    transition={
                      shouldReduceMotion
                        ? { duration: 0.01 }
                        : {
                            x: { type: 'spring', stiffness: 420, damping: 32, mass: 0.7 },
                            y: { type: 'spring', stiffness: 420, damping: 32, mass: 0.7 },
                            scale: { duration: 0.18 },
                            opacity: { duration: 0.14 },
                          }
                    }
                    className="absolute top-0 left-0 h-1/4 w-1/4 p-1.5"
                  >
                    <div
                      className={`flex h-full w-full items-center justify-center rounded-xl font-extrabold shadow-md tabular-nums ${colorClass} ${getTileFontClass(
                        tile.value
                      )}`}
                    >
                      {tile.value}
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* Win / Game Over Overlay */}
            {status !== 'playing' && (
              <div className="absolute inset-0 z-20 flex flex-col items-center justify-center gap-3 rounded-xl bg-black/75 p-5 text-center backdrop-blur-sm">
                {status === 'won' && (
                  <div className="grid size-12 place-items-center rounded-full bg-amber-400/20 text-amber-300">
                    <Trophy className="size-6" />
                  </div>
                )}
                <h3 className="text-xl font-bold text-white">
                  {status === 'won' ? '2048 Reached!' : 'No Moves Left'}
                </h3>
                <p className="font-mono text-xs text-white/75 tabular-nums">
                  Score: {score} · Best: {bestScore}
                </p>
                <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
                  {status === 'won' && (
                    <button
                      type="button"
                      onClick={continueAfterWin}
                      className="min-h-[40px] cursor-pointer rounded-xl border border-white/25 bg-white/15 px-4 py-2 text-xs font-semibold text-white hover:bg-white/25"
                    >
                      Keep Playing
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={restart}
                    className="min-h-[40px] cursor-pointer rounded-xl bg-[var(--os-accent)] px-5 py-2 text-xs font-semibold text-slate-950 hover:opacity-90"
                  >
                    Play Again
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Bottom Swipe Instruction */}
      <p className="mx-auto shrink-0 text-center font-mono text-[11px] text-white/60">
        Swipe Up, Down, Left, or Right inside the board
      </p>
    </div>
  );
}
