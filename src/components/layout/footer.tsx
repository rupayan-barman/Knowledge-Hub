'use client';

import Link from 'next/link';
import { Github, Twitter, Linkedin, Mail, ArrowUp } from 'lucide-react';
import type { Settings } from '@/types/database';

const QUICK_LINKS = [
  { href: '/categories', label: 'Categories' },
  { href: '/resources', label: 'Resources' },
  { href: '/projects', label: 'Projects' },
  { href: '/notes', label: 'Notes' },
  { href: '/about', label: 'About' },
];

const SOCIAL_ICON_MAP = {
  github: Github,
  twitter: Twitter,
  linkedin: Linkedin,
  email: Mail,
} as const;

export function Footer({ settings }: { settings: Settings }) {
  const year = new Date().getFullYear();
  const socialEntries = Object.entries(settings.social_links ?? {}).filter(
    ([, url]) => !!url
  ) as [keyof typeof SOCIAL_ICON_MAP, string][];

  return (
    <footer className="border-t border-border bg-surface/40 mt-24">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <p className="font-semibold text-lg">{settings.project_name}</p>
            <p className="mt-2 text-sm text-muted-foreground max-w-xs">
              {settings.tagline ?? 'A personal knowledge hub and resource library.'}
            </p>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-3">Quick Links</p>
            <ul className="space-y-2">
              {QUICK_LINKS.map((link) => (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    className="text-sm text-muted-foreground hover:text-accent transition-colors"
                  >
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="text-sm font-medium text-foreground mb-3">Connect</p>
            <div className="flex items-center gap-2">
              {socialEntries.length === 0 && (
                <p className="text-sm text-muted-foreground">No social links configured yet.</p>
              )}
              {socialEntries.map(([key, url]) => {
                const Icon = SOCIAL_ICON_MAP[key];
                if (!Icon) return null;
                return (
                  <a
                    key={key}
                    href={key === 'email' ? `mailto:${url}` : url}
                    target={key === 'email' ? undefined : '_blank'}
                    rel="noreferrer"
                    aria-label={key}
                    className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-surface hover:border-accent hover:text-accent transition-colors"
                  >
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>
        </div>

        <div className="mt-10 flex flex-col sm:flex-row items-center justify-between gap-4 border-t border-border pt-6">
          <p className="text-sm text-muted-foreground">
            {settings.footer_text} · © {year}
          </p>
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-accent transition-colors"
          >
            Back to top
            <ArrowUp className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </footer>
  );
}
