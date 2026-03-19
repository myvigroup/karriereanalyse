import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AnalyticsClient from './AnalyticsClient';

export default async function AdminAnalyticsPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .single();

  if (!profile || !['admin', 'coach'].includes(profile.role)) {
    redirect('/dashboard');
  }

  // Fetch analytics data
  const sevenDaysAgo = new Date(Date.now() - 7 * 86400000).toISOString();
  const thirtyDaysAgo = new Date(Date.now() - 30 * 86400000).toISOString();

  const [
    { count: activeUsers7d },
    { count: totalUsers },
    { data: recentEvents },
    { data: profiles },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }).gte('updated_at', sevenDaysAgo),
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('analytics_events').select('event_name, created_at').gte('created_at', thirtyDaysAgo).order('created_at', { ascending: false }).limit(500),
    supabase.from('profiles').select('created_at, total_points, onboarding_complete').order('created_at', { ascending: false }).limit(100),
  ]);

  return <AnalyticsClient
    activeUsers7d={activeUsers7d || 0}
    totalUsers={totalUsers || 0}
    recentEvents={recentEvents || []}
    profiles={profiles || []}
  />;
}
