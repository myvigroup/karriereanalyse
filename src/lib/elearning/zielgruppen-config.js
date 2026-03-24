// ============================================================================
// Zentrale Zielgruppen-Config für ALLE 6 E-Learnings
// EINE Datei steuert die Personalisierung: hide/highlight pro Phase
// ============================================================================

export const PHASEN = {
  student:        { label: '🎓 Student/in', kurzform: 'Student' },
  einsteiger:     { label: '🚀 Berufseinsteiger', kurzform: 'Einsteiger' },
  professional:   { label: '💼 Berufserfahren', kurzform: 'Profi' },
  fuehrungskraft: { label: '👑 Führungskraft', kurzform: 'FK' },
  investor:       { label: '💰 Investor/Unternehmer', kurzform: 'Investor' },
};

// Kurs-IDs
const KURS_IDS = {
  kommunikation: 'c1000000-0000-0000-0000-000000000001',
  balance:       'c1000000-0000-0000-0000-000000000002',
  networking:    'c1000000-0000-0000-0000-000000000003',
  speedreading:  'c1000000-0000-0000-0000-000000000004',
  lernen:        'c1000000-0000-0000-0000-000000000005',
  prioritaeten:  'c1000000-0000-0000-0000-000000000006',
};

export const KURS_ID_TO_SLUG = Object.fromEntries(
  Object.entries(KURS_IDS).map(([slug, id]) => [id, slug])
);

// ═══ PERSONALISIERUNG PRO KURS ═══
export const KURS_CONFIG = {

  prioritaeten: {
    student:        { label: 'Fokus: Studium & erste Stelle organisieren', hide: ['delegation_advanced', 'strategische_planung'], highlight: ['eisenhower', 'timeboxing', 'prokrastination'] },
    einsteiger:     { label: 'Fokus: Aufgaben priorisieren, Nein sagen lernen', hide: ['strategische_planung'], highlight: ['eisenhower', 'nein_sagen', 'batching'] },
    professional:   { label: 'Fokus: Projekte steuern, delegieren, Energie managen', hide: [], highlight: ['delegation', 'nein_sagen', 'batching', 'energie'] },
    fuehrungskraft: { label: 'Fokus: Strategische Prioritäten, Team-Kapazität', hide: ['prokrastination'], highlight: ['delegation', 'strategische_planung', 'energie'] },
    investor:       { label: 'Fokus: Deal-Flow, Portfolio-Management', hide: ['prokrastination', 'timeboxing'], highlight: ['eisenhower', 'delegation', 'batching'] },
  },

  kommunikation: {
    student:        { label: 'Fokus: Bewerbungsgespräche, Präsentationen', hide: ['krisenkommunikation', 'c_level'], highlight: ['elevator_pitch', 'feedback', 'smalltalk', 'email'] },
    einsteiger:     { label: 'Fokus: Meetings, Feedback, erste Konflikte', hide: ['krisenkommunikation'], highlight: ['feedback', 'email', 'smalltalk', 'deeskalation'] },
    professional:   { label: 'Fokus: Verhandlung, Konflikte, Stakeholder', hide: [], highlight: ['verhandlung', 'konflikt', 'storytelling', 'deeskalation'] },
    fuehrungskraft: { label: 'Fokus: Team führen, Krisen, Board-Präsentationen', hide: ['bewerbung', 'smalltalk'], highlight: ['krisenkommunikation', 'storytelling', 'koerpersprache'] },
    investor:       { label: 'Fokus: Pitch-Bewertung, Verhandlung', hide: ['bewerbung', 'smalltalk', 'email'], highlight: ['verhandlung', 'storytelling', 'koerpersprache'] },
  },

  networking: {
    student:        { label: 'Fokus: Erstes Netzwerk, Mentor finden, LinkedIn starten', hide: ['c_level', 'b2b', 'branchen'], highlight: ['mentor', 'linkedin', 'opener', 'follow_up'] },
    einsteiger:     { label: 'Fokus: Netzwerk aufbauen, Events meistern', hide: ['c_level', 'b2b'], highlight: ['linkedin', 'follow_up', 'wert_geschenke', 'crm'] },
    professional:   { label: 'Fokus: Netzwerk vertiefen, Hubs finden, Sichtbarkeit', hide: [], highlight: ['crm', 'hub_finder', 'dark_social', 'wert_geschenke'] },
    fuehrungskraft: { label: 'Fokus: C-Level Networking, strategische Allianzen', hide: ['linkedin_basics', 'opener'], highlight: ['c_level', 'gatekeeper', 'strategisch', 'cross_generational'] },
    investor:       { label: 'Fokus: Deal-Flow Netzwerk, Co-Investoren', hide: ['linkedin_basics', 'opener', 'introvertierte'], highlight: ['hub_finder', 'b2b', 'dark_social', 'strategisch'] },
  },

  speedreading: {
    student:        { label: 'Fokus: Lehrbücher, Skripte, Prüfungsvorbereitung', hide: ['executive'], highlight: ['wpm', 'chunk', 'sq3r', 'textverstaendnis'] },
    einsteiger:     { label: 'Fokus: Fachliteratur & E-Mails effizient verarbeiten', hide: ['executive'], highlight: ['wpm', 'chunk', 'skimming', 'email'] },
    professional:   { label: 'Fokus: 200 E-Mails/Tag, Reports, Fachartikel', hide: [], highlight: ['email', 'skimming', 'relevanz', 'differenzierung'] },
    fuehrungskraft: { label: 'Fokus: Executive Summaries, Board-Papers', hide: [], highlight: ['executive', 'skimming', 'relevanz', 'differenzierung'] },
    investor:       { label: 'Fokus: Pitch-Decks, Due Diligence, Marktanalysen', hide: [], highlight: ['executive', 'relevanz', 'informationsflut'] },
  },

  lernen: {
    student:        { label: 'Fokus: Lerntyp entdecken, Prüfungen meistern', hide: ['executive_abstractor', 'unlearn', 'team_lernen'], highlight: ['lerntyp', 'vergessenskurve', 'pruefung', 'lerngruppen'] },
    einsteiger:     { label: 'Fokus: Effizient lernen im Berufsalltag', hide: ['executive_abstractor', 'team_lernen'], highlight: ['feynman', 'pomodoro', 'spaced_repetition', 'flow'] },
    professional:   { label: 'Fokus: Verlernen, Micro-Learning, Skill-Stacking', hide: ['pruefung', 'mentor_mirror'], highlight: ['unlearn', 'micro_learning', 'skill_stacking', 'lern_roi'] },
    fuehrungskraft: { label: 'Fokus: Team-Lernkultur, Executive Learning', hide: ['pruefung', 'mentor_mirror'], highlight: ['team_lernen', 'executive_abstractor', 'wissenstransfer'] },
    investor:       { label: 'Fokus: Schnelle Synthese, Mustererkennung', hide: ['pruefung', 'mentor_mirror', 'team_lernen', 'lerngruppen'], highlight: ['executive_abstractor', 'synthese', 'entscheidungs_journal'] },
  },

  balance: {
    student:        { label: 'Fokus: Social Media Kontrolle, Schlaf, Studium-Freizeit', hide: ['fuehrungskraefte', 'eltern'], highlight: ['digital_detox', 'schlaf', 'lebensrad', 'grenzen'] },
    einsteiger:     { label: 'Fokus: Feierabend lernen, Grenzen setzen', hide: ['fuehrungskraefte'], highlight: ['shutdown_ritual', 'grenzen', 'burnout', 'digital_detox'] },
    professional:   { label: 'Fokus: Burnout-Prävention, Energie managen', hide: [], highlight: ['burnout', 'shutdown_ritual', 'energie', 'grenzen'] },
    fuehrungskraft: { label: 'Fokus: Balance vorleben, Team schützen', hide: [], highlight: ['fuehrungskraefte', 'burnout', 'grenzen', 'work_life_integration'] },
    investor:       { label: 'Fokus: High-Performance ohne Ausbrennung', hide: ['eltern', 'digital_detox'], highlight: ['energie', 'shutdown_ritual', 'burnout', 'work_life_integration'] },
  },
};

// ═══ HILFSFUNKTIONEN ═══

export function getKursConfig(courseId, userPhase) {
  const slug = KURS_ID_TO_SLUG[courseId];
  if (!slug || !KURS_CONFIG[slug]) return null;
  return KURS_CONFIG[slug][userPhase] || KURS_CONFIG[slug].einsteiger;
}

export function isLessonVisible(courseId, lessonTitle, userPhase) {
  const config = getKursConfig(courseId, userPhase);
  if (!config) return true;
  const titleLower = (lessonTitle || '').toLowerCase();
  return !config.hide.some(keyword => titleLower.includes(keyword));
}

export function isLessonHighlighted(courseId, lessonTitle, userPhase) {
  const config = getKursConfig(courseId, userPhase);
  if (!config) return false;
  const titleLower = (lessonTitle || '').toLowerCase();
  return config.highlight.some(keyword => titleLower.includes(keyword));
}

export function getPhaseLabel(courseId, userPhase) {
  const config = getKursConfig(courseId, userPhase);
  return config?.label || null;
}
