import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  DollarSign,
  Video,
  BadgeCheck,
  Upload,
  ArrowRight,
  Copy,
} from 'lucide-react';
import toast from 'react-hot-toast';
import { fetchDashboardStats, getFriendlyError } from '../../services/api.js';
import { formatCount, formatDate, formatDuration, formatUsd } from '../../utils/formatters.js';
import { useAuth } from '../../context/AuthContext.jsx';

function StatCard({ icon: Icon, label, value, hint, accent = 'green' }) {
  const iconClass =
    accent === 'amber'
      ? 'app-stat-icon app-stat-icon-amber'
      : accent === 'muted'
        ? 'app-stat-icon app-stat-icon-muted'
        : 'app-stat-icon';

  return (
    <div className="app-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide app-muted">{label}</p>
          <p className="mt-2 text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight text-[var(--foreground)]">
            {value}
          </p>
          {hint ? <p className="mt-1.5 text-xs app-muted">{hint}</p> : null}
        </div>
        <span className={iconClass}>
          <Icon className="w-5 h-5" />
        </span>
      </div>
    </div>
  );
}

export default function StudioOverview() {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setError(null);
      try {
        const { data } = await fetchDashboardStats();
        if (!cancelled) setStats(data.data);
      } catch (err) {
        if (!cancelled) setError(getFriendlyError(err, 'Could not load dashboard.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const copyLink = async (url) => {
    try {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied');
    } catch {
      toast.error('Could not copy');
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <p className="app-kicker mb-1">Creator Studio</p>
          <h1 className="app-title">Overview</h1>
          <p className="mt-2 app-subtitle">
            Welcome back{user?.name ? `, ${user.name}` : ''}. App views only — web previews don’t
            count.
          </p>
        </div>
        <Link to="/studio/upload" className="app-btn-primary">
          <Upload className="w-4 h-4" />
          Upload video
        </Link>
      </div>

      {loading && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl app-card animate-pulse bg-[var(--surface)]" />
          ))}
        </div>
      )}

      {error && <div className="app-error">{error}</div>}

      {!loading && stats && (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              icon={Video}
              label="Videos"
              value={formatCount(stats.videoCount)}
              hint="In your library"
              accent="muted"
            />
            <StatCard
              icon={Eye}
              label="App views"
              value={formatCount(stats.totalAppViews)}
              hint="Counted plays in the app"
            />
            <StatCard
              icon={BadgeCheck}
              label="Payable views"
              value={formatCount(stats.payableViews)}
              hint="≥1 min watch, 1 / device / day"
            />
            <StatCard
              icon={DollarSign}
              label="Est. earnings"
              value={formatUsd(stats.estimatedEarningsUsd)}
              hint={`$${stats.usdPerThousand} per 1,000 payable views`}
              accent="amber"
            />
          </div>

          <section className="app-table-wrap">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[var(--border)]">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent videos</h2>
                <p className="text-sm app-muted">Latest uploads and their app view stats</p>
              </div>
              <Link to="/studio/videos" className="app-link inline-flex items-center gap-1 text-sm">
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {stats.recentVideos?.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="app-muted mb-4">No videos yet — upload your first share link.</p>
                <Link to="/studio/upload" className="app-btn-primary">
                  <Upload className="w-4 h-4" /> Upload
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="app-table">
                  <thead>
                    <tr>
                      <th className="px-5 sm:px-6">Video</th>
                      <th>Views</th>
                      <th>Payable</th>
                      <th className="hidden sm:table-cell">Uploaded</th>
                      <th className="px-5 sm:px-6 text-right">Link</th>
                    </tr>
                  </thead>
                  <tbody>
                    {stats.recentVideos.map((v) => (
                      <tr key={v.id}>
                        <td className="px-5 sm:px-6">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-14 h-9 rounded-lg overflow-hidden bg-[var(--surface)] border border-[var(--border)] shrink-0">
                              {v.thumbnailUrl ? (
                                <img src={v.thumbnailUrl} alt="" className="w-full h-full object-cover" />
                              ) : null}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate max-w-[14rem] sm:max-w-xs">{v.title}</p>
                              <p className="text-xs app-muted tabular-nums">{formatDuration(v.duration)}</p>
                            </div>
                          </div>
                        </td>
                        <td className="tabular-nums font-medium">{formatCount(v.viewCount)}</td>
                        <td className="tabular-nums font-medium text-[var(--primary)]">
                          {formatCount(v.payableViewCount)}
                        </td>
                        <td className="app-muted hidden sm:table-cell">{formatDate(v.createdAt)}</td>
                        <td className="px-5 sm:px-6 text-right">
                          <button type="button" onClick={() => copyLink(v.shareUrl)} className="app-btn-secondary !py-1.5 !px-2.5 !text-xs">
                            <Copy className="w-3.5 h-3.5" />
                            Copy
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        </>
      )}
    </div>
  );
}
