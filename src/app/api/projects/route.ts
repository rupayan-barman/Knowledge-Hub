import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { projectSchema } from '@/lib/validation/schemas';
import { sanitizePlainText, sanitizeStringArray } from '@/lib/utils/sanitize';
import { ensureUniqueSlug } from '@/lib/utils/slug';
import { logActivity } from '@/lib/data/dashboard';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient();
  const { data, error } = await supabase.from('projects').select('*').order('sort_order');
  if (error) return NextResponse.json({ error: error.message }, { status: 400 });
  return NextResponse.json({ projects: data });
}

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const body = await request.json();
  const parsed = projectSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.errors[0]?.message ?? 'Invalid input' }, { status: 400 });
  }

  const values = parsed.data;
  const slug = await ensureUniqueSlug(values.name, async (candidate) => {
    const { data } = await supabase.from('projects').select('id').eq('slug', candidate).maybeSingle();
    return !!data;
  });

  const { data, error } = await supabase
    .from('projects')
    .insert({
      ...values,
      name: sanitizePlainText(values.name),
      description: sanitizePlainText(values.description),
      future_improvements: values.future_improvements ? sanitizePlainText(values.future_improvements) : null,
      technologies: sanitizeStringArray(values.technologies),
      github_url: values.github_url || null,
      live_url: values.live_url || null,
      slug,
    })
    .select()
    .single();

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity('created', 'project', data.id, data.name);
  return NextResponse.json({ project: data }, { status: 201 });
}
