import { useEffect, useMemo, useRef, useState } from 'react';
import type { CSSProperties } from 'react';

const SPIDER_SIZE = 88;

interface MarkoSpiderProps {
  instanceKey: number;
  forceMotion?: boolean;
  onScaredChange?: (scared: boolean) => void;
  onActivityChange?: (state: 'waiting' | 'descending' | 'idle' | 'startled' | 'scared') => void;
  onGone?: () => void;
}

interface WebPath {
  d: string;
  delay: string;
}

function buildCornerWebPaths(): WebPath[] {
  const angles = Array.from({ length: 9 }, (_, i) => ((90 + i * 11.25) * Math.PI) / 180);
  const polar = (radius: number, angle: number): [number, number] => [
    100 + radius * Math.cos(angle),
    radius * Math.sin(angle),
  ];

  const paths: WebPath[] = [];

  angles.forEach((angle, idx) => {
    const [x, y] = polar(102, angle);
    paths.push({ d: `M100 0 L${x.toFixed(2)} ${y.toFixed(2)}`, delay: `${(idx * 0.06).toFixed(2)}s` });
  });

  for (let ring = 0; ring < 8; ring++) {
    const r = 12 + ring * 12 + (ring % 2) * 2;
    let d = '';
    for (let i = 0; i < angles.length - 1; i++) {
      const [sx, sy] = polar(r, angles[i]);
      const [ex, ey] = polar(r, angles[i + 1]);
      const [cx, cy] = polar(r * 0.87, (angles[i] + angles[i + 1]) / 2);
      d += `${i === 0 ? `M${sx.toFixed(2)} ${sy.toFixed(2)}` : ''} Q${cx.toFixed(2)} ${cy.toFixed(2)} ${ex.toFixed(2)} ${ey.toFixed(2)}`;
    }
    paths.push({ d, delay: `${(0.5 + ring * 0.1).toFixed(2)}s` });
  }

  return paths;
}

function CornerWeb({ variant, animKey }: { variant: 'main' | 'small'; animKey: number }) {
  const paths = useMemo(() => buildCornerWebPaths(), []);
  return (
    <svg key={`${variant}-${animKey}`} className={`hw-web hw-web--${variant}`} viewBox="0 0 100 100" aria-hidden="true">
      {paths.map((p, idx) => (
        <path key={idx} d={p.d} pathLength={1} style={{ '--d': p.delay } as CSSProperties} />
      ))}
    </svg>
  );
}

const LEFT_LEG_PATHS = [0, 1, 2, 3].map((t) => {
  const y = 32 + t * 3;
  return `M${32 - 3} ${y} L${32 - 14} ${y - 12 + t * 5} L${32 - 26} ${y - 4 + t * 8}`;
});

const RIGHT_LEG_PATHS = [0, 1, 2, 3].map((t) => {
  const y = 32 + t * 3;
  return `M${32 + 3} ${y} L${32 + 14} ${y - 12 + t * 5} L${32 + 26} ${y - 4 + t * 8}`;
});

export function MarkoSpider({
  instanceKey,
  forceMotion = false,
  onScaredChange,
  onActivityChange,
  onGone,
}: MarkoSpiderProps) {
  const rigRef = useRef<HTMLDivElement | null>(null);
  const threadRef = useRef<HTMLDivElement | null>(null);
  const spiderBtnRef = useRef<HTMLButtonElement | null>(null);

  const [isGone, setIsGone] = useState(false);
  const [toastId, setToastId] = useState<number | null>(null);

  const scaredRef = useRef(false);
  const onScaredChangeRef = useRef(onScaredChange);
  const onActivityChangeRef = useRef(onActivityChange);
  const onGoneRef = useRef(onGone);

  useEffect(() => {
    onScaredChangeRef.current = onScaredChange;
    onActivityChangeRef.current = onActivityChange;
    onGoneRef.current = onGone;
  }, [onScaredChange, onActivityChange, onGone]);

  useEffect(() => {
    setIsGone(false);
    scaredRef.current = false;
    onScaredChangeRef.current?.(false);

    const prefersReduced = !forceMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (prefersReduced) { onActivityChangeRef.current?.('idle'); return; }

    const rig = rigRef.current;
    const thread = threadRef.current;
    const spiderBtn = spiderBtnRef.current;
    if (!rig || !thread || !spiderBtn) return;

    const isMobile = window.matchMedia('(max-width: 767px)').matches;
    const baseDepth = isMobile ? 90 : 170;
    const enterTime = performance.now() + 900;
    const mobileRetreatTime = enterTime + 4500;

    let currentY = -98;
    let startledUntil = 0;
    let rafId = 0;
    let lastState: 'waiting' | 'descending' | 'idle' | 'startled' | 'scared' = 'waiting';

    const reportState = (next: typeof lastState) => {
      if (next !== lastState) { lastState = next; onActivityChangeRef.current?.(next); }
    };

    const getTargetY = (now: number): number => {
      if (scaredRef.current) return -128;
      if (now < enterTime) return -98;
      if (now < startledUntil) return 10;
      if (isMobile) return now < mobileRetreatTime ? baseDepth : -44;
      return baseDepth + Math.min(window.scrollY * 0.12, window.innerHeight * 0.35);
    };

    const frame = (now: number) => {
      const targetY = getTargetY(now);
      currentY += (targetY - currentY) * (targetY < currentY ? 0.16 : 0.05);

      const isMoving = Math.abs(targetY - currentY) > 1.5;
      rig.classList.toggle('is-moving', isMoving);
      thread.style.height = `${Math.max(0, currentY + SPIDER_SIZE * 0.22)}px`;
      spiderBtn.style.translate = `0 ${currentY}px`;
      rig.style.height = `${Math.max(0, currentY + SPIDER_SIZE)}px`;

      if (scaredRef.current) reportState('scared');
      else if (now < enterTime) reportState('waiting');
      else if (now < startledUntil) reportState('startled');
      else if (isMoving) reportState('descending');
      else reportState('idle');

      if (scaredRef.current && currentY < -118) {
        setIsGone(true);
        onGoneRef.current?.();
        return;
      }

      rafId = window.requestAnimationFrame(frame);
    };

    rafId = window.requestAnimationFrame(frame);

    const handlePointerMove = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse' || scaredRef.current) return;
      const rect = spiderBtn.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.hypot(e.clientX - cx, e.clientY - cy);
      if (dist < 90 && performance.now() > startledUntil) {
        startledUntil = performance.now() + 2600;
      }
    };

    window.addEventListener('pointermove', handlePointerMove, { passive: true });

    return () => {
      window.cancelAnimationFrame(rafId);
      window.removeEventListener('pointermove', handlePointerMove);
    };
  }, [instanceKey, forceMotion]);

  useEffect(() => {
    if (toastId === null) return;
    const timer = window.setTimeout(() => setToastId(null), 3000);
    return () => window.clearTimeout(timer);
  }, [toastId]);

  const handleClickSpider = () => {
    if (scaredRef.current) return;
    scaredRef.current = true;
    onScaredChangeRef.current?.(true);
    setToastId(Date.now());
  };

  return (
    <>
      <CornerWeb variant="main" animKey={instanceKey} />
      <CornerWeb variant="small" animKey={instanceKey} />

      {!isGone && (
        <div ref={rigRef} className="hw-rig" key={`rig-${instanceKey}`}>
          <div ref={threadRef} className="hw-thread" />
          <button
            ref={spiderBtnRef}
            type="button"
            className="hw-spider"
            onClick={handleClickSpider}
            aria-label="Hanging spider. Click to scare it away."
          >
            <svg viewBox="0 0 64 64" width="88" height="88" aria-hidden="true" className="overflow-visible">
              <g className="legs">
                <g>{LEFT_LEG_PATHS.map((d, i) => <path key={`l-${i}`} d={d} />)}</g>
                <g>{RIGHT_LEG_PATHS.map((d, i) => <path key={`r-${i}`} d={d} />)}</g>
              </g>
              <ellipse className="body" cx="32" cy="24" rx="8" ry="10" />
              <circle className="body" cx="32" cy="38" r="5.5" />
              <circle className="eye" cx="30" cy="40.5" r="1.2" />
              <circle className="eye" cx="34" cy="40.5" r="1.2" />
            </svg>
          </button>
        </div>
      )}

      {toastId !== null && (
        <div key={toastId} className="hw-toast" role="status">
          You scared it away
        </div>
      )}
    </>
  );
}
