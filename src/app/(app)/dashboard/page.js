import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import ProfileLoading from './ProfileLoading';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single();

  if (!profile) {
    return <ProfileLoading />;
  }

  // Admin + Berater → Messe-Dashboard
  if (profile.role === 'advisor' || profile.role === 'admin') redirect('/advisor');

  const admin = createAdminClient();

  // CV-Check: erst per user_id, dann Fallback über fair_leads
  let cvDoc = null;
  const { data: cvDocByUser } = await admin
    .from('cv_documents').select('id').eq('user_id', user.id)
    .order('created_at', { ascending: false }).limit(1).maybeSingle();

  if (cvDocByUser) {
    cvDoc = cvDocByUser;
  } else {
    const { data: userLead } = await admin
      .from('fair_leads').select('id').eq('user_id', user.id)
      .limit(1).maybeSingle();
    if (userLead) {
      const { data: cvDocByLead } = await admin
        .from('cv_documents').select('id').eq('lead_id', userLead.id)
        .order('created_at', { ascending: false }).limit(1).maybeSingle();
      cvDoc = cvDocByLead || null;
    }
  }

  let cvFeedback = null;
  if (cvDoc) {
    const { data: fb } = await admin
      .from('cv_feedback').select('overall_rating, summary')
      .eq('cv_document_id', cvDoc.id).eq('status', 'completed').maybeSingle();
    cvFeedback = fb || null;
  }

  // Messe-Besucher: fair_leads Eintrag mit Fair-Info
  const { data: fairLead } = await admin
    .from('fair_leads')
    .select('id, fair_id, fairs(name, start_date), advisors(display_name)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false })
    .limit(1)
    .maybeSingle();

  const { data: analysisSession } = await supabase
    .from('analysis_sessions').select('*').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(1).single();

  const { data: analysisResults } = await supabase
    .from('analysis_results').select('*, competency_fields(title, icon, slug)').eq('user_id', user.id);

  const { data: progress } = await supabase
    .from('lesson_progress').select('lesson_id, completed').eq('user_id', user.id);

  const { data: courses } = await supabase
    .from('courses').select('*, modules(*, lessons(*))').eq('is_published', true).order('sort_order');

  const { data: applications } = await supabase
    .from('applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5);

  return (
    <DashboardClient
      profile={profile}
      analysisSession={analysisSession}
      analysisResults={analysisResults || []}
      progress={progress || []}
      courses={courses || []}
      applications={applications || []}
      cvFeedback={cvFeedback}
      hasCvDoc={!!cvDoc}
      fairLead={fairLead || null}
      userEmail={user.email}
    />
  );
}
