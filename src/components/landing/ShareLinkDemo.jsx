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
        'rounded-2xl border border-[var(--border-green)] bg-[var(--surface-elevated)]',
        compact ? 'p-4' : 'p-5 sm:p-6',
      ].join(' ')}
    >
      <p className="text-xs font-semibold uppercase tracking-wider text-[var(--muted)] mb-3">
        Your share link
      </p>
      <div className="flex flex-col sm:flex-row gap-3 sm:items-center">
        <code className="flex-1 rounded-xl border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm sm:text-base text-[var(--primary)] font-mono break-all">
          mastplayer.in/v/x7k92m
        </code>
        <div className="flex gap-2 shrink-0">
          <button
            type="button"
            onClick={handleCopy}
            className="inline-flex items-center justify-center gap-2 rounded-xl app-gradient-bg text-white px-4 py-2.5 text-sm font-bold hover:brightness-110 transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
          >
            <Copy className="w-4 h-4" />
            {copied ? 'Copied' : 'Copy Link'}
          </button>
          <button
            type="button"
            onClick={() => toast('Share opens from your device when using a real video link.')}
            className="inline-flex items-center justify-center gap-2 rounded-xl border border-[var(--border)] px-4 py-2.5 text-sm font-semibold text-[var(--foreground)] hover:border-[var(--border-green)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
          >
            <Share2 className="w-4 h-4" />
            Share
          </button>
        </div>
      </div>
    </div>
  );
}
