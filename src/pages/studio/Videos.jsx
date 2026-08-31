import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Upload, Trash2, Copy, ExternalLink, Eye, BadgeCheck } from 'lucide-react';
import toast from 'react-hot-toast';
import useVideos from '../../hooks/useVideos.js';
import EmptyState from '../../components/EmptyState.jsx';
import { SkeletonGrid } from '../../components/LoadingState.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import DeleteVideoModal from '../../components/DeleteVideoModal.jsx';
import VideoThumbnail from '../../components/VideoThumbnail.jsx';
import {
  formatCount,
  formatDate,
  formatDuration,
  formatFileSize,
} from '../../utils/formatters.js';

export default function StudioVideos() {
  const { videos, pagination, loading, error, deletingId, reload, removeVideo } =
    useVideos({ page: 1, limit: 60 });

  const [pendingDelete, setPendingDelete] = useState(null);

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    const id = pendingDelete.id || pendingDelete._id;
    const result = await removeVideo(id);

    if (result.success) {
      toast.success('Video deleted');
      setPendingDelete(null);
    } else {
      toast.error(result.message || 'Failed to delete video.');
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
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-4">
        <div>
          <h1 className="app-title">Videos</h1>
          {!loading && !error && (
            <p className="app-subtitle mt-2">
              {pagination.total} {pagination.total === 1 ? 'video' : 'videos'} · app views shown
            </p>
          )}
        </div>
        <Link to="/studio/upload" className="app-btn-primary">
          <Upload className="w-4 h-4" />
          Upload
        </Link>
      </div>

      {loading && <SkeletonGrid />}

      {!loading && error && (
        <ErrorState title="Unable to load videos" message={error} onRetry={reload} />
      )}

      {!loading && !error && videos.length === 0 && <EmptyState />}

      {!loading && !error && videos.length > 0 && (
        <div className="app-table-wrap overflow-x-auto">
          <table className="app-table min-w-[720px]">
            <thead>
              <tr>
                <th className="px-5">Video</th>
                <th>
                  <span className="inline-flex items-center gap-1">
                    <Eye className="w-3.5 h-3.5" /> Views
                  </span>
                </th>
                <th>
                  <span className="inline-flex items-center gap-1">
                    <BadgeCheck className="w-3.5 h-3.5" /> Payable
                  </span>
                </th>
                <th>Size</th>
                <th>Uploaded</th>
                <th className="px-5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {videos.map((video) => {
                const id = video.id || video._id;
                const deleting = deletingId === id;
                return (
                  <tr key={id}>
                    <td className="px-5">
                      <div className="flex items-center gap-3 min-w-0">
                        <div className="w-20 h-12 rounded-lg overflow-hidden bg-[var(--surface)] border border-[var(--border)] shrink-0 relative">
                          <VideoThumbnail
                            thumbnailUrl={video.thumbnailUrl}
                            videoUrl={video.videoUrl}
                            title={video.title}
                          />
                        </div>
                        <div className="min-w-0">
                          <p className="font-semibold truncate max-w-[18rem]" title={video.title}>
                            {video.title}
                          </p>
                          <p className="text-xs app-muted tabular-nums">{formatDuration(video.duration)}</p>
                        </div>
                      </div>
                    </td>
                    <td className="tabular-nums font-medium">{formatCount(video.viewCount)}</td>
                    <td className="tabular-nums font-medium text-[var(--primary)]">
                      {formatCount(video.payableViewCount)}
                    </td>
                    <td className="app-muted">{formatFileSize(video.size)}</td>
                    <td className="app-muted">{formatDate(video.createdAt)}</td>
                    <td className="px-5">
                      <div className="flex items-center justify-end gap-1.5">
                        <button type="button" onClick={() => copyLink(video.shareUrl)} className="app-btn-secondary !py-1.5 !px-2.5 !text-xs">
                          <Copy className="w-3.5 h-3.5" />
                          Copy
                        </button>
                        <Link to={`/v/${video.shareToken}`} className="app-btn-secondary !py-1.5 !px-2.5 !text-xs">
                          <ExternalLink className="w-3.5 h-3.5" />
                          Open
                        </Link>
                        <button
                          type="button"
                          disabled={deleting}
                          onClick={() => setPendingDelete(video)}
                          className="inline-flex items-center gap-1 rounded-lg px-2.5 py-1.5 text-xs font-semibold text-[var(--danger)] hover:bg-[var(--danger-soft)] disabled:opacity-50"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      <DeleteVideoModal
        open={Boolean(pendingDelete)}
        title={pendingDelete?.title}
        loading={Boolean(deletingId)}
        onCancel={() => !deletingId && setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />
    </div>
  );
}
