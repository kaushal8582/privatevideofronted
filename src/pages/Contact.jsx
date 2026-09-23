import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle2, Mail, MessageSquare, Send } from 'lucide-react';
import toast from 'react-hot-toast';
import { getFriendlyError, submitContact } from '../services/api.js';
import {
  validateEmail,
  validateMessage,
  validateName,
} from '../utils/validation.js';

const SUBJECTS = [
  { value: 'general', label: 'General question' },
  { value: 'support', label: 'Technical support' },
  { value: 'billing', label: 'Billing & payouts' },
  { value: 'copyright', label: 'Copyright / DMCA' },
  { value: 'partnership', label: 'Partnership' },
  { value: 'other', label: 'Other' },
];

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-[var(--danger)]">{message}</p>;
}

export default function Contact() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [subject, setSubject] = useState('general');
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [sent, setSent] = useState(false);

  const clearError = (key) => {
    setErrors((prev) => {
      if (!prev[key]) return prev;
      const next = { ...prev };
      delete next[key];
      return next;
    });
  };

  const validate = () => {
    const next = {
      name: validateName(name),
      email: validateEmail(email),
      message: validateMessage(message),
    };
    setErrors(next);
    return !next.name && !next.email && !next.message;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (submitting) return;
    if (!validate()) {
      toast.error('Please fix the highlighted fields.');
      return;
    }

    setSubmitting(true);
    try {
      await submitContact({
        name: name.trim(),
        email: email.trim(),
        subject,
        message: message.trim(),
      });
      setSent(true);
      setName('');
      setEmail('');
      setSubject('general');
      setMessage('');
      setErrors({});
      toast.success('Message sent');
    } catch (err) {
      toast.error(getFriendlyError(err, 'Could not send your message.'));
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="w-full min-h-[calc(100dvh-8rem)] px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="mx-auto max-w-5xl grid lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] gap-8 lg:gap-12 items-start">
        <aside className="space-y-6">
          <div>
            <p className="app-kicker uppercase tracking-widest mb-3">Support</p>
            <h1 className="app-title mb-3 leading-tight">Contact us</h1>
            <p className="app-muted text-sm sm:text-base leading-relaxed">
              Questions about uploads, payouts, Creator Studio, or copyright? Send a
              message and we&apos;ll get back to you.
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-5 space-y-4">
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--primary)]">
                <Mail className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)]">Email</p>
                <a
                  href="mailto:support@mastplayer.in"
                  className="app-link text-sm break-all"
                >
                  support@mastplayer.in
                </a>
              </div>
            </div>
            <div className="flex items-start gap-3">
              <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-[var(--accent-soft)] text-[var(--primary)]">
                <MessageSquare className="w-5 h-5" />
              </span>
              <div className="min-w-0">
                <p className="text-sm font-semibold text-[var(--foreground)]">Copyright</p>
                <p className="text-sm app-muted leading-relaxed">
                  For takedown requests, see our{' '}
                  <Link to="/dmca" className="app-link">
                    DMCA policy
                  </Link>
                  .
                </p>
              </div>
            </div>
          </div>
        </aside>

        <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:p-6 lg:p-8 shadow-[0_24px_60px_-40px_var(--glow-cyan)]">
          {sent ? (
            <div className="text-center py-8 sm:py-12 space-y-4">
              <span className="inline-flex h-14 w-14 items-center justify-center rounded-2xl bg-[var(--accent-soft)] text-[var(--primary)]">
                <CheckCircle2 className="w-7 h-7" />
              </span>
              <div>
                <h2 className="text-xl font-semibold text-[var(--foreground)]">Message received</h2>
                <p className="mt-2 text-sm app-muted max-w-sm mx-auto leading-relaxed">
                  Thanks for reaching out. We&apos;ll review your note and reply to the
                  email you provided.
                </p>
              </div>
              <button
                type="button"
                className="app-btn-secondary"
                onClick={() => setSent(false)}
              >
                Send another message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4" noValidate>
              <label className="app-label">
                Name
                <input
                  type="text"
                  autoComplete="name"
                  value={name}
                  onChange={(e) => {
                    setName(e.target.value);
                    clearError('name');
                  }}
                  className={`app-input ${errors.name ? '!border-[var(--danger)]' : ''}`}
                  aria-invalid={Boolean(errors.name)}
                />
                <FieldError message={errors.name} />
              </label>

              <label className="app-label">
                Email
                <input
                  type="email"
                  autoComplete="email"
                  inputMode="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    clearError('email');
                  }}
                  className={`app-input ${errors.email ? '!border-[var(--danger)]' : ''}`}
                  aria-invalid={Boolean(errors.email)}
                />
                <FieldError message={errors.email} />
              </label>

              <label className="app-label">
                Subject
                <select
                  value={subject}
                  onChange={(e) => setSubject(e.target.value)}
                  className="app-input"
                >
                  {SUBJECTS.map((s) => (
                    <option key={s.value} value={s.value}>
                      {s.label}
                    </option>
                  ))}
                </select>
              </label>

              <label className="app-label">
                Message
                <textarea
                  rows={6}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    clearError('message');
                  }}
                  className={`app-input resize-y min-h-[8rem] ${
                    errors.message ? '!border-[var(--danger)]' : ''
                  }`}
                  placeholder="How can we help?"
                  aria-invalid={Boolean(errors.message)}
                />
                <FieldError message={errors.message} />
              </label>

              <button
                type="submit"
                disabled={submitting}
                className="app-btn-primary app-btn-primary-lg w-full"
              >
                <Send className="w-4 h-4" />
                {submitting ? 'Sending…' : 'Send message'}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
