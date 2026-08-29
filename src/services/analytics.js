import { track } from '@vercel/analytics/react';
import api from './api.js';

/**
 * Funnel events:
 * - link_open: share page loaded
 * - open_app_click: user tapped View in App
 * - play_store_redirect: fell through to Play Store
 * - play_start: (app) user tapped Play
 */
export function trackAnalyticsEvent(name, { shareToken, path, meta } = {}) {
  const pagePath = path || (typeof window !== 'undefined' ? window.location.pathname : undefined);

  // Vercel Analytics custom events (string/number/bool props only)
  try {
    track(name, {
      shareToken: shareToken ? String(shareToken) : '',
      path: pagePath ? String(pagePath) : '',
    });
  } catch {
    // ignore
  }

  // Own API (Mongo) — fire and forget
  api
    .post('/analytics/events', {
      name,
      shareToken: shareToken || null,
      source: 'web',
      path: pagePath || null,
      meta: meta || {},
    })
    .catch(() => {
      // never block UI on analytics
    });
}
