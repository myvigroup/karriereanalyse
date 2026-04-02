import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdvisorSessionLayout({ children }) {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  const { data: profile } = await admin
    .from('profiles')
    .select('role')
    .eq('id', user.id)
    .maybeSingle();

  if (!profile || !['advisor', 'admin'].includes(profile.role)) redirect('/dashboard');

  return (
    <div style={{ minHeight: '100vh', background: '#fff', display: 'flex', flexDirection: 'column' }}>
      {/* Minimale Top-Bar */}
      <div style={{
        height: 52,
        borderBottom: '1px solid #F0EEE9',
        display: 'flex',
        alignItems: 'center',
        padding: '0 24px',
        background: '#fff',
        position: 'sticky',
        top: 0,
        zIndex: 100,
      }}>
        <Link
          href="/advisor"
          style={{
            fontSize: 13,
            color: '#86868b',
            textDecoration: 'none',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 500,
          }}
        >
          ← Übersicht
        </Link>
        <div style={{
          marginLeft: 'auto',
          fontSize: 12,
          fontWeight: 700,
          letterSpacing: '1.5px',
          color: '#CC1426',
          textTransform: 'uppercase',
        }}>
          Karriere-Institut
        </div>
      </div>

      {/* Seiten-Inhalt */}
      <div style={{ flex: 1, padding: '32px 40px', maxWidth: 1200, width: '100%', margin: '0 auto', boxSizing: 'border-box' }}>
        {children}
      </div>
    </div>
  );
}
