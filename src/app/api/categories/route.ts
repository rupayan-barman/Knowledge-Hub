import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { categorySchema } from '@/lib/validation/schemas';
import { sanitizePlainText } from '@/lib/utils/sanitize';
import { ensureUniqueSlug } from '@/lib/utils/slug';
import { logActivity } from '@/lib/data/dashboard';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('categories')
    .select('*, resources(count)')
    .order('sort_order', { ascending: true });

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  const categories = (data ?? []).map((row: any) => ({
    ...row,
    resource_count: row.resources?.[0]?.count ?? 0,
  }));

  return NextResponse.json({ categories });
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = categorySchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const values = parsed.data;
  const slug = await ensureUniqueSlug(values.name, async (candidate) => {
    const { data } = await supabase.from('categories').select('id').eq('slug', candidate).maybeSingle();
    return !!data;
  });

  const { data, error } = await supabase
    .from('categories')
    .insert({
      ...values,
      name: sanitizePlainText(values.name),
      description: values.description ? sanitizePlainText(values.description) : null,
      slug,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity('created', 'category', data.id, data.name);
  return NextResponse.json({ category: data }, { status: 201 });
}
