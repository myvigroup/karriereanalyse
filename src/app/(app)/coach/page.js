import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import CoachClient from './CoachClient';

export default async function CoachPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: profile } = await supabase.from('profiles').select('first_name, name, position, company, current_salary, target_salary').eq('id', user.id).single();
  const { data: chats } = await supabase.from('coaching_chats').select('id, title, created_at, message_count').eq('user_id', user.id).eq('is_archived', false).order('updated_at', { ascending: false }).limit(20);
  return <CoachClient chats={chats || []} userId={user.id} profile={profile} />;
}
