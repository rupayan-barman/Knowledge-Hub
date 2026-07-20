import type { Metadata } from 'next';
import { Suspense } from 'react';
import { LoginForm } from './login-form';

export const metadata: Metadata = { title: 'Owner Login' };

export default function LoginPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4">
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 -z-10"
        style={{
          background: 'radial-gradient(50% 40% at 50% 0%, hsl(var(--accent) / 0.12), transparent 70%)',
        }}
      />
      <Suspense fallback={null}>
        <LoginForm />
      </Suspense>
    </div>
  );
}
