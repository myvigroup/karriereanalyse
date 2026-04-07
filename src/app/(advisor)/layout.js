import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import AdvisorSidebar from '@/components/layout/AdvisorSidebar';

export default async function AdvisorLayout({ children }) {
  let profile = null;
  let advisor = null;

  try {
    const supabase = createClient();
    const admin = createAdminClient();
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) redirect('/auth/login');

    const { data: profileData } = await admin
      .from('profiles')
      .select('id, name, avatar_initials, role, email')
      .eq('id', user.id)
      .maybeSingle();

    profile = profileData;

    if (!profile || !['advisor', 'messeleiter', 'admin'].includes(profile.role)) redirect('/dashboard');

    const { data: advisorData } = await admin
      .from('advisors')
      .select('id, display_name')
      .eq('user_id', user.id)
      .maybeSingle();

    advisor = advisorData;
  } catch (err) {
    // Allow Next.js redirects to propagate normally
    if (err?.digest?.startsWith?.('NEXT_REDIRECT') || err?.message === 'NEXT_REDIRECT') throw err;
    // Render the actual error so we can diagnose in production
    return (
      <html lang="de">
        <body>
          <div style={{ padding: 40, background: '#FEF2F2', borderRadius: 16, border: '1px solid #FECACA', maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui, sans-serif' }}>
            <h2 style={{ color: '#DC2626', marginBottom: 16 }}>Layout-Fehler (Debug)</h2>
            <p style={{ fontWeight: 600, marginBottom: 8 }}>{err?.message || 'Kein Fehlertext'}</p>
            <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', color: '#6B7280', background: '#FFF', padding: 16, borderRadius: 8 }}>
              {err?.stack?.slice(0, 1000) || 'Kein Stack'}
            </pre>
          </div>
        </body>
      </html>
    );
  }

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
