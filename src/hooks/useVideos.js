import { useCallback, useEffect, useState } from 'react';
import { fetchVideos, deleteVideo as apiDeleteVideo, getFriendlyError } from '../services/api.js';

export default function useVideos({ page = 1, limit = 20, autoLoad = true } = {}) {
  const [videos, setVideos] = useState([]);
  const [pagination, setPagination] = useState({
    page: 1,
    limit,
    total: 0,
    totalPages: 1,
  });
  const [loading, setLoading] = useState(autoLoad);
  const [error, setError] = useState(null);
  const [deletingId, setDeletingId] = useState(null);

  const loadVideos = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await fetchVideos(page, limit);
      setVideos(data.data.videos || []);
      setPagination(data.data.pagination || { page, limit, total: 0, totalPages: 1 });
    } catch (err) {
      setError(getFriendlyError(err, 'Unable to load videos.'));
      setVideos([]);
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => {
    if (autoLoad) {
      loadVideos();
    }
  }, [autoLoad, loadVideos]);

  const removeVideo = async (id) => {
    setDeletingId(id);
    try {
      await apiDeleteVideo(id);
      setVideos((prev) => prev.filter((v) => v.id !== id && v._id !== id));
      setPagination((prev) => ({
        ...prev,
        total: Math.max(0, (prev.total || 1) - 1),
      }));
      return { success: true };
    } catch (err) {
      return {
        success: false,
        message: getFriendlyError(err, 'Failed to delete video.'),
      };
    } finally {
      setDeletingId(null);
    }
  };

  return {
    videos,
    pagination,
    loading,
    error,
    deletingId,
    reload: loadVideos,
    removeVideo,
  };
}
