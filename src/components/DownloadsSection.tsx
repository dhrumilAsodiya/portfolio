import { useState } from 'react';
import desktopPreviewWebp from '@/src/assets/core/desktop-preview.webp';
import desktopSvg from '@/src/assets/core/desktop.svg';
import platformArtWebp from '@/src/assets/core/platform-art.webp';

export function DownloadsSection() {
  const [previewZoomOpen, setPreviewZoomOpen] = useState(false);

  return (
    <section aria-label="Featured Workbench and Core Disciplines" className="landing-downloads text-[var(--hw-fg)]" id="disciplines">
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)]">
        {/* Featured Desktop Case Study Preview */}
        <figure aria-label="Featured Developer Workbench Preview" className="landing-desktop-preview group">
          <button
            type="button"
            onClick={() => setPreviewZoomOpen(true)}
            aria-label="Inspect featured workspace preview"
            className="block w-full cursor-pointer overflow-hidden border border-[color-mix(in_srgb,var(--core-white)_15%,transparent)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-white"
          >
            <img
              src={desktopPreviewWebp}
              alt="Developer Workbench interface showing code editor, interactive terminal, and system telemetry"
              className="landing-desktop-video transition-transform duration-300 ease-out group-hover:scale-[1.006]"
            />
          </button>
        </figure>

        {/* Section Title */}
        <div className="landing-download-title">
          <img alt="" height="24" width="24" src={desktopSvg} />
          <div className="landing-section-title landing-download-heading flex w-full items-start gap-2.5">
            <h2
              className="text-[var(--core-white)]"
              style={{
                fontFamily: 'var(--font-rules-gothic-cnd)',
                fontSize: 'var(--hw-teams-display)',
                fontWeight: 400,
                lineHeight: 1,
                letterSpacing: '-0.02em',
              }}
            >
              Core Disciplines
            </h2>
          </div>
          <p
            className="text-[var(--hw-fg)]"
            style={{
              fontFamily: 'var(--font-body)',
              fontSize: 'var(--hpv2-type-body)',
              fontWeight: 400,
              lineHeight: 1.6,
            }}
          >
            End-to-end engineering across UI, autonomous agents, and runtime infra.
          </p>
        </div>

        {/* 3 Discipline Cards */}
        <div className="landing-platforms">
          <article className="landing-platform landing-platform--mac">
            <img alt="" aria-hidden="true" className="landing-platform-art" loading="lazy" src={platformArtWebp} />
            <div className="landing-platform-copy">
              <p
                style={{
                  fontFamily: 'var(--hpv2-font-meta)',
                  fontSize: 'var(--hpv2-type-info)',
                  lineHeight: 1.5,
                  textTransform: 'uppercase',
                }}
              >
                01 · Design &amp; Frontend
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--hw-teams-feature-title)',
                  fontWeight: 500,
                  lineHeight: 1.1,
                }}
              >
                Interfaces
              </h3>
              <a
                href="#projects"
                data-slot="button"
                data-variant="secondary"
                className="core-button landing-cta group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out active:scale-[0.98] bg-[color-mix(in_srgb,var(--core-paper)_90%,transparent)] text-[var(--hpv2-brand,var(--core-primary))] hover:bg-[var(--core-paper)] hover:shadow-[var(--hpv2-shadow-lift)] gap-2 px-3 py-2.5 text-xs"
              >
                <span className="leading-none whitespace-nowrap">Explore UI Work</span>
                <span aria-hidden="true" className="core-button-hover-border" />
              </a>
            </div>
          </article>

          <article className="landing-platform landing-platform--windows">
            <img alt="" aria-hidden="true" className="landing-platform-art" loading="lazy" src={platformArtWebp} />
            <div className="landing-platform-copy">
              <p
                style={{
                  fontFamily: 'var(--hpv2-font-meta)',
                  fontSize: 'var(--hpv2-type-info)',
                  lineHeight: 1.5,
                  textTransform: 'uppercase',
                }}
              >
                02 · Agents &amp; Tooling
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--hw-teams-feature-title)',
                  fontWeight: 500,
                  lineHeight: 1.1,
                }}
              >
                AI Systems
              </h3>
              <div className="flex max-w-full flex-col items-center gap-3">
                <a
                  href="#projects"
                  data-slot="button"
                  data-variant="secondary"
                  className="core-button landing-cta group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out active:scale-[0.98] bg-[color-mix(in_srgb,var(--core-paper)_90%,transparent)] text-[var(--hpv2-brand,var(--core-primary))] hover:bg-[var(--core-paper)] hover:shadow-[var(--hpv2-shadow-lift)] gap-2 px-3 py-2.5 text-xs"
                >
                  <span className="leading-none whitespace-nowrap">View Agent Architecture</span>
                  <span aria-hidden="true" className="core-button-hover-border" />
                </a>
                <p
                  className="flex flex-col items-center"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--hpv2-type-small)',
                    lineHeight: 1.5,
                  }}
                >
                  <a
                    className="px-2 py-1 underline decoration-current/65 underline-offset-[0.2em] hover:decoration-current"
                    href="#projects"
                  >
                    Memory &amp; skill synthesis
                  </a>
                  <a
                    className="px-2 py-1 underline decoration-current/65 underline-offset-[0.2em] hover:decoration-current"
                    href="#skills"
                  >
                    Explore skill map
                  </a>
                </p>
              </div>
            </div>
          </article>

          <article className="landing-platform landing-platform--linux">
            <img alt="" aria-hidden="true" className="landing-platform-art" loading="lazy" src={platformArtWebp} />
            <div className="landing-platform-copy">
              <p
                style={{
                  fontFamily: 'var(--hpv2-font-meta)',
                  fontSize: 'var(--hpv2-type-info)',
                  lineHeight: 1.5,
                  textTransform: 'uppercase',
                }}
              >
                03 · Runtimes &amp; CLI
              </p>
              <h3
                style={{
                  fontFamily: 'var(--font-display)',
                  fontSize: 'var(--hw-teams-feature-title)',
                  fontWeight: 500,
                  lineHeight: 1.1,
                }}
              >
                Infrastructure
              </h3>
              <a
                href="#projects"
                data-slot="button"
                data-variant="secondary"
                className="core-button landing-cta group relative inline-flex cursor-pointer items-center justify-center rounded-none border-0 bg-clip-padding outline-none select-none font-[family-name:var(--font-mono)] tracking-[0.1em] uppercase transition-[background-color,box-shadow,color,transform] duration-150 ease-out active:scale-[0.98] bg-[color-mix(in_srgb,var(--core-paper)_90%,transparent)] text-[var(--hpv2-brand,var(--core-primary))] hover:bg-[var(--core-paper)] hover:shadow-[var(--hpv2-shadow-lift)] gap-2 px-3 py-2.5 text-xs"
              >
                <span className="leading-none whitespace-nowrap">Inspect Runtime Work</span>
                <span aria-hidden="true" className="core-button-hover-border" />
              </a>
            </div>
          </article>
        </div>
      </div>

      {/* Lightbox for Featured Case Study Preview */}
      {previewZoomOpen && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label="Featured Workbench Preview"
          className="fixed inset-0 z-[200] flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={() => setPreviewZoomOpen(false)}
        >
          <div
            className="relative max-h-[90vh] w-full max-w-6xl border border-white/20 bg-[var(--core-primary)] p-2 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              aria-label="Close preview"
              onClick={() => setPreviewZoomOpen(false)}
              className="absolute top-4 right-4 z-10 flex size-9 cursor-pointer items-center justify-center bg-black/75 font-[family-name:var(--font-mono)] text-sm text-white hover:bg-black"
            >
              ✕
            </button>
            <img
              src={desktopPreviewWebp}
              alt="Featured AI Agent Workbench preview expanded"
              className="max-h-[85vh] w-full object-contain"
            />
          </div>
        </div>
      )}
    </section>
  );
}


