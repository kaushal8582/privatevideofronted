import { NavLink, Link, useNavigate } from 'react-router-dom';
import { LogOut, Upload, Video } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

const linkClass = ({ isActive }) =>
  [
    'inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors',
    isActive
      ? 'bg-teal-800 text-white'
      : 'text-slate-700 hover:bg-white/80 hover:text-teal-800',
  ].join(' ');

export default function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  return (
    <header className="sticky top-0 z-40 border-b border-[#e6e1d8]/80 bg-[#f7f5f1]/85 backdrop-blur-md">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="group flex items-baseline gap-2 min-w-0">
          <span className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl tracking-tight text-[#0c1222] group-hover:text-teal-800 transition-colors">
            Mast Player
          </span>
        </Link>

        <nav className="flex items-center gap-1 sm:gap-2">
          {isAuthenticated ? (
            <>
              <NavLink to="/upload" className={linkClass}>
                <Upload className="w-4 h-4" aria-hidden />
                <span className="hidden sm:inline">Upload</span>
              </NavLink>
              <NavLink to="/videos" className={linkClass}>
                <Video className="w-4 h-4" aria-hidden />
                <span className="hidden sm:inline">My Videos</span>
              </NavLink>
              <span className="hidden md:inline text-sm text-[#5b657a] px-2 max-w-[10rem] truncate">
                {user?.name || user?.email}
              </span>
              <button
                type="button"
                onClick={handleLogout}
                className="inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-white/80 hover:text-teal-800"
              >
                <LogOut className="w-4 h-4" aria-hidden />
                <span className="hidden sm:inline">Log out</span>
              </button>
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center px-3 py-2 rounded-lg text-sm font-medium text-slate-700 hover:bg-white/80 hover:text-teal-800"
              >
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
