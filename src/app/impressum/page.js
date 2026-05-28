export const metadata = {
  title: 'Impressum · Karriere-Institut',
  description: 'Impressum und rechtliche Angaben des Karriere-Instituts.',
};

const headStyle = { fontSize: 18, fontWeight: 700, color: 'var(--ki-text)', margin: '28px 0 10px' };
const subStyle = { fontSize: 15, fontWeight: 700, color: 'var(--ki-text)', margin: '20px 0 6px' };

export default function ImpressumPage() {
  return (
    <div style={{ maxWidth: 760, margin: '0 auto', padding: '48px 24px 80px' }}>
      <a href="/" style={{ fontSize: 11, fontWeight: 600, letterSpacing: '0.12em', color: 'var(--ki-red)', textTransform: 'uppercase', textDecoration: 'none' }}>
        Karriere-Institut
      </a>
      <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.04em', margin: '20px 0 28px' }}>
        Impressum
      </h1>

      <div style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.75 }}>
        <p style={{ marginBottom: 16 }}>
          <strong>Das Karriere-Institut ist eine Marke der W:P wirpersonalberater GmbH.</strong>
        </p>

        <h2 style={headStyle}>Name und Anschrift</h2>
        <p>
          WP wir:personalberater GmbH<br />
          Hannoversche Straße 99<br />
          30916 Isernhagen
        </p>
        <p style={{ marginTop: 10 }}>
          Tel.: +49 511 51526580<br />
          E-Mail: info (at) wirpersonalberater.de<br />
          Web: <a href="https://www.wirpersonalberater.de" target="_blank" rel="noopener noreferrer" style={{ color: 'var(--ki-red)' }}>www.wirpersonalberater.de</a>
        </p>

        <h2 style={headStyle}>Geschäftsführung</h2>
        <p>Alexander Zill, Peer-Philip Peters</p>

        <h2 style={headStyle}>Registereintrag</h2>
        <p>
          Registergericht: Amtsgericht Hannover<br />
          Handelsregisternummer: HRB 89387<br />
          USt-IdNr.: DE311326989
        </p>

        <h2 style={headStyle}>Inhaltlich Verantwortlicher gemäß § 5 TMG und § 55 Abs. 2 RStV</h2>
        <p>
          Alexander Zill, Peer-Philip Peters<br />
          W:P wirpersonalberater GmbH<br />
          Hannoversche Straße 99, 30916 Isernhagen
        </p>

        <h2 style={headStyle}>Betreiber der Webseite</h2>
        <p>Das Karriere-Institut als eine Marke der W:P wirpersonalberater GmbH.</p>

        <h2 style={headStyle}>Rechtliche Hinweise zur Website</h2>
        <p>
          Wir sind ständig darum bemüht, Sie auf unseren Internetseiten vollständig und aktuell zu informieren.
          Leider können hier Fehler auftreten. Die W:P wirpersonalberater GmbH übernimmt keine Gewähr über die
          Aktualität, Vollständigkeit oder Richtigkeit der auf ihren Internetseiten bereitgestellten Informationen.
          Die W:P wirpersonalberater GmbH schließt jegliche Haftung für Schäden, die direkt oder aus der Benutzung
          dieser Webseite entstehen, aus. Die Haftung für Vorsatz oder grobe Fahrlässigkeit bleibt hiervon unberührt.
        </p>
        <p style={{ marginTop: 12 }}>
          Alle Angebote sind freibleibend und unverbindlich. Wir behalten es uns ausdrücklich vor, Teile der Seiten
          oder das gesamte Angebot ohne gesonderte Ankündigung zu verändern, zu ergänzen, zu löschen oder die
          Veröffentlichung zeitweise oder endgültig einzustellen.
        </p>
        <p style={{ marginTop: 12 }}>
          Bei direkten oder indirekten Verweisen auf fremde Webseiten („Hyperlinks"), die außerhalb des
          Verantwortungsbereiches des Autors liegen, würde eine Haftungsverpflichtung ausschließlich in Kraft
          treten, in dem der Autor von den Inhalten Kenntnis hat und es ihm technisch möglich und zumutbar wäre,
          die Nutzung im Falle rechtswidriger Inhalte zu verhindern.
        </p>
        <p style={{ marginTop: 12 }}>
          W:P wirpersonalberater GmbH erklärt hiermit ausdrücklich, dass zum Zeitpunkt der Linksetzung keine
          illegalen Inhalte auf den zu verlinkenden Seiten erkennbar waren. Auf die aktuelle und zukünftige
          Gestaltung, die Inhalte oder die Urheberschaft der gelinkten/verknüpften Seiten hat die W:P
          wirpersonalberater GmbH keinerlei Einfluss. Deshalb distanziert sie sich hiermit ausdrücklich von allen
          Inhalten aller gelinkten/verknüpften Seiten, die nach der Linksetzung verändert wurden. Für illegale,
          fehlerhafte oder unvollständige Inhalte und insbesondere für Schäden, die aus der Nutzung oder
          Nichtnutzung solcherart dargebotener Informationen entstehen, haftet allein der Anbieter der Seite, auf
          welche verwiesen wurde.
        </p>
        <p style={{ marginTop: 12 }}>
          Die W:P wirpersonalberater GmbH ist bestrebt, in allen Publikationen die Urheberrechte der verwendeten
          Grafiken, Tondokumente, Videosequenzen und Texte zu beachten, von ihr selbst erstellte Grafiken,
          Tondokumente, Videosequenzen und Texte zu nutzen oder auf lizenzfreie Grafiken, Tondokumente,
          Videosequenzen und Texte zurückzugreifen.
        </p>
        <p style={{ marginTop: 12 }}>
          Alle innerhalb des Internetangebotes genannten und ggf. durch Dritte geschützten Marken- und Warenzeichen
          unterliegen uneingeschränkt den Bestimmungen des jeweils gültigen Kennzeichenrechts den Besitzrechten der
          jeweiligen eingetragenen Eigentümer. Allein aufgrund der bloßen Nennung ist nicht der Schluss zu ziehen,
          dass Markenzeichen nicht durch Rechte Dritter geschützt sind.
        </p>
        <p style={{ marginTop: 12 }}>
          Das Copyright für veröffentlichte, von uns selbst erstellte Objekte bleibt allein bei der W:P
          wirpersonalberater GmbH. Eine Vervielfältigung oder Verwendung solcher Grafiken, Tondokumente,
          Videosequenzen und Texte in anderen elektronischen oder gedruckten Publikationen ist ohne ausdrückliche
          Zustimmung der W:P wirpersonalberater nicht gestattet.
        </p>
        <p style={{ marginTop: 12 }}>
          Dieser Haftungsausschluss ist als Teil des Internetangebotes zu betrachten, von dem aus auf diese Seite
          verwiesen wurde. Sofern Teile oder einzelne Formulierungen dieses Textes der geltenden Rechte nicht,
          nicht mehr oder nicht vollständig entsprechen sollten, bleiben die übrigen Teile des Dokumentes in ihrem
          Inhalt und ihrer Gültigkeit davon unberührt.
        </p>

        <h2 style={headStyle}>Hinweis zur sprachlichen Form</h2>
        <p>
          Aus Gründen der besseren Lesbarkeit verzichten wir auf gegenderte Sprache. Personenbezeichnungen
          gelten für alle Geschlechter.
        </p>
      </div>

      <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 48 }}>
        Stand: Mai 2026
      </p>
    </div>
  );
}
