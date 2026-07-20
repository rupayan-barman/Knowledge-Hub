import { createClient } from '@/lib/supabase/server';
import type { Resource, ResourceWithCategory } from '@/types/database';

interface ResourceFilters {
  categorySlug?: string;
  status?: Resource['status'];
  featuredOnly?: boolean;
  pinnedOnly?: boolean;
  limit?: number;
  search?: string;
}

const RESOURCE_SELECT = '*, category:categories(*)';

export async function getResources(filters: ResourceFilters = {}): Promise<ResourceWithCategory[]> {
  const supabase = createClient();
  let query = supabase.from('resources').select(RESOURCE_SELECT);

  if (filters.status) {
    query = query.eq('status', filters.status);
  } else {
    query = query.eq('status', 'published');
  }

  if (filters.featuredOnly) query = query.eq('is_featured', true);
  if (filters.pinnedOnly) query = query.eq('is_pinned', true);

  if (filters.categorySlug) {
    const { data: category } = await supabase
      .from('categories')
      .select('id')
      .eq('slug', filters.categorySlug)
      .single();
    if (category) query = query.eq('category_id', category.id);
  }

  if (filters.search) {
    query = query.or(
      `name.ilike.%${filters.search}%,short_description.ilike.%${filters.search}%`
    );
  }

  query = query.order('created_at', { ascending: false });

  if (filters.limit) query = query.limit(filters.limit);

  const { data, error } = await query;
  if (error || !data) return [];
  return data as unknown as ResourceWithCategory[];
}

export async function getResourceBySlug(slug: string): Promise<ResourceWithCategory | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('resources')
    .select(RESOURCE_SELECT)
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data as unknown as ResourceWithCategory;
}

export async function getRelatedResources(
  resource: Resource,
  limit = 4
): Promise<ResourceWithCategory[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('resources')
    .select(RESOURCE_SELECT)
    .eq('status', 'published')
    .eq('category_id', resource.category_id ?? '')
    .neq('id', resource.id)
    .limit(limit);

  if (error || !data) return [];
  return data as unknown as ResourceWithCategory[];
}

export async function incrementResourceViewCount(resourceId: string): Promise<void> {
  const supabase = createClient();
  await supabase.rpc('increment_resource_views', { resource_id: resourceId }).then(
    () => {},
    () => {
      // Non-critical — silently ignore if the RPC function isn't present.
    }
  );
}
