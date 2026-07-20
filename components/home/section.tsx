import { cn } from '@/lib/utils/cn';

export function SectionHeader({
  eyebrow,
  title,
  description,
  className,
}: {
  eyebrow?: string;
  title: string;
  description?: string;
  className?: string;
}) {
  return (
    <div className={cn('mb-10 max-w-2xl', className)}>
      {eyebrow && (
        <span className="text-xs font-semibold uppercase tracking-widest text-accent">
          {eyebrow}
        </span>
      )}
      <h2 className="mt-2 text-2xl sm:text-3xl font-bold tracking-tight">{title}</h2>
      {description && <p className="mt-2 text-muted-foreground">{description}</p>}
    </div>
  );
}

export function Section({
  children,
  className,
  id,
}: {
  children: React.ReactNode;
  className?: string;
  id?: string;
}) {
  return (
    <section id={id} className={cn('mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-16', className)}>
      {children}
    </section>
  );
}
