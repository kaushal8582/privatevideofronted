import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LayoutDashboard, LogIn } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#d5e2de]/80 bg-[#f3f7f6]/90 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="group flex items-center gap-2.5 min-w-0">
          <img
            src="/favicon.png"
            alt=""
            className="w-8 h-8 rounded-lg object-cover shrink-0"
            width={32}
            height={32}
          />
          <span className="font-[family-name:var(--font-display)] text-xl sm:text-2xl font-bold tracking-tight text-[#0b1f1c] group-hover:text-teal-800 transition-colors">
            Mast Player
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {isAuthenticated ? (
            <>
              <NavLink
                to="/studio"
                className={({ isActive }) =>
                  [
                    'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
                    isActive
                      ? 'bg-teal-800 text-white'
                      : 'text-slate-700 hover:bg-white/80 hover:text-teal-800',
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
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-white/80 hover:text-teal-800"
              >
                Log out
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-white/80 hover:text-teal-800"
              >
                <LogIn className="w-4 h-4" aria-hidden />
                Log in
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-semibold bg-teal-800 text-white hover:bg-teal-700"
              >
                Sign up
              </Link>
            </>
          )}
        </nav>
      </div>
    </header>
  );
}
