import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Sidebar from '@/components/layout/Sidebar';
import MobileNav from '@/components/layout/MobileNav';
import AppTour from '@/components/ui/AppTour';
import GlobalSearch from '@/components/ui/GlobalSearch';

export default async function AppLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', user.id)
    .single();

  if (profile && profile.onboarding_complete === false) redirect('/onboarding');

  return (
    <div style={{ display: 'flex', minHeight: '100vh' }}>
      <Sidebar profile={profile} />
      <main style={{ flex: 1, marginLeft: 240, background: 'var(--ki-bg)', minHeight: '100vh' }}>
        {children}
      </main>
      <MobileNav />
      <AppTour profile={profile} userId={user.id} />
      <GlobalSearch />
    </div>
  );
}
