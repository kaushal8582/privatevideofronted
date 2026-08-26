import { useState } from 'react';
import toast from 'react-hot-toast';
import useVideos from '../hooks/useVideos.js';
import VideoGrid from '../components/VideoGrid.jsx';
import EmptyState from '../components/EmptyState.jsx';
import { SkeletonGrid } from '../components/LoadingState.jsx';
import ErrorState from '../components/ErrorState.jsx';
import DeleteVideoModal from '../components/DeleteVideoModal.jsx';

export default function Videos() {
  const { videos, pagination, loading, error, deletingId, reload, removeVideo } =
    useVideos({ page: 1, limit: 40 });

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

  return (
    <div>
      <div className="flex flex-col sm:flex-row sm:items-end sm:justify-between gap-3 mb-8">
        <div>
          <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl text-[#0c1222]">
            Your Videos
          </h1>
          {!loading && !error && (
            <p className="text-[#5b657a] mt-2">
              {pagination.total} {pagination.total === 1 ? 'video' : 'videos'} in your library
            </p>
          )}
        </div>
      </div>

      {loading && <SkeletonGrid />}

      {!loading && error && (
        <ErrorState
          title="Unable to load videos"
          message={error}
          onRetry={reload}
        />
      )}

      {!loading && !error && videos.length === 0 && <EmptyState />}

      {!loading && !error && videos.length > 0 && (
        <VideoGrid
          videos={videos}
          deletingId={deletingId}
          onDelete={setPendingDelete}
        />
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
