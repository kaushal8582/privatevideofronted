import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto text-center py-20">
      <p className="text-sm font-semibold uppercase tracking-widest text-teal-800 mb-3">
        404
      </p>
      <h1 className="font-[family-name:var(--font-display)] text-4xl sm:text-5xl mb-4">
        Page not found
      </h1>
      <p className="text-[#5b657a] mb-8">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-800 text-white text-sm font-medium hover:bg-teal-700"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
