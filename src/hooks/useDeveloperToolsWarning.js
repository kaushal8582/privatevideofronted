import { useCallback, useEffect, useState } from 'react';

/*
 * Best-effort, production-only deterrent. Not a security control: it never blocks
 * requests, touches auth, or clears data. When a signal is uncertain it does nothing.
 *
 * Signals:
 * 1. Inspect shortcuts (Windows/Linux Ctrl+Shift+…, macOS Cmd+Option+… / Cmd+Shift+C).
 * 2. Docked DevTools after right-click → Inspect: a contextmenu event arms detection
 *    for a short window; a following single-axis viewport shrink with unchanged zoom
 *    counts as DevTools docking.
 * 3. Unarmed: a large single-axis height shrink (bottom-docked DevTools).
 * Undocked DevTools windows cannot be detected and are ignored.
 */

const SHORTCUT_CODES = new Set(['KeyI', 'KeyJ', 'KeyC']);
const FIREFOX_MAC_CODES = new Set(['KeyK', 'KeyE']);
const ARM_MS = 15_000;
const ARMED_THRESHOLD_PX = 160;
const UNARMED_HEIGHT_THRESHOLD_PX = 220;
const OTHER_AXIS_TOLERANCE_PX = 24;
const SETTLE_MS = 400;
const COOLDOWN_MS = 3_000;

const isInspectShortcut = (e) => {
  if (e.key === 'F12') return true;
  if (e.ctrlKey && e.shiftKey && !e.metaKey && (SHORTCUT_CODES.has(e.code) || FIREFOX_MAC_CODES.has(e.code))) {
    return true;
  }
  if (e.metaKey && e.altKey && (SHORTCUT_CODES.has(e.code) || FIREFOX_MAC_CODES.has(e.code))) return true;
  return e.metaKey && e.shiftKey && !e.altKey && e.code === 'KeyC';
};

const isDesktopPointer = () =>
  window.matchMedia?.('(hover: hover) and (pointer: fine)').matches && window.innerWidth >= 768;

const measure = () => ({
  gapW: window.outerWidth - window.innerWidth,
  gapH: window.outerHeight - window.innerHeight,
  w: window.innerWidth,
  h: window.innerHeight,
  dpr: window.devicePixelRatio,
});

export default function useDeveloperToolsWarning() {
  const [devToolsWarningVisible, setVisible] = useState(false);

  const dismiss = useCallback(() => setVisible(false), []);

  useEffect(() => {
    const enabled = import.meta.env.PROD || import.meta.env.VITE_DEVTOOLS_WARNING_IN_DEV === 'true';
    if (!enabled) return undefined;

    let lastShownAt = 0;
    let armedUntil = 0;
    let baseline = measure();
    let settleTimer = 0;

    const show = () => {
      if (Date.now() - lastShownAt < COOLDOWN_MS) return;
      lastShownAt = Date.now();
      setVisible(true);
    };

    const onKeyDown = (e) => {
      if (!isInspectShortcut(e)) return;
      e.preventDefault();
      show();
    };

    const onContextMenu = () => {
      armedUntil = Date.now() + ARM_MS;
    };

    const check = () => {
      const prev = baseline;
      const next = measure();
      baseline = next;

      if (!isDesktopPointer() || document.fullscreenElement) return;
      if (!window.outerWidth || !window.outerHeight) return;
      if (next.dpr !== prev.dpr) return;

      const widthOnly =
        next.gapW - prev.gapW >= ARMED_THRESHOLD_PX && Math.abs(next.h - prev.h) < OTHER_AXIS_TOLERANCE_PX;
      const heightGrowth = next.gapH - prev.gapH;
      const heightOnly =
        heightGrowth >= ARMED_THRESHOLD_PX && Math.abs(next.w - prev.w) < OTHER_AXIS_TOLERANCE_PX;
      const armed = Date.now() < armedUntil;

      if ((armed && (widthOnly || heightOnly)) || (heightOnly && heightGrowth >= UNARMED_HEIGHT_THRESHOLD_PX)) {
        armedUntil = 0;
        show();
      }
    };

    const onResize = () => {
      window.clearTimeout(settleTimer);
      settleTimer = window.setTimeout(check, SETTLE_MS);
    };

    window.addEventListener('keydown', onKeyDown, true);
    window.addEventListener('contextmenu', onContextMenu, true);
    window.addEventListener('resize', onResize);
    return () => {
      window.clearTimeout(settleTimer);
      window.removeEventListener('keydown', onKeyDown, true);
      window.removeEventListener('contextmenu', onContextMenu, true);
      window.removeEventListener('resize', onResize);
    };
  }, []);

  return { devToolsWarningVisible, dismiss };
}
