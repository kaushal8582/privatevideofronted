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
 */
export default function GoogleSignInButton({
  onCredential,
  onError,
  text = 'continue_with',
  disabled = false,
}) {
  const btnRef = useRef(null);
  const [ready, setReady] = useState(false);
  const [unavailable, setUnavailable] = useState(!CLIENT_ID);

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
          width: 320,
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
  }, [onCredential, onError, text, disabled]);

  if (unavailable) {
    return (
      <p className="text-center text-xs text-[#5b657a]">
        Google sign-in is not configured yet. Set <code>VITE_GOOGLE_CLIENT_ID</code>.
      </p>
    );
  }

  return (
    <div className="flex flex-col items-center gap-2">
      <div
        ref={btnRef}
        className={disabled ? 'pointer-events-none opacity-50' : ''}
        aria-label="Continue with Google"
      />
      {!ready && (
        <p className="text-xs text-[#5b657a]">Loading Google…</p>
      )}
    </div>
  );
}
