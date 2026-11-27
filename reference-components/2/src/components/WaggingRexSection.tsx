import { useEffect, useRef, useState } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';

export function WaggingRexSection() {
  const rexLottieRef = useRef<HTMLDivElement>(null);
  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  const [isHovered, setIsHovered] = useState(false);
  const [isLatched, setIsLatched] = useState(false);
  const [hasInteracted, setHasInteracted] = useState(false);
  const [rexScale, setRexScale] = useState(1);

  const isPoppedUp = isHovered || isLatched;

  // Load autoplaying looping wagging-rex Lottie animation
  useEffect(() => {
    const container = rexLottieRef.current;
    if (!container) return;

    const anim: AnimationItem = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/assets/ollivere/wagging-rex-2.json',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      },
    });

    return () => {
      anim.destroy();
    };
  }, []);

  // Keep the 600px T-Rex and its pixel-locked eyeballs scaled cleanly on narrow viewports
  useEffect(() => {
    const updateScale = () => {
      const vw = window.innerWidth;
      setRexScale(vw < 600 ? vw / 600 : 1);
    };
    updateScale();
    window.addEventListener('resize', updateScale, { passive: true });
    return () => window.removeEventListener('resize', updateScale);
  }, []);

  // Exact Webflow IX2 Mouse-X eyeball rotation (-88deg at 0% -> +75deg at 100%, smoothing: 50, resting: 50%)
  useEffect(() => {
    let rafId: number | null = null;
    let lastTime = performance.now();
    let currentNormX = 0.5;
    let targetNormX = 0.5;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const applyEyeRotation = (normX: number) => {
      // Keyframe 0% => -88deg, Keyframe 100% => +75deg
      const angle = -88 + normX * (75 - -88);
      const transform = `rotateZ(${angle.toFixed(2)}deg)`;
      if (leftEyeRef.current) leftEyeRef.current.style.transform = transform;
      if (rightEyeRef.current) rightEyeRef.current.style.transform = transform;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (prefersReducedMotion) {
        currentNormX = targetNormX;
      } else {
        const alpha = 1 - Math.exp(-8.5 * dt);
        currentNormX += (targetNormX - currentNormX) * alpha;
      }

      if (Math.abs(targetNormX - currentNormX) < 0.0005) {
        currentNormX = targetNormX;
        applyEyeRotation(currentNormX);
        rafId = null;
        return;
      }

      applyEyeRotation(currentNormX);
      rafId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (rafId === null) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    const handlePointerMove = (clientX: number) => {
      const vw = window.innerWidth || 1;
      targetNormX = Math.max(0, Math.min(1, clientX / vw));
      startLoop();
    };

    const onMouseMove = (e: MouseEvent) => handlePointerMove(e.clientX);
    const onTouchMove = (e: TouchEvent) => {
      if (e.touches.length > 0) handlePointerMove(e.touches[0].clientX);
    };

    // Set initial resting eye angle (50% viewport X -> looking straight up at button)
    applyEyeRotation(currentNormX);

    window.addEventListener('mousemove', onMouseMove, { passive: true });
    window.addEventListener('touchmove', onTouchMove, { passive: true });

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      window.removeEventListener('touchmove', onTouchMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Exact Webflow IX2 keyframes for .wagging-rex-wrapper:
  // Initial: translateY(248px)
  // Mouse Over (a-51): delay 200ms, duration 400ms, outQuad -> translateY(0px)
  // Mouse Out (a-52): delay 0ms, duration 500ms, inQuad -> translateY(263px)
  const translateY = isPoppedUp ? 0 : hasInteracted ? 263 : 248;
  const transition = isPoppedUp
    ? 'transform 400ms cubic-bezier(0.25, 0.46, 0.45, 0.94) 200ms'
    : 'transform 500ms cubic-bezier(0.55, 0.085, 0.68, 0.53) 0ms';

  return (
    <section
      className="actions-section"
      aria-label="Let's work together interactive T-Rex"
    >
      <button
        type="button"
        className="cta-button-1"
        data-active={isLatched ? 'true' : 'false'}
        aria-pressed={isLatched}
        onMouseEnter={() => {
          setHasInteracted(true);
          setIsHovered(true);
        }}
        onMouseLeave={() => {
          setIsHovered(false);
        }}
        onFocus={() => {
          setHasInteracted(true);
          setIsHovered(true);
        }}
        onBlur={() => {
          setIsHovered(false);
        }}
        onClick={() => {
          setHasInteracted(true);
          setIsLatched((prev) => !prev);
        }}
      >
        <span className="get-in-touch-link">Let&apos;s work together</span>
      </button>

      <div
        className="wagging-rex-scale-container"
        style={{
          height: `${Math.round(340 * rexScale)}px`,
        }}
      >
        <div
          style={{
            transform: rexScale < 1 ? `scale(${rexScale})` : undefined,
            transformOrigin: 'bottom center',
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <div
            className="wagging-rex-wrapper"
            style={{
              transform: `translate3d(0, ${translateY}px, 0)`,
              transition,
            }}
          >
            <div ref={leftEyeRef} className="eyeball" aria-hidden="true">
              <div className="pupil" />
            </div>
            <div
              ref={rightEyeRef}
              className="eyeball second-eye"
              aria-hidden="true"
            >
              <div className="pupil" />
            </div>
            <div
              ref={rexLottieRef}
              className="wagging-rex"
              role="img"
              aria-label="Illustrated T-Rex peeking up with eyes following the cursor and wagging its tongue"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
