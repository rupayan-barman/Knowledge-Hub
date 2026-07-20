'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Loader2, AlertCircle, CheckCircle2 } from 'lucide-react';
import { ImageUploader } from '@/components/dashboard/image-uploader';
import { TagInput } from '@/components/dashboard/tag-input';
import type { Settings } from '@/types/database';

export function SettingsForm({ initialSettings }: { initialSettings: Settings }) {
  const router = useRouter();

  const [projectName, setProjectName] = useState(initialSettings.project_name);
  const [tagline, setTagline] = useState(initialSettings.tagline ?? '');
  const [homepageText, setHomepageText] = useState(initialSettings.homepage_text ?? '');
  const [logoUrl, setLogoUrl] = useState<string | null>(initialSettings.logo_url);
  const [faviconUrl, setFaviconUrl] = useState<string | null>(initialSettings.favicon_url);
  const [bannerUrl, setBannerUrl] = useState<string | null>(initialSettings.homepage_banner_url);
  const [footerText, setFooterText] = useState(initialSettings.footer_text);
  const [themeDefault, setThemeDefault] = useState(initialSettings.theme_default);
  const [accentColor, setAccentColor] = useState(initialSettings.accent_color);
  const [github, setGithub] = useState(initialSettings.social_links?.github ?? '');
  const [twitter, setTwitter] = useState(initialSettings.social_links?.twitter ?? '');
  const [linkedin, setLinkedin] = useState(initialSettings.social_links?.linkedin ?? '');
  const [email, setEmail] = useState(initialSettings.social_links?.email ?? '');
  const [seoTitle, setSeoTitle] = useState(initialSettings.seo_meta_title ?? '');
  const [seoDescription, setSeoDescription] = useState(initialSettings.seo_meta_description ?? '');
  const [seoKeywords, setSeoKeywords] = useState<string[]>(initialSettings.seo_keywords ?? []);

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);

    const payload = {
      project_name: projectName,
      tagline: tagline || null,
      homepage_text: homepageText || null,
      logo_url: logoUrl,
      favicon_url: faviconUrl,
      homepage_banner_url: bannerUrl,
      footer_text: footerText,
      theme_default: themeDefault,
      accent_color: accentColor,
      social_links: { github, twitter, linkedin, email },
      seo_meta_title: seoTitle || null,
      seo_meta_description: seoDescription || null,
      seo_keywords: seoKeywords,
    };

    try {
      const res = await fetch('/api/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error ?? 'Something went wrong');

      setSuccess(true);
      router.refresh();
      setTimeout(() => setSuccess(false), 2500);
    } catch (err: any) {
      setError(err.message ?? 'Something went wrong');
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl">
      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}
      {success && (
        <div className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 px-4 py-3 text-sm text-success">
          <CheckCircle2 className="h-4 w-4 shrink-0" />
          Settings saved.
        </div>
      )}

      <div className="glass-panel p-6 space-y-4">
        <h2 className="font-semibold">General</h2>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Website Name</label>
          <input value={projectName} onChange={(e) => setProjectName(e.target.value)} required className="input-field" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Tagline</label>
          <input value={tagline} onChange={(e) => setTagline(e.target.value)} className="input-field" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Homepage / About Text</label>
          <textarea value={homepageText} onChange={(e) => setHomepageText(e.target.value)} rows={4} className="input-field resize-none" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Footer Text</label>
          <input value={footerText} onChange={(e) => setFooterText(e.target.value)} required className="input-field" />
        </div>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h2 className="font-semibold">Branding</h2>
        <ImageUploader label="Website Logo" bucket="logos" usageType="logo" value={logoUrl} onChange={setLogoUrl} />
        <ImageUploader label="Favicon" bucket="logos" usageType="logo" value={faviconUrl} onChange={setFaviconUrl} />
        <ImageUploader label="Homepage Banner" bucket="covers" usageType="category_cover" value={bannerUrl} onChange={setBannerUrl} aspectClass="aspect-video" />
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h2 className="font-semibold">Theme</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">Default Theme</label>
            <select value={themeDefault} onChange={(e) => setThemeDefault(e.target.value as any)} className="input-field">
              <option value="dark">Dark</option>
              <option value="light">Light</option>
              <option value="system">System</option>
            </select>
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Accent Color</label>
            <input type="color" value={accentColor} onChange={(e) => setAccentColor(e.target.value)} className="input-field h-11 p-1" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h2 className="font-semibold">Social Links</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="text-sm font-medium mb-1.5 block">GitHub</label>
            <input value={github} onChange={(e) => setGithub(e.target.value)} className="input-field" placeholder="https://github.com/username" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Twitter / X</label>
            <input value={twitter} onChange={(e) => setTwitter(e.target.value)} className="input-field" placeholder="https://x.com/username" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">LinkedIn</label>
            <input value={linkedin} onChange={(e) => setLinkedin(e.target.value)} className="input-field" placeholder="https://linkedin.com/in/username" />
          </div>
          <div>
            <label className="text-sm font-medium mb-1.5 block">Email</label>
            <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} className="input-field" placeholder="you@example.com" />
          </div>
        </div>
      </div>

      <div className="glass-panel p-6 space-y-4">
        <h2 className="font-semibold">SEO</h2>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Meta Title</label>
          <input value={seoTitle} onChange={(e) => setSeoTitle(e.target.value)} maxLength={70} className="input-field" />
        </div>
        <div>
          <label className="text-sm font-medium mb-1.5 block">Meta Description</label>
          <textarea value={seoDescription} onChange={(e) => setSeoDescription(e.target.value)} maxLength={160} rows={2} className="input-field resize-none" />
        </div>
        <TagInput label="Keywords" values={seoKeywords} onChange={setSeoKeywords} placeholder="Add a keyword…" />
      </div>

      <button type="submit" disabled={loading} className="btn-primary">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Save Settings'}
      </button>
    </form>
  );
}
