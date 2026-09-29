import { useEffect, useRef, useState } from 'react';

const VIDEO_SRC = '/videos/mastplayer-promo.mp4';
const POSTER_SRC = '/videos/mastplayer-promo-poster.jpg';

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

export default function HeroVideo() {
  const videoRef = useRef(null);
  const [reduceMotion] = useState(prefersReducedMotion);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || reduceMotion) return undefined;

    // iOS only autoplays when `muted` is set as a property before play().
    video.muted = true;
    const play = () => video.play().catch(() => {});

    if (!('IntersectionObserver' in window)) {
      play();
      return undefined;
    }
    const observer = new IntersectionObserver(
      ([entry]) => (entry.isIntersecting ? play() : video.pause()),
      { threshold: 0.25 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, [reduceMotion]);

  return (
    <div className="rounded-2xl border border-[var(--border)] bg-[#05070d] overflow-hidden shadow-[0_32px_80px_-40px_var(--glow-cyan)] w-full max-w-full">
      <div className="relative aspect-video w-full">
        {reduceMotion ? (
          <img
            src={POSTER_SRC}
            alt="MastPlayer Studio upload screen"
            className="absolute inset-0 h-full w-full object-cover"
          />
        ) : (
          <video
            ref={videoRef}
            className="absolute inset-0 h-full w-full object-cover"
            src={VIDEO_SRC}
            poster={POSTER_SRC}
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            disablePictureInPicture
            aria-label="MastPlayer tour: upload a video, share the link, earn from views and withdraw to your bank"
          />
        )}
      </div>
    </div>
  );
}
