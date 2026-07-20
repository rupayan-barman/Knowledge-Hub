# Deployment Guide

## Deploying to Vercel

### 1. Push to GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin <your-github-repo-url>
git push -u origin main
```

### 2. Import into Vercel

1. Go to [vercel.com](https://vercel.com) and sign in (GitHub login works well here).
2. Click **Add New > Project**.
3. Select your GitHub repository.
4. Vercel auto-detects Next.js — leave the build settings as default
   (`npm run build`, output directory auto-detected).

### 3. Add environment variables

Before deploying, add these under **Project Settings > Environment Variables**
(use the same values as your local `.env.local`):

| Key | Value |
|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Your Supabase project URL |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Your Supabase anon key |
| `SUPABASE_SERVICE_ROLE_KEY` | Your Supabase service role key |
| `NEXT_PUBLIC_SITE_URL` | Your production URL, e.g. `https://your-site.vercel.app` |
| `OWNER_EMAIL` | Your Owner account email |

### 4. Deploy

Click **Deploy**. Vercel builds and deploys automatically. Every future push
to `main` triggers a new automatic deployment — that's the "GitHub
integration, automatic deployment after push" behavior from the spec.

### 5. Update `NEXT_PUBLIC_SITE_URL`

Once you know your final domain (Vercel-provided or custom), make sure
`NEXT_PUBLIC_SITE_URL` matches it exactly — this feeds the sitemap, SEO tags,
and Open Graph metadata.

### 6. Add a custom domain (optional)

**Project Settings > Domains > Add** — follow Vercel's DNS instructions.
Update `NEXT_PUBLIC_SITE_URL` to match once it's live.

## Post-deploy checklist

- [ ] Visit the live URL — homepage loads
- [ ] `/login` works with your Owner credentials
- [ ] Create a test resource from the dashboard and confirm it appears publicly
- [ ] `/sitemap.xml` and `/robots.txt` return valid content
- [ ] Run a [Lighthouse](https://developer.chrome.com/docs/lighthouse) audit
      in Chrome DevTools to confirm performance/SEO/accessibility scores

## Updating the live site

Any code change: commit and push to `main` — Vercel redeploys automatically.
Any **content** change (resources, categories, settings, etc.): just use the
dashboard — no deployment needed, changes are live immediately.
