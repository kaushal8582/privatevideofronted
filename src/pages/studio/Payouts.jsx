import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Banknote, Info, Wallet } from 'lucide-react';
import {
  fetchPayoutHistory,
  fetchPayoutWallet,
  getFriendlyError,
  requestPayout,
  updatePayoutMethods,
} from '../../services/api.js';
import LoadingState from '../../components/LoadingState.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import { formatDate, formatUsd } from '../../utils/formatters.js';

function StatCard({ label, value, hint }) {
  return (
    <div className="app-card p-5">
      <p className="text-xs font-semibold uppercase tracking-wide app-muted">{label}</p>
      <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
      {hint ? <p className="mt-1.5 text-xs app-muted">{hint}</p> : null}
    </div>
  );
}

export default function StudioPayouts() {
  const [wallet, setWallet] = useState(null);
  const [methods, setMethods] = useState(null);
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  /** Which method form to edit / use for requests */
  const [selectedMethod, setSelectedMethod] = useState('upi');

  const [upiId, setUpiId] = useState('');
  const [upiAccountName, setUpiAccountName] = useState('');
  const [accountName, setAccountName] = useState('');
  const [accountNumber, setAccountNumber] = useState('');
  const [ifsc, setIfsc] = useState('');
  const [savingMethods, setSavingMethods] = useState(false);

  const [amountUsd, setAmountUsd] = useState('');
  const [requesting, setRequesting] = useState(false);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [walletRes, historyRes] = await Promise.all([
        fetchPayoutWallet(),
        fetchPayoutHistory(1, 20),
      ]);
      const w = walletRes.data.data.wallet;
      const m = walletRes.data.data.paymentMethods;
      setWallet(w);
      setMethods(m);
      setHistory(historyRes.data.data.items || []);
      setUpiId(m.upiId || '');
      setUpiAccountName(m.upiAccountName || '');
      setAccountName(m.bank?.accountName || '');
      setAccountNumber(m.bank?.accountNumber || '');
      setIfsc(m.bank?.ifsc || '');
      if (m.hasUpi) setSelectedMethod('upi');
      else if (m.hasBank) setSelectedMethod('bank');
    } catch (err) {
      setError(getFriendlyError(err, 'Could not load payouts.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const saveMethods = async (e) => {
    e.preventDefault();
    if (savingMethods) return;
    setSavingMethods(true);
    try {
      const payload =
        selectedMethod === 'upi'
          ? { upiId, upiAccountName }
          : { bank: { accountName, accountNumber, ifsc } };
      const { data } = await updatePayoutMethods(payload);
      setMethods(data.data.paymentMethods);
      toast.success(selectedMethod === 'upi' ? 'UPI details saved' : 'Bank details saved');
    } catch (err) {
      toast.error(getFriendlyError(err, 'Could not save payment methods.'));
    } finally {
      setSavingMethods(false);
    }
  };

  const submitRequest = async (e) => {
    e.preventDefault();
    if (requesting || !wallet) return;
    const amount = Number(amountUsd);
    setRequesting(true);
    try {
      const { data } = await requestPayout({ amountUsd: amount, method: selectedMethod });
      setWallet(data.data.wallet);
      setAmountUsd('');
      toast.success('Payout request submitted');
      const hist = await fetchPayoutHistory(1, 20);
      setHistory(hist.data.data.items || []);
    } catch (err) {
      toast.error(getFriendlyError(err, 'Could not submit payout request.'));
    } finally {
      setRequesting(false);
    }
  };

  if (loading) {
    return <LoadingState message="Loading payouts…" />;
  }

  if (error) {
    return <ErrorState title="Payouts unavailable" message={error} onRetry={load} />;
  }

  const min = wallet?.minPayoutUsd ?? 5;
  const methodReady =
    selectedMethod === 'upi' ? Boolean(methods?.hasUpi) : Boolean(methods?.hasBank);
  const canRequest =
    wallet.availableUsd >= min && wallet.pendingCount === 0 && methodReady;

  return (
    <div className="space-y-8">
      <div>
        <p className="app-kicker mb-1">Creator wallet</p>
        <h1 className="app-title">Payouts</h1>
        <p className="mt-2 app-subtitle max-w-2xl">
          One wallet for upload earnings, OG Earn, royalty, and referrals. Request a payout when you
          reach ${min.toFixed(0)}. We pay manually via UPI or bank transfer.
        </p>
      </div>

      <div className="app-success-banner flex gap-3 items-start">
        <Info className="w-5 h-5 text-[var(--blue)] shrink-0 mt-0.5" />
        <p className="text-sm app-muted leading-relaxed">
          Available = total earned − pending requests − lifetime paid. Only one pending request at a
          time. After we send payment outside the app, an admin marks it paid.
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Available" value={formatUsd(wallet.availableUsd)} hint="Ready to withdraw" />
        <StatCard
          label="Pending"
          value={formatUsd(wallet.pendingUsd)}
          hint={wallet.pendingCount ? `${wallet.pendingCount} open request` : 'No open requests'}
        />
        <StatCard label="Lifetime paid" value={formatUsd(wallet.lifetimePaidUsd)} />
        <StatCard
          label="Gross earned"
          value={formatUsd(wallet.grossEarnedUsd)}
          hint="Uploads + OG + royalty + referrals"
        />
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <form onSubmit={saveMethods} className="app-card-padded space-y-4">
          <div className="flex items-center gap-2">
            <Banknote className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-lg font-semibold">Payment methods</h2>
          </div>

          <div>
            <label className="app-label" htmlFor="paymentMethodType">
              Payment method
            </label>
            <select
              id="paymentMethodType"
              className="app-input"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
            >
              <option value="upi">UPI</option>
              <option value="bank">Bank transfer</option>
            </select>
          </div>

          {selectedMethod === 'upi' ? (
            <div className="space-y-3">
              <div>
                <label className="app-label" htmlFor="upiAccountName">
                  Account holder name
                </label>
                <input
                  id="upiAccountName"
                  className="app-input"
                  value={upiAccountName}
                  onChange={(e) => setUpiAccountName(e.target.value)}
                  placeholder="Name as on UPI"
                  autoComplete="name"
                  required
                />
              </div>
              <div>
                <label className="app-label" htmlFor="upiId">
                  UPI ID
                </label>
                <input
                  id="upiId"
                  className="app-input"
                  value={upiId}
                  onChange={(e) => setUpiId(e.target.value)}
                  placeholder="name@upi"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <label className="app-label" htmlFor="accountName">
                  Account holder name
                </label>
                <input
                  id="accountName"
                  className="app-input"
                  value={accountName}
                  onChange={(e) => setAccountName(e.target.value)}
                  autoComplete="name"
                  required
                />
              </div>
              <div>
                <label className="app-label" htmlFor="accountNumber">
                  Account number
                </label>
                <input
                  id="accountNumber"
                  className="app-input font-mono"
                  value={accountNumber}
                  onChange={(e) => setAccountNumber(e.target.value)}
                  inputMode="numeric"
                  autoComplete="off"
                  required
                />
              </div>
              <div>
                <label className="app-label" htmlFor="ifsc">
                  IFSC
                </label>
                <input
                  id="ifsc"
                  className="app-input font-mono uppercase"
                  value={ifsc}
                  onChange={(e) => setIfsc(e.target.value.toUpperCase())}
                  placeholder="SBIN0001234"
                  autoComplete="off"
                  required
                />
              </div>
            </div>
          )}

          <button type="submit" className="app-btn-primary" disabled={savingMethods}>
            {savingMethods
              ? 'Saving…'
              : selectedMethod === 'upi'
                ? 'Save UPI details'
                : 'Save bank details'}
          </button>
        </form>

        <form onSubmit={submitRequest} className="app-card-padded space-y-4">
          <div className="flex items-center gap-2">
            <Wallet className="w-5 h-5 text-[var(--primary)]" />
            <h2 className="text-lg font-semibold">Request payout</h2>
          </div>

          <div>
            <label className="app-label" htmlFor="requestMethod">
              Pay via
            </label>
            <select
              id="requestMethod"
              className="app-input"
              value={selectedMethod}
              onChange={(e) => setSelectedMethod(e.target.value)}
            >
              <option value="upi" disabled={!methods?.hasUpi}>
                UPI{!methods?.hasUpi ? ' (save UPI first)' : ''}
              </option>
              <option value="bank" disabled={!methods?.hasBank}>
                Bank transfer{!methods?.hasBank ? ' (save bank first)' : ''}
              </option>
            </select>
            {!methodReady ? (
              <p className="mt-1.5 text-xs app-muted">
                Save {selectedMethod === 'upi' ? 'UPI' : 'bank'} details on the left first.
              </p>
            ) : selectedMethod === 'upi' ? (
              <p className="mt-1.5 text-xs app-muted">
                {methods.upiAccountName} · {methods.upiId}
              </p>
            ) : (
              <p className="mt-1.5 text-xs app-muted">
                {methods.bank.accountName} · ****{String(methods.bank.accountNumber).slice(-4)} ·{' '}
                {methods.bank.ifsc}
              </p>
            )}
          </div>

          <div>
            <label className="app-label" htmlFor="amountUsd">
              Amount (USD)
            </label>
            <input
              id="amountUsd"
              className="app-input"
              type="number"
              min={min}
              step="0.01"
              value={amountUsd}
              onChange={(e) => setAmountUsd(e.target.value)}
              placeholder={`Min $${min.toFixed(2)}`}
            />
            <p className="mt-1.5 text-xs app-muted">
              Available {formatUsd(wallet.availableUsd)} · minimum {formatUsd(min)}
            </p>
          </div>

          {wallet.pendingCount > 0 ? (
            <p className="text-sm text-[var(--warning,var(--primary))]">
              You already have a pending request. Wait until it is paid or rejected.
            </p>
          ) : null}

          <button type="submit" className="app-btn-primary" disabled={!canRequest || requesting}>
            {requesting ? 'Submitting…' : 'Submit request'}
          </button>
        </form>
      </div>

      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Payout history</h2>
        {history.length === 0 ? (
          <div className="app-card p-8 text-center">
            <p className="app-muted">No payout requests yet.</p>
          </div>
        ) : (
          <div className="app-table-wrap overflow-x-auto">
            <table className="app-table min-w-[640px]">
              <thead>
                <tr>
                  <th className="px-5">Date</th>
                  <th>Amount</th>
                  <th>Method</th>
                  <th>Status</th>
                  <th className="px-5">Note</th>
                </tr>
              </thead>
              <tbody>
                {history.map((row) => (
                  <tr key={row.id}>
                    <td className="px-5 app-muted">{formatDate(row.createdAt)}</td>
                    <td className="tabular-nums font-medium">{formatUsd(row.amountUsd)}</td>
                    <td className="uppercase text-xs font-semibold">{row.method}</td>
                    <td>
                      <span
                        className={
                          row.status === 'paid'
                            ? 'text-[var(--blue)]'
                            : row.status === 'rejected'
                              ? 'text-[var(--danger,#ef4444)]'
                              : ''
                        }
                      >
                        {row.status}
                      </span>
                    </td>
                    <td className="px-5 text-sm app-muted">{row.adminNote || '—'}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}
