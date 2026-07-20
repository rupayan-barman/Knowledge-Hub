'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import {
  LayoutDashboard,
  FileStack,
  FolderTree,
  Layers,
  NotebookText,
  Image as ImageIcon,
  Settings,
  LogOut,
} from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { href: '/dashboard/resources', label: 'Resources', icon: FileStack },
  { href: '/dashboard/categories', label: 'Categories', icon: FolderTree },
  { href: '/dashboard/projects', label: 'Projects', icon: Layers },
  { href: '/dashboard/notes', label: 'Notes', icon: NotebookText },
  { href: '/dashboard/media', label: 'Media', icon: ImageIcon },
  { href: '/dashboard/settings', label: 'Settings', icon: Settings },
];

export function DashboardSidebar({ projectName }: { projectName: string }) {
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
    router.refresh();
  }

  return (
    <aside className="hidden lg:flex flex-col w-64 shrink-0 border-r border-border h-screen sticky top-0 p-4">
      <Link href="/" className="flex items-center gap-2 px-2 py-3 font-semibold">
        <span className="h-2 w-2 rounded-full bg-accent shadow-glow" />
        {projectName}
      </Link>

      <nav className="mt-6 flex-1 space-y-1">
        {NAV_ITEMS.map((item) => {
          const active = item.href === '/dashboard' ? pathname === item.href : pathname.startsWith(item.href);
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                active ? 'bg-accent/10 text-accent' : 'text-muted-foreground hover:bg-surface-hover hover:text-foreground'
              )}
            >
              <Icon className="h-4 w-4" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <button
        onClick={handleLogout}
        className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-danger/10 hover:text-danger transition-colors"
      >
        <LogOut className="h-4 w-4" />
        Logout
      </button>
    </aside>
  );
}
