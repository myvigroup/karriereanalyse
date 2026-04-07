import { createClient } from '@supabase/supabase-js';

// Admin/Service-Role client — server-only, bypasses RLS
// NEVER import this in client-side code
export function createAdminClient() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if (!url || !key) {
    throw new Error(
      `Supabase Admin-Client konnte nicht initialisiert werden. ` +
      `Fehlende Umgebungsvariablen: ${!url ? 'NEXT_PUBLIC_SUPABASE_URL ' : ''}${!key ? 'SUPABASE_SERVICE_ROLE_KEY' : ''}`.trim()
    );
  }
  return createClient(url, key, { auth: { autoRefreshToken: false, persistSession: false } });
}
