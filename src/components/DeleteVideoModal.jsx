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
        className="absolute inset-0 bg-[#0c1222]/50 backdrop-blur-[2px]"
        aria-label="Close dialog"
        onClick={loading ? undefined : onCancel}
      />

      <div className="relative w-full max-w-md rounded-2xl bg-white shadow-xl border border-[#e6e1d8] p-6 animate-in">
        <div className="flex items-start justify-between gap-3 mb-4">
          <div className="w-11 h-11 rounded-xl bg-red-50 text-red-700 flex items-center justify-center">
            <Trash2 className="w-5 h-5" />
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="p-2 rounded-lg text-[#5b657a] hover:bg-slate-100 disabled:opacity-50"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 id="delete-modal-title" className="text-xl font-semibold mb-2">
          Delete this video?
        </h2>
        <p className="text-[#5b657a] mb-1">
          This action cannot be undone.
        </p>
        {title && (
          <p className="text-sm text-[#0c1222] font-medium truncate mb-6">
            {title}
          </p>
        )}

        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="px-4 py-2.5 rounded-xl border border-[#e6e1d8] text-sm font-medium hover:bg-[#f7f5f1] disabled:opacity-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-red-700 text-white text-sm font-medium hover:bg-red-600 disabled:opacity-60"
          >
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
