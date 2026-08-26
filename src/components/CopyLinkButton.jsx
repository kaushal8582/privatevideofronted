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

  const base =
    'inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-teal-700/40';

  const variants = {
    primary: 'bg-teal-800 text-white hover:bg-teal-700',
    secondary:
      'bg-white text-[#0c1222] border border-[#e6e1d8] hover:bg-[#f7f5f1]',
    ghost: 'text-teal-800 hover:bg-teal-50',
  };

  return (
    <button
      type="button"
      onClick={handleCopy}
      className={`${base} ${variants[variant] || variants.primary} ${className}`}
    >
      {copied ? (
        <>
          <Check className="w-4 h-4" />
          Copied!
        </>
      ) : (
        <>
          {variant === 'ghost' ? (
            <LinkIcon className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
          {label}
        </>
      )}
    </button>
  );
}
