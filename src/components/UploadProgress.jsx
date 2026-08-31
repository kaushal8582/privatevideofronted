import { Loader } from 'lucide-react';

export default function UploadProgress({ progress = 0 }) {
  const pct = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className="app-card p-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Loader className="w-4 h-4 animate-spin text-[var(--primary)]" />
          Uploading...
        </div>
        <span className="text-sm tabular-nums app-muted">{pct}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-[var(--surface)] overflow-hidden">
        <div
          className="h-full rounded-full app-gradient-bg transition-[width] duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
