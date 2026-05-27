import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import AffiliateDashboardClient from './AffiliateDashboardClient';

export default async function AdvisorAffiliatePage() {
  const supabase = createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await admin.from('profiles').select('role, name').eq('id', user.id).maybeSingle();
  const isAdmin = ['admin', 'messeleiter'].includes(profile?.role);

  const { data: advisor } = await admin
    .from('advisors')
    .select('*')
    .eq('user_id', user.id)
    .maybeSingle();

  if (!advisor && !isAdmin) {
    return <div style={{ padding: 40, color: '#86868b' }}>Kein Berater-Profil gefunden.</div>;
  }

  // Falls Admin und kein eigener Advisor-Eintrag: zur Admin-Übersicht
  if (!advisor && isAdmin) redirect('/admin/advisors');

  // Affiliate-Leads (über /r/[slug] reingekommen)
  const { data: affiliateLeads } = await admin
    .from('fair_leads')
    .select(`
      id, first_name, last_name, email, phone, target_position, status, source,
      created_at, updated_at,
      cv_documents(id),
      cv_feedback(id, overall_rating, status, ai_parsed_at)
    `)
    .eq('advisor_id', advisor.id)
    .in('source', ['affiliate', 'direct'])
    .order('created_at', { ascending: false })
    .limit(100);

  // Über Link registrierte Mitglieder
  const { data: referrals } = await admin
    .from('profiles')
    .select('id, name, first_name, email, created_at')
    .eq('referred_by_advisor_id', advisor.id)
    .order('created_at', { ascending: false });

  const headersList = headers();
  const host = headersList.get('host') || 'app.daskarriereinstitut.de';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;
  const affiliateUrl = advisor.slug ? `${baseUrl}/r/${advisor.slug}` : null;

  return <AffiliateDashboardClient
    advisor={advisor}
    affiliateUrl={affiliateUrl}
    leads={affiliateLeads || []}
    referrals={referrals || []}
  />;
}
