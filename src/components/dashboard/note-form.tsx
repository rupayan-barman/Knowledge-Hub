'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { RichTextEditor } from '@/components/notes/rich-text-editor';
import { TagInput } from '@/components/dashboard/tag-input';
import type { Category, Note } from '@/types/database';

const STATUS_OPTIONS = ['draft', 'published', 'hidden', 'archived'] as const;

export function NoteForm({ categories, initialNote }: { categories: Category[]; initialNote?: Note }) {
  const router = useRouter();
  const isEditing = !!initialNote;

  const [title, setTitle] = useState(initialNote?.title ?? '');
  const [content, setContent] = useState<Record<string, unknown>>(
    initialNote?.content ?? { type: 'doc', content: [{ type: 'paragraph' }] }
  );
  const [categoryId, setCategoryId] = useState(initialNote?.category_id ?? '');
  const [tags, setTags] = useState<string[]>(initialNote?.tags ?? []);
  const [status, setStatus] = useState(initialNote?.status ?? 'draft');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = { title, content, category_id: categoryId || null, tags, status };

    try {
      const res = await fetch(isEditing ? `/api/notes/${initialNote!.id}` : '/api/notes', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');

      router.push('/dashboard/notes');
      router.refresh();
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div className="glass-panel p-6 space-y-4">
        <div>
          <label className="text-sm font-medium mb-1.5 block">Title</label>
          <input value={title} onChange={(e) => setTitle(e.target.value)} required className="input-field" />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Category</label>
            <select value={categoryId ?? ''} onChange={(e) => setCategoryId(e.target.value)} className="input-field">
              <option value="">Uncategorized</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.name}
                </option>
              ))}
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="input-field">
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="capitalize">
                  {s}
                </option>
              ))}
            </select>
          </div>
        </div>

        <TagInput label="Tags" values={tags} onChange={setTags} placeholder="Add a tag…" />
      </div>

      <div className="glass-panel p-6 space-y-3">
        <h2 className="font-semibold">Content</h2>
        <RichTextEditor content={content} onChange={setContent} />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditing ? 'Save Changes' : 'Create Note'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
