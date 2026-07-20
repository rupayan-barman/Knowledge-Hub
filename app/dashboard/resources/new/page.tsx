import type { Metadata } from 'next';
import { createClient } from '@/lib/supabase/server';
import { ResourceForm } from '@/components/dashboard/resource-form';

export const metadata: Metadata = { title: 'Add Resource' };
export const dynamic = 'force-dynamic';

export default async function NewResourcePage() {
  const supabase = createClient();
  const { data: categories } = await supabase.from('categories').select('*').order('sort_order');

  return (
    <div>
      <h1 className="text-2xl font-bold mb-6">Add Resource</h1>
      <ResourceForm categories={categories ?? []} />
    </div>
  );
}
