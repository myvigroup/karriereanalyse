import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import OrgDashboardClient from './OrgDashboardClient';

export default async function OrgDashboardPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // Check if user is org admin
  const { data: membership } = await supabase
    .from('org_members')
    .select('organization_id, role')
    .eq('user_id', user.id)
    .eq('role', 'admin')
    .maybeSingle();

  if (!membership) redirect('/dashboard');

  const orgId = membership.organization_id;

  const [
    { data: org },
    { data: members },
  ] = await Promise.all([
    supabase.from('organizations').select('*').eq('id', orgId).single(),
    supabase
      .from('org_members')
      .select('*, profiles:user_id(id, name, email, total_points, onboarding_complete, updated_at)')
      .eq('organization_id', orgId)
      .order('joined_at', { ascending: false }),
  ]);

  return <OrgDashboardClient
    org={org}
    members={members || []}
    userId={user.id}
  />;
}
