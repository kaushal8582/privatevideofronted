import { Link } from 'react-router-dom';
import { Play, Trash2, Calendar, HardDrive } from 'lucide-react';
import CopyLinkButton from './CopyLinkButton.jsx';
import VideoThumbnail from './VideoThumbnail.jsx';
import {
  formatDate,
  formatDuration,
  formatFileSize,
} from '../utils/formatters.js';

export default function VideoCard({ video, onDelete, deleting = false }) {
  const watchPath = `/v/${video.shareToken}`;

  return (
    <article className="group flex flex-col app-card overflow-hidden hover:border-[var(--border-green)] transition-colors">
      <Link
        to={watchPath}
        className="relative aspect-video bg-[var(--surface)] overflow-hidden block"
      >
        <VideoThumbnail
          thumbnailUrl={video.thumbnailUrl}
          videoUrl={video.videoUrl}
          title={video.title}
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
        <span className="absolute bottom-3 right-3 text-xs font-medium tabular-nums bg-black/70 text-white px-2 py-1 rounded-md z-10">
          {formatDuration(video.duration)}
        </span>
      </Link>

      <div className="flex flex-col flex-1 p-4 gap-3">
        <div className="min-w-0">
          <h3 className="font-semibold truncate" title={video.title}>
            {video.title}
          </h3>
          <p className="text-sm app-muted truncate mt-0.5" title={video.originalName}>
            {video.originalName}
          </p>
        </div>

        <div className="flex flex-wrap gap-x-4 gap-y-1 text-xs app-muted">
          <span className="inline-flex items-center gap-1">
            <HardDrive className="w-3.5 h-3.5" />
            {formatFileSize(video.size)}
          </span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="w-3.5 h-3.5" />
            {formatDate(video.createdAt)}
          </span>
          {video.duration ? (
            <span className="tabular-nums">{formatDuration(video.duration)}</span>
          ) : null}
        </div>

        <p className="text-xs app-muted break-all line-clamp-2" title={video.shareUrl}>
          {video.shareUrl}
        </p>

        <div className="mt-auto pt-1 flex flex-wrap gap-2">
          <Link to={watchPath} className="app-btn-primary !py-2 !px-3 !text-sm">
            <Play className="w-3.5 h-3.5 fill-white" />
            Watch
          </Link>
          <CopyLinkButton url={video.shareUrl} variant="secondary" className="!py-2 !px-3" />
          <button
            type="button"
            onClick={() => onDelete?.(video)}
            disabled={deleting}
            className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl text-sm font-medium text-[var(--danger)] hover:bg-[var(--danger-soft)] disabled:opacity-50"
          >
            <Trash2 className="w-3.5 h-3.5" />
            Delete
          </button>
        </div>
      </div>
    </article>
  );
}
