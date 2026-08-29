import { Link } from 'react-router-dom';
import { Link2, Play, Shield, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div className="-mx-4 sm:-mx-6 -mt-8 sm:-mt-12">
      {/* Hero — one composition */}
      <section className="relative min-h-[min(92vh,880px)] overflow-hidden px-4 sm:px-6">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 90% 70% at 70% 20%, rgba(15,118,110,0.18) 0%, transparent 55%), radial-gradient(ellipse 60% 50% at 10% 80%, rgba(245,158,11,0.12) 0%, transparent 50%), linear-gradient(180deg, #f7f5f1 0%, #eef6f3 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute -right-24 top-24 h-[420px] w-[420px] rounded-full opacity-40 blur-3xl"
          style={{ background: 'linear-gradient(135deg, #99f6e4, #5eead4)' }}
          aria-hidden
        />

        <div className="relative max-w-6xl mx-auto pt-16 sm:pt-24 pb-20 flex flex-col justify-center min-h-[min(92vh,880px)]">
          <p className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl md:text-8xl tracking-tight text-[#0c1222] leading-[0.95] mb-6 max-w-3xl animate-[fadeUp_0.7s_ease-out_both]">
            Mast Player
          </p>
          <h1 className="text-xl sm:text-2xl md:text-3xl font-medium text-[#0c1222]/90 max-w-xl mb-4 leading-snug animate-[fadeUp_0.7s_ease-out_0.08s_both]">
            Upload once. Share a link. Play anywhere.
          </h1>
          <p className="text-base sm:text-lg text-[#5b657a] max-w-lg mb-10 animate-[fadeUp_0.7s_ease-out_0.14s_both]">
            Private library for your videos — public share links for anyone you invite.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 animate-[fadeUp_0.7s_ease-out_0.2s_both]">
            {isAuthenticated ? (
              <>
                <Link
                  to="/upload"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 text-white px-6 py-3.5 text-base font-semibold hover:bg-teal-700 shadow-sm"
                >
                  <Upload className="w-5 h-5" />
                  Upload a video
                </Link>
                <Link
                  to="/videos"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0c1222]/15 bg-white/70 backdrop-blur px-6 py-3.5 text-base font-semibold text-[#0c1222] hover:bg-white"
                >
                  My videos
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 text-white px-6 py-3.5 text-base font-semibold hover:bg-teal-700 shadow-sm"
                >
                  Get started free
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0c1222]/15 bg-white/70 backdrop-blur px-6 py-3.5 text-base font-semibold text-[#0c1222] hover:bg-white"
                >
                  Log in
                </Link>
              </>
            )}
          </div>

          <div className="mt-16 sm:mt-20 max-w-2xl animate-[fadeUp_0.7s_ease-out_0.28s_both]">
            <div className="relative aspect-[16/9] rounded-2xl overflow-hidden border border-[#0c1222]/08 bg-[#0c1222] shadow-[0_24px_80px_-24px_rgba(12,18,34,0.45)]">
              <div
                className="absolute inset-0 opacity-80"
                style={{
                  background:
                    'linear-gradient(145deg, #134e4a 0%, #0c1222 45%, #1e293b 100%)',
                }}
              />
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-6">
                <div className="w-16 h-16 rounded-full bg-white/15 border border-white/25 flex items-center justify-center mb-4 backdrop-blur-sm animate-[pulseSoft_3s_ease-in-out_infinite]">
                  <Play className="w-7 h-7 text-white fill-white ml-0.5" />
                </div>
                <p className="font-[family-name:var(--font-display)] text-2xl sm:text-3xl text-white/95">
                  Your clip. One link.
                </p>
                <p className="mt-2 text-sm text-white/60 max-w-sm">
                  Open in the Mast Player app to watch.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-6 py-20 sm:py-28 bg-[#0c1222] text-white">
        <div className="max-w-6xl mx-auto">
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl mb-4">
            How it works
          </h2>
          <p className="text-white/60 text-lg max-w-xl mb-14">
            Three steps from file to shareable playback — your library stays yours.
          </p>

          <div className="grid sm:grid-cols-3 gap-10 sm:gap-8">
            {[
              {
                icon: Upload,
                title: 'Upload',
                body: 'Sign in and drop a video. We store it securely for sharing.',
              },
              {
                icon: Link2,
                title: 'Share',
                  body: 'Copy a public link. Recipients open the preview page, then watch in Mast Player.',
              },
              {
                icon: Shield,
                title: 'Stay private',
                body: 'Only you see your library. Delete anytime from My Videos.',
              },
            ].map(({ icon: Icon, title, body }) => (
              <div key={title}>
                <div className="w-11 h-11 rounded-xl bg-teal-400/15 text-teal-300 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-xl font-semibold mb-2">{title}</h3>
                <p className="text-white/55 leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 py-20 sm:py-24">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl text-[#0c1222] mb-4">
            Ready to share?
          </h2>
          <p className="text-[#5b657a] text-lg mb-8">
            Create a free account to upload. Privacy policy is always public.
          </p>
          {!isAuthenticated && (
            <Link
              to="/register"
              className="inline-flex items-center justify-center rounded-xl bg-teal-800 text-white px-7 py-3.5 text-base font-semibold hover:bg-teal-700"
            >
              Create account
            </Link>
          )}
          {isAuthenticated && (
            <Link
              to="/upload"
              className="inline-flex items-center justify-center rounded-xl bg-teal-800 text-white px-7 py-3.5 text-base font-semibold hover:bg-teal-700"
            >
              Go to upload
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
