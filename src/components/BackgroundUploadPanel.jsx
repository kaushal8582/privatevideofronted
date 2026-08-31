import { Link } from 'react-router-dom';
import { Check, Loader2, X } from 'lucide-react';
import { useUploadQueue } from '../context/UploadQueueContext.jsx';
import CopyLinkButton from './CopyLinkButton.jsx';

function formatSize(bytes = 0) {
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(0)} KB`;
  if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} GB`;
}

export default function BackgroundUploadPanel() {
  const { job, cancelUpload, clearJob } = useUploadQueue();

  if (job.status === 'idle') return null;

  return (
    <div className="fixed bottom-4 right-4 z-50 w-[min(100vw-2rem,22rem)] rounded-2xl border border-[var(--border-green)] bg-[var(--surface-elevated)]/95 backdrop-blur shadow-[0_16px_48px_-16px_rgba(0,0,0,0.6)] overflow-hidden">
      <div className="flex items-start gap-3 px-4 pt-4 pb-2">
        <div className="mt-0.5 shrink-0 w-9 h-9 rounded-xl bg-[var(--accent-medium)] text-[var(--primary)] flex items-center justify-center">
          {job.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin" />}
          {job.status === 'success' && <Check className="w-4 h-4" />}
          {job.status === 'error' && <X className="w-4 h-4 text-[var(--danger)]" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold">
            {job.status === 'uploading' && 'Uploading in background'}
            {job.status === 'success' && 'Upload complete'}
            {job.status === 'error' && 'Upload failed'}
          </p>
          <p className="text-xs app-muted truncate mt-0.5" title={job.fileName || ''}>
            {job.fileName}
            {job.fileSize ? ` · ${formatSize(job.fileSize)}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={job.status === 'uploading' ? cancelUpload : clearJob}
          className="shrink-0 p-1.5 rounded-lg app-muted hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
          aria-label={job.status === 'uploading' ? 'Cancel upload' : 'Dismiss'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {job.status === 'uploading' && (
        <div className="px-4 pb-4 space-y-2">
          <div className="h-2 rounded-full bg-[var(--surface)] overflow-hidden">
            <div
              className="h-full rounded-full app-gradient-bg transition-[width] duration-300"
              style={{ width: `${job.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs app-muted">
            <span>{job.progress}%</span>
            <span>Keep this tab open</span>
          </div>
          <p className="text-[11px] app-muted leading-relaxed">
            You can open My Videos or other pages — upload keeps running here.
          </p>
        </div>
      )}

      {job.status === 'success' && job.result && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-xs app-muted break-all line-clamp-2">{job.result.shareUrl}</p>
          <div className="flex flex-wrap gap-2">
            <CopyLinkButton url={job.result.shareUrl} className="!py-2 !text-xs" />
            <Link to={`/v/${job.result.shareToken}`} className="app-btn-secondary !py-2 !text-xs">
              Open link
            </Link>
            <Link
              to="/studio/videos"
              onClick={clearJob}
              className="app-btn-primary !py-2 !text-xs"
            >
              Studio videos
            </Link>
          </div>
        </div>
      )}

      {job.status === 'error' && (
        <div className="px-4 pb-4 space-y-2">
          <p className="text-xs text-[var(--danger)]">{job.error}</p>
          <Link to="/studio/upload" onClick={clearJob} className="app-link text-xs">
            Try again
          </Link>
        </div>
      )}
    </div>
  );
}
