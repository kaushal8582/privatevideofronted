import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Copy, ExternalLink, Loader, X } from 'lucide-react';
import { fetchPayoutDetail, getFriendlyError } from '../../services/api.js';
import { formatDateTime, formatUsd } from '../../utils/formatters.js';
import { getPayoutStatusMeta } from '../../utils/payoutStatus.js';
import PayoutStatusBadge from './PayoutStatusBadge.jsx';

function eventTitle(event) {
  switch (event.type) {
    case 'created':
      return 'Payout requested';
    case 'status_changed':
      return `Status changed to ${getPayoutStatusMeta(event.toStatus).label}`;
    case 'note':
      return 'Note added';
    case 'proof_uploaded':
      return 'Payment proof added';
    default:
      return 'Update';
  }
}

function eventDot(event) {
  if (event.type === 'created') return getPayoutStatusMeta('pending').dot;
  if (event.type === 'status_changed') return getPayoutStatusMeta(event.toStatus).dot;
  if (event.type === 'proof_uploaded') return getPayoutStatusMeta('paid').dot;
  return 'bg-[var(--muted)]';
}

function DetailRow({ label, children }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wide app-muted">{label}</p>
      <div className="mt-1 text-sm font-medium break-all">{children}</div>
    </div>
  );
}

function paidToLabel(request) {
  const snap = request.paymentSnapshot || {};
  if (request.method === 'upi') {
    return [snap.accountName, snap.upiId].filter(Boolean).join(' · ') || '—';
  }
  const acct = snap.accountNumber ? `****${String(snap.accountNumber).slice(-4)}` : null;
  return [snap.accountName, acct, snap.ifsc].filter(Boolean).join(' · ') || '—';
}

export default function PayoutDetailModal({ payoutId, onClose }) {
  const [request, setRequest] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!payoutId) return undefined;
    let cancelled = false;
    setLoading(true);
    setError(null);
    setRequest(null);
    fetchPayoutDetail(payoutId)
      .then(({ data }) => {
        if (!cancelled) setRequest(data.data.request);
      })
      .catch((err) => {
        if (!cancelled) setError(getFriendlyError(err, 'Could not load payout details.'));
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [payoutId]);

  useEffect(() => {
    if (!payoutId) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [payoutId, onClose]);

  if (!payoutId) return null;

  const copyTxn = async () => {
    try {
      await navigator.clipboard.writeText(request.transactionId);
      toast.success('Transaction ID copied');
    } catch {
      toast.error('Could not copy');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="payout-detail-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={onClose}
      />

      <div className="relative w-full max-w-lg max-h-[90vh] overflow-y-auto rounded-2xl app-card p-6 shadow-xl border-[var(--border)]">
        <div className="flex items-start justify-between gap-3 mb-5">
          <div>
            <p className="app-kicker mb-1">Payout details</p>
            <h2 id="payout-detail-title" className="text-2xl font-semibold tabular-nums">
              {request ? formatUsd(request.amountUsd) : '—'}
            </h2>
            {request ? <PayoutStatusBadge status={request.status} className="mt-2" /> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg app-muted hover:text-[var(--foreground)] hover:bg-[var(--surface)]"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {loading ? (
          <div className="flex items-center justify-center gap-2 py-10 app-muted">
            <Loader className="w-4 h-4 animate-spin" /> Loading…
          </div>
        ) : error ? (
          <p className="py-8 text-center text-sm text-[var(--danger)]">{error}</p>
        ) : request ? (
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <DetailRow label="Requested on">{formatDateTime(request.createdAt)}</DetailRow>
              <DetailRow label="Method">
                <span className="uppercase">{request.method}</span>
              </DetailRow>
              <div className="col-span-2">
                <DetailRow label="Paid to">{paidToLabel(request)}</DetailRow>
              </div>
              {request.transactionId ? (
                <div className="col-span-2">
                  <DetailRow label="Transaction ID">
                    <span className="inline-flex items-center gap-2 font-mono">
                      {request.transactionId}
                      <button
                        type="button"
                        onClick={copyTxn}
                        className="p-1 rounded app-muted hover:text-[var(--foreground)]"
                        aria-label="Copy transaction ID"
                      >
                        <Copy className="w-3.5 h-3.5" />
                      </button>
                    </span>
                  </DetailRow>
                </div>
              ) : null}
            </div>

            {request.status === 'rejected' && request.rejectionReason ? (
              <div className="rounded-xl border border-red-500/30 bg-red-500/10 p-3 text-sm">
                <p className="font-semibold text-red-500 mb-1">Reason</p>
                <p className="app-muted">{request.rejectionReason}</p>
              </div>
            ) : null}

            {request.paymentProofUrl ? (
              <div>
                <p className="text-xs font-semibold uppercase tracking-wide app-muted mb-2">
                  Payment proof
                </p>
                <a
                  href={request.paymentProofUrl}
                  target="_blank"
                  rel="noreferrer"
                  className="group relative block overflow-hidden rounded-xl border border-[var(--border)]"
                >
                  <img
                    src={request.paymentProofUrl}
                    alt="Payment proof"
                    className="max-h-64 w-full object-contain bg-[var(--surface)]"
                  />
                  <span className="absolute right-2 top-2 inline-flex items-center gap-1 rounded-md bg-black/60 px-2 py-1 text-xs text-white opacity-0 group-hover:opacity-100 transition-opacity">
                    <ExternalLink className="w-3 h-3" /> Open
                  </span>
                </a>
              </div>
            ) : null}

            <div>
              <p className="text-xs font-semibold uppercase tracking-wide app-muted mb-3">
                Activity
              </p>
              <ol className="relative space-y-5 border-l border-[var(--border)] ml-1.5">
                {(request.timeline || []).map((event) => (
                  <li key={event.id} className="relative pl-5">
                    <span
                      className={`absolute -left-[5px] top-1.5 h-2.5 w-2.5 rounded-full ring-4 ring-[var(--surface-elevated)] ${eventDot(event)}`}
                    />
                    <p className="text-sm font-semibold">{eventTitle(event)}</p>
                    <p className="text-xs app-muted">
                      {event.actorName} · {formatDateTime(event.createdAt)}
                    </p>
                    {event.note ? (
                      <p className="mt-2 rounded-lg bg-[var(--surface)] px-3 py-2 text-sm app-muted whitespace-pre-wrap">
                        {event.note}
                      </p>
                    ) : null}
                    {event.transactionId ? (
                      <p className="mt-1.5 text-xs app-muted">
                        Transaction ID: <span className="font-mono">{event.transactionId}</span>
                      </p>
                    ) : null}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
