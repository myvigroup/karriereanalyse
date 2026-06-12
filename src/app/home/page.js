export const metadata = {
  title: 'Das Karriere-Institut — Werde die beste Version deines beruflichen Selbst',
  description: 'Live-Seminare, Video-Masterclasses und persönliches Coaching. 18.000+ Mitglieder. Starte mit dem kostenlosen Lebenslauf-Check.',
};

function Icon({ name, size = 20, color = 'currentColor' }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: color, strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'play':   return <svg {...p}><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill={color} stroke="none"/></svg>;
    case 'users':  return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'target': return <svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
    case 'arrow':  return <svg {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
    default: return null;
  }
}

const PRODUCTS = [
  {
    tag: 'Live · Jeden Samstag',
    icon: 'users',
    title: 'Online-Seminare',
    desc: '13 Seminare zu Karriere, Leadership und Persönlichkeit — live via Microsoft Teams mit echtem Austausch.',
    price: 'Ab 99 € · oder inklusive in der Mitgliedschaft',
    cta: 'Seminare ansehen',
    href: '/seminare',
    featured: false,
  },
  {
    tag: 'Auf Abruf · Video-Kurs',
    icon: 'play',
    title: 'Video-Masterclasses',
    desc: 'Tiefgehende Kurse zu Gehaltsverhandlung, Rhetorik und mehr — strukturiert, praxisnah, jederzeit verfügbar.',
    price: 'Ab 49 € · oder inklusive in der Mitgliedschaft',
    cta: 'Masterclasses entdecken',
    href: '/masterclasses',
    featured: true,
  },
  {
    tag: '1:1 · Persönlich',
    icon: 'target',
    title: 'Coaching mit Experten',
    desc: 'Persönliche Beratung mit einem lizenzierten Karriere-Coach — für konkrete Situationen und schnelle Ergebnisse.',
    price: 'Kostenloses Erstgespräch',
    cta: 'Coach finden',
    href: '/auth/register',
    featured: false,
  },
];

const STEPS = [
  { num: '01', title: 'Gratis Lebenslauf-Check', desc: 'KI analysiert deinen CV in 60 Sekunden — Struktur, Inhalt, Design, Wirkung.' },
  { num: '02', title: 'Seminar besuchen', desc: 'Das Thema wählen, das gerade am dringendsten ist. Live, interaktiv.' },
  { num: '03', title: 'Masterclass vertiefen', desc: 'Video-Kurs mit Skripten, Workbooks und Zertifikat — auf deinem Tempo.' },
  { num: '04', title: 'Mit Coach umsetzen', desc: 'Bei Bedarf 1:1 mit einem Experten im echten Kontext anwenden.' },
];

const TRUST = [
  { value: '18.000+', label: 'Mitglieder' },
  { value: '100+', label: 'lizenzierte Coaches' },
  { value: '13', label: 'Live-Seminare' },
  { value: '★ 4.9', label: 'Bewertung' },
];

const SEMINARE_PREVIEW = [
  'Rhetorik & Überzeugen', 'Gehaltsverhandlung', 'Personal Leadership',
  'Kommunikation', 'Selbstmotivation', 'Konfliktmanagement',
];

const HERO_BG = `
  radial-gradient(600px 280px at 80% 20%, rgba(214,48,72,0.3), transparent 70%),
  radial-gradient(500px 300px at 5% 120%, rgba(130,3,28,0.85), transparent 70%),
  linear-gradient(160deg, #1d1d1f 0%, #2b1114 55%, #82031C 100%)
`;
const GRAIN = {
  position: 'absolute', inset: 0, pointerEvents: 'none', opacity: 0.4,
  backgroundImage: 'radial-gradient(circle at 1px 1px, rgba(255,255,255,0.04) 1px, transparent 0)',
  backgroundSize: '3px 3px',
};

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: 'var(--ki-bg)', fontFamily: "'Instrument Sans', -apple-system, sans-serif", color: 'var(--ki-text)' }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '14px 48px', maxWidth: 1100, margin: '0 auto', borderBottom: '0.5px solid var(--ki-border-light)' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase' }}>
          Das Karriere-Institut
        </span>
        <div style={{ display: 'flex', gap: 4, alignItems: 'center' }}>
          <a href="/seminare" style={{ fontSize: 13, color: 'var(--ki-text-secondary)', padding: '7px 14px', borderRadius: '980px', textDecoration: 'none', fontWeight: 500 }}>Seminare</a>
          <a href="/masterclasses" style={{ fontSize: 13, color: 'var(--ki-text-secondary)', padding: '7px 14px', borderRadius: '980px', textDecoration: 'none', fontWeight: 500 }}>Masterclasses</a>
          <a href="/auth/login" style={{ fontSize: 13, color: 'var(--ki-text-secondary)', padding: '7px 14px', borderRadius: '980px', textDecoration: 'none' }}>Einloggen</a>
          <a href="/scan" className="btn btn-primary" style={{ fontSize: 13, padding: '8px 18px' }}>Gratis CV-Check</a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ position: 'relative', overflow: 'hidden', padding: '88px 24px 80px', background: HERO_BG }}>
        <div style={GRAIN} />
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center', position: 'relative' }}>
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px', borderRadius: '980px', background: 'rgba(255,255,255,0.12)', border: '0.5px solid rgba(255,255,255,0.18)', fontSize: 12, fontWeight: 600, color: 'rgba(255,255,255,0.9)', marginBottom: 28, backdropFilter: 'blur(12px)' }}>
            Kostenlos starten · Kein Account nötig
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 600, letterSpacing: '-0.04em', lineHeight: 1.08, color: '#fff', marginBottom: 20 }}>
            Werde die beste Version<br />
            <span style={{ color: 'var(--ki-red)' }}>deines beruflichen Selbst.</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.55)', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.55, letterSpacing: '-0.01em' }}>
            Seminare, Masterclasses und persönliches Coaching — strukturiert, praxisnah und auf dich zugeschnitten.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 52 }}>
            <a href="/scan" className="btn btn-on-dark" style={{ fontSize: 15, padding: '14px 28px' }}>
              Kostenlosen Lebenslauf-Check starten →
            </a>
            <a href="/seminare" style={{ display: 'inline-flex', alignItems: 'center', fontSize: 14, fontWeight: 500, padding: '14px 22px', borderRadius: '980px', background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)', border: '0.5px solid rgba(255,255,255,0.14)', textDecoration: 'none' }}>
              Seminare entdecken
            </a>
          </div>
          <div style={{ display: 'inline-flex', borderRadius: '16px', overflow: 'hidden', border: '0.5px solid rgba(255,255,255,0.1)' }}>
            {TRUST.map(({ value, label }, i) => (
              <div key={label} style={{ padding: '13px 22px', textAlign: 'center', background: i % 2 === 0 ? 'rgba(255,255,255,0.05)' : 'rgba(255,255,255,0.09)', borderRight: i < TRUST.length - 1 ? '0.5px solid rgba(255,255,255,0.1)' : 'none' }}>
                <div style={{ fontSize: 19, fontWeight: 600, color: '#fff', letterSpacing: '-0.025em' }}>{value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2, fontWeight: 500 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section style={{ maxWidth: 1060, margin: '0 auto', padding: '72px 24px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.035em', marginBottom: 8 }}>Dein Weg zur nächsten Karrierestufe</h2>
          <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', maxWidth: 400, margin: '0 auto', lineHeight: 1.5 }}>Drei Formate — je nach Lernstil, Zeit und Ziel.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 14 }}>
          {PRODUCTS.map((p) => (
            <div key={p.title} className="card" style={{
              display: 'flex', flexDirection: 'column', position: 'relative',
              ...(p.featured ? { background: '#1d1d1f', border: '0.5px solid rgba(204,20,38,0.35)', boxShadow: '0 0 0 1px rgba(204,20,38,0.12), var(--sh-md)' } : {}),
            }}>
              {p.featured && (
                <div style={{ position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)', background: 'var(--ki-red)', color: '#fff', fontSize: 11, fontWeight: 600, padding: '3px 12px', borderRadius: '980px', whiteSpace: 'nowrap' }}>
                  Bestseller
                </div>
              )}
              <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.06em', textTransform: 'uppercase', marginBottom: 14, color: p.featured ? 'rgba(255,255,255,0.3)' : 'var(--ki-text-tertiary)' }}>{p.tag}</div>
              <div style={{ width: 40, height: 40, borderRadius: '8px', marginBottom: 14, background: p.featured ? 'rgba(204,20,38,0.2)' : '#FDEDEF', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <Icon name={p.icon} size={20} color="#CC1426" />
              </div>
              <h3 style={{ fontSize: 19, fontWeight: 600, letterSpacing: '-0.025em', marginBottom: 8, color: p.featured ? '#fff' : 'var(--ki-text)' }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: p.featured ? 'rgba(255,255,255,0.5)' : 'var(--ki-text-secondary)', lineHeight: 1.55, marginBottom: 16, flex: 1 }}>{p.desc}</p>
              <div style={{ fontSize: 12, color: p.featured ? 'rgba(255,255,255,0.22)' : 'var(--ki-text-tertiary)', marginBottom: 18 }}>{p.price}</div>
              <a href={p.href} className={`btn ${p.featured ? 'btn-primary' : 'btn-secondary'}`} style={{ fontSize: 14, padding: '10px 18px', textDecoration: 'none' }}>{p.cta} →</a>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 1060, margin: '0 auto', padding: '72px 24px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 44 }}>
          <h2 style={{ fontSize: 30, fontWeight: 600, letterSpacing: '-0.035em', marginBottom: 8 }}>So funktioniert das Karriere-Institut</h2>
          <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)' }}>Ein klarer Weg — von der ersten Analyse bis zur Umsetzung.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 12 }}>
          {STEPS.map((step) => (
            <div key={step.num} className="card" style={{ borderLeft: '2.5px solid var(--ki-red)' }}>
              <div style={{ fontSize: 10, fontWeight: 700, color: 'var(--ki-red)', letterSpacing: '0.08em', textTransform: 'uppercase', marginBottom: 10 }}>Schritt {step.num}</div>
              <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ki-text)', marginBottom: 6, lineHeight: 1.3, letterSpacing: '-0.01em' }}>{step.title}</div>
              <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.55 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Seminare preview */}
      <section style={{ maxWidth: 1060, margin: '0 auto', padding: '72px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 24, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 26, fontWeight: 600, letterSpacing: '-0.03em', marginBottom: 4 }}>Live-Seminare</h2>
            <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)' }}>Jeden Samstag · 09:30–12:00 Uhr · Live via Microsoft Teams</p>
          </div>
          <a href="/seminare" className="btn btn-secondary" style={{ fontSize: 13, padding: '8px 18px', textDecoration: 'none' }}>Alle 13 Seminare →</a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
          {SEMINARE_PREVIEW.map((title) => (
            <div key={title} className="card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px 18px', borderLeft: '2.5px solid var(--ki-red)' }}>
              <span style={{ fontSize: 14, fontWeight: 500, letterSpacing: '-0.01em' }}>{title}</span>
              <Icon name="arrow" size={15} color="var(--ki-text-tertiary)" />
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section style={{ maxWidth: 1060, margin: '72px auto 0', padding: '0 24px' }}>
        <div style={{ position: 'relative', overflow: 'hidden', borderRadius: '28px', padding: '52px 48px', background: HERO_BG, boxShadow: '0 20px 50px rgba(130,3,28,0.2), var(--sh-md)', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
          <div style={GRAIN} />
          <div style={{ maxWidth: 480, position: 'relative' }}>
            <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 14 }}>Kostenlos · Kein Account · Sofortiges Ergebnis</div>
            <h2 style={{ fontSize: 28, fontWeight: 600, letterSpacing: '-0.035em', marginBottom: 10, lineHeight: 1.12, color: '#fff' }}>
              Starte mit dem<br /><span style={{ color: 'var(--ki-red)' }}>Lebenslauf-Check.</span>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.6, letterSpacing: '-0.01em' }}>
              Lade deinen CV hoch — die KI gibt dir in 60 Sekunden Feedback zu Struktur, Inhalt, Design und Wirkung.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 10, position: 'relative', flexShrink: 0 }}>
            <a href="/scan" className="btn btn-on-dark" style={{ fontSize: 15, padding: '14px 28px', whiteSpace: 'nowrap', textDecoration: 'none' }}>Jetzt kostenlos starten →</a>
            <a href="/auth/register" style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', fontSize: 13, fontWeight: 500, padding: '12px 22px', borderRadius: '980px', background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', border: '0.5px solid rgba(255,255,255,0.12)', textDecoration: 'none', whiteSpace: 'nowrap' }}>Premium-Mitgliedschaft</a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '0.5px solid var(--ki-border-light)', padding: '28px 48px', maxWidth: 1100, margin: '56px auto 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>© 2026 Das Karriere-Institut · +49 511 5468 4547 · info@daskarriereinstitut.de</div>
        <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
          {[['Impressum', '/impressum'], ['Datenschutz', '/datenschutz'], ['AGB', '/agb']].map(([label, href]) => (
            <a key={label} href={href} style={{ color: 'var(--ki-text-tertiary)', textDecoration: 'none' }}>{label}</a>
          ))}
        </div>
      </footer>
    </div>
  );
}
