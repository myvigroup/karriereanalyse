export default function LandingPage() {
  const features = [
    { icon: '\u25CE', title: 'KI-Karriereanalyse', desc: '13 Kompetenzfelder in 10 Minuten analysiert. Finde heraus, wo dein gr\u00F6\u00DFtes Potenzial liegt.' },
    { icon: '\u{1F916}', title: 'KI-Coach', desc: 'Dein pers\u00F6nlicher Karriere-Mentor, verf\u00FCgbar 24/7. Kontextbewusst und auf dich zugeschnitten.' },
    { icon: '\u{1F4CA}', title: 'Gehaltsintelligenz', desc: 'Erfahre deinen Marktwert, vergleiche Geh\u00E4lter und verhandle mit Daten statt Bauchgef\u00FChl.' },
  ];

  const tiers = [
    { name: 'Free', price: '0\u20AC', sub: 'f\u00FCr immer', features: ['Karriereanalyse', 'Dashboard', 'Gehaltsdatenbank'], cta: 'Kostenlos starten', primary: false },
    { name: 'Pro', price: '49\u20AC', sub: '/Monat', features: ['Alles aus Free', 'KI-Coach unbegrenzt', 'Masterclass-Zugang', 'LinkedIn-Optimizer', 'Bewerbungs-Assistent'], cta: 'Pro starten', primary: true },
    { name: 'Team', price: '29\u20AC', sub: '/User/Monat', features: ['Alles aus Pro', 'Admin-Dashboard', 'Team-Analytics', 'Coaching-Cockpit'], cta: 'Team anfragen', primary: false },
  ];

  return (
    <div style={{ minHeight: '100vh', background: 'var(--ki-bg)', fontFamily: "'Instrument Sans', sans-serif" }}>
      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase' }}>Karriere-Institut</div>
        <a href="/auth/login" className="btn btn-primary" style={{ fontSize: 13, padding: '8px 20px' }}>Einloggen</a>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '80px 24px 60px', maxWidth: 800, margin: '0 auto' }}>
        <div className="pill pill-red" style={{ marginBottom: 16 }}>Die Blaupause f\u00FCr deine berufliche Zukunft</div>
        <h1 style={{ fontSize: 52, fontWeight: 700, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 16, color: 'var(--ki-text)' }}>
          Erhalte jetzt dein<br />Karriere-Blutbild.
        </h1>
        <p style={{ fontSize: 18, color: 'var(--ki-text-secondary)', maxWidth: 560, margin: '0 auto 32px', lineHeight: 1.6 }}>
          KI-gest\u00FCtzte Analyse, pers\u00F6nliches Coaching und strategische Tools \u2014 alles in einer Plattform f\u00FCr deinen beruflichen Erfolg.
        </p>
        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/auth/register" className="btn btn-primary" style={{ fontSize: 16, padding: '14px 32px' }}>
            Kostenlos starten {'\u2192'}
          </a>
          <a href="/angebote" className="btn btn-secondary" style={{ fontSize: 16, padding: '14px 32px' }}>
            Angebote ansehen
          </a>
        </div>
      </section>

      {/* Features */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '40px 24px 80px' }}>
        <div className="grid-3">
          {features.map((f, i) => (
            <div key={i} className="card animate-in" style={{ textAlign: 'center', padding: 32 }}>
              <div style={{ fontSize: 36, marginBottom: 16 }}>{f.icon}</div>
              <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8, letterSpacing: '-0.02em' }}>{f.title}</h3>
              <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.6 }}>{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Social Proof */}
      <section style={{ textAlign: 'center', padding: '40px 24px', background: 'var(--ki-bg-alt)' }}>
        <p style={{ fontSize: 32, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>500+</p>
        <p style={{ fontSize: 16, color: 'var(--ki-text-secondary)' }}>Karrieren transformiert</p>
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: 1000, margin: '0 auto', padding: '80px 24px' }}>
        <h2 style={{ textAlign: 'center', fontSize: 34, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 48 }}>W\u00E4hle deinen Plan</h2>
        <div className="grid-3">
          {tiers.map((t, i) => (
            <div key={i} className="card" style={{ padding: 32, border: t.primary ? '2px solid var(--ki-red)' : '1px solid var(--ki-border)', position: 'relative' }}>
              {t.primary && <div style={{ position: 'absolute', top: -12, left: '50%', transform: 'translateX(-50%)' }}><span className="pill pill-red">Beliebt</span></div>}
              <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 4 }}>{t.name}</h3>
              <div style={{ marginBottom: 20 }}>
                <span style={{ fontSize: 36, fontWeight: 700 }}>{t.price}</span>
                <span style={{ fontSize: 14, color: 'var(--ki-text-secondary)' }}> {t.sub}</span>
              </div>
              <ul style={{ listStyle: 'none', marginBottom: 24 }}>
                {t.features.map((f, j) => (
                  <li key={j} style={{ fontSize: 14, padding: '6px 0', color: 'var(--ki-text-secondary)', display: 'flex', alignItems: 'center', gap: 8 }}>
                    <span style={{ color: 'var(--ki-success)' }}>\u2713</span> {f}
                  </li>
                ))}
              </ul>
              <a href="/auth/login" className={`btn ${t.primary ? 'btn-primary' : 'btn-secondary'}`} style={{ width: '100%' }}>{t.cta}</a>
            </div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid var(--ki-border)', padding: '32px 24px', textAlign: 'center' }}>
        <div style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase', marginBottom: 8 }}>Das Karriere-Institut</div>
        <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginBottom: 12 }}>+49 511 5468 4547 | info@daskarriereinstitut.de</div>
        <div style={{ display: 'flex', justifyContent: 'center', gap: 16, fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16, flexWrap: 'wrap' }}>
          <a href="/auth/login" style={{ color: 'var(--ki-text-secondary)' }}>Login</a>
          <a href="/angebote" style={{ color: 'var(--ki-text-secondary)' }}>Angebote</a>
          <a href="/impressum" style={{ color: 'var(--ki-text-secondary)' }}>Impressum</a>
          <a href="/datenschutz" style={{ color: 'var(--ki-text-secondary)' }}>Datenschutz</a>
          <a href="/widerruf" style={{ color: 'var(--ki-text-secondary)' }}>Widerruf</a>
          <a href="/agb" style={{ color: 'var(--ki-text-secondary)' }}>AGB</a>
        </div>
        <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>{'\u00A9'} 2026 - Das Karriere-Institut. Alle Rechte vorbehalten.</p>
      </footer>
    </div>
  );
}
