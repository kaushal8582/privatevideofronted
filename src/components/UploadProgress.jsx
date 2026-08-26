import { Loader } from 'lucide-react';

export default function UploadProgress({ progress = 0 }) {
  const pct = Math.min(100, Math.max(0, Math.round(progress)));

  return (
    <div className="rounded-2xl border border-[#e6e1d8] bg-white p-5 space-y-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex items-center gap-2 text-sm font-medium text-[#0c1222]">
          <Loader className="w-4 h-4 animate-spin text-teal-700" />
          Uploading...
        </div>
        <span className="text-sm tabular-nums text-[#5b657a]">{pct}%</span>
      </div>
      <div className="h-2.5 rounded-full bg-[#f0ebe3] overflow-hidden">
        <div
          className="h-full rounded-full bg-teal-700 transition-[width] duration-200 ease-out"
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}
