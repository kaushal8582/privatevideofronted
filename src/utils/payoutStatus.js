export const PAYOUT_STATUS_META = {
  pending: {
    label: 'Pending',
    className: 'bg-amber-500/15 text-amber-500 border-amber-500/30',
    dot: 'bg-amber-500',
  },
  under_review: {
    label: 'Under review',
    className: 'bg-orange-500/15 text-orange-500 border-orange-500/30',
    dot: 'bg-orange-500',
  },
  approved: {
    label: 'Approved',
    className: 'bg-sky-500/15 text-sky-500 border-sky-500/30',
    dot: 'bg-sky-500',
  },
  processing: {
    label: 'Processing',
    className: 'bg-violet-500/15 text-violet-500 border-violet-500/30',
    dot: 'bg-violet-500',
  },
  paid: {
    label: 'Paid',
    className: 'bg-emerald-500/15 text-emerald-500 border-emerald-500/30',
    dot: 'bg-emerald-500',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-500/15 text-red-500 border-red-500/30',
    dot: 'bg-red-500',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-slate-500/15 text-slate-500 border-slate-500/30',
    dot: 'bg-slate-500',
  },
};

export function getPayoutStatusMeta(status) {
  const key = String(status || '').toLowerCase();
  return (
    PAYOUT_STATUS_META[key] || {
      label: key ? key.replace(/_/g, ' ').replace(/^\w/, (c) => c.toUpperCase()) : 'Unknown',
      className: 'bg-slate-500/15 text-slate-500 border-slate-500/30',
      dot: 'bg-slate-500',
    }
  );
}
