'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import * as Icons from 'lucide-react';
import { Plus, Pencil, Trash2, ArrowUp, ArrowDown, EyeOff, Eye } from 'lucide-react';
import { Modal } from '@/components/ui/modal';
import { CategoryForm } from '@/components/dashboard/category-form';
import type { CategoryWithCount } from '@/types/database';

export function CategoriesManager({ initialCategories }: { initialCategories: CategoryWithCount[] }) {
  const router = useRouter();
  const [categories, setCategories] = useState(initialCategories);
  const [modalMode, setModalMode] = useState<'create' | 'edit' | null>(null);
  const [editingCategory, setEditingCategory] = useState<CategoryWithCount | null>(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);

  function openCreate() {
    setEditingCategory(null);
    setModalMode('create');
  }

  function openEdit(category: CategoryWithCount) {
    setEditingCategory(category);
    setModalMode('edit');
  }

  async function toggleHidden(category: CategoryWithCount) {
    await fetch(`/api/categories/${category.id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ is_hidden: !category.is_hidden }),
    });
    router.refresh();
  }

  async function handleDelete(id: string) {
    await fetch(`/api/categories/${id}`, { method: 'DELETE' });
    router.refresh();
  }

  async function move(index: number, direction: -1 | 1) {
    const targetIndex = index + direction;
    if (targetIndex < 0 || targetIndex >= categories.length) return;

    const reordered = [...categories];
    const a = reordered[index];
    const b = reordered[targetIndex];
    if (!a || !b) return;
    reordered[index] = b;
    reordered[targetIndex] = a;
    setCategories(reordered);

    await fetch('/api/categories/reorder', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        order: reordered.map((c, i) => ({ id: c.id, sort_order: i })),
      }),
    });
    router.refresh();
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Categories</h1>
          <p className="text-muted-foreground text-sm mt-1">{categories.length} categories</p>
        </div>
        <button onClick={openCreate} className="btn-primary">
          <Plus className="h-4 w-4" /> Add Category
        </button>
      </div>

      <div className="glass-panel divide-y divide-border">
        {categories.length === 0 && (
          <p className="p-8 text-center text-muted-foreground text-sm">No categories yet.</p>
        )}
        {categories.map((category, index) => {
          const Icon =
            (Icons as unknown as Record<string, Icons.LucideIcon>)[
              (category.icon ?? 'folder').charAt(0).toUpperCase() + (category.icon ?? 'folder').slice(1)
            ] ?? Icons.Folder;

          return (
            <div key={category.id} className="flex items-center gap-4 p-4">
              <div className="flex flex-col gap-0.5">
                <button onClick={() => move(index, -1)} disabled={index === 0} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <ArrowUp className="h-3.5 w-3.5" />
                </button>
                <button onClick={() => move(index, 1)} disabled={index === categories.length - 1} className="p-1 text-muted-foreground hover:text-foreground disabled:opacity-30">
                  <ArrowDown className="h-3.5 w-3.5" />
                </button>
              </div>

              <div
                className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
                style={{ backgroundColor: `${category.color ?? '#00ff9d'}1A`, color: category.color ?? '#00ff9d' }}
              >
                <Icon className="h-4.5 w-4.5" />
              </div>

              <div className="flex-1 min-w-0">
                <p className="font-medium">{category.name}</p>
                <p className="text-xs text-muted-foreground">{category.resource_count} resources</p>
              </div>

              <div className="flex items-center gap-1">
                <button onClick={() => toggleHidden(category)} title={category.is_hidden ? 'Unhide' : 'Hide'} className="p-2 rounded-lg hover:bg-surface-hover text-muted-foreground">
                  {category.is_hidden ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
                <button onClick={() => openEdit(category)} title="Edit" className="p-2 rounded-lg hover:bg-surface-hover text-muted-foreground">
                  <Pencil className="h-4 w-4" />
                </button>
                {confirmDeleteId === category.id ? (
                  <button onClick={() => handleDelete(category.id)} className="px-2.5 py-1.5 rounded-lg bg-danger/10 text-danger text-xs font-medium">
                    Confirm?
                  </button>
                ) : (
                  <button
                    onClick={() => {
                      setConfirmDeleteId(category.id);
                      setTimeout(() => setConfirmDeleteId(null), 3000);
                    }}
                    title="Delete"
                    className="p-2 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {modalMode && (
        <Modal title={modalMode === 'create' ? 'Add Category' : 'Edit Category'} onClose={() => setModalMode(null)}>
          <CategoryForm
            initialCategory={editingCategory ?? undefined}
            onDone={() => setModalMode(null)}
          />
        </Modal>
      )}
    </div>
  );
}
