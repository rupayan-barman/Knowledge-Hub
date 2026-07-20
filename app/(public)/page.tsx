import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { getSettings } from '@/lib/data/settings';
import { getCategories } from '@/lib/data/categories';
import { getResources } from '@/lib/data/resources';
import { getProjects } from '@/lib/data/content';
import { HeroSection } from '@/components/home/hero-section';
import { Section, SectionHeader } from '@/components/home/section';
import { CategoryCard } from '@/components/categories/category-card';
import { ResourceCard } from '@/components/resources/resource-card';
import { ProjectCard } from '@/components/projects/project-card';
import { GlobalSearch } from '@/components/shared/global-search';

export const revalidate = 60;

export default async function HomePage() {
  const [settings, categories, latestResources, featuredResources, projects] = await Promise.all([
    getSettings(),
    getCategories(),
    getResources({ limit: 8 }),
    getResources({ featuredOnly: true, limit: 4 }),
    getProjects(true),
  ]);

  return (
    <>
      <HeroSection
        projectName={settings.project_name}
        tagline={settings.tagline}
        homepageText={settings.homepage_text}
      />

      {/* ABOUT */}
      <Section className="pt-0">
        <div className="glass-panel p-8 sm:p-10 text-center max-w-3xl mx-auto">
          <span className="text-xs font-semibold uppercase tracking-widest text-accent">About</span>
          <h2 className="mt-2 text-2xl font-bold">Built by {settings.project_name.split(' ')[0]}</h2>
          <p className="mt-3 text-muted-foreground">
            {settings.homepage_text ??
              'This is a living library of the tools, resources, and projects worth remembering — organized, searchable, and always growing.'}
          </p>
        </div>
      </Section>

      {/* FEATURED CATEGORIES */}
      {categories.length > 0 && (
        <Section>
          <div className="flex items-end justify-between">
            <SectionHeader
              eyebrow="Explore"
              title="Featured Categories"
              description="Browse the library by topic."
              className="mb-8"
            />
            <Link
              href="/categories"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {categories.slice(0, 8).map((category) => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </Section>
      )}

      {/* LATEST RESOURCES */}
      {latestResources.length > 0 && (
        <Section className="bg-surface/30">
          <div className="flex items-end justify-between">
            <SectionHeader
              eyebrow="Fresh"
              title="Latest Resources"
              description="Newest additions to the library."
              className="mb-8"
            />
            <Link
              href="/resources"
              className="hidden sm:flex items-center gap-1 text-sm font-medium text-accent"
            >
              View all
              <ArrowRight className="h-3.5 w-3.5" />
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {latestResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </Section>
      )}

      {/* FEATURED RESOURCES */}
      {featuredResources.length > 0 && (
        <Section>
          <SectionHeader
            eyebrow="Owner's Picks"
            title="Featured Resources"
            description="Hand-picked and pinned to the top."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {featuredResources.map((resource) => (
              <ResourceCard key={resource.id} resource={resource} />
            ))}
          </div>
        </Section>
      )}

      {/* PERSONAL PROJECTS */}
      {projects.length > 0 && (
        <Section className="bg-surface/30">
          <SectionHeader
            eyebrow="Portfolio"
            title="Personal Projects"
            description="Things built along the way."
          />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </Section>
      )}

      {/* SEARCH */}
      <Section className="text-center">
        <SectionHeader
          eyebrow="Find anything"
          title="Search the entire hub"
          description="Resources, categories, projects, and notes — all in one place."
          className="mx-auto"
        />
        <GlobalSearch />
      </Section>
    </>
  );
}
