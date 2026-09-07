import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { Check, ExternalLink, ImagePlus, MessageCircle, Upload, X } from 'lucide-react';
import toast from 'react-hot-toast';
import UploadZone from '../../components/UploadZone.jsx';
import UploadProgress from '../../components/UploadProgress.jsx';
import CopyLinkButton from '../../components/CopyLinkButton.jsx';
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
    () => (file ? deriveDefaultTitle(file.name) || 'Title' : 'Title'),
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
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <h1 className="text-xl font-semibold tracking-tight">Upload</h1>
        {isUploading ? (
          <span className="text-xs font-medium text-[var(--primary)]">
            Uploading {job.progress}%
          </span>
        ) : null}
      </div>

      {isUploading && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2 space-y-2">
          <UploadProgress progress={job.progress} />
          <Link to="/studio/videos" className="app-link text-xs">
            Go to Videos →
          </Link>
        </div>
      )}

      {!showSuccessOnPage && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card,var(--surface-elevated))] p-3 sm:p-4 space-y-3">
          <UploadZone
            file={file}
            onFileSelect={onFileSelect}
            onClear={() => setFile(null)}
            disabled={isUploading}
          />

          {file ? (
            <div className="grid gap-3 lg:grid-cols-2 lg:items-start">
              <div className="space-y-3">
                <label className="block">
                  <span className="mb-1 block text-xs font-medium app-muted">Title</span>
                  <input
                    type="text"
                    value={title}
                    maxLength={120}
                    placeholder={titlePlaceholder}
                    onChange={(e) => setTitle(e.target.value)}
                    disabled={isUploading}
                    className="app-input !mt-0 !py-2 text-sm"
                  />
                </label>

                <div className="flex items-center gap-2">
                  <div className="w-24 aspect-video shrink-0 rounded-lg overflow-hidden border border-[var(--border)] bg-[var(--surface)] flex items-center justify-center">
                    {thumbnailPreview ? (
                      <img
                        src={thumbnailPreview}
                        alt=""
                        className="w-full h-full object-cover"
                      />
                    ) : (
                      <span className="text-[10px] leading-tight app-muted px-1 text-center">
                        Auto · frame 60
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1.5 min-w-0">
                    <label className="app-btn-secondary !px-2.5 !py-1.5 text-xs cursor-pointer">
                      <ImagePlus className="w-3.5 h-3.5" />
                      {thumbnailFile ? 'Change' : 'Thumbnail'}
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
                        className="app-btn-ghost !px-2 !py-1.5 text-xs"
                        aria-label="Remove thumbnail"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                  </div>
                </div>
              </div>

              <div className="space-y-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] p-2.5">
                <div className="flex items-center justify-between gap-2">
                  <span className="flex items-center gap-1.5 text-sm font-medium">
                    <MessageCircle className="w-3.5 h-3.5 text-[var(--primary)]" />
                    Telegram
                  </span>
                  <button
                    type="button"
                    role="switch"
                    aria-checked={sendToTelegram}
                    disabled={isUploading || destinations.length === 0}
                    onClick={() => setSendToTelegram((v) => !v)}
                    className={`relative h-5 w-9 shrink-0 rounded-full transition-colors disabled:opacity-50 ${
                      sendToTelegram ? 'bg-[var(--gradient-brand-h)]' : 'bg-[var(--border)]'
                    }`}
                  >
                    <span
                      className={`absolute top-0.5 left-0.5 h-4 w-4 rounded-full bg-white shadow transition-transform ${
                        sendToTelegram ? 'translate-x-4' : ''
                      }`}
                    />
                  </button>
                </div>

                {destinations.length === 0 ? (
                  <p className="text-xs app-muted">
                    None connected.{' '}
                    <Link to="/studio/telegram" className="app-link">
                      Connect
                    </Link>
                  </p>
                ) : sendToTelegram ? (
                  <ul className="grid gap-1 sm:grid-cols-2">
                    {destinations.map((d) => {
                      const checked = selectedIds.includes(d.id);
                      return (
                        <li key={d.id}>
                          <label className="flex items-center gap-2 rounded-md border border-[var(--border)] px-2 py-1.5 cursor-pointer hover:border-[var(--border-accent)]">
                            <input
                              type="checkbox"
                              checked={checked}
                              onChange={() => toggleDest(d.id)}
                              disabled={isUploading}
                              className="shrink-0"
                            />
                            <span className="min-w-0 truncate text-xs">
                              <span className="font-medium">{d.title}</span>
                              <span className="app-muted">
                                {' '}
                                · {d.type}
                                {formatMembers(d.memberCount)
                                  ? ` · ${formatMembers(d.memberCount)}`
                                  : ''}
                              </span>
                            </span>
                          </label>
                        </li>
                      );
                    })}
                  </ul>
                ) : (
                  <p className="text-xs app-muted">Off — won’t post after upload.</p>
                )}
              </div>
            </div>
          ) : null}

          {localError && <p className="app-error text-sm">{localError}</p>}
          {job.status === 'error' && job.error && (
            <p className="app-error text-sm">{job.error}</p>
          )}

          {file && !isUploading && (
            <button
              type="button"
              onClick={handleUpload}
              className="app-btn-primary w-full sm:w-auto !px-4 !py-2 text-sm"
            >
              <Upload className="w-4 h-4" />
              {sendToTelegram && selectedIds.length ? 'Upload & publish' : 'Upload'}
            </button>
          )}
        </div>
      )}

      {showSuccessOnPage && (
        <div className="rounded-xl border border-[var(--border)] bg-[var(--card,var(--surface-elevated))] p-3 sm:p-4 space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="inline-flex h-7 w-7 items-center justify-center rounded-full bg-[var(--accent-medium)] text-[var(--primary)]">
              <Check className="w-4 h-4" />
            </span>
            <p className="text-sm font-semibold">Upload complete</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2">
            <p className="min-w-0 flex-1 text-xs break-all text-[var(--primary)] font-medium">
              {job.result.shareUrl}
            </p>
            <CopyLinkButton url={job.result.shareUrl} className="!px-2.5 !py-1.5 text-xs shrink-0" />
          </div>

          {publications.length > 0 ? (
            <div className="grid gap-1 sm:grid-cols-2">
              {publications.map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between gap-2 rounded-md border border-[var(--border)] px-2 py-1.5 text-xs"
                >
                  <span className="truncate">{p.destination?.title || 'Destination'}</span>
                  <span className="shrink-0 font-medium">
                    {p.status === 'published'
                      ? 'Published'
                      : p.status === 'failed'
                        ? 'Failed'
                        : 'Publishing…'}
                  </span>
                </div>
              ))}
            </div>
          ) : job.result?.telegramPublish?.queued > 0 ? (
            <p className="text-xs app-muted">Telegram publishing…</p>
          ) : null}

          <div className="flex flex-wrap gap-2">
            <Link to={`/v/${job.result.shareToken}`} className="app-btn-secondary !px-3 !py-1.5 text-xs">
              <ExternalLink className="w-3.5 h-3.5" />
              Preview
            </Link>
            <Link to="/studio/videos" className="app-btn-primary !px-3 !py-1.5 text-xs">
              Library
            </Link>
            <button type="button" onClick={handleClearJob} className="app-link text-xs">
              Upload another
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
