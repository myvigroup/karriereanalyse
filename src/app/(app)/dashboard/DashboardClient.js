'use client';
import { useState, useMemo } from 'react';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { berechnePersonalisierung } from '@/lib/personalization';
import { getLevel, getLevelProgress } from '@/lib/gamification';

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
  "Investiere in dich selbst — es ist die beste Rendite.",
  "Authentizität ist dein größter Karrierevorteil.",
  "Deine Expertise hat einen Marktwert. Kenne ihn.",
  "Resilienz ist keine Schwäche — sie ist dein Wettbewerbsvorteil.",
];

export default function DashboardClient({ profile, analysisSession, analysisResults, progress, courses, documents, applications, marketValue }) {
  const hasAnalysis = !!analysisSession;
  const overallScore = analysisSession?.overall_score || 0;
  const xp = profile?.total_points || profile?.xp || 0;
  const { current: lvl, next: nextLvl, progress: lvlPct } = getLevelProgress(xp);
  const pers = useMemo(() => berechnePersonalisierung(analysisResults, profile?.phase), [analysisResults, profile?.phase]);

  const completedLessons = (progress || []).filter(p => p.completed).length;
  const totalLessons = (courses || []).reduce((sum, c) => sum + (c.modules || []).reduce((s, m) => s + (m.lessons || []).length, 0), 0);
  const completedCourses = (courses || []).filter(c => {
    const lessons = (c.modules || []).flatMap(m => m.lessons || []);
    const completedIds = new Set((progress || []).filter(p => p.completed).map(p => p.lesson_id));
    return lessons.length > 0 && lessons.every(l => completedIds.has(l.id));
  }).length;
  const streakDays = profile?.streak_count || profile?.streak_days || 0;
  const activeApps = (applications || []).filter(a => !['rejected', 'accepted'].includes(a.status)).length;

  const dailyQuote = useMemo(() => {
    const d = Math.floor((new Date() - new Date(new Date().getFullYear(), 0, 0)) / 86400000);
    return QUOTES[d % QUOTES.length];
  }, []);

  // ── KPI Card Component ──
  const KPICard = ({ icon, label, value, sub, accent, href }) => (
    <a href={href} className="card animate-in" style={{ textDecoration: 'none', color: 'inherit', padding: '16px 20px', display: 'flex', flexDirection: 'column', gap: 4 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</span>
        <span style={{ fontSize: 16 }}>{icon}</span>
      </div>
      <div style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em', color: accent || 'var(--ki-text)' }}>{value}</div>
      {sub && <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>{sub}</div>}
    </a>
  );

  return (
    <div className="page-container">
      {/* ── Header + Level Bar ── */}
      <div style={{ marginBottom: 24 }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 16 }}>
          <div>
            <div style={{ fontSize: 14, color: 'var(--ki-text-tertiary)', marginBottom: 2 }}>
              Guten {new Date().getHours() < 12 ? 'Morgen' : new Date().getHours() < 18 ? 'Tag' : 'Abend'}, {profile?.full_name?.split(' ')[0] || profile?.name || 'User'}
            </div>
            <h1 className="page-title" style={{ margin: 0 }}>Dashboard<InfoTooltip moduleId="dashboard" profile={profile} /></h1>
          </div>
          {streakDays > 0 && (
            <div style={{ textAlign: 'center', padding: '8px 16px', background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)' }}>
              <div style={{ fontSize: 20 }}>🔥</div>
              <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-secondary)' }}>{streakDays} Tage Streak</div>
            </div>
          )}
        </div>

        {/* Level Progress Bar */}
        <div className="card" style={{ padding: '14px 20px', display: 'flex', alignItems: 'center', gap: 16 }}>
          <div style={{ fontSize: 24 }}>{lvl.icon}</div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Level {lvl.level}: {lvl.name}</span>
              <span style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>{xp} XP{nextLvl ? ` / ${nextLvl.minXP}` : ''}</span>
            </div>
            <div className="progress-bar" style={{ height: 6 }}>
              <div className="progress-bar-fill" style={{ width: `${lvlPct}%` }} />
            </div>
          </div>
          {nextLvl && <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', whiteSpace: 'nowrap' }}>{nextLvl.icon} {nextLvl.name}</span>}
        </div>
      </div>

      {/* ── Daily Quote ── */}
      <div style={{ marginBottom: 24, padding: '12px 20px', background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)', fontSize: 13, color: 'var(--ki-text-secondary)', fontStyle: 'italic', borderLeft: '3px solid var(--ki-red)' }}>
        „{dailyQuote}"
      </div>

      {/* ── 5 KPI Cards (MYVI-Style) ── */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: 12, marginBottom: 28 }}>
        <KPICard icon="◎" label="Karriere-Score" value={hasAnalysis ? `${pers.gesamtScore}%` : '—'} sub={hasAnalysis ? `${pers.schwaechen.length} Wachstumsfelder` : 'Analyse starten'} accent="var(--ki-red)" href="/analyse" />
        <KPICard icon="▶" label="Module" value={`${completedLessons}/${totalLessons}`} sub={`${completedCourses}/6 Kurse fertig`} href="/masterclass" />
        <KPICard icon="🔥" label="Streak" value={`${streakDays} Tage`} sub={streakDays >= 7 ? 'Stark!' : streakDays > 0 ? 'Weiter so!' : 'Starte heute'} accent={streakDays >= 7 ? 'var(--ki-warning)' : undefined} href="/career" />
        <KPICard icon="💰" label="Marktwert" value={`+${pers.marktwertPotenzial}%`} sub="Potenzial" accent="var(--ki-success)" href="/marktwert" />
        <KPICard icon={lvl.icon} label="KI-Points" value={xp} sub={`Level ${lvl.level}: ${lvl.name}`} href="/career" />
      </div>

      {/* ── Nächste Schritte (Analyse-basiert) ── */}
      <div className="grid-2" style={{ marginBottom: 28 }}>
        <div className="card animate-in">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.02em' }}>Nächste Schritte</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {!hasAnalysis && (
              <a href="/analyse" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--r-md)', background: 'rgba(204,20,38,0.04)', textDecoration: 'none', color: 'inherit', border: '1px solid rgba(204,20,38,0.1)' }}>
                <span style={{ fontSize: 18 }}>◎</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>Karriere-Analyse starten</div>
                  <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>12 Felder · ~10 Min.</div>
                </div>
                <span style={{ color: 'var(--ki-red)', fontWeight: 600 }}>→</span>
              </a>
            )}
            {hasAnalysis && pers.empfohleneKurse.slice(0, 3).map((kurs) => (
              <a key={kurs.kursId} href={`/masterclass/${kurs.kursId}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--r-md)', background: 'var(--ki-bg-alt)', textDecoration: 'none', color: 'inherit', borderLeft: `3px solid ${kurs.farbe}` }}>
                <span style={{ fontSize: 18 }}>{kurs.icon}</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{kurs.title}</div>
                  <div style={{ fontSize: 11, color: 'var(--ki-text-secondary)' }}>{kurs.empfehlung?.slice(0, 60)}{kurs.empfehlung?.length > 60 ? '...' : ''}</div>
                </div>
                {kurs.istSchwaeche && <span style={{ fontSize: 10, fontWeight: 700, color: 'var(--ki-warning)', background: 'rgba(245,158,11,0.1)', padding: '2px 6px', borderRadius: 99 }}>2x XP</span>}
              </a>
            ))}
            {activeApps > 0 && (
              <a href="/applications" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 14px', borderRadius: 'var(--r-md)', background: 'var(--ki-bg-alt)', textDecoration: 'none', color: 'inherit' }}>
                <span style={{ fontSize: 18 }}>✉</span>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{activeApps} aktive Bewerbungen</div>
                  <div style={{ fontSize: 11, color: 'var(--ki-text-secondary)' }}>Status prüfen</div>
                </div>
              </a>
            )}
          </div>
        </div>

        {/* Kompetenzprofil */}
        <div className="card animate-in">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.02em' }}>
            {hasAnalysis ? 'Kompetenzprofil' : 'Karriere-Analyse'}
          </h3>
          {hasAnalysis && analysisResults.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {/* Top 3 Stärken */}
              {pers.staerken.slice(0, 2).map((s) => (
                <div key={s.field_id || s.field_slug} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{s.label}</div>
                    <div className="progress-bar" style={{ marginTop: 3, height: 4 }}>
                      <div className="progress-bar-fill" style={{ width: `${s.score}%`, background: 'var(--ki-success)' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: 'var(--ki-success)', minWidth: 32, textAlign: 'right' }}>{Math.round(s.score)}%</span>
                </div>
              ))}
              {/* Trennlinie */}
              <div style={{ borderTop: '1px solid var(--ki-border)', margin: '4px 0' }} />
              {/* Top 3 Wachstumsfelder */}
              {pers.schwaechen.slice(0, 3).map((s) => (
                <div key={s.field_id || s.field_slug} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                  <div style={{ flex: 1 }}>
                    <div style={{ fontSize: 12, fontWeight: 500 }}>{s.label}</div>
                    <div className="progress-bar" style={{ marginTop: 3, height: 4 }}>
                      <div className="progress-bar-fill" style={{ width: `${s.score}%`, background: s.score < 50 ? 'var(--ki-red)' : 'var(--ki-warning)' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 12, fontWeight: 700, color: s.score < 50 ? 'var(--ki-red)' : 'var(--ki-warning)', minWidth: 32, textAlign: 'right' }}>{Math.round(s.score)}%</span>
                </div>
              ))}
              <a href="/analyse" style={{ fontSize: 12, fontWeight: 600, marginTop: 4, display: 'block' }}>Alle 13 Felder →</a>
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '20px 0' }}>
              <div style={{ fontSize: 40, marginBottom: 8 }}>◎</div>
              <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>12 Kompetenzfelder analysieren</p>
              <a href="/analyse" className="btn btn-primary" style={{ fontSize: 13 }}>Analyse starten</a>
            </div>
          )}
        </div>
      </div>

      {/* ── Kurs-Fortschritt ── */}
      {(courses || []).length > 0 && (
        <div className="card animate-in" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>E-Learnings</h3>
            <a href="/masterclass" style={{ fontSize: 12, fontWeight: 600 }}>Alle Kurse →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {(courses || []).filter(c => c.category === 'E-Learning' || c.id?.startsWith('c1000000')).slice(0, 6).map(c => {
              const total = (c.modules || []).reduce((s, m) => s + (m.lessons || []).length, 0);
              const done = (c.modules || []).reduce((s, m) => s + (m.lessons || []).filter(l => (progress || []).some(p => p.lesson_id === l.id && p.completed)).length, 0);
              const pct = total > 0 ? Math.round((done / total) * 100) : 0;
              return (
                <a key={c.id} href={`/masterclass/${c.id}`} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 12px', borderRadius: 'var(--r-md)', background: 'var(--ki-bg-alt)', textDecoration: 'none', color: 'inherit' }}>
                  <span style={{ fontSize: 22 }}>{c.icon || '📚'}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <div style={{ fontSize: 12, fontWeight: 600, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{c.title}</div>
                    <div className="progress-bar" style={{ marginTop: 4, height: 3 }}>
                      <div className="progress-bar-fill" style={{ width: `${pct}%`, background: pct === 100 ? 'var(--ki-success)' : 'var(--ki-red)' }} />
                    </div>
                  </div>
                  <span style={{ fontSize: 11, fontWeight: 700, color: pct === 100 ? 'var(--ki-success)' : 'var(--ki-text-secondary)' }}>{pct}%</span>
                </a>
              );
            })}
          </div>
        </div>
      )}

      {/* ── Bewerbungen ── */}
      {applications && applications.length > 0 && (
        <div className="card animate-in" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>Bewerbungen</h3>
            <a href="/applications" style={{ fontSize: 12, fontWeight: 600 }}>Alle →</a>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
            {applications.slice(0, 3).map(app => (
              <div key={app.id} style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '8px 0', borderBottom: '1px solid var(--ki-border)' }}>
                <div style={{ width: 32, height: 32, borderRadius: 'var(--r-sm)', background: 'var(--ki-bg-alt)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 700 }}>
                  {app.company_name?.charAt(0)}
                </div>
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 13, fontWeight: 600 }}>{app.company_name}</div>
                  <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>{app.position}</div>
                </div>
                <span className={`pill pill-${app.status === 'offer' ? 'green' : app.status === 'interview' ? 'gold' : app.status === 'rejected' ? 'red' : 'grey'}`} style={{ fontSize: 10 }}>
                  {app.status === 'applied' ? 'Beworben' : app.status === 'interview' ? 'Interview' : app.status === 'offer' ? 'Angebot' : app.status === 'accepted' ? 'Angenommen' : app.status === 'rejected' ? 'Abgesagt' : app.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
