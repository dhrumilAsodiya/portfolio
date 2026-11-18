import { useMemo, useState } from 'react';
import {
  RADAR_AXES,
  SKILL_DOMAINS,
  SkillDomain,
  SKILLS_MATRIX,
} from '@/src/data/siteData';

interface SkillsSectionProps {
  onSelectProject?: (projectId: string) => void;
}

const CX = 180;
const CY = 180;
const RADIUS = 112;
const RINGS = [25, 50, 75, 100];

function polarPoint(angleRad: number, radius: number) {
  return {
    x: CX + radius * Math.cos(angleRad),
    y: CY + radius * Math.sin(angleRad),
  };
}

export function SkillsSection({ onSelectProject }: SkillsSectionProps) {
  const [domain, setDomain] = useState<SkillDomain>('All');
  const [activeAxisId, setActiveAxisId] = useState<string>(RADAR_AXES[0].id);

  const filteredSkills = useMemo(() => {
    if (domain === 'All') return SKILLS_MATRIX;
    return SKILLS_MATRIX.filter((s) => s.domain === domain);
  }, [domain]);

  const activeAxis = useMemo(
    () => RADAR_AXES.find((a) => a.id === activeAxisId) ?? RADAR_AXES[0],
    [activeAxisId]
  );

  // Compute baseline polygon + filtered focus polygon
  const { baselinePoints, focusPoints, vertexCoords } = useMemo(() => {
    const count = RADAR_AXES.length;
    const coords = RADAR_AXES.map((axis, idx) => {
      const angle = (Math.PI * 2 * idx) / count - Math.PI / 2;
      const fullPt = polarPoint(angle, (axis.level / 100) * RADIUS);
      const inDomain = domain === 'All' || axis.domain === domain;
      const focusRadius = ((inDomain ? axis.level : Math.round(axis.level * 0.42)) / 100) * RADIUS;
      const focusPt = polarPoint(angle, focusRadius);
      const labelPt = polarPoint(angle, RADIUS + 28);
      return {
        axis,
        angle,
        fullPt,
        focusPt,
        labelPt,
        inDomain,
      };
    });

    return {
      baselinePoints: coords.map((c) => `${c.fullPt.x.toFixed(1)},${c.fullPt.y.toFixed(1)}`).join(' '),
      focusPoints: coords.map((c) => `${c.focusPt.x.toFixed(1)},${c.focusPt.y.toFixed(1)}`).join(' '),
      vertexCoords: coords,
    };
  }, [domain]);

  const handleDomainChange = (next: SkillDomain) => {
    setDomain(next);
    if (next !== 'All') {
      const match = RADAR_AXES.find((a) => a.domain === next);
      if (match) setActiveAxisId(match.id);
    }
  };

  return (
    <section
      aria-label="Technical Skills Visualization"
      id="skills"
      className="py-20 text-[var(--hw-fg)] max-md:py-14"
    >
      <div className="mx-auto flex w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] flex-col gap-10 px-[var(--hw-teams-pad-x)]">
        {/* Header & Domain Filters */}
        <div className="flex flex-col gap-6 border-b border-dotted border-white/25 pb-8">
          <div className="flex flex-wrap items-end justify-between gap-6">
            <div>
              <p
                className="mb-2 opacity-75"
                style={{
                  fontFamily: 'var(--hpv2-font-meta)',
                  fontSize: 'var(--hpv2-type-info)',
                  letterSpacing: '0.06em',
                  textTransform: 'uppercase',
                }}
              >
                Capability Distribution · Production Depth
              </p>
              <h2
                className="text-[var(--hw-fg)]"
                style={{
                  fontFamily: 'var(--font-rules-gothic-cnd)',
                  fontSize: 'var(--hw-teams-display)',
                  fontWeight: 400,
                  lineHeight: 1,
                  letterSpacing: '-0.02em',
                }}
              >
                Skill Visualization
              </h2>
            </div>

            <div role="tablist" aria-label="Filter skills by domain" className="flex flex-wrap items-center gap-1.5">
              {SKILL_DOMAINS.map((item) => {
                const active = domain === item;
                return (
                  <button
                    key={item}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => handleDomainChange(item)}
                    className={`min-h-[36px] cursor-pointer border px-3 py-1.5 font-[family-name:var(--font-mono)] text-xs whitespace-nowrap uppercase transition-colors duration-150 ${
                      active
                        ? 'border-white bg-white text-[var(--core-color-blue)]'
                        : 'border-white/25 bg-white/5 text-[var(--hw-fg)] hover:bg-white/15'
                    }`}
                  >
                    {item}
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* 2-Column Split: Polar Radar Visualization + Interactive Depth Bars */}
        <div className="grid grid-cols-1 items-stretch gap-8 lg:grid-cols-[minmax(0,0.95fr)_minmax(0,1.15fr)]">
          {/* Left: Interactive Capability Radar */}
          <div className="flex flex-col justify-between border border-white/15 bg-black/20 p-6">
            <div className="flex items-center justify-between gap-3">
              <span className="font-[family-name:var(--hpv2-font-meta)] text-[11px] uppercase opacity-75">
                6-Axis Capability Radar
              </span>
              <span className="font-[family-name:var(--hpv2-font-meta)] text-[11px] tabular-nums uppercase opacity-75">
                {domain === 'All' ? 'Composite Profile' : `${domain} Focus`}
              </span>
            </div>

            <div className="my-4 flex items-center justify-center">
              <svg
                viewBox="0 0 360 360"
                className="h-auto w-full max-w-[340px]"
                role="img"
                aria-label="Engineering capability radar visualization across six domains"
              >
                {/* Concentric hexagonal grid rings */}
                {RINGS.map((pct) => {
                  const pts = RADAR_AXES.map((_, idx) => {
                    const angle = (Math.PI * 2 * idx) / RADAR_AXES.length - Math.PI / 2;
                    const p = polarPoint(angle, (pct / 100) * RADIUS);
                    return `${p.x.toFixed(1)},${p.y.toFixed(1)}`;
                  }).join(' ');
                  return (
                    <polygon
                      key={pct}
                      points={pts}
                      fill="none"
                      stroke="rgba(255,255,255,0.14)"
                      strokeWidth="1"
                    />
                  );
                })}

                {/* Radial axis spokes */}
                {vertexCoords.map(({ axis, angle }) => {
                  const outer = polarPoint(angle, RADIUS);
                  const isActive = activeAxisId === axis.id;
                  return (
                    <line
                      key={axis.id}
                      x1={CX}
                      y1={CY}
                      x2={outer.x}
                      y2={outer.y}
                      stroke={isActive ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.16)'}
                      strokeWidth={isActive ? '1.5' : '1'}
                    />
                  );
                })}

                {/* Composite dashed silhouette when filtered */}
                {domain !== 'All' && (
                  <polygon
                    points={baselinePoints}
                    fill="none"
                    stroke="rgba(255,255,255,0.3)"
                    strokeDasharray="4 4"
                    strokeWidth="1.25"
                  />
                )}

                {/* Active capability polygon */}
                <polygon
                  points={focusPoints}
                  fill="rgba(242, 242, 242, 0.22)"
                  stroke="#ffffff"
                  strokeWidth="2"
                  className="transition-all duration-200 ease-out"
                />

                {/* Interactive vertex nodes & clickable labels */}
                {vertexCoords.map(({ axis, focusPt, labelPt, inDomain }) => {
                  const isActive = activeAxisId === axis.id;
                  return (
                    <g
                      key={axis.id}
                      role="button"
                      tabIndex={0}
                      aria-label={`${axis.label}: ${axis.level}% proficiency, ${axis.years}`}
                      onClick={() => setActiveAxisId(axis.id)}
                      onMouseEnter={() => setActiveAxisId(axis.id)}
                      onFocus={() => setActiveAxisId(axis.id)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          setActiveAxisId(axis.id);
                        }
                      }}
                      className="cursor-pointer outline-none"
                    >
                      <circle
                        cx={focusPt.x}
                        cy={focusPt.y}
                        r={isActive ? 6 : 4}
                        fill={isActive ? '#f2f200' : '#ffffff'}
                        stroke="#030324"
                        strokeWidth="1.5"
                      />
                      <text
                        x={labelPt.x}
                        y={labelPt.y}
                        textAnchor="middle"
                        dominantBaseline="middle"
                        fill={isActive ? '#f2f200' : inDomain ? '#f2f2f2' : 'rgba(242,242,242,0.45)'}
                        fontSize="10"
                        fontFamily="var(--hpv2-font-meta)"
                        style={{ textTransform: 'uppercase' }}
                      >
                        {axis.shortLabel}
                      </text>
                    </g>
                  );
                })}
              </svg>
            </div>

            {/* Active Axis Detail Readout */}
            <div className="border-t border-dotted border-white/20 pt-4">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <h3
                  style={{
                    fontFamily: 'var(--font-display)',
                    fontSize: '26px',
                    fontWeight: 500,
                    lineHeight: 1.05,
                  }}
                >
                  {activeAxis.label}
                </h3>
                <span className="font-[family-name:var(--hpv2-font-meta)] text-xs tabular-nums uppercase text-[#f2f200]">
                  {activeAxis.level}% · {activeAxis.years}
                </span>
              </div>
              <p className="mt-2 text-sm leading-relaxed opacity-85">{activeAxis.summary}</p>
            </div>
          </div>

          {/* Right: Structured Skill Depth Bars */}
          <div className="flex flex-col justify-between border border-white/15 bg-black/20 p-6">
            <div className="mb-4 flex items-center justify-between border-b border-dotted border-white/20 pb-3">
              <span className="font-[family-name:var(--hpv2-font-meta)] text-[11px] uppercase opacity-75">
                Core Stack &amp; Years in Production
              </span>
              <span className="font-[family-name:var(--hpv2-font-meta)] text-[11px] tabular-nums uppercase opacity-75">
                {String(filteredSkills.length).padStart(2, '0')} Skills
              </span>
            </div>

            <div className="flex flex-1 flex-col divide-y divide-dotted divide-white/15">
              {filteredSkills.map((skill) => {
                const axisLinked = activeAxisId === skill.axisId;
                return (
                  <div
                    key={skill.id}
                    onMouseEnter={() => setActiveAxisId(skill.axisId)}
                    className={`py-3.5 transition-colors ${
                      axisLinked ? 'bg-white/[0.04] px-2 -mx-2' : ''
                    }`}
                  >
                    <button
                      type="button"
                      onClick={() => setActiveAxisId(skill.axisId)}
                      aria-pressed={axisLinked}
                      className="w-full cursor-pointer text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-white"
                    >
                      <div className="flex flex-wrap items-baseline justify-between gap-2">
                        <span className="font-[family-name:var(--font-mono)] text-sm font-medium tracking-wide uppercase">
                          {skill.name}
                        </span>
                        <div className="flex items-center gap-3 font-[family-name:var(--hpv2-font-meta)] text-[11px] tabular-nums uppercase opacity-80">
                          <span>{skill.years}</span>
                          <span aria-hidden="true">·</span>
                          <span>{skill.proficiency}%</span>
                        </div>
                      </div>

                      {/* Crisp Architectural Meter Bar */}
                      <div
                        aria-hidden="true"
                        className="mt-2 h-1.5 w-full overflow-hidden bg-white/10"
                      >
                        <div
                          className={`h-full transition-all duration-300 ${
                            axisLinked ? 'bg-[#f2f200]' : 'bg-white/85'
                          }`}
                          style={{ width: `${skill.proficiency}%` }}
                        />
                      </div>
                    </button>

                    <div className="mt-2 flex flex-wrap items-center justify-between gap-2 text-xs opacity-75">
                      <span>{skill.focus}</span>
                      <a
                        href={`#project-${skill.projectId}`}
                        onClick={() => onSelectProject?.(skill.projectId)}
                        className="font-[family-name:var(--hpv2-font-meta)] text-[10px] whitespace-nowrap uppercase underline decoration-current/50 underline-offset-4 hover:opacity-100"
                      >
                        Used in {skill.projectName}
                      </a>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

