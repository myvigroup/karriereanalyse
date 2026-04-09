export const metadata = {
  title: 'Online-Seminare — Karriere-Institut',
  description: '13 Online-Seminare zu Karriere, Leadership und Persönlichkeit. Jeden Samstag live via Microsoft Teams. Einzeln buchbar ab 99 € oder mit der Premium-Mitgliedschaft für 15 €/Monat.',
};

const SEMINARE = [
  { icon: '🧠', title: 'Typgerechtes Lernen', sub: 'Finde deinen Weg zum Wissen', impact: 'Lern halb so lang — versteh doppelt so viel. Schluss mit Lernfrust.', next_date: '2026-04-18' },
  { icon: '⚖️', title: 'Work-Life-Balance', sub: 'Gesundheit trifft Leistung', impact: 'Hör auf, Freizeit mit schlechtem Gewissen zu verbringen — und trotzdem leistungsfähig zu bleiben.', next_date: '2026-05-09' },
  { icon: '👑', title: 'Personal Leadership', sub: 'Authentisch führen, wirksam bleiben', impact: 'Führ dich selbst — bevor andere es tun. Setze Ziele, die du wirklich erreichst.', next_date: '2026-06-13' },
  { icon: '📖', title: 'Speedreading', sub: 'Geschwindigkeit trifft Verständnis', impact: 'Lies einen Bericht in 10 Minuten statt 40 — ohne das Wichtige zu verpassen.', next_date: '2026-07-11' },
  { icon: '🧘', title: 'Achtsamkeit', sub: 'Gelassenheit ist trainierbar', impact: 'Nach einem harten Tag wirklich abschalten — statt den Stress mit nach Hause zu nehmen.', next_date: '2026-08-08' },
  { icon: '🎤', title: 'Rhetorik, Dialektik, Kinesik', sub: 'Überzeugen mit Worten und Wirkung', impact: 'Dein Chef nickt statt wegzuschauen, wenn du sprichst. Präsentiere ohne Lampenfieber.', next_date: '2026-09-12' },
  { icon: '🔥', title: 'Selbstmotivation', sub: 'Dein Warum, dein Motor', impact: 'Starte Projekte — und bring sie auch zu Ende. Kein Aufschieben mehr.', next_date: '2026-10-10' },
  { icon: '💬', title: 'Kommunikation', sub: 'Verständigung als Schlüssel zum Erfolg', impact: 'Werde endlich richtig verstanden — von Kollegen, Vorgesetzten und Kunden.', next_date: '2026-11-14' },
  { icon: '🤜', title: 'Konfliktmanagement', sub: 'Aus Krisen Chancen machen', impact: 'Sag, was du denkst — ohne den Kollegen oder den Job zu riskieren.', next_date: '2026-12-12' },
  { icon: '🏠', title: 'Arbeiten aus dem Home Office', sub: 'Effizient arbeiten, flexibel leben', impact: 'Produktiv im Homeoffice — ohne dass Privat- und Arbeitsleben verschwimmen.', next_date: null },
  { icon: '👔', title: 'Business Knigge', sub: 'Der erste Eindruck zählt, der zweite bleibt', impact: 'Betritt jeden Raum mit Sicherheit — ob Vorstellungsgespräch oder Kundentermin.', next_date: null },
  { icon: '🤝', title: 'Networking', sub: 'Kontakte knüpfen, Vertrauen aufbauen', impact: 'Nicht mehr allein auf Veranstaltungen stehen — und echte berufliche Kontakte aufbauen.', next_date: null },
  { icon: '🎯', title: 'Prioritätenmanagement', sub: 'Das Richtige zuerst', impact: 'Mach Feierabend ohne Schuldgefühl — weil du weißt, was heute wirklich zählt.', next_date: null },
];

function formatDate(dateStr) {
  if (!dateStr) return null;
  const d = new Date(dateStr);
  return d.toLocaleDateString('de-DE', { weekday: 'short', day: 'numeric', month: 'long', year: 'numeric' });
}

export default function SeminarePage() {
  const withDate = SEMINARE.filter(s => s.next_date);
  const withoutDate = SEMINARE.filter(s => !s.next_date);

  return (
    <div style={{ minHeight: '100vh', background: '#FAFAF8', fontFamily: "'Instrument Sans', sans-serif" }}>

      {/* Nav */}
      <nav style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '16px 48px', maxWidth: 1200, margin: '0 auto' }}>
        <a href="/" style={{ fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', color: '#CC1426', textTransform: 'uppercase', textDecoration: 'none' }}>
          Karriere-Institut
        </a>
        <div style={{ display: 'flex', gap: 12, alignItems: 'center' }}>
          <a href="/auth/login" style={{ fontSize: 13, color: '#6B6B6B', textDecoration: 'none', fontWeight: 500 }}>Einloggen</a>
          <a href="/angebote" style={{
            fontSize: 13, fontWeight: 600, padding: '8px 20px', borderRadius: 999,
            background: '#CC1426', color: 'white', textDecoration: 'none',
          }}>
            Seminar buchen
          </a>
        </div>
      </nav>

      {/* Hero */}
      <section style={{ textAlign: 'center', padding: '72px 24px 56px', maxWidth: 680, margin: '0 auto' }}>
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 6, padding: '5px 14px',
          borderRadius: 999, background: 'rgba(204,20,38,0.06)', border: '1px solid rgba(204,20,38,0.12)',
          fontSize: 12, fontWeight: 600, color: '#CC1426', marginBottom: 24,
        }}>
          📅 Online via Microsoft Teams
        </div>
        <h1 style={{ fontSize: 42, fontWeight: 800, letterSpacing: '-0.04em', lineHeight: 1.1, marginBottom: 20, color: '#1A1A1A' }}>
          13 Online-Seminare für deine Karriere
        </h1>
        <p style={{ fontSize: 17, color: '#6B6B6B', maxWidth: 500, margin: '0 auto 28px', lineHeight: 1.65 }}>
          Live-Workshops zu Leadership, Kommunikation, Persönlichkeit und mehr —
          jeden Samstag von 09:30 bis 12:00 Uhr.
        </p>

        {/* Value Hook — prominent */}
        <div style={{
          display: 'inline-flex', alignItems: 'center', gap: 0,
          borderRadius: 14, overflow: 'hidden', border: '1px solid #E8E6E1',
          marginBottom: 28, background: 'white',
        }}>
          <div style={{ padding: '14px 20px', background: '#F8F7F4', borderRight: '1px solid #E8E6E1' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9A9A9A', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>Einzelticket</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#1A1A1A', textDecoration: 'line-through', opacity: 0.4 }}>99 €</div>
          </div>
          <div style={{ padding: '14px 20px', background: 'white', borderRight: '1px solid #E8E6E1' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#9A9A9A', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>Mit Premium-Abo</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#CC1426' }}>15 €<span style={{ fontSize: 13, fontWeight: 500, color: '#9A9A9A' }}>/Monat</span></div>
          </div>
          <div style={{ padding: '14px 20px', background: 'rgba(45,106,79,0.05)' }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: '#2D6A4F', textTransform: 'uppercase', letterSpacing: '0.07em', marginBottom: 3 }}>Du sparst</div>
            <div style={{ fontSize: 22, fontWeight: 800, color: '#2D6A4F' }}>84 €</div>
          </div>
        </div>

        {/* Format */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 24, flexWrap: 'wrap', fontSize: 13 }}>
          {[
            ['🗓', 'Samstags 09:30–12:00 Uhr'],
            ['💻', 'Online via Microsoft Teams'],
            ['🎓', 'Teilnahme-Zertifikat'],
            ['📚', 'Arbeitsmaterialien inklusive'],
          ].map(([icon, text]) => (
            <div key={text} style={{ display: 'flex', alignItems: 'center', gap: 6, color: '#6B6B6B' }}>
              <span>{icon}</span>
              <span>{text}</span>
            </div>
          ))}
        </div>
      </section>

      {/* Preisinfo-Band */}
      <div style={{ background: '#1A1A1A', padding: '20px 24px', marginBottom: 64 }}>
        <div style={{ maxWidth: 860, margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 16 }}>
          <div>
            <div style={{ fontSize: 15, fontWeight: 700, color: 'white', marginBottom: 4 }}>
              Seminar einzeln buchen — 99 € pro Termin
            </div>
            <div style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)' }}>
              Oder Premium-Mitgliedschaft: 1x Seminar/Monat + CV-Check + Coaching für 15 €/Monat
            </div>
          </div>
          <div style={{ display: 'flex', gap: 10 }}>
            <a href="/angebote" style={{
              fontSize: 13, fontWeight: 600, padding: '10px 22px', borderRadius: 999,
              background: '#CC1426', color: 'white', textDecoration: 'none',
            }}>
              Seminar buchen →
            </a>
            <a href="/angebote" style={{
              fontSize: 13, fontWeight: 500, padding: '10px 22px', borderRadius: 999,
              background: 'rgba(255,255,255,0.08)', color: 'white', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.15)',
            }}>
              Premium-Mitgliedschaft
            </a>
          </div>
        </div>
      </div>

      {/* Terminierte Seminare */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 64px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
          Nächste Termine
        </h2>
        <p style={{ fontSize: 13, color: '#9A9A9A', marginBottom: 28 }}>
          {withDate.length} Seminare mit festen Terminen — jetzt Platz sichern
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
          {withDate.map((s) => (
            <div key={s.title} style={{
              background: 'white', borderRadius: 14, padding: '20px 24px',
              border: '1px solid #E8E6E1',
              display: 'flex', alignItems: 'flex-start', gap: 16, flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: 26, flexShrink: 0, marginTop: 2 }}>{s.icon}</span>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#CC1426', fontWeight: 600, marginBottom: 6 }}>{s.impact}</div>
                <div style={{ fontSize: 12, color: '#9A9A9A' }}>{s.sub}</div>
              </div>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 6, flexShrink: 0 }}>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A' }}>{formatDate(s.next_date)}</div>
                  <div style={{ fontSize: 12, color: '#9A9A9A' }}>09:30–12:00 Uhr</div>
                </div>
                <a href="/angebote" style={{
                  fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 999,
                  background: '#CC1426', color: 'white', textDecoration: 'none',
                  whiteSpace: 'nowrap',
                }}>
                  Buchen · 99 €
                </a>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Seminare ohne Termin */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 80px' }}>
        <h2 style={{ fontSize: 20, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 6 }}>
          Weitere Seminare
        </h2>
        <p style={{ fontSize: 13, color: '#9A9A9A', marginBottom: 28 }}>
          Termine werden in Kürze bekanntgegeben — mit der Premium-Mitgliedschaft automatisch inklusive
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {withoutDate.map((s) => (
            <div key={s.title} style={{
              background: 'white', borderRadius: 14, padding: '20px 24px',
              border: '1px solid #E8E6E1', display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 4 }}>{s.title}</div>
                <div style={{ fontSize: 12, color: '#CC1426', fontWeight: 600, marginBottom: 6, lineHeight: 1.4 }}>{s.impact}</div>
                <div style={{ fontSize: 12, color: '#9A9A9A', marginBottom: 8 }}>{s.sub}</div>
                <span style={{
                  fontSize: 11, fontWeight: 600, padding: '3px 10px', borderRadius: 999,
                  background: '#F0EFE9', color: '#9A9A9A',
                }}>
                  Datum folgt
                </span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Mitgliedschaft CTA */}
      <section style={{ maxWidth: 860, margin: '0 auto', padding: '0 24px 96px' }}>
        <div style={{
          background: 'linear-gradient(135deg, #1A1A1A 0%, #2C2C2E 100%)',
          borderRadius: 20, padding: '48px 40px', color: 'white',
        }}>
          {/* Haupt-Hook */}
          <div style={{ display: 'flex', alignItems: 'flex-start', gap: 40, flexWrap: 'wrap', marginBottom: 36 }}>
            <div style={{ flex: 1, minWidth: 260 }}>
              <div style={{ fontSize: 12, fontWeight: 700, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(255,255,255,0.45)', marginBottom: 12 }}>
                Premium-Mitgliedschaft
              </div>
              <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 12, lineHeight: 1.15 }}>
                1 Seminar pro Monat.<br />
                <span style={{ color: '#CC1426' }}>Für 15 €.</span>
              </h2>
              <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.55)', lineHeight: 1.6, marginBottom: 0 }}>
                Ein Seminar-Platz kostet einzeln 99 €. Mit der Premium-Mitgliedschaft
                ist er jeden Monat inklusive — plus alle E-Learnings obendrauf.
              </p>
            </div>

            {/* Value-Rechnung */}
            <div style={{
              background: 'rgba(204,20,38,0.12)', border: '1px solid rgba(204,20,38,0.25)',
              borderRadius: 14, padding: '20px 24px', minWidth: 220, flexShrink: 0,
            }}>
              <div style={{ fontSize: 11, fontWeight: 700, color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: 12 }}>
                Dein monatlicher Wert
              </div>
              {[
                ['1x Seminar', '99 €'],
                ['E-Learning Kurse', '49 €'],
                ['Karriere-Analyse', 'inkl.'],
              ].map(([label, val]) => (
                <div key={label} style={{ display: 'flex', justifyContent: 'space-between', gap: 16, fontSize: 13, marginBottom: 8 }}>
                  <span style={{ color: 'rgba(255,255,255,0.65)' }}>{label}</span>
                  <span style={{ fontWeight: 700, color: val === 'inkl.' ? 'rgba(255,255,255,0.35)' : 'white' }}>{val}</span>
                </div>
              ))}
              <div style={{ borderTop: '1px solid rgba(255,255,255,0.1)', marginTop: 8, paddingTop: 10, display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: 'rgba(255,255,255,0.5)', textDecoration: 'line-through' }}>148 €/Monat</span>
                <span style={{ fontSize: 18, fontWeight: 800, color: '#CC1426' }}>15 €/Monat</span>
              </div>
            </div>
          </div>

          <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
            <a href="/angebote" style={{
              fontSize: 14, fontWeight: 700, padding: '14px 28px', borderRadius: 999,
              background: '#CC1426', color: 'white', textDecoration: 'none',
            }}>
              7 Tage kostenlos testen →
            </a>
            <a href="/angebote" style={{
              fontSize: 13, fontWeight: 500, padding: '14px 22px', borderRadius: 999,
              background: 'rgba(255,255,255,0.07)', color: 'rgba(255,255,255,0.75)', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.12)',
            }}>
              Seminar einzeln · 99 €
            </a>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.3)', marginTop: 14 }}>
            Monatlich kündbar · Kein Risiko
          </p>
        </div>
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
