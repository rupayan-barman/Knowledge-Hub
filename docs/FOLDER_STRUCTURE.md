# Folder Structure Guide

```
knowledge-hub/
├── src/
│   ├── app/                      # Next.js App Router
│   │   ├── (public)/              # Public route group (navbar + footer layout)
│   │   │   ├── page.tsx              # Homepage
│   │   │   ├── categories/           # Category listing + detail
│   │   │   ├── resources/            # Resource listing + detail
│   │   │   ├── projects/             # Project listing + detail
│   │   │   ├── notes/                # Notes listing + detail
│   │   │   ├── about/
│   │   │   └── search/
│   │   ├── dashboard/              # Owner-only, protected by middleware + layout guard
│   │   │   ├── resources/            # Resource management + new/edit forms
│   │   │   ├── categories/
│   │   │   ├── projects/
│   │   │   ├── notes/
│   │   │   ├── media/                # Media library
│   │   │   ├── settings/
│   │   │   └── backup/
│   │   ├── login/                  # Owner login (outside dashboard layout)
│   │   ├── api/                    # Route handlers (REST-style API)
│   │   │   ├── resources/, categories/, projects/, notes/
│   │   │   ├── media/, settings/, search/
│   │   │   └── backup/export, backup/import
│   │   ├── layout.tsx               # Root layout, metadata, fonts, theme provider
│   │   ├── globals.css              # Design tokens, glassmorphism utilities
│   │   ├── loading.tsx / not-found.tsx / global-error.tsx
│   │   ├── sitemap.ts / robots.ts / manifest.ts
│   │   └── offline/                 # PWA offline fallback page
│   │
│   ├── components/
│   │   ├── layout/                 # Navbar, footer, theme provider, SW registration
│   │   ├── home/                   # Hero, section wrappers
│   │   ├── resources/              # Resource card
│   │   ├── categories/             # Category card
│   │   ├── projects/                # Project card
│   │   ├── notes/                  # Tiptap renderer + editor
│   │   ├── dashboard/               # All owner-facing forms, tables, managers
│   │   ├── shared/                  # Global search
│   │   └── ui/                     # Generic primitives (modal, theme toggle)
│   │
│   ├── hooks/                      # use-auth, use-debounce
│   ├── lib/
│   │   ├── supabase/                # Browser, server, middleware clients
│   │   ├── data/                    # Server-side data-access layer (one file per entity)
│   │   ├── utils/                   # cn, slug, favicon, format, sanitize
│   │   └── validation/              # Zod schemas — the single source of truth for valid input
│   ├── types/                       # Shared TypeScript interfaces matching the DB schema
│   ├── config/                      # site.ts — fallback config, default categories
│   └── middleware.ts                 # Session refresh + /dashboard route protection
│
├── supabase/
│   ├── migrations/                  # Numbered SQL migrations (schema, RLS, storage, RPC)
│   └── policies/                    # (reserved for any future standalone policy files)
│
├── scripts/
│   ├── seed.ts                      # Populate default categories + sample content
│   └── export-data.ts               # CLI backup export
│
├── docs/                            # This documentation set
├── public/                          # Static assets, PWA icons, service worker, manifest
├── .env.example                     # Documented list of required environment variables
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json / tsconfig.scripts.json
└── package.json
```

## Why this structure?

- **Route groups** (`(public)`) keep the public site's shared layout (navbar/
  footer) separate from the dashboard's shared layout (sidebar) without
  affecting URLs.
- **`lib/data/`** centralizes every database read so pages stay thin and
  queries aren't duplicated across files.
- **`lib/validation/`** is the single source of truth for what a valid
  Resource/Category/Project/Note/Settings object looks like — both the API
  routes and (indirectly) the forms rely on it.
- **API routes under `app/api/`** exist so client components (forms, the
  media uploader, the search box) can make simple `fetch()` calls without
  needing server actions threaded through every component.
