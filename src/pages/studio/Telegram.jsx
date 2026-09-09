import { useCallback, useEffect, useMemo, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Check,
  Copy,
  Loader2,
  MessageCircle,
  RefreshCw,
  Settings2,
  Trash2,
  X,
} from 'lucide-react';
import {
  createTelegramConnectCode,
  disconnectTelegramDestination,
  fetchTelegramDestinations,
  getFriendlyError,
  updateTelegramDestinationSettings,
} from '../../services/api.js';

const SETTING_FIELDS = [
  { key: 'autoPublish', label: 'Auto publish new videos' },
  { key: 'deleteLinks', label: 'Delete links in group' },
  { key: 'searchEnabled', label: 'Movie / video search' },
  { key: 'adminBypass', label: 'Allow admin links' },
  { key: 'includeThumbnail', label: 'Include thumbnail' },
];

function formatMembers(n) {
  if (n == null || !Number.isFinite(Number(n))) return null;
  const v = Number(n);
  if (v >= 1000) return `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}K`;
  return String(v);
}

export default function StudioTelegram() {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [connectOpen, setConnectOpen] = useState(false);
  const [codeData, setCodeData] = useState(null);
  const [codeLoading, setCodeLoading] = useState(false);
  const [manageId, setManageId] = useState(null);
  const [savingId, setSavingId] = useState(null);
  const [disconnectId, setDisconnectId] = useState(null);

  const load = useCallback(async () => {
    try {
      const { data } = await fetchTelegramDestinations();
      setDestinations(data.data || []);
    } catch (err) {
      toast.error(getFriendlyError(err, 'Could not load Telegram destinations.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const activeDestinations = useMemo(
    () => destinations.filter((d) => d.isActive),
    [destinations]
  );

  const openConnect = async () => {
    setConnectOpen(true);
    setCodeLoading(true);
    setCodeData(null);
    try {
      const { data } = await createTelegramConnectCode();
      setCodeData(data.data);
    } catch (err) {
      toast.error(getFriendlyError(err, 'Could not create connection code.'));
      setConnectOpen(false);
    } finally {
      setCodeLoading(false);
    }
  };

  useEffect(() => {
    if (!connectOpen || !codeData) return undefined;
    const before = new Set(activeDestinations.map((d) => d.id));
    const id = setInterval(async () => {
      try {
        const { data } = await fetchTelegramDestinations();
        const list = data.data || [];
        setDestinations(list);
        const newly = list.find((d) => d.isActive && !before.has(d.id));
        if (newly) {
          toast.success(`Connected: ${newly.title}`);
          setConnectOpen(false);
          setCodeData(null);
        }
      } catch {
        /* ignore poll errors */
      }
    }, 4000);
    return () => clearInterval(id);
  }, [connectOpen, codeData, activeDestinations]);

  const copyCode = async () => {
    if (!codeData?.code) return;
    try {
      await navigator.clipboard.writeText(`/connect ${codeData.code}`);
      toast.success('Command copied');
    } catch {
      toast.error('Could not copy');
    }
  };

  const saveSettings = async (dest, settings) => {
    setSavingId(dest.id);
    try {
      const { data } = await updateTelegramDestinationSettings(dest.id, settings);
      setDestinations((prev) => prev.map((d) => (d.id === dest.id ? data.data : d)));
      toast.success('Settings saved');
      setManageId(null);
    } catch (err) {
      toast.error(getFriendlyError(err, 'Could not save settings.'));
    } finally {
      setSavingId(null);
    }
  };

  const confirmDisconnect = async () => {
    if (!disconnectId) return;
    try {
      const { data } = await disconnectTelegramDestination(disconnectId);
      setDestinations((prev) => prev.map((d) => (d.id === disconnectId ? data.data : d)));
      toast.success('Disconnected');
    } catch (err) {
      toast.error(getFriendlyError(err, 'Could not disconnect.'));
    } finally {
      setDisconnectId(null);
    }
  };

  const managing = destinations.find((d) => d.id === manageId);

  return (
    <div className="w-full space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <h1 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold tracking-tight">
            Telegram
          </h1>
          <p className="text-xs sm:text-sm app-muted">
            Connect groups/channels · publish title + watch link
          </p>
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <button
            type="button"
            onClick={load}
            className="app-btn-ghost !py-1.5 !px-2.5 !text-xs"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          <button
            type="button"
            onClick={openConnect}
            className="app-btn-primary !py-1.5 !px-3 !text-xs"
          >
            <MessageCircle className="w-3.5 h-3.5" />
            Connect
          </button>
        </div>
      </div>

      {loading ? (
        <p className="app-muted flex items-center gap-2 text-sm">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading destinations…
        </p>
      ) : destinations.length === 0 ? (
        <div className="app-card p-4 sm:p-5 text-center space-y-2">
          <p className="text-sm font-semibold">No destinations yet</p>
          <p className="text-xs app-muted max-w-md mx-auto">
            Generate a code, add the bot to your group/channel, then send{' '}
            <code className="text-[var(--primary)]">/connect CODE</code>.
          </p>
          <button
            type="button"
            onClick={openConnect}
            className="app-btn-secondary !py-1.5 !px-3 !text-xs"
          >
            Connect Telegram
          </button>
        </div>
      ) : (
        <div className="grid gap-2 sm:grid-cols-2 xl:grid-cols-3">
          {destinations.map((d) => (
            <article key={d.id} className="app-card p-3 space-y-2.5 flex flex-col">
              <div className="flex items-start justify-between gap-2">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-1.5">
                    <h2 className="text-sm font-semibold truncate">{d.title}</h2>
                    <span className="app-badge !text-[10px] capitalize">{d.type}</span>
                    {d.isActive ? (
                      <span className="app-badge app-badge-green !text-[10px]">Live</span>
                    ) : (
                      <span className="app-badge !text-[10px]">Off</span>
                    )}
                  </div>
                  <p className="text-[11px] app-muted mt-0.5 leading-snug">
                    {d.botStatus}
                    {formatMembers(d.memberCount) ? ` · ${formatMembers(d.memberCount)}` : ''}
                    {d.actionHint ? ` · ⚠ ${d.actionHint}` : ''}
                  </p>
                </div>
              </div>

              {d.isActive ? (
                <div className="flex flex-wrap gap-1">
                  {d.settings.autoPublish ? (
                    <span className="app-badge app-badge-green !text-[10px]">Auto</span>
                  ) : null}
                  {d.settings.deleteLinks ? (
                    <span className="app-badge !text-[10px]">Delete links</span>
                  ) : null}
                  {d.settings.searchEnabled ? (
                    <span className="app-badge !text-[10px]">Search</span>
                  ) : null}
                  {d.settings.includeThumbnail ? (
                    <span className="app-badge !text-[10px]">Thumb</span>
                  ) : null}
                </div>
              ) : (
                <p className="text-[11px] app-muted">
                  Disconnected. Reconnect to publish again.
                </p>
              )}

              <div className="mt-auto flex flex-wrap gap-1.5 pt-1">
                {d.isActive ? (
                  <>
                    <button
                      type="button"
                      onClick={() => setManageId(d.id)}
                      className="app-btn-secondary !py-1 !px-2 !text-xs"
                    >
                      <Settings2 className="w-3.5 h-3.5" />
                      Manage
                    </button>
                    <button
                      type="button"
                      onClick={() => setDisconnectId(d.id)}
                      className="app-btn-ghost !py-1 !px-2 !text-xs text-[var(--danger)]"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                      Disconnect
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={openConnect}
                    className="app-btn-secondary !py-1 !px-2 !text-xs"
                  >
                    Reconnect
                  </button>
                )}
              </div>
            </article>
          ))}
        </div>
      )}

      {connectOpen ? (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-3">
          <div className="app-card w-full max-w-md p-4 space-y-3 relative">
            <button
              type="button"
              onClick={() => {
                setConnectOpen(false);
                setCodeData(null);
              }}
              className="absolute right-2 top-2 rounded-md p-1.5 app-muted hover:text-[var(--foreground)]"
              aria-label="Close"
            >
              <X className="w-4 h-4" />
            </button>
            <h2 className="text-base font-semibold pr-8">Connect Telegram</h2>
            {codeLoading || !codeData ? (
              <p className="app-muted flex items-center gap-2 text-sm">
                <Loader2 className="w-4 h-4 animate-spin" /> Generating code…
              </p>
            ) : (
              <>
                <div className="rounded-lg border border-[var(--border-accent)] bg-[var(--accent-soft)] px-3 py-2.5">
                  <p className="text-[10px] font-semibold uppercase tracking-wide app-muted">
                    Connection code
                  </p>
                  <p className="mt-0.5 font-mono text-xl font-bold tracking-wider text-[var(--primary)]">
                    {codeData.code}
                  </p>
                  <p className="text-[11px] app-muted">
                    Expires in {codeData.expiresInMinutes || 10} min
                  </p>
                </div>
                <ol className="text-xs space-y-1.5 app-muted list-decimal pl-4 leading-relaxed">
                  <li>
                    Add{' '}
                    <strong className="text-[var(--foreground)]">
                      @{codeData.botUsername || 'your bot'}
                    </strong>{' '}
                    to your group or channel
                  </li>
                  <li>Make the bot admin (delete msgs / post msgs)</li>
                  <li>
                    Send:
                    <code className="block mt-1 rounded-md bg-[var(--surface)] border border-[var(--border)] px-2.5 py-1.5 text-[var(--foreground)] text-xs">
                      /connect {codeData.code}
                    </code>
                  </li>
                  <li>Return here — refreshes automatically</li>
                </ol>
                <div className="flex flex-wrap items-center gap-2">
                  <button
                    type="button"
                    onClick={copyCode}
                    className="app-btn-primary !py-1.5 !px-3 !text-xs"
                  >
                    <Copy className="w-3.5 h-3.5" />
                    Copy command
                  </button>
                  <p className="text-[11px] app-muted flex items-center gap-1.5">
                    <Loader2 className="w-3 h-3 animate-spin" />
                    Waiting…
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {managing ? (
        <ManageModal
          destination={managing}
          saving={savingId === managing.id}
          onClose={() => setManageId(null)}
          onSave={(settings) => saveSettings(managing, settings)}
        />
      ) : null}

      {disconnectId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-3">
          <div className="app-card w-full max-w-sm p-4 space-y-3">
            <h2 className="text-base font-semibold">Disconnect destination?</h2>
            <p className="text-xs app-muted">
              Publishing stops here. Publication history is kept.
            </p>
            <div className="flex gap-2 justify-end">
              <button
                type="button"
                onClick={() => setDisconnectId(null)}
                className="app-btn-secondary !py-1.5 !px-3 !text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDisconnect}
                className="app-btn-primary !py-1.5 !px-3 !text-xs"
              >
                Disconnect
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}

function ManageModal({ destination, saving, onClose, onSave }) {
  const [settings, setSettings] = useState({
    ...destination.settings,
    messageFormat: {
      beforeTitle: '',
      afterTitle: '',
      afterLink: '',
      footer: '',
      ...(destination.settings?.messageFormat || {}),
    },
  });

  const mf = settings.messageFormat || {};
  const previewParts = [
    mf.beforeTitle?.trim(),
    '🎬 Your Video Title',
    mf.afterTitle?.trim(),
    'https://mastplayer.in/v/XXXX',
    mf.afterLink?.trim(),
    mf.footer?.trim(),
  ].filter(Boolean);

  const setSlot = (key, value) => {
    setSettings((s) => ({
      ...s,
      messageFormat: { ...s.messageFormat, [key]: value },
    }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-3">
      <div className="app-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-4 space-y-3">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <h2 className="text-base font-semibold truncate">{destination.title}</h2>
            <p className="text-[11px] app-muted capitalize">{destination.type} settings</p>
          </div>
          <button type="button" onClick={onClose} className="p-1.5 app-muted">
            <X className="w-4 h-4" />
          </button>
        </div>

        <ul className="space-y-2">
          {SETTING_FIELDS.map((f) => (
            <li key={f.key} className="flex items-center justify-between gap-3">
              <span className="text-xs sm:text-sm">{f.label}</span>
              <button
                type="button"
                role="switch"
                aria-checked={Boolean(settings[f.key])}
                onClick={() => setSettings((s) => ({ ...s, [f.key]: !s[f.key] }))}
                className={`relative h-6 w-10 rounded-full transition-colors ${
                  settings[f.key] ? 'bg-[var(--gradient-brand-h)]' : 'bg-[var(--border)]'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow transition-transform ${
                    settings[f.key] ? 'translate-x-4' : ''
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="border-t border-[var(--border)] pt-3 space-y-2">
          <div>
            <h3 className="text-xs font-semibold">Message format</h3>
            <p className="text-[11px] app-muted">
              Optional text around title + link. Empty slots are skipped.
            </p>
          </div>

          <div className="grid gap-2 sm:grid-cols-2">
            {[
              { key: 'beforeTitle', label: 'Before title', placeholder: 'e.g. 🔥 New upload' },
              { key: 'afterTitle', label: 'After title', placeholder: 'e.g. Full HD' },
              { key: 'afterLink', label: 'After link', placeholder: 'e.g. Backup link' },
              { key: 'footer', label: 'Footer', placeholder: 'e.g. Join @Channel' },
            ].map((slot) => (
              <label key={slot.key} className="block">
                <span className="mb-0.5 block text-[10px] font-medium app-muted">
                  {slot.label}
                </span>
                <textarea
                  rows={2}
                  maxLength={400}
                  value={mf[slot.key] || ''}
                  onChange={(e) => setSlot(slot.key, e.target.value)}
                  placeholder={slot.placeholder}
                  className="app-input !mt-0 !py-1.5 !px-2.5 text-xs min-h-[2.25rem] resize-y"
                />
              </label>
            ))}
          </div>

          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-2.5 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide app-muted mb-1">
              Preview
            </p>
            <pre className="whitespace-pre-wrap break-words text-[11px] leading-relaxed font-sans">
              {previewParts.join('\n\n') || '🎬 Your Video Title\n\nhttps://mastplayer.in/v/XXXX'}
            </pre>
          </div>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(settings)}
          className="app-btn-primary w-full !py-2 !text-sm"
        >
          {saving ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" /> Saving…
            </>
          ) : (
            <>
              <Check className="w-4 h-4" /> Save settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}
