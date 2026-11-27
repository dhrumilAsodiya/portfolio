import { useEffect, useRef } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';

export function HeroBiteSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const lottieContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const container = lottieContainerRef.current;
    const section = sectionRef.current;
    if (!container || !section) return;

    let anim: AnimationItem | null = null;
    let rafId: number | null = null;
    let lastTime = performance.now();
    let currentProgress = 0;
    let targetProgress = 0;
    let isReady = false;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const computeTargetProgress = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      // Webflow IX2 SCROLLING_IN_VIEW (startsEntering: true, startsExiting: false)
      // At scrollY = 0 for a 300vh section, raw = 100vh / 400vh = 0.25.
      // At end of sticky hold (scrollY = 200vh), raw = 300vh / 400vh = 0.75.
      const totalDistance = rect.height + vh;
      const raw = totalDistance > 0 ? (vh - rect.top) / totalDistance : 0;
      const mapped = (raw - 0.25) / (0.75 - 0.25);
      return Math.max(0, Math.min(1, mapped));
    };

    const applyFrame = (progress: number) => {
      if (!anim || !isReady) return;
      const maxFrame = Math.max(0, anim.totalFrames - 1);
      anim.goToAndStop(progress * maxFrame, true);
    };

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (prefersReducedMotion) {
        currentProgress = targetProgress;
      } else {
        // Matches Webflow IX2 smoothing: 50 damped interpolation
        const alpha = 1 - Math.exp(-8.5 * dt);
        currentProgress += (targetProgress - currentProgress) * alpha;
      }

      if (Math.abs(targetProgress - currentProgress) < 0.00025) {
        currentProgress = targetProgress;
        applyFrame(currentProgress);
        rafId = null;
        return;
      }

      applyFrame(currentProgress);
      rafId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (rafId === null) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    const handleScrollOrResize = () => {
      targetProgress = computeTargetProgress();
      startLoop();
    };

    anim = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: '/assets/ollivere/t-rex-05.json',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
        progressiveLoad: false,
      },
    });

    anim.addEventListener('DOMLoaded', () => {
      isReady = true;
      targetProgress = computeTargetProgress();
      currentProgress = targetProgress;
      applyFrame(currentProgress);
    });

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
      if (anim) anim.destroy();
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      id="start"
      className="hero-section"
      aria-label="Great Design, No Nonsense — T-Rex Bite Animation"
    >
      <div className="hero-wrapper">
        <div
          ref={lottieContainerRef}
          className="t-rex-animation-large-screens"
          role="img"
          aria-label="Illustrated T-Rex biting the word Nonsense with blood splatter as you scroll"
        />
      </div>
    </section>
  );
}
