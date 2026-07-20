import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { categorySchema } from '@/lib/validation/schemas';
import { sanitizePlainText } from '@/lib/utils/sanitize';
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
  const parsed = categorySchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const values = parsed.data;
  const updatePayload: Record<string, unknown> = { ...values };
  if (values.name) updatePayload.name = sanitizePlainText(values.name);
  if (values.description !== undefined) {
    updatePayload.description = values.description ? sanitizePlainText(values.description) : null;
  }

  const { data, error } = await supabase
    .from('categories')
    .update(updatePayload)
    .eq('id', params.id)
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity('updated', 'category', data.id, data.name);
  return NextResponse.json({ category: data });
}

export async function DELETE(_request: NextRequest, { params }: Params) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: existing } = await supabase.from('categories').select('name').eq('id', params.id).single();
  const { error } = await supabase.from('categories').delete().eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity('deleted', 'category', params.id, existing?.name ?? null);
  return NextResponse.json({ success: true });
}
