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
      <div className="app-container px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-2.5 min-w-0">
          <img
            src="/favicon.png"
            alt=""
            className="w-8 h-8 rounded-lg object-cover shrink-0"
            width={32}
            height={32}
          />
          <span className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold tracking-tight text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
            MastPlayer
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <>
              <NavLink
                to="/studio"
                className={({ isActive }) =>
                  [
                    'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
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
              <button type="button" onClick={handleLogout} className="app-btn-ghost px-3 py-2">
                Log out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="app-btn-ghost px-3 py-2 border-0">
                <LogIn className="w-4 h-4" aria-hidden />
                <span className="hidden sm:inline">Log in</span>
              </Link>
              <Link to="/register" className="app-btn-primary px-3 py-2">
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
