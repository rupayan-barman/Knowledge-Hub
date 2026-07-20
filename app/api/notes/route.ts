import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { noteSchema } from '@/lib/validation/schemas';
import { sanitizePlainText, sanitizeStringArray } from '@/lib/utils/sanitize';
import { ensureUniqueSlug } from '@/lib/utils/slug';
import { extractTextFromTiptapDoc } from '@/lib/utils/format';
import { logActivity } from '@/lib/data/dashboard';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from('notes').select('*').order('created_at', { ascending: false });
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ notes: data });
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = noteSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const values = parsed.data;
  const slug = await ensureUniqueSlug(values.title, async (candidate) => {
    const { data } = await supabase.from('notes').select('id').eq('slug', candidate).maybeSingle();
    return !!data;
  });

  const { data, error } = await supabase
    .from('notes')
    .insert({
      title: sanitizePlainText(values.title),
      content: values.content,
      content_text: extractTextFromTiptapDoc(values.content),
      category_id: values.category_id || null,
      tags: sanitizeStringArray(values.tags),
      status: values.status,
      slug,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity('created', 'note', data.id, data.title);
  return NextResponse.json({ note: data }, { status: 201 });
}
