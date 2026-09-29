import { useEffect, useRef } from 'react';

/**
 * Six-box numeric code input. `value` is a contiguous digit string.
 * Supports paste / SMS-email autofill into any box, arrows and backspace.
 */
export default function OtpInput({ value, onChange, length = 6, disabled = false, autoFocus = false, invalid = false }) {
  const refs = useRef([]);

  const focusAt = (index) => {
    const el = refs.current[Math.max(0, Math.min(length - 1, index))];
    if (el) el.focus();
  };

  useEffect(() => {
    if (autoFocus) focusAt(value.length);
  }, [autoFocus]);

  const fill = (index, digits) => {
    const next = (value.slice(0, index) + digits).slice(0, length);
    onChange(next);
    focusAt(next.length);
  };

  const handleChange = (index, e) => {
    const digits = e.target.value.replace(/\D/g, '');
    if (!digits) return;
    const position = Math.min(index, value.length);
    if (digits.length > 1) {
      fill(position, digits);
      return;
    }
    const chars = value.split('');
    chars[position] = digits;
    const next = chars.join('').slice(0, length);
    onChange(next);
    focusAt(position + 1);
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace') {
      e.preventDefault();
      if (value[index]) {
        onChange(value.slice(0, index) + value.slice(index + 1));
      } else if (index > 0) {
        onChange(value.slice(0, index - 1) + value.slice(index));
        focusAt(index - 1);
      }
    } else if (e.key === 'ArrowLeft') {
      e.preventDefault();
      focusAt(index - 1);
    } else if (e.key === 'ArrowRight') {
      e.preventDefault();
      focusAt(Math.min(index + 1, value.length));
    }
  };

  const handlePaste = (e) => {
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, length);
    if (!digits) return;
    e.preventDefault();
    onChange(digits);
    focusAt(digits.length);
  };

  return (
    <div className="flex justify-between gap-2 sm:gap-3" role="group" aria-label="Verification code">
      {Array.from({ length }, (_, i) => (
        <input
          key={i}
          ref={(el) => {
            refs.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          autoComplete={i === 0 ? 'one-time-code' : 'off'}
          aria-label={`Digit ${i + 1} of ${length}`}
          aria-invalid={invalid}
          disabled={disabled}
          value={value[i] || ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          onPaste={handlePaste}
          onFocus={(e) => {
            if (i > value.length) focusAt(value.length);
            else e.target.select();
          }}
          className={`h-12 w-full min-w-0 max-w-[3.25rem] rounded-xl border bg-[var(--surface)] text-center text-xl font-bold tabular-nums text-[var(--foreground)] outline-none transition focus:border-[var(--border-accent)] focus:shadow-[0_0_0_3px_var(--input-focus-ring)] disabled:opacity-60 sm:h-14 sm:text-2xl ${
            invalid ? 'border-[var(--danger)]' : 'border-[var(--border)]'
          }`}
        />
      ))}
    </div>
  );
}
