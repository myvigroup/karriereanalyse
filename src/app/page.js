import Link from 'next/link';

export const metadata = {
  title: 'Das Karriere-Institut — Werde die beste Version deines beruflichen Selbst',
  description: 'Live-Seminare, Video-Masterclasses und persönliches Coaching. 18.000+ Mitglieder. Starte mit dem kostenlosen Lebenslauf-Check.',
};

function Icon({ name, size = 20 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none', stroke: 'currentColor', strokeWidth: 1.7, strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'play':    return <svg {...p}><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8" fill="currentColor" stroke="none"/></svg>;
    case 'users':   return <svg {...p}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>;
    case 'target':  return <svg {...p}><circle cx="12" cy="12" r="10"/><circle cx="12" cy="12" r="6"/><circle cx="12" cy="12" r="2"/></svg>;
    case 'doc':     return <svg {...p}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/></svg>;
    case 'star':    return <svg {...p}><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" fill="currentColor" stroke="none"/></svg>;
    case 'check':   return <svg {...p}><polyline points="20 6 9 17 4 12"/></svg>;
    case 'arrow':   return <svg {...p}><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>;
    case 'clock':   return <svg {...p}><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>;
    case 'award':   return <svg {...p}><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
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
    highlight: false,
  },
  {
    tag: 'Auf Abruf · Video-Kurs',
    icon: 'play',
    title: 'Video-Masterclasses',
    desc: 'Tiefgehende Kurse zu Gehaltsverhandlung, Rhetorik und mehr — strukturiert, praxisnah, auf Abruf.',
    price: 'Ab 49 € · oder inklusive in der Mitgliedschaft',
    cta: 'Masterclasses entdecken',
    href: '/masterclasses',
    highlight: true,
  },
  {
    tag: '1:1 · Persönlich',
    icon: 'target',
    title: 'Coaching mit Experten',
    desc: 'Persönliche Beratung mit einem lizenzierten Karriere-Coach — für konkrete Situationen und schnelle Ergebnisse.',
    price: 'Auf Anfrage · kostenlose Erstgespräch',
    cta: 'Coach finden',
    href: '/auth/register',
    highlight: false,
  },
];

const STEPS = [
  { num: '01', title: 'Kostenloser Lebenslauf-Check', desc: 'Lade deinen CV hoch — die KI analysiert in Sekunden Struktur, Inhalt, Design und Wirkung.' },
  { num: '02', title: 'Seminar besuchen', desc: 'Wähle ein Thema, das dir gerade am wichtigsten ist. Live, interaktiv, mit echten Ergebnissen.' },
  { num: '03', title: 'Masterclass vertiefen', desc: 'Geh tiefer in das Thema mit einem Video-Kurs — mit Skripten, Workbooks und Zertifikat.' },
  { num: '04', title: 'Mit Coach umsetzen', desc: 'Bei Bedarf: 1:1 mit einem Experten die Erkenntnisse im echten Kontext anwenden.' },
];

const TRUST = [
  { value: '18.000+', label: 'Mitglieder vertrauen uns' },
  { value: '100+', label: 'lizenzierte Coaches' },
  { value: '13', label: 'Live-Seminare pro Jahr' },
  { value: '★ 4.9', label: 'Durchschnittsbewertung' },
];

const SEMINARE_PREVIEW = [
  'Rhetorik & Überzeugen',
  'Gehaltsverhandlung',
  'Personal Leadership',
  'Kommunikation',
  'Selbstmotivation',
  'Konfliktmanagement',
];

export default function HomePage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', fontFamily: "'Instrument Sans', sans-serif" }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', maxWidth: 1100, margin: '0 auto', borderBottom: '1px solid #F0EFE9' }}>
        <span style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#CC1426', textTransform: 'uppercase' }}>
          Das Karriere-Institut
        </span>
        <div style={{ display: 'flex', gap: 24, alignItems: 'center' }}>
          <a href="/seminare" style={{ fontSize: 13, color: '#6B6B6B', textDecoration: 'none', fontWeight: 500 }}>Seminare</a>
          <a href="/masterclasses" style={{ fontSize: 13, color: '#6B6B6B', textDecoration: 'none', fontWeight: 500 }}>Masterclasses</a>
          <a href="/auth/login" style={{ fontSize: 13, color: '#6B6B6B', textDecoration: 'none' }}>Einloggen</a>
          <a href="/scan" style={{ fontSize: 13, fontWeight: 600, padding: '8px 20px', borderRadius: 999, background: '#CC1426', color: 'white', textDecoration: 'none' }}>
            Gratis CV-Check
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #1A1A1A 0%, #2C1810 55%, #1A1A1A 100%)',
        padding: '88px 24px 80px',
      }}>
        <div style={{ maxWidth: 780, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px',
            borderRadius: 999, background: 'rgba(204,20,38,0.2)', border: '1px solid rgba(204,20,38,0.35)',
            fontSize: 12, fontWeight: 600, color: '#ff7a7a', marginBottom: 28,
          }}>
            Kostenlos starten · Kein Account nötig
          </div>
          <h1 style={{ fontSize: 52, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.08, color: 'white', marginBottom: 20 }}>
            Werde die beste Version<br />
            <span style={{ color: '#CC1426' }}>deines beruflichen Selbst.</span>
          </h1>
          <p style={{ fontSize: 18, color: 'rgba(255,255,255,0.5)', maxWidth: 520, margin: '0 auto 40px', lineHeight: 1.65 }}>
            Seminare, Masterclasses und persönliches Coaching — strukturiert, praxisnah und auf dich zugeschnitten.
          </p>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 48 }}>
            <a href="/scan" style={{
              fontSize: 15, fontWeight: 700, padding: '15px 32px', borderRadius: 999,
              background: '#CC1426', color: 'white', textDecoration: 'none',
              boxShadow: '0 4px 24px rgba(204,20,38,0.4)',
            }}>
              Kostenlosen Lebenslauf-Check starten →
            </a>
            <a href="/seminare" style={{
              fontSize: 14, fontWeight: 500, padding: '15px 24px', borderRadius: 999,
              background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              Seminare entdecken
            </a>
          </div>

          {/* Trust Bar */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 0, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', display: 'inline-flex', flexWrap: 'wrap' }}>
            {TRUST.map(({ value, label }, i) => (
              <div key={label} style={{
                padding: '14px 24px', textAlign: 'center',
                background: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)',
                borderRight: i < TRUST.length - 1 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div style={{ fontSize: 20, fontWeight: 800, color: 'white', letterSpacing: '-0.02em' }}>{value}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Products */}
      <section style={{ maxWidth: 1060, margin: '0 auto', padding: '72px 24px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 10 }}>Dein Weg zur nächsten Karrierestufe</h2>
          <p style={{ fontSize: 16, color: '#6B6B6B', maxWidth: 440, margin: '0 auto' }}>Drei Formate — je nach Lernstil, Zeit und Ziel.</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 16 }}>
          {PRODUCTS.map((p) => (
            <div key={p.title} style={{
              background: p.highlight ? '#1A1A1A' : 'white',
              borderRadius: 18, padding: '32px 28px',
              border: p.highlight ? '2px solid #CC1426' : '1px solid #E8E6E1',
              display: 'flex', flexDirection: 'column',
              position: 'relative',
            }}>
              {p.highlight && (
                <div style={{
                  position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)',
                  background: '#CC1426', color: 'white', fontSize: 11, fontWeight: 700,
                  padding: '4px 14px', borderRadius: 999, whiteSpace: 'nowrap',
                }}>
                  Bestseller
                </div>
              )}
              <div style={{ fontSize: 11, fontWeight: 600, color: p.highlight ? 'rgba(255,255,255,0.35)' : '#9A9A9A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 16 }}>
                {p.tag}
              </div>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: p.highlight ? 'rgba(204,20,38,0.2)' : '#FFF0F1', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 16, color: '#CC1426' }}>
                <Icon name={p.icon} size={22} />
              </div>
              <h3 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 10, color: p.highlight ? 'white' : '#1A1A1A' }}>{p.title}</h3>
              <p style={{ fontSize: 14, color: p.highlight ? 'rgba(255,255,255,0.5)' : '#6B6B6B', lineHeight: 1.6, marginBottom: 20, flex: 1 }}>{p.desc}</p>
              <div style={{ fontSize: 12, color: p.highlight ? 'rgba(255,255,255,0.25)' : '#9A9A9A', marginBottom: 20 }}>{p.price}</div>
              <a href={p.href} style={{
                display: 'block', textAlign: 'center', fontSize: 14, fontWeight: 600,
                padding: '12px 20px', borderRadius: 10, textDecoration: 'none',
                background: p.highlight ? '#CC1426' : '#F0EFE9',
                color: p.highlight ? 'white' : '#1A1A1A',
              }}>
                {p.cta} →
              </a>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 0' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 32, fontWeight: 800, letterSpacing: '-0.04em', marginBottom: 10 }}>So funktioniert das Karriere-Institut</h2>
          <p style={{ fontSize: 16, color: '#6B6B6B' }}>Ein klarer Weg — von der ersten Analyse bis zur Umsetzung.</p>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 2 }}>
          {STEPS.map((step, i) => (
            <div key={step.num} style={{
              background: 'white',
              borderRadius: i === 0 ? '14px 4px 4px 14px' : i === STEPS.length - 1 ? '4px 14px 14px 4px' : 4,
              padding: '28px 24px',
              border: '1px solid #E8E6E1',
              borderLeft: '3px solid #CC1426',
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: '#CC1426', letterSpacing: '0.06em', marginBottom: 10 }}>SCHRITT {step.num}</div>
              <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 8, lineHeight: 1.3 }}>{step.title}</div>
              <div style={{ fontSize: 13, color: '#6B6B6B', lineHeight: 1.55 }}>{step.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Seminar Preview */}
      <section style={{ maxWidth: 1060, margin: '0 auto', padding: '80px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'space-between', marginBottom: 28, flexWrap: 'wrap', gap: 12 }}>
          <div>
            <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>Live-Seminare</h2>
            <p style={{ fontSize: 15, color: '#6B6B6B' }}>Jeden Samstag · 09:30–12:00 Uhr · Live via Microsoft Teams</p>
          </div>
          <a href="/seminare" style={{ fontSize: 13, fontWeight: 600, padding: '10px 22px', borderRadius: 999, background: '#F0EFE9', color: '#1A1A1A', textDecoration: 'none', border: '1px solid #E8E6E1' }}>
            Alle 13 Seminare →
          </a>
        </div>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10 }}>
          {SEMINARE_PREVIEW.map((title) => (
            <div key={title} style={{ background: 'white', borderRadius: 12, padding: '16px 20px', border: '1px solid #E8E6E1', borderLeft: '3px solid #CC1426', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <span style={{ fontSize: 14, fontWeight: 600, color: '#1A1A1A' }}>{title}</span>
              <Icon name="arrow" size={16} />
            </div>
          ))}
        </div>
      </section>

      {/* Free CV Check CTA */}
      <section style={{ maxWidth: 1060, margin: '80px auto 0', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2E 100%)', borderRadius: 22, padding: '56px 48px', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 40, flexWrap: 'wrap' }}>
          <div style={{ maxWidth: 500 }}>
            <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.35)', marginBottom: 14 }}>
              Kostenlos · Kein Account · Sofortiges Ergebnis
            </div>
            <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.15 }}>
              Starte mit dem<br /><span style={{ color: '#CC1426' }}>Lebenslauf-Check.</span>
            </h2>
            <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.45)', lineHeight: 1.65, marginBottom: 0 }}>
              Lade deinen CV hoch — die KI gibt dir in 60 Sekunden Feedback zu Struktur, Inhalt, Design und Wirkung. Gratis, anonym, ohne Registrierung.
            </p>
          </div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 12, flexShrink: 0 }}>
            <a href="/scan" style={{
              fontSize: 15, fontWeight: 700, padding: '16px 32px', borderRadius: 999,
              background: '#CC1426', color: 'white', textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(204,20,38,0.5)', whiteSpace: 'nowrap',
            }}>
              Jetzt kostenlos starten →
            </a>
            <a href="/auth/register" style={{
              fontSize: 13, fontWeight: 500, padding: '13px 24px', borderRadius: 999,
              background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.65)', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.12)', textAlign: 'center', whiteSpace: 'nowrap',
            }}>
              Premium-Mitgliedschaft
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E8E6E1', padding: '32px 48px', maxWidth: 1100, margin: '56px auto 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontSize: 12, color: '#9A9A9A' }}>© 2026 Das Karriere-Institut · +49 511 5468 4547 · info@daskarriereinstitut.de</div>
        <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
          <a href="/impressum" style={{ color: '#9A9A9A', textDecoration: 'none' }}>Impressum</a>
          <a href="/datenschutz" style={{ color: '#9A9A9A', textDecoration: 'none' }}>Datenschutz</a>
          <a href="/agb" style={{ color: '#9A9A9A', textDecoration: 'none' }}>AGB</a>
        </div>
      </footer>
    </div>
  );
}
