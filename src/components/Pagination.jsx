import { ChevronLeft, ChevronRight } from 'lucide-react';

/** Page numbers with gaps, e.g. 1 … 4 5 6 … 12 */
function getPageItems(page, totalPages) {
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1);
  }
  const items = [1];
  const start = Math.max(2, page - 1);
  const end = Math.min(totalPages - 1, page + 1);
  if (start > 2) items.push('gap-start');
  for (let p = start; p <= end; p += 1) items.push(p);
  if (end < totalPages - 1) items.push('gap-end');
  items.push(totalPages);
  return items;
}

const navBtn =
  'app-btn-secondary px-3! disabled:opacity-50 disabled:cursor-not-allowed';

export default function Pagination({
  page,
  totalPages,
  total,
  limit,
  onPageChange,
  disabled = false,
  label = 'items',
}) {
  if (!totalPages || totalPages <= 1) return null;

  const from = total === 0 ? 0 : (page - 1) * limit + 1;
  const to = Math.min(total, page * limit);
  const go = (next) => {
    if (disabled || next < 1 || next > totalPages || next === page) return;
    onPageChange(next);
  };

  return (
    <nav
      aria-label="Pagination"
      className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
      <p className="text-sm app-muted tabular-nums">
        Showing {from}–{to} of {total} {label}
      </p>

      <div className="flex items-center gap-2">
        <button
          type="button"
          className={navBtn}
          onClick={() => go(page - 1)}
          disabled={disabled || page <= 1}
          aria-label="Previous page">
          <ChevronLeft className="w-4 h-4" />
          <span className="hidden sm:inline">Prev</span>
        </button>

        <span className="sm:hidden text-sm font-semibold tabular-nums px-2">
          {page} / {totalPages}
        </span>

        <div className="hidden sm:flex items-center gap-1">
          {getPageItems(page, totalPages).map((item) =>
            typeof item === 'number' ? (
              <button
                key={item}
                type="button"
                onClick={() => go(item)}
                disabled={disabled}
                aria-current={item === page ? 'page' : undefined}
                className={`min-w-9 h-9 px-2 rounded-lg text-sm font-semibold tabular-nums transition-colors disabled:cursor-not-allowed ${
                  item === page
                    ? 'bg-[var(--surface-elevated)] border border-[var(--border-accent)] text-[var(--foreground)]'
                    : 'app-muted hover:text-[var(--foreground)] border border-transparent'
                }`}>
                {item}
              </button>
            ) : (
              <span key={item} className="px-1 app-muted select-none">
                …
              </span>
            )
          )}
        </div>

        <button
          type="button"
          className={navBtn}
          onClick={() => go(page + 1)}
          disabled={disabled || page >= totalPages}
          aria-label="Next page">
          <span className="hidden sm:inline">Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </nav>
  );
}
