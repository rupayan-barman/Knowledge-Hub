'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { Menu, X, LogOut } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { cn } from '@/lib/utils/cn';

const NAV_ITEMS = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/dashboard/resources', label: 'Resources' },
  { href: '/dashboard/categories', label: 'Categories' },
  { href: '/dashboard/projects', label: 'Projects' },
  { href: '/dashboard/notes', label: 'Notes' },
  { href: '/dashboard/media', label: 'Media' },
  { href: '/dashboard/settings', label: 'Settings' },
];

export function DashboardMobileNav({ projectName }: { projectName: string }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();

  async function handleLogout() {
    const supabase = createClient();
    await supabase.auth.signOut();
    router.push('/login');
  }

  return (
    <div className="lg:hidden sticky top-0 z-40 nav-glass">
      <div className="flex items-center justify-between h-14 px-4">
        <span className="font-semibold text-sm">{projectName} · Dashboard</span>
        <button onClick={() => setOpen((v) => !v)} aria-label="Toggle menu" className="p-2">
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>
      {open && (
        <div className="border-t border-border p-3 space-y-1">
          {NAV_ITEMS.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setOpen(false)}
              className={cn(
                'block rounded-lg px-3 py-2 text-sm font-medium',
                pathname === item.href ? 'bg-accent/10 text-accent' : 'text-muted-foreground'
              )}
            >
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="flex w-full items-center gap-2 rounded-lg px-3 py-2 text-sm font-medium text-danger"
          >
            <LogOut className="h-4 w-4" /> Logout
          </button>
        </div>
      )}
    </div>
  );
}
