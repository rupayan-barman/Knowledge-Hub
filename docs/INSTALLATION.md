# Installation Guide

This guide gets the project running on your own machine.

## Prerequisites

- Node.js 18.17 or later ([nodejs.org](https://nodejs.org))
- A free [Supabase](https://supabase.com) account
- Git

## 1. Get the code

If you received this project as a ZIP file, extract it. If it's on GitHub:

```bash
git clone <your-repo-url>
cd knowledge-hub
```

## 2. Install dependencies

```bash
npm install
```

## 3. Create a Supabase project

Follow **[docs/SUPABASE_SETUP.md](SUPABASE_SETUP.md)** in full before continuing —
it walks through creating the project, running the database schema, setting
up storage buckets, and creating your Owner login. Come back here once
that's done.

## 4. Configure environment variables

Copy the example file:

```bash
cp .env.example .env.local
```

Open `.env.local` and fill in the values from your Supabase project
(**Project Settings > API**):

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project-ref.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-public-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
NEXT_PUBLIC_SITE_URL=http://localhost:3000
OWNER_EMAIL=you@example.com
```

**Never commit `.env.local`** — it's already listed in `.gitignore`.

## 5. Seed default data (optional but recommended)

Populates the 18 default categories from the spec, plus one sample resource,
project, and note so the site isn't empty:

```bash
npm run seed
```

Safe to re-run — it skips anything that already exists.

## 6. Run the dev server

```bash
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) for the public site, and
[http://localhost:3000/login](http://localhost:3000/login) to sign in as
Owner using the account you created in Supabase Auth.

## 7. Verify everything works

- [ ] Homepage loads with categories/resources sections
- [ ] `/login` lets you sign in with your Owner account
- [ ] `/dashboard` shows stats after logging in
- [ ] You can create a resource from Dashboard > Resources > Add Resource
- [ ] The new resource appears on the public site once published
- [ ] Theme toggle switches between dark/light

If something doesn't work, see **[TROUBLESHOOTING.md](TROUBLESHOOTING.md)**.

## Next steps

Ready to put this live? See **[DEPLOYMENT.md](DEPLOYMENT.md)**.
