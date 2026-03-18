import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import DecisionClient from './DecisionClient';

export default async function DecisionPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: session } = await supabase.from('decision_sessions').select('*').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single();
  return <DecisionClient userId={user.id} existingSession={session} />;
}
