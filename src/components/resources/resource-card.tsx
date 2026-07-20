'use client';

import Image from 'next/image';
import Link from 'next/link';
import { useState } from 'react';
import { ExternalLink, Bookmark, Copy, Check, Pin } from 'lucide-react';
import { resolveResourceLogo } from '@/lib/utils/favicon';
import { truncate } from '@/lib/utils/format';
import { cn } from '@/lib/utils/cn';
import type { ResourceWithCategory } from '@/types/database';

export function ResourceCard({ resource }: { resource: ResourceWithCategory }) {
  const [copied, setCopied] = useState(false);
  const [bookmarked, setBookmarked] = useState(false);
  const logoUrl = resolveResourceLogo(resource);

  async function handleCopyLink(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(resource.official_url);
      setCopied(true);
      setTimeout(() => setCopied(false), 1500);
    } catch {
      // Clipboard API unavailable — silently ignore.
    }
  }

  function handleBookmark(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    setBookmarked((v) => !v);
  }

  return (
    <Link
      href={`/resources/${resource.slug}`}
      className="group card-interactive glass-panel flex flex-col p-5 relative focus-ring"
    >
      {resource.is_pinned && (
        <span className="absolute top-3 right-3 flex h-6 w-6 items-center justify-center rounded-full bg-accent/15 text-accent">
          <Pin className="h-3 w-3" />
        </span>
      )}

      <div className="flex items-center gap-3">
        <div className="relative h-11 w-11 shrink-0 overflow-hidden rounded-xl bg-muted border border-border">
          <Image
            src={logoUrl}
            alt={`${resource.name} logo`}
            fill
            sizes="44px"
            className="object-contain p-1.5"
            unoptimized
          />
        </div>
        <div className="min-w-0">
          <h3 className="font-semibold truncate group-hover:text-accent transition-colors">
            {resource.name}
          </h3>
          {resource.category && (
            <span className="badge mt-1">{resource.category.name}</span>
          )}
        </div>
      </div>

      <p className="mt-4 text-sm text-muted-foreground line-clamp-2">
        {truncate(resource.short_description, 120)}
      </p>

      <div className="mt-5 flex items-center justify-between">
        <span className="inline-flex items-center gap-1.5 text-sm font-medium text-accent">
          View Details
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={handleBookmark}
            aria-label="Bookmark"
            aria-pressed={bookmarked}
            className={cn(
              'flex h-8 w-8 items-center justify-center rounded-full transition-colors',
              bookmarked ? 'text-accent bg-accent/10' : 'text-muted-foreground hover:bg-surface-hover'
            )}
          >
            <Bookmark className={cn('h-4 w-4', bookmarked && 'fill-current')} />
          </button>
          <button
            onClick={handleCopyLink}
            aria-label="Copy link"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-hover transition-colors"
          >
            {copied ? <Check className="h-4 w-4 text-success" /> : <Copy className="h-4 w-4" />}
          </button>
          <a
            href={resource.official_url}
            target="_blank"
            rel="noreferrer"
            onClick={(e) => e.stopPropagation()}
            aria-label="Visit website"
            className="flex h-8 w-8 items-center justify-center rounded-full text-muted-foreground hover:bg-surface-hover transition-colors"
          >
            <ExternalLink className="h-4 w-4" />
          </a>
        </div>
      </div>
    </Link>
  );
}
