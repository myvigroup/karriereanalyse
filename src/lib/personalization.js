// src/lib/personalization.js
// ADAPTIVES LERNSYSTEM: 13 Kompetenzfelder → 6 E-Learnings → Personalisierter Lernpfad

export const KOMPETENZFELDER = [
  { slug: 'sozialkompetenz', label: 'Sozialkompetenz', icon: '🤝' },
  { slug: 'sozialisationskompetenz', label: 'Sozialisationskompetenz', icon: '🌐' },
  { slug: 'praesentationskompetenz', label: 'Präsentationskompetenz', icon: '🎤' },
  { slug: 'selbstwertgefuehl', label: 'Selbstwertgefühl', icon: '💎' },
  { slug: 'kompetenzbewusstsein', label: 'Kompetenzbewusstsein', icon: '💡' },
  { slug: 'kommunikation', label: 'Kommunikation', icon: '💬' },
  { slug: 'charisma', label: 'Charisma', icon: '✨' },
  { slug: 'resilienz', label: 'Resilienz', icon: '🔥' },
  { slug: 'prioritaeten', label: 'Prioritätenmanagement', icon: '🎯' },
  { slug: 'fuehrungskompetenz', label: 'Führungskompetenz', icon: '👑' },
  { slug: 'selbstfuersorge', label: 'Selbstfürsorge', icon: '🧘' },
  { slug: 'emotionale_intelligenz', label: 'Emotionale Intelligenz', icon: '❤️' },
  { slug: 'selbstreflexion', label: 'Selbstreflexion', icon: '🔮' },
];

// Welches Kompetenzfeld triggert welchen Kurs? (gewichtet)
export const FELD_ZU_KURS = {
  'kommunikation':           { kursId: 'c1000000-0000-0000-0000-000000000001', gewicht: 1.0 },
  'praesentationskompetenz': { kursId: 'c1000000-0000-0000-0000-000000000001', gewicht: 0.8 },
  'charisma':                { kursId: 'c1000000-0000-0000-0000-000000000001', gewicht: 0.5 },
  'selbstfuersorge':         { kursId: 'c1000000-0000-0000-0000-000000000002', gewicht: 1.0 },
  'resilienz':               { kursId: 'c1000000-0000-0000-0000-000000000002', gewicht: 0.7 },
  'emotionale_intelligenz':  { kursId: 'c1000000-0000-0000-0000-000000000002', gewicht: 0.5 },
  'sozialisationskompetenz': { kursId: 'c1000000-0000-0000-0000-000000000003', gewicht: 1.0 },
  'sozialkompetenz':         { kursId: 'c1000000-0000-0000-0000-000000000003', gewicht: 0.8 },
  'kompetenzbewusstsein':    { kursId: 'c1000000-0000-0000-0000-000000000004', gewicht: 1.0 },
  'selbstreflexion':         { kursId: 'c1000000-0000-0000-0000-000000000005', gewicht: 1.0 },
  'selbstwertgefuehl':      { kursId: 'c1000000-0000-0000-0000-000000000005', gewicht: 0.5 },
  'prioritaeten':            { kursId: 'c1000000-0000-0000-0000-000000000006', gewicht: 1.0 },
  'fuehrungskompetenz':      { kursId: 'c1000000-0000-0000-0000-000000000006', gewicht: 0.6 },
};

export const KURSE = {
  'c1000000-0000-0000-0000-000000000001': { title: 'Kommunikation', farbe: '#2563EB', icon: '💬', slug: 'kommunikation' },
  'c1000000-0000-0000-0000-000000000002': { title: 'Work-Life-Balance', farbe: '#10B981', icon: '⚖️', slug: 'balance' },
  'c1000000-0000-0000-0000-000000000003': { title: 'Networking', farbe: '#059669', icon: '🤝', slug: 'networking' },
  'c1000000-0000-0000-0000-000000000004': { title: 'Speedreading', farbe: '#F59E0B', icon: '📖', slug: 'speedreading' },
  'c1000000-0000-0000-0000-000000000005': { title: 'Typgerechtes Lernen', farbe: '#8B5CF6', icon: '🧠', slug: 'lernen' },
  'c1000000-0000-0000-0000-000000000006': { title: 'Prioritätenmanagement', farbe: '#CC1426', icon: '🎯', slug: 'prioritaeten' },
};

// ── Phase-basierte Modul-Sichtbarkeit ──
const PHASE_MODULES = {
  studierende:     ['dashboard', 'coach', 'analyse', 'masterclass', 'applications', 'gehalt', 'career'],
  berufseinsteiger:['dashboard', 'coach', 'analyse', 'masterclass', 'applications', 'gehalt', 'network', 'career', 'branding'],
  berufserfahren:  ['dashboard', 'coach', 'analyse', 'masterclass', 'applications', 'marktwert', 'network', 'gehalt', 'career', 'branding', 'strategy/exit'],
  fuehrungskraft:  ['dashboard', 'coach', 'analyse', 'masterclass', 'marktwert', 'network', 'gehalt', 'career', 'branding', 'strategy/exit'],
  pre_coaching:    null,
  active:          null,
  alumni:          null,
  inactive:        null,
};

// ── Legacy-Kompatibilität (FIELD_TO_COURSE) ──
const FIELD_TO_COURSE = {
  'kommunikation': { courseId: 'c1000000-0000-0000-0000-000000000001', title: 'Kommunikation' },
  'sozialisationskompetenz': { courseId: 'c1000000-0000-0000-0000-000000000003', title: 'Networking' },
  'selbstfuersorge': { courseId: 'c1000000-0000-0000-0000-000000000002', title: 'Work-Life-Balance' },
  'kompetenzbewusstsein': { courseId: 'c1000000-0000-0000-0000-000000000004', title: 'Speedreading' },
  'selbstreflexion': { courseId: 'c1000000-0000-0000-0000-000000000005', title: 'Typgerechtes Lernen' },
  'prioritaeten': { courseId: 'c1000000-0000-0000-0000-000000000006', title: 'Prioritätenmanagement' },
};

// ══════════════════════════════════════════════════
// HAUPTFUNKTION: Personalisierter Lernpfad
// ══════════════════════════════════════════════════

export function berechnePersonalisierung(analyseErgebnisse, userPhase) {
  if (!analyseErgebnisse || analyseErgebnisse.length === 0) {
    return {
      empfohleneKurse: Object.entries(KURSE).map(([id, k]) => ({
        kursId: id, ...k, relevanz: 50, felder: [], istSchwaeche: false,
        empfehlung: 'Starte deine Karriere-Analyse um personalisierte Empfehlungen zu erhalten.',
      })),
      schwaechen: [], staerken: [], gesamtScore: 0, marktwertPotenzial: 0,
      topEmpfehlung: null, userPhase: userPhase || 'berufseinsteiger',
    };
  }

  const sortiert = [...analyseErgebnisse].sort((a, b) => a.score - b.score);
  const schwaechen = sortiert.filter(r => r.score < 65);
  const staerken = sortiert.filter(r => r.score >= 75).reverse();
  const gesamtScore = Math.round(analyseErgebnisse.reduce((s, r) => s + r.score, 0) / analyseErgebnisse.length);

  // Kurs-Relevanz berechnen
  const kursScores = {};
  for (const e of analyseErgebnisse) {
    const slug = e.field_slug || e.competency_fields?.slug || '';
    const m = FELD_ZU_KURS[slug];
    if (!m) continue;
    const relevanz = (100 - e.score) * m.gewicht;
    if (!kursScores[m.kursId]) kursScores[m.kursId] = { total: 0, count: 0, felder: [] };
    kursScores[m.kursId].total += relevanz;
    kursScores[m.kursId].count += 1;
    kursScores[m.kursId].felder.push({ slug, score: e.score, label: e.competency_fields?.title || e.field_title || slug });
  }

  const empfohleneKurse = Object.entries(kursScores)
    .map(([kursId, d]) => ({
      kursId, ...KURSE[kursId],
      relevanz: Math.round(d.total / d.count),
      felder: d.felder.sort((a, b) => a.score - b.score),
      istSchwaeche: d.felder.some(f => f.score < 65),
      empfehlung: getEmpfehlung(d.felder, KURSE[kursId]?.title),
    }))
    .sort((a, b) => b.relevanz - a.relevanz);

  const marktwertPotenzial = schwaechen.length * 5;

  return {
    empfohleneKurse, gesamtScore, marktwertPotenzial,
    userPhase: userPhase || 'berufseinsteiger',
    schwaechen: schwaechen.map(s => ({
      ...s,
      label: s.competency_fields?.title || s.field_title || KOMPETENZFELDER.find(k => k.slug === (s.field_slug || s.competency_fields?.slug))?.label || s.field_slug,
    })),
    staerken: staerken.map(s => ({
      ...s,
      label: s.competency_fields?.title || s.field_title || KOMPETENZFELDER.find(k => k.slug === (s.field_slug || s.competency_fields?.slug))?.label || s.field_slug,
    })),
    topEmpfehlung: empfohleneKurse[0] || null,
  };
}

// Fun-First: Positive Empfehlungstexte
function getEmpfehlung(felder, titel) {
  const s = felder[0]?.score ?? 100;
  if (s < 50) return `Hier liegt dein GRÖSSTES Wachstumspotenzial! ${titel} kann deinen Marktwert am stärksten steigern.`;
  if (s < 65) return `Gute Basis! ${titel} macht den Sprung von gut zu herausragend.`;
  if (s < 80) return `Solide Grundlage. ${titel} gibt dir die letzten Prozente.`;
  return `Bereits stark! ${titel} gibt dir Profi-Techniken für die Meisterschaft.`;
}

// Doppel-XP für Schwächen-Kurse
export function berechneXP(basisXP, kursId, analyseErgebnisse) {
  if (!analyseErgebnisse || analyseErgebnisse.length === 0) return basisXP;
  const kursFelder = Object.entries(FELD_ZU_KURS)
    .filter(([, m]) => m.kursId === kursId)
    .map(([slug]) => slug);
  const istSchwaeche = analyseErgebnisse.some(r => {
    const slug = r.field_slug || r.competency_fields?.slug || '';
    return kursFelder.includes(slug) && r.score < 65;
  });
  return istSchwaeche ? basisXP * 2 : basisXP;
}

// ── Legacy getPersonalization (Sidebar etc.) ──
export function getPersonalization(analysisResults, userPhase) {
  const phase = userPhase || 'berufseinsteiger';
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
