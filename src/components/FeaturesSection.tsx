import { useEffect, useMemo, useState } from 'react';
import featuresSvg from '@/src/assets/core/features.svg';
import {
  PROJECT_CATEGORIES,
  ProjectCategory,
  ProjectItem,
  PROJECTS,
} from '@/src/data/siteData';
import { ArrowUpRightIcon } from './Icons';

interface FeaturesSectionProps {
  onOpenContact?: (topic?: string) => void;
  highlightedProjectId?: string | null;
}

export function FeaturesSection({ onOpenContact, highlightedProjectId }: FeaturesSectionProps) {
  const [category, setCategory] = useState<ProjectCategory>('All');
  const [layoutMode, setLayoutMode] = useState<'editorial' | 'bento'>('bento');
  const [activeProject, setActiveProject] = useState<ProjectItem | null>(null);

  const visibleProjects = useMemo(() => {
    if (category === 'All') return PROJECTS;
    return PROJECTS.filter((p) => p.category === category);
  }, [category]);

  useEffect(() => {
    if (!highlightedProjectId) return;
    setCategory('All');
  }, [highlightedProjectId]);

  useEffect(() => {
    if (!activeProject) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setActiveProject(null);
        return;
      }
      if (e.key === 'ArrowRight' || e.key === 'ArrowLeft') {
        const list = visibleProjects.length > 0 ? visibleProjects : PROJECTS;
        const idx = list.findIndex((p) => p.id === activeProject.id);
        if (idx === -1) return;
        const nextIdx =
          e.key === 'ArrowRight'
            ? (idx + 1) % list.length
            : (idx - 1 + list.length) % list.length;
        setActiveProject(list[nextIdx]);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [activeProject, visibleProjects]);

  const stepProject = (dir: 1 | -1) => {
    if (!activeProject) return;
    const list = visibleProjects.length > 0 ? visibleProjects : PROJECTS;
    const idx = list.findIndex((p) => p.id === activeProject.id);
    if (idx === -1) return;
    setActiveProject(list[(idx + dir + list.length) % list.length]);
  };

  return (
    <section aria-label="Selected Work and Project Gallery" className="landing-features" id="projects">
      <span id="gallery" aria-hidden="true" />
      <div className="mx-auto w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] px-[var(--hw-teams-pad-x)]">
        {/* Section Heading & Controls */}
        <div className="flex flex-col gap-6 border-b border-dotted border-[var(--core-primary)] pb-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div className="landing-section-title flex items-start gap-2.5">
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
                Project Gallery
              </h2>
              <span className="mt-0.5 size-6 shrink-0 text-[var(--core-primary)]">
                <img alt="" className="hw-icon-ink" height="24" width="24" src={featuresSvg} />
              </span>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* View mode segmented buttons */}
              <div
                role="group"
                aria-label="Gallery layout view"
                className="inline-flex border border-[var(--hpv2-hairline)] p-0.5"
              >
                <button
                  type="button"
                  onClick={() => setLayoutMode('bento')}
                  aria-pressed={layoutMode === 'bento'}
                  className={`min-h-[34px] cursor-pointer px-3 py-1 font-[family-name:var(--font-mono)] text-xs whitespace-nowrap uppercase transition-colors ${
                    layoutMode === 'bento'
                      ? 'bg-[var(--core-color-blue)] text-white'
                      : 'text-[var(--hw-teams-ink)] opacity-75 hover:opacity-100'
                  }`}
                >
                  Gallery Grid
                </button>
                <button
                  type="button"
                  onClick={() => setLayoutMode('editorial')}
                  aria-pressed={layoutMode === 'editorial'}
                  className={`min-h-[34px] cursor-pointer px-3 py-1 font-[family-name:var(--font-mono)] text-xs whitespace-nowrap uppercase transition-colors ${
                    layoutMode === 'editorial'
                      ? 'bg-[var(--core-color-blue)] text-white'
                      : 'text-[var(--hw-teams-ink)] opacity-75 hover:opacity-100'
                  }`}
                >
                  Showcase Index
                </button>
              </div>
            </div>
          </div>

          {/* Interactive Category Filter Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div role="tablist" aria-label="Filter projects by discipline" className="flex flex-wrap items-center gap-1.5">
              {PROJECT_CATEGORIES.map((cat) => {
                const active = category === cat;
                return (
                  <button
                    key={cat}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setCategory(cat)}
                    className={`min-h-[36px] cursor-pointer border px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs whitespace-nowrap uppercase transition-colors duration-150 ${
                      active
                        ? 'border-[var(--core-color-blue)] bg-[var(--core-color-blue)] text-white'
                        : 'border-[var(--hpv2-hairline)] bg-transparent text-[var(--hw-teams-ink)] hover:bg-[var(--hpv2-row-hover)]'
                    }`}
                  >
                    {cat}
                  </button>
                );
              })}
            </div>

            <p
              className="tabular-nums opacity-75"
              style={{
                fontFamily: 'var(--hpv2-font-meta)',
                fontSize: 'var(--hpv2-type-info)',
                letterSpacing: '0.04em',
                textTransform: 'uppercase',
              }}
            >
              Showing {String(visibleProjects.length).padStart(2, '0')} of {String(PROJECTS.length).padStart(2, '0')} Works · Click any plate to inspect
            </p>
          </div>
        </div>

        {/* Gallery Grid or Editorial Subgrid */}
        {layoutMode === 'bento' ? (
          <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {visibleProjects.map((project, idx) => {
              const isLead = category === 'All' && idx === 0;
              const isHighlighted = highlightedProjectId === project.id;
              return (
                <article
                  key={project.id}
                  id={`project-${project.id}`}
                  className={`group flex flex-col justify-between border transition-colors duration-150 ${
                    isLead ? 'md:col-span-2' : ''
                  } ${
                    isHighlighted
                      ? 'border-[var(--core-color-blue)] bg-[var(--hpv2-row-hover)]'
                      : 'border-[var(--hpv2-hairline)] bg-[var(--hpv2-row-well)] hover:border-[var(--core-primary)]'
                  }`}
                >
                  <button
                    type="button"
                    onClick={() => setActiveProject(project)}
                    aria-label={`Inspect ${project.title} case study`}
                    className="flex h-full cursor-pointer flex-col text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--core-color-blue)]"
                  >
                    {/* Visual Showcase Plate */}
                    <div className="w-full overflow-hidden border-b border-[var(--hpv2-hairline)]">
                      <figure
                        className={`hw-teams-plate bg-core relative w-full overflow-clip ${
                          isLead ? 'h-[320px] md:h-[360px]' : 'h-[240px]'
                        }`}
                      >
                        <div className="hw-noise absolute inset-0">
                          <img
                            alt={`${project.title} visual showcase`}
                            className="hw-parallax absolute inset-0 size-full object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
                            loading="lazy"
                            src={project.image}
                          />
                        </div>
                        <div
                          aria-hidden="true"
                          className="absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/65 to-transparent"
                        />
                        <div className="absolute right-4 bottom-3 left-4 flex items-center justify-between text-white">
                          <span className="font-[family-name:var(--hpv2-font-meta)] text-[11px] tabular-nums uppercase">
                            {project.index} · {project.year}
                          </span>
                          <span className="inline-flex items-center gap-1 font-[family-name:var(--font-mono)] text-xs uppercase opacity-90 transition-transform duration-150 group-hover:translate-x-0.5">
                            <span>Inspect</span>
                            <ArrowUpRightIcon className="size-3.5" />
                          </span>
                        </div>
                      </figure>
                    </div>

                    {/* Clean Unboxed Metadata & Narrative */}
                    <div className="flex flex-1 flex-col justify-between gap-5 p-6">
                      <div className="flex flex-col gap-3">
                        <p
                          className="tabular-nums opacity-75"
                          style={{
                            fontFamily: 'var(--hpv2-font-meta)',
                            fontSize: 'var(--hpv2-type-info)',
                            lineHeight: 1.5,
                            textTransform: 'uppercase',
                          }}
                        >
                          {project.category} · {project.role} · {project.metricValue}
                        </p>
                        <h3
                          className="text-[var(--hw-teams-ink)]"
                          style={{
                            fontFamily: 'var(--font-display)',
                            fontSize: isLead ? 'clamp(2rem, 3.2vw, 42px)' : 'clamp(1.75rem, 2.5vw, 34px)',
                            fontWeight: 500,
                            lineHeight: 1.05,
                          }}
                        >
                          {project.title}
                        </h3>
                        <p
                          className="opacity-90"
                          style={{
                            fontFamily: 'var(--font-body)',
                            fontSize: '15px',
                            lineHeight: 1.55,
                          }}
                        >
                          {project.description}
                        </p>
                      </div>

                      <div className="border-t border-dotted border-[var(--hpv2-hairline)] pt-3 font-[family-name:var(--hpv2-font-meta)] text-[11px] opacity-75">
                        {project.stack.join(' · ')}
                      </div>
                    </div>
                  </button>
                </article>
              );
            })}
          </div>
        ) : (
          <div className="landing-feature-grid">
            {visibleProjects.map((project) => (
              <article key={project.id} id={`project-${project.id}`} className="landing-feature">
                <div className="landing-feature-heading">
                  <p
                    className="tabular-nums"
                    style={{
                      fontFamily: 'var(--hpv2-font-meta)',
                      fontSize: 'var(--hpv2-type-info)',
                      fontWeight: 400,
                      lineHeight: 1.5,
                      textTransform: 'uppercase',
                    }}
                  >
                    {project.kicker} · {project.year}
                  </p>
                  <h3
                    style={{
                      fontFamily: 'var(--font-display)',
                      fontSize: 'var(--hw-teams-feature-title)',
                      fontWeight: 500,
                      lineHeight: 1.1,
                    }}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveProject(project)}
                      className="cursor-pointer text-left underline decoration-transparent underline-offset-4 transition-colors hover:decoration-current"
                    >
                      {project.title}
                    </button>
                  </h3>
                </div>

                <p
                  className="landing-feature-description"
                  style={{
                    fontFamily: 'var(--font-body)',
                    fontSize: 'var(--hpv2-type-body)',
                    fontWeight: 400,
                    lineHeight: 1.6,
                  }}
                >
                  {project.description}
                </p>

                <div className={`landing-feature-art ${project.artClass}`}>
                  <button
                    type="button"
                    onClick={() => setActiveProject(project)}
                    aria-label={`Inspect ${project.title}`}
                    className="block w-full cursor-pointer text-left"
                  >
                    <figure className="hw-teams-plate bg-core relative h-[var(--hw-teams-plate-h)] w-full overflow-clip rounded-t-md">
                      <div className="hw-noise absolute inset-0">
                        <img
                          alt={`${project.title} artwork`}
                          className="hw-parallax absolute inset-0 size-full object-cover"
                          loading="lazy"
                          src={project.image}
                        />
                      </div>
                    </figure>
                  </button>
                </div>
              </article>
            ))}
          </div>
        )}
      </div>

      {/* Fullscreen Project Gallery Lightbox Modal */}
      {activeProject && (
        <div
          role="dialog"
          aria-modal="true"
          aria-label={`${activeProject.title} project details`}
          className="fixed inset-0 z-[220] flex items-center justify-center bg-black/80 p-4 backdrop-blur-xs"
          onClick={() => setActiveProject(null)}
        >
          <div
            className="grid max-h-[90vh] w-full max-w-4xl grid-cols-1 overflow-y-auto border border-[var(--hpv2-hairline)] bg-[var(--core-paper)] text-[var(--hw-teams-ink)] shadow-2xl md:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Left Media Pane */}
            <figure className="hw-teams-plate bg-core relative min-h-[260px] overflow-hidden md:min-h-[460px]">
              <div className="hw-noise absolute inset-0">
                <img
                  src={activeProject.image}
                  alt={activeProject.title}
                  className="size-full object-cover"
                />
              </div>
              <div
                aria-hidden="true"
                className="absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t from-black/75 to-transparent"
              />
              <figcaption className="absolute right-5 bottom-4 left-5 flex items-end justify-between text-white">
                <div>
                  <span className="block font-[family-name:var(--hpv2-font-meta)] text-[11px] tabular-nums uppercase opacity-80">
                    {activeProject.metricLabel}
                  </span>
                  <span className="font-[family-name:var(--font-display)] text-3xl font-medium tabular-nums">
                    {activeProject.metricValue}
                  </span>
                </div>
                <span className="font-[family-name:var(--hpv2-font-meta)] text-[11px] tabular-nums uppercase opacity-80">
                  {activeProject.index} / {String(PROJECTS.length).padStart(2, '0')}
                </span>
              </figcaption>
            </figure>

            {/* Right Case Study Pane */}
            <div className="flex flex-col justify-between gap-6 p-6 md:p-8">
              <div className="flex flex-col gap-4">
                <div className="flex items-start justify-between gap-4 border-b border-dotted border-[var(--hpv2-hairline)] pb-4">
                  <div>
                    <p className="font-[family-name:var(--hpv2-font-meta)] text-[11px] tabular-nums uppercase opacity-70">
                      {activeProject.category} · {activeProject.year} · {activeProject.role}
                    </p>
                    <h3
                      className="mt-1 text-[var(--hw-teams-ink)]"
                      style={{
                        fontFamily: 'var(--font-display)',
                        fontSize: '36px',
                        fontWeight: 500,
                        lineHeight: 0.98,
                      }}
                    >
                      {activeProject.title}
                    </h3>
                  </div>
                  <button
                    type="button"
                    onClick={() => setActiveProject(null)}
                    aria-label="Close project lightbox"
                    className="grid size-9 shrink-0 cursor-pointer place-items-center font-[family-name:var(--font-mono)] text-sm hover:bg-[var(--hpv2-row-hover)]"
                  >
                    ✕
                  </button>
                </div>

                <p className="text-[15px] leading-relaxed">{activeProject.description}</p>

                <div className="space-y-3 border-t border-dotted border-[var(--hpv2-hairline)] pt-4 text-sm leading-relaxed">
                  <div>
                    <span className="block font-[family-name:var(--hpv2-font-meta)] text-[10px] uppercase opacity-65">
                      Architecture
                    </span>
                    <p className="mt-1 opacity-90">{activeProject.architecture}</p>
                  </div>
                  <div>
                    <span className="block font-[family-name:var(--hpv2-font-meta)] text-[10px] uppercase opacity-65">
                      Outcome
                    </span>
                    <p className="mt-1 opacity-90">{activeProject.outcome}</p>
                  </div>
                  <div>
                    <span className="block font-[family-name:var(--hpv2-font-meta)] text-[10px] uppercase opacity-65">
                      Stack
                    </span>
                    <p className="mt-1 font-[family-name:var(--hpv2-font-meta)] text-[11px] opacity-80">
                      {activeProject.stack.join(' · ')}
                    </p>
                  </div>
                </div>
              </div>

              {/* Footer Controls */}
              <div className="flex flex-wrap items-center justify-between gap-3 border-t border-dotted border-[var(--hpv2-hairline)] pt-4">
                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => stepProject(-1)}
                    className="min-h-[36px] cursor-pointer border border-[var(--hpv2-hairline)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs uppercase hover:bg-[var(--hpv2-row-hover)]"
                  >
                    ← Prev
                  </button>
                  <button
                    type="button"
                    onClick={() => stepProject(1)}
                    className="min-h-[36px] cursor-pointer border border-[var(--hpv2-hairline)] px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs uppercase hover:bg-[var(--hpv2-row-hover)]"
                  >
                    Next →
                  </button>
                </div>

                <div className="flex items-center gap-2">
                  <a
                    href={activeProject.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex min-h-[36px] items-center gap-1 px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs uppercase underline underline-offset-4"
                  >
                    <span>Source</span>
                    <ArrowUpRightIcon className="size-3.5" />
                  </a>
                  {onOpenContact && (
                    <button
                      type="button"
                      onClick={() => {
                        const title = activeProject.title;
                        setActiveProject(null);
                        onOpenContact(`Project Inquiry: ${title}`);
                      }}
                      className="core-button relative inline-flex cursor-pointer items-center justify-center bg-[var(--core-color-blue)] px-3.5 py-2 text-xs text-white uppercase"
                    >
                      <span>Discuss Build</span>
                      <span aria-hidden="true" className="core-button-hover-border" />
                    </button>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}



