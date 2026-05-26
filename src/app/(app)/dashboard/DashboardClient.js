'use client';
import { useMemo, useState, useEffect } from 'react';
import { berechnePersonalisierung } from '@/lib/personalization';

// ─── Helpers ─────────────────────────────────────────────────────────────────
function getNextWebinar() {
  const now = new Date();
  const today10 = new Date(now); today10.setHours(10, 0, 0, 0);
  const today1730 = new Date(now); today1730.setHours(17, 30, 0, 0);
  const tomorrow10 = new Date(now); tomorrow10.setDate(tomorrow10.getDate() + 1); tomorrow10.setHours(10, 0, 0, 0);
  if (now < today10) return today10;
  if (now < today1730) return today1730;
  return tomorrow10;
}
function buildWebinarUrl(userEmail, userName) {
  const base = 'https://daskarriereinstitut.webinargeek.com/karriere-statt-zufall-die-5-schritte-zu-deinem-erfolgreichen-berufseinstieg-traumgehalt';
  const u = new URLSearchParams();
  if (userEmail) u.set('email', userEmail);
  const firstname = (userName || '').split(' ')[0];
  if (firstname) u.set('firstname', firstname);
  return u.toString() ? `${base}?${u.toString()}` : base;
}
function pad2(n) { return n.toString().padStart(2, '0'); }
function timeOfDay(h) { return h < 12 ? 'Morgen' : h < 18 ? 'Tag' : 'Abend'; }

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

// ─── Icons (tiny inline SVGs) ────────────────────────────────────────────────
function Icon({ name, size = 14, stroke = 1.7 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
              stroke: 'currentColor', strokeWidth: stroke,
              strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'target':    return (<svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>);
    case 'play':      return (<svg {...p}><polygon points="6 3 20 12 6 21 6 3"/></svg>);
    case 'brief':     return (<svg {...p}><rect x="2" y="7" width="20" height="14" rx="2"/><path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"/></svg>);
    case 'doc':       return (<svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>);
    case 'check':     return (<svg {...p}><polyline points="20 6 9 17 4 12"/></svg>);
    case 'chev':      return (<svg {...p}><polyline points="9 18 15 12 9 6"/></svg>);
    case 'users':     return (<svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>);
    case 'flame':     return (<svg {...p}><path d="M8.5 14.5A2.5 2.5 0 0 0 11 12c0-1.38-.5-2-1-3-1.072-2.143-.224-4.054 2-6 .5 2.5 2 4.9 4 6.5 2 1.6 3 3.5 3 5.5a7 7 0 1 1-14 0c0-1.153.433-2.294 1-3a2.5 2.5 0 0 0 2.5 2.5z"/></svg>);
    case 'star':      return (<svg {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>);
    case 'book':      return (<svg {...p}><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>);
    case 'sparkles':  return (<svg {...p}><path d="M5 3v4M3 5h4M19 17v4M17 19h4M12 2l2.4 5.1L20 9l-5.1 2.4L12 16l-2.4-5L4 9l5.4-2L12 2z"/></svg>);
    default: return null;
  }
}

// ─── MesseAngebotBlock — preserved for fair leads on FREE plan ──────────────
function MesseAngebotBlock({ fairLead, profile }) {
  const plan = profile?.subscription_plan || 'FREE';
  if (plan !== 'FREE') return null;
  const fairName = fairLead?.fairs?.name;
  return (
    <div style={{ marginBottom: 'var(--gap)', borderRadius: 'var(--r-lg)', overflow: 'hidden', border: '1px solid rgba(204,20,38,0.2)' }}>
      <div style={{ background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', padding: '16px 20px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 12 }}>
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
        <div style={{ fontSize: 11, fontWeight: 700, padding: '4px 10px', borderRadius: 980, background: 'rgba(204,20,38,0.2)', color: '#ff6b7a', border: '1px solid rgba(204,20,38,0.3)' }}>
          7 Tage gratis
        </div>
      </div>
      <div style={{ padding: 20, background: 'var(--surface)' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: 16, padding: '16px 18px', borderRadius: 'var(--r-md)', background: 'rgba(204,20,38,0.04)', border: '1px solid rgba(204,20,38,0.1)', marginBottom: 14 }}>
          <div style={{ fontSize: 28, flexShrink: 0 }}>💎</div>
          <div style={{ flex: 1 }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--label)', marginBottom: 3 }}>
              Premium-Mitgliedschaft — 15 €/Monat
            </div>
            <div style={{ fontSize: 13, color: 'var(--label-3)', lineHeight: 1.5 }}>
              Jeden Monat ein Seminar-Platz im Wert von <strong>99 €</strong> inklusive — plus alle E-Learning Kurse und die Gehaltsverhandlungs-Masterclass.
            </div>
          </div>
        </div>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="/angebote" className="btn btn-primary" style={{ flex: 1, textAlign: 'center', fontSize: 13 }}>
            7 Tage kostenlos testen →
          </a>
          <a href="/angebote" style={{ fontSize: 12, fontWeight: 500, color: 'var(--label-4)', textDecoration: 'none', whiteSpace: 'nowrap', flexShrink: 0 }}>
            oder Seminar einzeln buchen
          </a>
        </div>
      </div>
    </div>
  );
}

// ─── WebinarHero ─────────────────────────────────────────────────────────────
function WebinarHero({ userEmail, userName }) {
  const [next, setNext] = useState(null);
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNext(getNextWebinar());
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(t);
  }, []);

  const url = buildWebinarUrl(userEmail, userName);

  let countDisplay = '—';
  let isLive = false;
  let labelText = 'Start in';
  if (next && now) {
    const diff = next - now;
    if (diff <= 0) { isLive = true; labelText = 'Jetzt'; countDisplay = 'LIVE'; }
    else {
      const totalSec = Math.floor(diff / 1000);
      const h = Math.floor(totalSec / 3600);
      const m = Math.floor((totalSec % 3600) / 60);
      const s = totalSec % 60;
      isLive = diff < 5 * 60 * 1000;
      countDisplay = `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
    }
  }

  const eyebrowText = next
    ? `${isLive ? 'Live · jetzt' : `Live · ${next.getDate()}.${next.getMonth() + 1}. um ${next.getHours()}:${pad2(next.getMinutes())}`}`
    : 'Live · kostenlos';

  return (
    <div className="hero">
      <div className="hero-grain" />
      <div className="hero-body">
        <div className="hero-eyebrow">
          <span className="live-dot" />
          {eyebrowText}
        </div>
        <h2 className="hero-title">
          Karriere statt Zufall.<br />
          <span className="faded">Die fünf Schritte zu deinem Traumgehalt.</span>
        </h2>
        <div className="hero-sub">
          60 Minuten Live-Webinar mit Florian Fritsch — kostenlos, mit Fragen-Runde am Ende.
        </div>
        <div className="hero-actions">
          <a href={url} target="_blank" rel="noopener noreferrer" className="btn btn-on-dark">
            Platz sichern
          </a>
          <span className="hero-meta-chip"><Icon name="play" size={12} /> 60 Min.</span>
          <span className="hero-meta-chip"><Icon name="users" size={12} /> Live &amp; interaktiv</span>
        </div>
      </div>
      <div className="hero-side">
        <div className="hero-count-label">{labelText}</div>
        <div className="hero-count-big">
          {countDisplay.includes(':') ? countDisplay.split(':').map((part, i, arr) => (
            <span key={i}>{part}{i < arr.length - 1 && <span className="sep">:</span>}</span>
          )) : countDisplay}
        </div>
      </div>
    </div>
  );
}

// ─── CV Banner ───────────────────────────────────────────────────────────────
function CvBanner({ cvFeedback, hasCvDoc }) {
  if (hasCvDoc) {
    const rating = cvFeedback?.overall_rating || cvFeedback?.ai_analysis?.overallRating || 0;
    const summary = cvFeedback?.summary || cvFeedback?.ai_analysis?.summary || 'Deine ausführliche Auswertung ist bereit.';
    return (
      <a href="/cv-check" style={{ textDecoration: 'none', color: 'inherit' }}>
        <div className="cv-banner">
          <div className="cv-mini">
            <Icon name="doc" size={14} />
            <span className="stamp"><Icon name="check" size={8} stroke={2.5} /></span>
          </div>
          <div className="cv-banner-text">
            <span className="cv-banner-eyebrow">Lebenslauf-Check</span>
            <span className="cv-banner-title">{summary}</span>
          </div>
          {rating > 0 && (
            <div className="cv-banner-score">
              <div className="score-dots">
                {[1, 2, 3, 4, 5].map(i => (<span key={i} className={i <= rating ? 'on' : ''} />))}
              </div>
              <span>{rating}/5</span>
            </div>
          )}
          <span className="btn btn-tinted">Feedback ansehen</span>
        </div>
      </a>
    );
  }
  return (
    <a href="/cv-check/upload" style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="cv-banner">
        <div className="cv-mini" style={{ background: 'var(--fill-2)', color: 'var(--label-3)' }}>
          <Icon name="doc" size={14} />
        </div>
        <div className="cv-banner-text">
          <span className="cv-banner-eyebrow">Lebenslauf-Check</span>
          <span className="cv-banner-title">KI analysiert deinen Lebenslauf in 30 Sekunden — kostenlos.</span>
        </div>
        <span className="btn btn-tinted">Hochladen</span>
      </div>
    </a>
  );
}

// ─── NextSteps ───────────────────────────────────────────────────────────────
function NextStepsCard({ steps, dayShort }) {
  return (
    <div className="card">
      <div className="card-head">
        <h3 className="card-title">
          <span className="date-pill">{dayShort}</span>
          Nächste Schritte
        </h3>
      </div>
      <div className="step-list">
        {steps.map((step, i) => (
          <a
            key={i}
            href={step.href}
            target={step.external ? '_blank' : undefined}
            rel={step.external ? 'noopener noreferrer' : undefined}
            className={`step${step.primary ? ' primary' : ''}`}
          >
            <div className="step-icon"><Icon name={step.icon} size={18} stroke={1.6} /></div>
            <div style={{ minWidth: 0 }}>
              <div className="step-title">{step.title}</div>
              {step.sub && <div className="step-sub">{step.sub}</div>}
            </div>
            <div className="step-meta">
              {step.meta && <span>{step.meta}</span>}
              <span className="chev"><Icon name="chev" size={14} stroke={1.6} /></span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

// ─── SkillProfile (ring + bars) ──────────────────────────────────────────────
function SkillRing({ score }) {
  const size = 104, thick = 9, r = (size - thick) / 2, c = 2 * Math.PI * r;
  const value = Math.max(0, Math.min(100, score || 0));
  const offset = c - (value / 100) * c;
  return (
    <div className="score-ring-wrap">
      <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line-2)" strokeWidth={thick} />
        <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ki-red-2)" strokeWidth={thick}
                strokeDasharray={c} strokeDashoffset={offset} strokeLinecap="round" />
      </svg>
      <div className="v">
        {Math.round(value)}<span className="of">/100</span>
      </div>
    </div>
  );
}

function SkillProfileCard({ pers, hasAnalysis, analysisResults }) {
  if (!hasAnalysis) {
    return (
      <div className="card">
        <div className="card-head">
          <h3 className="card-title">Dein Stärken-Profil</h3>
        </div>
        <a href="/analyse" style={{ textDecoration: 'none', color: 'inherit', display: 'block' }}>
          <div style={{ padding: '8px 0 4px' }}>
            <div style={{ fontSize: 14, color: 'var(--label-3)', marginBottom: 18, lineHeight: 1.5 }}>
              Starte die Karriere-Analyse. 12 Felder, ~10 Minuten — danach siehst du hier deine echten Stärken und Lücken.
            </div>
            <span className="btn btn-tinted" style={{ display: 'inline-block' }}>Analyse starten →</span>
          </div>
        </a>
      </div>
    );
  }

  const allScores = [
    ...(pers.staerken || []),
    ...(pers.schwaechen || []),
  ];
  const overall = allScores.length > 0
    ? allScores.reduce((a, s) => a + (s.score || 0), 0) / allScores.length
    : 0;

  const top = [
    ...((pers.staerken || []).slice(0, 2).map(s => ({ ...s, kind: 'strength', kindLabel: 'Stärke' }))),
    ...((pers.schwaechen || []).slice(0, 3).map(s => ({
      ...s,
      kind: (s.score || 0) < 50 ? 'gap' : 'work',
      kindLabel: (s.score || 0) < 50 ? 'Lücke' : 'in Arbeit',
    }))),
  ];

  return (
    <div className="card">
      <div className="card-head">
        <h3 className="card-title">Dein Stärken-Profil</h3>
        <a className="card-link" href="/analyse">Alle Felder →</a>
      </div>
      <div className="score-hero">
        <SkillRing score={overall} />
        <div>
          <div className="score-right-title">Dein Karriere-Score</div>
          <div className="score-note">
            {overall >= 70
              ? 'Starke Basis — jetzt die letzten Hebel ziehen.'
              : overall >= 50
                ? 'Solider Stand. Drei Felder gezielt schärfen, das hebt deinen Score schnell.'
                : 'Mehrere klare Lücken — perfekter Startpunkt für die Masterclass.'}
          </div>
        </div>
      </div>
      <div className="skill-list">
        {top.map((s, i) => (
          <div key={s.field_id || s.field_slug || s.label || i} className="skill-row">
            <div className="skill-head">
              <div>
                <span className="skill-name">{s.label}</span>
                <span className={`skill-kind ${s.kind}`}>{s.kindLabel}</span>
              </div>
              <span className="skill-val">{Math.round(s.score || 0)}</span>
            </div>
            <div className="bar">
              <div className={`bar-fill ${s.kind}`} style={{ width: `${Math.max(0, Math.min(100, s.score || 0))}%` }} />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Courses ─────────────────────────────────────────────────────────────────
function CoursesCard({ courses, progress }) {
  const items = (courses || []).filter(c => !c.category || c.category === 'e-learning').slice(0, 6);
  if (items.length === 0) return null;
  return (
    <div className="card" style={{ marginBottom: 'var(--gap)' }}>
      <div className="card-head">
        <h3 className="card-title">
          Masterclass
          <span className="kicker">{items.length} Kurse</span>
        </h3>
        <a className="card-link" href="/masterclass">Alle Kurse →</a>
      </div>
      <div className="course-grid">
        {items.map(c => {
          const total = (c.modules || []).reduce((s, m) => s + (m.lessons || []).length, 0);
          const done = (c.modules || []).reduce((s, m) => s + (m.lessons || []).filter(l => (progress || []).some(p => p.lesson_id === l.id && p.completed)).length, 0);
          const pct = total > 0 ? Math.round((done / total) * 100) : 0;
          const badge = pct === 100 ? 'Fertig' : pct === 0 ? 'Neu' : 'Laufend';
          const letter = (c.title || '?').trim()[0]?.toUpperCase() || '?';
          const moduleCount = (c.modules || []).length;
          const meta = total > 0
            ? `${moduleCount} ${moduleCount === 1 ? 'Modul' : 'Module'} · ${total} Lektionen`
            : `${moduleCount} ${moduleCount === 1 ? 'Modul' : 'Module'}`;
          return (
            <a key={c.id} className="course" href={`/masterclass/${c.id}`}>
              <div className="photo course-cover" style={{ background: courseGradient(c.title) }}>
                <span className="badge">{badge}</span>
                <span className="letter">{letter}</span>
              </div>
              <div className="course-top" style={{ padding: '0 2px' }}>
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div className="course-title">{c.title}</div>
                  <div className="course-meta">{meta}</div>
                </div>
              </div>
              <div className="course-bottom">
                <div className="course-bar">
                  <div className="course-bar-fill" style={{ width: `${pct}%`, background: pct === 100 ? 'var(--green)' : 'var(--ki-red-2)' }} />
                </div>
                <span style={{ color: pct === 100 ? 'var(--green-dark)' : 'var(--label-3)' }}>
                  {pct === 100 ? 'Fertig' : `${pct} %`}
                </span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

// ─── Main Dashboard ──────────────────────────────────────────────────────────
export default function DashboardClient({ profile, analysisSession, analysisResults, progress, courses, applications, cvFeedback, hasCvDoc, fairLead, userEmail }) {
  const hasAnalysis = !!analysisSession;
  const pers = useMemo(
    () => berechnePersonalisierung(analysisResults || [], profile?.phase),
    [analysisResults, profile?.phase]
  );
  const activeApps = (applications || []).filter(a => !['rejected', 'accepted'].includes(a.status)).length;
  const isMesseBesucher = !!fairLead;

  const firstName =
    profile?.first_name ||
    (profile?.name?.split(' ')[0]) ||
    'du';
  const tod = timeOfDay(new Date().getHours());

  const overallScore = hasAnalysis && (analysisResults || []).length > 0
    ? Math.round(analysisResults.reduce((a, r) => a + (r.score || 0), 0) / analysisResults.length)
    : null;

  const totalLessons = (courses || []).reduce(
    (s, c) => s + (c.modules || []).reduce((m, mo) => m + (mo.lessons || []).length, 0), 0
  );
  const doneLessons = (courses || []).reduce(
    (s, c) => s + (c.modules || []).reduce((m, mo) =>
      m + (mo.lessons || []).filter(l => (progress || []).some(p => p.lesson_id === l.id && p.completed)).length, 0), 0
  );
  const lernPct = totalLessons > 0 ? Math.round((doneLessons / totalLessons) * 100) : 0;

  const cvRating = cvFeedback?.overall_rating || cvFeedback?.ai_analysis?.overallRating || 0;

  // Build NextSteps list (top-priority first, with one .primary)
  const steps = useMemo(() => {
    const arr = [];

    if (!hasAnalysis) {
      arr.push({ icon: 'target', title: 'Karriere-Analyse starten', sub: '12 Felder · ca. 10 Minuten', href: '/analyse', meta: 'Empfohlen', primary: true });
    } else if (!hasCvDoc) {
      arr.push({ icon: 'doc', title: 'Lebenslauf hochladen', sub: 'KI-Feedback in 30 Sekunden', href: '/cv-check/upload', meta: 'Empfohlen', primary: true });
    } else if (pers?.empfohleneKurse?.length) {
      const k = pers.empfohleneKurse[0];
      arr.push({ icon: 'sparkles', title: k.title, sub: (k.empfehlung || 'Persönlich für dich empfohlen').slice(0, 90), href: `/masterclass/${k.kursId}`, meta: 'Für dich', primary: true });
    } else {
      arr.push({ icon: 'play', title: 'Masterclass entdecken', sub: 'Module für deinen nächsten Karriereschritt', href: '/masterclass', meta: 'Empfohlen', primary: true });
    }

    // Two additional course recommendations
    if (hasAnalysis && pers?.empfohleneKurse?.length) {
      const firstRecommendedId = pers.empfohleneKurse[0]?.kursId;
      const usedAsPrimary = arr[0]?.href === `/masterclass/${firstRecommendedId}`;
      const offset = usedAsPrimary ? 1 : 0;
      pers.empfohleneKurse.slice(offset, offset + 2).forEach(k => {
        arr.push({
          icon: 'book',
          title: k.title,
          sub: (k.empfehlung || '').slice(0, 80),
          href: `/masterclass/${k.kursId}`,
        });
      });
    }

    if (hasCvDoc && !arr.find(s => s.href === '/cv-check')) {
      arr.push({
        icon: 'doc',
        title: 'CV-Feedback ansehen',
        sub: cvFeedback?.overall_rating
          ? `${cvFeedback.overall_rating}/5 Sterne · konkreter Aktionsplan`
          : 'Ergebnis ansehen',
        href: '/cv-check',
      });
    }

    if (activeApps > 0) {
      arr.push({
        icon: 'brief',
        title: `${activeApps} aktive ${activeApps === 1 ? 'Bewerbung' : 'Bewerbungen'}`,
        sub: 'Status prüfen',
        href: '/applications',
      });
    }

    arr.push({
      icon: 'flame',
      title: 'Kostenloses Webinar',
      sub: 'Karriere statt Zufall · täglich 10:00 & 17:30',
      href: buildWebinarUrl(userEmail, profile?.name || profile?.first_name || ''),
      external: true,
    });

    return arr.slice(0, 6);
  }, [hasAnalysis, hasCvDoc, pers, activeApps, cvFeedback, userEmail, profile]);

  const dayShort = useMemo(() => {
    const d = new Date();
    const days = ['So', 'Mo', 'Di', 'Mi', 'Do', 'Fr', 'Sa'];
    return `${days[d.getDay()]}, ${d.getDate()}.${d.getMonth() + 1}.`;
  }, []);

  return (
    <div className="dashboard-v2">
      <div className="title-kicker">
        <span className="pulse" />
        Heute · Guten {tod}, {firstName}
      </div>
      <h1 className="page-title">
        Hallo {firstName}.{' '}
        <span className="faded">
          {hasAnalysis ? 'Hier ist dein nächster Schritt.' : 'Lass uns mit deiner Analyse starten.'}
        </span>
      </h1>
      <p className="page-sub">
        Dein Dashboard zeigt dir die Sachen, die heute wirklich zählen — und blendet alles andere aus.
      </p>

      <div className="stats">
        <div className="stat">
          <div className="stat-label">
            <span className="sl-ic"><Icon name="target" size={11} /></span>
            Karriere-Score
          </div>
          <div className="stat-value">
            {overallScore !== null ? overallScore : '—'}<span className="unit">/100</span>
          </div>
          <div className="stat-sub">
            {overallScore !== null ? `Aus ${(analysisResults || []).length} Feldern` : 'Analyse starten'}
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">
            <span className="sl-ic"><Icon name="play" size={11} /></span>
            Lernfortschritt
          </div>
          <div className="stat-value">
            {lernPct}<span className="unit">%</span>
          </div>
          <div className="stat-sub">
            {totalLessons > 0 ? `${doneLessons} von ${totalLessons} Lektionen` : 'Noch keine Kurse'}
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">
            <span className="sl-ic"><Icon name="brief" size={11} /></span>
            Bewerbungen aktiv
          </div>
          <div className="stat-value">{activeApps}</div>
          <div className="stat-sub">
            {activeApps === 0 ? 'Keine offen' : activeApps === 1 ? 'Eine in Arbeit' : `${activeApps} in Arbeit`}
          </div>
        </div>
        <div className="stat">
          <div className="stat-label">
            <span className="sl-ic"><Icon name="star" size={11} /></span>
            CV-Check
          </div>
          <div className="stat-value">
            {cvRating ? cvRating : '—'}<span className="unit">/5</span>
          </div>
          <div className="stat-sub">
            {cvRating ? 'Ausführliche Auswertung' : (hasCvDoc ? 'In Bearbeitung' : 'Noch nicht hochgeladen')}
          </div>
        </div>
      </div>

      <CvBanner cvFeedback={cvFeedback} hasCvDoc={hasCvDoc} />

      {isMesseBesucher && <MesseAngebotBlock fairLead={fairLead} profile={profile} />}

      <WebinarHero userEmail={userEmail} userName={profile?.name || profile?.first_name || ''} />

      <div className="dash-grid-3-2">
        <NextStepsCard steps={steps} dayShort={dayShort} />
        <SkillProfileCard pers={pers} hasAnalysis={hasAnalysis} analysisResults={analysisResults} />
      </div>

      <CoursesCard courses={courses} progress={progress} />
    </div>
  );
}
