import { NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { logActivity } from '@/lib/data/dashboard';

export const dynamic = 'force-dynamic';

export async function DELETE(_request: NextRequest, { params }: { params: { id: string } }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });

  const { data: asset, error: fetchError } = await supabase
    .from('media_assets')
    .select('*')
    .eq('id', params.id)
    .single();

  if (fetchError || !asset) return NextResponse.json({ error: 'Not found' }, { status: 404 });

  const [bucket, ...pathParts] = asset.storage_path.split('/');
  const path = pathParts.join('/');

  await supabase.storage.from(bucket).remove([path]);
  const { error } = await supabase.from('media_assets').delete().eq('id', params.id);

  if (error) return NextResponse.json({ error: error.message }, { status: 400 });

  await logActivity('deleted', 'media', params.id, asset.file_name);
  return NextResponse.json({ success: true });
}
