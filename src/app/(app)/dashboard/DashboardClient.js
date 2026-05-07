'use client';
import { useState, useEffect, useMemo } from 'react';

const Ic = ({ d, size = 16, stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none"
    stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);
const I = {
  target:  <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>,
  play:    <><circle cx="12" cy="12" r="9" /><path d="M10 8.5v7l5.5-3.5z" /></>,
  brief:   <><path d="M7 4h10l2 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8z" /><path d="M5 8h14" /><path d="M9 14h6" /></>,
  flame:   <path d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4-1 3 1 4 2 4 0-3-2-5 0-9z" />,
  doc:     <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></>,
  check:   <path d="M20 6L9 17l-5-5" />,
  chevR:   <path d="M9 5l7 7-7 7" />,
  arrowUp: <path d="M7 14l5-5 5 5" />,
  users:   <><circle cx="9" cy="8" r="3" /><path d="M3 19c0-3 3-5 6-5s6 2 6 5" /><path d="M16 11c2 0 4 1.5 4 3" /></>,
  trophy:  <><path d="M8 21h8M12 17v4" /><path d="M7 5h10v4a5 5 0 0 1-10 0z" /></>,
  message: <path d="M4 5h16v10H9l-5 5z" />,
  spark:   <path d="M13 2L3 14h8l-1 8 10-12h-8z" />,
};

function Silhouette() {
  return (
    <svg viewBox="0 0 100 130" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.3 }}>
      <defs><linearGradient id="silg2" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0" stopColor="#fff" stopOpacity="0.6" /><stop offset="1" stopColor="#fff" stopOpacity="0.2" />
      </linearGradient></defs>
      <circle cx="50" cy="45" r="18" fill="url(#silg2)" />
      <path d="M15 130 C 15 90, 35 75, 50 75 C 65 75, 85 90, 85 130 Z" fill="url(#silg2)" />
    </svg>
  );
}

/* ── Greeting ── */
function TitleBlock({ profile, view, setView }) {
  const greeting = useMemo(() => {
    const h = new Date().getHours();
    return h < 11 ? 'Guten Morgen' : h < 18 ? 'Guten Tag' : 'Guten Abend';
  }, []);
  const day = useMemo(() => {
    const d = new Date();
    const wd = ['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'][d.getDay()];
    const mn = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'][d.getMonth()];
    return `${wd}, ${d.getDate()}. ${mn}`;
  }, []);
  const firstName = profile?.name?.split(' ')[0] || profile?.first_name || 'da';

  return (
    <>
      <div style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 7, marginBottom: 12 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ki-success)', boxShadow: '0 0 0 3px rgba(36,138,61,0.2)', flexShrink: 0 }} />
        {day} · {greeting}
      </div>
      <h1 style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 10px', color: 'var(--ki-text)' }}>
        Hallo {firstName}.{' '}
        <span style={{ color: 'var(--ki-text-tertiary)', fontWeight: 600 }}>Drei Dinge erwarten dich heute.</span>
      </h1>
      <p style={{ fontSize: 16, color: 'var(--ki-text-secondary)', maxWidth: '58ch', lineHeight: 1.5, margin: '0 0 22px' }}>
        Du bist auf einem starken Weg. Analyse abschließen, Webinar ansehen, einen Kurs weitermachen — fertig.
      </p>
      <div style={{ display: 'inline-flex', background: 'var(--ki-bg-alt)', padding: 2, borderRadius: 9, fontSize: 13, marginBottom: 28 }}>
        {[{ id: 'today', label: 'Heute' }, { id: 'week', label: 'Diese Woche' }, { id: 'all', label: 'Alle' }].map(t => (
          <button key={t.id} onClick={() => setView(t.id)} style={{
            padding: '6px 14px', borderRadius: 7,
            background: view === t.id ? 'var(--ki-card)' : 'transparent',
            color: view === t.id ? 'var(--ki-text)' : 'var(--ki-text-secondary)',
            fontWeight: view === t.id ? 600 : 500,
            boxShadow: view === t.id ? '0 0.5px 0 rgba(0,0,0,0.05), 0 1px 3px rgba(0,0,0,0.08)' : 'none',
            border: 'none', cursor: 'pointer', fontSize: 13,
          }}>{t.label}</button>
        ))}
      </div>
    </>
  );
}

/* ── Stats ── */
function Stats({ analysisResults, progress, courses, applications, profile }) {
  const score = useMemo(() => {
    if (!analysisResults?.length) return 0;
    const avg = analysisResults.reduce((s, r) => s + (r.score || 0), 0) / analysisResults.length;
    return Math.round(avg);
  }, [analysisResults]);

  const { pct, done, total } = useMemo(() => {
    const allLessons = (courses || []).flatMap(c => (c.modules || []).flatMap(m => m.lessons || []));
    const total = allLessons.length;
    const done = (progress || []).filter(p => p.completed).length;
    return { pct: total > 0 ? Math.round(done / total * 100) : 0, done, total };
  }, [courses, progress]);

  const interviewCount = (applications || []).filter(a => ['interview', 'screening'].includes(a.status)).length;
  const streak = profile?.streak_days || profile?.login_streak || 0;

  const stats = [
    { label: 'Karriere-Score', icon: 'target', value: score || '—', unit: score ? '/100' : '', sub: score ? '+6 diese Woche' : 'Analyse starten' },
    { label: 'Lernfortschritt', icon: 'play',   value: pct, unit: '%', sub: `${done} von ${total} Lektionen` },
    { label: 'Bewerbungen',    icon: 'brief',   value: (applications || []).length, sub: interviewCount > 0 ? `${interviewCount} im Interview` : 'Noch keine' },
    { label: 'Lernstreak',     icon: 'flame',   value: streak || '—', unit: streak ? ' Tage' : '', sub: streak > 0 ? 'Weiter so!' : 'Heute starten' },
  ];

  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 16 }}>
      {stats.map((s, i) => (
        <div key={i} style={{ background: 'var(--ki-card)', borderRadius: 'var(--r-md)', padding: '16px 18px', boxShadow: 'var(--sh-sm)', border: '0.5px solid var(--ki-border-light)', display: 'flex', flexDirection: 'column', gap: 6 }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 18, height: 18, borderRadius: 5, display: 'grid', placeItems: 'center', color: 'var(--ki-red)', background: 'rgba(204,20,38,0.08)' }}>
              <Ic d={I[s.icon]} size={11} stroke={2} />
            </span>
            {s.label}
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.035em', lineHeight: 1.05, color: 'var(--ki-text)', display: 'flex', alignItems: 'baseline', gap: 3, marginTop: 4, fontVariantNumeric: 'tabular-nums' }}>
            {s.value}<span style={{ fontSize: 15, color: 'var(--ki-text-tertiary)', fontWeight: 500 }}>{s.unit}</span>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: 'var(--ki-success)', fontWeight: 600 }}><Ic d={I.arrowUp} size={11} stroke={2.5} /></span>
            {s.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ── CV Banner ── */
function CVCard({ cvFeedback, hasCvDoc }) {
  if (!hasCvDoc) return null;
  const rating = cvFeedback?.overall_rating || 0;
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 14, background: 'var(--ki-card)', borderRadius: 14, padding: '10px 14px', boxShadow: 'var(--sh-sm)', border: '0.5px solid var(--ki-border-light)', marginBottom: 16 }}>
      <div style={{ width: 28, height: 28, borderRadius: 8, background: 'rgba(204,20,38,0.08)', color: 'var(--ki-red)', display: 'grid', placeItems: 'center', flexShrink: 0, position: 'relative' }}>
        <Ic d={I.doc} size={15} stroke={1.8} />
        <span style={{ position: 'absolute', top: -3, right: -3, width: 12, height: 12, borderRadius: '50%', background: 'var(--ki-success)', color: '#fff', display: 'grid', placeItems: 'center', boxShadow: '0 0 0 1.5px var(--ki-card)' }}>
          <Ic d={I.check} size={7} stroke={3.5} />
        </span>
      </div>
      <div style={{ display: 'flex', alignItems: 'baseline', gap: 8, flex: 1, minWidth: 0 }}>
        <span style={{ fontSize: 11, color: 'var(--ki-red-dark)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em', flexShrink: 0 }}>Lebenslauf-Check</span>
        <span style={{ fontSize: 13.5, color: 'var(--ki-text)', fontWeight: 500, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
          {cvFeedback?.summary ? cvFeedback.summary.substring(0, 80) + '…' : 'Analyse fertig — drei klare Hebel für mehr Wirkung.'}
        </span>
      </div>
      {rating > 0 && (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flexShrink: 0 }}>
          <div style={{ display: 'flex', gap: 4 }}>
            {[1,2,3,4,5].map(n => <span key={n} style={{ width: 8, height: 8, borderRadius: '50%', background: n <= rating ? 'var(--ki-red)' : 'var(--ki-border)' }} />)}
          </div>
          <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', fontFamily: 'monospace' }}>{rating}/5</span>
        </div>
      )}
      <a href="/cv-check" style={{ display: 'inline-flex', alignItems: 'center', padding: '6px 14px', borderRadius: 980, background: 'rgba(204,20,38,0.08)', color: 'var(--ki-red)', fontSize: 13, fontWeight: 600, textDecoration: 'none', flexShrink: 0 }}>
        Feedback ansehen
      </a>
    </div>
  );
}

/* ── Hero (Webinar) ── */
function Hero({ userEmail, userName }) {
  const [t, setT] = useState({ h: 0, m: 0, s: 0 });
  const [isLive, setIsLive] = useState(false);

  useEffect(() => {
    function getNext() {
      const now = new Date();
      const t1030 = new Date(now); t1030.setHours(10, 0, 0, 0);
      const t1730 = new Date(now); t1730.setHours(17, 30, 0, 0);
      const tmrw  = new Date(now); tmrw.setDate(tmrw.getDate() + 1); tmrw.setHours(10, 0, 0, 0);
      if (now < t1030) return t1030;
      if (now < t1730) return t1730;
      return tmrw;
    }
    function tick() {
      const diff = getNext() - new Date();
      if (diff <= 0) { setIsLive(true); return; }
      setIsLive(diff < 300000);
      setT({ h: Math.floor(diff / 3600000), m: Math.floor((diff % 3600000) / 60000), s: Math.floor((diff % 60000) / 1000) });
    }
    tick();
    const id = setInterval(tick, 1000);
    return () => clearInterval(id);
  }, []);

  const pad = n => String(n).padStart(2, '0');
  const params = new URLSearchParams();
  if (userEmail) params.set('email', userEmail);
  if (userName) params.set('firstname', userName.split(' ')[0]);
  const url = `https://daskarriereinstitut.webinargeek.com/karriere-statt-zufall-die-5-schritte-zu-deinem-erfolgreichen-berufseinstieg-traumgehalt${params.toString() ? '?' + params.toString() : ''}`;

  return (
    <div style={{
      position: 'relative', borderRadius: 'var(--r-lg)', padding: '40px 44px', marginBottom: 16,
      overflow: 'hidden',
      background: 'radial-gradient(500px 240px at 85% 20%, rgba(214,48,72,0.35), transparent 70%), radial-gradient(420px 260px at 10% 110%, rgba(130,3,28,0.9), transparent 70%), linear-gradient(160deg, #1d1d1f 0%, #2b1114 55%, #82031C 100%)',
      color: '#fff', display: 'grid', gridTemplateColumns: '1fr auto auto',
      gap: 32, alignItems: 'stretch', minHeight: 240,
      boxShadow: '0 20px 50px rgba(130,3,28,0.2)',
    }}>
      <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4, backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)', backgroundSize: '3px 3px' }} />

      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600, padding: '5px 11px', background: 'rgba(255,255,255,0.14)', color: '#fff', borderRadius: 980, marginBottom: 20, border: '0.5px solid rgba(255,255,255,0.18)' }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF3B30', boxShadow: '0 0 6px #FF3B30', animation: 'pulse 1.6s infinite' }} />
            {isLive ? 'Jetzt live!' : 'Live · Täglich 10:00 & 17:30 · Kostenlos'}
          </div>
          <h2 style={{ fontSize: 34, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 14px', color: '#fff' }}>
            Karriere statt Zufall.<br />
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>Die fünf Schritte zu deinem Traumgehalt.</span>
          </h2>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.75)', lineHeight: 1.5, maxWidth: '50ch' }}>
            60 Minuten Live-Webinar mit Florian Fritsch. Konkrete Taktik statt Motivation.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24 }}>
          <a href={url} target="_blank" rel="noopener noreferrer" style={{ display: 'inline-flex', alignItems: 'center', padding: '10px 20px', borderRadius: 980, background: '#fff', color: '#1d1d1f', fontSize: 14, fontWeight: 600, textDecoration: 'none' }}>
            Platz sichern
          </a>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'rgba(255,255,255,0.7)', padding: '7px 13px', borderRadius: 980, background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.12)' }}>
            <Ic d={I.users} size={12} /> 847 angemeldet
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 12.5, color: 'rgba(255,255,255,0.7)', padding: '7px 13px', borderRadius: 980, background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.12)' }}>
            <Ic d={I.play} size={12} /> 60 Min.
          </span>
        </div>
      </div>

      {/* Countdown */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 6 }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Start in</div>
        <div style={{ fontSize: 52, fontWeight: 600, color: '#fff', letterSpacing: '-0.04em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>
          {isLive ? 'LIVE' : <>{pad(t.h)}<span style={{ color: 'rgba(255,255,255,0.35)' }}>:</span>{pad(t.m)}<span style={{ color: 'rgba(255,255,255,0.35)' }}>:</span>{pad(t.s)}</>}
        </div>
      </div>

      {/* Portrait */}
      <div style={{ width: 190, alignSelf: 'stretch', borderRadius: 14, overflow: 'hidden', position: 'relative', background: 'linear-gradient(180deg, #4a0a14, #2a0508)', flexShrink: 0, boxShadow: '0 20px 50px rgba(0,0,0,0.4), inset 0 0 0 0.5px rgba(255,255,255,0.08)' }}>
        <Silhouette />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 16px', background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.7))' }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff' }}>Florian Fritsch</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Karriere-Coach</div>
        </div>
      </div>
      <style>{`@keyframes pulse { 0%,100%{opacity:1}50%{opacity:.4} }`}</style>
    </div>
  );
}

/* ── Next Steps ── */
function NextSteps({ analysisResults, hasCvDoc, courses, progress, applications }) {
  const hasAnalysis = analysisResults?.length > 0;
  const completedLessons = new Set((progress || []).filter(p => p.completed).map(p => p.lesson_id));

  const activeLesson = useMemo(() => {
    for (const c of (courses || [])) {
      for (const m of (c.modules || [])) {
        for (const l of (m.lessons || [])) {
          if (!completedLessons.has(l.id)) return { course: c, lesson: l };
        }
      }
    }
    return null;
  }, [courses, completedLessons]);

  const steps = [
    !hasAnalysis && { icon: 'target', title: 'Karriere-Analyse starten', sub: '12 Felder · ca. 10 Minuten', meta: 'Empfohlen', href: '/analyse', primary: true },
    hasCvDoc && { icon: 'doc', title: 'Lebenslauf-Feedback öffnen', sub: 'Konkrete Hebel warten auf dich.', meta: '→', href: '/cv-check' },
    activeLesson && { icon: 'play', title: activeLesson.lesson.title || 'Nächste Lektion', sub: activeLesson.course.title, meta: '→', href: `/masterclass` },
    (applications || []).length > 0 && { icon: 'brief', title: `${applications.length} aktive Bewerbungen`, sub: `${(applications || []).filter(a => ['interview','screening'].includes(a.status)).length} im Interview`, meta: '→', href: '/applications' },
    hasAnalysis && !hasCvDoc && { icon: 'doc', title: 'Lebenslauf hochladen', sub: 'Persönliches Feedback in 24h', meta: '→', href: '/cv-check' },
  ].filter(Boolean).slice(0, 4);

  if (!steps.length) steps.push({ icon: 'play', title: 'Masterclass entdecken', sub: 'Starte deinen ersten Kurs', meta: '→', href: '/masterclass' });

  const date = (() => { const d = new Date(); return `${['So','Mo','Di','Mi','Do','Fr','Sa'][d.getDay()]}, ${d.getDate()}.${d.getMonth()+1}.`; })();

  return (
    <div style={{ background: 'var(--ki-card)', borderRadius: 'var(--r-lg)', padding: 22, boxShadow: 'var(--sh-sm)', border: '0.5px solid var(--ki-border-light)' }}>
      <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', gap: 12, marginBottom: 18 }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 16 }}>
          <span style={{ fontSize: 36, fontWeight: 600, color: 'var(--ki-red)', letterSpacing: '-0.03em', fontVariantNumeric: 'tabular-nums', lineHeight: 1 }}>{date}</span>
          <span style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ki-text)' }}>Nächste Schritte</span>
        </div>
        <a href="/dashboard" style={{ fontSize: 13, color: 'var(--ki-red-deeper)', fontWeight: 500, textDecoration: 'none' }}>Alle ansehen</a>
      </div>
      <div>
        {steps.map((s, i) => (
          <a key={i} href={s.href || '#'} style={{ textDecoration: 'none', display: 'grid', gridTemplateColumns: '36px 1fr auto', alignItems: 'center', gap: 14, padding: s.primary ? 13 : '13px 4px', borderTop: i > 0 ? '0.5px solid var(--ki-border-light)' : 'none', borderRadius: s.primary ? 12 : 0, background: s.primary ? 'rgba(204,20,38,0.05)' : 'transparent', margin: s.primary ? '0 -9px' : 0 }}>
            <div style={{ width: 36, height: 36, borderRadius: 10, background: s.primary ? '#fff' : 'var(--ki-bg-alt)', color: s.primary ? 'var(--ki-red)' : 'var(--ki-text-secondary)', display: 'grid', placeItems: 'center', boxShadow: s.primary ? '0 1px 2px rgba(0,0,0,0.06)' : 'none' }}>
              <Ic d={I[s.icon]} size={16} />
            </div>
            <div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ki-text)', letterSpacing: '-0.01em' }}>{s.title}</div>
              <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 1 }}>{s.sub}</div>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 4, fontSize: 12.5, color: s.primary ? 'var(--ki-red)' : 'var(--ki-text-tertiary)', fontWeight: s.primary ? 600 : 500 }}>
              {s.meta}
              <Ic d={I.chevR} size={12} stroke={2.2} />
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Skill Profile ── */
function Ring({ value = 0, size = 104, thick = 9 }) {
  const r = (size - thick) / 2;
  const c = 2 * Math.PI * r;
  const off = c - (value / 100) * c;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--ki-border)" strokeWidth={thick} />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="var(--ki-red)" strokeWidth={thick} strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
    </svg>
  );
}

function SkillProfile({ analysisResults }) {
  const score = useMemo(() => {
    if (!analysisResults?.length) return 0;
    return Math.round(analysisResults.reduce((s, r) => s + (r.score || 0), 0) / analysisResults.length);
  }, [analysisResults]);

  const skills = useMemo(() => {
    return (analysisResults || []).slice(0, 5).map(r => ({
      name: r.competency_fields?.title || r.field_title || 'Kompetenz',
      score: r.score || 0,
      kind: r.score >= 70 ? 'strength' : r.score >= 40 ? 'work' : 'gap',
    })).sort((a, b) => b.score - a.score);
  }, [analysisResults]);

  const kindLabel = { strength: 'Stärke', gap: 'Lücke', work: 'in Arbeit' };
  const kindColor = { strength: { color: '#248A3D', bg: '#E5F5EA' }, gap: { color: '#A90C21', bg: '#FDEDEF' }, work: { color: '#C76B00', bg: '#FFF3E2' } };
  const barColor = { strength: '#30D158', gap: 'var(--ki-red)', work: '#FF9F0A' };

  return (
    <div style={{ background: 'var(--ki-card)', borderRadius: 'var(--r-lg)', padding: 22, boxShadow: 'var(--sh-sm)', border: '0.5px solid var(--ki-border-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ki-text)', margin: 0 }}>Karriere-Score</h3>
        <a href="/analyse" style={{ fontSize: 13, color: 'var(--ki-red-deeper)', fontWeight: 500, textDecoration: 'none' }}>Alle Felder</a>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 18, paddingBottom: 20, marginBottom: 20, borderBottom: '0.5px solid var(--ki-border-light)' }}>
        <div style={{ position: 'relative', width: 104, height: 104, flexShrink: 0 }}>
          <Ring value={score} />
          <div style={{ position: 'absolute', inset: 0, display: 'grid', placeItems: 'center', fontSize: 22, fontWeight: 600, letterSpacing: '-0.03em', color: 'var(--ki-text)', fontVariantNumeric: 'tabular-nums' }}>
            {score}<span style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', fontWeight: 500 }}>/100</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ki-text)', letterSpacing: '-0.015em' }}>Dein Karriere-Score</div>
          <div style={{ color: 'var(--ki-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, fontSize: 13, marginTop: 4 }}>
            <Ic d={I.arrowUp} size={12} stroke={2.5} /> +6 diese Woche
          </div>
          <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 6, lineHeight: 1.4, maxWidth: '28ch' }}>
            {score < 50 ? 'Starte die Analyse für deinen Score.' : 'Zwei klare Lücken — Modul 2 füllt sie.'}
          </div>
        </div>
      </div>

      {skills.length > 0 ? (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
          {skills.map((s, i) => (
            <div key={i}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                <div>
                  <span style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ki-text)', letterSpacing: '-0.01em' }}>{s.name}</span>
                  <span style={{ fontSize: 11, fontWeight: 600, padding: '1px 7px', borderRadius: 980, marginLeft: 8, color: kindColor[s.kind].color, background: kindColor[s.kind].bg }}>{kindLabel[s.kind]}</span>
                </div>
                <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', fontFamily: 'monospace', fontVariantNumeric: 'tabular-nums' }}>{s.score}</span>
              </div>
              <div style={{ height: 6, borderRadius: 980, background: 'var(--ki-bg-alt)', overflow: 'hidden' }}>
                <div style={{ height: '100%', borderRadius: 980, width: `${s.score}%`, background: barColor[s.kind], transition: 'width 0.6s ease' }} />
              </div>
            </div>
          ))}
        </div>
      ) : (
        <div style={{ textAlign: 'center', padding: '24px 0' }}>
          <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 12 }}>Starte die Analyse für deinen persönlichen Score.</div>
          <a href="/analyse" style={{ display: 'inline-flex', padding: '8px 18px', borderRadius: 980, background: 'var(--ki-red)', color: '#fff', fontSize: 13, fontWeight: 600, textDecoration: 'none' }}>Analyse starten →</a>
        </div>
      )}
    </div>
  );
}

/* ── Courses ── */
function Courses({ courses, progress }) {
  const completedIds = new Set((progress || []).filter(p => p.completed).map(p => p.lesson_id));
  const TINTS = ['linear-gradient(135deg,#D63048,#82031C)', 'linear-gradient(135deg,#FF9F0A,#C76B00)', 'linear-gradient(135deg,#0071E3,#003D82)', 'linear-gradient(135deg,#30D158,#248A3D)', 'linear-gradient(135deg,#A90C21,#3c0411)', 'linear-gradient(135deg,#6E6E73,#2b2b2e)'];
  const list = (courses || []).slice(0, 6);

  return (
    <div style={{ background: 'var(--ki-card)', borderRadius: 'var(--r-lg)', padding: 22, marginBottom: 16, boxShadow: 'var(--sh-sm)', border: '0.5px solid var(--ki-border-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ki-text)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          Masterclass
          <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 980, color: 'var(--ki-text-tertiary)', background: 'var(--ki-bg-alt)' }}>{list.length} Kurse</span>
        </h3>
        <a href="/masterclass" style={{ fontSize: 13, color: 'var(--ki-red-deeper)', fontWeight: 500, textDecoration: 'none' }}>Alle Kurse</a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 12 }}>
        {list.map((c, i) => {
          const allLessons = (c.modules || []).flatMap(m => m.lessons || []);
          const done = allLessons.filter(l => completedIds.has(l.id)).length;
          const pct = allLessons.length > 0 ? Math.round(done / allLessons.length * 100) : 0;
          return (
            <a key={c.id} href={`/masterclass/c/${c.id}`} style={{ textDecoration: 'none', padding: 16, borderRadius: 'var(--r-md)', background: 'var(--ki-bg-alt)', cursor: 'pointer', display: 'flex', flexDirection: 'column', gap: 14, transition: 'background 0.15s ease' }}
              onMouseEnter={e => e.currentTarget.style.background = 'var(--ki-border-light)'}
              onMouseLeave={e => e.currentTarget.style.background = 'var(--ki-bg-alt)'}>
              <div style={{ width: '100%', aspectRatio: '16/9', borderRadius: 10, position: 'relative', overflow: 'hidden', background: TINTS[i % TINTS.length] }}>
                <Silhouette />
                <span style={{ position: 'absolute', top: 8, right: 8, zIndex: 3, fontSize: 10.5, fontWeight: 600, padding: '3px 8px', borderRadius: 980, background: 'rgba(255,255,255,0.9)', color: 'var(--ki-red-dark)' }}>
                  {pct === 100 ? 'Fertig' : pct === 0 ? 'Neu' : 'Laufend'}
                </span>
              </div>
              <div>
                <div style={{ fontSize: 14.5, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.015em', color: 'var(--ki-text)' }}>{c.title}</div>
                <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 3 }}>
                  {(c.modules || []).length} Module · {allLessons.length} Lektionen
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 10, fontSize: 12, color: 'var(--ki-text-tertiary)', fontWeight: 500 }}>
                <div style={{ flex: 1, height: 4, borderRadius: 980, background: 'var(--ki-border)', overflow: 'hidden' }}>
                  <div style={{ height: '100%', borderRadius: 980, width: `${pct}%`, background: pct === 100 ? 'var(--ki-success)' : 'var(--ki-red)' }} />
                </div>
                <span style={{ color: pct === 100 ? 'var(--ki-success)' : 'var(--ki-text-tertiary)' }}>{pct === 100 ? 'Fertig' : `${pct} %`}</span>
              </div>
            </a>
          );
        })}
      </div>
    </div>
  );
}

/* ── Activity ── */
function Activity({ progress, applications }) {
  const rows = useMemo(() => {
    const items = [];
    (progress || []).filter(p => p.completed).slice(0, 2).forEach((p, i) => {
      items.push({ icon: 'check', title: 'Lektion abgeschlossen', sub: '+20 Karriere-Punkte', time: i === 0 ? 'Heute' : 'Gestern' });
    });
    (applications || []).slice(0, 2).forEach(a => {
      items.push({ icon: 'brief', title: `Bewerbung: ${a.company || 'Unternehmen'}`, sub: `Status: ${a.status || 'eingereicht'}`, time: new Date(a.created_at).toLocaleDateString('de-DE', { day: 'numeric', month: 'short' }) });
    });
    if (!items.length) {
      items.push({ icon: 'spark', title: 'Willkommen im Karriere-Institut!', sub: 'Starte deinen ersten Kurs', time: 'Heute' });
    }
    return items.slice(0, 4);
  }, [progress, applications]);

  return (
    <div style={{ background: 'var(--ki-card)', borderRadius: 'var(--r-lg)', padding: 22, boxShadow: 'var(--sh-sm)', border: '0.5px solid var(--ki-border-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ki-text)', margin: 0 }}>Aktivität</h3>
        <a href="#" style={{ fontSize: 13, color: 'var(--ki-red-deeper)', fontWeight: 500, textDecoration: 'none' }}>Alle</a>
      </div>
      {rows.map((a, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '32px 1fr auto', gap: 12, alignItems: 'center', padding: '10px 0', borderTop: i > 0 ? '0.5px solid var(--ki-border-light)' : 'none' }}>
          <div style={{ width: 32, height: 32, borderRadius: 9, display: 'grid', placeItems: 'center', background: 'var(--ki-bg-alt)', color: 'var(--ki-text-secondary)' }}>
            <Ic d={I[a.icon]} size={15} />
          </div>
          <div>
            <div style={{ fontSize: 13.5, fontWeight: 500, color: 'var(--ki-text)', letterSpacing: '-0.01em' }}>{a.title}</div>
            <div style={{ fontSize: 12.5, color: 'var(--ki-text-secondary)', marginTop: 1 }}>{a.sub}</div>
          </div>
          <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', fontVariantNumeric: 'tabular-nums' }}>{a.time}</div>
        </div>
      ))}
    </div>
  );
}

/* ── Upcoming ── */
function Upcoming() {
  const evts = [
    { day: '23', mon: 'Mai', time: '17:30', title: 'Live-Webinar: Karriere statt Zufall', tag: 'Webinar', free: true },
    { day: '28', mon: 'Mai', time: '18:00', title: 'Coaching-Gruppe: Gehalt verhandeln',  tag: 'Seminar', free: false },
    { day: '02', mon: 'Jun', time: '16:00', title: 'Office Hours mit Coach Lena',          tag: 'Q & A',   free: true },
  ];
  return (
    <div style={{ background: 'var(--ki-card)', borderRadius: 'var(--r-lg)', padding: 22, boxShadow: 'var(--sh-sm)', border: '0.5px solid var(--ki-border-light)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ki-text)', margin: 0 }}>Kommende Termine</h3>
        <a href="/masterclass" style={{ fontSize: 13, color: 'var(--ki-red-deeper)', fontWeight: 500, textDecoration: 'none' }}>Kalender</a>
      </div>
      {evts.map((e, i) => (
        <div key={i} style={{ display: 'grid', gridTemplateColumns: '52px 1fr auto', gap: 16, alignItems: 'center', padding: '12px 0', borderTop: i > 0 ? '0.5px solid var(--ki-border-light)' : 'none' }}>
          <div style={{ width: 52, textAlign: 'center', background: 'var(--ki-bg-alt)', borderRadius: 10, padding: '7px 0', border: '0.5px solid var(--ki-border-light)' }}>
            <div style={{ fontSize: 10, color: 'var(--ki-red)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{e.mon}</div>
            <div style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.1, color: 'var(--ki-text)' }}>{e.day}</div>
          </div>
          <div>
            <div style={{ fontSize: 14, fontWeight: 600, lineHeight: 1.2, letterSpacing: '-0.015em', color: 'var(--ki-text)' }}>{e.title}</div>
            <div style={{ display: 'flex', gap: 8, marginTop: 3, fontSize: 12, color: 'var(--ki-text-secondary)', alignItems: 'center' }}>
              <span>{e.time}</span>
              <span style={{ color: 'var(--ki-border)' }}>·</span>
              <span style={{ padding: '1px 7px', borderRadius: 980, fontSize: 11, fontWeight: 600, background: e.free ? '#E5F5EA' : '#FDEDEF', color: e.free ? '#248A3D' : '#A90C21' }}>{e.free ? 'Kostenlos' : 'Premium'}</span>
              <span style={{ color: 'var(--ki-border)' }}>·</span>
              <span>{e.tag}</span>
            </div>
          </div>
          <button style={{ padding: '7px 14px', borderRadius: 980, background: 'rgba(204,20,38,0.08)', color: 'var(--ki-red)', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Anmelden</button>
        </div>
      ))}
    </div>
  );
}

/* ── Coach Row ── */
function CoachRow() {
  const coaches = [
    { name: 'Florian Fritsch', role: 'Karriere-Coach',    online: true },
    { name: 'Lena Hartmann',   role: 'Karriere-Coaching', online: true },
    { name: 'Tobias Keller',   role: 'Gehalts-Strategie', online: false },
    { name: 'Sara Brandt',     role: 'Interview-Training', online: true },
    { name: 'Michael Voss',    role: 'LinkedIn & Netzwerk', online: false },
  ];
  return (
    <div style={{ background: 'var(--ki-card)', borderRadius: 'var(--r-lg)', padding: 22, boxShadow: 'var(--sh-sm)', border: '0.5px solid var(--ki-border-light)', marginBottom: 16 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ki-text)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          Dein Coaching-Team
          <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 980, color: 'var(--ki-text-tertiary)', background: 'var(--ki-bg-alt)' }}>5 Coaches</span>
        </h3>
        <a href="/coach" style={{ fontSize: 13, color: 'var(--ki-red-deeper)', fontWeight: 500, textDecoration: 'none' }}>Alle Coaches</a>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(5,1fr)', gap: 14 }}>
        {coaches.map((c, i) => (
          <a key={i} href="/coach" style={{ textDecoration: 'none', display: 'flex', flexDirection: 'column', gap: 10, cursor: 'pointer' }}>
            <div style={{ width: '100%', aspectRatio: '3/4', borderRadius: 14, position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #353A3B, #1a1c1d)', transition: 'transform 0.2s ease' }}
              onMouseEnter={e => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseLeave={e => e.currentTarget.style.transform = 'none'}>
              <Silhouette />
            </div>
            <div>
              <div style={{ fontSize: 13.5, fontWeight: 600, letterSpacing: '-0.01em', color: 'var(--ki-text)' }}>{c.name}</div>
              <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 1 }}>{c.role}</div>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}

/* ── Main Export ── */
export default function DashboardClient({ profile, analysisSession, analysisResults, progress, courses, applications, cvFeedback, hasCvDoc, fairLead, userEmail }) {
  const [view, setView] = useState('today');

  return (
    <div style={{ padding: '40px 48px 80px', maxWidth: 1200 }}>
      <TitleBlock profile={profile} view={view} setView={setView} />
      <Stats analysisResults={analysisResults} progress={progress} courses={courses} applications={applications} profile={profile} />
      <CVCard cvFeedback={cvFeedback} hasCvDoc={hasCvDoc} />
      <Hero userEmail={userEmail} userName={profile?.name} />
      <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 1fr', gap: 16, marginBottom: 16 }}>
        <NextSteps analysisResults={analysisResults} hasCvDoc={hasCvDoc} courses={courses} progress={progress} applications={applications} />
        <SkillProfile analysisResults={analysisResults} />
      </div>
      <Courses courses={courses} progress={progress} />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16, marginBottom: 16 }}>
        <Activity progress={progress} applications={applications} />
        <Upcoming />
      </div>
      <CoachRow />
    </div>
  );
}
