import { useEffect, useRef, useState } from 'react';
import { ShieldCheck } from 'lucide-react';

const SEEN_KEY = 'mastplayer-devtools-notice-seen';
const INSPECT_KEYS = new Set(['KeyI', 'KeyJ', 'KeyC']);

const isInspectShortcut = (e) => {
  if (e.key === 'F12') return true;
  if ((e.ctrlKey || e.metaKey) && e.shiftKey && INSPECT_KEYS.has(e.code)) return true;
  if (e.metaKey && e.altKey && (INSPECT_KEYS.has(e.code) || e.code === 'KeyU')) return true;
  return e.ctrlKey && !e.shiftKey && !e.altKey && e.code === 'KeyU';
};

/**
 * UX-only notice for obvious inspect shortcuts. It never blocks the shortcut and is not a
 * security control — authorization is enforced by the API.
 */
export default function DevToolsNotice() {
  const [open, setOpen] = useState(false);
  const buttonRef = useRef(null);

  useEffect(() => {
    const onKeyDown = (e) => {
      if (!isInspectShortcut(e)) return;
      try {
        if (sessionStorage.getItem(SEEN_KEY)) return;
        sessionStorage.setItem(SEEN_KEY, '1');
      } catch {
        // storage unavailable — still show once for this mount
      }
      setOpen(true);
    };
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, []);

  useEffect(() => {
    if (!open) return undefined;
    buttonRef.current?.focus();
    const onEsc = (e) => e.key === 'Escape' && setOpen(false);
    window.addEventListener('keydown', onEsc);
    return () => window.removeEventListener('keydown', onEsc);
  }, [open]);

  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-[80] flex items-center justify-center bg-black/60 p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="devtools-notice-title"
    >
      <div className="w-full max-w-md rounded-2xl border border-[var(--border-accent)] bg-[var(--surface-elevated)] p-5 sm:p-6 shadow-xl">
        <div className="flex items-center gap-3">
          <img src="/pwa-192x192.png" alt="" width="40" height="40" className="w-10 h-10 rounded-xl" />
          <p className="font-[family-name:var(--font-display)] text-lg font-bold">MastPlayer</p>
        </div>
        <h2 id="devtools-notice-title" className="mt-4 flex items-center gap-2 text-base font-semibold">
          <ShieldCheck className="w-4 h-4 text-[var(--primary)]" aria-hidden />
          Developer access notice
        </h2>
        <div className="mt-2 space-y-2 text-sm app-muted leading-relaxed">
          <p>You&apos;re viewing MastPlayer&apos;s client application.</p>
          <p>
            For security research, API integration, or developer access, please use our official
            channels on the Contact page.
          </p>
          <p>
            Client-side code does not contain authorization secrets. Unauthorized attempts to access
            accounts, private content, or protected systems are prohibited.
          </p>
        </div>
        <button
          ref={buttonRef}
          type="button"
          onClick={() => setOpen(false)}
          className="app-btn-primary mt-5 w-full"
        >
          Return to MastPlayer
        </button>
      </div>
    </div>
  );
}
