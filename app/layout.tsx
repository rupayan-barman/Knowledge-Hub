import type { Metadata, Viewport } from 'next';
import { Inter, JetBrains_Mono } from 'next/font/google';
import { ThemeProvider } from '@/components/layout/theme-provider';
import { ServiceWorkerRegister } from '@/components/layout/service-worker-register';
import { getSettings } from '@/lib/data/settings';
import './globals.css';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-sans',
  display: 'swap',
});

const jetbrainsMono = JetBrains_Mono({
  subsets: ['latin'],
  variable: '--font-mono',
  display: 'swap',
});

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? 'http://localhost:3000';

  return {
    metadataBase: new URL(siteUrl),
    title: {
      default: settings.seo_meta_title ?? settings.project_name,
      template: `%s — ${settings.project_name}`,
    },
    description: settings.seo_meta_description ?? settings.tagline ?? undefined,
    keywords: settings.seo_keywords,
    icons: {
      icon: settings.favicon_url ?? '/favicon.ico',
    },
    openGraph: {
      title: settings.seo_meta_title ?? settings.project_name,
      description: settings.seo_meta_description ?? settings.tagline ?? undefined,
      siteName: settings.project_name,
      type: 'website',
      url: siteUrl,
    },
    twitter: {
      card: 'summary_large_image',
      title: settings.seo_meta_title ?? settings.project_name,
      description: settings.seo_meta_description ?? settings.tagline ?? undefined,
    },
    robots: {
      index: true,
      follow: true,
    },
    manifest: '/manifest.json',
  };
}

export const viewport: Viewport = {
  themeColor: [
    { media: '(prefers-color-scheme: dark)', color: '#050505' },
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
  ],
  width: 'device-width',
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${inter.variable} ${jetbrainsMono.variable} font-sans antialiased`}>
        <ThemeProvider>{children}</ThemeProvider>
        <ServiceWorkerRegister />
      </body>
    </html>
  );
}
