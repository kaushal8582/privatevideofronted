import { useEffect, useState } from 'react';
import { Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Shield } from 'lucide-react';
import { useAuth } from '../../context/AuthContext.jsx';
import {
  adminFetchPayouts,
  adminProcessPayout,
  getFriendlyError,
} from '../../services/api.js';
import LoadingState from '../../components/LoadingState.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import { formatDate, formatUsd } from '../../utils/formatters.js';

export default function StudioAdminPayouts() {
  const { user } = useAuth();
  const isAdmin = user?.role === 'admin';
  const [status, setStatus] = useState('pending');
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [busyId, setBusyId] = useState(null);

  const load = async (nextStatus = status) => {
    setLoading(true);
    setError(null);
    try {
      const { data } = await adminFetchPayouts(nextStatus, 1, 50);
      setItems(data.data.items || []);
    } catch (err) {
      setError(getFriendlyError(err, 'Could not load admin payouts.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!isAdmin) return;
    load(status);
    // eslint-disable-next-line react-hooks/exhaustive-deps -- reload when filter changes
  }, [status, isAdmin]);

  if (!isAdmin) {
    return <Navigate to="/studio" replace />;
  }

  const process = async (id, action) => {
    const note =
      action === 'reject'
        ? window.prompt('Optional rejection note (shown to creator):', '')
        : window.prompt('Optional payment note (e.g. UTR / reference):', '');
    if (note === null) return;

    setBusyId(id);
    try {
      await adminProcessPayout(id, {
        action,
        ...(String(note).trim() ? { note: String(note).trim() } : {}),
      });
      toast.success(action === 'pay' ? 'Marked as paid' : 'Request rejected');
      await load(status);
    } catch (err) {
      toast.error(getFriendlyError(err, 'Could not update request.'));
    } finally {
      setBusyId(null);
    }
  };

  const snapshotLabel = (snap, method) => {
    if (!snap) return '—';
    if (method === 'upi') {
      return [snap.accountName, snap.upiId].filter(Boolean).join(' · ') || '—';
    }
    return [snap.accountName, snap.accountNumber, snap.ifsc].filter(Boolean).join(' · ') || '—';
  };

  return (
    <div className="space-y-8">
      <div>
        <p className="app-kicker mb-1 flex items-center gap-2">
          <Shield className="w-4 h-4" />
          Admin
        </p>
        <h1 className="app-title">Payout queue</h1>
        <p className="mt-2 app-subtitle max-w-2xl">
          Pay creators outside the app (UPI / bank), then mark the request paid. Reject returns the
          amount to their available balance.
        </p>
      </div>

      <div className="flex flex-wrap gap-2">
        {['pending', 'paid', 'rejected', 'all'].map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => setStatus(s)}
            className={status === s ? 'app-btn-primary' : 'app-btn-secondary'}
          >
            {s}
          </button>
        ))}
      </div>

      {loading ? (
        <LoadingState message="Loading payout queue…" />
      ) : error ? (
        <ErrorState title="Queue unavailable" message={error} onRetry={() => load(status)} />
      ) : items.length === 0 ? (
        <div className="app-card p-8 text-center">
          <p className="app-muted">No {status === 'all' ? '' : `${status} `}requests.</p>
        </div>
      ) : (
        <div className="app-table-wrap overflow-x-auto">
          <table className="app-table min-w-[900px]">
            <thead>
              <tr>
                <th className="px-5">Creator</th>
                <th>Amount</th>
                <th>Method</th>
                <th>Details</th>
                <th>Status</th>
                <th>Requested</th>
                <th className="px-5">Actions</th>
              </tr>
            </thead>
            <tbody>
              {items.map((row) => (
                <tr key={row.id}>
                  <td className="px-5">
                    <p className="font-semibold">{row.user?.name || '—'}</p>
                    <p className="text-xs app-muted">{row.user?.email}</p>
                  </td>
                  <td className="tabular-nums font-medium">{formatUsd(row.amountUsd)}</td>
                  <td className="uppercase text-xs font-semibold">{row.method}</td>
                  <td className="text-sm max-w-[220px] break-all">
                    {snapshotLabel(row.paymentSnapshot, row.method)}
                  </td>
                  <td>{row.status}</td>
                  <td className="app-muted text-sm">{formatDate(row.createdAt)}</td>
                  <td className="px-5">
                    {row.status === 'pending' ? (
                      <div className="flex flex-wrap gap-2">
                        <button
                          type="button"
                          className="app-btn-primary text-xs px-3 py-1.5"
                          disabled={busyId === row.id}
                          onClick={() => process(row.id, 'pay')}
                        >
                          Mark paid
                        </button>
                        <button
                          type="button"
                          className="app-btn-ghost text-xs px-3 py-1.5"
                          disabled={busyId === row.id}
                          onClick={() => process(row.id, 'reject')}
                        >
                          Reject
                        </button>
                      </div>
                    ) : (
                      <span className="text-xs app-muted">{row.adminNote || '—'}</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
