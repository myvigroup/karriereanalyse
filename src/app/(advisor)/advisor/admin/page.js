import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import { deleteAdvisor } from './actions';

const STATUS_BADGE = {
  upcoming: { label: 'Bevorstehend', bg: '#FFF3E0', color: '#D97706' },
  active: { label: 'Aktiv', bg: '#D1FAE5', color: '#059669' },
  completed: { label: 'Abgeschlossen', bg: '#F3F4F6', color: '#6B7280' },
};

export default async function AdminPage() {
  try {
  const supabase = createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  const { data: profile } = await admin.from('profiles').select('role, name').eq('id', user.id).maybeSingle();
  if (!['admin', 'messeleiter'].includes(profile?.role)) redirect('/advisor');

  const isAdmin = profile?.role === 'admin';

  // Messeleiter: nur zugewiesene Messen; Admin: alle
  let fairIds = null;
  if (!isAdmin) {
    const { data: myAssignments } = await admin.from('fair_advisors').select('fair_id').eq('advisor_user_id', user.id);
    fairIds = (myAssignments || []).map(a => a.fair_id);
  }

  // Messen laden (ohne .then() + korrekter Spaltenname start_date)
  let fairs = [];
  if (fairIds === null) {
    const { data } = await admin.from('fairs').select('*').order('start_date');
    fairs = (data || []).reverse();
  } else if (fairIds.length > 0) {
    const { data } = await admin.from('fairs').select('*').in('id', fairIds).order('start_date');
    fairs = (data || []).reverse();
  }

  // Leads, Berater, Profile, Zuweisungen parallel laden
  const [
    { data: leads },
    { data: advisors },
    { data: allProfiles },
    { data: assignments },
  ] = await Promise.all([
    (fairIds !== null && fairIds.length === 0)
      ? Promise.resolve({ data: [] })
      : (fairIds ? admin.from('fair_leads').select('id, status, fair_id, advisor_user_id, created_at').in('fair_id', fairIds) : admin.from('fair_leads').select('id, status, fair_id, advisor_user_id, created_at')),
    admin.from('advisors').select('id, user_id, display_name'),
    admin.from('profiles').select('id, email, name').in('role', ['advisor', 'messeleiter', 'admin']),
    admin.from('fair_advisors').select('fair_id, advisor_user_id'),
  ]);

  // KPIs
  const today = new Date().toISOString().split('T')[0];
  const totalLeads = (leads || []).length;
  const todayLeads = (leads || []).filter(l => l.created_at?.startsWith(today)).length;
  const openChecks = (leads || []).filter(l => ['new', 'analyzing', 'feedback_pending'].includes(l.status)).length;
  const completed = (leads || []).filter(l => ['completed', 'contacted', 'converted'].includes(l.status)).length;
  const activeFairs = (fairs || []).filter(f => ['upcoming', 'active'].includes(f.status)).length;

  // Per-Fair Daten
  const leadsByFair = (leads || []).reduce((acc, l) => {
    if (!acc[l.fair_id]) acc[l.fair_id] = { total: 0, open: 0 };
    acc[l.fair_id].total++;
    if (['new', 'analyzing', 'feedback_pending'].includes(l.status)) acc[l.fair_id].open++;
    return acc;
  }, {});

  const advisorsByFair = (assignments || []).reduce((acc, a) => {
    acc[a.fair_id] = (acc[a.fair_id] || 0) + 1;
    return acc;
  }, {});

  const fairCountByAdvisor = (assignments || []).reduce((acc, a) => {
    acc[a.advisor_user_id] = (acc[a.advisor_user_id] || 0) + 1;
    return acc;
  }, {});

  const profileById = (allProfiles || []).reduce((acc, p) => { acc[p.id] = p; return acc; }, {});

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '–';

  const kpis = [
    { label: 'Gespräche gesamt', value: totalLeads, color: '#CC1426' },
    { label: 'Heute', value: todayLeads, color: '#D97706' },
    { label: 'CV-Checks offen', value: openChecks, color: '#1D4ED8' },
    { label: 'Abgeschlossen', value: completed, color: '#059669' },
    { label: 'Aktive Messen', value: activeFairs, color: '#7C3AED' },
  ];

  return (
    <div>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>Admin-Bereich</h1>
          <p style={{ color: '#86868b', marginTop: 4, marginBottom: 0 }}>Messen, Berater und Kennzahlen verwalten</p>
        </div>
        <Link
          href="/advisor/admin/platform"
          style={{ padding: '9px 20px', background: '#1A1A1A', color: '#fff', borderRadius: 980, textDecoration: 'none', fontSize: 14, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 8 }}
        >
          📊 Plattform-Cockpit
        </Link>
      </div>

      {/* KPI Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: 12, marginBottom: 48 }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 16, padding: '20px 20px', border: '1px solid #E8E6E1' }}>
            <div style={{ fontSize: 36, fontWeight: 700, color: kpi.color, lineHeight: 1 }}>{kpi.value}</div>
            <div style={{ fontSize: 12, color: '#86868b', marginTop: 6 }}>{kpi.label}</div>
          </div>
        ))}
      </div>

      {/* ── Messen ──────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>{isAdmin ? 'Alle Messen' : 'Meine Messen'}</h2>
        {isAdmin && (
          <Link
            href="/advisor/admin/fairs/new"
            style={{ padding: '9px 18px', background: '#CC1426', color: '#fff', borderRadius: 980, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}
          >
            + Neue Messe
          </Link>
        )}
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden', marginBottom: 48 }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: '2fr 130px 150px 70px 70px 70px 110px',
          padding: '12px 20px',
          borderBottom: '1px solid #F0EEE9',
          background: '#FAFAF8',
        }}>
          {['Messe', 'Status', 'Datum', 'Leads', 'Offen', 'Berater', ''].map((h, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
          ))}
        </div>

        {(!fairs || fairs.length === 0) ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#86868b' }}>
            Noch keine Messen vorhanden. <Link href="/advisor/admin/fairs/new" style={{ color: '#CC1426' }}>Erste Messe erstellen →</Link>
          </div>
        ) : fairs.map((fair, i) => {
          const kpi = leadsByFair[fair.id] || { total: 0, open: 0 };
          const badge = STATUS_BADGE[fair.status] || STATUS_BADGE.upcoming;
          return (
            <div key={fair.id} style={{
              display: 'grid',
              gridTemplateColumns: '2fr 130px 150px 70px 70px 70px 110px',
              padding: '14px 20px',
              alignItems: 'center',
              borderBottom: i < fairs.length - 1 ? '1px solid #F0EEE9' : 'none',
            }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{fair.name}</div>
                {fair.city && <div style={{ fontSize: 12, color: '#86868b', marginTop: 1 }}>{fair.city}</div>}
              </div>
              <div>
                <span style={{ fontSize: 12, fontWeight: 600, padding: '3px 10px', borderRadius: 980, background: badge.bg, color: badge.color }}>
                  {badge.label}
                </span>
              </div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>{formatDate(fair.start_date)}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A' }}>{kpi.total}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: kpi.open > 0 ? '#D97706' : '#6B7280' }}>{kpi.open}</div>
              <div style={{ fontSize: 14, color: '#6B7280' }}>{advisorsByFair[fair.id] || 0}</div>
              <div style={{ display: 'flex', gap: 8 }}>
                <Link href={`/advisor/admin/fairs/${fair.id}`} style={{ fontSize: 13, fontWeight: 600, color: '#CC1426', textDecoration: 'none' }}>
                  Verwalten →
                </Link>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── Berater ──────────────────────────────── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>Berater</h2>
        <Link
          href="/advisor/admin/advisors/new"
          style={{ padding: '9px 18px', background: '#1A1A1A', color: '#fff', borderRadius: 980, textDecoration: 'none', fontSize: 14, fontWeight: 600 }}
        >
          + Neuen Berater
        </Link>
      </div>

      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden' }}>
        <div style={{
          display: 'grid',
          gridTemplateColumns: isAdmin ? '2fr 2fr 100px 100px 80px' : '2fr 2fr 120px 100px',
          padding: '12px 20px',
          borderBottom: '1px solid #F0EEE9',
          background: '#FAFAF8',
        }}>
          {[...['Name', 'E-Mail', 'Messen', ''], ...(isAdmin ? [''] : [])].map((h, i) => (
            <div key={i} style={{ fontSize: 11, fontWeight: 600, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
          ))}
        </div>

        {(!advisors || advisors.length === 0) ? (
          <div style={{ padding: 48, textAlign: 'center', color: '#86868b' }}>
            Noch keine Berater vorhanden. <Link href="/advisor/admin/advisors/new" style={{ color: '#CC1426' }}>Ersten Berater erstellen →</Link>
          </div>
        ) : advisors.map((adv, i) => {
          const prof = profileById[adv.user_id];
          const fairCount = fairCountByAdvisor[adv.user_id] || 0;
          return (
            <div key={adv.id} className="advisor-row" style={{
              display: 'grid',
              gridTemplateColumns: isAdmin ? '2fr 2fr 100px 100px 80px' : '2fr 2fr 120px 100px',
              padding: '14px 20px',
              alignItems: 'center',
              borderBottom: i < advisors.length - 1 ? '1px solid #F0EEE9' : 'none',
            }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                <div style={{ width: 32, height: 32, borderRadius: '50%', background: '#CC1426', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontWeight: 700, fontSize: 13, flexShrink: 0 }}>
                  {adv.display_name?.charAt(0).toUpperCase() || '?'}
                </div>
                <div style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{adv.display_name}</div>
              </div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>{prof?.email || '–'}</div>
              <div style={{ fontSize: 13, color: '#6B7280' }}>
                {fairCount} {fairCount === 1 ? 'Messe' : 'Messen'}
              </div>
              <Link href={`/advisor/admin/advisors/${adv.user_id}`} style={{ fontSize: 13, fontWeight: 600, color: '#CC1426', textDecoration: 'none' }}>
                Öffnen →
              </Link>
              {isAdmin && adv.user_id !== user.id && (
                <form action={deleteAdvisor} style={{ margin: 0 }}>
                  <input type="hidden" name="user_id" value={adv.user_id} />
                  <button type="submit" style={{ background: 'none', border: 'none', color: '#DC2626', fontSize: 13, fontWeight: 600, cursor: 'pointer', padding: 0 }}>
                    Löschen
                  </button>
                </form>
              )}
            </div>
          );
        })}
      </div>

      <style>{`.advisor-row:hover { background: #FAFAF8; }`}</style>
    </div>
  );
  } catch (err) {
    if (err?.digest?.startsWith?.('NEXT_REDIRECT') || err?.message === 'NEXT_REDIRECT') throw err;
    return (
      <div style={{ padding: 40, background: '#FEF2F2', borderRadius: 16, border: '1px solid #FECACA', maxWidth: 700, margin: '40px auto', fontFamily: 'system-ui, sans-serif' }}>
        <h2 style={{ color: '#DC2626', marginBottom: 16 }}>Admin-Fehler (Debug)</h2>
        <p style={{ fontWeight: 600, marginBottom: 8 }}>{err?.message || 'Kein Fehlertext'}</p>
        <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', color: '#6B7280', background: '#FFF', padding: 16, borderRadius: 8 }}>
          {err?.stack?.slice(0, 1000) || 'Kein Stack'}
        </pre>
      </div>
    );
  }
}
