import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Calendar, HardDrive, Play } from 'lucide-react';
import CopyLinkButton from '../components/CopyLinkButton.jsx';
import LoadingState from '../components/LoadingState.jsx';
import { fetchVideoByShareToken, getFriendlyError } from '../services/api.js';
import { trackAnalyticsEvent } from '../services/analytics.js';
import {
  formatDate,
  formatDuration,
  formatFileSize,
} from '../utils/formatters.js';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.mastplayer.in';

export default function WatchVideo() {
  const { shareToken } = useParams();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [openingApp, setOpeningApp] = useState(false);

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
          trackAnalyticsEvent('link_open', {
            shareToken,
            path: `/v/${shareToken}`,
            meta: { title: data.data?.title },
          });
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

  const openInApp = () => {
    if (!shareToken || openingApp) return;
    setOpeningApp(true);

    trackAnalyticsEvent('open_app_click', {
      shareToken,
      path: `/v/${shareToken}`,
    });

    const deepLink = `mastplayer://v/${shareToken}`;
    const started = Date.now();
    let hidden = false;

    const onVisibility = () => {
      if (document.hidden) hidden = true;
    };
    document.addEventListener('visibilitychange', onVisibility);

    // Try custom scheme first (opens app details screen if installed)
    window.location.href = deepLink;

    // If app didn't take focus, send user to Play Store
    window.setTimeout(() => {
      document.removeEventListener('visibilitychange', onVisibility);
      setOpeningApp(false);
      const elapsed = Date.now() - started;
      if (!hidden && elapsed >= 1400 && !document.hidden) {
        trackAnalyticsEvent('play_store_redirect', {
          shareToken,
          path: `/v/${shareToken}`,
        });
        window.location.href = PLAY_STORE_URL;
      }
    }, 1600);
  };

  if (loading) {
    return <LoadingState message="Loading video..." />;
  }

  if (notFound) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 px-4 sm:px-6">
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
      <div className="max-w-lg mx-auto text-center py-16 px-4 sm:px-6">
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

  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-semibold break-words">{video.title}</h1>
        <p className="text-sm text-[#5b657a] mt-1 truncate">{video.originalName}</p>
      </div>

      {/* Thumbnail preview — no in-browser playback */}
      <div className="relative aspect-video rounded-2xl overflow-hidden border border-[#e6e1d8] bg-[#0c1222] shadow-sm">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-teal-900 to-[#0c1222]" />
        )}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
          <button
            type="button"
            onClick={openInApp}
            disabled={openingApp}
            className="inline-flex items-center justify-center gap-2 rounded-full bg-teal-800 text-white px-7 py-3.5 text-base font-semibold hover:bg-teal-700 shadow-lg disabled:opacity-70"
          >
            <Play className="w-5 h-5 fill-white" />
            {openingApp ? 'Opening…' : 'View in App'}
          </button>
          <p className="text-sm text-white/80 max-w-sm">
            Open in Mast Player to watch. If the app isn’t installed, you’ll go to the Play Store.
          </p>
        </div>
        {video.duration != null && (
          <span className="absolute bottom-3 right-3 rounded-lg bg-black/70 text-white text-xs font-semibold px-2 py-1">
            {formatDuration(video.duration)}
          </span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={openInApp}
          disabled={openingApp}
          className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 text-white px-5 py-2.5 text-sm font-medium hover:bg-teal-700 disabled:opacity-70"
        >
          <Play className="w-4 h-4 fill-white" />
          {openingApp ? 'Opening…' : 'View in App'}
        </button>
        <a
          href={PLAY_STORE_URL}
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center justify-center rounded-xl border border-[#e6e1d8] bg-white px-4 py-2.5 text-sm font-medium hover:bg-[#f7f5f1]"
        >
          Get Mast Player
        </a>
        <CopyLinkButton url={shareUrl} variant="secondary" />
      </div>

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
