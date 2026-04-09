import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import AdvisorSidebar from '@/components/layout/AdvisorSidebar';

export default async function AdvisorLayout({ children }) {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/advisor/login');

  const { data: profile } = await admin
    .from('profiles')
    .select('id, name, avatar_initials, role, email')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || !['advisor', 'admin'].includes(profile.role)) redirect('/dashboard');

  const { data: advisor } = await admin
    .from('advisors')
    .select('id, display_name')
    .eq('user_id', user.id)
    .maybeSingle();

  return (
    <div style={{ display: 'flex', minHeight: '100vh', background: '#F5F5F7' }}>
      <AdvisorSidebar profile={profile} advisor={advisor} />
      <main style={{
        flex: 1,
        marginLeft: 240,
        minHeight: '100vh',
        background: '#F5F5F7',
      }}>
        <div style={{ padding: '32px 40px', maxWidth: 1200, margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
}
