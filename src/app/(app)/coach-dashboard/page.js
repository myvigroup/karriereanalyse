import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CoachDashboardClient from './CoachDashboardClient';

export default async function CoachDashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'coach') {
    redirect('/dashboard');
  }

  // Fetch all clients (non-admin, non-coach profiles)
  const [
    { data: clients },
    { count: chatCount },
    { data: coachNotes },
  ] = await Promise.all([
    supabase
      .from('profiles')
      .select('id, name, email, updated_at, total_points, onboarding_complete, avatar_url')
      .not('role', 'in', '("admin","coach")')
      .order('updated_at', { ascending: false }),
    supabase
      .from('coaching_chats')
      .select('*', { count: 'exact', head: true }),
    supabase
      .from('coach_notes')
      .select('*')
      .eq('coach_id', user.id),
  ]);

  // Fetch analysis sessions for scoring
  const clientIds = (clients || []).map(c => c.id);
  let analysisSessions = [];
  if (clientIds.length > 0) {
    const { data: sessions } = await supabase
      .from('analysis_sessions')
      .select('user_id, overall_score, created_at')
      .in('user_id', clientIds)
      .order('created_at', { ascending: false });
    analysisSessions = sessions || [];
  }

  // Fetch course progress
  let courseProgress = [];
  if (clientIds.length > 0) {
    const { data: progress } = await supabase
      .from('course_progress')
      .select('user_id, course_id, progress_pct, completed_at')
      .in('user_id', clientIds);
    courseProgress = progress || [];
  }

  return (
    <CoachDashboardClient
      clients={clients || []}
      chatCount={chatCount || 0}
      coachNotes={coachNotes || []}
      analysisSessions={analysisSessions}
      courseProgress={courseProgress}
      coachId={user.id}
    />
  );
}
