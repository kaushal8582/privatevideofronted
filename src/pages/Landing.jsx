import { Link } from 'react-router-dom';
import { BarChart3, Link2, Smartphone, Upload } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';

export default function Landing() {
  const { isAuthenticated } = useAuth();

  return (
    <div>
      {/* Hero — brand-first, one composition, full bleed */}
      <section className="relative min-h-[min(94vh,900px)] overflow-hidden">
        <div
          className="pointer-events-none absolute inset-0"
          aria-hidden
          style={{
            background:
              'radial-gradient(ellipse 85% 65% at 85% 15%, rgba(45,212,191,0.22) 0%, transparent 55%), radial-gradient(ellipse 50% 45% at 5% 90%, rgba(15,118,110,0.12) 0%, transparent 50%), linear-gradient(165deg, #f3f7f6 0%, #e8f2ef 48%, #dcebe7 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[55%] opacity-90"
          aria-hidden
          style={{
            background:
              'linear-gradient(180deg, transparent 0%, rgba(11,31,28,0.04) 40%, rgba(11,31,28,0.88) 100%)',
          }}
        />
        <div
          className="pointer-events-none absolute -right-16 sm:right-0 top-[18%] w-[min(92vw,560px)] aspect-[9/16] max-h-[70vh] rounded-[2rem] border border-white/30 shadow-[0_40px_100px_-30px_rgba(11,31,28,0.45)] overflow-hidden animate-[floatSoft_7s_ease-in-out_infinite] hidden md:block"
          aria-hidden
          style={{
            background:
              'linear-gradient(160deg, #0f766e 0%, #0b1f1c 42%, #134e4a 100%)',
          }}
        >
          <div className="absolute inset-0 opacity-40 bg-[radial-gradient(circle_at_30%_20%,rgba(45,212,191,0.5),transparent_45%)]" />
          <div className="absolute inset-x-8 top-[22%] bottom-[18%] rounded-2xl border border-white/15 bg-black/25 backdrop-blur-[2px] flex flex-col items-center justify-center gap-3 px-6">
            <div className="w-14 h-14 rounded-full bg-white/15 border border-white/25 flex items-center justify-center animate-[pulseSoft_3.2s_ease-in-out_infinite]">
              <Smartphone className="w-6 h-6 text-teal-100" />
            </div>
            <p className="font-[family-name:var(--font-display)] text-white text-xl font-semibold text-center leading-tight">
              Watch in app
            </p>
            <p className="text-teal-100/70 text-xs text-center leading-relaxed">
              Web preview · App playback · Views count
            </p>
          </div>
        </div>

        <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-24 pb-24 flex flex-col justify-center min-h-[min(94vh,900px)]">
          <p className="font-[family-name:var(--font-display)] text-5xl sm:text-7xl md:text-[5.5rem] tracking-tight text-[#0b1f1c] leading-[0.92] mb-6 max-w-2xl font-extrabold animate-[fadeUp_0.75s_ease-out_both]">
            Mast Player
          </p>
          <h1 className="text-xl sm:text-2xl md:text-[1.75rem] font-semibold text-[#0b1f1c]/90 max-w-md mb-4 leading-snug tracking-tight animate-[fadeUp_0.75s_ease-out_0.08s_both]">
            Upload on web. Share a link. Viewers watch in the app.
          </h1>
          <p className="text-base sm:text-lg text-[#4a635e] max-w-md mb-10 leading-relaxed animate-[fadeUp_0.75s_ease-out_0.14s_both]">
            Creator Studio for uploads &amp; stats. App-only views count toward
            earnings — web is preview only.
          </p>

          <div className="flex flex-col sm:flex-row gap-3 animate-[fadeUp_0.75s_ease-out_0.2s_both]">
            {isAuthenticated ? (
              <>
                <Link
                  to="/studio/upload"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 text-white px-6 py-3.5 text-base font-semibold hover:bg-teal-700 shadow-sm"
                >
                  <Upload className="w-5 h-5" />
                  Upload a video
                </Link>
                <Link
                  to="/studio"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0b1f1c]/12 bg-white/80 backdrop-blur px-6 py-3.5 text-base font-semibold text-[#0b1f1c] hover:bg-white"
                >
                  Open Studio
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/register"
                  className="inline-flex items-center justify-center gap-2 rounded-xl bg-teal-800 text-white px-6 py-3.5 text-base font-semibold hover:bg-teal-700 shadow-sm"
                >
                  Start creating free
                </Link>
                <Link
                  to="/login"
                  className="inline-flex items-center justify-center gap-2 rounded-xl border border-[#0b1f1c]/12 bg-white/80 backdrop-blur px-6 py-3.5 text-base font-semibold text-[#0b1f1c] hover:bg-white"
                >
                  Log in
                </Link>
              </>
            )}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-28 bg-[#0b1f1c] text-white">
        <div className="max-w-6xl mx-auto">
          <p className="text-teal-300/90 text-sm font-semibold tracking-wide uppercase mb-3 animate-[fadeIn_0.6s_ease-out_both]">
            How it works
          </p>
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-bold tracking-tight mb-4 max-w-2xl">
            From upload to app views
          </h2>
          <p className="text-white/55 text-lg max-w-xl mb-14 leading-relaxed">
            Built for creators who share privately and earn when people actually
            watch in Mast Player.
          </p>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-10 lg:gap-8">
            {[
              {
                icon: Upload,
                step: '01',
                title: 'Upload in Studio',
                body: 'Sign in on the web, upload large videos in the background, and manage your library.',
              },
              {
                icon: Link2,
                step: '02',
                title: 'Share a link',
                body: 'Send mastplayer.in/v/… Anyone can open the preview — no account needed to view the page.',
              },
              {
                icon: Smartphone,
                step: '03',
                title: 'Watch in the app',
                body: 'Playback happens in Mast Player. Local device files stay ad-light for daily use.',
              },
              {
                icon: BarChart3,
                step: '04',
                title: 'Track app views',
                body: 'Only valid app watches count. See payable views and estimated earnings in Studio.',
              },
            ].map(({ icon: Icon, step, title, body }) => (
              <div key={title} className="relative">
                <p className="font-[family-name:var(--font-display)] text-teal-400/40 text-4xl font-bold mb-4">
                  {step}
                </p>
                <div className="w-11 h-11 rounded-xl bg-teal-400/15 text-teal-300 flex items-center justify-center mb-5">
                  <Icon className="w-5 h-5" />
                </div>
                <h3 className="text-lg font-semibold mb-2 tracking-tight">{title}</h3>
                <p className="text-white/55 leading-relaxed text-[15px]">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product truth */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-24">
        <div className="max-w-6xl mx-auto grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
          <div>
            <p className="text-teal-800 text-sm font-semibold tracking-wide uppercase mb-3">
              Creator Studio
            </p>
            <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-bold tracking-tight text-[#0b1f1c] mb-4">
              One place to upload, copy links, and see what paid.
            </h2>
            <p className="text-[#4a635e] text-lg leading-relaxed mb-8">
              Overview shows app views, payable views, and estimated earnings.
              Web opens never inflate your numbers — only the app does.
            </p>
            <ul className="space-y-3 text-[#0b1f1c]/85 font-medium mb-10">
              {[
                'Email or Google sign-in for creators',
                'Chunked uploads for large files',
                'Per-video view & payable stats',
                'Share links that deep-link into the app',
              ].map((item) => (
                <li key={item} className="flex gap-3 items-start">
                  <span className="mt-1.5 h-2 w-2 rounded-full bg-teal-700 shrink-0" />
                  <span>{item}</span>
                </li>
              ))}
            </ul>
            <Link
              to={isAuthenticated ? '/studio' : '/register'}
              className="inline-flex items-center justify-center rounded-xl bg-teal-800 text-white px-6 py-3.5 text-base font-semibold hover:bg-teal-700"
            >
              {isAuthenticated ? 'Go to Studio' : 'Create creator account'}
            </Link>
          </div>

          <div
            className="relative rounded-[1.75rem] overflow-hidden border border-[#d5e2de] shadow-[0_28px_80px_-36px_rgba(11,31,28,0.35)] min-h-[320px] sm:min-h-[400px] animate-[fadeUp_0.8s_ease-out_0.1s_both]"
            style={{
              background:
                'linear-gradient(145deg, #ffffff 0%, #eef6f4 45%, #d8ebe6 100%)',
            }}
          >
            <div className="absolute inset-0 p-6 sm:p-8 flex flex-col justify-end gap-4">
              <div className="rounded-2xl bg-[#0b1f1c] text-white p-5 shadow-lg">
                <p className="text-teal-300/80 text-xs font-semibold uppercase tracking-wider mb-2">
                  Est. earnings
                </p>
                <p className="font-[family-name:var(--font-display)] text-4xl font-bold tracking-tight">
                  From app views
                </p>
                <p className="mt-2 text-white/50 text-sm leading-relaxed">
                  Payable views update when someone watches long enough in the
                  app — not from a browser preview.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div className="rounded-2xl bg-white/90 border border-[#d5e2de] p-4">
                  <p className="text-xs font-semibold text-[#4a635e] uppercase tracking-wide">
                    App views
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-[#0b1f1c]">
                    Counted
                  </p>
                </div>
                <div className="rounded-2xl bg-white/90 border border-[#d5e2de] p-4">
                  <p className="text-xs font-semibold text-[#4a635e] uppercase tracking-wide">
                    Web preview
                  </p>
                  <p className="mt-1 font-[family-name:var(--font-display)] text-2xl font-bold text-[#0b1f1c]">
                    No count
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="px-4 sm:px-6 lg:px-8 py-20 sm:py-24 bg-[#0b1f1c]">
        <div className="max-w-3xl mx-auto text-center">
          <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-5xl font-bold tracking-tight text-white mb-4">
            Ready to share your next video?
          </h2>
          <p className="text-white/55 text-lg mb-8 leading-relaxed">
            Free creator account on the web. Viewers install Mast Player to
            watch — and those views are the ones that matter.
          </p>
          {!isAuthenticated ? (
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link
                to="/register"
                className="inline-flex items-center justify-center rounded-xl bg-teal-500 text-[#0b1f1c] px-7 py-3.5 text-base font-bold hover:bg-teal-400"
              >
                Create account
              </Link>
              <Link
                to="/login"
                className="inline-flex items-center justify-center rounded-xl border border-white/20 text-white px-7 py-3.5 text-base font-semibold hover:bg-white/5"
              >
                Log in
              </Link>
            </div>
          ) : (
            <Link
              to="/studio"
              className="inline-flex items-center justify-center rounded-xl bg-teal-500 text-[#0b1f1c] px-7 py-3.5 text-base font-bold hover:bg-teal-400"
            >
              Open Studio
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
