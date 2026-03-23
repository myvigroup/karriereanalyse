import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ApplicationsClient from './ApplicationsClient';

export default async function ApplicationsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: apps } = await supabase.from('applications').select('*').eq('user_id', user.id).order('created_at', { ascending: false });
  const { data: documents } = await supabase.from('career_documents').select('*').eq('user_id', user.id).order('sort_order');
  return <ApplicationsClient applications={apps || []} documents={documents || []} userId={user.id} />;
}
