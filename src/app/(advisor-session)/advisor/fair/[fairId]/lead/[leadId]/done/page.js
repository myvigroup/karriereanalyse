import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import Link from 'next/link';

export default async function DonePage({ params }) {
  const { fairId, leadId } = params;
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();

  // Lead laden
  const { data: lead } = await admin
    .from('fair_leads')
    .select('first_name, last_name, email')
    .eq('id', leadId)
    .single();

  // Tages-Count
  const today = new Date().toISOString().split('T')[0];
  const { count: todayCount } = await admin
    .from('fair_leads')
    .select('*', { count: 'exact', head: true })
    .eq('fair_id', fairId)
    .eq('advisor_user_id', user.id)
    .gte('created_at', today);

  return (
    <div style={{ maxWidth: 480, margin: '0 auto', textAlign: 'center', paddingTop: 48 }}>
      <div style={{ fontSize: 72, marginBottom: 16 }}>✅</div>

      <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1A1A1A', marginBottom: 8 }}>
        Geschafft!
      </h1>

      <p style={{ color: '#86868b', fontSize: 16, lineHeight: 1.6, marginBottom: 32 }}>
        Magic Link wurde an<br />
        <strong style={{ color: '#1A1A1A' }}>{lead?.email}</strong><br />
        gesendet.
      </p>

      {/* Statistik */}
      <div style={{
        background: '#fff',
        borderRadius: 16,
        padding: 24,
        border: '1px solid #E8E6E1',
        marginBottom: 32,
      }}>
        <div style={{ fontSize: 40, fontWeight: 700, color: '#CC1426' }}>{todayCount || 0}</div>
        <div style={{ fontSize: 14, color: '#86868b' }}>Gespräche heute</div>
      </div>

      {/* Buttons */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
        <Link
          href={`/advisor/fair/${fairId}/new-lead`}
          style={{
            display: 'block',
            padding: '16px',
            background: '#CC1426',
            color: '#fff',
            borderRadius: 12,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 16,
          }}
        >
          Nächster Besucher
        </Link>
        <Link
          href={`/advisor/fair/${fairId}`}
          style={{
            display: 'block',
            padding: '14px',
            background: '#fff',
            color: '#1A1A1A',
            borderRadius: 12,
            textDecoration: 'none',
            fontWeight: 600,
            fontSize: 15,
            border: '1px solid #E8E6E1',
          }}
        >
          Zurück zur Übersicht
        </Link>
      </div>
    </div>
  );
}
