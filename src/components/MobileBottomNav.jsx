import { useEffect } from 'react';
import { Link, matchPath, useLocation } from 'react-router-dom';
import { Bot, House, Plus, UserRound, Video } from 'lucide-react';
import useVirtualKeyboardOpen from '../hooks/useVirtualKeyboardOpen.js';

const ITEMS = [
  { to: '/studio', label: 'Home', icon: House, match: [{ path: '/studio', end: true }] },
  { to: '/studio/videos', label: 'Videos', icon: Video, match: [{ path: '/studio/videos' }] },
  { to: '/studio/upload', label: 'Upload', icon: Plus, primary: true, match: [{ path: '/studio/upload' }] },
  {
    to: '/studio/telegram',
    label: 'Bot',
    icon: Bot,
    match: [{ path: '/studio/telegram' }, { path: '/studio/mp2mp-bot' }],
  },
  {
    to: '/studio/profile',
    label: 'Me',
    icon: UserRound,
    match: [
      { path: '/studio/profile' },
      { path: '/studio/referrals' },
      { path: '/studio/og-earn' },
      { path: '/studio/payouts' },
    ],
  },
];

const isActive = (pathname, patterns) =>
  patterns.some(({ path, end = false }) => matchPath({ path, end }, pathname));

/** Rendered only inside StudioLayout (authenticated routes); hidden at `lg` where the sidebar takes over. */
export default function MobileBottomNav() {
  const { pathname } = useLocation();
  const keyboardOpen = useVirtualKeyboardOpen();

  useEffect(() => {
    const root = document.documentElement;
    root.classList.add('has-bottom-nav');
    return () => root.classList.remove('has-bottom-nav', 'keyboard-open');
  }, []);

  useEffect(() => {
    document.documentElement.classList.toggle('keyboard-open', keyboardOpen);
  }, [keyboardOpen]);

  return (
    <nav className="mobile-bottom-nav lg:hidden" aria-label="Primary" data-hidden={keyboardOpen || undefined}>
      <ul className="grid grid-cols-5 h-16 max-w-lg mx-auto">
        {ITEMS.map(({ to, label, icon: Icon, primary, match }) => {
          const active = isActive(pathname, match);
          if (primary) {
            return (
              <li key={to} className="flex justify-center">
                <Link
                  to={to}
                  aria-label="Upload video"
                  aria-current={active ? 'page' : undefined}
                  className="mobile-bottom-nav-item"
                >
                  <span className="mobile-bottom-nav-fab" data-active={active || undefined}>
                    <Icon className="w-6 h-6" strokeWidth={2.5} aria-hidden />
                  </span>
                  <span className={`text-[11px] leading-none ${active ? 'font-semibold text-[var(--foreground)]' : 'app-muted font-medium'}`}>
                    {label}
                  </span>
                </Link>
              </li>
            );
          }
          return (
            <li key={to} className="flex justify-center">
              <Link
                to={to}
                aria-current={active ? 'page' : undefined}
                className="mobile-bottom-nav-item"
                data-active={active || undefined}
              >
                <span className="mobile-bottom-nav-indicator" aria-hidden />
                <Icon className="w-[22px] h-[22px]" strokeWidth={active ? 2.4 : 2} aria-hidden />
                <span className="text-[11px] leading-none">{label}</span>
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
