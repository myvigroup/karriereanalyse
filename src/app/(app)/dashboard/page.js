import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles').select('*').eq('id', user.id).single();

  if (!profile) {
    return (
      <div className="page-container" style={{ paddingTop: 80, textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Profil wird eingerichtet...</h1>
        <p style={{ color: 'var(--ki-text-secondary)', marginTop: 8 }}>Bitte lade die Seite in wenigen Sekunden neu.</p>
      </div>
    );
  }

  // Berater → Messe-Dashboard
  if (profile.role === 'advisor') redirect('/advisor');

  // Messe-Besucher mit CV-Check → direkt zum Lebenslauf-Check
  if (profile.membership_type === 'basis') {
    const { data: cvDoc } = await supabase
      .from('cv_documents')
      .select('id')
      .eq('user_id', user.id)
      .limit(1)
      .maybeSingle();
    if (cvDoc) redirect('/cv-check');
  }

  const { data: analysisSession } = await supabase
    .from('analysis_sessions').select('*').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(1).single();

  const { data: analysisResults } = await supabase
    .from('analysis_results').select('*, competency_fields(title, icon, slug)').eq('user_id', user.id);

  const { data: progress } = await supabase
    .from('lesson_progress').select('lesson_id, completed').eq('user_id', user.id);

  const { data: courses } = await supabase
    .from('courses').select('*, modules(*, lessons(*))').eq('is_published', true).order('sort_order');

  const { data: documents } = await supabase
    .from('career_documents').select('*').eq('user_id', user.id);

  const { data: applications } = await supabase
    .from('applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5);

  const { data: marketValue } = await supabase
    .from('market_value_log').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(1).single();

  return (
    <DashboardClient
      profile={profile}
      analysisSession={analysisSession}
      analysisResults={analysisResults || []}
      progress={progress || []}
      courses={courses || []}
      documents={documents || []}
      applications={applications || []}
      marketValue={marketValue}
    />
  );
}
