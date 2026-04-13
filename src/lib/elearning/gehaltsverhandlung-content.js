// ================================================
// Gehaltsverhandlung Mastery — Content Data
// 5 Module | 15 Lektionen | ~55 Minuten
// ================================================

export const LESSON_CONTENT = {

  // ─────────────────────────────────────────────
  // MODUL 1: MINDSET
  // ─────────────────────────────────────────────

  '1.1': {
    id: 'b7010000-0000-0000-0000-000000000101',
    type: 'video_with_input',
    vimeoId: '1181945346',
    title: 'Warum du aktuell unterbezahlt bist',
    duration: '3 Min.',
    takeaways: [
      'Jede Stelle hat ein Gehaltsband — wer nicht verhandelt, landet unten',
      'HR plant 1.000–5.000 € Spielraum ein, der auf dich wartet',
      '37 % der Deutschen verhandeln nicht und verlieren dadurch systematisch',
      'Über 30 Jahre summiert sich der Unterschied auf 200.000 € oder mehr',
    ],
    stats: [
      { value: '37%', label: 'verhandeln nicht' },
      { value: '5.000 €', label: 'Spielraum pro Stelle' },
      { value: '200.000 €', label: 'Lebenszeit-Unterschied' },
    ],
    inputType: 'salary_gap',
  },

  '1.2': {
    id: 'b7010000-0000-0000-0000-000000000102',
    type: 'video_with_choice',
    vimeoId: '1182571541',
    title: 'Warum die meisten Angst vor Gehaltsgesprächen haben',
    duration: '3 Min.',
    takeaways: [
      '"Nein" bedeutet fast nie: "Du bist es nicht wert" — sondern: "Gerade nicht"',
      '66 % der Führungskräfte respektieren Mitarbeiter, die verhandeln',
      'Die Angst vor einem Gespräch kostet über 10 Jahre ein Einfamilienhaus',
      'Erst wenn du deine Angst benennst, verliert sie ihre Macht',
    ],
    inputType: 'fear_selector',
    fearOptions: [
      {
        id: 'rejection',
        text: 'Dass mein Chef Nein sagt und enttäuscht von mir ist',
        feedback: '83 % aller Teilnehmer wählen genau das. Die Wahrheit: 66 % der Führungskräfte respektieren Mitarbeiter, die verhandeln — es zeigt Selbstbewusstsein.',
      },
      {
        id: 'wording',
        text: 'Dass ich nicht weiß, was ich sagen soll',
        feedback: 'Genau dafür gibt es Modul 3. Unsicherheit verschwindet durch Vorbereitung — nicht durch Mut.',
      },
      {
        id: 'too_much',
        text: 'Dass ich zu viel fordere und arrogant wirke',
        feedback: 'HR plant 1.000–5.000 € Spielraum ein. Wenn du 3.000 € mehr forderst, bist du absolut im Rahmen.',
      },
      {
        id: 'team',
        text: 'Dass es meine Stellung im Team verschlechtert',
        feedback: 'Gehaltsgespräche sind vertraulich. Dein Team erfährt nichts davon — versprochen.',
      },
    ],
  },

  '1.3': {
    id: 'b7010000-0000-0000-0000-000000000103',
    type: 'video_with_slider',
    vimeoId: '1182573431',
    videoUrl: 'https://pvqpbvxmtpuwzfzuynyq.supabase.co/storage/v1/object/public/videos/1.3_Modul%201_Gewinner%20denken.prproj.mp4',
    title: 'Wie Gewinner in Gehaltsverhandlungen denken',
    duration: '3 Min.',
    takeaways: [
      'Du bist kein Bittsteller — du bist ein Investment, das das Unternehmen schützen will',
      'Wer zuerst eine Zahl nennt, setzt den Verhandlungsrahmen (Ankerprinzip)',
      'Krumme Zahlen (63.500 statt 64.000) wirken recherchiert, nicht beliebig',
      'Nach dem Pitch: schweigen. Wer zuerst redet, verliert.',
    ],
    inputType: 'self_assessment',
    sliderLabels: {
      1: 'Ich vermeide Gehaltsgespräche komplett',
      2: 'Ich denke drüber nach, traue mich aber nicht',
      3: 'Ich habe es versucht, aber ohne echte Strategie',
      4: 'Ich verhandle, könnte aber besser sein',
      5: 'Ich gehe vorbereitet und selbstbewusst rein',
    },
    sliderFeedback: {
      low: 'Genau dafür sind wir hier. Modul 3 gibt dir einen sprechfertigen Pitch, Modul 4 echte Übung unter Druck.',
      mid: 'Gute Basis. Dir fehlt das System — nicht der Wille. Ab Modul 2 bauen wir das auf.',
      high: 'Jetzt optimieren wir: schärfere Argumente, besseres Timing, Simulation unter Druck.',
    },
  },

  // ─────────────────────────────────────────────
  // MODUL 2: MARKTWERT
  // ─────────────────────────────────────────────

  '2.1': {
    id: 'b7010000-0000-0000-0000-000000000201',
    type: 'video_with_three_numbers',
    vimeoId: '1182574272',
    title: 'Was du wirklich wert bist',
    duration: '3 Min.',
    takeaways: [
      'Drei Quellen kombinieren: Stepstone, Glassdoor/Kununu, Stellenanzeigen',
      'Dein Minimum ist die absolute Untergrenze — darunter gehst du nicht',
      'Dein Ziel-Gehalt: klar über dem unteren Markt-Drittel',
      'Dein Stretch: oberes Ende der Marktspanne — möglich, wenn alles passt',
    ],
    researchSources: [
      { name: 'Stepstone Gehaltsreport', icon: '📊', tip: '1,3 Mio. Gehaltsdatenpunkte — nach Rolle, Erfahrung, Region filtern' },
      { name: 'Glassdoor / Kununu', icon: '🏢', tip: 'Firmengenaue Daten: Was zahlt DEIN Arbeitgeber für DEINE Rolle?' },
      { name: 'Aktuelle Stellenanzeigen', icon: '📋', tip: '5–10 ähnliche Stellen prüfen — viele zeigen jetzt Gehaltsspannen' },
    ],
    inputType: 'three_numbers',
  },

  '2.2': {
    id: 'b7010000-0000-0000-0000-000000000202',
    type: 'video',
    vimeoId: '1182575073',
    title: 'Wie Arbeitgeber dein Gehalt wirklich bestimmen',
    duration: '3 Min.',
    takeaways: [
      'Jedes Unternehmen hat Gehaltsbänder — HR weiß, wo du im Band stehst',
      'Budgets werden in Q4 (Sept.–Nov.) für das Folgejahr geplant',
      'Optimaler Timing: 2–3 Monate VOR Budgetplanung, also Juli–September',
      'Dein Chef braucht Argumente, die er nach oben weitertragen kann',
    ],
    chefDecoder: [
      { reaction: '"Das ist aktuell nicht drin."', meaning: 'Budget ist ausgeschöpft. Frag in Q4 nochmal — dann ist neues Budget da.' },
      { reaction: '"Wir schauen uns das nächstes Jahr an."', meaning: 'Erinnerung erwünscht. Hak aktiv nach — ohne Follow-up passiert nichts.' },
      { reaction: '"Das müsste ich absprechen."', meaning: 'Nicht abgeneigt. Gib deinem Chef Argumente, die er weiterleiten kann.' },
    ],
  },

  '2.3': {
    id: 'b7010000-0000-0000-0000-000000000203',
    type: 'video_with_impact',
    vimeoId: '1182575753',
    title: 'Dein Marktwert in 3 Faktoren',
    duration: '4 Min.',
    takeaways: [
      'Skills × Impact × Verhandlung = Marktwert — ohne Verhandlung bleibt die Rechnung bei null',
      'Umsatz oder Einsparungen in Euro sind das stärkste Argument — kein Gegenargument möglich',
      'Jeder Satz braucht mindestens eine konkrete Zahl',
      'Diese 3 Sätze sind deine Munition für Modul 3',
    ],
    factorLevels: [
      {
        level: 1,
        title: 'Einnahmen oder Einsparungen (€)',
        example: '"Ich habe Neukunden im Wert von 280.000 € gewonnen."',
        strength: 5,
      },
      {
        level: 2,
        title: 'Projektergebnisse mit Messgröße',
        example: '"Ich habe das ERP-Rollout in 4 Monaten abgeschlossen — geplant waren 6."',
        strength: 4,
      },
      {
        level: 3,
        title: 'Übernommene Verantwortung jenseits der Rolle',
        example: '"Ich habe das Onboarding-Programm aufgebaut und betreue 4 Junioren."',
        strength: 3,
      },
    ],
    inputType: 'impact_sentences',
  },

  // ─────────────────────────────────────────────
  // MODUL 3: VORBEREITUNG
  // ─────────────────────────────────────────────

  '3.1': {
    id: 'b7010000-0000-0000-0000-000000000301',
    type: 'video',
    vimeoId: '1182576145',
    title: 'Warum du ohne Vorbereitung verlierst',
    duration: '3 Min.',
    takeaways: [
      '"Vielleicht 5 Prozent mehr?" ist kein Anker — sondern eine Bitte',
      'Unvorbereitete erzielen ø 2–4 % Gehaltsplus, Vorbereitete 7–12 %',
      'Bei 54.000 € Gehalt: 3.800 € Unterschied für ein paar Stunden Vorbereitung',
      'Vorbereitung = 4 Dinge festlegen, bevor du den Raum betrittst',
    ],
    comparisonData: {
      unprepared: { label: 'Unvorbereitet', pct: '2–4 %', euro: '+1.620 €/Jahr' },
      prepared: { label: 'Vorbereitet', pct: '7–12 %', euro: '+5.400 €/Jahr' },
      note: 'Basis: 54.000 € Gehalt',
    },
  },

  '3.2': {
    id: 'b7010000-0000-0000-0000-000000000302',
    type: 'video_with_pitch',
    vimeoId: '1182576633',
    title: 'Dein persönlicher Gehalts-Pitch',
    duration: '4 Min.',
    takeaways: [
      'Formel: Forderung + Impact-Beweis + Marktwert-Referenz',
      'Die Forderung kommt zuerst — nicht am Ende, nicht als Frage',
      'Krumme Zahlen (63.500 nicht "ca. 64.000") signalisieren Recherche',
      'Nach dem Pitch: 5 Sekunden Stille. Wer zuerst redet, verliert.',
    ],
    examplePitches: [
      {
        role: 'IT-Projektleiterin',
        pitch: 'Ich möchte mein Gehalt auf 68.500 Euro anpassen. Ich habe die CRM-Migration drei Wochen vor Deadline abgeschlossen und dem Team 45.000 Euro an externen Beraterkosten gespart. Laut Stepstone liegt der Marktwert für meine Rolle zwischen 63.000 und 74.000 Euro.',
      },
      {
        role: 'Marketing Manager',
        pitch: 'Mein Zielgehalt liegt bei 56.000 Euro. Die Lead-Kampagne in Q3 hat 340 qualifizierte Leads generiert — 28 % über dem Zielwert. Der Marktwert für meine Position in Hamburg liegt bei 48.000 bis 61.000 Euro.',
      },
      {
        role: 'Vertriebsmitarbeiter',
        pitch: 'Ich schlage eine Anpassung auf 53.500 Euro vor. Ich habe dieses Jahr 18 Neukunden gewonnen und meinen Umsatzanteil um 22 % gesteigert. Vergleichbare Positionen liegen bei 50.000 bis 58.000 Euro.',
      },
    ],
    inputType: 'pitch_builder',
  },

  '3.3': {
    id: 'b7010000-0000-0000-0000-000000000303',
    type: 'video_with_arguments',
    vimeoId: '1182578575',
    title: 'Deine stärksten Argumente',
    duration: '4 Min.',
    takeaways: [
      'Inflation, Fleiß, Loyalität — diese 5 Argumente wirken nie',
      'Jedes Argument braucht mindestens eine Zahl',
      'Die "So-what?"-Probe: Was hat es dem Unternehmen gebracht?',
      'Maximal 3 Argumente — mehr verwässert die Wirkung',
    ],
    weakArguments: [
      'Alles ist teurer geworden (Inflation)',
      'Ich arbeite so viel (Stunden ≠ Ergebnisse)',
      'Andere verdienen auch mehr (Neid-Argument)',
      'Ich brauche das Geld (privat ≠ Geschäft)',
      'Ich bin seit X Jahren loyal (Loyalität generiert keinen Umsatz)',
    ],
    soWhatExamples: [
      {
        weak: 'Ich habe den Prozess optimiert.',
        strong: 'Ich habe den Onboarding-Prozess von 8 auf 4 Wochen verkürzt — spart pro Neueinstellung ca. 3.000 Euro.',
      },
      {
        weak: 'Ich habe neue Kunden gewonnen.',
        strong: 'Ich habe 18 Neukunden gewonnen — Umsatzanteil um 22 % gesteigert.',
      },
    ],
    inputType: 'arguments_builder',
  },

  '3.4': {
    id: 'b7010000-0000-0000-0000-000000000304',
    type: 'video_with_strategy',
    vimeoId: '1182579186',
    title: 'Deine Strategie festlegen',
    duration: '4 Min.',
    takeaways: [
      'Offensiv: Du nennst zuerst eine Zahl und setzt den Anker',
      'Defensiv: Du lässt erst ein Angebot kommen, dann konterst du',
      'Ohne BATNA bist du in der schwachen Position — nur Ja oder Nichts',
      'Gehaltserhöhung scheitert? 5 Alternativen im Hintergrund bereit haben',
    ],
    strategies: {
      offensive: {
        label: 'Offensiv',
        description: 'Du nennst zuerst deine Zahl. Du setzt den Anker und bestimmst den Verhandlungsrahmen.',
        when: 'Wenn du Marktdaten + 3 Argumente + (idealerweise) eine Alternative hast.',
        script: '"Ich möchte heute über meine Vergütung sprechen. Mein Ziel liegt bei [Ziel €]. Hier ist, warum." → Pitch → Stille.',
      },
      defensive: {
        label: 'Defensiv',
        description: 'Du lässt deinen Chef zuerst ein Angebot machen — dann konterst du mit Daten.',
        when: 'Wenn du unsicher über den Verhandlungsspielraum bist oder neu in der Rolle.',
        script: '"Ich würde gern über meine Vergütung sprechen. Wie sehen Sie meinen aktuellen Stand im Vergleich zum Markt?"',
      },
    },
    batnaOptions: [
      '2–3 zusätzliche Remote-Tage (spart Pendelzeit und -kosten)',
      'Weiterbildungsbudget 2.000–5.000 € (oft anderes Budget-Topf)',
      'Titel-Upgrade (erhöht Marktwert für die nächste Verhandlung)',
      'Jahresbonus an konkrete Ziele geknüpft',
      'Zusätzliche Urlaubstage',
    ],
    inputType: 'strategy_picker',
  },

  // ─────────────────────────────────────────────
  // MODUL 4: VERHANDLUNG
  // ─────────────────────────────────────────────

  '4.1': {
    id: 'b7010000-0000-0000-0000-000000000401',
    type: 'video',
    vimeoId: '1182579689',
    title: 'So startest du das Gespräch richtig',
    duration: '3 Min.',
    takeaways: [
      'Eröffnungssatz: "Ich möchte heute über meine Vergütung sprechen." — direkt, klar, kein Konjunktiv',
      'Die ersten 60 Sekunden entscheiden über den Ton des gesamten Gesprächs',
      'Sitz aufrecht, Augenkontakt, ruhige Stimme — Unsicherheit kostet Geld',
      'Nach dem Pitch: keine Entschuldigungen, kein Relativieren — jetzt ist der Chef dran',
    ],
    openingScript: {
      bad: '"Also, ähm, ich wollte mal fragen, ob vielleicht — wenn Sie Zeit haben — wir mal über mein Gehalt reden könnten?"',
      good: '"Vielen Dank für den Termin. Ich möchte heute über meine Vergütung sprechen."',
    },
    timing: [
      { icon: '✅', text: 'Gebuchter 30-Min.-Termin, morgens, nach einem Erfolg' },
      { icon: '❌', text: 'Im Flur, nach stressigem Meeting, Freitagnachmittag' },
    ],
  },

  '4.2': {
    id: 'b7010000-0000-0000-0000-000000000402',
    type: 'video',
    vimeoId: '1182581460',
    title: 'Die häufigsten Arbeitgeber-Reaktionen',
    duration: '4 Min.',
    takeaways: [
      'Reaktion 1 — "Nicht drin": Nie kapitulieren, immer nächsten Schritt vereinbaren',
      'Reaktion 2 — Gegenangebot: Nie sofort annehmen, immer kontern',
      'Reaktion 3 — "Warum mehr?": Das ist eine Einladung, kein Angriff — nutze deinen Pitch',
      'Reaktion 4 — Schweigen: Halte durch. Wer zuerst redet, verliert.',
    ],
    reactions: [
      {
        trigger: '"Das ist aktuell nicht drin."',
        trap: 'Sofort nachgeben: "Okay, verstehe. Dann vielleicht nächstes Jahr."',
        answer: '"Ich verstehe. Können wir einen konkreten Zeitpunkt festlegen? Und welche Kriterien müsste ich erfüllen?"',
      },
      {
        trigger: '"Wir können dir 3 % anbieten."',
        trap: 'Dankbar "Ja, super!" sagen — und 3.800 € Potenzial liegen lassen.',
        answer: '"Danke für das Angebot. Mein Ziel lag bei [X €]. Können wir uns in der Mitte treffen?"',
      },
      {
        trigger: '"Warum denkst du, dass du mehr verdienen solltest?"',
        trap: 'Sich angegriffen fühlen und defensiv werden.',
        answer: 'Das ist deine Einladung. Deploy deinen Pitch + 3 Argumente.',
      },
      {
        trigger: 'Stille nach deiner Zahl.',
        trap: 'Die Stille füllen: "Aber wenn das zu viel ist, können wir auch weniger…"',
        answer: 'Stille halten. Leicht lächeln. Warten. In 90 % kommt dann ein Angebot.',
      },
      {
        trigger: '"Ich muss das absprechen."',
        trap: 'Passiv warten: "Alles klar, ich warte dann."',
        answer: '"Soll ich Ihnen eine kurze Zusammenfassung per Mail schicken, damit Sie sie intern weiterleiten können?"',
      },
    ],
  },

  '4.3': {
    id: 'b7010000-0000-0000-0000-000000000403',
    type: 'simulation',
    vimeoId: '1182582736',
    simulationKey: 'nicht_drin',
    title: 'Simulation: "Das ist aktuell nicht drin"',
    duration: '5 Min.',
    maxScore: 9,
    ratingLabels: { 0: 'Anfänger', 4: 'Verhandler', 7: 'Profi' },
    endMessage: 'Die wichtigste Regel: Nie ein Gespräch ohne nächsten Schritt beenden.',
  },

  '4.4': {
    id: 'b7010000-0000-0000-0000-000000000404',
    type: 'simulation',
    simulationKey: 'fuenf_prozent',
    title: 'Simulation: "Wir können dir 5 % anbieten"',
    duration: '5 Min.',
    maxScore: 12,
    ratingLabels: { 0: 'Anfänger', 5: 'Verhandler', 9: 'Profi' },
    endMessage: 'Nimm nie das erste Angebot an. Jedes Angebot ist ein Startpunkt, kein Endpunkt.',
  },

  '4.5': {
    id: 'b7010000-0000-0000-0000-000000000405',
    type: 'simulation',
    simulationKey: 'warum_mehr',
    title: 'Simulation: "Warum denkst du, dass du mehr wert bist?"',
    duration: '6 Min.',
    maxScore: 16,
    ratingLabels: { 0: 'Anfänger', 5: 'Verhandler', 10: 'Profi', 14: 'Meister' },
    endMessage: 'Wenn dein Chef fragt "Warum mehr?" — sagt er: Überzeug mich. Genau das hast du geübt.',
  },

  // ─────────────────────────────────────────────
  // MODUL 5: ABSCHLUSS
  // ─────────────────────────────────────────────

  '5.1': {
    id: 'b7010000-0000-0000-0000-000000000501',
    type: 'video_with_template',
    vimeoId: '1182583192',
    title: 'So schließt du die Verhandlung ab',
    duration: '3 Min.',
    takeaways: [
      'Noch vor dem Aufstehen: "Zur Bestätigung — wir haben uns auf [X €] ab [Datum] geeinigt. Stimmt das so?"',
      'Bestätigungs-E-Mail am selben Tag, innerhalb von 2 Stunden',
      'Nie zu emotional reagieren — "Ich freue mich auf die Zusammenarbeit." Punkt.',
      'Zwei Fragen vor dem Aufstehen: Ab wann gilt es? Brauchen Sie noch etwas von mir?',
    ],
    closingMistakes: [
      { mistake: 'Kein schriftlicher Nachweis', risk: 'Chef vergisst, HR hat andere Zahlen, Gehaltserhöhung startet "nächstes Quartal"' },
      { mistake: 'Kein mündliches Summary', risk: 'Chef kann sich später anders erinnern' },
      { mistake: 'Zu emotionale Reaktion', risk: '"Das hätte ich nie erwartet!" signalisiert: Ich habe mehr bekommen als verdient.' },
    ],
    emailTemplate: `Betreff: Bestätigung unseres heutigen Gesprächs

Liebe/r [Name],

vielen Dank für das offene Gespräch heute.

Zur Bestätigung: Wir haben uns auf eine Anpassung meines Gehalts auf [BETRAG] Euro brutto pro Jahr ab dem [DATUM] geeinigt.

Ich freue mich auf die weitere Zusammenarbeit.

Mit freundlichen Grüßen
[Dein Name]`,
  },

  '5.2': {
    id: 'b7010000-0000-0000-0000-000000000502',
    type: 'video_with_final',
    vimeoId: '1182583525',
    title: 'Wenn sie Nein sagen — Dein Plan B',
    duration: '3 Min.',
    takeaways: [
      '"Nein" bedeutet fast nie "Nie" — es gibt 3 Varianten, finde heraus welche es ist',
      'Frage nach konkreten Kriterien und einem Folgetermin — ohne Datum ist ein Nein permanent',
      'Wenn Gehalt scheitert: 5 Alternativen verhandeln (Remote, Budget, Titel, Bonus, Urlaub)',
      'Wer 2× in 18 Monaten abgelehnt wurde, ohne Timeline — der strategische Zug ist der Wechsel',
    ],
    noVariants: [
      { type: '"Nicht jetzt."', action: 'Konkreten Zeitpunkt + Kriterien vereinbaren' },
      { type: '"Nicht so viel."', action: 'Kompromiss oder Alternativen verhandeln' },
      { type: '"Nicht in dieser Form."', action: 'Gesamtvergütung statt Gehalt besprechen' },
    ],
    threeQuestions: [
      '"Was müsste sich ändern, damit eine Anpassung möglich wird?"',
      '"Können wir einen konkreten Zeitpunkt für ein erneutes Gespräch festlegen?"',
      '"Gibt es andere Möglichkeiten, meine Gesamtvergütung zu verbessern?"',
    ],
    marketSwitchFact: 'Laut Stepstone holen Männer beim Wechsel ~10 %, Frauen ~5 %. Das ist oft mehr als 3 Jahre interner Verhandlung.',
    inputType: 'final_assessment',
  },
};

// ─────────────────────────────────────────────
// SIMULATION CONFIGS
// ─────────────────────────────────────────────

export const SIMULATION_CONFIGS = {
  nicht_drin: {
    title: '"Das ist aktuell nicht drin."',
    context: 'Du hast deinen Pitch geliefert. Dein Chef hört zu — und sagt dann:',
    rounds: [
      {
        boss: '"Das Budget ist für dieses Jahr leider schon ausgeschöpft."',
        options: [
          {
            text: 'Okay, verstehe. Dann vielleicht nächstes Jahr.',
            points: 0,
            feedback: 'Das ist das häufigste Fehler. Du gibst sofort auf — ohne einen nächsten Schritt. Das Gespräch ist damit tot.',
            quality: 'weak',
          },
          {
            text: 'Können wir einen konkreten Zeitpunkt festlegen, wann wir das erneut besprechen?',
            points: 2,
            feedback: 'Gut! Du kapitulierst nicht und verlangst ein Commitment. Aber du könntest noch konkreter werden.',
            quality: 'good',
          },
          {
            text: 'Ich verstehe die Budgetsituation. Welche Kriterien müsste ich erfüllen, damit eine Anpassung beim nächsten Budgetzyklus möglich wird?',
            points: 3,
            feedback: 'Perfekt. Du akzeptierst das Nein, aber verwandelst es sofort in einen Fahrplan. Dein Chef muss jetzt konkret werden.',
            quality: 'strong',
          },
        ],
      },
      {
        boss: '"Du müsstest mehr Verantwortung zeigen. Das sehe ich noch nicht so deutlich."',
        options: [
          {
            text: 'Okay, dann werde ich mich mehr anstrengen.',
            points: 0,
            feedback: 'Du gibst die Kontrolle komplett ab — ohne Gegenfrage. Jetzt entscheidet dein Chef alleine, was "mehr Verantwortung" bedeutet.',
            quality: 'weak',
          },
          {
            text: 'Können Sie mir konkret sagen, welche Verantwortung Sie meinen?',
            points: 2,
            feedback: 'Gut! Du fragst nach Klarheit statt einfach zu nicken. Das ist erwachsenes Verhandeln.',
            quality: 'good',
          },
          {
            text: 'In den letzten 12 Monaten habe ich bereits [Impact] übernommen. Können wir gemeinsam definieren, welche zusätzlichen Kriterien es für eine Gehaltsanpassung braucht?',
            points: 3,
            feedback: 'Stark. Du verteidigst deinen bisherigen Beitrag und bittest gleichzeitig um einen messbaren Fahrplan.',
            quality: 'strong',
          },
        ],
      },
      {
        boss: '"Ich werde mal schauen. Ich melde mich bei dir."',
        options: [
          {
            text: 'Super, danke! Ich freue mich auf deine Rückmeldung.',
            points: 0,
            feedback: 'Klassischer Fehler. "Ich melde mich" ohne Datum = Gespräch vergessen in 2 Wochen. Du brauchst ein konkretes Commitment.',
            quality: 'weak',
          },
          {
            text: 'Bis wann kann ich mit einer Rückmeldung rechnen?',
            points: 2,
            feedback: 'Gut! Du sorgst für ein zeitliches Commitment. Ohne Datum passiert nichts.',
            quality: 'good',
          },
          {
            text: 'Soll ich Ihnen eine kurze Zusammenfassung per Mail schicken? Und könnten wir in zwei Wochen kurz sprechen — sagen wir am [Datum]?',
            points: 3,
            feedback: 'Perfekt. Mail = schriftliche Argumente für interne Weitergabe. Datum = verbindliches Commitment. Du verlässt das Gespräch mit einem echten nächsten Schritt.',
            quality: 'strong',
          },
        ],
      },
    ],
  },

  fuenf_prozent: {
    title: '"Wir können dir 5 % anbieten."',
    context: 'Du verdienst 52.000 €. Dein Ziel: 58.000 €. Dein Chef macht ein erstes Angebot:',
    rounds: [
      {
        boss: '"Ich habe mit HR gesprochen. Wir können dir 5 % anbieten — das wären 54.600 Euro."',
        options: [
          {
            text: 'Oh, danke! Damit bin ich sehr zufrieden.',
            points: 0,
            feedback: 'Du lässt 3.400 € pro Jahr auf dem Tisch liegen — und signalisierst, dass das erste Angebot immer genug ist. Beim nächsten Gespräch wird dein Chef es wieder so versuchen.',
            quality: 'weak',
          },
          {
            text: 'Mein Ziel lag allerdings bei 58.000 Euro. Können wir uns in der Mitte treffen?',
            points: 3,
            feedback: 'Sehr gut. Du lehnst höflich ab, nennst deinen Anker und schlägst einen Kompromiss vor. Das ist professionelles Verhandeln.',
            quality: 'good',
          },
          {
            text: 'Ich freue mich, dass eine Erhöhung möglich ist. Laut Stepstone liegt der Marktwert für meine Rolle bei 55.000–63.000 €. Mein Ziel war 58.000 — basierend auf [Impact]. Können wir darüber sprechen?',
            points: 4,
            feedback: 'Exzellent. Du bedankst dich, re-anchored mit Marktdaten, nennst Impact und bleibst beim Ziel. Stärkstmögliche Antwort.',
            quality: 'strong',
          },
        ],
      },
      {
        boss: '"58.000 ist schwierig. Aber 56.000 könnte ich hinbekommen."',
        options: [
          {
            text: 'Okay, 56.000 ist gut. Danke!',
            points: 0,
            feedback: 'Knapp daneben. Du akzeptierst 2.000 € weniger als dein Ziel, ohne die Alternativen zu nutzen die oft im selben Budgettopf liegen.',
            quality: 'weak',
          },
          {
            text: '56.000 klingt fair. Können wir zusätzlich über ein Weiterbildungsbudget oder Remote-Tage sprechen?',
            points: 3,
            feedback: 'Sehr gut. Du nimmst das Angebot an und erweiterst gleichzeitig die Verhandlung auf Gesamtvergütung.',
            quality: 'good',
          },
          {
            text: '56.500 wäre für mich der richtige Wert. Und könnten wir zusätzlich 3.000 Euro Weiterbildungsbudget besprechen? Das würde [Skill] ausbauen — wovon auch das Team profitiert.',
            points: 4,
            feedback: 'Perfekt. Präzise Zahl, Kompromissbereitschaft und ein zweites Verhandlungsziel — framed als Gewinn für das Unternehmen.',
            quality: 'strong',
          },
        ],
      },
      {
        boss: '"Gut. 56.500 plus 3.000 Euro Weiterbildungsbudget — das können wir machen."',
        options: [
          {
            text: 'Oh mein Gott, vielen vielen Dank! Das hätte ich nie erwartet!',
            points: 0,
            feedback: 'Emotional verständlich, aber strategisch suboptimal. Dein Chef denkt jetzt: "Ich hätte weniger anbieten können." Beim nächsten Gespräch erinnert er sich daran.',
            quality: 'weak',
          },
          {
            text: 'Ja, das klingt gut. Vielen Dank.',
            points: 2,
            feedback: 'Solide und professionell. Du nimmst es an ohne übertrieben dankbar zu wirken.',
            quality: 'good',
          },
          {
            text: 'Sehr gut. Können wir das kurz schriftlich festhalten? Und ab wann gilt die neue Vergütung?',
            points: 4,
            feedback: 'Perfekt. Professionell, ohne Sentimentalität — und du sicherst sofort die Schriftlichkeit und das Datum. So schließt ein Profi ab.',
            quality: 'strong',
          },
        ],
      },
    ],
  },

  warum_mehr: {
    title: '"Warum denkst du, dass du mehr verdienen solltest?"',
    context: 'Du hast deinen Anker gesetzt. Dein Chef lehnt sich zurück und fragt:',
    rounds: [
      {
        boss: '"Warum denkst du denn, dass du mehr verdienen solltest?"',
        options: [
          {
            text: 'Ich bin schon seit 3 Jahren hier und mache gute Arbeit.',
            points: 0,
            feedback: 'Keine Zahl, kein Ergebnis, keine Marktdaten. Dauer und Fleiß sind keine Verhandlungsargumente — sie erklären nicht, warum du mehr WERT bist.',
            quality: 'weak',
          },
          {
            text: 'Ich habe in den letzten 12 Monaten [Impact] erreicht, und der Marktwert für meine Rolle liegt laut Stepstone bei [Range].',
            points: 3,
            feedback: 'Sehr gut. Impact + Marktdaten = solide Antwort. Du hast alles Nötige dabei.',
            quality: 'good',
          },
          {
            text: 'In den letzten 12 Monaten habe ich [stärkster Impact]. Zusätzlich habe ich [zweiter Impact] übernommen. Der Marktwert liegt bei [Range]. Mein Ziel von [Ziel €] liegt im oberen Drittel dieser Spanne — was ich für angemessen halte angesichts der Ergebnisse.',
            points: 4,
            feedback: 'Exzellent. Zwei Impact-Argumente, Marktdaten, und eine selbstbewusste Positionierung ohne Entschuldigung.',
            quality: 'strong',
          },
        ],
      },
      {
        boss: '"Das gehört doch eigentlich zu deiner normalen Arbeit, oder?"',
        options: [
          {
            text: 'Naja, stimmt schon. Aber ich finde trotzdem, dass ich mehr verdienen sollte.',
            points: 0,
            feedback: 'Du gibst das Argument preis, ohne zu kämpfen. Dein Chef hat jetzt die Oberhand.',
            quality: 'weak',
          },
          {
            text: 'Welche konkreten Tätigkeiten meinen Sie? Damit ich direkt darauf eingehen kann.',
            points: 2,
            feedback: 'Gut. Du fragst nach, statt zu kapitulieren — das verschafft dir Zeit und zwingt deinen Chef zu Konkretheit.',
            quality: 'good',
          },
          {
            text: 'Die Grundaufgaben erfülle ich — und die Ergebnisse: [Zahl]. Darüber hinaus habe ich [Mehrverantwortung] übernommen. Mein Beitrag geht über die aktuelle Rolle hinaus.',
            points: 4,
            feedback: 'Perfekt. Du bestätigst die Basis, fügst Zahlen hinzu und betonst die Mehrverantwortung. Reframe statt Kapitulation.',
            quality: 'strong',
          },
        ],
      },
      {
        boss: '"Dein Kollege macht ähnliche Arbeit und verdient dasselbe. Warum ausgerechnet du?"',
        options: [
          {
            text: 'Ich finde einfach, ich verdiene mehr. Das ist meine persönliche Einschätzung.',
            points: 0,
            feedback: 'Keine Substanz. "Ich finde" ist kein Argument — es ist eine Meinung ohne Belege.',
            quality: 'weak',
          },
          {
            text: 'Ich kann die Situation meines Kollegen nicht beurteilen — ich spreche über meinen eigenen Beitrag.',
            points: 2,
            feedback: 'Gut. Du vermeidest den Vergleich elegant. Jetzt fehlt noch ein starkes eigenes Argument.',
            quality: 'good',
          },
          {
            text: 'Ich kann die Situation meines Kollegen nicht beurteilen. Was ich beurteilen kann, sind meine Ergebnisse: [drittes Argument]. Mein Marktwert liegt bei [Range] — mein Ziel von [Ziel €] ist dadurch begründet.',
            points: 4,
            feedback: 'Stark. Du lehnst den Vergleich ab, bringst ein neues Argument und re-anchored mit Marktdaten. Das ist Meister-Level.',
            quality: 'strong',
          },
        ],
      },
      {
        boss: '"Lass mich das kurz intern besprechen. Ich melde mich bei dir."',
        options: [
          {
            text: 'Alles klar, dann warte ich einfach mal ab.',
            points: 0,
            feedback: '"Ich warte ab" = kein Follow-up = Gespräch versandet. Ohne konkreten nächsten Schritt passiert nichts.',
            quality: 'weak',
          },
          {
            text: 'Bis wann kann ich mit einer Rückmeldung rechnen?',
            points: 2,
            feedback: 'Gut. Du sorgst für ein zeitliches Commitment. Aber du könntest noch aktiver sein.',
            quality: 'good',
          },
          {
            text: 'Sehr gerne. Soll ich Ihnen eine kurze Zusammenfassung meiner Punkte per Mail schicken, damit Sie sie intern weiterleiten können? Und könnten wir in zwei Wochen kurz sprechen?',
            points: 4,
            feedback: 'Perfekt. Mail = schriftliche Argumente für die interne Runde. Terminvorschlag = verbindliches Commitment. Du verlässt das Gespräch als Profi.',
            quality: 'strong',
          },
        ],
      },
    ],
  },
};

// ─────────────────────────────────────────────
// QUIZ QUESTIONS
// ─────────────────────────────────────────────

export const QUIZ_GEHALT = [
  {
    question: 'Was ist der wichtigste erste Satz in einem Gehaltsgespräch?',
    options: [
      '"Ich wollte mal fragen, ob vielleicht..."',
      '"Ich möchte heute über meine Vergütung sprechen."',
      '"Ich glaube, ich verdiene zu wenig."',
      '"Können wir kurz über Gehalt reden?"',
    ],
    correct: 1,
    explanation: 'Direkt, klar, kein Konjunktiv. Du setzt sofort den Rahmen.',
  },
  {
    question: 'Was plant HR typischerweise als Verhandlungsspielraum pro Stelle ein?',
    options: ['0–500 €/Jahr', '500–1.000 €/Jahr', '1.000–5.000 €/Jahr', '5.000–10.000 €/Jahr'],
    correct: 2,
    explanation: 'Dieses Budget wartet auf jemanden, der fragt. Wer nicht fragt, landet automatisch am unteren Ende.',
  },
  {
    question: 'Wann ist der beste Zeitpunkt für eine Gehaltsverhandlung?',
    options: [
      'Im Januar, zum Jahresstart',
      'Juli–September, vor der Budgetplanung',
      'Nach der Leistungsbeurteilung im Dezember',
      'Immer wenn du das Gefühl hast',
    ],
    correct: 1,
    explanation: 'Budgets werden in Q4 geplant. 2–3 Monate vorher bist du noch im Entscheidungsprozess.',
  },
  {
    question: 'Welches Argument wirkt in einem Gehaltsgespräch am stärksten?',
    options: [
      '"Ich bin seit 4 Jahren loyal."',
      '"Alles ist teurer geworden."',
      '"Ich habe den Umsatz um 22 % gesteigert."',
      '"Andere in meiner Branche verdienen mehr."',
    ],
    correct: 2,
    explanation: 'Konkrete Zahlen und Ergebnisse sind das einzige wirkliche Argument. Alles andere ist austauschbar.',
  },
  {
    question: 'Was bedeutet "Ankerprinzip" in einer Verhandlung?',
    options: [
      'Auf einem Standpunkt beharren',
      'Wer zuerst eine Zahl nennt, setzt den Verhandlungsrahmen',
      'Sein Angebot schriftlich festhalten',
      'Mehrere Argumente gleichzeitig einbringen',
    ],
    correct: 1,
    explanation: 'Studien zeigen: Das Ergebnis liegt typischerweise näher am ersten genannten Wert. Wer den Anker setzt, hat die Kontrolle.',
  },
];
