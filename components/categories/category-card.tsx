import Link from 'next/link';
import * as Icons from 'lucide-react';
import type { CategoryWithCount } from '@/types/database';
import { cn } from '@/lib/utils/cn';

function resolveIcon(name: string | null) {
  const key = (name ?? 'folder')
    .split('-')
    .map((s, i) => (i === 0 ? s : s.charAt(0).toUpperCase() + s.slice(1)))
    .join('');
  const PascalKey = key.charAt(0).toUpperCase() + key.slice(1);
  return (Icons as unknown as Record<string, Icons.LucideIcon>)[PascalKey] ?? Icons.Folder;
}

export function CategoryCard({ category }: { category: CategoryWithCount }) {
  const Icon = resolveIcon(category.icon);

  return (
    <Link
      href={`/categories/${category.slug}`}
      className="group card-interactive glass-panel flex flex-col p-5 focus-ring"
    >
      <div
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-xl transition-transform group-hover:scale-105'
        )}
        style={{
          backgroundColor: `${category.color ?? '#00ff9d'}1A`,
          color: category.color ?? '#00ff9d',
        }}
      >
        <Icon className="h-5 w-5" />
      </div>
      <h3 className="mt-4 font-semibold group-hover:text-accent transition-colors">
        {category.name}
      </h3>
      {category.description && (
        <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
          {category.description}
        </p>
      )}
      <span className="mt-4 text-xs font-medium text-muted-foreground">
        {category.resource_count} resource{category.resource_count === 1 ? '' : 's'}
      </span>
    </Link>
  );
}
