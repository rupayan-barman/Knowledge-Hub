import { getSettings } from '@/lib/data/settings';
import { Navbar } from '@/components/layout/navbar';
import { Footer } from '@/components/layout/footer';

export default async function PublicLayout({ children }: { children: React.ReactNode }) {
  const settings = await getSettings();

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar projectName={settings.project_name} />
      <main className="flex-1 pt-16">{children}</main>
      <Footer settings={settings} />
    </div>
  );
}
