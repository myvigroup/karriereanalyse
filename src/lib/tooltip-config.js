import { isExecutive } from './executive-mode';

const TOOLTIPS = {
  dashboard: {
    standard: { title: 'Dein Cockpit', description: 'Hier siehst du Fortschritt, Aufgaben und Streak auf einen Blick.', cta_text: 'Tagesaufgabe starten', cta_link: '/dashboard' },
    executive: { title: 'Dein Command-Center', description: '\u00DCberwache deine strategische Entwicklung und Marktpositionierung.', cta_text: 'Tagesaufgabe starten', cta_link: '/dashboard' },
  },
  coach: {
    standard: { title: 'KI-Coach', description: 'Dein pers\u00F6nlicher Mentor kennt deine Daten und hilft dir weiter.', cta_text: 'Erste Frage stellen', cta_link: '/coach' },
    executive: { title: 'Strategischer Sparringspartner', description: 'KI-gest\u00FCtztes Sparring f\u00FCr komplexe Karriereentscheidungen.', cta_text: 'Erste Frage stellen', cta_link: '/coach' },
  },
  analyse: {
    standard: { title: 'Karriereanalyse', description: '65 Fragen, 13 Kompetenzfelder, ca. 15 Minuten. Die Basis f\u00FCr alles.', cta_text: 'Analyse starten', cta_link: '/analyse' },
    executive: { title: 'Strategische Standortbestimmung', description: 'Umfassende Kompetenzanalyse f\u00FCr F\u00FChrungskr\u00E4fte und Executives.', cta_text: 'Analyse starten', cta_link: '/analyse' },
  },
  masterclass: {
    standard: { title: 'Masterclass', description: 'Kurse mit Quiz und Praxis-Aufgaben. Lerne in deinem Tempo.', cta_text: 'Ersten Kurs \u00F6ffnen', cta_link: '/masterclass' },
    executive: { title: 'Executive Education', description: 'Strategische Weiterbildung f\u00FCr maximalen Impact.', cta_text: 'Ersten Kurs \u00F6ffnen', cta_link: '/masterclass' },
  },
  gehalt: {
    standard: { title: 'Gehaltsdatenbank', description: 'Benchmarks nach Branche, Stadt und Erfahrung. Wisse was du wert bist.', cta_text: 'Gehalt vergleichen', cta_link: '/gehalt' },
    executive: { title: 'Compensation Intelligence', description: 'Markt\u00FCbersicht und Verg\u00FCtungs-Benchmarks f\u00FCr dein Segment.', cta_text: 'Gehalt vergleichen', cta_link: '/gehalt' },
  },
  marktwert: {
    standard: { title: 'Marktwert', description: 'Dein dynamischer Score steigt mit jeder Aktivit\u00E4t.', cta_text: 'Score pr\u00FCfen', cta_link: '/marktwert' },
    executive: { title: 'Marktpositionierung', description: 'Dein strategischer Marktwert im Kontext deiner Branche.', cta_text: 'Score pr\u00FCfen', cta_link: '/marktwert' },
  },
  applications: {
    standard: { title: 'Bewerbungen', description: 'Kanban-Board mit KI-Assistent f\u00FCr Anschreiben.', cta_text: 'Erste Bewerbung anlegen', cta_link: '/applications' },
    executive: { title: 'Opportunity Pipeline', description: 'Manage deine Karriere-Optionen strategisch.', cta_text: 'Erste Bewerbung anlegen', cta_link: '/applications' },
  },
  'pre-coaching': {
    standard: { title: 'Dokumenten-Safe', description: 'Upload, KI-CV-Check und Zeugnis-Decoder.', cta_text: 'CV hochladen', cta_link: '/pre-coaching' },
    executive: { title: 'Dokumenten-Safe', description: 'Zentrale Ablage mit intelligenter Analyse.', cta_text: 'CV hochladen', cta_link: '/pre-coaching' },
  },
  'salary-log': {
    standard: { title: 'Gehalts-Tagebuch', description: 'Tracke deine Erfolge f\u00FCr die n\u00E4chste Verhandlung.', cta_text: 'Ersten Win eintragen', cta_link: '/salary-log' },
    executive: { title: 'Performance-Dossier', description: 'Dokumentiere Impact und Ergebnisse f\u00FCr Verhandlungen.', cta_text: 'Ersten Win eintragen', cta_link: '/salary-log' },
  },
  network: {
    standard: { title: 'Netzwerk', description: 'CRM mit Erinnerungen \u2014 pflege deine Kontakte.', cta_text: 'Ersten Kontakt anlegen', cta_link: '/network' },
    executive: { title: 'Stakeholder Management', description: 'Strategisches Beziehungsmanagement f\u00FCr F\u00FChrungskr\u00E4fte.', cta_text: 'Ersten Kontakt anlegen', cta_link: '/network' },
  },
  branding: {
    standard: { title: 'LinkedIn & Branding', description: 'Headline-Generator und Post-Templates f\u00FCr mehr Sichtbarkeit.', cta_text: 'Profil optimieren', cta_link: '/branding' },
    executive: { title: 'Executive Branding', description: 'Thought Leadership und strategische Positionierung.', cta_text: 'Profil optimieren', cta_link: '/branding' },
  },
  decision: {
    standard: { title: 'Entscheidungs-Kompass', description: 'Werte-basierte Entscheidungs-Matrix f\u00FCr klare Antworten.', cta_text: 'Werte definieren', cta_link: '/strategy/decision' },
    executive: { title: 'Strategischer Kompass', description: 'Datengest\u00FCtzte Entscheidungsfindung f\u00FCr komplexe Situationen.', cta_text: 'Werte definieren', cta_link: '/strategy/decision' },
  },
  exit: {
    standard: { title: 'Exit-Strategie', description: 'Finanz-Runway-Rechner und Burnout-Check.', cta_text: 'Runway berechnen', cta_link: '/strategy/exit' },
    executive: { title: 'Transition Planning', description: 'Strategische Planung f\u00FCr den n\u00E4chsten Karriereschritt.', cta_text: 'Runway berechnen', cta_link: '/strategy/exit' },
  },
  career: {
    standard: { title: 'Karrierepfad', description: 'Skill-Tree und Level-System \u2014 dein Weg nach oben.', cta_text: 'Pfad ansehen', cta_link: '/career' },
    executive: { title: 'Karriere-Roadmap', description: 'Strategische Entwicklung vom Leader zum Executive.', cta_text: 'Pfad ansehen', cta_link: '/career' },
  },
  profile: {
    standard: { title: 'Profil', description: 'Deine digitale Identit\u00E4t. Halte es aktuell.', cta_text: 'Profil vervollst\u00E4ndigen', cta_link: '/profile' },
    executive: { title: 'Executive Profile', description: 'Deine strategische Identit\u00E4t im System.', cta_text: 'Profil vervollst\u00E4ndigen', cta_link: '/profile' },
  },
};

export function getTooltipContent(profile, moduleId) {
  const config = TOOLTIPS[moduleId];
  if (!config) return null;
  return isExecutive(profile) ? config.executive : config.standard;
}
