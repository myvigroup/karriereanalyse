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
  { id: 'sem-typgerecht', icon: '🧠', title: 'Typgerechtes Lernen', subtitle: 'Finde deinen Weg zum Wissen', description: 'Warum lernen, denken und vergessen wir unterschiedlich? Was motiviert uns zum Lernen?', teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER', next_date: '2026-04-18' },
  { id: 'sem-worklife', icon: '⚖️', title: 'Work-Life-Balance', subtitle: 'Gesundheit trifft Leistung', description: 'Ausgewogene Balance zwischen beruflichen und privaten Verpflichtungen.', teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER', next_date: '2026-05-09' },
  { id: 'sem-leadership', icon: '👑', title: 'Personal Leadership', subtitle: 'Authentisch führen, wirksam bleiben', description: 'Wie du aus Wünschen echte Ziele machst und diese erreichen kannst.', teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER', next_date: '2026-06-13' },
  { id: 'sem-speedreading', icon: '📖', title: 'Speedreading', subtitle: 'Geschwindigkeit trifft Verständnis', description: 'Grundlagen des überdurchschnittlich schnellen Lesens mit hohem Textverständnis.', teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER', next_date: '2026-07-11' },
  { id: 'sem-achtsamkeit', icon: '🧘', title: 'Achtsamkeit', subtitle: 'Gelassenheit ist trainierbar', description: 'Nur selten nimmt man sich neben dem Beruf und reizüberfluteten Alltag Zeit für sich und die eigenen Bedürfnisse.', teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER', next_date: '2026-08-08' },
  { id: 'sem-rhetorik', icon: '🎤', title: 'Rhetorik, Dialektik, Kinesik', subtitle: 'Überzeugen mit Worten und Wirkung', description: 'Wirkungsvoll, passend und adressatengerecht kommunizieren in jeder Situation.', teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER', next_date: '2026-09-12' },
  { id: 'sem-motivation', icon: '🔥', title: 'Selbstmotivation', subtitle: 'Dein Warum, dein Motor', description: 'Wie du dich effektiv motivierst, langfristig und diszipliniert an eigenen Zielen arbeitest.', teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER', next_date: '2026-10-10' },
  { id: 'sem-kommunikation', icon: '💬', title: 'Kommunikation', subtitle: 'Verständigung als Schlüssel zum Erfolg', description: 'Effektive Kommunikation mit Kollegen und Geschäftspartnern.', teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER', next_date: '2026-11-14' },
  { id: 'sem-konflikt', icon: '🤜', title: 'Konfliktmanagement', subtitle: 'Aus Krisen Chancen machen', description: 'Strategien und Techniken zur erfolgreichen Konfliktbewältigung.', teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER', next_date: '2026-12-12' },
  { id: 'sem-homeoffice', icon: '🏠', title: 'Arbeiten aus dem Home Office', subtitle: 'Effizient arbeiten, flexibel leben', description: 'Strategien und Impulse, um auch von zu Hause aus ausgeglichen und effektiv deiner Arbeit nachzugehen.', teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER', next_date: null },
  { id: 'sem-knigge', icon: '👔', title: 'Business Knigge', subtitle: 'Der erste Eindruck zählt, der zweite bleibt', description: 'Die richtigen Formen und Kommunikationsfähigkeiten im Berufs- und Geschäftsumfeld.', teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER', next_date: null },
  { id: 'sem-networking', icon: '🤝', title: 'Networking', subtitle: 'Kontakte knüpfen, Vertrauen aufbauen', description: 'Fähigkeiten im Aufbau und der Pflege von beruflichen Beziehungen verbessern.', teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER', next_date: null },
  { id: 'sem-prioritaeten', icon: '🎯', title: 'Prioritätenmanagement', subtitle: 'Nicht alles gleichzeitig, sondern das Richtige zuerst', description: 'Bewusster Umgang mit unserer Zeit als Schlüssel zum beruflichen Erfolg.', teams_link: 'https://teams.microsoft.com/l/meetup-join/PLACEHOLDER', next_date: null },
];

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

function isSeminarLive(nextDate) {
  if (!nextDate) return false;
  const now = new Date();
  const seminar = new Date(nextDate);
  const isSameDay = now.toDateString() === seminar.toDateString();
  const hour = now.getHours();
  return isSameDay && hour >= 9 && (hour < 12 || (hour === 12 && now.getMinutes() <= 30));
}

function getMilestone(completed) {
  if (completed >= 6) return { label: 'Gold 🥇', next: null };
  if (completed >= 3) return { label: 'Silber 🥈', next: 6 };
  if (completed >= 1) return { label: 'Bronze 🥉', next: 3 };
  return { label: null, next: 1 };
}

// ─── Course Card ──────────────────────────────────────────────────────────────
function CourseCard({ course, i }) {
  const badgeLabel = course.pct === 100 ? 'Fertig' : course.pct > 0 ? 'Laufend' : 'Neu';
  const badgeColor = course.pct === 100
    ? { background: 'var(--ki-success)', color: '#fff' }
    : course.pct > 0
      ? { background: 'rgba(204,20,38,0.1)', color: 'var(--ki-red)' }
      : { background: 'var(--grey-6)', color: 'var(--ki-text-secondary)' };

  return (
    <a
      href={`/masterclass/${course.id}`}
      className="animate-in"
      style={{
        textDecoration: 'none', color: 'inherit',
        background: 'var(--ki-card)',
        borderRadius: 'var(--r-lg)',
        border: '1px solid var(--ki-border)',
        boxShadow: '0 1px 3px rgba(0,0,0,0.04)',
        overflow: 'hidden',
        display: 'flex', flexDirection: 'column',
        transition: 'transform 200ms var(--ease-apple), box-shadow 200ms var(--ease-apple)',
        animationDelay: `${i * 0.05}s`,
      }}
      onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = '0 8px 24px rgba(0,0,0,0.08)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = ''; e.currentTarget.style.boxShadow = '0 1px 3px rgba(0,0,0,0.04)'; }}
    >
      {/* Cover */}
      <div style={{
        position: 'relative', aspectRatio: '16/10', overflow: 'hidden',
        background: course.thumbnail_url
          ? `url(${course.thumbnail_url}) center/cover no-repeat`
          : 'linear-gradient(135deg, #CC1426 0%, #8B0D1A 40%, #1a1a1a 100%)',
      }}>
        {!course.thumbnail_url && (
          <div style={{
            position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center',
          }}>
            <span style={{ fontSize: 40, opacity: 0.6 }}>{course.icon || '📘'}</span>
          </div>
        )}
        {/* Category pill top-left */}
        {course.category && (
          <span style={{
            position: 'absolute', top: 10, left: 10, zIndex: 2,
            fontSize: 10.5, fontWeight: 600, textTransform: 'uppercase',
            letterSpacing: '0.06em', padding: '3px 9px',
            borderRadius: 'var(--r-pill)',
            background: 'rgba(0,0,0,0.45)', color: 'rgba(255,255,255,0.95)',
            backdropFilter: 'blur(6px)',
          }}>
            {course.category}
          </span>
        )}
        {/* Status badge top-right */}
        <span style={{
          position: 'absolute', top: 10, right: 10, zIndex: 2,
          fontSize: 10.5, fontWeight: 600,
          padding: '3px 9px', borderRadius: 'var(--r-pill)',
          ...badgeColor,
        }}>
          {course.isTopEmpfehlung ? '#1 Empfehlung' : badgeLabel}
        </span>
        {/* Progress bar on cover */}
        {course.pct > 0 && (
          <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, height: 3, background: 'rgba(0,0,0,0.15)', zIndex: 3 }}>
            <div style={{
              height: '100%',
              width: `${course.pct}%`,
              background: course.pct === 100 ? 'var(--ki-success)' : 'var(--ki-red)',
              transition: 'width 0.3s ease',
            }} />
          </div>
        )}
      </div>

      {/* Body */}
      <div style={{ padding: '14px 16px 16px', flex: 1, display: 'flex', flexDirection: 'column', gap: 6 }}>
        <div style={{ fontWeight: 700, fontSize: 15, lineHeight: 1.25, color: 'var(--ki-text)' }}>{course.title}</div>
        {course.description && (
          <div style={{
            fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.45, flex: 1,
            overflow: 'hidden', display: '-webkit-box', WebkitLineClamp: 2, WebkitBoxOrient: 'vertical',
          }}>
            {course.description}
          </div>
        )}
        <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 4 }}>
          {(course.modules || []).length} Module · {course.total} Lektionen
          {course.isPrio ? ' · 2× XP' : ''}
        </div>
      </div>

      {/* Footer */}
      <div style={{
        padding: '10px 16px', borderTop: '1px solid var(--ki-border)',
        background: 'var(--ki-bg-alt)',
        display: 'flex', alignItems: 'center', gap: 8,
      }}>
        <div style={{
          width: 22, height: 22, borderRadius: '50%', flexShrink: 0,
          background: 'linear-gradient(135deg, var(--ki-red), #8B0D1A)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 9, fontWeight: 700, color: '#fff',
          overflow: 'hidden',
        }}>
          {course.icon ? <span>{course.icon}</span> : null}
        </div>
        <span style={{ fontSize: 12, color: 'var(--ki-text-secondary)', flex: 1, minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {course.done}/{course.total} Lektionen
        </span>
        <span style={{ fontSize: 12, fontWeight: 700, color: course.pct === 100 ? 'var(--ki-success)' : 'var(--ki-text)' }}>
          {course.pct === 100 ? '✓ Fertig' : course.pct === 0 ? 'Starten →' : `${course.pct} %`}
        </span>
      </div>
    </a>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export default function MasterclassClient({ courses, progress, analysisResults, profile, seminars: seminarsFromDB, seminarRegistrations }) {
  const router = useRouter();
  const [activeTab, setActiveTab] = useState('alle');
  const [categoryFilter, setCategoryFilter] = useState('all');

  const activeSeminars = (seminarsFromDB && seminarsFromDB.length > 0) ? seminarsFromDB : SEMINARE;
  const [bookingLoading, setBookingLoading] = useState(null);
  const [bookedSeminars, setBookedSeminars] = useState(
    () => new Set((seminarRegistrations || []).map(r => r.seminar_id))
  );

  const isPremium = profile?.subscription_plan && profile.subscription_plan !== 'FREE';
  const hasSeminarAccess = isPremium || (profile?.purchased_products || []).includes('SEMINAR');

  async function bookSeminar(seminarId) {
    setBookingLoading(seminarId);
    try {
      if (hasSeminarAccess) {
        const res = await fetch('/api/webinar/register', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ seminarId }),
        });
        const data = await res.json();
        if (data.success || data.alreadyRegistered) {
          setBookedSeminars(prev => new Set([...prev, seminarId]));
        } else {
          alert(data.error || 'Buchung fehlgeschlagen');
        }
      } else {
        const res = await fetch('/api/checkout', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ productKey: 'SEMINAR', seminarId }),
        });
        const data = await res.json();
        if (data.url) window.location.href = data.url;
        else alert(data.error || 'Checkout fehlgeschlagen');
      }
    } catch { alert('Fehler bei der Buchung'); }
    finally { setBookingLoading(null); }
  }

  const completedSet = useMemo(
    () => new Set((progress || []).filter((p) => p.completed).map((p) => p.lesson_id)),
    [progress]
  );

  const personalisierung = useMemo(
    () => berechnePersonalisierung(analysisResults, profile?.phase),
    [analysisResults, profile?.phase]
  );

  const relevanzMap = useMemo(() => {
    const map = {};
    (personalisierung.empfohleneKurse || []).forEach((k, i) => {
      map[k.kursId] = { relevanz: k.relevanz, istSchwaeche: k.istSchwaeche, empfehlung: k.empfehlung, rang: i };
    });
    return map;
  }, [personalisierung]);

  const eLearnings = useMemo(() => {
    return (courses || [])
      .filter((c) => !c.category || c.category === 'E-Learning' || c.category === 'e-learning')
      .map((c) => {
        const total = (c.modules || []).reduce((s, m) => s + (m.lessons || []).length, 0);
        const done = (c.modules || []).reduce(
          (s, m) => s + (m.lessons || []).filter((l) => completedSet.has(l.id)).length, 0
        );
        const pct = total > 0 ? Math.round((done / total) * 100) : 0;
        const rel = relevanzMap[c.id];
        const isPrio = rel?.istSchwaeche || false;
        const isTopEmpfehlung = rel?.rang === 0 && analysisResults?.length > 0;
        return { ...c, total, done, pct, isPrio, isTopEmpfehlung, relevanz: rel?.relevanz ?? 0, empfehlung: rel?.empfehlung || '' };
      })
      .sort((a, b) => {
        if (!analysisResults || analysisResults.length === 0) return 0;
        return b.relevanz - a.relevanz;
      });
  }, [courses, completedSet, analysisResults, relevanzMap]);

  const inProgressCourse = useMemo(
    () => eLearnings.find((c) => c.pct > 0 && c.pct < 100) || null,
    [eLearnings]
  );

  const totalCompletedLessons = eLearnings.reduce((s, c) => s + c.done, 0);
  const completedCourses = eLearnings.filter((c) => c.pct === 100).length;
  const xp = totalCompletedLessons * 10;

  const showELearnings = activeTab === 'alle' || activeTab === 'e-learnings';
  const showSeminare = activeTab === 'alle' || activeTab === 'seminare';

  const tabs = [
    { key: 'alle',        label: 'Alle' },
    { key: 'e-learnings', label: 'E-Learnings' },
    { key: 'seminare',    label: 'Seminare' },
  ];

  const hasAnalyseData = analysisResults && analysisResults.length > 0;

  // Category chips derived from courses
  const categories = useMemo(() => {
    const cats = new Set(eLearnings.map(c => c.category).filter(Boolean));
    return ['all', ...cats];
  }, [eLearnings]);

  const filteredCourses = useMemo(() => {
    if (categoryFilter === 'all') return eLearnings;
    return eLearnings.filter(c => c.category === categoryFilter);
  }, [eLearnings, categoryFilter]);

  return (
    <div className="page-container">

      {/* ── Page Header ── */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: 6, flexWrap: 'wrap', gap: 12 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <h1 className="page-title" style={{ marginBottom: 0 }}>Masterclass</h1>
          <InfoTooltip moduleId="masterclass" profile={profile} />
        </div>
      </div>
      <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', marginBottom: 24, maxWidth: '60ch', lineHeight: 1.5 }}>
        Lerne in deinem eigenen Tempo — E-Learnings &amp; Live-Seminare.
      </p>

      {/* ── Tabs ── */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 28, flexWrap: 'wrap' }}>
        {tabs.map((t) => (
          <button
            key={t.key}
            onClick={() => setActiveTab(t.key)}
            style={{
              padding: '7px 16px', borderRadius: 'var(--r-pill)',
              fontSize: 13, fontWeight: 600, border: 'none', cursor: 'pointer',
              transition: 'all var(--t-fast)',
              background: activeTab === t.key ? 'var(--ki-text)' : 'var(--ki-bg-alt)',
              color: activeTab === t.key ? '#fff' : 'var(--ki-text-secondary)',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* ── No Analysis Banner ── */}
      {!hasAnalyseData && (
        <div className="card animate-in" style={{
          marginBottom: 24, padding: '18px 20px',
          display: 'flex', alignItems: 'center', gap: 16,
          borderLeft: '3px solid var(--ki-warning)',
        }}>
          <div style={{ fontSize: 32 }}>🩸</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontWeight: 700, fontSize: 15, marginBottom: 3 }}>Mach zuerst dein Karriere-Blutbild</div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
              Finde heraus, welche Kurse für dich wirklich Priorität haben — basierend auf deinen Kompetenz-Scores.
            </div>
          </div>
          <a href="/analyse" className="btn btn-primary" style={{ fontSize: 13, padding: '8px 18px', flexShrink: 0 }}>
            Analyse starten →
          </a>
        </div>
      )}

      {/* ─────────────── E-LEARNINGS ─────────────── */}
      {showELearnings && (
        <>
          {/* Active course hero */}
          {inProgressCourse && (
            <div className="animate-in" style={{
              position: 'relative', borderRadius: 'var(--r-lg)',
              background: 'linear-gradient(135deg, #1a0508 0%, #82031C 45%, #CC1426 100%)',
              color: '#fff', overflow: 'hidden', marginBottom: 16, isolation: 'isolate',
            }}>
              {/* Grain */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.35,
                backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.06) 1px, transparent 0)',
                backgroundSize: '3px 3px',
              }} />
              {/* Glow */}
              <div style={{
                position: 'absolute', inset: 0, pointerEvents: 'none',
                background: 'radial-gradient(ellipse at 90% 20%, rgba(255,255,255,0.12), transparent 55%), radial-gradient(ellipse at 10% 90%, rgba(255,80,100,0.15), transparent 50%)',
              }} />
              <div style={{ position: 'relative', zIndex: 1, padding: '28px 32px', display: 'flex', alignItems: 'center', gap: 24, flexWrap: 'wrap' }}>
                <div style={{ flex: 1, minWidth: 260 }}>
                  <div style={{
                    display: 'inline-flex', alignItems: 'center', gap: 7,
                    fontSize: 11.5, fontWeight: 600, textTransform: 'uppercase',
                    letterSpacing: '0.08em', color: 'rgba(255,255,255,0.7)',
                    marginBottom: 12,
                  }}>
                    <span style={{
                      width: 7, height: 7, borderRadius: '50%',
                      background: '#30D158', boxShadow: '0 0 0 3px rgba(48,209,88,0.25)',
                      animation: 'pulse 1.6s infinite',
                    }} />
                    Aktiver Kurs · weiterlernen
                  </div>
                  <h2 style={{ fontSize: 26, fontWeight: 700, color: '#fff', margin: '0 0 8px', lineHeight: 1.15 }}>
                    {inProgressCourse.title}
                  </h2>
                  {inProgressCourse.description && (
                    <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.75)', margin: '0 0 16px', lineHeight: 1.5, maxWidth: '50ch' }}>
                      {inProgressCourse.description}
                    </p>
                  )}
                  <div style={{
                    display: 'flex', gap: 20, flexWrap: 'wrap',
                    fontSize: 13, color: 'rgba(255,255,255,0.8)',
                    marginBottom: 16, paddingBottom: 16,
                    borderBottom: '1px solid rgba(255,255,255,0.12)',
                  }}>
                    <span><strong style={{ color: '#fff' }}>{(inProgressCourse.modules || []).length} Module</strong> · {inProgressCourse.total} Lektionen</span>
                    <span><strong style={{ color: '#fff' }}>Zertifikat</strong> nach Abschluss</span>
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                    <a href={`/masterclass/${inProgressCourse.id}`} style={{
                      display: 'inline-flex', alignItems: 'center', gap: 7,
                      padding: '9px 20px', borderRadius: 'var(--r-pill)',
                      background: '#fff', color: 'var(--ki-text)', fontWeight: 700, fontSize: 14,
                      textDecoration: 'none',
                      boxShadow: '0 1px 3px rgba(0,0,0,0.15)',
                      transition: 'all var(--t-fast)',
                    }}>▶ Weiterlernen</a>
                    <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginLeft: 8 }}>
                      <div style={{ width: 120, height: 4, borderRadius: 'var(--r-pill)', background: 'rgba(255,255,255,0.2)', overflow: 'hidden' }}>
                        <div style={{ height: '100%', width: `${inProgressCourse.pct}%`, background: '#fff', borderRadius: 'var(--r-pill)' }} />
                      </div>
                      <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.8)', fontVariantNumeric: 'tabular-nums' }}>
                        {inProgressCourse.pct} % · {inProgressCourse.done} von {inProgressCourse.total}
                      </span>
                    </div>
                  </div>
                </div>
                {inProgressCourse.thumbnail_url && (
                  <div style={{
                    width: 160, aspectRatio: '4/5', borderRadius: 12, overflow: 'hidden', flexShrink: 0,
                    boxShadow: '0 20px 50px rgba(0,0,0,0.35)',
                  }}>
                    <img src={inProgressCourse.thumbnail_url} alt="" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Lern-Stats */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 12, marginBottom: 20 }}>
            {[
              { label: 'Abgeschlossene Kurse', value: completedCourses, unit: `/${eLearnings.length}` },
              { label: 'Gesammelte XP', value: xp, unit: 'XP' },
              { label: 'Lektionen fertig', value: totalCompletedLessons, unit: '' },
            ].map((s, i) => (
              <div key={i} className="card animate-in" style={{
                padding: '16px 20px', display: 'flex', alignItems: 'center', gap: 14,
                border: '1px solid var(--ki-border)', boxShadow: 'var(--sh-sm)',
                animationDelay: `${i * 0.06}s`,
              }}>
                <div style={{ width: 38, height: 38, borderRadius: 10, background: 'rgba(204,20,38,0.08)', color: 'var(--ki-red)', display: 'grid', placeItems: 'center', fontSize: 16, flexShrink: 0 }}>
                  {i === 0 ? '📚' : i === 1 ? '⚡' : '✓'}
                </div>
                <div>
                  <div style={{ fontSize: 22, fontWeight: 700, lineHeight: 1, fontVariantNumeric: 'tabular-nums' }}>
                    {s.value}<span style={{ fontSize: 13, color: 'var(--ki-text-secondary)', fontWeight: 500, marginLeft: 2 }}>{s.unit}</span>
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', marginTop: 3, fontWeight: 500 }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          {/* Section heading + filter */}
          <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', marginBottom: 12 }}>
            <h2 style={{ fontSize: 20, fontWeight: 700 }}>
              Alle Kurse <span style={{ color: 'var(--ki-text-tertiary)', fontWeight: 500, marginLeft: 4 }}>{eLearnings.length}</span>
            </h2>
          </div>

          {/* Category filter chips */}
          {categories.length > 1 && (
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap', marginBottom: 16 }}>
              {categories.map((cat) => (
                <button key={cat} onClick={() => setCategoryFilter(cat)} style={{
                  padding: '5px 12px', borderRadius: 'var(--r-pill)',
                  fontSize: 12.5, fontWeight: 500, border: 'none', cursor: 'pointer',
                  transition: 'all var(--t-fast)',
                  background: categoryFilter === cat ? 'var(--ki-text)' : 'var(--ki-bg-alt)',
                  color: categoryFilter === cat ? '#fff' : 'var(--ki-text-secondary)',
                }}>
                  {cat === 'all' ? 'Alle' : cat}
                </button>
              ))}
            </div>
          )}

          {/* Course grid */}
          {eLearnings.length === 0 ? (
            <div className="card" style={{ padding: 40, textAlign: 'center', color: 'var(--ki-text-secondary)' }}>
              Keine E-Learnings verfügbar.
            </div>
          ) : (
            <div className="grid-3" style={{ marginBottom: 32 }}>
              {filteredCourses.map((course, i) => (
                <CourseCard key={course.id} course={course} i={i} />
              ))}
            </div>
          )}

          {/* Progress footer */}
          <div className="card animate-in" style={{
            padding: '16px 20px', marginBottom: 32,
            display: 'flex', alignItems: 'center', justifyContent: 'space-between',
            gap: 16, flexWrap: 'wrap',
            background: 'var(--ki-bg-alt)', border: '1px solid var(--ki-border)',
          }}>
            <span style={{ fontWeight: 600, fontSize: 14 }}>
              {completedCourses}/{eLearnings.length || 6} Kurse abgeschlossen · +{xp} XP
            </span>
            <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
              {[
                { label: '🥉 Bronze', threshold: 1 },
                { label: '🥈 Silber', threshold: 3 },
                { label: '🥇 Gold',   threshold: 6 },
              ].map(({ label, threshold }) => (
                <span key={label} className={`pill ${completedCourses >= threshold ? 'pill-gold' : 'pill-grey'}`} style={{ fontSize: 12 }}>
                  {label}
                </span>
              ))}
            </div>
          </div>
        </>
      )}

      {/* ─────────────── SEMINARE ─────────────── */}
      {showSeminare && (
        <section style={{ marginBottom: 48 }}>
          <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 20, display: 'flex', alignItems: 'center', gap: 8 }}>
            Seminare
            <span className="pill pill-green" style={{ fontSize: 12 }}>Live</span>
          </h2>

          {/* Membership CTA */}
          <div style={{
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)',
            borderRadius: 'var(--r-lg)', padding: '18px 24px', marginBottom: 20,
            display: 'flex', alignItems: 'center', gap: 20, flexWrap: 'wrap',
          }}>
            <div style={{ flex: 1, minWidth: 200 }}>
              <div style={{ fontSize: 14, fontWeight: 700, color: '#fff', marginBottom: 4 }}>
                Alle {activeSeminars.length} Seminare — mit Mitgliedschaft
              </div>
              <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.55)', lineHeight: 1.5 }}>
                Einzeln ab 99 € · Oder: Unbegrenzter Zugang mit dem Masterclass-Abo
              </div>
            </div>
            <div style={{ display: 'flex', gap: 10, flexShrink: 0, flexWrap: 'wrap' }}>
              <a href="/angebote" className="btn btn-primary" style={{ fontSize: 13, padding: '9px 18px', background: '#CC1426' }}>
                Mitgliedschaft starten →
              </a>
              <a href="/angebote" style={{
                fontSize: 13, padding: '9px 18px', borderRadius: 'var(--r-pill)',
                border: '1px solid rgba(255,255,255,0.2)', color: 'rgba(255,255,255,0.7)',
                textDecoration: 'none', display: 'inline-flex', alignItems: 'center',
              }}>
                Einzeln buchen
              </a>
            </div>
          </div>

          {/* Calendar view */}
          <div className="card" style={{ marginBottom: 20, padding: 0, overflow: 'hidden' }}>
            <div style={{ padding: '12px 18px', borderBottom: '1px solid var(--ki-border)', display: 'flex', alignItems: 'center', gap: 8 }}>
              <span style={{ fontSize: 15 }}>📅</span>
              <span style={{ fontSize: 14, fontWeight: 700 }}>Termine 2026</span>
              <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginLeft: 4 }}>Samstags · 09:30 – 12:00 Uhr · Online via Teams</span>
            </div>
            {Object.entries(groupByMonth(activeSeminars)).map(([month, sems]) => (
              <div key={month}>
                <div style={{ padding: '8px 18px 5px', fontSize: 11, fontWeight: 700, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', background: 'var(--ki-bg-alt)', borderBottom: '1px solid var(--ki-border)' }}>
                  {month}
                </div>
                {sems.map((s) => {
                  const d = new Date(s.next_date);
                  const isLive = isSeminarLive(s.next_date);
                  return (
                    <div key={s.id} style={{
                      display: 'flex', alignItems: 'center', gap: 14, padding: '11px 18px',
                      borderBottom: '1px solid var(--ki-border)',
                      background: isLive ? 'rgba(34,197,94,0.04)' : 'transparent',
                    }}>
                      <div style={{ width: 40, textAlign: 'center', flexShrink: 0 }}>
                        <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase' }}>
                          {d.toLocaleDateString('de-DE', { weekday: 'short' })}
                        </div>
                        <div style={{ fontSize: 18, fontWeight: 800, color: 'var(--ki-text)', lineHeight: 1.2 }}>
                          {d.getDate().toString().padStart(2, '0')}
                        </div>
                      </div>
                      <span style={{ fontSize: 16, flexShrink: 0 }}>{s.icon}</span>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text)' }}>{s.title}</div>
                        <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>{s.subtitle}</div>
                      </div>
                      {isLive ? (
                        <a href={s.teams_link} target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, fontWeight: 700, color: '#16a34a', flexShrink: 0 }}>
                          🔴 Live →
                        </a>
                      ) : bookedSeminars.has(s.id) ? (
                        <span style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-success)', flexShrink: 0 }}>Gebucht ✓</span>
                      ) : (
                        <button onClick={() => bookSeminar(s.id)} disabled={bookingLoading === s.id} style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-red)', background: 'none', border: 'none', cursor: 'pointer', flexShrink: 0 }}>
                          {bookingLoading === s.id ? '...' : hasSeminarAccess ? 'Buchen →' : 'Buchen · 99€'}
                        </button>
                      )}
                    </div>
                  );
                })}
              </div>
            ))}
          </div>

          {/* Seminar cards */}
          <div className="grid-2">
            {activeSeminars.map((seminar, i) => {
              const isLive = isSeminarLive(seminar.next_date);
              const dateStr = seminar.next_date
                ? new Date(seminar.next_date).toLocaleDateString('de-DE', { day: '2-digit', month: '2-digit', year: 'numeric' })
                : 'Termin folgt';
              return (
                <div key={seminar.id} className="card animate-in" style={{ animationDelay: `${i * 0.04}s`, display: 'flex', flexDirection: 'column', gap: 10 }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                    <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
                      <span style={{ fontSize: 26 }}>{seminar.icon}</span>
                      <div>
                        <div style={{ fontWeight: 700, fontSize: 14, lineHeight: 1.3 }}>{seminar.title}</div>
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
                      <a href={seminar.teams_link} target="_blank" rel="noopener noreferrer" className="btn btn-primary" style={{ fontSize: 13, padding: '8px 16px', background: '#CC1426' }}>
                        🔴 JETZT LIVE — Teilnehmen
                      </a>
                    ) : bookedSeminars.has(seminar.id) ? (
                      <span className="btn" style={{ fontSize: 13, padding: '8px 16px', background: '#D1FAE5', color: '#059669', border: '1px solid #BBF7D0', fontWeight: 600 }}>
                        Gebucht ✓
                      </span>
                    ) : hasSeminarAccess ? (
                      <button onClick={() => bookSeminar(seminar.id)} disabled={bookingLoading === seminar.id} className="btn btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
                        {bookingLoading === seminar.id ? 'Wird gebucht...' : 'Kostenlos buchen'}
                      </button>
                    ) : (
                      <>
                        <button onClick={() => bookSeminar(seminar.id)} disabled={bookingLoading === seminar.id} className="btn btn-primary" style={{ fontSize: 13, padding: '8px 16px' }}>
                          {bookingLoading === seminar.id ? 'Laden...' : 'Einzeln buchen · 99 €'}
                        </button>
                        <a href="/angebote" className="btn btn-secondary" style={{ fontSize: 13, padding: '8px 16px' }}>
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
    </div>
  );
}
