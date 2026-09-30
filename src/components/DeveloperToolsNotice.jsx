import { useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { Link } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';

export default function DeveloperToolsNotice({ open, onReturn }) {
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!open) return undefined;
    const root = document.getElementById('root');
    const html = document.documentElement;
    const previousFocus = document.activeElement;
    const previousOverflow = html.style.overflow;

    root?.setAttribute('inert', '');
    root?.setAttribute('aria-hidden', 'true');
    html.style.overflow = 'hidden';
    buttonRef.current?.focus();

    const onKeyDown = (e) => {
      if (e.key === 'Escape') onReturn();
    };
    window.addEventListener('keydown', onKeyDown);

    return () => {
      window.removeEventListener('keydown', onKeyDown);
      root?.removeAttribute('inert');
      root?.removeAttribute('aria-hidden');
      html.style.overflow = previousOverflow;
      if (previousFocus instanceof HTMLElement) previousFocus.focus({ preventScroll: true });
    };
  }, [open, onReturn]);

  if (!open) return null;

  return createPortal(
    <div
      className="devtools-notice fixed inset-0 z-[100] min-h-dvh overflow-y-auto"
      role="dialog"
      aria-modal="true"
      aria-labelledby="devtools-notice-title"
      aria-describedby="devtools-notice-body"
    >
      <div className="devtools-notice-glow pointer-events-none absolute inset-0" aria-hidden />
      <div className="relative flex min-h-dvh items-center justify-center px-5 py-10">
        <div className="devtools-notice-card w-full max-w-lg rounded-3xl px-6 py-8 sm:px-10 sm:py-10 text-center">
          <img
            src="/pwa-192x192.png"
            alt="MastPlayer"
            width="72"
            height="72"
            className="mx-auto h-18 w-18 rounded-2xl"
          />

          <p className="devtools-notice-badge mx-auto mt-6 inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em]">
            <ShieldCheck className="h-3.5 w-3.5" aria-hidden />
            MastPlayer Security
          </p>

          <h1
            id="devtools-notice-title"
            className="mt-4 font-[family-name:var(--font-display)] text-2xl sm:text-3xl font-bold tracking-tight text-white"
          >
            Developer Tools Detected
          </h1>
          <p className="mt-2 text-base font-medium text-[#00F57A]">
            Looking under the hood? <span aria-hidden>👀</span>
          </p>

          <div id="devtools-notice-body" className="mt-5 space-y-3 text-sm leading-relaxed text-[#9CA3AF]">
            <p>MastPlayer protects user accounts, videos, and platform services.</p>
            <p>
              Client-side resources may be visible through browser developer tools, but access to
              protected data and actions is securely controlled by MastPlayer&apos;s servers.
            </p>
            <p>
              If you&apos;re debugging, integrating, or conducting security research, please use
              authorized methods and respect our{' '}
              <Link
                to="/terms"
                onClick={onReturn}
                className="font-medium text-white underline underline-offset-2 hover:text-[#00F57A]"
              >
                Terms of Service
              </Link>
              .
            </p>
          </div>

          <button
            ref={buttonRef}
            type="button"
            onClick={onReturn}
            className="devtools-notice-cta mt-7 inline-flex w-full items-center justify-center rounded-xl px-5 py-3 text-sm font-bold"
          >
            Return to MastPlayer
          </button>

          <div className="devtools-notice-footer mt-8 pt-5 text-xs text-[#9CA3AF]">
            <p className="font-semibold text-white/80">MastPlayer Security</p>
            <p className="mt-0.5">mastplayer.com</p>
          </div>
        </div>
      </div>
    </div>,
    document.body
  );
}
