export default function WiderrufPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px', fontFamily: "'Instrument Sans', sans-serif" }}>
      <a href="/" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase', textDecoration: 'none' }}>Karriere-Institut</a>
      <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.04em', margin: '24px 0 32px' }}>Widerrufsbelehrung</h1>

      <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.8 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ki-text)', marginBottom: 12 }}>Widerrufsrecht</h2>
        <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gr\u00FCnden diesen Vertrag zu widerrufen.</p>
        <p>Die Widerrufsfrist betr\u00E4gt vierzehn Tage ab dem Tag des Vertragsabschlusses.</p>
        <p>Um Ihr Widerrufsrecht auszu\u00FCben, m\u00FCssen Sie uns</p>
        <p style={{ padding: '12px 16px', background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)', margin: '12px 0' }}>
          Karriere-Institut GmbH (Platzhalter)<br />
          Musterstra\u00DFe 1, 10115 Berlin<br />
          E-Mail: widerruf@daskarriereinstitut.de<br />
          Telefon: +49 511 5468 4547
        </p>
        <p>mittels einer eindeutigen Erkl\u00E4rung (z.B. ein mit der Post versandter Brief oder E-Mail) \u00FCber Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.</p>

        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ki-text)', margin: '24px 0 12px' }}>Folgen des Widerrufs</h2>
        <p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverz\u00FCglich und sp\u00E4testens binnen vierzehn Tagen ab dem Tag zur\u00FCckzuzahlen, an dem die Mitteilung \u00FCber Ihren Widerruf dieses Vertrags bei uns eingegangen ist.</p>

        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ki-text)', margin: '24px 0 12px' }}>Besondere Hinweise f\u00FCr digitale Inhalte</h2>
        <p>Bei Vertr\u00E4gen zur Lieferung von digitalen Inhalten, die nicht auf einem k\u00F6rperlichen Datentr\u00E4ger geliefert werden, erlischt Ihr Widerrufsrecht vorzeitig, wenn wir mit der Ausf\u00FChrung des Vertrags begonnen haben, nachdem Sie</p>
        <ol style={{ paddingLeft: 20, margin: '12px 0' }}>
          <li>ausdr\u00FCcklich zugestimmt haben, dass wir mit der Ausf\u00FChrung des Vertrags vor Ablauf der Widerrufsfrist beginnen, und</li>
          <li>Ihre Kenntnis davon best\u00E4tigt haben, dass Sie durch Ihre Zustimmung mit Beginn der Ausf\u00FChrung des Vertrags Ihr Widerrufsrecht verlieren.</li>
        </ol>
      </div>

      <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 48 }}>Stand: M\u00E4rz 2026</p>
    </div>
  );
}
