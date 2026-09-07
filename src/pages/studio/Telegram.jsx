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
  if (v >= 1000) return `${(v / 1000).toFixed(v >= 10000 ? 0 : 1)}K members`;
  return `${v} members`;
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

  // Poll while connect modal open
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
    <div className="max-w-3xl space-y-6">
      <div className="flex flex-wrap items-start justify-between gap-4">
        <div>
          <h1 className="app-title">Telegram</h1>
          <p className="app-subtitle mt-2">
            Connect groups and channels to publish videos as title + watch link (with optional
            thumbnail).
          </p>
        </div>
        <button type="button" onClick={openConnect} className="app-btn-primary shrink-0">
          <MessageCircle className="w-4 h-4" />
          Connect Telegram
        </button>
      </div>

      {loading ? (
        <p className="app-muted flex items-center gap-2">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading destinations…
        </p>
      ) : destinations.length === 0 ? (
        <div className="app-card-padded text-center space-y-3">
          <p className="font-semibold">No Telegram destinations yet</p>
          <p className="text-sm app-muted">
            Generate a connection code, add the bot to your group/channel, then send{' '}
            <code className="text-[var(--primary)]">/connect CODE</code>.
          </p>
          <button type="button" onClick={openConnect} className="app-btn-secondary">
            Connect Telegram
          </button>
        </div>
      ) : (
        <ul className="space-y-3">
          {destinations.map((d) => (
            <li key={d.id} className="app-card-padded space-y-3">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div className="min-w-0">
                  <div className="flex flex-wrap items-center gap-2">
                    <h2 className="font-semibold truncate">{d.title}</h2>
                    <span className="app-badge capitalize">{d.type}</span>
                    {d.isActive ? (
                      <span className="app-badge app-badge-green">Connected</span>
                    ) : (
                      <span className="app-badge">Disconnected</span>
                    )}
                  </div>
                  <p className="text-sm app-muted mt-1">
                    Bot: {d.botStatus}
                    {formatMembers(d.memberCount) ? ` · ${formatMembers(d.memberCount)}` : ''}
                    {d.actionHint ? ` · ⚠ ${d.actionHint}` : ''}
                  </p>
                </div>
                <div className="flex gap-2">
                  {d.isActive ? (
                    <>
                      <button
                        type="button"
                        onClick={() => setManageId(d.id)}
                        className="app-btn-secondary"
                      >
                        <Settings2 className="w-4 h-4" />
                        Manage
                      </button>
                      <button
                        type="button"
                        onClick={() => setDisconnectId(d.id)}
                        className="app-btn-ghost text-[var(--danger)]"
                      >
                        <Trash2 className="w-4 h-4" />
                        Disconnect
                      </button>
                    </>
                  ) : (
                    <button type="button" onClick={openConnect} className="app-btn-secondary">
                      Reconnect
                    </button>
                  )}
                </div>
              </div>
              {d.isActive ? (
                <div className="flex flex-wrap gap-2 text-xs">
                  {d.settings.autoPublish ? (
                    <span className="app-badge app-badge-green">Auto publish</span>
                  ) : null}
                  {d.settings.deleteLinks ? <span className="app-badge">Delete links</span> : null}
                  {d.settings.searchEnabled ? <span className="app-badge">Search</span> : null}
                </div>
              ) : (
                <p className="text-sm app-muted">
                  Bot was removed or destination disconnected. Use Connect to link again.
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      <button type="button" onClick={load} className="app-btn-ghost text-sm">
        <RefreshCw className="w-4 h-4" />
        Refresh
      </button>

      {/* Connect modal */}
      {connectOpen ? (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
          <div className="app-card w-full max-w-lg p-5 sm:p-6 space-y-4 relative">
            <button
              type="button"
              onClick={() => {
                setConnectOpen(false);
                setCodeData(null);
              }}
              className="absolute right-3 top-3 rounded-lg p-2 app-muted hover:text-[var(--foreground)]"
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            <h2 className="text-xl font-semibold pr-8">Connect Telegram</h2>
            {codeLoading || !codeData ? (
              <p className="app-muted flex items-center gap-2">
                <Loader2 className="w-4 h-4 animate-spin" /> Generating code…
              </p>
            ) : (
              <>
                <div className="rounded-xl border border-[var(--border-accent)] bg-[var(--accent-soft)] px-4 py-3">
                  <p className="text-xs font-semibold uppercase tracking-wide app-muted">
                    Your connection code
                  </p>
                  <p className="mt-1 font-mono text-2xl font-bold tracking-wider text-[var(--primary)]">
                    {codeData.code}
                  </p>
                  <p className="text-xs app-muted mt-1">
                    Expires in {codeData.expiresInMinutes || 10} minutes
                  </p>
                </div>
                <ol className="text-sm space-y-2 app-muted list-decimal pl-5">
                  <li>
                    Add{' '}
                    <strong className="text-[var(--foreground)]">
                      @{codeData.botUsername || 'your bot'}
                    </strong>{' '}
                    to your Telegram group or channel
                  </li>
                  <li>
                    Make the bot admin (groups: Delete Messages; channels: Post Messages)
                  </li>
                  <li>
                    Send this command in the group (or as a channel post):
                    <code className="block mt-1 rounded-lg bg-[var(--surface)] border border-[var(--border)] px-3 py-2 text-[var(--foreground)]">
                      /connect {codeData.code}
                    </code>
                  </li>
                  <li>Return here — this page refreshes automatically</li>
                </ol>
                <div className="flex flex-wrap gap-2">
                  <button type="button" onClick={copyCode} className="app-btn-primary">
                    <Copy className="w-4 h-4" />
                    Copy command
                  </button>
                  <p className="text-sm app-muted self-center flex items-center gap-1.5">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    Waiting for connection…
                  </p>
                </div>
              </>
            )}
          </div>
        </div>
      ) : null}

      {/* Manage settings */}
      {managing ? (
        <ManageModal
          destination={managing}
          saving={savingId === managing.id}
          onClose={() => setManageId(null)}
          onSave={(settings) => saveSettings(managing, settings)}
        />
      ) : null}

      {/* Disconnect confirm */}
      {disconnectId ? (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="app-card w-full max-w-md p-6 space-y-4">
            <h2 className="text-lg font-semibold">Disconnect destination?</h2>
            <p className="text-sm app-muted">
              MastPlayer will stop publishing to this destination. Publication history is kept.
            </p>
            <div className="flex gap-2 justify-end">
              <button type="button" onClick={() => setDisconnectId(null)} className="app-btn-secondary">
                Cancel
              </button>
              <button type="button" onClick={confirmDisconnect} className="app-btn-primary">
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
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center bg-black/50 p-4">
      <div className="app-card w-full max-w-lg max-h-[90vh] overflow-y-auto p-5 sm:p-6 space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-lg font-semibold">{destination.title}</h2>
            <p className="text-sm app-muted capitalize">{destination.type} settings</p>
          </div>
          <button type="button" onClick={onClose} className="p-2 app-muted">
            <X className="w-5 h-5" />
          </button>
        </div>

        <ul className="space-y-3">
          {SETTING_FIELDS.map((f) => (
            <li key={f.key} className="flex items-center justify-between gap-3">
              <span className="text-sm">{f.label}</span>
              <button
                type="button"
                role="switch"
                aria-checked={Boolean(settings[f.key])}
                onClick={() => setSettings((s) => ({ ...s, [f.key]: !s[f.key] }))}
                className={`relative h-7 w-12 rounded-full transition-colors ${
                  settings[f.key] ? 'bg-[var(--gradient-brand-h)]' : 'bg-[var(--border)]'
                }`}
              >
                <span
                  className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white shadow transition-transform ${
                    settings[f.key] ? 'translate-x-5' : ''
                  }`}
                />
              </button>
            </li>
          ))}
        </ul>

        <div className="border-t border-[var(--border)] pt-4 space-y-3">
          <div>
            <h3 className="text-sm font-semibold">Message format</h3>
            <p className="text-xs app-muted mt-0.5">
              Optional text around title + watch link. Empty slots are skipped.
            </p>
          </div>

          {[
            { key: 'beforeTitle', label: 'Before title', placeholder: 'e.g. 🔥 New upload' },
            { key: 'afterTitle', label: 'After title', placeholder: 'e.g. Full HD · No ads' },
            { key: 'afterLink', label: 'After link', placeholder: 'e.g. Backup: https://t.me/…' },
            { key: 'footer', label: 'Footer', placeholder: 'e.g. Join @YourChannel' },
          ].map((slot) => (
            <label key={slot.key} className="block">
              <span className="mb-1 block text-xs font-medium app-muted">{slot.label}</span>
              <textarea
                rows={2}
                maxLength={400}
                value={mf[slot.key] || ''}
                onChange={(e) => setSlot(slot.key, e.target.value)}
                placeholder={slot.placeholder}
                className="app-input !mt-0 !py-2 text-sm min-h-[2.5rem] resize-y"
              />
            </label>
          ))}

          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2">
            <p className="text-[10px] font-semibold uppercase tracking-wide app-muted mb-1.5">
              Preview
            </p>
            <pre className="whitespace-pre-wrap break-words text-xs leading-relaxed font-sans">
              {previewParts.join('\n\n') || '🎬 Your Video Title\n\nhttps://mastplayer.in/v/XXXX'}
            </pre>
          </div>
        </div>

        <button
          type="button"
          disabled={saving}
          onClick={() => onSave(settings)}
          className="app-btn-primary w-full"
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
