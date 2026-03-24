// ============================================================================
// Prioritätenmanagement E-Learning — Complete Content Data
// ============================================================================

// ---------------------------------------------------------------------------
// 1. SELBSTDIAGNOSE — 10 Fragen, Scoring 1-5, 3 Ergebnis-Stufen
// ---------------------------------------------------------------------------
export const SELBSTDIAGNOSE = {
  titel: 'Selbstdiagnose: Wie gut managst du deine Prioritäten?',
  beschreibung:
    'Beantworte die folgenden 10 Fragen ehrlich. Es gibt keine richtigen oder falschen Antworten — nur dein persönlicher Ist-Zustand.',
  skala: { min: 1, max: 5, labels: ['Trifft gar nicht zu', 'Trifft selten zu', 'Teils-teils', 'Trifft oft zu', 'Trifft voll zu'] },
  fragen: [
    { id: 1, text: 'Ich weiß jeden Morgen genau, was meine wichtigste Aufgabe des Tages ist.', kategorie: 'klarheit' },
    { id: 2, text: 'Ich schaffe es, mindestens 2 Stunden am Tag ohne Unterbrechungen zu arbeiten.', kategorie: 'fokus' },
    { id: 3, text: 'Ich sage Nein zu Aufgaben, die nicht zu meinen Zielen passen.', kategorie: 'grenzen' },
    { id: 4, text: 'Ich plane meine Woche im Voraus und halte mich größtenteils an den Plan.', kategorie: 'planung' },
    { id: 5, text: 'Am Ende des Tages habe ich das Gefühl, das Richtige geschafft zu haben.', kategorie: 'zufriedenheit' },
    { id: 6, text: 'Ich delegiere Aufgaben, die andere besser oder schneller erledigen können.', kategorie: 'delegation' },
    { id: 7, text: 'Ich habe ein festes System, um Aufgaben zu erfassen und zu priorisieren.', kategorie: 'system' },
    { id: 8, text: 'Ich unterscheide bewusst zwischen dringenden und wichtigen Aufgaben.', kategorie: 'strategie' },
    { id: 9, text: 'Ich verbringe weniger als 30 Minuten pro Tag mit E-Mail-Sortierung.', kategorie: 'fokus' },
    { id: 10, text: 'Ich kenne meine drei wichtigsten beruflichen Ziele für dieses Quartal.', kategorie: 'klarheit' },
  ],
  ergebnisse: [
    {
      id: 'chaos',
      range: [10, 20],
      titel: 'Chaos-Modus',
      beschreibung:
        'Dein Tag wird von anderen bestimmt. Du reagierst statt zu agieren. Das ist kein Vorwurf — die meisten starten hier. Dieser Kurs wird dir konkrete Werkzeuge geben, um Schritt für Schritt die Kontrolle zurückzugewinnen.',
      empfehlung: 'Starte mit Modul 1 und arbeite dich Schritt für Schritt durch. Besonders Modul 3 (Eisenhower-Matrix) und Modul 5 (Deep Work) werden dir sofort helfen.',
    },
    {
      id: 'reaktiv',
      range: [21, 35],
      titel: 'Reaktiv-Modus',
      beschreibung:
        'Du hast bereits ein Gespür für Prioritäten, aber im Alltag gewinnst du nicht immer. Ablenkungen und "dringende" Anfragen werfen dich regelmäßig aus der Bahn.',
      empfehlung: 'Fokussiere dich auf die Module 4 (Nein-Sagen), 5 (Deep Work) und 6 (Delegation). Hier liegt dein größtes Hebelpotenzial.',
    },
    {
      id: 'proaktiv',
      range: [36, 50],
      titel: 'Proaktiv-Modus',
      beschreibung:
        'Du managst deine Prioritäten bereits gut. Dieser Kurs wird dir helfen, die letzten 20 % herauszuholen und dein System zu verfeinern.',
      empfehlung: 'Springe direkt zu den Modulen, die dich am meisten interessieren. Modul 7 (Stakeholder) und Modul 8 (System-Design) bringen dir den meisten Mehrwert.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 2. BERUFSPHASE — Karrierephase-Selektor
// ---------------------------------------------------------------------------
export const BERUFSPHASE = {
  titel: 'In welcher Berufsphase befindest du dich?',
  beschreibung: 'Wähle die Phase, die am besten zu dir passt. Wir passen die Beispiele und Szenarien im Kurs entsprechend an.',
  optionen: [
    {
      id: 'studierende',
      label: 'Studierende',
      icon: '🎓',
      beschreibung: 'Du steckst mitten im Studium oder in der Ausbildung und jonglierst Vorlesungen, Prüfungen und vielleicht einen Nebenjob.',
      schwerpunkte: ['Lernplan-Priorisierung', 'Prokrastination überwinden', 'Prüfungsvorbereitung strukturieren'],
    },
    {
      id: 'berufseinsteiger',
      label: 'Berufseinsteiger (0–3 Jahre)',
      icon: '🚀',
      beschreibung: 'Du bist neu im Job und findest heraus, wie du dich in der Arbeitswelt zurechtfindest.',
      schwerpunkte: ['Erwartungen managen', 'Erste Grenzen setzen', 'Sichtbarkeit durch Prioritäten gewinnen'],
    },
    {
      id: 'berufserfahren',
      label: 'Berufserfahren (3–10 Jahre)',
      icon: '💼',
      beschreibung: 'Du bist erfahren, hast aber das Gefühl, dass die Arbeit nicht weniger, sondern mehr wird.',
      schwerpunkte: ['Strategische Priorisierung', 'Deep Work etablieren', 'Delegation lernen'],
    },
    {
      id: 'fuehrungskraft',
      label: 'Führungskraft / Executive',
      icon: '👑',
      beschreibung: 'Du trägst Verantwortung für ein Team und musst nicht nur deine eigenen, sondern auch die Prioritäten anderer managen.',
      schwerpunkte: ['Team-Prioritäten setzen', 'Stakeholder-Management', 'Systemisches Priorisieren'],
    },
  ],
};

// ---------------------------------------------------------------------------
// 3. STORIES — Emotionale Geschichten für Module
// ---------------------------------------------------------------------------
export const STORIES = {
  modul_1: {
    titel: 'Der verpasste Anruf',
    protagonist: { name: 'Anna', alter: 34, rolle: 'Projektleiterin' },
    inhalt: `Anna starrt auf ihr Handy. Drei verpasste Anrufe von ihrer Mutter. Es ist 21:47 Uhr.

Sie war den ganzen Tag im Büro. Hat 43 E-Mails beantwortet, an zwei Meetings teilgenommen, einem Kollegen bei einer Excel-Tabelle geholfen, den Drucker repariert und eine Präsentation überarbeitet, die erst nächste Woche fällig ist.

Was sie NICHT getan hat: Den Projektplan für den wichtigsten Kunden aktualisieren — die Aufgabe, die sie seit drei Tagen vor sich herschiebt. Und ihre Mutter zurückrufen, die nur fragen wollte, ob sie am Samstag zum Geburtstag kommt.

Anna war den ganzen Tag beschäftigt. Aber war sie produktiv?

Sie hatte das Gefühl, keine Minute stillgestanden zu haben. Und trotzdem liegt das Wichtigste — beruflich wie privat — immer noch unerledigt auf dem Stapel.

Genau das ist die Falle: Wir verwechseln Aktivität mit Wirksamkeit. Wir verwechseln "viel tun" mit "das Richtige tun".

Anna ist kein Einzelfall. Sie ist die Regel. Und genau deshalb bist du hier.`,
    reflexionsfrage: 'Erkennst du dich in Anna wieder? Wann hast du das letzte Mal einen ganzen Tag "gearbeitet" — aber das Wichtigste nicht geschafft?',
  },

  modul_6: {
    titel: 'Der unsichtbare Held',
    protagonist: { name: 'Tobias', alter: 38, rolle: 'Senior Developer' },
    inhalt: `Tobias sitzt in der Jahresendreview und versteht die Welt nicht mehr.

"Solide Leistung, aber wir sehen zu wenig strategische Initiative", sagt sein Chef.

Tobias hat in den letzten 12 Monaten 347 Tickets geschlossen. Er hat drei Mal die Produktion gerettet, als niemand anderes wusste, wie. Er hat zwei Junioren eingearbeitet und war bei jedem Sprint Review dabei.

Aber die Beförderung geht an Lena. Lena, die halb so viele Tickets geschlossen hat. Lena, die aber das Architektur-Konzept für die neue Plattform geschrieben hat. Lena, die auf der letzten Konferenz einen Vortrag gehalten hat. Lena, die dreimal "Nein" zu Support-Tickets gesagt hat, um am Strategiepapier zu arbeiten.

Tobias hat die falschen Dinge priorisiert. Nicht weil er faul war — im Gegenteil. Er hat ALLES gemacht. Aber "alles" ist das Gegenteil von Priorität.

Er war der unsichtbare Held: Immer da, immer hilfsbereit, immer beschäftigt. Aber nie an den Dingen, die seine Karriere voranbringen.

Tobias muss lernen, dass Prioritätenmanagement kein Produktivitäts-Hack ist. Es ist Karriere-Strategie.`,
    reflexionsfrage: 'Welche Aufgaben in deinem Alltag fühlen sich produktiv an, bringen dich aber eigentlich nicht weiter?',
  },
};

// ---------------------------------------------------------------------------
// 4. BOSS_FIGHTS
// ---------------------------------------------------------------------------
export const BOSS_FIGHTS = {
  cypher: {
    id: 'cypher',
    name: 'Cypher, der Aufmerksamkeits-Dieb',
    beschreibung:
      'Cypher lebt von deinen Impulsen. Jede Benachrichtigung, jeder Tab, jeder "nur kurz gucken"-Moment macht ihn stärker. Besiege ihn, indem du deinen Fokus verteidigst.',
    user_stat: { label: 'Fokus-Schild', max: 100, start: 100 },
    boss_stat: { label: 'Ablenkungskraft', max: 100, start: 100 },
    waves: [
      {
        id: 1,
        titel: 'Das Rote Ausrufezeichen',
        boss_sagt: 'Jemand hat dein Foto kommentiert! Schau schnell nach!',
        optionen: [
          { text: 'Nur 5 Sek gucken', user_damage: -30, boss_damage: 0, feedback: 'Es gibt kein "nur 5 Sekunden". Studien zeigen, dass jede Unterbrechung bis zu 23 Minuten Refokussierungszeit kostet.' },
          { text: 'Flugmodus aktivieren', user_damage: 0, boss_damage: 25, feedback: 'Gute Wahl! Flugmodus ist ein solider Schutzschild. Aber Cypher kennt noch andere Wege…' },
          { text: 'Handy in die Schublade', user_damage: 0, boss_damage: 35, feedback: 'Perfekt! Aus den Augen, aus dem Sinn. Physische Distanz ist die effektivste Waffe gegen Cypher.' },
        ],
      },
      {
        id: 2,
        titel: 'Die Informations-Angst',
        boss_sagt: 'Breaking News! Du MUSST informiert bleiben!',
        optionen: [
          { text: 'Tab öffnen und lesen', user_damage: -40, boss_damage: 0, feedback: 'FOMO ist Cyphers Lieblingswaffe. Die Wahrheit: 95 % aller "Breaking News" sind in 24 Stunden irrelevant.' },
          { text: 'Lese ich heute Abend', user_damage: 0, boss_damage: 20, feedback: 'Gut — du verschiebst den Konsum auf eine geplante Zeit. Impuls-Tresor-Technik in Aktion!' },
          { text: 'Deep Work Playlist starten', user_damage: 0, boss_damage: 30, feedback: 'Exzellent! Du ersetzt den Stimulus durch einen produktiven Trigger. Dein Fokus wird stärker.' },
        ],
      },
      {
        id: 3,
        titel: 'Der Kreative Fluchtweg',
        boss_sagt: 'Du kannst erst arbeiten wenn dein Desktop aufgeräumt ist!',
        optionen: [
          { text: 'Desktop aufräumen', user_damage: -50, boss_damage: 0, feedback: 'Prokrastination getarnt als Produktivität — Cyphers Meisterwerk. Der Desktop kann warten, deine Prio 1 nicht.' },
          { text: 'Eat the Frog: Prio 1 starten', user_damage: 0, boss_damage: 40, feedback: 'Brillant! "Eat the Frog" bedeutet: Die wichtigste (oft unangenehmste) Aufgabe zuerst. Cypher hat keine Chance.' },
          { text: 'Impuls-Tresor: Aufschreiben', user_damage: 0, boss_damage: 35, feedback: 'Stark! Du schreibst "Desktop aufräumen" auf deine Impuls-Liste und machst weiter. Der Gedanke ist erfasst, der Fokus bleibt.' },
        ],
      },
    ],
    sieg: {
      badge: 'Savannen-Meister',
      xp: 150,
      text: 'Du hast Cypher besiegt! Dein Fokus-Schild ist stärker als seine Ablenkungen. Du hast bewiesen, dass du die Kontrolle über deine Aufmerksamkeit hast.',
    },
    niederlage: {
      text: 'Cypher hat gewonnen. Aber jetzt kennst du seine Tricks. Beim nächsten Mal bist du vorbereitet. Versuch es erneut!',
    },
  },

  dr_dringend: {
    id: 'dr_dringend',
    name: 'Dr. Dringend, der Chaos-Director',
    beschreibung:
      'Dr. Dringend regiert durch Stress und Scheinkrisen. Er tarnt Unwichtiges als Dringendes und hofft, dass du springst, ohne nachzudenken. Besiege ihn mit klaren Grenzen.',
    user_stat: { label: 'Fokus-Schild', max: 100, start: 100 },
    boss_stat: { label: 'Chaos-Energie', max: 100, start: 100 },
    waves: [
      {
        id: 1,
        titel: 'Der Flurfunk-Angriff',
        boss_sagt: 'Hast du mal kurz 2 Minuten?',
        optionen: [
          { text: 'Klar, ich komm sofort!', user_damage: -20, boss_damage: 0, feedback: '"Kurz 2 Minuten" werden meistens 20. Du hast gerade deine Deep-Work-Phase geopfert.' },
          { text: 'Gerade nicht — ab 11:30 gerne.', user_damage: 0, boss_damage: 30, feedback: 'Perfekt! Du setzt eine klare Grenze UND bietest eine Alternative. Professionell und respektvoll.' },
          { text: 'Ignorieren', user_damage: -5, boss_damage: 10, feedback: 'Ignorieren funktioniert kurzfristig, beschädigt aber die Beziehung. Besser: Eine freundliche Zeitangabe machen.' },
        ],
      },
      {
        id: 2,
        titel: 'Der CC-Wahnsinn',
        boss_sagt: '15 E-Mails auf CC — du musst auf dem Laufenden bleiben!',
        optionen: [
          { text: 'Alles sofort lesen', user_damage: -40, boss_damage: 0, feedback: 'CC-Mails sind zu 90 % informell. Du hast gerade 45 Minuten in den Papierkorb geworfen.' },
          { text: 'Filter: Nur direkte Mails priorisieren', user_damage: 0, boss_damage: 35, feedback: 'Exzellent! E-Mail-Filter sind dein bester Freund. CC = "Zur Kenntnis" ≠ "Sofort handeln".' },
          { text: 'E-Mail-Programm schließen', user_damage: 0, boss_damage: 20, feedback: 'Gut! Aber langfristig brauchst du ein System. E-Mail-Zeiten festlegen (z.B. 9:00, 12:00, 16:00) ist nachhaltiger.' },
        ],
      },
      {
        id: 3,
        titel: 'Das Spontane Meeting',
        boss_sagt: 'Wir treffen uns JETZT im Konferenzraum! Es ist WICHTIG!',
        optionen: [
          { text: 'Hingehen ohne Agenda', user_damage: -60, boss_damage: 0, feedback: 'Meetings ohne Agenda sind die größten Zeitfresser im Berufsleben. Du hast gerade eine Stunde verloren.' },
          { text: 'Ja, wenn wir Projekt X verschieben', user_damage: 0, boss_damage: 40, feedback: 'Stark! Die "Ja, wenn"-Methode macht die Konsequenzen sichtbar. Dein Chef muss jetzt priorisieren — nicht du.' },
          { text: 'Gibt es eine Agenda?', user_damage: 0, boss_damage: 45, feedback: 'Meisterhaft! Du stellst die eine Frage, die Dr. Dringend am meisten hasst. Kein Agenda = kein Meeting.' },
        ],
      },
    ],
    sieg: {
      badge: 'Boundary Master',
      xp: 200,
      text: 'Du hast Dr. Dringend besiegt! Deine Grenzen sind klar, deine Kommunikation ist professionell und du lässt dich nicht mehr von Scheindringlichkeit manipulieren.',
    },
    niederlage: {
      text: 'Dr. Dringend hat dich überrollt. Aber du hast seine Taktiken erkannt. Beim nächsten Mal setzt du Grenzen. Versuch es erneut!',
    },
  },
};

// ---------------------------------------------------------------------------
// 5. EISENHOWER_SORTIERUNG — 10 Aufgaben, 4 Quadranten
// ---------------------------------------------------------------------------
export const EISENHOWER_SORTIERUNG = {
  titel: 'Eisenhower-Matrix: Sortiere die Aufgaben',
  beschreibung:
    'Ordne jede Aufgabe dem richtigen Quadranten zu. Denke daran: Dringend ≠ Wichtig.',
  quadranten: [
    { id: 'sofort', label: 'Sofort erledigen', beschreibung: 'Wichtig & Dringend', farbe: '#EF4444' },
    { id: 'planen', label: 'Einplanen', beschreibung: 'Wichtig & Nicht dringend', farbe: '#10B981' },
    { id: 'delegieren', label: 'Delegieren', beschreibung: 'Nicht wichtig & Dringend', farbe: '#F59E0B' },
    { id: 'eliminieren', label: 'Eliminieren', beschreibung: 'Nicht wichtig & Nicht dringend', farbe: '#6B7280' },
  ],
  aufgaben: [
    {
      id: 1,
      text: 'Kundenpräsentation für morgen vorbereiten',
      korrekt: 'sofort',
      erklaerung: 'Deadline ist morgen + hoher Impact = Wichtig & Dringend.',
    },
    {
      id: 2,
      text: 'Online-Weiterbildung zum Thema Führung abschließen',
      korrekt: 'planen',
      erklaerung: 'Karriererelevant, aber keine unmittelbare Deadline = Wichtig & Nicht dringend.',
    },
    {
      id: 3,
      text: 'Reisekostenabrechnung einreichen (Frist läuft heute ab)',
      korrekt: 'delegieren',
      erklaerung: 'Frist läuft ab (dringend), aber geringe strategische Bedeutung. Kann jemand anderes übernehmen.',
    },
    {
      id: 4,
      text: 'Social-Media-Feed durchscrollen ("um informiert zu bleiben")',
      korrekt: 'eliminieren',
      erklaerung: 'Weder wichtig noch dringend. Klassische Zeitfalle.',
    },
    {
      id: 5,
      text: 'Feedback-Gespräch mit Teammitglied führen (überfällig)',
      korrekt: 'sofort',
      erklaerung: 'Überfällig (dringend) + Mitarbeiterentwicklung (wichtig) = Sofort erledigen.',
    },
    {
      id: 6,
      text: 'Newsletter-Abo aussortieren',
      korrekt: 'eliminieren',
      erklaerung: 'Nice to have, aber kein messbarer Impact. Eliminieren oder irgendwann nebenbei.',
    },
    {
      id: 7,
      text: 'Strategiepapier für Q3 schreiben',
      korrekt: 'planen',
      erklaerung: 'Hoher strategischer Wert, aber noch keine akute Deadline = Einplanen und schützen.',
    },
    {
      id: 8,
      text: 'Druckerpapier nachbestellen',
      korrekt: 'delegieren',
      erklaerung: 'Muss erledigt werden, ist aber keine Aufgabe für dich. Delegieren.',
    },
    {
      id: 9,
      text: 'Mentoring-Programm für Junioren aufsetzen',
      korrekt: 'planen',
      erklaerung: 'Langfristig extrem wertvoll für Team und eigene Führungskompetenz = Einplanen.',
    },
    {
      id: 10,
      text: 'Kollegin bei Excel-Formel helfen',
      korrekt: 'delegieren',
      erklaerung: 'Nett, aber nicht deine Kernaufgabe. Verweise auf eine Anleitung oder den IT-Support.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 6. CHRONOTYP_TEST — 5 Fragen, 3 Typen, Tagespläne
// ---------------------------------------------------------------------------
export const CHRONOTYP_TEST = {
  titel: 'Chronotyp-Test: Wann bist du am besten?',
  beschreibung:
    'Finde heraus, ob du eine Lerche (Frühtyp), eine Eule (Spättyp) oder ein Kolibri (flexibler Mischtyp) bist — und optimiere deinen Tag entsprechend.',
  fragen: [
    {
      id: 1,
      text: 'Wann fühlst du dich am produktivsten?',
      optionen: [
        { text: 'Früh morgens (6–10 Uhr)', typ: 'lerche' },
        { text: 'Vormittags bis Mittag (10–13 Uhr)', typ: 'kolibri' },
        { text: 'Nachmittags bis Abends (15–21 Uhr)', typ: 'eule' },
      ],
    },
    {
      id: 2,
      text: 'Wenn du am Wochenende keinen Wecker stellst, wann wachst du auf?',
      optionen: [
        { text: 'Vor 7 Uhr', typ: 'lerche' },
        { text: 'Zwischen 7 und 9 Uhr', typ: 'kolibri' },
        { text: 'Nach 9 Uhr', typ: 'eule' },
      ],
    },
    {
      id: 3,
      text: 'Wann hast du die besten Ideen?',
      optionen: [
        { text: 'Beim Frühstück oder auf dem Weg zur Arbeit', typ: 'lerche' },
        { text: 'Während der Mittagspause oder beim Spaziergang', typ: 'kolibri' },
        { text: 'Abends auf der Couch oder spät nachts', typ: 'eule' },
      ],
    },
    {
      id: 4,
      text: 'Wie fühlst du dich nach dem Mittagessen?',
      optionen: [
        { text: 'Deutliches Energie-Tief, brauche eine Pause', typ: 'lerche' },
        { text: 'Leichtes Tief, geht aber schnell vorbei', typ: 'kolibri' },
        { text: 'Kaum Unterschied, ich komme erst richtig in Fahrt', typ: 'eule' },
      ],
    },
    {
      id: 5,
      text: 'Wenn du eine wichtige Prüfung oder Präsentation vorbereiten müsstest, wann würdest du lernen?',
      optionen: [
        { text: 'Früh morgens, bevor alle anderen wach sind', typ: 'lerche' },
        { text: 'Tagsüber in fokussierten Blöcken', typ: 'kolibri' },
        { text: 'Abends oder nachts, wenn es ruhig ist', typ: 'eule' },
      ],
    },
  ],
  ergebnisse: {
    lerche: {
      typ: 'Lerche',
      emoji: '🌅',
      beschreibung:
        'Du bist ein Frühtyp! Deine Hochenergie-Phase liegt am Morgen. Nutze die ersten Stunden für deine wichtigsten Aufgaben — danach geht es bergab.',
      staerken: ['Hohe Morgen-Produktivität', 'Natürliche Disziplin durch frühen Start', 'Abendruhe für Regeneration'],
      herausforderungen: ['Nachmittags-Tief', 'Abendmeetings sind anstrengend', 'Früh müde'],
    },
    eule: {
      typ: 'Eule',
      emoji: '🦉',
      beschreibung:
        'Du bist ein Spättyp! Dein Gehirn läuft erst ab Mittag auf Hochtouren. Morgens bist du im Autopilot — deine kreative Phase liegt am Nachmittag und Abend.',
      staerken: ['Kreative Abendstunden', 'Langanhaltende Konzentration am Nachmittag', 'Gut für asynchrone Arbeit'],
      herausforderungen: ['Morgendliche Meetings sind eine Qual', 'Gesellschaftlicher Druck zum Frühaufstehen', 'Schlafrhythmus schützen'],
    },
    kolibri: {
      typ: 'Kolibri',
      emoji: '🐦',
      beschreibung:
        'Du bist ein flexibler Mischtyp! Deine Energie verteilt sich gleichmäßiger über den Tag. Du kannst dich an verschiedene Zeitpläne anpassen, musst aber auf bewusste Pausen achten.',
      staerken: ['Hohe Anpassungsfähigkeit', 'Stabile Energie über den Tag', 'Flexibel in der Teamarbeit'],
      herausforderungen: ['Kein klares "Power-Fenster"', 'Gefahr der Überarbeitung', 'Pausen aktiv planen'],
    },
  },
  tagesplaene: {
    lerche: {
      titel: 'Tagesplan für die Lerche',
      bloecke: [
        { zeit: '06:00–06:30', aktivitaet: 'Morgenroutine & Morgen-Check', typ: 'routine' },
        { zeit: '06:30–09:00', aktivitaet: 'Deep Work: Prio 1 & Prio 2', typ: 'deep_work' },
        { zeit: '09:00–09:15', aktivitaet: 'E-Mail-Check #1', typ: 'kommunikation' },
        { zeit: '09:15–11:30', aktivitaet: 'Meetings & Kollaboration', typ: 'kommunikation' },
        { zeit: '11:30–12:00', aktivitaet: 'E-Mail-Check #2', typ: 'kommunikation' },
        { zeit: '12:00–13:00', aktivitaet: 'Mittagspause (weg vom Schreibtisch!)', typ: 'pause' },
        { zeit: '13:00–14:30', aktivitaet: 'Routine-Aufgaben & Admin', typ: 'routine' },
        { zeit: '14:30–15:00', aktivitaet: 'Tagesreview & Morgen-Vorbereitung', typ: 'routine' },
        { zeit: '15:00–16:00', aktivitaet: 'Leichte Aufgaben oder Early Feierabend', typ: 'routine' },
      ],
    },
    eule: {
      titel: 'Tagesplan für die Eule',
      bloecke: [
        { zeit: '09:00–09:30', aktivitaet: 'Sanfter Start: Morgen-Check & Kaffee', typ: 'routine' },
        { zeit: '09:30–10:30', aktivitaet: 'Routine-Aufgaben & E-Mail-Check #1', typ: 'routine' },
        { zeit: '10:30–12:30', aktivitaet: 'Meetings & Kollaboration', typ: 'kommunikation' },
        { zeit: '12:30–13:30', aktivitaet: 'Mittagspause', typ: 'pause' },
        { zeit: '13:30–14:00', aktivitaet: 'E-Mail-Check #2', typ: 'kommunikation' },
        { zeit: '14:00–17:00', aktivitaet: 'Deep Work: Prio 1 & Prio 2', typ: 'deep_work' },
        { zeit: '17:00–17:30', aktivitaet: 'Tagesreview & Morgen-Vorbereitung', typ: 'routine' },
        { zeit: '17:30–19:00', aktivitaet: 'Optionale Kreativ-Phase oder Weiterbildung', typ: 'deep_work' },
      ],
    },
    kolibri: {
      titel: 'Tagesplan für den Kolibri',
      bloecke: [
        { zeit: '08:00–08:30', aktivitaet: 'Morgen-Check & Tagesplanung', typ: 'routine' },
        { zeit: '08:30–10:30', aktivitaet: 'Deep Work Block 1: Prio 1', typ: 'deep_work' },
        { zeit: '10:30–10:45', aktivitaet: 'Pause & Bewegung', typ: 'pause' },
        { zeit: '10:45–12:00', aktivitaet: 'Meetings & Kollaboration', typ: 'kommunikation' },
        { zeit: '12:00–13:00', aktivitaet: 'Mittagspause', typ: 'pause' },
        { zeit: '13:00–13:30', aktivitaet: 'E-Mail-Check & Kommunikation', typ: 'kommunikation' },
        { zeit: '13:30–15:30', aktivitaet: 'Deep Work Block 2: Prio 2', typ: 'deep_work' },
        { zeit: '15:30–16:00', aktivitaet: 'Routine & Admin', typ: 'routine' },
        { zeit: '16:00–16:30', aktivitaet: 'Tagesreview & Morgen-Vorbereitung', typ: 'routine' },
      ],
    },
  },
};

// ---------------------------------------------------------------------------
// 7. NEIN_SKRIPTE — 5 Copy-Paste-Skripte
// ---------------------------------------------------------------------------
export const NEIN_SKRIPTE = {
  titel: 'Nein-Sagen: 5 Copy-Paste-Skripte für den Arbeitsalltag',
  beschreibung:
    'Kopiere diese Skripte und passe sie an deine Situation an. "Nein" sagen ist eine Fähigkeit — und jede Fähigkeit beginnt mit Übung.',
  skripte: [
    {
      id: 1,
      situation: 'Ein Kollege bittet dich spontan um Hilfe bei einer Aufgabe',
      titel: 'Die freundliche Verschiebung',
      skript:
        'Danke, dass du an mich denkst! Gerade bin ich mitten in [Aufgabe X] und möchte das konzentriert fertigmachen. Können wir uns um [Uhrzeit] zusammensetzen? Dann habe ich auch den Kopf frei für dein Thema.',
      erklaerung: 'Du sagst nicht "Nein" — du sagst "Jetzt nicht". Das ist respektvoll und zeigt, dass du die Anfrage ernst nimmst.',
    },
    {
      id: 2,
      situation: 'Dein Chef gibt dir eine neue Aufgabe, obwohl dein Teller voll ist',
      titel: 'Die Transparenz-Methode',
      skript:
        'Das klingt nach einem wichtigen Projekt. Ich möchte das gut machen. Aktuell arbeite ich an [A], [B] und [C]. Was davon soll ich zurückstellen, um Platz für diese neue Aufgabe zu schaffen?',
      erklaerung: 'Du gibst die Priorisierungs-Entscheidung zurück an den Chef. Du sagst: "Ich kann alles — aber nicht alles gleichzeitig."',
    },
    {
      id: 3,
      situation: 'Du wirst zu einem Meeting eingeladen, das keine Agenda hat',
      titel: 'Die Agenda-Frage',
      skript:
        'Danke für die Einladung! Damit ich mich gut vorbereiten kann: Gibt es eine Agenda und ein klares Ziel für das Meeting? Falls es eher ein Brainstorming ist, könnte ich alternativ meine Punkte vorab per E-Mail zuschicken.',
      erklaerung: 'Meetings ohne Agenda sind meistens Zeitverschwendung. Diese Frage zwingt den Organisator, sich Gedanken zu machen.',
    },
    {
      id: 4,
      situation: 'Jemand bittet dich, ein Projekt zu übernehmen, das nicht zu deinen Zielen passt',
      titel: 'Die strategische Absage',
      skript:
        'Ich schätze das Vertrauen! Allerdings passt das Projekt nicht in meinen aktuellen Fokusbereich [X]. Ich möchte sicherstellen, dass meine Energie dort ist, wo sie den größten Impact hat. Kann [Name] das vielleicht übernehmen? Der/Die hat Erfahrung in dem Bereich.',
      erklaerung: 'Du sagst Nein mit einer Begründung UND bietest eine Alternative. Das zeigt strategisches Denken.',
    },
    {
      id: 5,
      situation: 'Du bekommst eine dringende Anfrage per E-Mail, die eigentlich nicht dringend ist',
      titel: 'Die Entschleunigung',
      skript:
        'Danke für deine Nachricht. Ich habe sie gesehen und werde mich bis [Tag/Uhrzeit] dazu melden. Falls es wirklich zeitkritisch ist (Deadline heute), lass es mich wissen — dann priorisiere ich um.',
      erklaerung: 'Du nimmst den künstlichen Druck raus und setzt deinen eigenen Zeitrahmen. Die meisten "dringenden" E-Mails sind es nicht.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 8. SOS_PROTOKOLL — 5-Schritte-Notfallprotokoll
// ---------------------------------------------------------------------------
export const SOS_PROTOKOLL = {
  titel: 'SOS-Protokoll: 5 Schritte, wenn alles brennt',
  beschreibung:
    'Wenn alles gleichzeitig dringend erscheint, befolge dieses Protokoll. Es dauert weniger als 5 Minuten und bringt dich zurück in die Kontrolle.',
  schritte: [
    {
      id: 1,
      name: 'Atempause',
      dauer: '60 Sekunden',
      icon: '🫁',
      anleitung:
        'Stopp. Atme. 4 Sekunden einatmen, 4 Sekunden halten, 4 Sekunden ausatmen. Wiederhole 3x. Dein Gehirn kann im Panikmodus nicht priorisieren — du musst erst runterkommen.',
      warum: 'Stress aktiviert System 1 (schnell, impulsiv). Für Priorisierung brauchst du System 2 (langsam, analytisch). Die Atempause ist der Schalter.',
    },
    {
      id: 2,
      name: 'Triage',
      dauer: '2 Minuten',
      icon: '🏥',
      anleitung:
        'Schreibe ALLE offenen Aufgaben auf ein Blatt Papier. Nicht im Kopf sortieren — aufschreiben. Dann markiere jede Aufgabe mit: 🔴 Echte Deadline heute | 🟡 Deadline diese Woche | 🟢 Kann warten.',
      warum: 'Aufschreiben entlastet dein Arbeitsgedächtnis. Du wirst feststellen: Von 10 "dringenden" Aufgaben sind meistens nur 1–2 wirklich zeitkritisch.',
    },
    {
      id: 3,
      name: 'Die eine Frage',
      dauer: '30 Sekunden',
      icon: '❓',
      anleitung:
        'Schau auf deine Triage-Liste und frage dich: "Wenn ich heute NUR EINE Sache schaffen könnte — welche würde den größten Unterschied machen?" Das ist dein Prio 1.',
      warum: 'Wenn alles Prio 1 ist, ist nichts Prio 1. Die eine Frage zwingt dich zur Entscheidung.',
    },
    {
      id: 4,
      name: '15-Min Sprint',
      dauer: '15 Minuten',
      icon: '⏱️',
      anleitung:
        'Stell einen Timer auf 15 Minuten. Arbeite NUR an Prio 1. Kein E-Mail, kein Slack, kein Telefon. Nur du und die eine Aufgabe. Nach 15 Minuten darfst du entscheiden, ob du weitermachst oder zum nächsten Punkt gehst.',
      warum: '15 Minuten sind kurz genug, um keine Angst davor zu haben, und lang genug, um echten Fortschritt zu machen. Der erste Schritt bricht die Lähmung.',
    },
    {
      id: 5,
      name: 'Abend-Reset',
      dauer: '5 Minuten (am Feierabend)',
      icon: '🌙',
      anleitung:
        'Bevor du gehst: Schreibe die Top 3 für morgen auf. Räume deinen Schreibtisch auf. Schließe alle Tabs. Morgen startest du nicht im Chaos, sondern mit einem Plan.',
      warum: 'Der Abend-Reset verhindert, dass du den Stress mit nach Hause nimmst UND sorgt für einen klaren Start am nächsten Tag.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 9. MARKTWERT_BOOST — XP-Tabelle
// ---------------------------------------------------------------------------
export const MARKTWERT_BOOST = {
  titel: 'Marktwert-Boost: XP für echte Veränderung',
  beschreibung:
    'Sammle XP durch Aktionen im Kurs, im echten Leben und beim Aufbau deines Systems. Je mehr XP, desto höher dein Priorisierungs-Level.',
  kategorien: {
    training: {
      label: 'Training-XP',
      beschreibung: 'Punkte für Kurs-Aktivitäten',
      multiplikator: 1,
      aktionen: [
        { aktion: 'Modul abgeschlossen', xp: 50 },
        { aktion: 'Quiz bestanden (≥80 %)', xp: 30 },
        { aktion: 'Boss Fight gewonnen', xp: 100 },
        { aktion: 'Szenario abgeschlossen', xp: 75 },
        { aktion: 'Journal-Eintrag geschrieben', xp: 20 },
        { aktion: 'Eisenhower-Sortierung fehlerfrei', xp: 50 },
        { aktion: 'Chronotyp-Test gemacht', xp: 25 },
        { aktion: 'Abschlusstest bestanden', xp: 200 },
      ],
    },
    real_life: {
      label: 'Real-Life-XP',
      beschreibung: 'Punkte für echte Verhaltensänderungen',
      multiplikator: 2,
      aktionen: [
        { aktion: 'Morgen-Check 5 Tage in Folge durchgeführt', xp: 100 },
        { aktion: 'Einmal bewusst "Nein" gesagt', xp: 50 },
        { aktion: 'Deep-Work-Block (≥90 Min) eingehalten', xp: 75 },
        { aktion: 'Eine Aufgabe erfolgreich delegiert', xp: 60 },
        { aktion: 'SOS-Protokoll im Ernstfall angewendet', xp: 80 },
        { aktion: 'Wochenreview durchgeführt', xp: 40 },
        { aktion: 'Impuls-Tresor einen ganzen Tag genutzt', xp: 50 },
      ],
    },
    system: {
      label: 'System-XP',
      beschreibung: 'Punkte für den Aufbau deines persönlichen Systems',
      multiplikator: 1.5,
      aktionen: [
        { aktion: 'Persönliches Priorisierungs-System eingerichtet', xp: 150 },
        { aktion: 'E-Mail-Filter konfiguriert', xp: 30 },
        { aktion: 'Kalender-Blöcke für Deep Work eingetragen', xp: 40 },
        { aktion: 'Nein-Skript personalisiert und gespeichert', xp: 25 },
        { aktion: 'Stakeholder-Map erstellt', xp: 60 },
        { aktion: 'Wochen-Template angelegt', xp: 50 },
        { aktion: 'Digital Detox-Routine etabliert', xp: 45 },
      ],
    },
  },
  level: [
    { level: 1, name: 'Anfänger', min_xp: 0 },
    { level: 2, name: 'Bewusster Priorisierer', min_xp: 200 },
    { level: 3, name: 'Fokus-Krieger', min_xp: 500 },
    { level: 4, name: 'Grenz-Setzer', min_xp: 1000 },
    { level: 5, name: 'System-Architekt', min_xp: 1800 },
    { level: 6, name: 'Prioritäten-Meister', min_xp: 3000 },
  ],
};

// ---------------------------------------------------------------------------
// 10. ABSCHLUSSTEST — 10 Multiple-Choice-Fragen (70 % = bestanden)
// ---------------------------------------------------------------------------
export const ABSCHLUSSTEST = {
  titel: 'Abschlusstest: Prioritätenmanagement',
  beschreibung: 'Beantworte mindestens 7 von 10 Fragen richtig, um das Zertifikat zu erhalten.',
  bestanden_ab: 7,
  fragen: [
    {
      id: 1,
      frage: 'Was unterscheidet Prioritätenmanagement von klassischem Zeitmanagement?',
      optionen: [
        'Zeitmanagement optimiert WIE VIEL du schaffst, Prioritätenmanagement sorgt dafür, dass du das Richtige schaffst.',
        'Es gibt keinen Unterschied.',
        'Prioritätenmanagement ist nur ein anderes Wort für To-Do-Listen.',
        'Zeitmanagement ist für Führungskräfte, Prioritätenmanagement für alle.',
      ],
      korrekt: 1,
      erklaerung: 'Zeitmanagement fragt "Wie schaffe ich mehr?". Prioritätenmanagement fragt "Was sollte ich überhaupt tun?". Der Unterschied ist fundamental.',
    },
    {
      id: 2,
      frage: 'Welches Denksystem ist für impulsive Reaktionen auf Benachrichtigungen verantwortlich?',
      optionen: [
        'System 1 — schnell, automatisch, emotional',
        'System 2 — langsam, analytisch, bewusst',
        'Beide Systeme gleichzeitig',
        'Keines — es ist reine Gewohnheit',
      ],
      korrekt: 1,
      erklaerung: 'System 1 (nach Daniel Kahneman) reagiert schnell und impulsiv. Benachrichtigungen triggern System 1, was uns zum sofortigen Reagieren verleitet.',
    },
    {
      id: 3,
      frage: 'In welchem Eisenhower-Quadranten liegen die Aufgaben, die langfristig den größten Karriereerfolg bringen?',
      optionen: [
        'Quadrant II: Wichtig, aber NICHT dringend',
        'Quadrant I: Wichtig UND dringend',
        'Quadrant III: Dringend, aber NICHT wichtig',
        'Quadrant IV: Weder wichtig noch dringend',
      ],
      korrekt: 1,
      erklaerung: 'Quadrant II (wichtig, nicht dringend) enthält strategische Aufgaben wie Weiterbildung, Netzwerken und Prozessverbesserung — die Aufgaben, die Karrieren machen.',
    },
    {
      id: 4,
      frage: 'Was besagt die 80/20-Regel (Pareto-Prinzip) im Kontext von Prioritäten?',
      optionen: [
        '20 % deiner Aufgaben erzeugen 80 % deiner Ergebnisse.',
        '80 % deiner Zeit sollte für E-Mails reserviert sein.',
        'Du solltest 80 % delegieren und 20 % selbst machen.',
        'Nach 80 Minuten brauchst du 20 Minuten Pause.',
      ],
      korrekt: 1,
      erklaerung: 'Das Pareto-Prinzip zeigt: Ein kleiner Teil deiner Aufgaben (ca. 20 %) produziert den Großteil deiner Wirkung (ca. 80 %). Finde diese 20 % und schütze sie.',
    },
    {
      id: 5,
      frage: 'Wie lange dauert es durchschnittlich, sich nach einer Unterbrechung wieder voll zu fokussieren?',
      optionen: [
        '5 Minuten',
        '15 Minuten',
        '23 Minuten',
        '45 Minuten',
      ],
      korrekt: 2,
      erklaerung: 'Laut einer Studie von Gloria Mark (UC Irvine) dauert es durchschnittlich 23 Minuten und 15 Sekunden, um nach einer Unterbrechung zum ursprünglichen Fokus zurückzukehren.',
    },
    {
      id: 6,
      frage: 'Was ist der Impuls-Tresor?',
      optionen: [
        'Eine Liste, auf der du störende Gedanken und Impulse notierst, um sie später zu bearbeiten.',
        'Ein Tresor für wichtige Dokumente.',
        'Eine App zum Blockieren von Social Media.',
        'Ein Ort für kreative Ideen.',
      ],
      korrekt: 1,
      erklaerung: 'Der Impuls-Tresor ist eine einfache Liste, auf der du ablenkende Gedanken ("Muss noch Milch kaufen", "Desktop aufräumen") notierst, um den Fokus zu behalten.',
    },
    {
      id: 7,
      frage: 'Wann solltest du High-Impact-Entscheidungen idealerweise treffen?',
      optionen: [
        'In deiner Hochenergie-Phase, wenn dein System 2 am stärksten ist.',
        'Direkt nach dem Mittagessen.',
        'Abends, wenn der Tag reflektiert werden kann.',
        'Sofort, wenn sie aufkommen.',
      ],
      korrekt: 1,
      erklaerung: 'Wichtige Entscheidungen erfordern System 2 (analytisches Denken). Das funktioniert am besten in deiner biologischen Hochenergie-Phase — je nach Chronotyp morgens oder nachmittags.',
    },
    {
      id: 8,
      frage: 'Was bewirkt die "Ja, wenn"-Methode?',
      optionen: [
        'Sie zeigt die Konsequenzen einer neuen Aufgabe auf und gibt die Priorisierung zurück an den Fragenden.',
        'Sie ist eine Technik, um immer Ja zu sagen.',
        'Sie hilft beim Brainstorming.',
        'Sie ersetzt die Eisenhower-Matrix.',
      ],
      korrekt: 1,
      erklaerung: '"Ja, wenn wir Projekt X verschieben" macht die Trade-offs sichtbar. Der Fragende muss selbst priorisieren, statt einfach etwas auf deinen Stapel zu legen.',
    },
    {
      id: 9,
      frage: 'Was ist das Ziel des Morgen-Checks?',
      optionen: [
        'Alle E-Mails vor 9 Uhr beantworten.',
        'Die Prio 1 des Tages festlegen, BEVOR der Arbeitstag dich überrollt.',
        'Den Kalender auf Meetings prüfen.',
        'Social Media checken, bevor die Arbeit losgeht.',
      ],
      korrekt: 2,
      erklaerung: 'Der Morgen-Check ist ein 5-Minuten-Ritual, bei dem du EINE Hauptpriorität für den Tag festlegst — bevor E-Mails, Slack und Meetings die Kontrolle übernehmen.',
    },
    {
      id: 10,
      frage: 'Was ist Brain-Dumping?',
      optionen: [
        'Alle Gedanken und Aufgaben ungefiltert aufschreiben, um den Kopf freizubekommen.',
        'Eine Technik zum schnellen Lesen.',
        'Ein Teammeeting-Format.',
        'Das Löschen alter Dateien.',
      ],
      korrekt: 1,
      erklaerung: 'Brain-Dumping bedeutet, alle Gedanken, Aufgaben und Sorgen ungefiltert aufzuschreiben. Das entlastet das Arbeitsgedächtnis und schafft Klarheit für die Priorisierung.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 11. MODUL_QUIZ — 3–5 Fragen pro Modul (Module 1–8)
// ---------------------------------------------------------------------------
export const MODUL_QUIZ = {
  modul_1: {
    titel: 'Quiz: Modul 1 — Warum Prioritäten wichtiger sind als Zeitmanagement',
    fragen: [
      {
        id: 1,
        frage: 'Was ist das zentrale Problem von klassischem Zeitmanagement?',
        optionen: [
          'Es optimiert Effizienz, aber nicht Effektivität.',
          'Es ist zu kompliziert.',
          'Es funktioniert nur für Führungskräfte.',
        ],
        korrekt: 0,
      },
      {
        id: 2,
        frage: 'Was bedeutet "Beschäftigt ≠ Produktiv"?',
        optionen: [
          'Viele Aufgaben erledigen bedeutet nicht, die richtigen zu erledigen.',
          'Man sollte weniger arbeiten.',
          'Produktivität ist nicht messbar.',
        ],
        korrekt: 0,
      },
      {
        id: 3,
        frage: 'Anna aus der Story hat 43 E-Mails beantwortet. Was war ihr Fehler?',
        optionen: [
          'Sie hat zu langsam gearbeitet.',
          'Sie hat Dringendes mit Wichtigem verwechselt.',
          'Sie hätte die E-Mails delegieren sollen.',
        ],
        korrekt: 1,
      },
    ],
  },

  modul_2: {
    titel: 'Quiz: Modul 2 — Dein Gehirn: System 1 vs. System 2',
    fragen: [
      {
        id: 1,
        frage: 'System 1 ist…',
        optionen: [
          'schnell, automatisch und emotional.',
          'langsam, analytisch und bewusst.',
          'nur für kreative Aufgaben zuständig.',
        ],
        korrekt: 0,
      },
      {
        id: 2,
        frage: 'Warum reagieren wir sofort auf Benachrichtigungen?',
        optionen: [
          'Weil System 1 auf Neuheit und Dringlichkeit programmiert ist.',
          'Weil wir schlecht organisiert sind.',
          'Weil die Aufgaben wirklich dringend sind.',
        ],
        korrekt: 0,
      },
      {
        id: 3,
        frage: 'Was ist der "Savannen-Modus"?',
        optionen: [
          'Ein Entspannungsmodus des Gehirns.',
          'Die evolutionäre Programmierung, auf jedes Signal sofort zu reagieren.',
          'Ein Produktivitäts-Tool.',
        ],
        korrekt: 1,
      },
      {
        id: 4,
        frage: 'Wie aktivierst du System 2 bewusst?',
        optionen: [
          'Durch Pause, Reflexion und bewusste Entscheidung.',
          'Durch mehr Kaffee.',
          'Durch Multitasking.',
        ],
        korrekt: 0,
      },
    ],
  },

  modul_3: {
    titel: 'Quiz: Modul 3 — Die Eisenhower-Matrix',
    fragen: [
      {
        id: 1,
        frage: 'Welcher Quadrant wird am häufigsten vernachlässigt?',
        optionen: [
          'Quadrant I (Wichtig & Dringend)',
          'Quadrant II (Wichtig & Nicht dringend)',
          'Quadrant IV (Nicht wichtig & Nicht dringend)',
        ],
        korrekt: 1,
      },
      {
        id: 2,
        frage: 'Wo landet "Weiterbildung zum Thema Führung" typischerweise?',
        optionen: [
          'Quadrant II: Wichtig, nicht dringend',
          'Quadrant I: Wichtig und dringend',
          'Quadrant III: Dringend, nicht wichtig',
        ],
        korrekt: 0,
      },
      {
        id: 3,
        frage: 'Was solltest du mit Aufgaben in Quadrant IV tun?',
        optionen: [
          'Sofort erledigen',
          'Delegieren',
          'Eliminieren',
        ],
        korrekt: 2,
      },
      {
        id: 4,
        frage: 'Warum ist Quadrant III gefährlich?',
        optionen: [
          'Weil dringende Aufgaben sich als wichtig tarnen.',
          'Weil die Aufgaben zu schwer sind.',
          'Weil man sie nicht delegieren kann.',
        ],
        korrekt: 0,
      },
    ],
  },

  modul_4: {
    titel: 'Quiz: Modul 4 — Die Chronotypen und dein Energielevel',
    fragen: [
      {
        id: 1,
        frage: 'Was ist ein Chronotyp?',
        optionen: [
          'Dein biologisch bedingter Tagesrhythmus.',
          'Ein Zeitmanagement-Tool.',
          'Eine Persönlichkeitseigenschaft.',
        ],
        korrekt: 0,
      },
      {
        id: 2,
        frage: 'Wann sollte eine "Lerche" ihre wichtigsten Aufgaben erledigen?',
        optionen: [
          'Am frühen Morgen',
          'Am Nachmittag',
          'Am späten Abend',
        ],
        korrekt: 0,
      },
      {
        id: 3,
        frage: 'Was ist der Vorteil des Kolibri-Typs?',
        optionen: [
          'Höchste Kreativität am Abend.',
          'Hohe Anpassungsfähigkeit über den ganzen Tag.',
          'Braucht weniger Schlaf als andere.',
        ],
        korrekt: 1,
      },
    ],
  },

  modul_5: {
    titel: 'Quiz: Modul 5 — Deep Work & der Kampf gegen Ablenkungen',
    fragen: [
      {
        id: 1,
        frage: 'Was ist "Deep Work" nach Cal Newport?',
        optionen: [
          'Konzentrierte Arbeit ohne Ablenkung an kognitiv anspruchsvollen Aufgaben.',
          'Arbeit nach Feierabend.',
          'Teamarbeit in einem ruhigen Raum.',
        ],
        korrekt: 0,
      },
      {
        id: 2,
        frage: 'Wie lange dauert es, sich nach einer Unterbrechung wieder zu fokussieren?',
        optionen: [
          'Ca. 2 Minuten',
          'Ca. 23 Minuten',
          'Ca. 45 Minuten',
        ],
        korrekt: 1,
      },
      {
        id: 3,
        frage: 'Was ist die effektivste Methode gegen Smartphone-Ablenkung?',
        optionen: [
          'Display nach unten legen.',
          'Benachrichtigungen ausschalten.',
          'Physische Distanz — Handy in einen anderen Raum legen.',
        ],
        korrekt: 2,
      },
      {
        id: 4,
        frage: 'Was ist der Impuls-Tresor?',
        optionen: [
          'Eine App zum Blockieren von Websites.',
          'Eine Liste für ablenkende Gedanken, die du später bearbeitest.',
          'Ein Tresor für dein Handy.',
        ],
        korrekt: 1,
      },
      {
        id: 5,
        frage: 'Warum ist "Eat the Frog" effektiv?',
        optionen: [
          'Weil du die schwierigste Aufgabe zuerst erledigst, wenn deine Energie am höchsten ist.',
          'Weil Frösche gutes Brain Food sind.',
          'Weil es Multitasking fördert.',
        ],
        korrekt: 0,
      },
    ],
  },

  modul_6: {
    titel: 'Quiz: Modul 6 — Nein sagen & Grenzen setzen',
    fragen: [
      {
        id: 1,
        frage: 'Was ist die "Ja, wenn"-Methode?',
        optionen: [
          'Immer Ja sagen, aber Bedingungen stellen.',
          'Die Konsequenzen einer neuen Aufgabe sichtbar machen und die Priorisierung zurückgeben.',
          'Eine Verhandlungstechnik für Gehaltserhöhungen.',
        ],
        korrekt: 1,
      },
      {
        id: 2,
        frage: 'Was hat Tobias aus der Story falsch gemacht?',
        optionen: [
          'Er war zu faul.',
          'Er hat alles gemacht, statt das Richtige zu priorisieren.',
          'Er hat zu viel delegiert.',
        ],
        korrekt: 1,
      },
      {
        id: 3,
        frage: 'Warum ist "Nein" sagen eine Karriere-Strategie?',
        optionen: [
          'Weil es die Beziehung zum Chef verbessert.',
          'Weil jedes Ja zu etwas Unwichtigem ein Nein zu etwas Wichtigem ist.',
          'Weil man weniger arbeiten sollte.',
        ],
        korrekt: 1,
      },
    ],
  },

  modul_7: {
    titel: 'Quiz: Modul 7 — Stakeholder-Management & Sichtbarkeit',
    fragen: [
      {
        id: 1,
        frage: 'Was ist eine Stakeholder-Map?',
        optionen: [
          'Eine Übersicht der wichtigsten Personen und ihres Einflusses auf deine Karriere.',
          'Ein Organigramm des Unternehmens.',
          'Eine Liste aller Kollegen.',
        ],
        korrekt: 0,
      },
      {
        id: 2,
        frage: 'Warum ist Sichtbarkeit wichtig für Prioritätenmanagement?',
        optionen: [
          'Weil du priorisieren musst, WER deine Ergebnisse sieht — nicht nur WAS du machst.',
          'Weil du dich besser fühlen sollst.',
          'Weil der Chef immer recht hat.',
        ],
        korrekt: 0,
      },
      {
        id: 3,
        frage: 'Lena aus Tobias\' Story wurde befördert, weil…',
        optionen: [
          'sie mehr Tickets geschlossen hat.',
          'sie strategische Aufgaben priorisiert hat, die sichtbar waren.',
          'sie länger im Büro war.',
        ],
        korrekt: 1,
      },
      {
        id: 4,
        frage: 'Was solltest du tun, wenn dein Chef dir eine Aufgabe gibt, die nicht zu deinen Zielen passt?',
        optionen: [
          'Sofort erledigen, der Chef hat immer recht.',
          'Ignorieren.',
          'Transparenz-Methode: Aufzeigen, was dafür zurückgestellt werden muss.',
        ],
        korrekt: 2,
      },
    ],
  },

  modul_8: {
    titel: 'Quiz: Modul 8 — Dein persönliches Prioritäten-System',
    fragen: [
      {
        id: 1,
        frage: 'Was ist der Morgen-Check?',
        optionen: [
          'Ein 5-Minuten-Ritual, um die Prio 1 des Tages festzulegen.',
          'E-Mails vor der Arbeit lesen.',
          'Ein Check-in-Meeting mit dem Team.',
        ],
        korrekt: 0,
      },
      {
        id: 2,
        frage: 'Was gehört zu einem vollständigen Wochen-Review?',
        optionen: [
          'Nur auf die To-Do-Liste schauen.',
          'Rückblick auf Erfolge, Analyse von Ablenkungen und Planung der nächsten Woche.',
          'Kalender löschen und neu anfangen.',
        ],
        korrekt: 1,
      },
      {
        id: 3,
        frage: 'Warum solltest du dein Prioritäten-System regelmäßig anpassen?',
        optionen: [
          'Weil sich deine Rolle, Ziele und Lebensumstände verändern.',
          'Weil das System nach 30 Tagen abläuft.',
          'Weil es sonst langweilig wird.',
        ],
        korrekt: 0,
      },
      {
        id: 4,
        frage: 'Was ist Brain-Dumping?',
        optionen: [
          'Alles Wissen vergessen.',
          'Alle Gedanken ungefiltert aufschreiben, um den Kopf freizubekommen.',
          'Ein Brainstorming mit Kollegen.',
        ],
        korrekt: 1,
      },
      {
        id: 5,
        frage: 'Was ist das wichtigste Takeaway dieses Kurses?',
        optionen: [
          'Mehr Aufgaben in weniger Zeit schaffen.',
          'Das Richtige tun ist wichtiger als alles zu tun.',
          'Immer Nein sagen.',
        ],
        korrekt: 1,
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 12. JOURNAL_FRAGEN — 9 Reflexionsfragen (eine pro Kernmodul)
// ---------------------------------------------------------------------------
export const JOURNAL_FRAGEN = {
  titel: 'Reflexions-Journal',
  beschreibung: 'Beantworte eine Frage pro abgeschlossenem Modul. Ehrliche Reflexion ist der schnellste Weg zur Veränderung.',
  fragen: [
    { modul: 1, frage: 'Was war heute meine Prio 1 — und habe ich sie geschafft?' },
    { modul: 2, frage: 'In welcher Situation hat heute mein System 1 übernommen, obwohl System 2 besser gewesen wäre?' },
    { modul: 3, frage: 'Welche meiner heutigen Aufgaben war Quadrant II (wichtig, nicht dringend) — und wie viel Zeit habe ich ihr gegeben?' },
    { modul: 4, frage: 'Habe ich heute meine Hochenergie-Phase für die richtige Aufgabe genutzt?' },
    { modul: 5, frage: 'Wie lange war mein längster ununterbrochener Fokus-Block heute — und was hat ihn beendet?' },
    { modul: 6, frage: 'Welche Aufgabe hätte ich heute delegieren oder ablehnen können?' },
    { modul: 7, frage: 'Welche meiner heutigen Aufgaben war für meinen wichtigsten Stakeholder sichtbar?' },
    { modul: 8, frage: 'Was würde ich an meinem heutigen Tag ändern, wenn ich ihn nochmal leben könnte?' },
    { modul: 9, frage: 'Was nehme ich aus diesem Kurs als wichtigste Erkenntnis mit — und was ist mein erster konkreter Schritt?' },
  ],
};

// ---------------------------------------------------------------------------
// 13. SZENARIEN
// ---------------------------------------------------------------------------
export const SZENARIEN = {
  posteingang: {
    id: 'posteingang',
    titel: 'Der Posteingang der Apokalypse',
    beschreibung:
      'Es ist Montagmorgen, 8:47 Uhr. Du öffnest deinen Laptop und wirst von einer Flut an Nachrichten überrollt. Du hast 90 Minuten bis zum ersten Meeting. Entscheide für jede Nachricht: Was tust du?',
    zeit_budget: 90,
    events: [
      {
        id: 1,
        typ: 'email',
        absender: 'Dein Chef',
        betreff: 'DRINGEND: Zahlen für Vorstandsmeeting bis 10 Uhr',
        vorschau: 'Ich brauche die aktuellen Quartalszahlen aufbereitet. Der Vorstand will sie heute sehen.',
        aktionen: [
          { text: 'Sofort bearbeiten', impact: 30, zeit: 45, feedback: 'Richtig. Chef + Vorstand + Deadline heute = echte Prio 1. Das ist Quadrant I.' },
          { text: 'Auf die To-Do-Liste für später', impact: -20, zeit: 0, feedback: 'Gefährlich! Die Deadline ist in 73 Minuten. Das ist keine Aufgabe für "später".' },
          { text: 'Kurze Rückfrage: Welche Zahlen genau?', impact: 25, zeit: 5, feedback: 'Smart! Eine kurze Klärung spart dir womöglich 30 Minuten Arbeit an den falschen Zahlen.' },
        ],
      },
      {
        id: 2,
        typ: 'slack',
        absender: 'Kollegin Lisa',
        betreff: 'Kannst du mir kurz bei meiner Präsi helfen?',
        vorschau: 'Hey, ich komm bei Folie 7 nicht weiter. Hast du 10 Min?',
        aktionen: [
          { text: 'Klar, ich schau mal drüber', impact: -10, zeit: 25, feedback: '"10 Minuten" werden 25. Und du hast gerade deine Prio 1 aufgegeben.' },
          { text: 'Gerade nicht, aber ab 10:30 gerne!', impact: 15, zeit: 0, feedback: 'Perfekt! Du setzt eine Grenze UND bietest eine Alternative.' },
          { text: 'Ignorieren', impact: -5, zeit: 0, feedback: 'Funktioniert, beschädigt aber die Beziehung. Eine kurze Antwort wäre besser.' },
        ],
      },
      {
        id: 3,
        typ: 'email',
        absender: 'Kundin Frau Müller',
        betreff: 'Beschwerde: Lieferung 3 Tage zu spät!',
        vorschau: 'Sehr geehrte Damen und Herren, ich bin sehr enttäuscht über die verspätete Lieferung…',
        aktionen: [
          { text: 'Sofort ausführlich antworten', impact: 5, zeit: 30, feedback: 'Kundenservice ist wichtig, aber eine ausführliche Antwort jetzt kostet dich die Vorstandszahlen.' },
          { text: 'Kurze Bestätigung: "Ich kümmere mich bis 14 Uhr darum"', impact: 20, zeit: 3, feedback: 'Exzellent! Du zeigst Reaktion, gewinnst Zeit und hältst die Kundin bei Laune.' },
          { text: 'An den Kundenservice weiterleiten', impact: 15, zeit: 2, feedback: 'Gute Delegation! Vorausgesetzt, der Kundenservice kann es besser lösen als du.' },
        ],
      },
      {
        id: 4,
        typ: 'kalender',
        absender: 'Teamlead Marc',
        betreff: 'Spontanes Brainstorming um 9:30?',
        vorschau: 'Hey Team, lasst uns kurz zusammensetzen und über die neue Kampagne brainstormen!',
        aktionen: [
          { text: 'Zusagen', impact: -15, zeit: 45, feedback: 'Ein Brainstorming ohne Agenda ist ein getarnter Zeitfresser. Und du hast Vorstandszahlen zu liefern.' },
          { text: 'Absagen mit Begründung: "Habe Deadline bis 10 Uhr"', impact: 20, zeit: 1, feedback: 'Stark! Eine ehrliche, kurze Begründung. Marc wird es verstehen.' },
          { text: 'Vorschlagen: "Können wir das auf 14 Uhr verschieben?"', impact: 15, zeit: 2, feedback: 'Gut! Du blockst die Ablenkung und bietest eine Alternative.' },
        ],
      },
      {
        id: 5,
        typ: 'email',
        absender: 'Newsletter',
        betreff: '🔥 10 Productivity Hacks, die du kennen musst!',
        vorschau: 'Diese Woche: Warum erfolgreiche Menschen um 5 Uhr aufstehen…',
        aktionen: [
          { text: 'Öffnen und lesen', impact: -20, zeit: 15, feedback: 'Ironie: Du liest über Produktivität, statt produktiv zu sein. Cypher lässt grüßen.' },
          { text: 'Löschen', impact: 10, zeit: 0, feedback: 'Richtig. Newsletter sind Quadrant IV. Eliminieren.' },
          { text: 'Für heute Abend markieren', impact: 5, zeit: 1, feedback: 'OK, aber sei ehrlich: Wirst du ihn heute Abend wirklich lesen? Wahrscheinlich nicht.' },
        ],
      },
    ],
    auswertung: {
      gut: { min_impact: 60, text: 'Exzellent! Du hast die Prio 1 erkannt und dich nicht von Scheindringlichkeit ablenken lassen.' },
      mittel: { min_impact: 20, text: 'Solide, aber da geht noch mehr. Achte darauf, echte Dringlichkeit von Scheindringlichkeit zu unterscheiden.' },
      schlecht: { min_impact: -100, text: 'Du hast dich von der Flut überrollen lassen. Kein Vorwurf — genau dafür ist dieser Kurs da.' },
    },
  },

  entscheidung: {
    id: 'entscheidung',
    titel: 'Der Tag der Entscheidung',
    beschreibung:
      'Du bist Tobias, 38, Senior Developer. Es ist Donnerstag. Am Freitag ist die Quartals-Retrospektive, bei der das Management die Leistungen des Teams bewertet. Du hast zwei Optionen, wie du den Tag verbringst.',
    kontext:
      'Du hast noch 5 offene Bug-Tickets (mittlere Priorität) und eine Einladung, dein Architektur-Konzept dem CTO vorzustellen. Beides am selben Tag. Du kannst nur eines wählen.',
    optionen: [
      {
        id: 'grinding',
        titel: 'Die 5 Bug-Tickets abarbeiten',
        beschreibung: 'Du schließt alle 5 Tickets und hast danach einen sauberen Sprint.',
        konsequenzen: {
          kurzfristig: 'Sprint-Board ist sauber. Scrum Master ist zufrieden. Du fühlst dich produktiv.',
          langfristig: 'In der Retro erwähnt niemand deine Tickets. Die Beförderung geht an jemanden, der strategischer arbeitet.',
          karriere_impact: -10,
        },
        feedback:
          'Du hast das Dringende über das Wichtige gestellt. Die Tickets waren Quadrant III — dringend, aber nicht strategisch. Tobias hat genau diesen Fehler 12 Monate lang gemacht.',
      },
      {
        id: 'presenting',
        titel: 'Das Architektur-Konzept dem CTO präsentieren',
        beschreibung: 'Du bereitest die Präsentation vor, stellst dein Konzept vor und machst deine strategische Arbeit sichtbar.',
        konsequenzen: {
          kurzfristig: '5 Tickets bleiben offen. Scrum Master fragt nach. Du musst erklären, warum.',
          langfristig: 'Der CTO kennt jetzt deinen Namen. Dein Konzept wird in der Retro erwähnt. Du bist auf dem Radar für die Tech-Lead-Position.',
          karriere_impact: 30,
        },
        feedback:
          'Starke Wahl! Du hast Quadrant II (wichtig, nicht dringend) über Quadrant III gestellt. Die Tickets können morgen warten — diese Chance nicht. Genau das hat Lena richtig gemacht.',
      },
    ],
    lektion:
      'Prioritätenmanagement ist Karriere-Strategie. Es geht nicht darum, alles zu schaffen — sondern das Richtige zur richtigen Zeit.',
  },
};
