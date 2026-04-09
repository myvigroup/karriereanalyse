'use client';
import { useMemo } from 'react';
import { berechnePersonalisierung } from '@/lib/personalization';

export default function DashboardClient({ profile, analysisSession, analysisResults, progress, courses, documents, applications, marketValue, cvFeedback, hasCvDoc }) {
  const hasAnalysis = !!analysisSession;
  const pers = useMemo(() => berechnePersonalisierung(analysisResults, profile?.phase), [analysisResults, profile?.phase]);
  const activeApps = (applications || []).filter(a => !['rejected', 'accepted'].includes(a.status)).length;

  return (
    <div className="page-container">
      {/* ── Header ── */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 14, color: 'var(--ki-text-tertiary)', marginBottom: 4 }}>
          Guten {new Date().getHours() < 12 ? 'Morgen' : new Date().getHours() < 18 ? 'Tag' : 'Abend'}, {profile?.full_name?.split(' ')[0] || profile?.name || 'User'}
        </div>
        <h1 className="page-title" style={{ margin: 0 }}>Dashboard</h1>
      </div>

      {/* ── CV-Check Upload CTA (kein CV vorhanden) ── */}
      {!hasCvDoc && (
        <a href="/cv-check/upload" style={{ display: 'block', textDecoration: 'none', marginBottom: 24 }}>
          <div style={{
            background: 'linear-gradient(135deg, #CC1426 0%, #a01020 100%)',
            borderRadius: 'var(--r-lg)', padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 20,
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 'var(--r-md)', flexShrink: 0,
              background: 'rgba(255,255,255,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>📋</div>
            <div style={{ flex: 1 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 2 }}>
                Lebenslauf-Check starten
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.75)' }}>
                KI analysiert deinen CV sofort — kostenlos & in 30 Sekunden
              </div>
            </div>
            <span style={{ fontSize: 20, color: 'rgba(255,255,255,0.8)', flexShrink: 0 }}>→</span>
          </div>
        </a>
      )}

      {/* ── CV-Check Banner (CV vorhanden) ── */}
      {hasCvDoc && (
        <a href="/cv-check" style={{ display: 'block', textDecoration: 'none', marginBottom: 24 }}>
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: 'var(--r-lg)', padding: '20px 24px',
            display: 'flex', alignItems: 'center', gap: 20,
            border: '1px solid rgba(255,255,255,0.06)',
          }}>
            <div style={{
              width: 48, height: 48, borderRadius: 'var(--r-md)', flexShrink: 0,
              background: 'rgba(204,20,38,0.15)', border: '1px solid rgba(204,20,38,0.3)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 22,
            }}>📋</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                Dein Lebenslauf-Check liegt vor
              </div>
              {cvFeedback?.summary ? (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.6)', lineHeight: 1.5, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  {cvFeedback.summary}
                </div>
              ) : (
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Feedback vom Berater ansehen</div>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 4, flexShrink: 0 }}>
              {cvFeedback?.overall_rating > 0 && (
                <div style={{ color: '#D4A017', fontSize: 16, letterSpacing: 1 }}>
                  {'★'.repeat(cvFeedback.overall_rating)}{'☆'.repeat(5 - cvFeedback.overall_rating)}
                </div>
              )}
              <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-red)' }}>Ansehen →</span>
            </div>
          </div>
        </a>
      )}

      {/* ── Nächste Schritte + Kompetenzprofil ── */}
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

        {/* Karriere-Analyse / Kompetenzprofil */}
        <div className="card animate-in">
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16, letterSpacing: '-0.02em' }}>
            {hasAnalysis ? 'Kompetenzprofil' : 'Karriere-Analyse'}
          </h3>
          {hasAnalysis && analysisResults.length > 0 ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
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
              <div style={{ borderTop: '1px solid var(--ki-border)', margin: '4px 0' }} />
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
              <a href="/analyse" style={{ fontSize: 12, fontWeight: 600, marginTop: 4, display: 'block' }}>Alle Felder →</a>
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

      {/* ── E-Learnings ── */}
      {(courses || []).length > 0 && (
        <div className="card animate-in" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>E-Learnings</h3>
            <a href="/masterclass" style={{ fontSize: 12, fontWeight: 600 }}>Alle Kurse →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {(courses || []).filter(c => c.id?.startsWith('c1000000')).slice(0, 6).map(c => {
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
    </div>
  );
}
