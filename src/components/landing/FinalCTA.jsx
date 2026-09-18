import { Link } from 'react-router-dom';
import { Upload } from 'lucide-react';
import Reveal from './Reveal.jsx';
import { useAuth } from '../../context/AuthContext.jsx';

export default function FinalCTA() {
  const { isAuthenticated } = useAuth();
  const uploadTo = isAuthenticated ? '/studio/upload' : '/register';

  const scrollFeatures = () => {
    document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <section className="landing-section px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-24">
      <div className="landing-container">
        <Reveal>
          <div className="relative rounded-2xl sm:rounded-3xl border border-[var(--border-green)] bg-[var(--surface-elevated)] px-4 sm:px-8 lg:px-12 py-10 sm:py-12 lg:py-16 text-center overflow-hidden">
            <div className="pointer-events-none absolute inset-0 landing-cta-glow" aria-hidden />
            <div className="relative min-w-0">
              <h2 className="landing-heading mb-3 sm:mb-4">
                Ready to Share Your First Video?
              </h2>
              <p className="text-sm sm:text-base text-[var(--muted)] max-w-xl mx-auto mb-6 sm:mb-8 leading-relaxed">
                Upload your content, generate your MastPlayer link and start sharing.
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <Link
                  to={uploadTo}
                  className="inline-flex items-center justify-center gap-2 w-full sm:w-auto rounded-xl app-gradient-bg text-white px-7 py-3.5 text-base font-bold hover:brightness-110 transition-all"
                >
                  <Upload className="w-5 h-5 shrink-0" />
                  Upload Video
                </Link>
                <button
                  type="button"
                  onClick={scrollFeatures}
                  className="inline-flex items-center justify-center w-full sm:w-auto rounded-xl border border-[var(--border)] px-7 py-3.5 text-base font-semibold text-[var(--foreground)] hover:border-[var(--border-green)] transition-colors"
                >
                  Explore Features
                </button>
              </div>
            </div>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
