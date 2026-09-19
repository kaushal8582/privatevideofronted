import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import ThemeToggle from './ThemeToggle.jsx';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="app-nav">
      <div className="app-container px-4 sm:px-6 lg:px-8 h-14 sm:h-16 flex items-center justify-between gap-2 sm:gap-4">
        <Link to="/" className="group flex items-center gap-2 sm:gap-2.5 min-w-0">
          <img
            src="/favicon.png"
            alt=""
            className="w-7 h-7 sm:w-8 sm:h-8 rounded-lg object-cover shrink-0"
            width={32}
            height={32}
          />
          <span className="font-[family-name:var(--font-display)] text-lg sm:text-2xl font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors truncate">
            MastPlayer
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2 shrink-0">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <NavLink
                to="/studio"
                className={({ isActive }) =>
                  [
                    'inline-flex items-center gap-2 px-2.5 sm:px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'app-nav-active'
                      : 'text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)]',
                  ].join(' ')
                }
              >
                {user?.avatar ? (
                  <img
                    src={user.avatar}
                    alt=""
                    className="w-5 h-5 rounded-full object-cover"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <LayoutDashboard className="w-4 h-4" aria-hidden />
                )}
                <span className="hidden sm:inline">Studio</span>
              </NavLink>
              <button type="button" onClick={handleLogout} className="app-btn-ghost px-2.5 sm:px-3 py-2 text-sm">
                Log out
              </button>
            </>
          ) : (
            <>
              {/* <Link
                to="/login"
                className="inline-flex items-center gap-1.5 rounded-lg px-2.5 sm:px-3 py-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface)] transition-colors"
              >
                <LogIn className="w-4 h-4" aria-hidden />
                <span className="hidden sm:inline">Log in</span>
              </Link> */}
              {/* <Link
                to="/register"
                className="inline-flex items-center rounded-xl app-gradient-bg text-white px-3 sm:px-4 py-2 text-sm font-bold hover:brightness-110 transition-all"
              >
                Sign up
              </Link> */}
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
