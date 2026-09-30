import { useRegisterSW } from 'virtual:pwa-register/react';
import { RefreshCw, X } from 'lucide-react';
import { useUploadQueue } from '../context/UploadQueueContext.jsx';

const UPDATE_CHECK_MS = 60 * 60 * 1000;

export default function PwaUpdatePrompt() {
  const { job } = useUploadQueue();
  const {
    needRefresh: [needRefresh, setNeedRefresh],
    updateServiceWorker,
  } = useRegisterSW({
    onRegisteredSW(_swUrl, registration) {
      if (!registration) return;
      window.setInterval(() => {
        if (navigator.onLine && document.visibilityState === 'visible') {
          registration.update().catch(() => {});
        }
      }, UPDATE_CHECK_MS);
    },
  });

  if (!needRefresh) return null;

  const uploading = job.status === 'uploading';

  return (
    <div
      className="fixed left-1/2 -translate-x-1/2 z-[60] w-[min(100vw-2rem,24rem)] rounded-2xl border border-[var(--border-accent)] bg-[var(--surface-elevated)] shadow-[0_16px_48px_-16px_rgba(0,0,0,0.6)] px-4 py-3"
      style={{ bottom: 'calc(1rem + var(--bottom-nav-offset, 0px))' }}
      role="status"
      aria-live="polite"
    >
      <div className="flex items-start gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">New MastPlayer update available</p>
          <p className="text-xs app-muted mt-0.5">
            {uploading ? 'You can update after your upload finishes.' : 'Reload to get the latest version.'}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setNeedRefresh(false)}
          className="shrink-0 p-1.5 rounded-lg app-muted hover:text-[var(--foreground)]"
          aria-label="Dismiss update notice"
        >
          <X className="w-4 h-4" />
        </button>
      </div>
      <button
        type="button"
        onClick={() => updateServiceWorker(true)}
        disabled={uploading}
        className="app-btn-primary !py-2 !text-xs mt-3 w-full disabled:opacity-60"
      >
        <RefreshCw className="w-3.5 h-3.5" aria-hidden />
        Update
      </button>
    </div>
  );
}
