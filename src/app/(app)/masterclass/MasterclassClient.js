'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { berechnePersonalisierung } from '@/lib/personalization';

// ─── Hardcoded Analyse-Tools ──────────────────────────────────────────────────
const ANALYSE_TOOLS = [
  {
    id: 'strukturgramm',
    icon: '🔺',
    title: 'Strukturgramm®',
    subtitle: 'Erkenne deine Biostruktur',
    pricing: 'Online-Test + Coaching | Preis auf Anfrage',
    badge: '⭐ Premium',
    link: 'https://www.daskarriereinstitut.de/de/e/structogram-82?uId=2',
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
    link: 'https://www.daskarriereinstitut.de/de/e/insights-mdi-trimetrix-eq-analyse-und-auswertungsgespr%C3%A4ch-94?uId=2',
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
    id: 'sem-achtsamkeit', icon: '\u{1F9D8}',
    title: 'Achtsamkeit',
    subtitle: 'Gelassenheit ist trainierbar',
    description: 'Nur selten nimmt man sich neben dem Beruf und reiz\u00FCberfluteten Alltag Zeit f\u00FCr sich und die eigenen Bed\u00FCrfnisse.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
  {
    id: 'sem-homeoffice', icon: '\u{1F3E0}',
    title: 'Arbeiten aus dem Home Office',
    subtitle: 'Effizient arbeiten, flexibel leben',
    description: 'Strategien und Impulse, um auch von zu Hause aus ausgeglichen und effektiv deiner Arbeit nachzugehen.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
  {
    id: 'sem-knigge', icon: '\u{1F454}',
    title: 'Business Knigge',
    subtitle: 'Der erste Eindruck z\u00E4hlt, der zweite bleibt',
    description: 'Die richtigen Formen und Kommunikationsf\u00E4higkeiten im Berufs- und Gesch\u00E4ftsumfeld.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
  {
    id: 'sem-kommunikation', icon: '\u{1F4AC}',
    title: 'Kommunikation',
    subtitle: 'Verst\u00E4ndigung als Schl\u00FCssel zum Erfolg',
    description: 'Effektive Kommunikation mit Kollegen und Gesch\u00E4ftspartnern.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
  {
    id: 'sem-konflikt', icon: '\u{1F91C}',
    title: 'Konfliktmanagement',
    subtitle: 'Aus Krisen Chancen machen',
    description: 'Strategien und Techniken zur erfolgreichen Konfliktbew\u00E4ltigung.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
  {
    id: 'sem-motivation', icon: '\u{1F525}',
    title: 'Selbstmotivation',
    subtitle: 'Dein Warum, dein Motor',
    description: 'Wie du dich effektiv motivierst, langfristig und diszipliniert an eigenen Zielen arbeitest.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
  {
    id: 'sem-networking', icon: '\u{1F91D}',
    title: 'Networking',
    subtitle: 'Kontakte kn\u00FCpfen, Vertrauen aufbauen',
    description: 'F\u00E4higkeiten im Aufbau und der Pflege von beruflichen Beziehungen verbessern.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
  {
    id: 'sem-leadership', icon: '\u{1F451}',
    title: 'Personal Leadership',
    subtitle: 'Authentisch f\u00FChren, wirksam bleiben',
    description: 'Wie du aus W\u00FCnschen echte Ziele machst und diese erreichen kannst.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
  {
    id: 'sem-prioritaeten', icon: '\u{1F3AF}',
    title: 'Priorit\u00E4tenmanagement',
    subtitle: 'Nicht alles gleichzeitig, sondern das Richtige zuerst',
    description: 'Bewusster Umgang mit unserer Zeit als Schl\u00FCssel zum beruflichen Erfolg.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
  {
    id: 'sem-rhetorik', icon: '\u{1F3A4}',
    title: 'Rhetorik, Dialektik, Kinesik',
    subtitle: '\u00DCberzeugen mit Worten und Wirkung',
    description: 'Wirkungsvoll, passend und adressatengerecht kommunizieren in jeder Situation.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
  {
    id: 'sem-speedreading', icon: '\u{1F4D6}',
    title: 'Speedreading',
    subtitle: 'Geschwindigkeit trifft Verst\u00E4ndnis',
    description: 'Grundlagen des \u00FCberdurchschnittlich schnellen Lesens mit hohem Textverst\u00E4ndnis.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
  {
    id: 'sem-typgerecht', icon: '\u{1F9E0}',
    title: 'Typgerechtes Lernen',
    subtitle: 'Finde deinen Weg zum Wissen',
    description: 'Warum lernen, denken und vergessen wir unterschiedlich? Was motiviert uns zum Lernen?',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
  {
    id: 'sem-worklife', icon: '\u2696\uFE0F',
    title: 'Work-Life-Balance',
    subtitle: 'Gesundheit trifft Leistung',
    description: 'Ausgewogene Balance zwischen beruflichen und privaten Verpflichtungen.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
];

// ─── MS Teams Live helper ─────────────────────────────────────────────────────
function isSeminarLive(nextDate) {
  if (!nextDate) return false;
  const now = new Date();
  const seminar = new Date(nextDate);
  const isSameDay = now.toDateString() === seminar.toDateString();
  const hour = now.getHours();
  return isSameDay && hour >= 9 && (hour < 12 || (hour === 12 && now.getMinutes() <= 30));
}

// ─── Milestone helper ─────────────────────────────────────────────────────────
function getMilestone(completed) {
  if (completed >= 6) return { label: 'Gold 🥇', next: null };
  if (completed >= 3) return { label: 'Silber 🥈', next: 6 };
  if (completed >= 1) return { label: 'Bronze 🥉', next: 3 };
  return { label: null, next: 1 };
}

// ─── Course Card ─────────────────────────────────────────────────────────────
function CourseCard({ course, i, hasAnalyseData }) {
  return (
    <a
      href={`/masterclass/${course.id}`}
      className="card animate-in"
      style={{
        textDecoration: 'none', color: 'inherit', position: 'relative', overflow: 'hidden',
        cursor: 'pointer', animationDelay: `${(i || 0) * 0.05}s`, display: 'flex', flexDirection: 'column',
      }}
    >
      {course.isTopEmpfehlung ? (
        <span className="pill pill-red" style={{ position: 'absolute', top: 12, right: 12, fontSize: 11, fontWeight: 700 }}>#1 Empfehlung</span>
      ) : course.isPrio ? (
        <span className="pill pill-gold" style={{ position: 'absolute', top: 12, right: 12, fontSize: 11, fontWeight: 700 }}>2x XP</span>
      ) : null}
      <div style={{ fontSize: 36, marginBottom: 10 }}>{course.icon || '📘'}</div>
      <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em', marginBottom: 4 }}>{course.title}</div>
      {course.description && <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginBottom: 10, lineHeight: 1.5, flex: 1 }}>{course.description}</div>}
      {course.empfehlung && hasAnalyseData && <div style={{ fontSize: 11, color: 'var(--ki-text-secondary)', marginBottom: 8, lineHeight: 1.4, fontStyle: 'italic' }}>{course.empfehlung}</div>}
      <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', marginBottom: 10 }}>
        {(course.modules || []).length} Module &bull; {course.total} Lektionen{course.isPrio ? ' • 2x XP' : ''}
      </div>
      <div className="progress-bar" style={{ marginBottom: 4 }}>
        <div className="progress-bar-fill" style={{ width: `${course.pct}%`, background: course.pct === 100 ? 'var(--ki-success)' : 'var(--ki-red)' }} />
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 11, color: 'var(--ki-text-secondary)' }}>
        <span>{course.done}/{course.total}</span>
        <span style={{ fontWeight: 600, color: course.pct === 100 ? 'var(--ki-success)' : 'var(--ki-text)' }}>{course.pct}%</span>
      </div>
    </a>
  );
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

  // Personalisierung berechnen
  const personalisierung = useMemo(
    () => berechnePersonalisierung(analysisResults, profile?.phase),
    [analysisResults, profile?.phase]
  );

  // Relevanz-Map: kursId → {relevanz, istSchwaeche, empfehlung, rang}
  const relevanzMap = useMemo(() => {
    const map = {};
    (personalisierung.empfohleneKurse || []).forEach((k, i) => {
      map[k.kursId] = { relevanz: k.relevanz, istSchwaeche: k.istSchwaeche, empfehlung: k.empfehlung, rang: i };
    });
    return map;
  }, [personalisierung]);

  // Enrich E-Learning courses with progress + Relevanz-Sortierung
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

        const rel = relevanzMap[c.id];
        const isPrio = rel?.istSchwaeche || false;
        const isTopEmpfehlung = rel?.rang === 0 && analysisResults?.length > 0;

        return { ...c, total, done, pct, isPrio, isTopEmpfehlung, relevanz: rel?.relevanz ?? 0, empfehlung: rel?.empfehlung || '' };
      })
      // Sortiere nach Relevanz (höchste zuerst), falls Analyse vorhanden
      .sort((a, b) => {
        if (!analysisResults || analysisResults.length === 0) return 0;
        return b.relevanz - a.relevanz;
      });
  }, [courses, completedSet, analysisResults, relevanzMap]);

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

      {/* ── E-Learnings Section (3 Kategorien) ── */}
      {showELearnings && (() => {
        const hasAnalyseData = analysisResults && analysisResults.length > 0;
        // Kategorisiere: Fokus (Schwächen), Booster (mittel), Stärken (hoch)
        const fokusKurse = hasAnalyseData ? eLearnings.filter(c => c.isPrio || c.isTopEmpfehlung) : [];
        const staerkenKurse = hasAnalyseData ? eLearnings.filter(c => !c.isPrio && !c.isTopEmpfehlung && c.relevanz < 20) : [];
        const boosterKurse = hasAnalyseData ? eLearnings.filter(c => !fokusKurse.includes(c) && !staerkenKurse.includes(c)) : eLearnings;

        const CategorySection = ({ title, badge, badgeClass, description, items }) => {
          if (items.length === 0) return null;
          return (
            <div style={{ marginBottom: 32 }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
                <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em' }}>{title}</h3>
                <span className={`pill ${badgeClass}`} style={{ fontSize: 11 }}>{badge}</span>
              </div>
              {description && <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>{description}</p>}
              <div className="grid-3">
                {items.map((course, i) => (
                  <CourseCard key={course.id} course={course} i={i} hasAnalyseData={hasAnalyseData} />
                ))}
              </div>
            </div>
          );
        };

        return (
          <section style={{ marginBottom: 48 }}>
            <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
              📚 E-Learnings
              <span className="pill pill-grey" style={{ fontSize: 12 }}>{eLearnings.length} Kurse</span>
            </h2>

            {eLearnings.length === 0 ? (
              <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--ki-text-secondary)' }}>
                Keine E-Learnings verfügbar.
              </div>
            ) : hasAnalyseData ? (
              <>
                <CategorySection title="Dein Fokus" badge="Höchste Relevanz" badgeClass="pill-red" description="Hier liegt dein größtes Wachstumspotenzial — 2x XP!" items={fokusKurse} />
                <CategorySection title="Karriere-Booster" badge="Empfohlen" badgeClass="pill-gold" items={boosterKurse} />
                <CategorySection title="Deine Stärken" badge="Solide" badgeClass="pill-green" description="Bereits gut — verfeinere dein Können." items={staerkenKurse} />
              </>
            ) : (
              <div className="grid-3">
                {eLearnings.map((course, i) => (
                  <CourseCard key={course.id} course={course} i={i} hasAnalyseData={false} />
                ))}
              </div>
            )}
          </section>
        );
      })()}

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
                  <a href={tool.link || '/angebote'} target={tool.link ? '_blank' : undefined} rel={tool.link ? 'noopener noreferrer' : undefined} className="btn btn-primary" style={{ fontSize: 13, padding: '10px 22px' }}>
                    Mehr erfahren →
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
                    <div>
                      <div style={{ fontWeight: 700, fontSize: 16, letterSpacing: '-0.02em', lineHeight: 1.3 }}>{seminar.title}</div>
                      <div style={{ fontSize: 13, color: 'var(--ki-red)', fontWeight: 500 }}>{seminar.subtitle}</div>
                    </div>
                  </div>
                  <span className="pill pill-green" style={{ fontSize: 11, flexShrink: 0 }}>Live</span>
                </div>

                {/* Description */}
                <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.5 }}>{seminar.description}</p>

                {/* Meta */}
                <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', display: 'flex', gap: 6, flexWrap: 'wrap', alignItems: 'center' }}>
                  <span>{'\u{1F4C5}'} Samstags</span>
                  <span>|</span>
                  <span>{'\u23F0'} 09:30 \u2013 12:00</span>
                  <span>|</span>
                  <span style={{ fontWeight: 600, color: 'var(--ki-text)' }}>Ab 99\u20AC</span>
                </div>

                {/* Includes */}
                <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>
                  Inkl. Arbeitsmaterialien + Teilnahme-Zertifikat
                </div>

                {/* CTA + Teams Button */}
                <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                  <a
                    href="/angebote"
                    className="btn btn-secondary"
                    style={{ fontSize: 13, padding: '9px 18px' }}
                  >
                    Buchen →
                  </a>
                  {isSeminarLive(seminar.next_date) ? (
                    <a
                      href={seminar.teams_link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="btn btn-primary"
                      style={{
                        fontSize: 13, padding: '9px 18px',
                        background: '#CC1426',
                        animation: 'pulse 1.5s ease-in-out infinite',
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                      }}
                    >
                      {'\uD83D\uDD34'} JETZT LIVE — Teilnehmen
                    </a>
                  ) : (
                    <span
                      style={{
                        fontSize: 12, padding: '9px 14px',
                        borderRadius: 'var(--r-md)',
                        background: 'var(--ki-bg-alt)',
                        color: 'var(--ki-text-tertiary)',
                        display: 'inline-flex', alignItems: 'center', gap: 6,
                        border: '1px solid var(--ki-border)',
                      }}
                    >
                      {'\u{1F4BB}'} {seminar.next_date
                        ? `N\u00E4chster Termin: ${new Date(seminar.next_date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })}`
                        : 'Termin folgt'}
                    </span>
                  )}
                </div>
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
