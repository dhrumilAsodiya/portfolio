import { useEffect, useRef, useState } from 'react';
import coreWingSvg from '@/src/assets/core/core-wing.svg';
import { NAV_MENUS, NavTarget, PORTFOLIO_PROFILE } from '@/src/data/siteData';
import {
  ArrowUpRightIcon,
  GitHubIcon,
  LinkedInIcon,
} from './Icons';

const NAV_KEYS: NavTarget[] = ['About', 'Work', 'Connect'];

interface NavbarProps {
  onOpenContact: (topic?: string) => void;
}

export function Navbar({ onOpenContact }: NavbarProps) {
  const [openMenu, setOpenMenu] = useState<NavTarget | null>(null);
  const [menuPos, setMenuPos] = useState<{ top: number; left: number; align: 'left' | 'right' }>({
    top: 84,
    left: 40,
    align: 'left',
  });
  const [isPinned, setIsPinned] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileExpanded, setMobileExpanded] = useState<NavTarget | null>('Work');

  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const onScroll = () => {
      setIsPinned(window.scrollY > 180);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (!openMenu) return;
    const onPointerDown = (e: MouseEvent) => {
      const target = e.target as Element | null;
      if (!target) return;
      if (popoverRef.current?.contains(target)) return;
      if (target.closest('[data-research-target]')) return;
      setOpenMenu(null);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpenMenu(null);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [openMenu]);

  useEffect(() => {
    if (!mobileOpen) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setMobileOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [mobileOpen]);

  const handleToggleMenu = (target: NavTarget, el: HTMLButtonElement, align: 'left' | 'right') => {
    if (openMenu === target) {
      setOpenMenu(null);
      return;
    }
    const rect = el.getBoundingClientRect();
    setMenuPos({
      top: rect.bottom + 8,
      left: align === 'left' ? Math.max(16, rect.left) : Math.max(16, rect.right - 360),
      align,
    });
    setOpenMenu(target);
  };

  const renderNavBar = (pinned: boolean) => (
    <nav
      data-pro-nav=""
      data-research-nav=""
      aria-label={pinned ? `${PORTFOLIO_PROFILE.fullName}, pinned` : PORTFOLIO_PROFILE.fullName}
      className={`mx-auto flex w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] items-center justify-between px-[var(--hw-teams-pad-x)] md:grid md:grid-cols-[1fr_auto_1fr] md:gap-x-6 ${
        pinned ? 'py-2.5' : 'pt-10 pb-5'
      }`}
    >
      {/* Left triggers */}
      <div className="flex items-center gap-x-6 max-md:hidden">
        {(['About', 'Work'] as NavTarget[]).map((key) => {
          const active = openMenu === key;
          return (
            <span key={key} className="flex min-w-0 flex-1">
              <button
                type="button"
                className={`hw-mono nw-subnav-trigger font-medium tracking-normal whitespace-nowrap ${
                  pinned
                    ? 'text-[length:var(--hw-teams-label-sm)] opacity-60 hover:opacity-100'
                    : 'text-[length:var(--hw-teams-label)] opacity-80 hover:opacity-100'
                }`}
                data-research-target={key}
                aria-controls="research-navigation"
                aria-expanded={active}
                onClick={(e) => handleToggleMenu(key, e.currentTarget, 'left')}
              >
                <span className="nw-subnav-trigger-label">{key}</span>
              </button>
            </span>
          );
        })}
      </div>

      {/* Center brand mark */}
      {pinned ? (
        <a
          href="#top"
          aria-label={PORTFOLIO_PROFILE.fullName}
          className="grid size-[var(--hw-teams-wing-box)] shrink-0 place-items-center"
        >
          <img
            alt=""
            className="h-[var(--hw-teams-wing-h)] w-auto rotate-45"
            src={coreWingSvg}
          />
        </a>
      ) : (
        <span className="hw-teams-gothic flex shrink-0 flex-col gap-1.5 text-4xl leading-[0.9] font-medium tracking-normal uppercase md:min-w-[2.25em] items-center text-center max-md:items-start max-md:text-left">
          <a href="#top" className="flex flex-col gap-1.5">
            <span className="block">{PORTFOLIO_PROFILE.firstName}</span>
            <span className="block">{PORTFOLIO_PROFILE.lastName}</span>
          </a>
        </span>
      )}

      {/* Right triggers + CTA */}
      <div className="flex items-center gap-x-6 max-md:hidden">
        {(['Connect'] as NavTarget[]).map((key) => {
          const active = openMenu === key;
          return (
            <span key={key} className="flex min-w-0 flex-1 justify-end">
              <button
                type="button"
                className={`hw-mono nw-subnav-trigger text-right font-medium tracking-normal whitespace-nowrap ${
                  pinned
                    ? 'text-[length:var(--hw-teams-label-sm)] opacity-60 hover:opacity-100'
                    : 'text-[length:var(--hw-teams-label)] opacity-80 hover:opacity-100'
                }`}
                data-research-target={key}
                aria-controls="research-navigation"
                aria-expanded={active}
                onClick={(e) => handleToggleMenu(key, e.currentTarget, 'right')}
              >
                <span className="nw-subnav-trigger-label">{key}</span>
              </button>
            </span>
          );
        })}

        <div className="flex flex-1 justify-end" data-pro-nav-action="">
          <button
            type="button"
            onClick={() => onOpenContact('General Inquiry')}
            data-slot="button"
            data-variant={pinned ? 'primary' : 'secondary'}
            className={`core-button group relative inline-flex cursor-pointer items-center justify-center border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out active:scale-[0.98] gap-2 px-3 py-[var(--hw-teams-btn-py)] whitespace-nowrap ${
              pinned
                ? 'bg-[var(--hpv2-brand,var(--core-primary))] text-[var(--core-white)] hover:shadow-[var(--hpv2-shadow-lift-strong)] text-[length:var(--hw-teams-label-sm)]'
                : 'bg-[#ffffff] text-[var(--core-color-blue)] hover:bg-[#f2f2ff] hover:shadow-[var(--hpv2-shadow-lift)] text-[length:var(--hw-teams-label)]'
            }`}
          >
            <span className="leading-none whitespace-nowrap">Get in touch</span>
            <span aria-hidden="true" className="core-button-hover-border" />
          </button>
        </div>
      </div>

      {/* Mobile CTA + Burger */}
      <div className="flex items-center gap-3 md:hidden">
        <button
          type="button"
          onClick={() => onOpenContact('General Inquiry')}
          data-slot="button"
          data-variant={pinned ? 'primary' : 'secondary'}
          className={`core-button group relative inline-flex cursor-pointer items-center justify-center border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out active:scale-[0.98] gap-2 px-3 py-[var(--hw-teams-btn-py)] whitespace-nowrap text-[length:var(--hw-teams-label)] ${
            pinned
              ? 'bg-[var(--hpv2-brand,var(--core-primary))] text-[var(--core-white)]'
              : 'bg-[#ffffff] text-[var(--core-color-blue)] hover:bg-[#f2f2ff]'
          }`}
        >
          <span className="leading-none whitespace-nowrap">Get in touch</span>
          <span aria-hidden="true" className="core-button-hover-border" />
        </button>
        <button
          aria-expanded={mobileOpen}
          aria-label="Open menu"
          className="-mr-2 grid size-11 cursor-pointer place-items-center"
          type="button"
          onClick={() => setMobileOpen(true)}
        >
          <svg className="size-5" viewBox="0 0 16 16" fill="currentColor" aria-hidden="true">
            <path d="M13.3333 12H2.66667V10.6667H13.3333V12Z" />
            <path d="M13.3333 8.66667H2.66667V7.33333H13.3333V8.66667Z" />
            <path d="M13.3333 5.33333H2.66667V4H13.3333V5.33333Z" />
          </svg>
        </button>
      </div>
    </nav>
  );

  return (
    <>
      <header data-surface="brand" className="marketing-header relative z-[90] text-[var(--hw-fg)]">
        {renderNavBar(false)}
      </header>

      {/* Scroll-activated Pinned Paper Navbar */}
      <div
        data-surface="brand"
        aria-hidden={!isPinned}
        className={`marketing-paper-nav bg-core-paper fixed inset-x-0 top-0 z-50 text-[var(--core-primary)] shadow-[var(--hw-teams-paper-nav-rule)] transition-[translate,visibility] duration-300 ease-out motion-reduce:transition-none md:inset-x-[var(--hw-teams-page-inset)] md:top-[calc(var(--hw-frame)-1px)] ${
          isPinned ? 'visible translate-y-0' : 'invisible -translate-y-full pointer-events-none'
        }`}
      >
        {renderNavBar(true)}
      </div>

      {/* Desktop Subnavigation Dropdown Popover */}
      {openMenu && (
        <div
          id="research-navigation"
          ref={popoverRef}
          role="dialog"
          aria-label={`${openMenu} destinations`}
          style={{
            top: `${menuPos.top}px`,
            left: `${Math.min(menuPos.left, window.innerWidth - 396)}px`,
          }}
          className="fixed z-[110] w-[380px] max-w-[calc(100vw-24px)] border border-[color-mix(in_srgb,var(--core-white)_25%,transparent)] bg-[var(--core-primary)] text-[var(--core-white)] shadow-[0_12px_36px_rgba(0,0,0,0.45)]"
        >
          {NAV_MENUS[openMenu].map((section, idx) => (
            <section
              key={section.heading}
              className={idx > 0 ? 'border-t border-dotted border-[color-mix(in_srgb,var(--core-white)_25%,transparent)]' : ''}
            >
              <div className="grid grid-cols-[84px_minmax(0,1fr)] items-start px-3 pt-2.5 pb-3">
                <div className="col-span-2 mb-1 font-[family-name:var(--font-mono)] text-[11px] tracking-[0.06em] uppercase opacity-50">
                  {section.category}
                </div>
                <span className="hw-teams-gothic pt-1.5 text-[28px] leading-[0.9] font-medium uppercase">
                  {section.heading}
                </span>
                <div className="flex min-w-0 flex-col gap-0.5">
                  {section.items.map((item) =>
                    item.label === 'Send Message' ? (
                      <button
                        key={item.label}
                        type="button"
                        onClick={() => {
                          setOpenMenu(null);
                          onOpenContact('General Inquiry');
                        }}
                        className="group flex cursor-pointer items-center justify-between gap-2 rounded-[2px] px-2.5 py-1.5 text-left font-[family-name:var(--font-mono)] text-[13px] leading-tight uppercase transition-colors duration-100 hover:bg-[var(--hw-fg)] hover:text-[var(--core-primary)]"
                      >
                        <span className="min-w-0 truncate">{item.label}</span>
                        <ArrowUpRightIcon className="size-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
                      </button>
                    ) : (
                      <a
                        key={`${item.label}-${item.href}`}
                        href={item.href}
                        target={item.external ? '_blank' : undefined}
                        rel={item.external ? 'noopener noreferrer' : undefined}
                        onClick={() => setOpenMenu(null)}
                        className="group flex items-center justify-between gap-2 rounded-[2px] px-2.5 py-1.5 font-[family-name:var(--font-mono)] text-[13px] leading-tight uppercase transition-colors duration-100 hover:bg-[var(--hw-fg)] hover:text-[var(--core-primary)]"
                      >
                        <span className="min-w-0 truncate">
                          {item.mutedPrefix && <span className="opacity-55">{item.mutedPrefix}</span>}
                          {item.label}
                        </span>
                        <ArrowUpRightIcon className="size-3.5 shrink-0 opacity-60 group-hover:opacity-100" />
                      </a>
                    )
                  )}
                </div>
              </div>
            </section>
          ))}
        </div>
      )}

      {/* Mobile Fullscreen Drawer */}
      {mobileOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Mobile Navigation"
          data-state="open"
          className="fixed inset-[3px] z-[230] flex flex-col overflow-y-auto bg-[var(--core-primary)] px-5 pt-4 pb-8 text-[var(--core-white)] md:hidden"
        >
          <div className="flex items-start justify-between">
            <a href="#top" onClick={() => setMobileOpen(false)} aria-label={PORTFOLIO_PROFILE.fullName}>
              <img alt="" className="h-12 w-auto brightness-0 invert" src={coreWingSvg} />
            </a>
            <button
              type="button"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
              className="grid size-11 cursor-pointer place-items-center text-[var(--core-white)]"
            >
              <svg viewBox="0 0 24 24" fill="currentColor" className="size-6" aria-hidden="true">
                <path d="M18.3 5.71L12 12l6.3 6.29-1.41 1.42L10.59 13.41 4.29 19.71 2.88 18.29 9.17 12 2.88 5.71 4.29 4.29l6.3 6.3 6.29-6.3z" />
              </svg>
            </button>
          </div>

          <nav className="mt-6 flex flex-col gap-3.5">
            {NAV_KEYS.map((key) => {
              const expanded = mobileExpanded === key;
              return (
                <div key={key}>
                  <button
                    type="button"
                    aria-expanded={expanded}
                    onClick={() => setMobileExpanded(expanded ? null : key)}
                    className="flex min-h-[44px] items-center gap-2 font-[family-name:var(--font-display)] text-[44px] leading-none uppercase"
                  >
                    <span>{key}</span>
                    <span className="text-lg opacity-70">{expanded ? '−' : '+'}</span>
                  </button>
                  {expanded && (
                    <div className="flex flex-col gap-1 py-2 pl-1">
                      {NAV_MENUS[key].flatMap((sec) =>
                        sec.items.map((item) =>
                          item.label === 'Send Message' ? (
                            <button
                              key={`${item.label}-${item.href}`}
                              type="button"
                              onClick={() => {
                                setMobileOpen(false);
                                onOpenContact('General Inquiry');
                              }}
                              className="inline-flex min-h-[40px] cursor-pointer items-center text-left font-[family-name:var(--font-mono)] text-[15px] uppercase opacity-90 hover:opacity-100"
                            >
                              {item.label}
                            </button>
                          ) : (
                            <a
                              key={`${item.label}-${item.href}`}
                              href={item.href}
                              target={item.external ? '_blank' : undefined}
                              rel={item.external ? 'noopener noreferrer' : undefined}
                              onClick={() => setMobileOpen(false)}
                              className="inline-flex min-h-[40px] items-center font-[family-name:var(--font-mono)] text-[15px] uppercase opacity-90 hover:opacity-100"
                            >
                              {item.mutedPrefix && <span className="mr-1 opacity-60">{item.mutedPrefix}</span>}
                              {item.label}
                            </a>
                          )
                        )
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </nav>

          <div className="mt-auto flex flex-wrap items-center gap-4 pt-8">
            <a href={PORTFOLIO_PROFILE.githubUrl} target="_blank" rel="noopener noreferrer" aria-label="GitHub">
              <GitHubIcon className="size-5" />
            </a>
            <a href={PORTFOLIO_PROFILE.linkedinUrl} target="_blank" rel="noopener noreferrer" aria-label="LinkedIn">
              <LinkedInIcon className="size-5" />
            </a>
          </div>
        </div>
      )}
    </>
  );
}



