import { useEffect, useRef, useState } from 'react';
import { Film } from 'lucide-react';

/**
 * Shows a server thumbnail when available, otherwise captures the first video frame client-side.
 */
export default function VideoThumbnail({ thumbnailUrl, videoUrl, title, className = '' }) {
  const videoRef = useRef(null);
  const [frameUrl, setFrameUrl] = useState(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    if (thumbnailUrl || !videoUrl) return undefined;

    const video = document.createElement('video');
    video.crossOrigin = 'anonymous';
    video.preload = 'metadata';
    video.muted = true;
    video.playsInline = true;
    video.src = videoUrl;

    const capture = () => {
      try {
        const canvas = document.createElement('canvas');
        canvas.width = video.videoWidth || 640;
        canvas.height = video.videoHeight || 360;
        const ctx = canvas.getContext('2d');
        if (!ctx || !video.videoWidth) return;
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        setFrameUrl(canvas.toDataURL('image/jpeg', 0.82));
      } catch {
        setFailed(true);
      }
    };

    video.addEventListener('loadeddata', () => {
      video.currentTime = Math.min(0.5, video.duration || 0.5);
    });
    video.addEventListener('seeked', capture);
    video.addEventListener('error', () => setFailed(true));

    return () => {
      video.pause();
      video.removeAttribute('src');
      video.load();
    };
  }, [thumbnailUrl, videoUrl]);

  const src = thumbnailUrl || frameUrl;

  if (src && !failed) {
    return (
      <img
        src={src}
        alt=""
        className={`w-full h-full object-cover transition-transform duration-300 group-hover:scale-[1.03] ${className}`}
        loading="lazy"
        onError={() => setFailed(true)}
      />
    );
  }

  return (
    <div className={`absolute inset-0 flex items-center justify-center text-teal-800/40 ${className}`}>
      <Film className="w-12 h-12" />
      <video ref={videoRef} className="hidden" />
    </div>
  );
}
