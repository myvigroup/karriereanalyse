// Berater-Layout — nutzt jetzt die gleiche Sidebar wie das Mitglieder-Portal,
// damit Admin/Berater nahtlos zwischen beiden Welten wechseln können.

import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';

export default async function AdvisorLayout({ children }) {
  const supabase = createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await admin
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || !['advisor', 'admin', 'messeleiter', 'coach'].includes(profile.role)) {
    redirect('/dashboard');
  }

  const buildVersion = (process.env.VERCEL_GIT_COMMIT_SHA || 'dev').slice(0, 7);
  const buildEnv = process.env.VERCEL_ENV || null;

  return (
    <div className="app-shell">
      <Sidebar profile={profile} version={buildVersion} env={buildEnv} />
      <main className="app-main">
        {children}
      </main>
    </div>
  );
}
