import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';

export async function GET(request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');
  const next = requestUrl.searchParams.get('next');

  if (code) {
    const supabase = createClient();
    await supabase.auth.exchangeCodeForSession(code);

    // Wenn explizites Ziel angegeben (z.B. /auth/set-password bei Password-Reset)
    if (next) {
      return NextResponse.redirect(new URL(next, request.url));
    }

    // Rolle prüfen → Advisor/Admin direkt zum Berater-Dashboard
    const { data: { user } } = await supabase.auth.getUser();
    if (user) {
      const admin = createAdminClient();
      let { data: profile } = await admin
        .from('profiles')
        .select('role, onboarding_complete, first_name, last_name')
        .eq('id', user.id)
        .maybeSingle();

      // Profil existiert nicht (Trigger fehlgeschlagen) → jetzt anlegen
      if (!profile) {
        const meta = user.user_metadata || {};
        const firstName = meta.first_name || user.email.split('@')[0];
        const lastName = meta.last_name || '';
        await admin.from('profiles').insert({
          id: user.id,
          email: user.email,
          first_name: firstName,
          last_name: lastName,
          name: `${firstName} ${lastName}`.trim(),
          avatar_initials: (firstName[0] + (lastName[0] || 'X')).toUpperCase(),
          role: 'user',
          phase: 'pre_coaching',
          onboarding_complete: false,
        });
        profile = { role: 'user', onboarding_complete: false };
      }

      if (['advisor', 'messeleiter', 'admin'].includes(profile?.role)) {
        // Neu eingeladene Berater müssen zuerst ihr Passwort setzen
        if (user.user_metadata?.needs_password_setup) {
          return NextResponse.redirect(new URL('/auth/set-password', request.url));
        }
        return NextResponse.redirect(new URL('/advisor', request.url));
      }

      // Neuer User: Onboarding noch nicht abgeschlossen → /onboarding
      if (profile.onboarding_complete === false) {
        return NextResponse.redirect(new URL('/onboarding', request.url));
      }
    }
  }

  return NextResponse.redirect(new URL('/dashboard', request.url));
}
