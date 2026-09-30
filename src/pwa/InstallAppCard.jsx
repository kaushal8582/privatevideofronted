import { useState } from 'react';
import { Download, Share, SquarePlus, X } from 'lucide-react';
import toast from 'react-hot-toast';
import usePwaInstall from './usePwaInstall.js';

/**
 * `dismissible` cards respect the 30-day dismissal; the Me/Profile variant always
 * shows while installation is possible.
 */
export default function InstallAppCard({ dismissible = false, className = '' }) {
  const { canPrompt, showIosHint, isStandalone, dismissed, promptInstall, dismissInstall } =
    usePwaInstall();
  const [busy, setBusy] = useState(false);

  if (isStandalone || (!canPrompt && !showIosHint)) return null;
  if (dismissible && dismissed) return null;

  const handleInstall = async () => {
    setBusy(true);
    try {
      const outcome = await promptInstall();
      if (outcome === 'accepted') toast.success('MastPlayer installed');
    } finally {
      setBusy(false);
    }
  };

  return (
    <section className={`app-card p-3 sm:p-4 ${className}`} aria-labelledby="install-app-title">
      <div className="flex items-start gap-3">
        <img
          src="/pwa-192x192.png"
          alt=""
          width="40"
          height="40"
          className="w-10 h-10 rounded-xl shrink-0"
        />
        <div className="min-w-0 flex-1">
          <h2 id="install-app-title" className="text-sm font-semibold">
            Install MastPlayer
          </h2>
          <p className="text-[11px] app-muted leading-snug mt-0.5">
            Get a faster, app-like MastPlayer experience.
          </p>
          {canPrompt ? (
            <button
              type="button"
              onClick={handleInstall}
              disabled={busy}
              className="app-btn-primary !py-1.5 !px-3 !text-xs mt-2.5"
            >
              <Download className="w-3.5 h-3.5" aria-hidden />
              Install
            </button>
          ) : (
            <p className="text-[11px] app-muted mt-2 flex flex-wrap items-center gap-1">
              Tap <Share className="w-3.5 h-3.5 text-[var(--primary)]" aria-label="Share" /> then
              <span className="inline-flex items-center gap-1 font-medium text-[var(--foreground)]">
                <SquarePlus className="w-3.5 h-3.5" aria-hidden /> Add to Home Screen
              </span>
            </p>
          )}
        </div>
        {dismissible && (
          <button
            type="button"
            onClick={dismissInstall}
            className="shrink-0 p-1.5 rounded-lg app-muted hover:text-[var(--foreground)]"
            aria-label="Dismiss install suggestion"
          >
            <X className="w-4 h-4" />
          </button>
        )}
      </div>
    </section>
  );
}
