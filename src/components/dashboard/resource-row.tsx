'use client';

import { useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  Pin,
  Star,
  Copy,
  Trash2,
  Pencil,
  Archive,
  Loader2,
} from 'lucide-react';
import type { ResourceWithCategory } from '@/types/database';
import { cn } from '@/lib/utils/cn';

const STATUS_STYLES: Record<string, string> = {
  draft: 'text-muted-foreground',
  published: 'text-success',
  hidden: 'text-warning',
  archived: 'text-danger',
};

export function ResourceRow({ resource }: { resource: ResourceWithCategory }) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [confirmingDelete, setConfirmingDelete] = useState(false);

  async function patch(payload: Record<string, unknown>) {
    startTransition(async () => {
      await fetch(`/api/resources/${resource.id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      router.refresh();
    });
  }

  async function handleDuplicate() {
    startTransition(async () => {
      await fetch(`/api/resources/${resource.id}/duplicate`, { method: 'POST' });
      router.refresh();
    });
  }

  async function handleDelete() {
    startTransition(async () => {
      await fetch(`/api/resources/${resource.id}`, { method: 'DELETE' });
      router.refresh();
    });
  }

  return (
    <tr className="border-b border-border last:border-0 hover:bg-surface-hover/40 transition-colors">
      <td className="py-3 px-4">
        <p className="font-medium">{resource.name}</p>
        <p className="text-xs text-muted-foreground">{resource.category?.name ?? 'Uncategorized'}</p>
      </td>
      <td className="py-3 px-4">
        <span className={cn('text-xs font-semibold capitalize', STATUS_STYLES[resource.status])}>
          {resource.status}
        </span>
      </td>
      <td className="py-3 px-4 text-sm text-muted-foreground">{resource.view_count}</td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1 justify-end flex-wrap">
          <button
            title={resource.status === 'published' ? 'Unpublish' : 'Publish'}
            onClick={() => patch({ status: resource.status === 'published' ? 'draft' : 'published' })}
            disabled={isPending}
            className="p-2 rounded-lg hover:bg-surface-hover text-muted-foreground hover:text-foreground"
          >
            {resource.status === 'published' ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          </button>
          <button
            title={resource.is_pinned ? 'Unpin' : 'Pin'}
            onClick={() => patch({ is_pinned: !resource.is_pinned })}
            disabled={isPending}
            className={cn('p-2 rounded-lg hover:bg-surface-hover', resource.is_pinned ? 'text-accent' : 'text-muted-foreground')}
          >
            <Pin className="h-4 w-4" />
          </button>
          <button
            title={resource.is_featured ? 'Unfeature' : 'Feature'}
            onClick={() => patch({ is_featured: !resource.is_featured })}
            disabled={isPending}
            className={cn('p-2 rounded-lg hover:bg-surface-hover', resource.is_featured ? 'text-accent' : 'text-muted-foreground')}
          >
            <Star className="h-4 w-4" />
          </button>
          <button
            title="Archive"
            onClick={() => patch({ status: 'archived' })}
            disabled={isPending}
            className="p-2 rounded-lg hover:bg-surface-hover text-muted-foreground hover:text-warning"
          >
            <Archive className="h-4 w-4" />
          </button>
          <button
            title="Duplicate"
            onClick={handleDuplicate}
            disabled={isPending}
            className="p-2 rounded-lg hover:bg-surface-hover text-muted-foreground hover:text-foreground"
          >
            <Copy className="h-4 w-4" />
          </button>
          <Link
            href={`/dashboard/resources/${resource.id}`}
            title="Edit"
            className="p-2 rounded-lg hover:bg-surface-hover text-muted-foreground hover:text-foreground"
          >
            <Pencil className="h-4 w-4" />
          </Link>
          {confirmingDelete ? (
            <button
              onClick={handleDelete}
              disabled={isPending}
              className="px-2.5 py-1.5 rounded-lg bg-danger/10 text-danger text-xs font-medium"
            >
              {isPending ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Confirm?'}
            </button>
          ) : (
            <button
              title="Delete"
              onClick={() => {
                setConfirmingDelete(true);
                setTimeout(() => setConfirmingDelete(false), 3000);
              }}
              className="p-2 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          )}
        </div>
      </td>
    </tr>
  );
}
