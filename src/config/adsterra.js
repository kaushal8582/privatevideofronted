/**
 * Adsterra config from env.
 *
 * Banner env can be either:
 *   - key only: e89a8500e19fad715c880bbc748f0968
 *   - full invoke URL: https://www.highrevenueformat.com/e89a.../invoke.js
 *
 * Social Bar / Popunder: full script src URL from GET CODE.
 */

export const ADSTERRA_ENABLED = import.meta.env.VITE_ADSTERRA_ENABLED === '1';

/** Parse key and invoke.js URL from env (key or full URL). */
export function parseBannerEnv(raw, width, height) {
  const value = String(raw || '').trim();
  if (!value) return null;

  if (value.includes('/invoke.js') || value.startsWith('http') || value.startsWith('//')) {
    const src = value.startsWith('//') ? `https:${value}` : value;
    const match = src.match(/\/([a-f0-9]{16,})\/invoke\.js/i);
    const key = match?.[1] || '';
    if (!key) return null;
    return { key, invokeSrc: src, width, height };
  }

  // Plain key hash
  return {
    key: value,
    invokeSrc: `https://www.highrevenueformat.com/${value}/invoke.js`,
    width,
    height,
  };
}

export const AdsterraUnits = {
  banner320x50: parseBannerEnv(import.meta.env.VITE_ADSTERRA_BANNER_320x50_KEY, 320, 50),
  banner300x250: parseBannerEnv(import.meta.env.VITE_ADSTERRA_BANNER_300x250_KEY, 300, 250),
  banner728x90: parseBannerEnv(import.meta.env.VITE_ADSTERRA_BANNER_728x90_KEY, 728, 90),
  socialBarSrc: import.meta.env.VITE_ADSTERRA_SOCIAL_BAR_SRC || '',
  popunderSrc: import.meta.env.VITE_ADSTERRA_POPUNDER_SRC || '',
};
