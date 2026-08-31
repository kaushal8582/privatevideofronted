import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { NAV_LINKS } from '../../constants/landing.js';
import { useAuth } from '../../context/AuthContext.jsx';
import ThemeToggle from '../ThemeToggle.jsx';

function scrollToHash(href) {
  if (!href.startsWith('#')) return;
  const id = href.slice(1);
  if (id === 'top') {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    return;
  }
  document.getElementById(id)?.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

export default function LandingNavbar() {
  const { isAuthenticated } = useAuth();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [open]);

  const navClick = (href) => {
    setOpen(false);
    scrollToHash(href);
  };

  return (
    <header
      className={[
        'sticky top-0 z-50 transition-all duration-300',
        scrolled ? 'app-nav-scrolled' : 'bg-transparent',
      ].join(' ')}
    >
      <div className="landing-container px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between gap-4">
        <Link to="/" className="flex items-center gap-2.5 min-w-0 group" onClick={() => navClick('#top')}>
          <img
            src="/favicon.png"
            alt=""
            className="w-8 h-8 rounded-lg object-cover"
            width={32}
            height={32}
          />
          <span className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-bold text-[var(--foreground)] group-hover:text-[var(--primary)] transition-colors">
            MastPlayer
          </span>
        </Link>

        <nav className="hidden lg:flex items-center gap-1" aria-label="Primary">
          {NAV_LINKS.map(({ label, href }) => (
            <button
              key={href}
              type="button"
              onClick={() => navClick(href)}
              className="px-3 py-2 text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] transition-colors rounded-lg focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[var(--primary)]"
            >
              {label}
            </button>
          ))}
        </nav>

        <div className="hidden lg:flex items-center gap-2">
          <ThemeToggle />
          {isAuthenticated ? (
            <Link
              to="/studio"
              className="inline-flex items-center rounded-xl app-gradient-bg text-white px-4 py-2 text-sm font-bold hover:brightness-110 transition-all"
            >
              Open Studio
            </Link>
          ) : (
            <>
              <Link
                to="/login"
                className="inline-flex items-center px-4 py-2 text-sm font-semibold text-[var(--muted)] hover:text-[var(--foreground)] transition-colors rounded-lg"
              >
                Sign In
              </Link>
              <Link
                to="/register"
                className="inline-flex items-center rounded-xl app-gradient-bg text-white px-4 py-2 text-sm font-bold hover:brightness-110 transition-all"
              >
                Get Started
              </Link>
            </>
          )}
        </div>

        <div className="lg:hidden flex items-center gap-2">
          <ThemeToggle />
          <button
            type="button"
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-[var(--border)] text-[var(--foreground)]"
            aria-expanded={open}
            aria-controls="landing-mobile-nav"
            aria-label={open ? 'Close menu' : 'Open menu'}
            onClick={() => setOpen((v) => !v)}
          >
            {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {open ? (
        <nav
          id="landing-mobile-nav"
          className="lg:hidden border-t border-[var(--border)] bg-[var(--surface)] px-4 py-4 space-y-1"
          aria-label="Mobile"
        >
          {NAV_LINKS.map(({ label, href }) => (
            <button
              key={href}
              type="button"
              onClick={() => navClick(href)}
              className="w-full text-left px-3 py-3 rounded-lg text-sm font-medium text-[var(--muted)] hover:text-[var(--foreground)] hover:bg-[var(--surface-elevated)]"
            >
              {label}
            </button>
          ))}
          <div className="pt-3 flex flex-col gap-2">
            {isAuthenticated ? (
              <Link
                to="/studio"
                className="inline-flex items-center justify-center rounded-xl app-gradient-bg text-white px-4 py-3 text-sm font-bold"
                onClick={() => setOpen(false)}
              >
                Open Studio
              </Link>
            ) : (
              <>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center rounded-xl border border-[var(--border)] px-4 py-3 text-sm font-semibold"
                  onClick={() => setOpen(false)}
                >
                  Sign In
                </Link>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center rounded-xl app-gradient-bg text-white px-4 py-3 text-sm font-bold"
                  onClick={() => setOpen(false)}
                >
                  Get Started
                </Link>
              </>
            )}
          </div>
        </nav>
      ) : null}
    </header>
  );
}
