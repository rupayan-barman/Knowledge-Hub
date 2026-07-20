'use client';

import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { Upload, Trash2, Loader2, Copy, Check } from 'lucide-react';
import type { MediaAsset } from '@/types/database';
import { formatDate, formatNumber } from '@/lib/utils/format';

export function MediaLibraryManager({ initialAssets }: { initialAssets: MediaAsset[] }) {
  const router = useRouter();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  async function handleUpload(files: FileList | null) {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);

    for (const file of Array.from(files)) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('bucket', 'media');
      formData.append('usageType', 'general');

      const res = await fetch('/api/media', { method: 'POST', body: formData });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error ?? 'Upload failed');
      }
    }

    setUploading(false);
    router.refresh();
  }

  async function handleDelete(id: string) {
    setDeletingId(id);
    await fetch(`/api/media/${id}`, { method: 'DELETE' });
    setDeletingId(null);
    router.refresh();
  }

  async function handleCopy(url: string, id: string) {
    await navigator.clipboard.writeText(url);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Media Library</h1>
          <p className="text-muted-foreground text-sm mt-1">{initialAssets.length} files</p>
        </div>
        <label className="btn-primary cursor-pointer">
          {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Upload
          <input
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={(e) => handleUpload(e.target.files)}
          />
        </label>
      </div>

      {error && (
        <div className="rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">{error}</div>
      )}

      {initialAssets.length === 0 ? (
        <div className="glass-panel p-10 text-center text-muted-foreground text-sm">
          No media uploaded yet. Files you upload from any form will also appear here automatically.
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {initialAssets.map((asset) => (
            <div key={asset.id} className="glass-panel p-3 group">
              <div className="relative aspect-square rounded-lg overflow-hidden bg-muted mb-2">
                <Image src={asset.public_url} alt={asset.file_name} fill className="object-cover" unoptimized />
                <div className="absolute inset-0 bg-background/80 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                  <button
                    onClick={() => handleCopy(asset.public_url, asset.id)}
                    aria-label="Copy URL"
                    className="p-2 rounded-lg bg-surface hover:bg-surface-hover"
                  >
                    {copiedId === asset.id ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
                  </button>
                  <button
                    onClick={() => handleDelete(asset.id)}
                    aria-label="Delete"
                    disabled={deletingId === asset.id}
                    className="p-2 rounded-lg bg-surface hover:bg-danger/10 hover:text-danger"
                  >
                    {deletingId === asset.id ? <Loader2 className="h-4 w-4 animate-spin" /> : <Trash2 className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              <p className="text-xs font-medium truncate">{asset.file_name}</p>
              <p className="text-xs text-muted-foreground">
                {formatNumber(Math.round(asset.size_bytes / 1024))} KB · {formatDate(asset.created_at)}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
