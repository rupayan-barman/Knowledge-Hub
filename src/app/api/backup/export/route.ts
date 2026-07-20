import { NextResponse } from 'next/server';
import { createClient, createServiceRoleClient } from '@/lib/supabase/server';
import { logActivity } from '@/lib/data/dashboard';

export const dynamic = 'force-dynamic';

export async function GET() {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const admin = createServiceRoleClient();

  const [categories, resources, projects, notes, mediaAssets, settings] = await Promise.all([
    admin.from('categories').select('*'),
    admin.from('resources').select('*'),
    admin.from('projects').select('*'),
    admin.from('notes').select('*'),
    admin.from('media_assets').select('*'),
    admin.from('settings').select('*').single(),
  ]);

  const exportPayload = {
    exported_at: new Date().toISOString(),
    version: 1,
    data: {
      categories: categories.data ?? [],
      resources: resources.data ?? [],
      projects: projects.data ?? [],
      notes: notes.data ?? [],
      media_assets: mediaAssets.data ?? [],
      settings: settings.data ?? null,
    },
  };

  await logActivity('exported', 'backup', null, null);

  return new NextResponse(JSON.stringify(exportPayload, null, 2), {
    headers: {
      'Content-Type': 'application/json',
      'Content-Disposition': `attachment; filename="knowledge-hub-backup-${Date.now()}.json"`,
    },
  });
}
