import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { KeyRound } from 'lucide-react';
import { useAuth } from '../context/AuthContext.jsx';
import OtpInput from '../components/OtpInput.jsx';
import PasswordInput from '../components/PasswordInput.jsx';
import {
  forgotPassword,
  getApiErrorCode,
  getApiErrorData,
  getFriendlyError,
  resetPassword,
  verifyPasswordReset,
} from '../services/api.js';
import { maskEmail, secondsUntil } from '../utils/verificationSession.js';
import { validateEmail, validatePassword } from '../utils/validation.js';

function FieldError({ message }) {
  if (!message) return null;
  return <p className="mt-1.5 text-xs text-[var(--danger)]" role="alert">{message}</p>;
}

const COPY = {
  email: {
    title: 'Forgot password?',
    subtitle: 'Enter your account email and we’ll send you a 6-digit reset code.',
  },
  code: { title: 'Reset your password', subtitle: 'Enter the 6-digit code sent to your email.' },
  password: { title: 'Choose a new password', subtitle: 'Use at least 6 characters.' },
};

export default function ForgotPassword() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  // Reset authorization lives in memory only — a reload restarts the flow.
  const [resetToken, setResetToken] = useState('');
  const [password, setPassword] = useState('');
  const [confirm, setConfirm] = useState('');
  const [errors, setErrors] = useState({});
  const [busy, setBusy] = useState(false);
  const [resendAt, setResendAt] = useState(0);
  const [seconds, setSeconds] = useState(0);

  useEffect(() => {
    if (!resendAt) return undefined;
    const tick = () => setSeconds(secondsUntil(resendAt));
    tick();
    const timer = setInterval(tick, 1000);
    return () => clearInterval(timer);
  }, [resendAt]);

  const startCooldown = (retryAfter) => setResendAt(Date.now() + (Number(retryAfter) || 0) * 1000);

  const requestCode = async () => {
    const emailError = validateEmail(email);
    if (emailError) {
      setErrors({ email: emailError });
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      const { data } = await forgotPassword(email.trim());
      startCooldown(data.data?.retryAfter ?? 60);
      setCode('');
      toast.success(data.message);
      setStep('code');
    } catch (err) {
      if (getApiErrorCode(err) === 'OTP_RATE_LIMITED') {
        startCooldown(getApiErrorData(err)?.retryAfter ?? 60);
        setStep('code');
      }
      toast.error(getFriendlyError(err, 'Could not send the reset code.'));
    } finally {
      setBusy(false);
    }
  };

  const handleEmailSubmit = (e) => {
    e.preventDefault();
    if (!busy) requestCode();
  };

  const handleVerify = async (e) => {
    e.preventDefault();
    if (busy) return;
    if (!/^\d{6}$/.test(code)) {
      setErrors({ code: 'Enter the 6-digit code from your email.' });
      return;
    }
    setBusy(true);
    setErrors({});
    try {
      const { data } = await verifyPasswordReset(email.trim(), code);
      setResetToken(data.data.resetToken);
      setStep('password');
    } catch (err) {
      const errCode = getApiErrorCode(err);
      setCode('');
      if (errCode === 'OTP_INVALID') {
        const left = getApiErrorData(err)?.attemptsLeft;
        setErrors({ code: left ? `Incorrect code. ${left} attempt${left === 1 ? '' : 's'} left.` : getFriendlyError(err) });
        return;
      }
      if (errCode === 'OTP_EXPIRED' || errCode === 'OTP_TOO_MANY_ATTEMPTS') setResendAt(0);
      setErrors({ code: getFriendlyError(err, 'Could not verify the code.') });
    } finally {
      setBusy(false);
    }
  };

  const handleReset = async (e) => {
    e.preventDefault();
    if (busy) return;
    const nextErrors = {
      password: validatePassword(password),
      confirm: password === confirm ? '' : 'Passwords do not match.',
    };
    setErrors(nextErrors);
    if (nextErrors.password || nextErrors.confirm) return;

    setBusy(true);
    try {
      const { data } = await resetPassword(resetToken, password);
      setResetToken('');
      logout();
      toast.success(data.message || 'Password updated successfully. Please sign in with your new password.');
      navigate('/login', { replace: true, state: { email: email.trim() } });
    } catch (err) {
      if (getApiErrorCode(err) === 'INVALID_RESET_TOKEN') {
        setResetToken('');
        setPassword('');
        setConfirm('');
        setStep('email');
      }
      toast.error(getFriendlyError(err, 'Could not update your password.'));
    } finally {
      setBusy(false);
    }
  };

  const copy = COPY[step];

  return (
    <div className="w-full min-h-[calc(100dvh-3.5rem)] sm:min-h-[calc(100dvh-4rem)] flex flex-col">
      <div className="flex-1 flex items-start sm:items-center justify-center px-4 sm:px-6 py-6 sm:py-10 lg:py-14">
        <div className="w-full max-w-md min-w-0">
          <div className="mb-6 sm:mb-8 text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl border border-[var(--border-accent)] bg-[var(--accent-soft)] text-[var(--primary)]">
              <KeyRound size={24} />
            </div>
            <h1 className="font-[family-name:var(--font-display)] text-[clamp(1.75rem,6vw,2.5rem)] font-bold tracking-tight text-[var(--foreground)] mb-2 sm:mb-3">
              {copy.title}
            </h1>
            <p className="text-sm sm:text-base app-muted leading-relaxed px-1">
              {copy.subtitle}
              {step === 'code' ? (
                <>
                  <br />
                  <span className="font-semibold text-[var(--foreground)] break-all">{maskEmail(email.trim())}</span>
                </>
              ) : null}
            </p>
          </div>

          <div className="rounded-2xl border border-[var(--border)] bg-[var(--surface-elevated)] p-4 sm:p-6 lg:p-8 space-y-5 shadow-[0_24px_60px_-40px_var(--glow-cyan)]">
            {step === 'email' ? (
              <form onSubmit={handleEmailSubmit} className="space-y-4" noValidate>
                <label className="app-label">
                  Email
                  <input
                    type="email"
                    autoComplete="email"
                    inputMode="email"
                    value={email}
                    onChange={(e) => {
                      setEmail(e.target.value);
                      setErrors({});
                    }}
                    className={`app-input ${errors.email ? '!border-[var(--danger)]' : ''}`}
                    aria-invalid={Boolean(errors.email)}
                    autoFocus
                  />
                  <FieldError message={errors.email} />
                </label>
                <button type="submit" disabled={busy} className="app-btn-primary app-btn-primary-lg w-full">
                  {busy ? 'Sending…' : 'Continue'}
                </button>
              </form>
            ) : null}

            {step === 'code' ? (
              <>
                <form onSubmit={handleVerify} className="space-y-4" noValidate>
                  <OtpInput
                    value={code}
                    onChange={(next) => {
                      setCode(next);
                      if (errors.code) setErrors({});
                    }}
                    disabled={busy}
                    invalid={Boolean(errors.code)}
                    autoFocus
                  />
                  <FieldError message={errors.code} />
                  <button
                    type="submit"
                    disabled={busy || code.length !== 6}
                    className="app-btn-primary app-btn-primary-lg w-full"
                  >
                    {busy ? 'Verifying…' : 'Verify Code'}
                  </button>
                </form>
                <p className="text-center text-sm app-muted">
                  Didn&apos;t get it? Check spam, or{' '}
                  <button
                    type="button"
                    onClick={requestCode}
                    disabled={busy || seconds > 0}
                    className="app-link disabled:opacity-60 disabled:no-underline disabled:cursor-not-allowed disabled:text-[var(--muted)]"
                  >
                    {seconds > 0 ? `resend code in ${seconds}s` : 'resend code'}
                  </button>
                  {' · '}
                  <button
                    type="button"
                    onClick={() => {
                      setStep('email');
                      setCode('');
                      setErrors({});
                    }}
                    className="app-link"
                  >
                    Change email
                  </button>
                </p>
              </>
            ) : null}

            {step === 'password' ? (
              <form onSubmit={handleReset} className="space-y-4" noValidate>
                <label className="app-label">
                  New password
                  <PasswordInput
                    autoComplete="new-password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={errors.password ? '!border-[var(--danger)]' : ''}
                    aria-invalid={Boolean(errors.password)}
                    autoFocus
                  />
                  <FieldError message={errors.password} />
                </label>
                <label className="app-label">
                  Confirm new password
                  <PasswordInput
                    autoComplete="new-password"
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={errors.confirm ? '!border-[var(--danger)]' : ''}
                    aria-invalid={Boolean(errors.confirm)}
                  />
                  <FieldError message={errors.confirm} />
                </label>
                <button type="submit" disabled={busy} className="app-btn-primary app-btn-primary-lg w-full">
                  {busy ? 'Updating…' : 'Update password'}
                </button>
              </form>
            ) : null}
          </div>

          <p className="mt-5 sm:mt-6 text-center text-sm app-muted">
            Remembered it?{' '}
            <Link to="/login" className="app-link">
              Back to login
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}
