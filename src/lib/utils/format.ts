import { format, formatDistanceToNow } from 'date-fns';

export function formatDate(dateString: string): string {
  return format(new Date(dateString), 'MMM d, yyyy');
}

export function formatRelativeTime(dateString: string): string {
  return formatDistanceToNow(new Date(dateString), { addSuffix: true });
}

export function truncate(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  return `${text.slice(0, maxLength).trimEnd()}…`;
}

export function formatNumber(n: number): string {
  return new Intl.NumberFormat('en-US', { notation: n > 9999 ? 'compact' : 'standard' }).format(n);
}

/** Extracts plain text from a Tiptap JSON document for search indexing. */
export function extractTextFromTiptapDoc(doc: any): string {
  if (!doc) return '';
  let text = '';

  function walk(node: any) {
    if (!node) return;
    if (node.type === 'text' && typeof node.text === 'string') {
      text += `${node.text} `;
    }
    if (Array.isArray(node.content)) {
      node.content.forEach(walk);
    }
  }

  walk(doc);
  return text.trim();
}
