import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MasterclassClient from './MasterclassClient';

export default async function MasterclassPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: courses } = await supabase
    .from('courses').select('*, modules(*, lessons(*))').eq('is_published', true).order('sort_order');
  const { data: progress } = await supabase
    .from('lesson_progress').select('lesson_id, completed').eq('user_id', user.id);
  const { data: results } = await supabase
    .from('analysis_results').select('field_id, score').eq('user_id', user.id);
  const { data: profile } = await supabase
    .from('profiles').select('current_salary, target_salary').eq('id', user.id).single();

  return <MasterclassClient courses={courses || []} progress={progress || []} analysisResults={results || []} profile={profile} />;
}
