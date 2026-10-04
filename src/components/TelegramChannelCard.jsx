import { ExternalLink } from 'lucide-react';
import SocialPlatformIcon from './SocialPlatformIcon.jsx';
import { FOOTER_SOCIAL_LINKS } from './FooterSocialLinks.jsx';

const TELEGRAM_CHANNEL_URL = FOOTER_SOCIAL_LINKS.find((l) => l.key === 'telegram')?.url || '';

export default function TelegramChannelCard({ className = '' }) {
  if (!TELEGRAM_CHANNEL_URL) return null;

  return (
    <section className={`app-card p-3 sm:p-4 ${className}`} aria-labelledby="telegram-channel-title">
      <div className="flex items-center gap-3">
        <SocialPlatformIcon platform="telegram" className="shrink-0" />
        <div className="min-w-0 flex-1">
          <h2 id="telegram-channel-title" className="text-sm font-semibold">
            Join our official Telegram channel
          </h2>
          <p className="text-[11px] app-muted leading-snug mt-0.5">
            Get updates, payout news and creator tips first.
          </p>
        </div>
        <a
          href={TELEGRAM_CHANNEL_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="app-btn-primary !py-1.5 !px-3 !text-xs shrink-0"
        >
          Join
          <ExternalLink className="w-3.5 h-3.5" aria-hidden />
        </a>
      </div>
    </section>
  );
}
