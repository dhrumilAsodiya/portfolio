import { useState } from 'react';
import { ArrowLeft, Moon, RotateCcw, Sun } from 'lucide-react';
import MarkoSpider from '../components/MarkoSpider';

interface SpiderPageProps {
  onNavigateCrowd: () => void;
}

const BEHAVIOR_NOTES = [
  {
    index: '01.',
    title: 'Pendulum & silk thread',
    body: 'Drops smoothly from the top-right corner on a 1px silk thread while swaying continuously between -2.5° and +2.5°. The corner cobwebs draw themselves stroke-by-stroke on entry.',
  },
  {
    index: '02.',
    title: 'Scroll-linked descent',
    body: 'Scroll down this page to watch the spider lower further down its thread (up to 35% of the viewport height), with its left and right leg groups alternating at 0.18s while moving.',
  },
  {
    index: '03.',
    title: 'Cursor proximity recoil',
    body: 'Move your pointer within 90px of the spider. It snaps upward with fast 0.16 recoil damping to hide near the top edge for 2.6 seconds, then cautiously creeps back down at 0.05 damping.',
  },
  {
    index: '04.',
    title: 'Click to scare away',
    body: 'Click directly on the spider to send it fleeing off the top of the screen with the status toast. Use Call spider back anytime to reset it and redraw the webs.',
  },
];

export default function SpiderPage({ onNavigateCrowd }: SpiderPageProps) {
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const [instanceKey, setInstanceKey] = useState(1);
  const [isScared, setIsScared] = useState(false);

  const handleReset = () => {
    setInstanceKey((k) => k + 1);
    setIsScared(false);
  };

  return (
    <div
      className={`min-h-[210vh] w-full transition-colors duration-200 ${
        theme === 'dark' ? 'spider-theme-dark' : 'spider-theme-light'
      }`}
      style={{
        backgroundColor: 'var(--hw-page-bg)',
        color: 'var(--hw-page-fg)',
      }}
    >
      {/* Live Marko Denic Spider + Corner Cobwebs */}
      <MarkoSpider
        instanceKey={instanceKey}
        forceMotion={instanceKey > 1}
        onScaredChange={setIsScared}
      />

      {/* Minimal Top Bar leaving generous open space on the right for the hanging spider */}
      <header
        className="mx-auto flex w-full max-w-[1100px] items-center justify-between gap-6 px-6 py-7 pr-28 sm:px-10 sm:pr-44"
        style={{ borderBottom: '1px solid var(--hw-page-border)' }}
      >
        <button
          type="button"
          onClick={onNavigateCrowd}
          className="inline-flex shrink-0 cursor-pointer items-center gap-2 whitespace-nowrap text-sm font-medium transition-opacity duration-150 hover:opacity-75 focus-visible:outline-2 focus-visible:outline-offset-4"
          style={{ color: 'var(--hw-page-fg)' }}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
          <span>Crowd scene</span>
        </button>

        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={handleReset}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-opacity duration-150 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              backgroundColor: isScared ? 'var(--hw-accent)' : 'var(--hw-page-surface)',
              color: isScared ? 'oklch(16% 0.03 300)' : 'var(--hw-page-fg)',
              border: '1px solid var(--hw-page-border)',
              borderRadius: '8px',
            }}
          >
            <RotateCcw className="h-3.5 w-3.5" aria-hidden="true" />
            <span>{isScared ? 'Call spider back' : 'Replay entrance'}</span>
          </button>

          <button
            type="button"
            onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
            aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} theme`}
            className="inline-flex shrink-0 cursor-pointer items-center gap-1.5 whitespace-nowrap px-3 py-1.5 text-xs font-medium transition-opacity duration-150 hover:opacity-80 focus-visible:outline-2 focus-visible:outline-offset-2"
            style={{
              backgroundColor: 'var(--hw-page-surface)',
              color: 'var(--hw-page-fg)',
              border: '1px solid var(--hw-page-border)',
              borderRadius: '8px',
            }}
          >
            {theme === 'dark' ? (
              <>
                <Sun className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Light</span>
              </>
            ) : (
              <>
                <Moon className="h-3.5 w-3.5" aria-hidden="true" />
                <span>Dark</span>
              </>
            )}
          </button>
        </div>
      </header>

      {/* Scrollable Content Runway so visitors can test scroll-linked descent and pointer recoil */}
      <main className="mx-auto w-full max-w-[780px] px-6 pt-16 pb-36 sm:px-10 md:pt-24">
        <p
          className="text-xs font-medium tracking-wide"
          style={{ color: 'var(--hw-accent)' }}
        >
          Interactive Hanging Spider · markodenic.com
        </p>

        <h1 className="mt-4 max-w-xl text-balance text-[clamp(2.25rem,4.5vw,3.5rem)] font-bold leading-[1.08] tracking-[-0.03em]">
          Look toward the top-right corner.
        </h1>

        <p
          className="mt-5 max-w-lg text-base leading-relaxed"
          style={{ color: 'var(--hw-page-muted)' }}
        >
          Built with the exact SVG geometry, corner cobwebs, alternating leg crawl, asymmetric
          spring damping, scroll-linked thread descent, cursor proximity recoil, and click-to-scare
          behavior from Marko Denic&apos;s site.
        </p>

        <div
          className="mt-16 divide-y"
          style={{ borderColor: 'var(--hw-page-border)' }}
        >
          {BEHAVIOR_NOTES.map((item) => (
            <section
              key={item.index}
              className="grid grid-cols-1 gap-2 py-8 sm:grid-cols-[56px_1fr]"
              style={{ borderColor: 'var(--hw-page-border)' }}
            >
              <span
                className="text-sm font-semibold tabular-nums"
                style={{ color: 'var(--hw-accent)' }}
              >
                {item.index}
              </span>
              <div>
                <h2 className="text-base font-semibold tracking-tight">{item.title}</h2>
                <p
                  className="mt-2 max-w-prose text-sm leading-relaxed"
                  style={{ color: 'var(--hw-page-muted)' }}
                >
                  {item.body}
                </p>
              </div>
            </section>
          ))}
        </div>

        <div
          className="mt-20 pt-10 text-sm"
          style={{
            borderTop: '1px solid var(--hw-page-border)',
            color: 'var(--hw-page-muted)',
          }}
        >
          Keep scrolling down and back up to watch the spider pay out and retract its silk thread.
        </div>
      </main>
    </div>
  );
}
