import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import * as Icons from 'lucide-react';
import { getCategoryBySlug } from '@/lib/data/categories';
import { getResources } from '@/lib/data/resources';
import { Section } from '@/components/home/section';
import { ResourceCard } from '@/components/resources/resource-card';

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const category = await getCategoryBySlug(params.slug);
  if (!category) return { title: 'Category not found' };
  return {
    title: category.name,
    description: category.description ?? undefined,
  };
}

export default async function CategoryDetailPage({ params }: Props) {
  const category = await getCategoryBySlug(params.slug);
  if (!category || category.is_hidden) notFound();

  const resources = await getResources({ categorySlug: params.slug });
  const Icon = (Icons as unknown as Record<string, Icons.LucideIcon>)[
    (category.icon ?? 'folder').charAt(0).toUpperCase() + (category.icon ?? 'folder').slice(1)
  ] ?? Icons.Folder;

  return (
    <Section className="pt-28">
      <div className="flex items-center gap-4 mb-10">
        <div
          className="flex h-14 w-14 items-center justify-center rounded-2xl"
          style={{ backgroundColor: `${category.color ?? '#00ff9d'}1A`, color: category.color ?? '#00ff9d' }}
        >
          <Icon className="h-6 w-6" />
        </div>
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{category.name}</h1>
          {category.description && (
            <p className="text-muted-foreground mt-1">{category.description}</p>
          )}
        </div>
      </div>

      {resources.length === 0 ? (
        <p className="text-muted-foreground">No resources in this category yet.</p>
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
