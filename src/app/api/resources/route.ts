import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { resourceSchema } from '@/lib/validation/schemas';
import { sanitizePlainText, sanitizeStringArray } from '@/lib/utils/sanitize';
import { ensureUniqueSlug } from '@/lib/utils/slug';
import { logActivity } from '@/lib/data/dashboard';

export const dynamic = 'force-dynamic';

async function requireOwner() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  return { supabase, user };
}

export async function GET(request: NextRequest) {
  const { supabase } = await requireOwner();
  const status = request.nextUrl.searchParams.get('status');

  let query = supabase.from('resources').select('*, category:categories(*)').order('created_at', { ascending: false });
  if (status) query = query.eq('status', status);

  const { data, error } = await query;
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ resources: data });
}

export async function POST(request: NextRequest) {
  const { supabase, user } = await requireOwner();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = resourceSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const values = parsed.data;
  const slug = await ensureUniqueSlug(values.name, async (candidate) => {
    const { data } = await supabase.from('resources').select('id').eq('slug', candidate).maybeSingle();
    return !!data;
  });

  const { data, error } = await supabase
    .from('resources')
    .insert({
      ...values,
      name: sanitizePlainText(values.name),
      short_description: sanitizePlainText(values.short_description),
      detailed_description: values.detailed_description ? sanitizePlainText(values.detailed_description) : null,
      personal_review: values.personal_review ? sanitizePlainText(values.personal_review) : null,
      useful_for: values.useful_for ? sanitizePlainText(values.useful_for) : null,
      tags: sanitizeStringArray(values.tags),
      advantages: sanitizeStringArray(values.advantages),
      disadvantages: sanitizeStringArray(values.disadvantages),
      slug,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity('created', 'resource', data.id, data.name);
  return NextResponse.json({ resource: data }, { status: 201 });
}
