export const metadata = {
  title: 'Datenschutz · Karriere-Institut',
  description: 'Datenschutzinformation des Karriere-Instituts gemäß DSGVO.',
};

const h1 = { fontSize: 34, fontWeight: 700, letterSpacing: '-0.04em', margin: '20px 0 28px' };
const h2 = { fontSize: 20, fontWeight: 700, color: 'var(--ki-text)', margin: '36px 0 14px', letterSpacing: '-0.02em' };
const h3 = { fontSize: 16, fontWeight: 700, color: 'var(--ki-text)', margin: '24px 0 8px' };
const h4 = { fontSize: 14, fontWeight: 700, color: 'var(--ki-text)', margin: '18px 0 6px' };
const tableStyle = { width: '100%', borderCollapse: 'collapse', fontSize: 13, margin: '12px 0 18px' };
const td = { border: '1px solid #E8E6E1', padding: '10px 12px', verticalAlign: 'top', textAlign: 'left' };
const th = { ...td, background: '#FAFAF8', fontWeight: 700 };

export default function DatenschutzPage() {
  return (
    <div style={{ maxWidth: 820, margin: '0 auto', padding: '48px 24px 80px' }}>
      <a href="/" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase', textDecoration: 'none' }}>
        Karriere-Institut
      </a>
      <h1 style={h1}>Datenschutzinformation</h1>

      <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.75 }}>
        <p>Inhaltsübersicht:</p>
        <ol style={{ paddingLeft: 22, marginTop: 8 }}>
          <li>Ansprechpartner und Kontaktdaten des Datenschutzbeauftragten</li>
          <li>Allgemeine Informationen zu den verarbeiteten Daten</li>
          <li>Empfänger von Daten und Drittlandübermittlungen</li>
          <li>Social Media Auftritte</li>
          <li>Speicherdauer</li>
          <li>Ihre Rechte</li>
          <li>Widerrufs- und Widerspruchsrecht</li>
          <li>Sichere Datenübertragung und Datensicherheit</li>
          <li>Anpassung der Datenschutzinformationen</li>
        </ol>

        <h2 style={h2}>I. Ansprechpartner und Kontaktdaten des Datenschutzbeauftragten</h2>
        <p>
          Verantwortlicher für die Verarbeitung Ihrer personenbezogenen Daten im Sinne der
          Datenschutzgrundverordnung („DSGVO") ist:
        </p>
        <p style={{ marginTop: 10 }}>
          WP wir:personalberater GmbH (für die Marke „Das Karriere-Institut")<br />
          Hannoversche Straße 99<br />
          30916 Isernhagen<br />
          Tel.: +49 511 51526580<br />
          E-Mail: info@wirpersonalberater.de
        </p>
        <p style={{ marginTop: 10 }}>
          Eingetragen im Handelsregister des Amtsgerichts Hannover unter HRB 89387.
          (im Folgenden „wir" oder „uns")
        </p>
        <p style={{ marginTop: 10 }}>
          Mit allen Fragen zum Thema Datenschutz, aber auch im Zusammenhang mit unserer Dienstleistung oder
          der Nutzung unserer Webseite, können Sie sich jederzeit an uns oder unseren Datenschutzbeauftragten wenden.
        </p>
        <p style={{ marginTop: 10 }}>
          Sie erreichen unseren Datenschutzbeauftragten unter:<br />
          <strong>Patrick Liptak</strong><br />
          VP Data Protection GmbH<br />
          E-Mail: info@vpdata.de
        </p>

        <h2 style={h2}>II. Allgemeine Informationen zu den verarbeiteten Daten, den Rechtsgrundlagen und den Zwecken der Verarbeitung</h2>
        <p>
          „Personenbezogene Daten" im Sinne der DSGVO und des BDSG sind alle Informationen, die sich auf
          eine identifizierte oder identifizierbare natürliche Person beziehen. Hierunter fallen vor allem
          Angaben, die Rückschlüsse auf Ihre Identität ermöglichen.
        </p>
        <p style={{ marginTop: 10 }}>
          Sie können in den meisten Fällen entscheiden, welche personenbezogenen Daten Sie an uns geben möchten.
          Falls Sie dies ablehnen, können wir Ihnen jedoch möglicherweise bestimmte Leistungen nicht anbieten.
          Pflichtangaben, die wir für die Bereitstellung unserer Leistungen benötigen, haben wir entsprechend gekennzeichnet.
        </p>

        <h3 style={h3}>1. Datenverarbeitung beim Aufruf und der Nutzung der Webseite</h3>
        <h4 style={h4}>a. Aufruf und Nutzung der Webseite</h4>
        <p>
          Bei der rein informatorischen Nutzung unserer Webseite verarbeiten wir personenbezogene Daten, die
          Ihr Browser an unseren Server übermittelt und die für die Darstellung unserer Webseite und die
          Gewährleistung von Stabilität und Sicherheit technisch notwendig sind:
        </p>
        <ul style={{ paddingLeft: 22, marginTop: 8 }}>
          <li>Browsertyp und Browserversion</li>
          <li>Verwendetes Betriebssystem</li>
          <li>Referrer URL</li>
          <li>Hostname des zugreifenden Rechners</li>
          <li>Uhrzeit der Serveranfrage</li>
          <li>IP-Adresse</li>
        </ul>
        <p style={{ marginTop: 10 }}>
          Die Verbindungsdaten werden beschränkt in internen Logfiles gespeichert, um die Stabilität und
          Sicherheit zu gewährleisten. Die Zugriffsdaten werden teilweise in internen Logfiles gespeichert,
          um statistische Angaben über die Nutzung unserer Webseite zu erstellen, sie weiterzuentwickeln und zu pflegen.
        </p>
        <p style={{ marginTop: 10 }}>
          Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 S. 1 lit. b DSGVO, soweit die Webseite zur Anbahnung
          oder Durchführung eines Vertrages aufgerufen wurde. Im Übrigen ist die Rechtsgrundlage Art. 6 Abs. 1 S. 1 lit. f DSGVO.
          Unser berechtigtes Interesse besteht darin, Ihnen eine sicher und stabile, sowie funktionsfähige
          Webseite und deren Inhalte präsentieren zu können. Diese Daten werden nach 30 Tagen gelöscht.
        </p>

        <h4 style={h4}>b. Kontaktaufnahme</h4>
        <p>
          Sie können uns über unsere Kontaktformulare, per E-Mail, Post oder Telefon erreichen. Die in dem
          Zusammenhang erhobenen personenbezogenen Daten verarbeiten wir ausschließlich zum Zweck der Kommunikation
          mit Ihnen. Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 S. 1 lit. b DSGVO. Wir löschen Ihre Daten, sobald
          wir Ihre Anfrage zu Ihrer Zufriedenheit beantwortet haben und keine anderen Aufbewahrungsfristen entgegenstehen.
        </p>

        <h4 style={h4}>c. Cookies</h4>
        <p>
          Informationen zu Cookies oder ähnlichen Technologien, die wir auf unserer Webseite einsetzen, finden
          Sie in unserer Cookie Information.
        </p>

        <h3 style={h3}>2. Datenverarbeitung im Rahmen von Teilnahmen und Buchungen von Kursangeboten</h3>
        <h4 style={h4}>a. Einrichtung und Nutzung eines Kundenkontos</h4>
        <p>
          Bei der Einrichtung und Nutzung eines Kundenkontos werden zur Verwaltung folgende personenbezogene Daten verarbeitet:
        </p>
        <ul style={{ paddingLeft: 22, marginTop: 8 }}>
          <li>Name, Vorname</li>
          <li>(Rechnungs-)Adresse</li>
          <li>Telefonnummer</li>
          <li>E-Mail-Adresse</li>
          <li>Passwort</li>
          <li>Geburtsdatum (optional)</li>
          <li>Geschlecht (optional)</li>
        </ul>
        <p style={{ marginTop: 10 }}>Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 S. 1 lit. b DSGVO.</p>

        <h4 style={h4}>b. Buchung von Dienstleistungen und Kursen</h4>
        <p>
          Wenn Sie eine Dienstleistung bzw. einen Kurs bei uns buchen, erheben und verarbeiten wir folgende
          personenbezogene Daten zur Bearbeitung und Abwicklung Ihrer Bestellung: Name, Vorname, Rechnungsadresse,
          Telefonnummer, E-Mail-Adresse. Diese nutzen wir zur Erfüllung unserer vertraglichen Pflichten, für das
          Forderungsmanagement sowie für die Bearbeitung eventueller Rückabwicklungen und Gewährleistungsfälle.
          Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 S. 1 lit. b DSGVO.
        </p>

        <h4 style={h4}>c. Bewerbungstraining, Karriereseminare, CV-Check und Begleitung von Bewerbungsverfahren</h4>
        <p>
          Sofern Sie an einem Bewerbungstraining oder Karriereseminar teilnehmen und Ihre (Bewerbungs-)Unterlagen
          durch uns prüfen lassen, verarbeiten wir die von Ihnen angegebenen Informationen. Diese umfassen unter
          anderem Daten zum beruflichen Werdegang bzw. Ihren Lebenslauf, Daten zu berufsbezogenen Qualifikationen
          (Schulabschluss, Hochschulreife, Noten, Erwerbsort, nicht-schulische Leistungen, Prüfungsdaten, Abschlüsse,
          Zeugnisse) sowie Angaben zu angestrebtem Beruf, Ausbildungs- oder Arbeitsplatz. Sofern angegeben,
          verarbeiten wir Ihre Angaben zu Mobilität und Reisebereitschaft.
        </p>
        <p style={{ marginTop: 10 }}>Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 S. 1 lit. b DSGVO.</p>
        <p style={{ marginTop: 10 }}>
          In Einzelfällen erheben und verarbeiten wir besonders sensible Daten, die Sie uns im Rahmen von
          Gesundheitszeugnissen und Angaben zum besonders schützenswerten personenbezogenen Datum der
          Schwerbehinderung übermitteln. Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 S. 1 lit. a i.V.m. Art. 6
          Abs. 2 lit. a DSGVO.
        </p>

        <h4 style={h4}>d. Abwicklung von Zahlungen</h4>
        <p>
          Zum Zweck der Abwicklung von Zahlungen können Ihre Zahlungsdaten (z. B. Kreditkartendaten, Kontonummer)
          sowie die zuvor genannten personenbezogenen Daten an unsere Zahlungsdienstleister übermittelt werden,
          soweit diese zur Abwicklung notwendig sind. Die Dienstleister verarbeiten Ihre Daten in eigener
          Verantwortung im Rahmen der Finanzdienstleistung. Nach erfolgreicher Zahlung erhalten wir vom
          Dienstleister einen Token als Bestätigung. Rechtsgrundlage: Art. 6 Abs. 1 S. 1 lit. b DSGVO.
        </p>

        <h3 style={h3}>3. Anonymisierung für Analysezwecke</h3>
        <p>
          Wir anonymisieren Ihre personenbezogenen Daten zur Erstellung von anonymisierten statistischen Analysen.
          Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 S. 1 lit. f DSGVO. Unser berechtigtes Interesse besteht
          darin, unsere Produkte und Dienstleistungen zu verbessern.
        </p>

        <h2 style={h2}>III. Empfänger von Daten und Drittlandübermittlungen</h2>
        <p>
          Soweit Dienstleister personenbezogene Daten in unserem Auftrag verarbeiten, haben wir mit diesen einen
          Auftragsverarbeitungsvertrag geschlossen und angemessene Garantien zur Wahrung des Schutzes
          personenbezogener Daten vereinbart. Unsere Dienstleister werden sorgfältig ausgewählt, sind vertraglich
          an unsere Weisungen gebunden, verfügen über geeignete technische und organisatorische Maßnahmen und werden
          regelmäßig kontrolliert.
        </p>
        <div style={{ overflowX: 'auto' }}>
          <table style={tableStyle}>
            <thead>
              <tr>
                <th style={th}>Kategorien an Empfängern</th>
                <th style={th}>Empfänger</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td style={td}>Konzerngesellschaften</td>
                <td style={td}>
                  Zur Vereinfachung von Geschäftsabläufen arbeiten wir mit unseren Konzernunternehmen zusammen:<br />
                  MitNORM Assekuranzservice GmbH, Rendsburger Str. 14, 30659 Hannover, Deutschland<br />
                  MitNORM GmbH, Rendsburger Str. 14, 30659 Hannover, Deutschland
                </td>
              </tr>
              <tr>
                <td style={td}>Dienstleister für die Kundenverwaltung</td>
                <td style={td}>
                  Courseticket GmbH, Liechtensteinstraße 111-115, 1090 Wien, Österreich
                </td>
              </tr>
              <tr>
                <td style={td}>Hosting der Plattform</td>
                <td style={td}>
                  Courseticket GmbH, Liechtensteinstraße 111-115, 1090 Wien, Österreich (Auftragsverarbeiter)
                </td>
              </tr>
              <tr>
                <td style={td}>Zahlungsdienstleister</td>
                <td style={td}>
                  <strong>Kreditkarten/SEPA/ELV:</strong> PAYONE GmbH, Zweigniederlassung Österreich,
                  Am Belvedere 10, 1100 Wien, Österreich<br />
                  <strong>Online-Überweisungen:</strong> Klarna Bank AB, Sveavägen 46, 111 34 Stockholm, Schweden
                </td>
              </tr>
              <tr>
                <td style={td}>Behörden</td>
                <td style={td}>
                  Wir sind im Falle einer gesetzlichen Verpflichtung angehalten, Informationen über Sie offenzulegen,
                  wenn die Herausgabe von rechtmäßig handelnden Behörden oder Strafverfolgungsorganen verlangt wird.
                  Rechtsgrundlage: Art. 6 Abs. 1 lit. c DSGVO.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
        <p>
          Soweit wir personenbezogene Daten in Drittländer übermitteln, für die kein Angemessenheitsbeschluss der
          Kommission vorliegt, tun wir dies auf der Grundlage von Standarddatenschutzklauseln, die von der Kommission
          gemäß dem Prüfverfahren nach Art. 93 (2) DSGVO erlassen wurden. Zusätzlich haben wir Sicherungsmaßnahmen
          im Einklang mit den entsprechenden Datentransferfolgenabschätzungen implementiert.
        </p>

        <h2 style={h2}>IV. Social Media Auftritte</h2>
        <p>Wir unterhalten öffentlich zugängliche Seiten („Fanpages") in den folgenden Netzwerken:</p>
        <ul style={{ paddingLeft: 22, marginTop: 8 }}>
          <li>Facebook</li>
          <li>Instagram</li>
          <li>Youtube</li>
        </ul>
        <p style={{ marginTop: 10 }}>
          Auf unseren Fanpages können Sie sich über unsere Dienstleistungen, Veranstaltungen und sonstige Aktionen
          informieren und mit uns kommunizieren. Teilweise erhalten wir Statistiken zur Nutzung unserer Fanpages.
          Die Rechtsgrundlage hierfür ist Art. 6 Abs. 1 lit. b bzw. lit. f DSGVO. Unser berechtigtes Interesse
          besteht darin, das Nutzungserlebnis für unsere Fanpage-Besucher zielgruppenorientiert zu optimieren.
        </p>
        <p style={{ marginTop: 10 }}>
          Auf Daten, die durch die Netzwerke in eigener Verantwortung verarbeitet werden, haben wir keinen Einfluss.
          Nähere Informationen finden Sie in den Datenschutzinformationen des jeweiligen Netzwerks.
        </p>

        <h2 style={h2}>V. Speicherdauer</h2>
        <p>
          Wir speichern Ihre personenbezogenen Daten so lange, wie es für die Erreichung des jeweiligen Zwecks
          notwendig ist, insbesondere für die Erfüllung unserer gesetzlichen und vertraglichen Verpflichtungen.
          Nach Zweckerreichung werden diese Daten gelöscht, es sei denn, dass das Gesetz uns die weitere
          Speicherung für bestimmte Zwecke erlaubt, einschließlich der Verteidigung von Rechtsansprüchen.
        </p>
        <p style={{ marginTop: 10 }}>
          Darüber hinaus müssen wir Ihre Daten ggf. zu Abrechnungszwecken speichern. Hierbei unterliegen wir
          gesetzlichen Aufbewahrungs- bzw. Dokumentationspflichten, die sich aus dem Handelsgesetzbuch, der
          Abgabenordnung, dem Kreditwesengesetz und dem Geldwäschegesetz ergeben können. Die dort vorgeschriebenen
          Fristen zur Aufbewahrung von Unterlagen betragen zwei bis zehn Jahre.
        </p>

        <h2 style={h2}>VI. Ihre Rechte</h2>
        <p>
          Sie haben nach Maßgabe der gesetzlichen Bestimmungen folgende Rechte hinsichtlich der Verarbeitung der
          Sie betreffenden personenbezogenen Daten:
        </p>
        <ul style={{ paddingLeft: 22, marginTop: 8 }}>
          <li>Recht auf Auskunft</li>
          <li>Recht auf Berichtigung und Löschung</li>
          <li>Recht auf Einschränkung der Verarbeitung</li>
          <li>Recht auf Widerspruch gegen die Verarbeitung</li>
          <li>Recht auf Widerruf Ihrer erteilten Einwilligungen</li>
          <li>Recht auf Datenübertragbarkeit</li>
        </ul>
        <p style={{ marginTop: 10 }}>
          Zudem haben Sie das Recht, sich bei einer Aufsichtsbehörde über die Datenverarbeitung durch uns zu
          beschweren. Die zuständige Aufsichtsbehörde lautet:
        </p>
        <p style={{ marginTop: 10 }}>
          Landesbeauftragte für Datenschutz und Informationsfreiheit Nordrhein-Westfalen<br />
          Postfach 20 04 44, 40102 Düsseldorf<br />
          Tel.: +49 211 384240, E-Mail: poststelle@ldi.nrw.de
        </p>

        <h2 style={h2}>VII. Widerrufs- und Widerspruchsrecht</h2>
        <p>
          <strong>
            Sie haben das Recht, eine uns gegenüber erteilte Einwilligung jederzeit zu widerrufen. Die auf dieser
            Einwilligung beruhende Verarbeitung werden wir dann für die Zukunft nicht mehr fortführen. Die
            Rechtmäßigkeit der erfolgten Verarbeitung auf Basis einer Einwilligung bis zum Widerruf wird durch
            den Widerruf nicht berührt.
          </strong>
        </p>
        <p style={{ marginTop: 10 }}>
          <strong>
            Sollte die Datenverarbeitung durch uns auf Grundlage eines berechtigten Interesses erfolgen, haben
            Sie das Recht, jederzeit Widerspruch gegen die Verarbeitung Ihrer Daten einzulegen. Der Verarbeitung
            Ihrer Daten zu Zwecken der Direktwerbung können Sie jederzeit widersprechen, auch ohne die Angabe von
            Gründen.
          </strong>
        </p>
        <p style={{ marginTop: 10 }}>
          <strong>
            Um von Ihrem Widerrufs- oder Widerspruchsrecht Gebrauch zu machen, schicken Sie bitte eine formlose
            Mitteilung an die unter Ziffer I. genannten Kontaktdaten.
          </strong>
        </p>

        <h2 style={h2}>VIII. Sichere Datenübertragung und Datensicherheit</h2>
        <p>
          Wir setzen technische und organisatorische Sicherheitsmaßnahmen um, damit Ihre personenbezogenen Daten
          vor Zugriff und Missbrauch durch unberechtigte Personen geschützt sind. Wenn personenbezogene Daten
          übertragen werden, werden diese durch die Verwendung einer Verschlüsselung geschützt. Diese Maßnahmen
          werden fortlaufend überarbeitet und verbessert.
        </p>

        <h2 style={h2}>IX. Anpassung der Datenschutzinformationen</h2>
        <p>
          Durch die Weiterentwicklung unserer Webseite oder aufgrund geänderter gesetzlicher beziehungsweise
          behördlicher Vorgaben kann es notwendig werden, diese Datenschutzinformationen zu aktualisieren. Die
          jeweils aktuelle Version kann jederzeit auf unserer Webseite eingesehen und ausgedruckt werden.
        </p>
      </div>

      <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 48 }}>
        Stand: Mai 2026
      </p>
    </div>
  );
}
