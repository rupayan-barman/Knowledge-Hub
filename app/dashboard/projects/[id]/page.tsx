import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ProjectForm } from '@/components/dashboard/project-form';

export const metadata: Metadata = { title: 'Edit Project' };
export const dynamic = 'force-dynamic';

export default async function EditProjectPage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const { data: project } = await supabase.from('projects').select('*').eq('id', params.id).single();
  if (!project) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Project</h1>
      <ProjectForm initialProject={project} />
    </div>
  );
}
