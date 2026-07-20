import { createClient } from '@/lib/supabase/server';
import type { Project, Note } from '@/types/database';

export async function getProjects(featuredOnly = false): Promise<Project[]> {
  const supabase = createClient();
  let query = supabase
    .from('projects')
    .select('*')
    .neq('status', 'archived')
    .order('sort_order', { ascending: true });

  if (featuredOnly) query = query.eq('is_featured', true);

  const { data, error } = await query;
  if (error || !data) return [];
  return data;
}

export async function getProjectBySlug(slug: string): Promise<Project | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('projects')
    .select('*')
    .eq('slug', slug)
    .single();

  if (error || !data) return null;
  return data;
}

export async function getNotes(status: Note['status'] = 'published'): Promise<Note[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('notes')
    .select('*')
    .eq('status', status)
    .order('created_at', { ascending: false });

  if (error || !data) return [];
  return data;
}

export async function getNoteBySlug(slug: string): Promise<Note | null> {
  const supabase = createClient();
  const { data, error } = await supabase.from('notes').select('*').eq('slug', slug).single();
  if (error || !data) return null;
  return data;
}
