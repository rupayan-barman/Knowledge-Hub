import Image from 'next/image';
import Link from 'next/link';
import { Github, ExternalLink } from 'lucide-react';
import type { Project } from '@/types/database';
import { cn } from '@/lib/utils/cn';

const STATUS_LABEL: Record<Project['status'], string> = {
  planning: 'Planning',
  in_progress: 'In Progress',
  completed: 'Completed',
  archived: 'Archived',
};

const STATUS_COLOR: Record<Project['status'], string> = {
  planning: 'text-muted-foreground',
  in_progress: 'text-warning',
  completed: 'text-success',
  archived: 'text-muted-foreground',
};

export function ProjectCard({ project }: { project: Project }) {
  return (
    <div className="group card-interactive glass-panel flex flex-col overflow-hidden">
      <div className="relative h-44 w-full bg-muted">
        {project.thumbnail_url ? (
          <Image
            src={project.thumbnail_url}
            alt={project.name}
            fill
            sizes="(max-width: 768px) 100vw, 400px"
            className="object-cover"
          />
        ) : (
          <div className="flex h-full items-center justify-center text-muted-foreground text-sm">
            No preview image
          </div>
        )}
        <span
          className={cn(
            'absolute top-3 right-3 badge bg-background/80',
            STATUS_COLOR[project.status]
          )}
        >
          {STATUS_LABEL[project.status]}
        </span>
      </div>

      <div className="p-5 flex flex-col flex-1">
        <h3 className="font-semibold group-hover:text-accent transition-colors">{project.name}</h3>
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">{project.description}</p>

        {project.technologies.length > 0 && (
          <div className="mt-3 flex flex-wrap gap-1.5">
            {project.technologies.slice(0, 4).map((tech) => (
              <span key={tech} className="badge">
                {tech}
              </span>
            ))}
          </div>
        )}

        <div className="mt-5 flex items-center justify-between">
          <Link href={`/projects/${project.slug}`} className="text-sm font-medium text-accent">
            View Details
          </Link>
          <div className="flex items-center gap-1">
            {project.github_url && (
              <a
                href={project.github_url}
                target="_blank"
                rel="noreferrer"
                aria-label="GitHub repository"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-hover transition-colors"
              >
                <Github className="h-4 w-4" />
              </a>
            )}
            {project.live_url && (
              <a
                href={project.live_url}
                target="_blank"
                rel="noreferrer"
                aria-label="Live site"
                className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-hover transition-colors"
              >
                <ExternalLink className="h-4 w-4" />
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
