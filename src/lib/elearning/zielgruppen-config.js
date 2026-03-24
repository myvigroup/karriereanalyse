// ============================================================================
// Zentrale Zielgruppen-Config für ALLE 6 E-Learnings
// 4 Phasen: Studierende, Berufseinsteiger, Berufserfahren, Führungskraft
// ============================================================================

export const PHASEN = {
  studierende:      { label: '🎓 Studierende', kurzform: 'Studi', desc: 'Studium, Praktika, Orientierung' },
  berufseinsteiger: { label: '🚀 Berufseinsteiger', kurzform: 'Einsteiger', desc: '0-3 Jahre Berufserfahrung' },
  berufserfahren:   { label: '💼 Berufserfahren', kurzform: 'Profi', desc: '3-10 Jahre, Spezialisierung' },
  fuehrungskraft:   { label: '👑 Führungskraft', kurzform: 'FK', desc: 'Personalverantwortung, Strategie, C-Level' },
};

export const KARRIERE_PHASEN_AUSWAHL = [
  { id: 'studierende', label: '🎓 Studierende', desc: 'Studium, Praktika, Berufseinstieg vorbereiten' },
  { id: 'berufseinsteiger', label: '🚀 Berufseinsteiger (0-3 Jahre)', desc: 'Erste Festanstellung, Orientierung, Skills aufbauen' },
  { id: 'berufserfahren', label: '💼 Berufserfahren (3-10 Jahre)', desc: 'Expertise vertiefen, Karriere beschleunigen, Gehalt optimieren' },
  { id: 'fuehrungskraft', label: '👑 Führungskraft / Executive', desc: 'Team leiten, strategisch denken, C-Level Netzwerk' },
];

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

export const KURS_CONFIG = {

  prioritaeten: {
    studierende:      { label: 'Fokus: Studium organisieren, Prüfungen priorisieren', hide: ['delegation_advanced', 'strategische_planung'], highlight: ['eisenhower', 'timeboxing', 'prokrastination'] },
    berufseinsteiger: { label: 'Fokus: Aufgaben priorisieren, Nein sagen lernen', hide: ['strategische_planung'], highlight: ['eisenhower', 'nein_sagen', 'batching', 'timeboxing'] },
    berufserfahren:   { label: 'Fokus: Projekte steuern, delegieren, Energie managen', hide: [], highlight: ['delegation', 'nein_sagen', 'batching', 'energie'] },
    fuehrungskraft:   { label: 'Fokus: Strategische Prioritäten, Team-Kapazität, Deal-Flow', hide: ['prokrastination'], highlight: ['delegation', 'strategische_planung', 'energie', 'batching'] },
  },

  kommunikation: {
    studierende:      { label: 'Fokus: Bewerbungsgespräche, Präsentationen, erste Meetings', hide: ['krisenkommunikation', 'c_level'], highlight: ['elevator_pitch', 'feedback', 'smalltalk', 'email'] },
    berufseinsteiger: { label: 'Fokus: Meetings meistern, Feedback geben, Konflikte lösen', hide: ['krisenkommunikation'], highlight: ['feedback', 'email', 'smalltalk', 'deeskalation'] },
    berufserfahren:   { label: 'Fokus: Verhandlung, Konflikte, Stakeholder-Management', hide: [], highlight: ['verhandlung', 'konflikt', 'storytelling', 'deeskalation'] },
    fuehrungskraft:   { label: 'Fokus: Team führen, Krisenkommunikation, Board-Präsentationen', hide: ['bewerbung'], highlight: ['krisenkommunikation', 'storytelling', 'koerpersprache', 'verhandlung'] },
  },

  networking: {
    studierende:      { label: 'Fokus: Erstes Netzwerk aufbauen, Mentor finden, LinkedIn starten', hide: ['c_level', 'b2b', 'branchen'], highlight: ['mentor', 'linkedin', 'opener', 'follow_up'] },
    berufseinsteiger: { label: 'Fokus: Netzwerk erweitern, Events meistern, Follow-Up System', hide: ['c_level', 'b2b'], highlight: ['linkedin', 'follow_up', 'wert_geschenke', 'crm'] },
    berufserfahren:   { label: 'Fokus: Netzwerk vertiefen, Hubs finden, Sichtbarkeit aufbauen', hide: [], highlight: ['crm', 'hub_finder', 'dark_social', 'wert_geschenke'] },
    fuehrungskraft:   { label: 'Fokus: C-Level Networking, strategische Allianzen, Deal-Flow', hide: ['linkedin_basics', 'opener'], highlight: ['c_level', 'gatekeeper', 'strategisch', 'hub_finder', 'b2b'] },
  },

  speedreading: {
    studierende:      { label: 'Fokus: Lehrbücher, Skripte, Prüfungsvorbereitung', hide: ['executive'], highlight: ['wpm', 'chunk', 'sq3r', 'textverstaendnis'] },
    berufseinsteiger: { label: 'Fokus: Fachliteratur & E-Mails effizient verarbeiten', hide: ['executive'], highlight: ['wpm', 'chunk', 'skimming', 'email'] },
    berufserfahren:   { label: 'Fokus: 200 E-Mails/Tag, Reports, Fachartikel meistern', hide: [], highlight: ['email', 'skimming', 'relevanz', 'differenzierung'] },
    fuehrungskraft:   { label: 'Fokus: Executive Summaries, Board-Papers, Pitch-Decks', hide: [], highlight: ['executive', 'skimming', 'relevanz', 'informationsflut'] },
  },

  lernen: {
    studierende:      { label: 'Fokus: Lerntyp entdecken, Prüfungen meistern, Grundlagen', hide: ['executive_abstractor', 'unlearn', 'team_lernen'], highlight: ['lerntyp', 'vergessenskurve', 'pruefung', 'lerngruppen'] },
    berufseinsteiger: { label: 'Fokus: Effizient lernen im Berufsalltag, Onboarding meistern', hide: ['executive_abstractor', 'team_lernen'], highlight: ['feynman', 'pomodoro', 'spaced_repetition', 'flow'] },
    berufserfahren:   { label: 'Fokus: Verlernen, Micro-Learning, Skill-Stacking', hide: ['pruefung', 'mentor_mirror'], highlight: ['unlearn', 'micro_learning', 'skill_stacking', 'lern_roi'] },
    fuehrungskraft:   { label: 'Fokus: Team-Lernkultur, Executive Learning, Synthese', hide: ['pruefung', 'mentor_mirror'], highlight: ['team_lernen', 'executive_abstractor', 'synthese', 'wissenstransfer'] },
  },

  balance: {
    studierende:      { label: 'Fokus: Social Media Kontrolle, Schlaf-Rhythmus, Studium-Freizeit', hide: ['fuehrungskraefte', 'eltern'], highlight: ['digital_detox', 'schlaf', 'lebensrad', 'revenge_bedtime'] },
    berufseinsteiger: { label: 'Fokus: Feierabend lernen, erste Grenzen setzen, Burnout verhindern', hide: ['fuehrungskraefte'], highlight: ['shutdown_ritual', 'grenzen', 'burnout', 'revenge_bedtime'] },
    berufserfahren:   { label: 'Fokus: Burnout-Prävention, Energie managen, Beziehungen retten', hide: [], highlight: ['burnout', 'energie', 'shutdown_ritual', 'beziehungs_konto'] },
    fuehrungskraft:   { label: 'Fokus: Balance vorleben, Team schützen, nachhaltige High-Performance', hide: [], highlight: ['fuehrungskraefte', 'burnout', 'identity_shift', 'energie', 'executive_recovery'] },
  },
};

// ═══ HILFSFUNKTIONEN ═══

export function getKursConfig(courseId, userPhase) {
  const slug = KURS_ID_TO_SLUG[courseId];
  if (!slug || !KURS_CONFIG[slug]) return null;
  return KURS_CONFIG[slug][userPhase] || KURS_CONFIG[slug].berufseinsteiger;
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
