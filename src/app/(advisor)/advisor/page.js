import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export default async function AdvisorDashboard() {
  try {
  const supabase = createClient();
  const admin = createAdminClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');

  // Profil + Rolle prüfen
  const { data: profile } = await admin
    .from('profiles')
    .select('role, name')
    .eq('id', user.id)
    .maybeSingle();

  const isAdmin = ['admin', 'messeleiter'].includes(profile?.role);

  const { data: advisor } = await admin
    .from('advisors')
    .select('id, display_name')
    .eq('user_id', user.id)
    .maybeSingle();

  // Messen laden: Admin/Messeleiter sehen alle zugewiesenen Messen, Berater nur eigene
  let fairs;
  let fairIds;

  if (profile?.role === 'admin') {
    // Admin sieht alle Messen
    const { data: allFairs } = await admin.from('fairs').select('*').order('start_date');
    fairs = allFairs || [];
    fairIds = fairs.map(f => f.id);
  } else {
    // Messeleiter und Berater sehen nur zugewiesene Messen
    const { data: assignments } = await admin
      .from('fair_advisors')
      .select('fair_id')
      .eq('advisor_user_id', user.id);
    fairIds = (assignments || []).map(a => a.fair_id);
    if (fairIds.length > 0) {
      const { data: assignedFairs } = await admin.from('fairs').select('*').in('id', fairIds).order('start_date');
      fairs = assignedFairs || [];
    } else {
      fairs = [];
    }
  }

  // Lead-Counts — Messeleiter/Admin sieht alle Leads der Messe, Berater nur eigene
  let allLeads = [];
  if (fairIds.length > 0) {
    const { data: leadsData } = await admin
      .from('fair_leads')
      .select('fair_id, status, advisor_user_id')
      .in('fair_id', fairIds);
    const raw = leadsData || [];
    allLeads = isAdmin ? raw : raw.filter(l => l.advisor_user_id === user.id);
  }

  const today = new Date().toISOString().split('T')[0];
  let todayLeads = [];
  if (fairIds.length > 0) {
    const { data: todayRaw } = await admin
      .from('fair_leads')
      .select('id, advisor_user_id')
      .in('fair_id', fairIds)
      .gte('created_at', today);
    const raw = todayRaw || [];
    todayLeads = isAdmin ? raw : raw.filter(l => l.advisor_user_id === user.id);
  }

  const openChecks = allLeads.filter(l => ['cv_uploaded', 'feedback_given'].includes(l.status)).length;
  const totalLeads = allLeads.length;

  const countByFair = allLeads.reduce((acc, l) => {
    acc[l.fair_id] = (acc[l.fair_id] || 0) + 1;
    return acc;
  }, {});

  const activeFairs = (fairs || []).filter(f => ['upcoming', 'active'].includes(f.status));
  const pastFairs = (fairs || []).filter(f => f.status === 'completed');

  const formatDate = (d) => d ? new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '–';

  const firstName = advisor?.display_name?.split(' ')[0] || profile?.name?.split(' ')[0] || '';
  return (
    <div className="admin-coaches">
      <div className="admin-pageheader">
        <div>
          <div className="title-kicker"><span className="pulse" /> Berater · Messe-Dashboard</div>
          <h1 className="page-title">
            Guten Tag{firstName ? `, ${firstName}` : ''}.{' '}
            <span className="faded">Hier siehst du alles auf einen Blick.</span>
          </h1>
          <p className="page-sub">
            Ad-hoc CV-Checks anlegen, Messe-Termine verwalten und Leads abarbeiten — alles in einem Portal.
          </p>
        </div>
        <Link href="/advisor/quick-lead" className="admin-cta-primary">
          + Neuer CV-Check
        </Link>
      </div>

      {/* Stats-Reihe im Apple-Style */}
      <div className="admin-stats-row">
        <div className="admin-stat highlight">
          <div className="admin-stat-icon" style={{ color: 'var(--ki-red)' }}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/></svg>
          </div>
          <div className="admin-stat-body">
            <div className="admin-stat-value">{todayLeads.length}</div>
            <div className="admin-stat-label">Gespräche heute</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>
          </div>
          <div className="admin-stat-body">
            <div className="admin-stat-value">{openChecks}</div>
            <div className="admin-stat-label">Offene CV-Checks</div>
          </div>
        </div>
        <div className="admin-stat">
          <div className="admin-stat-icon">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><polyline points="23 6 13.5 15.5 8.5 10.5 1 18"/><polyline points="17 6 23 6 23 12"/></svg>
          </div>
          <div className="admin-stat-body">
            <div className="admin-stat-value">{totalLeads}</div>
            <div className="admin-stat-label">Gespräche gesamt</div>
          </div>
        </div>
      </div>

      <div className="admin-toolbar" style={{ marginTop: 24 }}>
        <Link href="/advisor/leads" className="admin-action-btn">Alle Leads</Link>
        <Link href="/advisor/quick-lead" className="admin-action-btn">Quick-Leads</Link>
      </div>

      {/* Aktive Messen */}
      <div className="admin-hub-section">
        <div className="admin-hub-secthead">
          <h3>{isAdmin ? 'Alle Messen' : 'Meine Messen'} · {activeFairs.length}</h3>
        </div>
      </div>

      {activeFairs.length === 0 ? (
        <div style={{
          background: '#fff',
          borderRadius: 16,
          padding: 40,
          textAlign: 'center',
          border: '1px solid #E8E6E1',
          marginBottom: 32,
        }}>
          <p style={{ color: '#86868b' }}>Keine bevorstehenden Messen zugewiesen.</p>
        </div>
      ) : (
        <div style={{ display: 'grid', gap: 12, gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', marginBottom: 40 }}>
          {activeFairs.map(fair => (
            <Link
              key={fair.id}
              href={`/advisor/fair/${fair.id}`}
              style={{ textDecoration: 'none', color: 'inherit' }}
            >
              <div style={{
                background: '#fff',
                borderRadius: 16,
                padding: 20,
                border: '1px solid #E8E6E1',
                cursor: 'pointer',
                transition: 'box-shadow 0.2s, transform 0.2s',
              }}
              className="fair-card"
              >
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 }}>
                  <h3 style={{ fontSize: 16, fontWeight: 600, margin: 0, color: '#1A1A1A' }}>{fair.name}</h3>
                  <span style={{
                    fontSize: 11,
                    fontWeight: 600,
                    padding: '3px 10px',
                    borderRadius: 980,
                    background: fair.status === 'active' ? '#D1FAE5' : '#FFF3E0',
                    color: fair.status === 'active' ? '#059669' : '#D97706',
                    whiteSpace: 'nowrap',
                  }}>
                    {fair.status === 'active' ? 'Aktiv' : 'Bevorstehend'}
                  </span>
                </div>
                {fair.city && (
                  <p style={{ color: '#86868b', fontSize: 13, margin: '2px 0' }}>{fair.city}</p>
                )}
                <p style={{ color: '#86868b', fontSize: 13, margin: '2px 0 12px' }}>
                  {formatDate(fair.start_date)}
                  {fair.end_date && fair.end_date !== fair.start_date ? ` – ${formatDate(fair.end_date)}` : ''}
                </p>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <span style={{ fontSize: 13, color: '#86868b' }}>
                    <strong style={{ color: '#1A1A1A', fontSize: 18 }}>{countByFair[fair.id] || 0}</strong> Gespräche
                  </span>
                  <span style={{ fontSize: 13, color: '#CC1426', fontWeight: 600 }}>
                    Öffnen →
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* Vergangene Messen */}
      {pastFairs.length > 0 && (
        <>
          <h2 style={{ fontSize: 17, fontWeight: 600, color: '#1A1A1A', marginBottom: 16 }}>
            Abgeschlossene Messen
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {pastFairs.map(fair => (
              <div key={fair.id} style={{
                background: '#fff',
                borderRadius: 12,
                padding: '14px 20px',
                border: '1px solid #E8E6E1',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
              }}>
                <div>
                  <span style={{ fontWeight: 600, fontSize: 14, color: '#1A1A1A' }}>{fair.name}</span>
                  <span style={{ color: '#86868b', fontSize: 13, marginLeft: 12 }}>{formatDate(fair.start_date)}</span>
                </div>
                <span style={{ fontSize: 13, color: '#86868b' }}>
                  {countByFair[fair.id] || 0} Gespräche
                </span>
              </div>
            ))}
          </div>
        </>
      )}

      <style>{`
        .fair-card:hover {
          box-shadow: 0 4px 16px rgba(0,0,0,0.08) !important;
          transform: translateY(-1px);
        }
      `}</style>
    </div>
  );
  } catch (err) {
    // Allow Next.js redirects to propagate normally
    if (err?.digest?.startsWith?.('NEXT_REDIRECT') || err?.message?.includes?.('NEXT_REDIRECT')) throw err;
    // Render the actual error so we can see it in production
    return (
      <div style={{ padding: 40, background: '#FEF2F2', borderRadius: 16, border: '1px solid #FECACA', maxWidth: 700, margin: '40px auto' }}>
        <h2 style={{ color: '#DC2626', marginBottom: 16 }}>Dashboard-Fehler (Debug)</h2>
        <p style={{ fontWeight: 600, marginBottom: 8 }}>{err?.message || 'Kein Fehlertext'}</p>
        <pre style={{ fontSize: 12, whiteSpace: 'pre-wrap', color: '#6B7280', background: '#FFF', padding: 16, borderRadius: 8 }}>
          {err?.stack?.slice(0, 1000) || 'Kein Stack'}
        </pre>
      </div>
    );
  }
}
