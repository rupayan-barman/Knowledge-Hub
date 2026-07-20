import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { settingsSchema } from '@/lib/validation/schemas';
import { sanitizePlainText, sanitizeStringArray } from '@/lib/utils/sanitize';
import { logActivity } from '@/lib/data/dashboard';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from('settings').select('*').single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ settings: data });
}

export async function PATCH(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = settingsSchema.partial().safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const values = parsed.data;
  const updatePayload: Record<string, unknown> = { ...values };
  if (values.project_name) updatePayload.project_name = sanitizePlainText(values.project_name);
  if (values.tagline !== undefined) updatePayload.tagline = values.tagline ? sanitizePlainText(values.tagline) : null;
  if (values.homepage_text !== undefined) {
    updatePayload.homepage_text = values.homepage_text ? sanitizePlainText(values.homepage_text) : null;
  }
  if (values.footer_text) updatePayload.footer_text = sanitizePlainText(values.footer_text);
  if (values.seo_keywords) updatePayload.seo_keywords = sanitizeStringArray(values.seo_keywords);

  const { data: existing } = await supabase.from('settings').select('id').single();
  if (!existing) return NextResponse.json({ error: 'Settings row not found' }, { status: 404 });

  const { data, error } = await supabase.from('settings').update(updatePayload).eq('id', existing.id).select().single();
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity('updated', 'settings', data.id, data.project_name);
  return NextResponse.json({ settings: data });
}
