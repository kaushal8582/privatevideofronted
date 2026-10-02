import { useCallback, useEffect, useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Upload, Eye } from 'lucide-react';
import toast from 'react-hot-toast';
import useVideos from '../../hooks/useVideos.js';
import EmptyState from '../../components/EmptyState.jsx';
import { SkeletonGrid } from '../../components/LoadingState.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import DeleteVideoModal from '../../components/DeleteVideoModal.jsx';
import TelegramReshareModal from '../../components/TelegramReshareModal.jsx';
import VideoActionsMenu from '../../components/VideoActionsMenu.jsx';
import VideoThumbnail from '../../components/VideoThumbnail.jsx';
import Pagination from '../../components/Pagination.jsx';
import {
  formatCount,
  formatDate,
  formatDuration,
  formatFileSize,
} from '../../utils/formatters.js';

const PAGE_SIZE = 20;

export default function StudioVideos() {
  const [searchParams, setSearchParams] = useSearchParams();
  const page = Math.max(1, parseInt(searchParams.get('page'), 10) || 1);

  const { videos, pagination, loading, error, deletingId, reload, removeVideo } =
    useVideos({ page, limit: PAGE_SIZE });

  const [pendingDelete, setPendingDelete] = useState(null);
  const [reshareVideo, setReshareVideo] = useState(null);

  const initialLoading = loading && videos.length === 0;
  const totalPages = pagination.totalPages || 1;

  const goToPage = useCallback(
    (next, { replace = false } = {}) => {
      const params = new URLSearchParams(searchParams);
      if (next <= 1) params.delete('page');
      else params.set('page', String(next));
      setSearchParams(params, { replace });
      window.scrollTo({ top: 0, behavior: 'smooth' });
    },
    [searchParams, setSearchParams]
  );

  // Out-of-range ?page= (e.g. old link, or videos deleted elsewhere) → jump to the last page.
  useEffect(() => {
    if (loading || error) return;
    if (page > totalPages && pagination.total > 0) {
      goToPage(totalPages, { replace: true });
    }
  }, [loading, error, page, totalPages, pagination.total, goToPage]);

  const handleConfirmDelete = async () => {
    if (!pendingDelete) return;
    const id = pendingDelete.id || pendingDelete._id;
    const wasLastOnPage = videos.length === 1;
    const result = await removeVideo(id);

    if (result.success) {
      toast.success('Video deleted');
      setPendingDelete(null);
      if (wasLastOnPage && page > 1) goToPage(page - 1, { replace: true });
      else reload();
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
          {!initialLoading && !error && (
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

      {initialLoading && <SkeletonGrid />}

      {!loading && error && (
        <ErrorState title="Unable to load videos" message={error} onRetry={reload} />
      )}

      {!loading && !error && videos.length === 0 && pagination.total === 0 && <EmptyState />}

      {!error && videos.length > 0 && (
        <div
          className={`app-table-wrap min-w-0 max-w-full transition-opacity ${
            loading ? 'opacity-60 pointer-events-none' : ''
          }`}
          aria-busy={loading}>
          <div className="overflow-x-auto overscroll-x-contain">
            <table className="app-table min-w-[640px]">
              <thead>
                <tr>
                  <th className="px-5">Video</th>
                  <th>
                    <span className="inline-flex items-center gap-1">
                      <Eye className="w-3.5 h-3.5" /> Views
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
                            <p className="text-xs app-muted tabular-nums">
                              {formatDuration(video.duration)}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="tabular-nums font-medium">
                        {formatCount(video.payableViewCount ?? video.viewCount)}
                      </td>
                      <td className="app-muted">{formatFileSize(video.size)}</td>
                      <td className="app-muted">{formatDate(video.createdAt)}</td>
                      <td className="px-5">
                        <div className="flex items-center justify-end">
                          <VideoActionsMenu
                            video={video}
                            disabled={deleting}
                            onCopy={() => copyLink(video.shareUrl)}
                            onReshare={() => setReshareVideo(video)}
                            onDelete={() => setPendingDelete(video)}
                          />
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {!error && videos.length > 0 && (
        <Pagination
          page={pagination.page || page}
          totalPages={totalPages}
          total={pagination.total}
          limit={pagination.limit || PAGE_SIZE}
          onPageChange={goToPage}
          disabled={loading}
          label={pagination.total === 1 ? 'video' : 'videos'}
        />
      )}

      <DeleteVideoModal
        open={Boolean(pendingDelete)}
        title={pendingDelete?.title}
        loading={Boolean(deletingId)}
        onCancel={() => !deletingId && setPendingDelete(null)}
        onConfirm={handleConfirmDelete}
      />

      <TelegramReshareModal video={reshareVideo} onClose={() => setReshareVideo(null)} />
    </div>
  );
}
