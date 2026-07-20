import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { BackupManager } from '@/components/dashboard/backup-manager';

export const metadata: Metadata = { title: 'Backup & Restore' };
export const dynamic = 'force-dynamic';

export default async function DashboardBackupPage() {
  const supabase = createClient();
  const { count } = await supabase.from('media_assets').select('*', { count: 'exact', head: true });

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Backup &amp; Restore</h1>
      <BackupManager mediaFileCount={count ?? 0} />
    </div>
  );
}
