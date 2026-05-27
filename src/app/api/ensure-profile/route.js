import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

export async function POST() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: 'Not authenticated' }, { status: 401 });
  }

  const admin = createAdminClient();

  // Prüfen ob Profil bereits existiert
  const { data: existing } = await admin
    .from('profiles')
    .select('id, onboarding_complete')
    .eq('id', user.id)
    .maybeSingle();

  if (existing) {
    return NextResponse.json({ exists: true, onboarding_complete: existing.onboarding_complete });
  }

  // Referral-Cookie auswerten (von /r/[slug] gesetzt)
  const cookieStore = cookies();
  const referredByAdvisorId = cookieStore.get('ki_ref_advisor')?.value || null;

  // Profil anlegen
  const meta = user.user_metadata || {};
  const firstName = meta.first_name || user.email.split('@')[0];
  const lastName = meta.last_name || '';

  const { error } = await admin.from('profiles').insert({
    id: user.id,
    email: user.email,
    first_name: firstName,
    last_name: lastName,
    name: `${firstName} ${lastName}`.trim(),
    avatar_initials: ((firstName[0] || 'U') + (lastName[0] || 'X')).toUpperCase(),
    role: 'user',
    phase: 'pre_coaching',
    onboarding_complete: false,
    referred_by_advisor_id: referredByAdvisorId,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }

  // Affiliate-Signup-Counter erhöhen + Cookie löschen (best-effort)
  if (referredByAdvisorId) {
    admin.rpc('increment_advisor_signups', { advisor_uuid: referredByAdvisorId })
      .then(() => {}, () => {
        // Fallback ohne RPC: direkt updaten
        admin.from('advisors')
          .select('affiliate_signups')
          .eq('id', referredByAdvisorId)
          .single()
          .then(({ data }) => {
            if (data) {
              admin.from('advisors')
                .update({ affiliate_signups: (data.affiliate_signups || 0) + 1 })
                .eq('id', referredByAdvisorId)
                .then(() => {}, () => {});
            }
          });
      });
    cookieStore.delete('ki_ref_advisor');
  }

  return NextResponse.json({ created: true, onboarding_complete: false });
}
