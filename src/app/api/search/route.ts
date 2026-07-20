import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { sanitizePlainText } from '@/lib/utils/sanitize';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest) {
  const rawQuery = request.nextUrl.searchParams.get('q') ?? '';
  const query = sanitizePlainText(rawQuery).slice(0, 100);

  if (!query.trim()) {
    return NextResponse.json({ results: [] });
  }

  const supabase = createClient();
  const like = `%${query}%`;

  const [resources, categories, projects, notes] = await Promise.all([
    supabase
      .from('resources')
      .select('id, slug, name, short_description')
      .eq('status', 'published')
      .or(`name.ilike.${like},short_description.ilike.${like}`)
      .limit(6),
    supabase
      .from('categories')
      .select('id, slug, name, description')
      .eq('is_hidden', false)
      .ilike('name', like)
      .limit(4),
    supabase
      .from('projects')
      .select('id, slug, name, description')
      .neq('status', 'archived')
      .or(`name.ilike.${like},description.ilike.${like}`)
      .limit(4),
    supabase
      .from('notes')
      .select('id, slug, title, content_text')
      .eq('status', 'published')
      .or(`title.ilike.${like},content_text.ilike.${like}`)
      .limit(4),
  ]);

  const results = [
    ...(resources.data ?? []).map((r) => ({
      id: r.id,
      type: 'resource' as const,
      title: r.name,
      description: r.short_description,
      href: `/resources/${r.slug}`,
    })),
    ...(categories.data ?? []).map((c) => ({
      id: c.id,
      type: 'category' as const,
      title: c.name,
      description: c.description ?? '',
      href: `/categories/${c.slug}`,
    })),
    ...(projects.data ?? []).map((p) => ({
      id: p.id,
      type: 'project' as const,
      title: p.name,
      description: p.description,
      href: `/projects/${p.slug}`,
    })),
    ...(notes.data ?? []).map((n) => ({
      id: n.id,
      type: 'note' as const,
      title: n.title,
      description: n.content_text.slice(0, 140),
      href: `/notes/${n.slug}`,
    })),
  ];

  return NextResponse.json({ results });
}
