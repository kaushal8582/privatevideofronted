import { useEffect, useState } from 'react';
import { Link, Navigate, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { MailCheck } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import OtpInput from '../components/OtpInput.jsx';
import {
  getApiErrorCode,
  getApiErrorData,
  getFriendlyError,
  resendVerification,
} from '../services/api.js';
import {
  clearVerificationSession,
  maskEmail,
  readVerificationSession,
  secondsUntil,
  setVerificationResendAfter,
} from '../utils/verificationSession.js';

export default function VerifyEmail() {
  const { completeEmailVerification, isAuthenticated, loading } = useAuth();
  const navigate = useNavigate();
  const [session, setSession] = useState(readVerificationSession);
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [verifying, setVerifying] = useState(false);
  const [resending, setResending] = useState(false);
  const [seconds, setSeconds] = useState(() => secondsUntil(session?.resendAt));

  useEffect(() => {
    if (!session?.resendAt) return undefined;
    const tick = () => setSeconds(secondsUntil(session.resendAt));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [session?.resendAt]);

  if (!loading && isAuthenticated) return <Navigate to="/studio" replace />;
  if (!session) return <Navigate to="/login" replace />;

  const applyCooldown = (retryAfter) => {
    const next = setVerificationResendAfter(retryAfter);
    if (next) setSession(next);
  };

  /** Handles errors that end the verification flow. Returns true if handled. */
  const handleTerminalError = (errCode) => {
    if (errCode === 'INVALID_VERIFICATION_CONTEXT') {
      clearVerificationSession();
      toast.error('Your verification session expired. Please sign in again.');
      navigate('/login', { replace: true });
      return true;
    }
    if (errCode === 'EMAIL_ALREADY_VERIFIED') {
      clearVerificationSession();
      toast.success('Your email is already verified. Please sign in.');
      navigate('/login', { replace: true });
      return true;
    }
    return false;
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (verifying) return;
    if (!/^\d{6}$/.test(code)) {
      setError('Enter the 6-digit code from your email.');
      return;
    }
    setVerifying(true);
    setError('');
    try {
      await completeEmailVerification(session.verificationToken, code);
      clearVerificationSession();
      toast.success('Email verified. Welcome to MastPlayer!');
      navigate('/studio', { replace: true });
    } catch (err) {
      const errCode = getApiErrorCode(err);
      if (handleTerminalError(errCode)) return;
      setCode('');
      if (errCode === 'OTP_INVALID') {
        const left = getApiErrorData(err)?.attemptsLeft;
        setError(left ? `Incorrect code. ${left} attempt${left === 1 ? '' : 's'} left.` : getFriendlyError(err));
        return;
      }
      if (errCode === 'OTP_EXPIRED' || errCode === 'OTP_TOO_MANY_ATTEMPTS') applyCooldown(0);
      setError(getFriendlyError(err, 'Could not verify the code.'));
    } finally {
      setVerifying(false);
    }
  };

  const handleResend = async () => {
    if (seconds > 0 || resending) return;
    setResending(true);
    setError('');
    try {
      const { data } = await resendVerification(session.verificationToken);
      applyCooldown(data.data?.retryAfter ?? 60);
      setCode('');
      toast.success('New code sent. Earlier codes no longer work.');
    } catch (err) {
      const errCode = getApiErrorCode(err);
      if (handleTerminalError(errCode)) return;
      const retryAfter = getApiErrorData(err)?.retryAfter;
      if (retryAfter) applyCooldown(retryAfter);
      toast.error(getFriendlyError(err, 'Could not resend the code.'));
    } finally {
      setResending(false);
    }
  };

  const leaveFlow = () => clearVerificationSession();

  return (
    <div className="w-full min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-4rem)] flex flex-col">
      <div className="flex-1 flex items-start sm:items-center justify-center px-4 sm:px-6 py-6 sm:py-10 lg:py-14">
        <div className="w-full max-w-md min-w-0">
          <div className="mb-6 sm:mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-accent)] bg-[var(--accent-soft)] text-[var(--primary)]">
              <MailCheck size={24} />
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,6vw,2.5rem)] font-bold tracking-tight text-[var(--foreground)] mb-2 sm:mb-3">
              Verify your email
            </h1>
            <p className="text-sm sm:text-base app-muted leading-relaxed px-1">
              We sent a 6-digit verification code to
              <br />
              <span className="font-semibold text-[var(--foreground)] break-all">{maskEmail(session.email)}</span>
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:p-6 lg:p-8 space-y-5 shadow-[0_24px_60px_-40px_var(--glow-cyan)]">
            <form onSubmit={handleVerify} className="space-y-4" noValidate>
              <OtpInput
                value={code}
                onChange={(next) => {
                  setCode(next);
                  if (error) setError('');
                }}
                disabled={verifying}
                invalid={Boolean(error)}
                autoFocus
              />
              {error ? <p className="text-xs text-[var(--danger)]" role="alert">{error}</p> : null}
              <button
                type="submit"
                disabled={verifying || code.length !== 6}
                className="app-btn-primary app-btn-primary-lg w-full"
              >
                {verifying ? 'Verifying…' : 'Verify Email'}
              </button>
            </form>

            <p className="text-center text-sm app-muted">
              Didn&apos;t get it? Check spam, or{' '}
              <button
                type="button"
                onClick={handleResend}
                disabled={seconds > 0 || resending}
                className="app-link disabled:opacity-60 disabled:no-underline disabled:cursor-not-allowed disabled:text-[var(--muted)]"
              >
                {resending ? 'sending…' : seconds > 0 ? `resend code in ${seconds}s` : 'resend code'}
              </button>
            </p>
          </div>

          <p className="mt-5 sm:mt-6 text-center text-sm app-muted">
            Wrong email?{' '}
            <Link to="/register" onClick={leaveFlow} className="app-link">
              Change email
            </Link>
            {' · '}
            <Link to="/login" onClick={leaveFlow} className="app-link">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
