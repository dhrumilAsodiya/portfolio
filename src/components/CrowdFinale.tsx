import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowUp } from 'lucide-react';
import {
  createFallbackSprites,
  extractSpritesFromSheet,
  extractStandingPortrait,
  type ExtractedSprite,
} from '@/src/lib/spriteExtractor';

const STANDING_PORTRAIT_SRC = '/assets/crowd/hermes_standing_nocap.jpg';

const CROWD_SHEET_SRCS = [
  '/assets/crowd/crowd_sheet_one.jpg',
  '/assets/crowd/crowd_sheet_two.jpg',
  '/assets/crowd/crowd_sheet_three.jpg',
  '/assets/crowd/crowd_sheet_four.jpg',
  '/assets/crowd/crowd_sheet_five.jpg',
  '/assets/crowd/crowd_sheet_six.jpg',
];

interface Walker {
  cell: number;
  layer: 0 | 1;
  row: 0 | 1;
  h: number;
  w: number;
  baseline: number;
  speed: number;
  phase: number;
  direction: 1 | -1;
}

function deterministicHash(seed: number): number {
  const v = 43758.5453 * Math.sin(127.1 * seed + 311.7);
  return v - Math.floor(v);
}

function buildCrowdWalkers(
  stageWidth: number,
  stageHeight: number,
  portraitHeight: number,
  castCount: number
): { walkers: Walker[]; maxW: number; trackSpan: number } {
  const isDesktop = stageWidth >= 600;
  const scaleFactor = Math.min(1, portraitHeight / 310);
  const widthRatio = stageWidth / (1440 * Math.max(0.45, scaleFactor));

  const rowCounts: [number, number] = isDesktop
    ? [25, 16]
    : [Math.max(9, Math.round(25 * widthRatio)), Math.max(6, Math.round(16 * widthRatio))];

  const totalWalkers = rowCounts[0] + rowCounts[1];

  const walkers: Walker[] = Array.from({ length: totalWalkers }, (_, idx) => {
    const row: 0 | 1 = idx < rowCounts[0] ? 0 : 1;
    const indexInRow = row === 0 ? idx : idx - rowCounts[0];
    const rowTotal = rowCounts[row];

    const h = (row === 1 ? 250 + 30 * deterministicHash(idx + 8) : 170 + 35 * deterministicHash(idx + 8)) * scaleFactor;
    const w = 0.8 * h;

    const baseline =
      row === 0
        ? stageHeight - portraitHeight - 12 + 24 * deterministicHash(idx + 4)
        : stageHeight - h + 30 * scaleFactor + 15 * deterministicHash(idx + 4);

    const cell = (7 * Math.floor((castCount * idx) / totalWalkers)) % castCount;
    const speed = (row === 0 ? 0.7 : 1.05) * (0.88 + 0.24 * deterministicHash(idx + 97));
    const phase = (indexInRow + 0.85 * deterministicHash(idx + 41)) / rowTotal;
    const direction: 1 | -1 = row === 1 ? -1 : 1;
    const layer: 0 | 1 = row > 0 || indexInRow % 3 === 0 ? 1 : 0;

    return { cell, layer, row, h, w, baseline, speed, phase, direction };
  }).sort((a, b) => a.baseline - b.baseline);

  const maxW = walkers.reduce((acc, item) => Math.max(acc, item.w), 160);
  const trackSpan = stageWidth + 2 * maxW;

  return { walkers, maxW, trackSpan };
}

export function CrowdFinale() {
  const sceneRef = useRef<HTMLButtonElement | null>(null);
  const portraitRef = useRef<HTMLImageElement | null>(null);
  const backCanvasRef = useRef<HTMLCanvasElement | null>(null);
  const frontCanvasRef = useRef<HTMLCanvasElement | null>(null);

  const spritesRef = useRef<ExtractedSprite[]>([]);
  const walkersRef = useRef<Walker[]>([]);
  const layoutRef = useRef({ width: 1440, height: 460, dpr: 1, maxW: 220, trackSpan: 1880 });
  const elapsedRef = useRef(0);
  const inViewRef = useRef(true);

  const [portraitSrc, setPortraitSrc] = useState<string | null>(null);
  const [portraitFailed, setPortraitFailed] = useState(false);
  const [isReady, setIsReady] = useState(false);
  const [castSize, setCastSize] = useState(0);
  const [isReducedMotion, setIsReducedMotion] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  const stateRef = useRef({ paused: false, reduced: false, sync: () => {} });

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const update = () => setIsReducedMotion(mq.matches);
    update();
    mq.addEventListener('change', update);
    return () => mq.removeEventListener('change', update);
  }, []);

  useEffect(() => {
    stateRef.current.paused = isPaused;
    stateRef.current.reduced = isReducedMotion;
    stateRef.current.sync();
  }, [isPaused, isReducedMotion]);

  useEffect(() => {
    let cancelled = false;

    async function loadAssets() {
      const [portraitResult, ...sheetResults] = await Promise.allSettled([
        extractStandingPortrait(STANDING_PORTRAIT_SRC),
        ...CROWD_SHEET_SRCS.map((src) => extractSpritesFromSheet(src)),
      ]);

      if (cancelled) return;

      if (portraitResult.status === 'fulfilled') {
        setPortraitSrc(portraitResult.value);
      } else {
        setPortraitFailed(true);
      }

      const extracted: ExtractedSprite[] = [];
      for (const res of sheetResults) {
        if (res.status === 'fulfilled' && res.value.length > 0) {
          extracted.push(...res.value);
        }
      }

      const finalSprites = extracted.length > 0 ? extracted : createFallbackSprites();
      spritesRef.current = finalSprites;
      setCastSize(finalSprites.length);
      setIsReady(true);
    }

    loadAssets();
    return () => { cancelled = true; };
  }, []);

  const drawFrame = useCallback(() => {
    const backCtx = backCanvasRef.current?.getContext('2d');
    const frontCtx = frontCanvasRef.current?.getContext('2d');
    const sprites = spritesRef.current;
    if (!backCtx || !frontCtx || sprites.length === 0) return;

    const contexts: [CanvasRenderingContext2D, CanvasRenderingContext2D] = [backCtx, frontCtx];
    const { width, height, dpr, maxW, trackSpan } = layoutRef.current;
    const elapsed = elapsedRef.current;
    const castCount = sprites.length;

    for (const ctx of contexts) {
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, width, height);
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
    }

    const walkers = walkersRef.current;
    for (let i = 0; i < walkers.length; i++) {
      const w = walkers[i];
      const progress = w.phase + (elapsed * w.speed) / 10;
      const loopCount = Math.floor(progress);
      const frac = progress - loopCount;
      const spriteIdx = (w.cell + 7 * loopCount) % castCount;
      const sprite = sprites[spriteIdx];
      if (!sprite) continue;

      const x = (w.direction === 1 ? frac : 1 - frac) * trackSpan - maxW;
      const drawH = w.h;
      const drawW = drawH * sprite.aspectRatio;

      if (x + drawW * 0.65 < -32 || x - drawW * 0.65 > width + 32) continue;

      const bob = (1 - Math.cos((elapsed * w.speed + 10 * w.phase) * Math.PI * 4)) * 5;
      const ctx = contexts[w.layer];
      const source = w.row === 0 ? sprite.softBottomCanvas : sprite.canvas;

      ctx.save();
      ctx.translate(x, w.baseline - bob);
      ctx.scale(w.direction, 1);
      ctx.drawImage(source, -drawW / 2, 0, drawW, drawH);
      ctx.restore();
    }
  }, []);

  useEffect(() => {
    if (!isReady) return;
    const sceneEl = sceneRef.current;
    const backCanvas = backCanvasRef.current;
    const frontCanvas = frontCanvasRef.current;
    if (!sceneEl || !backCanvas || !frontCanvas) return;

    let disposed = false;
    let rafId = 0;
    let lastTs = 0;

    const tick = (now: number) => {
      if (lastTs) elapsedRef.current += Math.min((now - lastTs) / 1000, 0.05);
      lastTs = now;
      drawFrame();
      rafId = window.requestAnimationFrame(tick);
    };

    const syncLoop = () => {
      window.cancelAnimationFrame(rafId);
      rafId = 0; lastTs = 0;
      if (disposed) return;
      drawFrame();
      if (inViewRef.current && !document.hidden && !stateRef.current.paused && !stateRef.current.reduced) {
        rafId = window.requestAnimationFrame(tick);
      }
    };

    stateRef.current.sync = syncLoop;

    const rebuildLayout = () => {
      if (disposed) return;
      const width = Math.max(320, Math.round(sceneEl.clientWidth));
      const height = Math.max(300, Math.round(sceneEl.clientHeight));
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const portraitRectH = portraitRef.current?.getBoundingClientRect().height || 0;
      const portraitHeight = portraitRectH > 80 ? portraitRectH : Math.min(365, height - 24);

      backCanvas.width = Math.round(width * dpr);
      backCanvas.height = Math.round(height * dpr);
      frontCanvas.width = Math.round(width * dpr);
      frontCanvas.height = Math.round(height * dpr);

      const { walkers, maxW, trackSpan } = buildCrowdWalkers(width, height, portraitHeight, spritesRef.current.length);
      walkersRef.current = walkers;
      layoutRef.current = { width, height, dpr, maxW, trackSpan };
      syncLoop();
    };

    rebuildLayout();

    const io = new IntersectionObserver(
      (entries) => { inViewRef.current = entries[0]?.isIntersecting ?? true; syncLoop(); },
      { rootMargin: '80px' }
    );
    io.observe(sceneEl);
    const ro = new ResizeObserver(rebuildLayout);
    ro.observe(sceneEl);
    document.addEventListener('visibilitychange', syncLoop);

    return () => {
      disposed = true;
      window.cancelAnimationFrame(rafId);
      io.disconnect(); ro.disconnect();
      document.removeEventListener('visibilitychange', syncLoop);
      stateRef.current.sync = () => {};
    };
  }, [isReady, drawFrame]);

  return (
    <section className="w-full bg-black text-white" aria-label="Footer crowd scene">
      {/* Top Heading Bar */}
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-5 px-6 pt-6 pb-3.5 sm:px-10">
        <p className="text-[clamp(1.625rem,3vw,2.625rem)] font-medium leading-[1.15] tracking-[-0.03em] text-[#f8f7f4]">
          Reached the bottom.
        </p>
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: isReducedMotion ? 'instant' : 'smooth' })}
          className="group inline-flex min-h-[44px] shrink-0 cursor-pointer items-center gap-3 whitespace-nowrap text-xs font-medium text-[#f8f7f4]/85 transition-colors duration-150 hover:text-white focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#f8f7f4]"
        >
          <span>Back to top</span>
          <ArrowUp className="h-4 w-4 transition-transform duration-150 group-hover:-translate-y-0.5" strokeWidth={1.9} aria-hidden="true" />
        </button>
      </div>

      <p id="crowd-scene-description" className="sr-only">
        Illustrated monochrome street pedestrians walking in two streams. In the center, a classical
        figure stands still while people pass behind and in front.
      </p>

      {/* 4-Layer Interactive White Crowd Stage */}
      <button
        ref={sceneRef}
        type="button"
        disabled={isReducedMotion}
        onClick={() => setIsPaused((prev) => !prev)}
        aria-label={isPaused ? 'Resume crowd animation' : 'Pause crowd animation'}
        aria-describedby="crowd-scene-description"
        aria-pressed={isPaused || isReducedMotion}
        data-cast-size={castSize}
        data-ready={isReady}
        className="group relative block h-[clamp(340px,54svh,460px)] w-full cursor-pointer overflow-hidden bg-white p-0 text-left text-[#141414] select-none focus-visible:outline-2 focus-visible:outline-offset-[-4px] focus-visible:outline-[#141414] disabled:cursor-default"
      >
        {/* Layer 1: Giant Backdrop Wordmark */}
        <span
          aria-hidden="true"
          className="crowd-wordmark pointer-events-none absolute top-[6px] left-0 z-10 w-full text-center text-[clamp(100px,22.7vw,370px)] font-extrabold leading-none tracking-[-0.04em] text-[#ececec] select-none"
        >
          DHRUMIL.
        </span>

        {/* Layer 2: Back Pedestrian Canvas */}
        <canvas
          ref={backCanvasRef}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-20 h-full w-full transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Layer 3: Centered Standing Portrait */}
        {!portraitFailed && portraitSrc ? (
          <img
            ref={portraitRef}
            src={portraitSrc}
            alt=""
            aria-hidden="true"
            referrerPolicy="no-referrer"
            onError={() => setPortraitFailed(true)}
            className={`pointer-events-none absolute bottom-3 left-1/2 z-30 h-[min(365px,calc(100%-24px))] w-auto max-w-none -translate-x-1/2 object-contain object-bottom transition-opacity duration-300 select-none ${isReady ? 'opacity-100' : 'opacity-0'}`}
          />
        ) : portraitFailed ? (
          <div
            aria-hidden="true"
            className="pointer-events-none absolute bottom-3 left-1/2 z-30 flex h-[min(340px,calc(100%-24px))] w-28 -translate-x-1/2 flex-col items-center justify-end"
          >
            <div className="h-12 w-12 rounded-full border-2 border-black bg-white" />
            <div className="mt-1 h-[70%] w-20 rounded-t-xl bg-black" />
          </div>
        ) : null}

        {/* Layer 4: Front Pedestrian Canvas */}
        <canvas
          ref={frontCanvasRef}
          aria-hidden="true"
          className={`pointer-events-none absolute inset-0 z-40 h-full w-full transition-opacity duration-300 ${isReady ? 'opacity-100' : 'opacity-0'}`}
        />

        {/* Pause/Resume Affordance */}
        {!isReducedMotion && (
          <span
            aria-hidden="true"
            className={`pointer-events-none absolute right-4 bottom-3 z-50 bg-white/90 px-2 py-0.5 text-xs font-medium text-neutral-700 transition-opacity duration-200 ${isPaused ? 'opacity-100' : 'opacity-0 group-hover:opacity-100'}`}
          >
            {isPaused ? 'Paused · Click to resume' : 'Click to pause'}
          </span>
        )}
      </button>

      {/* Bottom Caption Strip */}
      <div className="mx-auto flex w-full max-w-[1280px] items-center justify-between gap-4 px-6 py-5 sm:px-10">
        <small className="text-xs font-normal tracking-[0.01em] text-[#b5b5b5]">
          You've made it to the rock bottom.
        </small>
      </div>
    </section>
  );
}
