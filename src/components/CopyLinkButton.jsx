import { useState } from 'react';
import { Check, Copy, Link as LinkIcon } from 'lucide-react';
import toast from 'react-hot-toast';

export default function CopyLinkButton({
  url,
  label = 'Copy Link',
  className = '',
  variant = 'primary',
}) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async (e) => {
    e?.preventDefault?.();
    e?.stopPropagation?.();

    if (!url) {
      toast.error('No link to copy');
      return;
    }

    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      toast.success('Link copied!');
      setTimeout(() => setCopied(false), 2000);
    } catch {
      try {
        const textarea = document.createElement('textarea');
        textarea.value = url;
        textarea.style.position = 'fixed';
        textarea.style.left = '-9999px';
        document.body.appendChild(textarea);
        textarea.select();
        document.execCommand('copy');
        document.body.removeChild(textarea);
        setCopied(true);
        toast.success('Link copied!');
        setTimeout(() => setCopied(false), 2000);
      } catch {
        toast.error('Could not copy link');
      }
    }
  };

  const variants = {
    primary: 'app-btn-primary',
    secondary: 'app-btn-secondary',
    ghost: 'app-btn-ghost border-0 text-[var(--primary)]',
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${variants[variant] || variants.primary} ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          {variant === 'ghost' ? <LinkIcon className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
          {label}
        </>
      )}
    </button>
  );
}
