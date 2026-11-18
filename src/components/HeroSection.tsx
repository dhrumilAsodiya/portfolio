import { useEffect, useRef, useState } from 'react';
import cloudSvg from '@/src/assets/core/cloud.svg';
import heroWebp from '@/src/assets/core/hero.webp';
import { QUICK_TABS, QuickTabKey, WORK_QUICK_JUMP } from '@/src/data/siteData';
import { CheckPixelIcon, ChevronDownIcon, CopyIcon } from './Icons';

const TAB_KEYS: QuickTabKey[] = ['bio', 'stack', 'contact'];

interface HeroSectionProps {
  onOpenContact: (topic?: string) => void;
}

export function HeroSection({ onOpenContact }: HeroSectionProps) {
  const [selectedTab, setSelectedTab] = useState<QuickTabKey>('bio');
  const [copied, setCopied] = useState(false);
  const [quickJumpOpen, setQuickJumpOpen] = useState(false);
  const quickJumpRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!quickJumpOpen) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!quickJumpRef.current?.contains(e.target as Node)) {
        setQuickJumpOpen(false);
      }
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setQuickJumpOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [quickJumpOpen]);

  const handleCopy = async () => {
    const cmd = QUICK_TABS[selectedTab].command;
    try {
      await navigator.clipboard.writeText(cmd);
      setCopied(true);
      window.setTimeout(() => setCopied(false), 1800);
    } catch {
      setCopied(false);
    }
  };

  return (
    <section aria-label="Portfolio Introduction" className="landing-hero relative text-[var(--hw-fg)]">
      {/* Subtle stippled noise grain backdrop */}
      <div aria-hidden="true" className="hw-noise pointer-events-none absolute inset-0 opacity-25" />

      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)] landing-hero-grid">
        <div className="landing-hero-copy">
          <h1
            className="landing-hero-title"
            style={{
              fontFamily: 'var(--font-rules-gothic-cnd)',
              fontSize: 'var(--hw-teams-hero-display)',
              fontWeight: 400,
              lineHeight: 0.94,
              letterSpacing: '-0.02em',
            }}
          >
            <span>Systems</span>
            <span>Built to</span>
            <span>Think &amp; Scale</span>
          </h1>

          <div className="landing-hero-overview">
            <div className="landing-hero-actions">
              {/* Split Primary White + Cobalt CTA + Quick Jump Menu */}
              <div ref={quickJumpRef} className="relative inline-flex items-stretch">
                <a
                  href="#projects"
                  data-slot="button"
                  data-variant="secondary"
                  className="core-button group relative inline-flex cursor-pointer items-center justify-center border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out active:scale-[0.98] bg-[#ffffff] text-[var(--core-color-blue)] hover:bg-[#f2f2ff] hover:shadow-[var(--hpv2-shadow-lift)] landing-cta"
                >
                  <span className="leading-none whitespace-nowrap">View selected work</span>
                  <span aria-hidden="true" className="core-button-hover-border" />
                </a>
                <button
                  type="button"
                  aria-label="Jump to portfolio section"
                  aria-expanded={quickJumpOpen}
                  onClick={() => setQuickJumpOpen((prev) => !prev)}
                  data-slot="button"
                  data-variant="secondary"
                  className="core-button landing-download-chevron group relative ml-[1px] inline-flex cursor-pointer items-center justify-center border-0 bg-clip-padding outline-none select-none bg-[#ffffff] text-[var(--core-color-blue)] hover:bg-[#f2f2ff] hover:shadow-[var(--hpv2-shadow-lift)]"
                >
                  <ChevronDownIcon className={`size-4 transition-transform duration-150 ${quickJumpOpen ? 'rotate-180' : ''}`} />
                  <span aria-hidden="true" className="core-button-hover-border" />
                </button>

                {quickJumpOpen && (
                  <div
                    role="menu"
                    aria-label="Portfolio Sections"
                    className="landing-download-menu absolute top-[calc(100%+6px)] left-0 z-30 w-[280px] border border-[var(--hpv2-hairline)] bg-[var(--core-paper)] p-1.5 text-[var(--hw-teams-ink)] shadow-[0_8px_24px_rgba(0,0,0,0.3)]"
                  >
                    {WORK_QUICK_JUMP.map((item) => (
                      <a
                        key={item.label}
                        role="menuitem"
                        href={item.href}
                        onClick={() => setQuickJumpOpen(false)}
                        className="flex flex-col gap-0.5 rounded-[2px] px-2.5 py-2 text-left transition-colors hover:bg-[var(--hpv2-row-hover)]"
                      >
                        <span className="font-[family-name:var(--font-mono)] text-[13px] font-medium uppercase">
                          {item.label}
                        </span>
                        <span className="text-[11px] opacity-65">{item.sublabel}</span>
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Direct Inquiry Secondary Button */}
              <button
                type="button"
                onClick={() => onOpenContact('Full-Time Role')}
                data-slot="button"
                data-variant="hero-ghost"
                className="core-button group relative inline-flex cursor-pointer items-center justify-center border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out active:scale-[0.98] bg-[rgba(255,255,255,0.22)] text-[#f2f2f2] hover:bg-[rgba(255,255,255,0.3)] landing-cloud-cta"
              >
                <img alt="" className="size-4 shrink-0" height="16" width="16" src={cloudSvg} />
                <span className="leading-none whitespace-nowrap">Book an intro</span>
                <span aria-hidden="true" className="core-button-hover-border" />
              </button>
            </div>

            {/* Interactive CLI Profile Widget (Clean solo label above terminal) */}
            <div className="hw-install-terminal" id="profile-cli">
              <p className="hw-install-terminal-label" id="profile-terminal-label">
                Quick profile
              </p>
              <div className="hw-install-terminal-body">
                <div
                  role="tablist"
                  aria-orientation="horizontal"
                  aria-labelledby="profile-terminal-label"
                  className="hw-install-terminal-tabs"
                >
                  {TAB_KEYS.map((key) => {
                    const active = selectedTab === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        role="tab"
                        aria-selected={active}
                        data-state={active ? 'active' : 'inactive'}
                        onClick={() => {
                          setSelectedTab(key);
                          setCopied(false);
                        }}
                        className="hw-install-terminal-tab"
                      >
                        <span aria-hidden="true">:</span>
                        {QUICK_TABS[key].label}
                        <span aria-hidden="true">:</span>
                      </button>
                    );
                  })}
                </div>

                <div role="tabpanel" className="hw-install-terminal-panel">
                  <code>{QUICK_TABS[selectedTab].command}</code>
                  <button
                    type="button"
                    aria-label={copied ? 'Copied profile line' : 'Copy profile line'}
                    title={copied ? 'Copied!' : 'Copy'}
                    onClick={handleCopy}
                    className="hw-install-terminal-copy"
                  >
                    {copied ? <CheckPixelIcon className="size-4" /> : <CopyIcon className="size-4" />}
                  </button>
                </div>
              </div>
              <span aria-live="polite" className="sr-only">
                {copied ? `Copied ${selectedTab} details` : ''}
              </span>
            </div>
          </div>
        </div>

        {/* Hero Engraving Artwork */}
        <figure aria-hidden="true" className="landing-hero-art hw-hero-parallax">
          <img alt="" decoding="async" fetchPriority="high" height="793" width="631" src={heroWebp} />
        </figure>
      </div>
    </section>
  );
}


