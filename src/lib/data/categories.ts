import { createClient } from '@/lib/supabase/server';
import type { Category, CategoryWithCount } from '@/types/database';

export async function getCategories(includeHidden = false): Promise<CategoryWithCount[]> {
  const supabase = createClient();

  let query = supabase
    .from('categories')
    .select('*, resources(count)')
    .order('sort_order', { ascending: true });

  if (!includeHidden) {
    query = query.eq('is_hidden', false);
  }

  const { data, error } = await query;
  if (error || !data) return [];

  return data.map((row: any) => ({
    ...row,
    resource_count: row.resources?.[0]?.count ?? 0,
  }));
}

export async function getCategoryBySlug(slug: string): Promise<Category | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}
