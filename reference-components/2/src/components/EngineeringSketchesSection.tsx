import { useEffect, useRef, useState } from 'react';
import { X } from 'lucide-react';

interface SketchSpread {
  id: string;
  src: string;
  alt: string;
  cropEdge?: boolean;
}

const SKETCH_SPREADS: SketchSpread[] = [
  {
    id: 'architecture-flow',
    src: '/src/assets/images/dev_sketch_architecture_flow_1795758894769.jpg',
    alt: 'Hand-drawn software engineering sketchbook spread showing numbered application flows and an API backend architecture diagram with microservices, auth, load balancer, and message queues',
    cropEdge: true,
  },
  {
    id: 'systems-pipeline',
    src: '/src/assets/images/dev_sketch_systems_pipeline_1795758893996.jpg',
    alt: 'Hand-drawn software engineering sketchbook spread showing microservice container clusters, server health meters, highlighted data blocks, and a three-stage CI/CD build-bot evolution',
    cropEdge: false,
  },
  {
    id: 'dev-workflow-overview',
    src: '/assets/aistudio/image_f617e9c9.png',
    alt: 'Hand-drawn software developer concept sketch covering Dev & Deploy Flow, System Architecture, Debugging & Sprints with rubber duck and zero bugs golden cube, and Dev Setup & Evolution',
    cropEdge: false,
  },
];

export function EngineeringSketchesSection() {
  const sectionRef = useRef<HTMLElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);
  const [activeSpread, setActiveSpread] = useState<SketchSpread | null>(null);

  // Replicates Ollivere HIW scroll progress bar (scaleX 0 -> 1 across section scroll)
  useEffect(() => {
    const section = sectionRef.current;
    const bar = progressBarRef.current;
    if (!section || !bar) return;

    let rafId: number | null = null;
    let lastTime = performance.now();
    let current = 0;
    let target = 0;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const computeTarget = () => {
      const rect = section.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const total = rect.height;
      if (total <= 0) return 0;
      const raw = (vh * 0.5 - rect.top) / total;
      return Math.max(0, Math.min(1, raw));
    };

    const applyBar = (v: number) => {
      bar.style.transform = `scale3d(${v.toFixed(4)}, 1, 1)`;
    };

    const tick = (now: number) => {
      const dt = Math.min(0.1, (now - lastTime) / 1000);
      lastTime = now;

      if (prefersReducedMotion) {
        current = target;
      } else {
        const alpha = 1 - Math.exp(-8.5 * dt);
        current += (target - current) * alpha;
      }

      if (Math.abs(target - current) < 0.0005) {
        current = target;
        applyBar(current);
        rafId = null;
        return;
      }

      applyBar(current);
      rafId = requestAnimationFrame(tick);
    };

    const onScroll = () => {
      target = computeTarget();
      if (rafId === null) {
        lastTime = performance.now();
        rafId = requestAnimationFrame(tick);
      }
    };

    target = computeTarget();
    current = target;
    applyBar(current);

    window.addEventListener('scroll', onScroll, { passive: true });
    window.addEventListener('resize', onScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', onScroll);
      window.removeEventListener('resize', onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  // Close lightbox on Escape key
  useEffect(() => {
    if (!activeSpread) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setActiveSpread(null);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeSpread]);

  return (
    <section
      ref={sectionRef}
      className="sketches-section"
      aria-label="Hand-drawn Software Architecture & Engineering Process Sketches"
    >
      <div className="sketches-progress-track" aria-hidden="true">
        <div ref={progressBarRef} className="scroll-progress-bar" />
      </div>

      <div className="hiw-sketches">
        {SKETCH_SPREADS.map((spread) => (
          <button
            key={spread.id}
            type="button"
            className="sketch-spread-button"
            onClick={() => setActiveSpread(spread)}
            aria-label={`Inspect sketch: ${spread.alt}`}
          >
            <img
              src={spread.src}
              alt={spread.alt}
              loading="lazy"
              referrerPolicy="no-referrer"
              className={`sketch-spread-img ${
                spread.cropEdge
                  ? 'sketch-spread-img--crop-edge'
                  : 'sketch-spread-img--clean'
              }`}
            />
          </button>
        ))}
      </div>

      {activeSpread && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-[#f7f7ef]/95 p-4 sm:p-8 backdrop-blur-xs"
          role="dialog"
          aria-modal="true"
          aria-label="Expanded engineering sketch"
          onClick={() => setActiveSpread(null)}
        >
          <button
            type="button"
            onClick={() => setActiveSpread(null)}
            className="fixed top-5 right-5 z-50 flex h-11 w-11 items-center justify-center rounded-full border-2 border-[#252222] bg-[#f7f7ef] text-[#252222] transition-transform hover:scale-105 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#252222]"
            aria-label="Close expanded sketch"
          >
            <X className="h-5 w-5" />
          </button>
          <div
            className="max-h-[90vh] max-w-[95vw] overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <img
              src={activeSpread.src}
              alt={activeSpread.alt}
              referrerPolicy="no-referrer"
              className={`max-h-[88vh] w-auto object-contain mix-blend-multiply ${
                activeSpread.cropEdge ? 'scale-[1.06]' : ''
              }`}
            />
          </div>
        </div>
      )}
    </section>
  );
}
