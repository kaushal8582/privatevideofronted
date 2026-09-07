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
    <div className="space-y-2">
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
            'relative flex flex-wrap items-center justify-center gap-3 rounded-xl border border-dashed px-4 py-5 text-center cursor-pointer transition-colors',
            dragActive
              ? 'border-[var(--primary)] bg-[var(--accent-soft)]'
              : 'border-[var(--border)] bg-[var(--surface)] hover:border-[var(--border-green)]',
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
          <span className="inline-flex h-9 w-9 items-center justify-center rounded-lg bg-[var(--accent-medium)] text-[var(--primary)]">
            <Upload className="w-4 h-4" />
          </span>
          <div className="text-left min-w-0">
            <p className="text-sm font-semibold">Drop video or click to choose</p>
            <p className="text-xs app-muted">MP4, WebM, MOV, MKV · up to {MAX_MB} MB</p>
          </div>
        </div>
      ) : (
        <div
          className={[
            'flex items-center gap-3 rounded-xl border border-[var(--border)] bg-[var(--surface)] px-3 py-2',
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
          <div className="shrink-0 w-8 h-8 rounded-lg bg-[var(--accent-medium)] text-[var(--primary)] flex items-center justify-center">
            <Film className="w-4 h-4" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-medium truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-xs app-muted">
              {formatFileSize(file.size)} · {getFileExtension(file.name)}
            </p>
          </div>
          {!disabled && (
            <>
              <button
                type="button"
                onClick={() => inputRef.current?.click()}
                className="shrink-0 text-xs app-link"
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
                className="shrink-0 p-1.5 rounded-md app-muted hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)]"
                aria-label="Remove selected file"
              >
                <X className="w-4 h-4" />
              </button>
            </>
          )}
        </div>
      )}

      {localError && <p className="app-error text-sm">{localError}</p>}
    </div>
  );
}
