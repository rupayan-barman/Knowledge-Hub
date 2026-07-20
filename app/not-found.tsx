import Link from 'next/link';
import { Compass, Home } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background text-foreground px-6">
      <div className="glass-panel max-w-md w-full p-8 text-center space-y-4 animate-scale-in">
        <div className="mx-auto h-14 w-14 rounded-2xl bg-accent/10 flex items-center justify-center">
          <Compass className="h-7 w-7 text-accent" />
        </div>
        <p className="text-6xl font-bold tracking-tight">404</p>
        <h1 className="text-xl font-semibold">Page not found</h1>
        <p className="text-sm text-muted-foreground">
          The page you're looking for doesn't exist, was moved, or was never here to begin with.
        </p>
        <div className="pt-2">
          <Link href="/" className="btn-primary">
            <Home className="h-4 w-4" />
            Back to homepage
          </Link>
        </div>
      </div>
    </div>
  );
}
