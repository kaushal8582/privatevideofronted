import { AlertCircle } from 'lucide-react';

export default function ErrorState({
  title = 'Something went wrong',
  message = 'Please try again.',
  onRetry,
}) {
  return (
    <div className="rounded-2xl border border-red-100 bg-red-50/60 px-6 py-12 text-center">
      <div className="mx-auto w-12 h-12 rounded-xl bg-white text-red-700 flex items-center justify-center mb-4 shadow-sm">
        <AlertCircle className="w-6 h-6" />
      </div>
      <h2 className="text-lg font-semibold text-[#0c1222] mb-2">{title}</h2>
      <p className="text-[#5b657a] mb-6 max-w-md mx-auto">{message}</p>
      {onRetry && (
        <button
          type="button"
          onClick={onRetry}
          className="inline-flex px-4 py-2.5 rounded-xl bg-teal-800 text-white text-sm font-medium hover:bg-teal-700"
        >
          Try again
        </button>
      )}
    </div>
  );
}
