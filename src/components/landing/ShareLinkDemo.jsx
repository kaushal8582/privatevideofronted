import { useState } from 'react';
import { Copy, Share2 } from 'lucide-react';
import toast from 'react-hot-toast';

const DEMO_URL = 'https://mastplayer.in/v/x7k92m';

export default function ShareLinkDemo({ compact = false }) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(DEMO_URL);
      setCopied(true);
      toast.success('Demo link copied');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      toast.error('Could not copy');
    }
  };

  return (
    <div
      className={[
        'rounded-2xl border border-[var(--border-green)] bg-[var(--surface-elevated)] w-full max-w-full min-w-0',
        compact ? 'p-4' : 'p-4 sm:p-5 lg:p-6',
      ].join(' ')}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
        Your share link
      </p>
      <div className="flex flex-col gap-3">
        <code className="block w-full rounded-xl border border-[var(--border)] bg-[var(--background)] px-3 sm:px-4 py-3 text-xs sm:text-sm lg:text-base text-[var(--primary)] font-mono break-all">
          mastplayer.in/v/x7k92m
        </code>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl app-gradient-bg text-white px-4 py-2.5 text-sm font-bold hover:brightness-110 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
          >
            <Copy className="w-4 h-4 shrink-0" />
            {copied ? 'Copied' : 'Copy Link'}
          </button>
          <button
            type="button"
            onClick={() => toast('Share opens from your device when using a real video link.')}
            className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--border-green)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
          >
            <Share2 className="w-4 h-4 shrink-0" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
