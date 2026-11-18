import { FormEvent, useEffect, useState } from 'react';
import { PORTFOLIO_PROFILE } from '@/src/data/siteData';

interface ContactModalProps {
  open: boolean;
  initialTopic?: string;
  onClose: () => void;
}

export function ContactModal({ open, initialTopic = 'General Inquiry', onClose }: ContactModalProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [topic, setTopic] = useState(initialTopic);
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [submitted, setSubmitted] = useState(false);

  useEffect(() => {
    setTopic(initialTopic);
  }, [initialTopic]);

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [open, onClose]);

  if (!open) return null;

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
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
    setError('');
    setSubmitted(true);
  };

  const handleResetAndClose = () => {
    setSubmitted(false);
    setName('');
    setEmail('');
    setMessage('');
    setError('');
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
        <div className="flex items-start justify-between gap-4 border-b border-dotted border-[var(--core-primary)] pb-4">
          <div>
            <p className="font-[family-name:var(--hpv2-font-meta)] text-[11px] uppercase opacity-70">
              Direct Inquiry
            </p>
            <h2
              className="mt-1 text-[var(--core-primary)]"
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
            className="grid size-9 cursor-pointer place-items-center font-[family-name:var(--font-mono)] text-sm hover:bg-[var(--hpv2-row-hover)]"
          >
            ✕
          </button>
        </div>

        {submitted ? (
          <div className="mt-5 space-y-4">
            <p className="text-[15px] leading-relaxed">
              Thanks, <strong className="font-medium">{name}</strong>. Your message regarding{' '}
              <span className="font-medium">{topic}</span> has been recorded in this portfolio demo.
            </p>
            <p className="font-[family-name:var(--hpv2-font-meta)] text-[12px] opacity-75">
              Or email directly: {PORTFOLIO_PROFILE.email}
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
            <label className="flex flex-col gap-1.5">
              <span className="font-[family-name:var(--hpv2-font-meta)] text-[10px] uppercase opacity-75">
                Your Name
              </span>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Jordan Lee"
                className="h-10 border border-[var(--hpv2-hairline)] bg-[var(--hpv2-row-well)] px-3 text-sm outline-none focus:border-[var(--hpv2-brand)]"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-[family-name:var(--hpv2-font-meta)] text-[10px] uppercase opacity-75">
                Email Address
              </span>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="jordan@company.com"
                className="h-10 border border-[var(--hpv2-hairline)] bg-[var(--hpv2-row-well)] px-3 text-sm outline-none focus:border-[var(--hpv2-brand)]"
              />
            </label>

            <label className="flex flex-col gap-1.5">
              <span className="font-[family-name:var(--hpv2-font-meta)] text-[10px] uppercase opacity-75">
                Topic
              </span>
              <select
                value={topic}
                onChange={(e) => setTopic(e.target.value)}
                className="h-10 border border-[var(--hpv2-hairline)] bg-[var(--hpv2-row-well)] px-3 text-sm outline-none focus:border-[var(--hpv2-brand)]"
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
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Share context about your team, timeline, or project..."
                className="border border-[var(--hpv2-hairline)] bg-[var(--hpv2-row-well)] p-3 text-sm outline-none focus:border-[var(--hpv2-brand)]"
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
                onClick={handleResetAndClose}
                className="cursor-pointer px-3 py-2 font-[family-name:var(--font-mono)] text-xs uppercase opacity-70 hover:opacity-100"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="core-button relative inline-flex cursor-pointer items-center justify-center bg-[var(--core-color-blue)] px-4 py-2 text-xs text-white uppercase"
              >
                <span>Send Message</span>
                <span aria-hidden="true" className="core-button-hover-border" />
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

