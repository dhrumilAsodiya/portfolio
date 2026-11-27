import { useEffect, useRef } from 'react';
import lottie, { type AnimationItem } from 'lottie-web';

interface StrengthItem {
  id: string;
  label: string;
}

const DEVELOPER_STRENGTHS: StrengthItem[] = [
  {
    id: 'architecture',
    label: 'System architecture — building software that scales cleanly and lasts.',
  },
  {
    id: 'fullstack',
    label: 'End-to-end web & app engineering with TypeScript, React & Node.',
  },
  {
    id: 'discovery',
    label: 'Technical discovery & RFCs to align teams before shipping code.',
  },
  {
    id: 'backend',
    label: 'APIs, distributed backends & resilient cloud data systems.',
  },
  {
    id: 'testing',
    label: 'Performance tuning, automated testing & rock-solid CI/CD pipelines.',
  },
  {
    id: 'frontend-craft',
    label: 'Interactive frontends, motion craft & creative code (like this site).',
  },
];

function BicepStrengthItem({ label }: { label: string }) {
  const itemRef = useRef<HTMLButtonElement>(null);
  const lottieRef = useRef<HTMLDivElement>(null);
  const animRef = useRef<AnimationItem | null>(null);
  const isFlexedRef = useRef(false);

  useEffect(() => {
    const container = lottieRef.current;
    const item = itemRef.current;
    if (!container || !item) return;

    const anim = lottie.loadAnimation({
      container,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: '/assets/ollivere/bicep-icon.json',
      rendererSettings: {
        preserveAspectRatio: 'xMidYMid meet',
      },
    });
    animRef.current = anim;

    const prefersReducedMotion = window.matchMedia(
      '(prefers-reduced-motion: reduce)'
    ).matches;

    const flexForward = () => {
      if (isFlexedRef.current) return;
      isFlexedRef.current = true;
      if (prefersReducedMotion) {
        anim.goToAndStop(Math.max(0, anim.totalFrames - 1), true);
      } else {
        anim.setDirection(1);
        anim.play();
      }
    };

    const flexReverse = () => {
      if (!isFlexedRef.current) return;
      isFlexedRef.current = false;
      if (prefersReducedMotion) {
        anim.goToAndStop(0, true);
      } else {
        anim.setDirection(-1);
        anim.play();
      }
    };

    // Replicates Webflow IX2 SCROLL_INTO_VIEW (scrollOffsetValue: 50%) & SCROLL_OUT_OF_VIEW
    const checkScrollTrigger = () => {
      const rect = item.getBoundingClientRect();
      const vh = window.innerHeight || 1;
      const enteredZone = rect.top <= vh * 0.62 && rect.bottom >= vh * 0.12;
      if (enteredZone) {
        flexForward();
      } else {
        flexReverse();
      }
    };

    anim.addEventListener('DOMLoaded', checkScrollTrigger);
    window.addEventListener('scroll', checkScrollTrigger, { passive: true });
    window.addEventListener('resize', checkScrollTrigger, { passive: true });

    return () => {
      window.removeEventListener('scroll', checkScrollTrigger);
      window.removeEventListener('resize', checkScrollTrigger);
      anim.destroy();
      animRef.current = null;
    };
  }, []);

  const handleManualFlex = () => {
    const anim = animRef.current;
    if (!anim) return;
    if (isFlexedRef.current) {
      isFlexedRef.current = false;
      anim.setDirection(-1);
      anim.play();
    } else {
      isFlexedRef.current = true;
      anim.setDirection(1);
      anim.play();
    }
  };

  return (
    <button
      ref={itemRef}
      type="button"
      className="strength-item-wrapper"
      onMouseEnter={() => {
        const anim = animRef.current;
        if (!anim) return;
        isFlexedRef.current = true;
        anim.setDirection(1);
        anim.play();
      }}
      onClick={handleManualFlex}
    >
      <div
        ref={lottieRef}
        className="bicep-icon"
        aria-hidden="true"
      />
      <p className="dark-reg-text-m centre">{label}</p>
    </button>
  );
}

export function ThingsIDoSection() {
  return (
    <section className="things-i-do-section" aria-labelledby="things-i-do-heading">
      <h2 id="things-i-do-heading" className="dark-reg-text-l process-intro">
        Things I do
      </h2>

      <div className="strengths-wrapper">
        {DEVELOPER_STRENGTHS.map((item) => (
          <BicepStrengthItem key={item.id} label={item.label} />
        ))}
      </div>
    </section>
  );
}
