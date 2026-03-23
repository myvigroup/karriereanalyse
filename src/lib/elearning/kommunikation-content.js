// ============================================================================
// Kommunikation E-Learning — Complete Content Data
// ============================================================================

// ---------------------------------------------------------------------------
// 1. SELBSTDIAGNOSE_KOMM — 10 Fragen, Scoring 1-5, 3 Ergebnis-Stufen
// ---------------------------------------------------------------------------
export const SELBSTDIAGNOSE_KOMM = {
  titel: 'Selbstdiagnose: Wie gut kommunizierst du?',
  beschreibung:
    'Beantworte die folgenden 10 Fragen ehrlich. Es gibt keine richtigen oder falschen Antworten — nur dein persönlicher Ist-Zustand.',
  skala: {
    min: 1,
    max: 5,
    labels: ['Trifft gar nicht zu', 'Trifft selten zu', 'Teils-teils', 'Trifft oft zu', 'Trifft voll zu'],
  },
  fragen: [
    { id: 1, text: 'Ich kann komplexe Sachverhalte einfach und verständlich erklären.', kategorie: 'klarheit' },
    { id: 2, text: 'Ich höre aktiv zu und fasse zusammen, bevor ich antworte.', kategorie: 'zuhoeren' },
    { id: 3, text: 'Ich gebe regelmäßig konstruktives Feedback.', kategorie: 'feedback' },
    { id: 4, text: 'Ich achte bewusst auf meine Körpersprache.', kategorie: 'koerpersprache' },
    { id: 5, text: 'Meine E-Mails sind klar, kurz und haben eine klare Handlungsaufforderung.', kategorie: 'schriftlich' },
    { id: 6, text: 'Ich beherrsche digitale Kommunikation (Slack, Video-Calls).', kategorie: 'digital' },
    { id: 7, text: 'Ich fühle mich sicher bei Präsentationen.', kategorie: 'praesentation' },
    { id: 8, text: 'Ich kann Konflikte souverän und sachlich klären.', kategorie: 'konflikt' },
    { id: 9, text: 'Ich kann mit Fremden leicht ins Gespräch kommen.', kategorie: 'smalltalk' },
    { id: 10, text: 'Ich kenne meine Kommunikationsstärken und -schwächen.', kategorie: 'selbstbild' },
  ],
  ergebnisse: [
    {
      id: 'chaos',
      range: [10, 20],
      titel: 'Kommunikations-Chaos',
      beschreibung:
        'Du kommunizierst oft auf Autopilot und wunderst dich, warum Missverständnisse entstehen. Keine Sorge — die meisten Menschen haben nie gelernt, wie Kommunikation wirklich funktioniert. Dieser Kurs gibt dir ein komplettes System.',
      empfehlung:
        'Starte unbedingt mit Modul 1 (4-Ohren-Modell) und arbeite dich Schritt für Schritt durch. Besonders Modul 2 (Aktives Zuhören) und Modul 5 (Feedback) werden dir sofort helfen.',
    },
    {
      id: 'reaktiv',
      range: [21, 35],
      titel: 'Reaktiv-Kommunikator',
      beschreibung:
        'Du hast bereits ein Gespür für gute Kommunikation, aber unter Stress fällst du in alte Muster zurück. Du hörst zu, aber nicht immer aktiv. Du gibst Feedback, aber nicht immer konstruktiv.',
      empfehlung:
        'Fokussiere dich auf die Module 5 (Feedback), 6 (Konfliktlösung) und 7 (Präsentation). Hier liegt dein größtes Hebelpotenzial.',
    },
    {
      id: 'proaktiv',
      range: [36, 50],
      titel: 'Proaktiv-Kommunikator',
      beschreibung:
        'Du kommunizierst bereits bewusst und effektiv. Dieser Kurs wird dir helfen, die letzten 20 % herauszuholen — besonders in Stress-Situationen und bei schwierigen Gesprächen.',
      empfehlung:
        'Springe direkt zu den Modulen, die dich am meisten interessieren. Die Boss-Fights und die Module 8 (Digitale Kommunikation) und 10 (Stimme & Wirkung) bringen dir den meisten Mehrwert.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 2. STORIES — Emotionale Geschichten pro Modul
// ---------------------------------------------------------------------------
export const STORIES = {
  modul_1: {
    titel: 'Das Meeting, das alles veränderte',
    untertitel: 'Warum ein einziger Satz eine ganze Karriere beeinflussen kann',
    inhalt: `Sarah, 29, Junior Projektmanagerin. Ihr erstes großes Projekt. Der Zeitplan war von Anfang an zu ehrgeizig — das wusste jeder im Team. Aber niemand sagte etwas.

Bis zum Projekt-Review-Meeting. 12 Leute im Raum. Der Chef fragt: "Sind wir on track?"

Stille. Sarah räuspert sich. "Der Zeitplan ist unrealistisch."

Was Sarah meinte: SACHINHALT — "Die Deadlines sind zu eng. Wir brauchen 2 Wochen mehr."

Was der Chef hörte: BEZIEHUNGSOHR — "Du hast schlecht geplant. Du bist inkompetent."

Was passierte: Der Chef wurde rot. "Wenn du den Job nicht schaffst, finden wir jemand anderen." Das Meeting war vorbei. Sarah war geschockt.

3 Tage Funkstille. Dann erfuhr Sarah vom 4-Ohren-Modell in einem Workshop. Sie verstand: Der gleiche Satz — vier verschiedene Botschaften. Sie bat um ein Einzelgespräch.

"Ich schätze Ihre Planung. Mir ist aufgefallen, dass wir bei den Testphasen eine Lücke haben. Darf ich einen Vorschlag machen?"

Der Chef hörte diesmal: SACHINHALT + APPELL. Er stimmte zu. Das Projekt wurde erfolgreich — mit 10 Tagen Puffer.

Sarahs Lektion: Es reicht nicht, Recht zu haben. Du musst so kommunizieren, dass es auf dem richtigen Ohr ankommt.`,
  },

  modul_5: {
    titel: 'Das Feedback, das zur Beförderung führte',
    untertitel: 'Warum ehrliches Feedback das größte Geschenk ist',
    inhalt: `Lisa, 34, Senior Designerin. Neuer Kollege Tom, 26, frisch von der Uni. Talentiert, aber seine Präsentationen waren chaotisch. Kunden waren verwirrt. Das Team tuschelte.

Jeder gab Tom das gleiche Feedback: "War gut!" "Passt schon!" "Weiter so!"

Nicht Lisa. Nach seiner dritten Präsentation bat sie ihn zum Kaffee.

"Tom, darf ich dir ehrliches Feedback geben?" — "Klar."

"SITUATION: In der Kundenpräsentation heute, als du die drei Design-Optionen vorgestellt hast... BEHAVIOR: ...hast du alle drei gleichzeitig auf einer Folie gezeigt und 15 Minuten ohne Pause geredet. IMPACT: Der Kunde konnte sich nicht entscheiden und hat das Meeting frustriert verlassen."

Tom wurde still. Dann: "Warum sagt mir das sonst niemand?"

Lisa half ihm. Struktur. Storytelling. Eine Option pro Folie. Pause nach jeder. Frage ans Publikum.

Nächste Präsentation: Der Kunde unterschrieb sofort.

2 Jahre später. Tom ist Team Lead. Bei seiner Antrittsrede sagt er: "Ich möchte einer Person besonders danken. Lisa war die einzige, die ehrlich war. Alle anderen waren nett. Lisa war hilfreich. Das ist ein Unterschied."

Lisas Lektion: Nett sein ist einfach. Ehrlich sein erfordert Mut. SBI-Feedback ist der Rahmen, der Ehrlichkeit konstruktiv macht.`,
  },

  modul_7: {
    titel: 'Die 90-Sekunden-Präsentation',
    untertitel: 'Wie ein Aufzug eine Karriere beschleunigen kann',
    inhalt: `Marc, 31, Produktmanager in einem Konzern. 2.000 Mitarbeiter. Den CEO hatte er einmal bei der Weihnachtsfeier aus der Ferne gesehen. Das war's.

Dienstagmorgen, 8:47 Uhr. Aufzug. Marc drückt "7". Die Tür öffnet sich. Der CEO steigt ein. Drückt "12". Sie sind allein.

5 Stockwerke. Circa 90 Sekunden.

Marcs Gehirn: PANIK. "Sag was! Nein, sag nichts! Er kennt dich nicht! Das wird peinlich!"

Aber Marc hatte seinen Elevator Pitch vorbereitet. Nicht weil er diesen Moment erwartet hatte — sondern weil er in Modul 7 gelernt hatte: Gelegenheiten kommen unerwartet. Vorbereitung ist alles.

"Guten Morgen! Ich bin Marc aus dem Produktteam. Wir arbeiten gerade an einem Feature, das unsere Kunden-Onboarding-Zeit von 14 auf 3 Tage reduzieren könnte. Das würde circa 2 Millionen Euro Supportkosten pro Jahr sparen."

Der CEO: "14 auf 3 Tage? Wie?"

Marc: "Wir automatisieren die 5 häufigsten Kundenanfragen mit einem Self-Service-Portal. Der Prototyp steht. Wir bräuchten nur grünes Licht für den Piloten."

DING. Stockwerk 12.

Der CEO zückt sein Handy. "Schicken Sie mir eine Seite dazu. Heute noch."

3 Wochen später saß Marc im Strategie-Meeting. Einziger Nicht-Director im Raum.

Marcs Lektion: Du brauchst keine Stunde, um zu überzeugen. Du brauchst 90 Sekunden — und Vorbereitung. Problem → Lösung → Nutzen. Das ist die Formel.`,
  },
};

// ---------------------------------------------------------------------------
// 3. BOSS_FIGHTS_KOMM — 4 Boss-Fights
// ---------------------------------------------------------------------------
export const BOSS_FIGHTS_KOMM = {
  feedback_tornado: {
    id: 'feedback_tornado',
    name: 'Der Feedback-Tornado',
    beschreibung: 'Gib konstruktives Feedback ohne die Beziehung zu zerstören!',
    user_stat: { name: 'Vertrauens-Level', max: 100 },
    boss_stat: { name: 'Defensive Mauer', max: 100 },
    waves: [
      {
        id: 1,
        name: 'Das Lob-Sandwich',
        boss_sagt: 'Du willst mir sagen, dass mein Report schlecht war? Sag\'s einfach!',
        optionen: [
          {
            id: 'a',
            text: 'Nein nein, war eigentlich ganz gut, ABER...',
            user_delta: -25,
            boss_delta: 0,
            feedback: 'Das Sandwich ist durchschaut. "Aber" löscht alles davor.',
          },
          {
            id: 'b',
            text: 'Mir ist aufgefallen, dass Kapitel 3 die Zahlen von Q2 nutzt statt Q3. [SBI]',
            user_delta: 0,
            boss_delta: 35,
            feedback: 'Spezifisch, sachlich, verbesserungsorientiert. SBI-Feedback perfekt angewendet!',
          },
          {
            id: 'c',
            text: 'Mehrere Leute haben sich beschwert...',
            user_delta: -30,
            boss_delta: 0,
            feedback: '"Mehrere Leute" ist passiv-aggressiv. Wer? Wann? Das erzeugt Paranoia.',
          },
        ],
      },
      {
        id: 2,
        name: 'Die Tränen-Falle',
        boss_sagt: 'Kollegin bricht in Tränen aus nach deinem Feedback.',
        optionen: [
          {
            id: 'a',
            text: 'Oh Gott, vergiss was ich gesagt habe!',
            user_delta: -20,
            boss_delta: 0,
            feedback: 'Du nimmst dein valides Feedback zurück. Das hilft niemandem.',
          },
          {
            id: 'b',
            text: 'Ich sehe, das beschäftigt dich. Möchtest du eine Pause? Wir können morgen weitersprechen.',
            user_delta: 0,
            boss_delta: 40,
            feedback: 'Empathisch aber standhaft. Du respektierst die Emotion ohne das Feedback zu opfern.',
          },
          {
            id: 'c',
            text: 'Jetzt heul doch nicht wegen so was...',
            user_delta: -40,
            boss_delta: 0,
            feedback: 'Emotional invalidierend. Die Beziehung ist beschädigt.',
          },
        ],
      },
      {
        id: 3,
        name: 'Der Gegenangriff',
        boss_sagt: 'Bevor du MIR Feedback gibst — soll ich dir mal sagen, was DEIN Problem ist?',
        optionen: [
          {
            id: 'a',
            text: 'Ok, dann lass hören.',
            user_delta: -15,
            boss_delta: 10,
            feedback: 'Du lässt dich ablenken. Das ursprüngliche Feedback geht unter.',
          },
          {
            id: 'b',
            text: 'Ich höre mir gerne dein Feedback an — gleich nach diesem Gespräch. Lass uns erst hier fertig werden.',
            user_delta: 0,
            boss_delta: 45,
            feedback: 'BOSS BESIEGT! Klare Grenze, respektvoll, Fokus behalten.',
          },
          {
            id: 'c',
            text: 'Ach komm, lenk nicht ab.',
            user_delta: -10,
            boss_delta: 5,
            feedback: 'Konfrontativ. Eskaliert statt zu lösen.',
          },
        ],
      },
    ],
    sieg: {
      badge: 'Feedback-Meister',
      xp: 200,
      text: 'Du hast die Defensive Mauer durchbrochen! Konstruktives Feedback ist deine Superpower.',
    },
    niederlage: {
      text: 'Feedback geben ist schwer. Aber mit der SBI-Methode wird es leichter. Nochmal!',
    },
  },

  konflikt_vulkan: {
    id: 'konflikt_vulkan',
    name: 'Der Konflikt-Vulkan',
    beschreibung: 'Löse einen eskalierenden Teamkonflikt ohne Kollateralschaden!',
    user_stat: { name: 'Deeskalations-Kraft', max: 100 },
    boss_stat: { name: 'Eskalations-Stufe', max: 100 },
    waves: [
      {
        id: 1,
        name: 'Der Seitenhieb',
        boss_sagt: 'Im Meeting sagt ein Kollege: "Manche Leute bereiten sich halt nicht vor..."',
        optionen: [
          {
            id: 'a',
            text: 'Wen meinst du damit?!',
            user_delta: -25,
            boss_delta: 0,
            feedback: 'Eskalation. Jetzt stehen alle Stacheln hoch.',
          },
          {
            id: 'b',
            text: 'Hm, spannender Punkt. Lass uns das konkretisieren: Welche Vorbereitung fehlt dir?',
            user_delta: 0,
            boss_delta: 30,
            feedback: 'Du entschärfst den Angriff und lenkst auf Sachebene.',
          },
          {
            id: 'c',
            text: 'Ignorieren und weiterreden.',
            user_delta: -10,
            boss_delta: 10,
            feedback: 'Kurzfristig ok, aber der Groll schwelt weiter.',
          },
        ],
      },
      {
        id: 2,
        name: 'Die Schuldzuweisung',
        boss_sagt: 'Chef sagt: "Einer von euch hat den Kunden verloren. Wer war das?"',
        optionen: [
          {
            id: 'a',
            text: 'ICH war das nicht!',
            user_delta: -20,
            boss_delta: 0,
            feedback: 'Defensiv. Jetzt verdächtigen dich alle erst recht.',
          },
          {
            id: 'b',
            text: 'Lass uns gemeinsam analysieren, was schiefgelaufen ist, statt einen Schuldigen zu suchen.',
            user_delta: 0,
            boss_delta: 40,
            feedback: 'Lösungsorientiert. Du verschiebst von Schuld auf Lernen.',
          },
          {
            id: 'c',
            text: 'Das war wahrscheinlich Max, der hat die letzte Mail geschrieben.',
            user_delta: -35,
            boss_delta: 0,
            feedback: 'Schuld abwälzen zerstört Vertrauen. Selbst wenn es stimmt.',
          },
        ],
      },
      {
        id: 3,
        name: 'Der Kündigungs-Moment',
        boss_sagt: 'Mitarbeiter sagt: "Wenn sich nichts ändert, bin ich weg!"',
        optionen: [
          {
            id: 'a',
            text: 'Dann geh doch!',
            user_delta: -40,
            boss_delta: 0,
            feedback: 'Ultimatum mit Ultimatum beantworten = Eskalation. Du verlierst einen Mitarbeiter und Gesicht.',
          },
          {
            id: 'b',
            text: 'Ich höre, dass du frustriert bist. Was genau müsste sich ändern? Lass uns das konkret besprechen.',
            user_delta: 0,
            boss_delta: 45,
            feedback: 'BOSS BESIEGT! Du nimmst die Emotion ernst, ohne dem Ultimatum nachzugeben.',
          },
          {
            id: 'c',
            text: 'Beruhig dich erstmal.',
            user_delta: -30,
            boss_delta: 0,
            feedback: '"Beruhig dich" ist der schlechteste Satz der Menschheit. Eskaliert IMMER.',
          },
        ],
      },
    ],
    sieg: {
      badge: 'Konflikt-Diplomat',
      xp: 250,
      text: 'Du hast den Vulkan entschärft! Konflikte sind Chancen — wenn du weißt, wie.',
    },
    niederlage: {
      text: 'Konflikte sind unvermeidbar. Wie du damit umgehst, definiert deine Karriere.',
    },
  },

  stummer_raum: {
    id: 'stummer_raum',
    name: 'Der Stumme Raum',
    beschreibung: 'Du präsentierst vor 10 Leuten. Keiner reagiert. Totenstille.',
    user_stat: { name: 'Selbstvertrauen', max: 100 },
    boss_stat: { name: 'Peinliche Stille', max: 100 },
    waves: [
      {
        id: 1,
        name: 'Die erste Folie',
        boss_sagt: 'Du hast deine Einleitung gesprochen. 10 Augenpaare. Keiner sagt etwas.',
        optionen: [
          {
            id: 'a',
            text: 'Schneller reden und zur nächsten Folie hetzen.',
            user_delta: -25,
            boss_delta: 0,
            feedback: 'Panik-Modus! Du verschluckst Worte und verlierst dein Publikum.',
          },
          {
            id: 'b',
            text: 'Bewusste Pause. Blickkontakt. Dann: "Kennen Sie das Gefühl, wenn...?"',
            user_delta: 0,
            boss_delta: 40,
            feedback: 'Meisterhaft! Pause zeigt Souveränität. Eine Frage aktiviert das Publikum.',
          },
          {
            id: 'c',
            text: '"Ist das hier eine Beerdigung?"',
            user_delta: -15,
            boss_delta: 10,
            feedback: 'Riskant. Kann funktionieren, kann nach hinten losgehen. Besser: Echte Frage statt Witz.',
          },
        ],
      },
      {
        id: 2,
        name: 'Die kritische Frage',
        boss_sagt: 'Jemand fragt: "Haben Sie dafür auch Zahlen?"',
        optionen: [
          {
            id: 'a',
            text: '"Natürlich, aber..."',
            user_delta: -20,
            boss_delta: 5,
            feedback: '"Aber" negiert alles davor. Klingt defensiv statt souverän.',
          },
          {
            id: 'b',
            text: '"Gute Frage. Die Zahlen kommen auf Folie 12. Soll ich vorspringen?"',
            user_delta: 0,
            boss_delta: 45,
            feedback: 'BOSS BESIEGT! Vorbereitet, souverän, respektvoll. Du gibst dem Fragesteller Kontrolle.',
          },
          {
            id: 'c',
            text: '"Fragen bitte am Ende."',
            user_delta: -30,
            boss_delta: 0,
            feedback: 'Arrogant. Der Fragesteller fühlt sich abgebügelt und hört nicht mehr zu.',
          },
        ],
      },
      {
        id: 3,
        name: 'Der Technik-Ausfall',
        boss_sagt: 'Laptop stürzt ab. Blauer Bildschirm. 10 Leute schauen dich an.',
        optionen: [
          {
            id: 'a',
            text: '"Oh nein, Moment..."',
            user_delta: -35,
            boss_delta: 0,
            feedback: 'Kontrollverlust sichtbar. Dein Publikum wird nervös.',
          },
          {
            id: 'b',
            text: '"Die Technik testet mich heute. Während der Rechner hochfährt — die Kernbotschaft ist..."',
            user_delta: 0,
            boss_delta: 40,
            feedback: 'LEGENDE! Wer ohne Folien überzeugt, braucht keine. Das Publikum respektiert Souveränität.',
          },
          {
            id: 'c',
            text: 'Meeting abbrechen und Termin verschieben.',
            user_delta: -40,
            boss_delta: 0,
            feedback: 'Eine verpasste Chance. Du hättest gerade beweisen können, dass du mehr bist als deine Folien.',
          },
        ],
      },
    ],
    sieg: {
      badge: 'Stage Commander',
      xp: 300,
      text: 'Die Bühne gehört dir! Du überzeugst — mit oder ohne Technik.',
    },
    niederlage: {
      text: 'Jeder Speaker hatte diesen Moment. Profis üben genau diese Situationen.',
    },
  },

  eskalations_sturm: {
    id: 'eskalations_sturm',
    name: 'Der Eskalations-Sturm',
    beschreibung: 'Zwei Mitarbeiter streiten öffentlich. Du musst schlichten.',
    voraussetzung: 'fuehrungskraft',
    user_stat: { name: 'Mediations-Kraft', max: 100 },
    boss_stat: { name: 'Team-Toxizität', max: 100 },
    waves: [
      {
        id: 1,
        name: 'Der öffentliche Ausbruch',
        boss_sagt:
          'Anna und Tom streiten sich lautstark vor dem gesamten Team. Anna: "Du sabotierst mein Projekt!" Tom: "ICH?! Du hast mich nie einbezogen!"',
        optionen: [
          {
            id: 'a',
            text: '"RUHE! Das klären wir hier und jetzt vor allen!"',
            user_delta: -25,
            boss_delta: 0,
            feedback:
              'Öffentliche Konfrontation verstärkt die Scham. Beide verhärten ihre Position, weil sie Gesicht wahren wollen.',
          },
          {
            id: 'b',
            text: '"Anna, Tom — ich sehe, das ist euch wichtig. Lasst uns das zu dritt in meinem Büro besprechen. Team, wir machen in 10 Minuten weiter."',
            user_delta: 0,
            boss_delta: 35,
            feedback:
              'Perfekt. Du nimmst beide ernst, entfernst das Publikum und gibst allen eine Pause zum Runterkommen.',
          },
          {
            id: 'c',
            text: 'Einfach weitermachen und hoffen, dass es sich legt.',
            user_delta: -20,
            boss_delta: 5,
            feedback:
              'Als Führungskraft bist du verantwortlich. Wegschauen signalisiert: Dieses Verhalten ist ok. Das Team verliert Respekt.',
          },
        ],
      },
      {
        id: 2,
        name: 'Die HR-Drohung',
        boss_sagt: 'Im Einzelgespräch sagt Anna: "Wenn du das nicht regelst, gehe ich zu HR. Das ist Mobbing."',
        optionen: [
          {
            id: 'a',
            text: '"Das ist doch kein Mobbing, stell dich nicht so an."',
            user_delta: -35,
            boss_delta: 0,
            feedback:
              'Du invalidierst Annas Erleben. Selbst wenn es kein Mobbing ist — ihre Wahrnehmung ist real. Jetzt wird sie erst recht zu HR gehen.',
          },
          {
            id: 'b',
            text: '"Ich verstehe, dass du dich nicht ernst genommen fühlst. Das nehme ich ernst. Lass uns konkret besprechen, was passiert ist und was du brauchst."',
            user_delta: 0,
            boss_delta: 40,
            feedback:
              'Du validierst die Emotion, ohne das Label zu akzeptieren. Du zeigst Handlungsbereitschaft und behältst die Führung.',
          },
          {
            id: 'c',
            text: '"Ok, dann geh zu HR. Ich kann hier auch nichts machen."',
            user_delta: -30,
            boss_delta: 0,
            feedback:
              'Kapitulation. Du gibst deine Führungsrolle ab. Anna verliert den letzten Rest Vertrauen in dich.',
          },
        ],
      },
      {
        id: 3,
        name: 'Die Lösung',
        boss_sagt:
          'Du hast beide im Raum. Anna und Tom schauen sich nicht an. Die Spannung ist greifbar. Du musst eine Lösung finden.',
        optionen: [
          {
            id: 'a',
            text: '"Ich habe entschieden: Ab jetzt macht ihr getrennte Projekte. Problem gelöst."',
            user_delta: -15,
            boss_delta: 10,
            feedback:
              'Du löst das Symptom, nicht die Ursache. Beim nächsten gemeinsamen Projekt explodiert es wieder. Und das Team lernt: Streiten führt dazu, dass man seinen Willen bekommt.',
          },
          {
            id: 'b',
            text: '"Jeder von euch hat 3 Minuten, eure Sicht zu schildern. Ohne Unterbrechung. Dann suchen wir gemeinsam eine Lösung, die für beide funktioniert."',
            user_delta: 0,
            boss_delta: 45,
            feedback:
              'BOSS BESIEGT! Strukturierte Mediation. Beide fühlen sich gehört. Die gemeinsam erarbeitete Lösung hat die höchste Akzeptanz.',
          },
          {
            id: 'c',
            text: '"Wer hat angefangen? Ich will die Wahrheit."',
            user_delta: -25,
            boss_delta: 0,
            feedback:
              'Schuldfrage eskaliert. Beide zeigen auf den anderen. Du bist jetzt Richter statt Mediator.',
          },
        ],
      },
    ],
    sieg: {
      badge: 'Team Mediator',
      xp: 250,
      text: 'Du hast den Sturm beruhigt! Echte Führung zeigt sich in Konflikten.',
    },
    niederlage: {
      text: 'Teamkonflikte sind die härteste Prüfung für Führungskräfte. Mediation ist erlernbar — versuch es nochmal!',
    },
  },
};

// ---------------------------------------------------------------------------
// 4. VIER_OHREN_UEBUNG — Schulz von Thun Drag & Drop
// ---------------------------------------------------------------------------
export const VIER_OHREN_UEBUNG = {
  titel: 'Das 4-Ohren-Modell in der Praxis',
  beschreibung:
    'Ordne die Interpretationen dem richtigen Ohr zu. Ziehe jede Aussage auf das passende Ohr.',
  ohren: [
    { id: 'sachinhalt', label: 'Sachinhalt', farbe: '#3B82F6', beschreibung: 'Worüber informiert wird' },
    { id: 'selbstoffenbarung', label: 'Selbstoffenbarung', farbe: '#10B981', beschreibung: 'Was der Sender über sich verrät' },
    { id: 'beziehung', label: 'Beziehung', farbe: '#F59E0B', beschreibung: 'Was der Sender vom Empfänger hält' },
    { id: 'appell', label: 'Appell', farbe: '#EF4444', beschreibung: 'Was der Empfänger tun soll' },
  ],
  saetze: [
    {
      id: 1,
      text: '"Der Report ist noch nicht da."',
      kontext: 'Chef sagt es am Montag im Büro.',
      interpretationen: [
        { ohr: 'sachinhalt', text: 'Der Report fehlt.' },
        { ohr: 'selbstoffenbarung', text: 'Ich brauche den Report.' },
        { ohr: 'beziehung', text: 'Du bist unzuverlässig.' },
        { ohr: 'appell', text: 'Schick ihn sofort!' },
      ],
    },
    {
      id: 2,
      text: '"Das Meeting hätte kürzer sein können."',
      kontext: 'Kollegin sagt es nach einem 2-Stunden-Meeting.',
      interpretationen: [
        { ohr: 'sachinhalt', text: 'Das Meeting war länger als nötig.' },
        { ohr: 'selbstoffenbarung', text: 'Ich habe meine Zeit verschwendet gefühlt.' },
        { ohr: 'beziehung', text: 'Du respektierst meine Zeit nicht.' },
        { ohr: 'appell', text: 'Mach Meetings kürzer und strukturierter!' },
      ],
    },
    {
      id: 3,
      text: '"Interessanter Vorschlag..."',
      kontext: 'Vorgesetzter sagt es mit hochgezogener Augenbraue.',
      interpretationen: [
        { ohr: 'sachinhalt', text: 'Der Vorschlag wurde zur Kenntnis genommen.' },
        { ohr: 'selbstoffenbarung', text: 'Ich bin nicht überzeugt.' },
        { ohr: 'beziehung', text: 'Du hast noch viel zu lernen.' },
        { ohr: 'appell', text: 'Überarbeite den Vorschlag und bring bessere Argumente!' },
      ],
    },
  ],
};

// ---------------------------------------------------------------------------
// 5. ZUHOER_STUFEN — Aktives Zuhören Levels
// ---------------------------------------------------------------------------
export const ZUHOER_STUFEN = {
  titel: 'Die 5 Stufen des Zuhörens',
  beschreibung:
    'Die meisten Menschen hören zu, um zu antworten — nicht um zu verstehen. Erkenne, auf welcher Stufe du typischerweise zuhörst.',
  stufen: [
    {
      level: 1,
      name: 'Ignorieren',
      prozent: 0,
      beschreibung: 'Du hörst gar nicht zu. Gedanken sind woanders. Handy, E-Mails, eigene Gedanken.',
      beispiel: 'Kollege erzählt vom Projekt. Du checkst unter dem Tisch dein Handy.',
      wirkung: 'Der andere fühlt sich wertlos. Vertrauen sinkt sofort.',
    },
    {
      level: 2,
      name: 'So tun als ob',
      prozent: 20,
      beschreibung: 'Du nickst, sagst "Mhm", aber dein Kopf ist woanders. Pseudo-Zuhören.',
      beispiel: '"Ja, ja... ach wirklich?... mhm..." — ohne zu wissen, worum es gerade geht.',
      wirkung: 'Der andere merkt es früher oder später. Vertrauen schleichend beschädigt.',
    },
    {
      level: 3,
      name: 'Selektiv',
      prozent: 40,
      beschreibung: 'Du hörst nur das, was deine Meinung bestätigt. Alles andere wird ausgefiltert.',
      beispiel: 'Kollegin sagt 10 positive Dinge und 1 Kritikpunkt. Du hörst nur die Kritik.',
      wirkung: 'Bestätigungsfehler. Du verstehst die echte Botschaft nicht.',
    },
    {
      level: 4,
      name: 'Aufmerksam',
      prozent: 80,
      beschreibung: 'Du bist voll konzentriert. Du hörst Worte, Tonfall und Pausen.',
      beispiel: 'Du legst das Handy weg, drehst dich zu, hältst Blickkontakt und stellst Rückfragen.',
      wirkung: 'Der andere fühlt sich gehört. Missverständnisse werden reduziert.',
    },
    {
      level: 5,
      name: 'Empathisch',
      prozent: 100,
      beschreibung: 'Du verstehst nicht nur die Worte, sondern die Gefühle und Bedürfnisse dahinter.',
      beispiel: '"Ich höre, dass dich das frustriert. Es klingt so, als wünschst du dir mehr Wertschätzung."',
      wirkung: 'Tiefe Verbindung. Echtes Vertrauen. Konflikte lösen sich fast von selbst.',
    },
  ],
  interaktiv: {
    titel: 'Erkenne die Zuhör-Stufe',
    beschreibung: 'Lies das Gesprächs-Snippet und ordne es der richtigen Stufe zu.',
    szenarien: [
      {
        id: 1,
        situation: 'Kollegin erzählt von einem Problem mit einem Kunden.',
        reaktion: '"Mhm... ja... ach krass..." (während du auf dein Handy schaust)',
        richtig: 2,
        erklaerung: 'Pseudo-Zuhören. Körperlich anwesend, mental abwesend.',
      },
      {
        id: 2,
        situation: 'Mitarbeiter berichtet über ein gescheitertes Projekt.',
        reaktion: '"Wenn ich das richtig verstehe, fühlst du dich vom Team im Stich gelassen. Das frustriert dich, weil du viel investiert hast."',
        richtig: 5,
        erklaerung: 'Empathisches Zuhören. Du spiegelst Gefühle und Bedürfnisse.',
      },
      {
        id: 3,
        situation: 'Chef gibt dir Feedback. 8 positive Punkte, 2 Verbesserungsvorschläge.',
        reaktion: 'Du gehst aus dem Meeting und denkst nur an die 2 negativen Punkte.',
        richtig: 3,
        erklaerung: 'Selektives Zuhören. Negativity Bias filtert das Positive aus.',
      },
      {
        id: 4,
        situation: 'Teamkollege erklärt eine technische Lösung.',
        reaktion: 'Du legst den Stift weg, drehst dich zu ihm, stellst Rückfragen und fasst zusammen.',
        richtig: 4,
        erklaerung: 'Aufmerksames Zuhören. Volle Konzentration, aktive Beteiligung.',
      },
      {
        id: 5,
        situation: 'Partnerin erzählt vom stressigen Tag.',
        reaktion: 'Du scrollst durch Instagram und sagst "Aha" ohne aufzuschauen.',
        richtig: 1,
        erklaerung: 'Ignorieren. Keinerlei Aufmerksamkeit. Maximal respektlos.',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 6. FEEDBACK_TEMPLATES — 5 SBI-Feedback-Vorlagen
// ---------------------------------------------------------------------------
export const FEEDBACK_TEMPLATES = {
  titel: 'SBI-Feedback-Vorlagen zum Kopieren',
  beschreibung:
    'Situation → Behavior → Impact. Copy-paste diese Vorlagen und passe sie an deine Situation an.',
  templates: [
    {
      id: 'positive_performance',
      name: 'Positive Leistung',
      typ: 'positiv',
      vorlage: {
        situation: 'In der Kundenpräsentation am [Datum]...',
        behavior: '...hast du die drei Optionen klar strukturiert präsentiert und auf jede Kundenfrage souverän geantwortet.',
        impact: 'Der Kunde hat sich sofort für Option B entschieden. Das hat uns 2 Wochen Entscheidungszeit gespart.',
      },
      beispiel:
        '"In der Kundenpräsentation am Dienstag hast du die drei Optionen klar strukturiert präsentiert und auf jede Kundenfrage souverän geantwortet. Der Kunde hat sich sofort für Option B entschieden — das hat uns 2 Wochen Entscheidungszeit gespart."',
    },
    {
      id: 'missed_deadline',
      name: 'Verpasste Deadline',
      typ: 'konstruktiv',
      vorlage: {
        situation: 'Beim Projekt [Name], das am [Datum] fällig war...',
        behavior: '...wurde der Abschlussbericht 3 Tage verspätet eingereicht, ohne vorherige Information an das Team.',
        impact: 'Das hat den Kundenstart verzögert und der Kunde hat seine Unzufriedenheit geäußert.',
      },
      beispiel:
        '"Beim Projekt Alpha, das am Freitag fällig war, wurde der Abschlussbericht 3 Tage verspätet eingereicht, ohne vorherige Info ans Team. Das hat den Kundenstart verzögert und der Kunde hat seine Unzufriedenheit geäußert."',
    },
    {
      id: 'presentation_improvement',
      name: 'Präsentation verbessern',
      typ: 'konstruktiv',
      vorlage: {
        situation: 'In deiner Präsentation beim Team-Meeting am [Datum]...',
        behavior: '...hattest du 35 Folien für einen 15-Minuten-Slot und hast die letzten 10 Folien übersprungen.',
        impact: 'Die Kernbotschaft ging verloren und das Team war unsicher, was die nächsten Schritte sind.',
      },
      beispiel:
        '"In deiner Präsentation beim Team-Meeting am Montag hattest du 35 Folien für einen 15-Minuten-Slot und hast die letzten 10 Folien übersprungen. Die Kernbotschaft ging verloren und das Team war unsicher, was die nächsten Schritte sind."',
    },
    {
      id: 'team_collaboration',
      name: 'Team-Zusammenarbeit',
      typ: 'positiv',
      vorlage: {
        situation: 'Als das Marketing-Team letzte Woche Unterstützung brauchte...',
        behavior: '...hast du ohne Aufforderung 4 Stunden deiner Zeit investiert, um bei der Datenanalyse zu helfen.',
        impact: 'Die Kampagne konnte pünktlich starten und das Marketing-Team hat sich ausdrücklich bei unserem Team bedankt.',
      },
      beispiel:
        '"Als das Marketing-Team letzte Woche Unterstützung brauchte, hast du ohne Aufforderung 4 Stunden investiert, um bei der Datenanalyse zu helfen. Die Kampagne konnte pünktlich starten und Marketing hat sich ausdrücklich bei unserem Team bedankt."',
    },
    {
      id: 'meeting_behavior',
      name: 'Meeting-Verhalten',
      typ: 'konstruktiv',
      vorlage: {
        situation: 'Im Sprint-Review am [Datum]...',
        behavior: '...hast du drei Mal Kolleg:innen unterbrochen, bevor sie ihren Punkt zu Ende bringen konnten.',
        impact: 'Zwei Teammitglieder haben danach aufgehört, sich zu beteiligen. Wir haben wertvolle Perspektiven verloren.',
      },
      beispiel:
        '"Im Sprint-Review am Mittwoch hast du drei Mal Kolleg:innen unterbrochen, bevor sie ihren Punkt zu Ende bringen konnten. Zwei Teammitglieder haben danach aufgehört, sich zu beteiligen — wir haben wertvolle Perspektiven verloren."',
    },
  ],
};

// ---------------------------------------------------------------------------
// 7. EMAIL_TEMPLATES — 5 BLUF-E-Mail-Vorlagen
// ---------------------------------------------------------------------------
export const EMAIL_TEMPLATES = {
  titel: 'BLUF-E-Mail-Vorlagen',
  beschreibung:
    'Bottom Line Up Front: Die wichtigste Information kommt in den ersten Satz. Nicht in den letzten.',
  prinzip: {
    name: 'BLUF — Bottom Line Up Front',
    erklaerung: 'Militärisches Prinzip: Die Kernaussage steht am Anfang. Details folgen darunter. Der Empfänger weiß sofort, was Sache ist.',
    struktur: ['Betreff: Klar und spezifisch', 'Zeile 1: Kernaussage / Bitte / Entscheidung', 'Zeile 2-3: Kontext (nur wenn nötig)', 'Zeile 4: Klare Handlungsaufforderung mit Deadline'],
  },
  templates: [
    {
      id: 'status_update',
      name: 'Status-Update',
      betreff: 'Projekt Alpha: On Track — nächster Meilenstein 15.03.',
      text: `Projekt Alpha liegt im Plan. Nächster Meilenstein (Beta-Release) ist am 15.03.

Aktueller Stand:
- Frontend: 90% fertig
- Backend: 85% fertig
- Testing: startet am 10.03.

Kein Handlungsbedarf deinerseits. Nächstes Update kommt am 12.03.`,
    },
    {
      id: 'meeting_request',
      name: 'Meeting-Anfrage',
      betreff: 'Bitte um 30min diese Woche: Budget-Entscheidung Q2',
      text: `Ich brauche 30 Minuten mit dir diese Woche, um die Budget-Verteilung Q2 zu finalisieren.

Kontext: Wir haben 3 Optionen ausgearbeitet. Ich brauche deine Freigabe, um am Montag starten zu können.

Passt Donnerstag 14:00 oder Freitag 10:00? Ich schicke die 3 Optionen vorab als One-Pager.`,
    },
    {
      id: 'bad_news',
      name: 'Schlechte Nachricht',
      betreff: 'Projekt Beta: 2 Wochen Verzögerung — Lösungsvorschlag anbei',
      text: `Projekt Beta wird voraussichtlich 2 Wochen später fertig (neuer Termin: 28.03. statt 14.03.).

Ursache: Unerwartete API-Änderung beim Drittanbieter. Details im Anhang.

Lösungsvorschlag: Parallel-Track mit internem Workaround. Reduziert Verzögerung auf 1 Woche.

Ich brauche bis Mittwoch deine Entscheidung: Warten (2 Wochen) oder Workaround (1 Woche, +15h Aufwand)?`,
    },
    {
      id: 'delegation',
      name: 'Aufgaben-Delegation',
      betreff: 'Bitte: Kundenbericht bis Freitag 12:00 fertigstellen',
      text: `Kannst du den Kundenbericht für Firma Müller bis Freitag 12:00 fertigstellen?

Was genau: Q3-Performance-Report (Vorlage im shared Drive unter /Reports/Vorlage_Q3)
Umfang: ca. 2-3 Stunden
Deadline: Freitag, 12:00 Uhr (Kundencall ist um 14:00)

Falls du Fragen hast oder die Deadline knapp wird — sag mir bis Mittwoch Bescheid, dann finden wir eine Lösung.`,
    },
    {
      id: 'follow_up',
      name: 'Follow-up',
      betreff: 'Follow-up: Deine Rückmeldung zum Angebot bis Donnerstag?',
      text: `Kurze Erinnerung: Ich warte noch auf deine Rückmeldung zum Angebot, das ich am 05.03. geschickt habe.

Der Kunde braucht unsere Antwort bis Freitag. Ich brauche daher dein Go/No-Go bis Donnerstag 16:00.

Falls du das Angebot nicht mehr findest: Im Anhang nochmal die Zusammenfassung.

Kurzes "Passt" oder "Änderungswunsch XY" reicht mir völlig.`,
    },
  ],
};

// ---------------------------------------------------------------------------
// 8. ELEVATOR_PITCH_CONFIG — 3-Schritt Pitch-Builder
// ---------------------------------------------------------------------------
export const ELEVATOR_PITCH_CONFIG = {
  titel: 'Dein Elevator Pitch in 60 Sekunden',
  beschreibung:
    'Ein Elevator Pitch ist deine Antwort auf "Was machst du?" — in 60 Sekunden oder weniger. Formel: Problem → Lösung → Nutzen.',
  schritte: [
    {
      nr: 1,
      name: 'Problem',
      frage: 'Welches Problem löst du?',
      tipp: 'Starte mit einem Problem, das dein Gegenüber kennt. Je konkreter, desto besser.',
      platzhalter: 'Kennen Sie das, wenn...',
    },
    {
      nr: 2,
      name: 'Lösung',
      frage: 'Was genau tust du?',
      tipp: 'Ein Satz. Kein Fachjargon. Deine Oma muss es verstehen.',
      platzhalter: 'Ich helfe [Zielgruppe] dabei, [Ergebnis] zu erreichen...',
    },
    {
      nr: 3,
      name: 'Nutzen',
      frage: 'Was hat dein Gegenüber davon?',
      tipp: 'Konkreter Nutzen. Zahlen, wenn möglich. "Das bedeutet für Sie..."',
      platzhalter: 'Das bedeutet konkret: [messbares Ergebnis].',
    },
  ],
  template:
    'Kennen Sie das, wenn [Problem]? Ich helfe [Zielgruppe] dabei, [Lösung]. Das bedeutet konkret: [Nutzen/messbares Ergebnis].',
  beispiele: [
    {
      karrierephase: 'Student / Berufseinsteiger',
      pitch:
        'Kennen Sie das, wenn Unternehmen tolle Produkte haben, aber niemand versteht warum sie sie brauchen? Ich studiere Kommunikationsdesign und helfe Startups, ihre Story so zu erzählen, dass Kunden sofort verstehen, worum es geht. Mein letztes Projekt hat die Conversion-Rate eines Startups um 40% gesteigert.',
    },
    {
      karrierephase: 'Professional (3-10 Jahre)',
      pitch:
        'Kennen Sie das, wenn Teams aneinander vorbeireden und Projekte deshalb stocken? Ich bin Projektmanagerin und sorge dafür, dass alle Beteiligten auf dem gleichen Stand sind — von der Planung bis zur Lieferung. Mein letztes Projekt haben wir 2 Wochen früher und 15% unter Budget abgeschlossen.',
    },
    {
      karrierephase: 'Führungskraft',
      pitch:
        'Kennen Sie das, wenn Abteilungen wie Silos arbeiten und keiner weiß, was der andere tut? Ich leite ein cross-funktionales Team von 25 Leuten und habe ein Kommunikationssystem aufgebaut, das die Time-to-Market um 30% verkürzt hat. Aktuell suche ich nach neuen Herausforderungen in dieser Richtung.',
    },
    {
      karrierephase: 'Quereinsteiger / Karrierewechsel',
      pitch:
        'Kennen Sie das, wenn technische Teams und Business-Teams komplett verschiedene Sprachen sprechen? Ich war 8 Jahre Ingenieur und habe dann meinen MBA gemacht — genau weil ich diese Brücke bauen will. Ich übersetze zwischen Technik und Business, damit Projekte nicht an Kommunikation scheitern.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 9. DIGITALE_KOMMUNIKATION — Vollständiger Modul-Inhalt
// ---------------------------------------------------------------------------
export const DIGITALE_KOMMUNIKATION = {
  titel: 'Digitale Kommunikation meistern',
  beschreibung:
    'Die Hälfte deiner Kommunikation findet digital statt. Ohne Tonfall, ohne Mimik, ohne Kontext. Das ist ein Minenfeld — wenn du die Regeln nicht kennst.',
  kernprobleme: [
    {
      id: 1,
      problem: 'Fehlender Tonfall',
      beschreibung: 'Text hat keinen Tonfall. "Ok." kann begeistert, genervt oder neutral sein. Dein Gehirn wählt automatisch die negativste Interpretation (Negativity Bias).',
      beispiel: '"Können wir reden?" — Harmlose Frage? Oder: Dein Magen sackt ab, weil du Kündigung erwartest.',
    },
    {
      id: 2,
      problem: 'Emoji-Inflation',
      beschreibung: 'Emojis sind der Ersatz für Mimik — aber sie sind unscharf. Ein Daumen hoch kann "Super!" oder "Mir egal" bedeuten, je nach Kontext und Generation.',
      beispiel: 'Gen Z liest "Daumen hoch" als passiv-aggressiv. Boomer meinen es wörtlich. Chaos.',
    },
    {
      id: 3,
      problem: 'Video-Fatigue',
      beschreibung: 'In Video-Calls siehst du dein eigenes Gesicht permanent. Das kostet Energie. Dazu kommen Latenz, fehlende Blickkontakt-Illusion und "You\'re on mute".',
      beispiel: 'Nach 4 Stunden Zoom-Meetings bist du erschöpfter als nach 4 Stunden im Büro.',
    },
    {
      id: 4,
      problem: 'Async vs. Sync Verwirrung',
      beschreibung: 'Slack-Nachrichten werden wie Chat behandelt, obwohl sie asynchron sind. Ergebnis: Erwartung sofortiger Antwort, ständige Unterbrechungen.',
      beispiel: 'Chef schreibt um 22:00 Uhr auf Slack. Meint es nicht dringend. Du hast Panik.',
    },
    {
      id: 5,
      problem: 'Read-but-not-replied',
      beschreibung: 'Die blauen Häkchen sind der moderne Stressfaktor. Gelesen, aber nicht geantwortet? Dein Gehirn generiert 100 Gründe — alle negativ.',
      beispiel: '"Sie hat es vor 3 Stunden gelesen und nicht geantwortet. Sie hasst mich."',
    },
    {
      id: 6,
      problem: 'Sprachnachrichten-Missbrauch',
      beschreibung: 'Sprachnachrichten sind bequem für den Sender und nervig für den Empfänger. Man kann sie nicht scannen, nicht durchsuchen und nicht im Meeting heimlich anhören.',
      beispiel: '7-Minuten-Sprachnachricht, deren Kernaussage ist: "Dienstag 14:00 passt."',
    },
  ],
  regeln: {
    slack_teams: [
      {
        regel: 'Threads nutzen, immer.',
        warum: 'Ohne Threads wird der Kanal zum Strom des Bewusstseins. Niemand findet etwas wieder.',
      },
      {
        regel: 'Status setzen (verfügbar, fokus, abwesend).',
        warum: 'Reduziert die Erwartung sofortiger Antwort. Schützt Deep-Work-Phasen.',
      },
      {
        regel: 'Volle Frage stellen, kein "Hast du kurz?"',
        warum: '"Hast du kurz?" erzeugt Angst. Stattdessen: "Hast du 5 Min für eine Frage zum Budget Q2?"',
      },
      {
        regel: '@-Mentions nur wenn nötig. Nie @channel ohne echte Dringlichkeit.',
        warum: '@channel um 17:00 für nicht-dringende Info? 50 Leute werden gestört.',
      },
      {
        regel: 'Reaktions-Emojis statt "Danke"-Nachrichten.',
        warum: 'Ein Häkchen-Emoji sagt "Gelesen und verstanden" ohne den Kanal zu fluten.',
      },
    ],
    video_calls: [
      {
        regel: 'Kamera an — mindestens die ersten 5 Minuten.',
        warum: 'Gesichter schaffen Verbindung. Kamera aus = Telefonieren mit Extra-Schritten.',
      },
      {
        regel: '25-Minuten-Meetings statt 30, 50 statt 60.',
        warum: '5 Minuten Puffer zwischen Calls. Dein Gehirn braucht Reset-Zeit.',
      },
      {
        regel: 'Agenda vorher schicken. Immer.',
        warum: 'Ohne Agenda weiß niemand, warum dieses Meeting existiert. "Kurzer Sync" ist keine Agenda.',
      },
      {
        regel: 'Stummschalten wenn du nicht sprichst.',
        warum: 'Hintergrundgeräusche, Tippen, Atmen — alles stört. Mute ist Respekt.',
      },
      {
        regel: 'Chat im Call für Links und Notizen nutzen.',
        warum: 'Verbal gesagte URLs merkt sich niemand. Chat ist das Protokoll.',
      },
    ],
    email_vs_chat: [
      {
        situation: 'Schnelle Ja/Nein-Frage an einen Kollegen',
        kanal: 'Chat (Slack/Teams)',
        grund: 'Formale E-Mail für "Passt 14 Uhr?" ist Overkill.',
      },
      {
        situation: 'Offizielle Entscheidung dokumentieren',
        kanal: 'E-Mail',
        grund: 'E-Mail ist durchsuchbar, zitierfähig und verbindlich. "Steht im Slack" hält vor keinem Audit.',
      },
      {
        situation: 'Emotionales oder heikles Thema',
        kanal: 'Persönliches Gespräch / Video-Call',
        grund: 'Text hat keinen Tonfall. Kündigung per Chat? Feedback per E-Mail? Beides zerstört Beziehungen.',
      },
      {
        situation: 'Status-Update ans Team',
        kanal: 'Chat (Team-Kanal)',
        grund: 'Kurz, informell, alle sehen es. Thread für Rückfragen.',
      },
      {
        situation: 'Externer Kunde / Geschäftspartner',
        kanal: 'E-Mail',
        grund: 'Professioneller Standard. Nicht jeder Kunde ist auf Slack.',
      },
      {
        situation: 'Brainstorming / Ideen sammeln',
        kanal: 'Shared Document (Google Docs / Miro)',
        grund: 'Chat-Brainstorming verschwindet im Verlauf. Dokumente sind strukturiert und dauerhaft.',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 10. STIMM_TRAINING — Stimme & Wirkung
// ---------------------------------------------------------------------------
export const STIMM_TRAINING = {
  titel: 'Stimm-Training: Deine Stimme als Instrument',
  beschreibung:
    'Deine Stimme transportiert mehr als Worte. Tonhöhe, Tempo, Pausen und Betonung entscheiden, ob du gehört wirst — oder überhört.',
  uebungen: [
    {
      id: 'atem_basis',
      name: 'Atem-Basis',
      dauer: '2 Minuten',
      beschreibung: 'Bauchatmung ist die Basis jeder starken Stimme. Wer flach atmet, klingt dünn und nervös.',
      anleitung: [
        'Steh auf. Füße hüftbreit.',
        'Hand auf den Bauch.',
        '4 Sekunden einatmen — der Bauch geht raus.',
        '4 Sekunden halten.',
        '6 Sekunden ausatmen — der Bauch geht rein.',
        '5 Wiederholungen.',
        'Dann einen Satz sprechen. Merkst du den Unterschied?',
      ],
      wirkung: 'Tiefere, ruhigere Stimme. Weniger Nervosität. Mehr Resonanz.',
    },
    {
      id: 'betonungs_uebung',
      name: 'Betonungs-Übung',
      dauer: '3 Minuten',
      beschreibung: 'Der gleiche Satz, unterschiedlich betont, hat völlig verschiedene Bedeutungen.',
      anleitung: [
        'Sag den Satz: "Ich habe das nicht gesagt."',
        'Betone "ICH" → Jemand anders hat es gesagt.',
        'Betone "HABE" → Ich habe es wirklich nicht gesagt.',
        'Betone "DAS" → Ich habe etwas anderes gesagt.',
        'Betone "NICHT" → Ich habe es definitiv nicht gesagt.',
        'Betone "GESAGT" → Ich habe es vielleicht gedacht, aber nicht gesagt.',
        'Wiederhole mit einem Satz aus deinem Arbeitsalltag.',
      ],
      wirkung: 'Bewusstere Betonung. Deine Botschaft kommt an wie beabsichtigt.',
    },
    {
      id: 'pausen_macht',
      name: 'Pausen-Macht',
      dauer: '3 Minuten',
      beschreibung: 'Pausen sind mächtiger als Worte. Wer pausiert, wirkt souverän. Wer durchredet, wirkt nervös.',
      anleitung: [
        'Lies einen Absatz laut vor.',
        'Nach jedem Punkt: 2 Sekunden Pause.',
        'Vor der wichtigsten Aussage: 3 Sekunden Pause.',
        'Halte Blickkontakt während der Pause (im Spiegel üben).',
        'Beobachte: Die Pause fühlt sich für dich ewig an — für den Zuhörer ist sie genau richtig.',
      ],
      wirkung: 'Dramaturgische Spannung. Deine Kernbotschaft bleibt hängen.',
    },
    {
      id: 'spiegel_test',
      name: 'Spiegel-Test',
      dauer: '5 Minuten',
      beschreibung: 'Sprich 2 Minuten vor dem Spiegel über ein beliebiges Thema. Beobachte Mimik, Gestik, Haltung.',
      anleitung: [
        'Stell dich vor den Spiegel.',
        'Wähle ein Thema (z.B. "Mein letztes Projekt").',
        'Sprich 2 Minuten frei darüber.',
        'Beobachte: Wo schauen deine Augen? Was machen deine Hände? Lächelst du?',
        'Wiederhole und korrigiere bewusst EIN Element.',
        'Mach das 5 Tage lang. Am Tag 5 wirst du den Unterschied spüren.',
      ],
      wirkung: 'Selbstwahrnehmung schärfen. Unbewusste Gewohnheiten erkennen und korrigieren.',
    },
  ],
  stimmkiller: [
    {
      id: 'upspeak',
      name: 'Upspeak',
      beschreibung: 'Satzende geht nach oben? Als ob alles eine Frage wäre? Das klingt unsicher?',
      loesung: 'Übe, Sätze nach unten zu beenden. Punkt statt Fragezeichen. "Das ist der Plan." Nicht "Das ist der Plan?"',
      beispiel: '"Wir sollten das Projekt umstrukturieren?" vs. "Wir sollten das Projekt umstrukturieren."',
    },
    {
      id: 'fuellwoerter',
      name: 'Füllwörter',
      beschreibung: '"Ähm", "Also", "Sozusagen", "Quasi", "Halt" — jedes Füllwort reduziert deine wahrgenommene Kompetenz.',
      loesung: 'Ersetze Füllwörter durch Pausen. Stille ist mächtiger als "Ähm". Nimm dich auf und zähle deine Füllwörter.',
      beispiel: '"Also, ähm, ich denke quasi, dass wir sozusagen..." → "Ich denke, wir sollten..."',
    },
    {
      id: 'zu_schnell',
      name: 'Zu schnell sprechen',
      beschreibung: 'Nervosität = Tempo. Wer zu schnell spricht, signalisiert: "Ich habe Angst, unterbrochen zu werden."',
      loesung: 'Bewusst langsamer. 130 Wörter pro Minute ist ideal. Übe mit einem Timer und zähle die Wörter.',
      beispiel: 'Nimm eine 1-Minuten-Sprachnachricht auf. Zähle die Wörter. Über 160? Zu schnell.',
    },
    {
      id: 'monoton',
      name: 'Monoton sprechen',
      beschreibung: 'Gleiche Tonhöhe, gleiches Tempo, null Variation. Dein Inhalt kann brillant sein — nach 2 Minuten schläft jeder ein.',
      loesung: 'Variiere bewusst: Tempo (schnell bei Energie, langsam bei wichtigen Punkten), Lautstärke (leiser bei wichtigen Aussagen), Tonhöhe.',
      beispiel: 'Lies eine Kindergeschichte laut vor. Übertreib die Variation. Dann nimm 20% davon mit in deinen Arbeitsalltag.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 11. KOERPERSPRACHE_LESEN — 8 Signale + Cluster-Warnung
// ---------------------------------------------------------------------------
export const KOERPERSPRACHE_LESEN = {
  titel: 'Körpersprache lesen',
  beschreibung:
    'Körpersprache ist keine exakte Wissenschaft. Aber bestimmte Signale häufen sich. Hier sind die 8 wichtigsten — und warum du nie ein einzelnes Signal isoliert bewerten solltest.',
  cluster_warnung: {
    titel: 'Die Cluster-Regel',
    text: 'Ein einzelnes Signal bedeutet NICHTS. Verschränkte Arme können Ablehnung sein — oder die Person friert. Erst wenn 3+ Signale in die gleiche Richtung zeigen (= Cluster), kannst du eine vorsichtige Interpretation wagen.',
    beispiel: 'Verschränkte Arme + Blick auf Uhr + Füße Richtung Tür = Cluster für "Will hier weg". Verschränkte Arme allein = Vielleicht kalt.',
  },
  signale: [
    {
      id: 'verschraenkte_arme',
      name: 'Verschränkte Arme',
      moegliche_bedeutung: 'Abwehr, Skepsis, Selbstschutz',
      aber: 'Kann auch Gewohnheit sein, Komfort oder Kälte.',
      tipp: 'Beobachte den Kontext. Kam es plötzlich nach etwas, das du gesagt hast? Dann ist es ein Reaktionssignal.',
    },
    {
      id: 'vorlehnen',
      name: 'Nach vorne lehnen',
      moegliche_bedeutung: 'Interesse, Engagement, Neugier',
      aber: 'Kann auch unbequemer Stuhl sein.',
      tipp: 'Positives Signal. Wenn jemand sich vorlehnt während du sprichst — du hast Aufmerksamkeit.',
    },
    {
      id: 'blick_auf_uhr',
      name: 'Blick auf die Uhr',
      moegliche_bedeutung: 'Ungeduld, Langeweile, Zeitdruck',
      aber: 'Vielleicht hat die Person einen harten Anschlusstermin.',
      tipp: 'Frag direkt: "Sind wir zeitlich ok?" Zeigt Respekt und klärt die Situation.',
    },
    {
      id: 'nicken_ohne_blick',
      name: 'Nicken ohne Blickkontakt',
      moegliche_bedeutung: 'Pseudo-Zustimmung, "Ja ja, rede weiter, damit es vorbei ist"',
      aber: 'In manchen Kulturen ist wenig Blickkontakt Respekt.',
      tipp: 'Teste es: Stell eine Frage. Wenn die Person nicht antworten kann, hat sie nicht zugehört.',
    },
    {
      id: 'augenbrauen',
      name: 'Hochgezogene Augenbrauen',
      moegliche_bedeutung: 'Überraschung, Skepsis, Interesse',
      aber: 'Kurzes Heben = Überraschung. Längeres Heben = Skepsis.',
      tipp: 'Augenbrauen sind einer der ehrlichsten Indikatoren. Schwer zu faken.',
    },
    {
      id: 'fuesse_richtung_tuer',
      name: 'Füße Richtung Tür',
      moegliche_bedeutung: 'Will gehen, unbewusster Fluchtreflex',
      aber: 'Manchmal einfach bequeme Position.',
      tipp: 'Füße sind der ehrlichste Körperteil. Wir kontrollieren Gesicht und Hände — aber vergessen die Füße.',
    },
    {
      id: 'offene_haende',
      name: 'Offene Handflächen',
      moegliche_bedeutung: 'Offenheit, Ehrlichkeit, Einladung',
      aber: 'Kann auch antrainierte Geste sein (Politiker, Redner).',
      tipp: 'Generell positives Signal. Menschen mit offenen Händen wirken vertrauenswürdiger.',
    },
    {
      id: 'kinn_stuetzen',
      name: 'Kinn auf Hand stützen',
      moegliche_bedeutung: 'Nachdenken, Bewertung, kritisches Abwägen',
      aber: 'Oder einfach müde.',
      tipp: 'Wenn begleitet von leicht geneigtem Kopf: Die Person denkt ernsthaft nach. Gutes Zeichen.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 12. STRESS_KOMMUNIKATION — STOPP-Methode
// ---------------------------------------------------------------------------
export const STRESS_KOMMUNIKATION = {
  titel: 'Kommunikation unter Stress',
  beschreibung:
    'Unter Stress schaltet dein Gehirn auf Autopilot. Kampf, Flucht oder Freeze. Keine dieser Reaktionen ist hilfreich in einem Meeting. Die STOPP-Methode gibt dir 10 Sekunden Vorsprung.',
  stopp_methode: {
    name: 'Die STOPP-Methode',
    beschreibung: '5 Schritte in 10 Sekunden. Dein Notfall-Protokoll für emotionale Trigger.',
    schritte: [
      {
        buchstabe: 'S',
        name: 'Stop',
        beschreibung: 'Mund zu. 3 Sekunden Stille. Kein Wort. Dein erster Impuls ist fast immer falsch.',
        tipp: 'Trink einen Schluck Wasser. Das gibt dir natürliche 3 Sekunden.',
      },
      {
        buchstabe: 'T',
        name: 'Take a breath',
        beschreibung: 'Ein tiefer Atemzug. 4 Sekunden ein, 6 Sekunden aus. Aktiviert den Parasympathikus.',
        tipp: 'Niemand merkt, wenn du einmal tief durchatmest. Aber dein Körper merkt es sofort.',
      },
      {
        buchstabe: 'O',
        name: 'Observe',
        beschreibung: 'Was passiert gerade? Was fühle ich? Was will die andere Person wirklich?',
        tipp: 'Frag dich: "Auf welchem Ohr höre ich gerade?" (Sach-, Selbstoffenbarungs-, Beziehungs- oder Appell-Ohr)',
      },
      {
        buchstabe: 'P',
        name: 'Proceed',
        beschreibung: 'Jetzt darfst du antworten. Bewusst. Gewählt. Nicht impulsiv.',
        tipp: 'Starte mit einer Frage statt mit einer Aussage. Fragen deeskalieren.',
      },
      {
        buchstabe: 'P',
        name: 'Perspective',
        beschreibung: 'Wird das in 5 Jahren noch wichtig sein? Meistens: Nein. Das relativiert sofort.',
        tipp: 'Die 5-5-5-Regel: Wird es in 5 Minuten, 5 Monaten, 5 Jahren wichtig sein?',
      },
    ],
  },
  notfall_saetze: [
    {
      situation: 'Du wirst unfair angegriffen',
      satz: '"Ich möchte darauf eingehen — gib mir einen Moment, um meine Gedanken zu sortieren."',
      warum: 'Kauft Zeit, ohne schwach zu wirken. Zeigt Kontrolle.',
    },
    {
      situation: 'Du bist extrem wütend',
      satz: '"Ich merke, dass mich das gerade emotional berührt. Können wir in 10 Minuten weitersprechen?"',
      warum: 'Ehrlich, verletzlich, professionell. Du nimmst dich raus, bevor du etwas sagst, das du bereust.',
    },
    {
      situation: 'Du wirst vor anderen bloßgestellt',
      satz: '"Das ist ein wichtiger Punkt. Lass uns das nach dem Meeting im Detail besprechen."',
      warum: 'Du entziehst der Bloßstellung das Publikum, ohne zu eskalieren.',
    },
    {
      situation: 'Du hast einen Fehler gemacht und wirst konfrontiert',
      satz: '"Du hast Recht, das war mein Fehler. Hier ist, wie ich es beheben werde: [konkreter Plan]."',
      warum: 'Sofortiges Eingestehen + Lösungsvorschlag = maximaler Respekt. Verteidigen = minimaler Respekt.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 13. SMALLTALK_TOOLKIT — FORD-Methode + Situationen
// ---------------------------------------------------------------------------
export const SMALLTALK_TOOLKIT = {
  titel: 'Smalltalk-Toolkit',
  beschreibung:
    'Smalltalk ist nicht oberflächlich — er ist die Tür zu tiefen Verbindungen. Wer Smalltalk beherrscht, baut Netzwerke. Wer ihn meidet, wird übersehen.',
  ford_methode: {
    name: 'Die FORD-Methode',
    beschreibung: '4 Themenfelder, die immer funktionieren. Merke dir: FORD.',
    buchstaben: [
      {
        buchstabe: 'F',
        name: 'Family',
        beschreibung: 'Familie, Herkunft, Haustiere, Wohnsituation.',
        beispiele: ['"Woher kommst du ursprünglich?"', '"Hast du Kinder/Haustiere?"', '"Wie gefällt dir die Gegend hier?"'],
      },
      {
        buchstabe: 'O',
        name: 'Occupation',
        beschreibung: 'Beruf, Projekte, Karriereweg.',
        beispiele: ['"Was genau machst du bei Firma X?"', '"Wie bist du in deinen Beruf gekommen?"', '"Woran arbeitest du gerade?"'],
      },
      {
        buchstabe: 'R',
        name: 'Recreation',
        beschreibung: 'Hobbys, Urlaub, Freizeit, Sport.',
        beispiele: ['"Was machst du, wenn du nicht arbeitest?"', '"Warst du dieses Jahr schon im Urlaub?"', '"Hast du am Wochenende was Schönes vor?"'],
      },
      {
        buchstabe: 'D',
        name: 'Dreams',
        beschreibung: 'Ziele, Träume, Pläne, Visionen.',
        beispiele: ['"Was würdest du machen, wenn Geld keine Rolle spielen würde?"', '"Wo siehst du dich in 5 Jahren?"', '"Was steht als Nächstes an?"'],
      },
    ],
    tabu_themen: [
      'Gehalt und Finanzen',
      'Religion und extreme politische Meinungen',
      'Gesundheitsprobleme und Krankheiten',
      'Klatsch und Tratsch über Abwesende',
      'Kontroverse Nachrichten-Themen',
    ],
  },
  situations_opener: [
    {
      situation: 'Networking-Event',
      opener: [
        '"Was hat dich heute hierher gebracht?"',
        '"Kennst du den Speaker? Was erwartest du?"',
        '"Ich bin [Name]. Ich kenne hier noch niemanden — du auch nicht, oder?"',
      ],
      tipp: 'Die ehrlichste Variante ("Ich kenne hier niemanden") funktioniert am besten. Verletzlichkeit verbindet.',
    },
    {
      situation: 'Aufzug mit dem Chef',
      opener: [
        '"Guten Morgen! Ich bin [Name] aus [Team]. Wir arbeiten gerade an [Projekt] — läuft richtig gut."',
        '"Ich habe Ihre letzte All-Hands-Präsentation gesehen. Der Punkt zu [Thema] hat mich zum Nachdenken gebracht."',
      ],
      tipp: 'Halte es kurz. 2-3 Sätze. Kein Monolog. Und: Hab deinen Elevator Pitch parat.',
    },
    {
      situation: 'Neuer Kollege am ersten Tag',
      opener: [
        '"Hey! Willkommen im Team. Ich bin [Name]. Wenn du Fragen hast — komm jederzeit vorbei."',
        '"Der Kaffee in der 3. Etage ist besser als hier. Das hat mir auch erst nach 3 Monaten jemand gesagt."',
      ],
      tipp: 'Insider-Tipps geben = sofortige Verbindung. Du bist jetzt die Person, die geholfen hat.',
    },
    {
      situation: 'Konferenz-Mittagspause',
      opener: [
        '"Der Talk gerade war [deine ehrliche Meinung]. Wie fandest du ihn?"',
        '"Ist der Platz noch frei? Ich bin [Name] — und überwältigt von den ganzen Eindrücken hier."',
      ],
      tipp: 'Gemeinsame Erlebnisse (der Talk, das Essen) sind der einfachste Gesprächseinstieg.',
    },
  ],
  gespraech_beenden: [
    {
      name: 'Der ehrliche Abgang',
      satz: '"Es war toll, mit dir zu sprechen! Ich möchte noch ein paar andere Leute kennenlernen. Vernetzen wir uns auf LinkedIn?"',
      warum: 'Ehrlich, wertschätzend, mit konkretem Follow-up.',
    },
    {
      name: 'Der Brückenbauer',
      satz: '"Du musst unbedingt [Name] kennenlernen, sie arbeitet auch an [Thema]. Komm, ich stell euch vor!"',
      warum: 'Du verbindest zwei Menschen. Alle drei profitieren.',
    },
    {
      name: 'Der Zeitliche',
      satz: '"Ich muss gleich zum nächsten Talk / mein Zug fährt in 20 Minuten. Aber lass uns das vertiefen — hast du eine Karte?"',
      warum: 'Externer Grund zum Gehen. Zeigt trotzdem Interesse an Fortsetzung.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 14. NOTFALL_SKRIPTE_KOMM — 6 Notfall-Skripte
// ---------------------------------------------------------------------------
export const NOTFALL_SKRIPTE_KOMM = {
  titel: 'Notfall-Skripte für schwierige Situationen',
  beschreibung: 'Wenn dein Gehirn einfriert, brauchst du vorbereitete Sätze. Hier sind 6 Skripte für die häufigsten Worst-Case-Szenarien.',
  skripte: [
    {
      id: 'angeschrien',
      situation: 'Du wirst angeschrien',
      kontext: 'Chef, Kunde oder Kollege wird laut. Alle schauen.',
      sofort_reaktion: 'Nicht zurückschreien. Nicht weglaufen. Stehen bleiben. Ruhig bleiben.',
      skript: [
        'Pause: 3 Sekunden schweigen. Das irritiert den Schreier.',
        'Ruhige Stimme: "Ich höre, dass dich das sehr aufregt."',
        'Grenze setzen: "Ich möchte das klären, aber nicht in diesem Ton. Können wir in 10 Minuten sachlich sprechen?"',
        'Wenn es nicht aufhört: "Ich beende dieses Gespräch jetzt und komme zurück, wenn wir beide ruhig sind."',
      ],
      warum_es_funktioniert: 'Ruhe ist ansteckend. Wer nicht zurückschreit, nimmt dem Schreier die Energie. Und zeigt allen im Raum: Hier ist der Erwachsene.',
    },
    {
      id: 'blossgestellt',
      situation: 'Du wirst vor anderen bloßgestellt',
      kontext: 'Jemand macht dich im Meeting runter. Alle gucken betroffen.',
      sofort_reaktion: 'Nicht sofort kontern. Nicht rot werden wollen (geht eh nicht). Atmen.',
      skript: [
        'Kurz pausieren.',
        '"Das ist eine starke Aussage. Lass uns das nach dem Meeting unter vier Augen besprechen."',
        'Falls die Person nachhakt: "Ich glaube nicht, dass das der richtige Rahmen dafür ist."',
        'Weitermachen. Souveränität zeigt sich im Weitermachen.',
      ],
      warum_es_funktioniert: 'Du entziehst der Person das Publikum. Bloßstellung funktioniert nur mit Zuschauern. Ohne Zuschauer ist es ein normales Gespräch.',
    },
    {
      id: 'blackout',
      situation: 'Blackout bei einer Präsentation',
      kontext: 'Du stehst vorne. 20 Leute schauen dich an. Dein Kopf ist leer.',
      sofort_reaktion: 'Nicht paniken. Nicht "Ähm ähm ähm". Pause.',
      skript: [
        '3 Sekunden Stille. (Fühlt sich wie 30 an. Ist es nicht.)',
        'Einen Schluck Wasser trinken.',
        '"Kurze Rückfrage an Sie: Wie sehen Sie das bisher?" (Gibt dir 30 Sekunden Denkzeit.)',
        'Falls nichts kommt: "Lassen Sie mich den letzten Punkt nochmal zusammenfassen..." — bis es zurückkommt.',
      ],
      warum_es_funktioniert: 'Pausen wirken souverän. Rückfragen sind normal. Niemand erwartet einen fehlerfreien Monolog.',
    },
    {
      id: 'falsches_gesagt',
      situation: 'Du hast etwas Falsches oder Unangemessenes gesagt',
      kontext: 'Die Worte sind raus. Gesichter verändern sich. Du merkst: Das war falsch.',
      sofort_reaktion: 'Sofort korrigieren. Nicht hoffen, dass es niemand bemerkt hat.',
      skript: [
        '"Moment — das kam falsch raus. Was ich eigentlich meinte, war..."',
        'Falls es verletzend war: "Das war unangebracht. Das tut mir leid."',
        'Kein "Aber" nach der Entschuldigung. "Das tut mir leid, ABER..." ist keine Entschuldigung.',
        'Weiter. Nicht 10 Minuten lang entschuldigen. Das macht es schlimmer.',
      ],
      warum_es_funktioniert: 'Sofortige Korrektur zeigt Selbstreflexion. Die meisten Menschen respektieren jemanden, der Fehler sofort eingesteht.',
    },
    {
      id: 'traenen',
      situation: 'Du spürst, dass du gleich weinen musst',
      kontext: 'Feedback-Gespräch, Konflikt oder emotionales Thema. Die Augen brennen.',
      sofort_reaktion: 'Du darfst weinen. Es ist menschlich. Aber wenn du es kontrollieren willst:',
      skript: [
        'Schluck Wasser trinken (aktiviert den Vagusnerv).',
        'Auf einen neutralen Punkt an der Wand schauen.',
        '"Entschuldige kurz — das Thema ist mir wichtig. Gib mir einen Moment."',
        'Falls die Tränen kommen: "Das zeigt, wie sehr mir das am Herzen liegt. Ich brauche 5 Minuten."',
      ],
      warum_es_funktioniert: 'Tränen sind keine Schwäche. Aber wenn du sie einordnest ("Das zeigt, wie wichtig mir das ist"), nimmst du ihnen die Peinlichkeit.',
    },
    {
      id: 'stille_nach_frage',
      situation: 'Du stellst eine Frage und niemand antwortet',
      kontext: 'Meeting. 15 Leute. Du fragst: "Was denkt ihr?" Totenstille.',
      sofort_reaktion: 'Nicht sofort die Stille füllen. 7 Sekunden warten (fühlt sich wie eine Ewigkeit an).',
      skript: [
        '7 Sekunden warten. Blickkontakt halten.',
        'Falls Stille: "Ok, ich formuliere es konkreter: [Name], was ist deine Erfahrung mit...?"',
        'Direkte Ansprache funktioniert fast immer.',
        'Alternative: "Ich gebe euch 2 Minuten, schreibt eure Gedanken auf. Dann sammeln wir."',
      ],
      warum_es_funktioniert: 'Offene Fragen an große Gruppen funktionieren selten. Direkte Ansprache oder schriftliches Sammeln senkt die Hemmschwelle.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 15. SZENARIO_KONFLIKTE — 2 interaktive Szenarien
// ---------------------------------------------------------------------------
export const SZENARIO_KONFLIKTE = {
  email_missverstaendnis: {
    id: 'email_missverstaendnis',
    titel: 'Die missverstandene E-Mail',
    beschreibung: 'Du schickst eine sachliche E-Mail. Was dann passiert, zeigt warum Text gefährlich ist.',
    schritte: [
      {
        id: 1,
        situation: 'Du schickst eine E-Mail an den Projektleiter: "Der Zeitplan ist unrealistisch. Wir brauchen mindestens 2 Wochen mehr."',
        frage: 'Auf welchem Ohr wird der Projektleiter das am wahrscheinlichsten hören?',
        optionen: [
          { id: 'a', text: 'Sachohr: "Die Zeitplanung muss angepasst werden."', korrekt: false },
          { id: 'b', text: 'Beziehungsohr: "Du hast schlecht geplant."', korrekt: true },
          { id: 'c', text: 'Appellohr: "Gib mir mehr Zeit."', korrekt: false },
        ],
        erklaerung: 'In E-Mails fehlt der Tonfall. "Unrealistisch" ist ein starkes Wort. Ohne freundliche Mimik wird es schnell als Angriff gelesen.',
      },
      {
        id: 2,
        situation: 'Der Projektleiter antwortet: "Wenn du den Job nicht schaffst, sag Bescheid." Du liest es und bist wütend.',
        frage: 'Was ist die beste Reaktion?',
        optionen: [
          { id: 'a', text: 'Sofort antworten: "Das ist unprofessionell!"', korrekt: false },
          { id: 'b', text: 'Zum Hörer greifen oder persönlich vorbeigehen', korrekt: true },
          { id: 'c', text: 'CC an den Chef setzen', korrekt: false },
        ],
        erklaerung: 'Regel Nr. 1: Emotionale Themen NIEMALS per E-Mail klären. Ruf an oder geh hin. Tonfall löst 80% der Missverständnisse.',
      },
      {
        id: 3,
        situation: 'Du rufst an. Der Projektleiter sagt: "Oh, das war gar nicht so gemeint! Ich meinte: Wenn du Hilfe brauchst, sag Bescheid."',
        frage: 'Was lernst du daraus?',
        optionen: [
          { id: 'a', text: 'Der Projektleiter lügt — er meinte es doch so', korrekt: false },
          { id: 'b', text: 'Text-Kommunikation bei heiklen Themen ist ein Minenfeld', korrekt: true },
          { id: 'c', text: 'E-Mail ist grundsätzlich schlecht', korrekt: false },
        ],
        erklaerung: 'E-Mail ist perfekt für Fakten und Dokumentation. Für alles Emotionale: Anrufen, hingehen, Video-Call. Das 4-Ohren-Modell zeigt, warum.',
      },
    ],
  },

  gehalts_gespraech: {
    id: 'gehalts_gespraech',
    titel: 'Das Gehaltsgespräch',
    beschreibung: 'Verhandle eine Gehaltserhöhung. Nutze Anchoring, BATNA und die Ja-wenn-Technik.',
    konzepte: {
      anchoring: {
        name: 'Anchoring (Anker setzen)',
        beschreibung: 'Die erste genannte Zahl setzt den Rahmen. Wer zuerst eine Zahl nennt, kontrolliert die Verhandlung.',
        tipp: 'Nenne eine Zahl, die 10-15% über deinem Wunsch liegt. Der Kompromiss landet dann bei deinem Wunsch.',
      },
      batna: {
        name: 'BATNA (Best Alternative to a Negotiated Agreement)',
        beschreibung: 'Deine beste Alternative, falls die Verhandlung scheitert. Je besser deine BATNA, desto stärker deine Position.',
        tipp: 'Bevor du verhandelst: Habe ein anderes Angebot. Oder zumindest: Wisse, was du auf dem Markt wert bist.',
      },
      ja_wenn: {
        name: 'Die Ja-wenn-Technik',
        beschreibung: 'Statt "Nein" sagst du "Ja, wenn...". Das hält die Verhandlung offen und zeigt Flexibilität.',
        tipp: '"Ja, ich verstehe die Budgetgrenzen. Wenn eine Gehaltserhöhung gerade nicht geht — was wäre mit 5 zusätzlichen Urlaubstagen?"',
      },
    },
    schritte: [
      {
        id: 1,
        situation: 'Du hast einen Termin beim Chef. Thema: Gehaltsanpassung. Der Chef fragt: "Was schwebt dir vor?"',
        frage: 'Wie reagierst du?',
        optionen: [
          { id: 'a', text: '"Ich dachte an eine kleine Anpassung... was meinen Sie?"', korrekt: false },
          { id: 'b', text: '"Basierend auf meiner Leistung und dem Marktwert halte ich 65.000€ für angemessen." [Anchoring]', korrekt: true },
          { id: 'c', text: '"Eigentlich möchte ich 55.000€, aber ich nehme auch 50.000€."', korrekt: false },
        ],
        erklaerung: 'Konkrete Zahl + Begründung + selbstbewusst. Keine Entschuldigung, kein "kleine Anpassung". Anchoring: Nenne die Zahl zuerst.',
      },
      {
        id: 2,
        situation: 'Der Chef sagt: "Das ist über unserem Budget. Ich kann maximal 55.000€ anbieten."',
        frage: 'Wie reagierst du?',
        optionen: [
          { id: 'a', text: '"Ok, dann nehme ich die 55.000€."', korrekt: false },
          { id: 'b', text: '"Ich verstehe die Budgetgrenzen. Ja, 55.000€ Grundgehalt — wenn wir zusätzlich einen Leistungsbonus von 10% vereinbaren und ich eine Weiterbildung bekomme." [Ja-wenn]', korrekt: true },
          { id: 'c', text: '"Dann muss ich mir das überlegen. Ich habe auch andere Angebote."', korrekt: false },
        ],
        erklaerung: 'Ja-wenn-Technik: Du akzeptierst den Rahmen, erweiterst aber das Paket. Nicht nur Gehalt — auch Bonus, Weiterbildung, Urlaubstage, Remote-Tage.',
      },
      {
        id: 3,
        situation: 'Der Chef sagt: "Bonus ist schwierig. Aber Weiterbildung könnte ich genehmigen. Und 2 zusätzliche Remote-Tage pro Woche."',
        frage: 'Wie schließt du ab?',
        optionen: [
          { id: 'a', text: '"Hmm, ich weiß nicht... kann ich noch ein bisschen mehr rausholen?"', korrekt: false },
          { id: 'b', text: '"Das klingt nach einem guten Paket. 55.000€ plus Weiterbildung plus 2 Remote-Tage. Können wir das schriftlich festhalten? Und in 6 Monaten nochmal über die 65.000€ sprechen?"', korrekt: true },
          { id: 'c', text: '"Danke, das reicht mir."', korrekt: false },
        ],
        erklaerung: 'Zusammenfassen, schriftlich festhalten, Review-Termin setzen. Du zeigst: Ich bin professionell, fair und denke langfristig.',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 16. ABSCHLUSSTEST_KOMM — 10 MC-Fragen, 7/10 zum Bestehen
// ---------------------------------------------------------------------------
export const ABSCHLUSSTEST_KOMM = {
  titel: 'Abschlusstest: Kommunikation',
  beschreibung: 'Teste dein Wissen. Du brauchst mindestens 7 von 10 richtigen Antworten zum Bestehen.',
  bestehensgrenze: 7,
  fragen: [
    {
      id: 1,
      frage: 'Wer hat das 4-Ohren-Modell entwickelt?',
      optionen: [
        { id: 'a', text: 'Paul Watzlawick' },
        { id: 'b', text: 'Friedemann Schulz von Thun' },
        { id: 'c', text: 'Carl Rogers' },
        { id: 'd', text: 'Marshall Rosenberg' },
      ],
      richtig: 'b',
      erklaerung: 'Friedemann Schulz von Thun entwickelte das Vier-Seiten-Modell (auch Kommunikationsquadrat oder 4-Ohren-Modell) in den 1980er Jahren.',
    },
    {
      id: 2,
      frage: 'Was ist die Schlüsseltechnik beim Aktiven Zuhören?',
      optionen: [
        { id: 'a', text: 'Ratschläge geben' },
        { id: 'b', text: 'Paraphrasieren' },
        { id: 'c', text: 'Nicken' },
        { id: 'd', text: 'Blickkontakt halten' },
      ],
      richtig: 'b',
      erklaerung: 'Paraphrasieren (in eigenen Worten wiedergeben) zeigt, dass du wirklich verstanden hast — nicht nur gehört.',
    },
    {
      id: 3,
      frage: 'Laut Mehrabian — welchen Anteil hat die Stimme (Tonfall) an der emotionalen Wirkung einer Botschaft?',
      optionen: [
        { id: 'a', text: '7%' },
        { id: 'b', text: '55%' },
        { id: 'c', text: '38%' },
        { id: 'd', text: '25%' },
      ],
      richtig: 'c',
      erklaerung: 'Die Mehrabian-Regel (7-38-55): 7% Worte, 38% Stimme/Tonfall, 55% Körpersprache — gilt für emotionale/widersprüchliche Botschaften.',
    },
    {
      id: 4,
      frage: 'Wofür steht SBI im Feedback-Modell?',
      optionen: [
        { id: 'a', text: 'Situation, Behavior, Impact' },
        { id: 'b', text: 'Start, Build, Improve' },
        { id: 'c', text: 'See, Believe, Inspire' },
        { id: 'd', text: 'Strength, Balance, Insight' },
      ],
      richtig: 'a',
      erklaerung: 'SBI: Situation (Wann/Wo), Behavior (Was genau), Impact (Welche Auswirkung). Konkret, sachlich, verbesserungsorientiert.',
    },
    {
      id: 5,
      frage: 'Wofür steht BLUF im E-Mail-Kontext?',
      optionen: [
        { id: 'a', text: 'Brief, List, Update, Follow-up' },
        { id: 'b', text: 'Bottom Line Up Front' },
        { id: 'c', text: 'Build Links, Use Facts' },
        { id: 'd', text: 'Be Loud, Unique, Focused' },
      ],
      richtig: 'b',
      erklaerung: 'BLUF — Bottom Line Up Front: Die Kernaussage kommt in den ersten Satz. Militärisches Prinzip für klare Kommunikation.',
    },
    {
      id: 6,
      frage: 'Welcher Kommunikationskanal ist am besten für Konflikte geeignet?',
      optionen: [
        { id: 'a', text: 'E-Mail (alles schriftlich dokumentiert)' },
        { id: 'b', text: 'Slack/Teams-Nachricht' },
        { id: 'c', text: 'Persönliches Gespräch / Anruf' },
        { id: 'd', text: 'Sprachnachricht' },
      ],
      richtig: 'c',
      erklaerung: 'Konflikte brauchen Tonfall und Mimik. Persönliches Gespräch (oder Video-Call) ist der einzige Kanal, der Eskalation zuverlässig verhindert.',
    },
    {
      id: 7,
      frage: 'Was verursacht den Negativity Bias bei Text-Nachrichten?',
      optionen: [
        { id: 'a', text: 'Zu viele Emojis' },
        { id: 'b', text: 'Fehlender Tonfall' },
        { id: 'c', text: 'Zu lange Nachrichten' },
        { id: 'd', text: 'Rechtschreibfehler' },
      ],
      richtig: 'b',
      erklaerung: 'Ohne Tonfall interpretiert das Gehirn ambige Nachrichten negativ. "Ok." kann neutral sein — dein Gehirn liest es als genervt.',
    },
    {
      id: 8,
      frage: 'Was ist die beste Reaktion, wenn jemand beim Feedback-Geben anfängt zu weinen?',
      optionen: [
        { id: 'a', text: 'Feedback sofort zurücknehmen' },
        { id: 'b', text: '"Stell dich nicht so an"' },
        { id: 'c', text: 'Pause anbieten, Empathie zeigen' },
        { id: 'd', text: 'Sofort das Thema wechseln' },
      ],
      richtig: 'c',
      erklaerung: 'Pause anbieten und Empathie zeigen: "Ich sehe, das beschäftigt dich. Möchtest du eine Pause?" Respektiere die Emotion, opfere nicht das Feedback.',
    },
    {
      id: 9,
      frage: 'Was ist der erste Schritt der STOPP-Methode?',
      optionen: [
        { id: 'a', text: 'Tief durchatmen' },
        { id: 'b', text: 'Stop (Mund zu, 3 Sekunden Stille)' },
        { id: 'c', text: 'Die Situation beobachten' },
        { id: 'd', text: 'Perspektive wechseln' },
      ],
      richtig: 'b',
      erklaerung: 'S = Stop. Mund zu. 3 Sekunden Stille. Dein erster Impuls ist fast immer falsch. Erst stoppen, dann atmen, dann beobachten.',
    },
    {
      id: 10,
      frage: 'Wofür steht das D in der FORD-Methode für Smalltalk?',
      optionen: [
        { id: 'a', text: 'Discussions' },
        { id: 'b', text: 'Details' },
        { id: 'c', text: 'Dreams' },
        { id: 'd', text: 'Decisions' },
      ],
      richtig: 'c',
      erklaerung: 'FORD: Family, Occupation, Recreation, Dreams. "Dreams" öffnet tiefe Gespräche: "Was würdest du machen, wenn Geld keine Rolle spielen würde?"',
    },
  ],
};

// ---------------------------------------------------------------------------
// 17. MODUL_QUIZ_KOMM — Quiz-Fragen pro Modul
// ---------------------------------------------------------------------------
export const MODUL_QUIZ_KOMM = {
  modul_1: {
    titel: 'Quiz: Das 4-Ohren-Modell',
    fragen: [
      {
        id: 1,
        frage: 'Welche 4 Seiten hat eine Nachricht laut Schulz von Thun?',
        optionen: [
          { id: 'a', text: 'Sender, Empfänger, Kanal, Nachricht' },
          { id: 'b', text: 'Sachinhalt, Selbstoffenbarung, Beziehung, Appell' },
          { id: 'c', text: 'Wer, Was, Wann, Warum' },
          { id: 'd', text: 'Verbal, Paraverbal, Nonverbal, Schriftlich' },
        ],
        richtig: 'b',
      },
      {
        id: 2,
        frage: '"Die Ampel ist grün." — Was ist der Appell?',
        optionen: [
          { id: 'a', text: 'Die Ampel zeigt grünes Licht' },
          { id: 'b', text: 'Ich habe es eilig' },
          { id: 'c', text: 'Du fährst zu langsam' },
          { id: 'd', text: 'Fahr los!' },
        ],
        richtig: 'd',
      },
      {
        id: 3,
        frage: 'Auf welchem Ohr hörst du, wenn du dich persönlich angegriffen fühlst?',
        optionen: [
          { id: 'a', text: 'Sachohr' },
          { id: 'b', text: 'Selbstoffenbarungsohr' },
          { id: 'c', text: 'Beziehungsohr' },
          { id: 'd', text: 'Appellohr' },
        ],
        richtig: 'c',
      },
    ],
  },
  modul_2: {
    titel: 'Quiz: Aktives Zuhören',
    fragen: [
      {
        id: 1,
        frage: 'Welche Zuhör-Stufe beschreibt "Nur hören, was die eigene Meinung bestätigt"?',
        optionen: [
          { id: 'a', text: 'Ignorieren' },
          { id: 'b', text: 'Pseudo-Zuhören' },
          { id: 'c', text: 'Selektives Zuhören' },
          { id: 'd', text: 'Aufmerksames Zuhören' },
        ],
        richtig: 'c',
      },
      {
        id: 2,
        frage: 'Was ist der Unterschied zwischen Paraphrasieren und Papageien?',
        optionen: [
          { id: 'a', text: 'Kein Unterschied' },
          { id: 'b', text: 'Paraphrasieren nutzt eigene Worte, Papageien wiederholt wörtlich' },
          { id: 'c', text: 'Papageien ist besser' },
          { id: 'd', text: 'Paraphrasieren ist kürzer' },
        ],
        richtig: 'b',
      },
      {
        id: 3,
        frage: 'Wer gilt als Vater des Aktiven Zuhörens?',
        optionen: [
          { id: 'a', text: 'Sigmund Freud' },
          { id: 'b', text: 'Carl Rogers' },
          { id: 'c', text: 'Dale Carnegie' },
          { id: 'd', text: 'Daniel Goleman' },
        ],
        richtig: 'b',
      },
    ],
  },
  modul_3: {
    titel: 'Quiz: Körpersprache & Wirkung',
    fragen: [
      {
        id: 1,
        frage: 'Was besagt die Mehrabian-Regel?',
        optionen: [
          { id: 'a', text: '100% der Wirkung kommt von Worten' },
          { id: 'b', text: '7% Worte, 38% Stimme, 55% Körpersprache' },
          { id: 'c', text: '33% Worte, 33% Stimme, 33% Körpersprache' },
          { id: 'd', text: '50% Worte, 50% Stimme' },
        ],
        richtig: 'b',
      },
      {
        id: 2,
        frage: 'Warum sollte man nie ein einzelnes Körpersprache-Signal isoliert bewerten?',
        optionen: [
          { id: 'a', text: 'Weil Körpersprache immer lügt' },
          { id: 'b', text: 'Weil ein Signal viele Ursachen haben kann (Cluster-Regel)' },
          { id: 'c', text: 'Weil Körpersprache unwichtig ist' },
          { id: 'd', text: 'Weil nur Worte zählen' },
        ],
        richtig: 'b',
      },
      {
        id: 3,
        frage: 'Welcher Körperteil ist laut Experten am ehrlichsten?',
        optionen: [
          { id: 'a', text: 'Augen' },
          { id: 'b', text: 'Hände' },
          { id: 'c', text: 'Füße' },
          { id: 'd', text: 'Mund' },
        ],
        richtig: 'c',
      },
    ],
  },
  modul_4: {
    titel: 'Quiz: Stimme & Rhetorik',
    fragen: [
      {
        id: 1,
        frage: 'Was ist "Upspeak"?',
        optionen: [
          { id: 'a', text: 'Zu laut sprechen' },
          { id: 'b', text: 'Satzende geht nach oben wie eine Frage' },
          { id: 'c', text: 'Monoton sprechen' },
          { id: 'd', text: 'Zu schnell sprechen' },
        ],
        richtig: 'b',
      },
      {
        id: 2,
        frage: 'Was ist die ideale Sprechgeschwindigkeit?',
        optionen: [
          { id: 'a', text: '80 Wörter pro Minute' },
          { id: 'b', text: '130 Wörter pro Minute' },
          { id: 'c', text: '200 Wörter pro Minute' },
          { id: 'd', text: '160 Wörter pro Minute' },
        ],
        richtig: 'b',
      },
      {
        id: 3,
        frage: 'Was ist das beste Mittel gegen Füllwörter?',
        optionen: [
          { id: 'a', text: 'Schneller sprechen' },
          { id: 'b', text: 'Füllwörter durch Pausen ersetzen' },
          { id: 'c', text: 'Auswendig lernen' },
          { id: 'd', text: 'Weniger reden' },
        ],
        richtig: 'b',
      },
    ],
  },
  modul_5: {
    titel: 'Quiz: Feedback geben & nehmen',
    fragen: [
      {
        id: 1,
        frage: 'Was ist das Problem mit dem "Lob-Sandwich"?',
        optionen: [
          { id: 'a', text: 'Es ist zu positiv' },
          { id: 'b', text: 'Das "Aber" in der Mitte löscht das Lob davor' },
          { id: 'c', text: 'Es dauert zu lange' },
          { id: 'd', text: 'Es ist zu direkt' },
        ],
        richtig: 'b',
      },
      {
        id: 2,
        frage: 'Was macht SBI-Feedback wirksam?',
        optionen: [
          { id: 'a', text: 'Es ist immer positiv' },
          { id: 'b', text: 'Es ist spezifisch, sachlich und beschreibt die Auswirkung' },
          { id: 'c', text: 'Es ist kurz' },
          { id: 'd', text: 'Es vermeidet Kritik' },
        ],
        richtig: 'b',
      },
      {
        id: 3,
        frage: 'Was tust du, wenn jemand beim Feedback weint?',
        optionen: [
          { id: 'a', text: 'Feedback zurücknehmen' },
          { id: 'b', text: 'Weitermachen als wäre nichts' },
          { id: 'c', text: 'Pause anbieten, Empathie zeigen, Feedback nicht zurücknehmen' },
          { id: 'd', text: 'Das Gespräch abbrechen' },
        ],
        richtig: 'c',
      },
      {
        id: 4,
        frage: 'Warum sagen "Mehrere Leute finden das auch" beim Feedback?',
        optionen: [
          { id: 'a', text: 'Verstärkt die Botschaft positiv' },
          { id: 'b', text: 'Erzeugt Paranoia — Wer? Wann? Passiv-aggressiv' },
          { id: 'c', text: 'Ist wissenschaftlich empfohlen' },
          { id: 'd', text: 'Macht das Feedback glaubwürdiger' },
        ],
        richtig: 'b',
      },
    ],
  },
  modul_6: {
    titel: 'Quiz: Konflikte lösen',
    fragen: [
      {
        id: 1,
        frage: 'Was ist die erste Regel bei einem eskalierenden Konflikt?',
        optionen: [
          { id: 'a', text: 'Sofort Position beziehen' },
          { id: 'b', text: 'Deeskalieren — auf Sachebene lenken' },
          { id: 'c', text: 'Den Schuldigen finden' },
          { id: 'd', text: 'HR einschalten' },
        ],
        richtig: 'b',
      },
      {
        id: 2,
        frage: 'Warum ist "Beruhig dich" der schlechteste Satz?',
        optionen: [
          { id: 'a', text: 'Er ist zu kurz' },
          { id: 'b', text: 'Er invalidiert die Emotion und eskaliert IMMER' },
          { id: 'c', text: 'Er ist zu höflich' },
          { id: 'd', text: 'Er funktioniert nur bei Frauen nicht' },
        ],
        richtig: 'b',
      },
      {
        id: 3,
        frage: 'Was ist der Unterschied zwischen Schuld suchen und Ursache analysieren?',
        optionen: [
          { id: 'a', text: 'Kein Unterschied' },
          { id: 'b', text: 'Schuld suchen = Vergangenheit + Person; Ursache analysieren = Zukunft + System' },
          { id: 'c', text: 'Schuld suchen ist effektiver' },
          { id: 'd', text: 'Ursache analysieren dauert zu lange' },
        ],
        richtig: 'b',
      },
    ],
  },
  modul_7: {
    titel: 'Quiz: Präsentieren & Überzeugen',
    fragen: [
      {
        id: 1,
        frage: 'Was ist die Formel für einen Elevator Pitch?',
        optionen: [
          { id: 'a', text: 'Wer bin ich + Was mache ich + Warum bin ich toll' },
          { id: 'b', text: 'Problem → Lösung → Nutzen' },
          { id: 'c', text: 'Einleitung → Hauptteil → Schluss' },
          { id: 'd', text: 'These → Antithese → Synthese' },
        ],
        richtig: 'b',
      },
      {
        id: 2,
        frage: 'Was tust du bei einem Technik-Ausfall während der Präsentation?',
        optionen: [
          { id: 'a', text: 'Meeting abbrechen' },
          { id: 'b', text: 'Panisch am Laptop rumdrücken' },
          { id: 'c', text: 'Souverän weitermachen — die Kernbotschaft frei vortragen' },
          { id: 'd', text: 'IT anrufen und alle warten lassen' },
        ],
        richtig: 'c',
      },
      {
        id: 3,
        frage: 'Was sind die 3 Überzeugungsmittel nach Aristoteles?',
        optionen: [
          { id: 'a', text: 'Fakten, Emotionen, Logik' },
          { id: 'b', text: 'Ethos, Pathos, Logos' },
          { id: 'c', text: 'Wer, Was, Warum' },
          { id: 'd', text: 'Sender, Nachricht, Empfänger' },
        ],
        richtig: 'b',
      },
    ],
  },
  modul_8: {
    titel: 'Quiz: Digitale Kommunikation',
    fragen: [
      {
        id: 1,
        frage: 'Was ist der Hauptgrund für Missverständnisse in Text-Nachrichten?',
        optionen: [
          { id: 'a', text: 'Tippfehler' },
          { id: 'b', text: 'Fehlender Tonfall (Negativity Bias)' },
          { id: 'c', text: 'Zu kurze Nachrichten' },
          { id: 'd', text: 'Falsche Emojis' },
        ],
        richtig: 'b',
      },
      {
        id: 2,
        frage: 'Was ist besser als "Hast du kurz?" auf Slack?',
        optionen: [
          { id: 'a', text: '"Bist du da?"' },
          { id: 'b', text: '"Hast du 5 Min für eine Frage zum Budget Q2?"' },
          { id: 'c', text: '"DRINGEND!!!"' },
          { id: 'd', text: 'Einfach anrufen' },
        ],
        richtig: 'b',
      },
      {
        id: 3,
        frage: 'Warum sollten Meetings 25 statt 30 Minuten dauern?',
        optionen: [
          { id: 'a', text: 'Kürzere Meetings sind immer besser' },
          { id: 'b', text: '5 Minuten Puffer für Reset zwischen Calls' },
          { id: 'c', text: 'Die Aufmerksamkeitsspanne beträgt nur 25 Minuten' },
          { id: 'd', text: 'Das spart Geld' },
        ],
        richtig: 'b',
      },
    ],
  },
  modul_9: {
    titel: 'Quiz: Schriftliche Kommunikation',
    fragen: [
      {
        id: 1,
        frage: 'Was ist das BLUF-Prinzip?',
        optionen: [
          { id: 'a', text: 'Lange Einleitung, dann die Pointe' },
          { id: 'b', text: 'Die Kernaussage kommt in den ersten Satz' },
          { id: 'c', text: 'Immer mit einer Frage beginnen' },
          { id: 'd', text: 'Möglichst viele Details liefern' },
        ],
        richtig: 'b',
      },
      {
        id: 2,
        frage: 'Was gehört in eine gute E-Mail-Betreffzeile?',
        optionen: [
          { id: 'a', text: '"Hallo"' },
          { id: 'b', text: '"WICHTIG!!!"' },
          { id: 'c', text: 'Konkretes Thema + ggf. Handlungsbedarf' },
          { id: 'd', text: 'Möglichst kurz, ein Wort reicht' },
        ],
        richtig: 'c',
      },
      {
        id: 3,
        frage: 'Wann solltest du NICHT per E-Mail kommunizieren?',
        optionen: [
          { id: 'a', text: 'Bei Status-Updates' },
          { id: 'b', text: 'Bei emotionalen oder heiklen Themen' },
          { id: 'c', text: 'Bei offiziellen Entscheidungen' },
          { id: 'd', text: 'Bei externen Kunden' },
        ],
        richtig: 'b',
      },
    ],
  },
  modul_10: {
    titel: 'Quiz: Smalltalk & Netzwerken',
    fragen: [
      {
        id: 1,
        frage: 'Wofür steht FORD?',
        optionen: [
          { id: 'a', text: 'Focus, Organize, Reflect, Deliver' },
          { id: 'b', text: 'Family, Occupation, Recreation, Dreams' },
          { id: 'c', text: 'Find, Open, Relate, Deepen' },
          { id: 'd', text: 'Friendly, Open, Respectful, Direct' },
        ],
        richtig: 'b',
      },
      {
        id: 2,
        frage: 'Was ist das beste Gesprächsende bei Networking-Events?',
        optionen: [
          { id: 'a', text: 'Einfach weggehen' },
          { id: 'b', text: '"Es war toll, mit dir zu sprechen. Vernetzen wir uns auf LinkedIn?"' },
          { id: 'c', text: '"Ich muss aufs Klo"' },
          { id: 'd', text: 'Warten bis der andere geht' },
        ],
        richtig: 'b',
      },
      {
        id: 3,
        frage: 'Welches Thema ist beim Smalltalk tabu?',
        optionen: [
          { id: 'a', text: 'Hobbys' },
          { id: 'b', text: 'Reisen' },
          { id: 'c', text: 'Gehalt und Finanzen' },
          { id: 'd', text: 'Beruflicher Werdegang' },
        ],
        richtig: 'c',
      },
    ],
  },
  modul_11: {
    titel: 'Quiz: Stress-Kommunikation',
    fragen: [
      {
        id: 1,
        frage: 'Was ist der erste Schritt der STOPP-Methode?',
        optionen: [
          { id: 'a', text: 'Perspektive wechseln' },
          { id: 'b', text: 'Tief durchatmen' },
          { id: 'c', text: 'Stop — Mund zu, 3 Sekunden Stille' },
          { id: 'd', text: 'Beobachten' },
        ],
        richtig: 'c',
      },
      {
        id: 2,
        frage: 'Was ist die beste Reaktion, wenn du angeschrien wirst?',
        optionen: [
          { id: 'a', text: 'Zurückschreien' },
          { id: 'b', text: 'Ruhig bleiben, Grenze setzen, Gespräch vertagen' },
          { id: 'c', text: 'Weglaufen' },
          { id: 'd', text: 'Sofort HR anrufen' },
        ],
        richtig: 'b',
      },
      {
        id: 3,
        frage: 'Was ist die 5-5-5-Regel?',
        optionen: [
          { id: 'a', text: '5 Sekunden atmen, 5 Sekunden denken, 5 Sekunden reden' },
          { id: 'b', text: 'Wird es in 5 Minuten, 5 Monaten, 5 Jahren wichtig sein?' },
          { id: 'c', text: '5 Punkte nennen, 5 Minuten reden, 5 Fragen stellen' },
          { id: 'd', text: '5 Leute fragen, 5 Optionen abwägen, 5 Minuten warten' },
        ],
        richtig: 'b',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 18. JOURNAL_FRAGEN_KOMM — 11 Reflexionsfragen
// ---------------------------------------------------------------------------
export const JOURNAL_FRAGEN_KOMM = {
  titel: 'Reflexions-Journal: Kommunikation',
  beschreibung:
    'Eine Frage pro Modul. Nimm dir 5 Minuten und schreibe deine ehrliche Antwort. Es gibt kein Richtig oder Falsch — nur deine Reflexion.',
  fragen: [
    {
      modul: 1,
      titel: 'Das 4-Ohren-Modell',
      frage: 'Denke an ein Missverständnis in den letzten Wochen. Auf welchem Ohr hast du gehört — und auf welchem Ohr hat dein Gegenüber gesendet?',
    },
    {
      modul: 2,
      titel: 'Aktives Zuhören',
      frage: 'Auf welcher Zuhör-Stufe bist du typischerweise? In welchen Situationen rutschst du auf Stufe 2 oder 3 ab?',
    },
    {
      modul: 3,
      titel: 'Körpersprache',
      frage: 'Welches Körpersprache-Signal zeigst du unbewusst am häufigsten? Was könnte es bei anderen auslösen?',
    },
    {
      modul: 4,
      titel: 'Stimme & Rhetorik',
      frage: 'Welcher Stimmkiller betrifft dich am meisten (Upspeak, Füllwörter, zu schnell, monoton)? Was wirst du diese Woche dagegen tun?',
    },
    {
      modul: 5,
      titel: 'Feedback',
      frage: 'Wann hast du zuletzt ehrliches Feedback gegeben — oder vermieden? Was hat dich zurückgehalten?',
    },
    {
      modul: 6,
      titel: 'Konflikte',
      frage: 'Welcher ungelöste Konflikt belastet dich aktuell? Was wäre der erste Schritt zur Lösung?',
    },
    {
      modul: 7,
      titel: 'Präsentieren',
      frage: 'Hast du einen Elevator Pitch parat? Wenn der CEO morgen im Aufzug steht — was sagst du in 60 Sekunden?',
    },
    {
      modul: 8,
      titel: 'Digitale Kommunikation',
      frage: 'Welche digitale Kommunikations-Gewohnheit kostet dich am meisten Energie? Was wirst du ändern?',
    },
    {
      modul: 9,
      titel: 'Schriftliche Kommunikation',
      frage: 'Lies deine letzte wichtige E-Mail nochmal. Steht die Kernaussage im ersten Satz? Gibt es eine klare Handlungsaufforderung?',
    },
    {
      modul: 10,
      titel: 'Smalltalk & Netzwerken',
      frage: 'Mit wem würdest du gerne ins Gespräch kommen, traust dich aber nicht? Was hält dich zurück — und was wäre der einfachste Opener?',
    },
    {
      modul: 11,
      titel: 'Stress-Kommunikation',
      frage: 'Denke an die letzte Situation, in der du unter Stress etwas gesagt hast, das du bereut hast. Was hättest du mit der STOPP-Methode anders gemacht?',
    },
  ],
};

// ---------------------------------------------------------------------------
// 19. RUECKFALL_KOMMUNIKATION — Warnsignale + Reset-Protokoll
// ---------------------------------------------------------------------------
export const RUECKFALL_KOMMUNIKATION = {
  titel: 'Rückfall-Prävention: Kommunikation',
  beschreibung:
    'Alte Gewohnheiten kommen zurück. Besonders unter Stress. Diese Warnsignale zeigen dir, wann du dein Kommunikations-System resetten musst.',
  warnsignale: [
    {
      id: 1,
      signal: 'Du reagierst statt zu antworten',
      beschreibung: 'Dein erster Impuls wird wieder zu deiner Antwort. Keine Pause, kein STOPP, kein Nachdenken.',
      check: 'Hast du diese Woche etwas gesagt, das du sofort bereut hast?',
    },
    {
      id: 2,
      signal: 'Feedback wird wieder vermieden',
      beschreibung: 'Du denkst: "Ach, ist nicht so schlimm" oder "Will ich jetzt nicht ansprechen."',
      check: 'Gibt es etwas, das du jemandem schon seit 2+ Wochen sagen wolltest?',
    },
    {
      id: 3,
      signal: 'Konflikte werden geschluckt',
      beschreibung: 'Statt Konflikte zu adressieren, schluckst du den Ärger runter. Bis er irgendwann explodiert.',
      check: 'Gibt es eine Person, bei der du innerlich kochst, aber nichts sagst?',
    },
    {
      id: 4,
      signal: 'E-Mails werden wieder Roman-lang',
      beschreibung: 'Statt BLUF schreibst du wieder 3 Absätze Einleitung, bevor du zum Punkt kommst.',
      check: 'Steht in deiner letzten E-Mail die Kernaussage im ersten Satz?',
    },
    {
      id: 5,
      signal: 'Zuhören wird wieder automatisch',
      beschreibung: 'Du hörst zu, um zu antworten — nicht um zu verstehen. Paraphrasieren? Vergessen.',
      check: 'Wann hast du zuletzt in eigenen Worten zusammengefasst, was jemand gesagt hat?',
    },
  ],
  reset_protokoll: {
    name: '4-Schritte-Reset',
    beschreibung: 'Wenn 2+ Warnsignale zutreffen, ist es Zeit für einen Reset.',
    schritte: [
      {
        nr: 1,
        name: 'Diagnose wiederholen',
        beschreibung: 'Mach die Selbstdiagnose vom Kursstart nochmal. Vergleiche: Wo stehst du jetzt?',
        dauer: '5 Minuten',
      },
      {
        nr: 2,
        name: 'Einen Skill reaktivieren',
        beschreibung: 'Wähle EINEN Skill und wende ihn diese Woche bewusst 3x an. Nicht alles auf einmal.',
        dauer: '1 Woche',
      },
      {
        nr: 3,
        name: 'Feedback einholen',
        beschreibung: 'Frag eine Vertrauensperson: "Wie nimmst du meine Kommunikation in letzter Zeit wahr?"',
        dauer: '1 Gespräch',
      },
      {
        nr: 4,
        name: 'Journal schreiben',
        beschreibung: 'Beantworte die Journal-Frage des Moduls, das am meisten betroffen ist.',
        dauer: '10 Minuten',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 20. VORHER_NACHHER — 6 Metriken, 4 Zeitpunkte
// ---------------------------------------------------------------------------
export const VORHER_NACHHER = {
  titel: 'Fortschritts-Tracker: Kommunikation',
  beschreibung:
    'Bewerte dich selbst auf einer Skala von 1-10. Wiederhole die Bewertung zu den 4 Zeitpunkten und beobachte deinen Fortschritt.',
  skala: { min: 1, max: 10, labels: { 1: 'Anfänger', 5: 'Solide Basis', 10: 'Meister-Level' } },
  metriken: [
    {
      id: 'erklaeren',
      name: 'Erklären',
      beschreibung: 'Wie gut kannst du komplexe Sachverhalte einfach und verständlich erklären?',
    },
    {
      id: 'zuhoeren',
      name: 'Zuhören',
      beschreibung: 'Wie gut hörst du aktiv zu und verstehst, was andere wirklich meinen?',
    },
    {
      id: 'praesentieren',
      name: 'Präsentieren',
      beschreibung: 'Wie sicher fühlst du dich bei Präsentationen und freien Reden?',
    },
    {
      id: 'feedback',
      name: 'Feedback',
      beschreibung: 'Wie gut kannst du konstruktives Feedback geben und empfangen?',
    },
    {
      id: 'konflikte',
      name: 'Konflikte',
      beschreibung: 'Wie souverän gehst du mit Konflikten und schwierigen Gesprächen um?',
    },
    {
      id: 'emails',
      name: 'E-Mails',
      beschreibung: 'Wie klar, strukturiert und effektiv sind deine schriftlichen Nachrichten?',
    },
  ],
  zeitpunkte: [
    { id: 'kursstart', label: 'Kursstart', beschreibung: 'Dein Ausgangswert vor dem Kurs.' },
    { id: 'nach_abschluss', label: 'Nach Abschluss', beschreibung: 'Direkt nach Abschluss aller Module.' },
    { id: '30_tage', label: '30 Tage danach', beschreibung: '30 Tage nach Kursabschluss. Praxis-Check.' },
    { id: '90_tage', label: '90 Tage danach', beschreibung: '90 Tage nach Kursabschluss. Langzeit-Check.' },
  ],
};

// ---------------------------------------------------------------------------
// 21. MICRO_LEARNINGS_KOMM — 12 Impulse
// ---------------------------------------------------------------------------
export const MICRO_LEARNINGS_KOMM = {
  titel: 'Micro-Learnings: 90 Tage Kommunikations-Training',
  beschreibung: '12 kurze Impulse über 90 Tage. Jeder Impuls dauert maximal 5 Minuten.',
  impulse: [
    {
      tag: 1,
      titel: '4-Ohren-Check',
      impuls: 'Achte heute bei einem Gespräch bewusst darauf: Auf welchem Ohr hörst du? Schreib es abends auf.',
      dauer: '2 Minuten',
    },
    {
      tag: 2,
      titel: 'Paraphrasier-Challenge',
      impuls: 'Fasse heute in einem Gespräch in eigenen Worten zusammen, was dein Gegenüber gesagt hat. Beobachte die Reaktion.',
      dauer: '3 Minuten',
    },
    {
      tag: 3,
      titel: 'Körpersprache-Scan',
      impuls: 'Beobachte heute in einem Meeting die Körpersprache von 2 Personen. Welche Cluster erkennst du?',
      dauer: '5 Minuten',
    },
    {
      tag: 4,
      titel: 'Füllwörter-Zähler',
      impuls: 'Nimm dich bei einem Telefonat auf (nur für dich). Zähle deine Füllwörter. Wie viele pro Minute?',
      dauer: '5 Minuten',
    },
    {
      tag: 5,
      titel: 'SBI-Feedback',
      impuls: 'Gib heute einer Person ein konkretes SBI-Feedback. Positiv oder konstruktiv — Hauptsache spezifisch.',
      dauer: '3 Minuten',
    },
    {
      tag: 7,
      titel: 'BLUF-E-Mail',
      impuls: 'Schreibe deine nächste wichtige E-Mail nach dem BLUF-Prinzip. Kernaussage im ersten Satz.',
      dauer: '5 Minuten',
    },
    {
      tag: 10,
      titel: 'STOPP in Action',
      impuls: 'Wende heute die STOPP-Methode an, wenn dich etwas ärgert. Auch bei Kleinigkeiten üben!',
      dauer: '1 Minute',
    },
    {
      tag: 14,
      titel: 'Elevator Pitch üben',
      impuls: 'Sprich deinen Elevator Pitch laut vor dem Spiegel. 60 Sekunden. Timer an. Wie fühlt es sich an?',
      dauer: '3 Minuten',
    },
    {
      tag: 21,
      titel: 'Smalltalk-Challenge',
      impuls: 'Starte heute mit einem Fremden oder wenig bekannten Kollegen ein Gespräch. Nutze FORD.',
      dauer: '5 Minuten',
    },
    {
      tag: 30,
      titel: '30-Tage-Review',
      impuls: 'Fülle den Fortschritts-Tracker aus (30-Tage-Messung). Vergleiche mit deinem Kursstart-Wert.',
      dauer: '5 Minuten',
    },
    {
      tag: 60,
      titel: 'Rückfall-Check',
      impuls: 'Gehe die 5 Warnsignale durch. Treffen 2 oder mehr zu? Dann starte das Reset-Protokoll.',
      dauer: '5 Minuten',
    },
    {
      tag: 90,
      titel: '90-Tage-Abschluss',
      impuls: 'Fülle den finalen Fortschritts-Tracker aus. Vergleiche alle 4 Zeitpunkte. Feiere deinen Fortschritt!',
      dauer: '5 Minuten',
    },
  ],
};

// ---------------------------------------------------------------------------
// 22. MARKTWERT_BOOST_KOMM — XP-Tabelle
// ---------------------------------------------------------------------------
export const MARKTWERT_BOOST_KOMM = {
  titel: 'Marktwert-Boost: Kommunikation',
  beschreibung:
    'Deine Kommunikations-Skills sind karriererelevant. Hier siehst du, wie du XP sammelst — durch Training UND echte Anwendung.',
  training: [
    { aktion: 'Selbstdiagnose abschließen', xp: 50 },
    { aktion: 'Modul abschließen', xp: 100 },
    { aktion: 'Modul-Quiz bestehen', xp: 75 },
    { aktion: 'Boss-Fight gewinnen', xp: 200 },
    { aktion: 'Abschlusstest bestehen', xp: 300 },
    { aktion: '4-Ohren-Übung korrekt lösen', xp: 50 },
    { aktion: 'Zuhör-Stufen-Übung korrekt lösen', xp: 50 },
    { aktion: 'Journal-Eintrag schreiben', xp: 30 },
    { aktion: 'Alle 12 Micro-Learnings abschließen', xp: 250 },
    { aktion: 'Szenario durchspielen', xp: 100 },
  ],
  real_life: [
    { aktion: 'SBI-Feedback im echten Leben geben', xp: 150 },
    { aktion: 'BLUF-E-Mail schreiben und Ergebnis dokumentieren', xp: 100 },
    { aktion: 'Elevator Pitch in echter Situation nutzen', xp: 200 },
    { aktion: 'Konflikt mit gelernter Methode lösen', xp: 250 },
    { aktion: 'Präsentation mit gelernten Techniken halten', xp: 200 },
    { aktion: 'STOPP-Methode in Stress-Situation anwenden', xp: 150 },
    { aktion: 'Smalltalk mit Fremdem initiieren (FORD)', xp: 100 },
    { aktion: 'Feedback von Vertrauensperson einholen', xp: 100 },
    { aktion: '30-Tage-Fortschritts-Check abschließen', xp: 150 },
    { aktion: '90-Tage-Fortschritts-Check abschließen', xp: 200 },
  ],
};

// ---------------------------------------------------------------------------
// 23. EVIDENZ_KOMM — Wissenschaftliche Referenzen
// ---------------------------------------------------------------------------
export const EVIDENZ_KOMM = {
  titel: 'Wissenschaftliche Grundlagen',
  beschreibung: 'Dieser Kurs basiert auf etablierten Kommunikationsmodellen und Forschung.',
  referenzen: [
    {
      id: 'schulz_von_thun',
      autor: 'Friedemann Schulz von Thun',
      modell: '4-Ohren-Modell / Kommunikationsquadrat',
      werk: 'Miteinander Reden, Band 1-3 (1981-1998)',
      kernaussage: 'Jede Nachricht hat 4 Seiten: Sachinhalt, Selbstoffenbarung, Beziehung, Appell. Die meisten Missverständnisse entstehen, weil Sender und Empfänger auf verschiedenen Ohren kommunizieren.',
      relevanz: 'Grundlage für Modul 1 und die 4-Ohren-Übung.',
    },
    {
      id: 'mehrabian',
      autor: 'Albert Mehrabian',
      modell: '7-38-55-Regel',
      werk: 'Silent Messages (1971)',
      kernaussage: 'Bei der Kommunikation von Emotionen und Einstellungen: 7% Worte, 38% Stimme/Tonfall, 55% Körpersprache. ACHTUNG: Gilt nur für widersprüchliche emotionale Botschaften, nicht für alle Kommunikation.',
      relevanz: 'Grundlage für Module 3 (Körpersprache), 4 (Stimme) und 8 (Digitale Kommunikation — warum Text so missverständlich ist).',
    },
    {
      id: 'rogers',
      autor: 'Carl Rogers',
      modell: 'Aktives Zuhören / Klientenzentrierte Gesprächsführung',
      werk: 'On Becoming a Person (1961)',
      kernaussage: 'Echtes Verstehen erfordert Empathie, Kongruenz und bedingungslose positive Wertschätzung. Aktives Zuhören ist die Basis jeder guten Beziehung.',
      relevanz: 'Grundlage für Modul 2 (Aktives Zuhören) und die Zuhör-Stufen.',
    },
    {
      id: 'aristoteles',
      autor: 'Aristoteles',
      modell: 'Ethos, Pathos, Logos',
      werk: 'Rhetorik (ca. 335 v. Chr.)',
      kernaussage: 'Überzeugung basiert auf drei Säulen: Ethos (Glaubwürdigkeit des Sprechers), Pathos (emotionale Ansprache), Logos (logische Argumentation).',
      relevanz: 'Grundlage für Modul 7 (Präsentieren & Überzeugen).',
    },
    {
      id: 'harvard',
      autor: 'Roger Fisher, William Ury, Bruce Patton',
      modell: 'Harvard-Konzept / Sachgerechtes Verhandeln',
      werk: 'Getting to Yes (1981)',
      kernaussage: 'Verhandle sachbezogen: Trenne Menschen von Problemen, konzentriere dich auf Interessen statt Positionen, entwickle Optionen zum beiderseitigen Vorteil.',
      relevanz: 'Grundlage für Modul 6 (Konflikte) und das Gehaltsgespräch-Szenario.',
    },
    {
      id: 'cuddy',
      autor: 'Amy Cuddy',
      modell: 'Presence / Power Posing',
      werk: 'Presence: Bringing Your Boldest Self to Your Biggest Challenges (2015)',
      kernaussage: 'Körperhaltung beeinflusst nicht nur wie andere uns sehen, sondern auch wie wir uns selbst fühlen. "Fake it till you become it."',
      relevanz: 'Grundlage für Modul 3 (Körpersprache) und Modul 7 (Präsentieren).',
    },
    {
      id: 'watzlawick',
      autor: 'Paul Watzlawick',
      modell: '5 Axiome der Kommunikation',
      werk: 'Menschliche Kommunikation (1967)',
      kernaussage: 'Man kann nicht nicht kommunizieren. Jedes Verhalten ist Kommunikation — auch Schweigen, auch Wegschauen.',
      relevanz: 'Theoretischer Rahmen für den gesamten Kurs.',
    },
    {
      id: 'rosenberg',
      autor: 'Marshall B. Rosenberg',
      modell: 'Gewaltfreie Kommunikation (GFK)',
      werk: 'Nonviolent Communication (1999)',
      kernaussage: 'Kommuniziere über Beobachtungen, Gefühle, Bedürfnisse und Bitten — statt über Bewertungen, Vorwürfe und Forderungen.',
      relevanz: 'Ergänzende Methode für Modul 5 (Feedback) und Modul 6 (Konflikte).',
    },
    {
      id: 'goleman',
      autor: 'Daniel Goleman',
      modell: 'Emotionale Intelligenz',
      werk: 'Emotional Intelligence (1995)',
      kernaussage: 'Emotionale Intelligenz (Selbstwahrnehmung, Selbstregulation, Empathie, soziale Kompetenz) ist für beruflichen Erfolg wichtiger als IQ.',
      relevanz: 'Übergreifende Grundlage für empathische Kommunikation und Stress-Management.',
    },
    {
      id: 'cialdini',
      autor: 'Robert Cialdini',
      modell: '6 Prinzipien der Überzeugung',
      werk: 'Influence: The Psychology of Persuasion (1984)',
      kernaussage: 'Reziprozität, Konsistenz, Sozialer Beweis, Sympathie, Autorität und Knappheit sind die 6 Grundprinzipien, die menschliche Entscheidungen beeinflussen.',
      relevanz: 'Ergänzung für Modul 7 (Präsentieren & Überzeugen) und das Gehaltsgespräch-Szenario.',
    },
  ],
};
