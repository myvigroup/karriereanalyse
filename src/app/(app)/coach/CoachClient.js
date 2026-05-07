'use client';
import { useState } from 'react';

const Ic = ({ d, size = 16, stroke = 1.7 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth={stroke} strokeLinecap="round" strokeLinejoin="round">{d}</svg>
);

const icons = {
  chat:    <path d="M21 12a8 8 0 0 1-8 8H5l3-3a8 8 0 1 1 13-5z" />,
  play:    <><circle cx="12" cy="12" r="9" /><path d="M10 8.5v7l5.5-3.5z" /></>,
  target:  <><circle cx="12" cy="12" r="9" /><circle cx="12" cy="12" r="5" /><circle cx="12" cy="12" r="1.5" /></>,
  flame:   <path d="M12 3c1 3 4 5 4 9a4 4 0 0 1-8 0c0-2 1-3 2-4-1 3 1 4 2 4 0-3-2-5 0-9z" />,
  chevR:   <path d="M9 5l7 7-7 7" />,
  arrowUp: <path d="M7 14l5-5 5 5" />,
  check:   <path d="M20 6L9 17l-5-5" />,
  doc:     <><path d="M14 3H6a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V9z" /><path d="M14 3v6h6" /></>,
  star:    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01z" />,
  cal:     <><rect x="4" y="5" width="16" height="16" rx="2.5" /><path d="M4 10h16M9 3v4M15 3v4" /></>,
};

function Silhouette() {
  return (
    <svg viewBox="0 0 100 130" preserveAspectRatio="xMidYMid slice"
      style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', opacity: 0.35 }}>
      <defs>
        <linearGradient id="silg" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#fff" stopOpacity="0.6" />
          <stop offset="1" stopColor="#fff" stopOpacity="0.2" />
        </linearGradient>
      </defs>
      <circle cx="50" cy="45" r="18" fill="url(#silg)" />
      <path d="M15 130 C 15 90, 35 75, 50 75 C 65 75, 85 90, 85 130 Z" fill="url(#silg)" />
    </svg>
  );
}

function Stats() {
  const stats = [
    { label: 'Sessions',         icon: icons.chat,   value: '14',  sub: 'Seit Januar' },
    { label: 'Coaching-Stunden', icon: icons.play,   value: '23',  unit: 'h', sub: '8h diesen Monat' },
    { label: 'Nächster Termin',  icon: icons.target, value: 'Mi',  unit: ' · 16:00', sub: 'Florian · Strategie' },
    { label: 'Ø Bewertung',      icon: icons.flame,  value: '4.9', unit: '/5', sub: 'Aus 14 Sessions' },
  ];
  return (
    <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 16, marginBottom: 16 }}>
      {stats.map((s, i) => (
        <div key={i} style={{
          background: 'var(--ki-card)', borderRadius: 'var(--r-md)',
          padding: '16px 18px', boxShadow: 'var(--sh-sm)',
          border: '0.5px solid var(--ki-border)', display: 'flex', flexDirection: 'column', gap: 6,
        }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-secondary)', display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 18, height: 18, borderRadius: 5, display: 'grid', placeItems: 'center', color: 'var(--ki-red)', background: 'rgba(204,20,38,0.08)' }}>
              <Ic d={s.icon} size={11} stroke={2} />
            </span>
            {s.label}
          </div>
          <div style={{ fontSize: 32, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05, color: 'var(--ki-text)', display: 'flex', alignItems: 'baseline', gap: 4, marginTop: 4 }}>
            {s.value}
            {s.unit && <span style={{ fontSize: 15, color: 'var(--ki-text-tertiary)', fontWeight: 500 }}>{s.unit}</span>}
          </div>
          <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', display: 'flex', alignItems: 'center', gap: 5 }}>
            <span style={{ color: 'var(--ki-success)', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 3 }}>
              <Ic d={icons.arrowUp} size={11} stroke={2.5} />
            </span>
            {s.sub}
          </div>
        </div>
      ))}
    </div>
  );
}

function Hero() {
  return (
    <div style={{
      position: 'relative', borderRadius: 'var(--r-lg)', padding: '40px 44px',
      marginBottom: 16, overflow: 'hidden',
      background: 'radial-gradient(500px 240px at 85% 20%, rgba(214,48,72,0.35), transparent 70%), radial-gradient(420px 260px at 10% 110%, rgba(130,3,28,0.9), transparent 70%), linear-gradient(160deg, #1d1d1f 0%, #2b1114 55%, #82031C 100%)',
      color: '#fff', display: 'grid', gridTemplateColumns: '1fr auto auto',
      gap: 32, alignItems: 'stretch', minHeight: 260,
      boxShadow: '0 20px 50px rgba(130,3,28,0.2), 0 2px 4px rgba(0,0,0,0.06)',
    }}>
      {/* grain overlay */}
      <div style={{
        position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4,
        backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
        backgroundSize: '3px 3px',
      }} />

      {/* Body */}
      <div style={{ position: 'relative', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <div>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 7, fontSize: 12, fontWeight: 600,
            padding: '5px 11px', background: 'rgba(255,255,255,0.14)', color: '#fff',
            borderRadius: 980, marginBottom: 20, border: '0.5px solid rgba(255,255,255,0.18)',
          }}>
            <span style={{ width: 6, height: 6, borderRadius: '50%', background: '#FF3B30', boxShadow: '0 0 6px #FF3B30', animation: 'pulse 1.6s infinite' }} />
            Dein Hauptcoach · Verfügbar
          </div>
          <h2 style={{ fontSize: 36, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 14px', color: '#fff' }}>
            Florian Fritsch.<br />
            <span style={{ color: 'rgba(255,255,255,0.55)' }}>12 Jahre Karriere-Coaching. 1.400+ Coachees.</span>
          </h2>
          <div style={{ fontSize: 15, color: 'rgba(255,255,255,0.78)', lineHeight: 1.5, maxWidth: '52ch' }}>
            Spezialisiert auf strategische Karrierewechsel und Executive-Positionen. Direkt, methodisch, ergebnisorientiert.
          </div>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
          <button style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '10px 20px',
            borderRadius: 980, fontSize: 14, fontWeight: 600, cursor: 'pointer',
            background: '#fff', color: '#1d1d1f', border: 'none',
            boxShadow: '0 1px 2px rgba(0,0,0,0.12)',
          }}>Termin buchen</button>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.7)', padding: '7px 14px', borderRadius: 980, background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.12)' }}>
            <Ic d={icons.chat} size={12} /> Nachricht
          </span>
          <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6, fontSize: 13, color: 'rgba(255,255,255,0.7)', padding: '7px 14px', borderRadius: 980, background: 'rgba(255,255,255,0.08)', border: '0.5px solid rgba(255,255,255,0.12)' }}>
            <Ic d={icons.target} size={12} /> Profil
          </span>
        </div>
      </div>

      {/* Next appointment */}
      <div style={{ alignSelf: 'stretch', display: 'flex', flexDirection: 'column', justifyContent: 'flex-end', gap: 6, position: 'relative' }}>
        <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', fontWeight: 600 }}>Nächster Termin</div>
        <div style={{ fontSize: 30, fontWeight: 600, color: '#fff', letterSpacing: '-0.02em' }}>Mi · 16:00</div>
        <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.85)', lineHeight: 1.4, maxWidth: 200 }}>Strategie-Session — Top 3 Rollen schärfen</div>
        <div style={{ fontSize: 11.5, color: 'rgba(255,255,255,0.6)', marginTop: 2 }}>45 Min · Video-Call</div>
      </div>

      {/* Portrait */}
      <div style={{
        width: 200, alignSelf: 'stretch', borderRadius: 14, overflow: 'hidden', position: 'relative',
        background: 'linear-gradient(180deg, #4a0a14 0%, #2a0508 100%)',
        boxShadow: '0 30px 60px rgba(0,0,0,0.45), inset 0 0 0 0.5px rgba(255,255,255,0.08)',
        flexShrink: 0,
      }}>
        <Silhouette />
        <div style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: '14px 16px', background: 'linear-gradient(180deg, transparent, rgba(0,0,0,0.7))', zIndex: 5 }}>
          <div style={{ fontSize: 13, fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>Florian Fritsch</div>
          <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.7)', marginTop: 2 }}>Karriere-Coach · Hauptcoach</div>
        </div>
      </div>

      <style>{`@keyframes pulse { 0%,100% { opacity:1 } 50% { opacity:.4 } }`}</style>
    </div>
  );
}

const SPECS = ['Alle', 'Strategie', 'Gehalt', 'Interview', 'LinkedIn', 'Leadership', 'Quereinstieg', 'Mindset'];

function CoachSpecs({ active, setActive }) {
  return (
    <div style={{ background: 'var(--ki-card)', borderRadius: 'var(--r-lg)', padding: '20px 22px', marginBottom: 16, boxShadow: 'var(--sh-sm)', border: '0.5px solid var(--ki-border)' }}>
      <div style={{ fontSize: 15, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ki-text)', marginBottom: 14 }}>
        Wonach suchst du Hilfe?
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
        {SPECS.map((s, i) => (
          <button key={i} onClick={() => setActive(s)} style={{
            padding: '6px 14px', borderRadius: 980, fontSize: 13, cursor: 'pointer',
            background: active === s ? 'var(--ki-red)' : 'var(--ki-bg-alt)',
            color: active === s ? '#fff' : 'var(--ki-text-secondary)',
            border: `0.5px solid ${active === s ? 'transparent' : 'var(--ki-border)'}`,
            fontWeight: active === s ? 600 : 400, transition: 'all 0.12s ease',
          }}>{s}</button>
        ))}
      </div>
    </div>
  );
}

const COACHES = [
  { name: 'Florian Fritsch', role: 'Karriere-Coach · Hauptcoach', bio: 'Strategische Karrierewechsel & Executive-Positionen. 12 Jahre Erfahrung, 1.400+ Coachees.', tags: ['Strategie', 'C-Level', 'Recruiting'], rating: 4.9, sessions: 14, online: true },
  { name: 'Lena Hartmann',   role: 'Karriere-Coaching',           bio: 'Spezialisiert auf Quereinstieg und Sinn-Findung. Systemische Coaching-Methodik.',              tags: ['Quereinstieg', 'Werte', 'Mindset'],    rating: 4.8, sessions: 6,  online: true  },
  { name: 'Tobias Keller',   role: 'Gehalts-Strategie',           bio: 'Ehemals Compensation-Lead bei einem DAX-Konzern. Verhandlungstechnik in Zahlen.',             tags: ['Gehalt', 'Verhandlung', 'Benefits'],   rating: 4.9, sessions: 2,  online: false },
  { name: 'Sara Brandt',     role: 'Interview-Training',           bio: 'Bereitet auf Cases, Behavioral Interviews und Executive-Gespräche vor. 8 Jahre Recruiting.',  tags: ['Cases', 'Storytelling', 'Pitch'],      rating: 5.0, sessions: 0,  online: true  },
  { name: 'Michael Voss',    role: 'LinkedIn & Sichtbarkeit',      bio: 'LinkedIn-Strategie, Personal Branding und gezielte Headhunter-Reichweite.',                   tags: ['LinkedIn', 'Branding', 'Content'],     rating: 4.7, sessions: 0,  online: false },
  { name: 'Johanna Reuter',  role: 'Führung & Team',               bio: 'Begleitet erstmalige Führungskräfte und laterale Lead-Rollen. 15 Jahre People Management.',   tags: ['Leadership', 'Konflikt', 'Team'],      rating: 4.9, sessions: 0,  online: true  },
];

function CoachGrid({ active }) {
  const filtered = active === 'Alle' ? COACHES : COACHES.filter(c => c.tags.some(t => t === active));
  const list = filtered.length > 0 ? filtered : COACHES;

  return (
    <div style={{ background: 'var(--ki-card)', borderRadius: 'var(--r-lg)', padding: '22px', marginBottom: 16, boxShadow: 'var(--sh-sm)', border: '0.5px solid var(--ki-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 18 }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ki-text)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          Alle Coaches
          <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 980, color: 'var(--ki-text-tertiary)', background: 'var(--ki-bg-alt)' }}>{list.length}</span>
        </h3>
        <button style={{ fontSize: 13, color: 'var(--ki-red)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Filter & Suche</button>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3,1fr)', gap: 14 }}>
        {list.map((c, i) => (
          <div key={i} style={{
            background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)',
            border: '0.5px solid var(--ki-border)', overflow: 'hidden', cursor: 'pointer',
            transition: 'transform .2s ease, box-shadow .2s ease',
          }}
            onMouseEnter={e => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.boxShadow = 'var(--sh-md)'; }}
            onMouseLeave={e => { e.currentTarget.style.transform = 'none'; e.currentTarget.style.boxShadow = 'none'; }}
          >
            {/* Photo */}
            <div style={{ width: '100%', aspectRatio: '4/3', position: 'relative', overflow: 'hidden', background: 'linear-gradient(135deg, #353A3B, #1a1c1d)' }}>
              <Silhouette />
              <span style={{
                position: 'absolute', top: 10, left: 10, zIndex: 3, padding: '4px 10px',
                borderRadius: 980, fontSize: 10.5, fontWeight: 600, letterSpacing: '0.04em',
                textTransform: 'uppercase', backdropFilter: 'blur(8px)',
                background: c.online ? 'rgba(48,209,88,0.18)' : 'rgba(0,0,0,0.45)',
                color: c.online ? '#166534' : '#fff',
                border: c.online ? '0.5px solid rgba(48,209,88,0.3)' : 'none',
              }}>
                {c.online ? '● Verfügbar' : 'Beschäftigt'}
              </span>
            </div>
            {/* Body */}
            <div style={{ padding: '16px 18px 18px', display: 'flex', flexDirection: 'column', gap: 4 }}>
              <div style={{ fontSize: 15, fontWeight: 600, color: 'var(--ki-text)', letterSpacing: '-0.01em' }}>{c.name}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ki-text-tertiary)' }}>{c.role}</div>
              <div style={{ fontSize: 12.5, color: 'var(--ki-text-secondary)', lineHeight: 1.5, marginTop: 8 }}>{c.bio}</div>
              <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginTop: 10 }}>
                {c.tags.map((t, j) => (
                  <span key={j} style={{ padding: '4px 10px', borderRadius: 980, fontSize: 11.5, color: 'var(--ki-text-secondary)', background: 'var(--ki-card)', border: '0.5px solid var(--ki-border)' }}>{t}</span>
                ))}
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 14 }}>
                <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', display: 'flex', alignItems: 'center', gap: 4 }}>
                  <Ic d={icons.star} size={12} stroke={1.5} style={{ color: 'var(--ki-red)', fill: 'var(--ki-red)' }} />
                  {c.rating} · {c.sessions > 0 ? `${c.sessions} Sessions` : 'Neu'}
                </span>
                <button style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-red)', background: 'none', border: 'none', cursor: 'pointer' }}>
                  Termin buchen →
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

const WEEK1 = {
  label: 'Diese Woche', range: '5.–9. Mai',
  days: [
    { mon: 'Mai', num: '05', today: true,  slots: [{ t: '09:00', taken: true }, { t: '11:30' }, { t: '14:00' }] },
    { mon: 'Mai', num: '06',               slots: [{ t: '10:00' }, { t: '13:00', taken: true }] },
    { mon: 'Mai', num: '07',               slots: [{ t: '09:30' }, { t: '16:00', mine: true }, { t: '17:30' }] },
    { mon: 'Mai', num: '08',               slots: [{ t: '11:00' }, { t: '15:00' }] },
    { mon: 'Mai', num: '09',               slots: [{ t: '10:30' }] },
    { mon: 'Mai', num: '10', weekend: true, slots: [] },
    { mon: 'Mai', num: '11', weekend: true, slots: [] },
  ],
};
const WEEK2 = {
  label: 'Nächste Woche', range: '12.–16. Mai',
  days: [
    { mon: 'Mai', num: '12', slots: [{ t: '09:00' }, { t: '11:30' }, { t: '14:00' }] },
    { mon: 'Mai', num: '13', slots: [{ t: '10:00' }, { t: '13:00' }, { t: '16:00' }] },
    { mon: 'Mai', num: '14', slots: [{ t: '09:30', taken: true }, { t: '15:00' }] },
    { mon: 'Mai', num: '15', slots: [{ t: '11:00' }, { t: '14:00' }, { t: '16:30' }] },
    { mon: 'Mai', num: '16', slots: [{ t: '10:00' }, { t: '13:30' }] },
    { mon: 'Mai', num: '17', weekend: true, slots: [] },
    { mon: 'Mai', num: '18', weekend: true, slots: [] },
  ],
};

function SlotPicker() {
  const [selected, setSelected] = useState(null);

  const renderWeek = (w, ki) => (
    <div key={ki} style={{ marginTop: ki === 0 ? 14 : 0, paddingTop: ki === 1 ? 18 : 0, borderTop: ki === 1 ? '0.5px solid var(--ki-border)' : 'none' }}>
      <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12, display: 'flex', justifyContent: 'space-between' }}>
        <span>{w.label}</span><span style={{ fontWeight: 500, textTransform: 'none', letterSpacing: 0 }}>{w.range}</span>
      </div>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 6 }}>
        {w.days.map((d, i) => (
          <div key={i} style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              background: d.weekend ? 'var(--ki-bg-alt)' : 'var(--ki-card)',
              border: `0.5px solid ${d.today ? 'var(--ki-red)' : 'var(--ki-border)'}`,
              boxShadow: d.today ? '0 0 0 1px var(--ki-red)' : 'none',
              borderRadius: 10, padding: '8px 0 10px', marginBottom: 4,
            }}>
              <span style={{ fontSize: 10, color: 'var(--ki-red)', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.06em', lineHeight: 1, marginBottom: 4 }}>{d.mon}</span>
              <span style={{ fontSize: 20, fontWeight: 600, letterSpacing: '-0.03em', color: d.weekend ? 'var(--ki-text-tertiary)' : 'var(--ki-text)', lineHeight: 1 }}>{d.num}</span>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
              {d.slots.length === 0 && <div style={{ padding: '8px 0', textAlign: 'center', fontSize: 11, color: 'var(--ki-text-tertiary)' }}>—</div>}
              {d.slots.map((s, j) => {
                const id = `${ki}-${i}-${j}`;
                const isSelected = selected === id;
                return (
                  <button key={j} onClick={() => !s.taken && !s.mine && setSelected(isSelected ? null : id)}
                    style={{
                      padding: '7px 0', textAlign: 'center', borderRadius: 8, fontSize: 12, fontWeight: 500,
                      border: '0.5px solid transparent', cursor: s.taken ? 'not-allowed' : 'pointer',
                      transition: 'all 0.12s ease',
                      background: s.mine ? 'var(--ki-red)' : isSelected ? 'rgba(204,20,38,0.1)' : s.taken ? 'transparent' : 'var(--ki-bg-alt)',
                      color: s.mine ? '#fff' : isSelected ? 'var(--ki-red)' : s.taken ? 'var(--ki-text-tertiary)' : 'var(--ki-text)',
                      textDecoration: s.taken ? 'line-through' : 'none',
                    }}>
                    {s.t}{s.mine ? ' ✓' : ''}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  return (
    <div style={{ background: 'var(--ki-card)', borderRadius: 'var(--r-lg)', padding: '22px', boxShadow: 'var(--sh-sm)', border: '0.5px solid var(--ki-border)' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ki-text)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          Verfügbare Slots
          <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 980, color: 'var(--ki-text-tertiary)', background: 'var(--ki-bg-alt)' }}>Florian Fritsch</span>
        </h3>
        <button style={{ fontSize: 13, color: 'var(--ki-red)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Anderen Coach</button>
      </div>
      {renderWeek(WEEK1, 0)}
      {renderWeek(WEEK2, 1)}
      <div style={{ display: 'flex', gap: 16, marginTop: 18, paddingTop: 14, borderTop: '0.5px solid var(--ki-border)', fontSize: 11.5, color: 'var(--ki-text-tertiary)' }}>
        {[{ dot: 'var(--ki-bg-alt)', border: 'var(--ki-border)', label: 'Verfügbar' }, { dot: 'var(--ki-red)', label: 'Dein Termin' }, { dot: 'transparent', border: 'var(--ki-text-tertiary)', label: 'Belegt' }].map((l, i) => (
          <span key={i} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
            <span style={{ width: 9, height: 9, borderRadius: '50%', background: l.dot, border: l.border ? `0.5px solid ${l.border}` : 'none', flexShrink: 0 }} />
            {l.label}
          </span>
        ))}
      </div>
      {selected && (
        <div style={{ marginTop: 14, padding: '12px 16px', borderRadius: 'var(--r-md)', background: 'rgba(204,20,38,0.06)', border: '0.5px solid rgba(204,20,38,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <span style={{ fontSize: 13, color: 'var(--ki-red)', fontWeight: 500 }}>Slot ausgewählt — bereit zum Buchen?</span>
          <button style={{ padding: '7px 16px', borderRadius: 980, background: 'var(--ki-red)', color: '#fff', border: 'none', fontSize: 13, fontWeight: 600, cursor: 'pointer' }}>Jetzt buchen</button>
        </div>
      )}
    </div>
  );
}

const NOTES = [
  { author: 'Florian Fritsch', time: 'Vor 2 Tagen',  tag: 'Strategie-Session', text: 'Du bist klar weiter als du denkst. Top-3 Rollen sehen sehr scharf aus — Head of Product bei B2B-SaaS ist dein realistischster Hebel.' },
  { author: 'Sara Brandt',     time: 'Vor 1 Woche',  tag: 'Pitch-Training',    text: 'Starker Einstieg in deinen Elevator Pitch — die Story zur Migration aus der Beratung trägt. Gekürzt von 90 auf 45s würde sie noch stärker wirken.' },
  { author: 'Tobias Keller',   time: 'Vor 2 Wochen', tag: 'Gehalts-Coaching',  text: 'Range für Head of Product B2B-SaaS in Berlin: 110–145k Base + 15–25% Bonus. +5k für 8+ Jahre. Variable nicht über 30%.' },
];

function CoachNotes() {
  return (
    <div style={{ background: 'var(--ki-card)', borderRadius: 'var(--r-lg)', padding: '22px', boxShadow: 'var(--sh-sm)', border: '0.5px solid var(--ki-border)', display: 'flex', flexDirection: 'column' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 4 }}>
        <h3 style={{ fontSize: 17, fontWeight: 600, letterSpacing: '-0.02em', color: 'var(--ki-text)', margin: 0, display: 'flex', alignItems: 'center', gap: 10 }}>
          Letzte Coach-Notes
          <span style={{ fontSize: 11, fontWeight: 500, padding: '2px 8px', borderRadius: 980, color: 'var(--ki-text-tertiary)', background: 'var(--ki-bg-alt)' }}>3</span>
        </h3>
        <button style={{ fontSize: 13, color: 'var(--ki-red)', background: 'none', border: 'none', cursor: 'pointer', fontWeight: 500 }}>Alle Notes</button>
      </div>
      <div style={{ flex: 1 }}>
        {NOTES.map((n, i) => (
          <div key={i} style={{ padding: '14px 0', borderBottom: i < NOTES.length - 1 ? '0.5px solid var(--ki-border)' : 'none', display: 'flex', gap: 14, alignItems: 'flex-start' }}>
            <div style={{ width: 40, height: 40, borderRadius: '50%', background: 'var(--ki-bg-alt)', flexShrink: 0, display: 'grid', placeItems: 'center', position: 'relative', overflow: 'hidden', border: '0.5px solid var(--ki-border)' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: 'var(--ki-text-secondary)' }}>
                {n.author.split(' ').map(w => w[0]).join('')}
              </span>
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 4 }}>
                <span style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text)' }}>{n.author}</span>
                <span style={{ fontSize: 11.5, color: 'var(--ki-text-tertiary)' }}>{n.time}</span>
              </div>
              <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.5 }}>{n.text}</div>
              <span style={{ display: 'inline-block', fontSize: 11, padding: '2px 8px', borderRadius: 980, background: 'var(--ki-bg-alt)', color: 'var(--ki-text-tertiary)', marginTop: 6, border: '0.5px solid var(--ki-border)' }}>{n.tag}</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default function CoachClient({ profile }) {
  const [activeSpec, setActiveSpec] = useState('Alle');

  return (
    <div style={{ padding: '40px 48px 80px', maxWidth: 1200 }}>
      {/* Title */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 7, fontSize: 13, color: 'var(--ki-text-tertiary)', fontWeight: 500, marginBottom: 12 }}>
        <span style={{ width: 6, height: 6, borderRadius: '50%', background: 'var(--ki-success)', boxShadow: '0 0 0 3px rgba(48,209,88,0.2)' }} />
        Dein Coaching-Team · 5 Coaches verfügbar
      </div>
      <h1 style={{ fontSize: 40, fontWeight: 600, letterSpacing: '-0.03em', lineHeight: 1.05, margin: '0 0 10px', color: 'var(--ki-text)' }}>
        Coaches.{' '}
        <span style={{ color: 'var(--ki-text-tertiary)', fontWeight: 600 }}>Menschen, die deine Karriere kennen — nicht nur Theorie.</span>
      </h1>
      <p style={{ fontSize: 16, color: 'var(--ki-text-secondary)', maxWidth: '58ch', lineHeight: 1.5, margin: '0 0 28px' }}>
        Buche eine Session, lass dein Profil challengen oder hol dir Feedback zu Bewerbungen, Gehalt und Strategie.
        Alle Coaches haben mindestens 8 Jahre Erfahrung.
      </p>

      <Stats />
      <Hero />
      <CoachSpecs active={activeSpec} setActive={setActiveSpec} />
      <CoachGrid active={activeSpec} />

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
        <SlotPicker />
        <CoachNotes />
      </div>
    </div>
  );
}
