'use client';

import { useState, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import InfoTooltip from '@/components/ui/InfoTooltip';

/* ───────────────────────── useCountUp ───────────────────────── */
function useCountUp(target, duration = 1500) {
  const [value, setValue] = useState(0);
  const ref = useRef(null);
  useEffect(() => {
    if (ref.current) cancelAnimationFrame(ref.current);
    const start = performance.now();
    const animate = (now) => {
      const elapsed = now - start;
      const p = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - p, 3);
      setValue(Math.round(target * eased));
      if (p < 1) ref.current = requestAnimationFrame(animate);
    };
    ref.current = requestAnimationFrame(animate);
    return () => { if (ref.current) cancelAnimationFrame(ref.current); };
  }, [target, duration]);
  return value;
}

/* ───────────────────── Score-Berechnung ─────────────────────── */
function calculateMarktwertScore(progress, courses) {
  let score = 0;

  // Karriere-Analyse abgeschlossen: check if any lesson_progress exists
  const hasAnalysis = (progress || []).length > 0;
  if (hasAnalysis) score += 20;

  // E-Learning Zertifikate (je 10%, max 6)
  const completedCourses = (courses || []).filter(c => {
    const totalLessons = (c.modules || []).reduce((s, m) => s + (m.lessons?.length || 0), 0);
    if (totalLessons === 0) return false;
    const completedLessons = (progress || []).filter(p =>
      (c.modules || []).some(m => (m.lessons || []).some(l => l.id === p.lesson_id))
    ).length;
    return completedLessons >= totalLessons;
  });

  const completedCount = Math.min(completedCourses.length, 6);
  score += completedCount * 10;

  // Bonus: Alle 6 E-Learnings komplett
  if (completedCount >= 6) score += 10;

  return Math.min(score, 100);
}

/* ──────────────── Zertifikats-Definitionen ──────────────────── */
const CERTIFICATES = [
  { key: 'kommunikation',   label: 'Kommunikation',           type: 'elearning' },
  { key: 'networking',      label: 'Networking',               type: 'elearning' },
  { key: 'karriereanalyse', label: 'Karriere-Analyse',         type: 'analyse'   },
  { key: 'prioritaeten',    label: 'Prioritätenmanagement',    type: 'elearning' },
  { key: 'speedreading',    label: 'Speedreading',             type: 'elearning' },
  { key: 'worklife',        label: 'Work-Life-Balance',        type: 'elearning' },
  { key: 'typgerecht',      label: 'Typgerechtes Lernen',      type: 'elearning' },
  { key: 'strukturgramm',   label: 'Strukturgramm®',           type: 'premium'   },
  { key: 'insights',        label: 'INSIGHTS MDI® EQ',         type: 'premium'   },
];

/* ────────────── Score-Breakdown Definitionen ────────────────── */
const SCORE_BREAKDOWN = [
  { label: 'Karriere-Analyse abgeschlossen', value: '+20%',       key: 'analyse'       },
  { label: 'Pro E-Learning Zertifikat',      value: '+10%',       key: 'elearning'     },
  { label: 'Strukturgramm®',                 value: '+15%',       key: 'strukturgramm' },
  { label: 'INSIGHTS MDI® EQ',              value: '+15%',       key: 'insights'      },
  { label: 'Alle 6 E-Learnings komplett',    value: '+10% Bonus', key: 'bonus'         },
  { label: 'Maximaler Score',               value: '100%',       key: 'max'           },
];

/* ───────────────────── SVG Progress Ring ────────────────────── */
function ScoreRing({ score, size = 200, stroke = 10 }) {
  const radius = (size - stroke) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (score / 100) * circumference;

  const color = score >= 60
    ? 'var(--ki-success)'
    : score >= 30
      ? 'var(--ki-warning)'
      : 'var(--ki-red)';

  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="var(--ki-border)"
        strokeWidth={stroke}
      />
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={color}
        strokeWidth={stroke}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        style={{ transition: 'stroke-dashoffset 1.5s cubic-bezier(0.22, 1, 0.36, 1)' }}
      />
    </svg>
  );
}

/* ════════════════════════ HAUPTKOMPONENTE ════════════════════ */
export default function MarktwertClient({ profile, log, progress, courses, userId }) {
  const score = calculateMarktwertScore(progress, courses);
  const animatedScore = useCountUp(score, 1800);

  /* ── Welche Zertifikate hat der User? ── */
  const completedCourseKeys = new Set();
  (courses || []).forEach(c => {
    const totalLessons = (c.modules || []).reduce((s, m) => s + (m.lessons?.length || 0), 0);
    if (totalLessons === 0) return;
    const completedLessons = (progress || []).filter(p =>
      (c.modules || []).some(m => (m.lessons || []).some(l => l.id === p.lesson_id))
    ).length;
    if (completedLessons >= totalLessons && c.slug) {
      completedCourseKeys.add(c.slug);
    }
  });

  const hasAnalysis = (progress || []).length > 0;
  const completedELearningCount = CERTIFICATES
    .filter(cert => cert.type === 'elearning' && completedCourseKeys.has(cert.key))
    .length;
  const allSixComplete = completedELearningCount >= 6;

  function isCertCompleted(cert) {
    if (cert.type === 'analyse') return hasAnalysis;
    if (cert.type === 'elearning') return completedCourseKeys.has(cert.key);
    if (cert.key === 'strukturgramm') return !!profile?.strukturgramm_done;
    if (cert.key === 'insights') return !!profile?.insights_done;
    return false;
  }

  function isBreakdownAchieved(item) {
    switch (item.key) {
      case 'analyse':       return hasAnalysis;
      case 'elearning':     return completedELearningCount > 0;
      case 'strukturgramm': return !!profile?.strukturgramm_done;
      case 'insights':      return !!profile?.insights_done;
      case 'bonus':         return allSixComplete;
      case 'max':           return score >= 100;
      default:              return false;
    }
  }

  const scoreColor = score >= 60
    ? 'var(--ki-success)'
    : score >= 30
      ? 'var(--ki-warning)'
      : 'var(--ki-red)';

  /* ────────────────────── RENDER ─────────────────────────── */
  return (
    <div className="page-container">

      {/* ═══ 1. HEADER ═══ */}
      <header className="animate-in" style={{ marginBottom: '2rem' }}>
        <h1 className="page-title" style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}>
          Dein Marktwert
          <InfoTooltip moduleId="marktwert" />
        </h1>
        <p className="page-subtitle">Entscheider erkennen deine Qualifikation</p>
      </header>

      {/* ═══ 2. HERO SCORE CARD ═══ */}
      <section
        className="card animate-in"
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          padding: '3rem 2rem',
          marginBottom: '2rem',
          textAlign: 'center',
        }}
      >
        <div style={{ position: 'relative', width: 200, height: 200, marginBottom: '1.5rem' }}>
          <ScoreRing score={score} />
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <span style={{
              fontSize: '3rem',
              fontWeight: 800,
              lineHeight: 1,
              color: scoreColor,
            }}>
              {animatedScore}%
            </span>
            <span style={{
              fontSize: '.85rem',
              color: 'var(--ki-text-secondary)',
              marginTop: '.25rem',
            }}>
              Marktwert
            </span>
          </div>
        </div>

        <p style={{
          fontSize: '1.1rem',
          color: 'var(--ki-text)',
          fontWeight: 600,
          maxWidth: 420,
        }}>
          Du hebst dich von <span style={{ color: scoreColor }}>{animatedScore}%</span> der Bewerber ab
        </p>
        <p style={{
          fontSize: '.875rem',
          color: 'var(--ki-text-tertiary)',
          marginTop: '.5rem',
          maxWidth: 480,
        }}>
          Basierend auf deinen abgeschlossenen Zertifikaten des Karriere-Instituts
        </p>
      </section>

      {/* ═══ 3. DEINE ZERTIFIKATE ═══ */}
      <section className="animate-in" style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--ki-text)',
          marginBottom: '1rem',
        }}>
          Deine Zertifikate
        </h2>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {CERTIFICATES.map((cert, i) => {
            const completed = isCertCompleted(cert);
            const isLast = i === CERTIFICATES.length - 1;

            let actionHref = '/masterclass';
            let actionLabel = 'Kurs starten →';
            if (cert.type === 'premium') {
              actionHref = '/masterclass';
              actionLabel = 'Buchen →';
            } else if (cert.type === 'analyse') {
              actionHref = '/karriereanalyse';
              actionLabel = 'Analyse starten →';
            }

            return (
              <div
                key={cert.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderBottom: isLast ? 'none' : '1px solid var(--ki-border)',
                  gap: '1rem',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '.75rem', flex: 1, minWidth: 0 }}>
                  <span style={{ fontSize: '1.2rem', flexShrink: 0 }}>
                    {completed ? '✅' : '🔒'}
                  </span>
                  <span style={{
                    fontWeight: 600,
                    color: completed ? 'var(--ki-text)' : 'var(--ki-text-tertiary)',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis',
                  }}>
                    {cert.label}
                  </span>
                </div>

                {completed ? (
                  <span className="pill pill-green" style={{ flexShrink: 0 }}>
                    Erworben
                  </span>
                ) : (
                  <a
                    href={actionHref}
                    className="btn btn-ghost"
                    style={{
                      fontSize: '.8rem',
                      padding: '.35rem .75rem',
                      flexShrink: 0,
                      whiteSpace: 'nowrap',
                    }}
                  >
                    {actionLabel}
                  </a>
                )}
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ 4. WARUM ZERTIFIKATE WICHTIG SIND ═══ */}
      <section className="animate-in" style={{ marginBottom: '2rem' }}>
        <div className="card" style={{
          background: 'var(--ki-bg-alt)',
          padding: '2rem',
        }}>
          <h2 style={{
            fontSize: '1.15rem',
            fontWeight: 700,
            color: 'var(--ki-text)',
            marginBottom: '.75rem',
          }}>
            Warum Zertifikate wichtig sind
          </h2>
          <p style={{
            color: 'var(--ki-text-secondary)',
            fontSize: '.95rem',
            lineHeight: 1.6,
            marginBottom: '1.25rem',
          }}>
            Personalentscheider suchen nach Kandidaten die in ihre Weiterentwicklung investieren.
          </p>

          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '.65rem' }}>
            {[
              'Eigeninitiative & Lernbereitschaft',
              'Nachgewiesene Kompetenz im Bereich',
              'Professionelle Weiterbildung',
              'Über 11.000 Mitglieder vertrauen dem Institut',
            ].map((text) => (
              <li
                key={text}
                style={{
                  display: 'flex',
                  alignItems: 'flex-start',
                  gap: '.6rem',
                  fontSize: '.9rem',
                  color: 'var(--ki-text)',
                }}
              >
                <span style={{ color: 'var(--ki-success)', fontWeight: 700, flexShrink: 0 }}>✓</span>
                <span>{text}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* ═══ 5. WIE DEIN SCORE BERECHNET WIRD ═══ */}
      <section className="animate-in" style={{ marginBottom: '2rem' }}>
        <h2 style={{
          fontSize: '1.25rem',
          fontWeight: 700,
          color: 'var(--ki-text)',
          marginBottom: '1rem',
        }}>
          Wie dein Score berechnet wird
        </h2>

        <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
          {SCORE_BREAKDOWN.map((item, i) => {
            const achieved = isBreakdownAchieved(item);
            const isMax = item.key === 'max';
            const isLast = i === SCORE_BREAKDOWN.length - 1;

            return (
              <div
                key={item.key}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '1rem 1.25rem',
                  borderBottom: isLast ? 'none' : '1px solid var(--ki-border)',
                  background: isMax ? 'var(--ki-bg-alt)' : 'transparent',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '.65rem' }}>
                  {!isMax && (
                    <span style={{
                      width: 22,
                      height: 22,
                      borderRadius: 'var(--r-md)',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      fontSize: '.75rem',
                      fontWeight: 700,
                      background: achieved ? 'var(--ki-success)' : 'var(--grey-5)',
                      color: achieved ? '#fff' : 'var(--ki-text-tertiary)',
                      flexShrink: 0,
                    }}>
                      {achieved ? '✓' : '–'}
                    </span>
                  )}
                  <span style={{
                    fontWeight: isMax ? 700 : 500,
                    color: 'var(--ki-text)',
                    fontSize: isMax ? '.95rem' : '.9rem',
                  }}>
                    {item.label}
                  </span>
                  {item.key === 'elearning' && completedELearningCount > 0 && (
                    <span className="pill pill-green" style={{ fontSize: '.7rem' }}>
                      {completedELearningCount}/6
                    </span>
                  )}
                </div>

                <span style={{
                  fontWeight: 700,
                  fontSize: '.9rem',
                  color: isMax
                    ? 'var(--ki-text)'
                    : achieved
                      ? 'var(--ki-success)'
                      : 'var(--ki-text-tertiary)',
                  whiteSpace: 'nowrap',
                }}>
                  {item.value}
                </span>
              </div>
            );
          })}
        </div>
      </section>

      {/* ═══ 6. DEIN ZERTIFIKATS-PORTFOLIO ═══ */}
      <section className="card animate-in" style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        textAlign: 'center',
        padding: '2.5rem 2rem',
        marginBottom: '2rem',
      }}>
        <h2 style={{
          fontSize: '1.15rem',
          fontWeight: 700,
          color: 'var(--ki-text)',
          marginBottom: '.5rem',
        }}>
          Dein Zertifikats-Portfolio
        </h2>
        <p style={{
          color: 'var(--ki-text-secondary)',
          fontSize: '.875rem',
          marginBottom: '1.5rem',
          maxWidth: 400,
        }}>
          Lade deine gesammelten Zertifikate als PDF herunter oder teile deinen Fortschritt auf LinkedIn.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <button
            className="btn btn-primary"
            onClick={() => alert('PDF-Download wird bald verfügbar sein.')}
            style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="7 10 12 15 17 10" />
              <line x1="12" y1="15" x2="12" y2="3" />
            </svg>
            PDF herunterladen
          </button>

          <button
            className="btn btn-secondary"
            onClick={() => alert('LinkedIn-Teilen wird bald verfügbar sein.')}
            style={{ display: 'flex', alignItems: 'center', gap: '.5rem' }}
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
              <polyline points="16 6 12 2 8 6" />
              <line x1="12" y1="2" x2="12" y2="15" />
            </svg>
            Auf LinkedIn teilen
          </button>
        </div>
      </section>
    </div>
  );
}
