// src/lib/gehaltsdaten.js
// Quellen: Statistisches Bundesamt (Destatis) April 2025,
// Entgeltatlas der Bundesagentur für Arbeit,
// Stepstone Gehaltsreport 2025/2026
// Alle Werte: Brutto-Monatsgehalt Vollzeit in Euro (Median)

export const GEHALTSDATEN = {
  meta: {
    stand: '2025',
    quellen: [
      { name: 'Statistisches Bundesamt (Destatis)', url: 'https://www.destatis.de' },
      { name: 'Entgeltatlas der Bundesagentur für Arbeit', url: 'https://web.arbeitsagentur.de/entgeltatlas/' },
      { name: 'Stepstone Gehaltsreport 2025/2026', url: 'https://www.stepstone.de' },
    ],
    durchschnitt_deutschland: 4784,
    median_deutschland: 3817,
    hinweis: 'Alle Angaben sind Medianwerte für Vollzeitbeschäftigte (brutto/Monat). Individuelle Gehälter können abweichen.',
  },

  // Regionale Faktoren (Median-Abweichung vom Bundesdurchschnitt)
  regionen: {
    'Baden-Württemberg': 1.08,
    'Bayern': 1.07,
    'Berlin': 0.95,
    'Brandenburg': 0.85,
    'Bremen': 0.98,
    'Hamburg': 1.10,
    'Hessen': 1.09,
    'Mecklenburg-Vorpommern': 0.82,
    'Niedersachsen': 0.95,
    'Nordrhein-Westfalen': 1.00,
    'Rheinland-Pfalz': 0.96,
    'Saarland': 0.95,
    'Sachsen': 0.84,
    'Sachsen-Anhalt': 0.83,
    'Schleswig-Holstein': 0.93,
    'Thüringen': 0.83,
  },

  // Unternehmensgrößen-Faktoren
  groessen_faktor: {
    'Klein (1-49)': 0.88,
    'Mittel (50-249)': 0.96,
    'Groß (250-999)': 1.05,
    'Konzern (1000+)': 1.15,
  },

  berufe: [
    // ═══ IT & TECH ═══
    {
      titel: 'Software-Entwickler/in',
      berufsgruppe: 'IT & Technologie',
      gehalt: { '0-2': { p25: 3400, median: 4000, p75: 4700 }, '3-5': { p25: 4200, median: 4900, p75: 5800 }, '6-10': { p25: 5000, median: 5700, p75: 6800 }, '10+': { p25: 5500, median: 6400, p75: 7800 } },
    },
    {
      titel: 'Data Scientist',
      berufsgruppe: 'IT & Technologie',
      gehalt: { '0-2': { p25: 3600, median: 4200, p75: 5000 }, '3-5': { p25: 4500, median: 5300, p75: 6200 }, '6-10': { p25: 5200, median: 6100, p75: 7200 }, '10+': { p25: 5800, median: 6800, p75: 8200 } },
    },
    {
      titel: 'IT-Systemadministrator/in',
      berufsgruppe: 'IT & Technologie',
      gehalt: { '0-2': { p25: 2800, median: 3300, p75: 3900 }, '3-5': { p25: 3300, median: 3900, p75: 4600 }, '6-10': { p25: 3800, median: 4400, p75: 5200 }, '10+': { p25: 4100, median: 4900, p75: 5800 } },
    },
    {
      titel: 'IT-Projektmanager/in',
      berufsgruppe: 'IT & Technologie',
      gehalt: { '0-2': { p25: 3500, median: 4100, p75: 4800 }, '3-5': { p25: 4300, median: 5100, p75: 6000 }, '6-10': { p25: 5100, median: 5900, p75: 7000 }, '10+': { p25: 5600, median: 6500, p75: 7800 } },
    },
    {
      titel: 'UX/UI Designer/in',
      berufsgruppe: 'IT & Technologie',
      gehalt: { '0-2': { p25: 2900, median: 3400, p75: 4000 }, '3-5': { p25: 3500, median: 4200, p75: 5000 }, '6-10': { p25: 4100, median: 4900, p75: 5800 }, '10+': { p25: 4500, median: 5400, p75: 6400 } },
    },
    {
      titel: 'DevOps Engineer',
      berufsgruppe: 'IT & Technologie',
      gehalt: { '0-2': { p25: 3500, median: 4100, p75: 4800 }, '3-5': { p25: 4400, median: 5200, p75: 6100 }, '6-10': { p25: 5200, median: 6000, p75: 7100 }, '10+': { p25: 5700, median: 6600, p75: 8000 } },
    },

    // ═══ INGENIEURWESEN ═══
    {
      titel: 'Maschinenbauingenieur/in',
      berufsgruppe: 'Ingenieurwesen',
      gehalt: { '0-2': { p25: 3500, median: 4100, p75: 4700 }, '3-5': { p25: 4200, median: 4900, p75: 5700 }, '6-10': { p25: 4900, median: 5600, p75: 6600 }, '10+': { p25: 5400, median: 6300, p75: 7500 } },
    },
    {
      titel: 'Elektroingenieur/in',
      berufsgruppe: 'Ingenieurwesen',
      gehalt: { '0-2': { p25: 3600, median: 4200, p75: 4800 }, '3-5': { p25: 4300, median: 5000, p75: 5800 }, '6-10': { p25: 5000, median: 5800, p75: 6800 }, '10+': { p25: 5500, median: 6400, p75: 7600 } },
    },
    {
      titel: 'Bauingenieur/in',
      berufsgruppe: 'Ingenieurwesen',
      gehalt: { '0-2': { p25: 3200, median: 3800, p75: 4400 }, '3-5': { p25: 3900, median: 4500, p75: 5300 }, '6-10': { p25: 4500, median: 5200, p75: 6200 }, '10+': { p25: 5000, median: 5800, p75: 7000 } },
    },
    {
      titel: 'Wirtschaftsingenieur/in',
      berufsgruppe: 'Ingenieurwesen',
      gehalt: { '0-2': { p25: 3600, median: 4200, p75: 4900 }, '3-5': { p25: 4400, median: 5200, p75: 6100 }, '6-10': { p25: 5200, median: 6000, p75: 7100 }, '10+': { p25: 5700, median: 6700, p75: 8000 } },
    },

    // ═══ WIRTSCHAFT & FINANCE ═══
    {
      titel: 'Controller/in',
      berufsgruppe: 'Wirtschaft & Finance',
      gehalt: { '0-2': { p25: 3200, median: 3800, p75: 4400 }, '3-5': { p25: 4000, median: 4700, p75: 5500 }, '6-10': { p25: 4700, median: 5500, p75: 6500 }, '10+': { p25: 5200, median: 6200, p75: 7500 } },
    },
    {
      titel: 'Wirtschaftsprüfer/in',
      berufsgruppe: 'Wirtschaft & Finance',
      gehalt: { '0-2': { p25: 3500, median: 4200, p75: 5000 }, '3-5': { p25: 4500, median: 5500, p75: 6500 }, '6-10': { p25: 5500, median: 6800, p75: 8200 }, '10+': { p25: 6500, median: 8000, p75: 10000 } },
    },
    {
      titel: 'Bankkaufmann/-frau',
      berufsgruppe: 'Wirtschaft & Finance',
      gehalt: { '0-2': { p25: 2600, median: 3100, p75: 3600 }, '3-5': { p25: 3100, median: 3700, p75: 4300 }, '6-10': { p25: 3600, median: 4300, p75: 5100 }, '10+': { p25: 4000, median: 4800, p75: 5700 } },
    },
    {
      titel: 'Steuerberater/in',
      berufsgruppe: 'Wirtschaft & Finance',
      gehalt: { '0-2': { p25: 3200, median: 3800, p75: 4500 }, '3-5': { p25: 4000, median: 4800, p75: 5700 }, '6-10': { p25: 4800, median: 5800, p75: 7000 }, '10+': { p25: 5500, median: 6800, p75: 8500 } },
    },
    {
      titel: 'Versicherungskaufmann/-frau',
      berufsgruppe: 'Wirtschaft & Finance',
      gehalt: { '0-2': { p25: 2500, median: 3000, p75: 3500 }, '3-5': { p25: 3000, median: 3600, p75: 4200 }, '6-10': { p25: 3500, median: 4200, p75: 5000 }, '10+': { p25: 3900, median: 4700, p75: 5600 } },
    },
    {
      titel: 'Buchhalter/in',
      berufsgruppe: 'Wirtschaft & Finance',
      gehalt: { '0-2': { p25: 2400, median: 2800, p75: 3300 }, '3-5': { p25: 2800, median: 3300, p75: 3900 }, '6-10': { p25: 3200, median: 3800, p75: 4400 }, '10+': { p25: 3500, median: 4200, p75: 5000 } },
    },

    // ═══ MANAGEMENT & BERATUNG ═══
    {
      titel: 'Projektmanager/in',
      berufsgruppe: 'Management',
      gehalt: { '0-2': { p25: 3000, median: 3500, p75: 4100 }, '3-5': { p25: 3700, median: 4400, p75: 5200 }, '6-10': { p25: 4400, median: 5200, p75: 6200 }, '10+': { p25: 5000, median: 5900, p75: 7200 } },
    },
    {
      titel: 'Unternehmensberater/in',
      berufsgruppe: 'Management',
      gehalt: { '0-2': { p25: 3500, median: 4200, p75: 5000 }, '3-5': { p25: 4500, median: 5500, p75: 6500 }, '6-10': { p25: 5500, median: 6800, p75: 8500 }, '10+': { p25: 6500, median: 8200, p75: 11000 } },
    },
    {
      titel: 'Produktmanager/in',
      berufsgruppe: 'Management',
      gehalt: { '0-2': { p25: 3200, median: 3800, p75: 4400 }, '3-5': { p25: 4000, median: 4700, p75: 5500 }, '6-10': { p25: 4700, median: 5600, p75: 6700 }, '10+': { p25: 5300, median: 6300, p75: 7600 } },
    },

    // ═══ MARKETING & VERTRIEB ═══
    {
      titel: 'Marketing-Manager/in',
      berufsgruppe: 'Marketing & Vertrieb',
      gehalt: { '0-2': { p25: 2700, median: 3200, p75: 3800 }, '3-5': { p25: 3400, median: 4000, p75: 4800 }, '6-10': { p25: 4000, median: 4800, p75: 5800 }, '10+': { p25: 4500, median: 5500, p75: 6800 } },
    },
    {
      titel: 'Vertriebsleiter/in',
      berufsgruppe: 'Marketing & Vertrieb',
      gehalt: { '0-2': { p25: 3000, median: 3600, p75: 4300 }, '3-5': { p25: 3800, median: 4600, p75: 5500 }, '6-10': { p25: 4600, median: 5600, p75: 6800 }, '10+': { p25: 5200, median: 6500, p75: 8000 } },
    },
    {
      titel: 'Online-Marketing-Manager/in',
      berufsgruppe: 'Marketing & Vertrieb',
      gehalt: { '0-2': { p25: 2500, median: 3000, p75: 3500 }, '3-5': { p25: 3100, median: 3700, p75: 4400 }, '6-10': { p25: 3700, median: 4400, p75: 5300 }, '10+': { p25: 4100, median: 5000, p75: 6000 } },
    },

    // ═══ PERSONAL (HR) ═══
    {
      titel: 'HR-Manager/in',
      berufsgruppe: 'Personal',
      gehalt: { '0-2': { p25: 2800, median: 3300, p75: 3900 }, '3-5': { p25: 3500, median: 4200, p75: 5000 }, '6-10': { p25: 4200, median: 5000, p75: 6000 }, '10+': { p25: 4800, median: 5700, p75: 7000 } },
    },
    {
      titel: 'Personalreferent/in',
      berufsgruppe: 'Personal',
      gehalt: { '0-2': { p25: 2500, median: 3000, p75: 3500 }, '3-5': { p25: 3000, median: 3600, p75: 4200 }, '6-10': { p25: 3500, median: 4200, p75: 5000 }, '10+': { p25: 3900, median: 4700, p75: 5600 } },
    },

    // ═══ RECHT ═══
    {
      titel: 'Jurist/in (Volljurist)',
      berufsgruppe: 'Recht',
      gehalt: { '0-2': { p25: 3800, median: 4500, p75: 5500 }, '3-5': { p25: 4800, median: 5700, p75: 7000 }, '6-10': { p25: 5700, median: 7000, p75: 8500 }, '10+': { p25: 6500, median: 8200, p75: 10500 } },
    },
    {
      titel: 'Rechtsanwaltsfachangestellte/r',
      berufsgruppe: 'Recht',
      gehalt: { '0-2': { p25: 2000, median: 2400, p75: 2800 }, '3-5': { p25: 2400, median: 2800, p75: 3300 }, '6-10': { p25: 2700, median: 3200, p75: 3700 }, '10+': { p25: 3000, median: 3500, p75: 4100 } },
    },

    // ═══ GESUNDHEIT ═══
    {
      titel: 'Arzt/Ärztin (Assistenzarzt)',
      berufsgruppe: 'Gesundheit',
      gehalt: { '0-2': { p25: 4200, median: 4800, p75: 5200 }, '3-5': { p25: 5000, median: 5600, p75: 6200 }, '6-10': { p25: 5800, median: 6500, p75: 7500 }, '10+': { p25: 6500, median: 7800, p75: 9500 } },
    },
    {
      titel: 'Krankenpfleger/in',
      berufsgruppe: 'Gesundheit',
      gehalt: { '0-2': { p25: 2600, median: 3000, p75: 3400 }, '3-5': { p25: 2900, median: 3300, p75: 3700 }, '6-10': { p25: 3200, median: 3600, p75: 4100 }, '10+': { p25: 3400, median: 3900, p75: 4400 } },
    },
    {
      titel: 'Zahnarzt/Zahnärztin',
      berufsgruppe: 'Gesundheit',
      gehalt: { '0-2': { p25: 3500, median: 4200, p75: 5000 }, '3-5': { p25: 4500, median: 5500, p75: 6500 }, '6-10': { p25: 5500, median: 6800, p75: 8500 }, '10+': { p25: 6500, median: 8500, p75: 12000 } },
    },
    {
      titel: 'Pharmareferent/in',
      berufsgruppe: 'Gesundheit',
      gehalt: { '0-2': { p25: 3000, median: 3500, p75: 4100 }, '3-5': { p25: 3600, median: 4300, p75: 5100 }, '6-10': { p25: 4200, median: 5000, p75: 5900 }, '10+': { p25: 4600, median: 5500, p75: 6600 } },
    },

    // ═══ BILDUNG ═══
    {
      titel: 'Lehrer/in (verbeamtet)',
      berufsgruppe: 'Bildung',
      gehalt: { '0-2': { p25: 3500, median: 3900, p75: 4200 }, '3-5': { p25: 3900, median: 4300, p75: 4600 }, '6-10': { p25: 4200, median: 4700, p75: 5100 }, '10+': { p25: 4600, median: 5200, p75: 5700 } },
    },

    // ═══ HANDWERK & PRODUKTION ═══
    {
      titel: 'Elektriker/in',
      berufsgruppe: 'Handwerk',
      gehalt: { '0-2': { p25: 2300, median: 2700, p75: 3100 }, '3-5': { p25: 2700, median: 3100, p75: 3600 }, '6-10': { p25: 3000, median: 3500, p75: 4000 }, '10+': { p25: 3300, median: 3800, p75: 4400 } },
    },
    {
      titel: 'Mechatroniker/in',
      berufsgruppe: 'Handwerk',
      gehalt: { '0-2': { p25: 2400, median: 2800, p75: 3300 }, '3-5': { p25: 2800, median: 3300, p75: 3800 }, '6-10': { p25: 3200, median: 3700, p75: 4300 }, '10+': { p25: 3500, median: 4100, p75: 4700 } },
    },
    {
      titel: 'Industriemechaniker/in',
      berufsgruppe: 'Handwerk',
      gehalt: { '0-2': { p25: 2500, median: 2900, p75: 3400 }, '3-5': { p25: 2900, median: 3400, p75: 3900 }, '6-10': { p25: 3300, median: 3800, p75: 4400 }, '10+': { p25: 3600, median: 4200, p75: 4800 } },
    },

    // ═══ KAUFMÄNNISCH ═══
    {
      titel: 'Bürokaufmann/-frau',
      berufsgruppe: 'Kaufmännisch',
      gehalt: { '0-2': { p25: 2100, median: 2500, p75: 2900 }, '3-5': { p25: 2500, median: 2900, p75: 3400 }, '6-10': { p25: 2800, median: 3300, p75: 3800 }, '10+': { p25: 3100, median: 3600, p75: 4200 } },
    },
    {
      titel: 'Industriekaufmann/-frau',
      berufsgruppe: 'Kaufmännisch',
      gehalt: { '0-2': { p25: 2400, median: 2800, p75: 3300 }, '3-5': { p25: 2900, median: 3400, p75: 4000 }, '6-10': { p25: 3300, median: 3900, p75: 4600 }, '10+': { p25: 3700, median: 4300, p75: 5100 } },
    },
    {
      titel: 'Einkäufer/in',
      berufsgruppe: 'Kaufmännisch',
      gehalt: { '0-2': { p25: 2700, median: 3200, p75: 3700 }, '3-5': { p25: 3300, median: 3900, p75: 4600 }, '6-10': { p25: 3900, median: 4600, p75: 5500 }, '10+': { p25: 4300, median: 5100, p75: 6200 } },
    },

    // ═══ LOGISTIK ═══
    {
      titel: 'Logistiker/in',
      berufsgruppe: 'Logistik',
      gehalt: { '0-2': { p25: 2300, median: 2700, p75: 3200 }, '3-5': { p25: 2700, median: 3200, p75: 3800 }, '6-10': { p25: 3100, median: 3700, p75: 4300 }, '10+': { p25: 3400, median: 4100, p75: 4800 } },
    },
    {
      titel: 'Supply Chain Manager/in',
      berufsgruppe: 'Logistik',
      gehalt: { '0-2': { p25: 3000, median: 3600, p75: 4200 }, '3-5': { p25: 3700, median: 4400, p75: 5200 }, '6-10': { p25: 4400, median: 5200, p75: 6200 }, '10+': { p25: 5000, median: 5900, p75: 7100 } },
    },

    // ═══ ARCHITEKTUR ═══
    {
      titel: 'Architekt/in',
      berufsgruppe: 'Architektur',
      gehalt: { '0-2': { p25: 2800, median: 3300, p75: 3800 }, '3-5': { p25: 3300, median: 3900, p75: 4600 }, '6-10': { p25: 3900, median: 4600, p75: 5500 }, '10+': { p25: 4400, median: 5200, p75: 6400 } },
    },
    {
      titel: 'Immobilienmakler/in',
      berufsgruppe: 'Architektur',
      gehalt: { '0-2': { p25: 2200, median: 2700, p75: 3400 }, '3-5': { p25: 2800, median: 3500, p75: 4500 }, '6-10': { p25: 3400, median: 4300, p75: 5500 }, '10+': { p25: 3800, median: 5000, p75: 6500 } },
    },

    // ═══ NATURWISSENSCHAFT ═══
    {
      titel: 'Chemiker/in',
      berufsgruppe: 'Naturwissenschaft',
      gehalt: { '0-2': { p25: 3300, median: 3900, p75: 4500 }, '3-5': { p25: 4000, median: 4700, p75: 5500 }, '6-10': { p25: 4700, median: 5500, p75: 6500 }, '10+': { p25: 5200, median: 6200, p75: 7500 } },
    },
    {
      titel: 'Biologe/Biologin',
      berufsgruppe: 'Naturwissenschaft',
      gehalt: { '0-2': { p25: 2800, median: 3300, p75: 3900 }, '3-5': { p25: 3300, median: 3900, p75: 4600 }, '6-10': { p25: 3800, median: 4500, p75: 5400 }, '10+': { p25: 4200, median: 5000, p75: 6100 } },
    },

    // ═══ GASTGEWERBE ═══
    {
      titel: 'Koch/Köchin',
      berufsgruppe: 'Gastgewerbe',
      gehalt: { '0-2': { p25: 1900, median: 2200, p75: 2600 }, '3-5': { p25: 2200, median: 2600, p75: 3000 }, '6-10': { p25: 2500, median: 2900, p75: 3400 }, '10+': { p25: 2800, median: 3200, p75: 3800 } },
    },
    {
      titel: 'Hotelfachmann/-frau',
      berufsgruppe: 'Gastgewerbe',
      gehalt: { '0-2': { p25: 1800, median: 2100, p75: 2500 }, '3-5': { p25: 2100, median: 2500, p75: 2900 }, '6-10': { p25: 2400, median: 2800, p75: 3300 }, '10+': { p25: 2700, median: 3200, p75: 3700 } },
    },

    // ═══ MEDIEN & DESIGN ═══
    {
      titel: 'Grafik-Designer/in',
      berufsgruppe: 'Medien & Design',
      gehalt: { '0-2': { p25: 2200, median: 2600, p75: 3100 }, '3-5': { p25: 2700, median: 3200, p75: 3800 }, '6-10': { p25: 3100, median: 3700, p75: 4400 }, '10+': { p25: 3400, median: 4100, p75: 4900 } },
    },
    {
      titel: 'Journalist/in',
      berufsgruppe: 'Medien & Design',
      gehalt: { '0-2': { p25: 2300, median: 2800, p75: 3300 }, '3-5': { p25: 2800, median: 3400, p75: 4000 }, '6-10': { p25: 3300, median: 4000, p75: 4800 }, '10+': { p25: 3700, median: 4500, p75: 5500 } },
    },

    // ═══ SOZIALES ═══
    {
      titel: 'Sozialarbeiter/in',
      berufsgruppe: 'Soziales',
      gehalt: { '0-2': { p25: 2400, median: 2800, p75: 3200 }, '3-5': { p25: 2800, median: 3200, p75: 3700 }, '6-10': { p25: 3100, median: 3600, p75: 4100 }, '10+': { p25: 3400, median: 3900, p75: 4500 } },
    },
    {
      titel: 'Erzieher/in',
      berufsgruppe: 'Soziales',
      gehalt: { '0-2': { p25: 2400, median: 2800, p75: 3100 }, '3-5': { p25: 2700, median: 3100, p75: 3500 }, '6-10': { p25: 3000, median: 3400, p75: 3800 }, '10+': { p25: 3200, median: 3700, p75: 4100 } },
    },
  ],
};

// Bundesländer-Liste
export const BUNDESLAENDER = Object.keys(GEHALTSDATEN.regionen);

// Erfahrungsstufen
export const ERFAHRUNGSSTUFEN = [
  { key: '0-2', label: '0-2 Jahre (Berufseinsteiger)' },
  { key: '3-5', label: '3-5 Jahre' },
  { key: '6-10', label: '6-10 Jahre' },
  { key: '10+', label: '10+ Jahre (Senior)' },
];

// Unternehmensgrößen
export const UNTERNEHMENSGROESSEN = Object.keys(GEHALTSDATEN.groessen_faktor);

// Berufsgruppen (unique)
export const BERUFSGRUPPEN = [...new Set(GEHALTSDATEN.berufe.map(b => b.berufsgruppe))];

// Hilfsfunktion für regionale Berechnung
export function getRegionalGehalt(beruf, erfahrung, region) {
  const base = beruf.gehalt[erfahrung];
  if (!base) return null;
  const faktor = GEHALTSDATEN.regionen[region] || 1.0;
  return {
    p25: Math.round(base.p25 * faktor),
    median: Math.round(base.median * faktor),
    p75: Math.round(base.p75 * faktor),
  };
}

// Hilfsfunktion für Unternehmensgrößen
export function getGroessenGehalt(median, groesse) {
  const faktor = GEHALTSDATEN.groessen_faktor[groesse] || 1.0;
  return Math.round(median * faktor);
}
