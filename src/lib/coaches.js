// Zentrale Coach-Daten — werden vom Seminar-Modal UND der /coach-Seite genutzt.
// Falls neue Coaches dazukommen oder die Zuordnung sich ändert, nur hier anpassen.
//
// Foto-URLs: aktuell null (= Initial-Bubble-Fallback). Sobald Coach-Fotos vorliegen,
// hier als `photoUrl: 'https://...'` einsetzen.

export const COACHES = [
  {
    id: 'marie-luise-lambein',
    name: 'Marie-Luise Lambein',
    role: 'Karriere-Coach · Hauptreferentin',
    title: 'Lizenzierte Referentin & Coach',
    initials: 'ML',
    gradient: 'linear-gradient(135deg, #8b1832 0%, #4a0a14 100%)',
    photoUrl: null,
    status: 'available',
    sinceYear: 2019,
    experience: '6+ J. Erfahrung',
    rating: 4.9,
    sessionCount: 320,
    responseTime: '< 4 Std',
    location: 'Hannover',
    languages: ['Deutsch', 'Englisch'],
    short: 'Seit 2019 lizensierte Referentin · Spezialistin für Rhetorik, Lerntypen und den Karriereeinstieg.',
    bio: `Seit 2019 lizensierte Referentin des Karriere-Instituts. Angefangen als Coach für karriererelevante Fragestellungen und als Referentin für das Karriereseminar Grundlagen — heute bildet sie alle neuen Onboarder für das Grundlagen-Seminar aus und hält die Seminare „Rhetorik, Dialektik, Kinesik", „Typgerechtes Lernen" und „Karriereseminar Entwicklung".`,
    successStory: 'Beste Gehaltsverhandlung: +25% Gehalt für einen Mandanten nach gezieltem Coaching auf Selbstbewusstsein und Verhandlungsführung.',
    specialties: ['Rhetorik & Dialektik', 'Typgerechtes Lernen', 'Karriere-Einstieg', 'Gehaltsverhandlung'],
    industries: ['Studium & Einstieg', 'Beratung', 'Mittelstand'],
    slots: [
      { day: 'MO', time: '10:00' },
      { day: 'MI', time: '14:00' },
      { day: 'FR', time: '11:30' },
    ],
    seminarIds: ['sem-rhetorik', 'sem-typgerecht', 'sem-kommunikation'],
    masterclassIds: [],
  },
  {
    id: 'maximilian-wimmer',
    name: 'Maximilian Wimmer',
    role: 'Karriere-Coach · Bewerbungsstrategie',
    title: 'Lizenzierter Referent & Coach',
    initials: 'MW',
    gradient: 'linear-gradient(135deg, #1d4e89 0%, #0f2e4f 100%)',
    photoUrl: null,
    status: 'available',
    sinceYear: 2021,
    experience: '4+ J. Erfahrung',
    rating: 4.8,
    sessionCount: 210,
    responseTime: '< 6 Std',
    location: 'München',
    languages: ['Deutsch', 'Englisch'],
    short: 'Seit 2021 Referent & Coach · Schwerpunkt Bewerbungsprozess, Gehaltsverhandlung und Karriereplanung.',
    bio: `Seit 29.03.2021 als lizenzierter Referent und Coach im Karriere-Institut tätig. Hält regelmäßig Karriereseminare für Studierende, Absolventen und Berufstätige mit praxiserprobtem Wissen für den gesamten Bewerbungsprozess. Im Einzelcoaching geht es um individuelle Zielplanung und Karriereplanung.`,
    successStory: 'Hat einen Ingenieur in eine neue Position begleitet — mit einem Gehaltssprung von 55.000 € auf 84.000 € brutto/Jahr.',
    specialties: ['Bewerbungsstrategie', 'Gehaltsverhandlung', 'Vorstellungsgespräche', 'Karriereplanung'],
    industries: ['Engineering', 'IT & Tech', 'Industrie'],
    slots: [
      { day: 'DI', time: '09:00' },
      { day: 'DO', time: '15:00' },
      { day: 'FR', time: '17:00' },
    ],
    seminarIds: ['sem-motivation', 'sem-konflikt', 'sem-homeoffice'],
    masterclassIds: [],
  },
  {
    id: 'alexander-zill',
    name: 'Alexander Zill',
    role: 'Mitgründer · Leadership-Coach',
    title: 'Mitgründer & Leiter Karriere-Institut',
    initials: 'AZ',
    gradient: 'linear-gradient(135deg, #1d4d2e 0%, #0e2818 100%)',
    photoUrl: null,
    status: 'busy',
    sinceYear: 2005,
    experience: '30+ J. Erfahrung',
    rating: 5.0,
    sessionCount: 1400,
    responseTime: '< 24 Std',
    location: 'Hannover',
    languages: ['Deutsch', 'Englisch'],
    short: '30+ Jahre Coaching-Erfahrung · Schwerpunkt Persönlichkeitsentwicklung und Führungskräfte-Coaching.',
    bio: `Mitgründer und Leiter des Karriere-Instituts. Neben der strategischen Ausrichtung hält er Seminare zu verschiedenen Bereichen der Persönlichkeitsentwicklung und ist als Coach schwerpunktmäßig für Führungskräfte und angehende Führungskräfte tätig. Mit über 30 Jahren Erfahrung in der Begleitung von Fach- und Führungskräften — von den ersten Weichenstellungen bis zur Existenzgründung.`,
    successStory: 'Begleitete einen Coachee aus tiefer Berufskrise zurück in eine erfüllende Position — die Ehefrau bedankte sich später, weil ihr Mann endlich wieder schlafen konnte.',
    specialties: ['Personal Leadership', 'Führungskräfte-Coaching', 'Persönlichkeitsentwicklung', 'Unternehmensgründung'],
    industries: ['C-Level', 'Mittelstand', 'Konzern', 'Selbstständigkeit'],
    slots: [
      { day: 'MI', time: '17:00' },
      { day: 'FR', time: '10:00' },
    ],
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
export function getActiveCoaches() {
  return COACHES.filter(c => c.seminarIds.length > 0 || c.masterclassIds.length > 0);
}

// Alle einzigartigen Schwerpunkt-Tags über alle aktiven Coaches — für die Filter-Pillen.
export function getAllSpecialties() {
  const set = new Set();
  getActiveCoaches().forEach(c => c.specialties.forEach(s => set.add(s)));
  return Array.from(set);
}
