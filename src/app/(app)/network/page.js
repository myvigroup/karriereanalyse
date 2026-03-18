import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import NetworkClient from './NetworkClient';

export default async function NetworkPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: contacts } = await supabase.from('contacts').select('*').eq('user_id', user.id).order('last_contact_date', { ascending: true, nullsFirst: true });
  return <NetworkClient contacts={contacts || []} userId={user.id} />;
}
