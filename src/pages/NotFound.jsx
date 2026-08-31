import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="max-w-lg mx-auto text-center py-20 px-4 sm:px-6">
      <p className="text-sm font-semibold uppercase tracking-widest text-[var(--primary)] mb-3">
        404
      </p>
      <h1 className="app-title mb-4">Page not found</h1>
      <p className="app-muted mb-8">
        The page you’re looking for doesn’t exist or has been moved.
      </p>
      <Link to="/" className="app-btn-primary">
        <ArrowLeft className="w-4 h-4" />
        Back to Home
      </Link>
    </div>
  );
}
