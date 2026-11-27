import { useCallback, useEffect, useRef, useState } from 'react';
import { flushSync } from 'react-dom';
import { ChatWidget } from './components/ChatWidget';
import { ContactModal } from './components/ContactModal';
import { DownloadsSection } from './components/DownloadsSection';
import { FaqSection } from './components/FaqSection';
import { FeaturesSection } from './components/FeaturesSection';
import { Footers } from './components/Footers';
import { HeroSection } from './components/HeroSection';
import { Navbar } from './components/Navbar';
import { OSFold } from './components/os/OSFold';
import { OSTransitionOverlay } from './components/os/OSTransitionOverlay';
import { PortalSection } from './components/PortalSection';
import { ScrollProgressBar } from './components/ScrollProgressBar';
import { SkillsSection } from './components/SkillsSection';
import { ThemeFold } from './components/ThemeFold';
import { ThemeScanline } from './components/ThemeScanline';
import { TimelineSection } from './components/TimelineSection';
import { useLenisScroll } from './hooks/useLenisScroll';
import { useOSStore } from './os/useOSStore';
import { OSPage } from './pages/OSPage';

type AppRoute = '/' | '/os';

function readCurrentRoute(): AppRoute {
  if (typeof window === 'undefined') return '/';
  return window.location.pathname.startsWith('/os') ? '/os' : '/';
}

function applyThemeToRoot(nextTheme: 'light' | 'dark') {
  const root = document.documentElement;
  root.setAttribute('data-marketing-theme', nextTheme);
  if (nextTheme === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
}

export default function App() {
  const [route, setRoute] = useState<AppRoute>(readCurrentRoute);
  const [theme, setTheme] = useState<'light' | 'dark'>('dark');
  const [scanlineState, setScanlineState] = useState<{
    active: boolean;
    targetTheme: 'light' | 'dark';
    fallback: boolean;
  }>({ active: false, targetTheme: 'dark', fallback: false });

  const [contactOpen, setContactOpen] = useState(false);
  const [contactTopic, setContactTopic] = useState('General Inquiry');
  const [highlightedProjectId, setHighlightedProjectId] = useState<string | null>(null);
  const [osTransitioning, setOsTransitioning] = useState(false);

  const cleanupTimerRef = useRef<number | null>(null);
  const activeTransitionRef = useRef<{ skipTransition?: () => void } | null>(null);
  const hardResetOS = useOSStore((s) => s.hardReset);

  useLenisScroll({
    enabled: route === '/',
    paused: contactOpen || osTransitioning,
  });

  const navigate = useCallback(
    (nextRoute: AppRoute) => {
      setOsTransitioning(false);
      if (nextRoute === '/') {
        hardResetOS();
      }
      if (window.location.pathname !== nextRoute) {
        window.history.pushState({}, '', nextRoute);
      }
      setRoute(nextRoute);
      window.scrollTo({ top: 0, behavior: 'auto' });
    },
    [hardResetOS]
  );

  const triggerBootToOS = useCallback(() => {
    if (route !== '/' || osTransitioning) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      navigate('/os');
      return;
    }
    setOsTransitioning(true);
  }, [route, osTransitioning, navigate]);

  const handleOSTransitionComplete = useCallback(() => {
    navigate('/os');
  }, [navigate]);

  useEffect(() => {
    const onPopState = () => {
      const next = readCurrentRoute();
      if (next === '/') {
        hardResetOS();
      }
      setRoute(next);
    };
    window.addEventListener('popstate', onPopState);
    return () => window.removeEventListener('popstate', onPopState);
  }, [hardResetOS]);

  const clearScanline = useCallback(() => {
    if (cleanupTimerRef.current !== null) {
      window.clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = null;
    }
    document.documentElement.removeAttribute('data-theme-wiping-fallback');
    setScanlineState((prev) => (prev.active ? { ...prev, active: false } : prev));
  }, []);

  const toggleTheme = useCallback(() => {
    const nextTheme: 'light' | 'dark' = theme === 'light' ? 'dark' : 'light';
    const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

    if (cleanupTimerRef.current !== null) {
      window.clearTimeout(cleanupTimerRef.current);
      cleanupTimerRef.current = null;
    }

    if (prefersReducedMotion) {
      applyThemeToRoot(nextTheme);
      setTheme(nextTheme);
      return;
    }

    type ViewTransitionLike = {
      finished?: Promise<void>;
      ready?: Promise<void>;
      updateCallbackDone?: Promise<void>;
      skipTransition?: () => void;
    };

    const docWithVT = document as Document & {
      startViewTransition?: (callback: () => void) => ViewTransitionLike;
    };

    const runFallbackTransition = () => {
      document.documentElement.setAttribute('data-theme-wiping-fallback', 'true');
      applyThemeToRoot(nextTheme);
      setTheme(nextTheme);
      setScanlineState({ active: true, targetTheme: nextTheme, fallback: true });
      cleanupTimerRef.current = window.setTimeout(clearScanline, 1160);
    };

    const wasInFlight = activeTransitionRef.current !== null;
    if (wasInFlight && activeTransitionRef.current) {
      const stale = activeTransitionRef.current;
      activeTransitionRef.current = null;
      try {
        stale.skipTransition?.();
      } catch {
        // Ignore skipTransition errors on interrupted transitions
      }
      clearScanline();
    }

    if (
      typeof docWithVT.startViewTransition === 'function' &&
      !wasInFlight &&
      document.visibilityState === 'visible'
    ) {
      try {
        const transition = docWithVT.startViewTransition(() => {
          applyThemeToRoot(nextTheme);
          flushSync(() => {
            setTheme(nextTheme);
            setScanlineState({ active: true, targetTheme: nextTheme, fallback: false });
          });
        });

        activeTransitionRef.current = transition as { skipTransition?: () => void };

        // Prevent unhandled rejections if the browser skips the transition
        transition.updateCallbackDone?.catch(() => {});
        transition.ready?.catch(() => {});

        cleanupTimerRef.current = window.setTimeout(clearScanline, 1220);
        Promise.resolve(transition.finished)
          .catch(() => {})
          .finally(() => {
            if (activeTransitionRef.current === transition) {
              activeTransitionRef.current = null;
              clearScanline();
            }
          });
        return;
      } catch {
        activeTransitionRef.current = null;
      }
    }

    // Fallback for rapid re-toggles, hidden tabs, or browsers without View Transitions API
    runFallbackTransition();
  }, [theme, clearScanline]);

  const openContact = useCallback((topic = 'General Inquiry') => {
    setContactTopic(topic);
    setContactOpen(true);
  }, []);

  useEffect(() => {
    applyThemeToRoot(theme);
  }, [theme]);

  useEffect(() => {
    return () => {
      if (cleanupTimerRef.current !== null) {
        window.clearTimeout(cleanupTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (route !== '/') return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) {
        return;
      }
      const target = e.target as HTMLElement | null;
      if (target?.isContentEditable || target?.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }
      if (e.key === 'x' || e.key === 'X') {
        e.preventDefault();
        toggleTheme();
        return;
      }
      if ((e.key === 'o' || e.key === 'O') && !contactOpen) {
        e.preventDefault();
        triggerBootToOS();
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [route, contactOpen, toggleTheme, triggerBootToOS]);

  if (route === '/os') {
    return <OSPage onExitToPortfolio={() => navigate('/')} />;
  }

  return (
    <div
      className="bg-core text-core-fg antialiased"
      style={{ backgroundColor: 'var(--color-core)', color: 'var(--color-core-fg)' }}
    >
      <div className="core-web hw-teams-page my-0 min-h-dvh w-full bg-[var(--core-primary)] text-[var(--core-white)]">
        <div data-marketing-page="" className="bg-core relative mx-auto min-h-dvh w-full md:w-[var(--hw-teams-page-w)]">
          <ScrollProgressBar />
          <ThemeScanline
            active={scanlineState.active}
            targetTheme={scanlineState.targetTheme}
            fallbackMode={scanlineState.fallback}
          />
          {/* Top-right Page Fold Theme Switcher */}
          <ThemeFold theme={theme} onToggle={toggleTheme} />

          <span aria-hidden="true" id="top" />
          <Navbar onOpenContact={openContact} />

          <main id="hpv2-main" tabIndex={-1}>
            <HeroSection onOpenContact={openContact} />
            <DownloadsSection />
            <FeaturesSection
              onOpenContact={openContact}
              highlightedProjectId={highlightedProjectId}
            />
            <SkillsSection onSelectProject={setHighlightedProjectId} />
            <TimelineSection />
            <FaqSection />
            <PortalSection onOpenContact={openContact} />
          </main>

          <Footers theme={theme} onOpenContact={openContact} />

          {/* Bottom-right Page Fold Trinity OS Trigger */}
          <OSFold onBootOS={triggerBootToOS} />

          {/* Framer Motion glitched scanline transition overlay to /os */}
          {osTransitioning && <OSTransitionOverlay onComplete={handleOSTransitionComplete} />}

          <ContactModal
            open={contactOpen}
            initialTopic={contactTopic}
            onClose={() => setContactOpen(false)}
          />

          {/* Chat Widget (floating bubble, bottom-right) */}
          <ChatWidget />

          {/* 5px fixed viewport frame */}
          <div aria-hidden="true" className="hw-frame" />
        </div>
      </div>
    </div>
  );
}


