import { createClient } from '@/lib/supabase/server';
import CommunityClient from './CommunityClient';

export default async function CommunityPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: posts } = await supabase
    .from('community_posts')
    .select('*, profiles(first_name, industry, community_display_name)')
    .order('created_at', { ascending: false })
    .limit(50);
  const { data: courses } = await supabase.from('courses').select('id, title').order('title');

  return <CommunityClient profile={profile} posts={posts || []} courses={courses || []} userId={user.id} />;
}
