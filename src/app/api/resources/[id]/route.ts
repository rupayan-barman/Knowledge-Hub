import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resourceSchema } from '@/lib/validation/schemas';
import { sanitizePlainText, sanitizeStringArray } from '@/lib/utils/sanitize';
import { generateSlug, ensureUniqueSlug } from '@/lib/utils/slug';
import { logActivity } from '@/lib/data/dashboard';

export const dynamic = 'force-dynamic';

interface Params {
  params: { id: string };
}

export async function GET(_request: NextRequest, { params }: Params) {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('resources')
    .select('*, category:categories(*)')
    .eq('id', params.id)
    .single();

  if (error || !data) return NextResponse.json({ error: 'Not found' }, { status: 404 });
  return NextResponse.json({ resource: data });
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();

  // Support lightweight partial updates (toggle publish/pin/feature) as well
  // as full-form edits, both validated.
  const parsed = resourceSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const values = parsed.data;
  const updatePayload: Record<string, unknown> = { ...values };

  if (values.name) {
    updatePayload.name = sanitizePlainText(values.name);
    const { data: existing } = await supabase.from('resources').select('slug').eq('id', params.id).single();
    if (existing && generateSlug(values.name) !== existing.slug) {
      updatePayload.slug = await ensureUniqueSlug(values.name, async (candidate) => {
        const { data } = await supabase
          .from('resources')
          .select('id')
          .eq('slug', candidate)
          .neq('id', params.id)
          .maybeSingle();
        return !!data;
      });
    }
  }
  if (values.short_description) updatePayload.short_description = sanitizePlainText(values.short_description);
  if (values.detailed_description !== undefined) {
    updatePayload.detailed_description = values.detailed_description
      ? sanitizePlainText(values.detailed_description)
      : null;
  }
  if (values.personal_review !== undefined) {
    updatePayload.personal_review = values.personal_review ? sanitizePlainText(values.personal_review) : null;
  }
  if (values.useful_for !== undefined) {
    updatePayload.useful_for = values.useful_for ? sanitizePlainText(values.useful_for) : null;
  }
  if (values.tags) updatePayload.tags = sanitizeStringArray(values.tags);
  if (values.advantages) updatePayload.advantages = sanitizeStringArray(values.advantages);
  if (values.disadvantages) updatePayload.disadvantages = sanitizeStringArray(values.disadvantages);

  const { data, error } = await supabase
    .from('resources')
    .update(updatePayload)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity('updated', 'resource', data.id, data.name);
  return NextResponse.json({ resource: data });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: existing } = await supabase.from('resources').select('name').eq('id', params.id).single();
  const { error } = await supabase.from('resources').delete().eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity('deleted', 'resource', params.id, existing?.name ?? null);
  return NextResponse.json({ success: true });
}
