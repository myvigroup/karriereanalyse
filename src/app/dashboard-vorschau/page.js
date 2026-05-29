'use client';

import React, { useState, useEffect } from 'react';
import './dashboard-vorschau.css';

const TWEAK_DEFAULTS = /*EDITMODE-BEGIN*/{
  "density": "roomy",
  "cardstyle": "default",
  "view": "today"
}/*EDITMODE-END*/;

const Ic = ({ d, size = 16, stroke = 1.7 }) =>
<svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{d}</svg>;

const icons = {
  home: <path d="M4 11l8-7 8 7v8a2 2 0 0 1-2 2h-3v-6h-6v6H6a2 2 0 0 1-2-2z" />,
  target: <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>,
  play: <><circle cx="12" cy="12" r="9" /><path d="M10 8.5v7l5.5-3.5z" /></>,
  doc: <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /><path d="M8 13h8M8 17h6" /></>,
  chat: <path d="M21 12a8 8 0 0 1-8 8H5l3-3a8 8 0 1 1 13-5z" />,
  users: <><circle cx="9" cy="8" r="3" /><circle cx="17" cy="10" r="2.5" /><path d="M3 19c0-3 3-5 6-5s6 2 6 5" /><path d="M15 19c0-2 2-3.5 4-3.5s2 0.5 2 1.5" /></>,
  brief: <><path d="M7 4h10l2 4v12a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V8z" /><path d="M5 8h14" /><path d="M9 14h6" /></>,
  bell: <><path d="M18 16l-1.5-3V10a4.5 4.5 0 0 0-9 0v3L6 16z" /><path d="M9 20a3 3 0 0 0 6 0" /></>,
  search: <><circle cx="11" cy="11" r="7" /><path d="M20 20l-3.5-3.5" /></>,
  chevR: <path d="M9 5l7 7-7 7" />,
  arrowUp: <path d="M7 14l5-5 5 5" />,
  check: <path d="M20 6L9 17l-5-5" />,
  cal: <><rect x="4" y="5" width="16" height="16" rx="2.5" /><path d="M4 10h16M9 3v4M15 3v4" /></>,
  flame: <path d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4-1 3 1 4 2 4 0-3-2-5 0-9z" />,
  settings: <><circle cx="12" cy="12" r="3" /><path d="M12 2v3M12 19v3M4.2 4.2l2.1 2.1M17.7 17.7l2.1 2.1M2 12h3M19 12h3M4.2 19.8l2.1-2.1M17.7 6.3l2.1-2.1" /></>,
  spark: <><path d="M13 2L3 14h8l-1 8 10-12h-8z" /></>,
  trophy: <><path d="M8 21h8M12 17v4" /><path d="M7 5h10v4a5 5 0 0 1-10 0z" /><path d="M7 5H4v1a3 3 0 0 0 3 3M17 5h3v1a3 3 0 0 1-3 3" /></>,
  book: <><path d="M4 5a2 2 0 0 1 2-2h12v18H6a2 2 0 0 1-2-2z" /><path d="M4 5v14" /></>,
  message: <path d="M4 5h16v10H9l-5 5z" />
};

function Sidebar({ collapsed, onToggle }) {
  const items1 = [
  { label: 'Übersicht', icon: icons.home, active: true },
  { label: 'Karriere-Analyse', icon: icons.target, count: '12', href: 'Karriere-Analyse.html' },
  { label: 'Masterclass', icon: icons.play, href: 'Masterclass.html' },
  { label: 'Lebenslauf-Check', icon: icons.doc, dot: true, href: 'Lebenslauf-Check.html' },
  { label: 'Coach', icon: icons.chat, href: 'Coach.html' }];

  const items2 = [
  { label: 'Bewerbungen', icon: icons.brief, count: '4', href: 'Bewerbungen.html' },
  { label: 'Kalender', icon: icons.cal, href: 'Kalender.html' },
  { label: 'Community', icon: icons.trophy, href: 'Community.html' }];

  return (
    <aside className="sb" style={{ position: 'sticky' }}>
      <button className="sb-toggle" onClick={onToggle} aria-label="Seitenleiste umschalten" title="⌘B">
        <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M15 5l-7 7 7 7" /></svg>
      </button>
      <div className="sb-brand">
        <div className="sb-logo">Ki</div>
        <div className="sb-brand-text">
          <div className="sb-brand-title">Karriere-Institut</div>
          <div className="sb-brand-sub">Academy</div>
        </div>
      </div>

      <div className="sb-search" onClick={() => window.dispatchEvent(new CustomEvent("ki-open-search"))}>
        <Ic d={icons.search} size={13} />
        <span>Suchen</span>
        <span className="shortcut">⌘ K</span>
      </div>

      <div className="sb-section-label">Lernen</div>
      {items1.map((it, i) =>
      <a key={i} href={it.href || '#'} className={`sb-item ${it.active ? 'active' : ''}`} style={{textDecoration:'none'}}>
          <span className="i"><Ic d={it.icon} /></span>
          <span className="label-text">{it.label}</span>
          {it.count && <span className="count">{it.count}</span>}
          {it.dot && <span className="ddot" />}
        </a>
      )}

      <div className="sb-section-label">Karriere</div>
      {items2.map((it, i) =>
      <a key={i} href={it.href || '#'} className="sb-item" style={{textDecoration:'none'}}>
          <span className="i"><Ic d={it.icon} /></span>
          <span className="label-text">{it.label}</span>
          {it.count && <span className="count">{it.count}</span>}
        </a>
      )}

      <a href="Profil.html" className="sb-user" style={{ textDecoration: 'none', cursor: 'pointer' }}>
        <div className="avatar">MK</div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div className="sb-user-name">Marie Krüger</div>
          <div className="sb-user-meta">Premium · Berufseinstieg</div>
        </div>
        <Ic d={icons.chevR} size={12} stroke={2.2} />
      </a>
    </aside>);

}

function TitleBlock({ view, setView }) {
  return (
    <>
      <div className="title-kicker"><span className="pulse" /> {(()=>{const d=new Date();const wd=['Sonntag','Montag','Dienstag','Mittwoch','Donnerstag','Freitag','Samstag'][d.getDay()];const mn=['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'][d.getMonth()];const h=d.getHours();const greet=h<11?'Guten Morgen':h<18?'Guten Tag':'Guten Abend';return `${wd}, ${d.getDate()}. ${mn} · ${greet}`;})()}</div>
      <h1 className="page-title" style={{ letterSpacing: "0px" }}>
        Hallo Marie. <span className="faded" style={{ letterSpacing: "0px" }}>Drei Dinge erwarten dich heute.</span>
      </h1>
      <p className="page-sub" style={{ fontFamily: "Inter" }}>
        Du bist auf einem starken Weg. Modul 2 beenden, Webinar ansehen, eine Bewerbung rausschicken — fertig.
      </p>
      <div className="segmented">
        {[
        { id: 'today', label: 'Heute' },
        { id: 'week', label: 'Diese Woche' },
        { id: 'all', label: 'Alle' }].
        map((t) =>
        <button key={t.id} className={view === t.id ? 'on' : ''} onClick={() => setView(t.id)}>{t.label}</button>
        )}
      </div>
    </>);

}

function Stats({ view = 'today' }) {
  const sets = {
    today: [
      { label: 'Heute fokussiert', icon: icons.flame, value: '3', unit: 'Tasks', sub: '1 erledigt · 2 offen' },
      { label: 'Lernen heute', icon: icons.play, value: '24', unit: 'Min', sub: 'Modul 2 · Lektion 4' },
      { label: 'Bewerbungen heute', icon: icons.brief, value: '0', sub: 'Keine geplant' },
      { label: 'Coach heute', icon: icons.chat, value: '1', unit: 'Nachricht', sub: 'Florian · ungelesen' }
    ],
    week: [
      { label: 'Karriere-Score', icon: icons.target, value: '72', unit: '/100', sub: '+6 diese Woche' },
      { label: 'Lernfortschritt', icon: icons.play, value: '48', unit: '%', sub: '3 von 5 Modulen' },
      { label: 'Bewerbungen', icon: icons.brief, value: '4', sub: '2 im Interview' },
      { label: 'Lernstreak', icon: icons.flame, value: '12', unit: 'Tage', sub: 'Rekord in Sicht' }
    ],
    all: [
      { label: 'Karriere-Score gesamt', icon: icons.target, value: '72', unit: '/100', sub: '+18 seit Start' },
      { label: 'Module abgeschlossen', icon: icons.book, value: '8', sub: 'Aus 6 Kursen' },
      { label: 'Bewerbungen gesamt', icon: icons.brief, value: '13', sub: '3 Angebote · 2 IVs' },
      { label: 'Coach-Sessions', icon: icons.users, value: '8', sub: 'Florian + Sandra' }
    ]
  };
  const stats = sets[view] || sets.week;
  // Original fallback (kept to avoid removing the rest of original config)
  const _legacy = [
  { label: 'Karriere-Score', icon: icons.target, value: '72', unit: '/100', sub: '+6 diese Woche' },
  { label: 'Lernfortschritt', icon: icons.play, value: '48', unit: '%', sub: '3 von 5 Modulen' },
  { label: 'Bewerbungen', icon: icons.brief, value: '4', sub: '2 im Interview' },
  { label: 'Lernstreak', icon: icons.flame, value: '12', unit: 'Tage', sub: 'Rekord in Sicht' }];

  return (
    <div className="stats">
      {stats.map((s, i) =>
      <div className="stat" key={i}>
          <div className="stat-label">
            <span className="sl-ic"><Ic d={s.icon} size={11} stroke={2} /></span>
            {s.label}
          </div>
          <div className="stat-value">{s.value}{s.unit && <span className="unit">{s.unit}</span>}</div>
          <div className="stat-sub"><span className="trend-up"><Ic d={icons.arrowUp} size={11} stroke={2.5} /></span> {s.sub}</div>
        </div>
      )}
    </div>);

}

function Hero() {
  const [heroPortrait, setHeroPortrait] = useState(null);
  const florianObj = { name: 'Florian Fritsch', role: 'Karriere-Coach', online: true, src: '/uploads/coach_florian.jpeg' };
  const [t, setT] = useState({ h: 2, m: 34, s: 12 });
  useEffect(() => {
    const id = setInterval(() => setT(({ h, m, s }) => {
      if (s > 0) return { h, m, s: s - 1 };
      if (m > 0) return { h, m: m - 1, s: 59 };
      if (h > 0) return { h: h - 1, m: 59, s: 59 };
      return { h: 0, m: 0, s: 0 };
    }), 1000);
    return () => clearInterval(id);
  }, []);
  const pad = (n) => String(n).padStart(2, '0');
  return (
    <div className="hero">
      <div className="hero-grain" />
      <div className="hero-body">
        <div className="hero-eyebrow"><span className="live-dot" /> Live · Heute 17:30 · Kostenlos</div>
        <h2 className="hero-title" style={{ letterSpacing: "0px" }}>
          Karriere statt Zufall.<br />
          <span className="faded">Die fünf Schritte zu deinem Traumgehalt.</span>
        </h2>
        <div className="hero-sub">
          60 Minuten Live-Webinar mit Florian Fritsch, Karriere-Coach am Karriere-Institut. Konkrete Taktik statt Motivation.
        </div>
        <div className="hero-actions">
          <button className="btn btn-primary" onClick={() => window.dispatchEvent(new CustomEvent("ki-toast", { detail: "Webinar-Platz gesichert" }))}>Platz sichern</button>
          <span className="hero-meta-chip"><Ic d={icons.users} size={12} /> 847 angemeldet</span>
          <span className="hero-meta-chip"><Ic d={icons.play} size={12} /> 60 Min.</span>
        </div>
      </div>
      <div className="hero-side">
        <div className="hero-count-label">Start in</div>
        <div className="hero-count-big">{pad(t.h)}<span className="sep">:</span>{pad(t.m)}<span className="sep">:</span>{pad(t.s)}</div>
      </div>
      <div onClick={() => setHeroPortrait(florianObj)} role="button" tabIndex={0} style={{ cursor: 'pointer', display: 'contents' }}>
        <PhotoPortrait name="Florian Fritsch" role="Karriere-Coach" hero src="/uploads/speaker_florian.png" />
      </div>
      {heroPortrait && <CoachProfileModal coach={heroPortrait} onClose={() => setHeroPortrait(null)} />}
    </div>);

}

function Silhouette() {
  return (
    <svg className="silhouette" viewBox="0 0 100 130" preserveAspectRatio="xMidYMid slice">
      <defs>
        <linearGradient id="silg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.55" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.15" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="45" r="18" fill="url(#silg)" />
      <path d="M15 130 C 15 90, 35 75, 50 75 C 65 75, 85 90, 85 130 Z" fill="url(#silg)" />
    </svg>);
}

function PhotoPortrait({ name, role, hero, tag, src }) {
  return (
    <div className={`photo hero-portrait ${src ? 'has-img' : ''}`}>
      {src ?
      <>
          <img src={src} alt="" aria-hidden="true" className="portrait-bg" />
          <img src={src} alt={name} className="portrait-img" />
          <div className="rim" />
        </> :

      <Silhouette />
      }
      {tag && <span className="tag">{tag}</span>}
      <div className="hero-portrait-cap">
        <div className="n" style={{ letterSpacing: "0px" }}>{name}</div>
        <div className="r">{role}</div>
      </div>
    </div>);
}


const COACH_PROFILES = {
  'Florian Fritsch': {
    role: 'Lead Coach · Karriere-Strategie & Verhandlung',
    src: '/uploads/coach_florian.jpeg',
    online: true,
    location: 'Berlin', languages: 'Deutsch, Englisch',
    yearsExp: 12, rating: 4.9, sessions: 480, response: '< 4 Std',
    bio: 'Florian arbeitet seit 12 Jahren mit ambitionierten Berufseinsteiger und Senior-Talenten. Vor dem Karriere-Institut leitete er ein Recruiting-Team bei einem DAX-Konzern und kennt beide Seiten des Tisches — Kandidat und Hiring Manager. Sein Schwerpunkt: Karriere-Strategie, Gehaltsverhandlung und positionierende Personal Brands.',
    specialties: ['Gehaltsverhandlung', 'Karriere-Strategie', 'Personal Branding', 'C-Level-Coaching', 'Story-Building'],
    industries: ['FinTech', 'B2B SaaS', 'Beratung', 'Tech'],
    slots: [
      { day: 'Mo', time: '11:00' },
      { day: 'Di', time: '14:00' },
      { day: 'Mi', time: '16:00' }
    ]
  },
  'Lena Hartmann': {
    role: 'Senior Coach · Karriere-Coaching & Mindset',
    online: true,
    location: 'München', languages: 'Deutsch, Englisch, Spanisch',
    yearsExp: 9, rating: 4.8, sessions: 312, response: '< 6 Std',
    bio: 'Lena coacht seit 9 Jahren auf den großen Wendepunkten — Quereinstieg, Elternzeit-Comeback, erste Führungsrolle. Ihr Ansatz: tief, ehrlich, immer mit konkretem nächstem Schritt. Vorher Psychologin in der Personalentwicklung bei einem Industriekonzern.',
    specialties: ['Quereinstieg', 'Karriere-Wechsel', 'Mindset', 'Vorstellungsgespräche', 'Führung'],
    industries: ['Industrie', 'Public Sector', 'NGOs', 'Healthcare'],
    slots: [
      { day: 'Di', time: '10:00' },
      { day: 'Do', time: '15:30' },
      { day: 'Fr', time: '09:00' }
    ]
  },
  'Tobias Keller': {
    role: 'Senior Coach · Gehalts-Strategie & Total Comp',
    online: false,
    location: 'Hamburg', languages: 'Deutsch, Englisch',
    yearsExp: 7, rating: 4.9, sessions: 210, response: '< 24 Std',
    bio: 'Tobias kommt aus dem Compensation & Benefits-Bereich (Ex-McKinsey & DAX-Konzern). Er kennt Bonus-Strukturen, Equity-Verhandlung und Long-Term-Incentives wie kaum jemand. Seine Sessions sind datengetrieben — er bringt aktuelle Marktdaten zu Levels und Ranges.',
    specialties: ['Gehaltsverhandlung', 'Equity & RSU', 'Total Compensation', 'Bonus-Strukturen', 'Sign-On'],
    industries: ['FinTech', 'Tech', 'Beratung', 'Pharma'],
    slots: [
      { day: 'Mi', time: '13:00' },
      { day: 'Fr', time: '16:00' },
      { day: 'Mo+', time: 'flex' }
    ]
  },
  'Sara Brandt': {
    role: 'Senior Coach · Interview-Training & Cases',
    online: true,
    location: 'Berlin · Remote', languages: 'Deutsch, Englisch',
    yearsExp: 6, rating: 4.9, sessions: 396, response: '< 3 Std',
    bio: 'Sara hat über 600 Interview-Mocks durchgeführt. Sie bricht harte Fragen in einfache Strukturen, übt mit dir Live-Cases und gibt direktes, ehrliches Feedback. Vor dem Coaching war sie selbst Senior PM bei einer FinTech-Scale-up.',
    specialties: ['Behavioral Interviews', 'Case Studies', 'STAR-Stories', 'Bar Raiser', 'Stress-Interviews'],
    industries: ['FinTech', 'B2C SaaS', 'Marketplace', 'Payments'],
    slots: [
      { day: 'Mo', time: '17:00' },
      { day: 'Mi', time: '11:00' },
      { day: 'Do', time: '13:30' }
    ]
  },
  'Michael Voss': {
    role: 'Senior Coach · LinkedIn & Networking',
    online: false,
    location: 'Berlin', languages: 'Deutsch, Englisch',
    yearsExp: 8, rating: 4.7, sessions: 178, response: '< 12 Std',
    bio: 'Michael baut Personal Brands für Tech-Profis. Hat selbst eine LinkedIn-Reichweite von 80k+ und coacht zu Headlines, Featured-Content und Cold Outreach. Seine Spezialität: aus stillen Profis sichtbare Talente machen — ohne Influencer-Performance.',
    specialties: ['LinkedIn-Profil', 'Personal Branding', 'Cold Outreach', 'Content-Strategie', 'Networking'],
    industries: ['Tech', 'B2B SaaS', 'Agentur', 'Solo-Karriere'],
    slots: [
      { day: 'Di', time: '12:30' },
      { day: 'Do', time: '17:00' },
      { day: 'Fr', time: '14:00' }
    ]
  }
};

function CoachProfileModal({ coach, onClose }) {
  const data = COACH_PROFILES[coach.name] || {
    role: coach.role, online: coach.online, src: coach.src,
    yearsExp: 5, rating: 4.7, sessions: 100, response: '< 24 Std',
    bio: 'Profil-Daten folgen in Kürze.',
    specialties: [], industries: [], slots: [],
    location: 'Berlin', languages: 'Deutsch, Englisch'
  };
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const initials = coach.name.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase();
  const src = data.src || coach.src;
  const [bookedSlots, setBookedSlots] = useState({});
  const [confirmSlot, setConfirmSlot] = useState(null);
  const [cpToast, setCpToast] = useState(null);
  const [messageOpen, setMessageOpen] = useState(false);
  const [slotPickerOpen, setSlotPickerOpen] = useState(false);
  const bookSlot = (slot, idx) => {
    setBookedSlots((b) => ({ ...b, [idx]: true }));
    setConfirmSlot(null);
    setCpToast(`Slot bei ${coach.name} am ${slot.day} um ${slot.time} gebucht`);
    setTimeout(() => setCpToast(null), 2800);
  };

  return (
    <div className="cp-overlay" onClick={onClose}>
      <div className="cp-card" onClick={(e) => e.stopPropagation()}>
        <div className="cp-hero">
          <div className="cp-avatar">
            {src ? <img src={src} alt={coach.name} /> : <span className="initials">{initials}</span>}
            <span className={`cp-online-dot ${data.online ? '' : 'off'}`} />
          </div>
          <div style={{ minWidth: 0 }}>
            <div className="cp-name">{coach.name}</div>
            <div className="cp-role">{data.role}</div>
            <div className="cp-tags">
              {data.online ? <span className="cp-tag online">Online</span> : <span className="cp-tag">Offline</span>}
              <span className="cp-tag">{data.yearsExp} J. Erfahrung</span>
              <span className="cp-tag">★ {data.rating}</span>
            </div>
          </div>
          <button className="cp-close" onClick={onClose} aria-label="Schließen">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </div>

        <div className="cp-body">
          <div className="cp-bio">{data.bio}</div>

          <div className="cp-stats">
            <div>
              <div className="cp-stat-num"><span className="star">★</span>{data.rating}</div>
              <div className="cp-stat-lab">Coach-Bewertung</div>
            </div>
            <div>
              <div className="cp-stat-num">{data.sessions}+</div>
              <div className="cp-stat-lab">Sessions</div>
            </div>
            <div>
              <div className="cp-stat-num">{data.yearsExp}</div>
              <div className="cp-stat-lab">Jahre Erfahrung</div>
            </div>
            <div>
              <div className="cp-stat-num" style={{ fontSize: 16 }}>{data.response}</div>
              <div className="cp-stat-lab">Antwortzeit</div>
            </div>
          </div>

          <div className="cp-section">
            <div className="cp-section-title">Über</div>
            <div className="cp-specs">
              <div className="cp-spec">
                <span className="cp-spec-ic">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0z" />
                    <circle cx="12" cy="10" r="3" />
                  </svg>
                </span>
                <span><b>Standort</b>: {data.location}</span>
              </div>
              <div className="cp-spec">
                <span className="cp-spec-ic">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="9" />
                    <path d="M3 12h18" />
                    <path d="M12 3a14 14 0 0 1 0 18" />
                    <path d="M12 3a14 14 0 0 0 0 18" />
                  </svg>
                </span>
                <span><b>Sprachen</b>: {data.languages}</span>
              </div>
            </div>
          </div>

          {data.specialties && data.specialties.length > 0 && (
            <div className="cp-section">
              <div className="cp-section-title">Schwerpunkte</div>
              <div className="cp-chips">
                {data.specialties.map((s, i) => <span key={i} className="chip accent">{s}</span>)}
              </div>
            </div>
          )}

          {data.industries && data.industries.length > 0 && (
            <div className="cp-section">
              <div className="cp-section-title">Branchen</div>
              <div className="cp-chips">
                {data.industries.map((s, i) => <span key={i} className="chip outline">{s}</span>)}
              </div>
            </div>
          )}

          {data.slots && data.slots.length > 0 && (
            <div className="cp-section">
              <div className="cp-section-title">Nächste freie Slots</div>
              <div className="cp-slots">
                {data.slots.map((s, i) => {
                  const isBooked = bookedSlots[i];
                  return (
                    <div className="cp-slot" key={i}
                         onClick={() => !isBooked && setConfirmSlot({ slot: s, idx: i })}
                         role="button" tabIndex={0}
                         onKeyDown={(e) => { if ((e.key === 'Enter' || e.key === ' ') && !isBooked) { e.preventDefault(); setConfirmSlot({ slot: s, idx: i }); } }}
                         style={{
                           background: isBooked ? 'var(--green-soft)' : undefined,
                           borderColor: isBooked ? 'var(--green)' : undefined,
                           cursor: isBooked ? 'default' : 'pointer'
                         }}>
                      <span className="cp-slot-day" style={{ color: isBooked ? 'var(--green-dark)' : undefined }}>
                        {isBooked ? '✓ ' : ''}{s.day}
                      </span>
                      <span className="cp-slot-time" style={{ color: isBooked ? 'var(--green-dark)' : undefined }}>{s.time}</span>
                    </div>);
                })}
              </div>
            </div>
          )}
        </div>

        <div className="cp-foot">
          <div className="cp-foot-meta">
            <span style={{ width: 7, height: 7, borderRadius: '50%', background: data.online ? 'var(--green)' : 'var(--label-4)', display: 'inline-block' }} />
            {data.online ? 'Antwortet in der Regel innerhalb weniger Stunden' : 'Heute offline · meldet sich morgen'}
          </div>
          <div className="cp-foot-actions">
            <button type="button" className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 12.5 }} onClick={() => setMessageOpen(true)}>Nachricht</button>
            <button type="button" className="btn btn-accent" style={{ padding: '8px 16px', fontSize: 13 }} onClick={() => setSlotPickerOpen(true)}>Slot buchen</button>
          </div>
        </div>

        {slotPickerOpen && (
          <div onClick={() => setSlotPickerOpen(false)}
               style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, borderRadius: 'var(--r-lg)' }}>
            <div onClick={(e) => e.stopPropagation()}
                 style={{ background: 'var(--surface)', borderRadius: 14, padding: '20px 22px', maxWidth: 420, width: '90%', boxShadow: '0 16px 40px rgba(0,0,0,0.18)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--label-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 4 }}>Slot buchen · {coach.name}</div>
              <div style={{ fontFamily: 'var(--sf)', fontSize: 17, fontWeight: 600, color: 'var(--label)', marginBottom: 10 }}>Wann passt es dir?</div>
              {(!data.slots || data.slots.length === 0) && (
                <div style={{ padding: '20px 0', textAlign: 'center', color: 'var(--label-3)', fontSize: 13 }}>
                  Aktuell keine freien Slots verfügbar.
                </div>
              )}
              <div style={{ display: 'flex', flexDirection: 'column', gap: 6, maxHeight: 280, overflowY: 'auto', marginBottom: 10 }}>
                {(data.slots || []).map((s, i) => {
                  const isBooked = bookedSlots[i];
                  return (
                    <div key={i} onClick={() => { if (!isBooked) { bookSlot(s, i); setSlotPickerOpen(false); } }}
                         style={{
                           display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                           padding: '10px 14px', borderRadius: 9,
                           border: `0.5px solid ${isBooked ? 'var(--green)' : 'var(--line)'}`,
                           background: isBooked ? 'var(--green-soft)' : 'var(--surface-2)',
                           cursor: isBooked ? 'default' : 'pointer',
                           transition: 'background .12s, border-color .12s'
                         }}
                         onMouseOver={(e) => { if (!isBooked) { e.currentTarget.style.borderColor = 'var(--ki-red-2)'; e.currentTarget.style.background = 'var(--accent-soft)'; } }}
                         onMouseOut={(e) => { if (!isBooked) { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.background = 'var(--surface-2)'; } }}>
                      <div>
                        <div style={{ fontFamily: 'var(--sf)', fontSize: 13.5, fontWeight: 600, color: isBooked ? 'var(--green-dark)' : 'var(--label)' }}>
                          {isBooked ? '✓ ' : ''}{s.day} · {s.time}
                        </div>
                        <div style={{ fontSize: 11.5, color: 'var(--label-3)', marginTop: 1 }}>30 Min · Video-Call</div>
                      </div>
                      {!isBooked && (
                        <span style={{ fontSize: 12.5, fontWeight: 600, color: 'var(--ki-red-2)' }}>Buchen →</span>
                      )}
                      {isBooked && (
                        <span className="chip green" style={{ fontSize: 11 }}>Gebucht</span>
                      )}
                    </div>);
                })}
              </div>
              <div style={{ fontSize: 11.5, color: 'var(--label-4)', textAlign: 'center', marginBottom: 10 }}>
                Bestätigung kommt per E-Mail · Termin landet im Kalender
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12.5 }} onClick={() => setSlotPickerOpen(false)}>Schließen</button>
              </div>
            </div>
          </div>
        )}
        {messageOpen && (
          <div onClick={() => setMessageOpen(false)}
               style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, borderRadius: 'var(--r-lg)' }}>
            <CoachMessageBox coach={coach} onClose={() => setMessageOpen(false)} onSent={() => { setMessageOpen(false); setCpToast(`Nachricht an ${coach.name} gesendet`); setTimeout(() => setCpToast(null), 2800); }} />
          </div>
        )}
        {confirmSlot && (
          <div onClick={() => setConfirmSlot(null)}
               style={{ position: 'absolute', inset: 0, background: 'rgba(0,0,0,0.4)', backdropFilter: 'blur(4px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 5, borderRadius: 'var(--r-lg)' }}>
            <div onClick={(e) => e.stopPropagation()}
                 style={{ background: 'var(--surface)', borderRadius: 14, padding: '22px 24px', maxWidth: 360, boxShadow: '0 16px 40px rgba(0,0,0,0.18)' }}>
              <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--label-3)', letterSpacing: '0.04em', textTransform: 'uppercase', marginBottom: 8 }}>Slot buchen</div>
              <div style={{ fontFamily: 'var(--sf)', fontSize: 17, fontWeight: 600, color: 'var(--label)', marginBottom: 6 }}>
                {coach.name} · {confirmSlot.slot.day} um {confirmSlot.slot.time}
              </div>
              <div style={{ fontSize: 13, color: 'var(--label-3)', lineHeight: 1.5, marginBottom: 14 }}>
                30-minütige 1:1-Session per Video-Call. Bestätigung kommt per E-Mail · Termin landet im Kalender.
              </div>
              <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
                <button type="button" className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12.5 }} onClick={() => setConfirmSlot(null)}>Abbrechen</button>
                <button type="button" className="btn btn-accent" style={{ padding: '7px 16px', fontSize: 12.5 }} onClick={() => bookSlot(confirmSlot.slot, confirmSlot.idx)}>Verbindlich buchen</button>
              </div>
            </div>
          </div>
        )}

        {cpToast && (
          <div style={{
            position: 'fixed', bottom: 24, left: '50%', transform: 'translateX(-50%)',
            background: 'var(--label)', color: '#fff', padding: '10px 18px', borderRadius: 980,
            fontSize: 13, fontWeight: 500, boxShadow: '0 8px 24px rgba(0,0,0,0.25)', zIndex: 2200,
            display: 'flex', alignItems: 'center', gap: 8
          }}>
            <span style={{ display: 'inline-grid', placeItems: 'center', width: 18, height: 18, borderRadius: '50%', background: 'var(--green)' }}>
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
            </span>
            ✓ {cpToast}
          </div>
        )}
      </div>
    </div>);
}

function CoachMessageBox({ coach, onClose, onSent }) {
  const [subject, setSubject] = useState(`Anfrage von Marie zur Karriere-Strategie`);
  const [body, setBody] = useState('Hi ' + coach.name.split(' ')[0] + ',\n\n');
  const inputStyle = { width: '100%', padding: '9px 12px', borderRadius: 9, border: '0.5px solid var(--line)', background: 'var(--surface-2)', fontFamily: 'var(--sf-text)', fontSize: 13.5, color: 'var(--label)', outline: 'none' };
  const initials = coach.name.split(' ').map((s) => s[0]).join('').slice(0, 2).toUpperCase();
  return (
    <div onClick={(e) => e.stopPropagation()}
         style={{ background: 'var(--surface)', borderRadius: 14, padding: '20px 22px', maxWidth: 440, width: '90%', boxShadow: '0 16px 40px rgba(0,0,0,0.18)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 14 }}>
        <div style={{ width: 36, height: 36, borderRadius: '50%', background: coach.avatarBg || coach.bg || 'var(--ki-red-2)', color: '#fff', display: 'grid', placeItems: 'center', fontWeight: 600, fontSize: 13 }}>
          {coach.src ? <img src={coach.src} alt={coach.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} /> : initials}
        </div>
        <div style={{ minWidth: 0, flex: 1 }}>
          <div style={{ fontSize: 11.5, fontWeight: 600, color: 'var(--label-3)', letterSpacing: '0.04em', textTransform: 'uppercase' }}>Nachricht an</div>
          <div style={{ fontFamily: 'var(--sf)', fontSize: 15, fontWeight: 600, color: 'var(--label)' }}>{coach.name}</div>
        </div>
        <button type="button" onClick={onClose} aria-label="Schließen"
                style={{ width: 26, height: 26, borderRadius: '50%', background: 'var(--fill)', border: 0, cursor: 'pointer', display: 'grid', placeItems: 'center', color: 'var(--label-3)' }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="M6 6l12 12M18 6l-12 12" /></svg>
        </button>
      </div>
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        <div>
          <label style={{ fontSize: 11.5, color: 'var(--label-3)', fontWeight: 500, display: 'block', marginBottom: 5 }}>Betreff</label>
          <input value={subject} onChange={(e) => setSubject(e.target.value)} style={inputStyle} />
        </div>
        <div>
          <label style={{ fontSize: 11.5, color: 'var(--label-3)', fontWeight: 500, display: 'block', marginBottom: 5 }}>Nachricht</label>
          <textarea value={body} onChange={(e) => setBody(e.target.value)} rows={5}
                    style={{ ...inputStyle, lineHeight: 1.5, resize: 'vertical' }} />
        </div>
      </div>
      <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end', marginTop: 14 }}>
        <button type="button" className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12.5 }} onClick={onClose}>Abbrechen</button>
        <button type="button" className="btn btn-accent" style={{ padding: '7px 16px', fontSize: 12.5 }} disabled={!body.trim() || !subject.trim()} onClick={onSent}>Nachricht senden</button>
      </div>
    </div>);
}

function CoachRow() {
  const [activeCoach, setActiveCoach] = useState(null);
  const coaches = [
  { name: 'Florian Fritsch', role: 'Karriere-Coach', online: true, src: '/uploads/coach_florian.jpeg' },
  { name: 'Lena Hartmann', role: 'Karriere-Coaching', online: true },
  { name: 'Tobias Keller', role: 'Gehalts-Strategie', online: false },
  { name: 'Sara Brandt', role: 'Interview-Training', online: true },
  { name: 'Michael Voss', role: 'LinkedIn & Netzwerk', online: false }];

  return (
    <div className="card" style={{ marginBottom: 'var(--gap)' }}>
      <div className="card-head">
        <h3 className="card-title">Dein Coaching-Team <span className="kicker">5 Coaches</span></h3>
        <a className="card-link" href="Coach.html">Alle Coaches</a>
      </div>
      <div className="coach-strip">
        {coaches.map((c, i) =>
        <div className="coach" key={i} onClick={() => setActiveCoach(c)} role="button" tabIndex={0}
             onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); setActiveCoach(c); } }}>
            <div className={`photo coach-photo ${c.src ? 'has-img' : ''}`}>
              {c.src ?
            <img src={c.src} alt={c.name} className="portrait-img" /> :
            <Silhouette />}
              {!c.src && <span className="tag">Foto folgt</span>}
              {c.online && false && <span className="coach-online" />}
            </div>
            <div>
              <div className="coach-name" style={{ fontSize: "13.5px", letterSpacing: "0px" }}>{c.name}</div>
              <div className="coach-role">{c.role}</div>
            </div>
          </div>
        )}
      </div>
      {activeCoach && <CoachProfileModal coach={activeCoach} onClose={() => setActiveCoach(null)} />}
    </div>);
}

function CVCard() {
  return (
    <div className="cv-banner">
      <div className="cv-mini">
        <Ic d={icons.doc} size={15} stroke={1.8} />
        <span className="stamp"><Ic d={icons.check} size={7} stroke={3.5} /></span>
      </div>
      <div className="cv-banner-text">
        <span className="cv-banner-eyebrow" style={{ fontWeight: "700" }}>Lebenslauf-Check</span>
        <span className="cv-banner-title" style={{ fontWeight: "400" }}>Analyse fertig — drei klare Hebel für mehr Wirkung.</span>
      </div>
      <div className="cv-banner-score">
        <div className="score-dots">
          <span className="on" /><span className="on" /><span className="on" /><span className="on" /><span />
        </div>
        <span>4/5</span>
      </div>
      <a href="Lebenslauf-Check.html" className="btn btn-tinted" style={{ textDecoration: "none" }}>Feedback ansehen</a>
    </div>);
}


const ALL_NEXT_STEPS = [
  { group: 'Heute · Quick Wins', items: [
    { icon: icons.target,  title: 'Karriere-Analyse starten',           sub: '12 Felder · ca. 10 Minuten',                 meta: 'Empfohlen', primary: true, href: 'Karriere-Analyse.html' },
    { icon: icons.doc,     title: 'Lebenslauf-Feedback öffnen',         sub: 'Drei konkrete Hebel warten auf dich.',       meta: '4 / 5',     href: 'Lebenslauf-Check.html' },
    { icon: icons.play,    title: 'Modul 2 — Marktwert',                sub: 'Weiter mit der Gehaltsverhandlungs-Masterclass.', meta: '28 %', href: 'Masterclass.html#modul-2' },
    { icon: icons.message, title: 'Coach-Notiz beantworten',            sub: 'Florian: „Wie war dein Mock-Interview?"',    meta: 'Neu',       href: 'Coach.html' }
  ]},
  { group: 'Diese Woche', items: [
    { icon: icons.brief,   title: 'Stripe-Interview Runde 2',           sub: 'Mi · 14:00 — Vorbereitung läuft',            meta: 'Mi',         href: 'Kalender.html' },
    { icon: icons.brief,   title: 'Bei Mollie bewerben',                sub: 'Senior PM Risk · Frist Freitag',             meta: 'Fr',         href: 'Bewerbungen.html' },
    { icon: icons.users,   title: 'Mock-Interview mit Lisa',            sub: 'Mi 19:00 · 60 Min · Stripe-Vorbereitung',    meta: 'Mi 19:00',   href: 'Kalender.html' },
    { icon: icons.cal,     title: 'Coach-Slot mit Sandra buchen',       sub: 'Karriere-Strategie · 60 Min',                meta: 'Offen',      href: 'Coach.html' },
    { icon: icons.book,    title: 'Modul 3 freischalten',               sub: 'Strategy & Vision · neu im Mai',             meta: 'Neu',        href: 'Masterclass.html' }
  ]},
  { group: 'Diesen Monat', items: [
    { icon: icons.target,  title: 'Karriere-Score auf 80 bringen',      sub: 'Aktuell 72 — Lücke „Verhandlungs-Taktik" schließen', meta: 'Ziel' },
    { icon: icons.brief,   title: 'Doctolib · Angebot entscheiden',     sub: 'Frist 12. Mai · Range vergleichen',          meta: '12. Mai',    href: 'Bewerbungen.html' },
    { icon: icons.users,   title: '3 neue Coffee-Chats',                sub: 'Alumni / Mentoren aus FinTech',          meta: '0 / 3',      href: 'Community.html' },
    { icon: icons.spark,   title: 'LinkedIn-Profil überarbeiten',       sub: 'Headline · Featured · 3 Skills aktualisieren', meta: 'Aufgabe' }
  ]},
  { group: 'Später', items: [
    { icon: icons.flame,   title: 'Total-Compensation-Kurs starten',    sub: '5 Module · 2h 10m — wenn Bewerbungen ruhen', meta: 'Optional',   href: 'Masterclass.html#totalcomp' },
    { icon: icons.trophy,  title: 'Badge „Erstes Angebot" abholen',     sub: 'Wird automatisch nach Vertrag freigeschaltet', meta: 'Auto' },
    { icon: icons.book,    title: 'Exit-Strategie planen',              sub: 'Falls du das Doctolib-Angebot annimmst',     meta: 'Bei Bedarf', href: 'Masterclass.html#exit' }
  ]}
];

function NextStepsModal({ onClose }) {
  const [tab, setTab] = useState('all');
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const tabs = [
    { id: 'all',     label: 'Alle' },
    { id: 'heute',   label: 'Heute' },
    { id: 'woche',   label: 'Diese Woche' },
    { id: 'monat',   label: 'Diesen Monat' },
    { id: 'later',   label: 'Später' }
  ];
  const tabMap = { heute: 0, woche: 1, monat: 2, later: 3 };
  const visibleGroups = tab === 'all' ? ALL_NEXT_STEPS : [ALL_NEXT_STEPS[tabMap[tab]]];

  const total = ALL_NEXT_STEPS.reduce((a, g) => a + g.items.length, 0);
  const visibleCount = visibleGroups.reduce((a, g) => a + g.items.length, 0);

  return (
    <div className="ac-overlay" onClick={onClose}>
      <div className="ac-card" onClick={(e) => e.stopPropagation()}>
        <div className="ac-head">
          <div className="ac-head-meta">
            <div className="ac-eyebrow">Nächste Schritte</div>
            <div className="ac-title">Was als Nächstes kommt</div>
          </div>
          <div className="ac-stat">
            <div className="ac-stat-num">{total}</div>
            <div className="ac-stat-lab">Aufgaben</div>
          </div>
          <button className="ac-close" onClick={onClose} aria-label="Schließen">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </div>

        <div className="ac-tabs">
          {tabs.map((t) => {
            const ct = t.id === 'all' ? total : (ALL_NEXT_STEPS[tabMap[t.id]]?.items.length || 0);
            return (
              <button key={t.id} className={`ac-tab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
                {t.label}<span className="ct">{ct}</span>
              </button>);
          })}
        </div>

        <div className="ac-body" style={{ paddingLeft: 16, paddingRight: 16 }}>
          {visibleGroups.map((g, gi) =>
            <div key={gi}>
              <div className="ac-day-head" style={{ paddingLeft: 6 }}>
                <span>{g.group}</span>
                <span className="count">{g.items.length} Schritt{g.items.length === 1 ? '' : 'e'}</span>
              </div>
              <div className="step-list">
                {g.items.map((s, i) => {
                  const Tag = s.href ? 'a' : 'div';
                  const extraProps = s.href ? { href: s.href, style: { textDecoration: 'none', color: 'inherit' } } : {};
                  return (
                    <Tag key={i} className={`step ${s.primary ? 'primary' : ''}`} {...extraProps}>
                      <div className="step-icon" style={{ margin: '0px' }}><Ic d={s.icon} size={16} /></div>
                      <div>
                        <div className="step-title" style={{ fontSize: '14px', margin: '0px' }}>{s.title}</div>
                        <div className="step-sub" style={{ margin: '1px 0px 0px' }}>{s.sub}</div>
                      </div>
                      <div className="step-meta">
                        <span>{s.meta}</span>
                        <span className="chev"><Ic d={icons.chevR} size={12} stroke={2.2} /></span>
                      </div>
                    </Tag>);
                })}
              </div>
            </div>
          )}
        </div>

        <div className="ac-foot">
          <span><b>{visibleCount}</b> von {total} Schritten</span>
          <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12.5 }} onClick={onClose}>Schließen</button>
        </div>
      </div>
    </div>);
}

function NextSteps({ view = 'today' }) {
  const [nextStepsOpen, setNextStepsOpen] = useState(false);
  const allSteps = [
  { icon: icons.target, title: 'Karriere-Analyse starten', sub: '12 Felder · ca. 10 Minuten', meta: 'Empfohlen', primary: true, href: 'Karriere-Analyse.html', when: 'today' },
  { icon: icons.doc, title: 'Lebenslauf-Feedback öffnen', sub: 'Drei konkrete Hebel warten auf dich.', meta: '4 / 5', href: 'Lebenslauf-Check.html', when: 'today' },
  { icon: icons.play, title: 'Modul 2 — Marktwert', sub: 'Weiter mit der Gehaltsverhandlungs-Masterclass.', meta: '28 %', href: 'Masterclass.html#modul-2', when: 'today' },
  { icon: icons.brief, title: 'Vier aktive Bewerbungen', sub: 'Zwei im Interview, eine wartet auf Antwort.', meta: '2 neu', href: 'Bewerbungen.html', when: 'week' },
  { icon: icons.users, title: 'Mock-Interview mit Lisa', sub: 'Mi 19:00 · Vorbereitung Stripe Runde 2', meta: 'Mi', href: 'Kalender.html', when: 'week' },
  { icon: icons.cal, title: 'Coach-Slot mit Sandra buchen', sub: 'Karriere-Strategie · 60 Min', meta: 'Offen', href: 'Coach.html', when: 'week' },
  { icon: icons.spark, title: 'LinkedIn-Profil überarbeiten', sub: 'Headline · Featured · 3 Skills aktualisieren', meta: 'Aufgabe', when: 'all' },
  { icon: icons.flame, title: 'Total-Compensation-Kurs starten', sub: '5 Module · 2h 10m', meta: 'Optional', href: 'Masterclass.html#totalcomp', when: 'all' }
  ];
  const filterMap = { today: ['today'], week: ['today', 'week'], all: ['today', 'week', 'all'] };
  const steps = allSteps.filter((s) => (filterMap[view] || ['today']).includes(s.when));

  return (
    <div className="card">
      <div className="card-head">
        <h3 className="card-title"><span className="date-pill">{(()=>{const d=new Date();const wd=['So','Mo','Di','Mi','Do','Fr','Sa'][d.getDay()];return `${wd}, ${d.getDate()}.${d.getMonth()+1}.`;})()}</span> Nächste Schritte</h3>
        <a className="card-link linkbtn" onClick={() => setNextStepsOpen(true)}>Alle ansehen</a>
      </div>
      <div className="step-list">
        {steps.map((s, i) => {
          const Tag = s.href ? 'a' : 'div';
          const extraProps = s.href ? { href: s.href, style: { textDecoration: 'none', color: 'inherit' } } : {};
          return (
            <Tag key={i} className={`step ${s.primary ? 'primary' : ''}`} {...extraProps}>
              <div className="step-icon" style={{ margin: "0px" }}><Ic d={s.icon} size={16} /></div>
              <div>
                <div className="step-title" style={{ fontSize: "14px", margin: "0px" }}>{s.title}</div>
                <div className="step-sub" style={{ margin: "1px 0px 0px" }}>{s.sub}</div>
              </div>
              <div className="step-meta">
                <span>{s.meta}</span>
                <span className="chev"><Ic d={icons.chevR} size={12} stroke={2.2} /></span>
              </div>
            </Tag>
          );
        })}
      </div>
      {nextStepsOpen && <NextStepsModal onClose={() => setNextStepsOpen(false)} />}
    </div>);

}

function Ring({ value = 72, size = 104, thick = 9 }) {
  const r = (size - thick) / 2;
  const c = 2 * Math.PI * r;
  const off = c - value / 100 * c;
  return (
    <svg width={size} height={size} style={{ transform: 'rotate(-90deg)' }}>
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--line-2)" strokeWidth={thick} />
      <circle cx={size / 2} cy={size / 2} r={r} fill="none" stroke="var(--ki-red-2)" strokeWidth={thick}
      strokeDasharray={c} strokeDashoffset={off} strokeLinecap="round" />
    </svg>);

}


const ALL_FIELDS = [
  { group: 'Kommunikation & Beziehungen', items: [
    { name: 'Kommunikation',          score: 84, kind: 'strength', trend: '+4', note: 'Klar und zugänglich, auch in heiklen Themen.' },
    { name: 'Aktives Zuhören',        score: 79, kind: 'strength', trend: '+2' },
    { name: 'Empathie',               score: 76, kind: 'strength', trend: '0' },
    { name: 'Netzwerk-Aufbau',        score: 56, kind: 'work',     trend: '+8', note: 'Starke Bewegung — bleib dran.' },
    { name: 'Konflikt-Klärung',       score: 51, kind: 'work',     trend: '+3' }
  ]},
  { group: 'Strategie & Selbstführung', items: [
    { name: 'Selbstreflexion',        score: 78, kind: 'strength', trend: '+1' },
    { name: 'Zielklarheit',           score: 71, kind: 'strength', trend: '+5' },
    { name: 'Priorisierung',          score: 64, kind: 'work',     trend: '0' },
    { name: 'Long-term Vision',       score: 59, kind: 'work',     trend: '+2' },
    { name: 'Marktwert-Wissen',       score: 42, kind: 'gap',      trend: '+6', note: 'Modul 2 deckt das gezielt ab.' }
  ]},
  { group: 'Verhandlung & Bewerbung', items: [
    { name: 'Verhandlungs-Taktik',    score: 38, kind: 'gap',      trend: '+9', note: 'Größter Sprung diese Woche.' },
    { name: 'Story & Pitch',          score: 62, kind: 'work',     trend: '+4' },
    { name: 'Personal Branding',      score: 48, kind: 'work',     trend: '+2' },
    { name: 'Bewerbungs-Strategie',   score: 67, kind: 'strength', trend: '+3' }
  ]},
  { group: 'Umsetzung & Resilienz', items: [
    { name: 'Umsetzungsstärke',       score: 73, kind: 'strength', trend: '+2' },
    { name: 'Stress-Resistenz',       score: 69, kind: 'strength', trend: '0' },
    { name: 'Feedback-Aufnahme',      score: 81, kind: 'strength', trend: '+1' },
    { name: 'Time Management',        score: 58, kind: 'work',     trend: '-1', note: 'Leichter Rückgang — Kalender prüfen.' }
  ]}
];

function AllFieldsModal({ onClose }) {
  const [tab, setTab] = useState('all');
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  // flatten + filter
  const flat = ALL_FIELDS.flatMap((g) => g.items);
  const groupsByKind = {
    all: ALL_FIELDS,
    strength: [{ group: 'Stärken', items: flat.filter((i) => i.kind === 'strength') }],
    work:     [{ group: 'In Arbeit', items: flat.filter((i) => i.kind === 'work') }],
    gap:      [{ group: 'Lücken', items: flat.filter((i) => i.kind === 'gap') }]
  };
  const visible = groupsByKind[tab];
  const total = flat.length;
  const avg = Math.round(flat.reduce((s, i) => s + i.score, 0) / flat.length);
  const kindLabel = { strength: 'Stärke', gap: 'Lücke', work: 'in Arbeit' };

  const tabs = [
    { id: 'all',      label: 'Alle',       count: flat.length },
    { id: 'strength', label: 'Stärken',    count: flat.filter((i) => i.kind === 'strength').length },
    { id: 'work',     label: 'In Arbeit',  count: flat.filter((i) => i.kind === 'work').length },
    { id: 'gap',      label: 'Lücken',     count: flat.filter((i) => i.kind === 'gap').length }
  ];

  return (
    <div className="af-overlay" onClick={onClose}>
      <div className="af-card" onClick={(e) => e.stopPropagation()}>
        <div className="af-head">
          <div className="af-head-meta">
            <div className="af-eyebrow">Karriere-Score · Alle Felder</div>
            <div className="af-title">Dein vollständiges Stärken-Profil</div>
          </div>
          <div className="af-score">
            <span className="af-score-num">{avg}</span>
            <span className="af-score-of">/ 100</span>
          </div>
          <button className="af-close" onClick={onClose} aria-label="Schließen">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </div>

        <div className="af-tabs">
          {tabs.map((t) =>
            <button key={t.id} className={`af-tab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
              {t.label}<span className="ct">{t.count}</span>
            </button>
          )}
        </div>

        <div className="af-body">
          {visible.map((g, gi) =>
            <div className="af-section" key={gi}>
              <div className="af-section-title">
                {g.group}
                <span className="count">{g.items.length} Felder</span>
              </div>
              {g.items.map((s, i) =>
                <div className="af-row" key={i}>
                  <div className="af-row-head">
                    <span className="af-row-name">
                      {s.name}
                      <span className={`af-row-kind ${s.kind}`}>{kindLabel[s.kind]}</span>
                    </span>
                    <span className="af-row-val">
                      {s.score}
                      {s.trend && (
                        <span className={`af-row-trend ${s.trend.startsWith('+') && s.trend !== '+0' ? 'up' : s.trend.startsWith('-') ? 'down' : ''}`}>
                          {s.trend}
                        </span>
                      )}
                    </span>
                  </div>
                  <div className="af-row-bar"><div className={`af-row-fill ${s.kind}`} style={{ width: `${s.score}%` }} /></div>
                  {s.note && <div className="af-row-note">{s.note}</div>}
                </div>
              )}
            </div>
          )}
        </div>

        <div className="af-foot">
          <div className="af-foot-meta">
            <b>{total} Felder</b> aus 4 Kategorien · zuletzt aktualisiert heute
          </div>
          <a className="btn btn-accent" href="Karriere-Analyse.html" style={{ padding: '8px 16px', fontSize: 13, textDecoration: 'none' }}>
            Karriere-Analyse öffnen →
          </a>
        </div>
      </div>
    </div>);
}

function SkillProfileWithModal({ children }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <div onClick={(e) => {
        if (e.target.dataset && e.target.dataset.allFields === '1') {
          e.preventDefault();
          setOpen(true);
        }
      }}>
        {children}
      </div>
      {open && <AllFieldsModal onClose={() => setOpen(false)} />}
    </>);
}

function SkillProfile() {
  const [allFieldsOpen, setAllFieldsOpen] = useState(false);
  const skills = [
  { name: 'Kommunikation', score: 84, kind: 'strength' },
  { name: 'Selbstreflexion', score: 78, kind: 'strength' },
  { name: 'Netzwerk-Aufbau', score: 56, kind: 'work' },
  { name: 'Marktwert-Wissen', score: 42, kind: 'gap' },
  { name: 'Verhandlungs-Taktik', score: 38, kind: 'gap' }];

  const label = { strength: 'Stärke', gap: 'Lücke', work: 'in Arbeit' };
  return (
    <div className="card">
      <div className="card-head">
        <h3 className="card-title" style={{ letterSpacing: "0px" }}>Nächste Schritte
Heute</h3>
        <a className="card-link linkbtn" onClick={() => setAllFieldsOpen(true)}>Alle Felder</a>
      </div>
      <div className="score-hero">
        <div className="score-ring-wrap">
          <Ring value={72} />
          <div className="v" style={{ fontSize: "22px", fontWeight: "600", width: "101px", height: "47px", padding: "24.8828px" }}>72<span className="of">/100</span></div>
        </div>
        <div>
          <div className="score-right-title" style={{ letterSpacing: "0px" }}>Dein Karriere-Score</div>
          <div className="score-trend"><Ic d={icons.arrowUp} size={12} stroke={2.5} /> +6 diese Woche</div>
          <div className="score-note">Zwei klare Lücken — genau die füllt Modul 2.</div>
        </div>
      </div>
      <div className="skill-list">
        {skills.map((s, i) =>
        <div className="skill-row" key={i}>
            <div className="skill-head">
              <div>
                <span className="skill-name">{s.name}</span>
                <span className={`skill-kind ${s.kind}`}>{label[s.kind]}</span>
              </div>
              <span className="skill-val">{s.score}</span>
            </div>
            <div className="bar"><div className={`bar-fill ${s.kind}`} style={{ width: `${s.score}%` }} /></div>
          </div>
        )}
      </div>
      {allFieldsOpen && <AllFieldsModal onClose={() => setAllFieldsOpen(false)} />}
    </div>);

}

function Courses() {
  const courses = [
  { title: 'Gehaltsverhandlung', meta: '5 Module · 3h 20m', pct: 28, letter: 'G', tint: 'linear-gradient(135deg, #D63048, #82031C)', img: '/uploads/course_gehalt.png', slug: 'gehalt' },
  { title: 'Interview Mastery', meta: '5 Module · 2h 45m', pct: 60, letter: 'I', tint: 'linear-gradient(135deg, #FF9F0A, #C76B00)', slug: 'interview' },
  { title: 'Total Compensation', meta: '5 Module · 2h 10m', pct: 0, letter: 'T', tint: 'linear-gradient(135deg, #0071E3, #003D82)', slug: 'totalcomp' },
  { title: 'LinkedIn Blueprint', meta: '4 Lektionen · 55m', pct: 100, letter: 'L', tint: 'linear-gradient(135deg, #30D158, #248A3D)', slug: 'linkedin' },
  { title: 'Karriere-Fundament', meta: '6 Module · 4h 00m', pct: 15, letter: 'K', tint: 'linear-gradient(135deg, #A90C21, #3c0411)', slug: 'fundament' },
  { title: 'Exit-Strategie', meta: '3 Module · 1h 30m', pct: 0, letter: 'E', tint: 'linear-gradient(135deg, #6E6E73, #2b2b2e)', slug: 'exit' }];

  return (
    <div className="card" style={{ marginBottom: 'var(--gap)' }}>
      <div className="card-head">
        <h3 className="card-title">Masterclass <span className="kicker">6 Kurse</span></h3>
        <a className="card-link" href="Masterclass.html" style={{ textDecoration: 'none' }}>Alle Kurse</a>
      </div>
      <div className="course-grid">
        {courses.map((c, i) =>
        <a className="course" key={i} href={`Masterclass.html#${c.slug}`} style={{ textDecoration: 'none', color: 'inherit' }}>
            <div className={`photo course-cover ${c.img ? 'has-img' : ''}`} style={{ background: c.tint }}>
              {c.img ? (
                <img src={c.img} alt={c.title} style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', objectFit: 'cover' }} />
              ) : (
                <>
                  <Silhouette />
                  <span className="letter">{c.letter}</span>
                </>
              )}
              <span className="badge">{c.pct === 100 ? 'Fertig' : c.pct === 0 ? 'Neu' : 'Laufend'}</span>
            </div>
            <div className="course-top" style={{ padding: '0 2px' }}>
              <div style={{ minWidth: 0, flex: 1 }}>
                <div className="course-title">{c.title}</div>
                <div className="course-meta">{c.meta}</div>
              </div>
            </div>
            <div className="course-bottom">
              <div className="course-bar">
                <div className="course-bar-fill" style={{ width: `${c.pct}%`, background: c.pct === 100 ? 'var(--green)' : 'var(--ki-red-2)' }} />
              </div>
              <span style={{ color: c.pct === 100 ? 'var(--green-dark)' : 'var(--label-3)' }}>
                {c.pct === 100 ? 'Fertig' : `${c.pct} %`}
              </span>
            </div>
          </a>
        )}
      </div>
    </div>);

}


const ALL_ACTIVITY = [
  { day: 'Heute',    items: [
    { ic: icons.check,   cat: 'lernen',   t: 'Modul „Mindset" abgeschlossen',           sub: 'Gehaltsverhandlung · +40 Punkte',                 time: '10:24' },
    { ic: icons.message, cat: 'coaching', t: 'Coach-Feedback erhalten: Elevator Pitch', sub: 'Florian: „Starker Einstieg — kürzer wäre stärker."', time: '09:12' },
    { ic: icons.spark,   cat: 'lernen',   t: 'Live-Quiz Modul 2 bestanden',             sub: '11 von 12 Fragen · 92 % · +25 Punkte',            time: '08:48' }
  ]},
  { day: 'Gestern',  items: [
    { ic: icons.brief,   cat: 'bewerbung', t: 'Bewerbung bei Siemens eingereicht',      sub: 'Senior PM, HR-Tech · München',                    time: '17:42' },
    { ic: icons.users,   cat: 'community', t: 'Auf Beitrag im Channel #gehalt geantwortet', sub: '12 Likes · markierte Lösung',                  time: '15:08' },
    { ic: icons.cal,     cat: 'coaching',  t: 'Coach-Slot mit Sandra gebucht',           sub: 'Mock-Interview · 14. Mai · 11:00',               time: '11:33' },
    { ic: icons.play,    cat: 'lernen',    t: '8 Min Lektion abgeschlossen',             sub: 'Modul 2 · Lektion 3 · Gehaltsverhandlung',       time: '08:51' }
  ]},
  { day: 'Mo, 5. Mai', items: [
    { ic: icons.trophy,  cat: 'award',    t: 'Badge „Netzwerker" freigeschaltet',       sub: '+50 Karriere-Punkte',                             time: '20:15' },
    { ic: icons.brief,   cat: 'bewerbung', t: 'Stripe — Antwort vom Recruiter',         sub: 'Phone-Screen wurde bestätigt',                    time: '18:02' },
    { ic: icons.flame,   cat: 'lernen',   t: 'Lernstreak: 12 Tage in Folge',            sub: 'Bestleistung der letzten 30 Tage',                time: '08:00' }
  ]},
  { day: 'So, 4. Mai', items: [
    { ic: icons.message, cat: 'coaching', t: 'Coach-Notes geschrieben',                 sub: 'Vorbereitung Stripe Runde 2',                     time: '16:21' },
    { ic: icons.doc,     cat: 'bewerbung', t: 'CV v3 hochgeladen',                      sub: 'Score: 4/5 · 3 Verbesserungsvorschläge',          time: '14:08' }
  ]},
  { day: 'Sa, 3. Mai', items: [
    { ic: icons.users,   cat: 'community', t: 'Mock-Interview-Partner gefunden',        sub: 'Lisa Vogel — Termin Mi 19:00',                    time: '11:45' },
    { ic: icons.target,  cat: 'analyse',  t: 'Karriere-Score aktualisiert',             sub: '72/100 · +6 Punkte diese Woche',                  time: '09:30' }
  ]},
  { day: 'Fr, 2. Mai', items: [
    { ic: icons.brief,   cat: 'bewerbung', t: 'Doctolib — Angebot erhalten',            sub: 'Lead PM Patient · 130k + 15 % · Frist 12. Mai',  time: '16:54' },
    { ic: icons.trophy,  cat: 'award',    t: 'Badge „Erstes Angebot" freigeschaltet',   sub: '+100 Karriere-Punkte',                            time: '16:55' }
  ]},
  { day: 'Do, 1. Mai', items: [
    { ic: icons.play,    cat: 'lernen',   t: 'Live-Webinar besucht',                    sub: '„Gehalt verhandeln in 5 Schritten"',              time: '19:34' }
  ]}
];

function ActivityModal({ onClose }) {
  const [tab, setTab] = useState('all');
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);

  const tabs = [
    { id: 'all',       label: 'Alle' },
    { id: 'lernen',    label: 'Lernen' },
    { id: 'bewerbung', label: 'Bewerbungen' },
    { id: 'coaching',  label: 'Coaching' },
    { id: 'community', label: 'Community' },
    { id: 'award',     label: 'Auszeichnungen' }
  ];

  // Flatten + filter + regroup
  const allItems = ALL_ACTIVITY.flatMap((d) => d.items.map((it) => ({ ...it, day: d.day })));
  const filtered = tab === 'all' ? allItems : allItems.filter((i) => i.cat === tab);

  // Group by day preserving order
  const groups = [];
  filtered.forEach((it) => {
    const last = groups[groups.length - 1];
    if (last && last.day === it.day) last.items.push(it);
    else groups.push({ day: it.day, items: [it] });
  });

  const totalCount = allItems.length;
  const filteredCount = filtered.length;
  const counts = {};
  allItems.forEach((i) => counts[i.cat] = (counts[i.cat] || 0) + 1);

  return (
    <div className="ac-overlay" onClick={onClose}>
      <div className="ac-card" onClick={(e) => e.stopPropagation()}>
        <div className="ac-head">
          <div className="ac-head-meta">
            <div className="ac-eyebrow">Aktivitäts-Verlauf</div>
            <div className="ac-title">Was du in den letzten 7 Tagen geschafft hast</div>
          </div>
          <div className="ac-stat">
            <div className="ac-stat-num">{totalCount}</div>
            <div className="ac-stat-lab">Aktivitäten</div>
          </div>
          <button className="ac-close" onClick={onClose} aria-label="Schließen">
            <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
              <path d="M6 6l12 12M18 6l-12 12" />
            </svg>
          </button>
        </div>

        <div className="ac-tabs">
          {tabs.map((t) => {
            const ct = t.id === 'all' ? totalCount : (counts[t.id] || 0);
            return (
              <button key={t.id} className={`ac-tab ${tab === t.id ? 'on' : ''}`} onClick={() => setTab(t.id)}>
                {t.label}<span className="ct">{ct}</span>
              </button>);
          })}
        </div>

        <div className="ac-body">
          {groups.length === 0 && (
            <div className="ac-empty">
              <div className="ac-empty-ic">
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.7" strokeLinecap="round" strokeLinejoin="round">
                  <circle cx="12" cy="12" r="9" /><path d="M12 7v5l3 2" />
                </svg>
              </div>
              <div style={{ fontSize: 13.5, color: 'var(--label)', fontWeight: 600 }}>Keine Aktivitäten in dieser Kategorie</div>
              <div style={{ fontSize: 12.5, marginTop: 4 }}>Wechsle den Tab oder schau später wieder vorbei.</div>
            </div>
          )}
          {groups.map((g, gi) =>
            <div key={gi}>
              <div className="ac-day-head">
                <span>{g.day}</span>
                <span className="count">{g.items.length} Eintrag{g.items.length === 1 ? '' : 'e'}</span>
              </div>
              {g.items.map((a, i) =>
                <div className="act-row" key={i}>
                  <div className="act-ic"><Ic d={a.ic} size={15} /></div>
                  <div>
                    <div className="act-title">{a.t}</div>
                    <div className="act-sub">{a.sub}</div>
                  </div>
                  <div className="act-time">{a.time}</div>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="ac-foot">
          <span><b>{filteredCount}</b> von {totalCount} Aktivitäten · letzte 7 Tage</span>
          <button className="btn btn-ghost" style={{ padding: '7px 14px', fontSize: 12.5 }} onClick={onClose}>Schließen</button>
        </div>
      </div>
    </div>);
}

function Activity({ view = 'today' }) {
  const [activityOpen, setActivityOpen] = useState(false);
  const allRows = [
  { ic: icons.check, t: 'Modul „Mindset" abgeschlossen', sub: 'Gehaltsverhandlung · +40 Punkte', time: '10:24', when: 'today' },
  { ic: icons.message, t: 'Coach-Feedback: Elevator Pitch', sub: '„Starker Einstieg — kürzer wäre stärker."', time: '09:12', when: 'today' },
  { ic: icons.brief, t: 'Bewerbung bei Siemens eingereicht', sub: 'Status: eingereicht', time: 'Gestern', when: 'week' },
  { ic: icons.trophy, t: 'Badge „Netzwerker" freigeschaltet', sub: '+50 Karriere-Punkte', time: 'Mo', when: 'week' },
  { ic: icons.users, t: 'Mock-Partner Lisa gefunden', sub: 'Stripe-Vorbereitung Mi 19:00', time: 'So', when: 'week' },
  { ic: icons.target, t: 'Karriere-Analyse Modul 3 fertig', sub: 'Werte · +18 Score-Punkte', time: 'Letzte Woche', when: 'all' },
  { ic: icons.flame, t: 'Lernstreak: 12 Tage', sub: 'Bestleistung der letzten 30 Tage', time: 'Vor 2 Wochen', when: 'all' }];
  const filterMap = { today: ['today'], week: ['today', 'week'], all: ['today', 'week', 'all'] };
  const rows = allRows.filter((r) => (filterMap[view] || ['today']).includes(r.when));

  return (
    <div className="card">
      <div className="card-head">
        <h3 className="card-title">Aktivität</h3>
        <a className="card-link linkbtn" onClick={() => setActivityOpen(true)}>Alle</a>
      </div>
      <div>
        {rows.map((a, i) =>
        <div className="act-row" key={i}>
            <div className="act-ic"><Ic d={a.ic} size={15} /></div>
            <div>
              <div className="act-title">{a.t}</div>
              <div className="act-sub">{a.sub}</div>
            </div>
            <div className="act-time">{a.time}</div>
          </div>
        )}
      </div>
      {activityOpen && <ActivityModal onClose={() => setActivityOpen(false)} />}
    </div>);

}

function Upcoming({ view = 'today' }) {
  const allEvts = [
  { day: '08', mon: 'Mai', time: '17:30', title: 'Live-Webinar: Karriere statt Zufall', tag: 'Webinar', free: true, when: 'today' },
  { day: '09', mon: 'Mai', time: '10:30', title: 'Mock-Interview · Mollie Case', tag: 'IV', free: false, when: 'week' },
  { day: '12', mon: 'Mai', time: '18:00', title: 'Coaching-Gruppe: Gehalt verhandeln', tag: 'Seminar', free: false, when: 'week' },
  { day: '14', mon: 'Mai', time: '11:00', title: 'Doctolib · Final Round', tag: 'IV', free: false, when: 'week' },
  { day: '20', mon: 'Mai', time: '19:00', title: 'Berlin Meetup · Drinks & Talks', tag: 'Meetup', free: true, when: 'all' },
  { day: '02', mon: 'Jun', time: '16:00', title: 'Office Hours mit Coach Lena', tag: 'Q & A', free: true, when: 'all' },
  { day: '15', mon: 'Jun', time: '14:00', title: 'Workshop: Total Compensation', tag: 'Workshop', free: false, when: 'all' }];
  const filterMap = { today: ['today'], week: ['today', 'week'], all: ['today', 'week', 'all'] };
  const evts = allEvts.filter((e) => (filterMap[view] || ['today']).includes(e.when));
  const [regEvent, setRegEvent] = useState(null);

  return (
    <div className="card">
      <div className="card-head">
        <h3 className="card-title">Kommende Termine</h3>
        <a className="card-link" href="Kalender.html">Kalender</a>
      </div>
      <div>
        {evts.map((e, i) =>
        <div key={i} className="evt" onClick={() => setRegEvent(e)} role="button" tabIndex={0}
             onKeyDown={(ke) => { if (ke.key === 'Enter' || ke.key === ' ') { ke.preventDefault(); setRegEvent(e); } }}
             style={{ cursor: 'pointer' }}>
            <div className="evt-date">
              <div className="evt-mon">{e.mon}</div>
              <div className="evt-day">{e.day}</div>
            </div>
            <div>
              <div className="evt-title">{e.title}</div>
              <div className="evt-meta">
                <span style={{ fontVariantNumeric: 'tabular-nums' }}>{e.time}</span>
                <span style={{ color: 'var(--label-4)' }}>·</span>
                <span className={`evt-pill ${e.free ? 'free' : 'prem'}`}>{e.free ? 'Kostenlos' : 'Premium'}</span>
                <span style={{ color: 'var(--label-4)' }}>·</span>
                <span>{e.tag}</span>
              </div>
            </div>
            <button className="btn btn-tinted" style={{ padding: '7px 14px', fontSize: 13 }}
                    onClick={(ev) => { ev.stopPropagation(); setRegEvent(e); }}>Anmelden</button>
          </div>
        )}
      </div>
      {regEvent && <RegistrationModal event={regEvent} onClose={() => setRegEvent(null)} />}
    </div>);

}

function RegistrationModal({ event, onClose }) {
  const [form, setForm] = useState({ name: 'Marie Krüger', email: 'marie.krueger@gmail.com', phone: '', notes: '', newsletter: true });
  const [done, setDone] = useState(false);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  useEffect(() => {
    function onKey(e) { if (e.key === 'Escape') onClose(); }
    window.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => {
      window.removeEventListener('keydown', onKey);
      document.body.style.overflow = '';
    };
  }, [onClose]);
  const submit = (e) => {
    e.preventDefault();
    if (!form.name.trim() || !form.email.trim()) return;
    setDone(true);
  };
  return (
    <div className="reg-overlay" onClick={onClose}>
      <div className="reg-card" onClick={(e) => e.stopPropagation()}>
        {!done ? (
          <>
            <div className="reg-hero">
              <span className={`reg-hero-eyebrow ${event.free ? 'free' : ''}`}>
                {event.free ? '✓ Kostenlos' : '★ Premium'} · {event.tag}
              </span>
              <h2 className="reg-hero-title">{event.title}</h2>
              <div className="reg-hero-meta">
                <span>{event.day}. {event.mon}</span>
                <span className="sep">·</span>
                <span>{event.time} Uhr</span>
                <span className="sep">·</span>
                <span>Online · Zoom</span>
              </div>
              <button className="reg-close" onClick={onClose} aria-label="Schließen">
                <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M6 6l12 12M18 6l-12 12" />
                </svg>
              </button>
            </div>
            <form onSubmit={submit}>
              <div className="reg-body">
                <div className="reg-row">
                  <div className="reg-field">
                    <label className="reg-label">Vor- & Nachname<span className="req">*</span></label>
                    <input className="reg-input" type="text" value={form.name} onChange={set('name')} placeholder="z. B. Marie Krüger" required />
                  </div>
                  <div className="reg-field">
                    <label className="reg-label">E-Mail<span className="req">*</span></label>
                    <input className="reg-input" type="email" value={form.email} onChange={set('email')} placeholder="du@beispiel.de" required />
                  </div>
                </div>
                <div className="reg-field">
                  <label className="reg-label">Telefon (optional)</label>
                  <input className="reg-input" type="tel" value={form.phone} onChange={set('phone')} placeholder="+49 …" />
                </div>
                <div className="reg-field">
                  <label className="reg-label">Welche Frage möchtest du klären? (optional)</label>
                  <textarea className="reg-textarea" value={form.notes} onChange={set('notes')} placeholder="Damit der Coach gezielt darauf eingehen kann …" />
                </div>
                <label className="reg-check">
                  <input type="checkbox" checked={form.newsletter} onChange={(e) => setForm((f) => ({ ...f, newsletter: e.target.checked }))} />
                  <span>Erinnere mich 30 Min vor dem Event und schick mir die Slides danach.</span>
                </label>
              </div>
              <div className="reg-foot">
                <div className="reg-privacy">
                  Mit der Anmeldung stimmst du unserer Datenschutz­erklärung zu. Du kannst jederzeit absagen.
                </div>
                <div className="reg-actions">
                  <button type="button" className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 13 }} onClick={onClose}>Abbrechen</button>
                  <button type="submit" className="btn btn-accent" style={{ padding: '8px 18px', fontSize: 13 }}>Verbindlich anmelden</button>
                </div>
              </div>
            </form>
          </>
        ) : (
          <div className="reg-success">
            <div className="reg-success-ic">
              <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                <path d="M20 6L9 17l-5-5" />
              </svg>
            </div>
            <div className="reg-success-title">Du bist angemeldet!</div>
            <div className="reg-success-text">
              Wir haben dir eine Bestätigung an <b>{form.email}</b> geschickt. Den Termin findest du auch in deinem Kalender unter „Kommende Events".
            </div>
            <div style={{ display: 'flex', gap: 8, marginTop: 6 }}>
              <a className="btn btn-ghost" style={{ padding: '8px 14px', fontSize: 13 }} href="Kalender.html">Zum Kalender</a>
              <button className="btn btn-accent" style={{ padding: '8px 16px', fontSize: 13 }} onClick={onClose}>Schließen</button>
            </div>
          </div>
        )}
      </div>
    </div>);
}

function Tweaks({ open, onClose, values, setValues }) {
  if (!open) return null;
  const set = (k, v) => {
    const next = { ...values, [k]: v };
    setValues(next);
    window.parent.postMessage({ type: '__edit_mode_set_keys', edits: { [k]: v } }, '*');
  };
  return (
    <div className="tweaks open">
      <div className="tweaks-head">
        <div className="tweaks-title">Tweaks</div>
        <button onClick={onClose} style={{ color: 'var(--label-4)', fontSize: 14 }}>✕</button>
      </div>
      <div className="tweak-row">
        <div className="tweak-label">Dichte</div>
        <div className="tweak-opts">
          {['compact', 'cozy', 'roomy'].map((v) =>
          <button key={v} className={values.density === v ? 'on' : ''} onClick={() => set('density', v)}>
              {v === 'compact' ? 'Kompakt' : v === 'cozy' ? 'Wohnlich' : 'Luftig'}
            </button>
          )}
        </div>
      </div>
      <div className="tweak-row">
        <div className="tweak-label">Karten-Stil</div>
        <div className="tweak-opts">
          {['default', 'grouped', 'elevated'].map((v) =>
          <button key={v} className={values.cardstyle === v ? 'on' : ''} onClick={() => set('cardstyle', v)}>
              {v === 'default' ? 'Standard' : v === 'grouped' ? 'Hairline' : 'Elevated'}
            </button>
          )}
        </div>
      </div>
    </div>);

}


const SEARCH_INDEX = [
  { cat: 'Seite', label: 'Dashboard',         sub: 'Übersicht & nächste Schritte', href: 'Dashboard v6.html' },
  { cat: 'Seite', label: 'Karriere-Analyse',  sub: 'Persönlichkeit, Werte, Stärken', href: 'Karriere-Analyse.html' },
  { cat: 'Seite', label: 'Lebenslauf-Check',  sub: 'CV-Score, Feedback & Plan',     href: 'Lebenslauf-Check.html' },
  { cat: 'Seite', label: 'Bewerbungen',       sub: 'Pipeline, Versionen & Archiv',  href: 'Bewerbungen.html' },
  { cat: 'Seite', label: 'Masterclass',       sub: 'Kurse, Lektionen, Live',         href: 'Masterclass.html' },
  { cat: 'Seite', label: 'Coach',             sub: 'Coaches, Slots, Notes',          href: 'Coach.html' },
  { cat: 'Seite', label: 'Kalender',          sub: 'Termine, Events, Slots',         href: 'Kalender.html' },
  { cat: 'Seite', label: 'Community',         sub: 'Trends, Threads, Mitglieder',   href: 'Community.html' },
  { cat: 'Seite', label: 'Profil',            sub: 'Marie Krüger · Einstellungen',  href: 'Profil.html' },
  { cat: 'Coach', label: 'Florian Fritsch',   sub: 'Karriere-Strategie & Verhandlung', href: 'Coach.html' },
  { cat: 'Coach', label: 'Lena Hartmann',     sub: 'Karriere-Coaching & Mindset',   href: 'Coach.html' },
  { cat: 'Coach', label: 'Tobias Keller',     sub: 'Gehalts-Strategie & Total Comp', href: 'Coach.html' },
  { cat: 'Coach', label: 'Sara Brandt',       sub: 'Interview-Training',             href: 'Coach.html' },
  { cat: 'Coach', label: 'Michael Voss',      sub: 'LinkedIn & Personal Branding',   href: 'Coach.html' },
  { cat: 'Coach', label: 'Johanna Reuter',    sub: 'Führung & Team',                 href: 'Coach.html' },
  { cat: 'Lektion', label: 'Die ersten 90 Sekunden im Gespräch', sub: 'Modul 2 · Gehaltsverhandlung', href: 'Masterclass.html#modul-2' },
  { cat: 'Lektion', label: 'STAR-Stories meistern',              sub: 'Modul 1 · Interview Mastery',  href: 'Masterclass.html#interview' },
  { cat: 'Lektion', label: 'Was Total Compensation wirklich heißt', sub: 'Modul 1 · Total Compensation', href: 'Masterclass.html#totalcomp' },
  { cat: 'Lektion', label: 'Profil-Headline mit Hook schreiben', sub: 'Modul 1 · LinkedIn Blueprint', href: 'Masterclass.html#linkedin' },
  { cat: 'Lektion', label: 'Deine 5 Karriere-Werte finden',      sub: 'Modul 1 · Karriere-Fundament', href: 'Masterclass.html#fundament' },
  { cat: 'Lektion', label: 'Verhandeln ohne Konflikt zu schaffen', sub: 'Modul 1 · Verhandeln im Beruf', href: 'Masterclass.html#verhandeln' },
  { cat: 'Lektion', label: 'Cold Outreach: Die ersten 3 Sätze',  sub: 'Modul 1 · Cold Outreach',     href: 'Masterclass.html#outreach' },
  { cat: 'Lektion', label: 'Wann ist der richtige Moment zu gehen?', sub: 'Modul 1 · Exit-Strategie', href: 'Masterclass.html#exit' }
];

function SearchPalette({ onClose }) {
  const [q, setQ] = useState('');
  const [active, setActive] = useState(0);
  const ql = q.trim().toLowerCase();
  const filtered = ql === ''
    ? SEARCH_INDEX
    : SEARCH_INDEX.filter((it) => it.label.toLowerCase().includes(ql) || it.sub.toLowerCase().includes(ql) || it.cat.toLowerCase().includes(ql));

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);
  useEffect(() => { setActive(0); }, [q]);

  const go = (item) => {
    if (item && item.href) window.location.href = item.href;
  };

  useEffect(() => {
    function onKey(e) {
      if (e.key === 'Escape') { onClose(); }
      else if (e.key === 'ArrowDown') { e.preventDefault(); setActive((a) => Math.min(a + 1, filtered.length - 1)); }
      else if (e.key === 'ArrowUp') { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
      else if (e.key === 'Enter') { e.preventDefault(); go(filtered[active]); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [filtered, active, onClose]);

  // Group by category
  const groups = filtered.reduce((acc, it) => {
    if (!acc[it.cat]) acc[it.cat] = [];
    acc[it.cat].push(it);
    return acc;
  }, {});

  let idx = -1;
  return (
    <div className="ki-search-overlay" onClick={onClose}>
      <div className="ki-search-card" onClick={(e) => e.stopPropagation()}>
        <div className="ki-search-input-row">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <circle cx="11" cy="11" r="7" /><path d="m21 21-4.3-4.3" />
          </svg>
          <input
            className="ki-search-input"
            autoFocus
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Coaches, Lektionen, Seiten suchen…"
          />
          <span className="ki-search-kbd">esc</span>
        </div>
        <div className="ki-search-results">
          {filtered.length === 0 && <div className="ki-search-empty">Keine Treffer für „{q}"</div>}
          {Object.keys(groups).map((cat) => (
            <div key={cat}>
              <div className="ki-search-group">{cat}{groups[cat].length > 1 ? 'n' : ''}</div>
              {groups[cat].map((it) => {
                idx++;
                const isActive = idx === active;
                return (
                  <a key={it.href + it.label} href={it.href}
                     className={`ki-search-result${isActive ? ' on' : ''}`}
                     onMouseEnter={() => { /* keep keyboard pos */ }}>
                    <span className="icon-wrap">
                      {it.cat === 'Coach' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>}
                      {it.cat === 'Lektion' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="5 3 19 12 5 21 5 3"/></svg>}
                      {it.cat === 'Seite' && <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>}
                    </span>
                    <div>
                      <div className="label">{it.label}</div>
                      <div className="sub">{it.sub}</div>
                    </div>
                    <span className="arrow">↵</span>
                  </a>
                );
              })}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}



function KiGlobalToast() {
  const [msg, setMsg] = useState(null);
  useEffect(() => {
    let timer = null;
    function onToast(e) {
      const text = (e && e.detail) ? e.detail : 'Erledigt';
      setMsg(text);
      if (timer) clearTimeout(timer);
      timer = setTimeout(() => setMsg(null), 2600);
    }
    window.addEventListener('ki-toast', onToast);
    return () => { window.removeEventListener('ki-toast', onToast); if (timer) clearTimeout(timer); };
  }, []);
  if (!msg) return null;
  return (
    <div className="ki-global-toast">
      <span className="dot">
        <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5" /></svg>
      </span>
      {msg}
    </div>
  );
}


function App() {
  const [searchPaletteOpen, setSearchPaletteOpen] = useState(false);
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") {
        e.preventDefault(); setSearchPaletteOpen(true);
      }
    }
    function onOpen() { setSearchPaletteOpen(true); }
    window.addEventListener("keydown", onKey);
    window.addEventListener("ki-open-search", onOpen);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("ki-open-search", onOpen);
    };
  }, []);
  const [tweaksOpen, setTweaksOpen] = useState(false);
  const [values, setValues] = useState(TWEAK_DEFAULTS);
  const [view, setView] = useState(TWEAK_DEFAULTS.view || 'today');
  const [sbCollapsed, setSbCollapsed] = useState(false);
  useEffect(() => {
    document.documentElement.dataset.density = values.density;
    document.documentElement.dataset.cardstyle = values.cardstyle;
  }, [values]);
  useEffect(() => {
    function onKey(e) {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'b') {
        e.preventDefault();
        setSbCollapsed((v) => !v);
      }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);
  useEffect(() => {
    function onMsg(e) {
      if (!e.data || typeof e.data !== 'object') return;
      if (e.data.type === '__activate_edit_mode') setTweaksOpen(true);
      if (e.data.type === '__deactivate_edit_mode') setTweaksOpen(false);
    }
    window.addEventListener('message', onMsg);
    window.parent.postMessage({ type: '__edit_mode_available' }, '*');
    return () => window.removeEventListener('message', onMsg);
  }, []);
  return (
    <>
      <div className="app" data-sb={sbCollapsed ? 'collapsed' : 'open'}>
        <Sidebar collapsed={sbCollapsed} onToggle={() => setSbCollapsed((v) => !v)} />
        <main className="main">
          <TitleBlock view={view} setView={setView} />
          <Stats view={view} />
          <CVCard />
          {view !== 'all' && <Hero />}
          <div className="grid cols-3-2" style={{ marginBottom: 'var(--gap)' }}>
            <NextSteps view={view} />
            <SkillProfile />
          </div>
          {view !== 'today' && <Courses />}
          <div className="grid cols-2" style={{ marginBottom: 'var(--gap)' }}>
            <Activity view={view} />
            <Upcoming view={view} />
          </div>
          {view === 'all' && <CoachRow />}
        </main>
      </div>
      {!tweaksOpen &&
      <button className="edit-toggle" onClick={() => setTweaksOpen(true)} aria-label="Tweaks">
          <Ic d={icons.settings} size={16} />
        </button>
      }
      <Tweaks open={tweaksOpen} onClose={() => setTweaksOpen(false)} values={values} setValues={setValues} />
          {searchPaletteOpen && <SearchPalette onClose={() => setSearchPaletteOpen(false)} />}
            <KiGlobalToast />
      </>);

}

export default App;
