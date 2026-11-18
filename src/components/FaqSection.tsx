import { useState } from 'react';
import { FAQS, PORTFOLIO_PROFILE } from '@/src/data/siteData';
import { MinusPixelIcon, PlusPixelIcon } from './Icons';

export function FaqSection() {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({ who: true });

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="bg-core-paper py-[60px]" id="faqs">
      <div className="mx-auto flex w-full max-w-[calc(var(--hw-teams-col)+2*var(--hw-teams-pad-x))] flex-col gap-10 px-[var(--hw-teams-pad-x)]">
        <div className="flex flex-wrap items-center justify-between gap-4">
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
            About &amp; FAQs
          </h2>
          <a
            href={PORTFOLIO_PROFILE.githubUrl}
            target="_blank"
            rel="noopener noreferrer"
            data-slot="button"
            data-variant="underline"
            className="core-button group relative inline-flex h-[var(--hw-teams-btn-h)] cursor-pointer items-center justify-center rounded-none border-0 bg-transparent px-3 py-2.5 font-[family-name:var(--font-mono)] text-[length:var(--hw-teams-label)] tracking-[0.1em] text-[var(--core-primary)] uppercase underline decoration-current/70 underline-offset-[0.2em] hover:decoration-current"
          >
            <span className="leading-none whitespace-nowrap">View GitHub</span>
            <span aria-hidden="true" className="core-button-hover-border" />
          </a>
        </div>

        <div className="flex flex-col border-b border-dotted border-[var(--core-primary)]">
          {FAQS.map((item) => {
            const isOpen = !!openIds[item.id];
            return (
              <div
                key={item.id}
                data-state={isOpen ? 'open' : 'closed'}
                className="relative border-t border-dotted border-[var(--core-primary)] px-0 py-5 transition-colors duration-150"
              >
                <h3 className="flex">
                  <button
                    type="button"
                    aria-expanded={isOpen}
                    aria-controls={`faq-panel-${item.id}`}
                    id={`faq-trigger-${item.id}`}
                    onClick={() => toggleItem(item.id)}
                    className="group flex min-h-[38px] flex-1 cursor-pointer items-center gap-2 text-left text-[var(--core-primary)] focus-visible:outline-1 focus-visible:outline-offset-2 focus-visible:outline-current"
                  >
                    <span className="min-w-0 flex-1 font-[family-name:var(--font-display)] text-[length:var(--hw-teams-faq-q)] leading-[1.4] font-normal normal-case underline decoration-from-font underline-offset-[var(--hw-underline-offset)]">
                      {item.question}
                    </span>
                    {isOpen ? (
                      <MinusPixelIcon className="size-3.5 shrink-0" />
                    ) : (
                      <PlusPixelIcon className="size-3.5 shrink-0" />
                    )}
                  </button>
                </h3>
                {isOpen && (
                  <div
                    id={`faq-panel-${item.id}`}
                    role="region"
                    aria-labelledby={`faq-trigger-${item.id}`}
                    className="pt-[var(--space-m)]"
                  >
                    <div className="max-w-[880px] text-[length:var(--hw-teams-body)] leading-[1.5] normal-case text-[var(--hw-teams-ink)]">
                      {item.answer}
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

