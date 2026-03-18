import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ExitPlannerClient from './ExitPlannerClient';

export default async function ExitPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: plan } = await supabase.from('exit_plans').select('*').eq('user_id', user.id).single();
  return <ExitPlannerClient userId={user.id} existingPlan={plan} />;
}
