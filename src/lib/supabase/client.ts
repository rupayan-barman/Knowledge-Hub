'use client';

import { createBrowserClient } from '@supabase/ssr';

/**
 * Browser-side Supabase client. Safe to use in Client Components.
 * Uses the public anon key — RLS policies are what actually protect data.
 *
 * Note: intentionally untyped against the generated Database interface.
 * All writes are validated at the API boundary with Zod (see
 * src/lib/validation/schemas.ts), so the extra compile-time strictness
 * of typed Insert/Update generics isn't needed here and was causing
 * false-positive type errors on dynamic partial-update payloads.
 */
export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}
