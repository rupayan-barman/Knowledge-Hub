import type { Metadata } from 'next';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { ExternalLink, ThumbsUp, ThumbsDown, Calendar, RefreshCw, Tag } from 'lucide-react';
import { getResourceBySlug, getRelatedResources, incrementResourceViewCount } from '@/lib/data/resources';
import { resolveResourceLogo } from '@/lib/utils/favicon';
import { formatDate } from '@/lib/utils/format';
import { Section } from '@/components/home/section';
import { ResourceCard } from '@/components/resources/resource-card';

interface Props {
  params: { slug: string };
}

export const revalidate = 30;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const resource = await getResourceBySlug(params.slug);
  if (!resource) return { title: 'Resource not found' };
  return {
    title: resource.meta_title ?? resource.name,
    description: resource.meta_description ?? resource.short_description,
    openGraph: {
      title: resource.meta_title ?? resource.name,
      description: resource.meta_description ?? resource.short_description,
      images: resource.screenshot_url ? [resource.screenshot_url] : undefined,
    },
  };
}

export default async function ResourceDetailPage({ params }: Props) {
  const resource = await getResourceBySlug(params.slug);
  if (!resource || resource.status === 'archived') notFound();

  incrementResourceViewCount(resource.id).catch(() => {});
  const related = await getRelatedResources(resource);
  const logoUrl = resolveResourceLogo(resource);

  return (
    <Section className="pt-28 max-w-4xl">
      <div className="flex flex-col sm:flex-row items-start sm:items-center gap-5 mb-8">
        <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-muted border border-border">
          <Image src={logoUrl} alt={`${resource.name} logo`} fill sizes="80px" className="object-contain p-3" unoptimized />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap">
            <h1 className="text-2xl sm:text-3xl font-bold">{resource.name}</h1>
            {resource.category && <span className="badge">{resource.category.name}</span>}
          </div>
          <p className="mt-2 text-muted-foreground">{resource.short_description}</p>
        </div>
        <a href={resource.official_url} target="_blank" rel="noreferrer" className="btn-primary shrink-0">
          Visit Website
          <ExternalLink className="h-4 w-4" />
        </a>
      </div>

      {resource.detailed_description && (
        <div className="glass-panel p-6 mb-6 prose prose-invert max-w-none prose-p:text-muted-foreground">
          <p>{resource.detailed_description}</p>
        </div>
      )}

      {resource.personal_review && (
        <div className="glass-panel p-6 mb-6">
          <h2 className="font-semibold mb-2">Personal Review</h2>
          <p className="text-muted-foreground">{resource.personal_review}</p>
        </div>
      )}

      {(resource.advantages.length > 0 || resource.disadvantages.length > 0) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 mb-6">
          {resource.advantages.length > 0 && (
            <div className="glass-panel p-6">
              <h2 className="font-semibold mb-3 flex items-center gap-2 text-success">
                <ThumbsUp className="h-4 w-4" /> Advantages
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {resource.advantages.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-success">+</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
          {resource.disadvantages.length > 0 && (
            <div className="glass-panel p-6">
              <h2 className="font-semibold mb-3 flex items-center gap-2 text-danger">
                <ThumbsDown className="h-4 w-4" /> Disadvantages
              </h2>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {resource.disadvantages.map((item, i) => (
                  <li key={i} className="flex gap-2">
                    <span className="text-danger">−</span> {item}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>
      )}

      <div className="glass-panel p-6 mb-10 flex flex-wrap items-center gap-x-8 gap-y-3 text-sm text-muted-foreground">
        {resource.useful_for && (
          <span>
            <strong className="text-foreground">Useful for:</strong> {resource.useful_for}
          </span>
        )}
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" /> Added {formatDate(resource.created_at)}
        </span>
        <span className="flex items-center gap-1.5">
          <RefreshCw className="h-3.5 w-3.5" /> Updated {formatDate(resource.updated_at)}
        </span>
        {resource.tags.length > 0 && (
          <span className="flex items-center gap-1.5 flex-wrap">
            <Tag className="h-3.5 w-3.5" />
            {resource.tags.map((tag) => (
              <span key={tag} className="badge">
                {tag}
              </span>
            ))}
          </span>
        )}
      </div>

      {related.length > 0 && (
        <>
          <h2 className="text-xl font-bold mb-5">Related Resources</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
            {related.map((r) => (
              <ResourceCard key={r.id} resource={r} />
            ))}
          </div>
        </>
      )}
    </Section>
  );
}
