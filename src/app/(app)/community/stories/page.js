import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import StoriesClient from './StoriesClient';

export default async function StoriesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('id, subscription_plan, purchased_products')
    .eq('id', user.id)
    .single();

  const { data: stories } = await supabase
    .from('success_stories')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(30);

  return <StoriesClient stories={stories || []} profile={profile} userId={user.id} />;
}
