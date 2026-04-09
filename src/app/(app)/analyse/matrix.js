// ============================================================
// KARRIERE-ANALYSE MATRIX v2
// 12 Kompetenzfelder × 4 Fragen (2 Szenario + 2 Selbsteinschätzung)
// Jedes Feld mapped auf eine Masterclass + konkreten Outcome
// ============================================================

export const KOMPETENZFELDER = [

  // ──────────────────────────────────────────────
  // 1. PRIORITÄTENMANAGEMENT
  // ──────────────────────────────────────────────
  {
    id: 'prioritaeten',
    name: 'Prioritätenmanagement',
    icon: '🎯',
    color: '#CC1426',
    masterclass: 'sem-prioritaeten',

    outcome: {
      headline: 'Wer Prioritäten setzt, verdient mehr.',
      text: 'Menschen mit starkem Prioritätenmanagement werden schneller befördert — weil sie Ergebnisse liefern, nicht nur beschäftigt sind. Studien zeigen: effiziente Selbstorganisation ist der stärkste Prediktor für Gehaltserhöhungen im ersten Job.',
    },

    intro: {
      was: 'Prioritätenmanagement ist die Fähigkeit, in einer Welt voller Ablenkungen das Wesentliche vom Unwichtigen zu trennen — und die eigene Zeit bewusst einzusetzen.',
      warum: 'In der heutigen Arbeitswelt ist nicht derjenige erfolgreich, der am meisten macht — sondern derjenige, der das Richtige macht. Gute Prioritätensetzung schützt vor Überlastung und sorgt dafür, dass du für das stehst, was wirklich zählt.',
      schwaechen: [
        'Alle Aufgaben fühlen sich gleich dringend an',
        'Die Aufgabenliste wächst, statt kürzer zu werden',
        'Du sagst selten Nein — und verlierst dich in Kleinigkeiten',
      ],
    },

    fragen: [
      {
        type: 'scenario',
        frage: 'Montag, 9 Uhr: Du hast 12 ungelesene E-Mails, 2 Meeting-Anfragen und ein dringendes Projekt mit Deadline heute. Was tust du zuerst?',
        optionen: [
          { text: 'Projekt zuerst — Wichtiges schlägt Dringendes', score: 10, emoji: '🎯' },
          { text: 'Ich scanne kurz die E-Mails, dann das Projekt', score: 7, emoji: '📋' },
          { text: 'Ich beantworte erst alle E-Mails, dann das Projekt', score: 4, emoji: '📧' },
          { text: 'Ich weiß nicht wo anfangen und verliere Zeit', score: 1, emoji: '😵' },
        ],
      },
      {
        type: 'scenario',
        frage: 'Dein Chef gibt dir eine neue Aufgabe, obwohl du bereits am Limit bist. Was passiert?',
        optionen: [
          { text: 'Ich kommuniziere klar was realistisch ist und schlage Prioritäten vor', score: 10, emoji: '💬' },
          { text: 'Ich nehme es an und reorganisiere meinen Plan', score: 7, emoji: '🔄' },
          { text: 'Ich nehme es an — auch wenn es Überstunden bedeutet', score: 4, emoji: '😓' },
          { text: 'Ich sage ja und hoffe, dass es irgendwie klappt', score: 1, emoji: '🤞' },
        ],
      },
      {
        type: 'scale',
        frage: 'Wie oft beendest du den Tag mit dem Gefühl, wirklich das Wichtigste geschafft zu haben?',
        low: 'Fast nie',
        high: 'Fast immer',
      },
      {
        type: 'scale',
        frage: 'Wie leicht fällt es dir, Aufgaben abzulehnen oder zu delegieren, die nicht deine Priorität sind?',
        low: 'Sehr schwer',
        high: 'Sehr leicht',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 2. SELBSTWERTGEFÜHL
  // ──────────────────────────────────────────────
  {
    id: 'selbstwert',
    name: 'Selbstwertgefühl',
    icon: '🛡️',
    color: '#E63946',
    masterclass: 'sem-motivation',

    outcome: {
      headline: 'Wer seinen Wert kennt, verhandelt besser.',
      text: 'Menschen mit hohem Selbstwertgefühl verhandeln ihr Einstiegsgehalt im Schnitt 12% höher — und werden seltener in Jobs gefangen, die nicht zu ihnen passen. Dein Selbstwert ist die Grundlage jeder Karriereentscheidung.',
    },

    intro: {
      was: 'Selbstwertgefühl ist die innere Überzeugung, dass du wertvoll bist — unabhängig von äußerer Bestätigung. Es beeinflusst, wie du auftrittst, wie du kommunizierst und welche Chancen du dir zutraust.',
      warum: 'Im Berufsleben zeigt sich Selbstwert in jeder Gehaltsverhandlung, jedem Vorstellungsgespräch und jeder Situation, in der du für dich einstehen musst. Wer sich nicht selbst als wertvoll wahrnimmt, wird es anderen schwer machen, ihn so zu behandeln.',
      schwaechen: [
        'Kritik trifft dich tief und beschäftigt dich lange',
        'Du tust dich schwer damit, deine Stärken klar zu benennen',
        'Du bleibst lieber unter dem Radar als Aufmerksamkeit zu riskieren',
      ],
    },

    fragen: [
      {
        type: 'scenario',
        frage: 'Du sollst in einem Bewerbungsgespräch deine drei größten Stärken nennen. Wie reagierst du?',
        optionen: [
          { text: 'Ich habe eine klare Antwort — ich kenne meine Stärken genau', score: 10, emoji: '💪' },
          { text: 'Ich brauche einen Moment, finde aber überzeugende Punkte', score: 7, emoji: '📝' },
          { text: 'Ich bin unsicher was wirklich meine Stärken sind', score: 4, emoji: '🤷' },
          { text: 'Mir fiele es leichter, Schwächen aufzuzählen', score: 1, emoji: '😕' },
        ],
      },
      {
        type: 'scenario',
        frage: 'Ein Kollege kritisiert deine Arbeit vor dem gesamten Team. Was passiert in dir?',
        optionen: [
          { text: 'Ich nehme es sachlich auf und antworte souverän', score: 10, emoji: '😌' },
          { text: 'Es trifft mich kurz, aber ich fange mich schnell', score: 7, emoji: '🤔' },
          { text: 'Ich grüble den Rest des Tages darüber', score: 4, emoji: '😔' },
          { text: 'Ich zweifle danach an meiner gesamten Kompetenz', score: 1, emoji: '😢' },
        ],
      },
      {
        type: 'scale',
        frage: 'Wie sicher bist du dir, in einem Vorstellungsgespräch deinen Wert klar und überzeugend zu kommunizieren?',
        low: 'Sehr unsicher',
        high: 'Sehr sicher',
      },
      {
        type: 'scale',
        frage: 'Wie oft nimmst du dir, was dir zusteht — zum Beispiel bei Gehaltsverhandlungen oder Beförderungen?',
        low: 'Fast nie',
        high: 'Fast immer',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 3. KOMPETENZBEWUSSTSEIN
  // ──────────────────────────────────────────────
  {
    id: 'kompetenzbewusstsein',
    name: 'Kompetenzbewusstsein',
    icon: '💎',
    color: '#7C3AED',
    masterclass: 'sem-knigge',

    outcome: {
      headline: 'Wer seine Stärken kennt, bekommt bessere Angebote.',
      text: 'Bewerber die ihre Soft Skills konkret benennen und belegen können, erhalten in Auswahlprozessen doppelt so häufig ein Angebot. Unternehmen stellen heute primär nach Persönlichkeit ein — und erst dann nach Fachkompetenz.',
    },

    intro: {
      was: 'Kompetenzbewusstsein bedeutet, ein klares Bild der eigenen Fähigkeiten, Stärken und Entwicklungsfelder zu haben — und diese nach außen kommunizieren zu können.',
      warum: 'Der Arbeitsmarkt verändert sich rasant. Fachkenntnisse veralten, aber wer seine übertragbaren Kompetenzen kennt, bleibt dauerhaft attraktiv. Wer sich selbst nicht vermarkten kann, überlässt anderen die Deutungshoheit über seinen Wert.',
      schwaechen: [
        'Du weißt nicht genau, was dich von anderen unterscheidet',
        'Im Gespräch fällt es dir schwer, Beispiele für deine Stärken zu nennen',
        'Du unterschätzt dich häufig im Vergleich zu anderen',
      ],
    },

    fragen: [
      {
        type: 'scenario',
        frage: 'Bei einem Networking-Event fragt dich jemand: "Was machst du besonders gut?" Deine Reaktion:',
        optionen: [
          { text: 'Ich habe einen klaren Elevator Pitch parat', score: 10, emoji: '🎯' },
          { text: 'Ich erzähle frei — es kommen gute Punkte', score: 7, emoji: '🗣️' },
          { text: 'Ich werde verlegen und halte mich bedeckt', score: 4, emoji: '😳' },
          { text: 'Ich wechsle schnell das Thema', score: 1, emoji: '😅' },
        ],
      },
      {
        type: 'scenario',
        frage: 'Du bewirbst dich auf eine Stelle, für die du 80% der Anforderungen erfüllst. Was denkst du?',
        optionen: [
          { text: 'Die 20% lerne ich schnell — ich bewerbe mich', score: 10, emoji: '🚀' },
          { text: 'Ich bewerbe mich, aber mit gemischten Gefühlen', score: 7, emoji: '🤞' },
          { text: 'Ich warte auf eine Stelle wo ich 100% erfülle', score: 4, emoji: '⏳' },
          { text: 'Ich bin sicher, dass sie jemand Besseres finden', score: 1, emoji: '😞' },
        ],
      },
      {
        type: 'scale',
        frage: 'Wie klar ist dir, welche deiner Fähigkeiten auf dem Arbeitsmarkt besonders gefragt sind?',
        low: 'Sehr unklar',
        high: 'Sehr klar',
      },
      {
        type: 'scale',
        frage: 'Wie gut kannst du konkrete Beispiele aus der Vergangenheit nennen, die deine Stärken belegen?',
        low: 'Kaum möglich',
        high: 'Sehr gut',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 4. SOZIALKOMPETENZ
  // ──────────────────────────────────────────────
  {
    id: 'sozialkompetenz',
    name: 'Sozialkompetenz',
    icon: '🤝',
    color: '#2563EB',
    masterclass: 'sem-networking',

    outcome: {
      headline: '70% aller Jobs werden über Netzwerk besetzt.',
      text: 'Nicht über Jobportale — über persönliche Empfehlungen. Sozialkompetenz entscheidet, ob du Teil dieser Netzwerke wirst. Wer Menschen für sich gewinnen kann, öffnet Türen die auf dem Papier verschlossen scheinen.',
    },

    intro: {
      was: 'Sozialkompetenz umfasst die Fähigkeit, echte Verbindungen zu anderen Menschen aufzubauen — mit Empathie, Interesse und dem Gespür für das, was andere brauchen.',
      warum: 'In einer digitalisierten Welt wird menschliche Verbindung zum Wettbewerbsvorteil. Menschen kaufen von, arbeiten mit und fördern Menschen, denen sie vertrauen. Sozialkompetenz ist das Fundament von Karrierenetzwerken.',
      schwaechen: [
        'Smalltalk fällt dir schwer und fühlt sich unecht an',
        'Du erinnerst dich schlecht an Details aus Gesprächen',
        'Kontakte zu halten liegt dir nicht — du meldest dich selten',
      ],
    },

    fragen: [
      {
        type: 'scenario',
        frage: 'Du kommst neu in ein Team. In der ersten Woche gibt es einen Konflikt zwischen zwei Kollegen. Was tust du?',
        optionen: [
          { text: 'Ich höre beiden Seiten zu und versuche zu vermitteln', score: 10, emoji: '🤝' },
          { text: 'Ich beobachte erstmal und halte mich raus', score: 7, emoji: '👀' },
          { text: 'Ich schlage mich auf die Seite, die mir sympathischer ist', score: 4, emoji: '⚖️' },
          { text: 'Konflikte machen mich nervös — ich vermeide jede Berührung', score: 1, emoji: '😰' },
        ],
      },
      {
        type: 'scenario',
        frage: 'Nach einem Branchenevent hast du 5 interessante Visitenkarten. Was passiert in den nächsten 48h?',
        optionen: [
          { text: 'Ich schreibe jedem eine persönliche Nachricht mit einem konkreten Anknüpfungspunkt', score: 10, emoji: '✉️' },
          { text: 'Ich vernetze mich auf LinkedIn mit ihnen', score: 7, emoji: '💼' },
          { text: 'Die Karten liegen auf meinem Schreibtisch — ich melde mich irgendwann', score: 4, emoji: '📌' },
          { text: 'Ich melde mich nicht — ich weiß nicht was ich schreiben soll', score: 1, emoji: '😶' },
        ],
      },
      {
        type: 'scale',
        frage: 'Wie leicht fällt es dir, auf fremde Menschen zuzugehen und ein echtes Gespräch zu starten?',
        low: 'Sehr schwer',
        high: 'Sehr leicht',
      },
      {
        type: 'scale',
        frage: 'Wie aktiv pflegst du dein berufliches Netzwerk — auch wenn du gerade nichts brauchst?',
        low: 'Gar nicht',
        high: 'Sehr aktiv',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 5. PRÄSENTATIONSKOMPETENZ
  // ──────────────────────────────────────────────
  {
    id: 'praesentation',
    name: 'Präsentationskompetenz',
    icon: '🎤',
    color: '#1D4ED8',
    masterclass: 'sem-rhetorik',

    outcome: {
      headline: 'Wer überzeugend präsentiert, steigt schneller auf.',
      text: 'Menschen die klar und wirkungsvoll präsentieren, werden 3x häufiger für Führungspositionen vorgeschlagen — selbst wenn ihre fachliche Leistung vergleichbar ist. Sichtbarkeit schlägt stille Exzellenz.',
    },

    intro: {
      was: 'Präsentationskompetenz ist mehr als Vorträge halten — es ist die Fähigkeit, Ideen so zu vermitteln, dass andere ihnen folgen wollen. Das umfasst Sprache, Körpersprache und die Struktur des Gesagten.',
      warum: 'Wer nicht gesehen wird, wird nicht gefördert. In Meetings, Präsentationen und Vorstellungsgesprächen entscheiden oft die ersten 90 Sekunden, wie jemand wahrgenommen wird. Präsentationskompetenz ist deine direkteste Verbindung zu Karrierechancen.',
      schwaechen: [
        'Du wirst nervös wenn alle Augen auf dich gerichtet sind',
        'Deine Hauptpunkte gehen in zu vielen Details unter',
        'Du vermeidest es, im Meeting das Wort zu ergreifen',
      ],
    },

    fragen: [
      {
        type: 'scenario',
        frage: 'Dein Chef bittet dich spontan, in 10 Minuten ein Update vor dem gesamten Team zu geben. Deine Reaktion:',
        optionen: [
          { text: 'Ich bin vorbereitet — kein Problem', score: 10, emoji: '😎' },
          { text: 'Nervös, aber ich zieh\'s durch', score: 7, emoji: '💪' },
          { text: 'Ich bitte um mehr Zeit zur Vorbereitung', score: 4, emoji: '⏰' },
          { text: 'Ich versuche jemand anderen vorzuschicken', score: 1, emoji: '😬' },
        ],
      },
      {
        type: 'scenario',
        frage: 'Mitten in deiner Präsentation stellt jemand eine kritische Frage, auf die du keine Antwort weißt. Was tust du?',
        optionen: [
          { text: 'Ich gebe es offen zu und sage, dass ich nachfasse', score: 10, emoji: '🎯' },
          { text: 'Ich umschreibe die Frage und antworte was ich kann', score: 7, emoji: '🗣️' },
          { text: 'Ich werde unsicher und verliere den Faden', score: 4, emoji: '😳' },
          { text: 'Ich verheddere mich in einer Antwort, die niemanden überzeugt', score: 1, emoji: '😰' },
        ],
      },
      {
        type: 'scale',
        frage: 'Wie wohl fühlst du dich, wenn du vor einer Gruppe sprechen musst?',
        low: 'Sehr unwohl',
        high: 'Sehr wohl',
      },
      {
        type: 'scale',
        frage: 'Wie oft ergreifst du in Meetings aktiv das Wort, um deine Perspektive einzubringen?',
        low: 'Fast nie',
        high: 'Fast immer',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 6. SELBSTFÜRSORGE
  // ──────────────────────────────────────────────
  {
    id: 'selbstfuersorge',
    name: 'Selbstfürsorge',
    icon: '🧘',
    color: '#A78BFA',
    masterclass: 'sem-achtsamkeit',

    outcome: {
      headline: 'Burnout kostet durchschnittlich 6 Monate Karrierezeit.',
      text: 'Selbstfürsorge ist keine Schwäche — sie ist deine Versicherung gegen Erschöpfung. Wer langfristig Höchstleistung bringen will, muss lernen, sich selbst als Ressource zu behandeln die Pflege braucht.',
    },

    intro: {
      was: 'Selbstfürsorge bedeutet, die eigenen körperlichen und mentalen Bedürfnisse ernst zu nehmen — und aktiv dafür zu sorgen, dass man dauerhaft leistungsfähig bleibt.',
      warum: 'Der erste Job, das Studium, der Berufseinstieg — diese Phasen sind intensiv. Wer nicht lernt, sich zu regenerieren, läuft auf Reserve. Und wer dauerhaft auf Reserve läuft, trifft schlechtere Entscheidungen, kommuniziert schlechter und wird schlechter wahrgenommen.',
      schwaechen: [
        'Du vernachlässigst Erholung wenn viel zu tun ist',
        'Du weißt kaum mehr, wann du das letzte Mal wirklich abgeschaltet hast',
        'Pausen fühlen sich wie Zeitverschwendung an',
      ],
    },

    fragen: [
      {
        type: 'scenario',
        frage: 'Es ist 22 Uhr, du arbeitest seit 12 Stunden und bist erschöpft. Morgen früh ist ein wichtiges Meeting. Was tust du?',
        optionen: [
          { text: 'Ich höre auf — ausgeruht bin ich morgen besser', score: 10, emoji: '😴' },
          { text: 'Ich mache noch 30 Minuten, dann Schluss', score: 7, emoji: '⏰' },
          { text: 'Ich mache weiter bis alles erledigt ist', score: 4, emoji: '😓' },
          { text: 'Ich arbeite die ganze Nacht durch', score: 1, emoji: '🥱' },
        ],
      },
      {
        type: 'scenario',
        frage: 'Du merkst, dass du seit Wochen kaum Zeit für Dinge hattest, die dir Kraft geben (Sport, Freunde, Hobbys). Was passiert?',
        optionen: [
          { text: 'Ich schütze diese Zeit bewusst — sie ist nicht verhandelbar', score: 10, emoji: '🛡️' },
          { text: 'Ich versuche es, aber es rutscht manchmal hinten runter', score: 7, emoji: '🔄' },
          { text: 'Arbeit geht vor — private Zeit ist Luxus', score: 4, emoji: '💼' },
          { text: 'Ich merke es kaum noch — ich bin im Überlebensmodus', score: 1, emoji: '😵' },
        ],
      },
      {
        type: 'scale',
        frage: 'Wie gut gelingt es dir, nach der Arbeit wirklich abzuschalten und dich zu erholen?',
        low: 'Gar nicht',
        high: 'Sehr gut',
      },
      {
        type: 'scale',
        frage: 'Wie bewusst achtest du auf deine körperliche und mentale Gesundheit im Alltag?',
        low: 'Kaum',
        high: 'Sehr bewusst',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 7. SELBSTREFLEXION
  // ──────────────────────────────────────────────
  {
    id: 'selbstreflexion',
    name: 'Selbstreflexion',
    icon: '🪞',
    color: '#8B5CF6',
    masterclass: 'insights-mdi',

    outcome: {
      headline: 'Wer sich selbst kennt, trifft bessere Karriereentscheidungen.',
      text: 'Selbstreflexion ist der stärkste Schutz gegen falsche Karrierewege. Menschen die regelmäßig reflektieren, wechseln seltener den Job aus falschen Gründen — und bereuen ihre Entscheidungen deutlich weniger.',
    },

    intro: {
      was: 'Selbstreflexion ist die Fähigkeit, das eigene Denken, Handeln und Fühlen zu beobachten und daraus zu lernen. Es geht darum, ehrlich mit sich selbst zu sein — auch wenn es unbequem ist.',
      warum: 'Wer sich nicht reflektiert, wiederholt seine Fehler. Im Berufsleben bedeutet das: immer wieder in die gleichen Fallen tappen, die gleichen Konflikte haben, die gleichen Chancen verpassen. Selbstreflexion ist die Abkürzung zur persönlichen Weiterentwicklung.',
      schwaechen: [
        'Du analysierst Situationen kaum, sondern machst einfach weiter',
        'Feedback nimmst du an, aber du weißt selten was du damit machst',
        'Du bist oft überrascht, wie andere dich wahrnehmen',
      ],
    },

    fragen: [
      {
        type: 'scenario',
        frage: 'Ein Projekt ist gescheitert. Dein Anteil daran war nicht klein. Was tust du danach?',
        optionen: [
          { text: 'Ich analysiere konkret was ich anders machen würde und notiere es', score: 10, emoji: '📊' },
          { text: 'Ich denke kurz darüber nach und ziehe Schlüsse', score: 7, emoji: '🤔' },
          { text: 'Ich ärgere mich und mache dann weiter wie bisher', score: 4, emoji: '😤' },
          { text: 'Ich schiebe die Verantwortung auf andere Faktoren', score: 1, emoji: '👉' },
        ],
      },
      {
        type: 'scenario',
        frage: 'Du bekommst Feedback, das dich überrascht — andere nehmen dich anders wahr als du dich selbst. Deine Reaktion:',
        optionen: [
          { text: 'Ich nehme es als wertvolle Information und hinterfrage mein Bild', score: 10, emoji: '🪞' },
          { text: 'Ich bin kurz überrascht, aber ich nehme es mit', score: 7, emoji: '🤷' },
          { text: 'Ich finde Gründe warum das Feedback nicht stimmt', score: 4, emoji: '🙅' },
          { text: 'Ich nehme es persönlich und bin lange beschäftigt damit', score: 1, emoji: '😔' },
        ],
      },
      {
        type: 'scale',
        frage: 'Wie regelmäßig nimmst du dir Zeit, dein eigenes Verhalten und deine Entscheidungen zu reflektieren?',
        low: 'Fast nie',
        high: 'Regelmäßig',
      },
      {
        type: 'scale',
        frage: 'Wie klar ist dir, warum du in bestimmten Situationen so reagierst wie du reagierst?',
        low: 'Kaum klar',
        high: 'Sehr klar',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 8. SICHERHEITSBEDÜRFNIS
  // ──────────────────────────────────────────────
  {
    id: 'sicherheit',
    name: 'Sicherheitsbedürfnis',
    icon: '🔓',
    color: '#059669',
    masterclass: 'sem-motivation',

    outcome: {
      headline: 'Wer seine Komfortzone verlässt, erschließt mehr Chancen.',
      text: 'Die meisten großen Karrierechancen liegen außerhalb der Komfortzone. Ein zu hohes Sicherheitsbedürfnis kostet im Durchschnitt 2-3 relevante Karriereschritte — weil man Chancen nicht ergreift, die ein Risiko bedeuten.',
    },

    intro: {
      was: 'Sicherheitsbedürfnis beschreibt, wie stark das Verlangen nach Stabilität und Kontrolle das eigene Handeln beeinflusst. Ein gewisses Maß ist gesund — zu viel wird zur Bremse.',
      warum: 'Karriere bedeutet Veränderung. Neue Jobs, neue Teams, neue Herausforderungen — wer bei jeder Unsicherheit bremst, gibt anderen den Vortritt. Das Sicherheitsbedürfnis ist oft der unsichtbarste, aber wirkungsvollste Karrierebremse.',
      schwaechen: [
        'Du zögerst bei Entscheidungen sehr lange, um ja keinen Fehler zu machen',
        'Veränderungen — auch positive — lösen bei dir Unruhe aus',
        'Du nimmst lieber das Bekannte als das Bessere',
      ],
    },

    fragen: [
      {
        type: 'scenario',
        frage: 'Du bekommst ein Jobangebot mit 25% mehr Gehalt — aber in einem neuen Unternehmen und einer neuen Stadt. Was denkst du zuerst?',
        optionen: [
          { text: 'Spannend — ich prüfe es ernsthaft', score: 10, emoji: '🚀' },
          { text: 'Interessant, aber ich denke lange darüber nach', score: 7, emoji: '⚖️' },
          { text: 'Zu viel Unbekanntes — ich bleibe lieber', score: 4, emoji: '🏠' },
          { text: 'Ich sage sofort ab — das ist mir zu riskant', score: 1, emoji: '❌' },
        ],
      },
      {
        type: 'scenario',
        frage: 'Im Meeting könntest du eine unkonventionelle Idee einbringen, die vielleicht auf Widerstand stößt. Was tust du?',
        optionen: [
          { text: 'Ich bringe sie ein — gute Ideen brauchen Raum', score: 10, emoji: '💡' },
          { text: 'Ich bringe sie ein, aber mit vielen Einschränkungen', score: 7, emoji: '🗣️' },
          { text: 'Ich warte ob jemand anderes etwas Ähnliches sagt', score: 4, emoji: '👀' },
          { text: 'Ich behalte sie für mich — zu riskant', score: 1, emoji: '🤐' },
        ],
      },
      {
        type: 'scale',
        frage: 'Wie wohl fühlst du dich in unsicheren Situationen, in denen der Ausgang unklar ist?',
        low: 'Sehr unwohl',
        high: 'Sehr wohl',
      },
      {
        type: 'scale',
        frage: 'Wie oft hast du in letzter Zeit etwas getan, das außerhalb deiner Komfortzone lag?',
        low: 'Fast nie',
        high: 'Regelmäßig',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 9. CHARISMA
  // ──────────────────────────────────────────────
  {
    id: 'charisma',
    name: 'Charisma',
    icon: '✨',
    color: '#D97706',
    masterclass: 'sem-rhetorik',

    outcome: {
      headline: 'Führungskräfte mit hohem Charisma verdienen Ø 35% mehr.',
      text: 'Charisma ist keine Charaktereigenschaft — es ist eine Fähigkeit. Menschen die andere begeistern und mitreißen können, werden schneller in Führung gebracht. Charisma ist das, was Kompetenz sichtbar macht.',
    },

    intro: {
      was: 'Charisma ist die Fähigkeit, andere Menschen anzuziehen, zu inspirieren und zu bewegen — durch Authentizität, Energie und die Art wie man präsent ist.',
      warum: 'In einer Welt in der viele Menschen ähnlich qualifiziert sind, ist Charisma der entscheidende Unterschied. Charismatische Menschen werden bevorzugt eingestellt, schneller befördert und von anderen eher unterstützt.',
      schwaechen: [
        'Du wirkst in Gruppen eher zurückhaltend und unsichtbar',
        'Es fällt dir schwer, Begeisterung zu wecken — auch wenn du selbst begeistert bist',
        'In 1:1-Gesprächen fühlst du dich wohler als vor Gruppen',
      ],
    },

    fragen: [
      {
        type: 'scenario',
        frage: 'Du betrittst einen Raum mit 20 dir unbekannten Menschen. Was passiert in den nächsten 5 Minuten?',
        optionen: [
          { text: 'Ich gehe auf Menschen zu, stelle mich vor und starte Gespräche', score: 10, emoji: '😄' },
          { text: 'Ich halte Ausschau nach jemandem der alleine steht', score: 7, emoji: '👋' },
          { text: 'Ich warte bis jemand auf mich zukommt', score: 4, emoji: '🧍' },
          { text: 'Ich halte mich am Rand und mache mich möglichst unsichtbar', score: 1, emoji: '🫥' },
        ],
      },
      {
        type: 'scenario',
        frage: 'Du willst dein Team für eine neue Idee begeistern, die mit extra Arbeit verbunden ist. Wie gehst du vor?',
        optionen: [
          { text: 'Ich präsentiere die Vision so, dass alle das Warum verstehen und spüren', score: 10, emoji: '🔥' },
          { text: 'Ich erkläre die Vorteile sachlich und hoffe auf Zustimmung', score: 7, emoji: '📊' },
          { text: 'Ich bitte darum und betone wie wichtig es ist', score: 4, emoji: '🙏' },
          { text: 'Ich sage einfach was getan werden muss', score: 1, emoji: '📋' },
        ],
      },
      {
        type: 'scale',
        frage: 'Wie oft haben dir Menschen gesagt, dass du inspirierend oder motivierend wirkst?',
        low: 'Fast nie',
        high: 'Sehr oft',
      },
      {
        type: 'scale',
        frage: 'Wie stark bist du in der Lage, andere für deine Ideen zu begeistern?',
        low: 'Kaum',
        high: 'Sehr stark',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 10. EMOTIONALE INTELLIGENZ
  // ──────────────────────────────────────────────
  {
    id: 'emotionale_intelligenz',
    name: 'Emotionale Intelligenz',
    icon: '❤️',
    color: '#DC2626',
    masterclass: 'insights-mdi',

    outcome: {
      headline: 'EQ schlägt IQ beim beruflichen Aufstieg.',
      text: 'Laut Harvard-Studien ist emotionale Intelligenz für 85% des beruflichen Erfolgs verantwortlich — und nur 15% für IQ und Fachwissen. Wer Emotionen — eigene und fremde — versteht, führt besser, verhandelt besser und baut stärkere Teams.',
    },

    intro: {
      was: 'Emotionale Intelligenz ist die Fähigkeit, eigene Emotionen wahrzunehmen, zu verstehen und zu steuern — und die Emotionen anderer zu erkennen und darauf einzugehen.',
      warum: 'Konflikte, Führung, Teamarbeit — fast jede berufliche Herausforderung hat eine emotionale Dimension. Wer emotional intelligent ist, navigiert diese Situationen souverän. Wer es nicht ist, eskaliert, verletzt oder wird verletzt — ohne es zu verstehen.',
      schwaechen: [
        'Du reagierst in stressigen Situationen schnell emotional oder impulsiv',
        'Es fällt dir schwer zu erkennen, wie es anderen gerade geht',
        'Konflikte löst du eher durch Rückzug als durch Aussprache',
      ],
    },

    fragen: [
      {
        type: 'scenario',
        frage: 'Ein Kollege ist seit Tagen merklich gereizt und kurz angebunden. Was tust du?',
        optionen: [
          { text: 'Ich spreche ihn behutsam an und frage ob alles okay ist', score: 10, emoji: '❤️' },
          { text: 'Ich gebe ihm Raum und bin besonders rücksichtsvoll', score: 7, emoji: '🤲' },
          { text: 'Ich halte Abstand und warte bis es sich legt', score: 4, emoji: '🚶' },
          { text: 'Ich nehme es persönlich und reagiere ebenfalls gereizt', score: 1, emoji: '😤' },
        ],
      },
      {
        type: 'scenario',
        frage: 'Mitten in einer wichtigen Verhandlung merkst du, dass du aufsteigend frustriert wirst. Was passiert?',
        optionen: [
          { text: 'Ich erkenne es und nehme mir innerlich kurz Abstand', score: 10, emoji: '🧘' },
          { text: 'Ich merke es, aber es beeinflusst mich trotzdem', score: 7, emoji: '😐' },
          { text: 'Meine Frustration wird sichtbar ohne dass ich es will', score: 4, emoji: '😠' },
          { text: 'Ich verliere die Kontrolle über meinen Ton', score: 1, emoji: '😡' },
        ],
      },
      {
        type: 'scale',
        frage: 'Wie gut kannst du deine eigenen Emotionen in stressigen Situationen regulieren?',
        low: 'Kaum',
        high: 'Sehr gut',
      },
      {
        type: 'scale',
        frage: 'Wie gut erkennst du, wie es anderen Menschen in einem Gespräch wirklich geht?',
        low: 'Kaum',
        high: 'Sehr gut',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 11. KOMMUNIKATIONSKOMPETENZ
  // ──────────────────────────────────────────────
  {
    id: 'kommunikation',
    name: 'Kommunikationskompetenz',
    icon: '💬',
    color: '#0891B2',
    masterclass: 'sem-kommunikation',

    outcome: {
      headline: 'Klare Kommunikation = schnellere Beförderung.',
      text: 'In 84% aller Führungsentscheidungen ist Kommunikationsfähigkeit das Zünglein an der Waage. Wer klar, direkt und empfängerorientiert kommuniziert, spart Zeit, vermeidet Konflikte — und wird als kompetenter wahrgenommen.',
    },

    intro: {
      was: 'Kommunikationskompetenz ist die Fähigkeit, Informationen, Ideen und Erwartungen so zu vermitteln, dass sie beim Gegenüber ankommen — verständlich, respektvoll und wirkungsvoll.',
      warum: 'Missverständnisse kosten Unternehmen Milliarden und Karrieren kosten sie noch mehr. Wer kommuniziert, dass er weiß was er will und sagen kann was er meint, wird als kompetent und führungsfähig eingestuft — unabhängig vom Titel.',
      schwaechen: [
        'Du schweifst aus oder verlierst den roten Faden',
        'Du vermeidest unangenehme Gespräche so lange wie möglich',
        'Andere verstehen dich oft anders als du es gemeint hast',
      ],
    },

    fragen: [
      {
        type: 'scenario',
        frage: 'Du merkst, dass ein Kollege seit Wochen Aufgaben nicht erledigt die er dir versprochen hat. Das belastet dein Projekt. Was tust du?',
        optionen: [
          { text: 'Ich spreche es direkt und sachlich an — mit klaren Erwartungen', score: 10, emoji: '💬' },
          { text: 'Ich weise nochmal freundlich darauf hin', score: 7, emoji: '📧' },
          { text: 'Ich erledige es selbst um Konflikt zu vermeiden', score: 4, emoji: '😮‍💨' },
          { text: 'Ich sage nichts und ärgere mich innerlich', score: 1, emoji: '😶' },
        ],
      },
      {
        type: 'scenario',
        frage: 'Du sollst deinem Chef in 2 Minuten erklären warum dein Projekt Verzögerungen hat. Was tust du?',
        optionen: [
          { text: 'Ich erkläre klar: Ursache, Auswirkung, nächster Schritt', score: 10, emoji: '📊' },
          { text: 'Ich erkläre es so gut ich kann — mit einigen Details', score: 7, emoji: '🗣️' },
          { text: 'Ich verliere mich in Erklärungen und Rechtfertigungen', score: 4, emoji: '🌀' },
          { text: 'Ich bin nervös und komme nicht auf den Punkt', score: 1, emoji: '😰' },
        ],
      },
      {
        type: 'scale',
        frage: 'Wie leicht fällt es dir, unangenehme Dinge direkt anzusprechen?',
        low: 'Sehr schwer',
        high: 'Sehr leicht',
      },
      {
        type: 'scale',
        frage: 'Wie klar und strukturiert kommunizierst du, wenn es unter Druck darauf ankommt?',
        low: 'Eher chaotisch',
        high: 'Sehr klar',
      },
    ],
  },

  // ──────────────────────────────────────────────
  // 12. RESILIENZ
  // ──────────────────────────────────────────────
  {
    id: 'resilienz',
    name: 'Resilienz',
    icon: '🔥',
    color: '#34D399',
    masterclass: 'sem-achtsamkeit',

    outcome: {
      headline: 'Resiliente Menschen steigen nach Krisen höher auf.',
      text: 'Rückschläge sind unvermeidlich — wie du damit umgehst, entscheidet über deine Karriere. Resiliente Menschen erholen sich schneller, lernen mehr aus Misserfolgen und werden von Führungskräften als belastbarer und vertrauenswürdiger eingeschätzt.',
    },

    intro: {
      was: 'Resilienz ist die Fähigkeit, nach Rückschlägen, Stress und Veränderungen zurückzufinden — nicht unberührt, aber handlungsfähig. Es ist die mentale Widerstandskraft die entscheidet, ob du wächst oder stagnierst.',
      warum: 'Kein Karriereweg verläuft ohne Rückschläge. Projekte scheitern, Jobs gehen verloren, Pläne ändern sich. Wer resilient ist, nutzt diese Momente als Sprungbrett. Wer es nicht ist, verliert wertvolle Zeit in der Verarbeitung.',
      schwaechen: [
        'Rückschläge beschäftigen dich lange und rauben dir Energie',
        'Unter anhaltendem Stress verlierst du schnell den Überblick',
        'Veränderungen die du nicht kontrollieren kannst, machen dir Angst',
      ],
    },

    fragen: [
      {
        type: 'scenario',
        frage: 'Du hast dich monatelang auf eine Stelle vorbereitet — und wirst trotzdem abgelehnt. Was passiert in dir?',
        optionen: [
          { text: 'Enttäuscht, aber ich analysiere was ich beim nächsten Mal besser mache', score: 10, emoji: '💪' },
          { text: 'Es trifft mich hart, aber nach ein paar Tagen mache ich weiter', score: 7, emoji: '🔄' },
          { text: 'Ich zweifle länger an mir und meinen Chancen', score: 4, emoji: '😔' },
          { text: 'Ich verliere den Glauben daran, dass es noch klappt', score: 1, emoji: '😞' },
        ],
      },
      {
        type: 'scenario',
        frage: 'Dein Projekt wird nach 3 Monaten Arbeit kurzfristig gestoppt — aus Gründen die nichts mit dir zu tun haben. Deine Reaktion:',
        optionen: [
          { text: 'Schade, aber ich fokussiere mich sofort auf das Nächste', score: 10, emoji: '🎯' },
          { text: 'Ich brauche kurz um mich zu sortieren, dann weiter', score: 7, emoji: '🤔' },
          { text: 'Ich bin länger demotiviert und kann schwer loslassen', score: 4, emoji: '😤' },
          { text: 'Ich ziehe mich zurück und verliere die Energie', score: 1, emoji: '🪫' },
        ],
      },
      {
        type: 'scale',
        frage: 'Wie schnell findest du nach einem Rückschlag zurück in deine Energie und Handlungsfähigkeit?',
        low: 'Sehr langsam',
        high: 'Sehr schnell',
      },
      {
        type: 'scale',
        frage: 'Wie gut bleibst du unter anhaltendem Druck und Stress handlungsfähig?',
        low: 'Kaum',
        high: 'Sehr gut',
      },
    ],
  },
];

// ──────────────────────────────────────────────
// MASTERCLASS-MAPPING
// ──────────────────────────────────────────────
export const MASTERCLASS_INFO = {
  'sem-prioritaeten': {
    id: 'sem-prioritaeten',
    title: 'Prioritätenmanagement',
    subtitle: 'Nicht alles gleichzeitig, sondern das Richtige zuerst',
    icon: '🎯',
    pitch: 'Lerne in 4 Stunden, wie du deinen Tag so strukturierst, dass du abends weißt: heute hat es sich gelohnt.',
  },
  'sem-motivation': {
    id: 'sem-motivation',
    title: 'Selbstmotivation',
    subtitle: 'Dein Warum, dein Motor',
    icon: '🔥',
    pitch: 'Verstehe, was dich wirklich antreibt — und wie du diese Energie auch dann abrufst, wenn es zählt.',
  },
  'sem-knigge': {
    id: 'sem-knigge',
    title: 'Business Knigge',
    subtitle: 'Der erste Eindruck zählt, der zweite bleibt',
    icon: '🎩',
    pitch: 'Lerne wie du in jedem beruflichen Kontext professionell und selbstsicher auftrittst.',
  },
  'sem-networking': {
    id: 'sem-networking',
    title: 'Networking',
    subtitle: 'Kontakte knüpfen, Vertrauen aufbauen',
    icon: '🤝',
    pitch: 'Baue ein Netzwerk auf, das dir Türen öffnet — authentisch, nachhaltig und ohne Gefälligkeit.',
  },
  'sem-rhetorik': {
    id: 'sem-rhetorik',
    title: 'Rhetorik, Dialektik, Kinesik',
    subtitle: 'Überzeugen mit Worten und Wirkung',
    icon: '🎤',
    pitch: 'Sprich so, dass Menschen zuhören und folgen — in Meetings, Präsentationen und Verhandlungen.',
  },
  'sem-achtsamkeit': {
    id: 'sem-achtsamkeit',
    title: 'Achtsamkeit',
    subtitle: 'Gelassenheit ist trainierbar',
    icon: '🧘',
    pitch: 'Lerne mentale Stärke aufzubauen — damit du auch unter Druck klar denkst und gut entscheidest.',
  },
  'insights-mdi': {
    id: 'insights-mdi',
    title: 'INSIGHTS MDI® EQ',
    subtitle: 'Emotionale Intelligenz verstehen',
    icon: '❤️',
    pitch: 'Erkenne dein emotionales Profil — und lerne wie du Beziehungen, Konflikte und dich selbst besser steuerst.',
  },
  'sem-kommunikation': {
    id: 'sem-kommunikation',
    title: 'Kommunikation',
    subtitle: 'Verständigung als Schlüssel zum Erfolg',
    icon: '💬',
    pitch: 'Kommuniziere so klar und direkt, dass Missverständnisse gar nicht erst entstehen.',
  },
};

// Score → Prozent-Konversion
// Szenario: 1/4/7/10 Punkte → normalisiert auf 0–100
// Skala: 1–5 → normalisiert auf 0–100
export function scoreToPercent(scores) {
  // Pro Feld: 2 Szenario-Fragen (max 10 Punkte) + 2 Skala-Fragen (max 5 Punkte)
  // Max gesamt: 2×10 + 2×5 = 30 Punkte
  const total = scores.reduce((a, b) => a + b, 0);
  return Math.round((total / 30) * 100);
}
