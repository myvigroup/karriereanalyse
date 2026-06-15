import ScanResultClient from '../ScanResultClient';

const DEMO_CHECK = {
  name: 'Max Mustermann',
  target_position: 'Senior Sales Manager',
  overall_rating: 3,
  summary:
    'Dein Lebenslauf zeigt eine solide Grundlage mit klarer Struktur und ansprechendem Design. ' +
    'Das größte Potenzial liegt im Bereich Inhalt: Konkrete Zahlen, messbare Erfolge und eine ' +
    'schärfere Positionierung würden deine Bewerbungschancen deutlich steigern. ' +
    'Mit gezielten Anpassungen kannst du aus einem guten einen überzeugenden Lebenslauf machen.',
  registered: true,
};

const DEMO_ITEMS = {
  struktur: [
    { type: 'preset',   content: '__rating_4',                       category: 'struktur' },
    { type: 'preset',   content: 'Kontaktdaten vollständig',         category: 'struktur' },
    { type: 'preset',   content: 'Klare chronologische Gliederung',  category: 'struktur' },
    { type: 'preset',   content: 'Foto vorhanden & professionell',   category: 'struktur' },
    { type: 'preset',   content: 'Seitenumfang angemessen (2 S.)',   category: 'struktur' },
    { type: 'preset',   content: 'Ausbildungsabschnitt vollständig', category: 'struktur' },
    { type: 'freetext', content: 'Der strukturelle Aufbau ist professionell und übersichtlich. Alle wesentlichen Sektionen sind vorhanden und logisch geordnet — das erleichtert Recruitern die schnelle Orientierung erheblich.', category: 'struktur' },
  ],
  inhalt: [
    { type: 'preset',   content: '__rating_3',                                        category: 'inhalt' },
    { type: 'preset',   content: 'Berufserfahrung gut beschrieben',                   category: 'inhalt' },
    { type: 'preset',   content: 'Ausbildung & Zertifikate aufgeführt',               category: 'inhalt' },
    { type: 'preset',   content: 'Fehlende Kennzahlen & messbare Erfolge',            category: 'inhalt' },
    { type: 'preset',   content: 'Zu vage Formulierungen bei Aufgaben',               category: 'inhalt' },
    { type: 'preset',   content: 'Verbesserung: Quantifizierte Ergebnisse ergänzen',  category: 'inhalt' },
    { type: 'preset',   content: 'Keine konkreten Umsatzzahlen oder KPIs',            category: 'inhalt' },
    { type: 'freetext', content: 'Die Berufsstationen sind grundsätzlich gut dargestellt, aber es fehlen konkrete Zahlen. Statt „Kundenakquise verantwortet" besser: „Neukundenportfolio um 34 % auf 120 Accounts ausgebaut". Das ist der Unterschied zwischen einem Lebenslauf, der überzeugt, und einem, der in der Masse untergeht.', category: 'inhalt' },
  ],
  design: [
    { type: 'preset',   content: '__rating_4',                        category: 'design' },
    { type: 'preset',   content: 'Klares, professionelles Layout',    category: 'design' },
    { type: 'preset',   content: 'Gute Lesbarkeit & Schriftgröße',   category: 'design' },
    { type: 'preset',   content: 'Ausreichend Weißraum',              category: 'design' },
    { type: 'preset',   content: 'Dezente Farbgestaltung',            category: 'design' },
    { type: 'freetext', content: 'Das Design wirkt aufgeräumt und modern. Die visuelle Hierarchie ist stimmig — Überschriften sind klar erkennbar, Aufzählungen gut strukturiert. Kleinigkeit: Der Abstand zwischen den Sektionen könnte etwas großzügiger sein, um die Lesbarkeit auf einen Blick weiter zu verbessern.', category: 'design' },
  ],
  wirkung: [
    { type: 'preset',   content: '__rating_3',                                         category: 'wirkung' },
    { type: 'preset',   content: 'Solide Gesamtwirkung',                               category: 'wirkung' },
    { type: 'preset',   content: 'Zu generisch für eine Führungsposition',             category: 'wirkung' },
    { type: 'preset',   content: 'Schwache Positionierung als Experte',                category: 'wirkung' },
    { type: 'preset',   content: 'Verbesserung: Persönliches Profil / Summary fehlt', category: 'wirkung' },
    { type: 'freetext', content: 'Der Lebenslauf hinterlässt einen ordentlichen, aber noch nicht überzeugenden Eindruck. Für eine Senior-Position braucht es eine stärkere Positionierung: Ein prägnantes persönliches Profil (3–4 Sätze) am Anfang würde sofort klären, warum Max Mustermann der richtige Kandidat für diese Rolle ist — und Recruiting-Entscheider in den ersten 6 Sekunden abholen.', category: 'wirkung' },
  ],
};

function CVPreview() {
  const sec = { marginBottom: 18 };
  const label = { fontSize: 9, fontWeight: 700, letterSpacing: '1.5px', textTransform: 'uppercase', color: '#CC1426', borderBottom: '1.5px solid #CC1426', paddingBottom: 3, marginBottom: 10 };
  const jobTitle = { fontWeight: 700, fontSize: 11, color: '#1A1A1A' };
  const jobMeta = { fontSize: 10, color: '#6B7280', marginBottom: 4 };
  const bullet = { fontSize: 10, color: '#374151', lineHeight: 1.5, marginBottom: 2, paddingLeft: 12, position: 'relative' };

  return (
    <div style={{
      background: '#fff',
      borderRadius: 4,
      boxShadow: '0 2px 20px rgba(0,0,0,0.15), 0 1px 4px rgba(0,0,0,0.08)',
      overflow: 'hidden',
      fontFamily: '"Times New Roman", Georgia, serif',
      fontSize: 11,
      color: '#1A1A1A',
      maxWidth: 560,
      margin: '0 auto',
    }}>
      {/* CV Header */}
      <div style={{ background: '#1A1A1A', padding: '20px 24px', display: 'flex', alignItems: 'center', gap: 18 }}>
        {/* Photo placeholder */}
        <div style={{
          width: 64, height: 76, background: '#374151', borderRadius: 3, flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #4B5563',
          overflow: 'hidden',
        }}>
          <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
            <circle cx="12" cy="7" r="4"/>
          </svg>
        </div>
        <div>
          <div style={{ fontSize: 22, fontWeight: 700, color: '#fff', letterSpacing: '-0.5px', lineHeight: 1.1 }}>Max Mustermann</div>
          <div style={{ fontSize: 12, color: '#CC1426', fontWeight: 600, marginTop: 3, letterSpacing: '0.5px' }}>SENIOR SALES MANAGER</div>
          <div style={{ marginTop: 8, display: 'flex', gap: 16, flexWrap: 'wrap' }}>
            {['max.mustermann@email.de', '+49 170 1234567', 'Hannover', 'linkedin.com/in/maxmustermann'].map((c, i) => (
              <span key={i} style={{ fontSize: 9, color: '#9CA3AF', display: 'flex', alignItems: 'center', gap: 4 }}>{c}</span>
            ))}
          </div>
        </div>
      </div>

      <div style={{ padding: '18px 24px', display: 'grid', gridTemplateColumns: '1fr 160px', gap: 20 }}>
        {/* Left Column */}
        <div>
          <div style={sec}>
            <div style={label}>Berufserfahrung</div>

            <div style={{ marginBottom: 13 }}>
              <div style={jobTitle}>Sales Manager DACH</div>
              <div style={jobMeta}>TechSales GmbH, Hamburg · 2020 – heute</div>
              <div style={bullet}>• Betreuung von Key-Account-Kunden im B2B-Bereich</div>
              <div style={bullet}>• Verantwortung für die Neukundenakquise in der DACH-Region</div>
              <div style={bullet}>• Führung eines Teams von 4 Außendienstmitarbeitern</div>
              <div style={bullet}>• Aufbau und Pflege von CRM-Prozessen (Salesforce)</div>
            </div>

            <div style={{ marginBottom: 13 }}>
              <div style={jobTitle}>Account Executive</div>
              <div style={jobMeta}>Digital Solutions AG, Frankfurt · 2017 – 2020</div>
              <div style={bullet}>• Kundenbetreuung im Software-Vertrieb (SaaS)</div>
              <div style={bullet}>• Durchführung von Demos und Verhandlungen</div>
              <div style={bullet}>• Zusammenarbeit mit Marketing und Produktentwicklung</div>
            </div>

            <div>
              <div style={jobTitle}>Junior Sales Representative</div>
              <div style={jobMeta}>MediaGroup GmbH, Berlin · 2015 – 2017</div>
              <div style={bullet}>• Telefonische und persönliche Kaltakquise</div>
              <div style={bullet}>• Angebotserstellung und Auftragsabwicklung</div>
            </div>
          </div>

          <div style={sec}>
            <div style={label}>Ausbildung</div>
            <div style={{ marginBottom: 8 }}>
              <div style={jobTitle}>B.A. Betriebswirtschaftslehre</div>
              <div style={jobMeta}>Universität Hannover · 2011 – 2015 · Note: 2,3</div>
            </div>
            <div>
              <div style={jobTitle}>Allgemeine Hochschulreife</div>
              <div style={jobMeta}>Gymnasium Hannover-Mitte · 2011 · Note: 1,9</div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div>
          <div style={sec}>
            <div style={label}>Kenntnisse</div>
            {[
              ['Salesforce CRM', 90],
              ['Verhandlungsführung', 85],
              ['B2B-Vertrieb', 95],
              ['Präsentation', 80],
              ['MS Office', 85],
            ].map(([skill, pct]) => (
              <div key={skill} style={{ marginBottom: 7 }}>
                <div style={{ fontSize: 9.5, color: '#374151', marginBottom: 2 }}>{skill}</div>
                <div style={{ background: '#F3F4F6', borderRadius: 2, height: 4 }}>
                  <div style={{ background: '#CC1426', width: `${pct}%`, height: '100%', borderRadius: 2 }} />
                </div>
              </div>
            ))}
          </div>

          <div style={sec}>
            <div style={label}>Sprachen</div>
            {[['Deutsch', 'Muttersprache'], ['Englisch', 'Verhandlungssicher'], ['Spanisch', 'Grundkenntnisse']].map(([lang, lvl]) => (
              <div key={lang} style={{ marginBottom: 5 }}>
                <div style={{ fontSize: 9.5, fontWeight: 700, color: '#1A1A1A' }}>{lang}</div>
                <div style={{ fontSize: 9, color: '#6B7280' }}>{lvl}</div>
              </div>
            ))}
          </div>

          <div style={sec}>
            <div style={label}>Zertifikate</div>
            <div style={{ fontSize: 9.5, color: '#374151', lineHeight: 1.7 }}>
              <div>Salesforce Certified Sales Rep (2022)</div>
              <div>HubSpot Sales Software (2021)</div>
              <div>SPIN Selling Zertifikat (2019)</div>
            </div>
          </div>

          <div>
            <div style={label}>Interessen</div>
            <div style={{ fontSize: 9.5, color: '#374151', lineHeight: 1.7 }}>
              <div>Laufen & Triathlon</div>
              <div>Startup-Ökosystem</div>
              <div>Podcasts über Leadership</div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div style={{ padding: '8px 24px 12px', borderTop: '1px solid #F3F4F6', textAlign: 'center' }}>
        <div style={{ fontSize: 8, color: '#9CA3AF', letterSpacing: '0.5px' }}>
          Hannover, Juni 2025 · Max Mustermann
        </div>
      </div>
    </div>
  );
}

export const metadata = {
  title: 'Muster-Auswertung | KI-Lebenslauf-Check',
  robots: 'noindex',
};

export default function DemoResultPage() {
  return (
    <div>
      {/* CV Section */}
      <div style={{ maxWidth: 520, margin: '0 auto', padding: '24px 16px 0' }}>
        <div style={{ marginBottom: 12 }}>
          <div style={{ fontSize: 11, fontWeight: 700, letterSpacing: '1px', textTransform: 'uppercase', color: '#9CA3AF', marginBottom: 6 }}>
            Hochgeladener Lebenslauf
          </div>
        </div>
        <CVPreview />
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '24px 0 0' }}>
          <div style={{ flex: 1, height: 1, background: '#E8E6E1' }} />
          <div style={{ fontSize: 12, color: '#9CA3AF', fontWeight: 500, whiteSpace: 'nowrap' }}>KI-Analyse</div>
          <div style={{ flex: 1, height: 1, background: '#E8E6E1' }} />
        </div>
      </div>

      {/* Analysis */}
      <ScanResultClient check={DEMO_CHECK} itemsByCategory={DEMO_ITEMS} token="demo" />
    </div>
  );
}
