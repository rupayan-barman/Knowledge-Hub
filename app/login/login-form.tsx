'use client';

import { useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Lock, Mail, Loader2, AlertCircle } from 'lucide-react';
import { createClient } from '@/lib/supabase/client';
import { loginSchema } from '@/lib/validation/schemas';

export function LoginForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const parsed = loginSchema.safeParse({ email, password });
    if (!parsed.success) {
      setError(parsed.error.errors[0]?.message ?? 'Invalid input');
      return;
    }

    setLoading(true);
    const supabase = createClient();
    const { error: signInError } = await supabase.auth.signInWithPassword({
      email: parsed.data.email,
      password: parsed.data.password,
    });
    setLoading(false);

    if (signInError) {
      setError('Invalid email or password.');
      return;
    }

    const redirectedFrom = searchParams.get('redirectedFrom');
    router.push(redirectedFrom || '/dashboard');
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="glass-panel p-8 w-full max-w-sm space-y-5">
      <div className="text-center">
        <div className="mx-auto h-12 w-12 rounded-2xl bg-accent/10 flex items-center justify-center mb-4">
          <Lock className="h-5 w-5 text-accent" />
        </div>
        <h1 className="text-xl font-semibold">Owner Login</h1>
        <p className="text-sm text-muted-foreground mt-1">Sign in to manage the site.</p>
      </div>

      {error && (
        <div className="flex items-center gap-2 rounded-xl border border-danger/30 bg-danger/10 px-4 py-3 text-sm text-danger">
          <AlertCircle className="h-4 w-4 shrink-0" />
          {error}
        </div>
      )}

      <div>
        <label htmlFor="email" className="text-sm font-medium mb-1.5 block">
          Email
        </label>
        <div className="relative">
          <Mail className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="email"
            type="email"
            required
            autoComplete="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="input-field pl-10"
            placeholder="you@example.com"
          />
        </div>
      </div>

      <div>
        <label htmlFor="password" className="text-sm font-medium mb-1.5 block">
          Password
        </label>
        <div className="relative">
          <Lock className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <input
            id="password"
            type="password"
            required
            autoComplete="current-password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="input-field pl-10"
            placeholder="••••••••"
          />
        </div>
      </div>

      <button type="submit" disabled={loading} className="btn-primary w-full">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Sign In'}
      </button>

      <p className="text-xs text-center text-muted-foreground">
        This is a single-owner site. Registration is not available.
      </p>
    </form>
  );
}
