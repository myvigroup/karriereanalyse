import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import MarktwertClient from './MarktwertClient';

export default async function MarktwertPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: log } = await supabase.from('market_value_log').select('*').eq('user_id', user.id).order('date', { ascending: true }).limit(60);
  const { data: progress } = await supabase.from('lesson_progress').select('*, lessons(title, market_value_impact)').eq('user_id', user.id).eq('completed', true);
  const { data: courses } = await supabase.from('courses').select('title, market_value_impact, modules(lessons(id))').eq('is_published', true);
  return <MarktwertClient profile={profile} log={log || []} progress={progress || []} courses={courses || []} userId={user.id} />;
}
