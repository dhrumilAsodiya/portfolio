interface ThemeFoldProps {
  theme: 'light' | 'dark';
  onToggle: () => void;
}

export function ThemeFold({ theme, onToggle }: ThemeFoldProps) {
  return (
    <button
      type="button"
      onClick={onToggle}
      aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme (shortcut: X)`}
      title={`Switch to ${theme === 'light' ? 'dark' : 'light'} theme (Press X)`}
      className="marketing-theme-fold core-button"
    >
      <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className="marketing-theme-fold-back">
        <path d="M0 0h12v12L0 0z" />
      </svg>
      <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className="marketing-theme-fold-front">
        <path d="M0 0h12v12L0 0z" />
      </svg>
    </button>
  );
}

