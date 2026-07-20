/**
 * Resolves a logo/favicon URL for a resource given its official website URL.
 *
 * Fallback chain (per Part 2 / Part 3 spec):
 *  1. Owner-uploaded logo (handled by caller — this function is only used
 *     when no upload is provided)
 *  2. Auto-fetched favicon via Google's public favicon service
 *  3. Default placeholder icon
 */
export function getAutoFaviconUrl(officialUrl: string, size = 128): string | null {
  try {
    const { hostname } = new URL(officialUrl);
    return `https://www.google.com/s2/favicons?sz=${size}&domain=${hostname}`;
  } catch {
    return null;
  }
}

export const DEFAULT_PLACEHOLDER_LOGO = '/images/placeholder-logo.svg';

/** Resolves the best available logo for a resource, in priority order. */
export function resolveResourceLogo(resource: {
  logo_url: string | null;
  official_url: string;
}): string {
  if (resource.logo_url) return resource.logo_url;
  const auto = getAutoFaviconUrl(resource.official_url);
  return auto ?? DEFAULT_PLACEHOLDER_LOGO;
}
