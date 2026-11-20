import { useCallback, useEffect, useRef, useState } from 'react';
import { SendIcon, Trash2Icon } from 'lucide-react';
import { chatWithApi, clearChatCache } from '@/src/lib/groq';
import { ChatMessage } from './ChatMessage';

interface ChatWidgetProps {
  openByDefault?: boolean;
}

const QUICK_REPLIES = [
  "What are Dhrumil's main projects?",
  'What is his tech stack?',
  'How can I contact Dhrumil?',
  "What's his experience?",
];

export function ChatWidget({ openByDefault = false }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(openByDefault);
  const [inputValue, setInputValue] = useState('');
  const [messages, setMessages] = useState<{ role: 'user' | 'assistant'; content: string; cached?: boolean }[]>([
    {
      role: 'assistant',
      content:
        "Hi! I'm Dhrumil's portfolio assistant. Ask me about his skills, projects, experience, or how to get in touch.",
    },
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);

  const scrollToBottom = useCallback(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, []);

  useEffect(() => {
    scrollToBottom();
  }, [messages, scrollToBottom]);

  // Session-only: clear cache on unmount
  useEffect(() => {
    return () => clearChatCache();
  }, []);

  // Global keyboard shortcut: Press 'C' to toggle, 'Escape' to close
  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.metaKey || e.ctrlKey || e.altKey || e.repeat) return;
      const target = e.target as HTMLElement | null;
      if (target?.isContentEditable || target?.closest('input, textarea, select, [contenteditable="true"]')) {
        return;
      }
      if (e.key === 'c' || e.key === 'C') {
        e.preventDefault();
        setIsOpen((prev) => !prev);
        return;
      }
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen]);

  const isInitialState = messages.length === 1 && messages[0].role === 'assistant';

  const resetTextareaHeight = () => {
    if (inputRef.current) {
      inputRef.current.style.height = 'auto';
    }
  };

  const handleTextareaChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setInputValue(e.target.value);
    const el = e.target;
    el.style.height = 'auto';
    el.style.height = `${Math.min(el.scrollHeight, 130)}px`;
  };

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();
    const text = inputValue.trim();
    if (!text || isLoading) return;

    setInputValue('');
    resetTextareaHeight();
    setError(null);

    const userMessage = { role: 'user' as const, content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    const history = messages.map((m) => ({ role: m.role, content: m.content }));

    try {
      const response = await chatWithApi(text, history);
      setMessages((prev) => [
        ...prev,
        { role: 'assistant', content: response.content, cached: response.cached },
      ]);
    } catch {
      setMessages((prev) => [
        ...prev,
        {
          role: 'assistant',
          content: 'I am trained to answer limited questions about Dhrumil, and nothing else. Email me at dhrumilasodiya@gmail.com',
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickReply = (text: string) => {
    setInputValue(text);
    resetTextareaHeight();
    handleSend(new Event('submit') as unknown as React.FormEvent);
  };

  const handleClearChat = () => {
    setMessages([
      {
        role: 'assistant',
        content:
          "Hi! I'm Dhrumil's portfolio assistant. Ask me about his skills, projects, experience, or how to get in touch.",
      },
    ]);
    setError(null);
    setInputValue('');
    resetTextareaHeight();
    clearChatCache();
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend(e as unknown as React.FormEvent);
    }
  };

  if (!isOpen) {
    return (
      <button
        type="button"
        onClick={() => setIsOpen(true)}
        aria-label="Open portfolio AI assistant (Press C)"
        title="Chat with Dhrumil's AI Assistant (Press C)"
        className="fixed bottom-4 right-12 sm:right-14 z-[90] flex items-center gap-2 rounded-md border border-[color-mix(in_srgb,var(--core-white)_22%,transparent)] bg-[var(--core-primary)] px-3 py-1.5 text-xs font-mono font-medium tracking-wider text-[var(--core-white)] shadow-lg hover:border-[var(--core-color-blue)] hover:bg-[var(--core-color-blue)] hover:shadow-xl transition-all duration-150 active:scale-95 group select-none cursor-pointer"
      >
        <span className="relative flex h-2 w-2 shrink-0">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-400"></span>
        </span>
        <span className="opacity-50 group-hover:opacity-100 transition-opacity">:</span>
        <span className="tracking-widest uppercase text-[11px]">ask ai</span>
        <span className="opacity-50 group-hover:opacity-100 transition-opacity">:</span>
        <kbd className="hidden sm:inline-flex items-center justify-center ml-1 rounded bg-[color-mix(in_srgb,var(--core-white)_16%,transparent)] px-1.5 py-0.5 text-[10px] font-mono leading-none opacity-70 group-hover:opacity-100">
          C
        </kbd>
      </button>
    );
  }

  return (
    <>
      {/* Backdrop */}
      <button
        type="button"
        onClick={() => setIsOpen(false)}
        className="fixed inset-0 z-[99] bg-black/40 backdrop-blur-sm"
        aria-hidden="true"
      />

      {/* Chat Panel with Lenis prevention and bounded height */}
      <div
        role="dialog"
        aria-label="Portfolio Assistant Chat"
        aria-modal="true"
        data-lenis-prevent
        onWheel={(e) => e.stopPropagation()}
        className="fixed bottom-6 right-6 z-[100] flex flex-col w-[400px] h-[560px] max-w-[calc(100vw-3rem)] max-h-[80vh] md:w-[440px] md:h-[640px]"
      >
        <div
          data-lenis-prevent
          className="flex-1 min-h-0 flex flex-col bg-[var(--core-primary)] text-[var(--core-white)] border border-[color-mix(in_srgb,var(--core-white)_25%,transparent)] rounded-2xl shadow-2xl overflow-hidden"
        >
          {/* Header */}
          <div className="px-4 py-3 border-b border-[color-mix(in_srgb,var(--core-white)_20%,transparent)] flex items-center justify-between bg-[color-mix(in_srgb,var(--core-white)_5%,transparent)] shrink-0">
            <div className="flex items-center gap-2">
              <div className="h-6 w-6 rounded-full bg-[var(--core-color-blue)] flex items-center justify-center text-[10px] font-mono font-bold">
                D
              </div>
              <div>
                <p className="text-sm font-semibold leading-tight">Dhrumil's Assistant</p>
                <p className="text-xs opacity-70 leading-tight">Portfolio chatbot</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={handleClearChat}
                aria-label="Clear chat"
                className="w-7 h-7 rounded flex items-center justify-center hover:bg-[color-mix(in_srgb,var(--core-white)_10%,transparent)] transition-colors text-[var(--core-white)]"
              >
                <Trash2Icon className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={() => setIsOpen(false)}
                aria-label="Close chat"
                className="w-7 h-7 rounded flex items-center justify-center hover:bg-[color-mix(in_srgb,var(--core-white)_10%,transparent)] transition-colors text-[var(--core-white)]"
              >
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          {/* Messages Container: Lenis prevented and overscroll contained */}
          <div
            data-lenis-prevent
            onWheel={(e) => e.stopPropagation()}
            className="flex-1 min-h-0 overflow-y-auto overscroll-contain p-4 space-y-2 scroll-smooth"
          >
            {messages.map((msg, idx) => (
              <ChatMessage
                key={idx}
                role={msg.role}
                content={msg.content}
                cached={msg.cached}
              />
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="bg-[var(--core-secondary)] text-[var(--core-white)] px-4 py-3 rounded-2xl rounded-tl-none text-sm animate-pulse">
                  Typing…
                </div>
              </div>
            )}
            {error && (
              <div className="flex justify-start">
                <div className="bg-[#ff8442]/20 text-[#ff8442] px-4 py-3 rounded-2xl text-sm">
                  {error}
                </div>
              </div>
            )}
            <div ref={messagesEndRef} />
          </div>

          {/* Quick-reply chips (initial state only) */}
          {isInitialState && !isLoading && (
            <div className="px-4 pb-2 flex flex-wrap gap-2 shrink-0">
              {QUICK_REPLIES.map((chip, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => handleQuickReply(chip)}
                  className="px-3 py-1.5 rounded-full border border-[color-mix(in_srgb,var(--core-white)_20%,transparent)] bg-[color-mix(in_srgb,var(--core-white)_5%,transparent)] text-[var(--core-white)] text-[11px] uppercase tracking-wider hover:bg-[color-mix(in_srgb,var(--core-white)_10%,transparent)] transition-colors"
                >
                  {chip}
                </button>
              ))}
            </div>
          )}

          {/* Input Box: Expands vertically to fit complete text */}
          <div className="p-3 border-t border-[color-mix(in_srgb,var(--core-white)_20%,transparent)] bg-[var(--core-primary)] shrink-0">
            <form onSubmit={handleSend} className="flex items-end gap-2">
              <textarea
                ref={inputRef}
                value={inputValue}
                onChange={handleTextareaChange}
                onKeyDown={handleKeyDown}
                placeholder="Ask about Dhrumil..."
                rows={1}
                className="flex-1 min-h-[40px] max-h-[130px] px-3 py-2 rounded-xl bg-[color-mix(in_srgb,var(--core-white)_10%,transparent)] border border-[color-mix(in_srgb,var(--core-white)_20%,transparent)] text-[var(--core-white)] placeholder-[color-mix(in_srgb,var(--core-white)_40%,transparent)] outline-none focus:border-[var(--core-color-blue)] resize-none leading-normal transition-all"
              />
              <button
                type="submit"
                disabled={!inputValue.trim() || isLoading}
                className="w-10 h-10 rounded-full bg-[var(--core-color-blue)] text-white flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed transition-all shrink-0 mb-0.5"
                aria-label="Send message"
              >
                <SendIcon className="w-4 h-4" />
              </button>
            </form>
          </div>
        </div>
      </div>
    </>
  );
}
