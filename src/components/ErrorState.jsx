import { AlertCircle } from 'lucide-react';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again.',
  onRetry,
}) {
  return (
    <div className="app-card px-6 py-12 text-center border-[rgba(248,113,113,0.25)]">
      <div className="mx-auto w-12 h-12 rounded-xl bg-[var(--danger-soft)] text-[var(--danger)] flex items-center justify-center mb-4">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-semibold mb-2">{title}</h2>
      <p className="app-muted mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <button type="button" onClick={onRetry} className="app-btn-primary">
          Try again
        </button>
      )}
    </div>
  );
}
