import type { Metadata } from 'next';
import { getCategories } from '@/lib/data/categories';
import { Section, SectionHeader } from '@/components/home/section';
import { CategoryCard } from '@/components/categories/category-card';

export const metadata: Metadata = { title: 'Categories' };
export const revalidate = 60;

export default async function CategoriesPage() {
  const categories = await getCategories();

  return (
    <Section className="pt-28">
      <SectionHeader
        eyebrow="Browse"
        title="All Categories"
        description={`${categories.length} categories and counting.`}
      />
      {categories.length === 0 ? (
        <p className="text-muted-foreground">No categories yet. Check back soon.</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
          {categories.map((category) => (
            <CategoryCard key={category.id} category={category} />
          ))}
        </div>
      )}
    </Section>
  );
}
