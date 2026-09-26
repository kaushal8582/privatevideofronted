import { Link, useLocation, useNavigate } from 'react-router-dom';
import FooterSocialLinks from '../FooterSocialLinks.jsx';
import { APP_STORE_URL, PLAY_STORE_URL } from '../../constants/landing.js';

function FooterLink({ to, children }) {
  return (
    <Link
      to={to}
      className="text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors"
    >
      {children}
    </Link>
  );
}

function FooterText({ children }) {
  return <span className="text-sm text-[var(--muted)]/70">{children}</span>;
}

function SectionTitle({ children }) {
  return (
    <p className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-3 sm:mb-4">
      {children}
    </p>
  );
}

/** Smooth-scroll on home; otherwise go to landing hash. */
function HomeSectionButton({ sectionId, children }) {
  const location = useLocation();
  const navigate = useNavigate();

  return (
    <button
      type="button"
      className="text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors text-left"
      onClick={() => {
        if (location.pathname === '/') {
          document.getElementById(sectionId)?.scrollIntoView({ behavior: 'smooth' });
          return;
        }
        navigate(`/#${sectionId}`);
      }}
    >
      {children}
    </button>
  );
}

function GooglePlayBadge({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 hover:border-[var(--primary)]/50 transition-colors"
      aria-label="Get it on Google Play"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0" aria-hidden>
        <path
          fill="#EA4335"
          d="M3.6 2.2c-.4.2-.6.6-.6 1v17.6c0 .4.2.8.6 1l9.7-9.8L3.6 2.2z"
        />
        <path fill="#FBBC04" d="M16.1 14.5 13.3 11.8 3.6 21.8c.2.1.4.2.6.2.3 0 .6-.1.9-.3l11-7.2z" />
        <path fill="#4285F4" d="M20.5 10.7 16.1 7.9 13.3 10.7l2.8 2.8 4.4-2.8c.7-.4.7-1.4 0-1.8z" />
        <path fill="#34A853" d="M3.6 2.2 13.3 12l2.8-2.8L5.1 2.3C4.8 2.1 4.5 2 4.2 2c-.2 0-.4.1-.6.2z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[9px] uppercase tracking-wide text-[var(--muted)]">Get it on</span>
        <span className="block text-sm font-semibold text-[var(--foreground)]">Google Play</span>
      </span>
    </a>
  );
}

function AppStoreBadge({ href }) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex items-center gap-2 rounded-lg border border-[var(--border)] bg-[var(--background)] px-3 py-2 hover:border-[var(--primary)]/50 transition-colors"
      aria-label="Download on the App Store"
    >
      <svg viewBox="0 0 24 24" className="w-6 h-6 shrink-0 fill-[var(--foreground)]" aria-hidden>
        <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.81-.91.65.03 2.47.26 3.64 1.98-.09.06-2.17 1.28-2.15 3.81.03 3.02 2.65 4.03 2.68 4.04-.03.07-.42 1.44-1.38 2.83M13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z" />
      </svg>
      <span className="text-left leading-tight">
        <span className="block text-[9px] uppercase tracking-wide text-[var(--muted)]">Download on the</span>
        <span className="block text-sm font-semibold text-[var(--foreground)]">App Store</span>
      </span>
    </a>
  );
}

export default function LandingFooter() {
  const playStoreUrl = PLAY_STORE_URL;
  const appStoreUrl = APP_STORE_URL;
  const showGetApp = Boolean(playStoreUrl || appStoreUrl);

  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="landing-container px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div
          className={`grid grid-cols-2 gap-8 sm:gap-10 mb-10 sm:mb-12 ${
            showGetApp ? 'lg:grid-cols-5' : 'lg:grid-cols-4'
          }`}
        >
          <div className="col-span-2">
            <Link to="/" className="inline-flex items-center gap-2 mb-4">
              <img src="/favicon.png" alt="" className="w-8 h-8 rounded-lg" width={32} height={32} />
              <span className="font-[family-name:var(--font-display)] text-lg sm:text-xl font-bold text-[var(--foreground)]">
                MastPlayer
              </span>
            </Link>
            <p className="text-sm text-[var(--muted)] max-w-xs leading-relaxed mb-4">
              Upload videos, share a link, and reach viewers on web and Android with Creator Studio.
            </p>
            <FooterSocialLinks />
          </div>

          <div>
            <SectionTitle>Product</SectionTitle>
            <ul className="space-y-2">
              <li>
                <HomeSectionButton sectionId="features">Features</HomeSectionButton>
              </li>
              <li>
                <FooterLink to="/register">Upload</FooterLink>
              </li>
              <li>
                <HomeSectionButton sectionId="analytics">Analytics</HomeSectionButton>
              </li>
            </ul>
          </div>

          <div>
            <SectionTitle>Resources</SectionTitle>
            <ul className="space-y-2">
              <li>
                <FooterText>About</FooterText>
              </li>
              <li>
                <FooterLink to="/contact">Contact</FooterLink>
              </li>
              <li>
                <FooterText>Help</FooterText>
              </li>
              <li>
                <HomeSectionButton sectionId="faq">FAQ</HomeSectionButton>
              </li>
            </ul>
          </div>

          {showGetApp ? (
            <div className="col-span-2 sm:col-span-1">
              <SectionTitle>Get the App</SectionTitle>
              <div className="flex flex-col gap-2.5">
                {playStoreUrl ? <GooglePlayBadge href={playStoreUrl} /> : null}
                {appStoreUrl ? <AppStoreBadge href={appStoreUrl} /> : null}
              </div>
            </div>
          ) : null}
        </div>

        <div className="pt-6 sm:pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <p className="text-sm text-[var(--muted)]">
            © {new Date().getFullYear()} MastPlayer. All rights reserved.
          </p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/terms">Terms of Service</FooterLink>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/dmca">DMCA / Copyright</FooterLink>
          </div>
        </div>
      </div>
    </footer>
  );
}
