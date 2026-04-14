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
    id: 'sem-typgerecht', icon: '🧠',
    title: 'Typgerechtes Lernen',
    subtitle: 'Finde deinen Weg zum Wissen',
    description: 'Warum lernen, denken und vergessen wir unterschiedlich? Was motiviert uns zum Lernen?',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: '2026-04-18',
  },
  {
    id: 'sem-worklife', icon: '⚖️',
    title: 'Work-Life-Balance',
    subtitle: 'Gesundheit trifft Leistung',
    description: 'Ausgewogene Balance zwischen beruflichen und privaten Verpflichtungen.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: '2026-05-09',
  },
  {
    id: 'sem-leadership', icon: '👑',
    title: 'Personal Leadership',
    subtitle: 'Authentisch führen, wirksam bleiben',
    description: 'Wie du aus Wünschen echte Ziele machst und diese erreichen kannst.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: '2026-06-13',
  },
  {
    id: 'sem-speedreading', icon: '📖',
    title: 'Speedreading',
    subtitle: 'Geschwindigkeit trifft Verständnis',
    description: 'Grundlagen des überdurchschnittlich schnellen Lesens mit hohem Textverständnis.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: '2026-07-11',
  },
  {
    id: 'sem-achtsamkeit', icon: '🧘',
    title: 'Achtsamkeit',
    subtitle: 'Gelassenheit ist trainierbar',
    description: 'Nur selten nimmt man sich neben dem Beruf und reizüberfluteten Alltag Zeit für sich und die eigenen Bedürfnisse.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: '2026-08-08',
  },
  {
    id: 'sem-rhetorik', icon: '🎤',
    title: 'Rhetorik, Dialektik, Kinesik',
    subtitle: 'Überzeugen mit Worten und Wirkung',
    description: 'Wirkungsvoll, passend und adressatengerecht kommunizieren in jeder Situation.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: '2026-09-12',
  },
  {
    id: 'sem-motivation', icon: '🔥',
    title: 'Selbstmotivation',
    subtitle: 'Dein Warum, dein Motor',
    description: 'Wie du dich effektiv motivierst, langfristig und diszipliniert an eigenen Zielen arbeitest.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: '2026-10-10',
  },
  {
    id: 'sem-kommunikation', icon: '💬',
    title: 'Kommunikation',
    subtitle: 'Verständigung als Schlüssel zum Erfolg',
    description: 'Effektive Kommunikation mit Kollegen und Geschäftspartnern.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: '2026-11-14',
  },
  {
    id: 'sem-konflikt', icon: '🤜',
    title: 'Konfliktmanagement',
    subtitle: 'Aus Krisen Chancen machen',
    description: 'Strategien und Techniken zur erfolgreichen Konfliktbewältigung.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: '2026-12-12',
  },
  {
    id: 'sem-homeoffice', icon: '🏠',
    title: 'Arbeiten aus dem Home Office',
    subtitle: 'Effizient arbeiten, flexibel leben',
    description: 'Strategien und Impulse, um auch von zu Hause aus ausgeglichen und effektiv deiner Arbeit nachzugehen.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
  {
    id: 'sem-knigge', icon: '👔',
    title: 'Business Knigge',
    subtitle: 'Der erste Eindruck zählt, der zweite bleibt',
    description: 'Die richtigen Formen und Kommunikationsfähigkeiten im Berufs- und Geschäftsumfeld.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
  {
    id: 'sem-networking', icon: '🤝',
    title: 'Networking',
    subtitle: 'Kontakte knüpfen, Vertrauen aufbauen',
    description: 'Fähigkeiten im Aufbau und der Pflege von beruflichen Beziehungen verbessern.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
  {
    id: 'sem-prioritaeten', icon: '🎯',
    title: 'Prioritätenmanagement',
    subtitle: 'Nicht alles gleichzeitig, sondern das Richtige zuerst',
    description: 'Bewusster Umgang mit unserer Zeit als Schlüssel zum beruflichen Erfolg.',
    teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER',
    next_date: null,
  },
];

// ─── Seminar Kalender Helper ──────────────────────────────────────────────────
function groupByMonth(seminare) {
  const groups = {};
  seminare.forEach(s => {
    if (!s.next_date) return;
    const d = new Date(s.next_date);
    const key = d.toLocaleDateString('de-DE', { month: 'long', year: 'numeric' });
    if (!groups[key]) groups[key] = [];
    groups[key].push(s);
  });
  return groups;
}

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
      {/* Thumbnail area */}
      <div style={{
        position: 'relative',
        width: 'calc(100% + 48px)',
        marginLeft: -24,
        marginTop: -24,
        marginBottom: 16,
        height: 140,
        overflow: 'hidden',
        borderRadius: '12px 12px 0 0',
        background: course.thumbnail_url
          ? `url(${course.thumbnail_url}) center/cover no-repeat`
          : 'linear-gradient(135deg, #CC1426 0%, #8B0D1A 40%, #1a1a1a 100%)',
        flexShrink: 0,
      }}>
        {/* Subtle pattern overlay for fallback */}
        {!course.thumbnail_url && (
          <div style={{
            position: 'absolute', inset: 0,
            backgroundImage: 'radial-gradient(circle at 20% 50%, rgba(255,255,255,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 20%, rgba(255,255,255,0.05) 0%, transparent 40%)',
          }} />
        )}
        {/* Dark overlay for text readability on image thumbnails */}
        {course.thumbnail_url && (
          <div style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.35)' }} />
        )}
        {/* Emoji + play button */}
        <div style={{
          position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
        }}>
          <span style={{ fontSize: 36, filter: course.thumbnail_url ? 'none' : 'drop-shadow(0 2px 8px rgba(0,0,0,0.3))' }}>{course.icon || '📘'}</span>
          <div style={{
            width: 40, height: 40, borderRadius: '50%',
            background: course.thumbnail_url ? '#CC1426' : 'rgba(255,255,255,0.15)',
            backdropFilter: course.thumbnail_url ? 'none' : 'blur(4px)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0,
            boxShadow: course.thumbnail_url ? '0 2px 12px rgba(204,20,38,0.5)' : '0 2px 12px rgba(0,0,0,0.2)',
            border: course.thumbnail_url ? 'none' : '1px solid rgba(255,255,255,0.2)',
          }}>
            <span style={{ fontSize: 14, marginLeft: 3, color: '#fff' }}>▶</span>
          </div>
        </div>
        {/* Pill badge on thumbnail */}
        {course.isTopEmpfehlung ? (
          <span className="pill pill-red" style={{ position: 'absolute', top: 10, right: 10, fontSize: 11, fontWeight: 700 }}>#1 Empfehlung</span>
        ) : course.isPrio ? (
          <span className="pill pill-gold" style={{ position: 'absolute', top: 10, right: 10, fontSize: 11, fontWeight: 700 }}>2x XP</span>
        ) : null}
      </div>
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
    { key: 'seminare', label: 'Seminare' },
  ];

  const showELearnings = activeTab === 'alle' || activeTab === 'e-learnings';
  const showAnalyse = false;
  const showSeminare = activeTab === 'alle' || activeTab === 'seminare';

  return (
    <div className="page-container">
      {/* ── Title ── */}
      <div style={{ display: 'flex', alignItems: 'center', marginBottom: 8 }}>
        <h1 className="page-title" style={{ marginBottom: 0 }}>Masterclass</h1>
        <InfoTooltip moduleId="masterclass" profile={profile} />
      </div>
      <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', marginBottom: 28 }}>
        Lerne in deinem eigenen Tempo — E-Learnings & Live-Seminare.
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
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            🎓 Seminare
            <span className="pill pill-green" style={{ fontSize: 12 }}>Live</span>
          </h2>

          {/* ── Mitgliedschaft CTA ── */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: 'var(--r-lg)', padding: '20px 24px', marginBottom: 24,
            display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                Alle 13 Seminare — mit Mitgliedschaft
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                Einzeln ab 99 € · Oder: Unbegrenzter Zugang mit dem Masterclass-Abo
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
              <a href="/angebote" className="btn btn-primary" style={{ fontSize: 13, padding: '10px 20px', background: '#CC1426' }}>
                Mitgliedschaft starten →
              </a>
              <a href="/angebote" style={{ fontSize: 13, padding: '10px 20px', borderRadius: 'var(--r-md)', border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', display: 'inline-flex', alignItems: 'center' }}>
                Einzeln buchen
              </a>
            </div>
          </div>

          {/* ── Kalenderansicht ── */}
          <div className="card" style={{ marginBottom: 24, padding: '0', overflow: 'hidden' }}>
            <div style={{ padding: '14px 20px', borderBottom: '1px solid var(--ki-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 16 }}>📅</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Termine 2026</span>
              <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginLeft: 4 }}>Samstags · 09:30 – 12:00 Uhr · Online via Teams</span>
            </div>
            {Object.entries(groupByMonth(SEMINARE)).map(([month, sems]) => (
              <div key={month}>
                <div style={{ padding: '10px 20px 6px', fontSize: 11, fontWeight: 700, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', background: 'var(--ki-bg-alt)', borderBottom: '1px solid var(--ki-border)' }}>
                  {month}
                </div>
                {sems.map((s, i) => {
                  const d = new Date(s.next_date);
                  const isLive = isSeminarLive(s.next_date);
                  return (
                    <div key={s.id} style={{
                      display: 'flex', alignItems: 'center', gap: 16, padding: '12px 20px',
                      borderBottom: '1px solid var(--ki-border)',
                      background: isLive ? 'rgba(34,197,94,0.04)' : 'transparent',
                    }}>
                      <div style={{ width: 44, textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: 11, fontWeight: 700, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase' }}>
                          {d.toLocaleDateString('de-DE', { weekday: 'short' })}
                        </div>
                        <div style={{ fontSize: 20, fontWeight: 800, color: 'var(--ki-text)', lineHeight: 1.2 }}>
                          {d.getDate().toString().padStart(2, '0')}
                        </div>
                      </div>
                      <div style={{ fontSize: 18, flexShrink: 0 }}>{s.icon}</div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text)' }}>{s.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>{s.subtitle}</div>
                      </div>
                      {isLive ? (
                        <a href={s.teams_link} target="_blank" rel="noopener noreferrer"
                          style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', flexShrink: 0, display: 'flex', alignItems: 'center', gap: 4 }}>
                          🔴 Live →
                        </a>
                      ) : (
                        <a href="/angebote" style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-red)', textDecoration: 'none', flexShrink: 0 }}>
                          Buchen →
                        </a>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* ── Seminar Cards ── */}
          <div className="grid-2">
            {SEMINARE.map((seminar, i) => {
              const isLive = isSeminarLive(seminar.next_date);
              const dateStr = seminar.next_date
                ? new Date(seminar.next_date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : 'Termin folgt';
              return (
                <div key={seminar.id} className="card animate-in" style={{ animationDelay: `${i * 0.04}s`, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 28 }}>{seminar.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 15, letterSpacing: '-0.02em', lineHeight: 1.3 }}>{seminar.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--ki-red)', fontWeight: 500 }}>{seminar.subtitle}</div>
                      </div>
                    </div>
                    {isLive && <span className="pill pill-green" style={{ fontSize: 11, flexShrink: 0 }}>🔴 Live</span>}
                  </div>

                  <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.5, margin: 0 }}>{seminar.description}</p>

                  <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', display: 'flex', gap: 10, flexWrap: 'wrap' }}>
                    <span>📅 {dateStr}</span>
                    <span>· ⏰ 09:30 – 12:00</span>
                    <span>· Inkl. Zertifikat</span>
                  </div>

                  <div style={{ display: 'flex', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                    {isLive ? (
                      <a href={seminar.teams_link} target="_blank" rel="noopener noreferrer"
                        className="btn btn-primary"
                        style={{ fontSize: 13, padding: '9px 18px', background: '#CC1426', animation: 'pulse 1.5s ease-in-out infinite' }}>
                        🔴 JETZT LIVE — Teilnehmen
                      </a>
                    ) : (
                      <>
                        <a href="/angebote" className="btn btn-primary" style={{ fontSize: 13, padding: '9px 18px' }}>
                          Einzeln buchen · 99 €
                        </a>
                        <a href="/angebote" className="btn btn-secondary" style={{ fontSize: 13, padding: '9px 18px' }}>
                          Mit Abo →
                        </a>
                      </>
                    )}
                  </div>
                </div>
              );
            })}
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
