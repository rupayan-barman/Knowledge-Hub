import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

export function HeroSection({
  projectName,
  tagline,
  homepageText,
}: {
  projectName: string;
  tagline: string | null;
  homepageText: string | null;
}) {
  return (
    <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pt-20 pb-24">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background:
            'radial-gradient(60% 50% at 50% 0%, hsl(var(--accent) / 0.14), transparent 70%)',
        }}
      />
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
        {[...Array(14)].map((_, i) => (
          <span
            key={i}
            className="absolute h-1 w-1 rounded-full bg-accent/30 animate-float"
            style={{
              left: `${(i * 37) % 100}%`,
              top: `${(i * 53) % 100}%`,
              animationDelay: `${i * 0.4}s`,
              animationDuration: `${6 + (i % 5)}s`,
            }}
          />
        ))}
      </div>

      <div className="mx-auto max-w-4xl text-center animate-fade-in">
        <span className="badge mb-6">
          <span className="h-1.5 w-1.5 rounded-full bg-accent" />
          Personal Knowledge Hub
        </span>
        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-balance">
          {projectName}
        </h1>
        <p className="mt-5 text-lg text-muted-foreground max-w-2xl mx-auto text-balance">
          {tagline ?? homepageText ?? 'A curated, ever-growing library of tools, resources, projects, and notes.'}
        </p>
        <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/resources" className="btn-primary w-full sm:w-auto">
            Browse Resources
            <ArrowRight className="h-4 w-4" />
          </Link>
          <Link href="/categories" className="btn-secondary w-full sm:w-auto">
            <Compass className="h-4 w-4" />
            Explore Categories
          </Link>
        </div>
      </div>
    </section>
  );
}
