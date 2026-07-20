import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { MediaLibraryManager } from '@/components/dashboard/media-library-manager';

export const metadata: Metadata = { title: 'Media Library' };
export const dynamic = 'force-dynamic';

export default async function DashboardMediaPage() {
  const supabase = createClient();
  const { data: assets } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false });

  return <MediaLibraryManager initialAssets={assets ?? []} />;
}
