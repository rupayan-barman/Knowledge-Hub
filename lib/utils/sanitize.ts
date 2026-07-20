/**
 * Defense-in-depth text sanitization.
 *
 * React already escapes all interpolated text by default, which is our
 * primary XSS defense — we deliberately never use dangerouslySetInnerHTML
 * for user-controlled content. Rich text (Notes) is stored as Tiptap JSON
 * and rendered through a safe node-based renderer, never raw HTML.
 *
 * These helpers add a second layer: stripping control characters and
 * disallowed tags from plain-text fields before they ever reach the
 * database, so stored data itself stays clean.
 */

const SCRIPT_TAG_PATTERN = /<\s*script[^>]*>.*?<\s*\/\s*script\s*>/gis;
const ANY_TAG_PATTERN = /<\/?[^>]+(>|$)/g;
const CONTROL_CHARS_PATTERN = /[\u0000-\u0008\u000B\u000C\u000E-\u001F]/g;

/** Strips any HTML tags and control characters from a plain-text field. */
export function sanitizePlainText(input: string): string {
  return input
    .replace(SCRIPT_TAG_PATTERN, '')
    .replace(ANY_TAG_PATTERN, '')
    .replace(CONTROL_CHARS_PATTERN, '')
    .trim();
}

/** Sanitizes every string in an array (used for tags, advantages, etc). */
export function sanitizeStringArray(input: string[]): string[] {
  return input.map(sanitizePlainText).filter(Boolean);
}

/** Validates that a URL uses http/https only — blocks javascript: and data: URIs. */
export function isSafeUrl(value: string): boolean {
  try {
    const url = new URL(value);
    return url.protocol === 'http:' || url.protocol === 'https:';
  } catch {
    return false;
  }
}
