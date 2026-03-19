// ============================================================================
// Gehaltsdaten — basierend auf Entgeltatlas der Bundesagentur für Arbeit
// Alle Werte: BRUTTO monatlich in EUR (Vollzeit)
// Stand: 2024/2025
// ============================================================================

export const GEHALTSDATEN = {
  berufe: [
    // ── 1. Projektmanager/in ──────────────────────────────────────────────
    {
      titel: 'Projektmanager/in',
      berufsgruppe: 'Management',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2800, median: 3200, p75: 3800 },
        '3-5': { p25: 3200, median: 3950, p75: 4800 },
        '6-10': { p25: 3800, median: 4500, p75: 5500 },
        '10+': { p25: 4200, median: 5200, p75: 6500 },
      },
      gehalt_nach_region: {
        'Bayern': 4200, 'Baden-Württemberg': 4100, 'Hessen': 4100,
        'Hamburg': 4000, 'Nordrhein-Westfalen': 3800, 'Berlin': 3600,
        'Niedersachsen': 3600, 'Schleswig-Holstein': 3400, 'Rheinland-Pfalz': 3500,
        'Bremen': 3500, 'Saarland': 3300, 'Sachsen': 3200, 'Sachsen-Anhalt': 3100,
        'Thüringen': 3100, 'Brandenburg': 3200, 'Mecklenburg-Vorpommern': 3000,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 3400, 'Mittel (50-250)': 3800,
        'Groß (250+)': 4200, 'Konzern (1000+)': 4600,
      },
    },

    // ── 2. Software-Entwickler/in ─────────────────────────────────────────
    {
      titel: 'Software-Entwickler/in',
      berufsgruppe: 'IT',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 3000, median: 3500, p75: 4100 },
        '3-5': { p25: 3600, median: 4300, p75: 5200 },
        '6-10': { p25: 4200, median: 5100, p75: 6200 },
        '10+': { p25: 4800, median: 5800, p75: 7200 },
      },
      gehalt_nach_region: {
        'Bayern': 4800, 'Baden-Württemberg': 4700, 'Hessen': 4600,
        'Hamburg': 4500, 'Nordrhein-Westfalen': 4200, 'Berlin': 4100,
        'Niedersachsen': 3900, 'Schleswig-Holstein': 3700, 'Rheinland-Pfalz': 3800,
        'Bremen': 3800, 'Saarland': 3600, 'Sachsen': 3500, 'Sachsen-Anhalt': 3300,
        'Thüringen': 3300, 'Brandenburg': 3400, 'Mecklenburg-Vorpommern': 3200,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 3800, 'Mittel (50-250)': 4300,
        'Groß (250+)': 4800, 'Konzern (1000+)': 5400,
      },
    },

    // ── 3. Data Scientist ─────────────────────────────────────────────────
    {
      titel: 'Data Scientist',
      berufsgruppe: 'IT',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 3200, median: 3800, p75: 4400 },
        '3-5': { p25: 3900, median: 4700, p75: 5600 },
        '6-10': { p25: 4500, median: 5500, p75: 6600 },
        '10+': { p25: 5200, median: 6300, p75: 7800 },
      },
      gehalt_nach_region: {
        'Bayern': 5100, 'Baden-Württemberg': 5000, 'Hessen': 4900,
        'Hamburg': 4800, 'Nordrhein-Westfalen': 4500, 'Berlin': 4400,
        'Niedersachsen': 4100, 'Schleswig-Holstein': 3900, 'Rheinland-Pfalz': 4000,
        'Bremen': 4000, 'Saarland': 3800, 'Sachsen': 3700, 'Sachsen-Anhalt': 3500,
        'Thüringen': 3500, 'Brandenburg': 3600, 'Mecklenburg-Vorpommern': 3400,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 4000, 'Mittel (50-250)': 4600,
        'Groß (250+)': 5200, 'Konzern (1000+)': 5800,
      },
    },

    // ── 4. IT-Systemadministrator/in ──────────────────────────────────────
    {
      titel: 'IT-Systemadministrator/in',
      berufsgruppe: 'IT',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2400, median: 2800, p75: 3300 },
        '3-5': { p25: 2800, median: 3400, p75: 4000 },
        '6-10': { p25: 3300, median: 3900, p75: 4600 },
        '10+': { p25: 3700, median: 4400, p75: 5200 },
      },
      gehalt_nach_region: {
        'Bayern': 3800, 'Baden-Württemberg': 3700, 'Hessen': 3700,
        'Hamburg': 3600, 'Nordrhein-Westfalen': 3400, 'Berlin': 3300,
        'Niedersachsen': 3200, 'Schleswig-Holstein': 3000, 'Rheinland-Pfalz': 3100,
        'Bremen': 3100, 'Saarland': 2900, 'Sachsen': 2800, 'Sachsen-Anhalt': 2700,
        'Thüringen': 2700, 'Brandenburg': 2800, 'Mecklenburg-Vorpommern': 2600,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 2900, 'Mittel (50-250)': 3300,
        'Groß (250+)': 3700, 'Konzern (1000+)': 4100,
      },
    },

    // ── 5. Marketing-Manager/in ───────────────────────────────────────────
    {
      titel: 'Marketing-Manager/in',
      berufsgruppe: 'Marketing',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2600, median: 3000, p75: 3600 },
        '3-5': { p25: 3100, median: 3700, p75: 4500 },
        '6-10': { p25: 3600, median: 4400, p75: 5300 },
        '10+': { p25: 4100, median: 5000, p75: 6200 },
      },
      gehalt_nach_region: {
        'Bayern': 4100, 'Baden-Württemberg': 4000, 'Hessen': 3900,
        'Hamburg': 3900, 'Nordrhein-Westfalen': 3700, 'Berlin': 3500,
        'Niedersachsen': 3400, 'Schleswig-Holstein': 3200, 'Rheinland-Pfalz': 3300,
        'Bremen': 3300, 'Saarland': 3100, 'Sachsen': 3000, 'Sachsen-Anhalt': 2900,
        'Thüringen': 2900, 'Brandenburg': 3000, 'Mecklenburg-Vorpommern': 2800,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 3200, 'Mittel (50-250)': 3600,
        'Groß (250+)': 4100, 'Konzern (1000+)': 4600,
      },
    },

    // ── 6. Vertriebsleiter/in ─────────────────────────────────────────────
    {
      titel: 'Vertriebsleiter/in',
      berufsgruppe: 'Vertrieb',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 3000, median: 3500, p75: 4200 },
        '3-5': { p25: 3600, median: 4300, p75: 5200 },
        '6-10': { p25: 4200, median: 5200, p75: 6400 },
        '10+': { p25: 4800, median: 6000, p75: 7500 },
      },
      gehalt_nach_region: {
        'Bayern': 5000, 'Baden-Württemberg': 4900, 'Hessen': 4800,
        'Hamburg': 4700, 'Nordrhein-Westfalen': 4500, 'Berlin': 4200,
        'Niedersachsen': 4100, 'Schleswig-Holstein': 3900, 'Rheinland-Pfalz': 4000,
        'Bremen': 4000, 'Saarland': 3800, 'Sachsen': 3600, 'Sachsen-Anhalt': 3500,
        'Thüringen': 3500, 'Brandenburg': 3600, 'Mecklenburg-Vorpommern': 3400,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 3800, 'Mittel (50-250)': 4400,
        'Groß (250+)': 5000, 'Konzern (1000+)': 5600,
      },
    },

    // ── 7. Controller/in ──────────────────────────────────────────────────
    {
      titel: 'Controller/in',
      berufsgruppe: 'Finance',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2900, median: 3400, p75: 4000 },
        '3-5': { p25: 3400, median: 4100, p75: 5000 },
        '6-10': { p25: 4000, median: 4800, p75: 5800 },
        '10+': { p25: 4500, median: 5500, p75: 6800 },
      },
      gehalt_nach_region: {
        'Bayern': 4500, 'Baden-Württemberg': 4400, 'Hessen': 4400,
        'Hamburg': 4300, 'Nordrhein-Westfalen': 4100, 'Berlin': 3800,
        'Niedersachsen': 3700, 'Schleswig-Holstein': 3500, 'Rheinland-Pfalz': 3600,
        'Bremen': 3600, 'Saarland': 3400, 'Sachsen': 3300, 'Sachsen-Anhalt': 3200,
        'Thüringen': 3200, 'Brandenburg': 3300, 'Mecklenburg-Vorpommern': 3100,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 3500, 'Mittel (50-250)': 4000,
        'Groß (250+)': 4500, 'Konzern (1000+)': 5100,
      },
    },

    // ── 8. HR-Manager/in ──────────────────────────────────────────────────
    {
      titel: 'HR-Manager/in',
      berufsgruppe: 'Personal',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2700, median: 3100, p75: 3700 },
        '3-5': { p25: 3200, median: 3800, p75: 4600 },
        '6-10': { p25: 3700, median: 4500, p75: 5400 },
        '10+': { p25: 4200, median: 5100, p75: 6300 },
      },
      gehalt_nach_region: {
        'Bayern': 4200, 'Baden-Württemberg': 4100, 'Hessen': 4000,
        'Hamburg': 3900, 'Nordrhein-Westfalen': 3800, 'Berlin': 3500,
        'Niedersachsen': 3400, 'Schleswig-Holstein': 3200, 'Rheinland-Pfalz': 3300,
        'Bremen': 3300, 'Saarland': 3100, 'Sachsen': 3000, 'Sachsen-Anhalt': 2900,
        'Thüringen': 2900, 'Brandenburg': 3000, 'Mecklenburg-Vorpommern': 2800,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 3200, 'Mittel (50-250)': 3700,
        'Groß (250+)': 4200, 'Konzern (1000+)': 4700,
      },
    },

    // ── 9. Unternehmensberater/in ─────────────────────────────────────────
    {
      titel: 'Unternehmensberater/in',
      berufsgruppe: 'Consulting',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 3200, median: 3800, p75: 4500 },
        '3-5': { p25: 3900, median: 4700, p75: 5700 },
        '6-10': { p25: 4600, median: 5600, p75: 6800 },
        '10+': { p25: 5400, median: 6700, p75: 8500 },
      },
      gehalt_nach_region: {
        'Bayern': 5100, 'Baden-Württemberg': 5000, 'Hessen': 5000,
        'Hamburg': 4800, 'Nordrhein-Westfalen': 4600, 'Berlin': 4400,
        'Niedersachsen': 4200, 'Schleswig-Holstein': 4000, 'Rheinland-Pfalz': 4100,
        'Bremen': 4100, 'Saarland': 3900, 'Sachsen': 3700, 'Sachsen-Anhalt': 3600,
        'Thüringen': 3600, 'Brandenburg': 3700, 'Mecklenburg-Vorpommern': 3500,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 4000, 'Mittel (50-250)': 4600,
        'Groß (250+)': 5300, 'Konzern (1000+)': 6200,
      },
    },

    // ── 10. Wirtschaftsprüfer/in ──────────────────────────────────────────
    {
      titel: 'Wirtschaftsprüfer/in',
      berufsgruppe: 'Finance',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 3500, median: 4200, p75: 5000 },
        '3-5': { p25: 4200, median: 5200, p75: 6300 },
        '6-10': { p25: 5000, median: 6200, p75: 7500 },
        '10+': { p25: 5800, median: 7500, p75: 9500 },
      },
      gehalt_nach_region: {
        'Bayern': 5800, 'Baden-Württemberg': 5700, 'Hessen': 5800,
        'Hamburg': 5500, 'Nordrhein-Westfalen': 5200, 'Berlin': 5000,
        'Niedersachsen': 4800, 'Schleswig-Holstein': 4500, 'Rheinland-Pfalz': 4700,
        'Bremen': 4700, 'Saarland': 4400, 'Sachsen': 4200, 'Sachsen-Anhalt': 4100,
        'Thüringen': 4100, 'Brandenburg': 4200, 'Mecklenburg-Vorpommern': 3900,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 4500, 'Mittel (50-250)': 5200,
        'Groß (250+)': 6000, 'Konzern (1000+)': 7000,
      },
    },

    // ── 11. Jurist/in ─────────────────────────────────────────────────────
    {
      titel: 'Jurist/in',
      berufsgruppe: 'Recht',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 3000, median: 3600, p75: 4400 },
        '3-5': { p25: 3700, median: 4500, p75: 5500 },
        '6-10': { p25: 4400, median: 5400, p75: 6700 },
        '10+': { p25: 5200, median: 6500, p75: 8200 },
      },
      gehalt_nach_region: {
        'Bayern': 5200, 'Baden-Württemberg': 5100, 'Hessen': 5200,
        'Hamburg': 5000, 'Nordrhein-Westfalen': 4700, 'Berlin': 4500,
        'Niedersachsen': 4300, 'Schleswig-Holstein': 4100, 'Rheinland-Pfalz': 4200,
        'Bremen': 4200, 'Saarland': 4000, 'Sachsen': 3800, 'Sachsen-Anhalt': 3700,
        'Thüringen': 3700, 'Brandenburg': 3800, 'Mecklenburg-Vorpommern': 3500,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 4000, 'Mittel (50-250)': 4700,
        'Groß (250+)': 5400, 'Konzern (1000+)': 6200,
      },
    },

    // ── 12. Ingenieur/in Maschinenbau ─────────────────────────────────────
    {
      titel: 'Ingenieur/in Maschinenbau',
      berufsgruppe: 'Technik',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 3200, median: 3700, p75: 4300 },
        '3-5': { p25: 3800, median: 4500, p75: 5400 },
        '6-10': { p25: 4400, median: 5300, p75: 6300 },
        '10+': { p25: 5000, median: 6100, p75: 7400 },
      },
      gehalt_nach_region: {
        'Bayern': 5000, 'Baden-Württemberg': 5100, 'Hessen': 4800,
        'Hamburg': 4700, 'Nordrhein-Westfalen': 4500, 'Berlin': 4200,
        'Niedersachsen': 4300, 'Schleswig-Holstein': 4000, 'Rheinland-Pfalz': 4100,
        'Bremen': 4200, 'Saarland': 3900, 'Sachsen': 3700, 'Sachsen-Anhalt': 3600,
        'Thüringen': 3600, 'Brandenburg': 3700, 'Mecklenburg-Vorpommern': 3400,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 3900, 'Mittel (50-250)': 4500,
        'Groß (250+)': 5100, 'Konzern (1000+)': 5700,
      },
    },

    // ── 13. Elektroingenieur/in ───────────────────────────────────────────
    {
      titel: 'Elektroingenieur/in',
      berufsgruppe: 'Technik',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 3300, median: 3800, p75: 4400 },
        '3-5': { p25: 3900, median: 4600, p75: 5500 },
        '6-10': { p25: 4500, median: 5400, p75: 6500 },
        '10+': { p25: 5100, median: 6200, p75: 7600 },
      },
      gehalt_nach_region: {
        'Bayern': 5100, 'Baden-Württemberg': 5200, 'Hessen': 4900,
        'Hamburg': 4800, 'Nordrhein-Westfalen': 4600, 'Berlin': 4300,
        'Niedersachsen': 4400, 'Schleswig-Holstein': 4100, 'Rheinland-Pfalz': 4200,
        'Bremen': 4300, 'Saarland': 4000, 'Sachsen': 3800, 'Sachsen-Anhalt': 3700,
        'Thüringen': 3700, 'Brandenburg': 3800, 'Mecklenburg-Vorpommern': 3500,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 4000, 'Mittel (50-250)': 4600,
        'Groß (250+)': 5200, 'Konzern (1000+)': 5800,
      },
    },

    // ── 14. Bauingenieur/in ───────────────────────────────────────────────
    {
      titel: 'Bauingenieur/in',
      berufsgruppe: 'Technik',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2900, median: 3400, p75: 4000 },
        '3-5': { p25: 3400, median: 4100, p75: 4900 },
        '6-10': { p25: 4000, median: 4800, p75: 5700 },
        '10+': { p25: 4500, median: 5500, p75: 6700 },
      },
      gehalt_nach_region: {
        'Bayern': 4600, 'Baden-Württemberg': 4500, 'Hessen': 4400,
        'Hamburg': 4300, 'Nordrhein-Westfalen': 4100, 'Berlin': 3900,
        'Niedersachsen': 3900, 'Schleswig-Holstein': 3700, 'Rheinland-Pfalz': 3800,
        'Bremen': 3800, 'Saarland': 3600, 'Sachsen': 3400, 'Sachsen-Anhalt': 3300,
        'Thüringen': 3300, 'Brandenburg': 3400, 'Mecklenburg-Vorpommern': 3200,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 3600, 'Mittel (50-250)': 4100,
        'Groß (250+)': 4600, 'Konzern (1000+)': 5200,
      },
    },

    // ── 15. Architekt/in ──────────────────────────────────────────────────
    {
      titel: 'Architekt/in',
      berufsgruppe: 'Technik',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2500, median: 2900, p75: 3400 },
        '3-5': { p25: 3000, median: 3500, p75: 4200 },
        '6-10': { p25: 3500, median: 4200, p75: 5100 },
        '10+': { p25: 4000, median: 4900, p75: 6000 },
      },
      gehalt_nach_region: {
        'Bayern': 4000, 'Baden-Württemberg': 3900, 'Hessen': 3900,
        'Hamburg': 3800, 'Nordrhein-Westfalen': 3600, 'Berlin': 3400,
        'Niedersachsen': 3300, 'Schleswig-Holstein': 3100, 'Rheinland-Pfalz': 3200,
        'Bremen': 3200, 'Saarland': 3000, 'Sachsen': 2900, 'Sachsen-Anhalt': 2800,
        'Thüringen': 2800, 'Brandenburg': 2900, 'Mecklenburg-Vorpommern': 2700,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 3100, 'Mittel (50-250)': 3500,
        'Groß (250+)': 4000, 'Konzern (1000+)': 4500,
      },
    },

    // ── 16. Arzt/Ärztin ──────────────────────────────────────────────────
    {
      titel: 'Arzt/Ärztin',
      berufsgruppe: 'Medizin',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 4000, median: 4600, p75: 5200 },
        '3-5': { p25: 4800, median: 5600, p75: 6500 },
        '6-10': { p25: 5500, median: 6600, p75: 7800 },
        '10+': { p25: 6500, median: 8000, p75: 10500 },
      },
      gehalt_nach_region: {
        'Bayern': 6200, 'Baden-Württemberg': 6100, 'Hessen': 6100,
        'Hamburg': 6000, 'Nordrhein-Westfalen': 5800, 'Berlin': 5500,
        'Niedersachsen': 5500, 'Schleswig-Holstein': 5300, 'Rheinland-Pfalz': 5400,
        'Bremen': 5400, 'Saarland': 5200, 'Sachsen': 5000, 'Sachsen-Anhalt': 4900,
        'Thüringen': 4900, 'Brandenburg': 5000, 'Mecklenburg-Vorpommern': 4800,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 5200, 'Mittel (50-250)': 5800,
        'Groß (250+)': 6400, 'Konzern (1000+)': 7200,
      },
    },

    // ── 17. Lehrer/in ─────────────────────────────────────────────────────
    {
      titel: 'Lehrer/in',
      berufsgruppe: 'Bildung',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 3200, median: 3600, p75: 4000 },
        '3-5': { p25: 3500, median: 3900, p75: 4300 },
        '6-10': { p25: 3800, median: 4300, p75: 4700 },
        '10+': { p25: 4200, median: 4800, p75: 5300 },
      },
      gehalt_nach_region: {
        'Bayern': 4400, 'Baden-Württemberg': 4300, 'Hessen': 4200,
        'Hamburg': 4300, 'Nordrhein-Westfalen': 4100, 'Berlin': 4000,
        'Niedersachsen': 3900, 'Schleswig-Holstein': 3800, 'Rheinland-Pfalz': 3800,
        'Bremen': 3900, 'Saarland': 3700, 'Sachsen': 3600, 'Sachsen-Anhalt': 3500,
        'Thüringen': 3500, 'Brandenburg': 3600, 'Mecklenburg-Vorpommern': 3400,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 3700, 'Mittel (50-250)': 3900,
        'Groß (250+)': 4100, 'Konzern (1000+)': 4300,
      },
    },

    // ── 18. Pflegefachkraft ───────────────────────────────────────────────
    {
      titel: 'Pflegefachkraft',
      berufsgruppe: 'Gesundheit',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2500, median: 2900, p75: 3300 },
        '3-5': { p25: 2800, median: 3200, p75: 3600 },
        '6-10': { p25: 3100, median: 3500, p75: 3900 },
        '10+': { p25: 3400, median: 3800, p75: 4300 },
      },
      gehalt_nach_region: {
        'Bayern': 3400, 'Baden-Württemberg': 3400, 'Hessen': 3300,
        'Hamburg': 3300, 'Nordrhein-Westfalen': 3200, 'Berlin': 3100,
        'Niedersachsen': 3000, 'Schleswig-Holstein': 2900, 'Rheinland-Pfalz': 2900,
        'Bremen': 3000, 'Saarland': 2800, 'Sachsen': 2700, 'Sachsen-Anhalt': 2600,
        'Thüringen': 2600, 'Brandenburg': 2700, 'Mecklenburg-Vorpommern': 2500,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 2800, 'Mittel (50-250)': 3100,
        'Groß (250+)': 3400, 'Konzern (1000+)': 3600,
      },
    },

    // ── 19. Kaufmann/-frau Einzelhandel ───────────────────────────────────
    {
      titel: 'Kaufmann/-frau Einzelhandel',
      berufsgruppe: 'Handel',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 1900, median: 2200, p75: 2500 },
        '3-5': { p25: 2100, median: 2500, p75: 2900 },
        '6-10': { p25: 2400, median: 2800, p75: 3200 },
        '10+': { p25: 2600, median: 3100, p75: 3600 },
      },
      gehalt_nach_region: {
        'Bayern': 2600, 'Baden-Württemberg': 2600, 'Hessen': 2500,
        'Hamburg': 2500, 'Nordrhein-Westfalen': 2400, 'Berlin': 2300,
        'Niedersachsen': 2200, 'Schleswig-Holstein': 2100, 'Rheinland-Pfalz': 2200,
        'Bremen': 2200, 'Saarland': 2100, 'Sachsen': 2000, 'Sachsen-Anhalt': 1900,
        'Thüringen': 1900, 'Brandenburg': 2000, 'Mecklenburg-Vorpommern': 1800,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 2100, 'Mittel (50-250)': 2400,
        'Groß (250+)': 2700, 'Konzern (1000+)': 2900,
      },
    },

    // ── 20. Bankkaufmann/-frau ────────────────────────────────────────────
    {
      titel: 'Bankkaufmann/-frau',
      berufsgruppe: 'Finance',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2500, median: 2900, p75: 3400 },
        '3-5': { p25: 2900, median: 3400, p75: 4000 },
        '6-10': { p25: 3300, median: 3900, p75: 4600 },
        '10+': { p25: 3700, median: 4400, p75: 5200 },
      },
      gehalt_nach_region: {
        'Bayern': 3700, 'Baden-Württemberg': 3600, 'Hessen': 3800,
        'Hamburg': 3500, 'Nordrhein-Westfalen': 3400, 'Berlin': 3200,
        'Niedersachsen': 3100, 'Schleswig-Holstein': 3000, 'Rheinland-Pfalz': 3000,
        'Bremen': 3100, 'Saarland': 2900, 'Sachsen': 2800, 'Sachsen-Anhalt': 2700,
        'Thüringen': 2700, 'Brandenburg': 2800, 'Mecklenburg-Vorpommern': 2600,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 2900, 'Mittel (50-250)': 3300,
        'Groß (250+)': 3700, 'Konzern (1000+)': 4200,
      },
    },

    // ── 21. Logistiker/in ─────────────────────────────────────────────────
    {
      titel: 'Logistiker/in',
      berufsgruppe: 'Logistik',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2300, median: 2700, p75: 3200 },
        '3-5': { p25: 2700, median: 3200, p75: 3800 },
        '6-10': { p25: 3100, median: 3700, p75: 4400 },
        '10+': { p25: 3500, median: 4200, p75: 5100 },
      },
      gehalt_nach_region: {
        'Bayern': 3500, 'Baden-Württemberg': 3400, 'Hessen': 3400,
        'Hamburg': 3500, 'Nordrhein-Westfalen': 3300, 'Berlin': 3100,
        'Niedersachsen': 3100, 'Schleswig-Holstein': 2900, 'Rheinland-Pfalz': 3000,
        'Bremen': 3100, 'Saarland': 2800, 'Sachsen': 2700, 'Sachsen-Anhalt': 2600,
        'Thüringen': 2600, 'Brandenburg': 2700, 'Mecklenburg-Vorpommern': 2500,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 2800, 'Mittel (50-250)': 3200,
        'Groß (250+)': 3600, 'Konzern (1000+)': 4100,
      },
    },

    // ── 22. Einkäufer/in ──────────────────────────────────────────────────
    {
      titel: 'Einkäufer/in',
      berufsgruppe: 'Beschaffung',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2600, median: 3000, p75: 3500 },
        '3-5': { p25: 3100, median: 3600, p75: 4300 },
        '6-10': { p25: 3600, median: 4300, p75: 5100 },
        '10+': { p25: 4100, median: 4900, p75: 5900 },
      },
      gehalt_nach_region: {
        'Bayern': 4000, 'Baden-Württemberg': 3900, 'Hessen': 3800,
        'Hamburg': 3800, 'Nordrhein-Westfalen': 3600, 'Berlin': 3400,
        'Niedersachsen': 3400, 'Schleswig-Holstein': 3200, 'Rheinland-Pfalz': 3300,
        'Bremen': 3300, 'Saarland': 3100, 'Sachsen': 3000, 'Sachsen-Anhalt': 2900,
        'Thüringen': 2900, 'Brandenburg': 3000, 'Mecklenburg-Vorpommern': 2800,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 3200, 'Mittel (50-250)': 3600,
        'Groß (250+)': 4100, 'Konzern (1000+)': 4600,
      },
    },

    // ── 23. Produktmanager/in ─────────────────────────────────────────────
    {
      titel: 'Produktmanager/in',
      berufsgruppe: 'Management',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 3000, median: 3500, p75: 4100 },
        '3-5': { p25: 3600, median: 4300, p75: 5200 },
        '6-10': { p25: 4200, median: 5100, p75: 6200 },
        '10+': { p25: 4800, median: 5900, p75: 7300 },
      },
      gehalt_nach_region: {
        'Bayern': 4700, 'Baden-Württemberg': 4600, 'Hessen': 4500,
        'Hamburg': 4400, 'Nordrhein-Westfalen': 4200, 'Berlin': 4000,
        'Niedersachsen': 3900, 'Schleswig-Holstein': 3700, 'Rheinland-Pfalz': 3800,
        'Bremen': 3800, 'Saarland': 3600, 'Sachsen': 3400, 'Sachsen-Anhalt': 3300,
        'Thüringen': 3300, 'Brandenburg': 3400, 'Mecklenburg-Vorpommern': 3200,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 3700, 'Mittel (50-250)': 4200,
        'Groß (250+)': 4800, 'Konzern (1000+)': 5400,
      },
    },

    // ── 24. UX/UI Designer/in ─────────────────────────────────────────────
    {
      titel: 'UX/UI Designer/in',
      berufsgruppe: 'IT/Design',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2600, median: 3100, p75: 3600 },
        '3-5': { p25: 3100, median: 3800, p75: 4500 },
        '6-10': { p25: 3700, median: 4500, p75: 5400 },
        '10+': { p25: 4200, median: 5200, p75: 6300 },
      },
      gehalt_nach_region: {
        'Bayern': 4200, 'Baden-Württemberg': 4100, 'Hessen': 4000,
        'Hamburg': 4000, 'Nordrhein-Westfalen': 3800, 'Berlin': 3700,
        'Niedersachsen': 3500, 'Schleswig-Holstein': 3300, 'Rheinland-Pfalz': 3400,
        'Bremen': 3400, 'Saarland': 3200, 'Sachsen': 3100, 'Sachsen-Anhalt': 3000,
        'Thüringen': 3000, 'Brandenburg': 3100, 'Mecklenburg-Vorpommern': 2900,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 3300, 'Mittel (50-250)': 3700,
        'Groß (250+)': 4200, 'Konzern (1000+)': 4700,
      },
    },

    // ── 25. Buchhalter/in ─────────────────────────────────────────────────
    {
      titel: 'Buchhalter/in',
      berufsgruppe: 'Finance',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2200, median: 2600, p75: 3100 },
        '3-5': { p25: 2600, median: 3100, p75: 3600 },
        '6-10': { p25: 3000, median: 3500, p75: 4100 },
        '10+': { p25: 3300, median: 3900, p75: 4600 },
      },
      gehalt_nach_region: {
        'Bayern': 3300, 'Baden-Württemberg': 3200, 'Hessen': 3200,
        'Hamburg': 3100, 'Nordrhein-Westfalen': 3000, 'Berlin': 2800,
        'Niedersachsen': 2800, 'Schleswig-Holstein': 2600, 'Rheinland-Pfalz': 2700,
        'Bremen': 2700, 'Saarland': 2600, 'Sachsen': 2500, 'Sachsen-Anhalt': 2400,
        'Thüringen': 2400, 'Brandenburg': 2500, 'Mecklenburg-Vorpommern': 2300,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 2600, 'Mittel (50-250)': 3000,
        'Groß (250+)': 3400, 'Konzern (1000+)': 3800,
      },
    },

    // ── 26. Immobilienmakler/in ───────────────────────────────────────────
    {
      titel: 'Immobilienmakler/in',
      berufsgruppe: 'Immobilien',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2200, median: 2700, p75: 3300 },
        '3-5': { p25: 2700, median: 3300, p75: 4100 },
        '6-10': { p25: 3200, median: 4000, p75: 5000 },
        '10+': { p25: 3700, median: 4700, p75: 6000 },
      },
      gehalt_nach_region: {
        'Bayern': 3800, 'Baden-Württemberg': 3600, 'Hessen': 3600,
        'Hamburg': 3700, 'Nordrhein-Westfalen': 3400, 'Berlin': 3300,
        'Niedersachsen': 3100, 'Schleswig-Holstein': 2900, 'Rheinland-Pfalz': 3000,
        'Bremen': 3000, 'Saarland': 2800, 'Sachsen': 2700, 'Sachsen-Anhalt': 2600,
        'Thüringen': 2600, 'Brandenburg': 2700, 'Mecklenburg-Vorpommern': 2500,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 2900, 'Mittel (50-250)': 3400,
        'Groß (250+)': 3900, 'Konzern (1000+)': 4300,
      },
    },

    // ── 27. Pharmareferent/in ─────────────────────────────────────────────
    {
      titel: 'Pharmareferent/in',
      berufsgruppe: 'Pharma',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 3000, median: 3500, p75: 4100 },
        '3-5': { p25: 3500, median: 4200, p75: 5000 },
        '6-10': { p25: 4100, median: 4900, p75: 5800 },
        '10+': { p25: 4600, median: 5600, p75: 6700 },
      },
      gehalt_nach_region: {
        'Bayern': 4500, 'Baden-Württemberg': 4500, 'Hessen': 4400,
        'Hamburg': 4300, 'Nordrhein-Westfalen': 4200, 'Berlin': 4000,
        'Niedersachsen': 3900, 'Schleswig-Holstein': 3700, 'Rheinland-Pfalz': 3900,
        'Bremen': 3800, 'Saarland': 3600, 'Sachsen': 3500, 'Sachsen-Anhalt': 3400,
        'Thüringen': 3400, 'Brandenburg': 3500, 'Mecklenburg-Vorpommern': 3300,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 3600, 'Mittel (50-250)': 4100,
        'Groß (250+)': 4600, 'Konzern (1000+)': 5200,
      },
    },

    // ── 28. Chemiker/in ───────────────────────────────────────────────────
    {
      titel: 'Chemiker/in',
      berufsgruppe: 'Chemie',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 3100, median: 3600, p75: 4200 },
        '3-5': { p25: 3700, median: 4400, p75: 5200 },
        '6-10': { p25: 4300, median: 5200, p75: 6200 },
        '10+': { p25: 4900, median: 6000, p75: 7300 },
      },
      gehalt_nach_region: {
        'Bayern': 4800, 'Baden-Württemberg': 4800, 'Hessen': 4700,
        'Hamburg': 4500, 'Nordrhein-Westfalen': 4500, 'Berlin': 4200,
        'Niedersachsen': 4100, 'Schleswig-Holstein': 3900, 'Rheinland-Pfalz': 4200,
        'Bremen': 4000, 'Saarland': 3800, 'Sachsen': 3700, 'Sachsen-Anhalt': 3600,
        'Thüringen': 3600, 'Brandenburg': 3700, 'Mecklenburg-Vorpommern': 3400,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 3800, 'Mittel (50-250)': 4400,
        'Groß (250+)': 5000, 'Konzern (1000+)': 5700,
      },
    },

    // ── 29. Biologe/Biologin ──────────────────────────────────────────────
    {
      titel: 'Biologe/Biologin',
      berufsgruppe: 'Wissenschaft',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2600, median: 3100, p75: 3600 },
        '3-5': { p25: 3100, median: 3700, p75: 4400 },
        '6-10': { p25: 3600, median: 4300, p75: 5200 },
        '10+': { p25: 4100, median: 5000, p75: 6100 },
      },
      gehalt_nach_region: {
        'Bayern': 4100, 'Baden-Württemberg': 4000, 'Hessen': 3900,
        'Hamburg': 3800, 'Nordrhein-Westfalen': 3700, 'Berlin': 3500,
        'Niedersachsen': 3400, 'Schleswig-Holstein': 3200, 'Rheinland-Pfalz': 3300,
        'Bremen': 3300, 'Saarland': 3100, 'Sachsen': 3000, 'Sachsen-Anhalt': 2900,
        'Thüringen': 2900, 'Brandenburg': 3000, 'Mecklenburg-Vorpommern': 2800,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 3200, 'Mittel (50-250)': 3700,
        'Groß (250+)': 4200, 'Konzern (1000+)': 4800,
      },
    },

    // ── 30. Journalist/in ─────────────────────────────────────────────────
    {
      titel: 'Journalist/in',
      berufsgruppe: 'Medien',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2200, median: 2700, p75: 3200 },
        '3-5': { p25: 2700, median: 3200, p75: 3800 },
        '6-10': { p25: 3100, median: 3700, p75: 4400 },
        '10+': { p25: 3500, median: 4200, p75: 5100 },
      },
      gehalt_nach_region: {
        'Bayern': 3500, 'Baden-Württemberg': 3400, 'Hessen': 3400,
        'Hamburg': 3500, 'Nordrhein-Westfalen': 3300, 'Berlin': 3200,
        'Niedersachsen': 3000, 'Schleswig-Holstein': 2800, 'Rheinland-Pfalz': 2900,
        'Bremen': 2900, 'Saarland': 2700, 'Sachsen': 2600, 'Sachsen-Anhalt': 2500,
        'Thüringen': 2500, 'Brandenburg': 2600, 'Mecklenburg-Vorpommern': 2400,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 2700, 'Mittel (50-250)': 3200,
        'Groß (250+)': 3700, 'Konzern (1000+)': 4200,
      },
    },

    // ── 31. Grafikdesigner/in ─────────────────────────────────────────────
    {
      titel: 'Grafikdesigner/in',
      berufsgruppe: 'Design',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2000, median: 2400, p75: 2900 },
        '3-5': { p25: 2400, median: 2900, p75: 3400 },
        '6-10': { p25: 2800, median: 3400, p75: 4000 },
        '10+': { p25: 3200, median: 3900, p75: 4600 },
      },
      gehalt_nach_region: {
        'Bayern': 3200, 'Baden-Württemberg': 3100, 'Hessen': 3100,
        'Hamburg': 3100, 'Nordrhein-Westfalen': 2900, 'Berlin': 2800,
        'Niedersachsen': 2700, 'Schleswig-Holstein': 2500, 'Rheinland-Pfalz': 2600,
        'Bremen': 2600, 'Saarland': 2400, 'Sachsen': 2300, 'Sachsen-Anhalt': 2200,
        'Thüringen': 2200, 'Brandenburg': 2300, 'Mecklenburg-Vorpommern': 2100,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 2500, 'Mittel (50-250)': 2900,
        'Groß (250+)': 3300, 'Konzern (1000+)': 3700,
      },
    },

    // ── 32. Koch/Köchin ───────────────────────────────────────────────────
    {
      titel: 'Koch/Köchin',
      berufsgruppe: 'Gastronomie',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 1700, median: 2000, p75: 2400 },
        '3-5': { p25: 2000, median: 2300, p75: 2700 },
        '6-10': { p25: 2200, median: 2600, p75: 3100 },
        '10+': { p25: 2500, median: 3000, p75: 3600 },
      },
      gehalt_nach_region: {
        'Bayern': 2500, 'Baden-Württemberg': 2400, 'Hessen': 2400,
        'Hamburg': 2400, 'Nordrhein-Westfalen': 2300, 'Berlin': 2200,
        'Niedersachsen': 2100, 'Schleswig-Holstein': 2000, 'Rheinland-Pfalz': 2100,
        'Bremen': 2100, 'Saarland': 2000, 'Sachsen': 1900, 'Sachsen-Anhalt': 1800,
        'Thüringen': 1800, 'Brandenburg': 1900, 'Mecklenburg-Vorpommern': 1800,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 2000, 'Mittel (50-250)': 2300,
        'Groß (250+)': 2600, 'Konzern (1000+)': 2900,
      },
    },

    // ── 33. Mechatroniker/in ──────────────────────────────────────────────
    {
      titel: 'Mechatroniker/in',
      berufsgruppe: 'Technik',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2300, median: 2700, p75: 3100 },
        '3-5': { p25: 2700, median: 3200, p75: 3700 },
        '6-10': { p25: 3100, median: 3600, p75: 4200 },
        '10+': { p25: 3400, median: 4000, p75: 4700 },
      },
      gehalt_nach_region: {
        'Bayern': 3500, 'Baden-Württemberg': 3500, 'Hessen': 3300,
        'Hamburg': 3200, 'Nordrhein-Westfalen': 3200, 'Berlin': 3000,
        'Niedersachsen': 3100, 'Schleswig-Holstein': 2900, 'Rheinland-Pfalz': 2900,
        'Bremen': 3000, 'Saarland': 2800, 'Sachsen': 2700, 'Sachsen-Anhalt': 2600,
        'Thüringen': 2600, 'Brandenburg': 2700, 'Mecklenburg-Vorpommern': 2500,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 2800, 'Mittel (50-250)': 3200,
        'Groß (250+)': 3600, 'Konzern (1000+)': 4000,
      },
    },

    // ── 34. Sozialarbeiter/in ─────────────────────────────────────────────
    {
      titel: 'Sozialarbeiter/in',
      berufsgruppe: 'Soziales',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 2400, median: 2800, p75: 3200 },
        '3-5': { p25: 2700, median: 3100, p75: 3500 },
        '6-10': { p25: 3000, median: 3500, p75: 3900 },
        '10+': { p25: 3300, median: 3800, p75: 4300 },
      },
      gehalt_nach_region: {
        'Bayern': 3300, 'Baden-Württemberg': 3200, 'Hessen': 3200,
        'Hamburg': 3200, 'Nordrhein-Westfalen': 3100, 'Berlin': 3000,
        'Niedersachsen': 2900, 'Schleswig-Holstein': 2800, 'Rheinland-Pfalz': 2800,
        'Bremen': 2900, 'Saarland': 2700, 'Sachsen': 2600, 'Sachsen-Anhalt': 2500,
        'Thüringen': 2500, 'Brandenburg': 2600, 'Mecklenburg-Vorpommern': 2400,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 2700, 'Mittel (50-250)': 3000,
        'Groß (250+)': 3300, 'Konzern (1000+)': 3500,
      },
    },

    // ── 35. Zahnarzt/Zahnärztin ───────────────────────────────────────────
    {
      titel: 'Zahnarzt/Zahnärztin',
      berufsgruppe: 'Medizin',
      gehalt_nach_erfahrung: {
        '0-2': { p25: 3500, median: 4100, p75: 4800 },
        '3-5': { p25: 4200, median: 5000, p75: 6000 },
        '6-10': { p25: 5000, median: 6200, p75: 7500 },
        '10+': { p25: 6000, median: 7500, p75: 9500 },
      },
      gehalt_nach_region: {
        'Bayern': 5800, 'Baden-Württemberg': 5700, 'Hessen': 5600,
        'Hamburg': 5500, 'Nordrhein-Westfalen': 5300, 'Berlin': 5100,
        'Niedersachsen': 5100, 'Schleswig-Holstein': 4900, 'Rheinland-Pfalz': 5000,
        'Bremen': 5000, 'Saarland': 4800, 'Sachsen': 4600, 'Sachsen-Anhalt': 4500,
        'Thüringen': 4500, 'Brandenburg': 4600, 'Mecklenburg-Vorpommern': 4400,
      },
      gehalt_nach_groesse: {
        'Klein (<50)': 4800, 'Mittel (50-250)': 5400,
        'Groß (250+)': 6000, 'Konzern (1000+)': 6600,
      },
    },
  ],
};

// ── Hilfsdaten ────────────────────────────────────────────────────────────────

export const BUNDESLAENDER = [
  'Bayern', 'Baden-Württemberg', 'Hessen', 'Hamburg', 'Nordrhein-Westfalen',
  'Berlin', 'Niedersachsen', 'Schleswig-Holstein', 'Rheinland-Pfalz', 'Bremen',
  'Saarland', 'Sachsen', 'Sachsen-Anhalt', 'Thüringen', 'Brandenburg', 'Mecklenburg-Vorpommern',
];

export const ERFAHRUNGSSTUFEN = ['0-2', '3-5', '6-10', '10+'];

export const UNTERNEHMENSGROESSEN = ['Klein (<50)', 'Mittel (50-250)', 'Groß (250+)', 'Konzern (1000+)'];
