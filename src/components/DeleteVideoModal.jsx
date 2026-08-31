import { X, Trash2, Loader } from 'lucide-react';

export default function DeleteVideoModal({
  open,
  title,
  loading = false,
  onCancel,
  onConfirm,
}) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-4"
      role="dialog"
      aria-modal="true"
      aria-labelledby="delete-modal-title"
    >
      <button
        type="button"
        className="absolute inset-0 bg-black/60 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={loading ? undefined : onCancel}
      />

      <div className="relative w-full max-w-md rounded-2xl app-card p-6 shadow-xl border-[var(--border)]">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-[var(--danger-soft)] text-[var(--danger)] flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="p-2 rounded-lg app-muted hover:text-[var(--foreground)] hover:bg-[var(--surface)] disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 id="delete-modal-title" className="text-xl font-semibold mb-2">
          Delete this video?
        </h2>
        <p className="app-muted mb-1">This action cannot be undone.</p>
        {title && <p className="text-sm font-medium truncate mb-6">{title}</p>}

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button type="button" onClick={onCancel} disabled={loading} className="app-btn-secondary">
            Cancel
          </button>
          <button type="button" onClick={onConfirm} disabled={loading} className="app-btn-danger">
            {loading ? (
              <>
                <Loader className="w-4 h-4 animate-spin" />
                Deleting...
              </>
            ) : (
              'Delete'
            )}
          </button>
        </div>
      </div>
    </div>
  );
}
