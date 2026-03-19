export default function AGBPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px', fontFamily: "'Instrument Sans', sans-serif" }}>
      <a href="/" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase', textDecoration: 'none' }}>Karriere-Institut</a>
      <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.04em', margin: '24px 0 32px' }}>Allgemeine Gesch\u00E4ftsbedingungen</h1>

      <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.8 }}>
        <Section t="1. Geltungsbereich">
          Diese AGB gelten f\u00FCr alle Vertr\u00E4ge zwischen der Karriere-Institut GmbH und Nutzern der Plattform karriere-institut.de.
        </Section>
        <Section t="2. Vertragsgegenstand">
          Gegenstand des Vertrags ist die Bereitstellung digitaler Karriere-Coaching-Dienstleistungen, einschlie\u00DFlich Online-Kursen, KI-gest\u00FCtzter Analyse, Coaching-Sessions und Community-Funktionen.
        </Section>
        <Section t="3. Registrierung">
          Die Nutzung der Plattform erfordert eine Registrierung. Der Nutzer ist verpflichtet, wahrheitsgem\u00E4\u00DFe Angaben zu machen und seine Zugangsdaten vertraulich zu behandeln.
        </Section>
        <Section t="4. Preise und Zahlung">
          Alle Preise verstehen sich inklusive der gesetzlichen Mehrwertsteuer (19%). Die Zahlung erfolgt \u00FCber den Zahlungsdienstleister Stripe.
        </Section>
        <Section t="5. Widerrufsrecht">
          Es gilt die gesonderte Widerrufsbelehrung unter <a href="/widerruf" style={{ color: 'var(--ki-red)' }}>/widerruf</a>.
        </Section>
        <Section t="6. K\u00FCndigung">
          Abonnements k\u00F6nnen jederzeit zum Ende der laufenden Abrechnungsperiode gek\u00FCndigt werden. Der Zugang bleibt bis zum Ende der bezahlten Periode bestehen.
        </Section>
        <Section t="7. Haftung">
          Die Karriere-Institut GmbH haftet nicht f\u00FCr die Richtigkeit der KI-generierten Inhalte. Diese stellen keine Rechts- oder Finanzberatung dar.
        </Section>
        <Section t="8. Datenschutz">
          Es gilt die <a href="/datenschutz" style={{ color: 'var(--ki-red)' }}>Datenschutzerkl\u00E4rung</a>.
        </Section>
        <Section t="9. Schlussbestimmungen">
          Es gilt das Recht der Bundesrepublik Deutschland. Gerichtsstand ist Berlin, sofern gesetzlich zul\u00E4ssig.
        </Section>
      </div>

      <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 48 }}>Stand: M\u00E4rz 2026</p>
    </div>
  );
}

function Section({ t, children }) {
  return (
    <section style={{ marginBottom: 24 }}>
      <h2 style={{ fontSize: 16, fontWeight: 700, color: 'var(--ki-text)', marginBottom: 8 }}>{t}</h2>
      <p>{children}</p>
    </section>
  );
}
