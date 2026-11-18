interface ChatMessageProps {
  role: 'user' | 'assistant';
  content: string;
  cached?: boolean;
}

export function ChatMessage({ role, content, cached }: ChatMessageProps) {
  const isUser = role === 'user';

  return (
    <div
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-3`}
    >
      <div
        className={`max-w-[85%] px-4 py-3 rounded-2xl text-sm leading-relaxed ${
          isUser
            ? 'bg-[var(--core-color-blue)] text-white rounded-tr-none'
            : 'bg-[var(--core-secondary)] text-[var(--core-white)] rounded-tl-none'
        }`}
      >
        {content}
        {cached && !isUser && (
          <span className="block mt-1 text-[10px] opacity-60 uppercase tracking-wider">
            (cached)
          </span>
        )}
      </div>
    </div>
  );
}
