/**
 * Seeds the database with the default category list from Part 2 of the
 * spec, plus one sample resource, project, and note so the site isn't
 * empty on first run. Safe to re-run — skips categories that already exist.
 *
 * Usage: npm run seed
 * Requires .env.local with NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY.
 */
import { createClient } from '@supabase/supabase-js';
import slugify from 'slugify';
import * as dotenv from 'dotenv';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

const DEFAULT_CATEGORIES = [
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
];

async function seedCategories() {
  console.log('Seeding categories...');
  const categoryIds: Record<string, string> = {};

  for (let i = 0; i < DEFAULT_CATEGORIES.length; i++) {
    const cat = DEFAULT_CATEGORIES[i];
    if (!cat) continue;
    const slug = slugify(cat.name, { lower: true, strict: true });

    const { data: existing } = await supabase.from('categories').select('id').eq('slug', slug).maybeSingle();
    if (existing) {
      categoryIds[cat.name] = existing.id;
      continue;
    }

    const { data, error } = await supabase
      .from('categories')
      .insert({ ...cat, slug, sort_order: i })
      .select('id')
      .single();

    if (error) {
      console.error(`Failed to seed category "${cat.name}":`, error.message);
      continue;
    }
    categoryIds[cat.name] = data.id;
    console.log(`  ✓ ${cat.name}`);
  }

  return categoryIds;
}

async function seedSampleResource(categoryIds: Record<string, string>) {
  const slug = 'example-resource';
  const { data: existing } = await supabase.from('resources').select('id').eq('slug', slug).maybeSingle();
  if (existing) {
    console.log('Sample resource already exists, skipping.');
    return;
  }

  console.log('Seeding sample resource...');
  await supabase.from('resources').insert({
    slug,
    name: 'Example Resource',
    official_url: 'https://example.com',
    short_description: 'A placeholder resource — edit or delete this from the dashboard.',
    detailed_description:
      'This is a sample resource created by the seed script so the homepage is never empty on first deploy. Edit it from Dashboard > Resources, or delete it entirely.',
    category_id: categoryIds['Web Development'] ?? null,
    tags: ['sample', 'getting-started'],
    difficulty_level: 'beginner',
    learning_type: 'tool',
    status: 'published',
    is_featured: true,
    is_pinned: false,
  });
  console.log('  ✓ Example Resource');
}

async function seedSampleProject() {
  const slug = 'example-project';
  const { data: existing } = await supabase.from('projects').select('id').eq('slug', slug).maybeSingle();
  if (existing) {
    console.log('Sample project already exists, skipping.');
    return;
  }

  console.log('Seeding sample project...');
  await supabase.from('projects').insert({
    slug,
    name: 'Example Project',
    description: 'A placeholder project — edit or delete this from the dashboard.',
    technologies: ['Next.js', 'Supabase', 'Tailwind CSS'],
    status: 'completed',
    is_featured: true,
    sort_order: 0,
  });
  console.log('  ✓ Example Project');
}

async function seedSampleNote() {
  const slug = 'welcome-note';
  const { data: existing } = await supabase.from('notes').select('id').eq('slug', slug).maybeSingle();
  if (existing) {
    console.log('Sample note already exists, skipping.');
    return;
  }

  console.log('Seeding sample note...');
  const content = {
    type: 'doc',
    content: [
      {
        type: 'heading',
        attrs: { level: 2 },
        content: [{ type: 'text', text: 'Welcome to your Knowledge Hub' }],
      },
      {
        type: 'paragraph',
        content: [
          {
            type: 'text',
            text: 'This is a sample note created by the seed script. Edit or delete it from Dashboard > Notes.',
          },
        ],
      },
    ],
  };

  await supabase.from('notes').insert({
    slug,
    title: 'Welcome Note',
    content,
    content_text: 'Welcome to your Knowledge Hub. This is a sample note created by the seed script.',
    tags: ['welcome'],
    status: 'published',
  });
  console.log('  ✓ Welcome Note');
}

async function main() {
  const categoryIds = await seedCategories();
  await seedSampleResource(categoryIds);
  await seedSampleProject();
  await seedSampleNote();
  console.log('\nSeeding complete.');
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
