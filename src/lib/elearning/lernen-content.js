// ============================================================================
// Typgerechtes Lernen E-Learning — Complete Content Data
// 16 Module, 4 Boss-Fights, 14 Widgets, 3 adaptive Pfade, ~280 Min
// Kurs-ID: c1000000-0000-0000-0000-000000000005 | Farbe: #8B5CF6
// ============================================================================

// ---------------------------------------------------------------------------
// 0. ZIELGRUPPEN-CONFIG — Adaptive Pfade
// ---------------------------------------------------------------------------
export const ZIELGRUPPEN_CONFIG = {
  studierende: {
    label: '🎓 Studierende',
    fokus: 'Grundlagen aufbauen, Prüfungen bestehen, erstes Fachwissen effizient speichern',
    freigeschaltet: ['alle_basis_module', 'mentor_mirror', 'pruefungs_panik_boss'],
    ausgeblendet: ['executive_abstractor', 'unlearn_assistant', 'team_lernen'],
  },
  berufseinsteiger: {
    label: '🚀 Berufseinsteiger',
    fokus: 'Effizient lernen, Onboarding meistern, Skills aufbauen',
    freigeschaltet: ['alle_basis_module', 'onboarding_90_tage'],
    ausgeblendet: ['executive_abstractor', 'team_lernen'],
  },
  berufserfahren: {
    label: '💼 Berufserfahren',
    fokus: 'Effizienz steigern, Altes verlernen, neue Skills in Rekordzeit',
    freigeschaltet: ['alle_basis_module', 'unlearn_assistant', 'energie_budgetierung'],
    ausgeblendet: ['mentor_mirror', 'pruefungs_panik_boss'],
  },
  fuehrungskraft: {
    label: '👑 Führungskraft',
    fokus: 'Team-Lernkultur, Executive Learning, Synthese, Entscheidungsqualität',
    freigeschaltet: ['alle_module', 'executive_abstractor', 'team_lernen', 'synthese_training'],
    ausgeblendet: ['pruefungs_panik_boss', 'mentor_mirror'],
  },
};

// ---------------------------------------------------------------------------
// 1. SELBSTDIAGNOSE — 10 Fragen, 3 Ergebnis-Stufen
// ---------------------------------------------------------------------------
export const SELBSTDIAGNOSE_LERNEN = {
  titel: 'Selbstdiagnose: Wie effektiv lernst du?',
  beschreibung: 'Beantworte die folgenden 10 Fragen ehrlich. Es gibt keine richtigen oder falschen Antworten.',
  skala: { min: 1, max: 5, labels: ['Trifft gar nicht zu', 'Trifft selten zu', 'Teils-teils', 'Trifft oft zu', 'Trifft voll zu'] },
  fragen: [
    { id: 1, text: 'Ich weiß genau, wie ich am besten lerne (visuell, auditiv, praktisch).', kategorie: 'selbstkenntnis' },
    { id: 2, text: 'Ich kann mir Gelerntes auch nach Wochen noch gut merken.', kategorie: 'retention' },
    { id: 3, text: 'Ich lerne regelmäßig neue Fähigkeiten für meinen Beruf.', kategorie: 'gewohnheit' },
    { id: 4, text: 'Ich habe ein System zum Wiederholen von Gelerntem (Karteikarten, Notizen etc.).', kategorie: 'system' },
    { id: 5, text: 'Ich kann mich beim Lernen gut konzentrieren und lasse mich selten ablenken.', kategorie: 'fokus' },
    { id: 6, text: 'Ich wende Gelerntes innerhalb von 24 Stunden praktisch an.', kategorie: 'transfer' },
    { id: 7, text: 'Ich langweile mich schnell bei Lernstoff der mich nicht sofort begeistert.', kategorie: 'motivation', invers: true },
    { id: 8, text: 'Ich vergesse nach einer Weiterbildung meist schnell was ich gelernt habe.', kategorie: 'retention', invers: true },
    { id: 9, text: 'Ich habe Angst vor Prüfungen oder Bewertungssituationen.', kategorie: 'emotion', invers: true },
    { id: 10, text: 'Ich kann anderen erklären was ich gelernt habe.', kategorie: 'tiefe' },
  ],
  ergebnisse: [
    {
      id: 'ungelernt',
      range: [10, 22],
      titel: 'Unbewusster Lerner',
      beschreibung: 'Du lernst zwar, aber ohne Strategie. Das bedeutet: Du investierst viel Zeit mit wenig Ergebnis. Keine Sorge — genau dafür ist dieser Kurs da.',
      empfehlung: 'Starte bei Modul 1 und arbeite alles durch. Modul 4 (Vergessenskurve) und Modul 5 (Techniken) werden dir sofort helfen.',
    },
    {
      id: 'bewusst',
      range: [23, 37],
      titel: 'Bewusster Lerner',
      beschreibung: 'Du hast bereits gute Ansätze, aber es fehlt noch das System. Besonders bei Wiederholung und Transfer gibt es Optimierungspotenzial.',
      empfehlung: 'Fokussiere dich auf Module 6 (Spaced Repetition), 7 (Flow) und 11 (Transfer).',
    },
    {
      id: 'architekt',
      range: [38, 50],
      titel: 'Lern-Architekt',
      beschreibung: 'Du lernst bereits sehr effektiv. Dieser Kurs hilft dir, das letzte Level zu erreichen und dein Wissen an andere weiterzugeben.',
      empfehlung: 'Springe zu Modul 10 (Fehler-Kultur), 12 (Lebenslanges Lernen) und den Zielgruppen-Extras.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 2. LERNTYP-TEST (VARK)
// ---------------------------------------------------------------------------
export const LERNTYP_TEST = {
  titel: 'Welcher Lerntyp bist du? (VARK)',
  beschreibung: 'Beantworte 12 Fragen. Dein dominanter Lerntyp wird ermittelt.',
  typen: [
    { id: 'visuell', label: 'Visuell', emoji: '👁️', color: '#3b82f6', beschreibung: 'Du lernst am besten durch Bilder, Grafiken, Mind-Maps und Farben.', strategien: ['Mind-Maps erstellen', 'Farbige Markierungen nutzen', 'Sketchnotes', 'Videos statt Texte', 'Infografiken'] },
    { id: 'auditiv', label: 'Auditiv', emoji: '👂', color: '#10b981', beschreibung: 'Du lernst am besten durch Hören, Diskutieren und Erklären.', strategien: ['Podcasts & Hörbücher', 'Laut vorlesen', 'Lerngruppen', 'Diktier-Apps', 'Teach-Back Methode'] },
    { id: 'lesend', label: 'Lesen/Schreiben', emoji: '📝', color: '#f59e0b', beschreibung: 'Du lernst am besten durch Lesen und eigene Zusammenfassungen.', strategien: ['Eigene Zusammenfassungen', 'Cornell-Notizen', 'Karteikarten', 'Listen erstellen', 'Blogs/Artikel lesen'] },
    { id: 'kinaesthetisch', label: 'Kinästhetisch', emoji: '🖐️', color: '#ef4444', beschreibung: 'Du lernst am besten durch Tun, Ausprobieren und Bewegung.', strategien: ['Learning by Doing', 'Rollenspiele', 'Prototypen bauen', 'Beim Gehen lernen', 'Übungsaufgaben'] },
  ],
  fragen: [
    { text: 'Wenn ich mir etwas Neues merken will...', optionen: [{ text: 'zeichne ich ein Schema oder eine Grafik', typ: 'visuell' }, { text: 'erkläre ich es mir laut selbst', typ: 'auditiv' }, { text: 'schreibe ich es in eigenen Worten auf', typ: 'lesend' }, { text: 'probiere ich es direkt aus', typ: 'kinaesthetisch' }] },
    { text: 'In einem Meeting verstehe ich am besten...', optionen: [{ text: 'wenn es Slides mit Grafiken gibt', typ: 'visuell' }, { text: 'wenn jemand es gut erklärt', typ: 'auditiv' }, { text: 'wenn ich Notizen machen kann', typ: 'lesend' }, { text: 'wenn wir ein Beispiel durchspielen', typ: 'kinaesthetisch' }] },
    { text: 'Wenn ich eine neue Software lernen will...', optionen: [{ text: 'schaue ich mir Video-Tutorials an', typ: 'visuell' }, { text: 'lasse ich mir es von jemandem zeigen und erklären', typ: 'auditiv' }, { text: 'lese ich die Dokumentation', typ: 'lesend' }, { text: 'klicke ich mich einfach durch', typ: 'kinaesthetisch' }] },
    { text: 'Beim Kochen eines neuen Rezepts...', optionen: [{ text: 'schaue ich ein Kochvideo', typ: 'visuell' }, { text: 'lasse ich mir die Schritte erzählen', typ: 'auditiv' }, { text: 'lese ich das Rezept Schritt für Schritt', typ: 'lesend' }, { text: 'fange ich einfach an und improvisiere', typ: 'kinaesthetisch' }] },
    { text: 'Im Urlaub orientiere ich mich am besten mit...', optionen: [{ text: 'einer Karte oder Google Maps visuell', typ: 'visuell' }, { text: 'mündlichen Wegbeschreibungen', typ: 'auditiv' }, { text: 'einer geschriebenen Anleitung', typ: 'lesend' }, { text: 'einfach losgehen und erkunden', typ: 'kinaesthetisch' }] },
    { text: 'Wenn ich ein Buch zusammenfassen soll...', optionen: [{ text: 'erstelle ich eine visuelle Mind-Map', typ: 'visuell' }, { text: 'erzähle ich die Kernpunkte jemandem', typ: 'auditiv' }, { text: 'schreibe ich eine strukturierte Zusammenfassung', typ: 'lesend' }, { text: 'wende ich die Konzepte sofort an', typ: 'kinaesthetisch' }] },
    { text: 'Mein idealer Lernort ist...', optionen: [{ text: 'aufgeräumt mit Whiteboards und Post-Its', typ: 'visuell' }, { text: 'ruhig genug zum Selbstgespräch', typ: 'auditiv' }, { text: 'ein Schreibtisch mit Notizbuch', typ: 'lesend' }, { text: 'ein Ort wo ich mich bewegen kann', typ: 'kinaesthetisch' }] },
    { text: 'In der Schule/Uni konnte ich mir am besten merken...', optionen: [{ text: 'was auf der Tafel/Folie stand', typ: 'visuell' }, { text: 'was der Lehrer gesagt hat', typ: 'auditiv' }, { text: 'was ich mitgeschrieben habe', typ: 'lesend' }, { text: 'was wir praktisch geübt haben', typ: 'kinaesthetisch' }] },
    { text: 'Wenn ich jemanden von etwas überzeugen will...', optionen: [{ text: 'zeige ich Diagramme und Bilder', typ: 'visuell' }, { text: 'erkläre ich es mündlich mit Beispielen', typ: 'auditiv' }, { text: 'schreibe ich eine ausführliche Mail', typ: 'lesend' }, { text: 'mache ich eine Demo oder ein Beispiel', typ: 'kinaesthetisch' }] },
    { text: 'Beim Möbelaufbau...', optionen: [{ text: 'schaue ich mir die Bilder in der Anleitung an', typ: 'visuell' }, { text: 'lasse ich mir helfen und dabei erzählen', typ: 'auditiv' }, { text: 'lese ich die Anleitung Schritt für Schritt', typ: 'lesend' }, { text: 'probiere ich es ohne Anleitung', typ: 'kinaesthetisch' }] },
    { text: 'In einer Fremdsprache lerne ich am besten...', optionen: [{ text: 'mit Bildern und Flashcards', typ: 'visuell' }, { text: 'durch Zuhören und Nachsprechen', typ: 'auditiv' }, { text: 'durch Vokabellisten und Grammatik-Regeln', typ: 'lesend' }, { text: 'durch Gespräche und Reisen', typ: 'kinaesthetisch' }] },
    { text: 'Feedback nehme ich am besten auf...', optionen: [{ text: 'als Grafik oder Chart (Stärken/Schwächen)', typ: 'visuell' }, { text: 'in einem persönlichen Gespräch', typ: 'auditiv' }, { text: 'als schriftliche Bewertung', typ: 'lesend' }, { text: 'als konkretes Beispiel das ich nachmachen kann', typ: 'kinaesthetisch' }] },
  ],
};

// ---------------------------------------------------------------------------
// 3. STORIES
// ---------------------------------------------------------------------------
export const STORIES_LERNEN = {
  modul_1: {
    titel: 'Der Schüler der nie lernte — bis er verstand WIE',
    protagonist: { name: 'Marco', alter: 29, rolle: 'Junior Developer' },
    inhalt: `Marco, 29, Junior Developer. Seit 3 Monaten im Job. Jeden Abend sitzt er 3 Stunden vor Online-Kursen. Python, React, AWS. Er schaut Videos, macht sich Notizen, markiert Texte gelb.

Am nächsten Tag im Standup: "Marco, kannst du kurz erklären wie das API-Gateway funktioniert?"

Stille. Er hat gestern 45 Minuten darüber gelesen. Markiert. Zusammengefasst. Und jetzt? Nichts.

Sein Senior-Kollege Sarah sagt: "Marco, du lernst falsch. Du KONSUMIERST Wissen. Du musst es VERARBEITEN."

Sarah zeigt ihm: Feynman-Methode, Spaced Repetition, Active Recall. Marco ändert alles. 3 Monate später erklärt ER im Standup. Nicht weil er mehr gelernt hat — sondern weil er ANDERS gelernt hat.`,
    kernbotschaft: 'Es geht nicht darum WIE VIEL du lernst. Es geht darum WIE du lernst.',
  },
  modul_10: {
    titel: 'Der Schachgroßmeister der 10.000 Partien verlor',
    protagonist: { name: 'Josh', alter: 35, rolle: 'Schachgroßmeister und Martial Arts Champion' },
    inhalt: `Josh Waitzkin, Schachprodigy mit 8, Großmeister mit 16. Er verlor tausende Partien.

Sein Geheimnis? Er analysierte JEDE Niederlage. Nicht die Siege. Die Niederlagen.

"Ich habe mehr aus einer verlorenen Partie gelernt als aus 100 gewonnenen."

Als er mit 22 Schach aufgab und Tai Chi lernte, wurde er Weltmeister. Nicht trotz der Fehler — WEGEN der Fehler.

Dein größter Fehler ist nicht zu scheitern. Dein größter Fehler ist, aus dem Scheitern nichts zu lernen.`,
    kernbotschaft: 'Fehler sind keine Rückschläge. Sie sind die effektivste Lernmethode die existiert.',
  },
  modul_12: {
    titel: 'Warum die besten CEOs nie aufhören zu lernen',
    protagonist: { name: 'Satya', alter: 56, rolle: 'CEO Microsoft' },
    inhalt: `Als Satya Nadella 2014 CEO von Microsoft wurde, war das Unternehmen in der Krise. Seine erste Maßnahme? Er schenkte jedem Mitarbeiter ein Buch: "Mindset" von Carol Dweck.

Seine Botschaft: "Wir müssen von 'Know-it-alls' zu 'Learn-it-alls' werden."

Microsoft ging von einer Bewertung von 300 Mrd. auf über 3 Billionen Dollar.

Die wichtigste Fähigkeit im 21. Jahrhundert ist nicht was du weißt — sondern wie schnell du Neues lernst.`,
    kernbotschaft: 'Die Lernfähigkeit ist der ultimative Karriere-Skill.',
  },
};

// ---------------------------------------------------------------------------
// 4. BOSS-FIGHTS — 4 Kämpfe
// ---------------------------------------------------------------------------
export const BOSS_FIGHTS_LERNEN = {
  langeweile_drache: {
    name: 'Der Langeweile-Drache',
    beschreibung: 'Du sitzt vor einem trockenen Fachtext. Die Augen werden schwer. Der Langeweile-Drache greift an.',
    user_stat: { name: 'Lern-Energie', max: 100 },
    boss_stat: { name: 'Langeweile', max: 100 },
    wellen: [
      {
        name: 'Der trockene Fachtext',
        situation: 'Seite 3 von 40. Der Text ist trocken wie die Sahara. Du merkst: Du liest die gleiche Zeile zum dritten Mal.',
        optionen: [
          { text: 'Durchbeißen und weiterlesen, egal wie langweilig', user_damage: 30, boss_damage: 5, feedback: 'Willenskraft allein funktioniert nicht. Dein Gehirn schaltet bei Langeweile auf Autopilot — du liest Wörter ohne sie zu verarbeiten.' },
          { text: 'Erst eine Frage formulieren, DANN die Antwort im Text suchen', user_damage: 0, boss_damage: 40, feedback: 'Perfekt! Neugier ist der Gegner von Langeweile. Wenn du eine Frage hast, sucht dein Gehirn aktiv — statt passiv Buchstaben zu scannen.' },
          { text: 'Zum nächsten Kapitel springen, das klingt interessanter', user_damage: 15, boss_damage: 15, feedback: 'Kann funktionieren, aber du verpasst möglicherweise wichtige Grundlagen. Besser: Frage formulieren und gezielt lesen.' },
        ],
      },
      {
        name: 'Die 3-Stunden-Lernmarathon-Falle',
        situation: 'Du hast dir vorgenommen, 3 Stunden am Stück zu lernen. Nach 45 Minuten: Handy-Griff. Instagram. 20 Minuten weg.',
        optionen: [
          { text: 'Handy in einen anderen Raum legen und weiterlernen', user_damage: 10, boss_damage: 20, feedback: 'Gut, aber das Problem ist nicht nur das Handy. 3 Stunden am Stück überfordern dein Arbeitsgedächtnis.' },
          { text: 'Pomodoro: 25 Min lernen → 5 Min Pause → wiederholen', user_damage: 0, boss_damage: 45, feedback: 'BOSS GETROFFEN! Dein Gehirn braucht Pausen zum Konsolidieren. 3x25 Min > 1x75 Min. Das ist wissenschaftlich belegt.' },
          { text: 'Aufhören, du bist offensichtlich nicht in der Stimmung', user_damage: 35, boss_damage: 0, feedback: 'Stimmung folgt AKTION, nicht umgekehrt. Wer wartet bis er "in der Stimmung" ist, lernt nie.' },
        ],
      },
      {
        name: 'Der Sinn-Verlust',
        situation: '"Warum lerne ich das überhaupt? Brauche ich das wirklich?" Der Langeweile-Drache flüstert dir ein aufzugeben.',
        optionen: [
          { text: 'Stimmt, das brauche ich nicht. Ich höre auf.', user_damage: 40, boss_damage: 0, feedback: 'Der Drache hat gewonnen. Kurzfristige Relevanz ist nicht alles — die wertvollsten Skills fühlen sich beim Lernen sinnlos an.' },
          { text: 'Verbindung herstellen: "Wie hilft mir das in meinem Job/meiner Karriere?"', user_damage: 0, boss_damage: 40, feedback: 'BOSS BESIEGT! Sinn ist der mächtigste Motivator. Wenn du das WARUM kennst, erträgt dein Gehirn jedes WIE.' },
          { text: 'Einfach weitermachen, irgendwann ergibt es Sinn', user_damage: 20, boss_damage: 10, feedback: 'Manchmal funktioniert das. Aber bewusstes Sinn-Suchen ist 3x effektiver als blindes Weitermachen.' },
        ],
      },
    ],
    sieg: { badge: 'Drachen-Bezwinger', xp: 200, text: 'Du hast den Langeweile-Drachen besiegt. Fragen stellen, Pomodoro, Sinn finden — dein Anti-Langeweile-Arsenal.' },
  },

  vergessens_tsunami: {
    name: 'Der Vergessens-Tsunami',
    beschreibung: 'Du hast gestern 3 Stunden gelernt. Heute weißt du: fast nichts mehr. Der Vergessens-Tsunami hat zugeschlagen.',
    user_stat: { name: 'Gedächtnis', max: 100 },
    boss_stat: { name: 'Vergessen', max: 100 },
    wellen: [
      {
        name: 'Die 24-Stunden-Mauer',
        situation: 'Du hast gestern einen Online-Kurs gemacht. 4 Stunden Python. Heute im Meeting: "Wie macht man nochmal eine List Comprehension?"',
        optionen: [
          { text: 'Nochmal den ganzen Kurs anschauen', user_damage: 30, boss_damage: 5, feedback: '4 Stunden wiederholen = 4 Stunden verschwendet. Ebbinghaus zeigt: Nach 24h vergisst du 70%. Passives Wiederholen hilft kaum.' },
          { text: 'Active Recall: Auswendig aufschreiben was du noch weißt, DANN Lücken nachschlagen', user_damage: 0, boss_damage: 45, feedback: 'PERFEKT! Active Recall ist 3x effektiver als nochmal lesen. Dein Gehirn stärkt Verbindungen durchs ABRUFEN, nicht durchs KONSUMIEREN.' },
          { text: 'Zusammenfassung des Kurses lesen', user_damage: 15, boss_damage: 15, feedback: 'Besser als nichts, aber passives Lesen erzeugt nur eine Illusion des Wissens. Du ERKENNST es, aber kannst es nicht ABRUFEN.' },
        ],
      },
      {
        name: 'Die Wiederholungs-Frage',
        situation: 'Du hast 50 Karteikarten erstellt. Wann wiederholst du sie?',
        optionen: [
          { text: 'Alle 50 Karten jeden Tag', user_damage: 25, boss_damage: 10, feedback: 'Massed Practice. Funktioniert kurzfristig, aber nach 2 Wochen hast du trotzdem alles vergessen. Und es kostet zu viel Zeit.' },
          { text: 'Spaced Repetition: Tag 1, Tag 3, Tag 7, Tag 21 — nur die Karten die du vergessen hast', user_damage: 0, boss_damage: 50, feedback: 'BOSS BESIEGT! Spaced Repetition nutzt den Spacing-Effekt: Vergessen + Abrufen an der richtigen Stelle = Langzeitgedächtnis.' },
          { text: 'Einmal durchgehen und dann nie wieder', user_damage: 40, boss_damage: 0, feedback: 'Das ist so als würdest du ins Fitnessstudio gehen, einmal Gewichte heben und erwarten für immer fit zu sein.' },
        ],
      },
    ],
    sieg: { badge: 'Gedächtnis-Meister', xp: 200, text: 'Active Recall + Spaced Repetition = dein Gedächtnis ist unbesiegbar.' },
  },

  pruefungs_panik: {
    name: 'Der Prüfungs-Panik-Boss',
    beschreibung: 'Morgen ist die Prüfung. Du hast gelernt, aber die Panik steigt. Dein Gehirn droht zu blocken.',
    user_stat: { name: 'Konzentration', max: 100 },
    boss_stat: { name: 'Panik', max: 100 },
    wellen: [
      {
        name: 'Die Nacht davor',
        situation: 'Es ist 23:00 Uhr, morgen um 09:00 die Prüfung. Du überlegst eine Nachtschicht einzulegen.',
        optionen: [
          { text: 'Nachtschicht: Die ganze Nacht durchlernen', user_damage: 40, boss_damage: 0, feedback: 'Schlafentzug reduziert deine kognitive Leistung um 40%. Du vergisst MEHR als du in der Nacht lernst. Schlaf konsolidiert Gelerntes.' },
          { text: '30 Min Active Recall der wichtigsten Konzepte, dann schlafen gehen', user_damage: 0, boss_damage: 45, feedback: 'PERFEKT! Dein Gehirn konsolidiert im Schlaf. Die letzte Wiederholung VOR dem Schlafen ist die effektivste.' },
          { text: 'Zusammenfassungen nochmal durchlesen', user_damage: 15, boss_damage: 15, feedback: 'Besser als eine Nachtschicht, aber Active Recall wäre effektiver. Lies nicht — TESTE dich selbst.' },
        ],
      },
      {
        name: 'Der Blackout',
        situation: 'Die Prüfung hat begonnen. Frage 3. Du weißt es... aber dein Kopf ist leer. Totaler Blackout.',
        optionen: [
          { text: 'Panisch werden und wild anfangen zu schreiben', user_damage: 35, boss_damage: 0, feedback: 'Panik aktiviert den Kampf-oder-Flucht-Modus. Dein präfrontaler Kortex (rationales Denken) wird unterdrückt. Chaos folgt.' },
          { text: '10 Sekunden atmen, Augen schließen, dann von einem verwandten Thema aus annähern', user_damage: 0, boss_damage: 50, feedback: 'BOSS BESIEGT! Atmen senkt Cortisol. Über Assoziationen findest du den Weg zurück zur Antwort. Dein Wissen ist da — es ist nur blockiert.' },
          { text: 'Die Frage überspringen und später zurückkommen', user_damage: 10, boss_damage: 20, feedback: 'Kann funktionieren, aber die Angst wächst mit jeder übersprungenen Frage. Besser: Erst beruhigen, dann lösen.' },
        ],
      },
    ],
    sieg: { badge: 'Prüfungs-Champion', xp: 200, text: 'Du hast die Panik besiegt. Schlaf > Nachtschicht. Atmen > Panik. Active Recall > passives Lesen.' },
  },

  perfektionismus_parasit: {
    name: 'Der Perfektionismus-Parasit',
    beschreibung: 'Du willst alles 100% verstehen bevor du weitergehst. Der Perfektionismus-Parasit hat dich im Griff.',
    user_stat: { name: 'Lern-Fortschritt', max: 100 },
    boss_stat: { name: 'Perfektionismus', max: 100 },
    wellen: [
      {
        name: 'Die erste Lektion',
        situation: 'Du verstehst 80% des Lernstoffs. 20% sind noch unklar. Du überlegst, die Lektion nochmal von vorne zu machen.',
        optionen: [
          { text: 'Nochmal von vorne, bis ich 100% verstehe', user_damage: 35, boss_damage: 0, feedback: 'Die letzten 20% kosten 80% der Zeit. Und oft werden sie klar, wenn du den NÄCHSTEN Abschnitt lernst. Perfektionismus = Fortschritts-Killer.' },
          { text: 'Die 20% notieren und weitermachen. Beim Wiederholen werden sie klarer.', user_damage: 0, boss_damage: 45, feedback: 'PERFEKT! Lücken sind normal und wichtig. Dein Gehirn füllt sie beim nächsten Durchgang. Das nennt sich "Interleaving Effect".' },
          { text: 'Google/ChatGPT für die fehlenden 20%', user_damage: 10, boss_damage: 20, feedback: 'Kann helfen, aber der sofortige Griff zum Tool verhindert dass dein Gehirn selbst die Lücke schließt. Erst versuchen, dann nachschlagen.' },
        ],
      },
      {
        name: 'Der Notizen-Perfektionist',
        situation: 'Du hast 3 Stunden Notizen gemacht. Perfekt formatiert, farbig markiert, mit Unterpunkten. Problem: Du hast den Stoff dabei nicht GELERNT.',
        optionen: [
          { text: 'Weiter perfektionieren, die Notizen sind noch nicht schön genug', user_damage: 40, boss_damage: 0, feedback: 'Du verwechselst Produktivität mit Lernfortschritt. Schöne Notizen = Prokrastination in Verkleidung.' },
          { text: 'Notizen zuklappen, aus dem Gedächtnis aufschreiben was du noch weißt', user_damage: 0, boss_damage: 50, feedback: 'BOSS BESIEGT! Active Recall schlägt jede noch so perfekte Zusammenfassung. Messy Notizen die du ABRUFST > perfekte Notizen die du nur LIEST.' },
          { text: 'Die Notizen einem Freund schicken', user_damage: 15, boss_damage: 10, feedback: 'Nett, aber dein Freund profitiert mehr als du. Teach-Back (mündlich erklären) wäre besser als Notizen weiterleiten.' },
        ],
      },
    ],
    sieg: { badge: 'Anti-Perfektionist', xp: 200, text: '80% verstehen + weitermachen > 100% anstreben + steckenbleiben. Fortschritt schlägt Perfektion.' },
  },
};

// ---------------------------------------------------------------------------
// 5. EMOTIONEN & LERNEN
// ---------------------------------------------------------------------------
export const EMOTIONEN_LERNEN = {
  titel: 'Emotionen bestimmen ob du lernst oder nur Zeit absitzt',
  zustaende: [
    { emotion: 'Angst', wirkung: 'Blockiert den präfrontalen Kortex. Kein neues Wissen kommt rein.', losung: 'Atmen + kleine Schritte. Schwierigkeit reduzieren bis Angst sinkt.' },
    { emotion: 'Neugier', wirkung: 'Dopamin-Ausschüttung. Maximale Aufnahmefähigkeit.', losung: 'IMMER eine Frage formulieren bevor du lernst. Neugier = Turbo.' },
    { emotion: 'Langeweile', wirkung: 'Autopilot. Du liest Wörter ohne sie zu verarbeiten.', losung: 'Pomodoro + Gamification + persönliche Relevanz herstellen.' },
    { emotion: 'Humor', wirkung: 'Endorphine verbessern Gedächtnis um 20%.', losung: 'Eselsbrücken, absurde Beispiele, Witze zum Lernstoff.' },
  ],
  state_management: {
    titel: 'In 60 Sekunden lernbereit',
    schritte: [
      { sekunde: '0-15', aktion: 'Power-Pose: Aufrecht stehen, Arme öffnen', warum: 'Cortisol sinkt, Testosteron steigt' },
      { sekunde: '15-30', aktion: '3x tief atmen: 4-4-6', warum: 'Parasympathikus aktivieren' },
      { sekunde: '30-45', aktion: 'Lern-Frage formulieren: "Was will ich heute können?"', warum: 'Neugier = Dopamin = Lernbereitschaft' },
      { sekunde: '45-60', aktion: 'Timer stellen: 25 Min Pomodoro', warum: 'Commitment + Zeitdruck = Fokus' },
    ],
  },
};

// ---------------------------------------------------------------------------
// 6. SCHLAF & BEWEGUNG
// ---------------------------------------------------------------------------
export const SCHLAF_BEWEGUNG = {
  schlaf: {
    titel: 'Die Nacht entscheidet ob du morgen noch weißt was du heute gelernt hast',
    regeln: [
      { regel: '7-9 Stunden Schlaf', warum: 'Weniger als 6h = 40% weniger Gedächtnisleistung (Walker, 2017)' },
      { regel: 'Letzte Wiederholung VOR dem Schlafen', warum: 'Sleep-Dependent Memory Consolidation: Dein Gehirn sortiert im Schlaf' },
      { regel: 'Kein Screen 30 Min vor dem Schlafen', warum: 'Blaulicht unterdrückt Melatonin = schlechterer Schlaf = schlechteres Lernen' },
      { regel: 'Regelmäßige Schlafenszeit', warum: 'Der zirkadiane Rhythmus optimiert die Konsolidierung' },
    ],
  },
  bewegung: {
    titel: '20 Minuten Bewegung VOR dem Lernen',
    warum: 'Bewegung erhöht BDNF (Brain-Derived Neurotrophic Factor) — das "Dünger für Neuronen" Protein.',
    empfehlung: 'Moderate Intensität: Spazieren, Joggen, Radfahren. NICHT Hochleistungssport.',
    studien: 'Ratey (2008): 20 Min moderates Cardio vor dem Lernen verbessert Gedächtnisleistung um 20%.',
  },
  pre_learning_ritual: {
    titel: 'Dein Pre-Learning Ritual (5 Min)',
    schritte: [
      'Glas Wasser trinken (Hydration = Kognition)',
      '2 Min Bewegung (Hampelmänner, Treppe, Stretching)',
      'Lern-Ziel aufschreiben: "Nach dieser Session kann ich..."',
      'Handy in Flugmodus',
      'Timer starten (25 Min)',
    ],
  },
};

// ---------------------------------------------------------------------------
// 7. FEHLER-KULTUR
// ---------------------------------------------------------------------------
export const FEHLER_KULTUR = {
  titel: 'Die Kunst des Scheiterns: Fehler als Lern-Turbo',
  desirable_difficulties: {
    erklaerung: 'Lernen das sich SCHWER anfühlt ist oft effektiver als Lernen das sich leicht anfühlt.',
    beispiele: [
      { leicht: 'Text markieren und nochmal lesen', schwer: 'Text zuklappen und aus dem Gedächtnis aufschreiben', effekt: 'Active Recall: 3x bessere Retention' },
      { leicht: 'Alle Mathe-Aufgaben vom gleichen Typ hintereinander', schwer: 'Aufgabentypen mischen (Interleaving)', effekt: 'Interleaving: 25% bessere Performance in Tests' },
      { leicht: 'Sofort die Lösung nachschlagen', schwer: 'Erst 5 Min selbst nachdenken, auch wenn falsch', effekt: 'Generation Effect: Fehler + Korrektur = stärkste Lernform' },
    ],
  },
  fehler_autopsie: {
    titel: 'Die Fehler-Autopsie: 5 Fragen',
    fragen: [
      'Was genau ist passiert? (Fakten, keine Bewertung)',
      'Welche Annahme war falsch?',
      'Was hätte ich VORHER wissen müssen?',
      'Was mache ich NÄCHSTES MAL anders?',
      'Wen kann ich fragen der diese Erfahrung schon hat?',
    ],
  },
  hypercorrection: {
    erklaerung: 'Der Hypercorrection-Effekt: Wenn du sehr SICHER warst und trotzdem FALSCH lagst, merkst du dir die richtige Antwort BESONDERS gut.',
    implikation: 'Trau dich zu raten! Je sicherer du falsch liegst, desto stärker lernst du daraus.',
  },
};

// ---------------------------------------------------------------------------
// 8. TRANSFER
// ---------------------------------------------------------------------------
export const TRANSFER = {
  titel: 'Vom Wissen zum Tun: Warum 87% des Gelernten verloren geht',
  regel_24h: {
    erklaerung: 'Wende etwas Gelerntes innerhalb von 24 Stunden an — oder es verschwindet.',
    beispiel: 'Seminar am Dienstag → Mittwoch eine Technik ausprobieren → Freitag reflektieren',
  },
  wenn_dann: {
    erklaerung: 'Implementation Intentions (Gollwitzer): "WENN Situation X eintritt, DANN mache ich Y."',
    beispiele: [
      { wenn: 'ein Kollege mich um Hilfe bittet', dann: 'erkläre ich das Konzept mit der Feynman-Methode' },
      { wenn: 'ich morgens den Laptop aufklappe', dann: 'wiederhole ich 5 Karteikarten (3 Min)' },
      { wenn: 'ich in einem Meeting nichts verstehe', dann: 'notiere ich die 3 wichtigsten Begriffe und schlage sie danach nach' },
    ],
  },
  lernpyramide: {
    stufen: [
      { methode: 'Vorlesung hören', retention: 5 },
      { methode: 'Lesen', retention: 10 },
      { methode: 'Audio/Visuell', retention: 20 },
      { methode: 'Demonstration', retention: 30 },
      { methode: 'Diskussionsgruppe', retention: 50 },
      { methode: 'Praktische Übung', retention: 75 },
      { methode: 'Anderen beibringen', retention: 90 },
    ],
  },
};

// ---------------------------------------------------------------------------
// 9. BERUFSEINSTEIGER EXTRAS
// ---------------------------------------------------------------------------
export const EINSTEIGER_EXTRAS = {
  mentor_mirror: {
    titel: 'Branchen-Vergleich: Wie schnell lernen andere?',
    beschreibung: 'Orientierung für Einsteiger: Bin ich normal?',
    branchen: [
      { branche: 'IT / Software', durchschnitt: '45 Min/Tag', top_skills: 'Python, Cloud, Agile', lern_budget: '10% der Arbeitszeit' },
      { branche: 'Finance / Banking', durchschnitt: '30 Min/Tag', top_skills: 'Excel, SAP, IFRS', lern_budget: '5% der Arbeitszeit' },
      { branche: 'Marketing / Kommunikation', durchschnitt: '35 Min/Tag', top_skills: 'SEO, Analytics, Content', lern_budget: '8% der Arbeitszeit' },
      { branche: 'Gesundheit / Pflege', durchschnitt: '50 Min/Tag', top_skills: 'Diagnostik, Protokolle, Hygiene', lern_budget: '12% der Arbeitszeit' },
      { branche: 'Ingenieurwesen', durchschnitt: '40 Min/Tag', top_skills: 'CAD, Normen, Projektmanagement', lern_budget: '8% der Arbeitszeit' },
      { branche: 'Vertrieb / Sales', durchschnitt: '25 Min/Tag', top_skills: 'CRM, Verhandlung, Produkte', lern_budget: '5% der Arbeitszeit' },
    ],
  },
  pruefungs_strategien: {
    titel: 'Prüfungs-Strategien die funktionieren',
    methoden: [
      { name: '3-Pass Methode', erklaerung: '1. Überfliegen (Struktur verstehen) → 2. Aktiv lesen + markieren → 3. Nur Markiertes wiederholen', fuer: 'Alle schriftlichen Prüfungen' },
      { name: 'Past Paper Training', erklaerung: 'Alte Prüfungen lösen = 3x effektiver als Zusammenfassungen lesen. Muster erkennen.', fuer: 'Standardisierte Prüfungen (IHK, Uni, Zertifizierungen)' },
      { name: '80/20 Regel', erklaerung: '20% des Stoffs = 80% der Prüfungsfragen. Finde diese 20% (Frag Kommilitonen, Altklausuren).', fuer: 'Zeitdruck vor der Prüfung' },
      { name: 'Spaced Rep Kalender', erklaerung: 'Tag 1 lernen → Tag 3 wiederholen → Tag 7 → Tag 21 → fertig', fuer: 'Langfristiges Behalten' },
    ],
  },
  onboarding_90_tage: {
    titel: '90-Tage Onboarding: First Job Survival Guide',
    phasen: [
      { woche: 'Woche 1-2', fokus: 'Beobachten + Fragen stellen', technik: 'Cornell-Notizen für alles was du lernst', tipp: 'Stell DUMME Fragen. Jetzt darfst du das noch.' },
      { woche: 'Woche 3-4', fokus: 'Systeme & Prozesse verstehen', technik: 'Mind-Map der Organisation erstellen', tipp: 'Wer macht was? Wer entscheidet was? Wer hilft dir?' },
      { woche: 'Monat 2', fokus: 'Fachwissen vertiefen', technik: 'Feynman + Pomodoro für Fachthemen', tipp: 'Identifiziere die 3 wichtigsten Fähigkeiten für deinen Job.' },
      { woche: 'Monat 3', fokus: 'Erste eigene Ergebnisse liefern', technik: 'Teach-Back: Erkläre Kollegen was du gelernt hast', tipp: 'Zeige deinem Chef: Ich lerne schnell und liefere.' },
    ],
  },
  impostor_syndrom: {
    titel: 'Impostor-Syndrom besiegen',
    fakten: [
      '70% aller Berufseinsteiger fühlen sich als Hochstapler (Clance & Imes, 1978)',
      'Es ist ein Zeichen von WACHSTUM, nicht Inkompetenz',
      'Die Dunning-Kruger-Kurve zeigt: Je mehr du weißt, desto unsicherer fühlst du dich',
    ],
    reframing: [
      { alt: 'Ich weiß nichts', neu: 'Ich bin am Anfang eines Lernprozesses' },
      { alt: 'Alle können mehr als ich', neu: 'Alle haben nur früher angefangen' },
      { alt: 'Ich werde entlarvt', neu: 'Ich werde besser — jeden Tag' },
      { alt: 'Ich habe nur Glück gehabt', neu: 'Glück trifft nur die Vorbereiteten' },
    ],
  },
  lerngruppen: {
    titel: 'Lerngruppen-Guide: Zusammen lernt man besser',
    regeln: [
      '3-5 Personen (mehr = Chaos)',
      'Wöchentlich 60 Min (fester Termin)',
      'Jeder erklärt 1 Thema (Teach-Back = 90% Retention)',
      'Pomodoro-Timer: 25+5',
      'Keine Laptops/Handys während der Erklärung',
    ],
    formate: [
      { name: 'Round-Robin', erklaerung: 'Jeder hat 10 Min um ein Konzept zu erklären. Danach: 5 Min Fragen.' },
      { name: 'Quiz Battle', erklaerung: 'Jeder bringt 5 Fragen mit. Wer die meisten richtig hat, gewinnt.' },
      { name: 'Problem-Solving', erklaerung: 'Gemeinsam eine Fallstudie/Aufgabe lösen. Verschiedene Perspektiven.' },
    ],
  },
};

// ---------------------------------------------------------------------------
// 10. BERUFSERFAHRENE EXTRAS
// ---------------------------------------------------------------------------
export const PROFESSIONAL_EXTRAS = {
  unlearn_assistant: {
    titel: 'Kill your Darlings: Altes verlernen',
    erklaerung: 'Nach 5+ Jahren blockieren alte Routinen neues Wissen. Du musst AKTIV verlernen.',
    schritte: [
      '3 Routinen aufschreiben die du seit 3+ Jahren machst',
      'Für jede fragen: Gibt es eine bessere Methode die ich nicht kenne?',
      '1 Woche die Alternative testen. Ergebnis messen.',
    ],
    beispiele: [
      { alt: 'Excel manuell pflegen', neu: 'Power Automate / Skript', hebel: '10h/Monat gespart' },
      { alt: 'Meeting-Protokoll per Hand', neu: 'AI-Transkription + Zusammenfassung', hebel: '5h/Monat gespart' },
      { alt: 'Alles selbst googlen', neu: 'AI-Copilot für Recherche', hebel: '15h/Monat gespart' },
    ],
  },
  micro_learning_beruf: {
    titel: 'Micro-Learning: Lernen ohne Extra-Zeit',
    erklaerung: 'Du hast keine 8 Stunden Lernzeit. Aber du hast Lücken.',
    slots: [
      { zeit: '07:00 Pendeln', format: 'Podcast / Hörbuch', dauer: '15-30 Min', tipp: '1.5x Speed + Notiz-App für Kernpunkte' },
      { zeit: '12:30 Mittagspause', format: '1 Artikel Skimming + 3-Satz-Notiz', dauer: '10 Min', tipp: 'Nur Artikel die auf ein Projekt einzahlen' },
      { zeit: '20:00 Abends', format: 'Spaced Repetition Karteikarten', dauer: '5 Min', tipp: 'Anki/Quizlet: 5 Min = 20 Karten = 1 Woche behalten' },
    ],
    gesamt: '30-45 Min/Tag ohne Extra-Zeitblock',
  },
  skill_stacking: {
    titel: 'Skill-Stacking: 3 Skills = Top 1%',
    formel: 'Skill A (70%) + Skill B (70%) + Skill C (70%) = Top 1% Einzigartigkeit',
    erklaerung: 'Du musst nicht der Beste in EINEM Bereich sein. Kombiniere 3 überdurchschnittliche Skills zu einer einzigartigen Kombination.',
    beispiele: [
      { skills: ['Vertrieb', 'Datenanalyse', 'Storytelling'], ergebnis: 'Revenue Storyteller', marktwert: '+40%' },
      { skills: ['Projektmanagement', 'KI-Tools', 'Branchenwissen'], ergebnis: 'AI Transformation Lead', marktwert: '+55%' },
      { skills: ['Design', 'Psychologie', 'Coding'], ergebnis: 'UX Engineer', marktwert: '+45%' },
    ],
  },
  lern_roi: {
    titel: 'Lern-ROI Rechner',
    erklaerung: 'Professionals wollen Zahlen. Hier ist deine:',
    formel: 'ROI = (Gehaltssteigerung x Jahre) / (Lernstunden x Stundensatz)',
    beispiel: {
      investition: '20 Stunden x 50€ Opportunitätskosten = 1.000€',
      ertrag: '5.000€ Gehaltssteigerung/Jahr x 5 Jahre = 25.000€',
      roi: '2.400%',
    },
    felder: ['Aktuelles Gehalt', 'Erwartete Steigerung (%)', 'Lernstunden investiert', 'Stundensatz'],
  },
  wissenstransfer: {
    titel: 'Wissenstransfer: Lehren = 90% Retention',
    methoden: [
      { name: 'Brown Bag Sessions', erklaerung: '30 Min Mittagspause: 1 Person erklärt 1 Konzept. Pizza optional, Wissen obligatorisch.', format: '15 Min Vortrag + 15 Min Q&A' },
      { name: '1-Pager System', erklaerung: 'Jedes Tool, jeden Prozess, jedes Konzept auf 1 Seite zusammenfassen. So dass ein Neuling es in 5 Min versteht.', format: 'Titel, Problem, Lösung, 3 Schritte, 1 Beispiel' },
    ],
  },
};

// ---------------------------------------------------------------------------
// 11. FÜHRUNGSKRAFT EXTRAS (inkl. ehemaliger Investor-Content)
// ---------------------------------------------------------------------------
export const FUEHRUNGSKRAFT_EXTRAS = {
  // Wissenstransfer (aus Professional-Bereich, relevant für FK)
  wissenstransfer: {
    titel: 'Wissenstransfer: Lehren = 90% Retention',
    methoden: [
      { name: 'Brown Bag Sessions', erklaerung: '30 Min Mittagspause: 1 Person erklärt 1 Konzept. Pizza optional, Wissen obligatorisch.', format: '15 Min Vortrag + 15 Min Q&A' },
      { name: '1-Pager System', erklaerung: 'Jedes Tool, jeden Prozess, jedes Konzept auf 1 Seite zusammenfassen. So dass ein Neuling es in 5 Min versteht.', format: 'Titel, Problem, Lösung, 3 Schritte, 1 Beispiel' },
    ],
  },
  // Executive Abstractor (ehemals Investor)
  executive_abstractor: {
    titel: '100 Seiten in 10 Minuten: Die 5-Punkte Extraktion',
    erklaerung: 'Führungskräfte haben keine Zeit für langes Lesen. Diese Methode extrahiert das Wesentliche.',
    schritte: [
      { minute: '1-2', aktion: 'Inhaltsverzeichnis + letzte Seite lesen', warum: 'Struktur + Fazit = 80% des Inhalts' },
      { minute: '3-4', aktion: 'Alle Grafiken und Charts scannen', warum: 'Grafiken zeigen die Story hinter den Zahlen' },
      { minute: '5-6', aktion: 'Executive Summary lesen', warum: 'Die Autoren haben die Arbeit für dich gemacht' },
      { minute: '7-8', aktion: 'NUR Abweichungen und Risiken suchen', warum: 'Normal ist uninteressant. Anomalien sind die Story.' },
      { minute: '9-10', aktion: '5-Punkte Zusammenfassung schreiben', warum: 'Schreiben = Verarbeiten. 5 Punkte = Kernessenz.' },
    ],
  },
  // Synthese-Training (ehemals Investor)
  synthese_training: {
    titel: 'The Dot Connector: Synthese-Training',
    erklaerung: '2 scheinbar unverwandte Branchen → 60 Sekunden → Synergie formulieren.',
    uebungen: [
      { branchen: ['Fintech', 'Landwirtschaft'], hint: 'Precision Farming + Smart Payments' },
      { branchen: ['Healthcare', 'Gaming'], hint: 'Gamified Rehabilitation' },
      { branchen: ['Logistik', 'Social Media'], hint: 'Social Commerce + Last-Mile Optimization' },
      { branchen: ['Bildung', 'Blockchain'], hint: 'Verified Credentials + Micro-Certifications' },
    ],
    timer: 60,
  },
  // Entscheidungs-Journal (ehemals Investor)
  entscheidungs_journal: {
    titel: 'Entscheidungs-Journal: Lerne aus deinen eigenen Entscheidungen',
    erklaerung: 'Führungskräfte lernen nicht aus Büchern — sie lernen aus EIGENEN Entscheidungen.',
    felder: [
      { name: 'Datum', placeholder: 'TT.MM.JJJJ' },
      { name: 'Entscheidung', placeholder: 'Was habe ich entschieden?' },
      { name: 'Top 3 Gründe', placeholder: 'Warum?' },
      { name: 'Zuversicht', placeholder: '1-10' },
      { name: 'Ergebnis (nach 3 Mon)', placeholder: 'Was ist passiert?' },
      { name: 'Learning', placeholder: 'Was habe ich gelernt?' },
    ],
  },
  // Schnellbewertung (ehemals Investor)
  schnellbewertung: {
    titel: '2-Minuten Due Diligence',
    erklaerung: '50 Pitch-Decks pro Woche? Dieser 5-Fragen Filter entscheidet in 2 Minuten.',
    filter: [
      { frage: 'Echtes Problem?', ja: 'Weiter', nein: 'Ablage' },
      { frage: 'Markt > 1 Mrd?', ja: 'Weiter', nein: 'Ablage' },
      { frage: 'Team mit Erfahrung?', ja: 'Weiter', nein: '5 Min mehr Research' },
      { frage: 'Unfairer Vorteil (Moat)?', ja: 'Weiter', nein: 'Risiko-Flag' },
      { frage: 'Passt ins Portfolio?', ja: 'Deep Dive', nein: 'Weiterleiten' },
    ],
  },
  // Netzwerk-Intelligence (ehemals Investor)
  netzwerk_intelligence: {
    titel: 'Netzwerk-Intelligence: 15 Min Gespräch > 10h Selbststudium',
    methoden: [
      { name: '3-Fragen Methode', erklaerung: 'Vor jedem Experten-Gespräch: Exakt 3 Fragen vorbereiten. Nicht mehr. Fokus = Tiefe.' },
      { name: 'Reverse Mentoring', erklaerung: 'Lass dich von jemandem 20 Jahre jünger beraten. Perspektive > Erfahrung.' },
      { name: 'Warm-Intro-Kette', erklaerung: 'Frage nie "Kannst du mir helfen?" sondern "Wen kennst du der mir helfen könnte?"' },
    ],
  },
};

// ---------------------------------------------------------------------------
// 12. MODUL-QUIZZES
// ---------------------------------------------------------------------------
export const MODUL_QUIZ_LERNEN = {
  modul_1: [
    { question: 'Was unterscheidet Hirnbesitzer von Hirnbenutzern?', options: ['Die Intelligenz', 'Bewusster Einsatz von Lernstrategien', 'Das Alter', 'Die Bildung'], correct: 1 },
    { question: 'Stimmt es, dass wir nur 10% unseres Gehirns nutzen?', options: ['Ja, wissenschaftlich bewiesen', 'Nein, ein Mythos — wir nutzen alle Bereiche', 'Nur beim Schlafen', 'Hängt vom IQ ab'], correct: 1 },
    { question: 'Warum funktioniert Multitasking beim Lernen nicht?', options: ['Das Gehirn hat zu wenig Speicher', 'Aufmerksamkeit kann nur auf eine komplexe Aufgabe fokussieren', 'Es funktioniert, nur langsamer', 'Multitasking ist nur für Frauen'], correct: 1 },
  ],
  modul_2: [
    { question: 'Wie viele Lerntypen gibt es nach VARK?', options: ['2', '3', '4', '8'], correct: 2 },
    { question: 'Was sollte man mit seinem Lerntyp-Ergebnis tun?', options: ['Nur noch so lernen', 'Als Startpunkt nutzen, aber alle Kanäle einsetzen', 'Ignorieren', 'Anderen seinen Typ mitteilen'], correct: 1 },
  ],
  modul_3: [
    { question: 'Was passiert im Gehirn bei Angst?', options: ['Maximale Lernbereitschaft', 'Der präfrontale Kortex wird blockiert', 'Mehr Dopamin', 'Nichts besonderes'], correct: 1 },
    { question: 'Was ist der stärkste Lern-Emotion?', options: ['Angst', 'Langeweile', 'Neugier', 'Wut'], correct: 2 },
  ],
  modul_4: [
    { question: 'Wie viel vergisst man nach 24h ohne Wiederholung?', options: ['10%', '30%', '70%', '90%'], correct: 2 },
    { question: 'Was ist der Spacing-Effekt?', options: ['Schneller lernen', 'Verteiltes Lernen ist effektiver als Massen-Lernen', 'Lernpausen sind schlecht', 'Mehr Abstand zum Bildschirm'], correct: 1 },
  ],
  modul_5: [
    { question: 'Was ist die Feynman-Methode?', options: ['Schneller lesen', 'Ein Konzept so einfach erklären dass ein Kind es versteht', 'Karteikarten erstellen', 'In Gruppen lernen'], correct: 1 },
    { question: 'Was ist die ideale Pomodoro-Dauer?', options: ['10 Min', '25 Min', '45 Min', '60 Min'], correct: 1 },
  ],
  modul_6: [
    { question: 'Was ist Active Recall?', options: ['Texte nochmal lesen', 'Aktives Abrufen aus dem Gedächtnis', 'Markieren und unterstreichen', 'Videos anschauen'], correct: 1 },
    { question: 'Wie funktioniert Spaced Repetition?', options: ['Alles auf einmal lernen', 'In steigenden Intervallen wiederholen (1-3-7-21 Tage)', 'Täglich alles wiederholen', 'Nur vor der Prüfung'], correct: 1 },
  ],
  modul_7: [
    { question: 'Was ist Flow nach Csikszentmihalyi?', options: ['Entspannung', 'Zustand totaler Vertiefung bei optimaler Herausforderung', 'Stress', 'Langeweile'], correct: 1 },
    { question: 'Was braucht man für Flow?', options: ['Viel Kaffee', 'Klare Ziele + Feedback + passende Schwierigkeit', 'Zeitdruck', 'Multitasking'], correct: 1 },
  ],
  modul_8: [
    { question: 'Wie viel Schlaf braucht man für optimales Lernen?', options: ['4-5 Stunden', '6 Stunden', '7-9 Stunden', '10+ Stunden'], correct: 2 },
    { question: 'Was ist BDNF?', options: ['Ein Schlafhormon', 'Brain-Derived Neurotrophic Factor (Dünger für Neuronen)', 'Ein Vitamin', 'Eine Lernmethode'], correct: 1 },
  ],
  modul_9: [
    { question: 'Was ist der größte Feind beim digitalen Lernen?', options: ['Schlechtes WLAN', 'Benachrichtigungen und Tab-Wechsel', 'Bildschirmgröße', 'Schriftart'], correct: 1 },
    { question: 'Hilft Musik beim Lernen?', options: ['Immer', 'Nie', 'Instrumentale Musik ohne Text kann helfen, Lyrics stören', 'Nur Klassik'], correct: 2 },
  ],
  modul_10: [
    { question: 'Was sind "Desirable Difficulties"?', options: ['Unnötige Schwierigkeiten', 'Wünschenswerte Schwierigkeiten die das Lernen vertiefen', 'Leichte Aufgaben', 'Prüfungsangst'], correct: 1 },
    { question: 'Was ist der Hypercorrection-Effekt?', options: ['Fehler vermeiden', 'Je sicherer man falsch lag, desto besser merkt man sich die Korrektur', 'Immer Recht haben', 'Fehler wiederholen'], correct: 1 },
  ],
  modul_11: [
    { question: 'Wie viel Prozent des Gelernten gehen ohne Transfer verloren?', options: ['20%', '50%', '87%', '95%'], correct: 2 },
    { question: 'Was sind Implementation Intentions?', options: ['Vorsätze', 'WENN-DANN Pläne für konkretes Handeln', 'Notizen', 'Lernziele'], correct: 1 },
  ],
  modul_12: [
    { question: 'Was ist die T-shaped Skill Strategie?', options: ['Nur ein Thema tief lernen', 'Breites Grundwissen + eine tiefe Expertise', 'Alles gleichzeitig lernen', 'Nur Soft Skills'], correct: 1 },
    { question: 'Warum ist lebenslanges Lernen die Nr. 1 Karriere-Skill?', options: ['Weil Chefs es mögen', 'Weil Fachwissen eine sinkende Halbwertszeit hat', 'Weil es in der Stellenanzeige steht', 'Ist es nicht'], correct: 1 },
  ],
};

// ---------------------------------------------------------------------------
// 13. JOURNAL-FRAGEN
// ---------------------------------------------------------------------------
export const JOURNAL_FRAGEN_LERNEN = {
  0: 'Was hat dich am meisten überrascht an deinem Selbstdiagnose-Ergebnis?',
  1: 'Bist du Hirnbesitzer oder Hirnbenutzer? Was willst du ändern?',
  2: 'Was ist dein dominanter Lerntyp? Welche Strategie probierst du diese Woche aus?',
  3: 'Wann hast du zuletzt beim Lernen echte Neugier gespürt? Was war das Thema?',
  5: 'Versuche die Feynman-Methode: Erkläre einem imaginären 10-Jährigen ein Konzept aus deinem Job.',
  7: 'Wann warst du zuletzt im Flow? Was waren die Voraussetzungen?',
  8: 'Wie viele Stunden schläfst du? Bewegst du dich vor dem Lernen?',
  10: 'Was war dein letzter beruflicher Fehler? Was hast du daraus gelernt?',
  11: 'Was hast du in den letzten 7 Tagen gelernt und innerhalb von 24h angewendet?',
  12: 'Was ist dein persönliches Lern-Ziel für die nächsten 12 Monate?',
  15: 'Hat sich dein Lernverhalten verändert seit Kursstart? Beschreibe die größte Veränderung.',
};

// ---------------------------------------------------------------------------
// 14. ABSCHLUSSTEST (10 Fragen)
// ---------------------------------------------------------------------------
export const ABSCHLUSSTEST_LERNEN = [
  { question: 'Was ist der effektivste Weg Gelerntes zu behalten?', options: ['Texte markieren', 'Active Recall + Spaced Repetition', 'Videos anschauen', 'Zusammenfassungen lesen'], correct: 1 },
  { question: 'Was besagt die Ebbinghaus Vergessenskurve?', options: ['Man vergisst 10% pro Woche', 'Ohne Wiederholung vergisst man 70% in 24h', 'Vergessen ist unmöglich', 'Nur altes Wissen wird vergessen'], correct: 1 },
  { question: 'Was ist die Feynman-Methode?', options: ['Schnell lesen', 'Erklären als ob man es einem Kind beibringt', 'Auswendig lernen', 'Mind-Mapping'], correct: 1 },
  { question: 'Was braucht man für einen Flow-State?', options: ['Zeitdruck', 'Klare Ziele + Feedback + passende Schwierigkeit', 'Absolute Stille', 'Koffein'], correct: 1 },
  { question: 'Was ist die höchste Stufe der Lernpyramide?', options: ['Lesen', 'Vorlesung hören', 'Diskussion', 'Anderen beibringen (90% Retention)'], correct: 3 },
  { question: 'Was ist der Hypercorrection-Effekt?', options: ['Perfektionismus', 'Je sicherer man falsch lag, desto besser die Korrektur', 'Zu viel lernen', 'Prüfungsangst'], correct: 1 },
  { question: 'Wie viel Schlaf braucht das Gehirn für optimale Konsolidierung?', options: ['4-5h', '7-9h', '10-12h', 'Egal'], correct: 1 },
  { question: 'Was sind Implementation Intentions?', options: ['Lernziele', 'WENN-DANN Pläne', 'Prüfungsvorbereitung', 'Zusammenfassungen'], correct: 1 },
  { question: 'Warum ist Interleaving effektiver als geblocktes Üben?', options: ['Es ist einfacher', 'Das Gehirn lernt Unterschiede zu erkennen', 'Es spart Zeit', 'Es macht mehr Spaß'], correct: 1 },
  { question: 'Was ist die T-shaped Skill Strategie?', options: ['Nur Tiefe', 'Nur Breite', 'Breites Grundwissen + eine tiefe Expertise', 'T steht für Training'], correct: 2 },
];

// ---------------------------------------------------------------------------
// 15. MIKRO-LEARNINGS (90 Tage)
// ---------------------------------------------------------------------------
export const MICRO_LEARNINGS_LERNEN = [
  { tag: 1, impuls: 'Beobachte heute: Wie lernst du etwas Neues? Liest du? Schaust du Videos? Machst du es einfach?', typ: 'beobachtung' },
  { tag: 2, impuls: 'Erkläre einem Kollegen in 60 Sekunden ein Konzept das du gestern gelernt hast (Feynman).', typ: 'technik' },
  { tag: 3, impuls: 'Erstelle 5 Karteikarten zu deinem aktuellen Lernthema.', typ: 'technik' },
  { tag: 5, impuls: 'Wiederhole die 5 Karteikarten von Tag 3 (Spaced Repetition).', typ: 'wiederholung' },
  { tag: 7, impuls: 'Formuliere 1 WENN-DANN Plan für etwas das du gelernt hast.', typ: 'transfer' },
  { tag: 10, impuls: 'Versuch heute 25 Min Pomodoro beim Lernen. Kein Handy.', typ: 'technik' },
  { tag: 14, impuls: 'Wiederhole die 5 Karteikarten (Intervall: Tag 14).', typ: 'wiederholung' },
  { tag: 21, impuls: 'Letzte Wiederholung der Karteikarten. Was sitzt jetzt?', typ: 'meilenstein' },
  { tag: 30, impuls: 'Monats-Check: Was hast du in 30 Tagen gelernt? Was davon angewendet?', typ: 'reflexion' },
  { tag: 60, impuls: 'Hast du dein Lern-Ritual beibehalten? 20 Min/Tag?', typ: 'reflexion' },
  { tag: 90, impuls: 'Finaler Check: Wie hat sich dein Lernverhalten verändert? Teile dein Ergebnis!', typ: 'abschluss' },
];

// ---------------------------------------------------------------------------
// 16. RÜCKFALL-PRÄVENTION
// ---------------------------------------------------------------------------
export const RUECKFALL_LERNEN = {
  warnsignale: [
    'Du lernst wieder ohne System (einfach konsumieren)',
    'Du wiederholst nichts mehr (keine Spaced Repetition)',
    'Du wendest Gelerntes nicht innerhalb von 24h an',
    'Du sitzt länger als 45 Min ohne Pause',
    'Du merkst dir Sachen nur noch kurzfristig',
  ],
  reset: {
    schritt_1: 'Erstelle 5 Karteikarten zu deinem aktuellen Projekt. Jetzt.',
    schritt_2: 'Erkläre einem Kollegen in 60 Sekunden was du letzte Woche gelernt hast.',
    schritt_3: 'Formuliere 1 WENN-DANN Plan für morgen.',
    schritt_4: 'Stell deinen Pomodoro-Timer auf 25 Min. Heute noch.',
  },
};

// ---------------------------------------------------------------------------
// 17. EVIDENZ
// ---------------------------------------------------------------------------
export const EVIDENZ_LERNEN = {
  quellen: [
    { autor: 'Ebbinghaus, H.', jahr: 1885, erkenntnis: 'Ohne Wiederholung vergisst man 70% in 24 Stunden (Vergessenskurve).' },
    { autor: 'Bjork, R.A.', jahr: 1994, erkenntnis: 'Desirable Difficulties: Schwieriges Lernen führt zu besserem Langzeitgedächtnis.' },
    { autor: 'Walker, M.', jahr: 2017, erkenntnis: 'Schlaf konsolidiert Gelerntes. Weniger als 6h = 40% weniger Gedächtnisleistung.' },
    { autor: 'Ratey, J.', jahr: 2008, erkenntnis: '20 Min Bewegung vor dem Lernen erhöht BDNF und Gedächtnisleistung um 20%.' },
    { autor: 'Gollwitzer, P.M.', jahr: 1999, erkenntnis: 'Implementation Intentions (WENN-DANN) verdoppeln die Umsetzungsrate.' },
    { autor: 'Csikszentmihalyi, M.', jahr: 1990, erkenntnis: 'Flow-State: Optimale Leistung bei klaren Zielen + passender Herausforderung.' },
    { autor: 'Clance & Imes', jahr: 1978, erkenntnis: '70% der Menschen erleben das Impostor-Syndrom mindestens einmal im Leben.' },
    { autor: 'Butterfield & Metcalfe', jahr: 2001, erkenntnis: 'Hypercorrection-Effekt: Hohe Zuversicht + Fehler = stärkste Korrektur.' },
  ],
};
