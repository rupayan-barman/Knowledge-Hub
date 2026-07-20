import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { noteSchema } from '@/lib/validation/schemas';
import { sanitizePlainText, sanitizeStringArray } from '@/lib/utils/sanitize';
import { generateSlug, ensureUniqueSlug } from '@/lib/utils/slug';
import { extractTextFromTiptapDoc } from '@/lib/utils/format';
import { logActivity } from '@/lib/data/dashboard';

export const dynamic = 'force-dynamic';

interface Params {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: Params) {
  const supabase = createClient();
  const { data, error } = await supabase.from('notes').select('*').eq('id', params.id).single();
  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ note: data });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = noteSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const values = parsed.data;
  const updatePayload: Record<string, unknown> = { ...values };

  if (values.title) {
    updatePayload.title = sanitizePlainText(values.title);
    const { data: existing } = await supabase.from('notes').select('slug').eq('id', params.id).single();
    if (existing && generateSlug(values.title) !== existing.slug) {
      updatePayload.slug = await ensureUniqueSlug(values.title, async (candidate) => {
        const { data } = await supabase.from('notes').select('id').eq('slug', candidate).neq('id', params.id).maybeSingle();
        return !!data;
      });
    }
  }
  if (values.content) {
    updatePayload.content = values.content;
    updatePayload.content_text = extractTextFromTiptapDoc(values.content);
  }
  if (values.tags) updatePayload.tags = sanitizeStringArray(values.tags);

  const { data, error } = await supabase.from('notes').update(updatePayload).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity('updated', 'note', data.id, data.title);
  return NextResponse.json({ note: data });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: existing } = await supabase.from('notes').select('title').eq('id', params.id).single();
  const { error } = await supabase.from('notes').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity('deleted', 'note', params.id, existing?.title ?? null);
  return NextResponse.json({ success: true });
}
