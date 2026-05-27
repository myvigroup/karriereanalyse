// Helper-Funktionen für Coaches.
// Coach-Daten werden ab jetzt aus Supabase (public.coaches Tabelle) geladen.
// Verwende `loadCoaches()` aus `@/lib/coaches-server.js` für Server-Components,
// oder `useCoaches()` (TODO: später) für Client-Components.

// Konsolidierte Schwerpunkt-Gruppen für die Filter-Pillen.
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
    tags: ['Bewerbungsstrategie', 'Vorstellungsgespräche', 'Networking'],
  },
  {
    key: 'kommunikation',
    label: 'Kommunikation',
    tags: ['Rhetorik & Dialektik', 'Typgerechtes Lernen', 'Personal Branding', 'Konfliktmanagement'],
  },
  {
    key: 'persoenlichkeit',
    label: 'Persönlichkeit',
    tags: ['Persönlichkeitsentwicklung', 'Personal Development', 'Achtsamkeit', 'Work-Life-Balance', 'Prioritätenmanagement'],
  },
  {
    key: 'gehalt',
    label: 'Gehalt & Finanzen',
    tags: ['Gehaltsverhandlung', 'Unternehmensgründung', 'Geldmindset', 'Finanzielle Intelligenz', 'Vermögensaufbau'],
  },
];

// Mapping von DB-Snake-Case zu JS-camelCase (für UI-Code)
export function dbCoachToUi(row) {
  if (!row) return null;
  return {
    id: row.id,
    name: row.name,
    role: row.role || '',
    title: row.title || '',
    initials: row.initials,
    gradient: row.gradient,
    photoUrl: row.photo_url,
    status: row.status || 'available',
    sinceYear: row.since_year,
    experience: row.experience || '',
    rating: parseFloat(row.rating || 5),
    sessionCount: row.session_count || 0,
    responseTime: row.response_time || '< 24 Std',
    location: row.location || '',
    languages: row.languages || ['Deutsch'],
    short: row.short || '',
    bio: row.bio || '',
    successStory: row.success_story || '',
    specialties: row.specialties || [],
    industries: row.industries || [],
    slots: row.slots || [],
    seminarIds: row.seminar_ids || [],
    masterclassIds: row.masterclass_ids || [],
    external: !!row.external,
    poweredBy: row.powered_by || null,
    isActive: row.is_active !== false,
    sortOrder: row.sort_order || 100,
  };
}

// ─── Helper über bereits geladenes Coach-Array ─────────────────────────────
// (Die Liste muss VORHER per loadCoaches() server-side geladen werden.)

export function getCoachesForSeminar(coaches, seminarId) {
  return (coaches || []).filter(c => c.seminarIds.includes(seminarId));
}

export function getCoachesForMasterclass(coaches, courseId) {
  return (coaches || []).filter(c => c.masterclassIds.includes(courseId));
}

export function getActiveCoaches(coaches) {
  return (coaches || []).filter(c =>
    c.isActive && (c.seminarIds.length > 0 || c.masterclassIds.length > 0)
  );
}

export function getActiveSpecialtyGroups(coaches) {
  const active = getActiveCoaches(coaches);
  return SPECIALTY_GROUPS.filter(g =>
    active.some(c => c.specialties.some(s => g.tags.includes(s)))
  );
}

export function filterCoachesByGroup(coaches, groupKey) {
  const group = SPECIALTY_GROUPS.find(g => g.key === groupKey);
  if (!group) return getActiveCoaches(coaches);
  return getActiveCoaches(coaches).filter(c =>
    c.specialties.some(s => group.tags.includes(s))
  );
}
