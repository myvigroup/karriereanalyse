// ============================================================
// KARRIERE-ANALYSE MATRIX
// 12 Kompetenzfelder × 4 Fragen (2 Szenario + 2 Selbsteinschätzung)
// Max Score pro Feld: 30 Punkte (2×10 + 2×5)
// ============================================================

export const KOMPETENZFELDER = [
  {
    id: 'selbstwert',
    name: 'Selbstwert',
    icon: '🛡️',
    color: '#CC1426',
    masterclass: 'selbstwert',
    outcome: {
      headline: 'Verdiene bis zu 20% mehr — durch souveränes Auftreten',
      text: 'Wer seinen Wert kennt, verhandelt besser. Studien zeigen: Selbstsicherheit in Gehaltsverhandlungen ist der #1-Faktor für höhere Einstiegsgehälter.',
    },
    intro: {
      was: 'Selbstwert ist dein inneres Fundament — die Überzeugung, dass du gut genug bist, Chancen verdienst und Rückschläge überstehst.',
      warum: 'Bei Studierenden ist der Selbstwert oft der größte unsichtbare Karriereblocker. Du schlägst eine Stelle nicht an, weil du dich "noch nicht bereit" fühlst — und verpasst genau diese Chance.',
      schwaechen: [
        'Stellen nicht bewerben, weil du nur 70% der Anforderungen erfüllst',
        'In Gehaltsverhandlungen zu schnell nachgeben',
        'Erfolge auf Glück statt auf Fähigkeit zurückführen',
      ],
    },
    fragen: [
      {
        type: 'scenario',
        text: 'Du siehst eine Traumstelle — aber erfüllst nur 7 von 10 genannten Anforderungen. Was tust du?',
        options: [
          { text: 'Bewerben — ich bringe das Fehlende schnell bei', score: 10, emoji: '🚀' },
          { text: 'Bewerben, aber mit einem etwas unsicheren Gefühl', score: 7, emoji: '🤔' },
          { text: 'Ich warte auf eine passendere Stelle', score: 4, emoji: '⏳' },
          { text: 'Ich bewerbe mich nicht — zu viel fehlt mir noch', score: 1, emoji: '😶' },
        ],
      },
      {
        type: 'scenario',
        text: 'Im Vorstellungsgespräch fragt man dich nach deiner Gehaltsvorstellung. Deine Reaktion:',
        options: [
          { text: 'Ich nenne selbstbewusst eine konkrete Zahl', score: 10, emoji: '💪' },
          { text: 'Ich nenne eine Spanne und begründe sie kurz', score: 7, emoji: '📊' },
          { text: 'Ich nenne etwas, bin aber innerlich unsicher', score: 4, emoji: '😬' },
          { text: 'Ich sage, ich bin flexibel — sie sollen mir was nennen', score: 1, emoji: '🙈' },
        ],
      },
      {
        type: 'scale',
        text: 'Wie sehr glaubst du, dass deine Fähigkeiten für den Arbeitsmarkt wertvoll sind?',
        low: 'Kaum — ich bin noch nicht weit genug',
        high: 'Absolut — ich habe echten Mehrwert zu bieten',
      },
      {
        type: 'scale',
        text: 'Wenn du einen Erfolg hast — wie sehr schreibst du ihn dir selbst zu (vs. Glück/andere)?',
        low: 'Meistens war es Glück oder die Umstände',
        high: 'Ich weiß, dass meine Leistung den Unterschied gemacht hat',
      },
    ],
  },

  {
    id: 'prioritaeten',
    name: 'Prioritätenmanagement',
    icon: '🎯',
    color: '#E63946',
    masterclass: 'produktivitaet',
    outcome: {
      headline: 'Doppelt so produktiv — in der gleichen Zeit',
      text: 'Wer Wichtiges von Dringendem trennt, erledigt in 6 Stunden, wofür andere 10 brauchen — und fällt im Job sofort positiv auf.',
    },
    intro: {
      was: 'Prioritätenmanagement ist die Fähigkeit, das Richtige zum richtigen Zeitpunkt zu tun — nicht einfach alles, was auf dich einprasselt.',
      warum: 'Besonders im Studium und Berufseinstieg wird man mit Aufgaben überflutet. Wer keine Prioritäten setzt, rennt ständig hinterher und liefert mittelmäßige Ergebnisse überall statt Exzellenz bei den wichtigen Dingen.',
      schwaechen: [
        'E-Mails zuerst beantworten statt am Kernprojekt zu arbeiten',
        'Deadlines verpassen, weil "alles irgendwie dringend war"',
        'Erschöpft sein, obwohl man das Gefühl hat, nichts geschafft zu haben',
      ],
    },
    fragen: [
      {
        type: 'scenario',
        text: 'Du hast morgen eine wichtige Präsentation. Gleichzeitig kommen 5 neue E-Mails rein, eine davon von deinem Chef. Was tust du zuerst?',
        options: [
          { text: 'Präsentation fertigstellen — dann E-Mails', score: 10, emoji: '🎯' },
          { text: 'Chefs E-Mail kurz checken, dann weiter mit Präsentation', score: 7, emoji: '📋' },
          { text: 'Erst alle E-Mails beantworten, dann weiter', score: 4, emoji: '📧' },
          { text: 'Zwischen beiden hin und her springen', score: 1, emoji: '😵' },
        ],
      },
      {
        type: 'scenario',
        text: 'Dein Praktikumsbetreuer gibt dir 3 neue Aufgaben, obwohl du schon ausgelastet bist. Du:',
        options: [
          { text: 'Kommuniziere klar, was realistisch ist, und schlage Prioritäten vor', score: 10, emoji: '💬' },
          { text: 'Nehme alles an und reorganisiere meinen Plan', score: 7, emoji: '🔄' },
          { text: 'Sage ja und mache Überstunden, um es zu schaffen', score: 4, emoji: '😓' },
          { text: 'Sage ja und hoffe, dass irgendwie alles klappt', score: 1, emoji: '🙏' },
        ],
      },
      {
        type: 'scale',
        text: 'Wie gut gelingt es dir, deinen Tag nach Wichtigkeit statt nach Dringlichkeit zu strukturieren?',
        low: 'Kaum — ich reagiere meist auf das, was gerade reinkommt',
        high: 'Sehr gut — ich arbeite gezielt an meinen Hauptprioritäten',
      },
      {
        type: 'scale',
        text: 'Wie oft schaffst du es, deinen Feierabend ohne schlechtes Gewissen zu genießen?',
        low: 'Fast nie — es ist immer irgendetwas offen',
        high: 'Regelmäßig — ich arbeite effizient und habe klare Grenzen',
      },
    ],
  },

  {
    id: 'kompetenzbewusstsein',
    name: 'Kompetenzbewusstsein',
    icon: '💎',
    color: '#7C3AED',
    masterclass: 'karriereplanung',
    outcome: {
      headline: 'Kenne deinen Marktwert — und verhandle ihn durch',
      text: 'Wer seine Kompetenzen klar benennen kann, überzeugt in Bewerbungen, verhandelt besser und positioniert sich für die richtigen Rollen.',
    },
    intro: {
      was: 'Kompetenzbewusstsein bedeutet: Du weißt, was du kannst — nicht nur gefühlt, sondern konkret und belastbar. Du kannst deine Stärken in Sprache übersetzen.',
      warum: 'Viele Studierende unterschätzen sich massiv. Ein Nebenjob, ein Auslandssemester, ein Hochschulprojekt — das sind echte Kompetenzen. Wer sie nicht benennt, verschenkt Chancen.',
      schwaechen: [
        'Im Vorstellungsgespräch auf "Was sind Ihre Stärken?" ins Stocken geraten',
        'Erfahrungen im Lebenslauf zu vage formulieren',
        'Sich für Rollen nicht bewerben, weil man "noch nicht gut genug" ist',
      ],
    },
    fragen: [
      {
        type: 'scenario',
        text: 'Jemand fragt dich auf einer Karrieremesse: "Was macht dich als Kandidaten aus?" Du:',
        options: [
          { text: 'Beantworte es klar und mit konkreten Beispielen', score: 10, emoji: '🎤' },
          { text: 'Erzähle allgemein über deine Erfahrungen', score: 7, emoji: '🗣️' },
          { text: 'Bin verlegen und halte mich vage', score: 4, emoji: '😳' },
          { text: 'Wechsle schnell das Thema', score: 1, emoji: '🏃' },
        ],
      },
      {
        type: 'scenario',
        text: 'Du sollst deinen Lebenslauf in 30 Minuten auf eine Stelle zuschneiden. Du:',
        options: [
          { text: 'Weiß genau, welche meiner Kompetenzen passen — fertig in 20 Min.', score: 10, emoji: '⚡' },
          { text: 'Brauche etwas, finde aber die richtigen Punkte', score: 7, emoji: '📝' },
          { text: 'Bin unsicher, was wirklich relevant ist', score: 4, emoji: '🤷' },
          { text: 'Schicke meist den Standard-Lebenslauf', score: 1, emoji: '📄' },
        ],
      },
      {
        type: 'scale',
        text: 'Wie klar kannst du deine Top 3 Stärken sofort nennen — mit konkreten Beispielen?',
        low: 'Gar nicht — ich müsste lange nachdenken',
        high: 'Sofort — ich kenne sie auswendig mit Belegen',
      },
      {
        type: 'scale',
        text: 'Wie gut weißt du, was du auf dem Arbeitsmarkt wert bist (Gehaltsspanne, Nachfrage deiner Skills)?',
        low: 'Kaum — kein Überblick über meinen Marktwert',
        high: 'Sehr gut — ich kenne Gehaltsdaten und weiß, wo ich stehe',
      },
    ],
  },

  {
    id: 'kommunikation',
    name: 'Kommunikation',
    icon: '💬',
    color: '#2563EB',
    masterclass: 'kommunikation',
    outcome: {
      headline: 'Überzeuge jeden — in Meetings, Interviews und Konflikten',
      text: 'Klare Kommunikation ist die #1-Soft-Skill, die Arbeitgeber suchen. Wer sich durchsetzen kann, steigt schneller auf.',
    },
    intro: {
      was: 'Kommunikation ist mehr als reden. Es geht darum, die richtige Botschaft zur richtigen Zeit an die richtige Person zu bringen — klar, empathisch und überzeugend.',
      warum: 'Im Job scheitern die meisten Probleme an Kommunikation: unklare Erwartungen, vermiedene Konflikte, Ideen die nicht gehört werden. Wer kommunizieren kann, setzt sich durch.',
      schwaechen: [
        'In Meetings schweigen, obwohl du eine gute Idee hast',
        'Konflikte vermeiden und Probleme runterschlucken',
        'Feedback geben, das verletzt statt hilft',
      ],
    },
    fragen: [
      {
        type: 'scenario',
        text: 'In einem Gruppenmeeting siehst du einen klaren Fehler im Vorschlag deines Teamkollegen. Du:',
        options: [
          { text: 'Sprichst es direkt aber konstruktiv an', score: 10, emoji: '✋' },
          { text: 'Schreibst es kurz in den Chat', score: 7, emoji: '💬' },
          { text: 'Sagst nichts im Meeting, sprichst ihn danach an', score: 4, emoji: '🤫' },
          { text: 'Schweigst — du willst keine Unruhe stiften', score: 1, emoji: '😶' },
        ],
      },
      {
        type: 'scenario',
        text: 'Dein Chef gibt dir Feedback, das du für falsch hältst. Du:',
        options: [
          { text: 'Höre zu, erkläre sachlich deinen Standpunkt mit Argumenten', score: 10, emoji: '💪' },
          { text: 'Nicke, aber suche danach das Gespräch', score: 7, emoji: '🤝' },
          { text: 'Schlucke es runter und machst, was er sagt', score: 4, emoji: '😑' },
          { text: 'Bin frustriert und beschwere mich bei Kollegen', score: 1, emoji: '😤' },
        ],
      },
      {
        type: 'scale',
        text: 'Wie souverän fühlst du dich, wenn du in einer Gruppe sprechen oder präsentieren musst?',
        low: 'Sehr unwohl — ich vermeide es wenn möglich',
        high: 'Sehr sicher — ich kommuniziere klar und überzeugend',
      },
      {
        type: 'scale',
        text: 'Wie gut gelingt es dir, Konflikte direkt und konstruktiv anzusprechen?',
        low: 'Kaum — ich weiche Konflikten meist aus',
        high: 'Sehr gut — ich löse Konflikte aktiv und konstruktiv',
      },
    ],
  },

  {
    id: 'sozialkompetenz',
    name: 'Sozialkompetenz',
    icon: '🤝',
    color: '#3B82F6',
    masterclass: 'sozialkompetenz',
    outcome: {
      headline: 'Baue das Netzwerk, das deine Karriere macht',
      text: '85% aller Jobs werden über Kontakte vergeben. Sozialkompetenz ist keine "nice to have" — sie ist dein Karrierenetzwerk.',
    },
    intro: {
      was: 'Sozialkompetenz ist die Fähigkeit, authentische Beziehungen aufzubauen, Vertrauen zu gewinnen und in Teams effektiv zusammenzuarbeiten.',
      warum: 'Im Studium beginnt das Netzwerk, das später Jobangebote, Empfehlungen und Kooperationen bringt. Wer in sozialen Situationen unsicher ist, verpasst diese frühen Verbindungen.',
      schwaechen: [
        'Networking-Events meiden, weil es sich "aufgesetzt" anfühlt',
        'Schwierige Kollegen oder Gruppenarbeiten als reine Last erleben',
        'Hilfe nicht anbieten und nicht annehmen können',
      ],
    },
    fragen: [
      {
        type: 'scenario',
        text: 'Bei einem Karriere-Event stehst du allein und kennst niemanden. Du:',
        options: [
          { text: 'Gehe aktiv auf andere zu und starte Gespräche', score: 10, emoji: '🤗' },
          { text: 'Warte, bis jemand mich anspricht', score: 7, emoji: '🙂' },
          { text: 'Bleibe in der Nähe einer bekannten Person', score: 4, emoji: '😬' },
          { text: 'Verlasse das Event früher als geplant', score: 1, emoji: '🏃' },
        ],
      },
      {
        type: 'scenario',
        text: 'In deiner Lerngruppe gibt es einen Konflikt zwischen zwei Mitgliedern, der die Gruppe lähmt. Du:',
        options: [
          { text: 'Vermittle aktiv und bringt beide zu einer Lösung', score: 10, emoji: '🕊️' },
          { text: 'Spreche beide getrennt an und versuche zu helfen', score: 7, emoji: '💬' },
          { text: 'Halte mich raus — das ist nicht mein Problem', score: 4, emoji: '🙈' },
          { text: 'Bin genervt und denke über Wechsel der Gruppe nach', score: 1, emoji: '😤' },
        ],
      },
      {
        type: 'scale',
        text: 'Wie wohl fühlst du dich, auf fremde Menschen zuzugehen und ein Gespräch zu starten?',
        low: 'Sehr unwohl — ich warte lieber, bis jemand auf mich zukommt',
        high: 'Sehr wohl — ich knüpfe gerne und leicht neue Kontakte',
      },
      {
        type: 'scale',
        text: 'Wie gut gelingt es dir, auch mit schwierigen Persönlichkeiten konstruktiv zusammenzuarbeiten?',
        low: 'Schwer — es kostet mich viel Energie',
        high: 'Gut — ich finde meist einen Weg, auch mit schwierigen Menschen',
      },
    ],
  },

  {
    id: 'praesentation',
    name: 'Präsentationskompetenz',
    icon: '🎤',
    color: '#1D4ED8',
    masterclass: 'kommunikation',
    outcome: {
      headline: 'Sei die Person im Raum, die man sich merkt',
      text: 'Sichtbarkeit entscheidet über Karriereaufstieg. Wer präsentieren kann, wird für wichtige Projekte und Führungsrollen in Betracht gezogen.',
    },
    intro: {
      was: 'Präsentationskompetenz ist die Fähigkeit, Ideen so zu vermitteln, dass andere verstehen, überzeugt werden und sich erinnern.',
      warum: 'Im Berufseinstieg entscheidet oft eine gute Präsentation darüber, ob ein Projekt genehmigt wird, ob du für eine Aufgabe berücksichtigt wirst oder ob dein Chef auf dich aufmerksam wird.',
      schwaechen: [
        'Präsentationen wirken langweilig und generisch',
        'Nervosität bei Zwischenfragen oder Kritik',
        'Zu viel Text auf Folien, zu wenig eigene Worte',
      ],
    },
    fragen: [
      {
        type: 'scenario',
        text: 'Dein Chef bittet dich spontan, in 10 Minuten dein aktuelles Projekt im Teammeeting vorzustellen. Du:',
        options: [
          { text: 'Kein Problem — ich strukturiere es schnell im Kopf', score: 10, emoji: '😎' },
          { text: 'Bin nervös, ziehe es aber durch', score: 7, emoji: '💪' },
          { text: 'Bitte darum, es nächstes Mal machen zu dürfen', score: 4, emoji: '🙏' },
          { text: 'Schlage einen Kollegen vor, der besser präsentieren kann', score: 1, emoji: '🙈' },
        ],
      },
      {
        type: 'scenario',
        text: 'Während deiner Präsentation stellt jemand eine schwierige Frage, auf die du keine Antwort hast. Du:',
        options: [
          { text: 'Sage es offen und biete an, es nachzuliefern', score: 10, emoji: '✅' },
          { text: 'Umschreibe die Frage und antworte so gut ich kann', score: 7, emoji: '🤔' },
          { text: 'Werde nervös und verliere den Faden', score: 4, emoji: '😰' },
          { text: 'Versuche etwas zu antworten, auch wenn ich es erfinde', score: 1, emoji: '🎭' },
        ],
      },
      {
        type: 'scale',
        text: 'Wie sicher fühlst du dich, vor einer Gruppe von 10+ Personen frei zu sprechen?',
        low: 'Sehr unsicher — ich bekomme Lampenfieber und Blackout',
        high: 'Sehr sicher — ich rede gerne vor Gruppen',
      },
      {
        type: 'scale',
        text: 'Wie gut gelingt es dir, komplizierte Inhalte einfach und spannend zu erklären?',
        low: 'Schwer — meine Erklärungen sind oft unklar oder zu komplex',
        high: 'Gut — ich kann komplexe Dinge einfach und fesselnd rüberbringen',
      },
    ],
  },

  {
    id: 'selbstfuersorge',
    name: 'Selbstfürsorge',
    icon: '🧘',
    color: '#A78BFA',
    masterclass: 'resilienz',
    outcome: {
      headline: 'Nachhaltige Leistung statt Burnout im ersten Job',
      text: 'Wer auf sich achtet, leistet langfristig mehr. Selbstfürsorge ist kein Luxus — sie ist die Basis für jede Hochleistung.',
    },
    intro: {
      was: 'Selbstfürsorge bedeutet, aktiv auf die eigenen Bedürfnisse zu achten — körperlich, emotional und mental — ohne dabei schlechtes Gewissen zu haben.',
      warum: 'Viele Studierende und Berufseinsteiger laufen auf Dauervollgas, bis sie ausbrennen. Der erste Karriere-Burnout ist häufig im 2.-3. Berufsjahr. Das lässt sich verhindern.',
      schwaechen: [
        'Keine klaren Grenzen zwischen Studium/Arbeit und Erholung',
        'Sport, Schlaf und Pausen als erstes streichen bei Stress',
        'Hilfe nicht annehmen können, weil es sich "schwach" anfühlt',
      ],
    },
    fragen: [
      {
        type: 'scenario',
        text: 'Du arbeitest gerade an einer wichtigen Hausarbeit. Es ist 23 Uhr und du bist erschöpft. Du:',
        options: [
          { text: 'Höre auf — ausgeruht morgen bin ich produktiver', score: 10, emoji: '😴' },
          { text: 'Mache noch 30 Minuten, dann Schluss', score: 7, emoji: '⏰' },
          { text: 'Mache weiter bis es fertig ist, egal wie spät', score: 4, emoji: '😤' },
          { text: 'Mache weiter und schlafe, wenn alles erledigt ist', score: 1, emoji: '🤯' },
        ],
      },
      {
        type: 'scenario',
        text: 'Du bemerkst, dass du seit Wochen gestresst, gereizt und unkonzentriert bist. Du:',
        options: [
          { text: 'Analysiere, was mich auslaugt, und ändere aktiv etwas', score: 10, emoji: '🔍' },
          { text: 'Gönn mir ein verlängertes Wochenende zur Erholung', score: 7, emoji: '🏖️' },
          { text: 'Hoffe, dass es nach der nächsten Deadline besser wird', score: 4, emoji: '🙏' },
          { text: 'Mache einfach weiter — irgendwann wird es besser', score: 1, emoji: '😶' },
        ],
      },
      {
        type: 'scale',
        text: 'Wie gut gelingt es dir, klar zwischen Arbeitszeit und Erholungszeit zu trennen?',
        low: 'Kaum — ich bin gedanklich immer beim Studium/der Arbeit',
        high: 'Sehr gut — ich habe klare Grenzen und halte sie ein',
      },
      {
        type: 'scale',
        text: 'Wie konsequent pflegst du Gewohnheiten, die dir Energie geben (Sport, Schlaf, Hobbys)?',
        low: 'Kaum — das fällt als erstes weg, wenn es stressig wird',
        high: 'Sehr konsequent — das ist nicht verhandelbar für mich',
      },
    ],
  },

  {
    id: 'selbstreflexion',
    name: 'Selbstreflexion',
    icon: '🪞',
    color: '#8B5CF6',
    masterclass: 'karriereplanung',
    outcome: {
      headline: 'Triff die richtigen Karriereentscheidungen — jedes Mal',
      text: 'Selbstreflexion ist das Werkzeug, mit dem du blinde Flecken siehst, aus Fehlern lernst und Karrieremoves machst, die wirklich zu dir passen.',
    },
    intro: {
      was: 'Selbstreflexion ist die Fähigkeit, das eigene Handeln, Denken und Fühlen bewusst zu beobachten — ohne sich selbst zu verurteilen, aber mit dem Ziel zu wachsen.',
      warum: 'Wer nie reflektiert, wiederholt die gleichen Fehler. Wer regelmäßig reflektiert, lernt 3x schneller und trifft bessere Entscheidungen über Jobs, Beziehungen und Ziele.',
      schwaechen: [
        'Aus Misserfolgen nicht systematisch lernen',
        'Dasselbe Muster immer wieder erleben (gleicher Chef-Konflikt, gleiche Teamdynamik)',
        'Keine klare Antwort auf "Wohin soll meine Karriere gehen?"',
      ],
    },
    fragen: [
      {
        type: 'scenario',
        text: 'Du hast eine Klausur schlechter bestanden als erwartet. Was machst du danach?',
        options: [
          { text: 'Analysiere konkret, was ich anders machen würde', score: 10, emoji: '🔬' },
          { text: 'Denke kurz drüber nach und lerne für die nächste', score: 7, emoji: '📚' },
          { text: 'Bin frustriert, aber mache weiter wie bisher', score: 4, emoji: '😔' },
          { text: 'Verdränge es — was vorbei ist, ist vorbei', score: 1, emoji: '🙈' },
        ],
      },
      {
        type: 'scenario',
        text: 'Jemand gibt dir kritisches Feedback. Deine erste Reaktion:',
        options: [
          { text: 'Ich höre aufmerksam zu und überlege, was daran stimmt', score: 10, emoji: '🎧' },
          { text: 'Es trifft mich kurz, ich nehme es aber an', score: 7, emoji: '🤔' },
          { text: 'Ich verteidige mich instinktiv', score: 4, emoji: '🛡️' },
          { text: 'Ich denke, die Person versteht mich nicht', score: 1, emoji: '😤' },
        ],
      },
      {
        type: 'scale',
        text: 'Wie regelmäßig nimmst du dir Zeit, dein Handeln und deine Entscheidungen zu reflektieren?',
        low: 'Kaum — ich lebe mehr im Autopilot',
        high: 'Regelmäßig — Reflexion ist fester Teil meiner Routine',
      },
      {
        type: 'scale',
        text: 'Wie klar ist dir, was du in 5 Jahren karrieremäßig erreicht haben willst?',
        low: 'Gar nicht klar — ich lasse das auf mich zukommen',
        high: 'Sehr klar — ich habe eine konkrete Vorstellung und arbeite darauf hin',
      },
    ],
  },

  {
    id: 'sicherheit',
    name: 'Auftreten & Sicherheit',
    icon: '⚡',
    color: '#F59E0B',
    masterclass: 'selbstwert',
    outcome: {
      headline: 'Der erste Eindruck entscheidet — und du bestimmst ihn',
      text: 'In den ersten 7 Sekunden entscheiden Menschen, ob sie dir vertrauen. Souveränes Auftreten öffnet Türen, die Fachkompetenz allein nicht öffnen kann.',
    },
    intro: {
      was: 'Auftreten und Sicherheit beschreibt, wie du dich in der Welt zeigst — deine Körpersprache, deine Stimme, wie du Räume betrittst und wie du unter Druck wirkst.',
      warum: 'Recruiter entscheiden oft innerhalb von Minuten, ob jemand "die Stelle hat". Nicht immer wegen der Qualifikation — oft wegen des Auftretens. Das ist trainierbar.',
      schwaechen: [
        'In Vorstellungsgesprächen nervös wirken, obwohl man qualifiziert ist',
        'Die eigene Stimme unsicher klingen lassen durch Aufwärtsintonation',
        'Körpersprache, die Unsicherheit signalisiert (Blickkontakt meiden, Haltung)',
      ],
    },
    fragen: [
      {
        type: 'scenario',
        text: 'Du betrittst ein Vorstellungsgespräch. Wie ist dein Auftreten in den ersten 30 Sekunden?',
        options: [
          { text: 'Aufrecht, Blickkontakt, fester Händedruck, klare Vorstellung', score: 10, emoji: '💼' },
          { text: 'Freundlich und höflich, aber etwas verhalten', score: 7, emoji: '🙂' },
          { text: 'Nervös — ich spüre, dass es sich auf meine Haltung auswirkt', score: 4, emoji: '😬' },
          { text: 'Sehr angespannt und unsicher', score: 1, emoji: '😰' },
        ],
      },
      {
        type: 'scenario',
        text: 'Du bist in einem Meeting mit wichtigen Entscheidungsträgern. Wirst du wahrgenommen?',
        options: [
          { text: 'Ja — ich bringe mich aktiv ein und werde ernst genommen', score: 10, emoji: '✋' },
          { text: 'Manchmal — wenn ich etwas sage, wird es gehört', score: 7, emoji: '🗣️' },
          { text: 'Eher nicht — ich sage selten etwas', score: 4, emoji: '🤐' },
          { text: 'Nein — ich wirke in solchen Situationen unsichtbar', score: 1, emoji: '👻' },
        ],
      },
      {
        type: 'scale',
        text: 'Wie sicher wirkst du in neuen oder formalen Situationen (Meetings, Präsentationen, Gespräche mit Autoritäten)?',
        low: 'Sehr unsicher — meine Nervosität ist für andere sichtbar',
        high: 'Sehr sicher — ich wirke ruhig und kompetent, auch wenn ich nervös bin',
      },
      {
        type: 'scale',
        text: 'Wie gut gelingt es dir, auch unter Druck ruhig und souverän zu bleiben?',
        low: 'Kaum — Druck macht mich blockiert oder hektisch',
        high: 'Sehr gut — Druck aktiviert mich, ich bleibe klar',
      },
    ],
  },

  {
    id: 'charisma',
    name: 'Charisma',
    icon: '✨',
    color: '#10B981',
    masterclass: 'fuehrung',
    outcome: {
      headline: 'Werde die Person, der man gerne folgt',
      text: 'Charisma ist erlernbar — und der stärkste Karrierebeschleuniger. Wer andere begeistert, bekommt Projekte, Verantwortung und Führungsrollen angeboten.',
    },
    intro: {
      was: 'Charisma ist die Fähigkeit, andere zu begeistern, zu inspirieren und eine echte Verbindung herzustellen — durch Authentizität, Präsenz und Überzeugungskraft.',
      warum: 'Charismatische Menschen werden für Führungsrollen in Betracht gezogen, bekommen bessere Netzwerke und schaffen es, ihre Ideen durchzusetzen — auch ohne formale Macht.',
      schwaechen: [
        'In Gruppen wenig Wirkung erzeugen',
        'Geschichten erzählen, die nicht fesseln',
        'Keine klare "Energie" ausstrahlen — neutral statt magnetisch',
      ],
    },
    fragen: [
      {
        type: 'scenario',
        text: 'Du willst deine Kommilitonen für deine Projektidee begeistern. Was tust du?',
        options: [
          { text: 'Erzähle eine Geschichte, die zeigt, warum es mich fasziniert', score: 10, emoji: '🔥' },
          { text: 'Erkläre klar die Vorteile mit Daten und Fakten', score: 7, emoji: '📊' },
          { text: 'Präsentiere die Idee sachlich und hoffe auf Zustimmung', score: 4, emoji: '📋' },
          { text: 'Schicke eine E-Mail mit den Infos', score: 1, emoji: '📧' },
        ],
      },
      {
        type: 'scenario',
        text: 'Wie reagieren Menschen normalerweise, wenn du neu in eine Gruppe kommst?',
        options: [
          { text: 'Sie kommen auf mich zu und merken sich mich', score: 10, emoji: '🌟' },
          { text: 'Ich werde wahrgenommen und angesprochen', score: 7, emoji: '🙂' },
          { text: 'Es dauert eine Weile, bis ich eine Rolle finde', score: 4, emoji: '⏳' },
          { text: 'Ich gehe oft unter oder wirke unsichtbar', score: 1, emoji: '👻' },
        ],
      },
      {
        type: 'scale',
        text: 'Wie sehr können andere sich von deiner Energie und Begeisterung anstecken lassen?',
        low: 'Kaum — ich wirke eher ruhig und unauffällig',
        high: 'Stark — meine Begeisterung überträgt sich auf andere',
      },
      {
        type: 'scale',
        text: 'Wie gut erinnerst du dich an Menschen — und erinnern sie sich an dich?',
        low: 'Eher schlecht — Gesichter und Namen vergesse ich schnell',
        high: 'Sehr gut — ich merke mir Details und werde auch erinnert',
      },
    ],
  },

  {
    id: 'emotionale_intelligenz',
    name: 'Emotionale Intelligenz',
    icon: '❤️',
    color: '#059669',
    masterclass: 'fuehrung',
    outcome: {
      headline: 'Der stärkste Prädiktor für Karriereerfolg — messbar',
      text: 'EQ schlägt IQ in fast allen Führungs- und Teamkontexten. 90% aller Topperformer haben hohe emotionale Intelligenz.',
    },
    intro: {
      was: 'Emotionale Intelligenz (EQ) ist die Fähigkeit, eigene Emotionen zu erkennen und zu steuern — und die Emotionen anderer zu verstehen und empathisch darauf zu reagieren.',
      warum: 'In Teams und Führungsrollen ist EQ das entscheidende Differenzierungsmerkmal. Fachkompetenz bringt dich rein — EQ bringt dich nach oben.',
      schwaechen: [
        'Reaktiv statt reflektiert reagieren (in Stress, Konflikt)',
        'Nicht merken, wie deine Stimmung andere beeinflusst',
        'Nicht in der Lage sein, andere zu "lesen"',
      ],
    },
    fragen: [
      {
        type: 'scenario',
        text: 'Du merkst, dass dein Teamkollege heute angespannt und zurückgezogen ist. Du:',
        options: [
          { text: 'Frage kurz und aufrichtig, ob alles ok ist', score: 10, emoji: '🫂' },
          { text: 'Gebe ihm Raum und beobachte die Situation', score: 7, emoji: '👁️' },
          { text: 'Mache meine Arbeit und lasse ihn in Ruhe', score: 4, emoji: '🤐' },
          { text: 'Bemerke es kaum — ich bin auf meine Aufgaben fokussiert', score: 1, emoji: '😐' },
        ],
      },
      {
        type: 'scenario',
        text: 'Du bist in einem Konfliktgespräch und merkst, dass du wütend wirst. Du:',
        options: [
          { text: 'Erkenne die Wut, atme kurz durch, antworte dann ruhig', score: 10, emoji: '🧘' },
          { text: 'Versuche ruhig zu bleiben, auch wenn es schwerfällt', score: 7, emoji: '😤' },
          { text: 'Merke, dass ich lauter oder schärfer werde', score: 4, emoji: '😠' },
          { text: 'Verliere die Kontrolle oder ziehe mich komplett zurück', score: 1, emoji: '💥' },
        ],
      },
      {
        type: 'scale',
        text: 'Wie gut erkennst du deine eigenen Emotionen — und weißt, was sie auslöst?',
        low: 'Kaum — ich merke oft erst im Nachhinein, was mich getriggert hat',
        high: 'Sehr gut — ich erkenne meine Emotionen in Echtzeit',
      },
      {
        type: 'scale',
        text: 'Wie gut kannst du dich in andere hineinversetzen, auch wenn du anderer Meinung bist?',
        low: 'Schwer — ich sehe Situationen oft primär aus meiner Perspektive',
        high: 'Sehr gut — ich verstehe andere Perspektiven, auch wenn ich nicht zustimme',
      },
    ],
  },

  {
    id: 'resilienz',
    name: 'Resilienz',
    icon: '🔥',
    color: '#34D399',
    masterclass: 'resilienz',
    outcome: {
      headline: 'Komm nach jedem Rückschlag stärker zurück',
      text: 'Resilienz ist das, was Karrieren langfristig macht oder bricht. Wer nach Niederlagen schnell zurückkommt, gewinnt am Ende.',
    },
    intro: {
      was: 'Resilienz ist die Fähigkeit, Rückschläge, Misserfolge und Stress zu überstehen — und gestärkt daraus hervorzugehen, statt dauerhaft zu leiden.',
      warum: 'Eine Karriere ohne Absagen, Niederlagen und schwierige Phasen gibt es nicht. Wer resilient ist, macht aus Misserfolgen Sprungbretter statt Endstationen.',
      schwaechen: [
        'Eine Absage als Beweis nehmen, dass man nicht gut genug ist',
        'Lange Erholungszeiten nach Stress oder Konflikten',
        'Aufgeben bei ersten Hürden statt Strategie anzupassen',
      ],
    },
    fragen: [
      {
        type: 'scenario',
        text: 'Du bekommst eine Absage für deinen Traumjob, auf den du dich monatelang vorbereitet hast. Du:',
        options: [
          { text: 'Bitte um Feedback, analysiere und bewerbe mich sofort weiter', score: 10, emoji: '💪' },
          { text: 'Bin enttäuscht, fange mich aber nach ein paar Tagen', score: 7, emoji: '📈' },
          { text: 'Zweifle wochenlang an meiner Eignung', score: 4, emoji: '😔' },
          { text: 'Verliere die Motivation mich weiter zu bewerben', score: 1, emoji: '💔' },
        ],
      },
      {
        type: 'scenario',
        text: 'Ein wichtiges Projekt schlägt fehl. Deine Reaktion 2 Wochen später:',
        options: [
          { text: 'Ich habe die Learnings dokumentiert und arbeite am nächsten', score: 10, emoji: '📚' },
          { text: 'Es wurmt mich noch, aber ich mache weiter', score: 7, emoji: '⚡' },
          { text: 'Ich grübele noch oft darüber nach', score: 4, emoji: '💭' },
          { text: 'Es blockiert mich noch immer deutlich', score: 1, emoji: '⚓' },
        ],
      },
      {
        type: 'scale',
        text: 'Wie schnell erholt sich deine Energie und Motivation nach größeren Rückschlägen?',
        low: 'Sehr langsam — Rückschläge hängen lange an mir',
        high: 'Schnell — ich sehe Rückschläge als Teil des Weges',
      },
      {
        type: 'scale',
        text: 'Wie gut kannst du auch in stressigen Phasen (Prüfungen, Deadlines, Konflikte) innerlich ruhig bleiben?',
        low: 'Kaum — Stress überfordert mich oft',
        high: 'Sehr gut — ich bleibe unter Druck handlungsfähig',
      },
    ],
  },
];

// ============================================================
// MASTERCLASS INFO
// ============================================================
export const MASTERCLASS_INFO = {
  selbstwert: {
    name: 'Selbstwert & souveränes Auftreten',
    icon: '🛡️',
    fields: ['selbstwert', 'sicherheit'],
    pitch: 'Lerne, deinen Wert zu kennen, zu kommunizieren und durchzusetzen — in Gehaltsverhandlungen, Interviews und Führungssituationen.',
  },
  produktivitaet: {
    name: 'Prioritäten & Produktivität',
    icon: '🎯',
    fields: ['prioritaeten'],
    pitch: 'Verdopple deine Produktivität durch die richtigen Methoden. Fokus auf das, was wirklich zählt — in Studium und Beruf.',
  },
  karriereplanung: {
    name: 'Karriereplanung & Positionierung',
    icon: '🗺️',
    fields: ['kompetenzbewusstsein', 'selbstreflexion'],
    pitch: 'Entwickle eine klare Karrierestrategie, kenne deinen Marktwert und positioniere dich für die Rollen, die du wirklich willst.',
  },
  kommunikation: {
    name: 'Kommunikation & Präsentation',
    icon: '💬',
    fields: ['kommunikation', 'praesentation'],
    pitch: 'Überzeuge in jeder Situation — im Vorstellungsgespräch, im Meeting, auf der Bühne. Kommunikation ist dein stärkstes Karriere-Werkzeug.',
  },
  sozialkompetenz: {
    name: 'Sozialkompetenz & Netzwerk',
    icon: '🤝',
    fields: ['sozialkompetenz'],
    pitch: 'Baue echte Beziehungen auf, die deine Karriere voranbringen. 85% aller Jobs kommen über Netzwerke — lerne, wie das geht.',
  },
  resilienz: {
    name: 'Resilienz & Selbstfürsorge',
    icon: '🔥',
    fields: ['resilienz', 'selbstfuersorge'],
    pitch: 'Werde unschlagbar. Lerne, nach Rückschlägen schneller zurückzukommen und langfristig auf Höchstleistung zu bleiben.',
  },
  fuehrung: {
    name: 'Führung & Emotionale Intelligenz',
    icon: '✨',
    fields: ['charisma', 'emotionale_intelligenz'],
    pitch: 'Werde zur Führungspersönlichkeit. Emotionale Intelligenz und Charisma sind die Unterschiede zwischen Leistungsträgern und Führungskräften.',
  },
};

// ============================================================
// SCORE UTILITIES
// Max score per field: 30 (2 scenarios × 10 + 2 scale × 5)
// ============================================================
export function scoreToPercent(rawScore) {
  return Math.round(Math.min(100, Math.max(0, (rawScore / 30) * 100)));
}

export function getScoreLevel(percent) {
  if (percent >= 85) return { label: 'Exzellent', color: '#059669', badge: '🏆' };
  if (percent >= 65) return { label: 'Stark', color: '#10B981', badge: '💪' };
  if (percent >= 45) return { label: 'Gut aufgestellt', color: '#F59E0B', badge: '👍' };
  if (percent >= 25) return { label: 'Ausbaufähig', color: '#F97316', badge: '📈' };
  return { label: 'Großes Potenzial', color: '#EF4444', badge: '🌱' };
}

// Returns the recommended masterclass based on lowest-scoring fields
export function getRecommendedMasterclass(fieldScores) {
  const FIELD_TO_MC = {};
  KOMPETENZFELDER.forEach(f => { FIELD_TO_MC[f.id] = f.masterclass; });

  const sorted = Object.entries(fieldScores)
    .sort(([, a], [, b]) => a - b);

  const mcCounts = {};
  sorted.slice(0, 4).forEach(([fieldId]) => {
    const mc = FIELD_TO_MC[fieldId];
    if (mc) mcCounts[mc] = (mcCounts[mc] || 0) + 1;
  });

  const topMc = Object.entries(mcCounts).sort(([, a], [, b]) => b - a)[0]?.[0];
  return topMc || 'selbstwert';
}
