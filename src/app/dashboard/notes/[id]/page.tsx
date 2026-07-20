import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { NoteForm } from '@/components/dashboard/note-form';

export const metadata: Metadata = { title: 'Edit Note' };
export const dynamic = 'force-dynamic';

export default async function EditNotePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: note }, { data: categories }] = await Promise.all([
    supabase.from('notes').select('*').eq('id', params.id).single(),
    supabase.from('categories').select('*').order('sort_order'),
  ]);

  if (!note) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Note</h1>
      <NoteForm categories={categories ?? []} initialNote={note} />
    </div>
  );
}
