export const VIDEO_CATEGORIES = [
  { value: 'adult', label: 'Adult 18+' },
  { value: 'porn', label: 'Porn' },
  { value: 'movie', label: 'Movie' },
  { value: 'web_series', label: 'Web Series' },
  { value: 'other', label: 'Other' },
];

export const DEFAULT_VIDEO_CATEGORY = 'adult';

/** Hidden from Telegram group search only. Publishing is still allowed. */
export const TELEGRAM_BLOCKED_CATEGORIES = ['adult', 'porn'];

export function isTelegramBlockedCategory(category) {
  return TELEGRAM_BLOCKED_CATEGORIES.includes(String(category || '').toLowerCase());
}

export function categoryLabel(value) {
  return VIDEO_CATEGORIES.find((c) => c.value === value)?.label || value || 'Adult 18+';
}
