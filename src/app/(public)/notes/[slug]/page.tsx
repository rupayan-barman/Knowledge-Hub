import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { Calendar, Tag } from 'lucide-react';
import { getNoteBySlug } from '@/lib/data/content';
import { formatDate } from '@/lib/utils/format';
import { Section } from '@/components/home/section';
import { TiptapRenderer } from '@/components/notes/tiptap-renderer';

interface Props {
  params: { slug: string };
}

export const revalidate = 30;

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const note = await getNoteBySlug(params.slug);
  if (!note) return { title: 'Note not found' };
  return { title: note.title, description: note.content_text.slice(0, 160) };
}

export default async function NoteDetailPage({ params }: Props) {
  const note = await getNoteBySlug(params.slug);
  if (!note || note.status === 'archived' || note.status === 'hidden') notFound();

  return (
    <Section className="pt-28 max-w-3xl">
      <h1 className="text-2xl sm:text-3xl font-bold mb-3">{note.title}</h1>
      <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-muted-foreground mb-8">
        <span className="flex items-center gap-1.5">
          <Calendar className="h-3.5 w-3.5" /> {formatDate(note.created_at)}
        </span>
        {note.tags.length > 0 && (
          <span className="flex items-center gap-1.5 flex-wrap">
            <Tag className="h-3.5 w-3.5" />
            {note.tags.map((tag) => (
              <span key={tag} className="badge">
                {tag}
              </span>
            ))}
          </span>
        )}
      </div>

      <div className="glass-panel p-6 sm:p-8">
        <TiptapRenderer content={note.content} />
      </div>
    </Section>
  );
}
