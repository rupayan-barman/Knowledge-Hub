import type { MetadataRoute } from 'next';
import { createClient } from '@/lib/supabase/server';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';
  const supabase = createClient();

  const [{ data: resources }, { data: categories }, { data: projects }, { data: notes }] = await Promise.all([
    supabase.from('resources').select('slug, updated_at').eq('status', 'published'),
    supabase.from('categories').select('slug, updated_at').eq('is_hidden', false),
    supabase.from('projects').select('slug, updated_at').neq('status', 'archived'),
    supabase.from('notes').select('slug, updated_at').eq('status', 'published'),
  ]);

  const staticRoutes: MetadataRoute.Sitemap = [
    { url: siteUrl, changeFrequency: 'daily', priority: 1 },
    { url: `${siteUrl}/categories`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/resources`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${siteUrl}/projects`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/notes`, changeFrequency: 'weekly', priority: 0.7 },
    { url: `${siteUrl}/about`, changeFrequency: 'monthly', priority: 0.5 },
  ];

  const dynamicRoutes: MetadataRoute.Sitemap = [
    ...(resources ?? []).map((r) => ({
      url: `${siteUrl}/resources/${r.slug}`,
      lastModified: r.updated_at,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...(categories ?? []).map((c) => ({
      url: `${siteUrl}/categories/${c.slug}`,
      lastModified: c.updated_at,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    })),
    ...(projects ?? []).map((p) => ({
      url: `${siteUrl}/projects/${p.slug}`,
      lastModified: p.updated_at,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
    ...(notes ?? []).map((n) => ({
      url: `${siteUrl}/notes/${n.slug}`,
      lastModified: n.updated_at,
      changeFrequency: 'monthly' as const,
      priority: 0.5,
    })),
  ];

  return [...staticRoutes, ...dynamicRoutes];
}
