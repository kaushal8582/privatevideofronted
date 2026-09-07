import { useRef, useState } from 'react';
import { Upload, X, Film } from 'lucide-react';
import { formatFileSize, getFileExtension, validateClientVideo } from '../utils/formatters.js';

const MAX_MB = Number(import.meta.env.VITE_MAX_VIDEO_SIZE_MB) || 500;

export default function UploadZone({
  file,
  onFileSelect,
  onClear,
  disabled = false,
}) {
  const inputRef = useRef(null);
  const [dragActive, setDragActive] = useState(false);
  const [localError, setLocalError] = useState(null);

  const handleFiles = (fileList) => {
    const next = fileList?.[0];
    if (!next) return;

    const error = validateClientVideo(next, MAX_MB);
    if (error) {
      setLocalError(error);
      return;
    }

    setLocalError(null);
    onFileSelect(next);
  };

  const onDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (disabled) return;
    handleFiles(e.dataTransfer.files);
  };

  const onDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (!disabled) setDragActive(true);
  };

  const onDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
  };

  return (
    <div className="space-y-3">
      {!file ? (
        <div
          role="button"
          tabIndex={0}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ' ') {
              e.preventDefault();
              if (!disabled) inputRef.current?.click();
            }
          }}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
          onClick={() => !disabled && inputRef.current?.click()}
          className={[
            'relative flex flex-col sm:flex-row sm:items-center gap-4 rounded-2xl border-2 border-dashed px-5 py-8 sm:py-10 cursor-pointer transition-all',
            dragActive
              ? 'border-[var(--primary)] bg-[var(--accent-soft)] scale-[1.005]'
              : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-accent)] hover:bg-[var(--surface-elevated)]',
            disabled ? 'opacity-60 pointer-events-none' : '',
          ].join(' ')}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.webm,.mov,.mkv"
            className="sr-only"
            disabled={disabled}
            onChange={(e) => handleFiles(e.target.files)}
          />
          <span className="mx-auto sm:mx-0 inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-[var(--accent-medium)] text-[var(--primary)] shrink-0">
            <Upload className="w-5 h-5" />
          </span>
          <div className="text-center sm:text-left min-w-0 flex-1">
            <p className="text-base font-semibold text-[var(--foreground)]">
              Drop your video here
            </p>
            <p className="mt-1 text-sm app-muted">
              or click to browse · MP4, WebM, MOV, MKV · up to {MAX_MB} MB
            </p>
          </div>
          <span className="app-btn-primary self-center sm:self-auto shrink-0 pointer-events-none">
            Choose file
          </span>
        </div>
      ) : (
        <div
          className={[
            'flex items-center gap-4 rounded-2xl border border-[var(--border)] bg-[var(--surface)] px-4 py-3.5',
            disabled ? 'opacity-60' : '',
          ].join(' ')}
          onDrop={onDrop}
          onDragOver={onDragOver}
          onDragLeave={onDragLeave}
        >
          <input
            ref={inputRef}
            type="file"
            accept="video/mp4,video/webm,video/quicktime,video/x-matroska,.mp4,.webm,.mov,.mkv"
            className="sr-only"
            disabled={disabled}
            onChange={(e) => handleFiles(e.target.files)}
          />
          <div className="shrink-0 w-11 h-11 rounded-xl bg-[var(--accent-medium)] text-[var(--primary)] flex items-center justify-center">
            <Film className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs app-muted mt-0.5">
              {formatFileSize(file.size)} · {getFileExtension(file.name)}
            </p>
          </div>
          {!disabled && (
            <div className="flex items-center gap-1 shrink-0">
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="app-btn-secondary !px-3 !py-1.5 text-xs"
              >
                Change
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  setLocalError(null);
                  onClear();
                }}
                className="p-2 rounded-lg app-muted hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)]"
                aria-label="Remove selected file"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      )}

      {localError && <p className="app-error text-sm">{localError}</p>}
    </div>
  );
}
