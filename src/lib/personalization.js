const FIELD_TO_COURSE = {
  'kommunikation': { courseId: 'c1000000-0000-0000-0000-000000000001', title: 'Kommunikation' },
  'sozialisationskompetenz': { courseId: 'c1000000-0000-0000-0000-000000000003', title: 'Networking' },
  'selbstfuersorge': { courseId: 'c1000000-0000-0000-0000-000000000002', title: 'Work-Life-Balance' },
  'kompetenzbewusstsein': { courseId: 'c1000000-0000-0000-0000-000000000004', title: 'Speedreading' },
  'selbstreflexion': { courseId: 'c1000000-0000-0000-0000-000000000005', title: 'Typgerechtes Lernen' },
  'prioritaeten': { courseId: 'c1000000-0000-0000-0000-000000000006', title: 'Prioritätenmanagement' },
};

const PHASE_MODULES = {
  student:         ['dashboard', 'coach', 'analyse', 'masterclass', 'applications', 'gehalt', 'career'],
  einsteiger:      ['dashboard', 'coach', 'analyse', 'masterclass', 'applications', 'gehalt', 'network', 'career', 'branding'],
  professional:    ['dashboard', 'coach', 'analyse', 'masterclass', 'applications', 'marktwert', 'network', 'gehalt', 'career', 'branding', 'strategy/exit'],
  fuehrungskraft:  ['dashboard', 'coach', 'analyse', 'masterclass', 'marktwert', 'network', 'gehalt', 'career', 'branding', 'strategy/exit'],
  investor:        ['dashboard', 'coach', 'analyse', 'marktwert', 'network', 'career'],
  pre_coaching:    null, // show all (default)
  active:          null,
  alumni:          null,
  inactive:        null,
};

export function getPersonalization(analysisResults, userPhase) {
  const phase = userPhase || 'einsteiger';
  const visibleModules = PHASE_MODULES[phase] || null;

  if (!analysisResults || analysisResults.length === 0) {
    return { visibleModules, recommendations: [], weakFields: [], strongFields: [] };
  }

  const sorted = [...analysisResults].sort((a, b) => a.score - b.score);
  const weakFields = sorted.filter(r => r.score < 50);
  const strongFields = sorted.filter(r => r.score >= 70).reverse();

  const recommendations = weakFields
    .map(w => {
      const slug = w.field_slug || w.slug || '';
      return FIELD_TO_COURSE[slug];
    })
    .filter(Boolean);

  return { visibleModules, recommendations, weakFields, strongFields };
}

export { FIELD_TO_COURSE, PHASE_MODULES };
