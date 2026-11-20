import React, { useMemo } from 'react';

/**
 * Chat message bubble with robust Markdown formatting.
 * Handles bold text, clickable external links, lists, headings, line breaks,
 * and safely intercepts stray markdown tables so they never break narrow mobile/desktop chat layouts.
 */

interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  cached?: boolean;
}

/** Render inline tokens: **bold**, [text](url), `code`, and raw https?:// URLs */
function renderInline(text: string): React.ReactNode {
  // Split on bold, markdown link, inline code, or bare URL
  const tokenRegex = /(\*\*[^*]+\*\*|\[[^\]]+\]\([^)]+\)|`[^`]+`|https?:\/\/[^\s<)]+)/g;
  const parts = text.split(tokenRegex);

  return parts.map((part, i) => {
    if (!part) return null;

    // Bold text
    const boldMatch = part.match(/^\*\*(.+)\*\*$/);
    if (boldMatch) {
      return (
        <strong key={i} className="font-semibold text-[var(--core-white)]">
          {boldMatch[1]}
        </strong>
      );
    }

    // Markdown link: [Title](url)
    const linkMatch = part.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
    if (linkMatch) {
      const rawUrl = linkMatch[2].trim();
      const href = /^https?:\/\//i.test(rawUrl) || rawUrl.startsWith('/') ? rawUrl : `https://${rawUrl}`;
      return (
        <a
          key={i}
          href={href}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--core-color-blue)] underline underline-offset-2 hover:opacity-85 font-medium transition-opacity break-all"
        >
          {linkMatch[1]}
        </a>
      );
    }

    // Bare URL: https://...
    if (/^https?:\/\/[^\s<)]+$/i.test(part)) {
      return (
        <a
          key={i}
          href={part}
          target="_blank"
          rel="noopener noreferrer"
          className="text-[var(--core-color-blue)] underline underline-offset-2 hover:opacity-85 font-medium transition-opacity break-all"
        >
          {part}
        </a>
      );
    }

    // Inline code: `code`
    const codeMatch = part.match(/^`([^`]+)`$/);
    if (codeMatch) {
      return (
        <code
          key={i}
          className="rounded bg-[color-mix(in_srgb,var(--core-white)_14%,transparent)] px-1.5 py-0.5 font-mono text-xs text-[var(--core-white)]"
        >
          {codeMatch[1]}
        </code>
      );
    }

    return <span key={i}>{part}</span>;
  });
}

type Block =
  | { type: 'heading'; level: 1 | 2 | 3; text: string }
  | { type: 'list'; items: string[] }
  | { type: 'paragraph'; text: string };

/**
 * Pre-processes text:
 * 1. Discards markdown table separator rows (|---|---|).
 * 2. Transmutes markdown table rows (| Project | Tech |) into clean scannable bullet points (- **Project** — Tech).
 */
function cleanAndNormalizeLines(raw: string): string[] {
  const rawLines = raw.split(/\r?\n/);
  const result: string[] = [];

  for (const line of rawLines) {
    const trimmed = line.trim();

    // Skip markdown table dividers like |---|---| or |:---|:---|
    if (/^\|?(\s*:?-+:?\s*\|)+\s*:?-+:?\s*\|?$/.test(trimmed)) {
      continue;
    }

    // Convert markdown table rows: | A | B |
    if (trimmed.startsWith('|') && trimmed.endsWith('|') && trimmed.includes('|')) {
      const cells = trimmed
        .split('|')
        .map((c) => c.trim())
        .filter(Boolean);

      if (cells.length > 0) {
        if (cells.length === 1) {
          result.push(`- ${cells[0]}`);
        } else {
          result.push(`- **${cells[0]}** — ${cells.slice(1).join(' · ')}`);
        }
        continue;
      }
    }

    result.push(line);
  }

  return result;
}

/** Parses pre-processed lines into structured heading, list, and paragraph blocks */
function parseBlocks(raw: string): Block[] {
  const lines = cleanAndNormalizeLines(raw);
  const blocks: Block[] = [];
  let currentList: string[] | null = null;
  let currentParagraph: string[] = [];

  const flushParagraph = () => {
    if (currentParagraph.length > 0) {
      blocks.push({
        type: 'paragraph',
        text: currentParagraph.join('\n'),
      });
      currentParagraph = [];
    }
  };

  const flushList = () => {
    if (currentList && currentList.length > 0) {
      blocks.push({
        type: 'list',
        items: currentList,
      });
      currentList = null;
    }
  };

  for (const line of lines) {
    const trimmed = line.trim();

    if (!trimmed) {
      flushParagraph();
      flushList();
      continue;
    }

    // Markdown heading: #, ##, ###
    const hMatch = trimmed.match(/^(#{1,3})\s+(.+)$/);
    if (hMatch) {
      flushParagraph();
      flushList();
      blocks.push({
        type: 'heading',
        level: hMatch[1].length as 1 | 2 | 3,
        text: hMatch[2],
      });
      continue;
    }

    // Bullet points: -, *, •
    const bulletMatch = trimmed.match(/^[-*•]\s+(.+)$/);
    if (bulletMatch) {
      flushParagraph();
      if (!currentList) currentList = [];
      currentList.push(bulletMatch[1]);
      continue;
    }

    // Numbered list: 1. ...
    const numMatch = trimmed.match(/^\d+\.\s+(.+)$/);
    if (numMatch) {
      flushParagraph();
      if (!currentList) currentList = [];
      currentList.push(numMatch[1]);
      continue;
    }

    // Normal text line
    flushList();
    currentParagraph.push(trimmed);
  }

  flushParagraph();
  flushList();

  return blocks;
}

export function ChatMessage({ role, content, cached }: ChatMessageProps) {
  const isUser = role === 'user';
  const blocks = useMemo(() => (!isUser ? parseBlocks(content) : []), [isUser, content]);

  return (
    <div className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}>
      <div
        className={`max-w-[88%] px-4 py-3 rounded-2xl text-sm leading-relaxed break-words ${
          isUser
            ? 'bg-[var(--core-color-blue)] text-white rounded-tr-none'
            : 'bg-[var(--core-secondary)] text-[var(--core-white)] rounded-tl-none border border-[color-mix(in_srgb,var(--core-white)_10%,transparent)]'
        }`}
      >
        {!isUser && (
          <div className="chat-markdown space-y-2.5">
            {blocks.map((block, i) => {
              if (block.type === 'heading') {
                const Tag = `h${block.level}` as 'h1' | 'h2' | 'h3';
                return (
                  <Tag
                    key={i}
                    className="font-semibold text-[var(--core-white)] pt-1 text-xs uppercase tracking-wider opacity-90"
                  >
                    {renderInline(block.text)}
                  </Tag>
                );
              }

              if (block.type === 'list') {
                return (
                  <ul key={i} className="list-disc pl-5 my-1.5 space-y-1.5 text-[var(--core-white)]">
                    {block.items.map((item, j) => (
                      <li key={j} className="leading-relaxed text-[var(--core-white)]">
                        {renderInline(item)}
                      </li>
                    ))}
                  </ul>
                );
              }

              return (
                <p key={i} className="text-[var(--core-white)] leading-relaxed whitespace-pre-line">
                  {renderInline(block.text)}
                </p>
              );
            })}
          </div>
        )}
        {isUser && <p className="whitespace-pre-line leading-relaxed">{content}</p>}

        {!isUser && cached && (
          <span className="block mt-1.5 text-[10px] opacity-60 uppercase tracking-wider font-mono">
            (cached)
          </span>
        )}
      </div>
    </div>
  );
}
