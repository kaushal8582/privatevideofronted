import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import {
  Copy,
  Sparkles,
  Link2,
  Crown,
  Wallet,
  Info,
  ExternalLink,
} from 'lucide-react';
import {
  fetchOgEarnLinks,
  fetchOgEarnSummary,
  convertOgEarnLink,
  getFriendlyError,
} from '../../services/api.js';
import LoadingState from '../../components/LoadingState.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import { formatCount, formatDate, formatUsd } from '../../utils/formatters.js';

function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="app-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide app-muted">{label}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
          {hint ? <p className="mt-1.5 text-xs app-muted">{hint}</p> : null}
        </div>
        <span className="app-stat-icon">
          <Icon className="w-5 h-5" />
        </span>
      </div>
    </div>
  );
}

export default function StudioOgEarn() {
  const [summary, setSummary] = useState(null);
  const [links, setLinks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pasteToken, setPasteToken] = useState('');
  const [converting, setConverting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, linksRes] = await Promise.all([
        fetchOgEarnSummary(),
        fetchOgEarnLinks(),
      ]);
      setSummary(summaryRes.data.data);
      setLinks(linksRes.data.data.links || []);
    } catch (err) {
      setError(getFriendlyError(err, 'Could not load OG Earn.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const extractToken = (raw) => {
    const s = String(raw || '').trim();
    if (!s) return '';
    try {
      const url = new URL(s);
      const parts = url.pathname.split('/').filter(Boolean);
      const vIdx = parts.indexOf('v');
      if (vIdx >= 0 && parts[vIdx + 1]) return parts[vIdx + 1];
    } catch {
      /* not a URL */
    }
    const match = s.match(/\/v\/([A-Za-z0-9_-]+)/);
    if (match) return match[1];
    return s;
  };

  const handleConvert = async (e) => {
    e.preventDefault();
    const token = extractToken(pasteToken);
    if (!token || token.length < 6) {
      toast.error('Paste a valid MastPlayer video link or token');
      return;
    }
    setConverting(true);
    try {
      const { data } = await convertOgEarnLink(token);
      toast.success(data.message || 'OG Earn link ready');
      setPasteToken('');
      await load();
      if (data.data?.shareUrl) {
        try {
          await navigator.clipboard.writeText(data.data.shareUrl);
          toast.success('Your OG Earn link copied');
        } catch {
          /* ignore */
        }
      }
    } catch (err) {
      toast.error(getFriendlyError(err, 'Could not convert link.'));
    } finally {
      setConverting(false);
    }
  };

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy');
    }
  };

  if (loading) return <LoadingState message="Loading OG Earn…" />;
  if (error) return <ErrorState title="OG Earn unavailable" message={error} onRetry={load} />;

  const royalty = summary?.royaltyPercent ?? 10;
  const ownerShare = summary?.ownerSharePercent ?? 90;

  return (
    <div className="space-y-8">
      <div>
        <p className="app-kicker mb-1">OG Earn</p>
        <h1 className="app-title">Convert links &amp; earn</h1>
        <p className="mt-2 app-subtitle max-w-2xl">
          Take any public MastPlayer video link, convert it to yours, and earn{' '}
          <strong className="text-[var(--foreground)]">{ownerShare}%</strong> from app views on your
          link. The original creator always receives a{' '}
          <strong className="text-[var(--foreground)]">{royalty}%</strong> royalty.
        </p>
      </div>

      <div className="app-success-banner flex gap-3 items-start">
        <Info className="w-5 h-5 text-[var(--blue)] shrink-0 mt-0.5" />
        <p className="text-sm app-muted leading-relaxed">
          Example: your remapped link earns <strong className="text-[var(--foreground)]">$1.00</strong>{' '}
          → you get <strong className="text-[var(--foreground)]">${(ownerShare / 100).toFixed(2)}</strong>,
          original creator gets <strong className="text-[var(--foreground)]">${(royalty / 100).toFixed(2)}</strong>.
          You cannot convert your own uploads. Middle converters get $0 when someone remaps your remapped link.
        </p>
      </div>

      <form onSubmit={handleConvert} className="app-card-padded space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Sparkles className="w-5 h-5 text-[var(--cyan)]" />
          Convert a public link
        </h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            value={pasteToken}
            onChange={(e) => setPasteToken(e.target.value)}
            placeholder="https://mastplayer.in/v/TOKEN or paste token"
            className="app-input flex-1 !mt-0 font-mono text-sm"
          />
          <button type="submit" disabled={converting} className="app-btn-primary shrink-0">
            {converting ? 'Converting…' : 'Create my link'}
          </button>
        </div>
      </form>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Link2}
          label="My OG links"
          value={formatCount(summary.linkCount)}
          hint="Active remapped links"
        />
        <StatCard
          icon={Wallet}
          label="OG Earn balance"
          value={formatUsd(summary.ogEarnBalanceUsd)}
          hint={`${ownerShare}% from your remapped links`}
        />
        <StatCard
          icon={Crown}
          label="Royalty earned"
          value={formatUsd(summary.ogRoyaltyBalanceUsd)}
          hint={`${royalty}% when others remapped your videos`}
        />
        <StatCard
          icon={Sparkles}
          label="OG payable views"
          value={formatCount(summary.ogEarnViews)}
          hint="Views on your remapped links"
        />
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">My OG Earn links</h2>
        {links.length === 0 ? (
          <div className="app-card p-8 text-center">
            <p className="app-muted">No remapped links yet. Paste a public video link above.</p>
          </div>
        ) : (
          <div className="app-table-wrap overflow-x-auto">
            <table className="app-table min-w-[720px]">
              <thead>
                <tr>
                  <th className="px-5">Video</th>
                  <th>Views</th>
                  <th>Payable</th>
                  <th>Created</th>
                  <th className="px-5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {links.map((row) => (
                  <tr key={row.id}>
                    <td className="px-5">
                      <p className="font-semibold truncate max-w-[16rem]" title={row.video?.title}>
                        {row.video?.title || 'Video'}
                      </p>
                      <p className="text-xs app-muted font-mono truncate max-w-[16rem]">
                        {row.shareUrl}
                      </p>
                    </td>
                    <td className="tabular-nums">{formatCount(row.viewCount)}</td>
                    <td className="tabular-nums text-[var(--blue)]">
                      {formatCount(row.payableViewCount)}
                    </td>
                    <td className="app-muted">{formatDate(row.createdAt)}</td>
                    <td className="px-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          type="button"
                          onClick={() => copyLink(row.shareUrl)}
                          className="app-btn-secondary !py-1.5 !px-2.5 !text-xs"
                        >
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </button>
                        <Link
                          to={`/v/${row.shareToken}`}
                          className="app-btn-secondary !py-1.5 !px-2.5 !text-xs"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
