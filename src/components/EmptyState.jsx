import { Upload } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function EmptyState({
  title = 'No videos uploaded yet.',
  description = 'Upload your first video to get a shareable link.',
  actionLabel = 'Upload Video',
  actionTo = '/upload',
}) {
  return (
    <div className="rounded-2xl border border-dashed border-[#e6e1d8] bg-white/60 px-6 py-16 text-center">
      <div className="mx-auto w-14 h-14 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mb-5">
        <Upload className="w-7 h-7" />
      </div>
      <h2 className="text-xl font-semibold mb-2">{title}</h2>
      <p className="text-[#5b657a] max-w-md mx-auto mb-8">{description}</p>
      <Link
        to={actionTo}
        className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-teal-800 text-white text-sm font-medium hover:bg-teal-700"
      >
        <Upload className="w-4 h-4" />
        {actionLabel}
      </Link>
    </div>
  );
}
