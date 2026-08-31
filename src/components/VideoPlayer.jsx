export default function VideoPlayer({ src, title, poster }) {
  if (!src) {
    return (
      <div className="aspect-video rounded-2xl bg-[var(--surface)] border border-[var(--border)] flex items-center justify-center app-muted">
        No video source
      </div>
    );
  }

  return (
    <div className="w-full max-w-full overflow-hidden rounded-2xl bg-black border border-[var(--border-green)]">
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
