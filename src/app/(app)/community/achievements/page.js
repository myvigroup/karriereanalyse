import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AchievementsClient from './AchievementsClient';

export default async function AchievementsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, subscription_plan, purchased_products, share_achievements')
    .eq('id', user.id)
    .single();

  const { data: achievements } = await supabase
    .from('public_achievements')
    .select('*, profiles:user_id(first_name, industry)')
    .order('created_at', { ascending: false })
    .limit(50);

  return <AchievementsClient
    achievements={achievements || []}
    profile={profile}
    userId={user.id}
  />;
}
