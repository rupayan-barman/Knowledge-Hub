'use client';

import { useRef, useState } from 'react';
import { useRouter } from 'next/navigation';
import { Download, Upload, Loader2, AlertCircle, CheckCircle2, FileJson } from 'lucide-react';

export function BackupManager({ mediaFileCount }: { mediaFileCount: number }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [exporting, setExporting] = useState(false);
  const [importing, setImporting] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  async function handleExport() {
    setExporting(true);
    try {
      const res = await fetch('/api/backup/export');
      if (!res.ok) throw new Error('Export failed');
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `knowledge-hub-backup-${Date.now()}.json`;
      a.click();
      URL.revokeObjectURL(url);
    } catch {
      setMessage({ type: 'error', text: 'Export failed. Please try again.' });
    } finally {
      setExporting(false);
    }
  }

  async function handleImport(file: File) {
    setImporting(true);
    setMessage(null);
    try {
      const text = await file.text();
      const json = JSON.parse(text);
      const res = await fetch('/api/backup/import', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(json),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Import failed');

      setMessage({ type: 'success', text: 'Backup restored successfully.' });
      router.refresh();
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message ?? 'Import failed. Check the file and try again.' });
    } finally {
      setImporting(false);
    }
  }

  function handleDownloadMediaList() {
    window.open('/api/media?list=true', '_blank');
  }

  return (
    <div className="space-y-6 max-w-2xl">
      {message && (
        <div
          className={`flex items-center gap-2 rounded-xl border px-4 py-3 text-sm ${
            message.type === 'success'
              ? 'border-success/30 bg-success/10 text-success'
              : 'border-danger/30 bg-danger/10 text-danger'
          }`}
        >
          {message.type === 'success' ? <CheckCircle2 className="h-4 w-4 shrink-0" /> : <AlertCircle className="h-4 w-4 shrink-0" />}
          {message.text}
        </div>
      )}

      <div className="glass-panel p-6">
        <h2 className="font-semibold mb-1">Export Data</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Download a complete JSON snapshot of every category, resource, project, note, media
          reference, and setting.
        </p>
        <button onClick={handleExport} disabled={exporting} className="btn-primary">
          {exporting ? <Loader2 className="h-4 w-4 animate-spin" /> : <Download className="h-4 w-4" />}
          Export All Data
        </button>
      </div>

      <div className="glass-panel p-6">
        <h2 className="font-semibold mb-1">Import / Restore Backup</h2>
        <p className="text-sm text-muted-foreground mb-4">
          Upload a previously exported JSON file. Existing records with matching IDs will be
          updated; new records will be inserted.
        </p>
        <input
          ref={fileInputRef}
          type="file"
          accept="application/json"
          className="hidden"
          onChange={(e) => {
            const file = e.target.files?.[0];
            if (file) handleImport(file);
            e.target.value = '';
          }}
        />
        <button onClick={() => fileInputRef.current?.click()} disabled={importing} className="btn-secondary">
          {importing ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}
          Choose Backup File
        </button>
      </div>

      <div className="glass-panel p-6">
        <h2 className="font-semibold mb-1">Media File List</h2>
        <p className="text-sm text-muted-foreground mb-4">
          {mediaFileCount} media files tracked. Download a list of all file names and URLs.
        </p>
        <button onClick={handleDownloadMediaList} className="btn-secondary">
          <FileJson className="h-4 w-4" /> Download Media List
        </button>
      </div>
    </div>
  );
}
