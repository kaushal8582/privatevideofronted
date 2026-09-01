import { useEffect, useId, useRef } from 'react';
import { ADSTERRA_ENABLED, AdsterraUnits } from '../../config/adsterra.js';

/**
 * Adsterra banner — injects atOptions + invoke.js the same way their GET CODE does.
 * Ads usually only fill on the verified domain (mastplayer.in), not localhost.
 */
export default function AdsterraBanner({ unit = 'banner320x50', className = '' }) {
  const slotRef = useRef(null);
  const reactId = useId().replace(/:/g, '');
  const config = AdsterraUnits[unit];

  useEffect(() => {
    if (!ADSTERRA_ENABLED || !config?.key || !config?.invokeSrc || !slotRef.current) {
      return undefined;
    }

    const slot = slotRef.current;
    slot.innerHTML = '';

    // Adsterra expects global atOptions before invoke.js runs
    window.atOptions = {
      key: config.key,
      format: 'iframe',
      height: config.height,
      width: config.width,
      params: {},
    };

    // Inline config script (matches GET CODE pattern)
    const confScript = document.createElement('script');
    confScript.type = 'text/javascript';
    confScript.text = `
      atOptions = {
        'key': '${config.key}',
        'format': 'iframe',
        'height': ${config.height},
        'width': ${config.width},
        'params': {}
      };
    `;

    const invoke = document.createElement('script');
    invoke.type = 'text/javascript';
    // Protocol-relative URL avoids some https cert edge cases Adsterra CDNs have
    invoke.src = config.invokeSrc.replace(/^https?:/, '');
    if (invoke.src.startsWith('//') === false && invoke.src.startsWith('/')) {
      invoke.src = config.invokeSrc;
    } else if (!invoke.src.startsWith('//') && !invoke.src.startsWith('http')) {
      invoke.src = config.invokeSrc;
    }
    // Prefer //cdn... form
    if (config.invokeSrc.startsWith('http')) {
      try {
        const u = new URL(config.invokeSrc);
        invoke.src = `//${u.host}${u.pathname}${u.search}`;
      } catch {
        invoke.src = config.invokeSrc;
      }
    }
    invoke.async = true;
    invoke.dataset.adsterra = reactId;
    invoke.onerror = () => {
      console.warn(
        '[Adsterra] banner script failed to load. Check: 1) domain mastplayer.in verified in Adsterra 2) adblock off 3) test on https://mastplayer.in not localhost 4) SSL/network',
        config.invokeSrc
      );
    };

    slot.appendChild(confScript);
    slot.appendChild(invoke);

    return () => {
      slot.innerHTML = '';
    };
  }, [config?.key, config?.invokeSrc, config?.width, config?.height, reactId, unit]);

  if (!ADSTERRA_ENABLED || !config?.key) return null;

  return (
    <div
      className={`w-full flex justify-center overflow-hidden ${className}`}
      style={{ minHeight: config.height }}
      aria-hidden
    >
      <div ref={slotRef} style={{ width: config.width, maxWidth: '100%' }} />
    </div>
  );
}
