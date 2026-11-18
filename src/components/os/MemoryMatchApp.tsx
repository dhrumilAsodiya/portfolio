import {
  CheckCircle2,
  Code2,
  Container,
  Database,
  GitBranch,
  Layers,
  RotateCcw,
  Server,
  Terminal,
} from 'lucide-react';
import { motion, useReducedMotion } from 'motion/react';
import { TechStackId, useMemoryMatch } from '@/src/os/useMemoryMatch';

function renderTechIcon(techId: TechStackId) {
  switch (techId) {
    case 'java':
      return <Code2 className="size-6" />;
    case 'springboot':
      return <Server className="size-6" />;
    case 'nextjs':
      return <Layers className="size-6" />;
    case 'postgresql':
      return <Database className="size-6" />;
    case 'docker':
      return <Container className="size-6" />;
    case 'git':
      return <GitBranch className="size-6" />;
  }
}

export function MemoryMatchApp() {
  const {
    cards,
    flippedCards,
    matchedCards,
    moves,
    bestMoves,
    matchedPairs,
    totalPairs,
    isWon,
    isBusy,
    flipCard,
    resetGame,
  } = useMemoryMatch();

  const shouldReduceMotion = useReducedMotion();

  return (
    <div className="relative flex h-full w-full flex-col justify-between overflow-hidden bg-gradient-to-br from-white/[0.08] via-white/[0.03] to-purple-500/[0.08] p-4 text-white backdrop-blur-2xl select-none">
      {/* macOS Frosted Glass Toolbar */}
      <header className="flex shrink-0 items-center justify-between gap-3 rounded-2xl border border-white/20 bg-white/[0.08] px-4 py-2.5 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)] backdrop-blur-xl">
        <div className="flex items-center gap-3 text-xs">
          <span className="font-medium text-white/95">Stack Memory</span>
          <span aria-hidden="true" className="text-white/35">
            ·
          </span>
          <span className="font-mono text-white/75 tabular-nums">
            Pairs {matchedPairs}/{totalPairs}
          </span>
          <span aria-hidden="true" className="text-white/35">
            ·
          </span>
          <span className="font-mono text-white/75 tabular-nums">
            Moves {moves}
          </span>
          {bestMoves !== null && (
            <>
              <span aria-hidden="true" className="hidden text-white/35 sm:inline">
                ·
              </span>
              <span className="hidden font-mono text-purple-200 tabular-nums sm:inline">
                Best {bestMoves}
              </span>
            </>
          )}
        </div>

        <button
          type="button"
          onClick={resetGame}
          className="inline-flex h-7 cursor-pointer items-center gap-1.5 rounded-lg border border-white/20 bg-white/12 px-2.5 text-xs font-medium text-white transition-colors hover:bg-white/20 active:scale-95"
        >
          <RotateCcw className="size-3.5" />
          <span>New Game</span>
        </button>
      </header>

      {/* 4x3 Card Grid */}
      <div className="relative my-3 flex min-h-0 flex-1 items-center justify-center">
        <div
          role="grid"
          aria-label="12-card Tech Stack Memory Match Grid"
          className="grid h-full max-h-[340px] w-full max-w-[468px] grid-cols-4 grid-rows-3 gap-2.5"
        >
          {cards.map((card) => {
            const isMatched = matchedCards.includes(card.id);
            const isFlipped = flippedCards.includes(card.id) || isMatched;

            return (
              <button
                key={card.id}
                type="button"
                disabled={isFlipped || isBusy}
                onClick={() => flipCard(card.id)}
                aria-label={
                  isFlipped
                    ? `${card.label} card${isMatched ? ' matched' : ''}`
                    : 'Hidden tech stack card'
                }
                className="mac-card-perspective group relative h-full w-full cursor-pointer rounded-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-purple-400 disabled:cursor-default"
              >
                <motion.div
                  initial={false}
                  animate={{ rotateY: isFlipped ? 180 : 0 }}
                  transition={
                    shouldReduceMotion
                      ? { duration: 0.01 }
                      : { duration: 0.45, ease: [0.16, 1, 0.3, 1] }
                  }
                  className="mac-card-3d relative h-full w-full"
                >
                  {/* Card Back (Face Down) */}
                  <div className="mac-card-face absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-2xl border border-white/20 bg-white/[0.1] shadow-[0_8px_24px_rgba(0,0,0,0.28),inset_0_1px_0_rgba(255,255,255,0.22)] backdrop-blur-xl transition-colors group-hover:border-white/35 group-hover:bg-white/[0.15]">
                    <div className="grid size-9 place-items-center rounded-xl border border-white/20 bg-white/10 text-purple-200">
                      <Terminal className="size-4" />
                    </div>
                    <span className="font-mono text-[10px] tracking-wider text-white/55">
                      DEV
                    </span>
                  </div>

                  {/* Card Front (Face Up — rotated 180deg cleanly) */}
                  <div
                    className={`mac-card-face mac-card-front absolute inset-0 flex flex-col items-center justify-center gap-1.5 rounded-2xl border p-2 text-center shadow-[0_10px_28px_rgba(0,0,0,0.34),inset_0_1px_0_rgba(255,255,255,0.28)] backdrop-blur-xl ${
                      card.glowClass
                    } ${isMatched ? 'ring-1 ring-emerald-400/60' : ''}`}
                  >
                    <div
                      className={`grid size-9 place-items-center rounded-xl border ${card.badgeClass}`}
                    >
                      {renderTechIcon(card.techId)}
                    </div>
                    <div className="min-w-0 max-w-full">
                      <p className="truncate text-xs font-semibold leading-tight text-white">
                        {card.label}
                      </p>
                      <p className="truncate font-mono text-[10px] text-white/65">
                        {card.subtitle}
                      </p>
                    </div>
                  </div>
                </motion.div>
              </button>
            );
          })}
        </div>

        {/* Sleek macOS Glass Victory Sheet */}
        {isWon && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-2xl bg-black/45 p-4 backdrop-blur-md">
            <div className="flex w-full max-w-[300px] flex-col items-center gap-3 rounded-2xl border border-white/25 bg-[#1e1e26]/85 p-5 text-center shadow-2xl backdrop-blur-2xl">
              <div className="grid size-11 place-items-center rounded-full border border-emerald-400/40 bg-emerald-500/20 text-emerald-300">
                <CheckCircle2 className="size-6" />
              </div>
              <div>
                <h3 className="text-base font-semibold text-white">
                  All 6 Pairs Matched
                </h3>
                <p className="mt-1 font-mono text-xs text-white/75 tabular-nums">
                  Completed in {moves} moves
                  {bestMoves !== null ? ` · Best: ${bestMoves}` : ''}
                </p>
              </div>
              <button
                type="button"
                onClick={resetGame}
                className="w-full cursor-pointer rounded-xl bg-[#a78bfa] px-4 py-2 text-xs font-semibold text-slate-950 transition-opacity hover:opacity-90"
              >
                Play Again
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Subtle macOS Footer Status */}
      <footer className="flex shrink-0 items-center justify-between text-[11px] text-white/60">
        <span>Java · Spring Boot · Next.js · PostgreSQL · Docker · Git</span>
        <span className="hidden font-mono sm:inline">macOS Native</span>
      </footer>
    </div>
  );
}
