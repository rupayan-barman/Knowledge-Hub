'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import { Upload, Loader2, X, Wand2 } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

interface Props {
  value: string | null;
  onChange: (url: string | null) => void;
  bucket: 'logos' | 'screenshots' | 'covers' | 'project-images' | 'media';
  usageType: string;
  label: string;
  autoFetchUrl?: string | null;
  aspectClass?: string;
}

export function ImageUploader({ value, onChange, bucket, usageType, label, autoFetchUrl, aspectClass = 'aspect-square' }: Props) {
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  async function handleFile(file: File) {
    setError(null);
    setUploading(true);

    const formData = new FormData();
    formData.append('file', file);
    formData.append('bucket', bucket);
    formData.append('usageType', usageType);

    try {
      const res = await fetch('/api/media', { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      onChange(data.media.public_url);
    } catch (err: any) {
      setError(err.message ?? 'Upload failed');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div>
      <label className="text-sm font-medium mb-1.5 block">{label}</label>
      <div className="flex items-start gap-4">
        <div
          className={cn(
            'relative w-24 shrink-0 overflow-hidden rounded-xl border border-border bg-muted',
            aspectClass
          )}
        >
          {value ? (
            <Image src={value} alt={label} fill className="object-contain p-2" unoptimized />
          ) : (
            <div className="flex h-full items-center justify-center text-muted-foreground">
              <Upload className="h-5 w-5" />
            </div>
          )}
          {uploading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/70">
              <Loader2 className="h-5 w-5 animate-spin text-accent" />
            </div>
          )}
        </div>

        <div className="flex flex-col gap-2">
          <input
            ref={inputRef}
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
              e.target.value = '';
            }}
          />
          <button type="button" onClick={() => inputRef.current?.click()} className="btn-secondary text-sm">
            <Upload className="h-3.5 w-3.5" /> Upload Image
          </button>
          {autoFetchUrl && (
            <button type="button" onClick={() => onChange(autoFetchUrl)} className="btn-ghost text-sm justify-start">
              <Wand2 className="h-3.5 w-3.5" /> Use Auto-Fetched Favicon
            </button>
          )}
          {value && (
            <button type="button" onClick={() => onChange(null)} className="btn-ghost text-sm text-danger justify-start">
              <X className="h-3.5 w-3.5" /> Remove
            </button>
          )}
          {error && <p className="text-xs text-danger">{error}</p>}
        </div>
      </div>
    </div>
  );
}
