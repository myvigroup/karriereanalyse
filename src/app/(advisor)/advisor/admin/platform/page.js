import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';
import { redirect } from 'next/navigation';
import Link from 'next/link';
import AutoRefresh from './AutoRefresh';

export const revalidate = 30;

const fmt = (n) => (n || 0).toLocaleString('de-DE');
const fmtEur = (cents) => `${((cents || 0) / 100).toLocaleString('de-DE', { minimumFractionDigits: 2 })} €`;
function ago(d) {
  if (!d) return '–';
  const m = Math.floor((Date.now() - new Date(d)) / 60000);
  if (m < 1) return 'Gerade eben';
  if (m < 60) return `vor ${m} Min.`;
  const h = Math.floor(m / 60);
  if (h < 24) return `vor ${h} Std.`;
  return `vor ${Math.floor(h / 24)} Tagen`;
}
function shortDate(d) {
  if (!d) return '–';
  return new Date(d).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit', hour: '2-digit', minute: '2-digit' });
}

export default async function PlatformDashboard() {
  const supabase = createClient();
  const admin = createAdminClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect('/auth/login');
  const { data: myProfile } = await admin.from('profiles').select('role').eq('id', user.id).maybeSingle();
  if (!['admin', 'messeleiter'].includes(myProfile?.role)) redirect('/advisor');

  const now = new Date();
  const todayStart = `${now.toISOString().split('T')[0]}T00:00:00`;
  const weekAgo = new Date(now - 7 * 86400000).toISOString();
  const monthAgo = new Date(now - 30 * 86400000).toISOString();

  // ── Alle Daten parallel laden ─────────────────────────────────────────────
  const [
    { data: allUsers },
    { data: newUsersToday },
    { data: newUsersWeek },
    { data: cvDocsAll },
    { data: cvToday },
    { data: analysisAll },
    { data: analysisToday },
    { data: transactions },
    { data: transactionsToday },
    { data: lessonProgress },
    { data: analyticsEvents },
    { data: selfChecks },
    { data: fairs },
    { data: fairLeads },
    { data: recentLessons },
    { data: recentCv },
    { data: recentAnalysis },
    { data: recentTransactions },
    { data: advisors },
    { data: allFairLeads },
  ] = await Promise.all([
    admin.from('profiles').select('id,email,name,first_name,last_name,created_at,onboarding_complete,subscription_plan,purchased_products,role,phase').eq('role', 'user').order('created_at', { ascending: false }),
    admin.from('profiles').select('id').eq('role', 'user').gte('created_at', todayStart),
    admin.from('profiles').select('id').eq('role', 'user').gte('created_at', weekAgo),
    admin.from('cv_documents').select('id,user_id,created_at').eq('is_current', true),
    admin.from('cv_documents').select('id').eq('is_current', true).gte('created_at', todayStart),
    admin.from('analysis_sessions').select('id,user_id,completed_at').not('completed_at', 'is', null),
    admin.from('analysis_sessions').select('id').not('completed_at', 'is', null).gte('completed_at', todayStart),
    admin.from('transactions').select('id,user_id,amount,product_key,status,created_at').eq('status', 'completed').order('created_at', { ascending: false }),
    admin.from('transactions').select('id,amount').eq('status', 'completed').gte('created_at', todayStart),
    admin.from('lesson_progress').select('user_id,lesson_id,completed_at').eq('completed', true).order('completed_at', { ascending: false }).limit(1000),
    admin.from('analytics_events').select('user_id,event_name,created_at,metadata').order('created_at', { ascending: false }).limit(500),
    admin.from('self_service_checks').select('id,name,email,created_at,overall_rating,fair_id').eq('status', 'completed').order('created_at', { ascending: false }),
    admin.from('fairs').select('id,name,status,start_date').order('start_date', { ascending: false }).limit(10),
    admin.from('fair_leads').select('id,fair_id,status,created_at').order('created_at', { ascending: false }),
    admin.from('lesson_progress').select('user_id,lesson_id,completed_at').eq('completed', true).order('completed_at', { ascending: false }).limit(40),
    admin.from('cv_documents').select('user_id,created_at').eq('is_current', true).order('created_at', { ascending: false }).limit(20),
    admin.from('advisors').select('user_id,display_name,email'),
    admin.from('fair_leads').select('id,advisor_user_id,status,created_at,updated_at').order('created_at', { ascending: false }),
    admin.from('analysis_sessions').select('user_id,completed_at').not('completed_at', 'is', null).order('completed_at', { ascending: false }).limit(20),
    admin.from('transactions').select('user_id,amount,product_key,created_at').eq('status', 'completed').order('created_at', { ascending: false }).limit(20),
  ]);

  // Lessons laden
  const lessonIds = [...new Set((recentLessons || []).map(l => l.lesson_id))];
  const { data: lessons } = lessonIds.length > 0
    ? await admin.from('lessons').select('id,title,modules(courses(title))').in('id', lessonIds)
    : { data: [] };
  const lessonMap = (lessons || []).reduce((acc, l) => {
    acc[l.id] = { title: l.title, course: l.modules?.courses?.title };
    return acc;
  }, {});

  // Login-Events aus analytics_events
  const loginEvents = (analyticsEvents || []).filter(e => e.event_name === 'login');
  const loginsToday = loginEvents.filter(e => e.created_at >= todayStart).length;
  const uniqueLoginsToday = new Set(loginEvents.filter(e => e.created_at >= todayStart).map(e => e.user_id)).size;

  // User-Index
  const userMap = (allUsers || []).reduce((acc, u) => { acc[u.id] = u; return acc; }, {});
  const cvByUser = (cvDocsAll || []).reduce((acc, d) => { acc[d.user_id] = d.created_at; return acc; }, {});
  const analysisByUser = (analysisAll || []).reduce((acc, a) => { acc[a.user_id] = a.completed_at; return acc; }, {});
  const lessonCountByUser = (lessonProgress || []).reduce((acc, l) => { acc[l.user_id] = (acc[l.user_id] || 0) + 1; return acc; }, {});
  const lastLessonByUser = (lessonProgress || []).reduce((acc, l) => {
    if (!acc[l.user_id] || new Date(l.completed_at) > new Date(acc[l.user_id])) acc[l.user_id] = l.completed_at;
    return acc;
  }, {});
  const purchaseByUser = (transactions || []).reduce((acc, t) => {
    if (!acc[t.user_id]) acc[t.user_id] = [];
    acc[t.user_id].push(t.product_key);
    return acc;
  }, {});

  // ── Berater-Rangliste ────────────────────────────────────────────────────
  const liveThreshold = new Date(now - 30 * 60000).toISOString(); // aktiv = Lead in letzten 30 Min
  const advisorStats = (advisors || []).map(adv => {
    const myLeads = (allFairLeads || []).filter(l => l.advisor_user_id === adv.user_id);
    const today = myLeads.filter(l => l.created_at >= todayStart);
    const lastLead = myLeads[0]?.created_at || null;
    const isLive = lastLead && lastLead >= liveThreshold;
    const completed = myLeads.filter(l => ['completed','contacted','converted'].includes(l.status)).length;
    return {
      ...adv,
      total: myLeads.length,
      today: today.length,
      completed,
      lastLead,
      isLive,
    };
  }).sort((a, b) => b.today - a.today || b.total - a.total);

  const liveCount = advisorStats.filter(a => a.isLive).length;

  // Revenue
  const revenueTotal = (transactions || []).reduce((s, t) => s + (t.amount || 0), 0);
  const revenueToday = (transactionsToday || []).reduce((s, t) => s + (t.amount || 0), 0);
  const revenueMonth = (transactions || []).filter(t => t.created_at >= monthAgo).reduce((s, t) => s + (t.amount || 0), 0);

  // Messen
  const leadsByFair = (fairLeads || []).reduce((acc, l) => {
    if (!acc[l.fair_id]) acc[l.fair_id] = { total: 0, today: 0 };
    acc[l.fair_id].total++;
    if (l.created_at >= todayStart) acc[l.fair_id].today++;
    return acc;
  }, {});
  const selfChecksByFair = (selfChecks || []).reduce((acc, s) => {
    if (s.fair_id) acc[s.fair_id] = (acc[s.fair_id] || 0) + 1;
    return acc;
  }, {});

  // Activity Feed
  const PRODUCT_LABELS = {
    MASTERCLASS: 'Premium-Mitgliedschaft',
    MASTERCLASS_SINGLE: 'Gehalts-Masterclass (Einzel)',
    SEMINAR: 'Seminar-Ticket',
  };
  const feed = [
    ...(recentCv || []).map(e => ({ type: 'cv', time: e.created_at, icon: '📄', color: '#1D4ED8', text: `${userMap[e.user_id]?.name || userMap[e.user_id]?.email || '–'} hat Lebenslauf hochgeladen` })),
    ...(recentAnalysis || []).map(e => ({ type: 'analysis', time: e.completed_at, icon: '◎', color: '#059669', text: `${userMap[e.user_id]?.name || userMap[e.user_id]?.email || '–'} hat Karriere-Analyse abgeschlossen` })),
    ...(recentLessons || []).map(e => ({ type: 'lesson', time: e.completed_at, icon: '▶', color: '#7C3AED', text: `${userMap[e.user_id]?.name || userMap[e.user_id]?.email || '–'}: „${lessonMap[e.lesson_id]?.title || 'Lektion'}"${lessonMap[e.lesson_id]?.course ? ` · ${lessonMap[e.lesson_id].course}` : ''}` })),
    ...(recentTransactions || []).map(e => ({ type: 'purchase', time: e.created_at, icon: '💳', color: '#CC1426', text: `${userMap[e.user_id]?.name || userMap[e.user_id]?.email || '–'} hat gekauft: ${PRODUCT_LABELS[e.product_key] || e.product_key} · ${fmtEur(e.amount)}` })),
    ...((selfChecks || []).slice(0, 10).map(e => ({ type: 'qr', time: e.created_at, icon: '📱', color: '#D97706', text: `${e.name || 'Anonym'} · QR-Selbst-Check` }))),
    ...(loginEvents.slice(0, 20).map(e => ({ type: 'login', time: e.created_at, icon: '🔑', color: '#6B7280', text: `${userMap[e.user_id]?.name || userMap[e.user_id]?.email || '–'} hat sich eingeloggt` }))),
  ].sort((a, b) => new Date(b.time) - new Date(a.time)).slice(0, 60);

  // KPIs
  const totalUsers = (allUsers || []).length;
  const premiumUsers = (allUsers || []).filter(u => u.subscription_plan && u.subscription_plan !== 'FREE').length;
  const onboardingDone = (allUsers || []).filter(u => u.onboarding_complete).length;

  const kpis = [
    { label: 'Nutzer gesamt', value: fmt(totalUsers), sub: `+${fmt((newUsersWeek || []).length)} diese Woche`, color: '#CC1426' },
    { label: 'Neu heute', value: fmt((newUsersToday || []).length), sub: 'Registrierungen', color: '#D97706' },
    { label: 'Logins heute', value: fmt(uniqueLoginsToday), sub: `${fmt(loginsToday)} Sessions`, color: '#0891B2' },
    { label: 'CV-Checks', value: fmt((cvDocsAll || []).length), sub: `+${fmt((cvToday || []).length)} heute`, color: '#1D4ED8' },
    { label: 'Analysen', value: fmt((analysisAll || []).length), sub: `+${fmt((analysisToday || []).length)} heute`, color: '#059669' },
    { label: 'Premium-User', value: fmt(premiumUsers), sub: `von ${fmt(totalUsers)} gesamt`, color: '#7C3AED' },
    { label: 'Umsatz heute', value: fmtEur(revenueToday), sub: `${fmtEur(revenueMonth)} diesen Monat`, color: '#CC1426' },
    { label: 'Umsatz gesamt', value: fmtEur(revenueTotal), sub: `${fmt((transactions || []).length)} Transaktionen`, color: '#D97706' },
  ];

  return (
    <div style={{ maxWidth: 1400, margin: '0 auto' }}>
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <div style={{ display: 'flex', gap: 8, marginBottom: 8 }}>
            <Link href="/advisor/admin" style={{ fontSize: 13, color: '#86868b', textDecoration: 'none' }}>Admin</Link>
            <span style={{ color: '#86868b' }}>›</span>
            <span style={{ fontSize: 13, fontWeight: 600 }}>Plattform-Cockpit</span>
          </div>
          <h1 style={{ fontSize: 26, fontWeight: 700, margin: 0 }}>Plattform-Cockpit</h1>
          <p style={{ color: '#86868b', marginTop: 4, fontSize: 13 }}>
            Aktualisiert automatisch · {new Date().toLocaleString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })} Uhr
          </p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <AutoRefresh intervalSeconds={30} />
          <Link href="/advisor/admin" style={{ fontSize: 13, padding: '8px 16px', border: '1px solid #E8E6E1', borderRadius: 980, textDecoration: 'none', color: '#1A1A1A' }}>
            ← Zurück
          </Link>
        </div>
      </div>

      {/* KPI Grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12, marginBottom: 28 }}>
        {kpis.map((k, i) => (
          <div key={i} style={{ background: '#fff', borderRadius: 14, padding: '18px 20px', border: '1px solid #E8E6E1' }}>
            <div style={{ fontSize: 30, fontWeight: 800, color: k.color, lineHeight: 1, letterSpacing: '-0.03em' }}>{k.value}</div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#1A1A1A', marginTop: 6 }}>{k.label}</div>
            <div style={{ fontSize: 11, color: '#86868b', marginTop: 2 }}>{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Berater-Rangliste */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden', marginBottom: 24 }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0EEE9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAF8' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Berater-Rangliste</h2>
            {liveCount > 0 && (
              <div style={{ display: 'flex', alignItems: 'center', gap: 5, background: '#D1FAE5', borderRadius: 980, padding: '3px 10px' }}>
                <span style={{ width: 7, height: 7, borderRadius: '50%', background: '#059669', display: 'inline-block', animation: 'pulse 1.5s infinite' }} />
                <span style={{ fontSize: 11, fontWeight: 700, color: '#059669' }}>{liveCount} LIVE</span>
              </div>
            )}
          </div>
          <span style={{ fontSize: 12, color: '#86868b' }}>Live = Lead in letzten 30 Min.</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: 0 }}>
          {advisorStats.length === 0 ? (
            <div style={{ padding: 32, textAlign: 'center', color: '#86868b', fontSize: 13, gridColumn: '1 / -1' }}>Keine Berater</div>
          ) : advisorStats.map((adv, i) => (
            <div key={adv.user_id} style={{
              padding: '14px 20px',
              borderRight: '1px solid #F0EEE9',
              borderBottom: '1px solid #F0EEE9',
              background: adv.isLive ? 'rgba(5,150,105,0.03)' : 'transparent',
              position: 'relative',
            }}>
              {/* Rang */}
              <div style={{ position: 'absolute', top: 10, right: 12, fontSize: 18, fontWeight: 900, color: i === 0 ? '#F59E0B' : i === 1 ? '#9CA3AF' : i === 2 ? '#CD7F32' : '#E5E7EB' }}>
                #{i + 1}
              </div>

              {/* Live-Indikator */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 6 }}>
                <div style={{ width: 8, height: 8, borderRadius: '50%', background: adv.isLive ? '#059669' : '#D1D5DB', flexShrink: 0 }} />
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{adv.display_name}</div>
              </div>

              <div style={{ fontSize: 11, color: '#86868b', marginBottom: 10 }}>
                {adv.isLive ? <span style={{ color: '#059669', fontWeight: 600 }}>🟢 Gerade aktiv</span> : adv.lastLead ? `Zuletzt: ${ago(adv.lastLead)}` : 'Noch keine Aktivität'}
              </div>

              {/* Stats */}
              <div style={{ display: 'flex', gap: 16 }}>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: adv.today > 0 ? '#CC1426' : '#D1D5DB', lineHeight: 1 }}>{adv.today}</div>
                  <div style={{ fontSize: 10, color: '#86868b', marginTop: 2 }}>Heute</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', lineHeight: 1 }}>{adv.total}</div>
                  <div style={{ fontSize: 10, color: '#86868b', marginTop: 2 }}>Gesamt</div>
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: adv.completed > 0 ? '#059669' : '#D1D5DB', lineHeight: 1 }}>{adv.completed}</div>
                  <div style={{ fontSize: 10, color: '#86868b', marginTop: 2 }}>Abgeschl.</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Activity Feed + Messen */}
      <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: 16, marginBottom: 24 }}>

        {/* Activity Feed */}
        <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden' }}>
          <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0EEE9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAF8' }}>
            <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Live-Aktivitäten</h2>
            <div style={{ display: 'flex', gap: 8, fontSize: 11, color: '#86868b' }}>
              <span>🔑 Login</span><span>▶ Video</span><span>📄 CV</span><span>◎ Analyse</span><span>💳 Kauf</span>
            </div>
          </div>
          <div style={{ maxHeight: 520, overflowY: 'auto' }}>
            {feed.length === 0 ? (
              <div style={{ padding: 40, textAlign: 'center', color: '#86868b', fontSize: 13 }}>Noch keine Aktivitäten</div>
            ) : feed.map((e, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, padding: '10px 20px', borderBottom: '1px solid #F8F7F5' }}>
                <div style={{ width: 28, height: 28, borderRadius: '50%', flexShrink: 0, background: `${e.color}15`, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12 }}>
                  {e.icon}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 12, color: '#1A1A1A', lineHeight: 1.4, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{e.text}</div>
                  <div style={{ fontSize: 10, color: '#86868b', marginTop: 1 }}>{ago(e.time)}</div>
                </div>
                {e.type === 'purchase' && <span style={{ fontSize: 10, fontWeight: 700, color: '#CC1426', flexShrink: 0 }}>KAUF</span>}
              </div>
            ))}
          </div>
        </div>

        {/* Rechte Spalte: Messen + Transaktionen */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>

          {/* Messen */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0EEE9', background: '#FAFAF8' }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Messen heute</h2>
            </div>
            {(fairs || []).slice(0, 5).map((f, i) => {
              const fl = leadsByFair[f.id] || { total: 0, today: 0 };
              const sc = selfChecksByFair[f.id] || 0;
              const isActive = f.status === 'active';
              return (
                <div key={f.id} style={{ padding: '12px 20px', borderBottom: i < 4 ? '1px solid #F8F7F5' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                      {isActive && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#059669', display: 'inline-block', flexShrink: 0 }} />}
                      <div style={{ fontSize: 13, fontWeight: 600 }}>{f.name}</div>
                    </div>
                    <div style={{ fontSize: 11, color: '#86868b', marginTop: 2 }}>
                      {f.start_date ? new Date(f.start_date).toLocaleDateString('de-DE') : '–'}
                    </div>
                  </div>
                  <div style={{ display: 'flex', gap: 12, textAlign: 'right' }}>
                    <div><div style={{ fontSize: 16, fontWeight: 800, color: '#CC1426' }}>{fl.total}</div><div style={{ fontSize: 10, color: '#86868b' }}>Leads</div></div>
                    {fl.today > 0 && <div><div style={{ fontSize: 16, fontWeight: 800, color: '#D97706' }}>+{fl.today}</div><div style={{ fontSize: 10, color: '#86868b' }}>heute</div></div>}
                    {sc > 0 && <div><div style={{ fontSize: 16, fontWeight: 800, color: '#0891B2' }}>{sc}</div><div style={{ fontSize: 10, color: '#86868b' }}>QR</div></div>}
                  </div>
                </div>
              );
            })}
          </div>

          {/* Letzte Käufe */}
          <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0EEE9', background: '#FAFAF8' }}>
              <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Letzte Käufe</h2>
            </div>
            {(recentTransactions || []).length === 0 ? (
              <div style={{ padding: 24, textAlign: 'center', color: '#86868b', fontSize: 12 }}>Noch keine Transaktionen</div>
            ) : (recentTransactions || []).slice(0, 8).map((t, i) => (
              <div key={i} style={{ padding: '10px 20px', borderBottom: i < 7 ? '1px solid #F8F7F5' : 'none', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600 }}>{userMap[t.user_id]?.name || userMap[t.user_id]?.email || '–'}</div>
                  <div style={{ fontSize: 11, color: '#86868b' }}>{PRODUCT_LABELS[t.product_key] || t.product_key}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#CC1426' }}>{fmtEur(t.amount)}</div>
                  <div style={{ fontSize: 10, color: '#86868b' }}>{ago(t.created_at)}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* User-Tabelle */}
      <div style={{ background: '#fff', borderRadius: 16, border: '1px solid #E8E6E1', overflow: 'hidden' }}>
        <div style={{ padding: '14px 20px', borderBottom: '1px solid #F0EEE9', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: '#FAFAF8' }}>
          <h2 style={{ fontSize: 14, fontWeight: 700, margin: 0 }}>Alle Nutzer ({fmt(totalUsers)})</h2>
          <div style={{ fontSize: 12, color: '#86868b' }}>
            {fmt(onboardingDone)} Onboarding · {fmt(premiumUsers)} Premium · {fmt((cvDocsAll || []).length)} CV-Checks · {fmt((analysisAll || []).length)} Analysen
          </div>
        </div>

        {/* Table header */}
        <div style={{ display: 'grid', gridTemplateColumns: '2.5fr 1.2fr 70px 70px 90px 100px 120px 110px', padding: '9px 20px', background: '#F8F7F5', borderBottom: '1px solid #F0EEE9' }}>
          {['Name / E-Mail', 'Registriert', 'CV', 'Analyse', 'Videos', 'Plan', 'Letzte Aktivität', 'Status'].map((h, i) => (
            <div key={i} style={{ fontSize: 10, fontWeight: 700, color: '#86868b', textTransform: 'uppercase', letterSpacing: '0.5px' }}>{h}</div>
          ))}
        </div>

        <div style={{ maxHeight: 700, overflowY: 'auto' }}>
          {(allUsers || []).slice(0, 300).map((u, i) => {
            const hasCv = !!cvByUser[u.id];
            const hasAnalysis = !!analysisByUser[u.id];
            const lessons = lessonCountByUser[u.id] || 0;
            const purchases = purchaseByUser[u.id] || [];
            const lastActivity = lastLessonByUser[u.id] || cvByUser[u.id] || analysisByUser[u.id] || u.created_at;
            const isPremium = u.subscription_plan && u.subscription_plan !== 'FREE';
            const isNew = new Date(u.created_at) > new Date(Date.now() - 24 * 3600000);

            return (
              <div key={u.id} style={{
                display: 'grid', gridTemplateColumns: '2.5fr 1.2fr 70px 70px 90px 100px 120px 110px',
                padding: '11px 20px', alignItems: 'center',
                borderBottom: '1px solid #F8F7F5',
                background: isNew ? 'rgba(204,20,38,0.02)' : 'transparent',
              }}>
                <div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
                    {isNew && <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#CC1426', flexShrink: 0 }} />}
                    <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                      {u.name || `${u.first_name || ''} ${u.last_name || ''}`.trim() || '–'}
                    </div>
                  </div>
                  <div style={{ fontSize: 11, color: '#86868b', marginTop: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{u.email}</div>
                </div>
                <div style={{ fontSize: 11, color: '#6B7280' }}>
                  {new Date(u.created_at).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: '2-digit' })}
                </div>
                <div style={{ fontSize: 13 }}>{hasCv ? '✅' : <span style={{ color: '#D1D5DB' }}>–</span>}</div>
                <div style={{ fontSize: 13 }}>{hasAnalysis ? '✅' : <span style={{ color: '#D1D5DB' }}>–</span>}</div>
                <div style={{ fontSize: 12, fontWeight: lessons > 0 ? 700 : 400, color: lessons > 0 ? '#7C3AED' : '#D1D5DB' }}>
                  {lessons > 0 ? `${lessons} ✓` : '0'}
                </div>
                <div>
                  {isPremium ? (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 980, background: '#F3E8FF', color: '#7C3AED' }}>PREMIUM</span>
                  ) : purchases.length > 0 ? (
                    <span style={{ fontSize: 10, fontWeight: 700, padding: '2px 7px', borderRadius: 980, background: '#FEF3C7', color: '#D97706' }}>KÄUFER</span>
                  ) : (
                    <span style={{ fontSize: 10, color: '#D1D5DB' }}>FREE</span>
                  )}
                </div>
                <div style={{ fontSize: 11, color: '#86868b' }}>{ago(lastActivity)}</div>
                <div>
                  <span style={{ fontSize: 10, fontWeight: 600, padding: '2px 7px', borderRadius: 980, background: u.onboarding_complete ? '#D1FAE5' : '#FEF3C7', color: u.onboarding_complete ? '#059669' : '#D97706' }}>
                    {u.onboarding_complete ? 'Aktiv' : 'Onboarding'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <style>{`
        ::-webkit-scrollbar { width: 6px; height: 6px; }
        ::-webkit-scrollbar-track { background: transparent; }
        ::-webkit-scrollbar-thumb { background: #D1D5DB; border-radius: 3px; }
        @keyframes pulse { 0%,100%{opacity:1} 50%{opacity:0.4} }
      `}</style>
    </div>
  );
}

const PRODUCT_LABELS = {
  MASTERCLASS: 'Premium-Mitgliedschaft',
  MASTERCLASS_SINGLE: 'Gehalts-Masterclass (Einzel)',
  SEMINAR: 'Seminar-Ticket',
};
