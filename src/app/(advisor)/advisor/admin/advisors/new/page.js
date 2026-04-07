import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createAdvisorAccount } from '../../actions';

export default async function NewAdvisorPage({ searchParams }) {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (profile?.role !== 'admin') redirect('/advisor');

  const returnFair = searchParams?.returnFair || null;

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

      <form action={createAdvisorAccount}>
        {returnFair && <input type="hidden" name="returnFair" value={returnFair} />}
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
            <label style={labelStyle}>Rolle</label>
            <select name="role" style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="advisor">Berater — Zugriff auf Berater-Portal</option>
              <option value="admin">Admin — Vollzugriff inkl. Verwaltung</option>
            </select>
          </div>

          <div style={{ background: '#D1FAE5', borderRadius: 10, padding: '12px 14px' }}>
            <p style={{ fontSize: 13, color: '#059669', margin: 0, fontWeight: 500 }}>
              ✓ Eine Einladungs-E-Mail wird automatisch versendet. Kein Passwort nötig.
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
              Einladung senden →
            </button>
            <Link
              href={returnFair ? `/advisor/admin/fairs/${returnFair}` : '/advisor/admin'}
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
