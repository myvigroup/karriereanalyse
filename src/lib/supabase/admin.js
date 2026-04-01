import { createClient } from '@supabase/supabase-js';

// Admin/Service-Role client — server-only, bypasses RLS
// NEVER import this in client-side code
export function createAdminClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL,
    process.env.SUPABASE_SERVICE_ROLE_KEY,
    { auth: { autoRefreshToken: false, persistSession: false } }
  );
}
