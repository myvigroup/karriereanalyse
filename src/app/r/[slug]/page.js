// Affiliate-Landing: app.daskarriereinstitut.de/r/marie-mueller
// → Inkrementiert Click-Counter, setzt Cookie mit Berater-ID, redirected zur Registrierung.

import { redirect } from 'next/navigation';
import { createAdminClient } from '@/lib/supabase/admin';
import { cookies } from 'next/headers';

export const dynamic = 'force-dynamic';

export default async function AffiliateLandingPage({ params }) {
  const slug = (params.slug || '').toLowerCase().trim();
  if (!slug) redirect('/auth/register');

  const supabase = createAdminClient();

  // Berater per Slug finden
  const { data: advisor } = await supabase
    .from('advisors')
    .select('id, display_name, status')
    .ilike('slug', slug)
    .maybeSingle();

  if (!advisor || advisor.status === 'inactive') {
    // Ungültiger oder inaktiver Slug → normale Registrierung ohne Referral
    redirect('/auth/register');
  }

  // Click-Counter erhöhen (best-effort, blockiert nicht)
  supabase
    .from('advisors')
    .update({ affiliate_clicks: (advisor.affiliate_clicks || 0) + 1 })
    .eq('id', advisor.id)
    .then(() => {}, () => {}); // fire-and-forget

  // Referral-Cookie (30 Tage) → wird beim Sign-up gelesen
  const cookieStore = cookies();
  cookieStore.set('ki_ref_advisor', advisor.id, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  // Redirect zur Registrierung mit ref-Parameter (für UI-Personalisierung)
  redirect(`/auth/register?ref=${encodeURIComponent(advisor.display_name)}`);
}
