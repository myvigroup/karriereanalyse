import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import GehaltClient from './GehaltClient';

export default async function GehaltPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: profile } = await supabase.from('profiles').select('current_salary, target_salary, position, xp').eq('id', user.id).single();
  const { data: benchmarks } = await supabase.from('salary_benchmarks').select('*').eq('is_public', true).order('total_compensation', { ascending: false }).limit(50);
  return <GehaltClient benchmarks={benchmarks || []} userId={user.id} profile={profile} />;
}
