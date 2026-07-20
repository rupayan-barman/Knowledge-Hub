import type { MetadataRoute } from 'next';
import { getSettings } from '@/lib/data/settings';

export default async function manifest(): Promise<MetadataRoute.Manifest> {
  const settings = await getSettings();

  return {
    name: settings.project_name,
    short_name: settings.project_name,
    description: settings.tagline ?? 'A personal knowledge hub and resource library.',
    start_url: '/',
    display: 'standalone',
    background_color: '#050505',
    theme_color: '#050505',
    icons: [
      {
        src: settings.favicon_url ?? '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
      },
      {
        src: settings.favicon_url ?? '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
      },
    ],
  };
}
