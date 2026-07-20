import type { Metadata } from 'next';
import { notFound } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { ResourceForm } from '@/components/dashboard/resource-form';

export const metadata: Metadata = { title: 'Edit Resource' };
export const dynamic = 'force-dynamic';

export default async function EditResourcePage({ params }: { params: { id: string } }) {
  const supabase = createClient();
  const [{ data: resource }, { data: categories }] = await Promise.all([
    supabase.from('resources').select('*').eq('id', params.id).single(),
    supabase.from('categories').select('*').order('sort_order'),
  ]);

  if (!resource) notFound();

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Edit Resource</h1>
      <ResourceForm categories={categories ?? []} initialResource={resource} />
    </div>
  );
}
