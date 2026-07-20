import type { Metadata } from 'next';
import Link from 'next/link';
import { NotebookText } from 'lucide-react';
import { getNotes } from '@/lib/data/content';
import { Section, SectionHeader } from '@/components/home/section';
import { formatDate } from '@/lib/utils/format';
import { truncate } from '@/lib/utils/format';

export const metadata: Metadata = { title: 'Notes' };
export const revalidate = 60;

export default async function NotesPage() {
  const notes = await getNotes();

  return (
    <Section className="pt-28">
      <SectionHeader eyebrow="Write-ups" title="Notes" description="Personal notes, kept searchable and organized." />
      {notes.length === 0 ? (
        <p className="text-muted-foreground">No notes published yet.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          {notes.map((note) => (
            <Link
              key={note.id}
              href={`/notes/${note.slug}`}
              className="card-interactive glass-panel p-6 focus-ring"
            >
              <div className="flex items-center gap-2 text-accent mb-2">
                <NotebookText className="h-4 w-4" />
                <span className="text-xs font-medium">{formatDate(note.created_at)}</span>
              </div>
              <h3 className="font-semibold text-lg">{note.title}</h3>
              <p className="mt-2 text-sm text-muted-foreground line-clamp-3">
                {truncate(note.content_text, 160)}
              </p>
              {note.tags.length > 0 && (
                <div className="mt-4 flex flex-wrap gap-1.5">
                  {note.tags.map((tag) => (
                    <span key={tag} className="badge">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </Section>
  );
}
