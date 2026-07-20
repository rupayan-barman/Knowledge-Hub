'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Menu, X, LogIn, Search } from 'lucide-react';
import { ThemeToggle } from '@/components/ui/theme-toggle';
import { useAuth } from '@/hooks/use-auth';
import { cn } from '@/lib/utils/cn';

const NAV_LINKS = [
  { href: '/', label: 'Home' },
  { href: '/categories', label: 'Categories' },
  { href: '/resources', label: 'Resources' },
  { href: '/projects', label: 'Projects' },
  { href: '/notes', label: 'Notes' },
  { href: '/about', label: 'About' },
];

export function Navbar({ projectName }: { projectName: string }) {
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const pathname = usePathname();
  const { isOwner } = useAuth();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    setMobileOpen(false);
  }, [pathname]);

  return (
    <header
      className={cn(
        'fixed top-0 z-50 w-full transition-all duration-300',
        scrolled ? 'nav-glass' : 'bg-transparent border-b border-transparent'
      )}
    >
      <nav className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
        <Link href="/" className="flex items-center gap-2 font-semibold tracking-tight focus-ring rounded-lg">
          <span className="h-2 w-2 rounded-full bg-accent shadow-glow" />
          <span>{projectName}</span>
        </Link>

        <div className="hidden md:flex items-center gap-1">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2 text-sm font-medium transition-colors focus-ring',
                pathname === link.href
                  ? 'text-accent'
                  : 'text-muted-foreground hover:text-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-3">
          <Link
            href="/search"
            aria-label="Search"
            className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface/80 text-muted-foreground hover:text-foreground transition-colors focus-ring"
          >
            <Search className="h-4 w-4" />
          </Link>
          <ThemeToggle />
          <Link href={isOwner ? '/dashboard' : '/login'} className="btn-secondary text-sm">
            <LogIn className="h-4 w-4" />
            {isOwner ? 'Dashboard' : 'Owner Login'}
          </Link>
        </div>

        <button
          className="md:hidden flex h-9 w-9 items-center justify-center rounded-full border border-border focus-ring"
          aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          aria-expanded={mobileOpen}
          onClick={() => setMobileOpen((v) => !v)}
        >
          {mobileOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </nav>

      <div
        className={cn(
          'md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out nav-glass',
          mobileOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        )}
      >
        <div className="flex flex-col gap-1 px-4 pb-4 pt-2">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                'rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                pathname === link.href ? 'bg-accent/10 text-accent' : 'text-muted-foreground'
              )}
            >
              {link.label}
            </Link>
          ))}
          <Link href="/search" className="rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground">
            Search
          </Link>
          <div className="flex items-center justify-between px-3 pt-2">
            <ThemeToggle />
            <Link href={isOwner ? '/dashboard' : '/login'} className="btn-secondary text-sm">
              <LogIn className="h-4 w-4" />
              {isOwner ? 'Dashboard' : 'Login'}
            </Link>
          </div>
        </div>
      </div>
    </header>
  );
}
