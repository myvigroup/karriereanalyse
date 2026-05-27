import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { loadCoaches } from '@/lib/coaches-server';
import AdminCoachesClient from './AdminCoachesClient';

export default async function AdminCoachesPage() {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles').select('role').eq('id', user.id).single();

  if (!profile || !['admin', 'coach'].includes(profile.role)) {
    redirect('/dashboard');
  }

  // Lädt ALLE Coaches inklusive inaktive für Admin-Sicht
  const coaches = await loadCoaches({ includeInactive: true });

  return <AdminCoachesClient initialCoaches={coaches} />;
}
