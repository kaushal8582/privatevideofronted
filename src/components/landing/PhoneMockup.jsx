import { Copy, Play, Share2 } from 'lucide-react';

export default function PhoneMockup() {
  return (
    <div
      className="relative mx-auto w-[min(100%,260px)] aspect-[9/19] rounded-[2rem] border border-[var(--border-green)] bg-[var(--surface)] p-2 shadow-[0_24px_60px_-20px_var(--glow-cyan)] landing-float"
      aria-hidden
    >
      <div className="h-full rounded-[1.5rem] border border-[var(--border)] bg-[var(--background)] overflow-hidden flex flex-col">
        <div className="px-4 pt-3 pb-2">
          <p className="text-[10px] font-semibold text-[var(--primary)] tracking-wide">MAST PLAYER</p>
          <p className="text-xs text-[var(--muted)] mt-0.5">Shared video</p>
        </div>
        <div className="relative mx-3 aspect-video rounded-xl bg-gradient-to-br from-[var(--surface)] via-[var(--surface-elevated)] to-[var(--background)] border border-[var(--border)] flex items-center justify-center">
          <div className="w-12 h-12 rounded-full app-gradient-bg flex items-center justify-center shadow-[0_0_24px_var(--glow-cyan-strong)]">
            <Play className="w-5 h-5 text-white ml-0.5" fill="currentColor" />
          </div>
        </div>
        <div className="px-4 pt-3 space-y-2 flex-1">
          <p className="text-sm font-semibold text-[var(--foreground)] leading-snug">
            Product walkthrough
          </p>
          <p className="text-[11px] text-[var(--muted)]">1.2k views · 12:04</p>
          <div className="flex gap-2 pt-1">
            <span className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-[var(--border-green)] bg-[var(--accent-soft)] py-2 text-[10px] font-semibold text-[var(--primary)]">
              <Copy className="w-3 h-3" />
              Copy Link
            </span>
            <span className="inline-flex flex-1 items-center justify-center gap-1 rounded-lg border border-[var(--border)] py-2 text-[10px] font-semibold text-[var(--muted)]">
              <Share2 className="w-3 h-3" />
              Share
            </span>
          </div>
        </div>
      </div>
    </div>
  );
}
