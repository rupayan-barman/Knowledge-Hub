import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { NoteForm } from '@/components/dashboard/note-form';

export const metadata: Metadata = { title: 'Add Note' };
export const dynamic = 'force-dynamic';

export default async function NewNotePage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Note</h1>
      <NoteForm categories={categories ?? []} />
    </div>
  );
}
