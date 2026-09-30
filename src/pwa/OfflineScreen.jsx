import { useState } from 'react';
import { RefreshCw, WifiOff } from 'lucide-react';
import useOnlineStatus from './useOnlineStatus.js';

const LOGO_SRC = '/pwa-192x192.png';
let logoUrl = LOGO_SRC;

if (typeof window !== 'undefined' && navigator.onLine) {
  fetch(LOGO_SRC)
    .then((res) => (res.ok ? res.blob() : null))
    .then((blob) => {
      if (blob) logoUrl = URL.createObjectURL(blob);
    })
    .catch(() => {});
}

export default function OfflineScreen() {
  const online = useOnlineStatus();
  const [checking, setChecking] = useState(false);
  const [stillOffline, setStillOffline] = useState(false);

  if (online) return null;

  const retry = () => {
    setChecking(true);
    setStillOffline(false);
    window.setTimeout(() => {
      setChecking(false);
      if (!navigator.onLine) setStillOffline(true);
    }, 700);
  };

  return (
    <div
      className="fixed inset-0 z-[70] flex items-center justify-center bg-[var(--background)] px-6"
      role="alertdialog"
      aria-modal="true"
      aria-labelledby="offline-title"
      aria-describedby="offline-desc"
    >
      <div className="w-full max-w-sm text-center">
        <img
          src={logoUrl}
          alt="MastPlayer"
          width="72"
          height="72"
          className="mx-auto w-18 h-18 rounded-2xl"
        />
        <div className="mt-6 inline-flex items-center gap-2 rounded-full border border-[var(--border)] bg-[var(--surface)] px-3 py-1 text-xs app-muted">
          <WifiOff className="w-3.5 h-3.5" aria-hidden />
          No connection
        </div>
        <h1 id="offline-title" className="mt-4 text-2xl font-bold tracking-tight">
          You&apos;re offline
        </h1>
        <p id="offline-desc" className="mt-2 text-sm app-muted">
          Connect to the internet to continue.
        </p>
        <button
          type="button"
          onClick={retry}
          disabled={checking}
          className="app-btn-primary mt-6 w-full"
        >
          <RefreshCw className={`w-4 h-4 ${checking ? 'animate-spin' : ''}`} aria-hidden />
          {checking ? 'Checking…' : 'Retry'}
        </button>
        {stillOffline && (
          <p className="mt-3 text-xs app-muted" role="status">
            Still offline. Check your Wi-Fi or mobile data.
          </p>
        )}
      </div>
    </div>
  );
}
