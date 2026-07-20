'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Trash2, Loader2 } from 'lucide-react';

export function DeleteEntityButton({ endpoint }: { endpoint: string }) {
  const router = useRouter();
  const [confirming, setConfirming] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    await fetch(endpoint, { method: 'DELETE' });
    router.refresh();
  }

  if (confirming) {
    return (
      <button onClick={handleDelete} disabled={loading} className="px-2.5 py-1.5 rounded-lg bg-danger/10 text-danger text-xs font-medium">
        {loading ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : 'Confirm?'}
      </button>
    );
  }

  return (
    <button
      onClick={() => {
        setConfirming(true);
        setTimeout(() => setConfirming(false), 3000);
      }}
      title="Delete"
      className="p-2 rounded-lg hover:bg-danger/10 text-muted-foreground hover:text-danger"
    >
      <Trash2 className="h-4 w-4" />
    </button>
  );
}
