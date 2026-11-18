import { useCallback, useEffect, useRef, useState } from 'react';

export type TechStackId =
  | 'java'
  | 'springboot'
  | 'nextjs'
  | 'postgresql'
  | 'docker'
  | 'git';

export interface MemoryCard {
  id: string;
  techId: TechStackId;
  label: string;
  subtitle: string;
  mark: string;
  glowClass: string;
  badgeClass: string;
}

const TECH_STACK_PAIRS: Omit<MemoryCard, 'id'>[] = [
  {
    techId: 'java',
    label: 'Java',
    subtitle: 'JVM Runtime',
    mark: 'JV',
    glowClass: 'border-orange-400/45 bg-orange-500/15',
    badgeClass: 'bg-orange-500/25 text-orange-200 border-orange-400/40',
  },
  {
    techId: 'springboot',
    label: 'Spring Boot',
    subtitle: 'REST & Auth',
    mark: 'SB',
    glowClass: 'border-emerald-400/45 bg-emerald-500/15',
    badgeClass: 'bg-emerald-500/25 text-emerald-200 border-emerald-400/40',
  },
  {
    techId: 'nextjs',
    label: 'Next.js',
    subtitle: 'App Router',
    mark: 'NX',
    glowClass: 'border-slate-200/45 bg-white/15',
    badgeClass: 'bg-white/20 text-white border-white/35',
  },
  {
    techId: 'postgresql',
    label: 'PostgreSQL',
    subtitle: 'ACID Storage',
    mark: 'PG',
    glowClass: 'border-sky-400/45 bg-sky-500/15',
    badgeClass: 'bg-sky-500/25 text-sky-200 border-sky-400/40',
  },
  {
    techId: 'docker',
    label: 'Docker',
    subtitle: 'Containers',
    mark: 'DK',
    glowClass: 'border-cyan-400/45 bg-cyan-500/15',
    badgeClass: 'bg-cyan-500/25 text-cyan-200 border-cyan-400/40',
  },
  {
    techId: 'git',
    label: 'Git',
    subtitle: 'Version Ctrl',
    mark: 'GT',
    glowClass: 'border-rose-400/45 bg-rose-500/15',
    badgeClass: 'bg-rose-500/25 text-rose-200 border-rose-400/40',
  },
];

function createShuffledDeck(): MemoryCard[] {
  const deck: MemoryCard[] = TECH_STACK_PAIRS.flatMap((tech) => [
    { ...tech, id: `${tech.techId}-a` },
    { ...tech, id: `${tech.techId}-b` },
  ]);

  for (let i = deck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [deck[i], deck[j]] = [deck[j], deck[i]];
  }

  return deck;
}

export function useMemoryMatch() {
  const [cards, setCards] = useState<MemoryCard[]>(createShuffledDeck);
  const [flippedCards, setFlippedCards] = useState<string[]>([]);
  const [matchedCards, setMatchedCards] = useState<string[]>([]);
  const [moves, setMoves] = useState(0);
  const [bestMoves, setBestMoves] = useState<number | null>(() => {
    try {
      const saved = window.localStorage.getItem('trinity_memory_best_moves');
      const parsed = saved ? Number(saved) : NaN;
      return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
    } catch {
      return null;
    }
  });

  const mismatchTimerRef = useRef<number | null>(null);

  const clearPendingTimer = useCallback(() => {
    if (mismatchTimerRef.current !== null) {
      window.clearTimeout(mismatchTimerRef.current);
      mismatchTimerRef.current = null;
    }
  }, []);

  useEffect(() => clearPendingTimer, [clearPendingTimer]);

  const isWon = matchedCards.length === cards.length && cards.length > 0;

  const flipCard = useCallback(
    (cardId: string) => {
      if (flippedCards.length >= 2) return;
      if (flippedCards.includes(cardId) || matchedCards.includes(cardId)) return;

      const nextFlipped = [...flippedCards, cardId];
      setFlippedCards(nextFlipped);

      if (nextFlipped.length < 2) return;

      const nextMoves = moves + 1;
      setMoves(nextMoves);

      const firstCard = cards.find((c) => c.id === nextFlipped[0]);
      const secondCard = cards.find((c) => c.id === nextFlipped[1]);

      if (firstCard && secondCard && firstCard.techId === secondCard.techId) {
        const nextMatched = [...matchedCards, firstCard.id, secondCard.id];
        setMatchedCards(nextMatched);
        setFlippedCards([]);

        if (nextMatched.length === cards.length) {
          setBestMoves((prev) => {
            const nextBest = prev === null ? nextMoves : Math.min(prev, nextMoves);
            try {
              window.localStorage.setItem('trinity_memory_best_moves', String(nextBest));
            } catch {
              // Ignore storage quota errors
            }
            return nextBest;
          });
        }
        return;
      }

      clearPendingTimer();
      mismatchTimerRef.current = window.setTimeout(() => {
        setFlippedCards([]);
        mismatchTimerRef.current = null;
      }, 1000);
    },
    [cards, clearPendingTimer, flippedCards, matchedCards, moves]
  );

  const resetGame = useCallback(() => {
    clearPendingTimer();
    setCards(createShuffledDeck());
    setFlippedCards([]);
    setMatchedCards([]);
    setMoves(0);
  }, [clearPendingTimer]);

  return {
    cards,
    flippedCards,
    matchedCards,
    moves,
    bestMoves,
    matchedPairs: matchedCards.length / 2,
    totalPairs: cards.length / 2,
    isWon,
    isBusy: flippedCards.length >= 2,
    flipCard,
    resetGame,
  };
}
