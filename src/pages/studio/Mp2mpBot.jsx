import { useCallback, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import {
  Copy,
  ExternalLink,
  KeyRound,
  Link2,
  Loader2,
  RefreshCw,
  Unplug,
} from 'lucide-react';
import {
  createMp2mpConnectionKey,
  disconnectMp2mp,
  fetchMp2mpStatus,
  getFriendlyError,
} from '../../services/api.js';

const BOT_HANDLE = 'MP2MP_Link_converter_bot';

function formatConnectedDate(iso) {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleString(undefined, {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  } catch {
    return String(iso);
  }
}

export default function StudioMp2mpBot() {
  const [status, setStatus] = useState(null);
  const [loading, setLoading] = useState(true);
  const [keyData, setKeyData] = useState(null);
  const [keyLoading, setKeyLoading] = useState(false);
  const [disconnecting, setDisconnecting] = useState(false);

  const load = useCallback(async () => {
    try {
      const { data } = await fetchMp2mpStatus();
      setStatus(data.data || null);
    } catch (err) {
      toast.error(getFriendlyError(err, 'Could not load bot status.'));
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const generateKey = async () => {
    setKeyLoading(true);
    try {
      const { data } = await createMp2mpConnectionKey();
      setKeyData(data.data);
      setStatus(data.data?.status || null);
      toast.success('Connection key generated — copy it now');
    } catch (err) {
      toast.error(getFriendlyError(err, 'Could not generate connection key.'));
    } finally {
      setKeyLoading(false);
    }
  };

  const copyKey = async () => {
    if (!keyData?.key) return;
    try {
      await navigator.clipboard.writeText(keyData.key);
      toast.success('Key copied');
    } catch {
      toast.error('Could not copy');
    }
  };

  const copyConnectCommand = async () => {
    if (!keyData?.key) return;
    try {
      await navigator.clipboard.writeText(`/connect ${keyData.key}`);
      toast.success('Command copied');
    } catch {
      toast.error('Could not copy');
    }
  };

  const openBot = () => {
    const username = String(status?.botUsername || BOT_HANDLE).replace(/^@/, '');
    const url =
      keyData?.botUrl ||
      status?.botUrl ||
      `https://t.me/${username}`;
    window.open(url, '_blank', 'noopener,noreferrer');
  };

  const handleDisconnect = async () => {
    setDisconnecting(true);
    try {
      const { data } = await disconnectMp2mp();
      setStatus(data.data || null);
      setKeyData(null);
      toast.success('Telegram disconnected');
    } catch (err) {
      toast.error(getFriendlyError(err, 'Could not disconnect.'));
    } finally {
      setDisconnecting(false);
    }
  };

  const connected = Boolean(status?.connected);
  const botLabel = `@${String(status?.botUsername || BOT_HANDLE).replace(/^@/, '')}`;

  return (
    <div className="w-full space-y-4">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div className="min-w-0">
          <p className="app-kicker mb-1">Telegram bot</p>
          <h1 className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold tracking-tight">
            MP2MP Bot
          </h1>
          <p className="text-xs sm:text-sm app-muted mt-1">
            {botLabel} — convert MastPlayer links into your OG Earn links from Telegram
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          className="app-btn-ghost !py-1.5 !px-2.5 !text-xs shrink-0"
        >
          <RefreshCw className="w-3.5 h-3.5" />
          Refresh
        </button>
      </div>

      <section className="app-card p-4 sm:p-5 space-y-4">
        <div className="flex items-start gap-3">
          <span className="app-stat-icon shrink-0">
            <Link2 className="w-5 h-5" />
          </span>
          <div className="min-w-0 flex-1">
            <h2 className="text-base sm:text-lg font-semibold">Telegram Link Converter</h2>
            <p className="text-xs sm:text-sm app-muted mt-0.5 leading-relaxed">
              Connect your MastPlayer account with{' '}
              <strong className="text-[var(--foreground)]">{botLabel}</strong>. Send or forward a
              post with a MastPlayer link — the bot replies with the same post and your earning
              links.
            </p>
          </div>
        </div>

        {loading ? (
          <p className="app-muted flex items-center gap-2 text-sm">
            <Loader2 className="w-4 h-4 animate-spin" /> Loading status…
          </p>
        ) : connected ? (
          <div className="space-y-3">
            <div className="rounded-lg border border-[var(--border-accent)] bg-[var(--accent-soft)] px-3 py-2.5">
              <p className="text-sm font-semibold text-[var(--primary)]">Telegram Connected ✓</p>
              <p className="text-xs app-muted mt-1">
                {status.telegramUsername
                  ? `@${status.telegramUsername}`
                  : status.telegramFirstName || 'Linked account'}
              </p>
              <p className="text-[11px] app-muted mt-0.5">
                Connected {formatConnectedDate(status.connectedAt)}
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={openBot}
                className="app-btn-primary !py-1.5 !px-3 !text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open {botLabel}
              </button>
              <button
                type="button"
                onClick={generateKey}
                disabled={keyLoading}
                className="app-btn-secondary !py-1.5 !px-3 !text-xs"
              >
                {keyLoading ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <KeyRound className="w-3.5 h-3.5" />
                )}
                Regenerate Key
              </button>
              <button
                type="button"
                onClick={handleDisconnect}
                disabled={disconnecting}
                className="app-btn-ghost !py-1.5 !px-3 !text-xs text-[var(--danger)]"
              >
                {disconnecting ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Unplug className="w-3.5 h-3.5" />
                )}
                Disconnect Telegram
              </button>
            </div>
          </div>
        ) : (
          <div className="space-y-3">
            <button
              type="button"
              onClick={generateKey}
              disabled={keyLoading}
              className="app-btn-primary !py-1.5 !px-3 !text-xs"
            >
              {keyLoading ? (
                <>
                  <Loader2 className="w-3.5 h-3.5 animate-spin" /> Generating…
                </>
              ) : (
                <>
                  <KeyRound className="w-3.5 h-3.5" />
                  Generate Connection Key
                </>
              )}
            </button>
            <ol className="text-xs space-y-1.5 app-muted list-decimal pl-4 leading-relaxed">
              <li>Generate your connection key</li>
              <li>Open {botLabel}</li>
              <li>
                Send <code className="text-[var(--primary)]">/connect YOUR_KEY</code>
              </li>
              <li>Start sending or forwarding MastPlayer links</li>
            </ol>
          </div>
        )}

        {keyData?.key ? (
          <div className="rounded-lg border border-[var(--border)] bg-[var(--surface)] px-3 py-2.5 space-y-2">
            <div>
              <p className="text-[10px] font-semibold uppercase tracking-wide app-muted">
                Connection Key
              </p>
              <p className="mt-0.5 font-mono text-sm sm:text-base font-bold tracking-wide text-[var(--primary)] break-all">
                {keyData.key}
              </p>
              <p className="text-[11px] app-muted mt-1">
                Shown once — copy now. Regenerating invalidates the previous key.
              </p>
            </div>
            <div className="flex flex-wrap gap-2">
              <button
                type="button"
                onClick={copyKey}
                className="app-btn-primary !py-1.5 !px-3 !text-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy Key
              </button>
              <button
                type="button"
                onClick={copyConnectCommand}
                className="app-btn-secondary !py-1.5 !px-3 !text-xs"
              >
                <Copy className="w-3.5 h-3.5" />
                Copy /connect
              </button>
              <button
                type="button"
                onClick={openBot}
                className="app-btn-secondary !py-1.5 !px-3 !text-xs"
              >
                <ExternalLink className="w-3.5 h-3.5" />
                Open Telegram Bot
              </button>
            </div>
            <p className="text-[11px] app-muted">
              In Telegram send:{' '}
              <code className="text-[var(--foreground)]">/connect {keyData.key}</code>
            </p>
          </div>
        ) : null}
      </section>
    </div>
  );
}
