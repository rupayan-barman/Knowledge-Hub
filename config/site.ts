/**
 * Static fallback configuration.
 *
 * IMPORTANT: These are only used as a fallback before the Settings table
 * has been read, or if the database is unreachable. The actual, live values
 * are stored in the `settings` table in Supabase and are editable by the
 * Owner from /dashboard/settings — no code changes required.
 *
 * PROJECT_NAME is intentionally a placeholder here. Change it once in this
 * file for the initial deploy, then manage it forever after from the
 * dashboard.
 */

export const DEFAULT_SITE_CONFIG = {
  projectName: 'PROJECT_NAME',
  tagline: 'A personal knowledge hub, resource library, and learning portal.',
  description:
    'A curated, ever-growing library of tools, resources, projects, and notes.',
  ownerName: 'Rupayan Barman',
  footerCredit: 'Created with ❤️ by Rupayan Barman',
  defaultTheme: 'dark' as const,
  accentColor: '#00ff9d',
  locale: 'en',
  social: {
    github: '',
    twitter: '',
    linkedin: '',
    email: '',
  },
  seo: {
    metaTitle: 'PROJECT_NAME — Personal Knowledge Hub',
    metaDescription:
      'A curated, ever-growing library of tools, resources, projects, and notes.',
    keywords: ['knowledge hub', 'resources', 'learning', 'projects'],
  },
} as const;

export type SiteConfig = typeof DEFAULT_SITE_CONFIG;

/** Categories seeded on first setup. Owner can add unlimited more later. */
export const DEFAULT_CATEGORIES = [
  { name: 'Cyber Security', icon: 'shield', description: 'Security tools, research, and practice resources.' },
  { name: 'Typing', icon: 'keyboard', description: 'Typing practice and speed-building tools.' },
  { name: 'Programming', icon: 'code-2', description: 'Languages, frameworks, and coding references.' },
  { name: 'Artificial Intelligence', icon: 'brain-circuit', description: 'AI tools, models, and research.' },
  { name: 'Cloud Storage', icon: 'cloud', description: 'Cloud storage and backup services.' },
  { name: 'Software', icon: 'app-window', description: 'General software and utilities.' },
  { name: 'Study', icon: 'graduation-cap', description: 'Study aids and educational platforms.' },
  { name: 'Browser', icon: 'globe', description: 'Browsers, extensions, and web tools.' },
  { name: 'Android Apps', icon: 'smartphone', description: 'Mobile apps for Android.' },
  { name: 'Linux', icon: 'terminal', description: 'Linux distros, tools, and guides.' },
  { name: 'Networking', icon: 'network', description: 'Networking tools and references.' },
  { name: 'Web Development', icon: 'layout-template', description: 'Frontend, backend, and full-stack resources.' },
  { name: 'Electronics', icon: 'cpu', description: 'Hardware, electronics, and IoT.' },
  { name: 'Books', icon: 'book-open', description: 'Reading lists and references.' },
  { name: 'Utilities', icon: 'wrench', description: 'Everyday utility tools.' },
  { name: 'Projects', icon: 'folder-kanban', description: 'Personal project references.' },
  { name: 'Notes', icon: 'notebook-pen', description: 'Personal notes and write-ups.' },
  { name: 'Learning Resources', icon: 'graduation-cap', description: 'Courses and learning platforms.' },
] as const;
