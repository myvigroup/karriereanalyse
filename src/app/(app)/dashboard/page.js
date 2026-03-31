import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DashboardClient from './DashboardClient';
import { getStreakStatus, generateDailyMission } from '@/lib/services/streak-service';

export default async function DashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile, error: profileError } = await supabase
    .from('profiles').select('*').eq('id', user.id).single();

  console.log('[Dashboard] user.id:', user.id, '| profile:', !!profile, '| error:', profileError?.message);

  if (!profile) {
    return (
      <div className="page-container" style={{ paddingTop: 80, textAlign: 'center' }}>
        <h1 style={{ fontSize: 28, fontWeight: 700 }}>Profil wird eingerichtet...</h1>
        <p style={{ color: 'var(--ki-text-secondary)', marginTop: 8 }}>Bitte lade die Seite in wenigen Sekunden neu.</p>
      </div>
    );
  }

  // Parallele Daten-Abfragen
  const [
    { data: analysisSession },
    { data: analysisResults },
    { data: progress },
    { data: courses },
    { data: documents },
    { data: applications },
    { data: marketValue },
    { data: recentActivity },
  ] = await Promise.all([
    supabase.from('analysis_sessions').select('*').eq('user_id', user.id).order('completed_at', { ascending: false }).limit(1).single(),
    supabase.from('analysis_results').select('*, competency_fields(title, icon, slug)').eq('user_id', user.id),
    supabase.from('lesson_progress').select('lesson_id, completed').eq('user_id', user.id),
    supabase.from('courses').select('*, modules(*, lessons(*))').eq('is_published', true).order('sort_order'),
    supabase.from('career_documents').select('*').eq('user_id', user.id),
    supabase.from('applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(5),
    supabase.from('market_value_log').select('*').eq('user_id', user.id).order('date', { ascending: false }).limit(1).single(),
    supabase.from('lesson_progress').select('lesson_id, completed, completed_at, lessons(title, modules(title, courses(title, icon)))').eq('user_id', user.id).eq('completed', true).order('completed_at', { ascending: false }).limit(5),
  ]);

  // Streak-Status + tägliche Missionen generieren
  let streakStatus = null;
  let dailyMissions = [];
  try {
    streakStatus = await getStreakStatus(supabase, user.id);
    dailyMissions = await generateDailyMission(supabase, user.id, analysisResults || [], profile?.phase, progress || [], courses || []);
  } catch (e) {
    // Streak-Tabellen existieren möglicherweise noch nicht
    console.error('Streak system not ready:', e.message);
  }

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
      recentActivity={recentActivity || []}
      streakStatus={streakStatus}
      dailyMissions={dailyMissions || []}
    />
  );
}
