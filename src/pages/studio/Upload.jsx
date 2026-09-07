import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Check,
  ExternalLink,
  ImagePlus,
  MessageCircle,
  RefreshCw,
  Upload,
  X,
} from 'lucide-react';
import toast from 'react-hot-toast';
import UploadZone from '../../components/UploadZone.jsx';
import UploadProgress from '../../components/UploadProgress.jsx';
import CopyLinkButton from '../../components/CopyLinkButton.jsx';
import { useUploadQueue } from '../../context/UploadQueueContext.jsx';
import {
  fetchTelegramDestinations,
  fetchTelegramPublications,
  getFriendlyError,
  retryTelegramPublication,
} from '../../services/api.js';

function formatMembers(n) {
  if (n == null || !Number.isFinite(Number(n))) return null;
  const v = Number(n);
  if (v >= 1000) return `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}K`;
  return String(v);
}

function deriveDefaultTitle(filename = '') {
  return String(filename)
    .replace(/\.[^/.]+$/, '')
    .replace(/[_-]+/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

export default function StudioUpload() {
  const { job, isUploading, startUpload, clearJob } = useUploadQueue();
  const [file, setFile] = useState(null);
  const [title, setTitle] = useState('');
  const [thumbnailFile, setThumbnailFile] = useState(null);
  const [thumbnailPreview, setThumbnailPreview] = useState(null);
  const [localError, setLocalError] = useState(null);
  const [destinations, setDestinations] = useState([]);
  const [sendToTelegram, setSendToTelegram] = useState(false);
  const [selectedIds, setSelectedIds] = useState([]);
  const [publications, setPublications] = useState([]);
  const [retryingId, setRetryingId] = useState(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const { data } = await fetchTelegramDestinations();
        if (cancelled) return;
        const active = (data.data || []).filter((d) => d.isActive);
        setDestinations(active);
        const autoIds = active.filter((d) => d.settings?.autoPublish).map((d) => d.id);
        if (autoIds.length) {
          setSendToTelegram(true);
          setSelectedIds(autoIds);
        }
      } catch {
        /* optional */
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  useEffect(() => {
    if (!thumbnailFile) {
      setThumbnailPreview(null);
      return undefined;
    }
    const url = URL.createObjectURL(thumbnailFile);
    setThumbnailPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [thumbnailFile]);

  useEffect(() => {
    if (job.status !== 'success' || !job.result?.id) {
      setPublications([]);
      return undefined;
    }
    let cancelled = false;
    const load = async () => {
      try {
        const { data } = await fetchTelegramPublications(job.result.id);
        if (!cancelled) setPublications(data.data || []);
      } catch {
        /* ignore */
      }
    };
    load();
    const id = setInterval(load, 2500);
    return () => {
      cancelled = true;
      clearInterval(id);
    };
  }, [job.status, job.result?.id]);

  const handleRetryTelegram = async (publicationId) => {
    if (!publicationId || retryingId) return;
    setRetryingId(publicationId);
    setPublications((prev) =>
      prev.map((p) =>
        p.id === publicationId ? { ...p, status: 'publishing', error: null } : p
      )
    );
    try {
      const { data } = await retryTelegramPublication(publicationId);
      const next = data.data;
      setPublications((prev) =>
        prev.map((p) =>
          p.id === publicationId
            ? {
                ...p,
                status: next.status,
                error: next.error || null,
                publishedAt: next.publishedAt || p.publishedAt,
              }
            : p
        )
      );
      if (next.status === 'published') {
        toast.success('Telegram publish succeeded');
      } else {
        toast.error(next.error || 'Telegram publish failed again');
      }
    } catch (err) {
      toast.error(getFriendlyError(err, 'Retry failed'));
      try {
        if (job.result?.id) {
          const { data } = await fetchTelegramPublications(job.result.id);
          setPublications(data.data || []);
        }
      } catch {
        /* ignore */
      }
    } finally {
      setRetryingId(null);
    }
  };

  const titlePlaceholder = useMemo(
    () => (file ? deriveDefaultTitle(file.name) || 'Video title' : 'Video title'),
    [file]
  );

  const onFileSelect = (next) => {
    setFile(next);
    setLocalError(null);
    if (next && !title.trim()) {
      setTitle(deriveDefaultTitle(next.name));
    }
  };

  const onThumbnailSelect = (e) => {
    const img = e.target.files?.[0];
    e.target.value = '';
    if (!img) return;
    if (!img.type.startsWith('image/')) {
      toast.error('Please choose an image file for thumbnail.');
      return;
    }
    if (img.size > 8 * 1024 * 1024) {
      toast.error('Thumbnail must be under 8 MB.');
      return;
    }
    setThumbnailFile(img);
  };

  const toggleDest = (id) => {
    setSelectedIds((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleUpload = async () => {
    if (!file || isUploading) return;
    setLocalError(null);

    const telegramDestinationIds = sendToTelegram ? selectedIds : [];
    if (sendToTelegram && destinations.length > 0 && telegramDestinationIds.length === 0) {
      setLocalError('Select at least one Telegram destination, or turn off Telegram.');
      return;
    }

    const outcome = await startUpload(file, {
      title: title.trim(),
      thumbnailFile,
      telegramDestinationIds,
    });
    if (!outcome.started) {
      setLocalError(outcome.reason || 'Could not start upload.');
      toast.error(outcome.reason || 'Could not start upload.');
      return;
    }
    setFile(null);
    setTitle('');
    setThumbnailFile(null);
  };

  const handleClearJob = () => {
    clearJob();
    setFile(null);
    setTitle('');
    setThumbnailFile(null);
    setLocalError(null);
  };

  const showSuccessOnPage = job.status === 'success' && job.result;

  return (
    <div className="w-full max-w-5xl space-y-5">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="app-kicker mb-1">Creator Studio</p>
          <h1 className="app-title text-2xl sm:text-3xl">Upload video</h1>
        </div>
        {isUploading ? (
          <span className="rounded-full border border-[var(--border-accent)] bg-[var(--accent-soft)] px-3 py-1 text-xs font-semibold text-[var(--primary)]">
            Uploading {job.progress}%
          </span>
        ) : null}
      </div>

      {isUploading && (
        <div className="app-card p-4 space-y-3">
          <p className="text-sm font-medium text-[var(--foreground)]">
            Upload running in the background
          </p>
          <UploadProgress progress={job.progress} />
          <Link to="/studio/videos" className="app-link text-sm inline-flex">
            Continue in Videos →
          </Link>
        </div>
      )}

      {!showSuccessOnPage && (
        <div className="space-y-4">
          <section className="app-card p-4 sm:p-5">
            <UploadZone
              file={file}
              onFileSelect={onFileSelect}
              onClear={() => setFile(null)}
              disabled={isUploading}
            />
          </section>

          {file ? (
            <section className="grid gap-4 lg:grid-cols-5">
              <div className="app-card p-4 sm:p-5 space-y-4 lg:col-span-3">
                <div>
                  <h2 className="text-sm font-semibold text-[var(--foreground)]">Details</h2>
                  <p className="text-xs app-muted mt-0.5">
                    Title is shown on watch pages and Telegram. Thumbnail is optional.
                  </p>
                </div>

                <label className="block">
                  <span className="app-label">Title</span>
                  <input
                    type="text"
                    value={title}
                    maxLength={120}
                    placeholder={titlePlaceholder}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isUploading}
                    className="app-input"
                  />
                  <span className="mt-1 block text-xs app-muted text-right">
                    {title.length}/120
                  </span>
                </label>

                <div>
                  <p className="app-label mb-2">Thumbnail</p>
                  <div className="flex flex-wrap items-center gap-4">
                    <div className="w-36 sm:w-40 aspect-video rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center shrink-0">
                      {thumbnailPreview ? (
                        <img
                          src={thumbnailPreview}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <span className="text-xs app-muted px-3 text-center leading-snug">
                          Auto from ~frame 60
                        </span>
                      )}
                    </div>
                    <div className="space-y-2 min-w-0">
                      <label className="app-btn-secondary cursor-pointer inline-flex">
                        <ImagePlus className="w-4 h-4" />
                        {thumbnailFile ? 'Change image' : 'Upload image'}
                        <input
                          type="file"
                          accept="image/*"
                          className="hidden"
                          disabled={isUploading}
                          onChange={onThumbnailSelect}
                        />
                      </label>
                      {thumbnailFile ? (
                        <button
                          type="button"
                          disabled={isUploading}
                          onClick={() => setThumbnailFile(null)}
                          className="flex items-center gap-1.5 text-sm app-link"
                        >
                          <X className="w-3.5 h-3.5" />
                          Use auto thumbnail
                        </button>
                      ) : (
                        <p className="text-xs app-muted max-w-[14rem]">
                          Skip to auto-capture a frame from the video.
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              <div className="app-card p-4 sm:p-5 space-y-3 lg:col-span-2 flex flex-col">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <h2 className="text-sm font-semibold flex items-center gap-2">
                      <MessageCircle className="w-4 h-4 text-[var(--primary)]" />
                      Telegram
                    </h2>
                    <p className="text-xs app-muted mt-0.5">Publish after upload</p>
                  </div>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={sendToTelegram}
                    disabled={isUploading || destinations.length === 0}
                    onClick={() => setSendToTelegram((v) => !v)}
                    className={`relative h-6 w-11 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
                      sendToTelegram ? 'bg-[var(--gradient-brand-h)]' : 'bg-[var(--border)]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                        sendToTelegram ? 'translate-x-5' : ''
                      }`}
                    />
                  </button>
                </div>

                <div className="flex-1 min-h-0">
                  {destinations.length === 0 ? (
                    <div className="rounded-xl border border-dashed border-[var(--border)] px-3 py-4 text-sm app-muted">
                      No destinations yet.{' '}
                      <Link to="/studio/telegram" className="app-link">
                        Connect Telegram
                      </Link>
                    </div>
                  ) : sendToTelegram ? (
                    <ul className="space-y-2 max-h-52 overflow-y-auto pr-0.5">
                      {destinations.map((d) => {
                        const checked = selectedIds.includes(d.id);
                        return (
                          <li key={d.id}>
                            <label
                              className={[
                                'flex items-start gap-3 rounded-xl border px-3 py-2.5 cursor-pointer transition-colors',
                                checked
                                  ? 'border-[var(--border-accent)] bg-[var(--accent-soft)]'
                                  : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-accent)]',
                              ].join(' ')}
                            >
                              <input
                                type="checkbox"
                                checked={checked}
                                onChange={() => toggleDest(d.id)}
                                disabled={isUploading}
                                className="mt-0.5 shrink-0"
                              />
                              <span className="min-w-0">
                                <span className="block text-sm font-medium truncate">
                                  {d.title}
                                </span>
                                <span className="text-xs app-muted capitalize">
                                  {d.type}
                                  {formatMembers(d.memberCount)
                                    ? ` · ${formatMembers(d.memberCount)}`
                                    : ''}
                                  {d.settings?.autoPublish ? ' · Auto' : ''}
                                </span>
                              </span>
                            </label>
                          </li>
                        );
                      })}
                    </ul>
                  ) : (
                    <p className="text-sm app-muted rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3">
                      Turn on to post this video to your groups or channels.
                    </p>
                  )}
                </div>
              </div>
            </section>
          ) : null}

          {localError && <p className="app-error">{localError}</p>}
          {job.status === 'error' && job.error && <p className="app-error">{job.error}</p>}

          {file && !isUploading && (
            <div className="sticky bottom-3 z-10">
              <div className="app-card flex flex-wrap items-center justify-between gap-3 px-4 py-3 shadow-lg border-[var(--border-accent)]">
                <p className="text-sm app-muted min-w-0 truncate">
                  Ready ·{' '}
                  <span className="text-[var(--foreground)] font-medium">
                    {title.trim() || titlePlaceholder}
                  </span>
                  {sendToTelegram && selectedIds.length
                    ? ` · ${selectedIds.length} Telegram`
                    : ''}
                </p>
                <button
                  type="button"
                  onClick={handleUpload}
                  className="app-btn-primary shrink-0"
                >
                  <Upload className="w-4 h-4" />
                  {sendToTelegram && selectedIds.length ? 'Upload & publish' : 'Start upload'}
                </button>
              </div>
            </div>
          )}
        </div>
      )}

      {showSuccessOnPage && (
        <section className="app-card p-5 sm:p-6 space-y-5">
          <div className="flex items-start gap-3">
            <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--accent-medium)] text-[var(--primary)] shrink-0">
              <Check className="w-5 h-5" />
            </span>
            <div>
              <h2 className="text-lg font-semibold">Upload complete</h2>
              <p className="text-sm app-muted mt-0.5">
                Share the link — viewers watch in the app.
              </p>
            </div>
          </div>

          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 flex flex-col sm:flex-row sm:items-center gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[11px] font-semibold uppercase tracking-wide app-muted mb-1">
                Share link
              </p>
              <p className="text-sm break-all font-medium text-[var(--primary)]">
                {job.result.shareUrl}
              </p>
            </div>
            <CopyLinkButton url={job.result.shareUrl} className="shrink-0" />
          </div>

          {publications.length > 0 ? (
            <div className="space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide app-muted">
                Telegram
              </p>
              <ul className="space-y-2">
                {publications.map((p) => (
                  <li
                    key={p.id}
                    className="rounded-xl border border-[var(--border)] px-3 py-2.5 text-sm space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="truncate font-medium">
                        {p.destination?.title || 'Destination'}
                      </span>
                      <div className="flex items-center gap-2 shrink-0">
                        <span
                          className={
                            p.status === 'published'
                              ? 'text-[var(--primary)] font-medium'
                              : p.status === 'failed'
                                ? 'text-[var(--danger,#ef4444)] font-medium'
                                : 'app-muted'
                          }
                        >
                          {p.status === 'published'
                            ? 'Published'
                            : p.status === 'failed'
                              ? 'Failed'
                              : 'Publishing…'}
                        </span>
                        {p.status === 'failed' ? (
                          <button
                            type="button"
                            disabled={retryingId === p.id}
                            onClick={() => handleRetryTelegram(p.id)}
                            className="app-btn-secondary !px-2.5 !py-1 text-xs"
                          >
                            <RefreshCw
                              className={`w-3.5 h-3.5 ${retryingId === p.id ? 'animate-spin' : ''}`}
                            />
                            {retryingId === p.id ? 'Retrying…' : 'Retry'}
                          </button>
                        ) : null}
                      </div>
                    </div>
                    {p.status === 'failed' && p.error ? (
                      <p className="text-xs text-[var(--danger,#ef4444)] break-words">
                        {p.error}
                      </p>
                    ) : null}
                  </li>
                ))}
              </ul>
            </div>
          ) : job.result?.telegramPublish?.queued > 0 ? (
            <p className="text-sm app-muted">Telegram publishing…</p>
          ) : null}

          <div className="flex flex-wrap gap-2 pt-1">
            <Link to={`/v/${job.result.shareToken}`} className="app-btn-secondary">
              <ExternalLink className="w-4 h-4" />
              Preview
            </Link>
            <Link to="/studio/videos" className="app-btn-primary">
              Open library
            </Link>
            <button type="button" onClick={handleClearJob} className="app-btn-ghost">
              Upload another
            </button>
          </div>
        </section>
      )}
    </div>
  );
}
