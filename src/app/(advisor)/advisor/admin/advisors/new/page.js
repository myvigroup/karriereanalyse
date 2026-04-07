import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createAdvisorAccount } from '../../actions';

export default async function NewAdvisorPage() {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') redirect('/advisor');

  const inputStyle = {
    width: '100%',
    padding: '10px 14px',
    borderRadius: 10,
    border: '1px solid #E8E6E1',
    fontSize: 14,
    color: '#1A1A1A',
    background: '#fff',
    outline: 'none',
    boxSizing: 'border-box',
  };

  const labelStyle = {
    display: 'block',
    fontSize: 13,
    fontWeight: 600,
    color: '#1A1A1A',
    marginBottom: 6,
  };

  return (
    <div style={{ maxWidth: 520 }}>
      <Link href="/advisor/admin" style={{ fontSize: 13, color: '#86868b', textDecoration: 'none' }}>← Zurück</Link>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', margin: '12px 0 8px' }}>Neuen Berater erstellen</h1>
      <p style={{ color: '#86868b', fontSize: 14, marginBottom: 32 }}>
        Der Berater erhält Zugang zum Berater-Portal und kann Messen zugewiesen werden.
      </p>

      <form action={createAdvisorAccount}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div>
            <label style={labelStyle}>Vollständiger Name *</label>
            <input name="name" required placeholder="z.B. Lisa Müller" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>E-Mail-Adresse *</label>
            <input name="email" type="email" required placeholder="lisa@beispiel.de" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Temporäres Passwort *</label>
            <input name="password" type="password" required minLength={8} placeholder="Mindestens 8 Zeichen" style={inputStyle} />
            <p style={{ fontSize: 12, color: '#86868b', marginTop: 6, marginBottom: 0 }}>
              Der Berater kann das Passwort nach dem ersten Login ändern.
            </p>
          </div>

          <div style={{ background: '#FFF3E0', borderRadius: 10, padding: '12px 14px' }}>
            <p style={{ fontSize: 13, color: '#D97706', margin: 0, fontWeight: 500 }}>
              ℹ️ Das Konto wird sofort aktiviert. Teile die Zugangsdaten sicher mit dem Berater.
            </p>
          </div>

          <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px 0',
                background: '#1A1A1A',
                color: '#fff',
                border: 'none',
                borderRadius: 980,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Berater erstellen →
            </button>
            <Link
              href="/advisor/admin"
              style={{
                padding: '12px 20px',
                background: '#F5F5F7',
                color: '#6B7280',
                borderRadius: 980,
                fontSize: 15,
                fontWeight: 600,
                textDecoration: 'none',
                textAlign: 'center',
              }}
            >
              Abbrechen
            </Link>
          </div>
        </div>
      </form>
    </div>
  );
}
