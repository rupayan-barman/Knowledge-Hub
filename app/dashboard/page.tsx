import type { Metadata } from 'next';
import Link from 'next/link';
import {
  FileStack,
  FolderTree,
  Layers,
  NotebookText,
  Pin,
  FileClock,
  CheckCircle2,
  Plus,
} from 'lucide-react';
import { getDashboardStats, getRecentActivity } from '@/lib/data/dashboard';
import { StatCard } from '@/components/dashboard/stat-card';
import { formatRelativeTime } from '@/lib/utils/format';

export const metadata: Metadata = { title: 'Dashboard' };
export const dynamic = 'force-dynamic';

export default async function DashboardPage() {
  const [stats, activity] = await Promise.all([getDashboardStats(), getRecentActivity()]);

  return (
    <div className="space-y-8">
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">Dashboard</h1>
          <p className="text-muted-foreground text-sm mt-1">Overview of your knowledge hub.</p>
        </div>
        <Link href="/dashboard/resources/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Resource
        </Link>
      </div>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard label="Total Resources" value={stats.total_resources} icon={FileStack} accentColor />
        <StatCard label="Total Categories" value={stats.total_categories} icon={FolderTree} />
        <StatCard label="Total Projects" value={stats.total_projects} icon={Layers} />
        <StatCard label="Total Notes" value={stats.total_notes} icon={NotebookText} />
        <StatCard label="Pinned Resources" value={stats.pinned_resources} icon={Pin} />
        <StatCard label="Draft Resources" value={stats.draft_resources} icon={FileClock} />
        <StatCard label="Published Resources" value={stats.published_resources} icon={CheckCircle2} accentColor />
      </div>

      <div className="glass-panel p-6">
        <h2 className="font-semibold mb-4">Latest Activity</h2>
        {activity.length === 0 ? (
          <p className="text-sm text-muted-foreground">No activity recorded yet.</p>
        ) : (
          <ul className="space-y-3">
            {activity.map((entry) => (
              <li key={entry.id} className="flex items-center justify-between text-sm">
                <span>
                  <span className="text-foreground font-medium capitalize">{entry.action}</span>{' '}
                  <span className="text-muted-foreground">
                    {entry.entity_type}
                    {entry.entity_label ? ` — ${entry.entity_label}` : ''}
                  </span>
                </span>
                <span className="text-muted-foreground shrink-0 ml-4">
                  {formatRelativeTime(entry.created_at)}
                </span>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
