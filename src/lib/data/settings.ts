import { createClient } from '@/lib/supabase/server';
import { DEFAULT_SITE_CONFIG } from '@/config/site';
import type { Settings } from '@/types/database';

/**
 * Reads the single Settings row from the database. Falls back to the
 * static config defaults if the database is unreachable or not yet
 * seeded, so the site never renders broken.
 */
export async function getSettings(): Promise<Settings> {
  try {
    const supabase = createClient();
    const { data, error } = await supabase.from('settings').select('*').single();

    if (error || !data) {
      return buildFallbackSettings();
    }

    return data as Settings;
  } catch {
    return buildFallbackSettings();
  }
}

function buildFallbackSettings(): Settings {
  return {
    id: 'fallback',
    project_name: DEFAULT_SITE_CONFIG.projectName,
    tagline: DEFAULT_SITE_CONFIG.tagline,
    homepage_text: DEFAULT_SITE_CONFIG.description,
    logo_url: null,
    favicon_url: null,
    homepage_banner_url: null,
    footer_text: DEFAULT_SITE_CONFIG.footerCredit,
    theme_default: DEFAULT_SITE_CONFIG.defaultTheme,
    accent_color: DEFAULT_SITE_CONFIG.accentColor,
    social_links: DEFAULT_SITE_CONFIG.social,
    seo_meta_title: DEFAULT_SITE_CONFIG.seo.metaTitle,
    seo_meta_description: DEFAULT_SITE_CONFIG.seo.metaDescription,
    seo_keywords: [...DEFAULT_SITE_CONFIG.seo.keywords],
    updated_at: new Date().toISOString(),
  };
}
