import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import AdminAdvisorsClient from './AdminAdvisorsClient';

export default async function AdminAdvisorsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') redirect('/dashboard');

  // Admin-Client (umgeht RLS — sicher, weil wir vorher Auth gecheckt haben)
  const admin = createAdminClient();
  const { data: advisors } = await admin
    .from('advisors')
    .select('*')
    .order('created_at', { ascending: false });

  // Lead-Counts pro Berater (Live-DB: fair_leads hat advisor_user_id, kein advisor_id)
  const { data: leadCounts } = await admin
    .from('fair_leads').select('advisor_user_id');
  const leadCountByUserId = {};
  (leadCounts || []).forEach(l => {
    if (l.advisor_user_id) leadCountByUserId[l.advisor_user_id] = (leadCountByUserId[l.advisor_user_id] || 0) + 1;
  });
  // Map advisors.id → lead count über advisors.user_id
  const leadCountMap = {};
  (advisors || []).forEach(a => {
    if (a.user_id) leadCountMap[a.id] = leadCountByUserId[a.user_id] || 0;
  });

  // Referral-Signups pro Berater
  const { data: referrals } = await admin
    .from('profiles').select('referred_by_advisor_id')
    .not('referred_by_advisor_id', 'is', null);
  const referralMap = {};
  (referrals || []).forEach(r => {
    if (r.referred_by_advisor_id) {
      referralMap[r.referred_by_advisor_id] = (referralMap[r.referred_by_advisor_id] || 0) + 1;
    }
  });

  // Base-URL für Affiliate-Links
  const headersList = headers();
  const host = headersList.get('host') || 'app.daskarriereinstitut.de';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  const advisorsWithStats = (advisors || []).map(a => ({
    ...a,
    leadCount: leadCountMap[a.id] || 0,
    referralCount: referralMap[a.id] || 0,
    affiliateUrl: a.slug ? `${baseUrl}/r/${a.slug}` : null,
  }));

  return <AdminAdvisorsClient initialAdvisors={advisorsWithStats} baseUrl={baseUrl} />;
}
