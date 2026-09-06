import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ExternalLink, ImagePlus, MessageCircle, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import UploadZone from '../../components/UploadZone.jsx';
import UploadProgress from '../../components/UploadProgress.jsx';
import CopyLinkButton from '../../components/CopyLinkButton.jsx';
import { useAuth } from '../../context/AuthContext.jsx';
import { useUploadQueue } from '../../context/UploadQueueContext.jsx';
import {
  fetchTelegramDestinations,
  fetchTelegramPublications,
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
  const { user } = useAuth();
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

  const titlePlaceholder = useMemo(
    () => (file ? deriveDefaultTitle(file.name) || 'Video title' : 'Video title (optional)'),
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
      setLocalError('Select at least one Telegram group/channel, or turn off Send to Telegram.');
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
    <div className="max-w-2xl space-y-6">
      <div>
        <h1 className="app-title">Upload</h1>
        <p className="app-subtitle mt-2">
          Hi{user?.name ? `, ${user.name}` : ''} — add optional title/thumbnail, pick Telegram
          destinations, then upload.
        </p>
      </div>

      {isUploading && (
        <div className="app-success-banner space-y-3">
          <p className="text-sm font-semibold text-[var(--primary)]">
            Uploading in background — {job.progress}%
          </p>
          <UploadProgress progress={job.progress} />
          <Link to="/studio/videos" className="app-link text-sm">
            Go to Videos →
          </Link>
        </div>
      )}

      {!showSuccessOnPage && (
        <div className="app-card-padded space-y-5">
          <UploadZone
            file={file}
            onFileSelect={onFileSelect}
            onClear={() => setFile(null)}
            disabled={isUploading}
          />

          {file ? (
            <div className="space-y-4 border-t border-[var(--border)] pt-5">
              <label className="app-label">
                Title <span className="font-normal app-muted">(optional)</span>
                <input
                  type="text"
                  value={title}
                  maxLength={120}
                  placeholder={titlePlaceholder}
                  onChange={(e) => setTitle(e.target.value)}
                  disabled={isUploading}
                  className="app-input"
                />
              </label>
              <p className="text-xs app-muted -mt-2">
                Leave empty to use the filename as title.
              </p>

              <div>
                <p className="app-label mb-2">
                  Thumbnail <span className="font-normal app-muted">(optional)</span>
                </p>
                <div className="flex flex-wrap items-start gap-3">
                  <div className="w-40 aspect-video rounded-xl overflow-hidden border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center">
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-xs app-muted px-2 text-center">
                        Auto from video if empty
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label className="app-btn-secondary cursor-pointer">
                      <ImagePlus className="w-4 h-4" />
                      {thumbnailFile ? 'Change image' : 'Upload thumbnail'}
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
                        className="app-btn-ghost text-sm justify-start"
                      >
                        <X className="w-4 h-4" />
                        Remove custom thumbnail
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          ) : null}

          <div className="space-y-3 border-t border-[var(--border)] pt-5">
            <label className="flex items-center justify-between gap-3 cursor-pointer">
              <span className="flex items-center gap-2 font-semibold">
                <MessageCircle className="w-4 h-4 text-[var(--primary)]" />
                Send to Telegram
              </span>
              <button
                type="button"
                role="switch"
                aria-checked={sendToTelegram}
                disabled={isUploading || destinations.length === 0}
                onClick={() => setSendToTelegram((v) => !v)}
                className={`relative h-7 w-12 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
                  sendToTelegram ? 'bg-[var(--gradient-brand-h)]' : 'bg-[var(--border)]'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                    sendToTelegram ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </label>

            {destinations.length === 0 ? (
              <p className="text-sm app-muted">
                No Telegram destinations connected.{' '}
                <Link to="/studio/telegram" className="app-link">
                  Connect Telegram
                </Link>
              </p>
            ) : sendToTelegram ? (
              <ul className="space-y-2">
                {destinations.map((d) => {
                  const checked = selectedIds.includes(d.id);
                  return (
                    <li key={d.id}>
                      <label className="flex items-start gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-3 cursor-pointer hover:border-[var(--border-accent)]">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleDest(d.id)}
                          disabled={isUploading}
                          className="mt-1"
                        />
                        <span className="min-w-0">
                          <span className="font-medium block">{d.title}</span>
                          <span className="text-xs app-muted capitalize">
                            {d.type}
                            {formatMembers(d.memberCount)
                              ? ` · ${formatMembers(d.memberCount)} members`
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
              <p className="text-sm app-muted">Turn on to post this video to groups/channels after upload.</p>
            )}
          </div>

          {localError && <p className="app-error">{localError}</p>}
          {job.status === 'error' && job.error && <p className="app-error">{job.error}</p>}

          {file && !isUploading && (
            <button
              type="button"
              onClick={handleUpload}
              className="app-btn-primary app-btn-primary-lg w-full"
            >
              <Upload className="w-5 h-5" />
              {sendToTelegram && selectedIds.length
                ? 'Upload & publish to Telegram'
                : 'Start background upload'}
            </button>
          )}
        </div>
      )}

      {showSuccessOnPage && (
        <div className="app-card-padded text-center space-y-6">
          <div className="mx-auto w-14 h-14 rounded-full bg-[var(--accent-medium)] text-[var(--primary)] flex items-center justify-center">
            <Check className="w-7 h-7" />
          </div>
          <div>
            <h2 className="text-2xl font-semibold mb-2">Upload complete</h2>
            <p className="app-muted">Share the link — playback and views happen in the app.</p>
          </div>
          <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 text-left">
            <p className="text-xs font-medium uppercase tracking-wide app-muted mb-1">Share link</p>
            <p className="text-sm break-all font-medium text-[var(--primary)]">
              {job.result.shareUrl}
            </p>
          </div>

          {publications.length > 0 ? (
            <div className="text-left rounded-xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3 space-y-2">
              <p className="text-xs font-semibold uppercase tracking-wide app-muted">
                Telegram publishing
              </p>
              {publications.map((p) => (
                <div key={p.id} className="flex items-center justify-between gap-2 text-sm">
                  <span className="truncate">{p.destination?.title || 'Destination'}</span>
                  <span className="shrink-0 font-medium">
                    {p.status === 'published'
                      ? '✅ Published'
                      : p.status === 'failed'
                        ? '❌ Failed'
                        : '⏳ Publishing'}
                  </span>
                </div>
              ))}
            </div>
          ) : job.result?.telegramPublish?.queued > 0 ? (
            <p className="text-sm app-muted">Telegram publishing started…</p>
          ) : null}

          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <CopyLinkButton url={job.result.shareUrl} className="w-full sm:w-auto" />
            <Link to={`/v/${job.result.shareToken}`} className="app-btn-secondary w-full sm:w-auto">
              <ExternalLink className="w-4 h-4" />
              Open preview
            </Link>
            <Link to="/studio/videos" className="app-btn-primary w-full sm:w-auto">
              Library
            </Link>
          </div>
          <button type="button" onClick={handleClearJob} className="app-link text-sm">
            Upload another
          </button>
        </div>
      )}
    </div>
  );
}
