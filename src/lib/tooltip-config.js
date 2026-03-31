import { isExecutive } from './executive-mode';

const TOOLTIPS = {
  dashboard: {
    standard: { title: 'Dein Cockpit', description: 'Hier siehst du Fortschritt, Aufgaben und Streak auf einen Blick.', cta_text: 'Tagesaufgabe starten', cta_link: '/dashboard' },
    executive: { title: 'Dein Command-Center', description: 'Überwache deine strategische Entwicklung und Marktpositionierung.', cta_text: 'Tagesaufgabe starten', cta_link: '/dashboard' },
  },
  coach: {
    standard: { title: 'KI-Coach', description: 'Dein persönlicher Mentor kennt deine Daten und hilft dir weiter.', cta_text: 'Erste Frage stellen', cta_link: '/coach' },
    executive: { title: 'Strategischer Sparringspartner', description: 'KI-gestütztes Sparring für komplexe Karriereentscheidungen.', cta_text: 'Erste Frage stellen', cta_link: '/coach' },
  },
  analyse: {
    standard: { title: 'Karriereanalyse', description: '65 Fragen, 13 Kompetenzfelder, ca. 15 Minuten. Die Basis für alles.', cta_text: 'Analyse starten', cta_link: '/analyse' },
    executive: { title: 'Strategische Standortbestimmung', description: 'Umfassende Kompetenzanalyse für Führungskräfte und Executives.', cta_text: 'Analyse starten', cta_link: '/analyse' },
  },
  masterclass: {
    standard: { title: 'Masterclass', description: 'Kurse mit Quiz und Praxis-Aufgaben. Lerne in deinem Tempo.', cta_text: 'Ersten Kurs öffnen', cta_link: '/masterclass' },
    executive: { title: 'Executive Education', description: 'Strategische Weiterbildung für maximalen Impact.', cta_text: 'Ersten Kurs öffnen', cta_link: '/masterclass' },
  },
  gehalt: {
    standard: { title: 'Gehaltsdatenbank', description: 'Orientiert am Entgeltatlas der Bundesagentur für Arbeit. Realistische Daten für 35+ Berufe.', cta_text: 'Gehalt recherchieren', cta_link: '/gehalt' },
    executive: { title: 'Compensation Intelligence', description: 'Gehalts-Benchmarks nach Region, Erfahrung und Unternehmensgröße.', cta_text: 'Gehalt recherchieren', cta_link: '/gehalt' },
  },
  marktwert: {
    standard: { title: 'Dein Marktwert', description: 'Steigt durch echte Zertifikate des Karriere-Instituts. Entscheider erkennen deine Qualifikation.', cta_text: 'Score prüfen', cta_link: '/marktwert' },
    executive: { title: 'Marktpositionierung', description: 'Zertifikatsbasierter Score â signalisiert Kompetenz gegenüber Entscheidern.', cta_text: 'Score prüfen', cta_link: '/marktwert' },
  },
  applications: {
    standard: { title: 'Bewerbungen', description: 'Kanban-Board mit KI-Assistent für Anschreiben.', cta_text: 'Erste Bewerbung anlegen', cta_link: '/applications' },
    executive: { title: 'Opportunity Pipeline', description: 'Manage deine Karriere-Optionen strategisch.', cta_text: 'Erste Bewerbung anlegen', cta_link: '/applications' },
  },
  'pre-coaching': {
    standard: { title: 'Dokumenten-Safe', description: 'Upload, KI-CV-Check und Zeugnis-Decoder.', cta_text: 'CV hochladen', cta_link: '/pre-coaching' },
    executive: { title: 'Dokumenten-Safe', description: 'Zentrale Ablage mit intelligenter Analyse.', cta_text: 'CV hochladen', cta_link: '/pre-coaching' },
  },
  network: {
    standard: { title: 'Mein Netzwerk', description: 'Kontakt-Management mit Lern-Aspekt â dein Netzwerk ist dein Nettowert.', cta_text: 'Ersten Kontakt anlegen', cta_link: '/network' },
    executive: { title: 'Stakeholder Management', description: 'Strategisches Beziehungsmanagement für Führungskräfte.', cta_text: 'Ersten Kontakt anlegen', cta_link: '/network' },
  },
  branding: {
    standard: { title: 'Jobportale & Plattformen', description: 'Optimiere deine Präsenz auf LinkedIn, XING, StepStone und mehr.', cta_text: 'Plattformen entdecken', cta_link: '/branding' },
    executive: { title: 'Plattform-Strategie', description: 'Maximiere deine Sichtbarkeit auf allen relevanten Karriere-Plattformen.', cta_text: 'Plattformen entdecken', cta_link: '/branding' },
  },
  decision: {
    standard: { title: 'Entscheidungs-Kompass', description: 'Werte-basierte Entscheidungs-Matrix für klare Antworten.', cta_text: 'Werte definieren', cta_link: '/strategy/decision' },
    executive: { title: 'Strategischer Kompass', description: 'Datengestützte Entscheidungsfindung für komplexe Situationen.', cta_text: 'Werte definieren', cta_link: '/strategy/decision' },
  },
  exit: {
    standard: { title: 'Exit-Strategie', description: 'Finanz-Runway-Rechner und Burnout-Check.', cta_text: 'Runway berechnen', cta_link: '/strategy/exit' },
    executive: { title: 'Transition Planning', description: 'Strategische Planung für den nächsten Karriereschritt.', cta_text: 'Runway berechnen', cta_link: '/strategy/exit' },
  },
  career: {
    standard: { title: 'Karrierepfad', description: 'Skill-Tree und Level-System â dein Weg nach oben.', cta_text: 'Pfad ansehen', cta_link: '/career' },
    executive: { title: 'Karriere-Roadmap', description: 'Strategische Entwicklung vom Leader zum Executive.', cta_text: 'Pfad ansehen', cta_link: '/career' },
  },
  community: {
    standard: { title: 'Community', description: 'Dein Karriere-Netzwerk â poste, diskutiere und feiere Erfolge mit anderen Mitgliedern.', cta_text: 'Community entdecken', cta_link: '/community' },
    executive: { title: 'Executive Community', description: 'Austausch mit Führungskräften und Karriere-Experten.', cta_text: 'Community entdecken', cta_link: '/community' },
  },
  profile: {
    standard: { title: 'Profil', description: 'Deine digitale Identität. Halte es aktuell.', cta_text: 'Profil vervollständigen', cta_link: '/profile' },
    executive: { title: 'Executive Profile', description: 'Deine strategische Identität im System.', cta_text: 'Profil vervollständigen', cta_link: '/profile' },
  },
};

export function getTooltipContent(profile, moduleId) {
  const config = TOOLTIPS[moduleId];
  if (!config) return null;
  return isExecutive(profile) ? config.executive : config.standard;
}
