'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { ImageUploader } from '@/components/dashboard/image-uploader';
import { TagInput } from '@/components/dashboard/tag-input';
import { getAutoFaviconUrl } from '@/lib/utils/favicon';
import type { Category, Resource } from '@/types/database';

interface Props {
  categories: Category[];
  initialResource?: Resource;
}

const DIFFICULTY_OPTIONS = ['beginner', 'intermediate', 'advanced', 'expert'] as const;
const LEARNING_TYPE_OPTIONS = [
  'documentation',
  'video_course',
  'interactive',
  'book',
  'tool',
  'article',
  'community',
  'other',
] as const;
const STATUS_OPTIONS = ['draft', 'published', 'hidden', 'archived'] as const;

export function ResourceForm({ categories, initialResource }: Props) {
  const router = useRouter();
  const isEditing = !!initialResource;

  const [name, setName] = useState(initialResource?.name ?? '');
  const [officialUrl, setOfficialUrl] = useState(initialResource?.official_url ?? '');
  const [shortDescription, setShortDescription] = useState(initialResource?.short_description ?? '');
  const [detailedDescription, setDetailedDescription] = useState(initialResource?.detailed_description ?? '');
  const [categoryId, setCategoryId] = useState(initialResource?.category_id ?? '');
  const [tags, setTags] = useState<string[]>(initialResource?.tags ?? []);
  const [difficulty, setDifficulty] = useState(initialResource?.difficulty_level ?? '');
  const [learningType, setLearningType] = useState(initialResource?.learning_type ?? '');
  const [personalReview, setPersonalReview] = useState(initialResource?.personal_review ?? '');
  const [advantages, setAdvantages] = useState<string[]>(initialResource?.advantages ?? []);
  const [disadvantages, setDisadvantages] = useState<string[]>(initialResource?.disadvantages ?? []);
  const [usefulFor, setUsefulFor] = useState(initialResource?.useful_for ?? '');
  const [status, setStatus] = useState(initialResource?.status ?? 'draft');
  const [isFeatured, setIsFeatured] = useState(initialResource?.is_featured ?? false);
  const [isPinned, setIsPinned] = useState(initialResource?.is_pinned ?? false);
  const [logoUrl, setLogoUrl] = useState<string | null>(initialResource?.logo_url ?? null);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(initialResource?.screenshot_url ?? null);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name,
      official_url: officialUrl,
      short_description: shortDescription,
      detailed_description: detailedDescription || null,
      category_id: categoryId || null,
      tags,
      difficulty_level: difficulty || null,
      learning_type: learningType || null,
      personal_review: personalReview || null,
      advantages,
      disadvantages,
      useful_for: usefulFor || null,
      status,
      is_featured: isFeatured,
      is_pinned: isPinned,
      logo_url: logoUrl,
      screenshot_url: screenshotUrl,
    };

    try {
      const res = await fetch(
        isEditing ? `/api/resources/${initialResource!.id}` : '/api/resources',
        {
          method: isEditing ? 'PATCH' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        }
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');

      router.push('/dashboard/resources');
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
        <h2 className="font-semibold">Basic Information</h2>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Website Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="input-field" placeholder="e.g. Notion" />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Official URL</label>
          <input
            type="url"
            value={officialUrl}
            onChange={(e) => setOfficialUrl(e.target.value)}
            required
            className="input-field"
            placeholder="https://example.com"
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Short Description</label>
          <textarea
            value={shortDescription}
            onChange={(e) => setShortDescription(e.target.value)}
            required
            maxLength={200}
            rows={2}
            className="input-field resize-none"
            placeholder="One or two sentences — shown on cards."
          />
        </div>

        <div>
          <label className="text-sm font-medium mb-1.5 block">Detailed Description</label>
          <textarea
            value={detailedDescription ?? ''}
            onChange={(e) => setDetailedDescription(e.target.value)}
            rows={5}
            className="input-field resize-none"
            placeholder="Full write-up shown on the resource's details page."
          />
        </div>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h2 className="font-semibold">Classification</h2>

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
            <label className="text-sm font-medium mb-1.5 block">Difficulty Level</label>
            <select value={difficulty ?? ''} onChange={(e) => setDifficulty(e.target.value as any)} className="input-field">
              <option value="">Not specified</option>
              {DIFFICULTY_OPTIONS.map((d) => (
                <option key={d} value={d} className="capitalize">
                  {d}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="text-sm font-medium mb-1.5 block">Learning Type</label>
            <select value={learningType ?? ''} onChange={(e) => setLearningType(e.target.value as any)} className="input-field">
              <option value="">Not specified</option>
              {LEARNING_TYPE_OPTIONS.map((t) => (
                <option key={t} value={t}>
                  {t.replace('_', ' ')}
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

        <div>
          <label className="text-sm font-medium mb-1.5 block">Useful For</label>
          <input value={usefulFor ?? ''} onChange={(e) => setUsefulFor(e.target.value)} className="input-field" placeholder="e.g. Students, developers, writers…" />
        </div>

        <div className="flex items-center gap-6 pt-1">
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 accent-accent" />
            Featured
          </label>
          <label className="flex items-center gap-2 text-sm">
            <input type="checkbox" checked={isPinned} onChange={(e) => setIsPinned(e.target.checked)} className="h-4 w-4 accent-accent" />
            Pinned
          </label>
        </div>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h2 className="font-semibold">Personal Review</h2>
        <textarea
          value={personalReview ?? ''}
          onChange={(e) => setPersonalReview(e.target.value)}
          rows={4}
          className="input-field resize-none"
          placeholder="Your honest take on this resource."
        />
        <TagInput label="Advantages" values={advantages} onChange={setAdvantages} placeholder="Add an advantage…" />
        <TagInput label="Disadvantages" values={disadvantages} onChange={setDisadvantages} placeholder="Add a disadvantage…" />
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h2 className="font-semibold">Media</h2>
        <ImageUploader
          label="Logo"
          bucket="logos"
          usageType="logo"
          value={logoUrl}
          onChange={setLogoUrl}
          autoFetchUrl={officialUrl ? getAutoFaviconUrl(officialUrl) : null}
        />
        <ImageUploader
          label="Website Screenshot"
          bucket="screenshots"
          usageType="screenshot"
          value={screenshotUrl}
          onChange={setScreenshotUrl}
          aspectClass="aspect-video"
        />
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditing ? 'Save Changes' : 'Create Resource'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
