import type { Metadata } from 'next';
import { getSettings } from '@/lib/data/settings';
import { Section } from '@/components/home/section';

export const metadata: Metadata = { title: 'About' };

export default async function AboutPage() {
  const settings = await getSettings();

  return (
    <Section className="pt-28 max-w-3xl">
      <span className="text-xs font-semibold uppercase tracking-widest text-accent">About</span>
      <h1 className="mt-2 text-3xl font-bold">{settings.project_name}</h1>
      <div className="glass-panel p-8 mt-8 space-y-4 text-muted-foreground leading-relaxed">
        <p>
          {settings.homepage_text ??
            'This website is a personal knowledge hub — a single place to collect, organize, and revisit the tools, resources, projects, and notes that matter.'}
        </p>
        <p>
          It exists to make one thing easy: finding something useful again, quickly, without
          digging through bookmarks, browser history, or old notes.
        </p>
        <p className="text-foreground font-medium">{settings.footer_text}</p>
      </div>
    </Section>
  );
}
