'use client';

import { LEVELS, getLevelProgress } from '@/lib/career-logic';

export default function CareerClient({ profile, progress, analysisSession, certificates, courses }) {
  const xp = profile?.xp || 0;
  const { current, next, progress: levelPct } = getLevelProgress(xp);
  const completedLessons = (progress || []).filter(p => p.completed).length;
  const totalLessons = (courses || []).reduce((sum, c) => sum + (c.modules || []).reduce((s, m) => s + (m.lessons || []).length, 0), 0);
  const hasAnalysis = !!analysisSession;

  return (
    <div className="page-container animate-in">
      <div style={{ marginBottom: 32 }}>
        <h1 className="page-title">Karrierepfad</h1>
        <p className="page-subtitle">Deine Reise vom Newcomer zum Executive</p>
      </div>

      {/* Current Level & Progress */}
      <div className="card" style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 24 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%', background: 'var(--ki-red)',
          color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 32, flexShrink: 0,
        }}>
          {current.icon}
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 4 }}>Aktuelles Level</div>
          <div style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em' }}>{current.title}</div>
          <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginTop: 4 }}>{xp} KI-Points</div>
        </div>
        {next && (
          <div style={{ textAlign: 'right', minWidth: 180 }}>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 8 }}>
              Nächstes Level: {next.icon} {next.title}
            </div>
            <div className="progress-bar" style={{ marginBottom: 4 }}>
              <div className="progress-bar-fill" style={{ width: `${levelPct}%` }} />
            </div>
            <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>{xp} / {next.minXP} XP</div>
          </div>
        )}
      </div>

      {/* Level Timeline */}
      <div style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 20 }}>Level-System</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 0, position: 'relative' }}>
          {/* Vertical line */}
          <div style={{
            position: 'absolute', left: 35, top: 36, bottom: 36, width: 2,
            background: 'var(--ki-border)',
          }} />

          {LEVELS.map((level, i) => {
            const isActive = current.level === level.level;
            const isPast = current.level > level.level;
            const isFuture = current.level < level.level;
            return (
              <div
                key={level.level}
                className={`animate-in delay-${Math.min(i + 1, 4)}`}
                style={{
                  display: 'flex', alignItems: 'center', gap: 20, padding: '16px 0',
                  position: 'relative',
                }}
              >
                {/* Icon circle */}
                <div style={{
                  width: 72, height: 72, borderRadius: '50%', flexShrink: 0,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28, zIndex: 1,
                  background: isActive ? 'var(--ki-red)' : isPast ? 'var(--ki-success)' : 'var(--ki-bg-alt)',
                  color: isActive || isPast ? 'white' : 'var(--ki-text-tertiary)',
                  transform: isActive ? 'scale(1.1)' : 'scale(1)',
                  boxShadow: isActive ? 'var(--sh-lg)' : 'none',
                  transition: 'all var(--t-med)',
                  border: isActive ? '3px solid var(--ki-red)' : '2px solid var(--ki-border)',
                }}>
                  {isPast ? '✓' : level.icon}
                </div>

                {/* Content */}
                <div style={{ flex: 1 }}>
                  <div style={{
                    fontSize: isActive ? 18 : 16, fontWeight: isActive ? 700 : 500,
                    color: isFuture ? 'var(--ki-text-tertiary)' : 'var(--ki-text)',
                  }}>
                    Level {level.level}: {level.title}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 2 }}>
                    Ab {level.minXP} KI-Points
                  </div>
                  {isActive && (
                    <span className="pill pill-red" style={{ marginTop: 8, fontSize: 12 }}>Du bist hier</span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* What's missing checklist */}
      <div className="card" style={{ marginBottom: 32 }}>
        <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>Was fehlt noch?</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <CheckItem done={hasAnalysis} label="Karriereanalyse abschließen" sub={hasAnalysis ? `Score: ${Math.round(analysisSession.overall_score)}%` : '13 Kompetenzfelder bewerten'} href="/analyse" />
          <CheckItem done={completedLessons >= 5} label="5 Lektionen abschließen" sub={`${completedLessons}/${Math.max(5, totalLessons)} erledigt`} href="/masterclass" />
          <CheckItem done={completedLessons >= totalLessons && totalLessons > 0} label="Alle Lektionen abschließen" sub={`${completedLessons}/${totalLessons} erledigt`} href="/masterclass" />
          <CheckItem done={certificates.length > 0} label="Erstes Zertifikat erhalten" sub={certificates.length > 0 ? `${certificates.length} Zertifikat(e)` : 'Noch kein Zertifikat'} href="#certificates" />
        </div>
      </div>

      {/* Certificates */}
      <div id="certificates">
        <h3 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>Zertifikate</h3>
        {certificates.length > 0 ? (
          <div className="grid-3">
            {certificates.map(cert => (
              <div key={cert.id} className="card" style={{ textAlign: 'center', padding: '24px 16px' }}>
                <div style={{ fontSize: 36, marginBottom: 8 }}>🏆</div>
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 4 }}>{cert.title}</div>
                <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>
                  {new Date(cert.issued_at || cert.created_at).toLocaleDateString('de-DE')}
                </div>
                {cert.pdf_url && (
                  <a href={cert.pdf_url} target="_blank" rel="noopener noreferrer" className="btn btn-secondary" style={{ fontSize: 13 }}>
                    📥 Download
                  </a>
                )}
              </div>
            ))}
          </div>
        ) : (
          <div className="card" style={{ textAlign: 'center', padding: 48, color: 'var(--ki-text-tertiary)' }}>
            <div style={{ fontSize: 36, marginBottom: 12 }}>🏆</div>
            <p>Schließe Kurse ab, um Zertifikate zu erhalten</p>
          </div>
        )}
      </div>
    </div>
  );
}

function CheckItem({ done, label, sub, href }) {
  return (
    <a href={href} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
      borderRadius: 'var(--r-md)', background: done ? 'rgba(45,106,79,0.04)' : 'var(--ki-bg-alt)',
      textDecoration: 'none', color: 'inherit', transition: 'background var(--t-fast)',
    }}>
      <span style={{
        width: 24, height: 24, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 12, fontWeight: 700,
        background: done ? 'var(--ki-success)' : 'var(--grey-5)',
        color: done ? 'white' : 'var(--ki-text-tertiary)',
      }}>
        {done ? '✓' : '○'}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{ fontSize: 14, fontWeight: 500, color: done ? 'var(--ki-success)' : 'var(--ki-text)', textDecoration: done ? 'line-through' : 'none' }}>{label}</div>
        <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>{sub}</div>
      </div>
      {!done && <span style={{ color: 'var(--ki-text-tertiary)', fontSize: 14 }}>→</span>}
    </a>
  );
}
