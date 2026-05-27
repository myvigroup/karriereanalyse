// Affiliate-Landing als Route-Handler:
// /r/<slug> → setzt Ref-Cookie, inkrementiert Click-Counter, redirected zur Registrierung.
// (Page-Server-Components dürfen in Next.js 14 keine Cookies setzen — daher Route-Handler.)

import { NextResponse } from 'next/server';
import { createAdminClient } from '@/lib/supabase/admin';

export const dynamic = 'force-dynamic';

export async function GET(request, { params }) {
  const slug = (params.slug || '').toLowerCase().trim();
  const origin = request.nextUrl.origin;

  if (!slug) {
    return NextResponse.redirect(new URL('/auth/register', origin));
  }

  const admin = createAdminClient();

  // Berater per Slug suchen
  const { data: advisor } = await admin
    .from('advisors')
    .select('id, display_name, status, affiliate_clicks')
    .ilike('slug', slug)
    .maybeSingle();

  if (!advisor || advisor.status === 'inactive') {
    // Unbekannter oder inaktiver Slug → normale Registrierung ohne Referral
    return NextResponse.redirect(new URL('/auth/register', origin));
  }

  // Click-Counter erhöhen (fire-and-forget, blockiert nicht)
  admin
    .from('advisors')
    .update({ affiliate_clicks: (advisor.affiliate_clicks || 0) + 1 })
    .eq('id', advisor.id)
    .then(() => {}, () => {});

  // Redirect mit ref-Parameter für UI-Personalisierung
  const target = new URL(`/auth/register?ref=${encodeURIComponent(advisor.display_name)}`, origin);
  const response = NextResponse.redirect(target);

  // Referral-Cookie setzen (30 Tage) — wird in /api/ensure-profile gelesen
  response.cookies.set('ki_ref_advisor', advisor.id, {
    maxAge: 60 * 60 * 24 * 30,
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
  });

  return response;
}
