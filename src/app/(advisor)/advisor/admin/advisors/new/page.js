import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import NewAdvisorForm from './NewAdvisorForm';

export default async function NewAdvisorPage({ searchParams }) {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') redirect('/advisor');

  const returnFair = searchParams?.returnFair || null;

  return (
    <div style={{ maxWidth: 520 }}>
      <Link
        href={returnFair ? `/advisor/admin/fairs/${returnFair}` : '/advisor/admin'}
        style={{ fontSize: 13, color: '#86868b', textDecoration: 'none' }}
      >
        ← Zurück
      </Link>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', margin: '12px 0 8px' }}>Neuen Berater erstellen</h1>
      <p style={{ color: '#86868b', fontSize: 14, marginBottom: 32 }}>
        Der Berater erhält automatisch eine Einladungs-E-Mail und setzt sein Passwort selbst.
      </p>
      <NewAdvisorForm returnFair={returnFair} />
    </div>
  );
}
