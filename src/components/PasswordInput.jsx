import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';

export default function PasswordInput({ className = '', ...props }) {
  const [visible, setVisible] = useState(false);
  return (
    <div className="relative">
      <input {...props} type={visible ? 'text' : 'password'} className={`app-input pr-11 ${className}`} />
      <button
        type="button"
        onClick={() => setVisible((v) => !v)}
        className="absolute right-2 top-1/2 mt-[0.1875rem] -translate-y-1/2 rounded-lg p-1.5 text-[var(--muted)] hover:text-[var(--foreground)]"
        aria-label={visible ? 'Hide password' : 'Show password'}
      >
        {visible ? <EyeOff size={18} /> : <Eye size={18} />}
      </button>
    </div>
  );
}
