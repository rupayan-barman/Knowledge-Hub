import type { Metadata } from 'next';
import { Section, SectionHeader } from '@/components/home/section';
import { GlobalSearch } from '@/components/shared/global-search';

export const metadata: Metadata = { title: 'Search' };

export default function SearchPage() {
  return (
    <Section className="pt-28 text-center">
      <SectionHeader
        eyebrow="Find anything"
        title="Search"
        description="Search across resources, categories, projects, and notes."
        className="mx-auto"
      />
      <GlobalSearch autoFocus />
    </Section>
  );
}
