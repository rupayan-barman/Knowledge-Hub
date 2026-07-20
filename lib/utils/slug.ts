import slugify from 'slugify';
import { nanoid } from 'nanoid';

/**
 * Generates a URL-safe slug from a title. Appends a short random suffix
 * only when a collision is detected by the caller (see ensureUniqueSlug).
 */
export function generateSlug(input: string): string {
  return slugify(input, {
    lower: true,
    strict: true,
    trim: true,
  });
}

/**
 * Given a base slug and a checker function that returns true if a slug
 * is already taken, returns a guaranteed-unique slug — appending a short
 * random suffix if needed.
 */
export async function ensureUniqueSlug(
  base: string,
  isTaken: (slug: string) => Promise<boolean>
): Promise<string> {
  const baseSlug = generateSlug(base) || 'item';

  if (!(await isTaken(baseSlug))) {
    return baseSlug;
  }

  // Try a handful of short suffixes before giving up to a fully random one.
  for (let i = 0; i < 5; i++) {
    const candidate = `${baseSlug}-${nanoid(4).toLowerCase()}`;
    if (!(await isTaken(candidate))) {
      return candidate;
    }
  }

  return `${baseSlug}-${nanoid(8).toLowerCase()}`;
}
