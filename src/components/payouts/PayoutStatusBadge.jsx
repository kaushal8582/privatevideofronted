import { getPayoutStatusMeta } from '../../utils/payoutStatus.js';

export default function PayoutStatusBadge({ status, className = '' }) {
  const meta = getPayoutStatusMeta(status);
  return (
    <span
      className={`inline-flex items-center gap-1.5 rounded-full border px-2.5 py-0.5 text-xs font-semibold whitespace-nowrap ${meta.className} ${className}`}
    >
      <span className={`h-1.5 w-1.5 rounded-full ${meta.dot}`} />
      {meta.label}
    </span>
  );
}
