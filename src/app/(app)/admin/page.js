import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import AdminHubClient from './AdminHubClient';

export default async function AdminHubPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles').select('role, name, first_name').eq('id', user.id).single();

  if (!profile || !['admin', 'coach'].includes(profile.role)) {
    redirect('/dashboard');
  }

  // Aggregat-Stats für die Hub-Übersicht
  const [
    { count: usersCount },
    { count: coachesCount },
    { count: coursesCount },
    { count: cvCount },
    { count: advisorsCount },
  ] = await Promise.all([
    supabase.from('profiles').select('*', { count: 'exact', head: true }),
    supabase.from('coaches').select('*', { count: 'exact', head: true }),
    supabase.from('courses').select('*', { count: 'exact', head: true }),
    supabase.from('cv_documents').select('*', { count: 'exact', head: true }),
    supabase.from('advisors').select('*', { count: 'exact', head: true }),
  ]);

  return <AdminHubClient
    profile={profile}
    stats={{
      users: usersCount || 0,
      coaches: coachesCount || 0,
      courses: coursesCount || 0,
      cvs: cvCount || 0,
      advisors: advisorsCount || 0,
    }}
  />;
}
