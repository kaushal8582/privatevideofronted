export const formatFileSize = (bytes) => {
  if (bytes == null || Number.isNaN(Number(bytes))) return '—';
  const value = Number(bytes);
  if (value < 1024) return `${value} B`;
  if (value < 1024 * 1024) return `${(value / 1024).toFixed(1)} KB`;
  if (value < 1024 * 1024 * 1024) return `${(value / (1024 * 1024)).toFixed(1)} MB`;
  return `${(value / (1024 * 1024 * 1024)).toFixed(2)} GB`;
};

export const formatDuration = (seconds) => {
  if (seconds == null || Number.isNaN(Number(seconds))) return '—';
  const total = Math.max(0, Math.floor(Number(seconds)));
  const h = Math.floor(total / 3600);
  const m = Math.floor((total % 3600) / 60);
  const s = total % 60;
  if (h > 0) {
    return `${h}:${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
  }
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
};

export const formatDate = (dateInput) => {
  if (!dateInput) return '—';
  const date = new Date(dateInput);
  if (Number.isNaN(date.getTime())) return '—';
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
};

export const formatUsd = (amount) => {
  const n = Number(amount) || 0;
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 4,
  }).format(n);
};

export const formatCount = (n) => {
  const v = Number(n) || 0;
  return new Intl.NumberFormat('en-US').format(v);
};

export const getFileExtension = (filename = '') => {
  const parts = filename.split('.');
  return parts.length > 1 ? parts.pop().toUpperCase() : 'VIDEO';
};

const ALLOWED_MIME = [
  'video/mp4',
  'video/webm',
  'video/quicktime',
  'video/x-matroska',
  'video/mkv',
];

const ALLOWED_EXT = ['.mp4', '.webm', '.mov', '.mkv'];

export const validateClientVideo = (file, maxSizeMb = 500) => {
  if (!file) return 'Please select a video file.';

  const name = file.name.toLowerCase();
  const hasExt = ALLOWED_EXT.some((ext) => name.endsWith(ext));
  const hasMime = !file.type || ALLOWED_MIME.includes(file.type);

  if (!hasExt || !hasMime) {
    return 'Unsupported format. Use MP4, WebM, MOV, or MKV.';
  }

  const maxBytes = maxSizeMb * 1024 * 1024;
  if (file.size > maxBytes) {
    return `File too large. Maximum size is ${maxSizeMb} MB.`;
  }

  return null;
};
