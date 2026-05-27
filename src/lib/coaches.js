// Zentrale Coach-Daten — werden vom Seminar-Modal UND der /coach-Seite genutzt.
// Falls neue Coaches dazukommen oder die Zuordnung sich ändert, nur hier anpassen.
//
// HINWEIS: Bios + Schwerpunkte der neueren Coaches sind aktuell PLATZHALTER.
// Bitte ergänze die echten Daten (Foto, Bio, Schwerpunkte, Sprachen, Sessionsanzahl).
// Foto-URLs: aktuell null (= Initial-Bubble-Fallback). Sobald Coach-Fotos vorliegen,
// hier als `photoUrl: 'https://...'` einsetzen.

export const COACHES = [
  {
    id: 'carsten-hentschel',
    name: 'Carsten Hentschel',
    role: 'Senior Karriere-Coach',
    title: 'Lizenzierter Coach & Referent',
    initials: 'CH',
    gradient: 'linear-gradient(135deg, #2d3e50 0%, #1a2533 100%)',
    photoUrl: null,
    status: 'available',
    sinceYear: 2018,
    experience: '15+ J. Erfahrung',
    rating: 4.9,
    sessionCount: 540,
    responseTime: '< 6 Std',
    location: 'Hamburg',
    languages: ['Deutsch', 'Englisch'],
    short: 'Erfahrener Karriere-Coach mit Schwerpunkt Führungskräfte und Mid-Career-Wechsel.',
    bio: `Profil wird ergänzt — Carsten Hentschel begleitet seit über 15 Jahren Fach- und Führungskräfte auf ihrem Karriereweg, mit besonderem Fokus auf den Mid-Career-Wechsel.`,
    successStory: 'Erfolgsgeschichte wird ergänzt.',
    specialties: ['Karriere-Strategie', 'Mid-Career-Wechsel', 'Führungskräfte-Coaching'],
    industries: ['Industrie', 'Konzern', 'Mittelstand'],
    slots: [
      { day: 'MO', time: '14:00' },
      { day: 'DO', time: '10:00' },
      { day: 'FR', time: '15:00' },
    ],
    seminarIds: ['sem-leadership', 'sem-konflikt'],
    masterclassIds: [],
  },
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
  {
    id: 'florian-fritsch',
    name: 'Florian Fritsch',
    role: 'Lead Coach · Karriere-Strategie',
    title: 'Lizenzierter Coach & Strategieberater',
    initials: 'FF',
    gradient: 'linear-gradient(135deg, #1d3a5f 0%, #0c1f36 100%)',
    photoUrl: null,
    status: 'available',
    sinceYear: 2017,
    experience: '12+ J. Erfahrung',
    rating: 4.9,
    sessionCount: 480,
    responseTime: '< 4 Std',
    location: 'Berlin',
    languages: ['Deutsch', 'Englisch'],
    short: 'Spezialisiert auf Karriere-Strategie, Gehaltsverhandlung und Personal Branding.',
    bio: `Profil wird ergänzt — Florian Fritsch arbeitet seit über 12 Jahren mit ambitionierten Berufseinsteiger:innen und Senior-Talenten. Schwerpunkte: Karriere-Strategie, Gehaltsverhandlung und positionierende Personal Brands.`,
    successStory: 'Erfolgsgeschichte wird ergänzt.',
    specialties: ['Gehaltsverhandlung', 'Karriere-Strategie', 'Personal Branding', 'C-Level-Coaching'],
    industries: ['FinTech', 'B2B SaaS', 'Beratung', 'Tech'],
    slots: [
      { day: 'MO', time: '11:00' },
      { day: 'DI', time: '14:00' },
      { day: 'MI', time: '16:00' },
    ],
    seminarIds: ['sem-motivation', 'sem-rhetorik'],
    masterclassIds: [],
  },
  {
    id: 'mario-jatzke',
    name: 'Mario Jatzke',
    role: 'Karriere-Coach · Bewerbungsstrategie',
    title: 'Lizenzierter Coach',
    initials: 'MJ',
    gradient: 'linear-gradient(135deg, #5d3a91 0%, #3a2266 100%)',
    photoUrl: null,
    status: 'available',
    sinceYear: 2020,
    experience: '8+ J. Erfahrung',
    rating: 4.8,
    sessionCount: 280,
    responseTime: '< 6 Std',
    location: 'München',
    languages: ['Deutsch'],
    short: 'Schwerpunkt Bewerbungsprozess, Vorstellungsgespräche und Quereinstieg.',
    bio: `Profil wird ergänzt — Mario Jatzke begleitet seit über 8 Jahren Bewerber:innen auf dem Weg in die nächste Position, mit besonderem Fokus auf den Quereinstieg und souveräne Vorstellungsgespräche.`,
    successStory: 'Erfolgsgeschichte wird ergänzt.',
    specialties: ['Bewerbungsstrategie', 'Vorstellungsgespräche', 'Quereinstieg', 'Karriereplanung'],
    industries: ['Engineering', 'IT', 'Handwerk'],
    slots: [
      { day: 'DI', time: '09:00' },
      { day: 'DO', time: '15:00' },
    ],
    seminarIds: ['sem-konflikt', 'sem-homeoffice'],
    masterclassIds: [],
  },
  {
    id: 'joerg-jacob',
    name: 'Jörg Jacob',
    role: 'Senior Karriere-Coach',
    title: 'Lizenzierter Coach & Referent',
    initials: 'JJ',
    gradient: 'linear-gradient(135deg, #8a4a14 0%, #4d2906 100%)',
    photoUrl: null,
    status: 'available',
    sinceYear: 2016,
    experience: '20+ J. Erfahrung',
    rating: 4.9,
    sessionCount: 720,
    responseTime: '< 6 Std',
    location: 'Hannover',
    languages: ['Deutsch', 'Englisch'],
    short: 'Erfahrener Coach mit Schwerpunkt Persönlichkeitsentwicklung und Senior-Talente.',
    bio: `Profil wird ergänzt — Jörg Jacob bringt über 20 Jahre Erfahrung in der Begleitung von Senior-Talenten und Führungskräften mit. Schwerpunkte: Persönlichkeitsentwicklung, strategische Karriereplanung und Mid-Life-Career-Wechsel.`,
    successStory: 'Erfolgsgeschichte wird ergänzt.',
    specialties: ['Persönlichkeitsentwicklung', 'Senior-Coaching', 'Karriere-Strategie', 'Mid-Life-Wechsel'],
    industries: ['Konzern', 'Mittelstand', 'Beratung'],
    slots: [
      { day: 'MO', time: '15:00' },
      { day: 'MI', time: '11:00' },
    ],
    seminarIds: ['sem-leadership', 'sem-worklife'],
    masterclassIds: [],
  },
  {
    id: 'julia-jacob',
    name: 'Julia Jacob',
    role: 'Karriere-Coach · Personal Development',
    title: 'Lizenzierte Coach',
    initials: 'JJ',
    gradient: 'linear-gradient(135deg, #b8336a 0%, #6b1d3c 100%)',
    photoUrl: null,
    status: 'available',
    sinceYear: 2021,
    experience: '7+ J. Erfahrung',
    rating: 4.9,
    sessionCount: 240,
    responseTime: '< 4 Std',
    location: 'Berlin',
    languages: ['Deutsch', 'Englisch'],
    short: 'Schwerpunkt Personal Development, Achtsamkeit und Work-Life-Balance.',
    bio: `Profil wird ergänzt — Julia Jacob ist spezialisiert auf Personal Development, Achtsamkeit und nachhaltige Work-Life-Balance. Sie unterstützt insbesondere Frauen in Führungspositionen sowie ambitionierte Berufseinsteigerinnen.`,
    successStory: 'Erfolgsgeschichte wird ergänzt.',
    specialties: ['Personal Development', 'Achtsamkeit', 'Work-Life-Balance', 'Female Leadership'],
    industries: ['Beratung', 'Tech', 'Healthcare'],
    slots: [
      { day: 'DI', time: '11:00' },
      { day: 'DO', time: '17:00' },
      { day: 'FR', time: '09:00' },
    ],
    seminarIds: ['sem-achtsamkeit', 'sem-motivation'],
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

// Konsolidierte Schwerpunkt-Gruppen für die Filter-Pillen (sonst werden's 20+).
// Jede Gruppe enthält die spezifischen Specialty-Tags, die unter sie fallen.
export const SPECIALTY_GROUPS = [
  {
    key: 'strategie',
    label: 'Karriere-Strategie',
    tags: ['Karriere-Strategie', 'Karriereplanung', 'Mid-Career-Wechsel', 'Mid-Life-Wechsel', 'Quereinstieg', 'Karriere-Einstieg'],
  },
  {
    key: 'fuehrung',
    label: 'Führung',
    tags: ['Führungskräfte-Coaching', 'Personal Leadership', 'C-Level-Coaching', 'Senior-Coaching', 'Female Leadership'],
  },
  {
    key: 'bewerbung',
    label: 'Bewerbung',
    tags: ['Bewerbungsstrategie', 'Vorstellungsgespräche'],
  },
  {
    key: 'kommunikation',
    label: 'Kommunikation',
    tags: ['Rhetorik & Dialektik', 'Typgerechtes Lernen', 'Personal Branding'],
  },
  {
    key: 'persoenlichkeit',
    label: 'Persönlichkeit',
    tags: ['Persönlichkeitsentwicklung', 'Personal Development', 'Achtsamkeit', 'Work-Life-Balance'],
  },
  {
    key: 'gehalt',
    label: 'Gehalt & Gründung',
    tags: ['Gehaltsverhandlung', 'Unternehmensgründung'],
  },
];

// Liefert die Filter-Gruppen, die mindestens 1 aktiven Coach haben.
export function getActiveSpecialtyGroups() {
  const active = getActiveCoaches();
  return SPECIALTY_GROUPS.filter(g =>
    active.some(c => c.specialties.some(s => g.tags.includes(s)))
  );
}

// Filter Coaches nach Gruppen-Key (z.B. 'fuehrung').
export function getCoachesByGroup(groupKey) {
  const group = SPECIALTY_GROUPS.find(g => g.key === groupKey);
  if (!group) return getActiveCoaches();
  return getActiveCoaches().filter(c =>
    c.specialties.some(s => group.tags.includes(s))
  );
}

// Backward-compatibility (falls noch irgendwo verwendet)
export function getAllSpecialties() {
  const set = new Set();
  getActiveCoaches().forEach(c => c.specialties.forEach(s => set.add(s)));
  return Array.from(set);
}
