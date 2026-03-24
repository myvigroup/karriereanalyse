// ============================================================================
// Work-Life-Balance E-Learning — Complete Content Data
// ============================================================================

// ---------------------------------------------------------------------------
// 1. SELBSTDIAGNOSE_BALANCE — 10 Fragen, Scoring 1-5, 3 Ergebnis-Stufen
// ---------------------------------------------------------------------------
export const SELBSTDIAGNOSE_BALANCE = {
  titel: 'Selbstdiagnose: Wie steht es um deine Work-Life-Balance?',
  beschreibung:
    'Beantworte die folgenden 10 Fragen ehrlich. Es gibt keine richtigen oder falschen Antworten — nur dein persoenlicher Ist-Zustand.',
  skala: { min: 1, max: 5, labels: ['Trifft gar nicht zu', 'Trifft selten zu', 'Teils-teils', 'Trifft oft zu', 'Trifft voll zu'] },
  fragen: [
    { id: 1, text: 'Ich schlafe regelmaessig 7-8 Stunden und wache erholt auf.', kategorie: 'schlaf' },
    { id: 2, text: 'Ich kann nach Feierabend gedanklich von der Arbeit abschalten.', kategorie: 'grenzen' },
    { id: 3, text: 'Ich habe regelmaessig Zeit fuer Hobbys und persoenliche Interessen.', kategorie: 'freizeit' },
    { id: 4, text: 'Mein Stresslevel fuehlt sich fuer mich ueber die Woche gesund und bewaeltigbar an.', kategorie: 'stress' },
    { id: 5, text: 'Ich pflege meine wichtigsten Beziehungen aktiv (Partner, Familie, Freunde).', kategorie: 'beziehungen' },
    { id: 6, text: 'Ich checke abends und am Wochenende KEINE beruflichen E-Mails oder Nachrichten.', kategorie: 'digital' },
    { id: 7, text: 'Ich mache regelmaessig koerperliche Bewegung (mind. 3x/Woche).', kategorie: 'gesundheit' },
    { id: 8, text: 'Ich fuehle mich nicht schuldig, wenn ich Freizeit habe.', kategorie: 'grenzen' },
    { id: 9, text: 'Ich kenne meine persoenlichen Warnsignale fuer Ueberarbeitung.', kategorie: 'stress' },
    { id: 10, text: 'Ich habe eine klare Grenze zwischen Arbeitszeit und Privatzeit.', kategorie: 'grenzen' },
  ],
  ergebnisse: [
    {
      id: 'burnout_gefahr',
      range: [10, 20],
      titel: 'Burnout-Gefahr',
      beschreibung:
        'Deine Balance ist stark aus dem Gleichgewicht. Arbeit dominiert dein Leben und deine Erholung kommt zu kurz. Das ist kein Vorwurf — aber ein Warnsignal. Dieser Kurs gibt dir konkrete Werkzeuge, um Schritt fuer Schritt gegenzusteuern.',
      empfehlung: 'Starte mit Modul 3 (Stress verstehen) und Modul 10 (Burnout-Praevention). Diese Module sind fuer dich besonders wichtig.',
    },
    {
      id: 'ungleichgewicht',
      range: [21, 35],
      titel: 'Im Ungleichgewicht',
      beschreibung:
        'Du hast ein Gespuer fuer Balance, aber im Alltag gewinnst du nicht immer. Stress und Arbeit ueberrollen dich regelmaessig. Zeit, bewusste Grenzen zu setzen.',
      empfehlung: 'Fokussiere dich auf Modul 4 (Grenzen setzen), Modul 5 (Energie-Management) und Modul 6 (Micro-Recovery). Hier liegt dein groesstes Hebelpotenzial.',
    },
    {
      id: 'gute_balance',
      range: [36, 50],
      titel: 'Gute Balance',
      beschreibung:
        'Du managst deine Balance bereits gut. Dieser Kurs wird dir helfen, die letzten 20 % herauszuholen und ein nachhaltiges System aufzubauen.',
      empfehlung: 'Springe zu den Modulen, die dich am meisten interessieren. Modul 8 (Digitale Entgiftung) und Modul 11 (Identity Shift) bringen dir den meisten Mehrwert.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 2. STORIES_BALANCE — Emotionale Geschichten
// ---------------------------------------------------------------------------
export const STORIES_BALANCE = {
  modul_1: {
    titel: 'Der CEO der mit 38 zusammenbrach',
    protagonist: { name: 'Markus', alter: 38, rolle: 'CEO eines Tech-Startups' },
    inhalt: `Markus sitzt im Krankenwagen. Herzrasen. Atemnot. Er denkt: Herzinfarkt mit 38.

Es ist kein Herzinfarkt. Es ist eine schwere Panikattacke. Sein Koerper hat die Notbremse gezogen.

Markus hat in den letzten 5 Jahren sein Startup von 3 auf 120 Mitarbeiter aufgebaut. 14-Stunden-Tage. Wochenendarbeit. Sein Handy war sein staendiger Begleiter — beim Abendessen, im Bett, sogar auf der Toilette.

Seine Frau hat ihn vor 8 Monaten verlassen. "Ich lebe mit einem Geist", hat sie gesagt. Er hat es kaum bemerkt. Er war zu beschaeftigt.

Seine Kinder (6 und 9) kennen ihn als "der Mann der immer telefoniert". Als seine Tochter in der Schule gefragt wurde, was ihr Papa beruflich macht, sagte sie: "Er guckt auf sein Handy."

In der Notaufnahme liest der Arzt seine Blutwerte: Cortisol auf dem Level eines Soldaten in der Kampfzone. Schlafstunden pro Nacht: durchschnittlich 4,5. Letzte Urlaubswoche: vor 2 Jahren — und auch da hat er gearbeitet.

"Herr Schaefer", sagt der Arzt, "Ihr Koerper hat Ihnen gerade eine letzte Warnung geschickt. Die naechste koennte eine echte sein."

Markus hat alles erreicht, was er wollte. Und alles verloren, was wirklich zaehlt.

Die Frage ist nicht, ob du so weit kommen wirst. Die Frage ist: An welchem Punkt stehst du JETZT?`,
    reflexionsfrage: 'Erkennst du Teile von Markus in dir? Wann hast du das letzte Mal bewusst "Feierabend" gemacht — ohne schlechtes Gewissen?',
  },

  modul_4: {
    titel: 'Die Frau die nie Feierabend hatte',
    protagonist: { name: 'Sarah', alter: 35, rolle: 'Teamleiterin Marketing' },
    inhalt: `Sarah liegt um 23:14 Uhr im Bett und tippt auf ihrem Handy. Eine "letzte" E-Mail. Die fuenfte "letzte" E-Mail heute Abend.

Ihr Partner schlaeft neben ihr. Oder tut so. Er hat aufgehoert, etwas zu sagen. Frueher hat er gefragt: "Kannst du das Handy weglegen?" Jetzt dreht er sich einfach um.

Sarah ist gut in ihrem Job. Sehr gut sogar. Aber sie hat ein Problem: Sie kann nicht aufhoeren. Nicht weil sie muss — sondern weil sie nicht weiss, wie.

Es gibt keinen Moment, an dem sie sagt: "Fertig fuer heute." Es gibt immer noch eine E-Mail, noch eine Idee, noch etwas zu optimieren. Ihr Laptop steht auf dem Kuechentisch, immer offen, immer bereit.

Am Wochenende "checkt sie nur kurz" die Zahlen. Aus 5 Minuten werden 2 Stunden. Ihr Sohn (4) hat gelernt, nicht zu fragen, ob Mama spielt. Er weiss: Mama arbeitet immer.

Sarah hat kein Arbeitsproblem. Sie hat ein Aufhoer-Problem. Und die Loesung beginnt mit einem einzigen Wort: "Feierabend."

Nicht als Uhrzeit. Sondern als Ritual.`,
    reflexionsfrage: 'Hast du ein klares Signal, das dir sagt: "Jetzt ist Schluss fuer heute"? Oder endet dein Arbeitstag einfach... irgendwann?',
  },

  modul_11: {
    titel: 'Der Manager der nicht wusste wer er OHNE Job ist',
    protagonist: { name: 'Thomas', alter: 52, rolle: 'Bereichsleiter (ehemals)' },
    inhalt: `Thomas raeuspert sich. "Und was machen Sie beruflich?" fragt die Frau auf der Party.

Thomas oeffnet den Mund. Schliesst ihn wieder. Zum ersten Mal in 30 Jahren hat er keine Antwort auf diese Frage.

Vor drei Monaten wurde seine Abteilung aufgeloest. Restrukturierung. Nicht persoenlich, hiess es. Thomas bekam eine grosszuegige Abfindung und ein professionelles Coaching-Paket.

Aber das Coaching kann ihm die eine Frage nicht beantworten, die ihn nachts wach haelt: Wer bin ich, wenn ich kein Bereichsleiter bin?

30 Jahre lang war "Thomas, Bereichsleiter" seine Identitaet. Auf Visitenkarten, auf LinkedIn, bei Familientreffen. Sein ganzer Selbstwert hing an vier Buchstaben hinter seinem Namen.

Er hat keine Hobbys. Frueher hat er Gitarre gespielt — vor 20 Jahren. Seine Freundschaften? Geschaeftsbeziehungen, die mit dem Job verschwunden sind. Seine Ehe? Funktional. Er und seine Frau sind effiziente Mitbewohner geworden.

"Ich habe 30 Jahre lang so hart gearbeitet, dass ich vergessen habe, wer ich eigentlich bin", sagt Thomas zu seinem Coach.

Der Coach antwortet: "Das haben Sie nicht vergessen. Sie haben es nie herausgefunden."

Thomas' Geschichte ist kein Einzelfall. Sie ist die stille Epidemie der Leistungsgesellschaft: Menschen, die sich ueber ihren Job definieren — und in dem Moment zusammenbrechen, in dem der Job wegfaellt.`,
    reflexionsfrage: 'Wenn morgen dein Job wegfaellt — was bleibt? Welche drei Dinge machen dich als Mensch aus, OHNE deinen Jobtitel?',
  },
};

// ---------------------------------------------------------------------------
// 3. BOSS_FIGHTS_BALANCE — 3 Boss-Fights
// ---------------------------------------------------------------------------
export const BOSS_FIGHTS_BALANCE = {
  always_on: {
    id: 'always_on',
    name: 'Der Always-On Daemon',
    beschreibung:
      'Der Always-On Daemon lebt von deiner staendigen Erreichbarkeit. Jede Push-Notification, jede "nur kurz gucken"-Aktion macht ihn staerker. Besiege ihn, indem du Grenzen setzt.',
    user_stat: { label: 'Balance-Schild', max: 100, start: 100 },
    boss_stat: { label: 'Always-On Energie', max: 100, start: 100 },
    waves: [
      {
        id: 1,
        titel: 'Die Benachrichtigungs-Sucht',
        boss_sagt: 'Dein Chef hat um 21:30 Uhr eine E-Mail geschickt! Das muss SOFORT beantwortet werden!',
        optionen: [
          { text: 'Sofort antworten — der Chef erwartet das', user_damage: -30, boss_damage: 0, feedback: 'Falsch! Studien zeigen: 95% der Abend-E-Mails erwarten keine sofortige Antwort. Du hast gerade deinen Feierabend geopfert und dem Chef signalisiert, dass du immer verfuegbar bist.' },
          { text: 'Handy auf "Nicht stoeren" ab 20 Uhr', user_damage: 0, boss_damage: 30, feedback: 'Stark! Du setzt eine klare technische Grenze. Was du nicht siehst, kann dich nicht stressen. Die E-Mail wartet auch bis morgen.' },
          { text: 'Lesen aber nicht antworten', user_damage: -15, boss_damage: 10, feedback: 'Halbherzig! Du hast die E-Mail gelesen und jetzt arbeitet dein Gehirn im Hintergrund daran. Der Zeigarnik-Effekt laesst dich nicht schlafen.' },
        ],
      },
      {
        id: 2,
        titel: 'Die Wochenend-E-Mail',
        boss_sagt: 'Es ist Samstag. Du koenntest schnell die Praesentation fuer Montag vorbereiten. Nur 30 Minuten!',
        optionen: [
          { text: 'Kurz ran — dann ist es erledigt', user_damage: -35, boss_damage: 0, feedback: '"Nur 30 Minuten" werden 2 Stunden. Und selbst wenn es 30 Minuten sind: Du hast deinem Gehirn signalisiert, dass Wochenende = Arbeit ist. Die Erholung ist zerstoert.' },
          { text: 'Nein. Montag frueh, 8 Uhr. Fertig.', user_damage: 0, boss_damage: 35, feedback: 'Perfekt! Du verteidigst deine Erholungszeit. Die Praesentation wird am Montag genauso gut — vielleicht sogar besser, weil du erholt bist.' },
          { text: 'Auf die Montag-Liste schreiben und vergessen', user_damage: 0, boss_damage: 25, feedback: 'Gut! Du erfasst den Gedanken und laesst ihn los. Dein Gehirn muss nicht daran festhalten.' },
        ],
      },
      {
        id: 3,
        titel: 'Die Urlaubs-Schuld',
        boss_sagt: 'Du bist im Urlaub, aber das Team braucht dich! Du kannst sie doch nicht haengen lassen!',
        optionen: [
          { text: '"Nur kurz" im Urlaub arbeiten', user_damage: -40, boss_damage: 0, feedback: 'Urlaub mit Arbeit ist kein Urlaub. Studien zeigen: Wer im Urlaub arbeitet, erholt sich NICHT und ist danach weniger produktiv als vorher.' },
          { text: 'Vertretung regeln und Handy ausmachen', user_damage: 0, boss_damage: 40, feedback: 'Meisterhaft! Eine gute Vertretung ist Fuehrungskompetenz. Wer im Urlaub nicht erreichbar ist, zeigt: Das Team funktioniert auch ohne mich.' },
          { text: 'Erreichbar sein fuer "echte Notfaelle"', user_damage: -20, boss_damage: 15, feedback: 'Problematisch. Was ein "echter Notfall" ist, definiert jeder anders. Am Ende bist du staendig am Handy und wartest auf den Notfall.' },
        ],
      },
    ],
    sieg: {
      badge: 'Feierabend-Champion',
      xp: 150,
      text: 'Du hast den Always-On Daemon besiegt! Du weisst jetzt: Erreichbarkeit ist keine Tugend — sie ist eine Falle. Echte Staerke zeigt, wer abschalten kann.',
    },
    niederlage: {
      text: 'Der Always-On Daemon hat gewonnen. Aber jetzt kennst du seine Tricks. Beim naechsten Mal setzt du Grenzen. Versuch es erneut!',
    },
  },

  mitternachts_scrolleur: {
    id: 'mitternachts_scrolleur',
    name: 'Der Mitternachts-Scrolleur',
    beschreibung:
      'Der Mitternachts-Scrolleur schlaegt zu, wenn du muede bist aber nicht schlafen willst. Er naehrt sich von deinem Revenge Bedtime Procrastination. Besiege ihn mit bewussten Abendroutinen.',
    user_stat: { label: 'Schlaf-Qualitaet', max: 100, start: 100 },
    boss_stat: { label: 'Scroll-Macht', max: 100, start: 100 },
    waves: [
      {
        id: 1,
        titel: 'Doom Scrolling um Mitternacht',
        boss_sagt: 'Es ist 23:45 Uhr. Du hast den ganzen Tag fuer andere gearbeitet. DAS hier ist DEINE Zeit! Noch ein Video...',
        optionen: [
          { text: 'Stimmt — ich verdiene das. Weiterscrollen.', user_damage: -30, boss_damage: 0, feedback: '"Meine Zeit" um Mitternacht ist keine Qualitaetszeit. Dein Gehirn ist muede, das Blaulicht zerstoert dein Melatonin und morgen zahlst du die Rechnung. Das ist Revenge Bedtime Procrastination.' },
          { text: 'Handy in die Kueche legen und Buch nehmen', user_damage: 0, boss_damage: 35, feedback: 'Perfekt! Physische Distanz zum Handy + analoger Ersatz = die effektivste Waffe. Dein Gehirn bekommt "seine Zeit" ohne Bildschirm.' },
          { text: 'Timer auf 10 Minuten stellen', user_damage: -10, boss_damage: 15, feedback: 'Besser als nichts, aber der Mitternachts-Scrolleur ignoriert Timer. Studien zeigen: 80% scrollen ueber den Timer hinaus.' },
        ],
      },
      {
        id: 2,
        titel: '"Nur noch 5 Minuten"',
        boss_sagt: 'Dieses Video ist gleich vorbei! Nur noch 5 Minuten, dann schlaefst du. Versprochen!',
        optionen: [
          { text: 'OK, 5 Minuten. Dann ist aber Schluss.', user_damage: -35, boss_damage: 0, feedback: 'Das hast du vor 45 Minuten auch gesagt. "Nur noch 5 Minuten" ist die Lieblingsluege des Mitternachts-Scrolleurs. Auto-Play kennt kein Ende.' },
          { text: 'Bildschirm AUS. Jetzt.', user_damage: 0, boss_damage: 40, feedback: 'Stark! Der einzige Weg, den Scroll-Kreislauf zu brechen, ist der harte Schnitt. Nicht verhandeln. AUS.' },
          { text: 'Nur Audio weiterlaufen lassen', user_damage: -15, boss_damage: 10, feedback: 'Clever gedacht, aber dein Gehirn bleibt stimuliert. Du verzoegerst den Schlaf trotzdem. Der Mitternachts-Scrolleur hat dich halb erwischt.' },
        ],
      },
      {
        id: 3,
        titel: 'Der Morgen-danach-Kreislauf',
        boss_sagt: 'Du bist muede. Du brauchst Kaffee. Und heute Abend holst du den Schlaf nach. Versprochen!',
        optionen: [
          { text: 'Dritter Kaffee und durchpowern', user_damage: -40, boss_damage: 0, feedback: 'Der Kreislauf schliesst sich: Kaffee am Nachmittag → abends nicht muede → Handy bis Mitternacht → morgens muede → mehr Kaffee. Das ist keine Loesung, das ist Sucht.' },
          { text: 'Heute Abend: Handy-Ladekabel ins Wohnzimmer', user_damage: 0, boss_damage: 35, feedback: 'Brillant! Du brichst den Kreislauf an der Wurzel. Wenn das Handy nicht im Schlafzimmer ist, kann der Mitternachts-Scrolleur nicht zuschlagen.' },
          { text: 'Schlafenszeit-Alarm auf 22:30 setzen', user_damage: 0, boss_damage: 25, feedback: 'Guter Ansatz! Der Winddown-Alarm erinnert dich 30 Minuten vor der Schlafenszeit. Kombiniere ihn mit dem Handy-Rauswurf fuer maximale Wirkung.' },
        ],
      },
    ],
    sieg: {
      badge: 'Schlaf-Waechter',
      xp: 150,
      text: 'Du hast den Mitternachts-Scrolleur besiegt! Du weisst jetzt: Dein Handy gehoert nicht ins Schlafzimmer. Und echte "Me-Time" findet nicht um Mitternacht statt.',
    },
    niederlage: {
      text: 'Der Mitternachts-Scrolleur hat gewonnen. Aber jetzt kennst du sein Spiel. Beim naechsten Mal bist du vorbereitet. Versuch es erneut!',
    },
  },

  decision_fatigue: {
    id: 'decision_fatigue',
    name: 'Der Entscheidungs-Vampir',
    beschreibung:
      'Der Entscheidungs-Vampir saugt deine mentale Energie mit jeder kleinen Entscheidung ab. Am Ende des Tages bist du leer — nicht weil du viel gearbeitet hast, sondern weil du zu viel entschieden hast.',
    user_stat: { label: 'Entscheidungs-Kraft', max: 100, start: 100 },
    boss_stat: { label: 'Vampir-Staerke', max: 100, start: 100 },
    waves: [
      {
        id: 1,
        titel: 'Die 47. Entscheidung',
        boss_sagt: 'Was isst du zu Mittag? Wo gehst du hin? Was bestellst du? Alleine oder mit Kollegen? Draussen oder drinnen?',
        optionen: [
          { text: 'Uff, lass mich nachdenken...', user_damage: -30, boss_damage: 0, feedback: 'Jede triviale Entscheidung kostet die gleiche mentale Energie wie eine wichtige. Der durchschnittliche Erwachsene trifft 35.000 Entscheidungen pro Tag. Kein Wunder, dass du abends leer bist.' },
          { text: 'Dienstag = immer Salat-Bar. Fertig.', user_damage: 0, boss_damage: 35, feedback: 'Exzellent! Routinen eliminieren Entscheidungen. Steve Jobs trug immer das gleiche Outfit. Obama hatte nur graue oder blaue Anzuege. Automatisiere das Triviale!' },
          { text: 'Ich esse was der Kollege nimmt', user_damage: 0, boss_damage: 20, feedback: 'Funktioniert! Du delegierst die Entscheidung. Nicht elegant, aber effektiv. Spart mentale Energie fuer Wichtigeres.' },
        ],
      },
      {
        id: 2,
        titel: 'Das Entscheidungs-Framework',
        boss_sagt: 'Du musst JETZT entscheiden ob du das Projektangebot annimmst! Sofort!',
        optionen: [
          { text: 'OK, Bauchgefuehl sagt ja', user_damage: -35, boss_damage: 0, feedback: 'Wichtige Entscheidungen unter Zeitdruck mit leerem Tank? Das ist genau, was der Vampir will. Dein "Bauchgefuehl" ist am Ende des Tages nur Muedigkeit.' },
          { text: '"Ich schlafe eine Nacht drueber"', user_damage: 0, boss_damage: 40, feedback: 'Perfekt! Die 24-Stunden-Regel fuer grosse Entscheidungen ist Gold wert. Morgen frueh mit vollem Tank entscheidest du besser.' },
          { text: '2-Minuten-Regel: Entscheidung in 2 Min oder vertagen', user_damage: 0, boss_damage: 30, feedback: 'Stark! Die 2-Minuten-Regel: Wenn die Entscheidung in 2 Minuten treffbar ist, sofort. Wenn nicht, bewusst vertagen. System schlaegt Impuls.' },
        ],
      },
    ],
    sieg: {
      badge: 'Energie-Stratege',
      xp: 100,
      text: 'Du hast den Entscheidungs-Vampir besiegt! Du weisst jetzt: Automatisiere das Triviale, schuetze deine Entscheidungskraft fuer das Wichtige.',
    },
    niederlage: {
      text: 'Der Entscheidungs-Vampir hat deine Energie ausgesaugt. Aber jetzt kennst du seine Taktik. Beim naechsten Mal bist du vorbereitet. Versuch es erneut!',
    },
  },
};

// ---------------------------------------------------------------------------
// 4. STRESS_TYPEN — Akut vs. Chronisch
// ---------------------------------------------------------------------------
export const STRESS_TYPEN = {
  titel: 'Stress verstehen: Akut vs. Chronisch',
  beschreibung: 'Nicht jeder Stress ist schlecht. Der Unterschied zwischen gesundem und schaedlichem Stress liegt in der Dauer und Intensitaet.',
  typen: {
    eustress: {
      label: 'Eustress (positiver Stress)',
      beschreibung: 'Kurzzeitiger Stress, der dich aktiviert und zu Hoechstleistungen bringt.',
      beispiele: [
        'Praesentation vor wichtigem Kunden',
        'Sportlicher Wettkampf',
        'Deadline die dich motiviert',
        'Erstes Date',
        'Neue Herausforderung im Job',
      ],
      symptome: ['Erhoehte Konzentration', 'Energie-Schub', 'Positive Aufregung', 'Kreativitaets-Boost'],
      dauer: 'Minuten bis Stunden',
      farbe: '#16a34a',
    },
    akuter_distress: {
      label: 'Akuter Distress (negativer Kurzzeitstress)',
      beschreibung: 'Intensive Stressreaktion auf ein konkretes Ereignis. Unangenehm, aber zeitlich begrenzt.',
      beispiele: [
        'Streit mit Kollegen',
        'Auto-Unfall',
        'Ploetzliche Kuendigung',
        'Pruefungssituation',
        'Konflikt mit Vorgesetztem',
      ],
      symptome: ['Herzrasen', 'Schwitzen', 'Tunnelblick', 'Kampf-oder-Flucht-Reaktion'],
      dauer: 'Minuten bis Tage',
      farbe: '#f59e0b',
    },
    chronischer_distress: {
      label: 'Chronischer Distress (Dauerstress)',
      beschreibung: 'Anhaltender Stress ohne ausreichende Erholung. Der stille Killer.',
      beispiele: [
        'Dauerhaft zu hohe Arbeitsbelastung',
        'Toxische Arbeitsumgebung',
        'Finanzielle Sorgen ueber Monate',
        'Pflegende Angehoerige ohne Unterstuetzung',
        'Staendige Erreichbarkeit',
      ],
      symptome: ['Schlafprobleme', 'Chronische Muedigkeit', 'Reizbarkeit', 'Immunschwaeche', 'Konzentrationsprobleme', 'Gewichtsveraenderungen'],
      dauer: 'Wochen bis Jahre',
      farbe: '#dc2626',
    },
  },
  neurologisch: {
    akut: 'Bei akutem Stress schuettet der Koerper Adrenalin und Noradrenalin aus. Diese Hormone erhoehen Herzfrequenz und Aufmerksamkeit. Nach der Bedrohung normalisiert sich alles innerhalb von 20-60 Minuten.',
    chronisch: 'Bei chronischem Stress bleibt der Cortisol-Spiegel dauerhaft erhoeht. Cortisol zerstoert Hippocampus-Neuronen (Gedaechtnis), schwaecht das Immunsystem und erhoeht das Risiko fuer Herz-Kreislauf-Erkrankungen um 40%.',
  },
};

// ---------------------------------------------------------------------------
// 5. MICRO_RECOVERY — 10 Techniken
// ---------------------------------------------------------------------------
export const MICRO_RECOVERY = {
  titel: '10 Micro-Recovery Techniken fuer den Arbeitsalltag',
  beschreibung: 'Du brauchst keinen Urlaub, um dich zu erholen. Diese 10 Techniken dauern 30 Sekunden bis 5 Minuten — und laden deine Energie sofort auf.',
  techniken: [
    {
      id: 1,
      name: 'Physiologischer Seufzer',
      dauer: '30 Sekunden',
      dauer_sekunden: 30,
      icon: '🫁',
      kategorie: 'Atmung',
      anleitung: 'Doppelt einatmen (kurz-kurz durch die Nase), lang durch den Mund ausatmen. 3x wiederholen. Diese Technik (entdeckt von Andrew Huberman, Stanford) ist die schnellste bekannte Methode, um das Nervensystem zu beruhigen.',
      wirkung: 'Aktiviert den Parasympathikus in unter 30 Sekunden. Senkt Herzfrequenz und Cortisol sofort.',
    },
    {
      id: 2,
      name: 'Augen-Reset (20-20-20)',
      dauer: '20 Sekunden',
      dauer_sekunden: 20,
      icon: '👁️',
      kategorie: 'Augen',
      anleitung: 'Alle 20 Minuten: 20 Sekunden lang auf etwas schauen, das mindestens 20 Fuss (6 Meter) entfernt ist. Idealerweise aus dem Fenster in die Ferne.',
      wirkung: 'Entspannt die Ziliarmuskulatur, reduziert Augenmuedigkeit und Kopfschmerzen durch Bildschirmarbeit.',
    },
    {
      id: 3,
      name: 'Kalt-Wasser-Reset',
      dauer: '60 Sekunden',
      dauer_sekunden: 60,
      icon: '🧊',
      kategorie: 'Physisch',
      anleitung: 'Gehe zum naechsten Waschbecken. Lass kaltes Wasser ueber deine Handgelenke laufen (30 Sekunden pro Hand). Alternative: Kaltes Wasser ins Gesicht.',
      wirkung: 'Aktiviert den Tauchreflex, senkt Herzfrequenz und gibt einen sofortigen Wachheits-Boost durch Noradrenalin-Ausschuettung.',
    },
    {
      id: 4,
      name: 'Power-Dehnung',
      dauer: '2 Minuten',
      dauer_sekunden: 120,
      icon: '🧘',
      kategorie: 'Bewegung',
      anleitung: 'Stehe auf. Arme ueber den Kopf strecken (10 Sek). Vorwaertsbeuge (10 Sek). Schultern 10x kreisen. Nacken sanft nach links und rechts neigen (je 10 Sek). Hueften kreisen (10 Sek pro Richtung).',
      wirkung: 'Loest Verspannungen, aktiviert den Kreislauf und unterbricht die Sitzhaltung, die deinen Koerper steif macht.',
    },
    {
      id: 5,
      name: 'Natur-Mikrodosis',
      dauer: '3 Minuten',
      dauer_sekunden: 180,
      icon: '🌿',
      kategorie: 'Natur',
      anleitung: 'Gehe vor die Tuer oder ans Fenster. Atme 3 Minuten lang bewusst frische Luft. Schau in den Himmel oder auf Baeume. Keine Musik, kein Handy.',
      wirkung: 'Studien zeigen: Schon 3 Minuten Naturkontakt senken Cortisol messbar. Der Effekt ist staerker als Meditation fuer Anfaenger.',
    },
    {
      id: 6,
      name: 'Dankbarkeits-Flash',
      dauer: '60 Sekunden',
      dauer_sekunden: 60,
      icon: '🙏',
      kategorie: 'Mental',
      anleitung: 'Schliesse die Augen. Nenne innerlich 3 Dinge, fuer die du JETZT GERADE dankbar bist. Nicht abstrakt ("Gesundheit") sondern konkret ("Der Kaffee schmeckt gut", "Die Sonne scheint", "Mein Kollege hat mich angelaechelt").',
      wirkung: 'Aktiviert den prefrontalen Cortex und verschiebt den Fokus von Bedrohung auf Ressourcen. Senkt Cortisol innerhalb von 60 Sekunden.',
    },
    {
      id: 7,
      name: 'Body-Scan Mini',
      dauer: '2 Minuten',
      dauer_sekunden: 120,
      icon: '🧠',
      kategorie: 'Achtsamkeit',
      anleitung: 'Setze dich bequem hin. Schliesse die Augen. Scanne deinen Koerper von oben nach unten: Stirn, Kiefer, Schultern, Bauch, Haende, Fuesse. Bei jeder Station: Anspannung bemerken und bewusst loslassen.',
      wirkung: 'Unterbricht die Stress-Schleife im Koerper. Du bemerkst Anspannungen, die du unbewusst traegst und kannst sie loslassen.',
    },
    {
      id: 8,
      name: 'Lach-Therapie',
      dauer: '60 Sekunden',
      dauer_sekunden: 60,
      icon: '😂',
      kategorie: 'Emotional',
      anleitung: 'Oeffne eine Bookmark-Liste mit 3 Dingen, die dich GARANTIERT zum Lachen bringen (Meme, Video, Comic). Schau dir eins an. Lache laut.',
      wirkung: 'Lachen senkt Cortisol um bis zu 39% und erhoehte Endorphine. 60 Sekunden echtes Lachen wirken wie 10 Minuten Rudern.',
    },
    {
      id: 9,
      name: 'Social Recovery',
      dauer: '3 Minuten',
      dauer_sekunden: 180,
      icon: '💬',
      kategorie: 'Sozial',
      anleitung: 'Schreibe einer Person, die dir wichtig ist, eine kurze Nachricht. Nicht geschaeftlich. Kein Grund noetig. "Hey, ich denke an dich." oder "Danke fuer gestern." Fertig.',
      wirkung: 'Soziale Verbindung aktiviert Oxytocin — das staerkste Anti-Stress-Hormon. Eine einzige positive Interaktion kann dein Stresslevel fuer Stunden senken.',
    },
    {
      id: 10,
      name: 'Stimulations-Pause',
      dauer: '5 Minuten',
      dauer_sekunden: 300,
      icon: '🔇',
      kategorie: 'Stille',
      anleitung: 'Finde einen ruhigen Ort. Keine Musik, kein Podcast, kein Handy, kein Bildschirm. Sitze einfach da. Lass deine Gedanken kommen und gehen. Tue NICHTS.',
      wirkung: 'Dein Gehirn aktiviert das Default Mode Network — das Netzwerk fuer Kreativitaet, Problemloesung und Selbstreflexion. Es braucht Stille, um zu funktionieren.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 6. IDENTITY_SHIFT — Identitaet jenseits des Jobs
// ---------------------------------------------------------------------------
export const IDENTITY_SHIFT = {
  titel: 'Identity Shift: Du bist nicht dein Job',
  story: STORIES_BALANCE?.modul_11?.inhalt || '',
  kernbotschaft: 'Wer seine gesamte Identitaet an den Job koppelt, steht vor einem Abgrund, wenn der Job wegfaellt. Eine gesunde Identitaet hat mehrere Standbeine.',
  reflexionsfragen: [
    'Wenn du morgen kuendigst — was wuerdest du mit deiner Zeit anfangen?',
    'Wie wuerdest du dich auf einer Party vorstellen, OHNE deinen Job zu erwaehnen?',
    'Welche 3 Dinge machen dich als Mensch aus, die nichts mit Arbeit zu tun haben?',
    'Wann hast du zuletzt etwas getan, nur weil es dir Freude macht — ohne Produktivitaets-Ziel?',
    'Wenn du in 20 Jahren zurueckschaust: Woran willst du dich erinnern?',
  ],
  uebung: {
    titel: 'Dein Identitaets-Rad',
    beschreibung: 'Male ein Rad mit 8 Speichen. Jede Speiche ist ein Teil deiner Identitaet. Fuelle mindestens 5 Speichen mit Dingen, die NICHTS mit deinem Job zu tun haben.',
    beispiele: ['Partner/in', 'Elternteil', 'Musiker/in', 'Sportler/in', 'Freund/in', 'Leser/in', 'Reisende/r', 'Koch/Koechin', 'Ehrenamtliche/r', 'Lernende/r'],
  },
};

// ---------------------------------------------------------------------------
// 7. BEZIEHUNGS_KONTO — Gottman 5:1 Ratio
// ---------------------------------------------------------------------------
export const BEZIEHUNGS_KONTO = {
  titel: 'Das Beziehungs-Konto: Die 5:1 Regel',
  beschreibung: 'John Gottman (Beziehungsforscher) fand heraus: Stabile Beziehungen haben ein Verhaeltnis von mindestens 5 positiven Interaktionen auf 1 negative. Das gilt fuer Partner, Freunde UND Kollegen.',
  ziel_ratio: '5:1',
  einzahlungen: [
    { id: 1, text: 'Aktiv zuhoeren (Handy weg, Blickkontakt)', punkte: 1, beispiel: 'Wenn dein Partner von seinem Tag erzaehlt: Handy weglegen, nachfragen, wirklich zuhoeren.' },
    { id: 2, text: 'Wertschaetzung ausdruecken', punkte: 1, beispiel: '"Danke, dass du das gemacht hast. Ich weiss das zu schaetzen." — Konkret und ehrlich.' },
    { id: 3, text: 'Gemeinsame Quality Time', punkte: 2, beispiel: '30 Minuten ungeteilte Aufmerksamkeit. Kein Bildschirm, kein Multitasking.' },
    { id: 4, text: 'Kleine Aufmerksamkeiten', punkte: 1, beispiel: 'Kaffee mitbringen, an den Jahrestag denken, eine Nachricht "nur so" schicken.' },
    { id: 5, text: 'Koerperliche Naehe (Umarmung, Beruehrung)', punkte: 1, beispiel: 'Eine 20-Sekunden-Umarmung schuettet Oxytocin aus — messbar stressreduzierend.' },
  ],
  abhebungen: [
    { id: 1, text: 'Handy waehrend des Gespraechs checken', punkte: -2, beispiel: '"Hm, ja..." waehrend du auf Instagram scrollst. Dein Gegenueber merkt es IMMER.' },
    { id: 2, text: 'Verabredungen absagen wegen Arbeit', punkte: -3, beispiel: '"Sorry, ich muss laenger arbeiten." Einmal OK. Regelmaessig? Beziehungskiller.' },
    { id: 3, text: 'Kritik ohne Wertschaetzung', punkte: -2, beispiel: '"Du hast schon wieder vergessen..." ohne vorheriges Positives = direkte Abhebung.' },
    { id: 4, text: 'Emotionale Abwesenheit', punkte: -3, beispiel: 'Physisch anwesend, aber gedanklich bei der Arbeit. Dein Koerper sitzt am Tisch, dein Kopf im Buero.' },
    { id: 5, text: 'Versprechen brechen', punkte: -4, beispiel: '"Ich komme frueher" — und dann doch nicht. Jedes gebrochene Versprechen kostet Vertrauen.' },
  ],
  woechentlicher_check: [
    'Wie oft habe ich diese Woche bewusst zugehoert?',
    'Habe ich eine Verabredung abgesagt oder verschoben?',
    'Wann war das letzte Gespraech OHNE Handy in der Naehe?',
    'Habe ich diese Woche jemandem "Danke" gesagt und es auch so gemeint?',
    'Wie ist mein geschaetztes Verhaeltnis: Einzahlungen zu Abhebungen?',
  ],
};

// ---------------------------------------------------------------------------
// 8. REVENGE_BEDTIME — Symptome und Loesungen
// ---------------------------------------------------------------------------
export const REVENGE_BEDTIME = {
  titel: 'Revenge Bedtime Procrastination',
  beschreibung: 'Du bleibst absichtlich laenger wach als noetig — nicht weil du nicht muede bist, sondern weil du das Gefuehl hast, dass der Tag dir "gestohlen" wurde und du dir die Nacht "zurueckholst".',
  symptome: [
    'Du bleibst bis 1-2 Uhr wach, obwohl du um 7 Uhr aufstehen musst',
    'Du scrollst durch Social Media ohne Ziel oder Freude',
    'Du sagst dir staendig "nur noch 5 Minuten"',
    'Am naechsten Morgen bist du erschoepft und brauchst mehrere Kaffees',
    'Du weisst, dass du schlafen SOLLTEST, aber du WILLST nicht',
    'Du empfindest Schlafengehen als "Kapitulation"',
  ],
  ursache: 'Der Tag gehoerte nicht DIR. Du hattest keine "Me-Time". Also holst du sie dir nachts — auf Kosten deiner Gesundheit. Die Loesung ist nicht mehr Disziplin am Abend, sondern mehr Freiheit am Tag.',
  loesungen: [
    {
      id: 'protected_time',
      name: 'Protected Time Block',
      beschreibung: 'Blockiere TAEGLICH 30-60 Minuten NUR fuer dich. Kein Handy, keine Arbeit, keine Verpflichtungen. Wenn du dir diese Zeit am Tag nimmst, brauchst du sie nicht mehr in der Nacht zu stehlen.',
      wann: 'Nachmittags oder fruehen Abend',
    },
    {
      id: 'winddown_alarm',
      name: 'Winddown-Alarm',
      beschreibung: 'Stelle einen Alarm auf 30 Minuten vor deiner Schlafenszeit. Wenn er klingelt: Bildschirm AUS, Handy in die Kueche, Abend-Routine starten (Buch, Tee, Dehnen).',
      wann: '22:00 oder 22:30 Uhr',
    },
    {
      id: 'tomorrow_list',
      name: 'Tomorrow-List',
      beschreibung: 'Schreibe vor dem Schlafengehen 3 Dinge auf, auf die du dich MORGEN freust. Das gibt deinem Gehirn einen positiven Ausblick und macht das Aufhoeren leichter.',
      wann: 'Direkt vor dem Schlafengehen',
    },
    {
      id: 'handy_ausschluss',
      name: 'Handy-Ausschluss',
      beschreibung: 'Lade dein Handy NICHT im Schlafzimmer. Kaufe einen analogen Wecker. Das Handy liegt ab 22 Uhr in der Kueche. Physische Distanz ist staerker als Willenskraft.',
      wann: 'Ab 22:00 Uhr',
    },
  ],
};

// ---------------------------------------------------------------------------
// 9. BURNOUT_STUFEN — 12 Stufen nach Freudenberger
// ---------------------------------------------------------------------------
export const BURNOUT_STUFEN = {
  titel: 'Die 12 Burnout-Stufen nach Freudenberger & North',
  beschreibung: 'Herbert Freudenberger beschrieb 1974 erstmals das Burnout-Syndrom. Spaeter entwickelten er und Gail North ein 12-Stufen-Modell. Je frueher du deine Stufe erkennst, desto leichter ist die Umkehr.',
  stufen: [
    { stufe: 1, name: 'Zwang sich zu beweisen', beschreibung: 'Uebertriebener Ehrgeiz. Du willst allen zeigen, wie gut du bist. Perfektionismus. "Ich muss das schaffen."', farbe: '#22c55e', zone: 'gruen' },
    { stufe: 2, name: 'Verstaerkter Einsatz', beschreibung: 'Du arbeitest haerter, laenger, mehr. Delegation faellt schwer — du machst lieber alles selbst. "Nur ICH kann das."', farbe: '#4ade80', zone: 'gruen' },
    { stufe: 3, name: 'Vernachlaessigung eigener Beduerfnisse', beschreibung: 'Schlaf, Essen, Hobbys, Freundschaften — alles wird der Arbeit untergeordnet. "Keine Zeit dafuer."', farbe: '#86efac', zone: 'gruen' },
    { stufe: 4, name: 'Verdraengung von Konflikten', beschreibung: 'Du merkst, dass etwas nicht stimmt, aber ignorierst es. Koerperliche Symptome (Kopfschmerzen, Magenprobleme) werden weggedrueckt.', farbe: '#fbbf24', zone: 'gelb' },
    { stufe: 5, name: 'Umdeutung von Werten', beschreibung: 'Freundschaften und Familie werden als "stoerend" empfunden. Arbeit wird zum einzigen Massstab fuer Selbstwert.', farbe: '#f59e0b', zone: 'gelb' },
    { stufe: 6, name: 'Verstaerkte Verleugnung', beschreibung: 'Zynismus, Ungeduld, Intoleranz. "Alle anderen sind das Problem." Du erkennst dich selbst nicht mehr.', farbe: '#f97316', zone: 'gelb' },
    { stufe: 7, name: 'Rueckzug', beschreibung: 'Sozialer Rueckzug. Du meidest Kontakte, findest Ausreden. Alkohol, Medikamente oder andere Kompensationsmittel nehmen zu.', farbe: '#fb923c', zone: 'orange' },
    { stufe: 8, name: 'Deutliche Verhaltensaenderung', beschreibung: 'Freunde und Familie bemerken Veraenderungen. Du bist nicht mehr "du selbst". Angstzustaende, Panikattacken moeglich.', farbe: '#ef4444', zone: 'rot' },
    { stufe: 9, name: 'Depersonalisation', beschreibung: 'Du fuehlst dich wie eine Maschine. Kein Bezug mehr zu dir selbst. Emotionale Taubheit. "Mir ist alles egal."', farbe: '#dc2626', zone: 'rot' },
    { stufe: 10, name: 'Innere Leere', beschreibung: 'Sinnlosigkeit. Panikattacken, Phobien. Kompensation durch Exzesse (Essen, Shopping, Substanzen).', farbe: '#b91c1c', zone: 'rot' },
    { stufe: 11, name: 'Depression', beschreibung: 'Klinische Depression. Hoffnungslosigkeit. Erschoepfung. Suizidgedanken moeglich. BITTE SUCHE DIR HILFE.', farbe: '#991b1b', zone: 'rot' },
    { stufe: 12, name: 'Voellige Erschoepfung', beschreibung: 'Koerperlicher, emotionaler und geistiger Zusammenbruch. Hospitalisierung moeglich. Ohne professionelle Hilfe geht es nicht weiter.', farbe: '#7f1d1d', zone: 'rot' },
  ],
  empfehlungen: {
    gruen: 'Du bist in einem freuhen Stadium. Jetzt gegenzusteuern ist einfach und effektiv. Setze Grenzen, plane Erholung ein und beobachte deine Muster.',
    gelb: 'Achtung — du bist auf einem kritischen Weg. Sprich mit einer Vertrauensperson, reduziere bewusst deine Arbeitszeit und suche dir professionelle Unterstuetzung.',
    orange: 'Warnstufe! Du brauchst JETZT Veraenderung. Sprich mit deinem Hausarzt, erwaeage ein Coaching oder eine Therapie. Das ist keine Schwaeche — das ist Verantwortung.',
    rot: 'SOFORT professionelle Hilfe suchen! Telefonseelsorge: 0800 111 0 111 (kostenlos, 24/7). Hausarzt aufsuchen. Das hier ist KEIN Kurs-Thema mehr — das ist ein medizinischer Notfall.',
  },
  hotline: 'Telefonseelsorge: 0800 111 0 111 oder 0800 111 0 222 (kostenlos, 24/7, anonym)',
};

// ---------------------------------------------------------------------------
// 10. SHUTDOWN_RITUAL — 5 Schritte
// ---------------------------------------------------------------------------
export const SHUTDOWN_RITUAL = {
  titel: 'Das Shutdown-Ritual: 5 Schritte zum Feierabend',
  beschreibung: 'Ein festes Ritual, das deinem Gehirn signalisiert: "Die Arbeit ist vorbei." Ohne dieses Signal arbeitet dein Gehirn weiter — auch wenn du auf der Couch sitzt.',
  schritte: [
    {
      id: 1,
      name: 'Inbox Zero Check',
      dauer: '3 Minuten',
      icon: '📧',
      anleitung: 'Scanne deine E-Mails und Nachrichten. Nicht beantworten — nur sichten. Gibt es etwas, das bis morgen nicht warten kann? Wenn ja, erledige es. Wenn nein (und das ist meistens der Fall): Schliesse alle Tabs.',
      optionen: ['Alle E-Mails bis morgen priorisiert', 'Dringendes in 5 Min erledigt', 'Inbox geschlossen'],
    },
    {
      id: 2,
      name: 'Tomorrow-Liste',
      dauer: '2 Minuten',
      icon: '📋',
      anleitung: 'Schreibe maximal 3 Aufgaben fuer morgen auf. Die wichtigste zuerst. Dein Gehirn kann loslassen, wenn es weiss: Morgen ist geplant.',
      optionen: ['Top 3 fuer morgen notiert', 'Nur die #1 Prio festgelegt', 'Kalender fuer morgen gecheckt'],
    },
    {
      id: 3,
      name: 'Schreibtisch Clear',
      dauer: '2 Minuten',
      icon: '🧹',
      anleitung: 'Raeume deinen Schreibtisch auf. Physische Ordnung = mentale Ordnung. Morgen startest du nicht im Chaos.',
      optionen: ['Schreibtisch aufgeraeumt', 'Nur Laptop zugeklappt', 'Tasse in die Kueche gebracht'],
    },
    {
      id: 4,
      name: 'Shutdown-Phrase',
      dauer: '5 Sekunden',
      icon: '🔐',
      anleitung: 'Sage laut oder leise einen festen Satz. Dieser Satz ist dein psychologischer Anker. Beispiel: "Shutdown complete." oder "Feierabend. Ich bin fertig." Cal Newport nutzt: "Schedule shutdown, complete."',
      optionen: ['Shutdown complete.', 'Feierabend. Alles erledigt.', 'Morgen kuemmere ich mich darum.', 'Eigene Phrase...'],
    },
    {
      id: 5,
      name: 'Uebergangs-Aktivitaet',
      dauer: '10-15 Minuten',
      icon: '🚶',
      anleitung: 'Mache etwas, das den Uebergang zwischen Arbeit und Freizeit markiert. Dein Gehirn braucht ein physisches Signal, dass die Arbeit vorbei ist.',
      optionen: ['Spaziergang (15 Min)', 'Duschen / Umziehen', 'Kochen', 'Sport / Dehnen', 'Musik hoeren'],
    },
  ],
};

// ---------------------------------------------------------------------------
// 11. ENERGIE_PROTOKOLL — 4 Energie-Typen + Tracking
// ---------------------------------------------------------------------------
export const ENERGIE_PROTOKOLL = {
  titel: 'Dein Energie-Protokoll',
  beschreibung: 'Du managst nicht Zeit — du managst Energie. Tracke eine Woche lang dein Energielevel und finde heraus, wann du aufladen musst.',
  energie_typen: [
    {
      id: 'physisch',
      label: 'Physische Energie',
      icon: '💪',
      farbe: '#ef4444',
      beschreibung: 'Dein koerperliches Energielevel. Beeinflusst durch Schlaf, Ernaehrung, Bewegung.',
      aufladen: ['7-8 Stunden Schlaf', 'Bewegung (auch kurz)', 'Gesunde Mahlzeiten', 'Wasser trinken', 'Power Nap (20 Min)'],
      warnsignale: ['Chronische Muedigkeit', 'Haeufige Erkrankungen', 'Muskelverspannungen', 'Kopfschmerzen'],
    },
    {
      id: 'emotional',
      label: 'Emotionale Energie',
      icon: '❤️',
      farbe: '#f59e0b',
      beschreibung: 'Deine emotionale Stabilitaet und Resilienz. Beeinflusst durch Beziehungen, Selbstmitgefuehl, Grenzen.',
      aufladen: ['Quality Time mit geliebten Menschen', 'Dankbarkeits-Praxis', 'Grenzen setzen', 'Nein sagen', 'Kreative Ausdruecke'],
      warnsignale: ['Reizbarkeit', 'Emotionale Taubheit', 'Zynismus', 'Ueberreaktion auf Kleinigkeiten'],
    },
    {
      id: 'mental',
      label: 'Mentale Energie',
      icon: '🧠',
      farbe: '#3b82f6',
      beschreibung: 'Deine Konzentrationsfaehigkeit und kognitive Schaerfe. Beeinflusst durch Fokus-Phasen, Pausen, Stimulation.',
      aufladen: ['Deep Work Bloecke mit Pausen', 'Stimulations-Pausen (Stille)', 'Meditation', 'Natur-Kontakt', 'Entscheidungen reduzieren'],
      warnsignale: ['Konzentrationsprobleme', 'Vergesslichkeit', 'Decision Fatigue', 'Brain Fog'],
    },
    {
      id: 'spirituell',
      label: 'Spirituelle Energie',
      icon: '✨',
      farbe: '#8b5cf6',
      beschreibung: 'Dein Sinn-Gefuehl und deine Werte-Verbindung. Beeinflusst durch Purpose, Werte-Alignment, Reflexion.',
      aufladen: ['Sinnvolle Arbeit', 'Werte-Reflexion', 'Ehrenamt / Helfen', 'Journaling', 'Meditation / Stille'],
      warnsignale: ['Sinnlosigkeit', 'Innere Leere', 'Frage "Wofuer mache ich das?"', 'Entfremdung von eigenen Werten'],
    },
  ],
  tracking_template: {
    zeiten: ['06:00', '07:00', '08:00', '09:00', '10:00', '11:00', '12:00', '13:00', '14:00', '15:00', '16:00', '17:00', '18:00', '19:00', '20:00', '21:00', '22:00'],
    skala: { min: 1, max: 10, labels: ['Voellig leer', 'Sehr niedrig', 'Niedrig', 'Unter Durchschnitt', 'Mittel', 'Ueber Durchschnitt', 'Gut', 'Sehr gut', 'Hoch', 'Volle Energie'] },
  },
};

// ---------------------------------------------------------------------------
// 12. GRENZ_SKRIPTE — 5 Skripte fuer Nein-Sagen
// ---------------------------------------------------------------------------
export const GRENZ_SKRIPTE = {
  titel: 'Grenz-Skripte: 5 Wege Nein zu sagen',
  beschreibung: 'Grenzen setzen ist eine Faehigkeit. Diese 5 Skripte helfen dir, in verschiedenen Situationen klar und respektvoll Nein zu sagen.',
  skripte: [
    {
      id: 1,
      situation: 'Dein Chef fragt am Freitagabend nach einem Report fuer Montag',
      gegenueber: 'Chef',
      titel: 'Die Transparenz-Methode',
      skript: 'Ich verstehe, dass der Report wichtig ist. Ich kann ihn Montag frueh als Erstes liefern — dann mit voller Konzentration und Qualitaet. Soll ich ihn bis 10 Uhr fertig haben?',
      erklaerung: 'Du sagst nicht Nein zum Report — du sagst Nein zum Zeitpunkt. Das zeigt Verantwortung UND Grenzbewusstsein.',
    },
    {
      id: 2,
      situation: 'Ein Kollege bittet dich, sein Projekt zu uebernehmen, waehrend du eigene Deadlines hast',
      gegenueber: 'Kollegen',
      titel: 'Die Empathische Absage',
      skript: 'Ich sehe, dass du unter Druck stehst, und ich wuerde gerne helfen. Leider habe ich selbst diese Woche [X] und [Y] auf dem Tisch. Kann ich dir naechste Woche dabei helfen? Oder sollen wir zusammen mit [Name] schauen, ob jemand anderes einspringen kann?',
      erklaerung: 'Du zeigst Verstaendnis, bist ehrlich ueber deine Kapazitaet und bietest eine Alternative. Kein Schuldgefuehl noetig.',
    },
    {
      id: 3,
      situation: 'Ein Kunde ruft am Wochenende an mit einer "dringenden" Anfrage',
      gegenueber: 'Kunden',
      titel: 'Die Professionelle Grenze',
      skript: 'Danke fuer Ihren Anruf. Ich nehme Ihr Anliegen ernst. Meine regulaeren Arbeitszeiten sind Montag bis Freitag, 9-17 Uhr. Ich werde mich Montag frueh als Erstes darum kuemmern. Fuer echte Notfaelle erreichen Sie unseren Service unter [Nummer].',
      erklaerung: 'Klare Grenze + Loesung + Notfall-Alternative = professionell und respektvoll. Kunden respektieren Grenzen mehr als Dauerverfuegbarkeit.',
    },
    {
      id: 4,
      situation: 'Deine Familie beschwert sich, dass du zu viel arbeitest',
      gegenueber: 'Familie',
      titel: 'Die Ehrliche Antwort',
      skript: 'Ihr habt recht. Ich habe in letzter Zeit zu viel gearbeitet und zu wenig fuer euch da. Ich moechte das aendern. Ab heute: [konkreter Vorschlag — z.B. Handy ab 19 Uhr aus, Samstag = Familientag]. Haltet mich daran fest.',
      erklaerung: 'Keine Verteidigung, keine Ausrede. Anerkennung + konkreter Plan + Erlaubnis zur Kontrolle. Das schafft Vertrauen.',
    },
    {
      id: 5,
      situation: 'Du selbst sagst dir: "Nur noch diese eine Sache, dann hoere ich auf"',
      gegenueber: 'Selbst',
      titel: 'Die Selbst-Intervention',
      skript: 'Stopp. Ich kenne dieses Muster. "Nur noch eine Sache" wird zu drei Stunden. Mein Shutdown-Ritual startet JETZT. Die Aufgabe steht auf meiner Tomorrow-Liste. Morgen mit frischem Kopf.',
      erklaerung: 'Die schwierigste Grenze ist die gegen dich selbst. Die Selbst-Intervention erkennt das Muster und bricht es mit einem festen Ritual.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 13. MODUL_QUIZ_BALANCE — Quizzes fuer Module 1-11
// ---------------------------------------------------------------------------
export const MODUL_QUIZ_BALANCE = {
  modul_1: {
    titel: 'Quiz: Was ist Work-Life-Balance wirklich?',
    fragen: [
      {
        id: 1,
        frage: 'Was bedeutet Work-Life-Balance NICHT?',
        optionen: [
          'Exakt 50% Arbeit und 50% Freizeit',
          'Eine flexible Verteilung, die sich gut anfuehlt',
          'Ein dynamisches Gleichgewicht, das sich veraendert',
        ],
        korrekt: 0,
      },
      {
        id: 2,
        frage: 'Was ist die zentrale Botschaft aus Markus\' Geschichte?',
        optionen: [
          'Man sollte weniger arbeiten',
          'Karriere-Erfolg ohne Balance fuehrt zum Zusammenbruch',
          'CEOs haben besonders viel Stress',
        ],
        korrekt: 1,
      },
      {
        id: 3,
        frage: 'Warum ist "Perfektion" in der Balance unmoeglich?',
        optionen: [
          'Weil sich Lebenssituationen staendig aendern und Balance ein dynamischer Prozess ist',
          'Weil manche Menschen einfach nicht dafuer gemacht sind',
          'Weil die Arbeitswelt sich nicht aendern wird',
        ],
        korrekt: 0,
      },
    ],
  },

  modul_2: {
    titel: 'Quiz: Das Lebensrad',
    fragen: [
      {
        id: 1,
        frage: 'Welche 4 Bereiche umfasst das Lebensrad in diesem Kurs?',
        optionen: [
          'Karriere, Gesundheit, Beziehungen, Persoenliches Wachstum',
          'Arbeit, Sport, Schlaf, Essen',
          'Chef, Team, Kunden, Familie',
        ],
        korrekt: 0,
      },
      {
        id: 2,
        frage: 'Was zeigt ein Lebensrad mit stark unterschiedlichen Werten?',
        optionen: [
          'Dass man besonders kreativ ist',
          'Ein Ungleichgewicht zwischen den Lebensbereichen',
          'Dass man sich auf eine Sache konzentriert',
        ],
        korrekt: 1,
      },
    ],
  },

  modul_3: {
    titel: 'Quiz: Stress verstehen',
    fragen: [
      {
        id: 1,
        frage: 'Was ist Eustress?',
        optionen: [
          'Positiver, kurzzeitiger Stress der aktiviert und motiviert',
          'Eine Form von chronischem Stress',
          'Stress durch europaeische Arbeitsgesetze',
        ],
        korrekt: 0,
      },
      {
        id: 2,
        frage: 'Was passiert bei chronischem Stress im Gehirn?',
        optionen: [
          'Das Gehirn wird leistungsfaehiger',
          'Cortisol bleibt dauerhaft erhoeht und beschaedigt Hippocampus-Neuronen',
          'Adrenalin wird dauerhaft ausgeschuettet',
        ],
        korrekt: 1,
      },
      {
        id: 3,
        frage: 'Wie lange dauert es, bis sich der Koerper nach akutem Stress normalisiert?',
        optionen: [
          '5 Minuten',
          '20-60 Minuten',
          '24 Stunden',
        ],
        korrekt: 1,
      },
    ],
  },

  modul_4: {
    titel: 'Quiz: Grenzen setzen',
    fragen: [
      {
        id: 1,
        frage: 'Was ist ein Shutdown-Ritual?',
        optionen: [
          'Den Computer herunterfahren',
          'Ein festes Ritual, das dem Gehirn signalisiert, dass die Arbeit vorbei ist',
          'Eine Technik zum Einschlafen',
        ],
        korrekt: 1,
      },
      {
        id: 2,
        frage: 'Was war Sarahs Problem in der Geschichte?',
        optionen: [
          'Sie hatte zu viel Arbeit',
          'Sie konnte nicht aufhoeren — sie hatte kein Aufhoer-Ritual',
          'Ihr Partner hat sie nicht unterstuetzt',
        ],
        korrekt: 1,
      },
      {
        id: 3,
        frage: 'Was ist der Zeigarnik-Effekt?',
        optionen: [
          'Unerledigte Aufgaben bleiben im Arbeitsgedaechtnis aktiv und stoeren die Erholung',
          'Man wird durch Zeitmangel produktiver',
          'Ein russischer Produktivitaets-Hack',
        ],
        korrekt: 0,
      },
    ],
  },

  modul_5: {
    titel: 'Quiz: Energie-Management',
    fragen: [
      {
        id: 1,
        frage: 'Welche 4 Energie-Typen gibt es nach Loehr & Schwartz?',
        optionen: [
          'Physische, Emotionale, Mentale, Spirituelle Energie',
          'Morgen-, Mittag-, Abend-, Nacht-Energie',
          'Positive, Negative, Neutrale, Explosive Energie',
        ],
        korrekt: 0,
      },
      {
        id: 2,
        frage: 'Warum ist Energie-Management wichtiger als Zeitmanagement?',
        optionen: [
          'Weil Zeit endlich ist, aber Energie erneuerbar',
          'Weil Uhren ungenau sind',
          'Weil Zeitmanagement veraltet ist',
        ],
        korrekt: 0,
      },
    ],
  },

  modul_6: {
    titel: 'Quiz: Micro-Recovery',
    fragen: [
      {
        id: 1,
        frage: 'Warum reicht Urlaub NICHT fuer Erholung?',
        optionen: [
          'Weil Erholung taeglich passieren muss — nicht nur 2x im Jahr',
          'Weil Urlaub zu kurz ist',
          'Weil man im Urlaub nicht wirklich entspannt',
        ],
        korrekt: 0,
      },
      {
        id: 2,
        frage: 'Was ist der Physiologische Seufzer?',
        optionen: [
          'Doppelt einatmen, lang ausatmen — die schnellste Beruhigungstechnik',
          'Laut seufzen wenn man gestresst ist',
          'Eine Atemtechnik fuer den Sport',
        ],
        korrekt: 0,
      },
      {
        id: 3,
        frage: 'Wie lange muss Naturkontakt dauern, um Cortisol messbar zu senken?',
        optionen: [
          '30 Minuten',
          '3 Minuten',
          '1 Stunde',
        ],
        korrekt: 1,
      },
    ],
  },

  modul_7: {
    titel: 'Quiz: Koerper & Geist',
    fragen: [
      {
        id: 1,
        frage: 'Wie viele Stunden Schlaf empfehlen Schlafforscher fuer Erwachsene?',
        optionen: [
          '5-6 Stunden',
          '7-8 Stunden',
          '9-10 Stunden',
        ],
        korrekt: 1,
      },
      {
        id: 2,
        frage: 'Was passiert bei weniger als 6 Stunden Schlaf?',
        optionen: [
          'Man wird langfristig produktiver',
          'Die Gedaechtnisleistung sinkt um bis zu 40%',
          'Es hat keine messbaren Auswirkungen',
        ],
        korrekt: 1,
      },
    ],
  },

  modul_8: {
    titel: 'Quiz: Digitale Entgiftung',
    fragen: [
      {
        id: 1,
        frage: 'Was ist Revenge Bedtime Procrastination?',
        optionen: [
          'Absichtlich laenger wach bleiben, um sich "gestohlene" Freizeit zurueckzuholen',
          'Aus Rache spaet ins Bett gehen',
          'Ein Schlafmittel einnehmen',
        ],
        korrekt: 0,
      },
      {
        id: 2,
        frage: 'Was ist die effektivste Massnahme gegen Handy-Nutzung im Bett?',
        optionen: [
          'Nachtmodus aktivieren',
          'Das Handy in einem anderen Raum laden',
          'Benachrichtigungen ausschalten',
        ],
        korrekt: 1,
      },
      {
        id: 3,
        frage: 'Was ist die Ursache von Revenge Bedtime Procrastination?',
        optionen: [
          'Zu viel Kaffee',
          'Fehlende "Me-Time" am Tag — die Nacht wird als Kompensation genutzt',
          'Schlaflosigkeit',
        ],
        korrekt: 1,
      },
    ],
  },

  modul_9: {
    titel: 'Quiz: Beziehungen pflegen',
    fragen: [
      {
        id: 1,
        frage: 'Wie lautet die Gottman-Ratio fuer stabile Beziehungen?',
        optionen: [
          '1:1 — gleich viele positive und negative Interaktionen',
          '5:1 — mindestens 5 positive auf 1 negative Interaktion',
          '10:1 — keine Konflikte erlaubt',
        ],
        korrekt: 1,
      },
      {
        id: 2,
        frage: 'Was ist eine typische "Abhebung" vom Beziehungs-Konto?',
        optionen: [
          'Verabredungen wegen Arbeit absagen',
          'Aktiv zuhoeren',
          'Kleine Aufmerksamkeiten',
        ],
        korrekt: 0,
      },
    ],
  },

  modul_10: {
    titel: 'Quiz: Burnout-Praevention',
    fragen: [
      {
        id: 1,
        frage: 'Wie viele Burnout-Stufen beschreibt das Modell von Freudenberger & North?',
        optionen: [
          '5 Stufen',
          '8 Stufen',
          '12 Stufen',
        ],
        korrekt: 2,
      },
      {
        id: 2,
        frage: 'Ab welcher Stufe sollte man SOFORT professionelle Hilfe suchen?',
        optionen: [
          'Ab Stufe 4',
          'Ab Stufe 8',
          'Erst bei Stufe 12',
        ],
        korrekt: 1,
      },
      {
        id: 3,
        frage: 'Was ist die erste Burnout-Stufe?',
        optionen: [
          'Depression',
          'Zwang sich zu beweisen (uebertriebener Ehrgeiz)',
          'Sozialer Rueckzug',
        ],
        korrekt: 1,
      },
    ],
  },

  modul_11: {
    titel: 'Quiz: Identity Shift',
    fragen: [
      {
        id: 1,
        frage: 'Was war Thomas\' Problem in der Geschichte?',
        optionen: [
          'Er hat seinen Job verloren',
          'Er hatte seine gesamte Identitaet an seinen Jobtitel gekoppelt',
          'Er konnte keine neue Stelle finden',
        ],
        korrekt: 1,
      },
      {
        id: 2,
        frage: 'Was ist ein "Identity Shift"?',
        optionen: [
          'Sich eine neue Identitaet erfinden',
          'Die bewusste Entscheidung, sich nicht ausschliesslich ueber den Job zu definieren',
          'Den Job wechseln',
        ],
        korrekt: 1,
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 14. JOURNAL_FRAGEN_BALANCE — Reflexionsfragen pro Modul
// ---------------------------------------------------------------------------
export const JOURNAL_FRAGEN_BALANCE = {
  titel: 'Reflexions-Journal',
  beschreibung: 'Beantworte eine Frage pro abgeschlossenem Modul. Ehrliche Reflexion ist der schnellste Weg zur Veraenderung.',
  fragen: [
    { modul: 1, frage: 'Was bedeutet "Balance" fuer DICH persoenlich — und wie weit bist du davon entfernt?' },
    { modul: 2, frage: 'Welcher Bereich in deinem Lebensrad ist am schwaechsten — und was koenntest du DIESE WOCHE dafuer tun?' },
    { modul: 3, frage: 'In welcher Zone steht deine Stress-Ampel gerade — und was ist der groesste Stressor?' },
    { modul: 4, frage: 'Hast du heute einen klaren Feierabend gehabt? Was hat dir geholfen (oder gefehlt)?' },
    { modul: 5, frage: 'Welcher deiner 4 Energie-Typen ist gerade am niedrigsten? Was koenntest du morgen aendern?' },
    { modul: 6, frage: 'Welche Micro-Recovery Technik hat dir am besten geholfen? Hast du sie heute angewendet?' },
    { modul: 7, frage: 'Wie viele Stunden hast du letzte Nacht geschlafen? Wie hat sich das auf deinen Tag ausgewirkt?' },
    { modul: 8, frage: 'Wann hast du gestern dein Handy das letzte Mal vor dem Einschlafen benutzt?' },
    { modul: 9, frage: 'Wem koenntest du HEUTE eine ehrliche Dankes-Nachricht schreiben?' },
    { modul: 10, frage: 'Auf welcher Burnout-Stufe siehst du dich gerade? Sei ehrlich.' },
    { modul: 11, frage: 'Wer bist du, wenn niemand nach deinem Beruf fragt? Nenne 3 Dinge.' },
    { modul: 12, frage: 'Was ist dein wichtigstes Takeaway aus diesem Kurs — und was ist dein erster konkreter Schritt?' },
  ],
};

// ---------------------------------------------------------------------------
// 15. ABSCHLUSSTEST_BALANCE — 10 Multiple-Choice-Fragen
// ---------------------------------------------------------------------------
export const ABSCHLUSSTEST_BALANCE = {
  titel: 'Abschlusstest: Work-Life-Balance',
  beschreibung: 'Beantworte mindestens 7 von 10 Fragen richtig, um das Zertifikat zu erhalten.',
  bestanden_ab: 7,
  fragen: [
    {
      id: 1,
      frage: 'Was unterscheidet Eustress von Distress?',
      optionen: [
        'Eustress ist positiver, kurzzeitiger Stress, der motiviert. Distress ist negativer Stress, der schadet.',
        'Eustress kommt von europaeischen Unternehmen.',
        'Es gibt keinen Unterschied.',
        'Eustress betrifft nur den Koerper, Distress nur den Geist.',
      ],
      korrekt: 0,
      erklaerung: 'Eustress aktiviert und motiviert kurzzeitig. Distress (besonders chronisch) schaedigt Koerper und Geist langfristig.',
    },
    {
      id: 2,
      frage: 'Was ist die Gottman-Ratio fuer stabile Beziehungen?',
      optionen: [
        '1:1',
        '3:1',
        '5:1',
        '10:1',
      ],
      korrekt: 2,
      erklaerung: 'John Gottman fand: Stabile Beziehungen haben mindestens 5 positive Interaktionen auf 1 negative.',
    },
    {
      id: 3,
      frage: 'Was ist Revenge Bedtime Procrastination?',
      optionen: [
        'Ein Schlafmittel',
        'Absichtliches Wachbleiben um "gestohlene" Freizeit zu kompensieren',
        'Eine Bestrafung fuer spaetes Zubettgehen',
        'Eine Technik gegen Schlaflosigkeit',
      ],
      korrekt: 1,
      erklaerung: 'Wenn der Tag keine Me-Time bietet, "stehlen" Menschen sich die Nacht — auf Kosten ihres Schlafs.',
    },
    {
      id: 4,
      frage: 'Wie viele Burnout-Stufen beschreibt das Modell nach Freudenberger?',
      optionen: [
        '5',
        '8',
        '10',
        '12',
      ],
      korrekt: 3,
      erklaerung: 'Das Freudenberger-North-Modell beschreibt 12 Stufen von "Zwang sich zu beweisen" bis "Voellige Erschoepfung".',
    },
    {
      id: 5,
      frage: 'Was ist ein Shutdown-Ritual?',
      optionen: [
        'Den Computer herunterfahren',
        'Ein festes Ritual, das dem Gehirn signalisiert: Die Arbeit ist vorbei',
        'Ein Kuendigungs-Gespraech',
        'Eine Meditationstechnik',
      ],
      korrekt: 1,
      erklaerung: 'Ein Shutdown-Ritual (nach Cal Newport) gibt dem Gehirn ein klares Signal zum Abschalten und verhindert, dass Arbeitsgedanken den Feierabend dominieren.',
    },
    {
      id: 6,
      frage: 'Welche 4 Energie-Typen beschreiben Loehr & Schwartz?',
      optionen: [
        'Physische, Emotionale, Mentale, Spirituelle Energie',
        'Positive, Negative, Neutrale, Explosive Energie',
        'Morgen-, Tag-, Abend-, Nacht-Energie',
        'Koerper-, Geist-, Seelen-, Willens-Energie',
      ],
      korrekt: 0,
      erklaerung: 'Jim Loehr und Tony Schwartz identifizierten 4 Energie-Quellen, die alle aktiv gemanagt werden muessen.',
    },
    {
      id: 7,
      frage: 'Wie lange muss Naturkontakt mindestens dauern, um Cortisol messbar zu senken?',
      optionen: [
        '30 Sekunden',
        '3 Minuten',
        '20 Minuten',
        '1 Stunde',
      ],
      korrekt: 1,
      erklaerung: 'Studien zeigen: Bereits 3 Minuten bewusster Naturkontakt senken Cortisol messbar.',
    },
    {
      id: 8,
      frage: 'Was ist der Zeigarnik-Effekt?',
      optionen: [
        'Man vergisst erledigte Aufgaben schnell',
        'Unerledigte Aufgaben bleiben im Arbeitsgedaechtnis aktiv und stoeren die Erholung',
        'Man wird unter Zeitdruck produktiver',
        'Ein russischer Zeitmanagement-Ansatz',
      ],
      korrekt: 1,
      erklaerung: 'Die Psychologin Bluma Zeigarnik fand: Unerledigte Aufgaben belasten das Arbeitsgedaechtnis. Die Loesung: Aufschreiben und bewusst abschliessen.',
    },
    {
      id: 9,
      frage: 'Was ist der wichtigste Rat bei Burnout-Stufe 8 oder hoeher?',
      optionen: [
        'Mehr Urlaub nehmen',
        'Sofort professionelle Hilfe suchen',
        'Die Arbeitszeit reduzieren',
        'Meditation anfangen',
      ],
      korrekt: 1,
      erklaerung: 'Ab Stufe 8 ist professionelle Hilfe (Arzt, Therapeut) DRINGEND noetig. Das ist kein Kurs-Thema mehr, sondern ein medizinischer Notfall.',
    },
    {
      id: 10,
      frage: 'Was ist der Kern von "Identity Shift"?',
      optionen: [
        'Einen neuen Job suchen',
        'Sich bewusst NICHT ausschliesslich ueber den Job definieren',
        'Die Persoenlichkeit aendern',
        'Mehr Hobbys anfangen',
      ],
      korrekt: 1,
      erklaerung: 'Identity Shift bedeutet: Eine gesunde Identitaet hat mehrere Standbeine. Wer sich nur ueber den Job definiert, steht vor einem Abgrund, wenn der Job wegfaellt.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 16. RUECKFALL_BALANCE — 5 Warnsignale + Reset-Protokoll
// ---------------------------------------------------------------------------
export const RUECKFALL_BALANCE = {
  warnsignale: [
    'Du checkst wieder regelmaessig E-Mails nach Feierabend',
    'Dein Shutdown-Ritual ist "eingeschlafen"',
    'Du sagst oefter "Ich habe keine Zeit fuer Sport/Freunde/Hobbys"',
    'Du schlaefst wieder weniger als 7 Stunden',
    'Du fuehst dich schuldig, wenn du NICHT arbeitest',
  ],
  reset: {
    schritt_1: 'Starte HEUTE dein Shutdown-Ritual. Egal wie spaet es ist.',
    schritt_2: 'Handy ab JETZT in der Kueche laden. Nicht im Schlafzimmer.',
    schritt_3: 'Blockiere MORGEN 30 Minuten nur fuer dich im Kalender.',
    schritt_4: 'Schreibe JETZT einer wichtigen Person eine Dankes-Nachricht.',
  },
};

// ---------------------------------------------------------------------------
// 17. MICRO_LEARNINGS_BALANCE — 90-Tage Impulse
// ---------------------------------------------------------------------------
export const MICRO_LEARNINGS_BALANCE = [
  { tag: 1, impuls: 'Fuehre heute dein erstes Shutdown-Ritual durch. Sage laut: "Feierabend."', typ: 'aktion' },
  { tag: 2, impuls: 'Tracke heute dein Energielevel stuendlich (1-10). Wo sind deine Peaks und Tiefs?', typ: 'beobachtung' },
  { tag: 3, impuls: 'Probiere den Physiologischen Seufzer 3x heute aus. Wann wirkt er am besten?', typ: 'technik' },
  { tag: 5, impuls: 'Schreibe 3 Menschen eine Dankes-Nachricht. Ohne Anlass. Einfach so.', typ: 'beziehungen' },
  { tag: 7, impuls: 'Erste Wochen-Reflexion: Wie oft hast du diese Woche einen echten Feierabend gehabt?', typ: 'reflexion' },
  { tag: 10, impuls: 'Ist dein Handy noch im Schlafzimmer? Wenn ja: HEUTE in die Kueche umziehen.', typ: 'aktion' },
  { tag: 14, impuls: '2-Wochen-Check: Fuelle dein Lebensrad erneut aus. Hat sich etwas veraendert?', typ: 'meilenstein' },
  { tag: 21, impuls: 'Wie steht dein Beziehungs-Konto? Hast du diese Woche mehr ein- oder ausgezahlt?', typ: 'beziehungen' },
  { tag: 30, impuls: 'Monats-Check: Wie hat sich dein Schlaf veraendert? Dein Stresslevel? Deine Beziehungen?', typ: 'meilenstein' },
  { tag: 60, impuls: 'Halbzeit! Welche Gewohnheit aus dem Kurs hast du beibehalten? Welche nicht?', typ: 'reflexion' },
  { tag: 90, impuls: 'Finaler Check: Fuelle die Selbstdiagnose erneut aus. Vergleiche mit Tag 1. Teile dein Ergebnis!', typ: 'abschluss' },
];

// ---------------------------------------------------------------------------
// 18. EVIDENZ_BALANCE — Wissenschaftliche Quellen
// ---------------------------------------------------------------------------
export const EVIDENZ_BALANCE = {
  quellen: [
    { autor: 'Freudenberger, H.J.', jahr: 1974, erkenntnis: 'Erstbeschreibung des Burnout-Syndroms. 12-Stufen-Modell der Erschoepfung (mit Gail North weiterentwickelt).' },
    { autor: 'Maslach, C.', jahr: 1981, erkenntnis: 'Maslach Burnout Inventory (MBI). 3 Dimensionen: Emotionale Erschoepfung, Depersonalisation, reduzierte Leistungsfaehigkeit.' },
    { autor: 'Loehr, J. & Schwartz, T.', jahr: 2003, erkenntnis: 'The Power of Full Engagement: 4 Energie-Quellen (physisch, emotional, mental, spirituell). Energie-Management > Zeitmanagement.' },
    { autor: 'Gottman, J.', jahr: 1994, erkenntnis: 'Die 5:1 Ratio: Stabile Beziehungen haben mindestens 5 positive Interaktionen auf 1 negative.' },
    { autor: 'Walker, M.', jahr: 2017, erkenntnis: 'Why We Sleep: Weniger als 6h Schlaf reduziert Gedaechtnisleistung um 40%, erhoeht Herzkrankheitsrisiko um 200%, schwaeche das Immunsystem.' },
    { autor: 'Huberman, A.', jahr: 2021, erkenntnis: 'Physiologischer Seufzer: Doppeltes Einatmen + langes Ausatmen ist die schnellste bekannte Methode zur Beruhigung des Nervensystems.' },
    { autor: 'Newport, C.', jahr: 2016, erkenntnis: 'Deep Work & Shutdown Ritual: Ein festes Feierabend-Ritual verbessert die kognitive Erholung und die Arbeitsqualitaet am naechsten Tag.' },
    { autor: 'Zeigarnik, B.', jahr: 1927, erkenntnis: 'Zeigarnik-Effekt: Unerledigte Aufgaben bleiben im Arbeitsgedaechtnis aktiv und stoeren die Erholung.' },
  ],
};
