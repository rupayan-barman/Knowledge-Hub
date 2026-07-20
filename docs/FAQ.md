# FAQ

**Can more than one person log in as Owner?**
No. The app is designed around exactly one Owner account, matched to
whichever Supabase Auth user you create during setup. There's no
registration page anywhere.

**Do visitors need an account?**
No. Visitors can browse, search, read, and share without logging in.

**Is this free to run?**
Yes, at the usage levels a personal site typically sees. Supabase, Vercel,
and GitHub all have free tiers generous enough for this project.

**How many categories/resources/projects/notes can I add?**
Unlimited. There's no hardcoded cap anywhere in the schema or UI.

**Can I change the website name without touching code?**
Yes — Dashboard > Settings > Website Name. It updates everywhere instantly
(navbar, footer, page titles, SEO tags).

**What happens if I delete a category that has resources in it?**
Those resources aren't deleted — they just lose their category and show as
"Uncategorized" until you reassign them.

**How does the automatic favicon/logo fetching work?**
When you don't upload a logo, the app requests a favicon for the resource's
domain from a public favicon service. You can always override it with your
own upload.

**Can I restore an old backup?**
Yes — Dashboard > Settings > Backup & Restore > Import/Restore Backup. It
upserts by ID, so existing records get updated and new ones get added.

**Does the site work offline?**
Partially. It's a Progressive Web App — previously visited pages are cached
and a friendly offline page shows if you navigate somewhere uncached while
offline. Live database operations (search, dashboard edits) still require a
connection.

**Can I use a different accent color?**
Yes — Dashboard > Settings > Theme > Accent Color. Pick any hex color.

**Is my service role key ever exposed to visitors?**
No. It's used exclusively in server-side API routes for backup export/
import and never sent to the browser.

**What if I want to add a brand-new field to resources?**
That requires a schema change (a new SQL migration) and a small code change
to the form and validation schema — this is the one category of update that
does need a developer, since it changes the data model itself.
