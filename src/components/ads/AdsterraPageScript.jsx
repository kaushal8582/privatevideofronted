import { useEffect } from 'react';
import { ADSTERRA_ENABLED, AdsterraUnits } from '../../config/adsterra.js';

/**
 * Loads a one-shot Adsterra script (Social Bar / Popunder) on this page only.
 * Pass which src env to use: 'socialBar' | 'popunder'
 */
export default function AdsterraPageScript({ type = 'socialBar' }) {
  useEffect(() => {
    if (!ADSTERRA_ENABLED) return undefined;

    const src =
      type === 'popunder'
        ? AdsterraUnits.popunderSrc?.trim()
        : AdsterraUnits.socialBarSrc?.trim();

    if (!src) return undefined;

    const existing = document.querySelector(`script[data-adsterra-page="${type}"]`);
    if (existing) return undefined;

    const script = document.createElement('script');
    script.src = src.startsWith('//') ? `https:${src}` : src;
    script.async = true;
    script.dataset.adsterraPage = type;
    document.body.appendChild(script);

    return () => {
      // Leave script in place for popunder/social bar lifetime of session;
      // removing often breaks their SDK. Only remove marker if you prefer strict cleanup.
    };
  }, [type]);

  return null;
}
