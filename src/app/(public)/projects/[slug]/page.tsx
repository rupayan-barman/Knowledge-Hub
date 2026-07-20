import type { Metadata } from 'next';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Github, ExternalLink } from 'lucide-react';
import { getProjectBySlug } from '@/lib/data/content';
import { Section } from '@/components/home/section';

interface Props {
  params: { slug: string };
}

export const revalidate = 60;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const project = await getProjectBySlug(params.slug);
  if (!project) return { title: 'Project not found' };
  return { title: project.name, description: project.description };
}

export default async function ProjectDetailPage({ params }: Props) {
  const project = await getProjectBySlug(params.slug);
  if (!project || project.status === 'archived') notFound();

  return (
    <Section className="pt-28 max-w-4xl">
      {project.thumbnail_url && (
        <div className="relative h-64 sm:h-80 w-full rounded-2xl overflow-hidden mb-8 border border-border">
          <Image src={project.thumbnail_url} alt={project.name} fill className="object-cover" />
        </div>
      )}

      <div className="flex flex-wrap items-start justify-between gap-4 mb-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold">{project.name}</h1>
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.technologies.map((tech) => (
              <span key={tech} className="badge">
                {tech}
              </span>
            ))}
          </div>
        </div>
        <div className="flex items-center gap-2">
          {project.github_url && (
            <a href={project.github_url} target="_blank" rel="noreferrer" className="btn-secondary">
              <Github className="h-4 w-4" /> Source
            </a>
          )}
          {project.live_url && (
            <a href={project.live_url} target="_blank" rel="noreferrer" className="btn-primary">
              <ExternalLink className="h-4 w-4" /> Live
            </a>
          )}
        </div>
      </div>

      <div className="glass-panel p-6 mb-6 prose prose-invert max-w-none prose-p:text-muted-foreground">
        <p>{project.description}</p>
      </div>

      {project.gallery.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-6">
          {project.gallery.map((src, i) => (
            <div key={i} className="relative aspect-video rounded-xl overflow-hidden border border-border">
              <Image src={src} alt={`${project.name} screenshot ${i + 1}`} fill className="object-cover" />
            </div>
          ))}
        </div>
      )}

      {project.future_improvements && (
        <div className="glass-panel p-6">
          <h2 className="font-semibold mb-2">Future Improvements</h2>
          <p className="text-muted-foreground">{project.future_improvements}</p>
        </div>
      )}
    </Section>
  );
}
