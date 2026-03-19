export default function DatenschutzPage() {
  return (
    <div style={{ maxWidth: 720, margin: '0 auto', padding: '48px 24px', fontFamily: "'Instrument Sans', sans-serif" }}>
      <a href="/" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase', textDecoration: 'none' }}>Karriere-Institut</a>
      <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.04em', margin: '24px 0 32px' }}>Datenschutzerkl\u00E4rung</h1>

      <Section title="1. Verantwortlicher">
        <p>Karriere-Institut GmbH (Platzhalter)<br />Musterstra\u00DFe 1, 10115 Berlin<br />E-Mail: datenschutz@karriere-institut.de</p>
      </Section>

      <Section title="2. Welche Daten wir erheben">
        <ul>
          <li><strong>Profildaten:</strong> Name, E-Mail, Branche, Gehalt, Berufserfahrung, Karriereziele</li>
          <li><strong>Analysedaten:</strong> Antworten der Karriereanalyse, Kompetenzscores</li>
          <li><strong>Coaching-Daten:</strong> Chat-Nachrichten mit dem KI-Coach</li>
          <li><strong>Bewerbungsdaten:</strong> Firmen, Positionen, Status</li>
          <li><strong>Nutzungsdaten:</strong> Login-Zeitpunkte, Modul-Nutzung, Fortschritt</li>
          <li><strong>Dokumente:</strong> Hochgeladene CVs, Zeugnisse, Zertifikate</li>
        </ul>
      </Section>

      <Section title="3. Zweck der Verarbeitung">
        <p>Wir verarbeiten Ihre Daten ausschlie\u00DFlich zur Bereitstellung der Karriere-Coaching-Plattform, zur Personalisierung von Empfehlungen und zur Verbesserung unseres Angebots.</p>
      </Section>

      <Section title="4. Rechtsgrundlage">
        <p>Die Verarbeitung erfolgt auf Grundlage Ihrer Einwilligung (Art. 6 Abs. 1 lit. a DSGVO) sowie zur Vertragserf\u00FCllung (Art. 6 Abs. 1 lit. b DSGVO).</p>
      </Section>

      <Section title="5. Auftragsverarbeiter">
        <ul>
          <li><strong>Supabase Inc.</strong> (Datenbank-Hosting, Rechenzentrum: Frankfurt/EU)</li>
          <li><strong>Anthropic PBC</strong> (KI-Coach und Textgenerierung via Claude API)</li>
          <li><strong>Vercel Inc.</strong> (Hosting der Webanwendung)</li>
        </ul>
        <p>Mit allen Auftragsverarbeitern bestehen Vertr\u00E4ge gem\u00E4\u00DF Art. 28 DSGVO.</p>
      </Section>

      <Section title="6. Ihre Rechte">
        <ul>
          <li><strong>Auskunft</strong> (Art. 15 DSGVO): Sie k\u00F6nnen jederzeit Auskunft \u00FCber Ihre gespeicherten Daten verlangen.</li>
          <li><strong>Berichtigung</strong> (Art. 16 DSGVO): Sie k\u00F6nnen fehlerhafte Daten korrigieren lassen.</li>
          <li><strong>L\u00F6schung</strong> (Art. 17 DSGVO): Sie k\u00F6nnen die L\u00F6schung Ihrer Daten verlangen. In der App unter Profil &gt; Einstellungen.</li>
          <li><strong>Datenportabilit\u00E4t</strong> (Art. 20 DSGVO): Sie k\u00F6nnen Ihre Daten als JSON herunterladen. In der App unter Profil &gt; Einstellungen.</li>
          <li><strong>Widerruf</strong> (Art. 7 DSGVO): Sie k\u00F6nnen Ihre Einwilligung jederzeit widerrufen.</li>
        </ul>
      </Section>

      <Section title="7. Cookies">
        <p>Wir verwenden nur technisch notwendige Cookies f\u00FCr die Authentifizierung. Optionale Analyse-Cookies werden nur mit Ihrer Zustimmung gesetzt.</p>
      </Section>

      <Section title="8. Speicherdauer">
        <p>Ihre Daten werden gespeichert, solange Ihr Konto aktiv ist. Nach Kontol\u00F6schung werden alle Daten innerhalb von 30 Tagen unwiderruflich entfernt.</p>
      </Section>

      <Section title="9. Kontakt">
        <p>Bei Fragen zum Datenschutz wenden Sie sich an: datenschutz@karriere-institut.de</p>
      </Section>

      <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 48 }}>Stand: M\u00E4rz 2026</p>
    </div>
  );
}

function Section({ title, children }) {
  return (
    <section style={{ marginBottom: 32 }}>
      <h2 style={{ fontSize: 18, fontWeight: 700, letterSpacing: '-0.02em', marginBottom: 12 }}>{title}</h2>
      <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.7 }}>{children}</div>
    </section>
  );
}
