import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { projectSchema } from '@/lib/validation/schemas';
import { sanitizePlainText, sanitizeStringArray } from '@/lib/utils/sanitize';
import { generateSlug, ensureUniqueSlug } from '@/lib/utils/slug';
import { logActivity } from '@/lib/data/dashboard';

export const dynamic = 'force-dynamic';

interface Params {
  params: { id: string };
}

export async function PATCH(request: NextRequest, { params }: Params) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = projectSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const values = parsed.data;
  const updatePayload: Record<string, unknown> = { ...values };

  if (values.name) {
    updatePayload.name = sanitizePlainText(values.name);
    const { data: existing } = await supabase.from('projects').select('slug').eq('id', params.id).single();
    if (existing && generateSlug(values.name) !== existing.slug) {
      updatePayload.slug = await ensureUniqueSlug(values.name, async (candidate) => {
        const { data } = await supabase
          .from('projects')
          .select('id')
          .eq('slug', candidate)
          .neq('id', params.id)
          .maybeSingle();
        return !!data;
      });
    }
  }
  if (values.description) updatePayload.description = sanitizePlainText(values.description);
  if (values.future_improvements !== undefined) {
    updatePayload.future_improvements = values.future_improvements ? sanitizePlainText(values.future_improvements) : null;
  }
  if (values.technologies) updatePayload.technologies = sanitizeStringArray(values.technologies);
  if (values.github_url !== undefined) updatePayload.github_url = values.github_url || null;
  if (values.live_url !== undefined) updatePayload.live_url = values.live_url || null;

  const { data, error } = await supabase.from('projects').update(updatePayload).eq('id', params.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity('updated', 'project', data.id, data.name);
  return NextResponse.json({ project: data });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: existing } = await supabase.from('projects').select('name').eq('id', params.id).single();
  const { error } = await supabase.from('projects').delete().eq('id', params.id);
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity('deleted', 'project', params.id, existing?.name ?? null);
  return NextResponse.json({ success: true });
}
