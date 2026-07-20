# Knowledge Hub

A personal knowledge hub, resource library, learning portal, and portfolio —
built with Next.js, TypeScript, Tailwind CSS, and Supabase.

Created with ❤️ by **Rupayan Barman**.

---

## What this is

A single-owner web application for collecting and organizing:

- **Resources** — tools, websites, and references, organized by category
- **Categories** — unlimited, owner-managed topic groups
- **Projects** — a personal portfolio of things you've built
- **Notes** — rich-text write-ups, fully searchable

Visitors can browse, search, and read everything. Only the Owner (a single
account — no public registration) can log in and manage content, entirely
from the browser. No code editing required for day-to-day updates.

## Tech stack

| Layer          | Technology                          |
|----------------|--------------------------------------|
| Frontend       | Next.js 14 (App Router), TypeScript |
| Styling        | Tailwind CSS                        |
| Database       | Supabase (PostgreSQL)               |
| Auth           | Supabase Auth                       |
| File storage   | Supabase Storage                    |
| Rich text      | Tiptap                              |
| Hosting        | Vercel                              |

All of the above have generous free tiers — no paid subscription required to run this project.

## Quick start

```bash
npm install
cp .env.example .env.local   # fill in your Supabase project details
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

For full setup instructions (Supabase project creation, database schema,
storage buckets, and the Owner account), see **[docs/INSTALLATION.md](docs/INSTALLATION.md)**.

## Documentation

- [Installation Guide](docs/INSTALLATION.md) — get running locally
- [Supabase Setup Guide](docs/SUPABASE_SETUP.md) — database, auth, storage
- [Deployment Guide](docs/DEPLOYMENT.md) — ship to Vercel
- [Owner Guide](docs/OWNER_GUIDE.md) — day-to-day use of the dashboard
- [Folder Structure](docs/FOLDER_STRUCTURE.md) — how the codebase is organized
- [FAQ](docs/FAQ.md)
- [Troubleshooting](docs/TROUBLESHOOTING.md)

## Scripts

```bash
npm run dev          # start local dev server
npm run build        # production build
npm run start        # run the production build
npm run lint         # lint the codebase
npm run type-check   # TypeScript check with no output
npm run seed         # seed default categories + sample content
npm run export-data  # CLI backup export to ./backups
```

## License

This project is provided as-is for personal use.
