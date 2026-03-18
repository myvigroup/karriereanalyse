'use client';

export default function DashboardClient({ profile, analysisSession, analysisResults, progress, courses, documents, applications, marketValue }) {
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
      <div style={{ marginBottom: 32 }}>
        <div style={{ fontSize: 14, color: 'var(--ki-text-tertiary)', marginBottom: 4 }}>
          Guten {new Date().getHours() < 12 ? 'Morgen' : new Date().getHours() < 18 ? 'Tag' : 'Abend'}, {profile?.first_name || profile?.name}
        </div>
        <h1 className="page-title">Dashboard</h1>
      </div>

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
    </div>
  );
}
