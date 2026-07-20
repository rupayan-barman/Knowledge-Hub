import { NextRequest, NextResponse } from 'next/server';
import { z } from 'zod';
import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import { logActivity } from '@/lib/data/dashboard';

export const dynamic = 'force-dynamic';

const backupSchema = z.object({
  version: z.number(),
  data: z.object({
    categories: z.array(z.record(z.any())).default([]),
    resources: z.array(z.record(z.any())).default([]),
    projects: z.array(z.record(z.any())).default([]),
    notes: z.array(z.record(z.any())).default([]),
    media_assets: z.array(z.record(z.any())).default([]),
    settings: z.record(z.any()).nullable().optional(),
  }),
});

export async function POST(request: NextRequest) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON file' }, { status: 400 });
  }

  const parsed = backupSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json({ error: 'This does not look like a valid backup file' }, { status: 400 });
  }

  const admin = createServiceRoleClient();
  const { categories, resources, projects, notes, media_assets, settings } = parsed.data.data;

  const results = await Promise.all([
    categories.length ? admin.from('categories').upsert(categories, { onConflict: 'id' }) : null,
    resources.length ? admin.from('resources').upsert(resources, { onConflict: 'id' }) : null,
    projects.length ? admin.from('projects').upsert(projects, { onConflict: 'id' }) : null,
    notes.length ? admin.from('notes').upsert(notes, { onConflict: 'id' }) : null,
    media_assets.length ? admin.from('media_assets').upsert(media_assets, { onConflict: 'id' }) : null,
    settings ? admin.from('settings').update(settings).eq('id', settings.id) : null,
  ]);

  const failed = results.find((r) => r?.error);
  if (failed?.error) {
    return NextResponse.json({ error: failed.error.message }, { status: 400 });
  }

  await logActivity('restored', 'backup', null, null);
  return NextResponse.json({ success: true });
}
