import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CareerClient from './CareerClient';

export default async function CareerPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: progress } = await supabase.from('lesson_progress').select('lesson_id, completed').eq('user_id', user.id);
  const { data: analysisSession } = await supabase.from('analysis_sessions').select('overall_score').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single();
  const { data: certificates } = await supabase.from('certificates').select('*').eq('user_id', user.id);
  const { data: courses } = await supabase.from('courses').select('*, modules(*, lessons(*))').eq('is_published', true);

  return (
    <CareerClient
      profile={profile}
      progress={progress || []}
      analysisSession={analysisSession}
      certificates={certificates || []}
      courses={courses || []}
    />
  );
}
