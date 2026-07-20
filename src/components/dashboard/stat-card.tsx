import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils/cn';

export function StatCard({
  label,
  value,
  icon: Icon,
  accentColor = false,
}: {
  label: string;
  value: number | string;
  icon: LucideIcon;
  accentColor?: boolean;
}) {
  return (
    <div className="glass-panel p-5 flex items-center gap-4">
      <div
        className={cn(
          'flex h-11 w-11 items-center justify-center rounded-xl shrink-0',
          accentColor ? 'bg-accent/15 text-accent' : 'bg-muted text-muted-foreground'
        )}
      >
        <Icon className="h-5 w-5" />
      </div>
      <div>
        <p className="text-2xl font-bold leading-none">{value}</p>
        <p className="text-sm text-muted-foreground mt-1">{label}</p>
      </div>
    </div>
  );
}
