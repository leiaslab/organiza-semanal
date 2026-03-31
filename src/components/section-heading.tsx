interface SectionHeadingProps {
  eyebrow: string;
  title: string;
  description: string;
}

export function SectionHeading({ eyebrow, title, description }: SectionHeadingProps) {
  return (
    <div className="mb-6">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-[var(--primary)]">{eyebrow}</p>
      <h2 className="mt-3 text-2xl font-bold tracking-tight text-[var(--text)] sm:text-[2rem]">{title}</h2>
      <p className="mt-2 max-w-2xl text-sm leading-6 text-[var(--muted)] sm:text-base">{description}</p>
    </div>
  );
}
