export const metadata = {
  title: 'Gehaltsverhandlung Mastery — Karriere-Institut',
  description: 'Der Kurs, der dein Gehalt ändert. 5 Module, konkrete Skripte, Simulations-Training. Einmalig 49 € — lebenslanger Zugang.',
};

const MODULES = [
  {
    num: '01', title: 'Mindset',
    impact: 'Löse die innere Blockade — hör auf, dich für Geld zu schämen',
    points: ['Warum Angst vor Verhandlungen normal ist', 'Selbstwert und Gehalt: der direkte Zusammenhang', 'Das Schuld-Gefühl beim Fordern überwinden'],
  },
  {
    num: '02', title: 'Marktwert',
    impact: 'Weißt endlich, was du wirklich wert bist — mit echten Zahlen',
    points: ['Fairen Marktwert ermitteln — mit verlässlichen Quellen', 'Was deine Region, Branche und Erfahrung wirklich bedeuten', 'Deinen persönlichen Gehalts-Anker richtig setzen'],
  },
  {
    num: '03', title: 'Vorbereitung',
    impact: 'Gehst vorbereitet rein — statt zu improvisieren und zu verlieren',
    points: ['Den richtigen Zeitpunkt wählen', 'Argumente strukturieren mit der 3-Punkte-Formel', 'Einwände antizipieren und entwaffnen'],
  },
  {
    num: '04', title: 'Verhandlung',
    impact: 'Führst das Gespräch — statt es über dich ergehen zu lassen',
    points: ['Eröffnung: Wer nennt zuerst eine Zahl?', 'Anker-Technik und Gegenargumente meistern', 'Schweigen als stärkstes Verhandlungswerkzeug'],
  },
  {
    num: '05', title: 'Abschluss',
    impact: 'Auch ein Nein wird zum Ja — oder zumindest zu mehr',
    points: ['Was tun, wenn das Unternehmen ablehnt?', 'Bonus, Urlaub, Homeoffice als Alternativen', 'Den neuen Standard fürs nächste Jahr sichern'],
  },
];

export default function GehaltsverhandlungMasterclassPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', fontFamily: "'Instrument Sans', sans-serif" }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <a href="/" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#CC1426', textTransform: 'uppercase', textDecoration: 'none' }}>
          Karriere-Institut
        </a>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="/auth/login" style={{ fontSize: 13, color: '#6B6B6B', textDecoration: 'none' }}>Einloggen</a>
          <a href="/angebote/masterclass" style={{ fontSize: 13, fontWeight: 600, padding: '8px 20px', borderRadius: 999, background: '#CC1426', color: 'white', textDecoration: 'none' }}>
            Jetzt kaufen
          </a>
        </div>
      </nav>

      {/* Hero — dunkel */}
      <section style={{
        background: 'linear-gradient(160deg, #1A1A1A 0%, #2C1500 60%, #1A1A1A 100%)',
        padding: '72px 24px 64px',
      }}>
        <div style={{ maxWidth: 800, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px',
            borderRadius: 999, background: 'rgba(204,20,38,0.2)', border: '1px solid rgba(204,20,38,0.35)',
            fontSize: 12, fontWeight: 600, color: '#ff7a7a', marginBottom: 24,
          }}>
            E-Learning Kurs · 5 Module · 17 Lektionen
          </div>

          <h1 style={{ fontSize: 46, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: 'white', marginBottom: 16 }}>
            Mehr Gehalt.<br />
            <span style={{ color: '#CC1426' }}>Nicht durch Glück —</span><br />
            <span style={{ color: 'rgba(255,255,255,0.85)' }}>durch System.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.5)', maxWidth: 480, margin: '0 auto 40px', lineHeight: 1.65 }}>
            Die meisten lassen tausende Euro liegen — weil sie nicht wissen wie. Dieses E-Learning gibt dir Skripte, Taktiken und ein Simulations-Training für dein nächstes Gehaltsgespräch.
          </p>

          {/* Stats */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 0, marginBottom: 36, borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.08)', display: 'inline-flex' }}>
            {[['5', 'Module'], ['17', 'Lektionen'], ['∞', 'Lebenslanger Zugang']].map(([val, label], i) => (
              <div key={label} style={{
                padding: '14px 24px', textAlign: 'center',
                background: i % 2 === 0 ? 'rgba(255,255,255,0.04)' : 'rgba(255,255,255,0.07)',
                borderRight: i < 2 ? '1px solid rgba(255,255,255,0.08)' : 'none',
              }}>
                <div style={{ fontSize: 22, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>{val}</div>
                <div style={{ fontSize: 11, color: 'rgba(255,255,255,0.35)', marginTop: 2 }}>{label}</div>
              </div>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/angebote/masterclass" style={{
              fontSize: 15, fontWeight: 700, padding: '14px 32px', borderRadius: 999,
              background: '#CC1426', color: 'white', textDecoration: 'none',
              boxShadow: '0 4px 20px rgba(204,20,38,0.4)',
            }}>
              Jetzt für 49 € kaufen →
            </a>
            <a href="#module" style={{
              fontSize: 14, fontWeight: 500, padding: '14px 24px', borderRadius: 999,
              background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              Kurs ansehen
            </a>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 14 }}>
            Einmaliger Kauf · Lebenslanger Zugang · Kurs-Zertifikat inklusive
          </p>
        </div>
      </section>

      {/* Problem */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px 0' }}>
        <div style={{ background: 'white', borderRadius: 18, padding: '44px 40px', border: '1px solid #E8E6E1' }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 28, textAlign: 'center' }}>
            Kommt dir das bekannt vor?
          </h2>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
            {[
              'Du weißt nicht, ob deine Gehaltsvorstellung realistisch ist',
              'Im Gespräch wirst du nervös und verkaufst dich unter Wert',
              'Du bekommst ein „Nein" und weißt nicht, wie du weiter machst',
              'Deine Kollegen verdienen mehr — du traust dich nicht zu fragen',
              'Du schiebst das Gespräch immer wieder auf',
            ].map((text, i, arr) => (
              <div key={i} style={{
                display: 'flex', alignItems: 'flex-start', gap: 14,
                padding: '14px 0',
                borderBottom: i < arr.length - 1 ? '1px solid #F0EFE9' : 'none',
              }}>
                <div style={{
                  width: 24, height: 24, borderRadius: '50%', flexShrink: 0, marginTop: 1,
                  background: 'rgba(204,20,38,0.06)', border: '1px solid rgba(204,20,38,0.12)',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  fontSize: 12, color: '#CC1426', fontWeight: 700,
                }}>✕</div>
                <span style={{ fontSize: 15, color: '#1A1A1A', lineHeight: 1.5 }}>{text}</span>
              </div>
            ))}
          </div>
          <div style={{ marginTop: 24, padding: '14px 20px', background: 'rgba(204,20,38,0.04)', borderRadius: 10, border: '1px solid rgba(204,20,38,0.08)', textAlign: 'center' }}>
            <p style={{ fontSize: 14, fontWeight: 700, color: '#CC1426', margin: 0 }}>
              Der Durchschnitt lässt 5.200 € pro Jahr auf dem Tisch liegen — durch fehlende Vorbereitung.
            </p>
          </div>
        </div>
      </section>

      {/* Module */}
      <section id="module" style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px 0' }}>
        <div style={{ marginBottom: 32 }}>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 6 }}>Was du lernst</h2>
          <p style={{ fontSize: 15, color: '#6B6B6B' }}>5 Module · 17 Lektionen · komplett auf Abruf</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
          {MODULES.map((m, i) => (
            <div key={m.num} style={{
              background: 'white',
              borderRadius: i === 0 ? '14px 14px 4px 4px' : i === MODULES.length - 1 ? '4px 4px 14px 14px' : 4,
              padding: '20px 24px',
              border: '1px solid #E8E6E1',
              borderLeft: '3px solid #CC1426',
              display: 'flex', gap: 20, alignItems: 'flex-start',
            }}>
              <div style={{ flexShrink: 0, textAlign: 'center', minWidth: 36 }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#9A9A9A', letterSpacing: '0.06em' }}>MODUL</div>
                <div style={{ fontSize: 22, fontWeight: 800, color: '#CC1426', letterSpacing: '-0.03em', lineHeight: 1 }}>{m.num}</div>
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 3 }}>{m.title}</div>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#CC1426', marginBottom: 8 }}>{m.impact}</div>
                <ul style={{ listStyle: 'none', margin: 0, padding: 0, display: 'flex', flexDirection: 'column', gap: 3 }}>
                  {m.points.map((p) => (
                    <li key={p} style={{ fontSize: 13, color: '#6B6B6B', display: 'flex', gap: 7 }}>
                      <span style={{ color: '#2D6A4F', fontWeight: 700, flexShrink: 0 }}>✓</span>{p}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Was inklusive */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '64px 24px 0' }}>
        <div style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2E 100%)', borderRadius: 18, padding: '40px 36px', color: 'white' }}>
          <h2 style={{ fontSize: 20, fontWeight: 800, letterSpacing: '-0.02em', marginBottom: 6 }}>Im Kurs inklusive</h2>
          <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)', marginBottom: 28 }}>Alles was du für das nächste Gehaltsgespräch brauchst</p>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 14 }}>
            {[
              ['17 Video-Lektionen', 'Auf Abruf, jederzeit verfügbar'],
              ['Wortgenaue Skripte', 'Für jede Situation und jeden Einwand'],
              ['Simulations-Training', 'Übe das Gespräch ohne echtes Risiko'],
              ['Marktwert-Workbook', 'Berechne deinen fairen Lohn'],
              ['Kurs-Zertifikat', 'Offiziell nach Abschluss'],
              ['Lebenslanger Zugang', 'Einmal kaufen, für immer nutzen'],
            ].map(([title, desc]) => (
              <div key={title} style={{ display: 'flex', gap: 10, alignItems: 'flex-start' }}>
                <span style={{ fontSize: 13, color: '#CC1426', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'white', marginBottom: 2 }}>{title}</div>
                  <div style={{ fontSize: 12, color: 'rgba(255,255,255,0.4)', lineHeight: 1.4 }}>{desc}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing */}
      <section style={{ maxWidth: 800, margin: '0 auto', padding: '48px 24px 80px' }}>
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <h2 style={{ fontSize: 24, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>Dein Zugang</h2>
          <p style={{ fontSize: 14, color: '#6B6B6B' }}>Einmalig kaufen oder mit der Premium-Mitgliedschaft</p>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
          {/* Einzelkauf */}
          <div style={{ background: 'white', borderRadius: 16, padding: '28px 24px', border: '1px solid #E8E6E1', display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontSize: 11, fontWeight: 700, color: '#9A9A9A', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Einzelkauf</div>
            <div style={{ display: 'flex', alignItems: 'flex-end', gap: 8, marginBottom: 2 }}>
              <span style={{ fontSize: 36, fontWeight: 800, letterSpacing: '-0.03em', color: '#1A1A1A' }}>49 €</span>
              <span style={{ fontSize: 14, color: '#9A9A9A', textDecoration: 'line-through', paddingBottom: 5 }}>99 €</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 700, color: '#CC1426', marginBottom: 20 }}>Messe-Aktionspreis</div>
            <ul style={{ listStyle: 'none', margin: '0 0 24px', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {['5 Module · 17 Lektionen', 'Skripte & Simulations-Training', 'Marktwert-Workbook', 'Lebenslanger Zugang', 'Kurs-Zertifikat'].map(f => (
                <li key={f} style={{ fontSize: 13, color: '#6B6B6B', display: 'flex', gap: 8 }}>
                  <span style={{ color: '#2D6A4F', fontWeight: 700 }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <a href="/angebote/masterclass" style={{
              display: 'block', textAlign: 'center', fontSize: 14, fontWeight: 600, padding: '12px',
              borderRadius: 10, background: '#F0EFE9', color: '#1A1A1A', textDecoration: 'none',
              border: '1px solid #E8E6E1',
            }}>
              Für 49 € kaufen →
            </a>
          </div>

          {/* Premium */}
          <div style={{ background: '#1A1A1A', borderRadius: 16, padding: '28px 24px', display: 'flex', flexDirection: 'column', position: 'relative' }}>
            <div style={{
              position: 'absolute', top: -11, left: '50%', transform: 'translateX(-50%)',
              background: '#CC1426', color: 'white', fontSize: 11, fontWeight: 700,
              padding: '4px 14px', borderRadius: 999, whiteSpace: 'nowrap',
            }}>Empfohlen</div>
            <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 10 }}>Premium-Mitgliedschaft</div>
            <div style={{ display: 'flex', alignItems: 'baseline', gap: 4, marginBottom: 4 }}>
              <span style={{ fontSize: 36, fontWeight: 800, color: 'white', letterSpacing: '-0.03em' }}>15 €</span>
              <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.4)' }}>/Monat</span>
            </div>
            <div style={{ fontSize: 12, fontWeight: 600, color: '#CC1426', marginBottom: 20 }}>
              + 1 Seminar/Monat (99 €) inklusive
            </div>
            <ul style={{ listStyle: 'none', margin: '0 0 24px', padding: 0, flex: 1, display: 'flex', flexDirection: 'column', gap: 7 }}>
              {[
                'Masterclass inklusive',
                '1x Premium-Seminar pro Monat',
                'Alle weiteren E-Learning Kurse',
                'Karriere-Analyse vollständig',
                '7 Tage kostenlos testen',
              ].map(f => (
                <li key={f} style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', display: 'flex', gap: 8 }}>
                  <span style={{ color: '#CC1426', fontWeight: 700 }}>✓</span>{f}
                </li>
              ))}
            </ul>
            <a href="/angebote/masterclass" style={{
              display: 'block', textAlign: 'center', fontSize: 14, fontWeight: 700, padding: '12px',
              borderRadius: 10, background: '#CC1426', color: 'white', textDecoration: 'none',
            }}>
              7 Tage kostenlos testen →
            </a>
            <p style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', textAlign: 'center', marginTop: 10 }}>Monatlich kündbar</p>
          </div>
        </div>
        <p style={{ fontSize: 12, color: '#9A9A9A', textAlign: 'center', marginTop: 16 }}>
          Sicher & verschlüsselt über Stripe
        </p>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E8E6E1', padding: '28px 48px', maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontSize: 12, color: '#9A9A9A' }}>© 2026 Das Karriere-Institut · +49 511 5468 4547</div>
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
