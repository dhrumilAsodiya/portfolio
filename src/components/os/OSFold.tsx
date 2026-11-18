interface OSFoldProps {
  onBootOS: () => void;
}

export function OSFold({ onBootOS }: OSFoldProps) {
  return (
    <button
      type="button"
      onClick={onBootOS}
      aria-label="Boot Trinity OS (shortcut: O)"
      title="Boot Trinity OS (Press O)"
      className="marketing-os-fold core-button"
    >
      <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className="marketing-os-fold-back">
        <path d="M0 12h12V0L0 12z" />
      </svg>
      <svg viewBox="0 0 12 12" fill="currentColor" aria-hidden="true" className="marketing-os-fold-front">
        <path d="M0 12h12V0L0 12z" />
      </svg>
    </button>
  );
}

