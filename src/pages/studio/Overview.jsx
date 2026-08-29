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

function StatCard({ icon: Icon, label, value, hint, accent = 'teal' }) {
  const accents = {
    teal: 'bg-teal-50 text-teal-800 border-teal-100',
    ink: 'bg-slate-100 text-slate-800 border-slate-200',
    amber: 'bg-amber-50 text-amber-900 border-amber-100',
    emerald: 'bg-emerald-50 text-emerald-900 border-emerald-100',
  };
  return (
    <div className="rounded-2xl border border-[#e2e8f0] bg-white p-5 shadow-sm">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide text-[#64748b]">{label}</p>
          <p className="mt-2 text-2xl sm:text-3xl font-semibold tabular-nums tracking-tight">
            {value}
          </p>
          {hint ? <p className="mt-1.5 text-xs text-[#64748b]">{hint}</p> : null}
        </div>
        <span className={`inline-flex h-10 w-10 items-center justify-center rounded-xl border ${accents[accent]}`}>
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
          <p className="text-sm font-medium text-teal-800 mb-1">Creator Studio</p>
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl tracking-tight">
            Overview
          </h1>
          <p className="mt-2 text-[#64748b]">
            Welcome back{user?.name ? `, ${user.name}` : ''}. App views only — web previews don’t
            count.
          </p>
        </div>
        <Link
          to="/studio/upload"
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 text-white px-5 py-3 text-sm font-semibold hover:bg-teal-700 shadow-sm"
        >
          <Upload className="w-4 h-4" />
          Upload video
        </Link>
      </div>

      {loading && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl bg-white border border-[#e2e8f0] animate-pulse" />
          ))}
        </div>
      )}

      {error && (
        <div className="rounded-2xl border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-800">
          {error}
        </div>
      )}

      {!loading && stats && (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
            <StatCard
              icon={Video}
              label="Videos"
              value={formatCount(stats.videoCount)}
              hint="In your library"
              accent="ink"
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
              hint="≥20s, 1 / device / day"
              accent="emerald"
            />
            <StatCard
              icon={DollarSign}
              label="Est. earnings"
              value={formatUsd(stats.estimatedEarningsUsd)}
              hint={`$${stats.usdPerThousand} per 1,000 payable views`}
              accent="amber"
            />
          </div>

          <section className="rounded-2xl border border-[#e2e8f0] bg-white shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[#e2e8f0]">
              <div>
                <h2 className="text-lg font-semibold">Recent videos</h2>
                <p className="text-sm text-[#64748b]">Latest uploads and their app view stats</p>
              </div>
              <Link
                to="/studio/videos"
                className="inline-flex items-center gap-1 text-sm font-semibold text-teal-800 hover:underline"
              >
                View all <ArrowRight className="w-4 h-4" />
              </Link>
            </div>

            {stats.recentVideos?.length === 0 ? (
              <div className="px-6 py-16 text-center">
                <p className="text-[#64748b] mb-4">No videos yet — upload your first share link.</p>
                <Link
                  to="/studio/upload"
                  className="inline-flex items-center gap-2 rounded-xl bg-teal-800 text-white px-4 py-2.5 text-sm font-semibold"
                >
                  <Upload className="w-4 h-4" /> Upload
                </Link>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-sm">
                  <thead className="bg-[#f8fafc] text-[#64748b] text-xs uppercase tracking-wide">
                    <tr>
                      <th className="px-5 sm:px-6 py-3 font-semibold">Video</th>
                      <th className="px-4 py-3 font-semibold">Views</th>
                      <th className="px-4 py-3 font-semibold">Payable</th>
                      <th className="px-4 py-3 font-semibold hidden sm:table-cell">Uploaded</th>
                      <th className="px-5 sm:px-6 py-3 font-semibold text-right">Link</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#e2e8f0]">
                    {stats.recentVideos.map((v) => (
                      <tr key={v.id} className="hover:bg-slate-50/80">
                        <td className="px-5 sm:px-6 py-3.5">
                          <div className="flex items-center gap-3 min-w-0">
                            <div className="w-14 h-9 rounded-lg overflow-hidden bg-slate-200 shrink-0">
                              {v.thumbnailUrl ? (
                                <img
                                  src={v.thumbnailUrl}
                                  alt=""
                                  className="w-full h-full object-cover"
                                />
                              ) : null}
                            </div>
                            <div className="min-w-0">
                              <p className="font-medium truncate max-w-[14rem] sm:max-w-xs">
                                {v.title}
                              </p>
                              <p className="text-xs text-[#64748b] tabular-nums">
                                {formatDuration(v.duration)}
                              </p>
                            </div>
                          </div>
                        </td>
                        <td className="px-4 py-3.5 tabular-nums font-medium">
                          {formatCount(v.viewCount)}
                        </td>
                        <td className="px-4 py-3.5 tabular-nums font-medium text-emerald-800">
                          {formatCount(v.payableViewCount)}
                        </td>
                        <td className="px-4 py-3.5 text-[#64748b] hidden sm:table-cell">
                          {formatDate(v.createdAt)}
                        </td>
                        <td className="px-5 sm:px-6 py-3.5 text-right">
                          <button
                            type="button"
                            onClick={() => copyLink(v.shareUrl)}
                            className="inline-flex items-center gap-1.5 rounded-lg border border-[#e2e8f0] px-2.5 py-1.5 text-xs font-semibold hover:bg-white"
                          >
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
