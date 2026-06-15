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

export const metadata = {
  title: 'Muster-Auswertung | KI-Lebenslauf-Check',
  robots: 'noindex',
};

export default function DemoResultPage() {
  return <ScanResultClient check={DEMO_CHECK} itemsByCategory={DEMO_ITEMS} token="demo" />;
}
