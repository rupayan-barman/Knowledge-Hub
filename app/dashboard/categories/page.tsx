import type { Metadata } from 'next';
import { getCategories } from '@/lib/data/categories';
import { CategoriesManager } from '@/components/dashboard/categories-manager';

export const metadata: Metadata = { title: 'Categories' };
export const dynamic = 'force-dynamic';

export default async function DashboardCategoriesPage() {
  const categories = await getCategories(true);
  return <CategoriesManager initialCategories={categories} />;
}
