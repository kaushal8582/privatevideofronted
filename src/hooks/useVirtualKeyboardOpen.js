import { useEffect, useState } from 'react';

const NON_TEXT_INPUTS = new Set([
  'checkbox',
  'radio',
  'button',
  'submit',
  'reset',
  'file',
  'range',
  'color',
  'image',
  'hidden',
]);

const isTextEntry = (el) => {
  if (!el) return false;
  if (el.isContentEditable) return true;
  if (el.tagName === 'TEXTAREA') return true;
  return el.tagName === 'INPUT' && !NON_TEXT_INPUTS.has(el.type);
};

/** True while a text field is focused on a touch device or the visual viewport is squeezed by a keyboard. */
export default function useVirtualKeyboardOpen() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const vv = window.visualViewport;
    const coarse = window.matchMedia?.('(pointer: coarse)');
    let raf = 0;

    const update = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const editing = isTextEntry(document.activeElement);
        const squeezed = vv ? vv.height < window.innerHeight * 0.75 : false;
        setOpen(editing && (Boolean(coarse?.matches) || squeezed));
      });
    };

    document.addEventListener('focusin', update);
    document.addEventListener('focusout', update);
    vv?.addEventListener('resize', update);
    return () => {
      cancelAnimationFrame(raf);
      document.removeEventListener('focusin', update);
      document.removeEventListener('focusout', update);
      vv?.removeEventListener('resize', update);
    };
  }, []);

  return open;
}
