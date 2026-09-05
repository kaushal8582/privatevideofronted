const PLATFORM_HOSTS = [
  { id: 'instagram', match: /(^|\.)instagram\.com$/i },
  { id: 'youtube', match: /(^|\.)(youtube\.com|youtu\.be)$/i },
  { id: 'facebook', match: /(^|\.)(facebook\.com|fb\.com|fb\.watch)$/i },
  { id: 'x', match: /(^|\.)(twitter\.com|x\.com)$/i },
  { id: 'tiktok', match: /(^|\.)tiktok\.com$/i },
  { id: 'linkedin', match: /(^|\.)linkedin\.com$/i },
  { id: 'whatsapp', match: /(^|\.)(whatsapp\.com|wa\.me)$/i },
  { id: 'telegram', match: /(^|\.)(t\.me|telegram\.me|telegram\.org)$/i },
  { id: 'discord', match: /(^|\.)(discord\.gg|discord\.com)$/i },
  { id: 'github', match: /(^|\.)github\.com$/i },
  { id: 'reddit', match: /(^|\.)reddit\.com$/i },
  { id: 'snapchat', match: /(^|\.)snapchat\.com$/i },
];

export const MAX_SOCIAL_LINKS = 8;

export function normalizeSocialUrl(raw) {
  const s = String(raw || '').trim();
  if (!s) return '';
  if (/^https?:\/\//i.test(s)) return s;
  return `https://${s}`;
}

export function detectSocialPlatform(url) {
  try {
    const host = new URL(normalizeSocialUrl(url)).hostname.replace(/^www\./i, '');
    for (const p of PLATFORM_HOSTS) {
      if (p.match.test(host)) return p.id;
    }
  } catch {
    /* ignore */
  }
  return 'link';
}

export function platformLabel(id) {
  const labels = {
    instagram: 'Instagram',
    youtube: 'YouTube',
    facebook: 'Facebook',
    x: 'X',
    tiktok: 'TikTok',
    linkedin: 'LinkedIn',
    whatsapp: 'WhatsApp',
    telegram: 'Telegram',
    discord: 'Discord',
    github: 'GitHub',
    reddit: 'Reddit',
    snapchat: 'Snapchat',
    link: 'Link',
  };
  return labels[id] || 'Link';
}
