import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import PeersClient from './PeersClient';

export default async function PeersPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, first_name, industry, target_salary, career_obstacle, total_points, subscription_plan, purchased_products, peer_matching_enabled')
    .eq('id', user.id)
    .single();

  // Find potential matches
  const { data: potentialMatches } = await supabase
    .from('profiles')
    .select('id, first_name, industry, target_salary, career_obstacle, total_points')
    .eq('peer_matching_enabled', true)
    .neq('id', user.id)
    .limit(20);

  // Get existing requests
  const { data: requests } = await supabase
    .from('peer_requests')
    .select('*')
    .or(`from_user.eq.${user.id},to_user.eq.${user.id}`);

  return <PeersClient
    profile={profile}
    potentialMatches={potentialMatches || []}
    requests={requests || []}
    userId={user.id}
  />;
}
