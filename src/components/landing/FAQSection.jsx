import { useId, useState } from 'react';
import { ChevronDown } from 'lucide-react';
import SectionShell from './SectionShell.jsx';
import Reveal from './Reveal.jsx';
import { FAQ_ITEMS } from '../../constants/landing.js';

export default function FAQSection() {
  const baseId = useId();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <SectionShell id="faq" className="py-16 sm:py-24">
      <Reveal>
        <h2 className="font-[family-name:var(--font-display)] text-3xl sm:text-4xl font-bold text-center text-[var(--foreground)] mb-12">
          Frequently Asked Questions
        </h2>
      </Reveal>

      <div className="max-w-3xl mx-auto space-y-3">
        {FAQ_ITEMS.map((item, i) => {
          const open = openIndex === i;
          const panelId = `${baseId}-panel-${i}`;
          const btnId = `${baseId}-btn-${i}`;
          return (
            <Reveal key={item.q} delay={i * 30}>
              <div className="rounded-xl border border-[var(--border)] bg-[var(--surface)] overflow-hidden">
                <button
                  type="button"
                  id={btnId}
                  aria-expanded={open}
                  aria-controls={panelId}
                  onClick={() => setOpenIndex(open ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left text-sm sm:text-base font-semibold text-[var(--foreground)] hover:bg-[var(--surface-elevated)] transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-[var(--primary)]"
                >
                  {item.q}
                  <ChevronDown
                    className={[
                      'w-5 h-5 shrink-0 text-[var(--muted)] transition-transform duration-300',
                      open ? 'rotate-180' : '',
                    ].join(' ')}
                    aria-hidden
                  />
                </button>
                <div
                  id={panelId}
                  role="region"
                  aria-labelledby={btnId}
                  className={[
                    'grid transition-[grid-template-rows] duration-300 ease-out',
                    open ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
                  ].join(' ')}
                >
                  <div className="overflow-hidden">
                    <p className="px-5 pb-4 text-sm text-[var(--muted)] leading-relaxed">{item.a}</p>
                  </div>
                </div>
              </div>
            </Reveal>
          );
        })}
      </div>
    </SectionShell>
  );
}
