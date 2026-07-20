'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle } from 'lucide-react';
import { ImageUploader } from '@/components/dashboard/image-uploader';
import { TagInput } from '@/components/dashboard/tag-input';
import type { Project } from '@/types/database';

const STATUS_OPTIONS = ['planning', 'in_progress', 'completed', 'archived'] as const;

export function ProjectForm({ initialProject }: { initialProject?: Project }) {
  const router = useRouter();
  const isEditing = !!initialProject;

  const [name, setName] = useState(initialProject?.name ?? '');
  const [description, setDescription] = useState(initialProject?.description ?? '');
  const [thumbnailUrl, setThumbnailUrl] = useState<string | null>(initialProject?.thumbnail_url ?? null);
  const [technologies, setTechnologies] = useState<string[]>(initialProject?.technologies ?? []);
  const [status, setStatus] = useState(initialProject?.status ?? 'in_progress');
  const [githubUrl, setGithubUrl] = useState(initialProject?.github_url ?? '');
  const [liveUrl, setLiveUrl] = useState(initialProject?.live_url ?? '');
  const [futureImprovements, setFutureImprovements] = useState(initialProject?.future_improvements ?? '');
  const [isFeatured, setIsFeatured] = useState(initialProject?.is_featured ?? false);
  const [galleryUrl, setGalleryUrl] = useState<string | null>(null);
  const [gallery, setGallery] = useState<string[]>(initialProject?.gallery ?? []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name,
      description,
      thumbnail_url: thumbnailUrl,
      technologies,
      status,
      github_url: githubUrl || null,
      live_url: liveUrl || null,
      gallery,
      future_improvements: futureImprovements || null,
      is_featured: isFeatured,
    };

    try {
      const res = await fetch(isEditing ? `/api/projects/${initialProject!.id}` : '/api/projects', {
        method: isEditing ? 'PATCH' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');

      router.push('/dashboard/projects');
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
        <h2 className="font-semibold">Project Details</h2>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Project Name</label>
          <input value={name} onChange={(e) => setName(e.target.value)} required className="input-field" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Description</label>
          <textarea value={description} onChange={(e) => setDescription(e.target.value)} required rows={5} className="input-field resize-none" />
        </div>
        <TagInput label="Technology Used" values={technologies} onChange={setTechnologies} placeholder="e.g. Next.js" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Status</label>
            <select value={status} onChange={(e) => setStatus(e.target.value as any)} className="input-field">
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s}>
                  {s.replace('_', ' ')}
                </option>
              ))}
            </select>
          </div>
          <label className="flex items-center gap-2 text-sm self-end pb-2.5">
            <input type="checkbox" checked={isFeatured} onChange={(e) => setIsFeatured(e.target.checked)} className="h-4 w-4 accent-accent" />
            Featured on homepage
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">GitHub URL</label>
            <input type="url" value={githubUrl ?? ''} onChange={(e) => setGithubUrl(e.target.value)} className="input-field" placeholder="https://github.com/…" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Live URL</label>
            <input type="url" value={liveUrl ?? ''} onChange={(e) => setLiveUrl(e.target.value)} className="input-field" placeholder="https://…" />
          </div>
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Future Improvements</label>
          <textarea value={futureImprovements ?? ''} onChange={(e) => setFutureImprovements(e.target.value)} rows={3} className="input-field resize-none" />
        </div>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h2 className="font-semibold">Media</h2>
        <ImageUploader label="Thumbnail" bucket="project-images" usageType="project_image" value={thumbnailUrl} onChange={setThumbnailUrl} aspectClass="aspect-video" />

        <div>
          <label className="text-sm font-medium mb-1.5 block">Gallery</label>
          <div className="flex flex-wrap gap-3 mb-3">
            {gallery.map((src, i) => (
              <div key={i} className="relative h-16 w-24 rounded-lg overflow-hidden border border-border group">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={src} alt={`Gallery ${i + 1}`} className="h-full w-full object-cover" />
                <button
                  type="button"
                  onClick={() => setGallery(gallery.filter((_, idx) => idx !== i))}
                  className="absolute inset-0 bg-background/70 opacity-0 group-hover:opacity-100 flex items-center justify-center text-xs text-danger transition-opacity"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
          <ImageUploader
            label="Add gallery image"
            bucket="project-images"
            usageType="project_image"
            value={galleryUrl}
            onChange={(url) => {
              if (url) setGallery([...gallery, url]);
              setGalleryUrl(null);
            }}
            aspectClass="aspect-video"
          />
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button type="submit" disabled={loading} className="btn-primary">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : isEditing ? 'Save Changes' : 'Create Project'}
        </button>
        <button type="button" onClick={() => router.back()} className="btn-secondary">
          Cancel
        </button>
      </div>
    </form>
  );
}
