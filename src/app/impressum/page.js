export default function ImpressumPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px', fontFamily: "'Instrument Sans', sans-serif" }}>
      <a href="/" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase', textDecoration: 'none' }}>Karriere-Institut</a>
      <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.04em', margin: '24px 0 32px' }}>Impressum</h1>

      <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.8 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ki-text)', marginBottom: 12 }}>Angaben gem\u00E4\u00DF \u00A7 5 TMG</h2>
        <p>
          Karriere-Institut GmbH (Platzhalter)<br />
          Musterstra\u00DFe 1<br />
          10115 Berlin
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ki-text)', margin: '24px 0 12px' }}>Kontakt</h2>
        <p>
          Telefon: +49 (0) 30 123456-0<br />
          E-Mail: info@karriere-institut.de
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ki-text)', margin: '24px 0 12px' }}>Vertreten durch</h2>
        <p>[Gesch\u00E4ftsf\u00FChrer Name]</p>

        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ki-text)', margin: '24px 0 12px' }}>Registereintrag</h2>
        <p>
          Registergericht: Amtsgericht Berlin-Charlottenburg<br />
          Registernummer: HRB XXXXXX
        </p>

        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ki-text)', margin: '24px 0 12px' }}>Umsatzsteuer-ID</h2>
        <p>USt-IdNr.: DE XXXXXXXXX</p>

        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ki-text)', margin: '24px 0 12px' }}>Streitschlichtung</h2>
        <p>Die Europ\u00E4ische Kommission stellt eine Plattform zur Online-Streitbeilegung (OS) bereit. Wir sind nicht bereit oder verpflichtet, an Streitbeilegungsverfahren vor einer Verbraucherschlichtungsstelle teilzunehmen.</p>
      </div>

      <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 48 }}>Stand: M\u00E4rz 2026</p>
    </div>
  );
}
