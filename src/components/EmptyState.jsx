import { Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No videos uploaded yet.',
  description = 'Upload your first video to get a shareable link.',
  actionLabel = 'Upload Video',
  actionTo = '/studio/upload',
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[var(--border-green)] bg-[var(--surface)] px-6 py-16 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-[var(--accent-medium)] text-[var(--primary)] flex items-center justify-center mb-5">
        <Upload className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="app-muted max-w-md mx-auto mb-8">{description}</p>
      <Link to={actionTo} className="app-btn-primary">
        <Upload className="w-4 h-4" />
        {actionLabel}
      </Link>
    </div>
  );
}
