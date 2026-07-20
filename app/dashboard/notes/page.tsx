import type { Metadata } from 'next';
import Link from 'next/link';
import { Plus, Pencil } from 'lucide-react';
import { createClient } from '@/lib/supabase/server';
import { DeleteEntityButton } from '@/components/dashboard/delete-entity-button';
import { formatDate } from '@/lib/utils/format';

export const metadata: Metadata = { title: 'Notes' };
export const dynamic = 'force-dynamic';

export default async function DashboardNotesPage() {
  const supabase = createClient();
  const { data: notes } = await supabase.from('notes').select('*').order('created_at', { ascending: false });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Notes</h1>
          <p className="text-muted-foreground text-sm mt-1">{notes?.length ?? 0} total</p>
        </div>
        <Link href="/dashboard/notes/new" className="btn-primary">
          <Plus className="h-4 w-4" /> Add Note
        </Link>
      </div>

      <div className="glass-panel divide-y divide-border">
        {!notes || notes.length === 0 ? (
          <p className="p-8 text-center text-muted-foreground text-sm">No notes yet.</p>
        ) : (
          notes.map((note) => (
            <div key={note.id} className="flex items-center gap-4 p-4">
              <div className="flex-1 min-w-0">
                <p className="font-medium">{note.title}</p>
                <p className="text-xs text-muted-foreground capitalize">
                  {note.status} · {formatDate(note.created_at)}
                </p>
              </div>
              <div className="flex items-center gap-1">
                <Link href={`/dashboard/notes/${note.id}`} className="p-2 rounded-lg hover:bg-surface-hover text-muted-foreground">
                  <Pencil className="h-4 w-4" />
                </Link>
                <DeleteEntityButton endpoint={`/api/notes/${note.id}`} />
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
