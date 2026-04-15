'use client';
import { useMemo, useState, useEffect } from 'react';
import { berechnePersonalisierung } from '@/lib/personalization';

function MesseAngebotBlock({ fairLead, profile }) {
  const purchased = profile?.purchased_products || [];
  const plan = profile?.subscription_plan || 'FREE';
  const isPremium = plan !== 'FREE';

  // Block ausblenden wenn bereits Premium
  if (isPremium) return null;

  const fairName = fairLead?.fairs?.name;

  return (
    <div style={{
      marginBottom: 28,
      borderRadius: 'var(--r-lg)',
      overflow: 'hidden',
      border: '1px solid rgba(204,20,38,0.2)',
    }}>
      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
        padding: '16px 20px',
        display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12,
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ fontSize: 20 }}>🎪</div>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700, color: '#fff' }}>
              {fairName ? `Dein Messe-Angebot nach der ${fairName}` : 'Dein exklusives Messe-Angebot'}
            </div>
            <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)' }}>
              CV-Check erledigt — jetzt den nächsten Schritt machen
            </div>
          </div>
        </div>
        <div style={{
          fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 980,
          background: 'rgba(204,20,38,0.2)', color: '#ff6b7a', border: '1px solid rgba(204,20,38,0.3)',
          flexShrink: 0,
        }}>
          7 Tage gratis
        </div>
      </div>

      {/* Premium-Mitgliedschaft Pitch */}
      <div style={{ padding: '20px', background: 'var(--ki-card)' }}>
        {/* Value Hook */}
        <div style={{
          display: 'flex', alignItems: 'flex-start', gap: 16,
          padding: '16px 18px', borderRadius: 'var(--r-md)',
          background: 'rgba(204,20,38,0.04)', border: '1px solid rgba(204,20,38,0.1)',
          marginBottom: 14,
        }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>💎</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ki-text)', marginBottom: 3 }}>
              Premium-Mitgliedschaft — 15 €/Monat
            </div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.5 }}>
              Jeden Monat ein Seminar-Platz im Wert von <strong>99 €</strong> inklusive — plus alle E-Learning Kurse und die Gehaltsverhandlungs-Masterclass.
            </div>
          </div>
        </div>

        {/* Mini Feature Grid */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 8, marginBottom: 16 }}>
          {[
            ['📅', '1x Seminar/Monat', '(Wert 99 €)'],
            ['💰', 'Gehalts-Masterclass', 'inklusive'],
            ['◎', 'Karriere-Analyse', 'vollständig'],
            ['📚', 'Alle E-Learning Kurse', 'inklusive'],
          ].map(([icon, title, sub]) => (
            <div key={title} style={{
              display: 'flex', alignItems: 'flex-start', gap: 8, padding: '10px 12px',
              borderRadius: 'var(--r-sm)', background: 'var(--ki-bg-alt)',
              border: '1px solid var(--ki-border)',
            }}>
              <span style={{ fontSize: 15, flexShrink: 0 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text)', lineHeight: 1.3 }}>{title}</div>
                <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="/angebote" className="btn btn-primary" style={{ flex: 1, textAlign: 'center', fontSize: 13 }}>
            7 Tage kostenlos testen →
          </a>
          <a href="/angebote" style={{
            fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)',
            textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0,
          }}>
            oder Seminar einzeln buchen
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── Webinar Banner mit Countdown ───────────────────────────────────────────
function WebinarBanner() {
  const [countdown, setCountdown] = useState('');
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    function getNextWebinar() {
      const now = new Date();
      const today10 = new Date(now); today10.setHours(10, 0, 0, 0);
      const today1730 = new Date(now); today1730.setHours(17, 30, 0, 0);
      const tomorrow10 = new Date(now); tomorrow10.setDate(tomorrow10.getDate() + 1); tomorrow10.setHours(10, 0, 0, 0);

      if (now < today10) return today10;
      if (now < today1730) return today1730;
      return tomorrow10;
    }

    function update() {
      const next = getNextWebinar();
      const diff = next - new Date();
      if (diff <= 0) { setIsLive(true); setCountdown('Jetzt live!'); return; }

      setIsLive(diff < 5 * 60 * 1000); // < 5 min = live feeling
      const h = Math.floor(diff / 3600000);
      const m = Math.floor((diff % 3600000) / 60000);
      const s = Math.floor((diff % 60000) / 1000);

      if (h > 0) setCountdown(`${h}h ${m.toString().padStart(2, '0')}m ${s.toString().padStart(2, '0')}s`);
      else if (m > 0) setCountdown(`${m}m ${s.toString().padStart(2, '0')}s`);
      else setCountdown(`${s}s`);
    }

    update();
    const timer = setInterval(update, 1000);
    return () => clearInterval(timer);
  }, []);

  const webinarUrl = 'https://daskarriereinstitut.webinargeek.com/karriere-statt-zufall-die-5-schritte-zu-deinem-erfolgreichen-berufseinstieg-traumgehalt';

  return (
    <a href={webinarUrl} target="_blank" rel="noopener noreferrer" style={{ display: 'block', textDecoration: 'none', marginBottom: 24 }}>
      <div style={{
        background: 'linear-gradient(135deg, #CC1426 0%, #8B0D1A 40%, #1a1a1a 100%)',
        borderRadius: 'var(--r-lg)', padding: '20px 24px',
        display: 'flex', alignItems: 'center', gap: 20,
        position: 'relative', overflow: 'hidden',
      }}>
        <div style={{
          position: 'absolute', inset: 0,
          backgroundImage: 'radial-gradient(circle at 80% 20%, rgba(255,255,255,0.08) 0%, transparent 50%)',
        }} />

        {/* Countdown Timer */}
        <div style={{
          minWidth: 72, flexShrink: 0, textAlign: 'center', position: 'relative',
        }}>
          <div style={{
            fontSize: isLive ? 14 : 20, fontWeight: 800, color: '#fff',
            fontVariantNumeric: 'tabular-nums', letterSpacing: '-0.02em',
          }}>
            {countdown}
          </div>
          <div style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', marginTop: 2, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>
            {isLive ? '🔴 Live' : 'bis zum Start'}
          </div>
        </div>

        <div style={{ width: 1, height: 40, background: 'rgba(255,255,255,0.15)', flexShrink: 0 }} />

        <div style={{ flex: 1, position: 'relative' }}>
          <div style={{ fontSize: 15, fontWeight: 700, color: '#fff', marginBottom: 3 }}>
            Karriere statt Zufall
          </div>
          <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.4 }}>
            Dein smarter Weg ins Berufsleben mit Perspektive &amp; Top-Gehalt
          </div>
        </div>

        <div style={{
          padding: '10px 18px', borderRadius: 'var(--r-md)',
          background: '#fff', color: '#CC1426',
          fontSize: 13, fontWeight: 700, flexShrink: 0,
          position: 'relative',
        }}>
          Kostenlos anmelden →
        </div>
      </div>
    </a>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function DashboardClient({ profile, analysisSession, analysisResults, progress, courses, applications, cvFeedback, hasCvDoc, fairLead }) {
  const hasAnalysis = !!analysisSession;
  const pers = useMemo(() => berechnePersonalisierung(analysisResults, profile?.phase), [analysisResults, profile?.phase]);
  const activeApps = (applications || []).filter(a => !['rejected', 'accepted'].includes(a.status)).length;
  const isMesseBesucher = !!fairLead;

  return (
    <div className="page-container">
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ fontSize: 14, color: 'var(--ki-text-tertiary)', marginBottom: 4 }}>
          Guten {new Date().getHours() < 12 ? 'Morgen' : new Date().getHours() < 18 ? 'Tag' : 'Abend'}, {profile?.full_name?.split(' ')[0] || profile?.name || 'User'}
        </div>
        <h1 className="page-title" style={{ margin: 0 }}>Dashboard</h1>
      </div>

      {/* Webinar Banner mit Countdown */}
      <WebinarBanner />

      {/* CV-Check Upload CTA (kein CV vorhanden) */}
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

      {/* CV-Check Banner (CV vorhanden) */}
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
                <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>Feedback ansehen →</div>
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

      {/* Messe-Angebot (nur für Messe-Besucher) */}
      {isMesseBesucher && (
        <MesseAngebotBlock fairLead={fairLead} profile={profile} />
      )}

      {/* Nächste Schritte + Kompetenzprofil */}
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

      {/* E-Learnings */}
      {(courses || []).length > 0 && (
        <div className="card animate-in" style={{ marginBottom: 28 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 16 }}>
            <h3 style={{ fontSize: 16, fontWeight: 700, letterSpacing: '-0.02em' }}>E-Learnings</h3>
            <a href="/masterclass" style={{ fontSize: 12, fontWeight: 600 }}>Alle Kurse →</a>
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 12 }}>
            {(courses || []).filter(c => !c.category || c.category === 'e-learning').slice(0, 6).map(c => {
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
