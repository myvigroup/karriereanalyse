'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import InfoTooltip from '@/components/ui/InfoTooltip';

// ─── Hardcoded Analyse-Tools ──────────────────────────────────────────────────
const ANALYSE_TOOLS = [
  {
    id: 'strukturgramm',
    icon: '🔺',
    title: 'Strukturgramm®',
    subtitle: 'Erkenne deine Biostruktur',
    pricing: 'Online-Test + Coaching | Preis auf Anfrage',
    badge: '⭐ Premium',
    features: [
      'Persönlichkeitsstruktur wissenschaftlich analysieren',
      'Stärken & blinde Flecken erkennen',
      'Individuelles Coaching-Gespräch inklusive',
      'Biographische Analyse deiner Muster',
    ],
  },
  {
    id: 'insights-mdi',
    icon: '🔬',
    title: 'INSIGHTS MDI® EQ',
    subtitle: 'Emotionale Intelligenz verstehen',
    pricing: 'Test + Auswertung | 499€ pro Person',
    badge: '⭐ Premium',
    features: [
      'EQ-Profil mit internationalem Standard',
      'Verhaltens- & Motivationsanalyse',
      'Detaillierter Auswertungsbericht (40+ Seiten)',
      'Einsatz in Führung & Teamkommunikation',
    ],
  },
];

// ─── Hardcoded Seminare ───────────────────────────────────────────────────────
const SEMINARE = [
  {
    id: 'kommunikation',
    icon: '💬',
    title: 'Kommunikation Intensiv-Seminar',
    features: ['Klare & wirkungsvolle Gesprächsführung', 'Konflikte professionell lösen', 'Überzeugende Körpersprache'],
  },
  {
    id: 'work-life',
    icon: '⚖️',
    title: 'Work-Life-Balance Intensiv-Seminar',
    features: ['Energie & Ressourcen managen', 'Grenzen setzen ohne Schuldgefühle', 'Nachhaltige Erholung verstehen'],
  },
  {
    id: 'networking',
    icon: '🤝',
    title: 'Networking Intensiv-Seminar',
    features: ['Kontakte authentisch aufbauen', 'LinkedIn strategisch nutzen', 'Follow-up & Beziehungspflege'],
  },
  {
    id: 'speedreading',
    icon: '📖',
    title: 'Speedreading Intensiv-Seminar',
    features: ['Lesegeschwindigkeit verdoppeln', 'Texte gezielt selektieren', 'Wissen langfristig behalten'],
  },
  {
    id: 'typgerechtes-lernen',
    icon: '🧠',
    title: 'Typgerechtes Lernen Intensiv-Seminar',
    features: ['Lerntyp erkennen & nutzen', 'Lernmethoden passend anpassen', 'Motivation dauerhaft sichern'],
  },
  {
    id: 'prioritaetenmanagement',
    icon: '🎯',
    title: 'Prioritätenmanagement Intensiv-Seminar',
    features: ['Wichtiges von Dringendem trennen', 'Fokus trotz Unterbrechungen halten', 'Produktivitätssysteme einführen'],
  },
];

// ─── Milestone helper ─────────────────────────────────────────────────────────
function getMilestone(completed) {
  if (completed >= 6) return { label: 'Gold 🥇', next: null };
  if (completed >= 3) return { label: 'Silber 🥈', next: 6 };
  if (completed >= 1) return { label: 'Bronze 🥉', next: 3 };
  return { label: null, next: 1 };
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MasterclassClient({ courses, progress, analysisResults, profile }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('alle');

  // Build a Set of completed lesson IDs
  const completedSet = useMemo(
    () => new Set((progress || []).filter((p) => p.completed).map((p) => p.lesson_id)),
    [progress]
  );

  // Enrich E-Learning courses with progress + PRIO flag
  const eLearnings = useMemo(() => {
    return (courses || [])
      .filter((c) => !c.category || c.category === 'E-Learning' || c.category === 'e-learning')
      .map((c) => {
        const total = (c.modules || []).reduce((s, m) => s + (m.lessons || []).length, 0);
        const done = (c.modules || []).reduce(
          (s, m) => s + (m.lessons || []).filter((l) => completedSet.has(l.id)).length,
          0
        );
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;

        // PRIO: find analysis result linked to this course's competency
        const result = (analysisResults || []).find(
          (r) => r.field_id === c.competency_link || r.field_id === c.competency_field_id
        );
        const isPrio = result && result.score < 50;

        return { ...c, total, done, pct, isPrio };
      });
  }, [courses, completedSet, analysisResults]);

  // Find in-progress course for "Weiterlernen" banner
  const inProgressCourse = useMemo(
    () => eLearnings.find((c) => c.pct > 0 && c.pct < 100) || null,
    [eLearnings]
  );

  // XP: each completed lesson = 10 XP
  const totalCompletedLessons = eLearnings.reduce((s, c) => s + c.done, 0);
  const completedCourses = eLearnings.filter((c) => c.pct === 100).length;
  const xp = totalCompletedLessons * 10;
  const milestone = getMilestone(completedCourses);

  const tabs = [
    { key: 'alle', label: 'Alle' },
    { key: 'e-learnings', label: 'E-Learnings' },
    { key: 'analyse-tools', label: 'Analyse-Tools' },
    { key: 'seminare', label: 'Seminare' },
  ];

  const showELearnings = activeTab === 'alle' || activeTab === 'e-learnings';
  const showAnalyse = activeTab === 'alle' || activeTab === 'analyse-tools';
  const showSeminare = activeTab === 'alle' || activeTab === 'seminare';

  return (
    <div className="page-container">
      {/* ── Title ── */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Masterclass</h1>
        <InfoTooltip moduleId="masterclass" profile={profile} />
      </div>
      <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', marginBottom: 28 }}>
        Lerne in deinem eigenen Tempo — E-Learnings, Analyse-Tools & Live-Seminare.
      </p>

      {/* ── Tabs ── */}
      <div
        style={{
          display: 'flex',
          gap: 8,
          marginBottom: 32,
          overflowX: 'auto',
          paddingBottom: 4,
          scrollbarWidth: 'none',
        }}
      >
        {tabs.map((t) => (
          <button
            key={t.key}
            className={`btn ${activeTab === t.key ? 'btn-primary' : 'btn-secondary'}`}
            style={{ fontSize: 13, padding: '8px 18px', whiteSpace: 'nowrap', flexShrink: 0 }}
            onClick={() => setActiveTab(t.key)}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── No Analysis Banner ── */}
      {!analysisResults || analysisResults.length === 0 ? (
        <div
          className="card animate-in"
          style={{
            marginBottom: 32,
            padding: 24,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            borderLeft: '3px solid var(--ki-warning)',
          }}
        >
          <div style={{ fontSize: 36 }}>🩸</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 4 }}>
              Mach zuerst dein Karriere-Blutbild
            </div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>
              Finde heraus, welche Kurse für dich wirklich Priorität haben — basierend auf deinen
              Kompetenz-Scores.
            </div>
            <a href="/analyse" className="btn btn-primary" style={{ fontSize: 13, padding: '8px 18px' }}>
              Analyse starten →
            </a>
          </div>
        </div>
      ) : null}

      {/* ── Weiterlernen Banner ── */}
      {inProgressCourse && showELearnings && (
        <div
          className="card animate-in"
          style={{
            marginBottom: 32,
            padding: 20,
            display: 'flex',
            alignItems: 'center',
            gap: 20,
            background: 'var(--ki-bg-alt)',
            border: '1px solid var(--ki-border)',
          }}
        >
          <div style={{ fontSize: 40, flexShrink: 0 }}>{inProgressCourse.icon || '📚'}</div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', fontWeight: 500, marginBottom: 2 }}>
              Weiterlernen
            </div>
            <div style={{ fontWeight: 700, fontSize: 16, marginBottom: 8, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
              {inProgressCourse.title}
            </div>
            <div className="progress-bar" style={{ marginBottom: 4 }}>
              <div
                className="progress-bar-fill"
                style={{ width: `${inProgressCourse.pct}%` }}
              />
            </div>
            <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>
              {inProgressCourse.done} / {inProgressCourse.total} Lektionen &mdash; {inProgressCourse.pct}%
            </div>
          </div>
          <a
            href={`/masterclass/${inProgressCourse.id}`}
            className="btn btn-primary"
            style={{ fontSize: 13, padding: '10px 20px', flexShrink: 0 }}
          >
            Fortfahren →
          </a>
        </div>
      )}

      {/* ── E-Learnings Section ── */}
      {showELearnings && (
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            📚 E-Learnings
            <span className="pill pill-grey" style={{ fontSize: 12 }}>
              {eLearnings.length} Kurse
            </span>
          </h2>
          {eLearnings.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--ki-text-secondary)' }}>
              Keine E-Learnings verfügbar.
            </div>
          ) : (
            <div className="grid-3">
              {eLearnings.map((course, i) => (
                <a
                  key={course.id}
                  href={`/masterclass/${course.id}`}
                  className="card animate-in"
                  style={{
                    textDecoration: 'none',
                    color: 'inherit',
                    position: 'relative',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    animationDelay: `${i * 0.05}s`,
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* PRIO Badge */}
                  {course.isPrio && (
                    <span
                      className="pill pill-red"
                      style={{ position: 'absolute', top: 12, right: 12, fontSize: 11, fontWeight: 700 }}
                    >
                      ⚡ PRIO
                    </span>
                  )}

                  {/* Icon */}
                  <div style={{ fontSize: 40, marginBottom: 12 }}>{course.icon || '📘'}</div>

                  {/* Title & Subtitle */}
                  <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', marginBottom: 4 }}>
                    {course.title}
                  </div>
                  {course.description && (
                    <div
                      style={{
                        fontSize: 13,
                        color: 'var(--ki-text-secondary)',
                        marginBottom: 12,
                        lineHeight: 1.5,
                        flex: 1,
                      }}
                    >
                      {course.description}
                    </div>
                  )}

                  {/* Module count */}
                  <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginBottom: 12 }}>
                    {(course.modules || []).length} Module &bull; {course.total} Lektionen
                  </div>

                  {/* Progress bar */}
                  <div className="progress-bar" style={{ marginBottom: 6 }}>
                    <div
                      className="progress-bar-fill"
                      style={{
                        width: `${course.pct}%`,
                        background: course.pct === 100 ? 'var(--ki-success)' : 'var(--ki-red)',
                      }}
                    />
                  </div>
                  <div
                    style={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: 12,
                      color: 'var(--ki-text-secondary)',
                    }}
                  >
                    <span>
                      {course.done}/{course.total} abgeschlossen
                    </span>
                    <span style={{ fontWeight: 600, color: course.pct === 100 ? 'var(--ki-success)' : 'var(--ki-text)' }}>
                      {course.pct}%
                    </span>
                  </div>
                </a>
              ))}
            </div>
          )}
        </section>
      )}

      {/* ── Analyse-Tools Section ── */}
      {showAnalyse && (
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            🔍 Analyse-Tools
            <span className="pill pill-gold" style={{ fontSize: 12 }}>
              Premium
            </span>
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
            {ANALYSE_TOOLS.map((tool, i) => (
              <div
                key={tool.id}
                className="card animate-in"
                style={{
                  border: '1.5px solid rgba(212,160,23,0.3)',
                  background: 'linear-gradient(135deg, var(--ki-card) 0%, rgba(212,160,23,0.03) 100%)',
                  animationDelay: `${i * 0.08}s`,
                  display: 'flex',
                  gap: 24,
                  alignItems: 'flex-start',
                }}
              >
                {/* Icon */}
                <div style={{ fontSize: 48, flexShrink: 0 }}>{tool.icon}</div>

                {/* Content */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 4, flexWrap: 'wrap' }}>
                    <span style={{ fontWeight: 700, fontSize: 20, letterSpacing: '-0.02em' }}>{tool.title}</span>
                    <span className="pill pill-gold" style={{ fontSize: 12 }}>{tool.badge}</span>
                  </div>
                  <div style={{ fontSize: 15, color: 'var(--ki-text-secondary)', marginBottom: 4 }}>
                    {tool.subtitle}
                  </div>
                  <div style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', marginBottom: 16 }}>
                    {tool.pricing}
                  </div>

                  {/* Features */}
                  <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 6 }}>
                    {tool.features.map((f, fi) => (
                      <li key={fi} style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}>
                        <span style={{ color: 'var(--ki-warning)', flexShrink: 0 }}>✓</span>
                        {f}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* CTA */}
                <div style={{ flexShrink: 0, alignSelf: 'center' }}>
                  <a href="/angebote" className="btn btn-primary" style={{ fontSize: 13, padding: '10px 22px' }}>
                    Buchen →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Seminare Section ── */}
      {showSeminare && (
        <section style={{ marginBottom: 48 }}>
          <h2
            style={{
              fontSize: 22,
              fontWeight: 700,
              letterSpacing: '-0.03em',
              marginBottom: 16,
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}
          >
            🎓 Seminare
            <span className="pill pill-green" style={{ fontSize: 12 }}>
              Live
            </span>
          </h2>
          <div className="grid-2">
            {SEMINARE.map((seminar, i) => (
              <div
                key={seminar.id}
                className="card animate-in"
                style={{
                  animationDelay: `${i * 0.06}s`,
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 12,
                }}
              >
                {/* Header */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                    <span style={{ fontSize: 32 }}>{seminar.icon}</span>
                    <span style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', lineHeight: 1.3 }}>
                      {seminar.title}
                    </span>
                  </div>
                  <span className="pill pill-green" style={{ fontSize: 11, flexShrink: 0 }}>Live</span>
                </div>

                {/* Meta */}
                <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
                  📅 Samstags &nbsp;|&nbsp; ⏰ 09:30 – 12:00 &nbsp;|&nbsp; Ab 99€
                </div>

                {/* Features */}
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 4 }}>
                  {seminar.features.map((f, fi) => (
                    <li key={fi} style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'flex', gap: 8 }}>
                      <span style={{ color: 'var(--ki-success)', flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* CTA */}
                <a
                  href="/angebote"
                  className="btn btn-secondary"
                  style={{ fontSize: 13, padding: '9px 18px', marginTop: 4, alignSelf: 'flex-start' }}
                >
                  Buchen →
                </a>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* ── Progress Footer ── */}
      {showELearnings && (
        <div
          className="card"
          style={{
            padding: '20px 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            gap: 16,
            flexWrap: 'wrap',
            background: 'var(--ki-bg-alt)',
            border: '1px solid var(--ki-border)',
          }}
        >
          <div style={{ display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap' }}>
            <span style={{ fontWeight: 600, fontSize: 15 }}>
              E-Learnings: {completedCourses}/{eLearnings.length || 6} abgeschlossen
            </span>
            <span style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
              +{xp} XP gesammelt
            </span>
          </div>
          <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexWrap: 'wrap' }}>
            <span
              className={`pill ${completedCourses >= 1 ? 'pill-gold' : 'pill-grey'}`}
              style={{ fontSize: 12 }}
            >
              🥉 1/6 Bronze
            </span>
            <span
              className={`pill ${completedCourses >= 3 ? 'pill-gold' : 'pill-grey'}`}
              style={{ fontSize: 12 }}
            >
              🥈 3/6 Silber
            </span>
            <span
              className={`pill ${completedCourses >= 6 ? 'pill-gold' : 'pill-grey'}`}
              style={{ fontSize: 12 }}
            >
              🥇 6/6 Gold
            </span>
          </div>
        </div>
      )}
    </div>
  );
}
