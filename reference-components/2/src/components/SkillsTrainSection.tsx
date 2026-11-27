import { useEffect, useRef } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';

type CarriageKind = 'box' | 'coal' | 'tank';

interface GraffitiSegment {
  lines: string[];
  x: number;
  y: number;
  fontSize: number;
  lineHeight: number;
  rotate: number;
}

interface DevTrainCarriage {
  id: string;
  kind: CarriageKind;
  alt: string;
  graffiti: GraffitiSegment[];
}

const CARRIAGE_META: Record<
  CarriageKind,
  { src: string; className: string; viewBox: string }
> = {
  box: {
    src: '/assets/ollivere/blank-box-coach.svg',
    className: 'train-box-coach',
    viewBox: '0 0 468.23 180.07',
  },
  coal: {
    src: '/assets/ollivere/blank-coal-coach.svg',
    className: 'train-coal-coach',
    viewBox: '0 0 468.33 197.12',
  },
  tank: {
    src: '/assets/ollivere/blank-tank-coach.svg',
    className: 'train-tank-coach',
    viewBox: '0 0 520.89 175.78',
  },
};

const DEV_TRAIN_CARRIAGES: DevTrainCarriage[] = [
  {
    id: 'system-design',
    kind: 'box',
    alt: "Train carriage with 'System Design' painted on the side",
    graffiti: [
      { lines: ['SYSTEM', 'DESIGN'], x: 232, y: 56, fontSize: 44, lineHeight: 44, rotate: -4 },
    ],
  },
  {
    id: 'typescript',
    kind: 'coal',
    alt: "Train carriage with 'TypeScript' painted on the side",
    graffiti: [
      { lines: ['TYPESCRIPT'], x: 234, y: 118, fontSize: 38, lineHeight: 38, rotate: -7 },
    ],
  },
  {
    id: 'frontend-backend',
    kind: 'tank',
    alt: "Train carriage with 'Frontend' and 'Backend' painted on the side",
    graffiti: [
      { lines: ['FRONT', 'END'], x: 126, y: 74, fontSize: 33, lineHeight: 34, rotate: -5 },
      { lines: ['BACK', 'END'], x: 374, y: 76, fontSize: 33, lineHeight: 34, rotate: -4 },
    ],
  },
  {
    id: 'apis-graphql',
    kind: 'coal',
    alt: "Train carriage with 'APIs & GraphQL' painted on the side",
    graffiti: [
      { lines: ['APIs &', 'GRAPHQL'], x: 234, y: 102, fontSize: 33, lineHeight: 34, rotate: -4 },
    ],
  },
  {
    id: 'cloud-devops',
    kind: 'box',
    alt: "Train carriage with 'Cloud & DevOps' painted on the side",
    graffiti: [
      { lines: ['CLOUD &', 'DEVOPS'], x: 232, y: 58, fontSize: 44, lineHeight: 44, rotate: -3 },
    ],
  },
  {
    id: 'databases',
    kind: 'box',
    alt: "Train carriage with 'Databases' painted on the side",
    graffiti: [
      { lines: ['DATABASES'], x: 232, y: 84, fontSize: 46, lineHeight: 46, rotate: -5 },
    ],
  },
  {
    id: 'testing-cicd',
    kind: 'tank',
    alt: "Train carriage with 'Testing' and 'CI/CD' painted on the side",
    graffiti: [
      { lines: ['AUTO', 'TESTING'], x: 126, y: 74, fontSize: 30, lineHeight: 33, rotate: -4 },
      { lines: ['CI / CD', 'PIPELINES'], x: 374, y: 76, fontSize: 28, lineHeight: 32, rotate: -5 },
    ],
  },
  {
    id: 'performance',
    kind: 'box',
    alt: "Train carriage with 'Performance' painted on the side",
    graffiti: [
      { lines: ['PERFORMANCE'], x: 232, y: 84, fontSize: 40, lineHeight: 40, rotate: -3 },
    ],
  },
  {
    id: 'security',
    kind: 'coal',
    alt: "Train carriage with 'Security' painted on the side",
    graffiti: [
      { lines: ['SECURITY'], x: 234, y: 118, fontSize: 40, lineHeight: 40, rotate: -6 },
    ],
  },
  {
    id: 'clean-code',
    kind: 'coal',
    alt: "Train carriage with 'Clean Code' painted on the side",
    graffiti: [
      { lines: ['CLEAN CODE'], x: 234, y: 118, fontSize: 37, lineHeight: 37, rotate: -5 },
    ],
  },
];

export function SkillsTrainSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const trainTrackRef = useRef<HTMLDivElement>(null);
  const rexBoxRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const rexContainer = rexBoxRef.current;
    if (!rexContainer) return;

    const anim: AnimationItem = lottie.loadAnimation({
      container: rexContainer,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/assets/ollivere/rex-box.json',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      },
    });

    return () => {
      anim.destroy();
    };
  }, []);

  useEffect(() => {
    const section = sectionRef.current;
    const trainTrack = trainTrackRef.current;
    if (!section || !trainTrack) return;

    let rafId: number | null = null;
    let lastTime = performance.now();
    let currentX = 0;
    let targetX = 0;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const computeTargetX = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const vw = window.innerWidth || 1440;
      const trainWidth = trainTrack.scrollWidth || 5776;

      // Exact Webflow IX2 SCROLLING_IN_VIEW (startsEntering: true, startsExiting: false)
      // Keyframe 18% -> right of viewport; Keyframe 86% -> past left edge of viewport.
      const totalDistance = rect.height + vh;
      const raw = totalDistance > 0 ? (vh - rect.top) / totalDistance : 0;
      const t = Math.max(0, Math.min(1, (raw - 0.18) / (0.86 - 0.18)));

      const startX = vw * 0.96;
      const endX = -(trainWidth + vw * 0.08);
      return startX + t * (endX - startX);
    };

    const applyTransform = (x: number) => {
      trainTrack.style.transform = `translate3d(${x.toFixed(2)}px, 0, 0)`;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (prefersReducedMotion) {
        currentX = targetX;
      } else {
        const alpha = 1 - Math.exp(-8.5 * dt);
        currentX += (targetX - currentX) * alpha;
      }

      if (Math.abs(targetX - currentX) < 0.25) {
        currentX = targetX;
        applyTransform(currentX);
        rafId = null;
        return;
      }

      applyTransform(currentX);
      rafId = requestAnimationFrame(tick);
    };

    const startLoop = () => {
      if (rafId === null) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    const handleScrollOrResize = () => {
      targetX = computeTargetX();
      startLoop();
    };

    targetX = computeTargetX();
    currentX = targetX;
    applyTransform(currentX);

    window.addEventListener('scroll', handleScrollOrResize, { passive: true });
    window.addEventListener('resize', handleScrollOrResize, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScrollOrResize);
      window.removeEventListener('resize', handleScrollOrResize);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  return (
    <section
      ref={sectionRef}
      className="skills-section"
      aria-label="Software Developer Skills Graffiti Freight Train"
    >
      {/* Shared subtle SVG ink-roughness filter for authentic hand-painted graffiti edges */}
      <svg
        width="0"
        height="0"
        style={{ position: 'absolute' }}
        aria-hidden="true"
      >
        <defs>
          <filter id="graffiti-ink-roughness" x="-10%" y="-10%" width="120%" height="120%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.065"
              numOctaves="2"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="2.4"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      <div className="experience-intro-and-train-wrapper">
        <div ref={trainTrackRef} className="skills-train-wrapper">
          <img
            src="/assets/ollivere/train-cab.svg"
            alt="Train locomotive pulling a series of carriages with software engineering skills painted in graffiti style"
            className="train-cab"
            draggable={false}
            referrerPolicy="no-referrer"
          />

          {DEV_TRAIN_CARRIAGES.map((carriage) => {
            const meta = CARRIAGE_META[carriage.kind];
            return (
              <div
                key={carriage.id}
                className={`train-carriage-shell ${meta.className}`}
                role="img"
                aria-label={carriage.alt}
              >
                <img
                  src={meta.src}
                  alt=""
                  aria-hidden="true"
                  className="train-carriage-img"
                  draggable={false}
                  referrerPolicy="no-referrer"
                />
                <svg
                  className="train-graffiti-overlay"
                  viewBox={meta.viewBox}
                  aria-hidden="true"
                >
                  {carriage.graffiti.map((seg, idx) => (
                    <g
                      key={idx}
                      transform={`rotate(${seg.rotate} ${seg.x} ${seg.y})`}
                      filter="url(#graffiti-ink-roughness)"
                    >
                      {seg.lines.map((line, lineIdx) => (
                        <text
                          key={lineIdx}
                          x={seg.x}
                          y={seg.y + lineIdx * seg.lineHeight}
                          textAnchor="middle"
                          fontSize={seg.fontSize}
                          className="train-graffiti-text"
                        >
                          {line}
                        </text>
                      ))}
                    </g>
                  ))}
                </svg>
              </div>
            );
          })}

          <div
            ref={rexBoxRef}
            className="train-rex-box"
            role="img"
            aria-label="Animated T-Rex riding in the final train boxcar"
          />
        </div>
      </div>
    </section>
  );
}
