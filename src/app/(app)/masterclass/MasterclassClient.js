'use client';
import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';

// ─── Hardcoded Inhalte (preserved from previous version) ─────────────────────
const ANALYSE_TOOLS = [
  {
    id: 'strukturgramm',
    icon: '🔺',
    title: 'Strukturgramm®',
    subtitle: 'Erkenne deine Biostruktur',
    pricing: 'Online-Test + Coaching · Preis auf Anfrage',
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
    pricing: 'Test + Auswertung · 499 € pro Person',
    link: 'https://www.daskarriereinstitut.de/de/e/insights-mdi-trimetrix-eq-analyse-und-auswertungsgespr%C3%A4ch-94?uId=2',
    features: [
      'EQ-Profil mit internationalem Standard',
      'Verhaltens- & Motivationsanalyse',
      'Detaillierter Auswertungsbericht (40+ Seiten)',
      'Einsatz in Führung & Teamkommunikation',
    ],
  },
];

// ─── Geplante Masterclasses (Coming Soon — zur Kauf-Anregung) ────────────────
const COMING_SOON_MASTERCLASSES = [
  {
    id: 'soon-verhandlung-advanced',
    title: 'Verhandlungskompetenz Advanced',
    subtitle: 'Vom Bittsteller zum Verhandlungspartner auf Augenhöhe',
    description: 'Komplexe Verhandlungsstrategien jenseits von Gehalt: Verträge, Konflikte, Boni-Pakete. Mit Praxis-Simulationen aus echten Cases.',
    launch: 'August 2026',
    letter: 'V',
    gradient: 'linear-gradient(135deg, #5d3a91 0%, #3a2266 100%)',
  },
  {
    id: 'soon-personal-branding',
    title: 'Personal Branding 360°',
    subtitle: 'Mach dich sichtbar — online wie offline',
    description: 'LinkedIn, Speaking, Networking, eigene Website. Wie du dich als Marke positionierst und Recruiter auf dich aufmerksam werden statt umgekehrt.',
    launch: 'September 2026',
    letter: 'P',
    gradient: 'linear-gradient(135deg, #1d4e89 0%, #0f2e4f 100%)',
  },
  {
    id: 'soon-fuehrung-hybrid',
    title: 'Führung im Hybrid-Office',
    subtitle: 'Distanz-Teams, die liefern',
    description: 'Remote-First-Führung, asynchrone Kommunikation, Vertrauenskultur. Für alle, die zum ersten Mal ein verteiltes Team übernehmen.',
    launch: 'Oktober 2026',
    letter: 'F',
    gradient: 'linear-gradient(135deg, #1d4d2e 0%, #0e2818 100%)',
  },
  {
    id: 'soon-ai-fuer-berufstaetige',
    title: 'AI für Berufstätige',
    subtitle: 'Werde 10× produktiver — ohne Tech-Background',
    description: 'Konkrete Workflows mit ChatGPT, Claude und Notion AI für Office, Analyse, Schreiben. Mit fertigen Prompt-Templates für deinen Arbeitsalltag.',
    launch: 'November 2026',
    letter: 'A',
    gradient: 'linear-gradient(135deg, #8a4a14 0%, #4d2906 100%)',
  },
  {
    id: 'soon-karriere-pivot',
    title: 'Karriere-Pivots & Quereinstieg',
    subtitle: 'Branche wechseln, ohne von vorne anzufangen',
    description: 'Wie du Übertragbarkeit deiner Skills argumentierst, das richtige Narrativ baust und in den ersten 90 Tagen im neuen Feld liefern kannst.',
    launch: 'Januar 2027',
    letter: 'K',
    gradient: 'linear-gradient(135deg, #4a0a14 0%, #2a0508 100%)',
  },
];

const SEMINARE = [
  { id: 'sem-typgerecht', icon: '🧠', title: 'Typgerechtes Lernen', subtitle: 'Finde deinen Weg zum Wissen', description: 'Warum lernen, denken und vergessen wir unterschiedlich?', next_date: '2026-04-18' },
  { id: 'sem-worklife', icon: '⚖️', title: 'Work-Life-Balance', subtitle: 'Gesundheit trifft Leistung', description: 'Ausgewogene Balance zwischen beruflichen und privaten Verpflichtungen.', next_date: '2026-05-09' },
  { id: 'sem-leadership', icon: '👑', title: 'Personal Leadership', subtitle: 'Authentisch führen, wirksam bleiben', description: 'Wie du aus Wünschen echte Ziele machst und sie erreichst.', next_date: '2026-06-13' },
  { id: 'sem-speedreading', icon: '📖', title: 'Speedreading', subtitle: 'Geschwindigkeit trifft Verständnis', description: 'Grundlagen des überdurchschnittlich schnellen Lesens mit hohem Textverständnis.', next_date: '2026-07-11' },
  { id: 'sem-achtsamkeit', icon: '🧘', title: 'Achtsamkeit', subtitle: 'Gelassenheit ist trainierbar', description: 'Zeit für dich und die eigenen Bedürfnisse — neben Beruf und reizüberflutetem Alltag.', next_date: '2026-08-08' },
  { id: 'sem-rhetorik', icon: '🎤', title: 'Rhetorik & Dialektik', subtitle: 'Überzeugen mit Worten und Wirkung', description: 'Wirkungsvoll, passend und adressatengerecht kommunizieren in jeder Situation.', next_date: '2026-09-12' },
  { id: 'sem-motivation', icon: '🔥', title: 'Selbstmotivation', subtitle: 'Dein Warum, dein Motor', description: 'Wie du dich effektiv motivierst und langfristig diszipliniert an deinen Zielen arbeitest.', next_date: '2026-10-10' },
  { id: 'sem-kommunikation', icon: '💬', title: 'Kommunikation', subtitle: 'Verständigung als Schlüssel zum Erfolg', description: 'Effektive Kommunikation mit Kollegen und Geschäftspartnern.', next_date: '2026-11-14' },
  { id: 'sem-konflikt', icon: '🤜', title: 'Konfliktmanagement', subtitle: 'Aus Krisen Chancen machen', description: 'Strategien und Techniken zur erfolgreichen Konfliktbewältigung.', next_date: '2026-12-12' },
  { id: 'sem-homeoffice', icon: '🏠', title: 'Arbeiten im Home Office', subtitle: 'Effizient arbeiten, flexibel leben', description: 'Ausgeglichen und effektiv arbeiten — auch von zu Hause.', next_date: '2027-01-09' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function courseGradient(title) {
  const palette = [
    'linear-gradient(135deg, #4a0a14 0%, #2a0508 100%)',
    'linear-gradient(135deg, #1d4e89 0%, #0f2e4f 100%)',
    'linear-gradient(135deg, #5d3a91 0%, #3a2266 100%)',
    'linear-gradient(135deg, #1d4d2e 0%, #0e2818 100%)',
    'linear-gradient(135deg, #8a4a14 0%, #4d2906 100%)',
    'linear-gradient(135deg, #353A3B 0%, #1a1c1d 100%)',
  ];
  const i = (title || 'x').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length;
  return palette[i];
}

function Icon({ name, size = 16, stroke = 1.7 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
              stroke: 'currentColor', strokeWidth: stroke,
              strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'play':    return (<svg {...p}><polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none"/></svg>);
    case 'cal':     return (<svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
    case 'crown':   return (<svg {...p}><path d="M2 7l4 5 6-7 6 7 4-5v12H2z"/></svg>);
    case 'lock':    return (<svg {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
    case 'check':   return (<svg {...p}><polyline points="20 6 9 17 4 12"/></svg>);
    case 'spark':   return (<svg {...p}><path d="M5 3v4M3 5h4M19 17v4M17 19h4M12 2l2.4 5.1L20 9l-5.1 2.4L12 16l-2.4-5L4 9l5.4-2L12 2z"/></svg>);
    default: return null;
  }
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function MasterclassClient({ courses, progress, analysisResults, profile, seminars, seminarRegistrations }) {
  const router = useRouter();

  const plan = profile?.subscription_plan || 'FREE';
  const isPremium = plan !== 'FREE';
  const registeredSeminarIds = useMemo(
    () => new Set((seminarRegistrations || []).map(r => r.seminar_id)),
    [seminarRegistrations]
  );

  // Filter: nur e-learning-Kurse für die Hauptansicht (Seminare separat)
  const eLearningCourses = useMemo(
    () => (courses || []).filter(c => !c.category || c.category === 'e-learning'),
    [courses]
  );

  // Category-Filter
  const allCategories = useMemo(() => {
    const set = new Set(eLearningCourses.map(c => c.category || 'e-learning'));
    return ['alle', ...Array.from(set)];
  }, [eLearningCourses]);

  const [activeCat, setActiveCat] = useState('alle');
  const filteredCourses = useMemo(
    () => activeCat === 'alle' ? eLearningCourses : eLearningCourses.filter(c => (c.category || 'e-learning') === activeCat),
    [eLearningCourses, activeCat]
  );

  return (
    <div className="masterclass-v2">
      {/* Title block */}
      <div className="title-kicker">
        <span className="pulse" />
        {isPremium ? 'Premium aktiv · alle Kurse freigeschaltet' : 'Karriere-Bildung'}
      </div>
      <h1 className="page-title">
        Masterclass.{' '}
        <span className="faded">Lernen, das wirklich weiterbringt.</span>
      </h1>
      <p className="page-sub">
        Kompakte E-Learning-Kurse, Live-Seminare und exklusive Analyse-Tools — alles, um deine Karriere gezielt zu beschleunigen.
      </p>

      {/* Premium Upsell (nur für FREE-User) */}
      {!isPremium && (
        <div className="mc-upsell">
          <div>
            <div className="mc-upsell-eyebrow"><Icon name="crown" size={12} /> Premium freischalten</div>
            <h2 className="mc-upsell-title">Alle Masterclasses. Alle Seminare. Kein Limit.</h2>
            <p className="mc-upsell-sub">
              Zugriff auf alle E-Learning-Module, monatliches Live-Seminar (Wert 99 €), die Gehalts-Masterclass und persönliches Feedback.
            </p>
            <div className="mc-upsell-list">
              <span><Icon name="check" size={12} /> Alle E-Learning-Kurse</span>
              <span><Icon name="check" size={12} /> 1 Seminar / Monat (Wert 99 €)</span>
              <span><Icon name="check" size={12} /> Gehalts-Masterclass</span>
              <span><Icon name="check" size={12} /> Persönliches CV-Feedback</span>
            </div>
            <div className="mc-upsell-actions">
              <a href="/angebote" className="btn btn-on-dark">Premium starten</a>
            </div>
          </div>
          <div className="mc-upsell-price">
            <div className="amount">15 €</div>
            <div className="per">/ Monat · jederzeit kündbar</div>
          </div>
        </div>
      )}

      {/* Section: E-Learnings */}
      <div className="mc-secthead">
        <h3>E-Learnings <span className="count">{eLearningCourses.length}</span></h3>
      </div>

      {/* Category Filter */}
      {allCategories.length > 2 && (
        <div className="mc-filterbar">
          <div className="mc-chips">
            {allCategories.map(c => (
              <button key={c} className={`mc-chip ${activeCat === c ? 'on' : ''}`} onClick={() => setActiveCat(c)}>
                {c === 'alle' ? 'Alle' : c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mc-courses">
        {filteredCourses.length === 0 ? (
          <div className="mc-empty">Keine Kurse in dieser Kategorie.</div>
        ) : (
          filteredCourses.map(c => {
            const total = (c.modules || []).reduce((s, m) => s + (m.lessons || []).length, 0);
            const done = (c.modules || []).reduce(
              (s, m) => s + (m.lessons || []).filter(l => (progress || []).some(p => p.lesson_id === l.id && p.completed)).length,
              0
            );
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const isPremiumLocked = c.is_premium && !isPremium &&
              !(profile?.purchased_products || []).includes(c.id);
            const letter = (c.title || '?').trim()[0]?.toUpperCase() || '?';
            const moduleCount = (c.modules || []).length;
            const badge = pct === 100 ? { text: 'Fertig', kind: 'done' }
              : pct > 0 ? { text: 'Laufend', kind: '' }
              : c.is_premium && !isPremium ? { text: 'Premium', kind: 'premium' }
              : { text: 'Neu', kind: 'new' };
            const status = pct === 100 ? '✓ Fertig'
              : pct === 0 ? (isPremiumLocked ? 'Premium' : 'Starten →')
              : `${pct} %`;

            return (
              <div key={c.id}
                   className={`mc-course ${isPremiumLocked ? 'locked' : ''}`}
                   onClick={() => isPremiumLocked ? router.push('/angebote') : router.push(`/masterclass/${c.id}`)}
                   role="button" tabIndex={0}>
                <div className="mc-course-cover" style={{ background: courseGradient(c.title) }}>
                  <span className="cat">{c.category || 'e-learning'}</span>
                  <span className={`badge ${badge.kind}`}>{badge.text}</span>
                  <span className="mc-letter">{letter}</span>
                  {pct > 0 && (
                    <div className="mc-course-bar">
                      <div className={pct === 100 ? 'done' : ''} style={{ width: `${pct}%` }} />
                    </div>
                  )}
                  {isPremiumLocked && (
                    <div className="mc-lock"><Icon name="lock" size={18} stroke={2} /></div>
                  )}
                </div>
                <div className="mc-course-body">
                  <div className="mc-course-title">{c.title}</div>
                  {c.description && <div className="mc-course-sub">{c.description}</div>}
                  <div className="mc-course-meta">
                    <span>{moduleCount} {moduleCount === 1 ? 'Modul' : 'Module'}</span>
                    {total > 0 && (
                      <>
                        <span className="dot" />
                        <span>{total} {total === 1 ? 'Lektion' : 'Lektionen'}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="mc-course-foot">
                  <span className={`progress ${pct === 100 ? 'done' : ''}`}>{status}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Section: Bald verfügbar (Coming Soon — Kauf-Anregung) */}
      <div className="mc-secthead" style={{ marginTop: 'calc(var(--gap) * 1.5)' }}>
        <h3>Bald verfügbar <span className="count">{COMING_SOON_MASTERCLASSES.length}</span></h3>
        <span className="link">Vormerken — du bekommst eine Mail beim Launch</span>
      </div>
      <div className="mc-courses">
        {COMING_SOON_MASTERCLASSES.map(c => (
          <div key={c.id} className="mc-course mc-upcoming"
               onClick={() => alert(`„${c.title}" startet ${c.launch}. Du wirst per Mail benachrichtigt sobald die Masterclass live ist.`)}
               role="button" tabIndex={0}>
            <div className="mc-course-cover" style={{ background: c.gradient }}>
              <span className="cat">Coming Soon</span>
              <span className="badge upcoming">{c.launch}</span>
              <span className="mc-letter">{c.letter}</span>
            </div>
            <div className="mc-course-body">
              <div className="mc-course-title">{c.title}</div>
              <div className="mc-course-sub">{c.description}</div>
              <div className="mc-course-meta">
                <Icon name="cal" size={11} />
                <span>Start: {c.launch}</span>
              </div>
            </div>
            <div className="mc-course-foot">
              <span className="coach-name">{c.subtitle}</span>
              <span className="progress upcoming-cta">+ Vormerken</span>
            </div>
          </div>
        ))}
      </div>

      {/* Section: Live-Seminare */}
      <div className="mc-secthead" style={{ marginTop: 'calc(var(--gap) * 1.5)' }}>
        <h3>Live-Seminare <span className="count">{SEMINARE.length}</span></h3>
        <span className="link">monatlich · 90 Min · interaktiv</span>
      </div>
      <div className="mc-seminar-list">
        {SEMINARE.map(s => {
          const registered = registeredSeminarIds.has(s.id);
          const nextDate = new Date(s.next_date);
          const dateStr = nextDate.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
          const weekday = nextDate.toLocaleDateString('de-DE', { weekday: 'short' });
          return (
            <div key={s.id} className="mc-seminar-row" onClick={() => router.push('/seminare')} role="button" tabIndex={0}>
              <div className="mc-seminar-date">
                <span className="mc-seminar-date-day">{nextDate.getDate()}</span>
                <span className="mc-seminar-date-month">{nextDate.toLocaleDateString('de-DE', { month: 'short' })}</span>
                <span className="mc-seminar-date-weekday">{weekday}</span>
              </div>
              <div className="mc-seminar-icon">{s.icon}</div>
              <div className="mc-seminar-body">
                <div className="mc-seminar-title">{s.title}</div>
                <div className="mc-seminar-subtitle">{s.subtitle}</div>
                <div className="mc-seminar-desc">{s.description}</div>
              </div>
              <div className="mc-seminar-side">
                {registered ? (
                  <span className="mc-seminar-badge done">✓ Angemeldet</span>
                ) : !isPremium ? (
                  <span className="mc-seminar-badge premium">Premium</span>
                ) : (
                  <span className="mc-seminar-badge open">Anmelden</span>
                )}
                <span className="mc-seminar-meta">90 Min · interaktiv</span>
                <span className="mc-seminar-cta">Details →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Section: Premium-Analyse-Tools */}
      <div className="mc-secthead" style={{ marginTop: 'calc(var(--gap) * 1.5)' }}>
        <h3>Premium-Analyse-Tools <span className="count">{ANALYSE_TOOLS.length}</span></h3>
        <span className="link">wissenschaftlich · individuelles Coaching</span>
      </div>
      <div className="mc-tools-grid">
        {ANALYSE_TOOLS.map(t => (
          <a key={t.id} className="mc-tool" href={t.link} target="_blank" rel="noopener noreferrer">
            <div className="mc-tool-head">
              <div className="mc-tool-icon">{t.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="mc-tool-title">{t.title}</div>
                <div className="mc-tool-subtitle">{t.subtitle}</div>
              </div>
              <span className="mc-tool-badge"><Icon name="spark" size={12} /> Premium</span>
            </div>
            <ul className="mc-tool-features">
              {t.features.map((f, i) => (
                <li key={i}><Icon name="check" size={12} stroke={2} /> {f}</li>
              ))}
            </ul>
            <div className="mc-tool-foot">
              <span className="mc-tool-pricing">{t.pricing}</span>
              <span className="mc-tool-cta">Buchen →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
