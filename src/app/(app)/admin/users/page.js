import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import AdminUsersClient from './AdminUsersClient';

export default async function AdminUsersPage() {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await admin
    .from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'coach'].includes(profile.role)) redirect('/dashboard');

  const { data: users } = await admin
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false });

  return <AdminUsersClient users={users || []} />;
}
