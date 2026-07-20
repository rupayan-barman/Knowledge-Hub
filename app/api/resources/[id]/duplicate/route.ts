import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { ensureUniqueSlug } from '@/lib/utils/slug';
import { logActivity } from '@/lib/data/dashboard';

export const dynamic = 'force-dynamic';

export async function POST(_request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: original, error: fetchError } = await supabase
    .from('resources')
    .select('*')
    .eq('id', params.id)
    .single();

  if (fetchError || !original) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const { id, slug, created_at, updated_at, view_count, ...rest } = original;
  const newName = `${original.name} (Copy)`;
  const newSlug = await ensureUniqueSlug(newName, async (candidate) => {
    const { data } = await supabase.from('resources').select('id').eq('slug', candidate).maybeSingle();
    return !!data;
  });

  const { data: duplicated, error } = await supabase
    .from('resources')
    .insert({ ...rest, name: newName, slug: newSlug, status: 'draft', is_featured: false, is_pinned: false })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity('duplicated', 'resource', duplicated.id, duplicated.name);
  return NextResponse.json({ resource: duplicated }, { status: 201 });
}
