'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Search as SearchIcon, Loader2, FileText, FolderOpen, Layers, NotebookText } from 'lucide-react';
import { useDebounce } from '@/hooks/use-debounce';

interface SearchResult {
  id: string;
  type: 'resource' | 'category' | 'project' | 'note';
  title: string;
  description: string;
  href: string;
}

const TYPE_ICON = {
  resource: FileText,
  category: FolderOpen,
  project: Layers,
  note: NotebookText,
} as const;

export function GlobalSearch({ autoFocus = false }: { autoFocus?: boolean }) {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const debouncedQuery = useDebounce(query, 200);

  useEffect(() => {
    if (!debouncedQuery.trim()) {
      setResults([]);
      return;
    }

    let cancelled = false;
    setLoading(true);

    fetch(`/api/search?q=${encodeURIComponent(debouncedQuery)}`)
      .then((res) => res.json())
      .then((data) => {
        if (!cancelled) setResults(data.results ?? []);
      })
      .catch(() => {
        if (!cancelled) setResults([]);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
  }, [debouncedQuery]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="relative">
        <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-muted-foreground" />
        <input
          autoFocus={autoFocus}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search resources, projects, notes, categories…"
          className="input-field pl-12 pr-12 h-14 text-base"
          aria-label="Global search"
        />
        {loading && (
          <Loader2 className="absolute right-4 top-1/2 -translate-y-1/2 h-5 w-5 animate-spin text-accent" />
        )}
      </div>

      {results.length > 0 && (
        <div className="mt-3 glass-panel divide-y divide-border overflow-hidden animate-fade-in">
          {results.map((result) => {
            const Icon = TYPE_ICON[result.type];
            return (
              <Link
                key={`${result.type}-${result.id}`}
                href={result.href}
                className="flex items-start gap-3 p-4 hover:bg-surface-hover transition-colors"
              >
                <Icon className="h-4 w-4 mt-0.5 text-accent shrink-0" />
                <div className="min-w-0">
                  <p className="font-medium truncate">{result.title}</p>
                  <p className="text-sm text-muted-foreground line-clamp-1">{result.description}</p>
                </div>
                <span className="badge ml-auto shrink-0 capitalize">{result.type}</span>
              </Link>
            );
          })}
        </div>
      )}

      {!loading && query.trim() && results.length === 0 && (
        <p className="mt-4 text-center text-sm text-muted-foreground">
          No results for "{query}".
        </p>
      )}
    </div>
  );
}
