import footerWebp from '@/src/assets/core/footer.webp';
import coreAgentBadgeSvg from '@/src/assets/core/core-agent-badge.svg';
import nousBadgeFilledSvg from '@/src/assets/core/nous-badge-filled.svg';
import nousBadgeOutlineSvg from '@/src/assets/core/nous-badge-outline.svg';
import nousPortalBadgeSvg from '@/src/assets/core/nous-portal-badge.svg';
import { FOOTER_COLUMNS, PORTFOLIO_PROFILE } from '@/src/data/siteData';
import {
  GitHubIcon,
  LinkedInIcon,
} from './Icons';

interface FootersProps {
  theme: 'light' | 'dark';
  onOpenContact: (topic?: string) => void;
}

export function Footers({ theme, onOpenContact }: FootersProps) {
  return (
    <>
      {/* Paper Footer with Ghost Watermark & Ceremonial Badges */}
      <footer className="bg-core-paper text-[var(--hw-teams-ink)]">
        <div className="mx-auto grid w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)] *:col-start-1 *:row-start-1">
          <p
            aria-hidden="true"
            className="hw-teams-ghost pointer-events-none w-full pt-9 pb-2 text-center select-none"
            style={{ fontSize: 'clamp(72px, 24vw, 397px)', lineHeight: 0.85 }}
          >
            {PORTFOLIO_PROFILE.lastName}
          </p>

          <div
            style={{
              fontFamily: 'var(--font-mono)',
              fontSize: 'var(--hpv2-type-label)',
              fontWeight: 500,
              lineHeight: 1,
              textTransform: 'uppercase',
            }}
            className="relative flex flex-wrap items-center gap-x-20 gap-y-6 self-end py-[60px] max-md:gap-x-6 max-md:py-10"
          >
            <div className="flex min-w-0 flex-1 flex-col gap-[1em] max-md:order-2 max-md:basis-[calc(50%-12px)]">
              <p>{PORTFOLIO_PROFILE.location}</p>
              <p>© 2026, {PORTFOLIO_PROFILE.fullName}</p>
            </div>

            <div className="flex items-center gap-5 text-[var(--core-primary)] max-md:order-1 max-md:basis-full max-md:justify-center">
              <span
                role="img"
                aria-label="Systems Emblem"
                className="h-[57px] w-10 bg-current"
                style={{
                  WebkitMaskImage: `url(${nousPortalBadgeSvg})`,
                  maskImage: `url(${nousPortalBadgeSvg})`,
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                }}
              />
              <span
                role="img"
                aria-label="Portfolio Crest"
                className="h-[57px] w-10 bg-current"
                style={{
                  WebkitMaskImage: `url(${theme === 'dark' ? nousBadgeOutlineSvg : nousBadgeFilledSvg})`,
                  maskImage: `url(${theme === 'dark' ? nousBadgeOutlineSvg : nousBadgeFilledSvg})`,
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                }}
              />
              <span
                role="img"
                aria-label="Core Wing Emblem"
                className="h-[57px] w-10 bg-current"
                style={{
                  WebkitMaskImage: `url(${coreAgentBadgeSvg})`,
                  maskImage: `url(${coreAgentBadgeSvg})`,
                  WebkitMaskPosition: 'center',
                  maskPosition: 'center',
                  WebkitMaskRepeat: 'no-repeat',
                  maskRepeat: 'no-repeat',
                  WebkitMaskSize: 'contain',
                  maskSize: 'contain',
                }}
              />
            </div>

            <div className="flex min-w-0 flex-1 flex-col items-end gap-[1em] text-right max-md:order-3 max-md:basis-[calc(50%-12px)]">
              <p>
                <span>
                  <a
                    className="underline decoration-from-font"
                    href={PORTFOLIO_PROFILE.githubUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    GitHub
                  </a>
                </span>
                <span>
                  <span className="mx-2">|</span>
                  <button
                    type="button"
                    onClick={() => onOpenContact('General Inquiry')}
                    className="cursor-pointer uppercase underline decoration-from-font"
                  >
                    Contact
                  </button>
                </span>
              </p>
              <p>Systems &amp; Full-Stack Portfolio</p>
            </div>
          </div>
        </div>
      </footer>

      {/* Primary Dark/Cobalt Portfolio Directory Footer */}
      <footer className="hw-footer-soften bg-core text-[var(--hw-fg)] md:flex md:min-h-dvh md:flex-col md:pb-[var(--hw-frame)]">
        <div className="relative isolate h-[70dvh] max-h-[890px] min-h-[420px] overflow-hidden bg-inherit md:aspect-[1310/890] md:h-auto md:max-h-none md:min-h-0 md:flex-auto">
          <div className="hw-noise absolute inset-0">
            <img alt="" className="absolute inset-0 size-full object-cover object-top" loading="lazy" src={footerWebp} />
          </div>
          <div
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-1/2 bg-[linear-gradient(to_bottom,transparent,var(--core-primary)_86%)]"
          />
          <div aria-hidden="true" className="absolute inset-x-0 bottom-0 translate-y-[18%]">
            <p
              className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)] hw-teams-ghost-white hw-teams-gothic text-center font-normal uppercase"
              style={{ fontSize: 'clamp(56px, 17vw, 280px)', lineHeight: 0.9 }}
            >
              {PORTFOLIO_PROFILE.fullName}
            </p>
          </div>
        </div>

        {/* Footer 4-Column Link Directory */}
        <div className="relative mx-auto grid w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] grid-cols-2 gap-x-6 gap-y-10 px-[var(--hw-teams-pad-x)] pb-10 font-[family-name:var(--font-mono)] text-[length:var(--hw-teams-label-sm)] leading-none tracking-normal uppercase md:grid-cols-[minmax(0,320px)_repeat(4,minmax(0,1fr))] md:gap-5">
          <div className="flex flex-col gap-5 max-md:col-span-2">
            <span
              aria-hidden="true"
              className="h-[86px] w-[60px] bg-current"
              style={{
                WebkitMaskImage: `url(${nousBadgeOutlineSvg})`,
                maskImage: `url(${nousBadgeOutlineSvg})`,
                WebkitMaskPosition: 'center',
                maskPosition: 'center',
                WebkitMaskRepeat: 'no-repeat',
                maskRepeat: 'no-repeat',
                WebkitMaskSize: 'contain',
                maskSize: 'contain',
              }}
            />
            <p className="mt-1">{PORTFOLIO_PROFILE.role}</p>
          </div>

          {FOOTER_COLUMNS.map((col) => (
            <div key={col.title} className="flex flex-col gap-5">
              <p className="opacity-60">{col.category}</p>
              <p className="hw-teams-footer-title font-[family-name:var(--font-display)] text-[length:var(--hw-teams-faq-q)] leading-[1.4] tracking-normal normal-case">
                {col.title}
              </p>
              <ul className="-my-[var(--hw-teams-footer-row-pad)] flex flex-col">
                {col.links.map((link) => {
                  const external = link.href.startsWith('http');
                  const isModalTrigger = link.label === 'Book Intro Call';
                  return (
                    <li key={`${col.title}-${link.label}`} className="flex">
                      {isModalTrigger ? (
                        <button
                          type="button"
                          onClick={() => onOpenContact('General Inquiry')}
                          className="group -ml-1 inline-flex cursor-pointer self-start py-[var(--hw-teams-footer-row-pad)] uppercase whitespace-nowrap"
                        >
                          <span className="inline-flex h-[var(--hpv2-chip-h)] shrink-0 items-center gap-1.5 rounded-r-xs px-1.5 whitespace-nowrap transition-colors duration-150 ease-out group-hover:bg-[var(--hw-fg)] group-hover:text-[var(--core-primary)] group-hover:duration-0">
                            {link.label}
                          </span>
                        </button>
                      ) : (
                        <a
                          className="group -ml-1 inline-flex self-start py-[var(--hw-teams-footer-row-pad)] whitespace-nowrap"
                          href={link.href}
                          target={external ? '_blank' : undefined}
                          rel={external ? 'noopener noreferrer' : undefined}
                        >
                          <span className="inline-flex h-[var(--hpv2-chip-h)] shrink-0 items-center gap-1.5 rounded-r-xs px-1.5 whitespace-nowrap transition-colors duration-150 ease-out group-hover:bg-[var(--hw-fg)] group-hover:text-[var(--core-primary)] group-hover:duration-0">
                            <span>
                              {'prefix' in link && link.prefix && <span className="opacity-60">{link.prefix}</span>}
                              {link.label}
                            </span>
                          </span>
                        </a>
                      )}
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </div>

        {/* Bottom Legal & Social Bar */}
        <div className="mx-auto grid w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] grid-cols-2 items-center gap-5 px-[var(--hw-teams-pad-x)] py-10 font-[family-name:var(--font-mono)] text-[length:var(--hw-teams-label-sm)] leading-none tracking-normal uppercase md:grid-cols-[minmax(0,320px)_repeat(4,minmax(0,1fr))]">
          <div className="flex items-center max-md:col-span-2">
            <a aria-label="GitHub" className="py-2 pr-2 hover:opacity-60" href={PORTFOLIO_PROFILE.githubUrl} target="_blank" rel="noopener noreferrer">
              <GitHubIcon className="size-5" />
            </a>
            <a aria-label="LinkedIn" className="p-2 hover:opacity-60" href={PORTFOLIO_PROFILE.linkedinUrl} target="_blank" rel="noopener noreferrer">
              <LinkedInIcon className="size-5" />
            </a>
          </div>
          <p className="max-md:order-1">© 2026, {PORTFOLIO_PROFILE.fullName}</p>
          <p className="opacity-60">{PORTFOLIO_PROFILE.location}</p>
          <p className="opacity-60">Open for Work</p>
          <p className="max-md:order-1">
            <span>
              <button
                type="button"
                onClick={() => onOpenContact('General Inquiry')}
                className="cursor-pointer uppercase underline decoration-from-font"
              >
                Email
              </button>
            </span>
            <span>
              <span className="mx-2">|</span>
              <a className="underline decoration-from-font" href={PORTFOLIO_PROFILE.resumeHref} target="_blank" rel="noopener noreferrer">
                Download Resume
              </a>
            </span>
            <span>
              <span className="mx-2">|</span>
              <a className="underline decoration-from-font" href="#top">
                Back to top
              </a>
            </span>
          </p>
        </div>
      </footer>
    </>
  );
}



