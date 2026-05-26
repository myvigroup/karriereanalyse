// Zentrale Coach-Daten — werden vom Seminar-Modal UND der /coaches-Seite genutzt.
// Falls neue Coaches dazukommen oder die Zuordnung sich ändert, nur hier anpassen.

export const COACHES = [
  {
    id: 'marie-luise-lambein',
    name: 'Marie-Luise Lambein',
    title: 'Lizenzierte Referentin & Coach',
    initials: 'ML',
    gradient: 'linear-gradient(135deg, #8b1832 0%, #4a0a14 100%)',
    sinceYear: 2019,
    short: 'Seit 2019 lizensierte Referentin · Spezialistin für Rhetorik, Lerntypen und den Karriereeinstieg.',
    bio: `Seit 2019 lizensierte Referentin des Karriere-Instituts. Angefangen als Coach für karriererelevante Fragestellungen und als Referentin für das Karriereseminar Grundlagen — heute bildet sie alle neuen Onboarder für das Grundlagen-Seminar aus und hält die Seminare „Rhetorik, Dialektik, Kinesik", „Typgerechtes Lernen" und „Karriereseminar Entwicklung".`,
    specialties: ['Rhetorik & Dialektik', 'Typgerechtes Lernen', 'Karriere-Einstieg', 'Gehaltsverhandlung'],
    seminarIds: ['sem-rhetorik', 'sem-typgerecht', 'sem-kommunikation'],
    masterclassIds: [],
  },
  {
    id: 'maximilian-wimmer',
    name: 'Maximilian Wimmer',
    title: 'Lizenzierter Referent & Coach',
    initials: 'MW',
    gradient: 'linear-gradient(135deg, #1d4e89 0%, #0f2e4f 100%)',
    sinceYear: 2021,
    short: 'Seit 2021 Referent & Coach · Schwerpunkt Bewerbungsprozess, Gehaltsverhandlung und Karriereplanung.',
    bio: `Seit 29.03.2021 als lizenzierter Referent und Coach im Karriere-Institut tätig. Hält regelmäßig Karriereseminare für Studierende, Absolventen und Berufstätige mit praxiserprobtem Wissen für den gesamten Bewerbungsprozess. Im Einzelcoaching geht es um individuelle Zielplanung und Karriereplanung — sein bisher bestes Ergebnis: ein Gehaltssprung von 55.000 € auf 84.000 € brutto/Jahr für einen Mandanten.`,
    specialties: ['Bewerbungsstrategie', 'Gehaltsverhandlung', 'Vorstellungsgespräche', 'Karriereplanung'],
    seminarIds: ['sem-motivation', 'sem-konflikt', 'sem-homeoffice'],
    masterclassIds: [],
  },
  {
    id: 'alexander-zill',
    name: 'Alexander Zill',
    title: 'Mitgründer & Leiter Karriere-Institut',
    initials: 'AZ',
    gradient: 'linear-gradient(135deg, #1d4d2e 0%, #0e2818 100%)',
    sinceYear: 2005,
    short: '30+ Jahre Coaching-Erfahrung · Schwerpunkt Persönlichkeitsentwicklung und Führungskräfte-Coaching.',
    bio: `Mitgründer und Leiter des Karriere-Instituts. Neben der strategischen Ausrichtung hält er Seminare zu verschiedenen Bereichen der Persönlichkeitsentwicklung und ist als Coach schwerpunktmäßig für Führungskräfte und angehende Führungskräfte tätig. Mit über 30 Jahren Erfahrung in der Begleitung von Fach- und Führungskräften — von den ersten Weichenstellungen bis zur Existenzgründung.`,
    specialties: ['Personal Leadership', 'Führungskräfte-Coaching', 'Persönlichkeitsentwicklung', 'Unternehmensgründung'],
    seminarIds: ['sem-leadership', 'sem-speedreading', 'sem-achtsamkeit', 'sem-worklife'],
    masterclassIds: [],
  },
];

export function getCoachesForSeminar(seminarId) {
  return COACHES.filter(c => c.seminarIds.includes(seminarId));
}

export function getCoachesForMasterclass(courseId) {
  return COACHES.filter(c => c.masterclassIds.includes(courseId));
}

// Aktive Coaches = haben mindestens 1 Seminar oder 1 Masterclass zugeordnet.
// Coaches ohne Aktivitäten werden auf der /coaches-Seite ausgeblendet.
export function getActiveCoaches() {
  return COACHES.filter(c => c.seminarIds.length > 0 || c.masterclassIds.length > 0);
}
