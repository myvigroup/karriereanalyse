import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { createFair } from '../../actions';

export default async function NewFairPage() {
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
    <div style={{ maxWidth: 560 }}>
      <Link href="/advisor/admin" style={{ fontSize: 13, color: '#86868b', textDecoration: 'none' }}>← Zurück</Link>
      <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', margin: '12px 0 8px' }}>Neue Messe erstellen</h1>
      <p style={{ color: '#86868b', fontSize: 14, marginBottom: 32 }}>Die Messe erscheint danach im Berater-Dashboard.</p>

      <form action={createFair}>
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 28, display: 'flex', flexDirection: 'column', gap: 20 }}>

          <div>
            <label style={labelStyle}>Name der Messe *</label>
            <input name="name" required placeholder="z.B. Karrieremesse Augsburg 2025" style={inputStyle} />
          </div>

          <div>
            <label style={labelStyle}>Stadt</label>
            <input name="city" placeholder="z.B. Augsburg" style={inputStyle} />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
            <div>
              <label style={labelStyle}>Startdatum *</label>
              <input name="start_date" type="date" required style={inputStyle} />
            </div>
            <div>
              <label style={labelStyle}>Enddatum</label>
              <input name="end_date" type="date" style={inputStyle} />
            </div>
          </div>

          <div>
            <label style={labelStyle}>Status</label>
            <select name="status" style={{ ...inputStyle, cursor: 'pointer' }}>
              <option value="upcoming">Bevorstehend</option>
              <option value="active">Aktiv</option>
              <option value="completed">Abgeschlossen</option>
            </select>
          </div>

          <div style={{ display: 'flex', gap: 12, paddingTop: 4 }}>
            <button
              type="submit"
              style={{
                flex: 1,
                padding: '12px 0',
                background: '#CC1426',
                color: '#fff',
                border: 'none',
                borderRadius: 980,
                fontSize: 15,
                fontWeight: 600,
                cursor: 'pointer',
              }}
            >
              Messe erstellen →
            </button>
            <Link
              href="/advisor/admin"
              style={{
                padding: '12px 20px',
                background: '#F5F5F7',
                color: '#6B7280',
                border: 'none',
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
