import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PreCoachingClient from './PreCoachingClient';

export default async function PreCoachingPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: documents } = await supabase.from('career_documents').select('*').eq('user_id', user.id).order('sort_order');
  return <PreCoachingClient documents={documents || []} userId={user.id} />;
}
