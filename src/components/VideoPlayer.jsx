export default function VideoPlayer({ src, title, poster }) {
  if (!src) {
    return (
      <div className="aspect-video rounded-2xl bg-[#0c1222] flex items-center justify-center text-white/70">
        No video source
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl bg-black shadow-lg ring-1 ring-black/10">
      <video
        key={src}
        controls
        playsInline
        preload="metadata"
        poster={poster || undefined}
        className="w-full max-h-[70vh] bg-black"
        title={title}
      >
        <source src={src} />
        Your browser does not support the video tag.
      </video>
    </div>
  );
}
