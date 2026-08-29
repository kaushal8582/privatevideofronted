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
    <div className="fixed bottom-4 right-4 z-50 w-[min(100vw-2rem,22rem)] rounded-2xl border border-[#e6e1d8] bg-white/95 backdrop-blur shadow-[0_16px_48px_-16px_rgba(12,18,34,0.45)] overflow-hidden">
      <div className="flex items-start gap-3 px-4 pt-4 pb-2">
        <div className="mt-0.5 shrink-0 w-9 h-9 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
          {job.status === 'uploading' && <Loader2 className="w-4 h-4 animate-spin" />}
          {job.status === 'success' && <Check className="w-4 h-4" />}
          {job.status === 'error' && <X className="w-4 h-4 text-red-600" />}
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-semibold text-[#0c1222]">
            {job.status === 'uploading' && 'Uploading in background'}
            {job.status === 'success' && 'Upload complete'}
            {job.status === 'error' && 'Upload failed'}
          </p>
          <p className="text-xs text-[#5b657a] truncate mt-0.5" title={job.fileName || ''}>
            {job.fileName}
            {job.fileSize ? ` · ${formatSize(job.fileSize)}` : ''}
          </p>
        </div>
        <button
          type="button"
          onClick={job.status === 'uploading' ? cancelUpload : clearJob}
          className="shrink-0 p-1.5 rounded-lg text-[#5b657a] hover:bg-slate-100 hover:text-[#0c1222]"
          aria-label={job.status === 'uploading' ? 'Cancel upload' : 'Dismiss'}
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {job.status === 'uploading' && (
        <div className="px-4 pb-4 space-y-2">
          <div className="h-2 rounded-full bg-[#ece7df] overflow-hidden">
            <div
              className="h-full rounded-full bg-teal-700 transition-[width] duration-300"
              style={{ width: `${job.progress}%` }}
            />
          </div>
          <div className="flex items-center justify-between text-xs text-[#5b657a]">
            <span>{job.progress}%</span>
            <span>Keep this tab open</span>
          </div>
          <p className="text-[11px] text-[#5b657a] leading-relaxed">
            You can open My Videos or other pages — upload keeps running here.
          </p>
        </div>
      )}

      {job.status === 'success' && job.result && (
        <div className="px-4 pb-4 space-y-3">
          <p className="text-xs text-[#5b657a] break-all line-clamp-2">{job.result.shareUrl}</p>
          <div className="flex flex-wrap gap-2">
            <CopyLinkButton url={job.result.shareUrl} className="!py-2 !text-xs" />
            <Link
              to={`/v/${job.result.shareToken}`}
              className="inline-flex items-center rounded-xl border border-[#e6e1d8] px-3 py-2 text-xs font-medium hover:bg-[#f7f5f1]"
            >
              Open link
            </Link>
            <Link
              to="/videos"
              onClick={clearJob}
              className="inline-flex items-center rounded-xl bg-teal-800 text-white px-3 py-2 text-xs font-medium hover:bg-teal-700"
            >
              My Videos
            </Link>
          </div>
        </div>
      )}

      {job.status === 'error' && (
        <div className="px-4 pb-4 space-y-2">
          <p className="text-xs text-red-700">{job.error}</p>
          <Link
            to="/upload"
            onClick={clearJob}
            className="inline-flex text-xs font-semibold text-teal-800 hover:underline"
          >
            Try again
          </Link>
        </div>
      )}
    </div>
  );
}
