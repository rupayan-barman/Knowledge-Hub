/**
 * CLI equivalent of Dashboard > Backup > Export Data. Useful for scheduled
 * backups (e.g. a GitHub Action or cron job) that shouldn't require logging
 * into the dashboard.
 *
 * Usage: npm run export-data
 * Writes to ./backups/knowledge-hub-backup-<timestamp>.json
 */
import { createClient } from '@supabase/supabase-js';
import * as dotenv from 'dotenv';
import { mkdir, writeFile } from 'fs/promises';
import path from 'path';

dotenv.config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env.local');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY);

async function main() {
  console.log('Exporting all data...');

  const [categories, resources, projects, notes, mediaAssets, settings] = await Promise.all([
    supabase.from('categories').select('*'),
    supabase.from('resources').select('*'),
    supabase.from('projects').select('*'),
    supabase.from('notes').select('*'),
    supabase.from('media_assets').select('*'),
    supabase.from('settings').select('*').single(),
  ]);

  const exportPayload = {
    exported_at: new Date().toISOString(),
    version: 1,
    data: {
      categories: categories.data ?? [],
      resources: resources.data ?? [],
      projects: projects.data ?? [],
      notes: notes.data ?? [],
      media_assets: mediaAssets.data ?? [],
      settings: settings.data ?? null,
    },
  };

  const outDir = path.join(process.cwd(), 'backups');
  await mkdir(outDir, { recursive: true });

  const fileName = `knowledge-hub-backup-${Date.now()}.json`;
  const filePath = path.join(outDir, fileName);
  await writeFile(filePath, JSON.stringify(exportPayload, null, 2), 'utf-8');

  console.log(`Backup written to backups/${fileName}`);
  console.log(
    `  Categories: ${exportPayload.data.categories.length}, Resources: ${exportPayload.data.resources.length}, ` +
      `Projects: ${exportPayload.data.projects.length}, Notes: ${exportPayload.data.notes.length}, ` +
      `Media: ${exportPayload.data.media_assets.length}`
  );
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
