import { useEffect, useRef } from 'react';
import Lenis from 'lenis';

interface UseLenisScrollOptions {
  enabled: boolean;
  paused?: boolean;
}

export function useLenisScroll({ enabled, paused = false }: UseLenisScrollOptions) {
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (!enabled) {
      document.documentElement.classList.remove('lenis', 'lenis-smooth', 'lenis-stopped', 'lenis-scrolling');
      return;
    }

    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    const lenis = new Lenis({
      lerp: 0.085,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1,
      autoRaf: true,
      respectReducedMotion: true,
      stopInertiaOnNavigate: true,
      anchors: {
        offset: -72,
      },
      prevent: (node) => Boolean(node.closest('[role="dialog"], [data-lenis-prevent]')),
    });

    lenisRef.current = lenis;

    const updateParallax = (scrollY: number) => {
      if (prefersReducedMotion) return;

      const vh = window.innerHeight || 1;

      const heroTargets = document.querySelectorAll<HTMLElement>('.hw-hero-parallax');
      heroTargets.forEach((el) => {
        const section = el.closest('section') ?? el;
        const rect = section.getBoundingClientRect();
        if (rect.bottom < 0 || rect.top > vh) return;
        const clampedScroll = Math.max(0, Math.min(scrollY, rect.height || vh));
        const heroOffset = clampedScroll * 0.14;
        el.style.translate = `0 ${heroOffset.toFixed(2)}px`;
      });

      const plateTargets = document.querySelectorAll<HTMLElement>('.hw-parallax');
      plateTargets.forEach((el) => {
        if (el.closest('[role="dialog"]')) return;
        const container = el.closest('figure') ?? el.parentElement ?? el;
        const rect = container.getBoundingClientRect();
        if (rect.bottom < -60 || rect.top > vh + 60) return;

        const viewportCenter = vh * 0.5;
        const rectCenter = rect.top + rect.height * 0.5;
        const normalized = Math.max(-1, Math.min(1, (rectCenter - viewportCenter) / (vh * 0.65)));
        const offset = normalized * 24;
        el.style.translate = `0 ${offset.toFixed(2)}px`;
      });
    };

    updateParallax(window.scrollY);
    const unsubscribe = lenis.on('scroll', (instance) => {
      updateParallax(instance.scroll);
    });

    return () => {
      unsubscribe();
      lenis.destroy();
      lenisRef.current = null;
      document.querySelectorAll<HTMLElement>('.hw-hero-parallax, .hw-parallax').forEach((el) => {
        el.style.translate = '';
      });
    };
  }, [enabled]);

  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;
    if (paused) {
      lenis.stop();
    } else {
      lenis.start();
    }
  }, [paused, enabled]);
}
