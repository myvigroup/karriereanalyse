import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const metadata = { title: 'Berater-Bereich | Karriere-Institut' };

export default async function AdvisorLayout({ children }) {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) redirect('/auth/login');

  const { data: profile } = await supabase
    .from('profiles')
    .select('role, name, first_name, last_name')
    .eq('id', user.id)
    .single();

  if (!profile || profile.role !== 'advisor') redirect('/dashboard');

  const displayName = profile.first_name || profile.name || 'Berater';

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8' }}>
      {/* Top Navigation */}
      <header style={{
        background: '#fff',
        borderBottom: '1px solid #E8E6E1',
        padding: '12px 24px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        position: 'sticky',
        top: 0,
        zIndex: 50,
      }}>
        <Link href="/advisor" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: 2, color: '#CC1426', textTransform: 'uppercase' }}>
            Karriere-Institut
          </span>
          <span style={{ fontSize: 12, color: '#86868b', fontWeight: 500 }}>Berater</span>
        </Link>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          <span style={{ fontSize: 14, color: '#1A1A1A' }}>{displayName}</span>
          <Link href="/dashboard" style={{ fontSize: 13, color: '#86868b', textDecoration: 'none' }}>
            Zum Dashboard
          </Link>
        </div>
      </header>

      {/* Main Content */}
      <main style={{ maxWidth: 1200, margin: '0 auto', padding: '24px 16px' }}>
        {children}
      </main>
    </div>
  );
}
