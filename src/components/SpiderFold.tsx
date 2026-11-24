interface SpiderFoldProps {
  onToggle: () => void;
  isActive: boolean;
}

export function SpiderFold({ onToggle, isActive }: SpiderFoldProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={isActive ? 'Dismiss spider (shortcut: S)' : 'Summon spider (shortcut: S)'}
      title={isActive ? 'Dismiss spider (Press S)' : 'Summon spider (Press S)'}
      className="marketing-spider-fold core-button"
    >
      <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className="marketing-spider-fold-back">
        <path d="M12 0H0v12L12 0z" />
      </svg>
      <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className="marketing-spider-fold-front">
        <path d="M12 0H0v12L12 0z" />
      </svg>
    </button>
  );
}
