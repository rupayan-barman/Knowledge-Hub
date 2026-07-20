import type { Metadata } from 'next';
import Link from 'next/link';
import { getResources } from '@/lib/data/resources';
import { getCategories } from '@/lib/data/categories';
import { Section, SectionHeader } from '@/components/home/section';
import { ResourceCard } from '@/components/resources/resource-card';
import { cn } from '@/lib/utils/cn';

export const metadata: Metadata = { title: 'Resources' };
export const revalidate = 60;

interface Props {
  searchParams: { category?: string; q?: string };
}

export default async function ResourcesPage({ searchParams }: Props) {
  const [resources, categories] = await Promise.all([
    getResources({ categorySlug: searchParams.category, search: searchParams.q }),
    getCategories(),
  ]);

  return (
    <Section className="pt-28">
      <SectionHeader
        eyebrow="Library"
        title="All Resources"
        description={`${resources.length} resource${resources.length === 1 ? '' : 's'} available.`}
      />

      <div className="flex flex-wrap gap-2 mb-8">
        <Link
          href="/resources"
          className={cn('badge px-3 py-1.5', !searchParams.category && 'bg-accent/15 text-accent border-accent/30')}
        >
          All
        </Link>
        {categories.map((category) => (
          <Link
            key={category.id}
            href={`/resources?category=${category.slug}`}
            className={cn(
              'badge px-3 py-1.5',
              searchParams.category === category.slug && 'bg-accent/15 text-accent border-accent/30'
            )}
          >
            {category.name}
          </Link>
        ))}
      </div>

      {resources.length === 0 ? (
        <p className="text-muted-foreground">No resources match your filters yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {resources.map((resource) => (
            <ResourceCard key={resource.id} resource={resource} />
          ))}
        </div>
      )}
    </Section>
  );
}
