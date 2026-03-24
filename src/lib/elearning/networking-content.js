// ============================================================================
// Networking E-Learning — Complete Content Data
// ============================================================================

// ---------------------------------------------------------------------------
// 1. SELBSTDIAGNOSE_NETZ — 10 Fragen, Scoring 1-5, 3 Ergebnis-Stufen
// ---------------------------------------------------------------------------
export const SELBSTDIAGNOSE_NETZ = {
  titel: 'Selbstdiagnose: Dein Networking-Typ',
  beschreibung:
    'Beantworte die folgenden 10 Fragen ehrlich. Es gibt keine richtigen oder falschen Antworten — nur dein persoenlicher Ist-Zustand.',
  skala: {
    min: 1,
    max: 5,
    labels: ['Trifft gar nicht zu', 'Trifft selten zu', 'Teils-teils', 'Trifft oft zu', 'Trifft voll zu'],
  },
  fragen: [
    { id: 1, text: 'Ich kenne mindestens 50 Personen in meiner Branche namentlich.', kategorie: 'netzgroesse' },
    { id: 2, text: 'Ich melde mich innerhalb von 48 Stunden nach einem Kennenlernen beim neuen Kontakt.', kategorie: 'followup' },
    { id: 3, text: 'Ich biete anderen regelmaeßig Hilfe an, ohne eine Gegenleistung zu erwarten.', kategorie: 'geben' },
    { id: 4, text: 'Ich nutze LinkedIn aktiv (mindestens 1x pro Woche).', kategorie: 'linkedin' },
    { id: 5, text: 'Ich fuehle mich wohl, auf Networking-Events Fremde anzusprechen.', kategorie: 'komfort' },
    { id: 6, text: 'Ich habe einen Mentor oder Sponsor, der meine Karriere aktiv foerdert.', kategorie: 'mentor' },
    { id: 7, text: 'Ich pflege meine Kontakte systematisch (z.B. CRM, Kalender-Erinnerungen).', kategorie: 'system' },
    { id: 8, text: 'Ich kann in 30 Sekunden erklaeren, was ich beruflich mache und welchen Mehrwert ich biete.', kategorie: 'pitch' },
    { id: 9, text: 'Ich stelle regelmaessig zwei Personen aus meinem Netzwerk einander vor.', kategorie: 'vermittlung' },
    { id: 10, text: 'Mein letzter beruflicher Erfolg kam durch einen persoenlichen Kontakt zustande.', kategorie: 'ergebnis' },
  ],
  ergebnisse: [
    {
      id: 'einsiedler',
      range: [10, 20],
      titel: 'Der Einsiedler-Networker',
      beschreibung:
        'Du arbeitest hart, aber meist allein. Dein Netzwerk ist duenn und zufaellig entstanden. Die gute Nachricht: Das aendern wir jetzt. Schon kleine Schritte bringen grosse Wirkung.',
      empfehlung:
        'Starte mit Modul 1 (Warum Networking?) und Modul 2 (Netzwerk-Audit). Erkenne, wen du schon kennst — und nutze diese Basis.',
    },
    {
      id: 'gelegenheits',
      range: [21, 35],
      titel: 'Der Gelegenheits-Networker',
      beschreibung:
        'Du netzwerkst, wenn es sich ergibt — aber nicht strategisch. Dir fehlt ein System. Du kennst Leute, aber die Beziehungen sind oberflaechlich.',
      empfehlung:
        'Fokussiere dich auf Modul 3 (Wert geben), Modul 6 (Follow-Up) und Modul 8 (CRM). Dein groesster Hebel ist Systematik.',
    },
    {
      id: 'strategisch',
      range: [36, 50],
      titel: 'Der Strategische Networker',
      beschreibung:
        'Du netzwerkst bewusst und regelmaessig. Dieser Kurs hilft dir, die letzten 20% herauszuholen — Hubs, Mentoren und C-Level Networking.',
      empfehlung:
        'Springe zu Modul 10 (Super-Connectors), Modul 9 (Mentoren) und Modul 14 (C-Level). Die Boss-Fights werden dich fordern!',
    },
  ],
};

// ---------------------------------------------------------------------------
// 2. STORIES_NETZ — 4 emotionale Geschichten
// ---------------------------------------------------------------------------
export const STORIES_NETZ = {
  hidden_job: {
    titel: 'Der Job, der nie ausgeschrieben wurde',
    untertitel: 'Wie 80% der Stellen wirklich besetzt werden',
    inhalt: `Julia, 32, Marketing Managerin. Seit 6 Monaten auf Jobsuche. 47 Bewerbungen. 3 Gespraeche. 0 Angebote.

Dann erwaehnt eine alte Studienkollegin beim Kaffee: "Bei uns wird gerade eine Stelle geschaffen — die gibts noch nirgends online."

Julia schickt ihren Lebenslauf. Keine Stellenanzeige. Kein Bewerbungsportal. Kein Algorithmus.

Eine Woche spaeter: Vorstellungsgespraech. Zwei Wochen spaeter: Vertrag.

Die Stelle wurde nie ausgeschrieben. Und Julia haette nie davon erfahren — wenn sie nicht vor 5 Jahren auf einer Konferenz neben Sarah gesessen haette.

Das war ihr ganzes "Networking": Ein Kaffee alle 6 Monate. Aber es reichte.

Julias Lektion: Die besten Jobs werden nicht ausgeschrieben. Sie werden empfohlen. Dein Netzwerk ist dein unsichtbarer Arbeitsmarkt.`,
  },

  tausend_gefallen: {
    titel: 'Der Mann, der 1000 Gefallen tat',
    untertitel: 'Warum die erfolgreichsten Networker Geber sind',
    inhalt: `Adam Rifkin wurde 2011 von Fortune zum "besten Networker im Silicon Valley" gewaehlt. Nicht weil er die meisten Kontakte hatte — sondern weil er die meisten Gefallen tat.

Seine Regel: "5-Minute Favors". Jeder Gefallen darf maximal 5 Minuten dauern. Ein Intro machen. Einen Artikel teilen. Ein kurzes Feedback geben.

Er half einem Studenten, der ihn kalt angeschrieben hatte. Jahre spaeter wurde dieser Student Mitgruender von LinkedIn — Reid Hoffman.

Adams Philosophie: "Networking ist kein Tauschhandel. Es ist ein Garten. Du saest Samen, ohne zu wissen, welche aufgehen."

Sein Geheimnis: Er fragte nie "Was kann ich von dir bekommen?", sondern "Was kann ich fuer dich tun?"

Adams Lektion: Gib ohne Erwartung. Die Rendite kommt — oft von Stellen, die du nie erwartet haettest.`,
  },

  mentor_kaffee: {
    titel: 'Der Mentor-Kaffee, der alles aenderte',
    untertitel: 'Wie eine einzige Frage eine Karriere beschleunigte',
    inhalt: `Markus, 28, Softwareentwickler. Gut, aber unsichtbar. Sein Code war exzellent. Seine Karriere stagnierte.

Auf einer Tech-Konferenz sprach er die CTO eines Scale-ups an. Nicht mit einem Pitch. Nicht mit einer Bitte. Sondern mit einer ehrlichen Frage:

"Was war der groesste Fehler, den Sie in den ersten 5 Jahren Ihrer Karriere gemacht haben?"

Die CTO — ueberrascht von der Frage — erzaehlte 20 Minuten. Dann fragte sie: "Was machst du eigentlich?"

3 Kaffees spaeter war sie seine Mentorin. 6 Monate spaeter empfahl sie ihn fuer eine Lead-Position. 1 Jahr spaeter leitete Markus ein Team von 12 Entwicklern.

Markus' Lektion: Ein Mentor findet dich nicht. Du findest ihn — mit der richtigen Frage zur richtigen Zeit. Und mit echtem Interesse, nicht mit einem versteckten Pitch.`,
  },

  kontakt_nach_jahren: {
    titel: 'Der Kontakt, der nach 3 Jahren zurueckkam',
    untertitel: 'Warum du nie weisst, welcher Kontakt sich auszahlt',
    inhalt: `Sandra, 38, Unternehmensberaterin. Bei einem Branchen-Event tauschte sie Visitenkarten mit Thomas, einem IT-Manager. Nettes Gespraech, 10 Minuten.

Sandra schickte ein kurzes Follow-Up: "Freut mich, Sie kennengelernt zu haben. Der Artikel ueber Cloud-Migration, den Sie erwaehnt haben — hier ist er."

Dann: 3 Jahre Stille. Kein Kontakt. Sandra haette Thomas laengst vergessen — aber sie hatte ihn in ihrem einfachen Kontakt-System. Einmal im Jahr schickte sie einen kurzen Gruss zum Geburtstag. Automatisch. 30 Sekunden.

Dann, 3 Jahre spaeter: Thomas rief an. "Sandra, wir brauchen eine Beraterin fuer ein 500.000-Euro-Projekt. An wen haette ich sonst denken sollen? Du warst die Einzige, die sich je gemeldet hat."

Sandras Lektion: Networking ist ein Langzeit-Spiel. Die meisten Kontakte zahlen sich nicht sofort aus. Aber wenn du dranbleibst — 30 Sekunden pro Jahr — bist du da, wenn es zaehlt.`,
  },
};

// ---------------------------------------------------------------------------
// 3. BOSS_FIGHTS_NETZ — 4 Boss-Fights
// ---------------------------------------------------------------------------
export const BOSS_FIGHTS_NETZ = {
  netzwerk_vampir: {
    id: 'netzwerk_vampir',
    name: 'Der Netzwerk-Vampir',
    beschreibung: 'Erkenne und stoppe Menschen, die nur nehmen ohne zu geben!',
    user_stat: { name: 'Geber-Energie', max: 100 },
    boss_stat: { name: 'Vampir-Kraft', max: 100 },
    waves: [
      {
        id: 1,
        name: 'Die Gefaelligkeits-Spirale',
        boss_sagt: '"Hey, kannst du mich bei deinem Chef empfehlen? Und mir dein Netzwerk teilen? Ach ja, und einen Lebenslauf schreiben?"',
        optionen: [
          {
            id: 'a',
            text: 'Klar, ich helfe bei allem! (Alles zusagen)',
            user_delta: -30,
            boss_delta: 0,
            feedback: 'Du wirst ausgenutzt. Grenzenlose Hilfe ist keine Grosszuegigkeit — es ist Selbstaufgabe.',
          },
          {
            id: 'b',
            text: 'Gerne helfe ich bei einem konkreten Punkt. Welcher ist dir am wichtigsten?',
            user_delta: 0,
            boss_delta: 35,
            feedback: 'Perfekt! Du setzt eine gesunde Grenze und zeigst trotzdem Hilfsbereitschaft.',
          },
          {
            id: 'c',
            text: 'Sorry, hab keine Zeit. (Komplett ablehnen)',
            user_delta: -10,
            boss_delta: 10,
            feedback: 'Zu hart. Du schuetzt dich, aber zerstoerst die Beziehung komplett.',
          },
        ],
      },
      {
        id: 2,
        name: 'Der Reziprozitaets-Check',
        boss_sagt: '"Du hast mir letztes Jahr 3 Intros gemacht. Ich hab mich nie revanchiert. Kannst du noch ein 4. machen?"',
        optionen: [
          {
            id: 'a',
            text: 'Na klar, ich helfe gern! (Wieder nachgeben)',
            user_delta: -25,
            boss_delta: 0,
            feedback: 'Du ignorierst das Muster. Nach 3 einseitigen Gefallen ist es Zeit fuer ein Gespraech.',
          },
          {
            id: 'b',
            text: 'Ich mache gern Intros. Uebrigens, koenntest du mich auch mal jemandem vorstellen?',
            user_delta: 0,
            boss_delta: 40,
            feedback: 'Genau richtig! Du sprichst die Einseitigkeit an — freundlich aber klar.',
          },
          {
            id: 'c',
            text: 'Du nimmst nur! Vergiss es.',
            user_delta: -20,
            boss_delta: 5,
            feedback: 'Der Ton macht die Musik. Berechtigte Grenze, aber zu aggressiv formuliert.',
          },
        ],
      },
      {
        id: 3,
        name: 'Das Exit-Gespraech',
        boss_sagt: '"Warum meldest du dich nicht mehr? Ich dachte, wir sind Freunde!"',
        optionen: [
          {
            id: 'a',
            text: 'Du hast recht, sorry! (Schuldgefuehle)',
            user_delta: -20,
            boss_delta: 0,
            feedback: 'Du laesst dich manipulieren. Schuldgefuehle sind das Werkzeug des Vampirs.',
          },
          {
            id: 'b',
            text: 'Ich schaetze dich. Aber Freundschaft ist gegenseitig. Lass uns das auf Augenhoehe gestalten.',
            user_delta: 0,
            boss_delta: 45,
            feedback: 'BOSS BESIEGT! Du setzt eine klare Grenze ohne die Bruecke zu verbrennen.',
          },
          {
            id: 'c',
            text: 'Wir waren nie wirklich Freunde.',
            user_delta: -15,
            boss_delta: 10,
            feedback: 'Ehrlich, aber verletzend. Es gibt diplomatischere Wege.',
          },
        ],
      },
    ],
    sieg: {
      badge: 'Vampir-Jaeger',
      xp: 200,
      text: 'Du kannst Netzwerk-Vampire erkennen und dich schuetzen — ohne Bruecken zu verbrennen!',
    },
    niederlage: {
      text: 'Grenzen setzen ist schwer, aber essenziell. Wer immer nur gibt, brennt aus. Nochmal!',
    },
  },

  networking_hoelle: {
    id: 'networking_hoelle',
    name: 'Die Networking-Hoelle',
    beschreibung: 'Ueberwinde die Angst, Fremde auf Events anzusprechen!',
    user_stat: { name: 'Selbstvertrauen', max: 100 },
    boss_stat: { name: 'Angst-Monster', max: 100 },
    waves: [
      {
        id: 1,
        name: 'Die Tuerschwellen-Angst',
        boss_sagt: 'Du stehst vor dem Networking-Event. 200 Fremde drinnen. Dein Herz rast. Was tust du?',
        optionen: [
          {
            id: 'a',
            text: 'Umdrehen und nach Hause gehen.',
            user_delta: -30,
            boss_delta: 0,
            feedback: 'Flucht verstaerkt die Angst. Jedes Vermeiden macht es beim naechsten Mal schlimmer.',
          },
          {
            id: 'b',
            text: 'Tief durchatmen und als Erstes zur Bar gehen — dort stehen immer Leute allein.',
            user_delta: 0,
            boss_delta: 35,
            feedback: 'Smart! Die Bar ist der einfachste Ort zum Starten. Jeder wartet dort und ist offen.',
          },
          {
            id: 'c',
            text: 'Sofort zum groessten Grueppen-Kreis gehen und dich vorstellen.',
            user_delta: -15,
            boss_delta: 10,
            feedback: 'Mutig, aber ueberfordernd. Starte mit 1:1-Gespraechen, nicht mit Gruppen.',
          },
        ],
      },
      {
        id: 2,
        name: 'Die erste Minute',
        boss_sagt: 'Du stehst neben jemandem an der Bar. Stille. Sag was! JETZT!',
        optionen: [
          {
            id: 'a',
            text: '"Schoenes Wetter heute, oder?" (Langweiliger Smalltalk)',
            user_delta: -10,
            boss_delta: 10,
            feedback: 'Funktioniert, aber unvergesslich. Du verschwendest die ersten 7 Sekunden.',
          },
          {
            id: 'b',
            text: '"Und — was hat Sie heute hierhergebracht?" (Kontextbezogener Opener)',
            user_delta: 0,
            boss_delta: 35,
            feedback: 'Perfekt! Kontextbezogen, offen, und zeigt echtes Interesse. Der andere redet gern.',
          },
          {
            id: 'c',
            text: '"Hi, ich bin [Name], ich arbeite bei [Firma]. Wir machen XYZ..." (Direkter Pitch)',
            user_delta: -20,
            boss_delta: 5,
            feedback: 'Zu frueh! Niemand will beim Networking gepitcht werden. Erst Interesse zeigen.',
          },
        ],
      },
      {
        id: 3,
        name: 'Der Gespraechs-Exit',
        boss_sagt: 'Du hast ein tolles 10-Minuten-Gespraech. Aber du willst noch andere kennenlernen. Wie verabschiedest du dich?',
        optionen: [
          {
            id: 'a',
            text: '"Ich muss mal eben... zur Toilette." (Flucht-Ausrede)',
            user_delta: -15,
            boss_delta: 5,
            feedback: 'Transparent und peinlich. Jeder weiss, was das bedeutet.',
          },
          {
            id: 'b',
            text: '"Das war ein tolles Gespraech! Lass uns auf LinkedIn vernetzen. Ich moechte noch ein paar andere Leute begruessen."',
            user_delta: 0,
            boss_delta: 45,
            feedback: 'BOSS BESIEGT! Ehrlich, wertschaetzend, und mit konkretem Follow-Up.',
          },
          {
            id: 'c',
            text: 'Einfach stehen bleiben und hoffen, dass er geht.',
            user_delta: -20,
            boss_delta: 0,
            feedback: 'Passivitaet verschwendet deine kostbare Networking-Zeit.',
          },
        ],
      },
    ],
    sieg: {
      badge: 'Event-Meister',
      xp: 200,
      text: 'Du hast die Networking-Hoelle besiegt! Fremde ansprechen ist jetzt deine Staerke.',
    },
    niederlage: {
      text: 'Jeder hat Angst vor dem ersten Schritt. Aber Uebung macht den Meister. Nochmal!',
    },
  },

  networking_marathon: {
    id: 'networking_marathon',
    name: 'Der Networking-Marathon',
    beschreibung: 'Manage deine Energie auf einer ganztaegigen Konferenz!',
    user_stat: { name: 'Energie-Level', max: 100 },
    boss_stat: { name: 'Erschoepfung', max: 100 },
    waves: [
      {
        id: 1,
        name: 'Die Mittagspause',
        boss_sagt: 'Es ist 12:30. Du hast 4 Stunden intensives Networking hinter dir. Die Mittagspause beginnt.',
        optionen: [
          {
            id: 'a',
            text: 'Weiter netzwerken! Keine Sekunde verschwenden!',
            user_delta: -30,
            boss_delta: 0,
            feedback: 'Ohne Pause brennst du aus. Am Nachmittag bist du leer und vergisst Namen.',
          },
          {
            id: 'b',
            text: '20 Minuten allein essen und Notizen zu den Morgen-Kontakten machen. Dann weitermachen.',
            user_delta: 0,
            boss_delta: 50,
            feedback: 'Perfekt! Du sicherst deine Ergebnisse und laedt deine Batterien auf.',
          },
          {
            id: 'c',
            text: 'Frueh nach Hause gehen — reicht fuer heute.',
            user_delta: -20,
            boss_delta: 10,
            feedback: 'Die besten Kontakte entstehen am Nachmittag, wenn die Stimmung lockerer wird.',
          },
        ],
      },
      {
        id: 2,
        name: 'Das After-Work',
        boss_sagt: 'Die Konferenz ist offiziell vorbei. Aber es gibt ein After-Work-Event. Du bist muede.',
        optionen: [
          {
            id: 'a',
            text: 'Schon den ganzen Tag hier. Ab nach Hause!',
            user_delta: -15,
            boss_delta: 10,
            feedback: 'Verstaendlich, aber die After-Works sind Gold. Dort werden die echten Beziehungen gebaut.',
          },
          {
            id: 'b',
            text: '60 Minuten bleiben. 2-3 gezielte Gespraeche fuehren. Dann erhobenen Hauptes gehen.',
            user_delta: 0,
            boss_delta: 50,
            feedback: 'BOSS BESIEGT! Du setzt ein Zeitlimit und nutzt die goldene Stunde nach dem Event.',
          },
          {
            id: 'c',
            text: 'Bis zum bitteren Ende bleiben — ich verpasse nichts!',
            user_delta: -25,
            boss_delta: 5,
            feedback: 'Uebertreiben fuehrt zu schlechten Gespraechen und vergessenen Follow-Ups.',
          },
        ],
      },
    ],
    sieg: {
      badge: 'Marathon-Networker',
      xp: 150,
      text: 'Du weisst, wie du deine Energie intelligent auf Events einteilst!',
    },
    niederlage: {
      text: 'Networking ist ein Marathon, kein Sprint. Energie-Management ist der Schluessel.',
    },
  },

  gatekeeper: {
    id: 'gatekeeper',
    name: 'Der Gatekeeper',
    beschreibung: 'Komm an der Assistenz vorbei zum C-Level Kontakt!',
    user_stat: { name: 'Professionalitaet', max: 100 },
    boss_stat: { name: 'Abwehr-Schild', max: 100 },
    waves: [
      {
        id: 1,
        name: 'Die Assistenz',
        boss_sagt: '"Guten Tag, Buero von Frau Dr. Meier. Was kann ich fuer Sie tun?"',
        optionen: [
          {
            id: 'a',
            text: '"Ich moechte mit Frau Meier sprechen. Verbinden Sie mich bitte."',
            user_delta: -20,
            boss_delta: 5,
            feedback: 'Zu direkt, zu fordernd. Assistenzen sind Gatekeeper — respektiere ihre Rolle.',
          },
          {
            id: 'b',
            text: '"Guten Tag! Ich bin [Name] von [Firma]. Frau Dr. Meier und ich haben uns auf der [Konferenz] unterhalten. Koennten Sie mir helfen, einen kurzen Termin zu vereinbaren?"',
            user_delta: 0,
            boss_delta: 50,
            feedback: 'Exzellent! Du nennst einen gemeinsamen Kontext und behandelst die Assistenz als Verbuendete.',
          },
          {
            id: 'c',
            text: '"Es ist dringend und vertraulich."',
            user_delta: -30,
            boss_delta: 0,
            feedback: 'Das funktioniert einmal. Danach bist du unten durch. Assistenzen reden miteinander.',
          },
        ],
      },
      {
        id: 2,
        name: 'Der LinkedIn-Weg',
        boss_sagt: 'Die direkte Route ist blockiert. Du versuchst es ueber LinkedIn.',
        optionen: [
          {
            id: 'a',
            text: 'Vernetzungsanfrage ohne Nachricht senden.',
            user_delta: -15,
            boss_delta: 5,
            feedback: 'Bei C-Level wird das ignoriert. Ohne persoenliche Nachricht bist du unsichtbar.',
          },
          {
            id: 'b',
            text: 'Erst einem gemeinsamen Kontakt schreiben und um ein warmes Intro bitten.',
            user_delta: 0,
            boss_delta: 50,
            feedback: 'BOSS BESIEGT! Warme Intros sind 10x erfolgreicher als Kaltanfragen. Das ist C-Level Networking.',
          },
          {
            id: 'c',
            text: 'Drei DMs hintereinander schicken mit deinem Pitch.',
            user_delta: -35,
            boss_delta: 0,
            feedback: 'Das ist Spam. C-Level blockiert aggressives Outreach sofort.',
          },
        ],
      },
    ],
    sieg: {
      badge: 'C-Level Connector',
      xp: 250,
      text: 'Du weisst, wie man C-Level Kontakte professionell und respektvoll aufbaut!',
    },
    niederlage: {
      text: 'C-Level Networking braucht Geduld und Strategie. Der schnelle Weg fuehrt selten zum Ziel.',
    },
  },
};

// ---------------------------------------------------------------------------
// 4. WERT_GESCHENKE — 12 Wert-Geschenke die nichts kosten
// ---------------------------------------------------------------------------
export const WERT_GESCHENKE = [
  { id: 1, name: 'Das Intro', icon: '🤝', aufwand: 'Gering', beschreibung: 'Stelle zwei Menschen vor, die voneinander profitieren koennten. "Ich kenne jemanden, den du unbedingt kennenlernen solltest."' },
  { id: 2, name: 'Der Artikel-Share', icon: '📰', aufwand: 'Minimal', beschreibung: 'Schicke einen relevanten Artikel mit persoenlicher Notiz: "Das hat mich an unser Gespraech erinnert."' },
  { id: 3, name: 'Die Buch-Empfehlung', icon: '📚', aufwand: 'Minimal', beschreibung: 'Empfiehl ein Buch, das zum aktuellen Problem deines Kontakts passt. Bonus: Schicke es per Post.' },
  { id: 4, name: 'Das ehrliche Feedback', icon: '💬', aufwand: 'Mittel', beschreibung: 'Gib konstruktives, ungebetenes Feedback zu einem Projekt oder Vortrag — wenn du weisst, dass es willkommen ist.' },
  { id: 5, name: 'Das LinkedIn-Endorsement', icon: '👍', aufwand: 'Minimal', beschreibung: 'Schreibe eine ehrliche LinkedIn-Empfehlung — ungefragt. Das bleibt fuer immer auf dem Profil.' },
  { id: 6, name: 'Die Event-Einladung', icon: '🎫', aufwand: 'Gering', beschreibung: 'Lade jemanden zu einem Event, Webinar oder Workshop ein, der zu seinen Interessen passt.' },
  { id: 7, name: 'Das Template-Sharing', icon: '📋', aufwand: 'Gering', beschreibung: 'Teile ein nuetzliches Template, Tool oder eine Ressource: "Dieses Tool hat mir Stunden gespart."' },
  { id: 8, name: 'Die Glueckwunsch-Nachricht', icon: '🎉', aufwand: 'Minimal', beschreibung: 'Gratuliere zu Befoerderungen, neuen Jobs oder Meilensteinen. Zeige, dass du aufmerksam bist.' },
  { id: 9, name: 'Der Signal-Boost', icon: '📢', aufwand: 'Minimal', beschreibung: 'Teile oder kommentiere den LinkedIn-Post deines Kontakts. Sichtbarkeit ist ein Geschenk.' },
  { id: 10, name: 'Die Gespraechs-Notiz', icon: '📝', aufwand: 'Gering', beschreibung: 'Fasse ein gemeinsames Gespraech zusammen und schicke die Notizen: "Damit nichts verloren geht."' },
  { id: 11, name: 'Der Beta-Test', icon: '🧪', aufwand: 'Mittel', beschreibung: 'Biete an, ein Produkt, einen Vortrag oder ein Konzept zu testen und ehrliches Feedback zu geben.' },
  { id: 12, name: 'Die Talente-Empfehlung', icon: '⭐', aufwand: 'Gering', beschreibung: 'Empfiehl talentierte Menschen fuer offene Stellen. Recruiter lieben dich dafuer — und die Empfohlenen auch.' },
];

// ---------------------------------------------------------------------------
// 5. LINKEDIN_TEMPLATES — 8 Templates + 8-Punkte Profil-Checkliste
// ---------------------------------------------------------------------------
export const LINKEDIN_TEMPLATES = {
  anfragen: [
    {
      id: 1,
      titel: 'Nach Event/Konferenz',
      text: 'Hallo [Name], es hat mich gefreut, Sie auf [Event] kennenzulernen! Unser Gespraech ueber [Thema] war sehr inspirierend. Ich wuerde mich freuen, in Kontakt zu bleiben.',
      tipp: 'Innerhalb von 24 Stunden nach dem Event senden.',
    },
    {
      id: 2,
      titel: 'Gemeinsamer Kontakt',
      text: 'Hallo [Name], [gemeinsamer Kontakt] hat mir empfohlen, mich mit Ihnen zu vernetzen. Ich arbeite ebenfalls im Bereich [Branche] und wuerde mich ueber den Austausch freuen.',
      tipp: 'Den gemeinsamen Kontakt vorher fragen, ob du seinen Namen nennen darfst.',
    },
    {
      id: 3,
      titel: 'Content-Bezug',
      text: 'Hallo [Name], Ihr Beitrag ueber [Thema] hat mich sehr zum Nachdenken gebracht. Besonders der Punkt zu [Detail] war fuer mich neu. Wuerde mich freuen, mehr von Ihnen zu lesen!',
      tipp: 'Zeige, dass du den Beitrag wirklich gelesen hast — nenne ein konkretes Detail.',
    },
    {
      id: 4,
      titel: 'Branchenwechsler',
      text: 'Hallo [Name], ich wechsle gerade in den Bereich [Branche] und bin beeindruckt von Ihrem Werdegang. Haetten Sie Zeit fuer einen kurzen Austausch? Ich wuerde gerne von Ihren Erfahrungen lernen.',
      tipp: 'Ehrlichkeit ueber den Branchenwechsel schafft Vertrauen.',
    },
    {
      id: 5,
      titel: 'Wert-zuerst',
      text: 'Hallo [Name], ich habe gesehen, dass Sie an [Thema] arbeiten. Ich habe kuerzlich [Ressource/Artikel/Tool] entdeckt, das Sie interessieren koennte: [Link]. Viel Erfolg damit!',
      tipp: 'Die staerkste Anfrage: Du gibst etwas, BEVOR du etwas willst.',
    },
    {
      id: 6,
      titel: 'Alumni-Verbindung',
      text: 'Hallo [Name], ich sehe, wir haben beide an der [Uni/Firma] studiert/gearbeitet! [Uni-Bezug]. Wuerde mich freuen, mich mit einem Fellow-Alumni zu vernetzen.',
      tipp: 'Gemeinsame Vergangenheit ist der einfachste Eisbrecher.',
    },
    {
      id: 7,
      titel: 'Experten-Anfrage',
      text: 'Hallo [Name], ich recherchiere gerade zu [Thema] und Sie sind einer der fuehrenden Experten in diesem Bereich. Haetten Sie 15 Minuten fuer ein kurzes Gespraech? Ich bereite konkrete Fragen vor.',
      tipp: 'Zeige Respekt fuer die Zeit des Experten: 15 Minuten, vorbereitet, konkret.',
    },
    {
      id: 8,
      titel: 'Reconnect',
      text: 'Hallo [Name], wir hatten vor [Zeitraum] mal einen guten Austausch zu [Thema]. Ich wuerde mich freuen, den Faden wieder aufzunehmen. Was treibt Sie gerade beruflich um?',
      tipp: 'Bei Reconnects: Erinnere an den letzten positiven Kontaktpunkt.',
    },
  ],
  checkliste: [
    { id: 1, punkt: 'Professionelles Foto (Gesicht sichtbar, freundlich, aktuell)', erledigt: false },
    { id: 2, punkt: 'Headline mit Mehrwert-Aussage (nicht nur Jobtitel!)', erledigt: false },
    { id: 3, punkt: 'About-Bereich: Deine Story in 3 Absaetzen (Problem > Loesung > CTA)', erledigt: false },
    { id: 4, punkt: 'Erfahrung mit konkreten Ergebnissen (Zahlen, nicht Aufgaben)', erledigt: false },
    { id: 5, punkt: 'Mindestens 5 Skills hinzugefuegt und bestaetigt', erledigt: false },
    { id: 6, punkt: 'Mindestens 3 LinkedIn-Empfehlungen erhalten', erledigt: false },
    { id: 7, punkt: 'Custom URL eingerichtet (linkedin.com/in/deinname)', erledigt: false },
    { id: 8, punkt: 'Banner-Bild mit persoenlichem Branding', erledigt: false },
  ],
};

// ---------------------------------------------------------------------------
// 6. FOLLOW_UP_TEMPLATES — 7 Templates
// ---------------------------------------------------------------------------
export const FOLLOW_UP_TEMPLATES = [
  {
    id: 'event',
    titel: 'Nach einem Event',
    text: 'Hallo [Name],\n\nes hat mich gefreut, Sie gestern auf [Event] kennenzulernen! Unser Gespraech ueber [Thema] war wirklich spannend.\n\nWie versprochen, hier [der Artikel / der Link / der Kontakt], den ich erwaehnt hatte.\n\nWuerde mich freuen, in Kontakt zu bleiben!\n\nBeste Gruesse\n[Ihr Name]',
    timing: 'Innerhalb von 24-48 Stunden nach dem Event',
  },
  {
    id: 'linkedin',
    titel: 'Nach LinkedIn-Vernetzung',
    text: 'Hallo [Name],\n\ndanke fuer die Vernetzung! Ich habe gesehen, dass Sie im Bereich [Thema] arbeiten — das finde ich spannend.\n\nFalls es mal passt, wuerde ich mich ueber einen kurzen Austausch freuen. Kein Pitch, versprochen! 😊\n\nBeste Gruesse\n[Ihr Name]',
    timing: 'Direkt nach Annahme der Vernetzungsanfrage',
  },
  {
    id: 'intro',
    titel: 'Nach einem Intro',
    text: 'Hallo [Name],\n\n[gemeinsamer Kontakt] hat mir empfohlen, mich bei Ihnen zu melden. [Er/Sie] meinte, wir koennten voneinander profitieren, da wir beide an [Thema] arbeiten.\n\nHaetten Sie naechste Woche 15 Minuten fuer einen kurzen Call?\n\nBeste Gruesse\n[Ihr Name]',
    timing: 'Innerhalb von 24 Stunden nach dem Intro',
  },
  {
    id: 'reaktivierung',
    titel: 'Kontakt reaktivieren',
    text: 'Hallo [Name],\n\nich hoffe, es geht Ihnen gut! Wir hatten vor [Zeitraum] einen guten Austausch zu [Thema].\n\nIch bin kuerzlich auf [Artikel/Event/Nachricht] gestossen und musste an Sie denken. [Link]\n\nWie laeuft es bei Ihnen? Wuerde mich freuen, mal wieder zu hoeren!\n\nBeste Gruesse\n[Ihr Name]',
    timing: 'Wenn ein Kontakt 90+ Tage inaktiv war',
  },
  {
    id: 'danke',
    titel: 'Dankeschoen',
    text: 'Hallo [Name],\n\nich wollte mich nochmal herzlich bei Ihnen bedanken fuer [konkreten Gefallen]. Das hat mir wirklich geholfen bei [konkretes Ergebnis].\n\nFalls ich Ihnen irgendwann auch bei etwas helfen kann — melden Sie sich gerne!\n\nBeste Gruesse\n[Ihr Name]',
    timing: 'Innerhalb von 24 Stunden nach erhaltener Hilfe',
  },
  {
    id: 'touchpoint',
    titel: 'Regelmaessiger Touchpoint',
    text: 'Hallo [Name],\n\nich habe gerade [Artikel/Beitrag/News] gesehen und musste sofort an unser Gespraech zu [Thema] denken. [Link]\n\nWas meinen Sie — passt das zu Ihrem aktuellen Projekt?\n\nBeste Gruesse\n[Ihr Name]',
    timing: 'Alle 30-60 Tage fuer wichtige Kontakte',
  },
  {
    id: 'geburtstag',
    titel: 'Geburtstag (persoenlich)',
    text: 'Hallo [Name],\n\nalles Gute zum Geburtstag! 🎂\n\nIch hoffe, Sie feiern heute ordentlich. Auf ein gutes neues (Lebens-)Jahr!\n\nIch erinnere mich gerne an [persoenliches Detail aus letztem Gespraech].\n\nBeste Gruesse\n[Ihr Name]',
    timing: 'Am Geburtstag — frueh morgens ist am besten',
  },
];

// ---------------------------------------------------------------------------
// 7. OPENER — 12 Gespraechs-Opener fuer 4 Situationen
// ---------------------------------------------------------------------------
export const OPENER = {
  event: {
    situation: 'Networking-Event / After-Work',
    opener: [
      { text: 'Was hat Sie heute hierhergebracht?', warum: 'Kontextbezogen, offen, zeigt Interesse. Der andere kann frei antworten.' },
      { text: 'Kennen Sie den Speaker? Was halten Sie von seinem Vortrag?', warum: 'Gemeinsamer Bezugspunkt. Jeder hat eine Meinung — das startet Diskussionen.' },
      { text: 'Ich bin zum ersten Mal hier — haben Sie einen Tipp, wen ich unbedingt kennenlernen sollte?', warum: 'Zeigt Bescheidenheit und gibt dem anderen die Experten-Rolle.' },
    ],
  },
  linkedin: {
    situation: 'LinkedIn / Digital',
    opener: [
      { text: 'Ich habe Ihren Beitrag zu [Thema] gelesen — besonders [Detail] war neu fuer mich. Wie sind Sie darauf gekommen?', warum: 'Zeigt echtes Lesen (nicht nur Liken). Schmeichelt dem Autor.' },
      { text: 'Ich sehe, wir haben [X] gemeinsame Kontakte. Scheint, als waeren wir in aehnlichen Kreisen unterwegs!', warum: 'Social Proof. Gemeinsame Kontakte schaffen sofortiges Vertrauen.' },
      { text: 'Ihre Karriere von [A] zu [B] ist ungewoehnlich. Was war der Wendepunkt?', warum: 'Karriere-Geschichten sind persoenlich. Menschen lieben es, sie zu erzaehlen.' },
    ],
  },
  aufzug: {
    situation: 'Aufzug / Zufallsbegegnung',
    opener: [
      { text: 'Arbeiten Sie auch in [Abteilung/Stockwerk]? Ich bin [Name] aus [Team].', warum: 'Einfach, direkt, keine Ueberraschung. Funktioniert in 10 Sekunden.' },
      { text: 'Wow, das Gebaede ist beeindruckend. Wie lange arbeiten Sie schon hier?', warum: 'Leichter Einstieg ueber die Umgebung. Funktioniert bei Fremden in Buerogebaeuden.' },
      { text: 'Montag oder Freitag — was ist schlimmer? (Lachen) Ich bin uebrigens [Name].', warum: 'Humor entkrampft. Funktioniert besonders gut bei kurzen Begegnungen.' },
    ],
  },
  konferenz: {
    situation: 'Konferenz / Messe',
    opener: [
      { text: 'Welcher Vortrag hat Sie heute am meisten ueberrascht?', warum: 'Tiefgehend, zeigt Interesse, laesst den anderen glaenzen.' },
      { text: 'Auf welche Session freuen Sie sich am meisten?', warum: 'Zukunftsorientiert. Kann zu einem gemeinsamen Session-Besuch fuehren.' },
      { text: 'Ich suche noch jemanden fuer die Mittagspause — darf ich mich dazusetzen?', warum: 'Direkt, ehrlich, und die Mittagspause ist die goldene Networking-Stunde.' },
    ],
  },
};

// ---------------------------------------------------------------------------
// 8. MENTOR_TEMPLATES — 3 Mentor-Anfrage Vorlagen
// ---------------------------------------------------------------------------
export const MENTOR_TEMPLATES = {
  respektvoll: {
    id: 'respektvoll',
    titel: 'Die Respektvolle Anfrage',
    stil: 'Formell, bescheiden, respektiert die Zeit',
    template: `Sehr geehrte/r [Name],

ich verfolge Ihre Arbeit im Bereich [Thema] seit [Zeitraum] und bin beeindruckt von [konkretes Beispiel].

Ich bin aktuell [Position] bei [Firma] und stehe vor der Herausforderung [konkretes Problem].

Ich wuerde mich sehr freuen, wenn Sie 20 Minuten Zeit fuer ein Gespraech haetten. Ich bereite konkrete Fragen vor und verspreche, Ihre Zeit nicht zu verschwenden.

Falls das gerade nicht passt, verstehe ich das vollkommen. Koennen Sie mir vielleicht eine andere Person empfehlen?

Mit besten Gruessen
[Ihr Name]`,
  },
  wertbasiert: {
    id: 'wertbasiert',
    titel: 'Die Wert-zuerst Anfrage',
    stil: 'Bietet erst Wert, bittet dann',
    template: `Hallo [Name],

ich habe gesehen, dass Sie an [Projekt/Thema] arbeiten. Dazu moechte ich Ihnen etwas schicken, das Sie vielleicht nuetzlich finden: [Artikel/Tool/Kontakt].

Kurz zu mir: Ich bin [Position] bei [Firma] und arbeite seit [X] Jahren an [Thema]. Ihr Vortrag auf [Event] hat meine Herangehensweise veraendert.

Wenn es sich ergibt, wuerde ich mich ueber einen gelegentlichen Austausch freuen. Kein Druck — ich schaetze bereits, was ich von Ihren oeffentlichen Beitraegen lerne.

Beste Gruesse
[Ihr Name]`,
  },
  langfristig: {
    id: 'langfristig',
    titel: 'Die Langfristige Anfrage',
    stil: 'Transparent, ehrlich, mit klarem Commitment',
    template: `Hallo [Name],

ich suche einen Mentor fuer die naechsten 6-12 Monate und Sie sind meine erste Wahl. Hier ist mein Angebot:

WAS ICH SUCHE: Ein monatliches 30-Minuten Gespraech zu [Thema]. Ich bereite jedes Mal eine konkrete Frage vor.

WAS ICH BIETE: Ich setze um, was Sie mir raten — und berichte Ihnen das Ergebnis. Keine leeren Versprechungen.

WARUM SIE: Ihr Werdegang von [A] zu [B] ist genau der Weg, den ich anstrebe. Besonders [konkreter Aspekt] inspiriert mich.

EXIT-KLAUSEL: Wenn es nicht passt, sagen Sie es mir direkt. Kein Drama, kein schlechtes Gewissen.

Darf ich Sie auf einen Kaffee einladen?

Beste Gruesse
[Ihr Name]`,
  },
};

// ---------------------------------------------------------------------------
// 9. CRM_CONFIG — Ampel-System, Deep Context
// ---------------------------------------------------------------------------
export const CRM_CONFIG = {
  ampel: {
    gruen: { label: 'Gruen', maxTage: 30, farbe: '#10B981', beschreibung: 'Kontakt innerhalb der letzten 30 Tage. Beziehung ist aktiv.' },
    gelb: { label: 'Gelb', maxTage: 90, farbe: '#F59E0B', beschreibung: 'Letzter Kontakt 30-90 Tage her. Zeit fuer einen Touchpoint.' },
    rot: { label: 'Rot', maxTage: null, farbe: '#EF4444', beschreibung: 'Ueber 90 Tage kein Kontakt. Beziehung schlaeft ein — reagiere jetzt!' },
  },
  deepContext: [
    { feld: 'geburtstag', label: 'Geburtstag', beispiel: '15. Maerz' },
    { feld: 'hobbies', label: 'Hobbies & Interessen', beispiel: 'Marathon, Fotografie' },
    { feld: 'kinder', label: 'Familie / Kinder', beispiel: '2 Toechter, eine spielt Klavier' },
    { feld: 'letztes_thema', label: 'Letztes Gespraechs-Thema', beispiel: 'Cloud-Migration Projekt' },
    { feld: 'naechster_schritt', label: 'Naechster Schritt', beispiel: 'Artikel zu KI schicken' },
    { feld: 'vermittlung', label: 'Potenzielle Vermittlung', beispiel: 'Koennte [X] mit [Y] vernetzen' },
  ],
  touchpoints: [
    'Artikel teilen',
    'LinkedIn-Post kommentieren',
    'Kurze "Wie gehts?"-Nachricht',
    'Glueckwuensche (Befoerderung, Geburtstag)',
    'Event-Einladung',
    'Intro zu einem neuen Kontakt',
    'Feedback zu einem Projekt geben',
  ],
};

// ---------------------------------------------------------------------------
// 10. HUB_FINDER — 6 Hub-Typen
// ---------------------------------------------------------------------------
export const HUB_FINDER = [
  {
    typ: 'Branchen-Connector',
    beschreibung: 'Kennt jeden in einer spezifischen Branche. Oft Verbaende, IHK, Branchenevents.',
    wie_finden: 'Wer organisiert die groessten Events deiner Branche? Wer wird immer als Speaker eingeladen?',
    wie_ansprechen: 'Biete Wert: "Ich habe einen Artikel/Talk/Kontakt, der fuer Ihre Community interessant sein koennte."',
  },
  {
    typ: 'Content-Creator',
    beschreibung: 'Podcaster, Blogger, LinkedIn-Influencer. Enorme Reichweite und Netzwerk.',
    wie_finden: 'Wer hat die meisten Follower in deinem Themengebiet? Wer wird am meisten zitiert?',
    wie_ansprechen: 'Biete Content: "Ich haette eine spannende Story/Case Study fuer Ihren Podcast."',
  },
  {
    typ: 'Recruiter/HR',
    beschreibung: 'Kennen Hunderte Kandidaten und Unternehmen. Vermitteln staendig.',
    wie_finden: 'Spezialisierte Headhunter deiner Branche. LinkedIn-Suche: "[Branche] Recruiter".',
    wie_ansprechen: 'Sei hilfreich: "Ich kenne einige starke Kandidaten fuer [Position] — soll ich Sie vernetzen?"',
  },
  {
    typ: 'Community-Leader',
    beschreibung: 'Leiten Slack-Gruppen, Mastermind-Zirkel, Meetups. Zugang zu exklusiven Netzwerken.',
    wie_finden: 'Suche auf Meetup.com, Slack-Verzeichnissen, LinkedIn-Gruppen nach Moderatoren.',
    wie_ansprechen: 'Werde aktives Mitglied erst. Dann biete an, bei Events zu helfen oder Content beizutragen.',
  },
  {
    typ: 'Investor/Board-Member',
    beschreibung: 'Sitzen in mehreren Boards. Uebergreifendes Netzwerk ueber Branchen hinweg.',
    wie_finden: 'Crunchbase, Handelsblatt, LinkedIn — wer sitzt in mehreren Beiraeten?',
    wie_ansprechen: 'Warme Intros ueber Portfolio-Unternehmen. Niemals kalt anfragen.',
  },
  {
    typ: 'Akademiker/Professor',
    beschreibung: 'Verbinden Forschung und Praxis. Alumni-Netzwerke, Konferenzen, Gutachten.',
    wie_finden: 'Wer sind die fuehrenden Professoren in deinem Fachgebiet? Wer publiziert am meisten?',
    wie_ansprechen: 'Interesse an Forschung zeigen: "Ihre Studie zu [X] hat meine Arbeit beeinflusst."',
  },
];

// ---------------------------------------------------------------------------
// 11. REZIPROZITAET — Benjamin-Franklin-Effekt
// ---------------------------------------------------------------------------
export const REZIPROZITAET = {
  franklin_effekt: {
    titel: 'Der Benjamin-Franklin-Effekt',
    erklaerung: 'Menschen moegen dich mehr, NACHDEM sie dir einen Gefallen getan haben. Nicht andersrum. Psychologischer Grund: Kognitive Dissonanz — "Ich helfe dir, also muss ich dich moegen."',
    anwendung: 'Bitte um einen kleinen Gefallen: Buchempfehlung, kurzes Feedback, einen Tipp. Das startet die Beziehung.',
  },
  fehler: [
    {
      fehler: 'Der Tauschhandel',
      beschreibung: '"Ich habe dir X gegeben, jetzt schuldest du mir Y."',
      loesung: 'Networking ist kein Konto. Gib ohne zu zaehlen. Die Rendite kommt — von unerwarteter Seite.',
    },
    {
      fehler: 'Das Score-Keeping',
      beschreibung: 'Mental mitzaehlen, wer wem wie oft geholfen hat.',
      loesung: 'Wenn du zaehlen musst, stimmt die Beziehung nicht. Konzentriere dich auf Geber, nicht auf Nehmer.',
    },
    {
      fehler: 'Der sofortige Pitch',
      beschreibung: 'Nach dem ersten Treffen sofort etwas verkaufen oder bitten.',
      loesung: 'Mindestens 3 Wert-Geschenke geben, bevor du zum ersten Mal etwas bittest. Give-Give-Give-Ask.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 12. DARK_SOCIAL — 4 Kanaele
// ---------------------------------------------------------------------------
export const DARK_SOCIAL = [
  {
    kanal: 'WhatsApp-Gruppen',
    staerke: 'Schnell, informell, hohe Antwortrate',
    risiko: 'Spam-Gefahr, unstrukturiert, schwer zu verlassen',
    tipp: 'Maximal 3 aktive Gruppen. Qualitaet > Quantitaet. Bringe regelmaessig Wert ein.',
  },
  {
    kanal: 'Slack-Communities',
    staerke: 'Strukturiert, thematisch sortiert, suchbar',
    risiko: 'Zu viele Channels, Info-Overload',
    tipp: 'Fokussiere auf 2-3 Channels. Beantworte Fragen anderer — so wirst du sichtbar.',
  },
  {
    kanal: 'Mastermind-Zirkel',
    staerke: 'Tief, vertrauensvoll, gegenseitige Verpflichtung',
    risiko: 'Zeitintensiv, schwer gute Gruppen zu finden',
    tipp: 'Gruende selbst einen mit 4-6 Personen. Monatlich 90 Minuten. Klare Regeln.',
  },
  {
    kanal: 'Discord-Server',
    staerke: 'Echtzeit, Community-Gefuehl, oft international',
    risiko: 'Kann zum Zeitfresser werden',
    tipp: 'Finde die Discord-Server deiner Nische. Oft progressiver und offener als LinkedIn.',
  },
];

// ---------------------------------------------------------------------------
// 13. ETHIK — 6 Networking-Ethik Regeln
// ---------------------------------------------------------------------------
export const ETHIK = [
  { regel: 'Kein Stalking', beschreibung: 'Maximal 2 Follow-Ups ohne Antwort. Danach: Stopp. Respektiere das Schweigen.' },
  { regel: 'DSGVO beachten', beschreibung: 'Kontaktdaten nicht ohne Erlaubnis weitergeben. Vor jedem Intro beide Seiten fragen.' },
  { regel: 'Keine falschen Versprechungen', beschreibung: '"Ich kenne jemanden bei Google" — nur sagen, wenn es stimmt UND der Kontakt bereit ist zu helfen.' },
  { regel: 'Nein akzeptieren', beschreibung: 'Wenn jemand keine Zeit hat oder kein Interesse — respektiere es. Kein Nachhaken, kein Druck.' },
  { regel: 'Vertraulichkeit wahren', beschreibung: 'Was im Gespraech gesagt wird, bleibt im Gespraech. Tratsch zerstoert Netzwerke schneller als alles andere.' },
  { regel: 'Authentisch bleiben', beschreibung: 'Spiele keine Rolle. Netzwerke, die auf einer Fassade gebaut sind, brechen bei der ersten Krise zusammen.' },
];

// ---------------------------------------------------------------------------
// 14. AIRBAG — Krisen-Networking
// ---------------------------------------------------------------------------
export const AIRBAG = {
  prinzip: 'Baue dein Netzwerk VOR der Krise auf. Wenn du es brauchst, ist es zu spaet, es aufzubauen.',
  notfall_check: [
    { frage: 'Habe ich 3 Personen, die ich nachts um 2 Uhr anrufen koennte?', kategorie: 'Kernteam' },
    { frage: 'Habe ich einen Mentor, der meine Branche versteht?', kategorie: 'Mentor' },
    { frage: 'Kenne ich einen Recruiter, der mich in 48 Stunden vermitteln koennte?', kategorie: 'Beruflich' },
    { frage: 'Habe ich 5 Kontakte ausserhalb meiner Branche?', kategorie: 'Diversitaet' },
    { frage: 'Wuerde mein Netzwerk eine Empfehlung fuer mich schreiben — ohne zu zoegern?', kategorie: 'Vertrauen' },
  ],
  krisenplan: [
    'Sofort 5 engste Kontakte informieren (ehrlich, keine Fassade)',
    'Netzwerk-Map aktualisieren: Wer kann jetzt helfen?',
    'Um konkrete Hilfe bitten (nicht vage "haltet die Augen offen")',
    '48 Stunden Frist setzen fuer erste Gespraeche',
    'Jeden Helfer innerhalb von 24 Stunden updaten',
  ],
};

// ---------------------------------------------------------------------------
// 15. GEISTER_COUNTER — Geister-Statistiken + Badges
// ---------------------------------------------------------------------------
export const GEISTER_COUNTER = {
  statistiken: {
    kaltanfrage_rate: '30% Antwortrate bei kalten LinkedIn-Anfragen',
    warm_intro_rate: '85% Antwortrate bei warmen Intros',
    follow_up_rate: '60% antworten erst beim 2. oder 3. Follow-Up',
    ghosting_normal: 'Nur 1 von 3 Kontakten antwortet beim ersten Mal. Das ist NORMAL.',
  },
  badges: [
    { count: 5, name: 'Eis-Brecher', beschreibung: '5 Kaltanfragen gesendet. Der Anfang ist gemacht!' },
    { count: 10, name: 'Hartnäckiger', beschreibung: '10 Kaltanfragen. Du laesst dich nicht entmutigen!' },
    { count: 25, name: 'Networking-Maschine', beschreibung: '25 Kaltanfragen! Du bist unaufhaltbar!' },
  ],
  mindset_quotes: [
    '"Every master was once a disaster." — T. Harv Eker',
    '"Networking is not about collecting contacts. It is about planting relations." — MiSha',
    '"Die meisten Menschen ueberschaetzen, was sie in einem Jahr schaffen, und unterschaetzen, was sie in 10 Jahren erreichen." — Bill Gates',
    '"Your network is your net worth." — Porter Gale',
    '"Be genuinely interested in everyone you meet and everyone you meet will be genuinely interested in you." — Rasheed Ogunlaru',
    '"Dein Netzwerk waechst nicht, wenn du darauf wartest. Es waechst, wenn du den ersten Schritt machst."',
    '"Ghosting ist Feedback — nicht Ablehnung. Vielleicht war der Zeitpunkt falsch."',
    '"Die Angst vor Ablehnung ist immer groesser als die Ablehnung selbst."',
  ],
};

// ---------------------------------------------------------------------------
// 16. RITUALE — Wochen-/Monatsplan
// ---------------------------------------------------------------------------
export const RITUALE = {
  wochenplan: [
    {
      tag: 'Montag',
      aufgabe: 'LinkedIn-Check: 3 Beitraege kommentieren, 1 eigenen planen',
      dauer: '15 Min',
      kategorie: 'Sichtbarkeit',
    },
    {
      tag: 'Mittwoch',
      aufgabe: 'Touchpoint: 2 Kontakten eine kurze Nachricht schreiben (Artikel, Glueckwunsch, Frage)',
      dauer: '10 Min',
      kategorie: 'Pflege',
    },
    {
      tag: 'Freitag',
      aufgabe: 'Review: CRM checken (wer ist gelb/rot?), 1 Intro machen',
      dauer: '15 Min',
      kategorie: 'System',
    },
  ],
  monatsaufgabe: {
    aufgabe: '1 neuer Kontakt: Jemanden kennenlernen, den du noch nicht kennst',
    dauer: '30-60 Min',
    tipp: 'Event besuchen, LinkedIn-Anfrage, Kaffee-Einladung',
  },
  quartalsaufgabe: {
    aufgabe: 'Netzwerk-Audit: Map aktualisieren, Strategie pruefen, 1 Mentor-Gespraech',
    dauer: '60 Min',
    tipp: 'Wer ist neu? Wer ist weg? Wo sind Luecken?',
  },
};

// ---------------------------------------------------------------------------
// 17. GENERATIONEN — Boomer vs. Gen Z Networking
// ---------------------------------------------------------------------------
export const GENERATIONEN = {
  boomer: {
    generation: 'Boomer / Gen X',
    staerken: ['Persoenliche Beziehungen', 'Visitenkarten-Kultur', 'Langfristiges Vertrauen', 'Verbands-Netzwerke'],
    schwaechen: ['Oft offline-lastig', 'LinkedIn-Skepsis', 'Hierarchie-Denken'],
    tipp: 'Nutze ihre Erfahrung! Bitte um ein persoenliches Treffen — das schaetzen sie mehr als eine DM.',
  },
  genZ: {
    generation: 'Millennials / Gen Z',
    staerken: ['Digital Native', 'Community-orientiert', 'Authentisch', 'Global vernetzt'],
    schwaechen: ['Oft oberflaechlich-digital', 'Fear of Missing Out', 'Wenig Geduld fuer Langzeit-Beziehungen'],
    tipp: 'Bringe Tiefe in digitale Beziehungen. Ein 15-Minuten-Video-Call ist mehr wert als 50 Likes.',
  },
  bruecke: 'Die besten Networker kombinieren beides: Die Tiefe persoenlicher Beziehungen mit der Reichweite digitaler Plattformen.',
};

// ---------------------------------------------------------------------------
// 18. SCHWACHER_MOMENT — Um Hilfe bitten
// ---------------------------------------------------------------------------
export const SCHWACHER_MOMENT = {
  reframing: {
    alt: 'Um Hilfe bitten ist Schwaeche.',
    neu: 'Um Hilfe bitten ist Vertrauen. Es gibt dem anderen die Moeglichkeit, Wert zu stiften.',
  },
  tipps: [
    'Sei konkret: "Kannst du mich mit [Name] vernetzen?" statt "Halte die Augen offen."',
    'Sei ehrlich: "Ich stehe vor einer Herausforderung und brauche Rat." Nicht: "Alles gut!"',
    'Sei dankbar: Berichte zurueck, was aus der Hilfe geworden ist. Das motiviert fuer das naechste Mal.',
  ],
  uebung: {
    titel: 'Die Hilfe-Herausforderung',
    aufgabe: 'Bitte diese Woche 1 Person in deinem Netzwerk um einen konkreten Gefallen. Beobachte: Was passiert? Wie reagiert die Person?',
    reflexion: [
      'Wie hast du dich gefuehlt, als du um Hilfe gebeten hast?',
      'Wie hat die Person reagiert?',
      'Was wuerde sich aendern, wenn du das regelmaessig tust?',
    ],
  },
};

// ---------------------------------------------------------------------------
// 19. MODUL_QUIZ_NETZ — Quizzes fuer alle Module (2-3 Fragen)
// ---------------------------------------------------------------------------
export const MODUL_QUIZ_NETZ = {
  modul_1: {
    titel: 'Quiz: Die Networking-Wahrheit',
    fragen: [
      {
        frage: 'Wie viel Prozent der Jobs werden laut Studien nie oeffentlich ausgeschrieben?',
        optionen: ['30%', '50%', '70-80%', '95%'],
        korrekt: 2,
        erklaerung: '70-80% aller Stellen werden ueber persoenliche Kontakte oder interne Empfehlungen besetzt — der sogenannte "verdeckte Arbeitsmarkt".',
      },
      {
        frage: 'Was hat Mark Granovetter in seiner beruhmten Studie "The Strength of Weak Ties" herausgefunden?',
        optionen: [
          'Enge Freunde sind die besten Job-Vermittler',
          'Lose Bekannte vermitteln oefetr Jobs als enge Freunde',
          'Networking funktioniert nur online',
          'Man braucht mindestens 500 Kontakte',
        ],
        korrekt: 1,
        erklaerung: 'Weak Ties (lose Bekannte) verbinden dich mit neuen Informationskreisen. Deine engen Freunde wissen oft das Gleiche wie du.',
      },
    ],
  },
  modul_2: {
    titel: 'Quiz: Netzwerk-Audit',
    fragen: [
      {
        frage: 'Welche der 5 Kreise enthaelt die wertvollsten Networking-Kontakte?',
        optionen: ['Kernteam', 'Allies', 'Bruecken-Kontakte', 'Wunsch-Kontakte'],
        korrekt: 2,
        erklaerung: 'Bruecken-Kontakte verbinden dich mit neuen Netzwerken und Informationen. Sie sind die "Weak Ties" mit dem groessten Hebel.',
      },
      {
        frage: 'Wie viele Kontakte sollte ein gesundes Kernteam haben?',
        optionen: ['1-3', '5-8', '15-20', '50+'],
        korrekt: 1,
        erklaerung: '5-8 Personen, denen du wirklich vertraust. Qualitaet ueber Quantitaet.',
      },
    ],
  },
  modul_3: {
    titel: 'Quiz: Wert geben',
    fragen: [
      {
        frage: 'Was bedeutet die "Give-Give-Give-Ask" Formel?',
        optionen: [
          '3x nehmen, 1x geben',
          '3x Wert geben, bevor du 1x bittest',
          'Immer nur geben, nie bitten',
          'Fuer jeden Gefallen sofort einen zurueckfordern',
        ],
        korrekt: 1,
        erklaerung: 'Gib mindestens 3x Wert, bevor du zum ersten Mal um etwas bittest. So baust du ein Vertrauens-Guthaben auf.',
      },
      {
        frage: 'Was ist der Benjamin-Franklin-Effekt?',
        optionen: [
          'Wer viel gibt, bekommt viel zurueck',
          'Menschen moegen dich mehr, nachdem SIEIR dir einen Gefallen getan haben',
          'Geld ist der beste Networking-Hebel',
          'Frueher aufstehen macht produktiver',
        ],
        korrekt: 1,
        erklaerung: 'Kognitive Dissonanz: "Ich helfe dir, also muss ich dich moegen." Bitte um kleine Gefallen, um Beziehungen zu staerken.',
      },
    ],
  },
  modul_4: {
    titel: 'Quiz: Der erste Kontakt',
    fragen: [
      {
        frage: 'Was ist der beste Opener auf einem Networking-Event?',
        optionen: [
          '"Schoenes Wetter, oder?"',
          '"Ich bin [Name], wir machen XYZ..."',
          '"Was hat Sie heute hierhergebracht?"',
          '"Kennen Sie den CEO hier?"',
        ],
        korrekt: 2,
        erklaerung: 'Kontextbezogene, offene Fragen funktionieren am besten. Sie zeigen Interesse und lassen den anderen frei antworten.',
      },
      {
        frage: 'Wie lange dauert ein guter Networking-Elevator-Pitch?',
        optionen: ['10 Sekunden', '30 Sekunden', '2 Minuten', '5 Minuten'],
        korrekt: 1,
        erklaerung: '30 Sekunden: Problem, Loesung, Nutzen. Mehr braucht es nicht — der Rest kommt im Gespraech.',
      },
    ],
  },
  modul_5: {
    titel: 'Quiz: LinkedIn-Mastery',
    fragen: [
      {
        frage: 'Was ist der wichtigste Teil eines LinkedIn-Profils?',
        optionen: ['Das Profilbild', 'Die Headline', 'Die Erfahrungsliste', 'Die Skills'],
        korrekt: 1,
        erklaerung: 'Die Headline erscheint bei jeder Interaktion. Sie sollte deinen Mehrwert kommunizieren, nicht nur deinen Jobtitel.',
      },
      {
        frage: 'Vernetzungsanfrage: Solltest du eine persoenliche Nachricht hinzufuegen?',
        optionen: ['Nein, das ist uebertrieben', 'Nur bei VIPs', 'Ja, immer', 'Nur wenn du etwas willst'],
        korrekt: 2,
        erklaerung: 'IMMER eine persoenliche Nachricht. Sie verdreifacht die Annahme-Rate und zeigt, dass du kein Bot bist.',
      },
    ],
  },
  modul_6: {
    titel: 'Quiz: Follow-Up',
    fragen: [
      {
        frage: 'Wie schnell solltest du dich nach einem Kennenlernen melden?',
        optionen: ['Sofort', 'Innerhalb von 24-48 Stunden', 'Nach einer Woche', 'Wenn du etwas brauchst'],
        korrekt: 1,
        erklaerung: 'Die 48-Stunden-Regel: Danach verblasst die Erinnerung. Frueher ist besser.',
      },
      {
        frage: 'Was macht ein gutes Follow-Up aus?',
        optionen: [
          'Einfach "War nett!" schreiben',
          'Persoenlicher Bezug + konkreter Mehrwert (Artikel, Kontakt)',
          'Einen langen Lebenslauf schicken',
          'Eine Verkaufs-Mail',
        ],
        korrekt: 1,
        erklaerung: 'Beziehe dich auf etwas Konkretes aus dem Gespraech und liefere den versprochenen Wert.',
      },
    ],
  },
  modul_7: {
    titel: 'Quiz: Event-Networking',
    fragen: [
      {
        frage: 'Was ist der einfachste Ort, um auf einem Event Gespraeche zu starten?',
        optionen: ['Die Buehne', 'Die Bar / das Buffet', 'Die Toiletten-Schlange', 'Der Ausgang'],
        korrekt: 1,
        erklaerung: 'An der Bar stehen Menschen allein und warten. Sie sind offen fuer Gespraeche. Der einfachste Eisbrecher-Ort.',
      },
      {
        frage: 'Wann entstehen die tiefsten Beziehungen auf Konferenzen?',
        optionen: ['Waehrend der Vortraege', 'In den Pausen', 'Beim After-Work / Dinner', 'Am naechsten Morgen'],
        korrekt: 2,
        erklaerung: 'After-Work Events und Dinner sind die goldene Networking-Stunde. Die Stimmung ist locker und die Hierarchien flacher.',
      },
    ],
  },
  modul_8: {
    titel: 'Quiz: Kontakt-CRM',
    fragen: [
      {
        frage: 'Ab wann wird ein Kontakt im Ampel-System "rot"?',
        optionen: ['Nach 7 Tagen', 'Nach 30 Tagen', 'Nach 90 Tagen', 'Nach 365 Tagen'],
        korrekt: 2,
        erklaerung: 'Nach 90 Tagen ohne Kontakt schlaeft eine Beziehung ein. Zeit fuer einen Touchpoint!',
      },
      {
        frage: 'Was ist "Deep Context" im CRM?',
        optionen: [
          'Der Titel und die Firma',
          'Persoenliche Details: Geburtstag, Hobbies, Kinder',
          'Die LinkedIn-URL',
          'Das letzte Verkaufsgespraech',
        ],
        korrekt: 1,
        erklaerung: 'Deep Context macht Beziehungen persoenlich. "Wie laeuft es mit dem Klavier-Unterricht Ihrer Tochter?" zeigt echtes Interesse.',
      },
    ],
  },
  modul_9: {
    titel: 'Quiz: Mentoren & Sponsoren',
    fragen: [
      {
        frage: 'Was ist der Unterschied zwischen Mentor und Sponsor?',
        optionen: [
          'Kein Unterschied',
          'Mentor = Rat geben, Sponsor = aktiv fuer dich eintreten',
          'Mentor = bezahlt, Sponsor = unbezahlt',
          'Sponsor = nur finanziell',
        ],
        korrekt: 1,
        erklaerung: 'Ein Mentor gibt Rat. Ein Sponsor setzt seinen eigenen Ruf ein, um dich zu foerdern — z.B. bei Befoerderungen.',
      },
      {
        frage: 'Wie bittest du am besten um Mentoring?',
        optionen: [
          '"Werden Sie mein Mentor?" (direkt)',
          'Zeige Respekt, biete Wert, bitte um 20 Minuten',
          'Schicke deinen Lebenslauf und bitte um Hilfe',
          'Warte, bis der Mentor dich findet',
        ],
        korrekt: 1,
        erklaerung: 'Respekt + Konkretes Anliegen + Zeitlimit = die beste Mentor-Anfrage.',
      },
    ],
  },
  modul_10: {
    titel: 'Quiz: Super-Connectors & Hubs',
    fragen: [
      {
        frage: 'Warum ist ein Hub-Kontakt 100x wertvoller als ein normaler Kontakt?',
        optionen: [
          'Hubs sind reicher',
          'Hubs verbinden dich mit ganzen Netzwerken, nicht nur mit einer Person',
          'Hubs antworten immer',
          'Hubs sind wichtiger',
        ],
        korrekt: 1,
        erklaerung: 'Ein Hub ist wie ein Flughafen-Drehkreuz: Ueber ihn erreichst du Hunderte weitere Kontakte.',
      },
    ],
  },
};

// ---------------------------------------------------------------------------
// 20. JOURNAL_FRAGEN_NETZ — Journal-Prompts pro Modul
// ---------------------------------------------------------------------------
export const JOURNAL_FRAGEN_NETZ = {
  modul_0: ['Was ist mein groesster Networking-Wunsch fuer die naechsten 6 Monate?', 'Was haelt mich davon ab, mehr zu netzwerken?'],
  modul_1: ['Welche Chance habe ich verpasst, weil ich den richtigen Kontakt nicht hatte?', 'Wer in meinem Umfeld ist ein "Weak Tie", der mir neue Tueren oeffnen koennte?'],
  modul_2: ['Welche 3 Personen sind in meinem Kernteam?', 'Wo habe ich Luecken in meinem Netzwerk?'],
  modul_3: ['Was ist der letzte Gefallen, den ich jemandem ohne Gegenleistung getan habe?', 'Welches Wert-Geschenk koennte ich HEUTE jemandem machen?'],
  modul_4: ['Was ist meine groesste Angst beim Ansprechen von Fremden?', 'Wie lautet mein 30-Sekunden Networking-Intro?'],
  modul_5: ['Was fehlt meinem LinkedIn-Profil noch?', 'Welche 3 Personen moechte ich diese Woche auf LinkedIn ansprechen?'],
  modul_6: ['Bei welchem Kontakt habe ich das Follow-Up verpasst?', 'Wie kann ich mein Follow-Up-System verbessern?'],
  modul_7: ['Welches Event besuche ich als naechstes?', 'Was ist mein Ziel fuer dieses Event? (Anzahl Kontakte, konkreter Name, Thema)'],
  modul_8: ['Habe ich ein System zur Kontaktpflege? Wenn nein, welches baue ich auf?', 'Welche 3 Kontakte sind gerade "rot" und brauchen einen Touchpoint?'],
  modul_9: ['Wer waere mein Wunsch-Mentor? Warum?', 'Was koennte ICH einem Mentor bieten?'],
  modul_10: ['Wer sind die 3 wichtigsten Hubs in meiner Branche?', 'Wie koennte ich Zugang zu einem dieser Hubs bekommen?'],
  modul_11: ['Was nehme ich aus diesem Kurs mit?', 'Was ist mein erster konkreter Networking-Schritt morgen frueh?'],
};

// ---------------------------------------------------------------------------
// 21. ABSCHLUSSTEST_NETZ — 10 finale Fragen
// ---------------------------------------------------------------------------
export const ABSCHLUSSTEST_NETZ = {
  titel: 'Networking E-Learning — Abschlusstest',
  beschreibung: 'Teste dein Wissen aus allen Modulen. Mindestens 7 von 10 richtig zum Bestehen.',
  bestehensgrenze: 7,
  fragen: [
    {
      frage: 'Wie viel Prozent der Jobs werden ueber den verdeckten Arbeitsmarkt besetzt?',
      optionen: ['20-30%', '40-50%', '70-80%', '95%'],
      korrekt: 2,
      erklaerung: '70-80% aller Stellen werden ueber Kontakte und Empfehlungen besetzt.',
    },
    {
      frage: 'Was bedeutet die "Give-Give-Give-Ask" Formel?',
      optionen: [
        'Immer nur geben',
        '3x Wert geben, dann 1x bitten',
        'Geben und Nehmen im Gleichgewicht',
        'Jede Woche um etwas bitten',
      ],
      korrekt: 1,
      erklaerung: 'Baue ein Vertrauens-Guthaben auf durch Geben, bevor du zum ersten Mal bittest.',
    },
    {
      frage: 'Was ist ein "Weak Tie" und warum ist er wertvoll?',
      optionen: [
        'Ein schwacher Kontakt, der nutzlos ist',
        'Ein loser Bekannter, der dich mit neuen Netzwerken verbindet',
        'Ein Kontakt, der sich nie meldet',
        'Ein Online-Kontakt ohne persoenliches Treffen',
      ],
      korrekt: 1,
      erklaerung: 'Weak Ties verbinden verschiedene soziale Kreise und bringen neue Informationen.',
    },
    {
      frage: 'Wie schnell solltest du dich nach einem Kennenlernen melden?',
      optionen: ['Sofort', '24-48 Stunden', 'Nach einer Woche', 'Wenn du etwas brauchst'],
      korrekt: 1,
      erklaerung: 'Die 48-Stunden-Regel: Danach verblasst die Erinnerung an das Gespraech.',
    },
    {
      frage: 'Was ist der wichtigste Teil eines LinkedIn-Profils?',
      optionen: ['Das Foto', 'Die Headline', 'Die Erfahrung', 'Die Skills'],
      korrekt: 1,
      erklaerung: 'Die Headline erscheint ueberall und sollte deinen Mehrwert kommunizieren.',
    },
    {
      frage: 'Ab wann ist ein Kontakt im Ampel-System "rot"?',
      optionen: ['14 Tage', '30 Tage', '90 Tage', '1 Jahr'],
      korrekt: 2,
      erklaerung: 'Nach 90 Tagen ohne Kontakt schlaeft eine Beziehung ein.',
    },
    {
      frage: 'Was unterscheidet einen Mentor von einem Sponsor?',
      optionen: [
        'Nichts',
        'Mentor berät, Sponsor setzt sich aktiv fuer dich ein',
        'Sponsor ist bezahlt',
        'Mentor ist aelter',
      ],
      korrekt: 1,
      erklaerung: 'Ein Sponsor riskiert seinen eigenen Ruf, um dich zu foerdern.',
    },
    {
      frage: 'Was ist der Benjamin-Franklin-Effekt?',
      optionen: [
        'Frueh aufstehen macht produktiver',
        'Menschen moegen dich mehr, nachdem sie dir geholfen haben',
        'Geld verdirbt den Charakter',
        'Erste Eindruecke sind am wichtigsten',
      ],
      korrekt: 1,
      erklaerung: 'Kognitive Dissonanz: Wer dir hilft, ueberzeugt sich selbst, dich zu moegen.',
    },
    {
      frage: 'Wie viele Follow-Ups ohne Antwort sind ethisch vertretbar?',
      optionen: ['0', '1', '2', '5'],
      korrekt: 2,
      erklaerung: 'Maximal 2 Follow-Ups. Danach Stille respektieren — kein Stalking.',
    },
    {
      frage: 'Was ist die effektivste Art, einen C-Level Kontakt aufzubauen?',
      optionen: [
        'Kalt anrufen',
        'LinkedIn-Spam',
        'Warmes Intro ueber gemeinsamen Kontakt',
        'Unangekuendigt im Buero erscheinen',
      ],
      korrekt: 2,
      erklaerung: 'Warme Intros sind 10x erfolgreicher als Kaltanfragen bei C-Level.',
    },
  ],
};

// ---------------------------------------------------------------------------
// 22. RUECKFALL_NETZ — 5 Warnsignale + 3-in-3 Reset
// ---------------------------------------------------------------------------
export const RUECKFALL_NETZ = {
  warnsignale: [
    { signal: 'Du hast seit 2 Wochen keinen Kontakt angeschrieben.', level: 'Frueh', aktion: 'Schreibe JETZT 1 Nachricht. Nur eine. Sofort.' },
    { signal: 'Dein CRM ist seit einem Monat nicht aktualisiert.', level: 'Mittel', aktion: '10 Minuten: Oeffne dein CRM und aktualisiere 3 Kontakte.' },
    { signal: 'Du hast ein Event abgesagt, obwohl du Zeit hattest.', level: 'Mittel', aktion: 'Melde dich fuer das naechste Event an. Jetzt. Nicht morgen.' },
    { signal: 'Du denkst "Networking bringt doch nichts".', level: 'Kritisch', aktion: 'Erinnere dich: Welcher Kontakt hat dir zuletzt geholfen? Schreibe ihm/ihr eine Dankes-Nachricht.' },
    { signal: 'Du hast das Gefuehl, dass dein Netzwerk "eingeschlafen" ist.', level: 'Kritisch', aktion: 'Starte den 3-in-3 Reset: 3 Kontakte in 3 Tagen. Das reicht, um den Motor wieder zu starten.' },
  ],
  reset: {
    name: 'Der 3-in-3 Netzwerk-Reset',
    beschreibung: 'Wenn dein Netzwerk einschlaeft: 3 Kontakte in 3 Tagen. Mehr brauchst du nicht.',
    schritte: [
      { tag: 1, aufgabe: 'Schreibe 1 Kontakt aus deinem Kernteam. Einfach "Hey, wie geht es dir?"', tipp: 'Keine Agenda. Nur Interesse.' },
      { tag: 2, aufgabe: 'Schreibe 1 schlafenden Kontakt an und teile einen Artikel oder Link.', tipp: 'Wert geben ohne Erwartung.' },
      { tag: 3, aufgabe: 'Mache 1 Intro: Vernetze zwei Menschen, die voneinander profitieren koennten.', tipp: 'Das ist die koenigliche Disziplin des Networkings.' },
    ],
  },
};

// ---------------------------------------------------------------------------
// 23. MICRO_LEARNINGS_NETZ — 90-Tage Impulse
// ---------------------------------------------------------------------------
export const MICRO_LEARNINGS_NETZ = [
  { tag: 1, impuls: 'Schreibe heute 1 Person eine kurze Nachricht: "Ich musste an dich denken, als ich [X] gesehen habe."' },
  { tag: 5, impuls: 'Kommentiere 3 LinkedIn-Posts von Kontakten. Nicht "Toller Post!" — sondern inhaltlich.' },
  { tag: 10, impuls: 'Identifiziere 1 Bruecken-Kontakt und melde dich bei ihm/ihr.' },
  { tag: 15, impuls: 'Mache ein Intro: Vernetze 2 Menschen, die sich noch nicht kennen.' },
  { tag: 20, impuls: 'Aktualisiere dein LinkedIn-Profil: Headline, About, Foto.' },
  { tag: 25, impuls: 'Schreibe 1 LinkedIn-Empfehlung fuer jemanden — ungefragt.' },
  { tag: 30, impuls: 'Check dein CRM: Wer ist gelb oder rot? Schreibe 2 Touchpoints.' },
  { tag: 35, impuls: 'Besuche 1 Event (online oder offline). Ziel: 3 neue Kontakte.' },
  { tag: 40, impuls: 'Bitte 1 Person um einen kleinen Gefallen (Benjamin-Franklin-Effekt).' },
  { tag: 45, impuls: 'Pruefe: Hast du in den letzten 30 Tagen mehr gegeben als genommen?' },
  { tag: 50, impuls: 'Identifiziere 1 Hub in deiner Branche und plane, wie du Zugang bekommst.' },
  { tag: 55, impuls: 'Schreibe deinem aeltesten "schlafenden" Kontakt. Reaktiviere die Beziehung.' },
  { tag: 60, impuls: 'Halbzeit! Mache ein Mini-Audit: Wie hat sich dein Netzwerk in 60 Tagen veraendert?' },
  { tag: 65, impuls: 'Plane einen Kaffee mit jemandem ausserhalb deiner Branche. Neue Perspektiven!' },
  { tag: 70, impuls: 'Schreibe 1 persoenliche Dankesnachricht an jemanden, der dir geholfen hat.' },
  { tag: 75, impuls: 'Teile 1 eigenen LinkedIn-Beitrag. Thema: Was du in den letzten Wochen gelernt hast.' },
  { tag: 80, impuls: 'Identifiziere 1 potentiellen Mentor und formuliere deine Anfrage.' },
  { tag: 85, impuls: 'Mache 2 Intros an einem Tag. Doppelter Wert, doppelte Sichtbarkeit.' },
  { tag: 90, impuls: 'Grosses Netzwerk-Audit: Aktualisiere deine Map, feiere deine Fortschritte, setze neue Ziele!' },
];
