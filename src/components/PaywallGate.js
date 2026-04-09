// PaywallGate — Server Component
// Zeigt eine Paywall wenn der User keinen Zugang hat

const CONFIGS = {
  analyse: {
    icon: '◎',
    title: 'Karriere-Analyse freischalten',
    subtitle: 'Dein persönliches Karriere-Blutbild — 12 Kompetenzfelder, ~10 Minuten.',
    features: [
      'Detailliertes Assessment über 12 Kompetenzfelder',
      'Personalisierte Kursempfehlungen',
      'Dein Stärken- und Schwächenprofil auf einen Blick',
      'Konkrete nächste Schritte für deine Karriere',
    ],
    products: [
      { key: 'ANALYSE_STUDENT', label: 'Für Studierende & Berufseinsteiger', badge: null },
      { key: 'ANALYSE_PRO', label: 'Für Berufstätige & Führungskräfte', badge: 'Empfohlen' },
    ],
    ctaHref: '/angebote',
    ctaLabel: 'Analyse freischalten →',
    color: 'var(--ki-red)',
  },
  masterclass: {
    icon: '💰',
    title: 'Gehaltsverhandlung Mastery',
    subtitle: 'Von Angst zu Strategie — lerne wie du dein Gehalt systematisch um 7–12 % steigerst.',
    features: [
      '5 Module · 17 Lektionen · ~55 Minuten',
      'Interaktive Simulationen: Verhandle gegen deinen Chef',
      'Konkrete Skripte & Pitches zum Sofort-Anwenden',
      'Alle weiteren Masterclass-Kurse inklusive',
    ],
    products: [
      { key: 'MASTERCLASS', label: 'Masterclass Abo (7 Tage kostenlos)', badge: 'Kostenlos testen' },
    ],
    ctaHref: '/angebote',
    ctaLabel: 'Masterclass freischalten →',
    color: '#d97706',
  },
};

export default function PaywallGate({ feature }) {
  const cfg = CONFIGS[feature];
  if (!cfg) return null;

  return (
    <div className="page-container" style={{ paddingTop: 48, paddingBottom: 80, maxWidth: 600, margin: '0 auto' }}>
      {/* Hero */}
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <div style={{
          width: 72, height: 72, borderRadius: '50%',
          background: `color-mix(in srgb, ${cfg.color} 12%, transparent)`,
          border: `2px solid color-mix(in srgb, ${cfg.color} 30%, transparent)`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: 30, margin: '0 auto 20px',
        }}>
          {cfg.icon}
        </div>
        <h1 style={{ fontSize: 26, fontWeight: 800, margin: '0 0 10px', letterSpacing: '-0.03em' }}>
          {cfg.title}
        </h1>
        <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', margin: 0, lineHeight: 1.6 }}>
          {cfg.subtitle}
        </p>
      </div>

      {/* Features */}
      <div className="card" style={{ marginBottom: 24, padding: '20px 24px' }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
          Was dich erwartet
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {cfg.features.map((f, i) => (
            <div key={i} style={{ display: 'flex', gap: 10, alignItems: 'flex-start', fontSize: 14, lineHeight: 1.55 }}>
              <span style={{ color: cfg.color, fontWeight: 700, flexShrink: 0 }}>✓</span>
              <span style={{ color: 'var(--ki-text-secondary)' }}>{f}</span>
            </div>
          ))}
        </div>
      </div>

      {/* CTA */}
      <a
        href={cfg.ctaHref}
        className="btn btn-primary"
        style={{ display: 'block', width: '100%', textAlign: 'center', padding: '14px 24px', fontSize: 15, fontWeight: 700, textDecoration: 'none' }}
      >
        {cfg.ctaLabel}
      </a>
      <div style={{ textAlign: 'center', marginTop: 12, fontSize: 12, color: 'var(--ki-text-tertiary)' }}>
        Sicher & verschlüsselt über Stripe
      </div>
    </div>
  );
}
