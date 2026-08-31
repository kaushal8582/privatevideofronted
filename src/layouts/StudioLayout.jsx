import { NavLink, Outlet, Link, useNavigate } from 'react-router-dom';
import {
  LayoutDashboard,
  Video,
  Upload,
  UserRound,
  LogOut,
  Menu,
  X,
  Gift,
  Sparkles,
} from 'lucide-react';
import { useState } from 'react';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from '../components/ThemeToggle.jsx';

const nav = [
  { to: '/studio', end: true, label: 'Overview', icon: LayoutDashboard },
  { to: '/studio/videos', label: 'Videos', icon: Video },
  { to: '/studio/upload', label: 'Upload', icon: Upload },
  { to: '/studio/referrals', label: 'Referrals', icon: Gift },
  { to: '/studio/og-earn', label: 'OG Earn', icon: Sparkles },
  { to: '/studio/profile', label: 'Profile', icon: UserRound },
];

const linkClass = ({ isActive }) =>
  [
    'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
    isActive
      ? 'app-nav-active'
      : 'text-[var(--muted)] hover:bg-[var(--surface-elevated)] hover:text-[var(--foreground)]',
  ].join(' ');

export default function StudioLayout() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const Sidebar = (
    <div className="flex h-full flex-col">
      <div className="px-5 pt-6 pb-5 border-b border-[var(--border)]">
        <Link to="/" className="block group">
          <p className="font-[family-name:var(--font-display)] text-2xl text-[var(--foreground)] tracking-tight group-hover:text-[var(--primary)] transition-colors">
            MastPlayer
          </p>
          <p className="text-[11px] uppercase tracking-[0.18em] app-muted mt-1 font-semibold">
            Creator Studio
          </p>
        </Link>
      </div>

      <nav className="flex-1 px-3 py-4 space-y-1">
        {nav.map(({ to, end, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            end={end}
            className={linkClass}
            onClick={() => setMobileOpen(false)}
          >
            <Icon className="w-4 h-4 shrink-0" aria-hidden />
            {label}
          </NavLink>
        ))}
      </nav>

      <div className="px-4 py-4 border-t border-[var(--border)] space-y-3">
        <div className="flex items-center gap-3 min-w-0">
          {user?.avatar ? (
            <img
              src={user.avatar}
              alt=""
              className="w-9 h-9 rounded-xl object-cover border border-[var(--border)]"
              referrerPolicy="no-referrer"
            />
          ) : (
            <div className="w-9 h-9 rounded-xl bg-[var(--accent-medium)] text-[var(--primary)] flex items-center justify-center text-sm font-semibold">
              {(user?.name || '?').charAt(0).toUpperCase()}
            </div>
          )}
          <div className="min-w-0">
            <p className="text-sm font-semibold text-[var(--foreground)] truncate">{user?.name}</p>
            <p className="text-xs app-muted truncate">{user?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <ThemeToggle className="shrink-0" />
          <button type="button" onClick={handleLogout} className="app-btn-ghost flex-1">
            <LogOut className="w-4 h-4" />
            Log out
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="app-shell min-h-screen bg-[var(--background)] text-[var(--foreground)]">
      <aside className="hidden lg:fixed lg:inset-y-0 lg:left-0 lg:flex lg:w-64 lg:flex-col bg-[var(--sidebar)] border-r border-[var(--border)]">
        {Sidebar}
      </aside>

      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-50">
          <button
            type="button"
            className="absolute inset-0 bg-black/60"
            aria-label="Close menu"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute inset-y-0 left-0 w-[min(18rem,88vw)] bg-[var(--sidebar)] border-r border-[var(--border)] shadow-xl">
            <button
              type="button"
              className="absolute top-4 right-4 app-muted hover:text-[var(--foreground)]"
              onClick={() => setMobileOpen(false)}
              aria-label="Close"
            >
              <X className="w-5 h-5" />
            </button>
            {Sidebar}
          </aside>
        </div>
      )}

      <div className="lg:pl-64 min-h-screen flex flex-col">
        <header className="sticky top-0 z-30 border-b border-[var(--border)] bg-[var(--nav-backdrop)] backdrop-blur-md lg:hidden">
          <div className="flex items-center justify-between px-4 h-14">
            <button
              type="button"
              onClick={() => setMobileOpen(true)}
              className="inline-flex items-center justify-center w-10 h-10 rounded-xl border border-[var(--border)] bg-[var(--surface)]"
              aria-label="Open menu"
            >
              <Menu className="w-5 h-5" />
            </button>
            <p className="font-[family-name:var(--font-display)] text-xl">Studio</p>
            <ThemeToggle />
          </div>
        </header>

        <main className="flex-1 px-4 sm:px-6 lg:px-8 py-6 sm:py-8 max-w-6xl w-full mx-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}
