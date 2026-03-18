import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SalaryLogClient from './SalaryLogClient';

export default async function SalaryLogPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: entries } = await supabase.from('salary_log').select('*').eq('user_id', user.id).order('date', { ascending: false });
  return <SalaryLogClient entries={entries || []} userId={user.id} />;
}
