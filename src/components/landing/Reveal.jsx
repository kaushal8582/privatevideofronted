import { useInView } from '../../hooks/useInView.js';

export default function Reveal({ children, className = '', delay = 0 }) {
  const { ref, inView } = useInView();

  return (
    <div
      ref={ref}
      className={[
        'transition-all duration-700 ease-out',
        inView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-6',
        className,
      ].join(' ')}
      style={{ transitionDelay: inView ? `${delay}ms` : '0ms' }}
    >
      {children}
    </div>
  );
}
