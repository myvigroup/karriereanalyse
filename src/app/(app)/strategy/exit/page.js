import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ExitClient from './ExitClient';

export default async function ExitPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: plan } = await supabase.from('exit_plans').select('*').eq('user_id', user.id).single();
  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  return <ExitClient userId={user.id} existingPlan={plan} profile={profile} />;
}
