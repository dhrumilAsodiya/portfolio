import { useState } from 'react';
import globeSvg from '@/src/assets/core/globe.svg';
import portalArtSvg from '@/src/assets/core/portal-art.svg';
import { PORTFOLIO_PROFILE } from '@/src/data/siteData';

interface PortalSectionProps {
  onOpenContact: (topic?: string) => void;
}

export function PortalSection({ onOpenContact }: PortalSectionProps) {
  const [emailCopied, setEmailCopied] = useState(false);

  const handleCopyEmail = async () => {
    try {
      await navigator.clipboard.writeText(PORTFOLIO_PROFILE.email);
      setEmailCopied(true);
      window.setTimeout(() => setEmailCopied(false), 1800);
    } catch {
      setEmailCopied(false);
    }
  };

  return (
    <section aria-label="Experience and Availability" className="landing-portal" id="experience">
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)] landing-portal-column">
        {/* Role Chips */}
        <div aria-label="Core Roles" className="landing-plan-chips">
          {['Engineer', 'Architect', 'Builder', 'Advisor'].map((role) => (
            <span
              key={role}
              data-chip=""
              data-tone="outline"
              className="inline-flex h-[var(--hpv2-chip-h)] shrink-0 items-center gap-1.5 rounded-r-xs border border-current px-1.5 whitespace-nowrap"
            >
              <span
                className="hpv2-label-face inline-flex items-center gap-1.5 leading-none font-medium uppercase"
                style={{
                  fontFamily: 'var(--font-mono)',
                  fontSize: 'var(--hpv2-type-label)',
                }}
              >
                {role}
              </span>
            </span>
          ))}
        </div>

        {/* Heading + Actions */}
        <div className="landing-section-title landing-portal-heading flex w-full items-start gap-2.5">
          <h2
            className="text-[var(--hw-teams-ink)]"
            style={{
              fontFamily: 'var(--font-rules-gothic-cnd)',
              fontSize: 'var(--hw-teams-display)',
              fontWeight: 400,
              lineHeight: 1,
              letterSpacing: '-0.02em',
            }}
          >
            Experience &amp; Roles
          </h2>
          <span className="mt-0.5 size-6 shrink-0 text-[var(--core-primary)]">
            <img alt="" className="hw-icon-ink" height="24" width="24" src={globeSvg} />
          </span>
          <div className="ml-auto shrink-0 self-start text-[var(--hw-teams-ink)]">
            <div className="landing-portal-actions">
              <button
                type="button"
                onClick={() => onOpenContact('Full-Time Role')}
                data-slot="button"
                data-variant="primary"
                className="core-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out active:scale-[0.98] bg-[var(--hpv2-brand,var(--core-primary))] text-[var(--core-white)] hover:shadow-[var(--hpv2-shadow-lift-strong)] gap-2 px-3 py-2.5 text-xs"
              >
                <span className="leading-none whitespace-nowrap">Send a message</span>
                <span aria-hidden="true" className="core-button-hover-border" />
              </button>
              <button
                type="button"
                onClick={handleCopyEmail}
                data-slot="button"
                data-variant="underline"
                className="core-button group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 bg-transparent px-3 py-2.5 font-[family-name:var(--font-mono)] text-xs tracking-[0.1em] text-current uppercase"
              >
                <span className="leading-none whitespace-nowrap underline decoration-current/65 underline-offset-[0.2em] group-hover:decoration-current">
                  {emailCopied ? 'Copied email' : 'Copy email'}
                </span>
              </button>
            </div>
          </div>
        </div>

        {/* Lead description */}
        <p
          className="landing-portal-description"
          style={{
            fontFamily: 'var(--font-body)',
            fontSize: 'var(--hpv2-type-body)',
            fontWeight: 400,
            lineHeight: 1.6,
          }}
        >
          {PORTFOLIO_PROFILE.bioShort}
        </p>

        {/* Blue Artwork Plate */}
        <div className="landing-portal-art">
          <figure className="hw-teams-plate bg-core relative h-[var(--hw-teams-plate-h)] w-full overflow-clip rounded-t-md">
            <div className="hw-noise absolute inset-0">
              <img alt="" className="hw-parallax absolute inset-0 size-full object-cover" loading="lazy" src={portalArtSvg} />
            </div>
          </figure>
        </div>
      </div>
    </section>
  );
}



