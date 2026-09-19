import { useEffect, useRef, useState } from 'react';

const CLIENT_ID = import.meta.env.VITE_GOOGLE_CLIENT_ID || '';

function loadGisScript() {
  return new Promise((resolve, reject) => {
    if (window.google?.accounts?.id) {
      resolve();
      return;
    }
    const existing = document.getElementById('google-gis');
    if (existing) {
      existing.addEventListener('load', () => resolve());
      existing.addEventListener('error', reject);
      return;
    }
    const script = document.createElement('script');
    script.id = 'google-gis';
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('Failed to load Google Sign-In'));
    document.head.appendChild(script);
  });
}

/**
 * Official Google Identity button. Calls onCredential(idToken).
 * Width follows the container so it stays responsive on small phones.
 */
export default function GoogleSignInButton({
  onCredential,
  onError,
  text = 'continue_with',
  disabled = false,
}) {
  const wrapRef = useRef(null);
  const btnRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(!CLIENT_ID);
  const [btnWidth, setBtnWidth] = useState(320);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return undefined;

    const measure = () => {
      const w = Math.floor(el.getBoundingClientRect().width);
      if (w > 0) setBtnWidth(Math.min(400, Math.max(240, w)));
    };

    measure();
    const ro = typeof ResizeObserver !== 'undefined' ? new ResizeObserver(measure) : null;
    ro?.observe(el);
    window.addEventListener('resize', measure);
    return () => {
      ro?.disconnect();
      window.removeEventListener('resize', measure);
    };
  }, []);

  useEffect(() => {
    if (!CLIENT_ID || disabled) return undefined;
    let cancelled = false;

    const setup = async () => {
      try {
        await loadGisScript();
        if (cancelled || !btnRef.current) return;

        window.google.accounts.id.initialize({
          client_id: CLIENT_ID,
          callback: (response) => {
            if (response?.credential) {
              onCredential?.(response.credential);
            } else {
              onError?.(new Error('Google sign-in was cancelled.'));
            }
          },
          auto_select: false,
          cancel_on_tap_outside: true,
        });

        btnRef.current.innerHTML = '';
        window.google.accounts.id.renderButton(btnRef.current, {
          type: 'standard',
          theme: 'outline',
          size: 'large',
          text,
          shape: 'pill',
          width: btnWidth,
        });
        setReady(true);
      } catch (err) {
        if (!cancelled) {
          setUnavailable(true);
          onError?.(err);
        }
      }
    };

    setup();
    return () => {
      cancelled = true;
    };
  }, [onCredential, onError, text, disabled, btnWidth]);

  if (unavailable) {
    return (
      <p className="text-center text-xs app-muted px-1">
        Google sign-in is not configured yet. Set <code>VITE_GOOGLE_CLIENT_ID</code>.
      </p>
    );
  }

  return (
    <div ref={wrapRef} className="w-full flex flex-col items-stretch gap-2">
      <div
        ref={btnRef}
        className={`w-full flex justify-center overflow-hidden ${disabled ? 'pointer-events-none opacity-50' : ''}`}
        aria-label="Continue with Google"
      />
      {!ready && <p className="text-xs app-muted text-center">Loading Google…</p>}
    </div>
  );
}
