import { Link } from 'react-router-dom';
import FooterSocialLinks from '../FooterSocialLinks.jsx';

function FooterLink({ to, children }) {
  return (
    <Link to={to} className="text-sm text-[var(--muted)] hover:text-[var(--primary)] transition-colors">
      {children}
    </Link>
  );
}

function FooterText({ children }) {
  return <span className="text-sm text-[var(--muted)]/70">{children}</span>;
}

export default function LandingFooter() {
  return (
    <footer className="border-t border-[var(--border)] bg-[var(--surface)]">
      <div className="landing-container px-4 sm:px-6 lg:px-8 py-10 sm:py-12 lg:py-16">
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-5 gap-8 sm:gap-10 mb-10 sm:mb-12">
          <div className="col-span-2 lg:col-span-2">
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
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-3 sm:mb-4">Product</p>
            <ul className="space-y-2">
              <li><button type="button" onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-[var(--muted)] hover:text-[var(--primary)]">Features</button></li>
              <li><FooterLink to="/register">Upload</FooterLink></li>
              <li><button type="button" onClick={() => document.getElementById('analytics')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-[var(--muted)] hover:text-[var(--primary)]">Analytics</button></li>
            </ul>
          </div>

          <div>
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-3 sm:mb-4">Company</p>
            <ul className="space-y-2">
              <li><FooterText>About</FooterText></li>
              <li><FooterLink to="/contact">Contact</FooterLink></li>
            </ul>
          </div>

          <div className="col-span-2 sm:col-span-1">
            <p className="text-xs font-bold uppercase tracking-wider text-[var(--foreground)] mb-3 sm:mb-4">Resources</p>
            <ul className="space-y-2">
              <li><FooterText>Help</FooterText></li>
              <li>
                <button type="button" onClick={() => document.getElementById('faq')?.scrollIntoView({ behavior: 'smooth' })} className="text-sm text-[var(--muted)] hover:text-[var(--primary)]">
                  FAQ
                </button>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-6 sm:pt-8 border-t border-[var(--border)] flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 sm:gap-4">
          <p className="text-sm text-[var(--muted)]">© 2026 MastPlayer. All rights reserved.</p>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2">
            <FooterLink to="/contact">Contact</FooterLink>
            <FooterLink to="/privacy">Privacy Policy</FooterLink>
            <FooterLink to="/dmca">DMCA / Copyright</FooterLink>
            <FooterText>Terms</FooterText>
          </div>
        </div>
      </div>
    </footer>
  );
}
