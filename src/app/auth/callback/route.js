import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Rolle prüfen → Advisor/Admin direkt zum Berater-Dashboard
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const admin = createAdminClient();
      const { data: profile } = await admin
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .maybeSingle();

      if (['advisor', 'messeleiter', 'admin'].includes(profile?.role)) {
        // Neu eingeladene Berater müssen zuerst ihr Passwort setzen
        if (user.user_metadata?.needs_password_setup) {
          return NextResponse.redirect(new URL('/auth/set-password', request.url));
        }
        return NextResponse.redirect(new URL('/advisor', request.url));
      }
    }
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
