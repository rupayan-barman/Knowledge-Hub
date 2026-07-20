import { createClient } from '@/lib/supabase/server';
import type { DashboardStats, ActivityLogEntry } from '@/types/database';

export async function getDashboardStats(): Promise<DashboardStats> {
  const supabase = createClient();

  const [
    { count: total_resources },
    { count: total_categories },
    { count: total_projects },
    { count: total_notes },
    { count: pinned_resources },
    { count: draft_resources },
    { count: published_resources },
  ] = await Promise.all([
    supabase.from('resources').select('*', { count: 'exact', head: true }),
    supabase.from('categories').select('*', { count: 'exact', head: true }),
    supabase.from('projects').select('*', { count: 'exact', head: true }),
    supabase.from('notes').select('*', { count: 'exact', head: true }),
    supabase.from('resources').select('*', { count: 'exact', head: true }).eq('is_pinned', true),
    supabase.from('resources').select('*', { count: 'exact', head: true }).eq('status', 'draft'),
    supabase.from('resources').select('*', { count: 'exact', head: true }).eq('status', 'published'),
  ]);

  return {
    total_resources: total_resources ?? 0,
    total_categories: total_categories ?? 0,
    total_projects: total_projects ?? 0,
    total_notes: total_notes ?? 0,
    pinned_resources: pinned_resources ?? 0,
    draft_resources: draft_resources ?? 0,
    published_resources: published_resources ?? 0,
  };
}

export async function getRecentActivity(limit = 8): Promise<ActivityLogEntry[]> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('activity_log')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);

  if (error || !data) return [];
  return data;
}

export async function logActivity(
  action: string,
  entityType: string,
  entityId?: string | null,
  entityLabel?: string | null
) {
  try {
    const supabase = createClient();
    await supabase.from('activity_log').insert({
      action,
      entity_type: entityType,
      entity_id: entityId ?? null,
      entity_label: entityLabel ?? null,
    });
  } catch {
    // Activity logging is non-critical — never block the primary action on it.
  }
}
