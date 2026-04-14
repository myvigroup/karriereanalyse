import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import CoachingClient from './CoachingClient';

export default async function AdminCoachingPage() {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await admin
    .from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'coach'].includes(profile.role)) redirect('/dashboard');

  const { data: users } = await admin
    .from('profiles')
    .select('*')
    .order('last_active_at', { ascending: true });

  const { data: analysisResults } = await admin
    .from('analysis_results')
    .select('user_id, score');

  const { data: lessonProgress } = await admin
    .from('lesson_progress')
    .select('user_id, completed');

  const { data: applications } = await admin
    .from('applications')
    .select('user_id, status');

  const { data: analysisScores } = await admin
    .from('analysis_sessions')
    .select('user_id, overall_score');

  return (
    <CoachingClient
      users={users || []}
      analysisResults={analysisResults || []}
      lessonProgress={lessonProgress || []}
      applications={applications || []}
      analysisScores={analysisScores || []}
    />
  );
}
