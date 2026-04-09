export const metadata = {
  title: 'Gehaltsverhandlung Mastery — Karriere-Institut',
  description: 'Der Kurs, der dein Gehalt ändert. 5 Module, konkrete Skripte, Simulations-Training. Einmalig 49 € — lebenslanger Zugang.',
};

const MODULES = [
  {
    num: '01', icon: '🧠', title: 'Mindset',
    sub: 'Die innere Blockade lösen',
    points: [
      'Warum Angst vor Verhandlungen normal ist',
      'Der Zusammenhang zwischen Selbstwert und Gehalt',
      'Wie du das "Schuld-Gefühl" beim Fordern überwindest',
    ],
  },
  {
    num: '02', icon: '📊', title: 'Marktwert',
    sub: 'Deine Zahlen kennen',
    points: [
      'Wie du deinen fairen Marktwert ermittelst',
      'Welche Quellen wirklich verlässlich sind',
      'Dein persönliches Gehalts-Anker setzen',
    ],
  },
  {
    num: '03', icon: '📋', title: 'Vorbereitung',
    sub: 'Der Fahrplan',
    points: [
      'Den richtigen Zeitpunkt wählen',
      'Deine Argumente strukturieren (3-Punkte-Formel)',
      'Einwände antizipieren und entwaffnen',
    ],
  },
  {
    num: '04', icon: '🎭', title: 'Verhandlung',
    sub: 'Die Taktik im Gespräch',
    points: [
      'Die Eröffnung: Wer nennt zuerst eine Zahl?',
      'Anker-Technik und Gegenargumente meistern',
      'Schweigen als Verhandlungswerkzeug einsetzen',
    ],
  },
  {
    num: '05', icon: '🏆', title: 'Abschluss',
    sub: 'Nach dem Ja',
    points: [
      'Was tun, wenn das Unternehmen ablehnt?',
      'Alternativen: Bonus, Urlaub, Homeoffice verhandeln',
      'Den neuen Standard im nächsten Jahr sichern',
    ],
  },
];

const PROBLEMS = [
  'Du weißt nicht, ob deine Gehaltsvorstellung realistisch ist',
  'Im Gespräch wirst du nervös und verkaufst dich unter Wert',
  'Du bekommst ein "Nein" und weißt nicht, wie du weiter machst',
  'Deine Kollegen verdienen mehr — du traust dich nicht zu fragen',
  'Du schiebst das Gespräch immer wieder auf',
];

export default function GehaltsverhandlungMasterclassPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', fontFamily: "'Instrument Sans', sans-serif" }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <a href="/" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#CC1426', textTransform: 'uppercase', textDecoration: 'none' }}>
          Karriere-Institut
        </a>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/auth/login" style={{ fontSize: 13, color: '#6B6B6B', textDecoration: 'none', fontWeight: 500 }}>Einloggen</a>
          <a href="/angebote/masterclass" style={{
            fontSize: 13, fontWeight: 600, padding: '8px 20px', borderRadius: 999,
            background: '#CC1426', color: 'white', textDecoration: 'none',
          }}>
            Jetzt kaufen
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '72px 24px 56px', maxWidth: 700, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px',
          borderRadius: 999, background: 'rgba(204,20,38,0.06)', border: '1px solid rgba(204,20,38,0.12)',
          fontSize: 12, fontWeight: 600, color: '#CC1426', marginBottom: 24,
        }}>
          💰 E-Learning Kurs
        </div>
        <h1 style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 20, color: '#1A1A1A' }}>
          Gehaltsverhandlung Mastery
        </h1>
        <p style={{ fontSize: 18, color: '#6B6B6B', maxWidth: 520, margin: '0 auto 36px', lineHeight: 1.65 }}>
          Von Angst zu Strategie: Lerne, wie du dein Gehalt systematisch um 7–12 % steigerst —
          mit konkreten Skripten, Simulations-Training und marktbasierter Argumentation.
        </p>

        {/* Stats strip */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 32, fontSize: 13, color: '#6B6B6B', marginBottom: 40 }}>
          {[['5', 'Module'], ['17', 'Lektionen'], ['~55 Min', 'Kursdauer'], ['∞', 'Zugang']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', letterSpacing: '-0.03em' }}>{val}</div>
              <div style={{ fontSize: 12, color: '#9A9A9A', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
          <a href="/angebote/masterclass" style={{
            display: 'inline-flex', alignItems: 'center', gap: 8,
            fontSize: 16, fontWeight: 600, padding: '16px 32px', borderRadius: 14,
            background: '#CC1426', color: 'white', textDecoration: 'none',
            boxShadow: '0 2px 12px rgba(204,20,38,0.25)',
          }}>
            Jetzt für 49 € kaufen →
          </a>
          <a href="#module" style={{
            display: 'inline-flex', alignItems: 'center',
            fontSize: 15, fontWeight: 500, padding: '16px 24px', borderRadius: 14,
            background: 'white', color: '#1A1A1A', textDecoration: 'none',
            border: '1px solid #E8E6E1',
          }}>
            Kurs ansehen
          </a>
        </div>
        <p style={{ fontSize: 12, color: '#9A9A9A', marginTop: 12 }}>
          Einmaliger Kauf · Lebenslanger Zugang · Kurs-Zertifikat inklusive
        </p>
      </section>

      {/* Problem */}
      <section style={{ maxWidth: 760, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ background: 'white', borderRadius: 16, padding: '44px 40px', border: '1px solid #E8E6E1' }}>
          <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 24, textAlign: 'center' }}>
            Kommt dir das bekannt vor?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
            {PROBLEMS.map((text, i) => (
              <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 12, fontSize: 15, color: '#1A1A1A', lineHeight: 1.5 }}>
                <span style={{ color: '#CC1426', fontWeight: 700, fontSize: 16, flexShrink: 0, marginTop: 1 }}>✗</span>
                {text}
              </div>
            ))}
          </div>
          <div style={{ marginTop: 28, padding: '16px 20px', background: 'rgba(204,20,38,0.04)', borderRadius: 12, textAlign: 'center' }}>
            <p style={{ fontSize: 15, fontWeight: 600, color: '#CC1426', margin: 0 }}>
              Der Durchschnitt lässt 5.200 € pro Jahr auf dem Tisch liegen — durch fehlende Vorbereitung.
            </p>
          </div>
        </div>
      </section>

      {/* Module */}
      <section id="module" style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h2 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 10 }}>
            Was du lernst — Modul für Modul
          </h2>
          <p style={{ fontSize: 15, color: '#6B6B6B' }}>5 Module · 17 Lektionen · komplett auf Abruf</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
          {MODULES.map((m) => (
            <div key={m.num} style={{
              background: 'white', borderRadius: 14, padding: '24px 28px',
              border: '1px solid #E8E6E1', display: 'flex', gap: 20, alignItems: 'flex-start',
            }}>
              <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 52 }}>
                <div style={{ fontSize: 28, marginBottom: 4 }}>{m.icon}</div>
                <div style={{ fontSize: 10, fontWeight: 700, color: '#9A9A9A', letterSpacing: '0.08em' }}>MODUL {m.num}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ display: 'flex', alignItems: 'baseline', gap: 10, marginBottom: 6 }}>
                  <h3 style={{ fontSize: 17, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>{m.title}</h3>
                  <span style={{ fontSize: 13, color: '#9A9A9A' }}>{m.sub}</span>
                </div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 5 }}>
                  {m.points.map((p, i) => (
                    <li key={i} style={{ fontSize: 14, color: '#6B6B6B', display: 'flex', gap: 8, alignItems: 'flex-start' }}>
                      <span style={{ color: '#2D6A4F', fontWeight: 700, fontSize: 13, flexShrink: 0, marginTop: 1 }}>✓</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* What you get */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 80px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2E 100%)',
          borderRadius: 20, padding: '48px 40px', color: 'white',
        }}>
          <h2 style={{ fontSize: 24, fontWeight: 700, letterSpacing: '-0.03em', marginBottom: 8 }}>
            Was im Kurs inklusive ist
          </h2>
          <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', marginBottom: 32 }}>Alles was du für dein nächstes Gehaltsgespräch brauchst.</p>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 16 }}>
            {[
              ['🎬', '17 Video-Lektionen', 'Schritt-für-Schritt, jederzeit abrufbar'],
              ['📝', 'Konkrete Gesprächsskripte', 'Wortgenaue Formulierungen für jede Situation'],
              ['🎭', 'Interaktive Simulationen', 'Übe das Gehaltsgespräch ohne echtes Risiko'],
              ['📊', 'Marktwert-Workbook', 'Berechne deinen fairen Lohn mit echten Daten'],
              ['🏆', 'Kurs-Zertifikat', 'Offizielles Zertifikat nach Abschluss'],
              ['∞', 'Lebenslanger Zugang', 'Einmal kaufen, für immer nutzen'],
            ].map(([icon, title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: 14, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 20, flexShrink: 0 }}>{icon}</span>
                <div>
                  <div style={{ fontSize: 14, fontWeight: 600, color: 'white', marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', lineHeight: 1.4 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing CTA */}
      <section style={{ maxWidth: 600, margin: '0 auto', padding: '0 24px 96px', textAlign: 'center' }}>
        <h2 style={{ fontSize: 30, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.15, marginBottom: 12 }}>
          Starte jetzt — einmalig 49 €
        </h2>
        <p style={{ fontSize: 15, color: '#6B6B6B', marginBottom: 8, lineHeight: 1.6 }}>
          Oder hol dir die KI-Mitgliedschaft und erhalte Zugang zu allen Kursen & Seminaren für 15 €/Monat.
        </p>
        <p style={{ fontSize: 13, color: '#CC1426', fontWeight: 600, marginBottom: 32 }}>
          🎪 Messe-Aktionspreis: 49 € statt 99 €
        </p>
        <a href="/angebote/masterclass" style={{
          display: 'inline-flex', alignItems: 'center', gap: 8,
          fontSize: 16, fontWeight: 600, padding: '16px 36px', borderRadius: 14,
          background: '#CC1426', color: 'white', textDecoration: 'none',
          boxShadow: '0 2px 12px rgba(204,20,38,0.25)',
        }}>
          Jetzt für 49 € kaufen →
        </a>
        <p style={{ fontSize: 12, color: '#9A9A9A', marginTop: 12 }}>
          Sicher & verschlüsselt über Stripe
        </p>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E8E6E1', padding: '32px 48px', maxWidth: 1200, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontSize: 12, color: '#9A9A9A' }}>
          © 2026 - Das Karriere-Institut | +49 511 5468 4547 | info@daskarriereinstitut.de
        </div>
        <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
          <a href="/impressum" style={{ color: '#9A9A9A', textDecoration: 'none' }}>Impressum</a>
          <a href="/datenschutz" style={{ color: '#9A9A9A', textDecoration: 'none' }}>Datenschutz</a>
          <a href="/widerruf" style={{ color: '#9A9A9A', textDecoration: 'none' }}>Widerruf</a>
          <a href="/agb" style={{ color: '#9A9A9A', textDecoration: 'none' }}>AGB</a>
        </div>
      </footer>
    </div>
  );
}
