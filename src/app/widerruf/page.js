export default function WiderrufPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px', fontFamily: "'Instrument Sans', sans-serif" }}>
      <a href="/" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase', textDecoration: 'none' }}>Karriere-Institut</a>
      <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.04em', margin: '24px 0 32px' }}>Widerrufsbelehrung</h1>

      <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.8 }}>
        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ki-text)', marginBottom: 12 }}>Widerrufsrecht</h2>
        <p>Sie haben das Recht, binnen vierzehn Tagen ohne Angabe von Gründen diesen Vertrag zu widerrufen.</p>
        <p>Die Widerrufsfrist beträgt vierzehn Tage ab dem Tag des Vertragsabschlusses.</p>
        <p>Um Ihr Widerrufsrecht auszuüben, müssen Sie uns</p>
        <p style={{ padding: '12px 16px', background: 'var(--ki-bg-alt)', borderRadius: 'var(--r-md)', margin: '12px 0' }}>
          Karriere-Institut GmbH (Platzhalter)<br />
          Musterstraße 1, 10115 Berlin<br />
          E-Mail: widerruf@daskarriereinstitut.de<br />
          Telefon: +49 511 5468 4547
        </p>
        <p>mittels einer eindeutigen Erklärung (z.B. ein mit der Post versandter Brief oder E-Mail) über Ihren Entschluss, diesen Vertrag zu widerrufen, informieren.</p>

        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ki-text)', margin: '24px 0 12px' }}>Folgen des Widerrufs</h2>
        <p>Wenn Sie diesen Vertrag widerrufen, haben wir Ihnen alle Zahlungen, die wir von Ihnen erhalten haben, unverzüglich und spätestens binnen vierzehn Tagen ab dem Tag zurückzuzahlen, an dem die Mitteilung über Ihren Widerruf dieses Vertrags bei uns eingegangen ist.</p>

        <h2 style={{ fontSize: 18, fontWeight: 700, color: 'var(--ki-text)', margin: '24px 0 12px' }}>Besondere Hinweise für digitale Inhalte</h2>
        <p>Bei Verträgen zur Lieferung von digitalen Inhalten, die nicht auf einem körperlichen Datenträger geliefert werden, erlischt Ihr Widerrufsrecht vorzeitig, wenn wir mit der Ausführung des Vertrags begonnen haben, nachdem Sie</p>
        <ol style={{ paddingLeft: 20, margin: '12px 0' }}>
          <li>ausdrücklich zugestimmt haben, dass wir mit der Ausführung des Vertrags vor Ablauf der Widerrufsfrist beginnen, und</li>
          <li>Ihre Kenntnis davon bestätigt haben, dass Sie durch Ihre Zustimmung mit Beginn der Ausführung des Vertrags Ihr Widerrufsrecht verlieren.</li>
        </ol>
      </div>

      <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 48 }}>Stand: März 2026</p>
    </div>
  );
}
