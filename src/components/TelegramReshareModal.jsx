import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { X, Send, Loader, CheckCircle2, AlertCircle } from 'lucide-react';
import toast from 'react-hot-toast';
import {
  fetchTelegramDestinations,
  fetchTelegramPublications,
  getFriendlyError,
  reshareVideoToTelegram,
} from '../services/api.js';

function formatMembers(n) {
  if (n == null || Number.isNaN(Number(n))) return '';
  const v = Number(n);
  if (v >= 1_000_000) return `${(v / 1_000_000).toFixed(1)}M members`;
  if (v >= 1_000) return `${(v / 1_000).toFixed(1)}K members`;
  return `${v} members`;
}

export default function TelegramReshareModal({ video, onClose }) {
  const videoId = video ? video.id || video._id : null;
  const [destinations, setDestinations] = useState([]);
  const [postedIds, setPostedIds] = useState(new Set());
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(null);
  const [posting, setPosting] = useState(false);
  const [results, setResults] = useState(null);

  useEffect(() => {
    if (!videoId) return undefined;
    let cancelled = false;
    setLoading(true);
    setLoadError(null);
    setSelectedIds([]);
    setResults(null);
    (async () => {
      try {
        const [destRes, pubRes] = await Promise.all([
          fetchTelegramDestinations(),
          fetchTelegramPublications(videoId).catch(() => null),
        ]);
        if (cancelled) return;
        setDestinations((destRes.data.data || []).filter((d) => d.isActive));
        const posted = new Set(
          (pubRes?.data?.data || [])
            .filter((p) => p.status === 'published' && p.destination?.id)
            .map((p) => p.destination.id)
        );
        setPostedIds(posted);
      } catch (err) {
        if (!cancelled) setLoadError(getFriendlyError(err, 'Could not load Telegram destinations.'));
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [videoId]);

  if (!video) return null;

  const close = () => {
    if (!posting) onClose();
  };

  const toggle = (id) => {
    setSelectedIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));
  };

  const allSelected = destinations.length > 0 && selectedIds.length === destinations.length;
  const toggleAll = () => {
    setSelectedIds(allSelected ? [] : destinations.map((d) => d.id));
  };

  const handlePost = async () => {
    if (!selectedIds.length || posting) return;
    setPosting(true);
    setResults(null);
    try {
      const { data } = await reshareVideoToTelegram(videoId, selectedIds);
      const payload = data.data || {};
      setResults(payload.results || []);
      if (payload.published && !payload.failed) {
        toast.success(
          payload.published === 1 ? 'Posted to 1 Telegram chat' : `Posted to ${payload.published} Telegram chats`
        );
        onClose();
        return;
      }
      if (payload.published) {
        toast.error(`Posted to ${payload.published}, ${payload.failed} failed.`);
      } else {
        toast.error('Could not post to the selected chats.');
      }
      setPostedIds((prev) => {
        const next = new Set(prev);
        for (const r of payload.results || []) {
          if (r.status === 'published') next.add(r.telegramDestinationId);
        }
        return next;
      });
      setSelectedIds(
        (payload.results || [])
          .filter((r) => r.status !== 'published')
          .map((r) => r.telegramDestinationId)
      );
    } catch (err) {
      toast.error(getFriendlyError(err, 'Re-share failed.'));
    } finally {
      setPosting(false);
    }
  };

  const resultById = new Map((results || []).map((r) => [r.telegramDestinationId, r]));

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="reshare-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={close}
      />

      <div className="relative w-full max-w-md rounded-2xl app-card p-6 shadow-xl border-[var(--border)] flex flex-col max-h-[85dvh]">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-[var(--accent-soft)] text-[var(--primary)] flex items-center justify-center">
            <Send className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={close}
            disabled={posting}
            className="p-2 rounded-lg app-muted hover:text-[var(--foreground)] hover:bg-[var(--surface)] disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 id="reshare-modal-title" className="text-xl font-semibold mb-1">
          Re-share on Telegram
        </h2>
        <p className="text-sm font-medium truncate mb-4" title={video.title}>
          {video.title}
        </p>

        <div className="flex-1 min-h-0 overflow-y-auto -mx-1 px-1">
          {loading ? (
            <div className="flex items-center justify-center gap-2 py-10 text-sm app-muted">
              <Loader className="w-4 h-4 animate-spin" />
              Loading chats…
            </div>
          ) : loadError ? (
            <div className="app-error text-sm">{loadError}</div>
          ) : destinations.length === 0 ? (
            <div className="rounded-xl border border-dashed border-[var(--border)] px-4 py-6 text-center text-sm app-muted">
              No Telegram channels or groups connected yet.
              <div className="mt-3">
                <Link to="/studio/telegram" className="app-btn-primary" onClick={onClose}>
                  Connect Telegram
                </Link>
              </div>
            </div>
          ) : (
            <>
              <div className="flex items-center justify-between mb-2">
                <p className="text-xs app-muted">Select where to post</p>
                <button type="button" onClick={toggleAll} disabled={posting} className="app-link text-xs">
                  {allSelected ? 'Clear all' : 'Select all'}
                </button>
              </div>
              <ul className="space-y-2">
                {destinations.map((d) => {
                  const checked = selectedIds.includes(d.id);
                  const result = resultById.get(d.id);
                  const members = formatMembers(d.memberCount);
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
                          onChange={() => toggle(d.id)}
                          disabled={posting}
                          className="mt-0.5 shrink-0"
                        />
                        <span className="min-w-0 flex-1">
                          <span className="block text-sm font-medium truncate">{d.title}</span>
                          <span className="text-xs app-muted capitalize">
                            {d.type}
                            {members ? ` · ${members}` : ''}
                            {postedIds.has(d.id) ? ' · Posted before' : ''}
                          </span>
                          {d.actionRequired && d.actionHint ? (
                            <span className="mt-1 block text-xs text-amber-500">{d.actionHint}</span>
                          ) : null}
                          {result && result.status !== 'published' ? (
                            <span className="mt-1 flex items-start gap-1 text-xs text-[var(--danger)]">
                              <AlertCircle className="w-3.5 h-3.5 shrink-0 mt-px" />
                              <span className="break-words">{result.error || 'Failed to post.'}</span>
                            </span>
                          ) : null}
                          {result && result.status === 'published' ? (
                            <span className="mt-1 flex items-center gap-1 text-xs text-emerald-500">
                              <CheckCircle2 className="w-3.5 h-3.5" />
                              Posted
                            </span>
                          ) : null}
                        </span>
                      </label>
                    </li>
                  );
                })}
              </ul>
            </>
          )}
        </div>

        <div className="mt-5 flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button type="button" onClick={close} disabled={posting} className="app-btn-secondary">
            Cancel
          </button>
          {destinations.length > 0 ? (
            <button
              type="button"
              onClick={handlePost}
              disabled={posting || selectedIds.length === 0}
              className="app-btn-primary"
            >
              {posting ? (
                <>
                  <Loader className="w-4 h-4 animate-spin" />
                  Posting…
                </>
              ) : (
                <>
                  <Send className="w-4 h-4" />
                  Post{selectedIds.length ? ` (${selectedIds.length})` : ''}
                </>
              )}
            </button>
          ) : null}
        </div>
      </div>
    </div>
  );
}
