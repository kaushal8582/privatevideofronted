export default function SectionShell({ id, className = '', children, ariaLabelledBy }) {
  return (
    <section
      id={id}
      aria-labelledby={ariaLabelledBy}
      className={`landing-section px-4 sm:px-6 lg:px-8 ${className}`}
    >
      <div className="landing-container">{children}</div>
    </section>
  );
}
