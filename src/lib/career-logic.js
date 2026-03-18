/**
 * KARRIERE-INSTITUT — Career Logic Engine
 * 
 * Berechnet: PRIO 1-3, Marktwert-Impact, Scores, Level-Progression
 */

// ============================================================
// 1. ANALYSE-SCORING
// ============================================================

/**
 * Berechnet den Score eines Kompetenzfelds aus 5 Antworten (je 1-10)
 * @param {number[]} answers - Array von 5 Werten (1-10)
 * @returns {number} Score 0-100
 */
export function calculateFieldScore(answers) {
  if (!answers || answers.length === 0) return 0;
  const sum = answers.reduce((a, b) => a + b, 0);
  return Math.round((sum / (answers.length * 10)) * 100);
}

/**
 * Berechnet den Gesamtscore über alle 13 Felder
 * @param {Object[]} fieldScores - Array von { fieldId, score }
 * @returns {number} Gesamtscore 0-100
 */
export function calculateOverallScore(fieldScores) {
  if (!fieldScores || fieldScores.length === 0) return 0;
  const sum = fieldScores.reduce((a, b) => a + b.score, 0);
  return Math.round(sum / fieldScores.length);
}

/**
 * Ermittelt PRIO 1-3 (die 3 schwächsten Kompetenzfelder)
 * @param {Object[]} fieldScores - Array von { fieldId, score, title }
 * @returns {{ prio1: Object, prio2: Object, prio3: Object }}
 */
export function calculatePriorities(fieldScores) {
  if (!fieldScores || fieldScores.length < 3) return { prio1: null, prio2: null, prio3: null };
  const sorted = [...fieldScores].sort((a, b) => a.score - b.score);
  return {
    prio1: sorted[0],
    prio2: sorted[1],
    prio3: sorted[2],
  };
}

/**
 * Klassifiziert einen Score
 * @param {number} score - 0-100
 * @returns {{ label: string, color: string, level: string }}
 */
export function classifyScore(score) {
  if (score >= 80) return { label: 'Exzellent', color: '#2D6A4F', level: 'high' };
  if (score >= 60) return { label: 'Gut', color: '#D4A017', level: 'medium' };
  if (score >= 40) return { label: 'Ausbaufähig', color: '#E8742A', level: 'low' };
  return { label: 'Fokusbereich', color: '#CC1426', level: 'critical' };
}

// ============================================================
// 2. MARKTWERT-BERECHNUNG
// ============================================================

/**
 * Standard-Marktwert-Impact pro Kompetenzfeld (in €/Jahr)
 * Basierend auf Gehaltsforschung: Welche Skills treiben Gehalt am stärksten?
 */
export const FIELD_MARKET_WEIGHTS = {
  verhandlung: 1.8,      // Höchster Impact: Direkt gehaltswirksam
  fuehrung: 1.6,          // Führungsposition = höheres Gehalt
  strategie: 1.4,         // Strategisches Denken = Entscheider-Rollen
  digitalkompetenz: 1.3,  // KI/Digital = Zukunftssicherung
  fachkompetenz: 1.2,     // Expertise = Spezialistengehalt
  selbstmarketing: 1.2,   // Sichtbarkeit = bessere Angebote
  kommunikation: 1.1,     // Kommunikation = Führungsvoraussetzung
  netzwerk: 1.1,          // Netzwerk = versteckte Opportunities
  innovation: 1.0,        // Innovation = Differenzierung
  international: 1.0,     // International = höhere Gehaltsbänder
  resilienz: 0.9,         // Resilienz = Nachhaltigkeit
  zeitmanagement: 0.8,    // Produktivität = indirekt
  sinnziel: 0.7,          // Zielfindung = Grundlage, nicht direkt monetär
};

/**
 * Berechnet den Marktwert-Zuwachs einer Lektion
 * @param {number} baseSalary - Aktuelles Gehalt
 * @param {number} targetSalary - Zielgehalt
 * @param {string} fieldSlug - Kompetenzfeld-Slug
 * @param {number} lessonImpact - Fester Impact-Wert der Lektion (aus DB)
 * @param {number} currentFieldScore - Aktueller Score des Felds (0-100)
 * @returns {number} Marktwert-Zuwachs in €
 */
export function calculateLessonMarketValue(baseSalary, targetSalary, fieldSlug, lessonImpact, currentFieldScore = 50) {
  // Basis: Der feste Impact-Wert aus der Datenbank
  let impact = lessonImpact || 500;

  // Gewichtung nach Feld-Relevanz
  const weight = FIELD_MARKET_WEIGHTS[fieldSlug] || 1.0;
  impact *= weight;

  // Schwäche-Bonus: Je niedriger der Score, desto höher der ROI
  // Score 20 → 1.5x Multiplikator, Score 80 → 0.75x
  const weaknessMultiplier = 1 + ((50 - currentFieldScore) / 100);
  impact *= Math.max(0.5, Math.min(1.8, weaknessMultiplier));

  // Gehaltslücke-Faktor: Je größer die Lücke, desto mehr Potenzial
  const gap = targetSalary - baseSalary;
  const gapFactor = gap > 0 ? Math.min(1.5, 1 + (gap / 200000)) : 1.0;
  impact *= gapFactor;

  return Math.round(impact);
}

/**
 * Berechnet den gesamten Marktwert basierend auf abgeschlossenen Lektionen
 * @param {number} baseSalary - Aktuelles Gehalt
 * @param {Object[]} completedLessons - Array mit market_value_impact
 * @returns {number} Gesamter Marktwert
 */
export function calculateTotalMarketValue(baseSalary, completedLessons) {
  const bonus = (completedLessons || []).reduce((sum, l) => sum + (l.market_value_impact || 0), 0);
  return baseSalary + bonus;
}

/**
 * Berechnet den Marktwert-Fortschritt als Prozent
 * @param {number} current - Aktueller Marktwert
 * @param {number} base - Basis-Gehalt
 * @param {number} target - Ziel-Gehalt
 * @returns {number} Prozent 0-100
 */
export function marketValueProgress(current, base, target) {
  if (target <= base) return 100;
  return Math.min(100, Math.round(((current - base) / (target - base)) * 100));
}

// ============================================================
// 3. LEVEL-SYSTEM
// ============================================================

export const LEVELS = [
  { level: 0, title: 'Newcomer', minXP: 0, icon: '○' },
  { level: 1, title: 'Talent', minXP: 100, icon: '◐' },
  { level: 2, title: 'Professional', minXP: 300, icon: '●' },
  { level: 3, title: 'High Potential', minXP: 600, icon: '◆' },
  { level: 4, title: 'Senior Expert', minXP: 1000, icon: '★' },
  { level: 5, title: 'Executive', minXP: 1500, icon: '♛' },
];

/**
 * Ermittelt das aktuelle Level basierend auf XP
 * @param {number} xp
 * @returns {Object} Level-Objekt
 */
export function getLevel(xp) {
  const level = [...LEVELS].reverse().find(l => xp >= l.minXP);
  return level || LEVELS[0];
}

/**
 * Berechnet den Fortschritt zum nächsten Level
 * @param {number} xp
 * @returns {{ current: Object, next: Object|null, progress: number }}
 */
export function getLevelProgress(xp) {
  const current = getLevel(xp);
  const nextIdx = LEVELS.findIndex(l => l.level === current.level) + 1;
  const next = nextIdx < LEVELS.length ? LEVELS[nextIdx] : null;

  if (!next) return { current, next: null, progress: 100 };

  const progress = Math.round(((xp - current.minXP) / (next.minXP - current.minXP)) * 100);
  return { current, next, progress: Math.min(100, progress) };
}

// ============================================================
// 4. XP-BERECHNUNG
// ============================================================

export const XP_VALUES = {
  lesson_complete: 25,
  course_complete: 100,
  analysis_complete: 100,
  document_uploaded: 50,
  document_accepted: 25,
  application_added: 10,
  application_offer: 200,
  badge_earned: 50,
};

/**
 * Berechnet die Gesamt-XP eines Users
 * @param {Object} stats - { lessonsCompleted, coursesCompleted, analysisCompleted, etc. }
 * @returns {number} Total XP
 */
export function calculateTotalXP(stats) {
  return (
    (stats.lessonsCompleted || 0) * XP_VALUES.lesson_complete +
    (stats.coursesCompleted || 0) * XP_VALUES.course_complete +
    (stats.analysisCompleted ? XP_VALUES.analysis_complete : 0) +
    (stats.documentsUploaded || 0) * XP_VALUES.document_uploaded +
    (stats.applicationsAdded || 0) * XP_VALUES.application_added
  );
}

// ============================================================
// 5. EMPFEHLUNGS-ENGINE
// ============================================================

/**
 * Generiert Kurs-Empfehlungen basierend auf Analyse-Ergebnissen
 * @param {Object[]} analysisResults - { fieldId, score, fieldSlug }
 * @param {Object[]} courses - Alle Kurse mit competency_field_id
 * @param {Object[]} completedLessons - Bereits abgeschlossene Lektionen
 * @returns {Object[]} Sortierte Kurs-Empfehlungen mit Priorität
 */
export function getRecommendedCourses(analysisResults, courses, completedLessons) {
  if (!analysisResults || analysisResults.length === 0) return courses;

  const completedSet = new Set((completedLessons || []).map(l => l.lesson_id));

  return courses
    .map(course => {
      const result = analysisResults.find(r => r.field_id === course.competency_field_id);
      const score = result?.score || 50;
      const totalLessons = (course.modules || []).reduce((s, m) => s + (m.lessons || []).length, 0);
      const completedCount = (course.modules || []).reduce((s, m) =>
        s + (m.lessons || []).filter(l => completedSet.has(l.id)).length, 0);

      return {
        ...course,
        fieldScore: score,
        priority: score < 40 ? 1 : score < 60 ? 2 : score < 80 ? 3 : 0,
        completedLessons: completedCount,
        totalLessons,
        progressPercent: totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0,
      };
    })
    .sort((a, b) => {
      // PRIO-Kurse zuerst, dann nach Score aufsteigend
      if (a.priority !== b.priority) return a.priority === 0 ? 1 : b.priority === 0 ? -1 : a.priority - b.priority;
      return a.fieldScore - b.fieldScore;
    });
}

// ============================================================
// 6. RADAR CHART DATA
// ============================================================

/**
 * Bereitet Daten für den Radar-Chart auf
 * @param {Object[]} results - Array von { fieldId, score, title, icon }
 * @returns {Object[]} Sortierte Daten für SVG-Rendering
 */
export function prepareRadarData(results) {
  return (results || [])
    .sort((a, b) => (a.sort_order || 0) - (b.sort_order || 0))
    .map(r => ({
      label: r.title || r.competency_fields?.title || '',
      icon: r.icon || r.competency_fields?.icon || '',
      value: r.score || 0,
      slug: r.slug || r.competency_fields?.slug || '',
    }));
}
