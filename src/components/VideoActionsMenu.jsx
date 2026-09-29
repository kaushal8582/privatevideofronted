import { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { createPortal } from 'react-dom';
import { useNavigate } from 'react-router-dom';
import { MoreVertical, ExternalLink, Copy, Send, Trash2 } from 'lucide-react';

const MENU_WIDTH = 208;

/**
 * Per-video ⋮ menu. Rendered in a portal with fixed positioning so it is not
 * clipped by `overflow-x-auto` table wrappers.
 */
export default function VideoActionsMenu({ video, onCopy, onReshare, onDelete, disabled = false }) {
  const navigate = useNavigate();
  const buttonRef = useRef(null);
  const menuRef = useRef(null);
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });

  useLayoutEffect(() => {
    if (!open || !buttonRef.current) return;
    const rect = buttonRef.current.getBoundingClientRect();
    const menuHeight = menuRef.current?.offsetHeight || 180;
    const spaceBelow = window.innerHeight - rect.bottom;
    const top = spaceBelow < menuHeight + 12 ? rect.top - menuHeight - 6 : rect.bottom + 6;
    const left = Math.max(8, Math.min(rect.right - MENU_WIDTH, window.innerWidth - MENU_WIDTH - 8));
    setPos({ top, left });
  }, [open]);

  useEffect(() => {
    if (!open) return undefined;
    const close = () => setOpen(false);
    const onPointerDown = (e) => {
      if (menuRef.current?.contains(e.target) || buttonRef.current?.contains(e.target)) return;
      close();
    };
    const onKey = (e) => {
      if (e.key === 'Escape') close();
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('touchstart', onPointerDown);
    document.addEventListener('keydown', onKey);
    window.addEventListener('resize', close);
    window.addEventListener('scroll', close, true);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('touchstart', onPointerDown);
      document.removeEventListener('keydown', onKey);
      window.removeEventListener('resize', close);
      window.removeEventListener('scroll', close, true);
    };
  }, [open]);

  const run = (fn) => () => {
    setOpen(false);
    fn?.();
  };

  const itemClass =
    'flex w-full items-center gap-2.5 px-3 py-2 text-sm text-left text-[var(--foreground)] hover:bg-[var(--surface)]';

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        disabled={disabled}
        onClick={() => setOpen((v) => !v)}
        className="inline-flex h-8 w-8 items-center justify-center rounded-lg app-muted hover:text-[var(--foreground)] hover:bg-[var(--surface)] disabled:opacity-50"
        aria-label="Video actions"
        aria-haspopup="menu"
        aria-expanded={open}
      >
        <MoreVertical className="w-4 h-4" />
      </button>

      {open &&
        createPortal(
          <div
            ref={menuRef}
            role="menu"
            style={{ top: pos.top, left: pos.left, width: MENU_WIDTH }}
            className="fixed z-50 overflow-hidden rounded-xl border border-[var(--border)] bg-[var(--surface-elevated)] py-1 shadow-xl"
          >
            {video?.shareToken ? (
              <button type="button" role="menuitem" className={itemClass} onClick={run(() => navigate(`/v/${video.shareToken}`))}>
                <ExternalLink className="w-4 h-4 app-muted" />
                Open
              </button>
            ) : null}
            {onCopy ? (
              <button type="button" role="menuitem" className={itemClass} onClick={run(onCopy)}>
                <Copy className="w-4 h-4 app-muted" />
                Copy link
              </button>
            ) : null}
            {onReshare ? (
              <button type="button" role="menuitem" className={itemClass} onClick={run(onReshare)}>
                <Send className="w-4 h-4 app-muted" />
                Re-share on Telegram
              </button>
            ) : null}
            {onDelete ? (
              <>
                <div className="my-1 border-t border-[var(--border)]" />
                <button
                  type="button"
                  role="menuitem"
                  className={`${itemClass} !text-[var(--danger)] hover:!bg-[var(--danger-soft)]`}
                  onClick={run(onDelete)}
                >
                  <Trash2 className="w-4 h-4" />
                  Delete
                </button>
              </>
            ) : null}
          </div>,
          document.body
        )}
    </>
  );
}
