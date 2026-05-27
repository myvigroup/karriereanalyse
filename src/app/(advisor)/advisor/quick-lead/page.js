import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import QuickLeadClient from './QuickLeadClient';

export default async function QuickLeadPage() {
  const supabase = createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await admin
    .from('profiles').select('role, name').eq('id', user.id).maybeSingle();
  const isAdmin = ['admin', 'messeleiter'].includes(profile?.role);

  const { data: advisor } = await admin
    .from('advisors').select('id, display_name').eq('user_id', user.id).maybeSingle();

  if (!advisor && !isAdmin) {
    return <div style={{ padding: 40, color: '#86868b' }}>Kein Berater-Profil gefunden.</div>;
  }

  // Quick-Leads des Beraters (fair_id IS NULL)
  let query = admin.from('fair_leads')
    .select(`
      id, first_name, last_name, email, phone, target_position, status, source,
      created_at, updated_at,
      cv_documents(id),
      cv_feedback(id, overall_rating, status, ai_parsed_at)
    `)
    .is('fair_id', null)
    .order('created_at', { ascending: false })
    .limit(100);

  if (!isAdmin) {
    query = query.eq('advisor_user_id', user.id);
  }
  const { data: leads } = await query;

  const headersList = headers();
  const host = headersList.get('host') || 'app.daskarriereinstitut.de';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  return <QuickLeadClient
    initialLeads={leads || []}
    advisorName={advisor?.display_name || profile?.name || 'Berater'}
    baseUrl={baseUrl}
  />;
}
