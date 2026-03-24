// ============================================================================
// Speedreading E-Learning — Complete Content Data
// 15 Module, 3 Boss-Fights, 10 Widgets, ~230 Minuten
// Kurs-ID: c1000000-0000-0000-0000-000000000004 | Farbe: #F59E0B
// ============================================================================

// ---------------------------------------------------------------------------
// 1. SELBSTDIAGNOSE — 10 Fragen, Scoring 1-5, 3 Ergebnis-Stufen
// ---------------------------------------------------------------------------
export const SELBSTDIAGNOSE_SPEED = {
  titel: 'Selbstdiagnose: Wie schnell & effektiv liest du?',
  beschreibung:
    'Beantworte die folgenden 10 Fragen ehrlich. Es gibt keine richtigen oder falschen Antworten — nur dein persönlicher Ist-Zustand.',
  skala: { min: 1, max: 5, labels: ['Trifft gar nicht zu', 'Trifft selten zu', 'Teils-teils', 'Trifft oft zu', 'Trifft voll zu'] },
  fragen: [
    { id: 1, text: 'Ich lese schneller als die meisten Menschen in meinem Umfeld.', kategorie: 'geschwindigkeit' },
    { id: 2, text: 'Ich spreche beim Lesen die Wörter innerlich mit (Subvokalisierung).', kategorie: 'bremsen', invers: true },
    { id: 3, text: 'Ich kann einen Zeitungsartikel in unter 3 Minuten erfassen und zusammenfassen.', kategorie: 'geschwindigkeit' },
    { id: 4, text: 'Ich springe beim Lesen häufig zurück zu Stellen die ich schon gelesen habe (Regression).', kategorie: 'bremsen', invers: true },
    { id: 5, text: 'Ich weiß, welche Texte ich schnell überfliegen kann und welche langsames Lesen brauchen.', kategorie: 'strategie' },
    { id: 6, text: 'Ich mache mir nach dem Lesen Notizen über das Gelesene.', kategorie: 'verstaendnis' },
    { id: 7, text: 'Am Ende eines Textes weiß ich oft nicht mehr, was am Anfang stand.', kategorie: 'verstaendnis', invers: true },
    { id: 8, text: 'Ich habe ein System um zu entscheiden, was ich lese und was nicht.', kategorie: 'relevanz' },
    { id: 9, text: 'Meine Augen werden beim Lesen schnell müde oder ich bekomme Kopfschmerzen.', kategorie: 'gesundheit', invers: true },
    { id: 10, text: 'Ich fühle mich von der Menge an Texten die ich lesen muss überfordert.', kategorie: 'relevanz', invers: true },
  ],
  ergebnisse: [
    {
      id: 'anfaenger',
      range: [10, 22],
      titel: 'Lese-Anfänger',
      beschreibung:
        'Du liest wahrscheinlich Wort für Wort und hast noch keine bewusste Lesestrategie. Das ist kein Problem — die meisten starten hier. Dieser Kurs wird deine Lesegeschwindigkeit verdoppeln.',
      empfehlung: 'Starte mit Modul 1 und arbeite dich Schritt für Schritt durch. Besonders die Module 4-6 (Bremsen lösen, Blickspanne, Chunk-Reading) werden dir sofort helfen.',
    },
    {
      id: 'fortgeschritten',
      range: [23, 37],
      titel: 'Fortgeschrittener Leser',
      beschreibung:
        'Du hast bereits ein gutes Lesetempo, aber es gibt noch viel Optimierungspotenzial. Besonders bei der Auswahl WAS du liest und bei der Verarbeitung NACH dem Lesen.',
      empfehlung: 'Fokussiere dich auf die Module 8-10 (Differenzierung, Relevanz-Filter, Notizen). Hier liegt dein größtes Hebelpotenzial.',
    },
    {
      id: 'speed_reader',
      range: [38, 50],
      titel: 'Speed-Reader',
      beschreibung:
        'Du liest bereits schnell und bewusst. Dieser Kurs wird dir helfen, die letzten Prozente herauszuholen und ein System aufzubauen das langfristig funktioniert.',
      empfehlung: 'Springe direkt zu den Modulen die dich am meisten interessieren. Modul 9 (Relevanz-Filter) und Modul 13 (Führungskräfte) bringen dir den meisten Mehrwert.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 2. STORIES — Emotionale Geschichten pro Modul
// ---------------------------------------------------------------------------
export const STORIES_SPEED = {
  modul_1: {
    titel: 'Die E-Mail die alles veränderte',
    protagonist: { name: 'Thomas', alter: 42, rolle: 'Abteilungsleiter' },
    inhalt: `Thomas starrt auf seinen Bildschirm. 247 ungelesene E-Mails. Es ist Montagmorgen, 08:15.

Er beginnt oben. Liest jede Mail von Anfang bis Ende. Wort für Wort. Wie er es seit 20 Jahren macht.

Um 11:30 hat er 43 E-Mails geschafft. 204 warten noch. Sein Chef ruft an: "Thomas, hast du den Quartalsbericht gelesen? Meeting in 30 Minuten."

Der Report liegt seit Freitag in seinem Postfach. 38 Seiten. Ungelesen.

Thomas versucht zu lesen. Seite 1... Seite 2... Er liest jeden Satz. Spricht innerlich mit. Springt zurück wenn er etwas nicht versteht.

Um 12:00 ist er auf Seite 9. Das Meeting beginnt. Er hat keine Ahnung was im Report steht.

Drei Monate später hat Thomas Speedreading gelernt. Er liest 247 E-Mails in 90 Minuten. Den Quartalsbericht in 20 Minuten. Nicht weil er schlampig liest — sondern weil er INTELLIGENT liest.`,
    kernbotschaft: 'Langsam lesen ist nicht gründlicher. Es ist nur langsamer.',
  },

  modul_9: {
    titel: 'Der CEO der aufhörte alles zu lesen',
    protagonist: { name: 'Karen', alter: 48, rolle: 'CEO' },
    inhalt: `Karen, 48, CEO. Las jeden Tag: 5 Zeitungen, 30 Newsletter, 200 E-Mails, 10 Reports.

Eines Tages strich sie 80% davon. Kündigte 25 Newsletter. Delegierte 150 E-Mails. Las nur noch 2 Reports selbst.

Ihr Team war schockiert: "Bist du nicht mehr informiert?"

Karen: "Ich bin BESSER informiert. Weil ich jetzt nur noch lese, was meine Entscheidungen beeinflusst. Der Rest war Informations-Rauschen."

Die wichtigste Speedreading-Technik ist nicht schneller lesen — sondern WENIGER lesen.`,
    kernbotschaft: 'Die wichtigste Speedreading-Skill ist nicht schneller lesen — sondern zu entscheiden WAS man liest.',
  },
};

// ---------------------------------------------------------------------------
// 3. BOSS-FIGHTS — 3 Kämpfe
// ---------------------------------------------------------------------------
export const BOSS_FIGHTS_SPEED = {
  subvokalisierung: {
    name: 'Der Subvokalisierungs-Dämon',
    beschreibung: 'Dein innerer Vorleser bremst dich aus. Besiege ihn, um deine Lesegeschwindigkeit zu verdoppeln.',
    user_stat: { name: 'Lesetempo', max: 100 },
    boss_stat: { name: 'Subvokalisierung', max: 100 },
    wellen: [
      {
        name: 'Der innere Vorleser',
        situation: 'Du liest einen Fachartikel und merkst: Du sprichst jedes Wort innerlich mit. 220 WPM.',
        optionen: [
          { text: 'Weiter Wort für Wort lesen — ist ja gründlicher', user_damage: 30, boss_damage: 0, feedback: 'Falsch! Subvokalisierung begrenzt dich auf Sprechgeschwindigkeit (~250 WPM). Dein Gehirn kann 3x schneller verarbeiten.' },
          { text: 'Einen Stift als Pacer verwenden und die Augen führen', user_damage: 0, boss_damage: 35, feedback: 'Richtig! Der Pacer zwingt deine Augen vorwärts. Dein Gehirn folgt — ohne innerliches Mitsprechen.' },
          { text: 'Leise Musik anmachen um die innere Stimme zu übertönen', user_damage: 10, boss_damage: 15, feedback: 'Teilweise effektiv. Musik kann die Subvokalisierung stören, aber der Pacer ist die effektivere Methode.' },
        ],
      },
      {
        name: 'Die Regression-Falle',
        situation: 'Du bist auf Seite 5 und denkst: "Was stand nochmal auf Seite 3?" Deine Augen springen zurück.',
        optionen: [
          { text: 'Zurückblättern und nochmal lesen', user_damage: 35, boss_damage: 0, feedback: 'Regression kostet dich 30% deiner Lesezeit! Studien zeigen: Du verstehst NICHT mehr wenn du zurückspringst.' },
          { text: 'Weiterlesen und darauf vertrauen, dass das Gehirn die Info hat', user_damage: 0, boss_damage: 40, feedback: 'Perfekt! Dein Gehirn speichert mehr als du denkst. Regression ist eine Gewohnheit, kein Verständnis-Tool.' },
          { text: 'Den Absatz nochmal lesen, aber schneller', user_damage: 15, boss_damage: 10, feedback: 'Besser als langsam zurücklesen, aber immer noch Regression. Trainiere dir das Zurückspringen ab.' },
        ],
      },
      {
        name: 'Der Wort-für-Wort Leser',
        situation: 'Du liest: "Der | schnelle | braune | Fuchs | springt | über | den | faulen | Hund." — 9 Fixierungen für 9 Wörter.',
        optionen: [
          { text: 'So ist Lesen halt — Wort für Wort', user_damage: 30, boss_damage: 0, feedback: 'Nein! Dein Blickfeld kann 3-4 Wörter gleichzeitig erfassen. 9 Fixierungen → 3 Fixierungen = 3x schneller.' },
          { text: 'In Wortgruppen lesen: "Der schnelle braune" | "Fuchs springt" | "über den faulen Hund"', user_damage: 0, boss_damage: 45, feedback: 'BOSS BESIEGT! Chunk-Reading reduziert Fixierungen um 60%. Dein Gehirn versteht Wortgruppen sogar BESSER als Einzelwörter.' },
          { text: 'Schneller die Augen bewegen', user_damage: 15, boss_damage: 10, feedback: 'Schnellere Augenbewegung allein hilft nicht viel. Die Lösung ist WENIGER Fixierungen, nicht schnellere.' },
        ],
      },
    ],
    sieg: { badge: 'Subvokalisierungs-Bezwinger', xp: 150, text: 'Du hast die größte Lese-Bremse besiegt. Pacer, keine Regression, Chunk-Reading — du bist bereit für Speed!' },
  },

  report_berg: {
    name: 'Der Report-Berg',
    beschreibung: 'Dein Chef will in 30 Minuten deine Meinung zu einem 40-Seiten Report. Challenge accepted.',
    user_stat: { name: 'Fokus-Zeit', max: 100 },
    boss_stat: { name: 'Report-Berg', max: 100 },
    wellen: [
      {
        name: 'Der 40-Seiten Report',
        situation: 'Dein Chef will bis 10:00 deine Meinung zum Quartalsbericht. 40 Seiten. Es ist 09:15.',
        optionen: [
          { text: 'Von Seite 1 anfangen und Wort für Wort lesen', user_damage: 45, boss_damage: 0, feedback: 'Unmöglich in 45 Minuten. Du bist auf Seite 12 wenn die Deadline kommt.' },
          { text: 'OPIR: Overview (Inhaltsverzeichnis), Preview (Grafiken + Fazit), Intensive (nur auffällige Abschnitte), Review (3-Satz Zusammenfassung)', user_damage: 0, boss_damage: 50, feedback: 'PERFEKT! In 20 Minuten hast du die Kernaussagen. Du antwortest dem Chef mit 3 präzisen Sätzen.' },
          { text: 'Nur das Fazit lesen', user_damage: 15, boss_damage: 20, feedback: 'Besser als nichts, aber du verpasst die Nuancen. OPIR gibt dir in gleicher Zeit VIEL mehr Kontext.' },
        ],
      },
      {
        name: 'Die Grafik-Flut',
        situation: 'Im Report sind 15 Grafiken. Jede hat Beschriftungen, Fußnoten, Erklärungen.',
        optionen: [
          { text: 'Jede Grafik im Detail studieren', user_damage: 35, boss_damage: 0, feedback: '15 Grafiken à 3 Minuten = 45 Minuten nur für Grafiken. Du hast keine Zeit für den Text.' },
          { text: 'Nur die Grafiken scannen die vom Trend abweichen (Ausreißer)', user_damage: 0, boss_damage: 35, feedback: 'Smart! Ausreißer sind die Story. Wenn alles normal aussieht, brauchst du die Grafik nicht im Detail.' },
          { text: 'Grafiken überspringen und nur den Text lesen', user_damage: 20, boss_damage: 10, feedback: 'Grafiken enthalten oft die wichtigsten Insights. Überspringen ist riskant — scannen ist besser.' },
        ],
      },
      {
        name: 'Die Zusammenfassung',
        situation: 'Du hast 20 Minuten gelesen. Jetzt musst du dem Chef in 2 Sätzen antworten.',
        optionen: [
          { text: '"Ich brauche noch mehr Zeit um den Report gründlich zu lesen"', user_damage: 30, boss_damage: 0, feedback: 'Du hattest 45 Minuten. Mehr Zeit heißt nicht mehr Verständnis. Es heißt: ineffizientes Lesen.' },
          { text: '"Umsatz +12%, Kosten stabil, aber die US-Expansion in Q3 braucht 2 Mio mehr als geplant — das ist der kritische Punkt."', user_damage: 0, boss_damage: 50, feedback: 'BOSS BESIEGT! Präzise, faktenbasiert, auf den Punkt. Das ist Speedreading in Aktion.' },
          { text: '"Sieht insgesamt gut aus, ein paar Punkte müssten wir besprechen"', user_damage: 15, boss_damage: 15, feedback: 'Zu vage. Dein Chef will Fakten, keine Zusammenfassungen von Zusammenfassungen.' },
        ],
      },
    ],
    sieg: { badge: 'Report-Bezwinger', xp: 200, text: 'Du meisterst 40-Seiten Reports in unter 25 Minuten. OPIR + Scanning + Kernaussagen = deine Superkraft.' },
  },

  informationsflut: {
    name: 'Die Informationsflut',
    beschreibung: 'Montag 08:00. 200 E-Mails, 15 Newsletter, 5 Reports. Du hast 60 Minuten.',
    user_stat: { name: 'Fokus-Zeit', max: 100 },
    boss_stat: { name: 'Info-Lawine', max: 100 },
    wellen: [
      {
        name: 'Die Newsletter-Lawine',
        situation: '15 Newsletter im Postfach. 12 davon hast du seit Wochen nicht gelesen.',
        optionen: [
          { text: 'Alle durchlesen, könnte was Wichtiges dabei sein', user_damage: 35, boss_damage: 0, feedback: '45 Minuten für Newsletter die du nie umsetzt. Dein Projekt-Report wartet immer noch.' },
          { text: 'Die 12 ungelesenen sofort abbestellen. Die 3 relevanten mit Skimming in 10 Min scannen.', user_damage: 0, boss_damage: 45, feedback: 'PERFEKT! Du hast 12 Quellen eliminiert die nur Rauschen produzieren. 10 Min für die 3 die zählen.' },
          { text: 'Alle als gelesen markieren und ignorieren', user_damage: 10, boss_damage: 20, feedback: 'Schnell aber nicht nachhaltig. Morgen sind wieder 15 da. Abbestellen ist die dauerhafte Lösung.' },
        ],
      },
      {
        name: 'Der CC-Berg',
        situation: '80 der 200 E-Mails sind CCs. Du bist nicht direkt angesprochen.',
        optionen: [
          { text: 'Alle CCs einzeln durchlesen', user_damage: 40, boss_damage: 0, feedback: '2 Stunden für Mails die nicht an dich gerichtet sind. Dein eigentlicher Job steht still.' },
          { text: 'Filter: Nur Mails AN MICH sofort lesen. CCs in separaten Ordner — 1x am Tag 10 Min scannen.', user_damage: 0, boss_damage: 40, feedback: 'Perfekt! Du trennst Signal von Rauschen. Die wichtigen CCs findest du beim 10-Min Scan.' },
          { text: 'Alle CCs löschen', user_damage: 15, boss_damage: 25, feedback: 'Radikal. Funktioniert meistens — aber manchmal ist eine CC-Mail doch relevant. Besser: Scannen statt löschen.' },
        ],
      },
      {
        name: 'Der 40-Seiten Report',
        situation: 'Dein Chef will bis 10:00 deine Meinung zum Quartalsbericht. 40 Seiten. Es ist 09:15.',
        optionen: [
          { text: 'Von Seite 1 anfangen', user_damage: 45, boss_damage: 0, feedback: 'Unmöglich in 45 Minuten. Du bist auf Seite 12 wenn die Deadline kommt.' },
          { text: 'OPIR: Overview → Preview → Intensive → Review', user_damage: 0, boss_damage: 50, feedback: 'BOSS BESIEGT! In 20 Minuten hast du die Kernaussagen. Du antwortest dem Chef mit 3 präzisen Sätzen.' },
          { text: 'Nur die Zusammenfassung am Ende lesen', user_damage: 20, boss_damage: 15, feedback: 'Besser als nichts, aber du verpasst die Nuancen und kritischen Details in den Grafiken.' },
        ],
      },
    ],
    sieg: { badge: 'Informations-Meister', xp: 250, text: 'Du beherrschst die Flut. Weniger lesen, mehr verstehen, schneller entscheiden.' },
  },
};

// ---------------------------------------------------------------------------
// 4. AUGENGESUNDHEIT & ERGONOMIE
// ---------------------------------------------------------------------------
export const AUGENGESUNDHEIT = {
  titel: 'Deine Augen sind dein wichtigstes Werkzeug',
  warnung: 'Speedreading ohne Augenpflege ist wie Sprinten ohne Aufwärmen. Du wirst schneller — und dann verletzt.',

  regel_20_20_20: {
    name: 'Die 20-20-20 Regel',
    erklaerung: 'Alle 20 Minuten → 20 Sekunden → auf etwas schauen das 20 Fuß (6 Meter) entfernt ist.',
    warum: 'Entspannt den Ziliarmuskel der beim Nahsehen dauerkontrahiert ist. Verhindert digitale Augenermüdung.',
    timer: true,
  },

  ergonomie_check: {
    titel: 'Der Ergonomie-Check',
    checks: [
      { bereich: 'Abstand', optimal: '50-70 cm zum Bildschirm (eine Armlänge)', check: 'Ist dein Bildschirm eine Armlänge entfernt?' },
      { bereich: 'Höhe', optimal: 'Oberkante Bildschirm = Augenhöhe', check: 'Schaust du leicht nach unten auf den Bildschirm?' },
      { bereich: 'Licht', optimal: 'Kein Gegenlicht, kein Schatten auf dem Bildschirm', check: 'Sitzt du mit dem Rücken zum Fenster?' },
      { bereich: 'Blaulicht', optimal: 'Night Shift / f.lux ab 20:00 Uhr aktivieren', check: 'Nutzt du einen Blaulichtfilter am Abend?' },
      { bereich: 'Blinzeln', optimal: 'Bewusst blinzeln: 15-20x pro Minute', check: 'Menschen blinzeln am Bildschirm nur 3-4x/Min statt 15-20x!' },
      { bereich: 'Pausen', optimal: '50 Min lesen → 10 Min Pause', check: 'Machst du Pausen oder liest du durch?' },
    ],
  },

  augen_yoga: [
    { name: 'Palmieren', anleitung: 'Hände reiben bis sie warm sind → Handflächen sanft auf geschlossene Augen legen → 60 Sekunden Dunkelheit genießen.', wirkung: 'Entspannt Augenmuskulatur und Sehnerv.' },
    { name: 'Fokus-Wechsel', anleitung: 'Daumen vor die Nase halten → Fokus auf Daumen → Fokus auf Wand → Daumen → Wand → 10x wiederholen.', wirkung: 'Trainiert Akkommodation (Nah-/Fernsicht Wechsel).' },
    { name: '8er-Kreise', anleitung: 'Stelle dir eine liegende 8 (∞) vor. Folge der Form mit den Augen ohne den Kopf zu bewegen. 10x pro Richtung.', wirkung: 'Stärkt die äußeren Augenmuskeln.' },
  ],
};

// ---------------------------------------------------------------------------
// 5. DIFFERENZIERUNGS-MATRIX
// ---------------------------------------------------------------------------
export const DIFFERENZIERUNG = {
  titel: 'Wann NICHT Speedreaden',
  kernbotschaft: 'Ein intelligenter Leser wechselt BEWUSST zwischen 4 Geschwindigkeiten.',

  matrix: [
    { modus: 'Deep Reading', emoji: '🐢', wpm: '100-200', wann: 'Verträge, Gesetze, Poesie, emotionale Texte, neues Lernmaterial', warum: 'Hier zählt jedes Wort. Ein übersehenes "nicht" im Vertrag kann 100.000€ kosten.', subvokalisierung: 'ERLAUBT' },
    { modus: 'Normales Lesen', emoji: '🚶', wpm: '200-300', wann: 'Bücher, ausführliche Artikel, persönliche Nachrichten', warum: 'Gutes Verständnis bei angenehmer Geschwindigkeit.', subvokalisierung: 'Minimal' },
    { modus: 'Speedreading', emoji: '🏃', wpm: '400-600', wann: 'E-Mails, Reports, Nachrichtenartikel, bekannte Fachliteratur', warum: 'Maximale Effizienz. Du extrahierst die Kerninfos und sparst Stunden.', subvokalisierung: 'AUS' },
    { modus: 'Skimming/Scanning', emoji: '⚡', wpm: '800-1500', wann: 'Inhaltsverzeichnisse, Suchergebnisse, Relevanz-Checks', warum: 'Du entscheidest in 30 Sekunden ob ein Text deine Zeit wert ist.', subvokalisierung: 'UNMÖGLICH' },
  ],

  uebung: {
    titel: 'Sortiere diese Texte in den richtigen Modus',
    texte: [
      { text: 'Arbeitsvertrag für deine neue Stelle', correct: 'deep' },
      { text: 'Newsletter von einer Fach-Website', correct: 'skim' },
      { text: 'Quartalsbericht (du kennst die Struktur)', correct: 'speed' },
      { text: 'Liebesbrief von deinem Partner', correct: 'deep' },
      { text: '100 E-Mails am Montagmorgen', correct: 'speed' },
      { text: 'Fachbuch zu einem neuen Thema (erstes Kapitel)', correct: 'normal' },
      { text: 'Zeitung im Café', correct: 'skim' },
      { text: 'Feedback-Mail vom Chef', correct: 'normal' },
    ],
  },
};

// ---------------------------------------------------------------------------
// 6. RELEVANZ-FILTER & PARA-METHODE
// ---------------------------------------------------------------------------
export const RELEVANZ_FILTER = {
  titel: 'Die Kunst des Weglassens: Was lese ich — was nicht?',

  para_methode: {
    name: 'Die PARA-Lese-Diät',
    erklaerung: 'Ordne JEDEN Input in eine von 4 Kategorien:',
    kategorien: [
      { buchstabe: 'P', name: 'Projekte', regel: 'Lese nur was DIREKT auf ein laufendes Projekt einzahlt. Alles andere: Archiv.', beispiel: 'Du arbeitest an einer Strategie-Präsentation → Nur Texte lesen die dieses Projekt voranbringen.' },
      { buchstabe: 'A', name: 'Areas', regel: 'Langfristige Verantwortungsbereiche. 1x pro Woche scannen, nicht täglich.', beispiel: 'Branchentrends, Wettbewerber-News → Sonntag 30 Min, nicht jeden Morgen 2 Stunden.' },
      { buchstabe: 'R', name: 'Ressourcen', regel: 'Interessant aber nicht dringend. In eine "Irgendwann lesen" Liste.', beispiel: 'Spannender Artikel über KI → Pocket/Readwise, nicht jetzt.' },
      { buchstabe: 'A', name: 'Archiv', regel: 'Alles was in keine der oberen Kategorien passt → NICHT LESEN. Löschen/Abbestellen.', beispiel: '80% aller Newsletter. Die meisten "FYI" E-Mails. Clickbait-Artikel.' },
    ],
  },

  newsletter_audit: {
    titel: 'Der Newsletter-Audit',
    anleitung: 'Öffne dein E-Mail-Postfach. Liste alle Newsletter auf. Für jeden: Habe ich die letzten 3 Ausgaben gelesen? Wenn NEIN → Abbestellen.',
    ziel: 'Von durchschnittlich 25 Newslettern auf 3-5 reduzieren.',
  },

  lese_budget: {
    titel: 'Dein tägliches Lese-Budget',
    erklaerung: 'Du hast 60 Minuten pro Tag zum Lesen.',
    empfehlung: [
      { zeit: '30 Min', was: 'Projekte (P) — direkte Wertschöpfung', prio: 'A' },
      { zeit: '15 Min', was: 'Areas (A) — Branchen-Updates', prio: 'B' },
      { zeit: '10 Min', was: 'Ressourcen (R) — Weiterbildung', prio: 'C' },
      { zeit: '5 Min', was: 'Puffer für Unerwartetes', prio: 'D' },
      { zeit: '0 Min', was: 'Archiv (A) — NICHT LESEN', prio: 'X' },
    ],
  },
};

// ---------------------------------------------------------------------------
// 7. NOTIZEN-SYSTEM
// ---------------------------------------------------------------------------
export const NOTIZEN_NACH_LESEN = {
  titel: 'Schnell lesen + sichern = echtes Wissen',
  warnung: '600 WPM ohne Notizen = 600 Wörter pro Minute die du in 24 Stunden vergisst.',

  methoden: [
    { name: 'Die 3-Satz-Methode', erklaerung: 'Nach JEDEM Text: Schreibe die 3 wichtigsten Punkte in eigenen Worten auf. Max 1 Minute.', beispiel: 'Text: 40-Seiten Quartalsbericht → Notiz: "1. Umsatz +12% 2. Kosten stabil 3. Expansion US geplant Q3"', fuer: 'E-Mails, Reports, kurze Artikel' },
    { name: 'Die Cornell-Methode', erklaerung: 'Blatt in 3 Zonen: Links = Stichworte, Rechts = Notizen, Unten = Zusammenfassung in 1-2 Sätzen.', fuer: 'Fachbücher, Vorträge, Webinare' },
    { name: 'Die Highlight-Export Methode', erklaerung: 'Markiere nur die 5-10% des Textes die WIRKLICH neu für dich sind. Exportiere nur die Highlights.', fuer: 'PDF, E-Books, digitale Artikel' },
    { name: 'Die Teach-Back Methode', erklaerung: 'Erzähle jemandem in 60 Sekunden was du gelesen hast. Wenn du es nicht erklären kannst, hast du es nicht verstanden.', fuer: 'Alle Texte die du WIRKLICH behalten willst' },
  ],
};

// ---------------------------------------------------------------------------
// 8. FORTSCHRITTS-TRACKING & MEILENSTEINE
// ---------------------------------------------------------------------------
export const FORTSCHRITT = {
  titel: 'Dein WPM über Zeit',
  erklaerung: 'Mach den WPM-Test jede Woche. Die App zeichnet deine Kurve auf.',

  meilensteine: [
    { wpm: 250, label: 'Durchschnitt', belohnung: 'Du liest wie 80% der Menschen.', badge: 'Starter' },
    { wpm: 350, label: '+40% Steigerung', belohnung: 'Du sparst bereits 1 Stunde pro Woche.', badge: 'Aufsteiger' },
    { wpm: 500, label: 'Doppelter Durchschnitt', belohnung: 'Du liest doppelt so schnell wie zu Beginn.', badge: 'Speed-Reader' },
    { wpm: 700, label: 'Top 5%', belohnung: 'Du gehörst zu den schnellsten 5% aller Leser.', badge: 'Elite-Leser' },
  ],

  share_card: {
    template: 'Ich habe meine Lesegeschwindigkeit in {tage} Tagen von {start_wpm} auf {aktuell_wpm} WPM gesteigert — bei {verstaendnis}% Textverständnis.',
    hashtags: '#KarriereInstitut #Speedreading',
  },
};

// ---------------------------------------------------------------------------
// 9. GHOST-MODE
// ---------------------------------------------------------------------------
export const GHOST_MODE = {
  titel: 'Ghost-Mode: Lies gegen dein vergangenes Ich',
  erklaerung: 'Beim WPM-Re-Test siehst du einen Schatten-Cursor der sich in deiner ALTEN Geschwindigkeit über den Text bewegt. Dein Ziel: Ihn überholen.',
  motivation: 'Nichts motiviert mehr als zu sehen, wie du dein früheres Ich übertriffst.',
};

// ---------------------------------------------------------------------------
// 10. ATEM-ÜBUNG VOR LESETEST
// ---------------------------------------------------------------------------
export const PRE_READ_FOKUS = {
  titel: '30-Sekunden Fokus-Aktivierung vor dem Lesen',
  anleitung: 'Bevor du liest: 4 Sekunden einatmen → 4 Sekunden halten → 6 Sekunden ausatmen → 3x wiederholen.',
  warum: 'Aktiviert den Parasympathikus, senkt Herzfrequenz, verbessert Aufmerksamkeit.',
  zyklen: 3,
  einatmen: 4,
  halten: 4,
  ausatmen: 6,
};

// ---------------------------------------------------------------------------
// 11. WPM-TEST TEXTE
// ---------------------------------------------------------------------------
export const WPM_TEXTE = [
  {
    id: 'allgemein_1',
    titel: 'Die Zukunft der Arbeit',
    woerter: 250,
    text: `Die Arbeitswelt verändert sich rasanter als je zuvor. Künstliche Intelligenz, Remote Work und die Gig-Economy definieren neu, was Arbeit bedeutet. Unternehmen, die sich nicht anpassen, werden in den nächsten zehn Jahren verschwinden. Das ist keine Übertreibung — es ist eine Prognose, die von führenden Wirtschaftsforschern geteilt wird.

Was bedeutet das für den Einzelnen? Zunächst einmal: Lebenslanges Lernen ist keine Option mehr, sondern eine Notwendigkeit. Die Halbwertszeit von Fachwissen sinkt kontinuierlich. Was du heute lernst, kann in fünf Jahren veraltet sein. Gleichzeitig entstehen neue Berufe, die es vor zehn Jahren noch nicht gab.

Die gute Nachricht: Wer bereit ist, sich anzupassen, hat mehr Möglichkeiten als jede Generation zuvor. Digitale Tools ermöglichen es, von überall auf der Welt zu arbeiten. Wissen ist frei zugänglich. Netzwerke lassen sich global aufbauen.

Die Herausforderung liegt nicht im Zugang zu Information — sondern in der Fähigkeit, die relevante Information schnell zu finden, zu verarbeiten und anzuwenden. Genau hier setzt Speedreading an. Wer schneller liest und besser filtert, hat einen enormen Wettbewerbsvorteil.

Studien zeigen: Führungskräfte verbringen durchschnittlich 2-3 Stunden pro Tag mit Lesen. Wer seine Lesegeschwindigkeit verdoppelt, gewinnt eine Stunde pro Tag zurück. Das sind über 250 Stunden pro Jahr — mehr als sechs Arbeitswochen.`,
    fragen: [
      { frage: 'Was ist laut Text keine Option mehr?', optionen: ['Remote Work', 'Lebenslanges Lernen', 'Künstliche Intelligenz', 'Netzwerken'], correct: 1 },
      { frage: 'Wie viel Zeit verbringen Führungskräfte mit Lesen?', optionen: ['1 Stunde', '2-3 Stunden', '4-5 Stunden', '30 Minuten'], correct: 1 },
      { frage: 'Was ist die Hauptherausforderung laut Text?', optionen: ['Zugang zu Information', 'Relevante Info schnell finden und verarbeiten', 'Neue Berufe lernen', 'Remote arbeiten'], correct: 1 },
    ],
  },
  {
    id: 'allgemein_2',
    titel: 'Entscheidungen unter Druck',
    woerter: 220,
    text: `Jeden Tag treffen wir etwa 35.000 Entscheidungen. Die meisten davon unbewusst — was wir anziehen, welchen Weg wir nehmen, was wir essen. Doch die Qualität unserer bewussten Entscheidungen bestimmt maßgeblich unseren beruflichen und privaten Erfolg.

Das Problem: Unter Zeitdruck verschlechtert sich die Entscheidungsqualität drastisch. Der präfrontale Kortex — zuständig für rationales Denken — wird bei Stress unterdrückt. Stattdessen übernimmt das limbische System: Kampf oder Flucht.

Erfolgreiche Entscheidungsträger nutzen daher Systeme statt Willenskraft. Sie haben Checklisten für wiederkehrende Entscheidungen, delegieren Routineentscheidungen und reservieren ihre kognitive Energie für die wirklich wichtigen Fragen.

Eine der effektivsten Techniken ist die 10-10-10 Methode: Wie werde ich über diese Entscheidung in 10 Minuten denken? In 10 Monaten? In 10 Jahren? Diese einfache Frage schafft sofort Distanz und Perspektive.

Interessanterweise zeigen Studien, dass schnelle Entscheidungen nicht schlechter sind als langwierig abgewogene — vorausgesetzt, man verfügt über ausreichend Erfahrung im jeweiligen Bereich. Experten treffen intuitive Entscheidungen, die rationalen Analysen ebenbürtig sind.`,
    fragen: [
      { frage: 'Wie viele Entscheidungen treffen wir täglich?', optionen: ['10.000', '20.000', '35.000', '50.000'], correct: 2 },
      { frage: 'Was ist die 10-10-10 Methode?', optionen: ['10 Minuten, 10 Monate, 10 Jahre Perspektive', '10 Optionen bewerten', '10 Sekunden Regel', '10 Schritte Prozess'], correct: 0 },
      { frage: 'Was passiert bei Stress mit dem präfrontalen Kortex?', optionen: ['Er wird aktiviert', 'Er wird unterdrückt', 'Er arbeitet schneller', 'Er hat keinen Einfluss'], correct: 1 },
    ],
  },
];

// ---------------------------------------------------------------------------
// 12. SEHSPANNEN-TRAINER CONFIG
// ---------------------------------------------------------------------------
export const SEHSPANNEN_CONFIG = {
  titel: 'Sehspannen-Trainer',
  beschreibung: 'Erweitere dein peripheres Sehen schrittweise. Fixiere den Mittelpunkt und erfasse die Wörter am Rand.',
  level: [
    { name: 'Level 1: 2 Wörter', breite: 2, zeit_ms: 2000, beschreibung: '2 Wörter gleichzeitig erfassen' },
    { name: 'Level 2: 3 Wörter', breite: 3, zeit_ms: 1500, beschreibung: '3 Wörter gleichzeitig erfassen' },
    { name: 'Level 3: 4 Wörter', breite: 4, zeit_ms: 1200, beschreibung: '4 Wörter gleichzeitig erfassen' },
    { name: 'Level 4: 5 Wörter', breite: 5, zeit_ms: 1000, beschreibung: '5 Wörter = eine halbe Zeile auf einmal' },
  ],
  wortgruppen: [
    ['der schnelle', 'braune Fuchs', 'springt über', 'den faulen', 'alten Hund'],
    ['effektives Lesen', 'spart Zeit', 'und verbessert', 'das Verständnis', 'von Texten'],
    ['Speedreading ist', 'eine Fähigkeit', 'die jeder', 'Mensch lernen', 'kann mit'],
    ['die Augen', 'erfassen mehr', 'als du', 'bewusst wahrnimmst', 'beim Lesen'],
    ['mit Übung', 'wird dein', 'peripheres Sehen', 'immer besser', 'und schneller'],
  ],
};

// ---------------------------------------------------------------------------
// 13. CHUNK-READING TRAINER CONFIG
// ---------------------------------------------------------------------------
export const CHUNK_READING_CONFIG = {
  titel: 'Chunk-Reading Trainer',
  beschreibung: 'Lies in Wortgruppen statt Wort für Wort. Die Geschwindigkeit steigert sich automatisch.',
  stufen: [
    { name: 'Langsam', wpm: 250, chunk_size: 2 },
    { name: 'Mittel', wpm: 350, chunk_size: 3 },
    { name: 'Schnell', wpm: 450, chunk_size: 3 },
    { name: 'Turbo', wpm: 600, chunk_size: 4 },
  ],
  text: 'Die Fähigkeit schnell zu lesen ist eine der wertvollsten Kompetenzen in der modernen Arbeitswelt. Wer Informationen effizient verarbeiten kann hat einen enormen Vorteil gegenüber Kollegen die noch Wort für Wort lesen. Chunk-Reading bedeutet dass du mehrere Wörter auf einmal erfasst statt jedes einzelne Wort zu fixieren. Dein Gehirn verarbeitet Wortgruppen sogar besser als Einzelwörter weil es den Kontext nutzen kann um Bedeutung schneller zu erschließen. Mit regelmäßigem Training wirst du innerhalb weniger Wochen deutlich schneller lesen ohne an Verständnis zu verlieren.',
};

// ---------------------------------------------------------------------------
// 14. MODUL-QUIZZES
// ---------------------------------------------------------------------------
export const MODUL_QUIZ_SPEED = {
  modul_1: [
    { question: 'Was ist Subvokalisierung?', options: ['Laut vorlesen', 'Innerliches Mitsprechen beim Lesen', 'Schnelles Überfliegen', 'Rückwärts lesen'], correct: 1 },
    { question: 'Welche der 4 Lese-Bremsen kostet die meiste Zeit?', options: ['Fixierung', 'Ablenkung', 'Regression (Zurückspringen)', 'Schlechtes Licht'], correct: 2 },
    { question: 'Was ist der durchschnittliche WPM-Wert?', options: ['100-150', '200-250', '400-500', '600-700'], correct: 1 },
  ],
  modul_3: [
    { question: 'Was ist die 20-20-20 Regel?', options: ['20 Seiten, 20 Minuten, 20 Pausen', '20 Min lesen, 20 Sek auf 6m schauen, alle 20 Min', '20 Wörter pro Zeile maximal', '20 Bücher pro Jahr lesen'], correct: 1 },
    { question: 'Wie oft sollte man beim Lesen am Bildschirm blinzeln?', options: ['3-4x pro Minute', '15-20x pro Minute', '1x pro Minute', 'Gar nicht'], correct: 1 },
    { question: 'Was ist der optimale Abstand zum Bildschirm?', options: ['20-30 cm', '50-70 cm', '100 cm', 'Egal'], correct: 1 },
  ],
  modul_4: [
    { question: 'Wie hilft ein Pacer beim Lesen?', options: ['Er macht das Lesen lauter', 'Er führt die Augen und verhindert Regression', 'Er markiert wichtige Stellen', 'Er zählt die Wörter'], correct: 1 },
    { question: 'Was passiert bei Regression?', options: ['Man liest schneller', 'Die Augen springen zu bereits gelesenen Stellen zurück', 'Man versteht mehr', 'Die Augen werden müde'], correct: 1 },
  ],
  modul_5: [
    { question: 'Was ist peripheres Sehen?', options: ['Nur die Mitte des Textes lesen', 'Wörter am Rand des Blickfeldes erfassen', 'Mit geschlossenen Augen lesen', 'Nur Überschriften lesen'], correct: 1 },
    { question: 'Wie viele Wörter kann ein trainiertes Auge gleichzeitig erfassen?', options: ['1 Wort', '2 Wörter', '4-5 Wörter', '10 Wörter'], correct: 2 },
  ],
  modul_6: [
    { question: 'Was ist Chunk-Reading?', options: ['Sehr langsam lesen', 'Wortgruppen statt Einzelwörter erfassen', 'Nur Anfangsbuchstaben lesen', 'Absätze überspringen'], correct: 1 },
    { question: 'Warum versteht das Gehirn Chunks besser als Einzelwörter?', options: ['Chunks sind kürzer', 'Das Gehirn nutzt den Kontext der Wortgruppe', 'Chunks haben weniger Buchstaben', 'Es macht keinen Unterschied'], correct: 1 },
  ],
  modul_7: [
    { question: 'Was ist der Unterschied zwischen Skimming und Scanning?', options: ['Kein Unterschied', 'Skimming = Überblick, Scanning = gezieltes Suchen', 'Scanning ist schneller', 'Skimming ist für Bücher, Scanning für E-Mails'], correct: 1 },
    { question: 'Wofür steht OPIR?', options: ['Optimal Praxis In Reading', 'Overview, Preview, Intensive, Review', 'Ohne Pause Immer Reden', 'Orientierung, Planung, Input, Reflexion'], correct: 1 },
  ],
  modul_8: [
    { question: 'Wann sollte man NICHT speedreaden?', options: ['Bei E-Mails', 'Bei Newslettern', 'Bei Verträgen und Gesetzen', 'Bei Zeitungsartikeln'], correct: 2 },
    { question: 'Wie viele Lese-Modi gibt es in der Differenzierungs-Matrix?', options: ['2', '3', '4', '6'], correct: 2 },
  ],
  modul_9: [
    { question: 'Wofür steht PARA in der Lese-Diät?', options: ['Projekte, Areas, Ressourcen, Archiv', 'Planen, Analysieren, Reagieren, Abschließen', 'Priorisieren, Aufräumen, Reflektieren, Anwenden', 'Pause, Atem, Ruhe, Achtsamkeit'], correct: 0 },
    { question: 'Was ist die wichtigste Speedreading-Skill laut dem Kurs?', options: ['Schneller Augen bewegen', 'Subvokalisierung abstellen', 'Entscheiden WAS man liest und was nicht', 'Einen Pacer benutzen'], correct: 2 },
  ],
  modul_10: [
    { question: 'Was ist die Teach-Back Methode?', options: ['Einem Lehrer vorlesen', 'Jemandem in 60 Sek erklären was man gelesen hat', 'Den Text abschreiben', 'Eine Präsentation erstellen'], correct: 1 },
    { question: 'Was ist SQ3R?', options: ['Survey, Question, Read, Recite, Review', 'Speed, Quick, 3x Repeat', 'Scan, Quote, Read, Recall, Repeat', 'Simple, Quick, 3 Rules'], correct: 0 },
  ],
  modul_11: [
    { question: 'Was ist die größte Herausforderung beim digitalen Lesen?', options: ['Schlechte Auflösung', 'Ablenkung durch Links, Tabs, Notifications', 'Zu kleine Schrift', 'Fehlende Haptik'], correct: 1 },
    { question: 'Welche Methode eignet sich für Reports?', options: ['Wort für Wort lesen', 'OPIR-Methode', 'Nur das Fazit lesen', 'Laut vorlesen'], correct: 1 },
  ],
};

// ---------------------------------------------------------------------------
// 15. JOURNAL-FRAGEN
// ---------------------------------------------------------------------------
export const JOURNAL_FRAGEN_SPEED = {
  0: 'Was war dein Aha-Moment in der Selbstdiagnose? Welche Lese-Gewohnheit möchtest du als Erstes ändern?',
  3: 'Wie fühlen sich deine Augen nach einem langen Lesetag? Was wirst du ab heute anders machen?',
  4: 'Welche der 4 Lese-Bremsen ist deine größte? Wie merkst du das im Alltag?',
  6: 'Wie fühlt sich Chunk-Reading an? Merkst du bereits einen Unterschied?',
  9: 'Welche 3 Quellen wirst du sofort abbestellen oder nicht mehr lesen?',
  10: 'Welche Notizen-Methode passt am besten zu dir? Warum?',
  14: 'Was hat sich seit Kursstart verändert? Was ist dein nächstes Ziel?',
};

// ---------------------------------------------------------------------------
// 16. MIKRO-LEARNINGS (90 Tage)
// ---------------------------------------------------------------------------
export const MICRO_LEARNINGS = [
  { tag: 1, impuls: 'Beobachte heute: Sprichst du beim Lesen innerlich mit?', typ: 'beobachtung' },
  { tag: 2, impuls: 'Nutze bei den nächsten 3 E-Mails einen Stift als Pacer.', typ: 'technik' },
  { tag: 3, impuls: 'Lies eine Nachricht und fasse sie in 1 Satz zusammen. Sofort.', typ: 'verstaendnis' },
  { tag: 5, impuls: 'Freitags-WPM: Mach den Lesetest. Notiere dein Ergebnis.', typ: 'messung' },
  { tag: 7, impuls: 'Bestelle heute 3 Newsletter ab die du nie liest.', typ: 'relevanz' },
  { tag: 10, impuls: 'Lies einen Fachartikel mit der OPIR-Methode in 5 Minuten.', typ: 'strategie' },
  { tag: 14, impuls: '20-20-20 Regel: Hast du sie heute 3x gemacht?', typ: 'gesundheit' },
  { tag: 21, impuls: 'Chunk-Reading Challenge: Lies eine Seite NUR in Wortgruppen.', typ: 'technik' },
  { tag: 30, impuls: 'Monats-WPM-Test. Vergleiche mit Tag 1. Teile dein Ergebnis!', typ: 'meilenstein' },
  { tag: 60, impuls: 'Wie viele Stunden sparst du pro Woche durch Speedreading? Rechne nach.', typ: 'reflexion' },
  { tag: 90, impuls: 'Finaler WPM-Test. Erstelle deine Shareable Progress Card. Du bist ein Speed-Reader!', typ: 'abschluss' },
];

// ---------------------------------------------------------------------------
// 17. RÜCKFALL-PRÄVENTION
// ---------------------------------------------------------------------------
export const RUECKFALL = {
  warnsignale: [
    'Du liest wieder Wort-für-Wort (keine Chunks mehr)',
    'Du nutzt keinen Pacer mehr',
    'Du liest alle E-Mails von oben bis unten statt zu scannen',
    'Deine Augen sind abends müde (20-20-20 vergessen)',
    'Du hast 10+ ungelesene Newsletter angesammelt',
  ],
  reset: {
    schritt_1: '5 Minuten Pacer-Übung mit einem beliebigen Text. Sofort.',
    schritt_2: 'WPM-Test machen. Vergleiche mit deinem Beststand.',
    schritt_3: 'Newsletter-Audit: Abbestelle alles was du nicht in 7 Tagen gelesen hast.',
    schritt_4: 'Morgen: Erste 30 Min des Tages NUR mit Speedreading-Techniken lesen.',
  },
};

// ---------------------------------------------------------------------------
// 18. VORHER/NACHHER MESSUNG
// ---------------------------------------------------------------------------
export const VORHER_NACHHER = {
  metriken: [
    'Worte pro Minute (WPM)',
    'Textverständnis nach Speedreading (%-Score)',
    'Tägliche Lesezeit (Stunden)',
    'Anzahl Newsletter/Quellen (Relevanz-Filter)',
    'Augenermüdung am Abend (1-10)',
    'Selbsteinschätzung Lesekompetenz (1-10)',
  ],
  zeitpunkte: ['Kursstart', 'Nach Abschluss', 'Nach 30 Tagen', 'Nach 90 Tagen'],
};

// ---------------------------------------------------------------------------
// 19. EVIDENZ / WISSENSCHAFTLICHE QUELLEN
// ---------------------------------------------------------------------------
export const EVIDENZ = {
  quellen: [
    { autor: 'Rayner et al.', jahr: 2016, titel: 'So Much to Read, So Little Time', erkenntnis: 'Durchschnittliche Lesegeschwindigkeit liegt bei 200-250 WPM. Subvokalisierung ist die Hauptbremse.' },
    { autor: 'Carver, R.P.', jahr: 1990, titel: 'Reading Rate: A Review of Research and Theory', erkenntnis: 'Lesegeschwindigkeit und Verständnis korrelieren — bis zu einem Punkt. Ab ~600 WPM sinkt das Verständnis bei komplexen Texten.' },
    { autor: 'Kliegl et al.', jahr: 2004, titel: 'Length, Frequency, and Predictability Effects of Words on Eye Movements', erkenntnis: 'Das Auge fixiert nicht jedes Wort — hochfrequente und vorhersagbare Wörter werden übersprungen.' },
    { autor: 'Clinton, V.', jahr: 2019, titel: 'Reading from Paper Compared to Screens', erkenntnis: 'Digitales Lesen ist 20-30% langsamer als auf Papier. Scrolling und Ablenkung sind die Hauptgründe.' },
  ],
};
