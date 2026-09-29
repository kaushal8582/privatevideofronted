/**
 * Pending email-verification context (tab-scoped). Holds only the email and the
 * server-issued 30-minute verification token — never a session token or OTP.
 */
const KEY = 'mastplayer_email_verification';

export const secondsUntil = (timestamp) =>
  Math.max(0, Math.ceil((Number(timestamp || 0) - Date.now()) / 1000));

export function saveVerificationSession({ email, verificationToken, retryAfter }) {
  if (!verificationToken) return;
  sessionStorage.setItem(
    KEY,
    JSON.stringify({
      email,
      verificationToken,
      resendAt: Date.now() + (Number(retryAfter) || 0) * 1000,
    })
  );
}

export function readVerificationSession() {
  try {
    const value = JSON.parse(sessionStorage.getItem(KEY) || 'null');
    return value?.verificationToken ? value : null;
  } catch {
    return null;
  }
}

export function setVerificationResendAfter(retryAfter) {
  const current = readVerificationSession();
  if (!current) return null;
  const next = { ...current, resendAt: Date.now() + (Number(retryAfter) || 0) * 1000 };
  sessionStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export const clearVerificationSession = () => sessionStorage.removeItem(KEY);

export const maskEmail = (email = '') => {
  const [name, domain] = String(email).split('@');
  if (!domain) return '';
  return `${name.slice(0, 1)}${'*'.repeat(Math.max(3, Math.min(name.length - 1, 6)))}@${domain}`;
};
