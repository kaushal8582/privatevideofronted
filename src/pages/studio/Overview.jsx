import { useCallback, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Eye,
  DollarSign,
  Video,
  Upload,
  ArrowRight,
} from 'lucide-react';
import toast from 'react-hot-toast';
import {
  deleteVideo,
  fetchDashboardActivity,
  fetchDashboardStats,
  getFriendlyError,
} from '../../services/api.js';
import DeleteVideoModal from '../../components/DeleteVideoModal.jsx';
import TelegramReshareModal from '../../components/TelegramReshareModal.jsx';
import VideoActionsMenu from '../../components/VideoActionsMenu.jsx';
import TelegramChannelCard from '../../components/TelegramChannelCard.jsx';
import InstallAppCard from '../../pwa/InstallAppCard.jsx';
import { formatCount, formatDate, formatDuration, formatUsd } from '../../utils/formatters.js';

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

function formatActivityDay(isoDate) {
  const date = new Date(`${isoDate}T12:00:00+05:30`);
  if (Number.isNaN(date.getTime())) return isoDate;
  const today = new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Asia/Kolkata',
    year: 'numeric',
    month: '2-digit',
    day: '2-digit',
  }).format(new Date());
  if (isoDate === today) return 'Today';
  return date.toLocaleDateString('en-IN', {
    timeZone: 'Asia/Kolkata',
    day: 'numeric',
    month: 'short',
  });
}

function DailyActivity({ activity, error }) {
  return (
    <section className="app-table-wrap">
      <div className="px-5 sm:px-6 py-4 border-b border-[var(--border)]">
        <h2 className="text-lg font-semibold text-[var(--foreground)]">Daily activity</h2>
        <p className="text-sm app-muted">Uploads and earnings from today back 5 days (India time)</p>
      </div>
      {error ? (
        <div className="p-5">
          <p className="app-error">{error}</p>
        </div>
      ) : !activity ? (
        <div className="p-5 space-y-2">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-8 rounded-lg bg-[var(--surface)] animate-pulse" />
          ))}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="app-table min-w-[320px]">
            <thead>
              <tr>
                <th className="px-5">Day</th>
                <th>Uploads</th>
                <th className="px-5 text-right">Earnings</th>
              </tr>
            </thead>
            <tbody>
              {activity.activity.map((row) => (
                <tr key={row.date}>
                  <td className="px-5">{formatActivityDay(row.date)}</td>
                  <td className="tabular-nums">{formatCount(row.uploads)}</td>
                  <td className="px-5 text-right tabular-nums font-medium">
                    {formatUsd(row.earningsUsd)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </section>
  );
}

export default function StudioOverview() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pendingDelete, setPendingDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [reshareVideo, setReshareVideo] = useState(null);
  const [activity, setActivity] = useState(null);
  const [activityError, setActivityError] = useState(null);

  const loadStats = useCallback(async ({ silent = false, isCancelled = () => false } = {}) => {
    if (!silent) setLoading(true);
    setError(null);
    try {
      const { data } = await fetchDashboardStats();
      if (!isCancelled()) setStats(data.data);
    } catch (err) {
      if (!isCancelled()) setError(getFriendlyError(err, 'Could not load dashboard.'));
    } finally {
      if (!isCancelled() && !silent) setLoading(false);
    }
  }, []);

  useEffect(() => {
    let cancelled = false;
    loadStats({ isCancelled: () => cancelled });
    fetchDashboardActivity(5)
      .then(({ data }) => {
        if (!cancelled) setActivity(data.data);
      })
      .catch((err) => {
        if (!cancelled) setActivityError(getFriendlyError(err, 'Could not load daily activity.'));
      });
    return () => {
      cancelled = true;
    };
  }, [loadStats]);

  const handleConfirmDelete = async () => {
    if (!pendingDelete || deleting) return;
    setDeleting(true);
    try {
      await deleteVideo(pendingDelete.id);
      toast.success('Video deleted');
      setPendingDelete(null);
      await loadStats({ silent: true });
    } catch (err) {
      toast.error(getFriendlyError(err, 'Failed to delete video.'));
    } finally {
      setDeleting(false);
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

  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="app-title">Dashboard</h1>
        </div>
        <Link to="/studio/upload" className="app-btn-primary">
          <Upload className="w-4 h-4" />
          Upload video
        </Link>
      </div>

      <TelegramChannelCard />

      <InstallAppCard dismissible />

      {loading && (
        <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-28 rounded-2xl app-card animate-pulse bg-[var(--surface)]" />
          ))}
        </div>
      )}

      {error && <div className="app-error">{error}</div>}

      {!loading && stats && (
        <>
          <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-4">
            <StatCard
              icon={Video}
              label="Videos"
              value={formatCount(stats.videoCount)}
              hint="In your library"
              accent="muted"
            />
            <StatCard
              icon={Eye}
              label="Views"
              value={formatCount(stats.payableViews)}
              hint="App plays that count"
            />
            <StatCard
              icon={DollarSign}
              label="Est. earnings"
              value={formatUsd(stats.estimatedEarningsUsd)}
              hint={`$${stats.usdPerThousand} per 1,000 views`}
              accent="amber"
            />
          </div>

          <DailyActivity activity={activity} error={activityError} />

          <section className="app-table-wrap">
            <div className="flex items-center justify-between px-5 sm:px-6 py-4 border-b border-[var(--border)]">
              <div>
                <h2 className="text-lg font-semibold text-[var(--foreground)]">Recent videos</h2>
                <p className="text-sm app-muted">Latest uploads and their view stats</p>
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
                      <th className="hidden sm:table-cell">Uploaded</th>
                      <th className="px-5 sm:px-6 text-right">Actions</th>
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
                        <td className="tabular-nums font-medium">
                          {formatCount(v.payableViewCount ?? v.viewCount)}
                        </td>
                        <td className="app-muted hidden sm:table-cell">{formatDate(v.createdAt)}</td>
                        <td className="px-5 sm:px-6">
                          <div className="flex items-center justify-end">
                            <VideoActionsMenu
                              video={v}
                              disabled={deleting && pendingDelete?.id === v.id}
                              onCopy={() => copyLink(v.shareUrl)}
                              onReshare={() => setReshareVideo(v)}
                              onDelete={() => setPendingDelete(v)}
                            />
                          </div>
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

      <DeleteVideoModal
        open={Boolean(pendingDelete)}
        title={pendingDelete?.title}
        loading={deleting}
        onCancel={() => !deleting && setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <TelegramReshareModal video={reshareVideo} onClose={() => setReshareVideo(null)} />
    </div>
  );
}
