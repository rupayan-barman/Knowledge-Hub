import type { Metadata } from 'next';
import { ProjectForm } from '@/components/dashboard/project-form';

export const metadata: Metadata = { title: 'Add Project' };

export default function NewProjectPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Project</h1>
      <ProjectForm />
    </div>
  );
}
