import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { Calendar, HardDrive, ArrowLeft } from 'lucide-react';
import VideoPlayer from '../components/VideoPlayer.jsx';
import CopyLinkButton from '../components/CopyLinkButton.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { fetchVideoByShareToken, getFriendlyError } from '../services/api.js';
import {
  formatDate,
  formatDuration,
  formatFileSize,
} from '../utils/formatters.js';

export default function WatchVideo() {
  const { shareToken } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setNotFound(false);
      setError(null);
      setVideo(null);

      try {
        const { data } = await fetchVideoByShareToken(shareToken);
        if (!cancelled) {
          setVideo(data.data);
        }
      } catch (err) {
        if (cancelled) return;
        const status = err?.response?.status;
        if (status === 404) {
          setNotFound(true);
        } else {
          setError(getFriendlyError(err, 'Unable to load this video.'));
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    load();
    return () => {
      cancelled = true;
    };
  }, [shareToken]);

  if (loading) {
    return <LoadingState message="Loading video..." />;
  }

  if (notFound) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl mb-4">
          Video Not Found
        </h1>
        <p className="text-[#5b657a] mb-8">
          This video may have been deleted or the link may be invalid.
        </p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-800 text-white text-sm font-medium hover:bg-teal-700"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Home
        </Link>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-lg mx-auto text-center py-16">
        <h1 className="text-2xl font-semibold mb-3">Unable to load this video</h1>
        <p className="text-[#5b657a] mb-8">{error}</p>
        <Link
          to="/"
          className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-800 text-white text-sm font-medium hover:bg-teal-700"
        >
          Back to Home
        </Link>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/v/${shareToken}`;
  const appDeepLink = `mastplayer://v/${shareToken}`;

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-semibold break-words">
            {video.title}
          </h1>
          <p className="text-sm text-[#5b657a] mt-1 truncate">{video.originalName}</p>
        </div>
        <div className="flex flex-wrap gap-2 shrink-0">
          <a
            href={appDeepLink}
            className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 text-white px-4 py-2.5 text-sm font-medium hover:bg-teal-700"
          >
            Open in App
          </a>
          <CopyLinkButton url={shareUrl} variant="secondary" />
        </div>
      </div>

      <VideoPlayer src={video.videoUrl} title={video.title} />

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-[#5b657a]">
        <span className="inline-flex items-center gap-1.5">
          <HardDrive className="w-4 h-4" />
          {formatFileSize(video.size)}
        </span>
        <span>Duration: {formatDuration(video.duration)}</span>
        <span className="inline-flex items-center gap-1.5">
          <Calendar className="w-4 h-4" />
          {formatDate(video.createdAt)}
        </span>
      </div>
    </div>
  );
}
