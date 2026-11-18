import { useEffect, useRef } from 'react';

export function ScrollProgressBar() {
  const fillRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let frameId: number | null = null;

    const updateProgress = () => {
      frameId = null;
      const el = fillRef.current;
      if (!el) return;
      const doc = document.documentElement;
      const maxScroll = doc.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(1, Math.max(0, window.scrollY / maxScroll)) : 0;
      el.style.transform = `scaleX(${progress})`;
    };

    const scheduleUpdate = () => {
      if (frameId !== null) return;
      frameId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener('scroll', scheduleUpdate, { passive: true });
    window.addEventListener('resize', scheduleUpdate, { passive: true });

    return () => {
      window.removeEventListener('scroll', scheduleUpdate);
      window.removeEventListener('resize', scheduleUpdate);
      if (frameId !== null) {
        window.cancelAnimationFrame(frameId);
      }
    };
  }, []);

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-x-[var(--hw-frame,5px)] top-[var(--hw-frame,5px)] z-[94] h-[2px] bg-transparent"
    >
      <div
        ref={fillRef}
        className="h-full w-full origin-left bg-[var(--core-color-blue)] opacity-90 will-change-transform dark:bg-[var(--marketing-dark-link)]"
        style={{ transform: 'scaleX(0)' }}
      />
    </div>
  );
}

