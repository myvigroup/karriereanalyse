import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import SeminarVerwaltung from './SeminarVerwaltung';

export default async function AdminSeminarsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'coach'].includes(profile.role)) redirect('/dashboard');

  const { data: seminars } = await supabase
    .from('seminars')
    .select('*')
    .order('sort_order');

  return <SeminarVerwaltung seminars={seminars || []} />;
}
