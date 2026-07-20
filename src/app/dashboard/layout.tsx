import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { getSettings } from '@/lib/data/settings';
import { DashboardSidebar } from '@/components/dashboard/sidebar';
import { DashboardMobileNav } from '@/components/dashboard/mobile-nav';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const supabase = createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Defense in depth: middleware already redirects unauthenticated requests,
  // but Server Components should never trust that alone.
  if (!user) {
    redirect('/login');
  }

  const settings = await getSettings();

  return (
    <div className="min-h-screen flex bg-background">
      <DashboardSidebar projectName={settings.project_name} />
      <div className="flex-1 min-w-0">
        <DashboardMobileNav projectName={settings.project_name} />
        <main className="p-4 sm:p-6 lg:p-8 max-w-7xl mx-auto">{children}</main>
      </div>
    </div>
  );
}
