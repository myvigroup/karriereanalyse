export const metadata = {
  title: 'Online-Seminare — Karriere-Institut',
  description: '13 Online-Seminare zu Karriere, Leadership und Persönlichkeit. Jeden Samstag live via Microsoft Teams. Einzeln buchbar ab 99 € oder mit der KI-Mitgliedschaft.',
};

const SEMINARE = [
  { icon: '🧠', title: 'Typgerechtes Lernen', sub: 'Finde deinen Weg zum Wissen', next_date: '2026-04-18' },
  { icon: '⚖️', title: 'Work-Life-Balance', sub: 'Gesundheit trifft Leistung', next_date: '2026-05-09' },
  { icon: '👑', title: 'Personal Leadership', sub: 'Authentisch führen, wirksam bleiben', next_date: '2026-06-13' },
  { icon: '📖', title: 'Speedreading', sub: 'Geschwindigkeit trifft Verständnis', next_date: '2026-07-11' },
  { icon: '🧘', title: 'Achtsamkeit', sub: 'Gelassenheit ist trainierbar', next_date: '2026-08-08' },
  { icon: '🎤', title: 'Rhetorik, Dialektik, Kinesik', sub: 'Überzeugen mit Worten und Wirkung', next_date: '2026-09-12' },
  { icon: '🔥', title: 'Selbstmotivation', sub: 'Dein Warum, dein Motor', next_date: '2026-10-10' },
  { icon: '💬', title: 'Kommunikation', sub: 'Verständigung als Schlüssel zum Erfolg', next_date: '2026-11-14' },
  { icon: '🤜', title: 'Konfliktmanagement', sub: 'Aus Krisen Chancen machen', next_date: '2026-12-12' },
  { icon: '🏠', title: 'Arbeiten aus dem Home Office', sub: 'Effizient arbeiten, flexibel leben', next_date: null },
  { icon: '👔', title: 'Business Knigge', sub: 'Der erste Eindruck zählt, der zweite bleibt', next_date: null },
  { icon: '🤝', title: 'Networking', sub: 'Kontakte knüpfen, Vertrauen aufbauen', next_date: null },
  { icon: '🎯', title: 'Prioritätenmanagement', sub: 'Das Richtige zuerst', next_date: null },
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
        <p style={{ fontSize: 17, color: '#6B6B6B', maxWidth: 500, margin: '0 auto 32px', lineHeight: 1.65 }}>
          Live-Workshops zu Leadership, Kommunikation, Persönlichkeit und mehr —
          jeden Samstag von 09:30 bis 12:00 Uhr.
        </p>

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
              Oder mit der KI-Mitgliedschaft: alle Seminare + Masterclasses für 15 €/Monat
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
              KI-Mitgliedschaft
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
              display: 'flex', alignItems: 'center', gap: 16, flexWrap: 'wrap',
            }}>
              <span style={{ fontSize: 26, flexShrink: 0 }}>{s.icon}</span>
              <div style={{ flex: 1, minWidth: 200 }}>
                <div style={{ fontSize: 15, fontWeight: 700, color: '#1A1A1A', marginBottom: 2 }}>{s.title}</div>
                <div style={{ fontSize: 13, color: '#9A9A9A' }}>{s.sub}</div>
              </div>
              <div style={{ textAlign: 'right', flexShrink: 0 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: '#1A1A1A', marginBottom: 2 }}>
                  {formatDate(s.next_date)}
                </div>
                <div style={{ fontSize: 12, color: '#9A9A9A' }}>09:30–12:00 Uhr</div>
              </div>
              <a href="/angebote" style={{
                fontSize: 13, fontWeight: 600, padding: '8px 18px', borderRadius: 999, flexShrink: 0,
                background: '#CC1426', color: 'white', textDecoration: 'none',
                whiteSpace: 'nowrap',
              }}>
                Buchen · 99 €
              </a>
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
          Termine werden in Kürze bekanntgegeben — mit der KI-Mitgliedschaft automatisch inklusive
        </p>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {withoutDate.map((s) => (
            <div key={s.title} style={{
              background: 'white', borderRadius: 14, padding: '20px 24px',
              border: '1px solid #E8E6E1', display: 'flex', gap: 14, alignItems: 'flex-start',
            }}>
              <span style={{ fontSize: 22, flexShrink: 0, marginTop: 1 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#1A1A1A', marginBottom: 2 }}>{s.title}</div>
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
          background: 'linear-gradient(135deg, #CC1426 0%, #a01020 100%)',
          borderRadius: 20, padding: '48px 40px', color: 'white', textAlign: 'center',
        }}>
          <div style={{ fontSize: 36, marginBottom: 16 }}>⭐</div>
          <h2 style={{ fontSize: 26, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 10 }}>
            Alle 13 Seminare für 15 €/Monat
          </h2>
          <p style={{ fontSize: 15, color: 'rgba(255,255,255,0.7)', maxWidth: 460, margin: '0 auto 28px', lineHeight: 1.6 }}>
            Mit der KI-Mitgliedschaft erhältst du unbegrenzten Zugang zu allen Seminaren, Masterclasses und E-Learning-Kursen.
          </p>
          <div style={{ display: 'flex', gap: 10, justifyContent: 'center', flexWrap: 'wrap' }}>
            <a href="/angebote" style={{
              fontSize: 15, fontWeight: 600, padding: '14px 32px', borderRadius: 999,
              background: 'white', color: '#CC1426', textDecoration: 'none',
            }}>
              KI-Mitgliedschaft starten →
            </a>
            <a href="/angebote" style={{
              fontSize: 14, fontWeight: 500, padding: '14px 24px', borderRadius: 999,
              background: 'rgba(255,255,255,0.12)', color: 'white', textDecoration: 'none',
              border: '1px solid rgba(255,255,255,0.2)',
            }}>
              Seminar einzeln buchen
            </a>
          </div>
          <p style={{ fontSize: 12, color: 'rgba(255,255,255,0.45)', marginTop: 14 }}>7 Tage kostenlos testen · Monatlich kündbar</p>
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
