'use client';
import { useState, useMemo } from 'react';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { getPersonalization, FIELD_TO_COURSE, berechnePersonalisierung } from '@/lib/personalization';

const QUOTES = [
  "Erfolg ist kein Zufall — er ist die Summe deiner täglichen Entscheidungen.",
  "Der beste Zeitpunkt zu starten war gestern. Der zweitbeste ist jetzt.",
  "Dein Netzwerk ist dein Nettowert.",
  "Verhandle nie aus einer Position der Angst — verhandle aus Klarheit.",
  "Karriere ist kein Sprint, sondern ein strategischer Marathon.",
  "Wer aufhört zu lernen, hört auf zu wachsen.",
  "Sichtbarkeit schlägt Kompetenz — aber nur kurzfristig.",
  "Ein guter Mentor spart dir 5 Jahre Umwege.",
  "Dein Gehalt ist das Ergebnis deiner letzten Verhandlung, nicht deiner Leistung.",
  "Feedback ist ein Geschenk — auch wenn es sich nicht so anfühlt.",
  "Wer seine Stärken kennt, muss seine Schwächen nicht fürchten.",
  "Leadership beginnt bei der Selbstführung.",
  "Die besten Karrierechancen kommen über Beziehungen, nicht über Stellenanzeigen.",
  "Mut zur Lücke: Du musst nicht 100% der Anforderungen erfüllen.",
  "Dein Personal Brand ist das, was andere über dich sagen, wenn du nicht im Raum bist.",
  "Wachstum passiert außerhalb der Komfortzone.",
  "Klarheit über deine Werte ist der Kompass für jede Karriereentscheidung.",
  "Investiere in dich selbst — es ist die beste Rendite.",
  "Jedes Nein bringt dich näher ans richtige Ja.",
  "Authentizität ist dein größter Karrierevorteil.",
  "Wer fragt, führt — auch in Gehaltsverhandlungen.",
  "Deine Expertise hat einen Marktwert. Kenne ihn.",
  "Resilienz ist keine Schwäche — sie ist dein Wettbewerbsvorteil.",
  "Ein strategischer Jobwechsel kann mehr bringen als 5 Jahre Beförderungswarten.",
  "Dokumentiere deine Erfolge — dein zukünftiges Ich wird es dir danken.",
  "Die Frage ist nicht ob du wechselst, sondern wann — und zu welchen Konditionen.",
  "Mach dich unverzichtbar, aber nicht unersetzbar.",
  "Jedes Gehaltsgespräch ist eine Verhandlung — bereite dich vor wie auf ein Interview.",
  "Dein LinkedIn-Profil arbeitet 24/7 für dich — oder gegen dich.",
  "Erfolg hinterlässt Spuren. Dokumentiere sie.",
];

export default function DashboardClient({ profile, analysisSession, analysisResults, progress, courses, documents, applications, marketValue }) {
  const [focusMode, setFocusMode] = useState(false);

  const completedLessons = (progress || []).filter(p => p.completed).length;
  const totalLessons = (courses || []).reduce((sum, c) => sum + (c.modules || []).reduce((s, m) => s + (m.lessons || []).length, 0), 0);
  const courseProgress = totalLessons > 0 ? Math.round((completedLessons / totalLessons) * 100) : 0;
  const docsTotal = (documents || []).filter(d => d.is_required).length;
  const docsAccepted = (documents || []).filter(d => d.status === 'accepted').length;
  const hasAnalysis = !!analysisSession;
  const overallScore = analysisSession?.overall_score || 0;
  const currentMarketValue = marketValue?.total_value || profile?.current_salary || 50000;
  const targetSalary = profile?.target_salary || 120000;
  const activeApps = (applications || []).filter(a => !['rejected', 'accepted'].includes(a.status)).length;

  // Streak calculation
  const streakDays = useMemo(() => {
    if (!profile?.last_active_at) return 0;
    const lastActive = new Date(profile.last_active_at);
    const now = new Date();
    const diffMs = now - lastActive;
    const diffDays = Math.floor(diffMs / 86400000);
    if (diffDays > 1) return 0;
    return profile.streak_days || 1;
  }, [profile]);

  // Daily quote
  const dailyQuote = useMemo(() => {
    const dayOfYear = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return QUOTES[dayOfYear % 30];
  }, []);

  // Daily progress (simulated based on today's activity)
  const dailyTasks = useMemo(() => {
    const tasks = [];
    if (!hasAnalysis) tasks.push({ label: 'Karriereanalyse starten', done: false });
    if (docsAccepted < docsTotal) tasks.push({ label: 'Dokument einreichen', done: false });
    if (completedLessons < totalLessons) tasks.push({ label: 'Lektion abschließen', done: false });
    if (activeApps === 0) tasks.push({ label: 'Bewerbung hinzufügen', done: false });
    tasks.push({ label: 'KI-Coach fragen', done: false });
    // Mark some as done based on existing progress
    if (hasAnalysis && tasks.length > 0) tasks[0] = { ...tasks[0], done: true };
    return tasks.slice(0, 5);
  }, [hasAnalysis, docsAccepted, docsTotal, completedLessons, totalLessons, activeApps]);

  const dailyDone = dailyTasks.filter(t => t.done).length;
  const dailyTotal = dailyTasks.length;

  // Focus mode: top 3 priorities
  const focusTasks = useMemo(() => {
    const tasks = [];
    // 1. Upcoming interviews
    const interviewApps = (applications || []).filter(a => a.status === 'interview' && a.interview_date);
    interviewApps.sort((a, b) => new Date(a.interview_date) - new Date(b.interview_date));
    if (interviewApps.length > 0) {
      const app = interviewApps[0];
      const daysUntil = Math.ceil((new Date(app.interview_date) - new Date()) / 86400000);
      tasks.push({ icon: '📅', title: `Interview bei ${app.company_name}`, sub: daysUntil > 0 ? `In ${daysUntil} Tagen` : 'Heute!', href: '/applications', urgency: 'red' });
    }
    // 2. Incomplete lessons
    if (completedLessons < totalLessons) {
      tasks.push({ icon: '▶', title: 'Nächste Lektion abschließen', sub: `${completedLessons}/${totalLessons} erledigt`, href: '/masterclass', urgency: 'gold' });
    }
    // 3. Missing documents
    if (docsAccepted < docsTotal) {
      tasks.push({ icon: '◈', title: 'Dokumente einreichen', sub: `${docsTotal - docsAccepted} fehlen noch`, href: '/pre-coaching', urgency: 'grey' });
    }
    // 4. Analysis not done
    if (!hasAnalysis) {
      tasks.push({ icon: '◎', title: 'Karriereanalyse starten', sub: '13 Felder in 10 Min.', href: '/analyse', urgency: 'red' });
    }
    // 5. Follow-ups
    const staleApps = (applications || []).filter(a => {
      if (a.status !== 'applied') return false;
      const daysSince = Math.floor((new Date() - new Date(a.updated_at || a.created_at)) / 86400000);
      return daysSince > 7;
    });
    if (staleApps.length > 0) {
      tasks.push({ icon: '✉', title: `Follow-up: ${staleApps[0].company_name}`, sub: 'Seit 7+ Tagen ohne Rückmeldung', href: '/applications', urgency: 'gold' });
    }
    return tasks.slice(0, 3);
  }, [applications, completedLessons, totalLessons, docsAccepted, docsTotal, hasAnalysis]);

  // Progress Ring SVG
  const ProgressRing = ({ done, total, size = 64 }) => {
    const r = (size - 8) / 2;
    const c = 2 * Math.PI * r;
    const pct = total > 0 ? done / total : 0;
    const offset = c - pct * c;
    return (
      <svg width={size} height={size} style={{ display: 'block' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--grey-5)" strokeWidth="5" />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ki-red)" strokeWidth="5"
          strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round"
          transform={`rotate(-90 ${size / 2} ${size / 2})`} style={{ transition: 'stroke-dashoffset 1s var(--ease-apple)' }} />
        <text x="50%" y="50%" textAnchor="middle" dominantBaseline="middle"
          style={{ fontSize: 14, fontWeight: 700, fill: 'var(--ki-text)', fontFamily: 'Instrument Sans' }}>
          {done}/{total}
        </text>
      </svg>
    );
  };

  const StatCard = ({ label, value, sub, accent, href }) => (
    <a href={href} className="card animate-in" style={{ textDecoration: 'none', color: 'inherit', cursor: 'pointer' }}>
      <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>{label}</div>
      <div style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.04em', color: accent || 'var(--ki-text)' }}>{value}</div>
      {sub && <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 4 }}>{sub}</div>}
    </a>
  );

  const ProgressCard = ({ label, current, total, unit, href, color }) => {
    const pct = total > 0 ? Math.round((current / total) * 100) : 0;
    return (
      <a href={href} className="card animate-in" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
          <div style={{ fontSize: 14, fontWeight: 600 }}>{label}</div>
          <span className={`pill pill-${pct === 100 ? 'green' : 'grey'}`}>{pct}%</span>
        </div>
        <div className="progress-bar">
          <div className="progress-bar-fill" style={{ width: `${pct}%`, background: color || 'var(--ki-red)' }} />
        </div>
        <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 8 }}>{current} / {total} {unit}</div>
      </a>
    );
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 32 }}>
        <div>
          <div style={{ fontSize: 14, color: 'var(--ki-text-tertiary)', marginBottom: 4 }}>
            Guten {new Date().getHours() < 12 ? 'Morgen' : new Date().getHours() < 18 ? 'Tag' : 'Abend'}, {profile?.first_name || profile?.name}
          </div>
          <h1 className="page-title">Dashboard<InfoTooltip moduleId="dashboard" profile={profile} /></h1>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
          {/* Streak */}
          {streakDays > 0 && (
            <div data-tour-streak="" style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 20 }}>🔥</div>
              <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-secondary)' }}>{streakDays} {streakDays === 1 ? 'Tag' : 'Tage'}</div>
            </div>
          )}
          {/* Daily Progress Ring */}
          <ProgressRing done={dailyDone} total={dailyTotal} />
          {/* Focus Toggle */}
          <button
            className={`btn ${focusMode ? 'btn-primary' : 'btn-secondary'}`}
            onClick={() => setFocusMode(!focusMode)}
            style={{ fontSize: 13, padding: '8px 16px' }}
          >
            {focusMode ? '◻ Alles zeigen' : '◎ Focus-Mode'}
          </button>
        </div>
      </div>

      {/* Daily Quote */}
      <div style={{ marginBottom: 24, padding: '12px 20px', background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)', fontSize: 14, color: 'var(--ki-text-secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--ki-red)' }}>
        „{dailyQuote}"
      </div>

      {/* === PERSONALIZED WELCOME (Fun-First) === */}
      {hasAnalysis && analysisResults.length > 0 && (() => {
        const pers = berechnePersonalisierung(analysisResults, profile?.phase);
        const topEmpf = pers.topEmpfehlung;
        const topStrong = pers.staerken[0];

        // Find the course for the top recommendation
        const topRecCourse = topEmpf
          ? (courses || []).find(c => c.id === topEmpf.kursId)
          : null;

        return (
          <div className="animate-in" style={{ marginBottom: 28 }}>
            {/* Stärken zuerst! (Fun-First) */}
            {topStrong && (
              <div className="card" style={{
                padding: '16px 20px', marginBottom: 12,
                borderLeft: '4px solid var(--ki-success)',
                background: 'linear-gradient(135deg, rgba(16,185,129,0.04) 0%, transparent 100%)',
              }}>
                <div style={{ fontSize: 15, fontWeight: 700 }}>
                  {topStrong.label}: {Math.round(topStrong.score)}% — das ist stark!
                </div>
                <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 2 }}>
                  Du hast hier echtes Talent. Jetzt holen wir deine anderen Felder auf das gleiche Level.
                </div>
              </div>
            )}

            {/* Top Empfehlung */}
            {topEmpf && (
              <div className="card" style={{
                padding: '20px 24px',
                borderLeft: `4px solid ${topEmpf.farbe || 'var(--ki-red)'}`,
                marginBottom: 12,
                background: 'linear-gradient(135deg, var(--ki-bg-alt) 0%, transparent 100%)',
              }}>
                <div style={{ fontSize: 11, fontWeight: 600, color: topEmpf.farbe || 'var(--ki-red)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
                  Deine #1 Empfehlung
                </div>
                <div style={{ fontSize: 17, fontWeight: 700, marginBottom: 4 }}>
                  {topEmpf.icon} {topEmpf.title}
                </div>
                <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>
                  {topEmpf.empfehlung}
                </div>
                {topEmpf.istSchwaeche && (
                  <div style={{ fontSize: 12, color: 'var(--ki-warning)', fontWeight: 600, marginBottom: 12 }}>
                    2x XP-Boost aktiv — du trainierst dein Wachstumsfeld!
                  </div>
                )}
                <a
                  href={topRecCourse ? `/masterclass/${topRecCourse.id}` : '/masterclass'}
                  className="btn btn-primary"
                  style={{ fontSize: 14, display: 'inline-block' }}
                >
                  Jetzt starten →
                </a>
              </div>
            )}

            {/* Quick Stats Row */}
            <div style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(140px, 1fr))',
              gap: 12,
            }}>
              <div className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
                <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', fontWeight: 500, marginBottom: 4 }}>Karriere-Score</div>
                <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ki-red)' }}>{pers.gesamtScore}%</div>
              </div>
              {pers.staerken.length > 0 && (
                <div className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', fontWeight: 500, marginBottom: 4 }}>Top-Stärke</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{pers.staerken[0].label}</div>
                  <div style={{ fontSize: 13, color: 'var(--ki-success)', fontWeight: 600 }}>{Math.round(pers.staerken[0].score)}%</div>
                </div>
              )}
              {pers.schwaechen.length > 0 && (
                <div className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', fontWeight: 500, marginBottom: 4 }}>Größtes Potenzial</div>
                  <div style={{ fontSize: 15, fontWeight: 700 }}>{pers.schwaechen[0].label}</div>
                  <div style={{ fontSize: 13, color: 'var(--ki-warning)', fontWeight: 600 }}>{Math.round(pers.schwaechen[0].score)}%</div>
                </div>
              )}
              {pers.marktwertPotenzial > 0 && (
                <div className="card" style={{ padding: '14px 16px', textAlign: 'center' }}>
                  <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', fontWeight: 500, marginBottom: 4 }}>Marktwert-Potenzial</div>
                  <div style={{ fontSize: 22, fontWeight: 700, color: 'var(--ki-warning)' }}>+{pers.marktwertPotenzial}%</div>
                </div>
              )}
            </div>

            {/* Empfohlene Kurse (nach Relevanz) */}
            {pers.empfohleneKurse.length > 1 && (
              <div style={{ display: 'grid', gap: 8, marginTop: 12 }}>
                {pers.empfohleneKurse.slice(1, 4).map((kurs) => (
                  <a key={kurs.kursId} href={`/masterclass/${kurs.kursId}`}
                     className="card" style={{
                       padding: '12px 16px', display: 'flex', alignItems: 'center', gap: 12,
                       borderLeft: `3px solid ${kurs.farbe}`, textDecoration: 'none', color: 'inherit',
                     }}>
                    <span style={{ fontSize: 20 }}>{kurs.icon}</span>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontWeight: 600, fontSize: 13 }}>{kurs.title}</div>
                      <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>{kurs.empfehlung}</div>
                    </div>
                    <div style={{
                      fontSize: 11, fontWeight: 700, padding: '3px 8px', borderRadius: 99,
                      background: kurs.istSchwaeche ? 'rgba(245,158,11,0.1)' : 'rgba(16,185,129,0.1)',
                      color: kurs.istSchwaeche ? '#F59E0B' : '#10B981',
                    }}>
                      {kurs.istSchwaeche ? 'Potenzial' : 'Solide'}
                    </div>
                  </a>
                ))}
              </div>
            )}
          </div>
        );
      })()}

      {/* === FOCUS MODE === */}
      {focusMode ? (
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 16 }}>Deine Top-Prioritäten</h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
            {focusTasks.length > 0 ? focusTasks.map((task, i) => (
              <a key={i} href={task.href} className="card animate-in" style={{
                textDecoration: 'none', color: 'inherit', padding: 20,
                borderLeft: `4px solid ${task.urgency === 'red' ? 'var(--ki-red)' : task.urgency === 'gold' ? 'var(--ki-warning)' : 'var(--grey-4)'}`,
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 16 }}>
                  <span style={{ fontSize: 28 }}>{task.icon}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 16, fontWeight: 600 }}>{task.title}</div>
                    <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 2 }}>{task.sub}</div>
                  </div>
                  <span style={{ color: 'var(--ki-red)', fontWeight: 600, fontSize: 18 }}>→</span>
                </div>
              </a>
            )) : (
              <div className="card" style={{ padding: 32, textAlign: 'center' }}>
                <div style={{ fontSize: 32, marginBottom: 8 }}>🎉</div>
                <div style={{ fontSize: 16, fontWeight: 600 }}>Alles erledigt!</div>
                <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginTop: 4 }}>Keine dringenden Aufgaben. Genieße den Moment.</div>
              </div>
            )}
          </div>
        </div>
      ) : (
        <>
          {/* Quick Stats */}
          <div className="grid-4" style={{ marginBottom: 32 }}>
            <StatCard label="Marktwert" value={`€${Math.round(currentMarketValue / 1000)}k`} sub={`Ziel: €${Math.round(targetSalary / 1000)}k`} accent="var(--ki-success)" href="/marktwert" />
            <StatCard label="Analyse" value={hasAnalysis ? `${Math.round(overallScore)}%` : '—'} sub={hasAnalysis ? 'Abgeschlossen' : 'Noch nicht gestartet'} accent="var(--ki-red)" href="/analyse" />
            <StatCard label="KI-Points" value={profile?.xp || 0} sub={`Level ${profile?.level || 0}`} href="/profile" />
            <StatCard label="Bewerbungen" value={activeApps} sub={`${(applications || []).length} gesamt`} href="/applications" />
          </div>

          {/* Progress Cards */}
          <div className="grid-3" style={{ marginBottom: 32 }}>
            <ProgressCard label="Masterclass" current={completedLessons} total={totalLessons} unit="Lektionen" href="/masterclass" />
            <ProgressCard label="Dokumenten-Safe" current={docsAccepted} total={docsTotal} unit="Dokumente" href="/pre-coaching" color="var(--ki-success)" />
            <ProgressCard label="Marktwert-Lücke" current={Math.round(currentMarketValue)} total={Math.round(targetSalary)} unit="€" href="/marktwert" color="var(--ki-warning)" />
          </div>

          {/* Two Column: Next Steps + Analysis */}
          <div className="grid-2" style={{ marginBottom: 32 }}>
            {/* Next Steps */}
            <div className="card animate-in">
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.02em' }}>Nächste Schritte</h3>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
                {!hasAnalysis && (
                  <a href="/analyse" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 'var(--r-md)', background: 'rgba(204,20,38,0.04)', textDecoration: 'none', color: 'inherit' }}>
                    <span style={{ fontSize: 20 }}>◎</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Karriereanalyse starten</div>
                      <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>13 Kompetenzfelder in 10 Minuten</div>
                    </div>
                    <span style={{ marginLeft: 'auto', color: 'var(--ki-red)', fontWeight: 600 }}>→</span>
                  </a>
                )}
                {docsAccepted < docsTotal && (
                  <a href="/pre-coaching" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 'var(--r-md)', background: 'var(--ki-bg-alt)', textDecoration: 'none', color: 'inherit' }}>
                    <span style={{ fontSize: 20 }}>◈</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Dokumente einreichen</div>
                      <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>Noch {docsTotal - docsAccepted} Dokumente offen</div>
                    </div>
                    <span style={{ marginLeft: 'auto', color: 'var(--ki-text-tertiary)' }}>→</span>
                  </a>
                )}
                {completedLessons === 0 && (
                  <a href="/masterclass" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px', borderRadius: 'var(--r-md)', background: 'var(--ki-bg-alt)', textDecoration: 'none', color: 'inherit' }}>
                    <span style={{ fontSize: 20 }}>▶</span>
                    <div>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>Erste Lektion starten</div>
                      <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>{totalLessons} Lektionen verfügbar</div>
                    </div>
                    <span style={{ marginLeft: 'auto', color: 'var(--ki-text-tertiary)' }}>→</span>
                  </a>
                )}
                {hasAnalysis && docsAccepted >= docsTotal && completedLessons > 0 && (
                  <div style={{ padding: '16px', textAlign: 'center', color: 'var(--ki-text-secondary)', fontSize: 14 }}>
                    Du bist auf einem guten Weg! Weiter so.
                  </div>
                )}
              </div>
            </div>

            {/* Analysis Summary or CTA */}
            <div className="card animate-in">
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.02em' }}>
                {hasAnalysis ? 'Dein Kompetenzprofil' : 'Karriereanalyse'}
              </h3>
              {hasAnalysis && analysisResults.length > 0 ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {analysisResults
                    .sort((a, b) => a.score - b.score)
                    .slice(0, 5)
                    .map((r, i) => (
                      <div key={r.field_id} style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                        <span style={{ fontSize: 16 }}>{r.competency_fields?.icon}</span>
                        <div style={{ flex: 1 }}>
                          <div style={{ fontSize: 13, fontWeight: 500 }}>{r.competency_fields?.title}</div>
                          <div className="progress-bar" style={{ marginTop: 4 }}>
                            <div className="progress-bar-fill" style={{
                              width: `${r.score}%`,
                              background: r.score < 40 ? 'var(--ki-red)' : r.score < 70 ? 'var(--ki-warning)' : 'var(--ki-success)'
                            }} />
                          </div>
                        </div>
                        <span style={{ fontSize: 13, fontWeight: 600, color: r.score < 40 ? 'var(--ki-red)' : 'var(--ki-text-secondary)', minWidth: 36, textAlign: 'right' }}>
                          {Math.round(r.score)}%
                        </span>
                        {i < 3 && <span className="pill pill-red" style={{ fontSize: 11 }}>PRIO {i + 1}</span>}
                      </div>
                    ))}
                  <a href="/analyse" style={{ fontSize: 13, fontWeight: 600, marginTop: 8, display: 'block' }}>Alle 13 Felder ansehen →</a>
                </div>
              ) : (
                <div style={{ textAlign: 'center', padding: '24px 0' }}>
                  <div style={{ fontSize: 48, marginBottom: 12 }}>◎</div>
                  <p style={{ color: 'var(--ki-text-secondary)', marginBottom: 16 }}>Finde heraus, wo dein größtes Potenzial liegt.</p>
                  <a href="/analyse" className="btn btn-primary">Analyse starten</a>
                </div>
              )}
            </div>
          </div>

          {/* Recent Applications */}
          {applications && applications.length > 0 && (
            <div className="card animate-in" style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
                <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em' }}>Aktuelle Bewerbungen</h3>
                <a href="/applications" style={{ fontSize: 13, fontWeight: 600 }}>Alle ansehen →</a>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                {applications.slice(0, 3).map(app => (
                  <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid var(--ki-border)' }}>
                    <div style={{ width: 36, height: 36, borderRadius: 'var(--r-sm)', background: 'var(--ki-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 14, fontWeight: 700 }}>
                      {app.company_name?.charAt(0)}
                    </div>
                    <div style={{ flex: 1 }}>
                      <div style={{ fontSize: 14, fontWeight: 600 }}>{app.company_name}</div>
                      <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>{app.position}</div>
                    </div>
                    <span className={`pill pill-${app.status === 'offer' ? 'green' : app.status === 'interview' ? 'gold' : app.status === 'rejected' ? 'red' : 'grey'}`}>
                      {app.status === 'research' ? 'Recherche' : app.status === 'applied' ? 'Beworben' : app.status === 'interview' ? 'Interview' : app.status === 'assessment' ? 'AC' : app.status === 'offer' ? 'Angebot' : app.status === 'accepted' ? 'Angenommen' : 'Abgesagt'}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
