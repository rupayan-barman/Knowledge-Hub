'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { AlertTriangle, RotateCcw, Home } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <html lang="en">
      <body className="dark">
        <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
          <div className="glass-panel max-w-md w-full p-8 text-center space-y-4 animate-scale-in">
            <div className="mx-auto h-14 w-14 rounded-2xl bg-danger/10 flex items-center justify-center">
              <AlertTriangle className="h-7 w-7 text-danger" />
            </div>
            <h1 className="text-xl font-semibold">Something went wrong</h1>
            <p className="text-sm text-muted-foreground">
              An unexpected error occurred while loading this page. You can try again, or head
              back home.
            </p>
            <div className="flex items-center justify-center gap-3 pt-2">
              <button onClick={() => reset()} className="btn-primary">
                <RotateCcw className="h-4 w-4" />
                Try again
              </button>
              <Link href="/" className="btn-secondary">
                <Home className="h-4 w-4" />
                Go home
              </Link>
            </div>
          </div>
        </div>
      </body>
    </html>
  );
}
