import { useEffect, useRef, useState } from 'react';
import { motion, useReducedMotion } from 'motion/react';

interface OSTransitionOverlayProps {
  onComplete: () => void;
}

const SWEEP_DURATION_S = 1.25;
const TOTAL_BOOT_DURATION_MS = 2250;
const SWEEP_EASE = [0.28, 0.65, 0.42, 1] as const;

export function OSTransitionOverlay({ onComplete }: OSTransitionOverlayProps) {
  const prefersReducedMotion = useReducedMotion();
  const completedRef = useRef(false);
  const [postStage, setPostStage] = useState(0);

  const finishTransition = () => {
    if (completedRef.current) return;
    completedRef.current = true;
    onComplete();
  };

  useEffect(() => {
    if (prefersReducedMotion) {
      finishTransition();
      return;
    }

    const t1 = window.setTimeout(() => setPostStage(1), 520);
    const t2 = window.setTimeout(() => setPostStage(2), 1080);
    const t3 = window.setTimeout(() => setPostStage(3), 1620);
    const doneTimer = window.setTimeout(finishTransition, TOTAL_BOOT_DURATION_MS);

    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      window.clearTimeout(t3);
      window.clearTimeout(doneTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [prefersReducedMotion]);

  if (prefersReducedMotion) {
    return <div className="fixed inset-0 z-[400] bg-[#000000]" aria-hidden="true" />;
  }

  return (
    <div
      aria-hidden="true"
      className="pointer-events-auto fixed inset-0 z-[400] h-dvh w-screen overflow-hidden rounded-none font-mono select-none"
    >
      {/* Top-to-bottom raw CRT #000000 BIOS POST curtain */}
      <motion.div
        initial={{ clipPath: 'inset(0 0 100% 0)' }}
        animate={{ clipPath: 'inset(0 0 0% 0)' }}
        transition={{ duration: SWEEP_DURATION_S, ease: SWEEP_EASE }}
        className="absolute inset-0 rounded-none bg-[#000000] text-[#d4d4d4]"
        style={{ textShadow: '0 0 6px rgba(255, 255, 255, 0.3)' }}
      >
        {/* Subtle horizontal CRT scanlines */}
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            backgroundImage:
              'repeating-linear-gradient(0deg, rgba(255,255,255,0.04) 0px, rgba(255,255,255,0.04) 1px, transparent 1px, transparent 3px)',
          }}
        />

        <div className="relative flex h-full w-full flex-col justify-between p-6 md:p-12">
          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#525252] pb-2 text-xs text-[#a3a3a3]">
            <span>TRINITY BIOS v1.04 (C) DHRUMIL ASODIYA</span>
            <span className="tabular-nums">0640K BASE / 3072M EXT</span>
          </div>

          <div className="my-auto max-w-2xl space-y-2 text-xs leading-relaxed sm:text-sm">
            <p className="text-[#f5f5f5]">
              Phoenix-Trinity BIOS POST — Hardware Abstraction Check
            </p>
            <p className="text-[#a3a3a3]">
              CPU : Portfolio Kernel x86_64 / ARM64 Adaptive Bridge
            </p>
            <p className="text-[#d4d4d4]">
              Memory Test : {postStage >= 1 ? '3145728K OK' : 'Testing Extended Memory...'}
            </p>
            {postStage >= 1 && (
              <p className="text-[#d4d4d4]">
                Pri. Master : TRINITY_VFS RW Store (/about.txt, /projects/ · 5 entries)
              </p>
            )}
            {postStage >= 2 && (
              <p className="text-[#f5f5f5]">
                GRUB Loading stage1.5....................................
              </p>
            )}
            {postStage >= 3 && (
              <p className="text-[#f5f5f5]">
                Booting GNU GRUB interactive selector...
                <span className="ml-1 inline-block h-3.5 w-2 animate-pulse bg-[#f5f5f5] align-middle" />
              </p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-[#525252] pt-2 text-[11px] text-[#737373]">
            <span>EXEC /OS :: TRINITY_BOOT</span>
            <span>WAIT STAGE 2...</span>
          </div>
        </div>
      </motion.div>

      {/* Leading glitched horizontal scanline sweeping top-to-bottom */}
      <motion.div
        initial={{ y: -18, opacity: 0.95 }}
        animate={{ y: (typeof window !== 'undefined' ? window.innerHeight : 900) + 20, opacity: [0.95, 1, 1, 0] }}
        transition={{
          y: { duration: SWEEP_DURATION_S, ease: SWEEP_EASE },
          opacity: { duration: SWEEP_DURATION_S, times: [0, 0.15, 0.92, 1] },
        }}
        className="pointer-events-none absolute top-0 left-0 h-[36px] w-screen"
      >
        <motion.div
          animate={{
            x: [0, -14, 18, -6, 22, -20, 10, -12, 16, -18, 12, -8, 0],
            skewX: [0, 0, 0, 16, 0, 0, -14, 0, 0, 12, 0, 0, 0],
            scaleX: [1, 1.03, 0.98, 1, 1.04, 0.97, 1, 1.02, 0.99, 1, 1.03, 1, 1],
          }}
          transition={{
            duration: SWEEP_DURATION_S,
            ease: 'linear',
            times: [0, 0.08, 0.16, 0.24, 0.32, 0.4, 0.48, 0.56, 0.64, 0.72, 0.8, 0.88, 1],
          }}
          className="relative h-full w-full"
        >
          {/* Monochrome trailing raster */}
          <div
            className="absolute inset-x-0 top-0 h-[18px]"
            style={{
              background:
                'linear-gradient(to bottom, transparent, rgba(255, 255, 255, 0.2) 55%, rgba(255, 255, 255, 0.85))',
            }}
          />

          {/* Primary crisp horizontal CRT beam */}
          <div
            className="absolute inset-x-0 top-[17px] h-[2px]"
            style={{
              background: '#ffffff',
              boxShadow: '0 0 12px rgba(255, 255, 255, 0.9), 0 0 3px #ffffff',
            }}
          />

          {/* Glitched horizontal monochrome + subtle aberration slices */}
          <div className="absolute top-[13px] left-[4%] h-[3px] w-[19%] bg-[#000000]" />
          <div className="absolute top-[15px] left-[16%] h-[2px] w-[24%] bg-[#e5e5e5]" />
          <div className="absolute top-[19px] left-[31%] h-[3px] w-[15%] bg-[#a3a3a3]" />
          <div className="absolute top-[14px] left-[52%] h-[2px] w-[18%] bg-[#ffffff]" />
          <div className="absolute top-[18px] left-[64%] h-[4px] w-[14%] bg-[#000000]" />
          <div className="absolute top-[16px] right-[5%] h-[2px] w-[21%] bg-[#d4d4d4]" />
          <div className="absolute top-[21px] left-[8%] h-[2px] w-[32%] bg-[#737373]" />
          <div className="absolute top-[22px] right-[18%] h-[2px] w-[24%] bg-[#e5e5e5]/75" />
        </motion.div>
      </motion.div>
    </div>
  );
}
