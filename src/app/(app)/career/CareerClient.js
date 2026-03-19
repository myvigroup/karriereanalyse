'use client';

import { useState } from 'react';
import { LEVELS, getLevelProgress } from '@/lib/gamification';
import InfoTooltip from '@/components/ui/InfoTooltip';

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Inline styles for animations that cannot live in globals.css               */
/* ─────────────────────────────────────────────────────────────────────────── */
const pulseKeyframes = `
@keyframes ki-pulse-ring {
  0%   { box-shadow: 0 0 0 0   rgba(220,38,38,0.55); }
  70%  { box-shadow: 0 0 0 12px rgba(220,38,38,0);   }
  100% { box-shadow: 0 0 0 0   rgba(220,38,38,0);    }
}
@keyframes ki-hex-pulse {
  0%, 100% { box-shadow: 0 0 0 0 rgba(220,38,38,0.6); }
  50%       { box-shadow: 0 0 0 6px rgba(220,38,38,0); }
}
@keyframes ki-shimmer {
  0%   { background-position: -200% center; }
  100% { background-position:  200% center; }
}
`;

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Level meta: rewards & requirements per level                               */
/* ─────────────────────────────────────────────────────────────────────────── */
const LEVEL_META = {
  1: {
    requirements: ['Registrierung abgeschlossen', 'Profil angelegt'],
    rewards: ['Zugang zu Basis-Kursen', 'Karriereanalyse freischalten'],
  },
  2: {
    requirements: ['200 KI-Points', '1 Kurs gestartet'],
    rewards: ['Erweiterte Lernpfade', 'Community-Zugang'],
  },
  3: {
    requirements: ['500 KI-Points', '5 Lektionen abgeschlossen'],
    rewards: ['Coaching-Session-Rabatt 10%', 'Gehaltsrechner Premium'],
  },
  4: {
    requirements: ['1.200 KI-Points', 'Karriereanalyse abgeschlossen'],
    rewards: ['1:1 Strategiegespräch', 'Exklusive Masterclass-Inhalte'],
  },
  5: {
    requirements: ['2.500 KI-Points', '3 Zertifikate erworben'],
    rewards: ['Leadership-Programm', 'Netzwerk-Empfehlungen'],
  },
  6: {
    requirements: ['5.000 KI-Points', 'Alle Kurse abgeschlossen'],
    rewards: ['Executive-Coaching', 'C-Level Karriere-Paket'],
  },
};

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Helpers                                                                    */
/* ─────────────────────────────────────────────────────────────────────────── */
function getAllLessons(courses) {
  const lessons = [];
  (courses || []).forEach(course => {
    (course.modules || []).forEach(mod => {
      (mod.lessons || []).forEach(lesson => {
        lessons.push({ ...lesson, courseId: course.id, courseTitle: course.title });
      });
    });
  });
  return lessons;
}

function getFirstIncompleteCourse(courses, progress) {
  const completedIds = new Set((progress || []).filter(p => p.completed).map(p => p.lesson_id));
  for (const course of (courses || [])) {
    const allLessons = (course.modules || []).flatMap(m => m.lessons || []);
    const allDone = allLessons.length > 0 && allLessons.every(l => completedIds.has(l.id));
    if (!allDone && allLessons.length > 0) return course;
  }
  return null;
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Sub-components                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */

function StyleInjector() {
  return <style dangerouslySetInnerHTML={{ __html: pulseKeyframes }} />;
}

/* ── 1. Level Hero Card ─────────────────────────────────────────────────── */
function LevelHeroCard({ current, next, xp, levelPct }) {
  return (
    <div className="card" style={{ marginBottom: 32, display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
      {/* Animated current-level bubble */}
      <div style={{
        width: 80, height: 80, borderRadius: '50%',
        background: 'var(--ki-red)', color: 'white',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 36, flexShrink: 0,
        animation: 'ki-pulse-ring 2s ease-out infinite',
      }}>
        {current.icon}
      </div>

      <div style={{ flex: 1, minWidth: 160 }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 4 }}>
          Aktuelles Level
        </div>
        <div style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em' }}>
          {current.icon} Level {current.level} – {current.name}
        </div>
        <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginTop: 4 }}>
          {xp} KI-Points gesammelt
        </div>
      </div>

      {next ? (
        <div style={{ minWidth: 200 }}>
          <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 8 }}>
            Nächstes Level: {next.icon} {next.name}
          </div>
          <div className="progress-bar" style={{ marginBottom: 6 }}>
            <div className="progress-bar-fill" style={{ width: `${levelPct}%` }} />
          </div>
          <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 12, color: 'var(--ki-text-tertiary)' }}>
            <span>{xp} XP</span>
            <span>{next.minXP} XP</span>
          </div>
        </div>
      ) : (
        <span className="pill pill-green" style={{ fontSize: 13, padding: '6px 16px' }}>
          Maximales Level erreicht
        </span>
      )}
    </div>
  );
}

/* ── 2. Level Timeline ──────────────────────────────────────────────────── */
function LevelTimeline({ current }) {
  const [expanded, setExpanded] = useState(null);

  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 24 }}>
        Level-Timeline
      </h2>

      <div style={{ position: 'relative', paddingLeft: 52 }}>
        {/* Vertical connector line */}
        <div style={{
          position: 'absolute', left: 24, top: 36, bottom: 36, width: 2,
          background: 'linear-gradient(to bottom, var(--ki-red), var(--ki-border))',
          borderRadius: 2,
        }} />

        {LEVELS.map((level, i) => {
          const isActive = current.level === level.level;
          const isPast   = current.level > level.level;
          const isFuture = current.level < level.level;
          const isOpen   = expanded === level.level;
          const meta     = LEVEL_META[level.level] || { requirements: [], rewards: [] };

          return (
            <div
              key={level.level}
              className={`animate-in delay-${Math.min(i + 1, 4)}`}
              style={{ marginBottom: 8 }}
            >
              {/* Row */}
              <div
                onClick={() => setExpanded(isOpen ? null : level.level)}
                style={{
                  display: 'flex', alignItems: 'center', gap: 16,
                  padding: '14px 16px 14px 0',
                  cursor: 'pointer',
                  borderRadius: 'var(--r-md)',
                  transition: 'background var(--t-fast)',
                }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--ki-bg-alt)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {/* Node circle */}
                <div style={{
                  width: 48, height: 48, borderRadius: '50%',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 22, flexShrink: 0,
                  position: 'relative', left: -40,
                  zIndex: 2,
                  background: isActive ? 'var(--ki-red)' : isPast ? 'var(--ki-success)' : 'var(--ki-bg-alt)',
                  color: isActive || isPast ? 'white' : 'var(--ki-text-tertiary)',
                  border: isActive ? '3px solid var(--ki-red)' : `2px solid ${isPast ? 'var(--ki-success)' : 'var(--ki-border)'}`,
                  boxShadow: isActive ? 'var(--sh-lg)' : 'none',
                  animation: isActive ? 'ki-pulse-ring 2.5s ease-out infinite' : 'none',
                  transform: isActive ? 'scale(1.15)' : 'scale(1)',
                  transition: 'transform var(--t-med)',
                }}>
                  {isPast ? '✓' : isFuture ? '🔒' : level.icon}
                </div>

                {/* Text */}
                <div style={{ flex: 1, marginLeft: -16 }}>
                  <div style={{
                    fontSize: isActive ? 17 : 15,
                    fontWeight: isActive ? 700 : 500,
                    color: isFuture ? 'var(--ki-text-tertiary)' : 'var(--ki-text)',
                  }}>
                    Level {level.level}: {level.name}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginTop: 2 }}>
                    Ab {level.minXP} KI-Points
                  </div>
                </div>

                {/* Badges */}
                <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                  {isActive && <span className="pill pill-red" style={{ fontSize: 11 }}>Aktuell</span>}
                  {isPast   && <span className="pill pill-green" style={{ fontSize: 11 }}>Erreicht</span>}
                  {isFuture && <span className="pill pill-grey" style={{ fontSize: 11 }}>Gesperrt</span>}
                  <span style={{ color: 'var(--ki-text-tertiary)', fontSize: 14, transition: 'transform var(--t-fast)', transform: isOpen ? 'rotate(90deg)' : 'rotate(0deg)' }}>›</span>
                </div>
              </div>

              {/* Expandable detail panel */}
              {isOpen && (
                <div style={{
                  marginLeft: 24, marginBottom: 8,
                  background: 'var(--ki-bg-alt)',
                  borderRadius: 'var(--r-md)',
                  padding: '16px 20px',
                  borderLeft: `3px solid ${isActive ? 'var(--ki-red)' : isPast ? 'var(--ki-success)' : 'var(--ki-border)'}`,
                }}>
                  <div className="grid-2" style={{ gap: 20 }}>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                        Voraussetzungen
                      </div>
                      {meta.requirements.map((r, idx) => (
                        <div key={idx} style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ color: isPast ? 'var(--ki-success)' : 'var(--ki-text-tertiary)' }}>
                            {isPast ? '✓' : '○'}
                          </span>
                          {r}
                        </div>
                      ))}
                    </div>
                    <div>
                      <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 8 }}>
                        Belohnungen
                      </div>
                      {meta.rewards.map((r, idx) => (
                        <div key={idx} style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
                          <span style={{ color: 'var(--ki-warning)' }}>★</span>
                          {r}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}

/* ── 3. Skill Tree (Hex Grid) ────────────────────────────────────────────── */
function SkillTree({ courses, progress }) {
  const completedIds = new Set((progress || []).filter(p => p.completed).map(p => p.lesson_id));

  // Flatten all lessons with course info for hex nodes
  const allLessons = getAllLessons(courses);

  // Determine which course is "recommended" (first incomplete)
  const firstIncomplete = getFirstIncompleteCourse(courses, progress);

  // Build course-level hex nodes
  const hexNodes = (courses || []).map(course => {
    const lessons = (course.modules || []).flatMap(m => m.lessons || []);
    const completedCount = lessons.filter(l => completedIds.has(l.id)).length;
    const total = lessons.length;
    const pct = total > 0 ? Math.round((completedCount / total) * 100) : 0;
    const isDone = total > 0 && completedCount === total;
    const isRecommended = firstIncomplete?.id === course.id;
    return { ...course, completedCount, total, pct, isDone, isRecommended };
  });

  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 8 }}>
        Skill-Tree
      </h2>
      <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 24 }}>
        Jeder Knoten steht für einen Kurs. Klicke, um direkt in den Kurs zu springen.
      </p>

      {hexNodes.length === 0 ? (
        <div className="card" style={{ textAlign: 'center', padding: 40, color: 'var(--ki-text-tertiary)' }}>
          Noch keine Kurse verfügbar.
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, 130px)',
          gap: '12px 8px',
          justifyContent: 'start',
        }}>
          {hexNodes.map((node, i) => {
            const offsetRow = i % 2 === 1;
            return (
              <a
                key={node.id}
                href={`/masterclass/${node.id}`}
                title={node.title}
                style={{
                  textDecoration: 'none',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                  marginTop: offsetRow ? 20 : 0,
                }}
              >
                {/* Hexagon shape via clip-path */}
                <div style={{
                  width: 90, height: 90,
                  clipPath: 'polygon(50% 0%, 93% 25%, 93% 75%, 50% 100%, 7% 75%, 7% 25%)',
                  background: node.isDone
                    ? 'var(--ki-red)'
                    : node.isRecommended
                      ? 'linear-gradient(135deg, var(--ki-red), var(--ki-warning))'
                      : 'var(--ki-bg-alt)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 28,
                  position: 'relative',
                  animation: node.isRecommended ? 'ki-hex-pulse 2s ease-in-out infinite' : 'none',
                  transition: 'filter var(--t-fast)',
                  filter: node.isDone ? 'none' : node.isRecommended ? 'none' : 'grayscale(40%)',
                  cursor: 'pointer',
                  border: node.isRecommended ? '2px solid var(--ki-red)' : 'none',
                }}>
                  <span style={{
                    fontSize: 26,
                    filter: (!node.isDone && !node.isRecommended) ? 'grayscale(100%) opacity(0.5)' : 'none',
                  }}>
                    {node.isDone ? '✓' : node.icon || '📚'}
                  </span>
                </div>

                {/* Label + mini progress */}
                <div style={{ marginTop: 8, textAlign: 'center', maxWidth: 110 }}>
                  <div style={{
                    fontSize: 11, fontWeight: 600,
                    color: node.isDone ? 'var(--ki-red)' : node.isRecommended ? 'var(--ki-text)' : 'var(--ki-text-tertiary)',
                    lineHeight: 1.3,
                    whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                    maxWidth: 110,
                  }}>
                    {node.title}
                  </div>
                  {node.total > 0 && (
                    <div style={{ fontSize: 10, color: 'var(--ki-text-tertiary)', marginTop: 2 }}>
                      {node.completedCount}/{node.total}
                    </div>
                  )}
                  {node.isRecommended && (
                    <span className="pill pill-red" style={{ fontSize: 9, marginTop: 4 }}>Empfohlen</span>
                  )}
                </div>
              </a>
            );
          })}
        </div>
      )}

      {/* Legend */}
      <div style={{ display: 'flex', gap: 20, marginTop: 24, flexWrap: 'wrap' }}>
        {[
          { color: 'var(--ki-red)', label: 'Abgeschlossen' },
          { color: 'var(--ki-warning)', label: 'Empfohlen / In Bearbeitung' },
          { color: 'var(--ki-bg-alt)', label: 'Noch offen' },
        ].map(item => (
          <div key={item.label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <div style={{ width: 12, height: 12, borderRadius: 2, background: item.color, border: '1px solid var(--ki-border)' }} />
            <span style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>{item.label}</span>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ── 4. Nächster Schritt Empfehlung ─────────────────────────────────────── */
function NextStepCard({ courses, progress, profile }) {
  const nextCourse = getFirstIncompleteCourse(courses, progress);
  const completedCourseCount = (courses || []).filter(course => {
    const completedIds = new Set((progress || []).filter(p => p.completed).map(p => p.lesson_id));
    const lessons = (course.modules || []).flatMap(m => m.lessons || []);
    return lessons.length > 0 && lessons.every(l => completedIds.has(l.id));
  }).length;

  const marketValueBoost = nextCourse ? Math.min(5 + completedCourseCount * 3, 25) : 0;

  if (!nextCourse) {
    return (
      <div className="card" style={{ marginBottom: 32, borderLeft: '4px solid var(--ki-success)', padding: '20px 24px' }}>
        <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ki-success)', marginBottom: 4 }}>
          Alle Kurse abgeschlossen
        </div>
        <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', margin: 0 }}>
          Hervorragend! Du hast alle verfügbaren Kurse abgeschlossen. Neue Inhalte kommen bald.
        </p>
      </div>
    );
  }

  const firstName = profile?.full_name?.split(' ')[0] || 'dir';

  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
        Nächster Schritt
      </h2>
      <div className="card" style={{
        borderLeft: '4px solid var(--ki-red)',
        padding: '20px 24px',
        background: `linear-gradient(135deg, var(--ki-bg-alt) 0%, transparent 100%)`,
      }}>
        <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-red)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 8 }}>
          Personalisierte Empfehlung
        </div>
        <p style={{ fontSize: 15, fontWeight: 500, margin: '0 0 8px' }}>
          Basierend auf deinem Profil empfehlen wir, {firstName}:
        </p>
        <div style={{
          display: 'flex', alignItems: 'center', gap: 12,
          background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)',
          padding: '12px 16px', marginBottom: 16,
          border: '1px solid var(--ki-border)',
        }}>
          <span style={{ fontSize: 24 }}>{nextCourse.icon || '📚'}</span>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700 }}>{nextCourse.title}</div>
            {nextCourse.description && (
              <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginTop: 2 }}>
                {nextCourse.description}
              </div>
            )}
          </div>
          <span className="pill pill-red" style={{ fontSize: 11 }}>Empfohlen</span>
        </div>

        <div style={{
          display: 'flex', alignItems: 'center', gap: 8,
          fontSize: 14, color: 'var(--ki-text-secondary)',
          padding: '10px 14px',
          background: 'rgba(245,158,11,0.08)',
          borderRadius: 'var(--r-sm)',
          border: '1px solid rgba(245,158,11,0.2)',
          marginBottom: 16,
        }}>
          <span style={{ color: 'var(--ki-warning)', fontSize: 18 }}>★</span>
          <span>
            Wenn du <strong style={{ color: 'var(--ki-text)' }}>{nextCourse.title}</strong> abschließt, erhöhst du deinen Marktwert um ca.{' '}
            <strong style={{ color: 'var(--ki-warning)' }}>~{marketValueBoost}%</strong>
          </span>
        </div>

        <a href={`/masterclass/${nextCourse.id}`} className="btn btn-primary" style={{ display: 'inline-block', fontSize: 14 }}>
          Kurs starten →
        </a>
      </div>
    </section>
  );
}

/* ── 5. Zertifikate-Galerie ──────────────────────────────────────────────── */
function CertificateGallery({ certificates }) {
  return (
    <section id="certificates" style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
        Zertifikate-Galerie
      </h2>

      {certificates.length > 0 ? (
        <div className="grid-3">
          {certificates.map((cert, i) => (
            <div
              key={cert.id}
              className={`card animate-in delay-${Math.min(i + 1, 4)}`}
              style={{ textAlign: 'center', padding: '28px 20px', position: 'relative', overflow: 'hidden' }}
            >
              {/* Shimmer background accent */}
              <div style={{
                position: 'absolute', inset: 0,
                background: 'linear-gradient(135deg, rgba(220,38,38,0.04) 0%, transparent 60%)',
                pointerEvents: 'none',
              }} />

              <div style={{ fontSize: 40, marginBottom: 12 }}>🏆</div>

              <div style={{
                fontSize: 11, fontWeight: 600, color: 'var(--ki-red)',
                textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6,
              }}>
                Zertifikat
              </div>
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6, lineHeight: 1.3 }}>
                {cert.title || cert.course_title || 'Kursabschluss'}
              </div>
              <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
                Ausgestellt am{' '}
                {new Date(cert.issued_at || cert.created_at).toLocaleDateString('de-DE', {
                  day: '2-digit', month: 'long', year: 'numeric',
                })}
              </div>

              <span className="pill pill-green" style={{ fontSize: 11, marginBottom: 16, display: 'inline-block' }}>
                Verifiziert
              </span>

              {cert.pdf_url ? (
                <div>
                  <a
                    href={cert.pdf_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ fontSize: 13, display: 'inline-block' }}
                  >
                    Download PDF
                  </a>
                </div>
              ) : (
                <div>
                  <button
                    className="btn"
                    style={{ fontSize: 13, opacity: 0.6, cursor: 'not-allowed' }}
                    disabled
                    title="PDF wird vorbereitet"
                  >
                    Download (bald)
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <div className="card" style={{ textAlign: 'center', padding: '48px 32px', color: 'var(--ki-text-tertiary)' }}>
          <div style={{ fontSize: 48, marginBottom: 16, opacity: 0.4 }}>🏆</div>
          <div style={{ fontSize: 16, fontWeight: 600, marginBottom: 8, color: 'var(--ki-text-secondary)' }}>
            Noch keine Zertifikate
          </div>
          <p style={{ fontSize: 14, margin: '0 0 20px' }}>
            Schließe Kurse vollständig ab, um Zertifikate zu erhalten.
          </p>
          <a href="/masterclass" className="btn btn-primary" style={{ fontSize: 14 }}>
            Kurse entdecken
          </a>
        </div>
      )}
    </section>
  );
}

/* ── 6. Fortschritts-Checkliste ─────────────────────────────────────────── */
function CheckItem({ done, label, sub, href }) {
  return (
    <a href={href} style={{
      display: 'flex', alignItems: 'center', gap: 12, padding: '12px 16px',
      borderRadius: 'var(--r-md)',
      background: done ? 'rgba(45,106,79,0.05)' : 'var(--ki-bg-alt)',
      textDecoration: 'none', color: 'inherit',
      transition: 'background var(--t-fast)',
      border: '1px solid transparent',
    }}
    onMouseEnter={e => { if (!done) e.currentTarget.style.borderColor = 'var(--ki-border)'; }}
    onMouseLeave={e => { e.currentTarget.style.borderColor = 'transparent'; }}
    >
      <span style={{
        width: 26, height: 26, borderRadius: '50%',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: 13, fontWeight: 700, flexShrink: 0,
        background: done ? 'var(--ki-success)' : 'var(--ki-border)',
        color: done ? 'white' : 'var(--ki-text-tertiary)',
      }}>
        {done ? '✓' : '○'}
      </span>
      <div style={{ flex: 1 }}>
        <div style={{
          fontSize: 14, fontWeight: 500,
          color: done ? 'var(--ki-success)' : 'var(--ki-text)',
          textDecoration: done ? 'line-through' : 'none',
        }}>
          {label}
        </div>
        <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>{sub}</div>
      </div>
      {!done && <span style={{ color: 'var(--ki-text-tertiary)', fontSize: 16 }}>›</span>}
    </a>
  );
}

/* ── 7. Video Platzhalter ───────────────────────────────────────────────── */
function VideoPlaceholder() {
  return (
    <section style={{ marginBottom: 40 }}>
      <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
        Dein Karrierepfad: Von Junior zu C-Level
      </h2>
      <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
        <div style={{
          position: 'relative', paddingTop: '56.25%', /* 16:9 */
          background: 'linear-gradient(135deg, #0f0f0f 0%, #1a1a1a 50%, #0f0f0f 100%)',
          cursor: 'pointer',
        }}>
          {/* Decorative background text */}
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 16, userSelect: 'none',
          }}>
            {/* Play button */}
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(220,38,38,0.9)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: 28, boxShadow: '0 8px 32px rgba(220,38,38,0.4)',
              transition: 'transform var(--t-fast)',
            }}>
              ▶
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 18, fontWeight: 700, color: 'white', marginBottom: 4 }}>
                Von Junior zu C-Level
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)' }}>
                Dein persönlicher Karrierepfad · 12 Min.
              </div>
            </div>
          </div>

          {/* Bottom label strip */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0, right: 0,
            padding: '10px 16px',
            background: 'linear-gradient(to top, rgba(0,0,0,0.8), transparent)',
            display: 'flex', alignItems: 'center', gap: 8,
          }}>
            <span className="pill pill-red" style={{ fontSize: 10 }}>Karriere Institut</span>
            <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.6)' }}>Exklusiver Inhalt für Premium-Mitglieder</span>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ─────────────────────────────────────────────────────────────────────────── */
/*  Main component                                                             */
/* ─────────────────────────────────────────────────────────────────────────── */
export default function CareerClient({ profile, progress, analysisSession, certificates, courses }) {
  const xp = profile?.xp || profile?.total_points || 0;
  const { current, next, progress: levelPct } = getLevelProgress(xp);

  const completedLessons  = (progress || []).filter(p => p.completed).length;
  const totalLessons      = (courses || []).reduce(
    (sum, c) => sum + (c.modules || []).reduce((s, m) => s + (m.lessons || []).length, 0), 0
  );
  const hasAnalysis = !!analysisSession;

  return (
    <div className="page-container animate-in">
      <StyleInjector />

      {/* Page header */}
      <div style={{ marginBottom: 36 }}>
        <h1 className="page-title">Karrierepfad <InfoTooltip moduleId="career" profile={profile} /></h1>
        <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', marginTop: 4 }}>
          Deine Reise vom Newcomer zum Executive – Level für Level.
        </p>
      </div>

      {/* Hero: current level + XP bar */}
      <LevelHeroCard current={current} next={next} xp={xp} levelPct={levelPct} />

      {/* Video teaser */}
      <VideoPlaceholder />

      {/* Nächster Schritt */}
      <NextStepCard courses={courses} progress={progress} profile={profile} />

      {/* Level Timeline */}
      <LevelTimeline current={current} />

      {/* Skill Tree */}
      <SkillTree courses={courses} progress={progress} />

      {/* Was fehlt noch (checklist) */}
      <section style={{ marginBottom: 40 }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 16 }}>
          Was fehlt noch?
        </h2>
        <div className="card" style={{ padding: '8px 0' }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4, padding: '8px 8px' }}>
            <CheckItem
              done={hasAnalysis}
              label="Karriereanalyse abschließen"
              sub={hasAnalysis ? `Score: ${Math.round(analysisSession.overall_score)}%` : '13 Kompetenzfelder bewerten'}
              href="/analyse"
            />
            <CheckItem
              done={completedLessons >= 5}
              label="5 Lektionen abschließen"
              sub={`${completedLessons} von ${Math.max(5, totalLessons)} erledigt`}
              href="/masterclass"
            />
            <CheckItem
              done={completedLessons >= totalLessons && totalLessons > 0}
              label="Alle Lektionen abschließen"
              sub={`${completedLessons}/${totalLessons} erledigt`}
              href="/masterclass"
            />
            <CheckItem
              done={(certificates || []).length > 0}
              label="Erstes Zertifikat erhalten"
              sub={(certificates || []).length > 0 ? `${certificates.length} Zertifikat(e) erworben` : 'Noch kein Zertifikat'}
              href="#certificates"
            />
          </div>
        </div>
      </section>

      {/* Zertifikate Galerie */}
      <CertificateGallery certificates={certificates || []} />
    </div>
  );
}
