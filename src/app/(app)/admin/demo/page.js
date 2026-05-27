import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import { headers } from 'next/headers';
import { DEMO_EMAIL, DEMO_PASSWORD, DEMO_SLUG } from '@/lib/demo';
import DemoAdminClient from './DemoAdminClient';

export default async function AdminDemoPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') redirect('/dashboard');

  // Status des Demo-Accounts ermitteln
  const admin = createAdminClient();
  const { data: advisor } = await admin
    .from('advisors')
    .select('id, user_id, slug, affiliate_signups, affiliate_clicks, created_at')
    .eq('email', DEMO_EMAIL)
    .maybeSingle();

  let leadCount = 0;
  let cvCount = 0;
  if (advisor) {
    const { count: leads } = await admin
      .from('fair_leads')
      .select('id', { count: 'exact', head: true })
      .eq('advisor_id', advisor.id);
    leadCount = leads || 0;

    const { count: cvs } = await admin
      .from('cv_feedback')
      .select('id', { count: 'exact', head: true })
      .eq('advisor_id', advisor.id);
    cvCount = cvs || 0;
  }

  const headersList = headers();
  const host = headersList.get('host') || 'app.daskarriereinstitut.de';
  const protocol = host.startsWith('localhost') ? 'http' : 'https';
  const baseUrl = `${protocol}://${host}`;

  return (
    <DemoAdminClient
      isSetUp={!!advisor}
      stats={{ leads: leadCount, cvs: cvCount, signups: advisor?.affiliate_signups || 0, clicks: advisor?.affiliate_clicks || 0 }}
      links={{
        magic: `${baseUrl}/demo`,
        affiliate: `${baseUrl}/r/${DEMO_SLUG}`,
        landing: `${baseUrl}/start/${DEMO_SLUG}`,
      }}
      credentials={{ email: DEMO_EMAIL, password: DEMO_PASSWORD }}
    />
  );
}
