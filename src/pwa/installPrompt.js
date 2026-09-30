const DISMISS_KEY = 'mastplayer-install-dismissed-at';
const DISMISS_MS = 30 * 24 * 60 * 60 * 1000;

let deferredPrompt = null;
let installed = false;
const listeners = new Set();
let snapshot = null;

const emit = () => {
  snapshot = null;
  listeners.forEach((fn) => fn());
};

export const isStandalone = () =>
  typeof window !== 'undefined' &&
  (window.matchMedia?.('(display-mode: standalone)').matches ||
    window.matchMedia?.('(display-mode: window-controls-overlay)').matches ||
    window.navigator.standalone === true);

export const isIosSafari = () => {
  if (typeof navigator === 'undefined') return false;
  const ua = navigator.userAgent || '';
  const isIos = /iphone|ipad|ipod/i.test(ua) || (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
  const isOtherBrowser = /crios|fxios|edgios|opios/i.test(ua);
  return isIos && !isOtherBrowser;
};

const readDismissed = () => {
  try {
    const at = Number(localStorage.getItem(DISMISS_KEY) || 0);
    return Boolean(at) && Date.now() - at < DISMISS_MS;
  } catch {
    return false;
  }
};

if (typeof window !== 'undefined') {
  window.addEventListener('beforeinstallprompt', (event) => {
    event.preventDefault();
    deferredPrompt = event;
    emit();
  });
  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    installed = true;
    emit();
  });
}

export const subscribeInstall = (fn) => {
  listeners.add(fn);
  return () => listeners.delete(fn);
};

export const getInstallSnapshot = () => {
  if (!snapshot) {
    const standalone = installed || isStandalone();
    snapshot = {
      canPrompt: Boolean(deferredPrompt) && !standalone,
      showIosHint: !standalone && !deferredPrompt && isIosSafari(),
      isStandalone: standalone,
      dismissed: readDismissed(),
    };
  }
  return snapshot;
};

export const promptInstall = async () => {
  if (!deferredPrompt) return 'unavailable';
  const event = deferredPrompt;
  deferredPrompt = null;
  emit();
  await event.prompt();
  const { outcome } = await event.userChoice;
  return outcome;
};

export const dismissInstall = () => {
  try {
    localStorage.setItem(DISMISS_KEY, String(Date.now()));
  } catch {
    // storage unavailable
  }
  emit();
};
