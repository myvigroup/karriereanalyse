import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import ProfileClient from './ProfileClient';

export default async function ProfilePage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase.from('profiles').select('*').eq('id', user.id).single();
  const { data: userBadges } = await supabase.from('user_badges').select('*, badges(*)').eq('user_id', user.id);
  const { data: allBadges } = await supabase.from('badges').select('*').order('sort_order');
  const { data: analysisSession } = await supabase.from('analysis_sessions').select('overall_score').eq('user_id', user.id).order('created_at', { ascending: false }).limit(1).single();
  const { data: progressCount } = await supabase.from('lesson_progress').select('id', { count: 'exact', head: true }).eq('user_id', user.id).eq('completed', true);
  const { data: certificates } = await supabase.from('certificates').select('*').eq('user_id', user.id);

  return (
    <ProfileClient
      profile={profile}
      userBadges={userBadges || []}
      allBadges={allBadges || []}
      analysisSession={analysisSession}
      lessonsCompleted={progressCount?.count || 0}
      certificates={certificates || []}
      userId={user.id}
    />
  );
}
