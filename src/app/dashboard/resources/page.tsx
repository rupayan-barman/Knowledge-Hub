import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { ResourceRow } from '@/components/dashboard/resource-row';
import type { ResourceWithCategory } from '@/types/database';

export const metadata: Metadata = { title: 'Resources' };
export const dynamic = 'force-dynamic';

export default async function DashboardResourcesPage() {
  const supabase = createClient();
  const { data } = await supabase
    .from('resources')
    .select('*, category:categories(*)')
    .order('created_at', { ascending: false });

  const resources = (data ?? []) as unknown as ResourceWithCategory[];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Resources</h1>
          <p className="text-muted-foreground text-sm mt-1">{resources.length} total</p>
        </div>
        <Link href="/dashboard/resources/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Resource
        </Link>
      </div>

      <div className="glass-panel overflow-x-auto">
        {resources.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground text-sm">
            No resources yet. Click "Add Resource" to create your first one.
          </p>
        ) : (
          <table className="w-full text-left">
            <thead>
              <tr className="border-b border-border text-xs uppercase tracking-wide text-muted-foreground">
                <th className="py-3 px-4 font-medium">Name</th>
                <th className="py-3 px-4 font-medium">Status</th>
                <th className="py-3 px-4 font-medium">Views</th>
                <th className="py-3 px-4 font-medium text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {resources.map((resource) => (
                <ResourceRow key={resource.id} resource={resource} />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
