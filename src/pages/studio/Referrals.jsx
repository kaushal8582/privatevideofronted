import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import { Copy, Gift, Users, Wallet, Info } from 'lucide-react';
import {
  fetchReferralCommissions,
  fetchReferralSummary,
  fetchReferredUsers,
  getFriendlyError,
} from '../../services/api.js';
import LoadingState from '../../components/LoadingState.jsx';
import ErrorState from '../../components/ErrorState.jsx';
import { formatCount, formatDate, formatUsd } from '../../utils/formatters.js';

function StatCard({ label, value, hint, icon: Icon }) {
  return (
    <div className="app-card p-5">
      <div className="flex items-start justify-between gap-3">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wide app-muted">{label}</p>
          <p className="mt-2 text-2xl font-semibold tabular-nums">{value}</p>
          {hint ? <p className="mt-1.5 text-xs app-muted">{hint}</p> : null}
        </div>
        <span className="app-stat-icon">
          <Icon className="w-5 h-5" />
        </span>
      </div>
    </div>
  );
}

export default function StudioReferrals() {
  const [summary, setSummary] = useState(null);
  const [referred, setReferred] = useState([]);
  const [commissions, setCommissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const load = async () => {
    setLoading(true);
    setError(null);
    try {
      const [summaryRes, referredRes, commissionsRes] = await Promise.all([
        fetchReferralSummary(),
        fetchReferredUsers(),
        fetchReferralCommissions(1, 10),
      ]);
      setSummary(summaryRes.data.data);
      setReferred(referredRes.data.data.users || []);
      setCommissions(commissionsRes.data.data.items || []);
    } catch (err) {
      setError(getFriendlyError(err, 'Could not load referral program.'));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const copyLink = async () => {
    if (!summary?.referralLink) return;
    try {
      await navigator.clipboard.writeText(summary.referralLink);
      toast.success('Referral link copied');
    } catch {
      toast.error('Could not copy link');
    }
  };

  const copyCode = async () => {
    if (!summary?.referralCode) return;
    try {
      await navigator.clipboard.writeText(summary.referralCode);
      toast.success('Referral code copied');
    } catch {
      toast.error('Could not copy code');
    }
  };

  if (loading) {
    return <LoadingState message="Loading referral program…" />;
  }

  if (error) {
    return <ErrorState title="Referrals unavailable" message={error} onRetry={load} />;
  }

  const pct = summary?.commissionPercent ?? 10;

  return (
    <div className="space-y-8">
      <div>
        <p className="app-kicker mb-1">Referral program</p>
        <h1 className="app-title">Refer & earn</h1>
        <p className="mt-2 app-subtitle max-w-2xl">
          Share your link. When someone signs up and earns from app views, you get a{' '}
          <strong className="text-[var(--foreground)]">{pct}% bonus</strong> — they keep{' '}
          <strong className="text-[var(--foreground)]">100%</strong> of their earnings (Model 1).
        </p>
      </div>

      <div className="app-success-banner flex gap-3 items-start">
        <Info className="w-5 h-5 text-[var(--blue)] shrink-0 mt-0.5" />
        <p className="text-sm app-muted leading-relaxed">
          Example: your referral earns <strong className="text-[var(--foreground)]">$1,000</strong>{' '}
          in a month → they keep <strong className="text-[var(--foreground)]">$1,000</strong>, and
          you receive a separate{' '}
          <strong className="text-[var(--foreground)]">${(1000 * (pct / 100)).toFixed(0)}</strong>{' '}
          referral bonus.
        </p>
      </div>

      <div className="app-card-padded space-y-4">
        <h2 className="text-lg font-semibold">Your referral link</h2>
        <div className="flex flex-col sm:flex-row gap-3">
          <input
            readOnly
            value={summary.referralLink || ''}
            className="app-input flex-1 !mt-0 font-mono text-sm"
          />
          <button type="button" onClick={copyLink} className="app-btn-primary shrink-0">
            <Copy className="w-4 h-4" />
            Copy link
          </button>
        </div>
        <p className="text-sm app-muted">
          Code:{' '}
          <button type="button" onClick={copyCode} className="app-link font-mono">
            {summary.referralCode}
          </button>{' '}
          — share{' '}
          <span className="font-mono text-[var(--foreground)]">/register?ref={summary.referralCode}</span>
        </p>
      </div>

      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard
          icon={Users}
          label="Referred creators"
          value={formatCount(summary.referredCount)}
          hint="Signed up with your link"
        />
        <StatCard
          icon={Wallet}
          label="This month bonus"
          value={formatUsd(summary.thisMonthCommissionUsd)}
          hint="Separate from your video earnings"
        />
        <StatCard
          icon={Gift}
          label="Pending balance"
          value={formatUsd(summary.referralBalanceUsd)}
          hint="Paid when payout system is enabled"
        />
        <StatCard
          icon={Gift}
          label="Lifetime bonus"
          value={formatUsd(summary.referralLifetimeUsd)}
          hint={`${pct}% of referred creators' earnings`}
        />
      </div>

      <div className="space-y-4">
        <div className="flex items-end justify-between gap-4">
          <h2 className="text-lg font-semibold">Referred creators</h2>
          <Link to="/register" className="app-link text-sm">
            Preview signup page
          </Link>
        </div>

        {referred.length === 0 ? (
          <div className="app-card p-8 text-center">
            <p className="app-muted">No referrals yet. Copy your link and invite creators.</p>
          </div>
        ) : (
          <div className="app-table-wrap overflow-x-auto">
            <table className="app-table min-w-[640px]">
              <thead>
                <tr>
                  <th className="px-5">Creator</th>
                  <th>Payable views</th>
                  <th>Their earnings</th>
                  <th className="px-5">Your {pct}% bonus</th>
                </tr>
              </thead>
              <tbody>
                {referred.map((row) => (
                  <tr key={row.id}>
                    <td className="px-5">
                      <p className="font-semibold">{row.name}</p>
                      <p className="text-xs app-muted">{row.email}</p>
                      <p className="text-xs app-muted mt-0.5">Joined {formatDate(row.joinedAt)}</p>
                    </td>
                    <td className="tabular-nums">{formatCount(row.payableViews)}</td>
                    <td className="tabular-nums">{formatUsd(row.estimatedEarningsUsd)}</td>
                    <td className="px-5 tabular-nums font-medium text-[var(--blue)]">
                      {formatUsd(row.yourBonusUsd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {commissions.length > 0 && (
        <div className="space-y-4">
          <h2 className="text-lg font-semibold">Recent bonus events</h2>
          <div className="app-table-wrap overflow-x-auto">
            <table className="app-table min-w-[520px]">
              <thead>
                <tr>
                  <th className="px-5">Date</th>
                  <th>From</th>
                  <th className="px-5">Bonus</th>
                </tr>
              </thead>
              <tbody>
                {commissions.map((row) => (
                  <tr key={row.id}>
                    <td className="px-5 app-muted">{formatDate(row.createdAt)}</td>
                    <td>{row.referredUser?.name || 'Creator'}</td>
                    <td className="px-5 tabular-nums text-[var(--blue)]">
                      +{formatUsd(row.commissionUsd)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}
