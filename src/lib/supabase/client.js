import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  // Fallback values prevent build-time errors when env vars are missing
  // (e.g. in Vercel Preview env). At runtime, real values are used.
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://placeholder.supabase.co',
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || 'placeholder-key'
  );
}
