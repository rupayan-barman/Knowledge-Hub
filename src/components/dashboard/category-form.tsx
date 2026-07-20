'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import type { Category } from '@/types/database';

interface Props {
  initialCategory?: Category;
  onDone: () => void;
}

const ICON_OPTIONS = [
  'folder', 'shield', 'keyboard', 'code-2', 'brain-circuit', 'cloud', 'app-window',
  'graduation-cap', 'globe', 'smartphone', 'terminal', 'network', 'layout-template',
  'cpu', 'book-open', 'wrench', 'folder-kanban', 'notebook-pen',
];

export function CategoryForm({ initialCategory, onDone }: Props) {
  const router = useRouter();
  const isEditing = !!initialCategory;

  const [name, setName] = useState(initialCategory?.name ?? '');
  const [description, setDescription] = useState(initialCategory?.description ?? '');
  const [icon, setIcon] = useState(initialCategory?.icon ?? 'folder');
  const [color, setColor] = useState(initialCategory?.color ?? '#00ff9d');
  const [isHidden, setIsHidden] = useState(initialCategory?.is_hidden ?? false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = { name, description: description || null, icon, color, is_hidden: isHidden };

    try {
      const res = await fetch(
        isEditing ? `/api/categories/${initialCategory!.id}` : '/api/categories',
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');

      router.refresh();
      onDone();
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label className="text-sm font-medium mb-1.5 block">Name</label>
        <input value={name} onChange={(e) => setName(e.target.value)} required className="input-field" />
      </div>

      <div>
        <label className="text-sm font-medium mb-1.5 block">Description</label>
        <textarea
          value={description ?? ''}
          onChange={(e) => setDescription(e.target.value)}
          rows={2}
          className="input-field resize-none"
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Icon</label>
          <select value={icon ?? 'folder'} onChange={(e) => setIcon(e.target.value)} className="input-field">
            {ICON_OPTIONS.map((i) => (
              <option key={i} value={i}>
                {i}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Color</label>
          <input
            type="color"
            value={color ?? '#00ff9d'}
            onChange={(e) => setColor(e.target.value)}
            className="input-field h-11 p-1"
          />
        </div>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input type="checkbox" checked={isHidden} onChange={(e) => setIsHidden(e.target.checked)} className="h-4 w-4 accent-accent" />
        Hidden from public site
      </label>

      <div className="flex items-center gap-3 pt-2">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditing ? 'Save Changes' : 'Create Category'}
        </button>
        <button type="button" onClick={onDone} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
