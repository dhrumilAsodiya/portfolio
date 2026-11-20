import { FormEvent, useEffect, useState } from 'react';
import { PORTFOLIO_PROFILE } from '@/src/data/siteData';

interface ContactModalProps {
  open: boolean;
  initialTopic?: string;
  onClose: () => void;
}

const COOLDOWN_MS = 30000; // 30-second cooldown between submissions

export function ContactModal({ open, initialTopic = 'General Inquiry', onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(initialTopic);
  const [message, setMessage] = useState('');
  const [botcheck, setBotcheck] = useState(false);
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [lastSubmittedAt, setLastSubmittedAt] = useState<number | null>(null);

  useEffect(() => {
    setTopic(initialTopic);
  }, [initialTopic]);

  useEffect(() => {
    if (!open) return;
    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener('keydown', onKeyDown);
    };
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Check 30-second cooldown
    if (lastSubmittedAt) {
      const elapsed = Date.now() - lastSubmittedAt;
      if (elapsed < COOLDOWN_MS) {
        const remaining = Math.ceil((COOLDOWN_MS - elapsed) / 1000);
        setError(`Please wait ${remaining}s before sending another message.`);
        return;
      }
    }

    if (!name.trim()) {
      setError('Please enter your name.');
      return;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) {
      setError('Please enter a valid email address.');
      return;
    }
    if (message.trim().length < 8) {
      setError('Please include a brief note (at least 8 characters).');
      return;
    }

    const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
    if (!accessKey) {
      setError(`Contact form access key is not configured. Please email ${PORTFOLIO_PROFILE.email} directly.`);
      return;
    }

    setError('');
    setIsLoading(true);

    try {
      const response = await fetch('https://api.web3forms.com/submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
        body: JSON.stringify({
          access_key: accessKey,
          name: name.trim(),
          email: email.trim(),
          subject: `[Portfolio] ${topic} from ${name.trim()}`,
          topic,
          message: message.trim(),
          botcheck,
        }),
      });

      const data = await response.json().catch(() => null);

      if (response.ok && data?.success) {
        setSubmitted(true);
        setLastSubmittedAt(Date.now());
      } else {
        setError(data?.message || 'Failed to send message. Please try again or email directly.');
      }
    } catch {
      setError('Network error. Please check your connection or email directly.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    setError('');
    setIsLoading(false);
    onClose();
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label="Contact Dhrumil Asodiya"
      className="fixed inset-0 z-[220] flex items-center justify-center bg-black/75 p-4 backdrop-blur-xs"
      onClick={handleResetAndClose}
    >
      <div
        className="w-full max-w-[480px] border border-[var(--hpv2-hairline)] bg-[var(--core-paper)] p-6 text-[var(--hw-teams-ink)] shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4 border-b border-dotted border-[var(--core-primary)] dark:border-white/20 pb-4">
          <div>
            <p className="font-[family-name:var(--hpv2-font-meta)] text-[11px] uppercase opacity-70">
              Direct Inquiry
            </p>
            <h2
              className="mt-1 text-[var(--core-primary)] dark:text-white"
              style={{
                fontFamily: 'var(--font-display)',
                fontSize: '36px',
                fontWeight: 500,
                lineHeight: 0.95,
              }}
            >
              Get In Touch
            </h2>
          </div>
          <button
            type="button"
            onClick={handleResetAndClose}
            aria-label="Close contact dialog"
            className="grid size-9 cursor-pointer place-items-center font-[family-name:var(--font-mono)] text-sm text-[var(--hw-teams-ink)] hover:bg-[var(--hpv2-row-hover)]"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="mt-5 space-y-4">
            <p className="text-[15px] leading-relaxed">
              Thanks, <strong className="font-medium">{name}</strong>. Your message regarding{' '}
              <span className="font-medium">{topic}</span> has been sent directly to Dhrumil.
            </p>
            <p className="font-[family-name:var(--hpv2-font-meta)] text-[12px] opacity-75">
              Direct contact: {PORTFOLIO_PROFILE.email}
            </p>
            <button
              type="button"
              onClick={handleResetAndClose}
              className="core-button inline-flex cursor-pointer items-center justify-center bg-[var(--core-color-blue)] px-4 py-2 text-xs text-white uppercase"
            >
              Done
            </button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="mt-5 flex flex-col gap-4">
            {/* Honeypot field for bot spam prevention */}
            <input
              type="checkbox"
              name="botcheck"
              className="hidden"
              style={{ display: 'none' }}
              checked={botcheck}
              onChange={(e) => setBotcheck(e.target.checked)}
              tabIndex={-1}
              autoComplete="off"
            />

            <label className="flex flex-col gap-1.5">
              <span className="font-[family-name:var(--hpv2-font-meta)] text-[10px] uppercase opacity-75">
                Your Name
              </span>
              <input
                type="text"
                value={name}
                disabled={isLoading}
                onChange={(e) => setName(e.target.value)}
                placeholder="Your name"
                className="h-10 border border-[var(--hpv2-hairline)] bg-[var(--hpv2-row-well)] px-3 text-sm text-[var(--hw-teams-ink)] dark:text-white outline-none focus:border-[var(--hpv2-brand)] disabled:opacity-60"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-[family-name:var(--hpv2-font-meta)] text-[10px] uppercase opacity-75">
                Email Address
              </span>
              <input
                type="email"
                value={email}
                disabled={isLoading}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="h-10 border border-[var(--hpv2-hairline)] bg-[var(--hpv2-row-well)] px-3 text-sm text-[var(--hw-teams-ink)] dark:text-white outline-none focus:border-[var(--hpv2-brand)] disabled:opacity-60"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-[family-name:var(--hpv2-font-meta)] text-[10px] uppercase opacity-75">
                Topic
              </span>
              <select
                value={topic}
                disabled={isLoading}
                onChange={(e) => setTopic(e.target.value)}
                className="h-10 border border-[var(--hpv2-hairline)] bg-[var(--hpv2-row-well)] px-3 text-sm text-[var(--hw-teams-ink)] dark:text-white outline-none focus:border-[var(--hpv2-brand)] disabled:opacity-60"
              >
                <option value="Full-Time Role">Full-Time Role</option>
                <option value="Contract Sprint">Contract Sprint</option>
                <option value="Technical Advisory">Technical Advisory</option>
                <option value="Open Source">Open Source</option>
                <option value="General Inquiry">General Inquiry</option>
              </select>
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-[family-name:var(--hpv2-font-meta)] text-[10px] uppercase opacity-75">
                Message
              </span>
              <textarea
                rows={3}
                value={message}
                disabled={isLoading}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share context about your team, timeline, or project..."
                className="border border-[var(--hpv2-hairline)] bg-[var(--hpv2-row-well)] p-3 text-sm text-[var(--hw-teams-ink)] dark:text-white outline-none focus:border-[var(--hpv2-brand)] disabled:opacity-60"
              />
            </label>

            {error && (
              <p role="alert" className="font-[family-name:var(--hpv2-font-meta)] text-[11px] text-[#ff8442] uppercase">
                {error}
              </p>
            )}

            <div className="flex items-center justify-end gap-3 pt-1">
              <button
                type="button"
                disabled={isLoading}
                onClick={handleResetAndClose}
                className="cursor-pointer px-3 py-2 font-[family-name:var(--font-mono)] text-xs uppercase opacity-70 hover:opacity-100 disabled:opacity-40"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isLoading}
                className="core-button relative inline-flex cursor-pointer items-center justify-center bg-[var(--core-color-blue)] px-4 py-2 text-xs text-white uppercase disabled:cursor-not-allowed disabled:opacity-60"
              >
                <span>{isLoading ? 'Sending...' : 'Send Message'}</span>
                <span aria-hidden="true" className="core-button-hover-border" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
