import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminUsersClient from './AdminUsersClient';

export default async function AdminUsersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'coach'].includes(profile.role)) redirect('/dashboard');

  const { data: users } = await supabase
    .from('profiles')
    .select('*, career_documents(id, document_type, file_path, status, is_required, rejection_reason)')
    .order('created_at', { ascending: false });

  return <AdminUsersClient users={users || []} />;
}
