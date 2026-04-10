export const metadata = {
  title: 'Online-Seminare — Karriere-Institut',
  description: '13 Online-Seminare zu Karriere, Leadership und Persönlichkeit. Jeden Samstag live via Microsoft Teams. Einzeln buchbar ab 99 € oder mit der Premium-Mitgliedschaft.',
};

const SEMINARE = [
  { icon: '🧠', title: 'Typgerechtes Lernen', impact: 'Lern halb so lang — versteh doppelt so viel', next_date: '2026-04-18' },
  { icon: '⚖️', title: 'Work-Life-Balance', impact: 'Hör auf, Freizeit mit schlechtem Gewissen zu verbringen', next_date: '2026-05-09' },
  { icon: '👑', title: 'Personal Leadership', impact: 'Führ dich selbst — bevor andere es tun', next_date: '2026-06-13' },
  { icon: '📖', title: 'Speedreading', impact: 'Lies einen Bericht in 10 Minuten statt 40', next_date: '2026-07-11' },
  { icon: '🧘', title: 'Achtsamkeit', impact: 'Nach einem harten Tag wirklich abschalten', next_date: '2026-08-08' },
  { icon: '🎤', title: 'Rhetorik & Überzeugen', impact: 'Dein Chef nickt statt wegzuschauen, wenn du sprichst', next_date: '2026-09-12' },
  { icon: '🔥', title: 'Selbstmotivation', impact: 'Starte Projekte — und bring sie auch zu Ende', next_date: '2026-10-10' },
  { icon: '💬', title: 'Kommunikation', impact: 'Werde endlich richtig verstanden — von allen', next_date: '2026-11-14' },
  { icon: '🤜', title: 'Konfliktmanagement', impact: 'Sag, was du denkst — ohne den Job zu riskieren', next_date: '2026-12-12' },
  { icon: '🏠', title: 'Home Office', impact: 'Produktiv zuhause — ohne dass alles verschwimmt', next_date: null },
  { icon: '👔', title: 'Business Knigge', impact: 'Betritt jeden Raum mit Sicherheit', next_date: null },
  { icon: '🤝', title: 'Networking', impact: 'Nie mehr allein auf Veranstaltungen stehen', next_date: null },
  { icon: '🎯', title: 'Prioritätenmanagement', impact: 'Mach Feierabend ohne Schuldgefühl', next_date: null },
];

const MONTH_NAMES = ['Januar','Februar','März','April','Mai','Juni','Juli','August','September','Oktober','November','Dezember'];

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return {
    day: d.getDate(),
    month: MONTH_NAMES[d.getMonth()],
    year: d.getFullYear(),
    weekday: d.toLocaleDateString('de-DE', { weekday: 'long' }),
  };
}

export default function SeminarePage() {
  const withDate = SEMINARE.filter(s => s.next_date);
  const withoutDate = SEMINARE.filter(s => !s.next_date);

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', fontFamily: "'Instrument Sans', sans-serif" }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', maxWidth: 1100, margin: '0 auto' }}>
        <a href="/" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#CC1426', textTransform: 'uppercase', textDecoration: 'none' }}>
          Karriere-Institut
        </a>
        <div style={{ display: 'flex', gap: 10, alignItems: 'center' }}>
          <a href="/auth/login" style={{ fontSize: 13, color: '#6B6B6B', textDecoration: 'none' }}>Einloggen</a>
          <a href="/angebote" style={{ fontSize: 13, fontWeight: 600, padding: '8px 20px', borderRadius: 999, background: '#CC1426', color: 'white', textDecoration: 'none' }}>
            Seminar buchen
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(160deg, #1A1A1A 0%, #2C1810 60%, #1A1A1A 100%)',
        padding: '72px 24px 64px',
        marginBottom: 0,
      }}>
        <div style={{ maxWidth: 860, margin: '0 auto', textAlign: 'center' }}>
          <div style={{
            display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px',
            borderRadius: 999, background: 'rgba(204,20,38,0.2)', border: '1px solid rgba(204,20,38,0.35)',
            fontSize: 12, fontWeight: 600, color: '#ff7a7a', marginBottom: 24,
          }}>
            📅 Live via Microsoft Teams · Samstags 09:30–12:00 Uhr
          </div>
          <h1 style={{ fontSize: 44, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, color: 'white', marginBottom: 16 }}>
            13 Seminare, die dich im<br />
            <span style={{ color: '#CC1426' }}>Job-Alltag wirklich weiterbringen.</span>
          </h1>
          <p style={{ fontSize: 17, color: 'rgba(255,255,255,0.55)', maxWidth: 500, margin: '0 auto 40px', lineHeight: 1.65 }}>
            Kein Theorie-Overload. Jedes Seminar gibt dir konkrete Werkzeuge
            für den nächsten Arbeitstag.
          </p>

          {/* Preis-Vergleich */}
          <div style={{ display: 'inline-flex', borderRadius: 14, overflow: 'hidden', border: '1px solid rgba(255,255,255,0.1)' }}>
            <div style={{ padding: '16px 24px', background: 'rgba(255,255,255,0.05)', borderRight: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.35)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Einzelticket</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: 'rgba(255,255,255,0.3)', textDecoration: 'line-through' }}>99 €</div>
            </div>
            <div style={{ padding: '16px 24px', background: 'rgba(204,20,38,0.15)', borderRight: '1px solid rgba(255,255,255,0.1)', textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Mit Premium-Abo</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#CC1426' }}>15 €<span style={{ fontSize: 13, fontWeight: 500, color: 'rgba(255,255,255,0.4)' }}>/Monat</span></div>
            </div>
            <div style={{ padding: '16px 24px', background: 'rgba(45,106,79,0.2)', textAlign: 'center' }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.5)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 6 }}>Du sparst</div>
              <div style={{ fontSize: 24, fontWeight: 800, color: '#5cb88a' }}>84 €</div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', marginTop: 28, flexWrap: 'wrap' }}>
            <a href="/angebote" style={{ fontSize: 14, fontWeight: 700, padding: '13px 28px', borderRadius: 999, background: '#CC1426', color: 'white', textDecoration: 'none' }}>
              7 Tage kostenlos testen →
            </a>
            <a href="/angebote" style={{ fontSize: 13, fontWeight: 500, padding: '13px 22px', borderRadius: 999, background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.75)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)' }}>
              Seminar einzeln · 99 €
            </a>
          </div>
        </div>
      </section>

      {/* Format Strip */}
      <div style={{ background: 'white', borderBottom: '1px solid #E8E6E1' }}>
        <div style={{ maxWidth: 860, margin: '0 auto', padding: '20px 24px', display: 'flex', justifyContent: 'center', gap: 40, flexWrap: 'wrap' }}>
          {[
            ['🎥', 'Live', 'Interaktiv, nicht nur Zuschauen'],
            ['🗓', 'Samstags', '09:30 – 12:00 Uhr'],
            ['💻', 'Microsoft Teams', 'Von überall teilnehmen'],
            ['🎓', 'Zertifikat', 'Nach erfolgreicher Teilnahme'],
          ].map(([icon, label, sub]) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <span style={{ fontSize: 20 }}>{icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{label}</div>
                <div style={{ fontSize: 12, color: '#9A9A9A' }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Terminierte Seminare */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '56px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 24 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Nächste Termine</h2>
          <span style={{ fontSize: 13, color: '#9A9A9A' }}>{withDate.length} Seminare · Platz jetzt sichern</span>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
          {withDate.map((s, i) => {
            const d = formatDate(s.next_date);
            return (
              <div key={s.title} style={{
                background: 'white',
                borderRadius: i === 0 ? '14px 14px 4px 4px' : i === withDate.length - 1 ? '4px 4px 14px 14px' : 4,
                padding: '18px 22px',
                border: '1px solid #E8E6E1',
                display: 'flex', alignItems: 'center', gap: 18,
                borderLeft: '3px solid #CC1426',
              }}>
                <span style={{ fontSize: 24, flexShrink: 0 }}>{s.icon}</span>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 3 }}>{s.title}</div>
                  <div style={{ fontSize: 13, color: '#CC1426', fontWeight: 500 }}>{s.impact}</div>
                </div>
                <div style={{ textAlign: 'right', flexShrink: 0, minWidth: 140 }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A' }}>{d.weekday}, {d.day}. {d.month}</div>
                  <div style={{ fontSize: 12, color: '#9A9A9A', marginBottom: 8 }}>09:30 – 12:00 Uhr</div>
                  <a href="/angebote" style={{
                    fontSize: 12, fontWeight: 700, padding: '6px 16px', borderRadius: 999,
                    background: '#CC1426', color: 'white', textDecoration: 'none', whiteSpace: 'nowrap',
                  }}>
                    Buchen · 99 €
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* Weitere Seminare */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '48px 24px 0' }}>
        <div style={{ display: 'flex', alignItems: 'baseline', gap: 12, marginBottom: 20 }}>
          <h2 style={{ fontSize: 22, fontWeight: 800, letterSpacing: '-0.03em', margin: 0 }}>Weitere Seminare</h2>
          <span style={{ fontSize: 13, color: '#9A9A9A' }}>Termine folgen — mit Mitgliedschaft automatisch dabei</span>
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 10 }}>
          {withoutDate.map((s) => (
            <div key={s.title} style={{
              background: 'white', borderRadius: 12, padding: '16px 18px',
              border: '1px solid #E8E6E1',
              display: 'flex', gap: 14, alignItems: 'flex-start',
              borderLeft: '3px solid #E8E6E1',
            }}>
              <span style={{ fontSize: 20, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#6B6B6B', lineHeight: 1.4, marginBottom: 8 }}>{s.impact}</div>
                <span style={{ fontSize: 11, fontWeight: 600, padding: '3px 9px', borderRadius: 999, background: '#F0EFE9', color: '#9A9A9A' }}>Datum folgt</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA Block */}
      <section style={{ maxWidth: 860, margin: '56px auto 80px', padding: '0 24px' }}>
        <div style={{ background: 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2E 100%)', borderRadius: 20, padding: '44px 40px', color: 'white' }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap', marginBottom: 32 }}>
            <div style={{ flex: 1, minWidth: 240 }}>
              <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.4)', marginBottom: 10 }}>
                Premium-Mitgliedschaft
              </div>
              <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 10, lineHeight: 1.15 }}>
                1 Seminar pro Monat.<br />
                <span style={{ color: '#CC1426' }}>Für 15 €.</span>
              </h2>
              <p style={{ fontSize: 14, color: 'rgba(255,255,255,0.5)', lineHeight: 1.6, marginBottom: 0 }}>
                Ein Seminar-Platz kostet einzeln 99 €. Mit der Premium-Mitgliedschaft
                ist er jeden Monat inklusive — plus alle E-Learnings obendrauf.
              </p>
            </div>
            <div style={{
              background: 'rgba(204,20,38,0.12)', border: '1px solid rgba(204,20,38,0.25)',
              borderRadius: 14, padding: '18px 22px', minWidth: 200, flexShrink: 0,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>Dein monatlicher Wert</div>
              {[['1x Seminar', '99 €'], ['E-Learning Kurse', '49 €'], ['Karriere-Analyse', 'inkl.']].map(([l, v]) => (
                <div key={l} style={{ display: 'flex', justifyContent: 'space-between', gap: 12, fontSize: 13, marginBottom: 7 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{l}</span>
                  <span style={{ fontWeight: 700, color: v === 'inkl.' ? 'rgba(255,255,255,0.3)' : 'white' }}>{v}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 8, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.35)', textDecoration: 'line-through' }}>148 €/Monat</span>
                <span style={{ fontSize: 20, fontWeight: 800, color: '#CC1426' }}>15 €/Mo</span>
              </div>
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/angebote" style={{ fontSize: 14, fontWeight: 700, padding: '13px 28px', borderRadius: 999, background: '#CC1426', color: 'white', textDecoration: 'none' }}>
              7 Tage kostenlos testen →
            </a>
            <a href="/angebote" style={{ fontSize: 13, fontWeight: 500, padding: '13px 22px', borderRadius: 999, background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.7)', textDecoration: 'none', border: '1px solid rgba(255,255,255,0.12)' }}>
              Seminar einzeln · 99 €
            </a>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', marginTop: 14 }}>Monatlich kündbar · Kein Risiko</p>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ borderTop: '1px solid #E8E6E1', padding: '28px 48px', maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 16 }}>
        <div style={{ fontSize: 12, color: '#9A9A9A' }}>© 2026 Das Karriere-Institut · +49 511 5468 4547</div>
        <div style={{ display: 'flex', gap: 20, fontSize: 13 }}>
          <a href="/impressum" style={{ color: '#9A9A9A', textDecoration: 'none' }}>Impressum</a>
          <a href="/datenschutz" style={{ color: '#9A9A9A', textDecoration: 'none' }}>Datenschutz</a>
          <a href="/agb" style={{ color: '#9A9A9A', textDecoration: 'none' }}>AGB</a>
        </div>
      </footer>
    </div>
  );
}
