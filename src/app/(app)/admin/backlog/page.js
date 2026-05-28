import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import BacklogClient from './BacklogClient';

export default async function AdminBacklogPage({ searchParams }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (!profile || profile.role !== 'admin') redirect('/dashboard');

  const admin = createAdminClient();
  const statusFilter = searchParams?.status || 'open';

  let query = admin
    .from('backlog_tickets')
    .select('*')
    .order('priority', { ascending: false })
    .order('created_at', { ascending: false });

  if (statusFilter !== 'all') {
    query = query.eq('status', statusFilter);
  }

  const { data: tickets } = await query;

  // Counts pro Status
  const { data: allTickets } = await admin.from('backlog_tickets').select('status');
  const counts = {
    open: (allTickets || []).filter(t => t.status === 'open').length,
    in_progress: (allTickets || []).filter(t => t.status === 'in_progress').length,
    done: (allTickets || []).filter(t => t.status === 'done').length,
    wont_do: (allTickets || []).filter(t => t.status === 'wont_do').length,
    all: (allTickets || []).length,
  };

  return (
    <BacklogClient
      tickets={tickets || []}
      counts={counts}
      currentStatusFilter={statusFilter}
    />
  );
}
