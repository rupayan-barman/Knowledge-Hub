import type { Metadata } from 'next';
import Link from 'next/link';
import { Database } from 'lucide-react';
import { getSettings } from '@/lib/data/settings';
import { SettingsForm } from '@/components/dashboard/settings-form';

export const metadata: Metadata = { title: 'Settings' };
export const dynamic = 'force-dynamic';

export default async function DashboardSettingsPage() {
  const settings = await getSettings();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Settings</h1>
        <Link href="/dashboard/backup" className="btn-secondary text-sm">
          <Database className="h-4 w-4" /> Backup &amp; Restore
        </Link>
      </div>
      <SettingsForm initialSettings={settings} />
    </div>
  );
}
