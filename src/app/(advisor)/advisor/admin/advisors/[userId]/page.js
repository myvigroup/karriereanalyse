import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import {
  assignAdvisorToFair,
  removeAdvisorFromFair,
  changeAdvisorRole,
  deleteAdvisor,
} from '../../actions';

const ROLE_LABELS = {
  advisor: 'Berater',
  messeleiter: 'Messeleiter',
  admin: 'Admin',
};

export default async function AdvisorDetailPage({ params }) {
  const { userId } = params;
  const supabase = createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (!['admin', 'messeleiter'].includes(profile?.role)) redirect('/advisor');
  const isAdmin = profile?.role === 'admin';

  const [
    { data: advisorProfile },
    { data: advisor },
    { data: assignments },
    { data: allFairs },
  ] = await Promise.all([
    admin.from('profiles').select('id, email, name, role').eq('id', userId).maybeSingle(),
    admin.from('advisors').select('id, display_name').eq('user_id', userId).maybeSingle(),
    admin.from('fair_advisors').select('fair_id').eq('advisor_user_id', userId),
    admin.from('fairs').select('id, name, city, start_date, status').order('start_date', { ascending: false }),
  ]);

  if (!advisor) redirect('/advisor/admin');

  const assignedFairIds = new Set((assignments || []).map(a => a.fair_id));
  const assignedFairs = (allFairs || []).filter(f => assignedFairIds.has(f.id));
  const unassignedFairs = (allFairs || []).filter(f => !assignedFairIds.has(f.id));

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '–';

  const inputStyle = {
    flex: 1,
    padding: '9px 13px',
    borderRadius: 8,
    border: '1px solid #E8E6E1',
    fontSize: 14,
    color: '#1A1A1A',
    background: '#fff',
    boxSizing: 'border-box',
  };

  const isSelf = userId === user.id;

  return (
    <div style={{ maxWidth: 700 }}>
      <Link href="/advisor/admin" style={{ fontSize: 13, color: '#86868b', textDecoration: 'none' }}>← Zurück zur Übersicht</Link>

      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, margin: '16px 0 32px' }}>
        <div style={{ width: 52, height: 52, borderRadius: '50%', background: '#CC1426', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 20, flexShrink: 0 }}>
          {advisor.display_name?.charAt(0).toUpperCase() || '?'}
        </div>
        <div>
          <h1 style={{ fontSize: 22, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>{advisor.display_name}</h1>
          <div style={{ fontSize: 13, color: '#86868b', marginTop: 2 }}>
            {advisorProfile?.email || '–'} · <span style={{ color: '#1A1A1A', fontWeight: 500 }}>{ROLE_LABELS[advisorProfile?.role] || advisorProfile?.role}</span>
          </div>
        </div>
      </div>

      {/* ── Zugewiesene Messen ── */}
      <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 12 }}>Zugewiesene Messen ({assignedFairs.length})</h2>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden', marginBottom: 28 }}>
        {assignedFairs.length === 0 ? (
          <div style={{ padding: 32, textAlign: 'center', color: '#86868b', fontSize: 14 }}>
            Noch keiner Messe zugewiesen.
          </div>
        ) : assignedFairs.map((fair, i) => (
          <div key={fair.id} style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            padding: '14px 20px',
            borderBottom: i < assignedFairs.length - 1 ? '1px solid #F0EEE9' : 'none',
          }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{fair.name}</div>
              <div style={{ fontSize: 12, color: '#86868b', marginTop: 2 }}>{fair.city && `${fair.city} · `}{formatDate(fair.start_date)}</div>
            </div>
            <form action={removeAdvisorFromFair} style={{ margin: 0 }}>
              <input type="hidden" name="fair_id" value={fair.id} />
              <input type="hidden" name="advisor_user_id" value={userId} />
              <input type="hidden" name="redirectTo" value={`/advisor/admin/advisors/${userId}`} />
              <button type="submit" style={{ background: 'none', border: '1px solid #E8E6E1', color: '#DC2626', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: '6px 14px', borderRadius: 8 }}>
                Entfernen
              </button>
            </form>
          </div>
        ))}
      </div>

      {/* ── Weitere Messe zuweisen ── */}
      {unassignedFairs.length > 0 && (
        <>
          <h2 style={{ fontSize: 16, fontWeight: 700, color: '#1A1A1A', marginBottom: 12 }}>Weitere Messe zuweisen</h2>
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 20, marginBottom: 28 }}>
            <form action={assignAdvisorToFair} style={{ display: 'flex', gap: 10 }}>
              <input type="hidden" name="advisor_user_id" value={userId} />
              <input type="hidden" name="redirectTo" value={`/advisor/admin/advisors/${userId}`} />
              <select name="fair_id" style={inputStyle}>
                {unassignedFairs.map(f => (
                  <option key={f.id} value={f.id}>{f.name} — {formatDate(f.start_date)}</option>
                ))}
              </select>
              <button type="submit" style={{ padding: '9px 20px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14, whiteSpace: 'nowrap' }}>
                + Zuweisen
              </button>
            </form>
          </div>
        </>
      )}

      {/* ── Rolle ändern ── */}
      {isAdmin && (
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', padding: 24, marginBottom: 20 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: '0 0 12px' }}>Rolle ändern</h2>
          <form action={changeAdvisorRole} style={{ display: 'flex', gap: 10 }}>
            <input type="hidden" name="user_id" value={userId} />
            <select name="role" defaultValue={advisorProfile?.role} style={{ ...inputStyle, flex: 1 }}>
              <option value="advisor">Berater — eigene Gespräche verwalten</option>
              <option value="messeleiter">Messeleiter — Berater anlegen & alle Leads der Messe sehen</option>
              <option value="admin">Admin — Vollzugriff inkl. alle Messen verwalten</option>
            </select>
            <button type="submit" style={{ padding: '9px 20px', background: '#1A1A1A', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14, whiteSpace: 'nowrap' }}>
              Speichern
            </button>
          </form>
        </div>
      )}

      {/* ── Berater löschen ── */}
      {isAdmin && !isSelf && (
        <div style={{ background: '#FEF2F2', borderRadius: 16, border: '1px solid #FECACA', padding: 24 }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#DC2626', margin: '0 0 8px' }}>Berater löschen</h2>
          <p style={{ fontSize: 13, color: '#6B7280', margin: '0 0 16px' }}>
            Der Account wird gesperrt und der Berater aus allen Messen entfernt. Bestehende Gesprächsdaten bleiben erhalten.
          </p>
          <form action={deleteAdvisor}>
            <input type="hidden" name="user_id" value={userId} />
            <button type="submit" style={{ padding: '10px 20px', background: '#DC2626', color: '#fff', border: 'none', borderRadius: 8, fontWeight: 600, cursor: 'pointer', fontSize: 14 }}>
              Berater endgültig löschen
            </button>
          </form>
        </div>
      )}
    </div>
  );
}
