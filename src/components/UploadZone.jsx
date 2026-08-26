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
    <div className="space-y-4">
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
          'relative rounded-2xl border-2 border-dashed px-6 py-12 sm:py-16 text-center cursor-pointer transition-all',
          dragActive
            ? 'border-teal-700 bg-teal-50/80 scale-[1.01]'
            : 'border-[#e6e1d8] bg-white/70 hover:border-teal-600/60 hover:bg-white',
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

        <div className="mx-auto w-14 h-14 rounded-2xl bg-teal-50 text-teal-800 flex items-center justify-center mb-5">
          <Upload className="w-7 h-7" />
        </div>

        <h2 className="text-xl sm:text-2xl font-semibold text-[#0c1222] mb-2">
          Upload Video
        </h2>
        <p className="text-[#5b657a] mb-6">
          Drag &amp; drop your video
          <span className="mx-2 text-[#c4bdb0]">or</span>
        </p>

        <span className="inline-flex items-center justify-center px-5 py-2.5 rounded-xl bg-teal-800 text-white text-sm font-medium shadow-sm">
          Choose Video
        </span>

        <p className="mt-6 text-sm text-[#5b657a]">
          MP4, WebM, MOV, MKV · up to {MAX_MB} MB
        </p>
      </div>

      {localError && (
        <p className="text-sm text-red-700 bg-red-50 border border-red-100 rounded-xl px-4 py-3">
          {localError}
        </p>
      )}

      {file && (
        <div className="flex items-start gap-4 rounded-2xl border border-[#e6e1d8] bg-white p-4 sm:p-5">
          <div className="shrink-0 w-11 h-11 rounded-xl bg-teal-50 text-teal-800 flex items-center justify-center">
            <Film className="w-5 h-5" />
          </div>
          <div className="min-w-0 flex-1">
            <p className="font-medium truncate" title={file.name}>
              {file.name}
            </p>
            <p className="text-sm text-[#5b657a] mt-1">
              {formatFileSize(file.size)} · {getFileExtension(file.name)}
              {file.type ? ` · ${file.type}` : ''}
            </p>
          </div>
          {!disabled && (
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setLocalError(null);
                onClear();
              }}
              className="shrink-0 p-2 rounded-lg text-[#5b657a] hover:bg-slate-100 hover:text-[#0c1222] transition-colors"
              aria-label="Remove selected file"
            >
              <X className="w-5 h-5" />
            </button>
          )}
        </div>
      )}
    </div>
  );
}
