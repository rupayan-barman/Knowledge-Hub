import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Pencil, ExternalLink, Github } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { DeleteProjectButton } from '@/components/dashboard/delete-project-button';

export const metadata: Metadata = { title: 'Projects' };
export const dynamic = 'force-dynamic';

export default async function DashboardProjectsPage() {
  const supabase = createClient();
  const { data: projects } = await supabase.from('projects').select('*').order('sort_order');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Projects</h1>
          <p className="text-muted-foreground text-sm mt-1">{projects?.length ?? 0} total</p>
        </div>
        <Link href="/dashboard/projects/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Project
        </Link>
      </div>

      <div className="glass-panel divide-y divide-border">
        {!projects || projects.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground text-sm">No projects yet.</p>
        ) : (
          projects.map((project) => (
            <div key={project.id} className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{project.name}</p>
                <p className="text-xs text-muted-foreground capitalize">{project.status.replace('_', ' ')}</p>
              </div>
              <div className="flex items-center gap-1">
                {project.github_url && (
                  <a href={project.github_url} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-surface-hover text-muted-foreground">
                    <Github className="h-4 w-4" />
                  </a>
                )}
                {project.live_url && (
                  <a href={project.live_url} target="_blank" rel="noreferrer" className="p-2 rounded-lg hover:bg-surface-hover text-muted-foreground">
                    <ExternalLink className="h-4 w-4" />
                  </a>
                )}
                <Link href={`/dashboard/projects/${project.id}`} className="p-2 rounded-lg hover:bg-surface-hover text-muted-foreground">
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteProjectButton projectId={project.id} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
