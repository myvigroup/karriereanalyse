import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';

export const revalidate = 60; // Alle 60s neu laden

function fmt(n) { return (n || 0).toLocaleString('de-DE'); }
function fmtDate(d) {
  if (!d) return '–';
  return new Date(d).toLocaleString('de-DE', { day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit' });
}
function ago(d) {
  if (!d) return '–';
  const diff = Date.now() - new Date(d).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Gerade eben';
  if (m < 60) return `vor ${m} Min.`;
  const h = Math.floor(m / 60);
  if (h < 24) return `vor ${h} Std.`;
  return `vor ${Math.floor(h / 24)} Tagen`;
}

export default async function PlatformDashboard() {
  const supabase = createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: profile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (!['admin', 'messeleiter'].includes(profile?.role)) redirect('/advisor');

  const now = new Date();
  const today = now.toISOString().split('T')[0];
  const week = new Date(now - 7 * 86400000).toISOString();
  const month = new Date(now - 30 * 86400000).toISOString();

  // ── Alle Queries parallel ─────────────────────────────────────────────────
  const [
    { data: allUsers },
    { data: newToday },
    { data: newWeek },
    { data: cvDocsAll },
    { data: cvDocsToday },
    { data: analysisAll },
    { data: analysisToday },
    { data: lessonProgress },
    { data: selfChecks },
    { data: recentCv },
    { data: recentAnalysis },
    { data: recentLessons },
    { data: fairs },
    { data: fairLeads },
  ] = await Promise.all([
    admin.from('profiles').select('id, email, name, first_name, last_name, created_at, phase, onboarding_complete, role').eq('role', 'user').order('created_at', { ascending: false }),
    admin.from('profiles').select('id').eq('role', 'user').gte('created_at', `${today}T00:00:00`),
    admin.from('profiles').select('id').eq('role', 'user').gte('created_at', week),
    admin.from('cv_documents').select('id, user_id, created_at').eq('is_current', true),
    admin.from('cv_documents').select('id').eq('is_current', true).gte('created_at', `${today}T00:00:00`),
    admin.from('analysis_sessions').select('id, user_id, completed_at').not('completed_at', 'is', null),
    admin.from('analysis_sessions').select('id').not('completed_at', 'is', null).gte('completed_at', `${today}T00:00:00`),
    admin.from('lesson_progress').select('user_id, lesson_id, completed_at').eq('completed', true).order('completed_at', { ascending: false }).limit(500),
    admin.from('self_service_checks').select('id, name, email, created_at, overall_rating, fair_id').eq('status', 'completed').order('created_at', { ascending: false }),
    admin.from('cv_documents').select('user_id, created_at').eq('is_current', true).order('created_at', { ascending: false }).limit(20),
    admin.from('analysis_sessions').select('user_id, completed_at').not('completed_at', 'is', null).order('completed_at', { ascending: false }).limit(20),
    admin.from('lesson_progress').select('user_id, lesson_id, completed_at').eq('completed', true).order('completed_at', { ascending: false }).limit(30),
    admin.from('fairs').select('id, name, status, start_date').order('start_date', { ascending: false }).limit(10),
    admin.from('fair_leads').select('id, fair_id, status, created_at').order('created_at', { ascending: false }),
  ]);

  // ── Lessons laden für Activity Feed ──────────────────────────────────────
  const lessonIds = [...new Set((recentLessons || []).map(l => l.lesson_id))];
  const { data: lessons } = lessonIds.length > 0
    ? await admin.from('lessons').select('id, title').in('id', lessonIds)
    : { data: [] };
  const lessonMap = (lessons || []).reduce((acc, l) => { acc[l.id] = l.title; return acc; }, {});

  // ── User-Index ──────────────────────────────────────────────────────────
  const userMap = (allUsers || []).reduce((acc, u) => { acc[u.id] = u; return acc; }, {});
  const cvByUser = (cvDocsAll || []).reduce((acc, d) => { acc[d.user_id] = d.created_at; return acc; }, {});
  const analysisByUser = (analysisAll || []).reduce((acc, a) => { acc[a.user_id] = a.completed_at; return acc; }, {});
  const lessonCountByUser = (lessonProgress || []).reduce((acc, l) => { acc[l.user_id] = (acc[l.user_id] || 0) + 1; return acc; }, {});
  const lastLessonByUser = (lessonProgress || []).reduce((acc, l) => {
    if (!acc[l.user_id] || new Date(l.completed_at) > new Date(acc[l.user_id])) acc[l.user_id] = l.completed_at;
    return acc;
  }, {});

  // ── KPIs ─────────────────────────────────────────────────────────────────
  const totalUsers = (allUsers || []).length;
  const onboardingDone = (allUsers || []).filter(u => u.onboarding_complete).length;
  const onboardingRate = totalUsers > 0 ? Math.round((onboardingDone / totalUsers) * 100) : 0;

  // ── Activity Feed zusammenbauen ──────────────────────────────────────────
  const feed = [
    ...(recentCv || []).map(e => ({
      type: 'cv', time: e.created_at,
      text: `${userMap[e.user_id]?.name || e.user_id} hat CV hochgeladen`,
      color: '#1D4ED8', icon: '📄',
    })),
    ...(recentAnalysis || []).map(e => ({
      type: 'analysis', time: e.completed_at,
      text: `${userMap[e.user_id]?.name || e.user_id} hat Karriere-Analyse abgeschlossen`,
      color: '#059669', icon: '◎',
    })),
    ...(recentLessons || []).map(e => ({
      type: 'lesson', time: e.completed_at,
      text: `${userMap[e.user_id]?.name || e.user_id}: „${lessonMap[e.lesson_id] || 'Lektion'}"`,
      color: '#7C3AED', icon: '▶',
    })),
    ...((selfChecks || []).slice(0, 10).map(e => ({
      type: 'qr', time: e.created_at,
      text: `${e.name || 'Anonym'} hat QR-Selbst-Check gemacht`,
      color: '#D97706', icon: '📱',
    }))),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 40);

  // ── Per-Fair Stats ────────────────────────────────────────────────────────
  const leadsByFair = (fairLeads || []).reduce((acc, l) => {
    acc[l.fair_id] = (acc[l.fair_id] || { total: 0, today: 0 });
    acc[l.fair_id].total++;
    if (l.created_at?.startsWith(today)) acc[l.fair_id].today++;
    return acc;
  }, {});

  const selfChecksByFair = (selfChecks || []).reduce((acc, s) => {
    if (s.fair_id) acc[s.fair_id] = (acc[s.fair_id] || 0) + 1;
    return acc;
  }, {});

  const kpis = [
    { label: 'Nutzer gesamt', value: fmt(totalUsers), sub: `+${fmt((newWeek || []).length)} diese Woche`, color: '#CC1426' },
    { label: 'Neu heute', value: fmt((newToday || []).length), sub: 'Registrierungen', color: '#D97706' },
    { label: 'CV-Checks', value: fmt((cvDocsAll || []).length), sub: `+${fmt((cvDocsToday || []).length)} heute`, color: '#1D4ED8' },
    { label: 'Analysen', value: fmt((analysisAll || []).length), sub: `+${fmt((analysisToday || []).length)} heute`, color: '#059669' },
    { label: 'Onboarding-Rate', value: `${onboardingRate}%`, sub: `${fmt(onboardingDone)} von ${fmt(totalUsers)}`, color: '#7C3AED' },
    { label: 'QR-Selbst-Scans', value: fmt((selfChecks || []).length), sub: 'aller Zeiten', color: '#0891B2' },
  ];

  return (
    <div style={{ maxWidth: 1200, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <Link href="/advisor/admin" style={{ fontSize: 13, color: '#86868b', textDecoration: 'none' }}>Admin</Link>
            <span style={{ color: '#86868b' }}>›</span>
            <span style={{ fontSize: 13, color: '#1A1A1A', fontWeight: 600 }}>Plattform-Cockpit</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>Plattform-Cockpit</h1>
          <p style={{ color: '#86868b', marginTop: 4, marginBottom: 0, fontSize: 13 }}>
            Live-Übersicht · Aktualisiert automatisch alle 60 Sekunden
          </p>
        </div>
        <Link href="/advisor/admin" style={{
          fontSize: 13, padding: '8px 16px', border: '1px solid #E8E6E1',
          borderRadius: 980, textDecoration: 'none', color: '#1A1A1A',
        }}>
          ← Zurück
        </Link>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 12, marginBottom: 32 }}>
        {kpis.map((kpi, i) => (
          <div key={i} style={{
            background: '#fff', borderRadius: 16, padding: '20px 18px',
            border: '1px solid #E8E6E1',
          }}>
            <div style={{ fontSize: 32, fontWeight: 800, color: kpi.color, lineHeight: 1, letterSpacing: '-0.03em' }}>{kpi.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A', marginTop: 6 }}>{kpi.label}</div>
            <div style={{ fontSize: 11, color: '#86868b', marginTop: 2 }}>{kpi.sub}</div>
          </div>
        ))}
      </div>

      {/* 2-Column: Activity Feed + Messen */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 20, marginBottom: 32 }}>

        {/* Activity Feed */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0EEE9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>Live-Aktivitäten</h2>
            <span style={{ fontSize: 12, color: '#86868b' }}>{feed.length} Events</span>
          </div>
          <div style={{ maxHeight: 480, overflowY: 'auto' }}>
            {feed.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#86868b', fontSize: 13 }}>
                Noch keine Aktivitäten
              </div>
            ) : feed.map((e, i) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 12,
                padding: '12px 20px',
                borderBottom: i < feed.length - 1 ? '1px solid #F8F7F5' : 'none',
              }}>
                <div style={{
                  width: 32, height: 32, borderRadius: '50%', flexShrink: 0,
                  background: `${e.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 14,
                }}>
                  {e.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 13, color: '#1A1A1A', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                    {e.text}
                  </div>
                  <div style={{ fontSize: 11, color: '#86868b', marginTop: 2 }}>{ago(e.time)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Messen Übersicht */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden' }}>
          <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0EEE9' }}>
            <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>Messen-Übersicht</h2>
          </div>
          <div>
            {(fairs || []).length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#86868b', fontSize: 13 }}>Keine Messen</div>
            ) : (fairs || []).map((fair, i) => {
              const fl = leadsByFair[fair.id] || { total: 0, today: 0 };
              const sc = selfChecksByFair[fair.id] || 0;
              const isActive = fair.status === 'active';
              return (
                <div key={fair.id} style={{
                  padding: '14px 20px',
                  borderBottom: i < fairs.length - 1 ? '1px solid #F8F7F5' : 'none',
                  background: isActive ? 'rgba(5,150,105,0.03)' : 'transparent',
                }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: 8 }}>
                    <div>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                        {isActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', display: 'inline-block' }} />}
                        <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{fair.name}</div>
                      </div>
                      <div style={{ fontSize: 11, color: '#86868b' }}>
                        {fair.start_date ? new Date(fair.start_date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' }) : '–'}
                      </div>
                    </div>
                    <div style={{ display: 'flex', gap: 16, flexShrink: 0 }}>
                      <div style={{ textAlign: 'center' }}>
                        <div style={{ fontSize: 18, fontWeight: 800, color: '#CC1426', lineHeight: 1 }}>{fl.total}</div>
                        <div style={{ fontSize: 10, color: '#86868b', marginTop: 2 }}>Leads</div>
                      </div>
                      {fl.today > 0 && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: '#D97706', lineHeight: 1 }}>+{fl.today}</div>
                          <div style={{ fontSize: 10, color: '#86868b', marginTop: 2 }}>heute</div>
                        </div>
                      )}
                      {sc > 0 && (
                        <div style={{ textAlign: 'center' }}>
                          <div style={{ fontSize: 18, fontWeight: 800, color: '#0891B2', lineHeight: 1 }}>{sc}</div>
                          <div style={{ fontSize: 10, color: '#86868b', marginTop: 2 }}>QR-Scans</div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* User-Tabelle */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden', marginBottom: 32 }}>
        <div style={{ padding: '16px 20px', borderBottom: '1px solid #F0EEE9', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <h2 style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', margin: 0 }}>
            Alle Nutzer ({fmt(totalUsers)})
          </h2>
        </div>

        <div style={{
          display: 'grid',
          gridTemplateColumns: '2.5fr 1.5fr 80px 80px 100px 100px 120px',
          padding: '10px 20px',
          borderBottom: '1px solid #F0EEE9',
          background: '#FAFAF8',
        }}>
          {['Name / E-Mail', 'Registriert', 'CV', 'Analyse', 'Lektionen', 'Letzte Aktivität', 'Status'].map((h, i) => (
            <div key={i} style={{ fontSize: 10, fontWeight: 700, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
          ))}
        </div>

        <div style={{ maxHeight: 600, overflowY: 'auto' }}>
          {(allUsers || []).slice(0, 200).map((u, i) => {
            const hasCv = !!cvByUser[u.id];
            const hasAnalysis = !!analysisByUser[u.id];
            const lessons = lessonCountByUser[u.id] || 0;
            const lastActivity = lastLessonByUser[u.id] || cvByUser[u.id] || analysisByUser[u.id] || u.created_at;
            return (
              <div key={u.id} style={{
                display: 'grid',
                gridTemplateColumns: '2.5fr 1.5fr 80px 80px 100px 100px 120px',
                padding: '12px 20px',
                alignItems: 'center',
                borderBottom: i < (allUsers || []).length - 1 ? '1px solid #F8F7F5' : 'none',
                background: i % 2 === 0 ? '#fff' : '#FAFAF8',
              }}>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{u.name || `${u.first_name} ${u.last_name}`.trim() || '–'}</div>
                  <div style={{ fontSize: 11, color: '#86868b', marginTop: 1 }}>{u.email}</div>
                </div>
                <div style={{ fontSize: 12, color: '#6B7280' }}>
                  {new Date(u.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </div>
                <div style={{ fontSize: 14 }}>{hasCv ? '✅' : '–'}</div>
                <div style={{ fontSize: 14 }}>{hasAnalysis ? '✅' : '–'}</div>
                <div style={{ fontSize: 13, fontWeight: lessons > 0 ? 700 : 400, color: lessons > 0 ? '#7C3AED' : '#86868b' }}>
                  {lessons > 0 ? `${lessons} ✓` : '0'}
                </div>
                <div style={{ fontSize: 11, color: '#86868b' }}>{ago(lastActivity)}</div>
                <div>
                  <span style={{
                    fontSize: 11, fontWeight: 600, padding: '3px 8px', borderRadius: 980,
                    background: u.onboarding_complete ? '#D1FAE5' : '#FEF3C7',
                    color: u.onboarding_complete ? '#059669' : '#D97706',
                  }}>
                    {u.onboarding_complete ? 'Aktiv' : 'Onboarding'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
