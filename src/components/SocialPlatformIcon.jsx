import { useId } from 'react';
import { Link2 } from 'lucide-react';
import { detectSocialPlatform } from '../utils/socialLinks.js';

function IconShell({ children, className = '' }) {
  return (
    <span
      className={`inline-flex h-10 w-10 items-center justify-center rounded-full border border-[var(--border)] bg-[var(--surface)] overflow-hidden ${className}`}
    >
      {children}
    </span>
  );
}

function BrandSvg({ children, viewBox = '0 0 24 24' }) {
  return (
    <svg viewBox={viewBox} className="h-5 w-5" aria-hidden>
      {children}
    </svg>
  );
}

function PlatformGlyph({ platform, gradientId }) {
  switch (platform) {
    case 'instagram':
      return (
        <BrandSvg>
          <defs>
            <radialGradient id={gradientId} cx="30%" cy="107%" r="150%">
              <stop offset="0%" stopColor="#fdf497" />
              <stop offset="5%" stopColor="#fdf497" />
              <stop offset="45%" stopColor="#fd5949" />
              <stop offset="60%" stopColor="#d6249f" />
              <stop offset="90%" stopColor="#285AEB" />
            </radialGradient>
          </defs>
          <rect width="24" height="24" rx="6" fill={`url(#${gradientId})`} />
          <path
            fill="#fff"
            d="M12 7.2A4.8 4.8 0 1 0 12 16.8 4.8 4.8 0 0 0 12 7.2Zm0 7.9a3.1 3.1 0 1 1 0-6.2 3.1 3.1 0 0 1 0 6.2Zm5.1-8.2a1.12 1.12 0 1 1-2.24 0 1.12 1.12 0 0 1 2.24 0Z"
          />
        </BrandSvg>
      );
    case 'youtube':
      return (
        <BrandSvg>
          <path
            fill="#FF0000"
            d="M23.5 6.2a3 3 0 0 0-2.1-2.1C19.5 3.5 12 3.5 12 3.5s-7.5 0-9.4.6A3 3 0 0 0 .5 6.2 31.5 31.5 0 0 0 0 12a31.5 31.5 0 0 0 .5 5.8 3 3 0 0 0 2.1 2.1c1.9.6 9.4.6 9.4.6s7.5 0 9.4-.6a3 3 0 0 0 2.1-2.1A31.5 31.5 0 0 0 24 12a31.5 31.5 0 0 0-.5-5.8Z"
          />
          <path fill="#fff" d="M9.75 15.5V8.5L15.75 12l-6 3.5Z" />
        </BrandSvg>
      );
    case 'facebook':
      return (
        <BrandSvg>
          <circle cx="12" cy="12" r="12" fill="#1877F2" />
          <path
            fill="#fff"
            d="M13.3 19.5v-6.8h2.3l.3-2.6h-2.6V8.5c0-.8.2-1.3 1.4-1.3h1.4V4.9c-.2 0-1.1-.1-2.1-.1-2.1 0-3.5 1.3-3.5 3.6v2h-2.3v2.6h2.3v6.8h2.8Z"
          />
        </BrandSvg>
      );
    case 'x':
      return (
        <BrandSvg>
          <circle cx="12" cy="12" r="12" fill="#000" />
          <path
            fill="#fff"
            d="M16.7 7h1.5l-3.3 3.8L19 17h-3.5l-2.7-3.5L9.5 17H8l3.5-4L7 7h3.6l2.5 3.2L16.7 7Zm-.5 9h.8L11.3 8h-.9l5.8 8Z"
          />
        </BrandSvg>
      );
    case 'tiktok':
      return (
        <BrandSvg>
          <circle cx="12" cy="12" r="12" fill="#010101" />
          <path
            fill="#25F4EE"
            d="M15.4 7.2c.6.7 1.4 1.2 2.3 1.4V11c-.9-.05-1.8-.3-2.6-.8v3.6c0 2.5-2 4.5-4.5 4.5S6.1 16.3 6.1 13.8s2-4.5 4.5-4.5c.2 0 .4 0 .6.05v2.2c-.2-.05-.4-.1-.6-.1-1.3 0-2.3 1-2.3 2.3s1 2.3 2.3 2.3 2.3-1 2.3-2.3V5.5h2.5c0 .6.1 1.2.3 1.7Z"
          />
          <path
            fill="#FE2C55"
            d="M15.4 7.2c.6.7 1.4 1.2 2.3 1.4V11c-.9-.05-1.8-.3-2.6-.8v3.6c0 2.5-2 4.5-4.5 4.5-.7 0-1.4-.2-2-.5.7.9 1.8 1.5 3 1.5 2.5 0 4.5-2 4.5-4.5V7.2Z"
            opacity=".85"
          />
        </BrandSvg>
      );
    case 'linkedin':
      return (
        <BrandSvg>
          <rect width="24" height="24" rx="4" fill="#0A66C2" />
          <path
            fill="#fff"
            d="M7.1 9.5H4.7V19h2.4V9.5ZM5.9 5.2a1.4 1.4 0 1 0 0 2.8 1.4 1.4 0 0 0 0-2.8ZM19.3 13c0-2.7-1.4-4-3.4-4-1.2 0-2 .5-2.4 1.1V9.5h-2.4c0 .5 0 9.5 0 9.5h2.4v-5.3c0-.3 0-.5.1-.7.2-.5.7-1 1.5-1 1.1 0 1.5.8 1.5 2V19h2.4v-6Z"
          />
        </BrandSvg>
      );
    case 'whatsapp':
      return (
        <BrandSvg>
          <circle cx="12" cy="12" r="12" fill="#25D366" />
          <path
            fill="#fff"
            d="M17.1 14.4c-.2-.1-1.4-.7-1.6-.8-.2-.1-.4-.1-.5.1-.2.2-.6.8-.7.9-.1.2-.3.2-.5.1-.2-.1-.9-.3-1.8-1.1-.7-.6-1.1-1.3-1.3-1.5-.1-.2 0-.3.1-.4.1-.1.2-.3.3-.4.1-.1.1-.2.2-.3 0-.1 0-.3-.1-.4-.1-.1-.5-1.3-.7-1.8-.2-.5-.4-.4-.5-.4h-.4c-.1 0-.4.1-.6.3-.2.2-.8.8-.8 1.9s.8 2.2.9 2.3c.1.2 1.6 2.5 3.9 3.4.5.2 1 .4 1.3.5.6.2 1.1.1 1.5.1.5-.1 1.4-.6 1.6-1.1.2-.5.2-1 .1-1.1-.1-.1-.2-.2-.4-.3Z"
          />
        </BrandSvg>
      );
    case 'telegram':
      return (
        <BrandSvg>
          <circle cx="12" cy="12" r="12" fill="#26A5E4" />
          <path
            fill="#fff"
            d="M17.6 7.3 5.9 11.8c-.8.3-.8.8-.1 1l3 1 1.2 3.5c.1.4.3.5.6.5.3 0 .4-.1.6-.3l1.7-1.7 3.5 2.6c.6.3 1.1.1 1.2-.6l2.2-10.3c.2-.8-.3-1.2-.9-.9Z"
          />
        </BrandSvg>
      );
    case 'discord':
      return (
        <BrandSvg>
          <circle cx="12" cy="12" r="12" fill="#5865F2" />
          <path
            fill="#fff"
            d="M16.6 7.5a11 11 0 0 0-2.7-.8l-.1.3c.9.2 1.6.5 2.3.9-2-.9-4.2-.9-6.2 0 .7-.4 1.4-.7 2.3-.9l-.1-.3c-.9.2-1.8.4-2.7.8-2.3 3.4-2.9 6.7-2.6 10 .9.7 1.8 1.1 2.7 1.4l.6-.9c-.4-.1-.7-.3-1.1-.5.1-.1.2-.1.3-.2 2.2 1 4.6 1 6.8 0 .1.1.2.1.3.2-.3.2-.7.4-1.1.5l.6.9c.9-.3 1.8-.7 2.7-1.4.4-3.7-.6-6.9-2.6-10ZM10.1 14.6c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3 1.1.6 1.1 1.3-.5 1.3-1.1 1.3Zm3.8 0c-.6 0-1.1-.6-1.1-1.3s.5-1.3 1.1-1.3 1.1.6 1.1 1.3-.5 1.3-1.1 1.3Z"
          />
        </BrandSvg>
      );
    case 'github':
      return (
        <BrandSvg>
          <circle cx="12" cy="12" r="12" fill="#181717" />
          <path
            fill="#fff"
            d="M12 5.2a6.8 6.8 0 0 0-2.2 13.3c.3.1.5-.2.5-.4v-1.3c-1.8.4-2.2-.8-2.2-.8-.3-.7-.7-.9-.7-.9-.6-.4 0-.4 0-.4.6 0 1 .7 1 .7.6 1 1.5.7 1.9.5.1-.4.2-.7.4-.9-1.4-.2-2.9-.7-2.9-3.2 0-.7.3-1.3.7-1.8 0-.2-.3-.9.1-1.8 0 0 .6-.2 1.9.7a6.5 6.5 0 0 1 3.4 0c1.3-.9 1.9-.7 1.9-.7.4.9.1 1.6.1 1.8.4.5.7 1.1.7 1.8 0 2.5-1.5 3-2.9 3.2.2.2.5.6.5 1.2v1.8c0 .2.1.5.5.4A6.8 6.8 0 0 0 12 5.2Z"
          />
        </BrandSvg>
      );
    case 'reddit':
      return (
        <BrandSvg>
          <circle cx="12" cy="12" r="12" fill="#FF4500" />
          <circle cx="12" cy="13.2" r="5.2" fill="#fff" />
          <circle cx="9.8" cy="12.8" r="1" fill="#FF4500" />
          <circle cx="14.2" cy="12.8" r="1" fill="#FF4500" />
          <path
            fill="#FF4500"
            d="M9.4 15.1c.7.7 1.6 1 2.6 1s1.9-.3 2.6-1c.2-.2.2-.4 0-.5-.2-.2-.4-.2-.5 0-.5.5-1.2.8-2.1.8s-1.6-.3-2.1-.8c-.1-.2-.3-.2-.5 0-.2.1-.2.3 0 .5Z"
          />
          <circle cx="16.4" cy="9.4" r="1.1" fill="#fff" />
          <path stroke="#fff" strokeWidth="1.2" d="M13.5 8.2 14.8 11" />
        </BrandSvg>
      );
    case 'snapchat':
      return (
        <BrandSvg>
          <circle cx="12" cy="12" r="12" fill="#FFFC00" />
          <path
            fill="#000"
            d="M12 6.2c1.6 0 2.8 1.1 2.8 2.9 0 1.9.4 2.5.9 3 .3.3.6.5.6.8 0 .3-.4.5-.8.7-.3.1-.5.3-.5.5 0 .3.5.5 1 .7.4.2.7.5.7.8 0 .5-.6.8-1.3.9-.3 0-.5.3-.6.7-.1.4-.3.8-.8 1.1-.4.2-.9.3-1.4.3h-.2c-.5-.1-1-.3-1.4-.5-.5-.3-.7-.7-.8-1.1-.1-.4-.3-.6-.6-.7-.7-.1-1.3-.4-1.3-.9 0-.3.3-.6.7-.8.5-.2 1-.4 1-.7 0-.2-.2-.4-.5-.5-.4-.2-.8-.4-.8-.7 0-.3.3-.5.6-.8.5-.5.9-1.1.9-3 0-1.8 1.2-2.9 2.8-2.9Z"
          />
        </BrandSvg>
      );
    default:
      return <Link2 className="h-5 w-5 text-[var(--muted)]" strokeWidth={1.75} />;
  }
}

export default function SocialPlatformIcon({ url, platform, className = '' }) {
  const gradientId = useId().replace(/:/g, '');
  const id = platform || detectSocialPlatform(url);
  return (
    <IconShell className={className}>
      <PlatformGlyph platform={id} gradientId={gradientId} />
    </IconShell>
  );
}
