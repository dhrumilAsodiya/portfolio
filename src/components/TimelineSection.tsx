import { useEffect, useMemo, useRef, useState } from 'react';
import { TIMELINE_MILESTONES } from '@/src/data/siteData';

const DURATION_METADATA: Record<string, { duration: string; isPresent?: boolean }> = {
  'm-2022': { duration: '4 Yrs · Degree' },
  'm-2026-silver': { duration: '6 Mos · Internship' },
  'm-2026-ranucle-intern': { duration: '4 Mos · Internship' },
  'm-2026-ranucle-eng': { duration: 'Present · On-Site', isPresent: true },
};

export function TimelineSection() {
  const [activeId, setActiveId] = useState<string>(TIMELINE_MILESTONES[0]?.id ?? '');
  const itemRefs = useRef<Record<string, HTMLElement | null>>({});

  const activeIdx = useMemo(() => {
    const idx = TIMELINE_MILESTONES.findIndex((m) => m.id === activeId);
    return idx >= 0 ? idx : 0;
  }, [activeId]);

  // Scroll observer: auto-highlight milestone as user scrolls down without clicking
  useEffect(() => {
    if (typeof window === 'undefined') return;

    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries.filter((e) => e.isIntersecting);
        if (visible.length > 0) {
          // Choose the entry closest to the viewport's reading line (top-third)
          const bestEntry = visible.reduce((prev, curr) => {
            const prevDistance = Math.abs(prev.boundingClientRect.top - window.innerHeight * 0.28);
            const currDistance = Math.abs(curr.boundingClientRect.top - window.innerHeight * 0.28);
            return currDistance < prevDistance ? curr : prev;
          });
          const id = bestEntry.target.getAttribute('data-milestone-id');
          if (id) {
            setActiveId(id);
          }
        }
      },
      {
        rootMargin: '-20% 0px -45% 0px',
        threshold: [0.1, 0.4, 0.7],
      }
    );

    const currentRefs = itemRefs.current;
    Object.values(currentRefs).forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  const scrollToMilestone = (id: string) => {
    setActiveId(id);
    const target = itemRefs.current[id];
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  };

  return (
    <section
      aria-label="Career and Engineering Progress Timeline"
      id="timeline"
      className="bg-core-paper pt-[110px] pb-[70px] text-[var(--hw-teams-ink)] max-md:pt-16 max-md:pb-12"
    >
      <div className="mx-auto flex w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] flex-col gap-10 px-[var(--hw-teams-pad-x)]">
        {/* Section Heading */}
        <div className="border-b border-dotted border-[var(--core-primary)] pb-8">
          <p
            className="mb-2 opacity-75"
            style={{
              fontFamily: 'var(--hpv2-font-meta)',
              fontSize: 'var(--hpv2-type-info)',
              letterSpacing: '0.06em',
              textTransform: 'uppercase',
            }}
          >
            Progression Arc · 2022 — 2026
          </p>
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
            Progress Timeline
          </h2>
        </div>

        {/* Vertical Timeline Spine Corridor */}
        <ol className="relative flex flex-col">
          {TIMELINE_MILESTONES.map((item, idx) => {
            const isActive = item.id === activeId;
            const isCompleted = idx < activeIdx;
            const isLast = idx === TIMELINE_MILESTONES.length - 1;
            const meta = DURATION_METADATA[item.id];

            return (
              <li
                key={item.id}
                id={`milestone-${item.id}`}
                data-milestone-id={item.id}
                ref={(el) => {
                  itemRefs.current[item.id] = el;
                }}
                className="relative flex flex-col md:flex-row gap-6 md:gap-8 pb-12 last:pb-2"
              >
                {/* Vertical Continuous Connecting Line (runs from this node to the next) */}
                {!isLast && (
                  <div
                    aria-hidden="true"
                    className={`absolute left-[17px] md:left-[229px] top-10 bottom-0 w-[2px] transition-colors duration-300 z-0 ${
                      isCompleted ? 'bg-[var(--core-color-blue)]' : 'bg-[var(--hpv2-hairline)]'
                    }`}
                  />
                )}

                {/* Left Metadata Column (Desktop: visible on left; Mobile: embedded in card header) */}
                <div className="hidden md:flex md:w-[210px] md:shrink-0 md:flex-col md:items-end md:text-right md:pt-1">
                  <span className="font-[family-name:var(--hpv2-font-meta)] text-xs font-semibold tabular-nums uppercase text-[var(--hw-teams-ink)]">
                    {item.period}
                  </span>
                  <span className="mt-0.5 font-[family-name:var(--hpv2-font-meta)] text-[10px] uppercase opacity-65">
                    {item.track}
                  </span>
                  {meta && (
                    <span
                      className={`mt-2.5 inline-flex items-center gap-1.5 px-2 py-0.5 font-[family-name:var(--font-mono)] text-[10px] uppercase tracking-wider border ${
                        meta.isPresent
                          ? 'border-[var(--core-color-blue)] bg-[var(--core-color-blue)]/10 text-[var(--core-color-blue)] font-bold'
                          : 'border-[var(--hpv2-hairline)] bg-[var(--hpv2-row-well)] text-[var(--hw-teams-ink)] opacity-75'
                      }`}
                    >
                      {meta.isPresent && (
                        <span aria-hidden="true" className="size-1.5 rounded-full bg-[var(--core-color-blue)] animate-pulse" />
                      )}
                      {meta.duration}
                    </span>
                  )}
                </div>

                {/* Center Vertical Node Marker */}
                <div className="relative flex items-center md:items-start z-10 shrink-0">
                  <button
                    type="button"
                    aria-label={`Jump to ${item.title}`}
                    onClick={() => scrollToMilestone(item.id)}
                    className={`grid size-9 place-items-center border font-[family-name:var(--font-mono)] text-xs tabular-nums font-bold transition-all duration-300 cursor-pointer select-none ${
                      isActive
                        ? 'border-[var(--core-color-blue)] bg-[var(--core-color-blue)] text-white shadow-[0_0_18px_rgba(0,0,242,0.45)] scale-110'
                        : isCompleted
                          ? 'border-[var(--core-color-blue)] bg-[var(--core-color-blue)]/15 text-[var(--core-color-blue)]'
                          : 'border-[var(--hpv2-hairline)] bg-[var(--hpv2-row-well)] text-[var(--hw-teams-ink)] opacity-70 hover:opacity-100'
                    }`}
                  >
                    {String(idx + 1).padStart(2, '0')}
                  </button>

                  {/* Mobile-only header next to the node */}
                  <div className="ml-3 flex flex-col md:hidden">
                    <div className="flex items-center gap-2">
                      <span className="font-[family-name:var(--hpv2-font-meta)] text-xs font-semibold tabular-nums uppercase text-[var(--hw-teams-ink)]">
                        {item.period}
                      </span>
                      {meta?.isPresent && (
                        <span className="inline-flex items-center gap-1 px-1.5 py-0.5 text-[9px] font-mono uppercase bg-[var(--core-color-blue)]/10 text-[var(--core-color-blue)] border border-[var(--core-color-blue)]/30 font-bold">
                          <span className="size-1 rounded-full bg-[var(--core-color-blue)] animate-pulse" />
                          Live
                        </span>
                      )}
                    </div>
                    <span className="text-[10px] font-mono uppercase opacity-65">{item.track}</span>
                  </div>
                </div>

                {/* Right Milestone Narrative Card */}
                <div
                  className={`w-full flex-1 border p-6 md:p-7 transition-all duration-300 text-left ${
                    isActive
                      ? 'border-[var(--core-color-blue)] bg-[var(--hpv2-row-hover)] shadow-[var(--hpv2-shadow-lift)] ring-1 ring-[var(--core-color-blue)]/20'
                      : 'border-[var(--hpv2-hairline)] bg-[var(--hpv2-row-well)] hover:border-[var(--core-primary)]'
                  }`}
                >
                  <div className="flex flex-wrap items-baseline justify-between gap-2 border-b border-dotted border-[var(--hpv2-hairline)] pb-4">
                    <div>
                      <span className="font-[family-name:var(--hpv2-font-meta)] text-[11px] uppercase tracking-wider opacity-65">
                        {item.stage}
                      </span>
                      <h3
                        className="mt-1 text-[var(--hw-teams-ink)]"
                        style={{
                          fontFamily: 'var(--font-rules-gothic-cnd)',
                          fontSize: '32px',
                          fontWeight: 400,
                          lineHeight: 1.05,
                          letterSpacing: '-0.01em',
                        }}
                      >
                        {item.title}
                      </h3>
                    </div>
                    <span className="font-[family-name:var(--hpv2-font-meta)] text-xs font-medium uppercase tracking-wider text-[var(--hw-teams-ink)] opacity-80">
                      {item.organization}
                    </span>
                  </div>

                  <p className="mt-4 text-[15px] leading-relaxed text-[var(--hw-teams-ink)] opacity-90">
                    {item.summary}
                  </p>

                  <ul className="mt-4 space-y-2 text-sm leading-relaxed text-[var(--hw-teams-ink)] opacity-85">
                    {item.outcomes.map((line) => (
                      <li key={line} className="flex items-start gap-2.5">
                        <span
                          aria-hidden="true"
                          className={`mt-2 size-1.5 shrink-0 transition-colors duration-200 ${
                            isActive ? 'bg-[var(--core-color-blue)]' : 'bg-current opacity-60'
                          }`}
                        />
                        <span>{line}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="mt-6 flex flex-wrap items-center gap-1.5 border-t border-dotted border-[var(--hpv2-hairline)] pt-4">
                    <span className="mr-1.5 font-[family-name:var(--hpv2-font-meta)] text-[10px] uppercase tracking-wider opacity-65">
                      Skills Unlocked:
                    </span>
                    {item.skillsUnlocked.map((skill) => (
                      <span
                        key={skill}
                        className={`inline-block px-2.5 py-1 font-[family-name:var(--font-mono)] text-[11px] uppercase transition-colors duration-200 border ${
                          isActive
                            ? 'border-[var(--core-color-blue)]/40 bg-[var(--core-color-blue)]/8 text-[var(--core-color-blue)] font-medium'
                            : 'border-[var(--hpv2-hairline)] bg-transparent text-[var(--hw-teams-ink)] opacity-75'
                        }`}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
