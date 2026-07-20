import type { Metadata } from 'next';
import { getProjects } from '@/lib/data/content';
import { Section, SectionHeader } from '@/components/home/section';
import { ProjectCard } from '@/components/projects/project-card';

export const metadata: Metadata = { title: 'Projects' };
export const revalidate = 60;

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <Section className="pt-28">
      <SectionHeader eyebrow="Portfolio" title="Personal Projects" description="Things built along the way." />
      {projects.length === 0 ? (
        <p className="text-muted-foreground">No projects published yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((project) => (
            <ProjectCard key={project.id} project={project} />
          ))}
        </div>
      )}
    </Section>
  );
}
