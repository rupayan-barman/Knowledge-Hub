'use client';

import { WifiOff, RotateCcw } from 'lucide-react';

export default function OfflinePage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <div className="glass-panel max-w-md w-full p-8 text-center space-y-4">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-muted flex items-center justify-center">
          <WifiOff className="h-7 w-7 text-muted-foreground" />
        </div>
        <h1 className="text-xl font-semibold">You're offline</h1>
        <p className="text-sm text-muted-foreground">
          It looks like you've lost your internet connection. Some previously visited pages may
          still be available.
        </p>
        <button onClick={() => window.location.reload()} className="btn-primary mx-auto">
          <RotateCcw className="h-4 w-4" />
          Try again
        </button>
      </div>
    </div>
  );
}
