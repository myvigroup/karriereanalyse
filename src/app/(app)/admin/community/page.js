import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminCommunityClient from './AdminCommunityClient';

export default async function AdminCommunityPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();
  if (!profile || !['admin', 'coach'].includes(profile.role)) redirect('/dashboard');

  // Posts mit Autoren
  const { data: posts } = await supabase
    .from('community_posts')
    .select('id, user_id, post_type, content, likes, comments_count, pinned, badge_type, created_at')
    .order('created_at', { ascending: false })
    .limit(100);

  const userIds = Array.from(new Set((posts || []).map(p => p.user_id)));
  const { data: profiles } = userIds.length
    ? await supabase.from('profiles').select('id, name, first_name, avatar_initials').in('id', userIds)
    : { data: [] };
  const profileMap = Object.fromEntries((profiles || []).map(p => [p.id, p]));

  // Peer-Matches
  const { data: matches } = await supabase
    .from('peer_matches')
    .select('id, user_a, user_b, status, match_reason, session_count, last_session_at, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  // Peer-Anfragen
  const { data: requests } = await supabase
    .from('peer_requests')
    .select('id, from_user, to_user, status, created_at')
    .order('created_at', { ascending: false })
    .limit(50);

  // Stats
  const [
    { count: postsTotal },
    { count: commentsTotal },
    { count: matchesTotal },
    { count: requestsPending },
  ] = await Promise.all([
    supabase.from('community_posts').select('*', { count: 'exact', head: true }),
    supabase.from('community_comments').select('*', { count: 'exact', head: true }),
    supabase.from('peer_matches').select('*', { count: 'exact', head: true }),
    supabase.from('peer_requests').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
  ]);

  // Profile-Map auch für Matches/Requests
  const allUserIds = Array.from(new Set([
    ...userIds,
    ...(matches || []).flatMap(m => [m.user_a, m.user_b]),
    ...(requests || []).flatMap(r => [r.from_user, r.to_user]),
  ]));
  const { data: allProfiles } = allUserIds.length
    ? await supabase.from('profiles').select('id, name, first_name, avatar_initials').in('id', allUserIds)
    : { data: [] };
  const allProfileMap = Object.fromEntries((allProfiles || []).map(p => [p.id, p]));

  return <AdminCommunityClient
    posts={posts || []}
    matches={matches || []}
    requests={requests || []}
    profileMap={allProfileMap}
    stats={{
      posts: postsTotal || 0,
      comments: commentsTotal || 0,
      matches: matchesTotal || 0,
      requestsPending: requestsPending || 0,
    }}
  />;
}
