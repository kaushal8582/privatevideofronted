import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ArrowLeft, Calendar, HardDrive, Play, Sparkles } from 'lucide-react';
import CopyLinkButton from '../components/CopyLinkButton.jsx';
import LoadingState from '../components/LoadingState.jsx';
import {
  convertOgEarnLink,
  fetchVideoByShareToken,
  getFriendlyError,
} from '../services/api.js';
import { trackAnalyticsEvent } from '../services/analytics.js';
import { useAuth } from '../context/AuthContext.jsx';
import {
  formatDate,
  formatDuration,
  formatFileSize,
} from '../utils/formatters.js';
import AdsterraBanner from '../components/ads/AdsterraBanner.jsx';
import AdsterraPageScript from '../components/ads/AdsterraPageScript.jsx';
import { ADSTERRA_ENABLED } from '../config/adsterra.js';

const PLAY_STORE_URL =
  'https://play.google.com/store/apps/details?id=com.mastplayer.in';

export default function WatchVideo() {
  const { shareToken } = useParams();
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const [video, setVideo] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [error, setError] = useState(null);
  const [openingApp, setOpeningApp] = useState(false);
  const [converting, setConverting] = useState(false);
  const [myOgUrl, setMyOgUrl] = useState(null);

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      setLoading(true);
      setNotFound(false);
      setError(null);
      setVideo(null);
      setMyOgUrl(null);

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

    window.location.href = deepLink;

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

  const isOriginalCreator =
    user?.id && video?.originalCreatorId && String(user.id) === String(video.originalCreatorId);

  const handleOgEarn = async () => {
    if (!isAuthenticated) {
      navigate('/login', { state: { from: `/v/${shareToken}` } });
      return;
    }
    if (isOriginalCreator) {
      toast.error('You cannot convert your own video.');
      return;
    }
    setConverting(true);
    try {
      const { data } = await convertOgEarnLink(shareToken);
      setMyOgUrl(data.data.shareUrl);
      toast.success(data.message || 'Your OG Earn link is ready');
      try {
        await navigator.clipboard.writeText(data.data.shareUrl);
        toast.success('OG Earn link copied');
      } catch {
        /* ignore */
      }
    } catch (err) {
      toast.error(getFriendlyError(err, 'Could not create OG Earn link.'));
    } finally {
      setConverting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading video..." />;
  }

  if (notFound) {
    return (
      <div className="max-w-lg mx-auto text-center py-16 px-4 sm:px-6">
        <h1 className="app-title mb-4">Video Not Found</h1>
        <p className="app-muted mb-8">
          This video may have been deleted or the link may be invalid.
        </p>
        <Link to="/" className="app-btn-primary">
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
        <p className="app-muted mb-8">{error}</p>
        <Link to="/" className="app-btn-primary">
          Back to Home
        </Link>
      </div>
    );
  }

  const shareUrl = `${window.location.origin}/v/${shareToken}`;
  const royalty = video.ogEarn?.royaltyPercent ?? 10;
  const ownerShare = video.ogEarn?.ownerSharePercent ?? 90;
  const showOgEarn = video.ogEarn?.enabled !== false && !isOriginalCreator;

  return (
    <div className="max-w-3xl mx-auto space-y-6 px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      {ADSTERRA_ENABLED ? (
        <>
          <AdsterraPageScript type="socialBar" />
          <AdsterraPageScript type="popunder" />
        </>
      ) : null}

      {/* Top banner — mobile 320x50, desktop 728x90 */}
      <div className="sm:hidden">
        <AdsterraBanner unit="banner320x50" />
      </div>
      <div className="hidden sm:block">
        <AdsterraBanner unit="banner728x90" />
      </div>

      <div className="min-w-0">
        <h1 className="text-2xl sm:text-3xl font-semibold break-words">{video.title}</h1>
        <p className="text-sm app-muted mt-1 truncate">{video.originalName}</p>
        {video.ogEarn?.isRemapped ? (
          <p className="mt-2 text-xs font-semibold text-[var(--blue)]">OG Earn remapped link</p>
        ) : null}
      </div>

      <div className="relative aspect-video rounded-2xl overflow-hidden border border-[var(--border-green)] bg-[var(--surface)]">
        {video.thumbnailUrl ? (
          <img
            src={video.thumbnailUrl}
            alt=""
            className="absolute inset-0 w-full h-full object-cover"
          />
        ) : (
          <div className="absolute inset-0 bg-gradient-to-br from-[var(--surface)] to-[var(--background)]" />
        )}
        <div className="absolute inset-0 bg-black/35" />
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 px-4 text-center">
          <button
            type="button"
            onClick={openInApp}
            disabled={openingApp}
            className="inline-flex items-center justify-center gap-2 rounded-full app-btn-primary app-btn-primary-lg !rounded-full shadow-[0_0_32px_var(--glow-cyan)] disabled:opacity-70"
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

      {/* Mid banner after video */}
      <AdsterraBanner unit="banner300x250" />

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="button"
          onClick={openInApp}
          disabled={openingApp}
          className="app-btn-primary disabled:opacity-70"
        >
          <Play className="w-4 h-4 fill-white" />
          {openingApp ? 'Opening…' : 'View in App'}
        </button>
        <a href={PLAY_STORE_URL} target="_blank" rel="noreferrer" className="app-btn-secondary">
          Get Mast Player
        </a>
        <CopyLinkButton url={shareUrl} variant="secondary" />
      </div>

      {showOgEarn && (
        <div className="app-card-padded space-y-3">
          <div className="flex items-start gap-3">
            <span className="app-stat-icon shrink-0">
              <Sparkles className="w-5 h-5" />
            </span>
            <div className="min-w-0 flex-1">
              <h2 className="font-semibold">OG Earn</h2>
              <p className="text-sm app-muted mt-1">
                Convert this video into your own share link. You earn{' '}
                <strong className="text-[var(--foreground)]">{ownerShare}%</strong> from app views;
                original creator gets <strong className="text-[var(--foreground)]">{royalty}%</strong>.
              </p>
            </div>
          </div>
          {myOgUrl ? (
            <div className="flex flex-col sm:flex-row gap-3">
              <input readOnly value={myOgUrl} className="app-input flex-1 !mt-0 font-mono text-sm" />
              <CopyLinkButton url={myOgUrl} label="Copy my link" className="shrink-0" />
              <Link to="/studio/og-earn" className="app-btn-secondary shrink-0">
                Open OG Earn
              </Link>
            </div>
          ) : (
            <button
              type="button"
              onClick={handleOgEarn}
              disabled={converting}
              className="app-btn-primary"
            >
              <Sparkles className="w-4 h-4" />
              {converting
                ? 'Creating…'
                : isAuthenticated
                  ? 'Convert to my OG Earn link'
                  : 'Log in to convert & earn'}
            </button>
          )}
        </div>
      )}

      {isOriginalCreator && (
        <p className="text-sm app-muted">
          This is your upload. Share your original link, or check{' '}
          <Link to="/studio/og-earn" className="app-link">
            OG Earn royalties
          </Link>{' '}
          when others remap it.
        </p>
      )}

      <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm app-muted">
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

      {/* Bottom banner */}
      <div className="sm:hidden">
        <AdsterraBanner unit="banner320x50" />
      </div>
      <div className="hidden sm:block">
        <AdsterraBanner unit="banner300x250" />
      </div>
    </div>
  );
}
