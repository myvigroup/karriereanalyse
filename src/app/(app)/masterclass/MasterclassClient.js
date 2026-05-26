'use client';
import { useState, useMemo, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getCoachesForSeminar } from '@/lib/coaches';

// ─── Hardcoded Inhalte (preserved from previous version) ─────────────────────
const ANALYSE_TOOLS = [
  {
    id: 'strukturgramm',
    icon: '🔺',
    title: 'Strukturgramm®',
    subtitle: 'Erkenne deine Biostruktur',
    pricing: 'Online-Test + Coaching · Preis auf Anfrage',
    link: 'https://www.daskarriereinstitut.de/de/e/structogram-82?uId=2',
    features: [
      'Persönlichkeitsstruktur wissenschaftlich analysieren',
      'Stärken & blinde Flecken erkennen',
      'Individuelles Coaching-Gespräch inklusive',
      'Biographische Analyse deiner Muster',
    ],
  },
  {
    id: 'insights-mdi',
    icon: '🔬',
    title: 'INSIGHTS MDI® EQ',
    subtitle: 'Emotionale Intelligenz verstehen',
    pricing: 'Test + Auswertung · 499 € pro Person',
    link: 'https://www.daskarriereinstitut.de/de/e/insights-mdi-trimetrix-eq-analyse-und-auswertungsgespr%C3%A4ch-94?uId=2',
    features: [
      'EQ-Profil mit internationalem Standard',
      'Verhaltens- & Motivationsanalyse',
      'Detaillierter Auswertungsbericht (40+ Seiten)',
      'Einsatz in Führung & Teamkommunikation',
    ],
  },
];

// ─── Geplante Masterclasses (Coming Soon — zur Kauf-Anregung) ────────────────
const COMING_SOON_MASTERCLASSES = [
  {
    id: 'soon-verhandlung-advanced',
    title: 'Verhandlungskompetenz Advanced',
    subtitle: 'Vom Bittsteller zum Verhandlungspartner auf Augenhöhe',
    description: 'Komplexe Verhandlungsstrategien jenseits von Gehalt: Verträge, Konflikte, Boni-Pakete. Mit Praxis-Simulationen aus echten Cases.',
    launch: 'August 2026',
    letter: 'V',
    gradient: 'linear-gradient(135deg, #5d3a91 0%, #3a2266 100%)',
  },
  {
    id: 'soon-personal-branding',
    title: 'Personal Branding 360°',
    subtitle: 'Mach dich sichtbar — online wie offline',
    description: 'LinkedIn, Speaking, Networking, eigene Website. Wie du dich als Marke positionierst und Recruiter auf dich aufmerksam werden statt umgekehrt.',
    launch: 'September 2026',
    letter: 'P',
    gradient: 'linear-gradient(135deg, #1d4e89 0%, #0f2e4f 100%)',
  },
  {
    id: 'soon-fuehrung-hybrid',
    title: 'Führung im Hybrid-Office',
    subtitle: 'Distanz-Teams, die liefern',
    description: 'Remote-First-Führung, asynchrone Kommunikation, Vertrauenskultur. Für alle, die zum ersten Mal ein verteiltes Team übernehmen.',
    launch: 'Oktober 2026',
    letter: 'F',
    gradient: 'linear-gradient(135deg, #1d4d2e 0%, #0e2818 100%)',
  },
  {
    id: 'soon-ai-fuer-berufstaetige',
    title: 'AI für Berufstätige',
    subtitle: 'Werde 10× produktiver — ohne Tech-Background',
    description: 'Konkrete Workflows mit ChatGPT, Claude und Notion AI für Office, Analyse, Schreiben. Mit fertigen Prompt-Templates für deinen Arbeitsalltag.',
    launch: 'November 2026',
    letter: 'A',
    gradient: 'linear-gradient(135deg, #8a4a14 0%, #4d2906 100%)',
  },
  {
    id: 'soon-karriere-pivot',
    title: 'Karriere-Pivots & Quereinstieg',
    subtitle: 'Branche wechseln, ohne von vorne anzufangen',
    description: 'Wie du Übertragbarkeit deiner Skills argumentierst, das richtige Narrativ baust und in den ersten 90 Tagen im neuen Feld liefern kannst.',
    launch: 'Januar 2027',
    letter: 'K',
    gradient: 'linear-gradient(135deg, #4a0a14 0%, #2a0508 100%)',
  },
];

const SEMINARE = [
  { id: 'sem-typgerecht', icon: '🧠', title: 'Typgerechtes Lernen', subtitle: 'Lern dich smart — so funktioniert dein Gehirn wirklich', description: 'Warum lernen, denken und vergessen wir unterschiedlich?', next_date: '2026-04-18' },
  { id: 'sem-worklife', icon: '⚖️', title: 'Work-Life-Balance', subtitle: 'Leistung ohne Burnout — Karriere ohne kaputtzugehen', description: 'Ausgewogene Balance zwischen beruflichen und privaten Verpflichtungen.', next_date: '2026-05-09' },
  {
    id: 'sem-leadership',
    icon: '👑',
    title: 'Personal Leadership',
    subtitle: 'Endlich tun, was du dir vornimmst',
    description: 'Wie du aus Wünschen echte Ziele machst und sie erreichst.',
    next_date: '2026-06-13',
    linkUrl: 'https://www.daskarriereinstitut.de/de/e/personal-leadership-authentisch-f%C3%BChren-wirksam-bleiben-26?c=811',
    rating: '4.9',
    ratingCount: 36,
    bookableUntil: 'Fr. 12. Juni 2026, 21:59',
    longDescription: `
      <h4>Führe dich selbst, bevor du andere führst</h4>
      <p>Das Seminar <strong>„Personal Leadership“</strong> richtet sich an <strong>Studenten, Berufseinsteiger und Berufstätige</strong>, die ihre Fähigkeit zur <strong>Selbstführung</strong> auf ein neues Level bringen wollen. Denn wahre Führung beginnt nicht mit einem Titel — sondern mit dem <strong>klaren Umgang mit den eigenen Zielen, Entscheidungen und Gewohnheiten</strong>.</p>

      <h4>🚀 Was dich im Seminar erwartet</h4>
      <p>Unsere erfahrenen Referenten zeigen dir, <strong>wie aus Zielen ECHTE Ziele werden</strong> — konkret, erreichbar und motivierend. Du lernst, wie du:</p>
      <ul>
        <li>deine <strong>Ziele richtig formulierst</strong>, sodass sie wirklich motivieren</li>
        <li><strong>getroffene Maßnahmen konsequent umsetzt</strong></li>
        <li>neue Gewohnheiten <strong>nachhaltig in deinen Alltag integrierst</strong></li>
        <li>dein <strong>Zeit- und Selbstmanagement</strong> effektiv steuerst — statt dich selbst auszubremsen</li>
      </ul>
      <p>Du bekommst nicht nur theoretische Impulse, sondern vor allem <strong>praxisnahe Tools und Übungen</strong>, mit denen du sofort ins Umsetzen kommst.</p>

      <h4>🎯 Dein Ziel nach dem Seminar</h4>
      <p>Du wirst lernen, wie du <strong>Verantwortung für dich selbst übernimmst</strong>, klare Prioritäten setzt und aus deinen guten Vorsätzen <strong>konkrete Ergebnisse</strong> machst.</p>
      <blockquote>Personal Leadership heißt: bewusste Entscheidungen treffen — jeden Tag.</blockquote>

      <h4>📋 Voraussetzungen</h4>
      <p>Bitte wähle dich <strong>5–10 Minuten vor Beginn</strong> ein und mache einen kurzen <strong>Technik-Check</strong> (Audio, Kamera, Internetverbindung). Während des Seminars bitten wir dich, deine Kamera aktiv zu halten und dich mit Wortbeiträgen einzubringen — die Interaktion mit Referenten und Teilnehmenden ist zentraler Bestandteil und entscheidend für den Praxistransfer.</p>
    `,
  },
  {
    id: 'sem-speedreading',
    icon: '📖',
    title: 'Speedreading',
    subtitle: 'Lies doppelt so schnell — ohne Verständnis-Verlust',
    description: 'Grundlagen des überdurchschnittlich schnellen Lesens mit hohem Textverständnis.',
    next_date: '2026-07-11',
    linkUrl: 'https://www.daskarriereinstitut.de/de/e/speedreading-geschwindigkeit-trifft-verst%C3%A4ndnis-34?c=812',
    rating: '5.0',
    ratingCount: 4,
    bookableUntil: 'Fr. 10. Juli 2026, 21:59',
    longDescription: `
      <h4>Schnelllesen leicht gemacht</h4>
      <p>In einer Welt, die von Informationen überflutet wird, ist die Fähigkeit, <strong>effizient und schnell zu lesen</strong>, unschätzbar wertvoll. Dieses Seminar bringt dir Techniken und Strategien bei, mit denen du deine <strong>Lesegeschwindigkeit verdoppeln oder verdreifachen</strong> kannst — ohne das Verständnis zu opfern.</p>

      <h4>🚀 Was dich erwartet</h4>
      <ul>
        <li><strong>Grundlagen des Speedreadings</strong> — wissenschaftliche Hintergründe und Vorteile</li>
        <li><strong>Augenbewegung & visuelle Wahrnehmung</strong> gezielt verbessern</li>
        <li><strong>Wörter gruppieren</strong> — mehrere Wörter auf einmal erfassen</li>
        <li><strong>Interaktive Lesetests</strong> zur Fortschrittsmessung</li>
        <li>Konzentration und <strong>Textverständnis</strong> nachhaltig steigern</li>
      </ul>

      <h4>🎯 Dein Nutzen</h4>
      <ul>
        <li><strong>Zeitersparnis</strong> — mehr in kürzerer Zeit lesen, höhere Produktivität</li>
        <li><strong>Karrierevorteil</strong> — große Informationsmengen schnell verarbeiten</li>
        <li><strong>Lebenslange Lernfähigkeit</strong> — kontinuierlich neues Wissen aufnehmen</li>
      </ul>
      <blockquote>Starte jetzt und entdecke, wie Speedreading deine Effizienz und Produktivität steigern kann.</blockquote>

      <h4>📋 Voraussetzungen</h4>
      <p>Grundlegende Lesefähigkeiten, ein digitales Gerät mit Internetzugang sowie <strong>Motivation und Offenheit</strong> für neue Techniken. Der Kurs ist für Anfänger und Fortgeschrittene gleichermaßen geeignet.</p>
    `,
  },
  {
    id: 'sem-achtsamkeit',
    icon: '🧘',
    title: 'Achtsamkeit',
    subtitle: 'Raus aus dem Kopfkarussell — innere Ruhe, die hält',
    description: 'Zeit für dich und die eigenen Bedürfnisse — neben Beruf und reizüberflutetem Alltag.',
    next_date: '2026-08-08',
    linkUrl: 'https://www.daskarriereinstitut.de/de/e/achtsamkeit-gelassenheit-ist-trainierbar-48',
    bookableUntil: 'Fr. 7. August 2026, 21:59',
    longDescription: `
      <h4>Achtsamkeit beginnt im Moment</h4>
      <p>Im Seminar <strong>„Achtsamkeit"</strong> entdeckst du, wie wohltuend es sein kann, <strong>bewusst innezuhalten</strong> und den Moment wirklich wahrzunehmen.</p>
      <p>Gemeinsam erlernen wir wirkungsvolle Techniken wie <strong>Atemübungen, Meditation und Körperwahrnehmung</strong>, um mit mehr Ruhe, Klarheit und Präsenz durch den Alltag zu gehen.</p>

      <h4>🎯 Ziel des Seminars</h4>
      <p>Achtsamkeit nicht nur als kurzfristige Entspannung erleben, sondern <strong>nachhaltig in den eigenen Alltag integrieren</strong> — sei es im Beruf, in Beziehungen oder im Umgang mit sich selbst. Du lernst, <strong>bewusst Zeit für dich selbst zu schaffen</strong>, Körper, Geist und Emotionen in Einklang zu bringen und besser mit Stress und innerer Anspannung umzugehen.</p>

      <h4>✨ Die Vorteile</h4>
      <p><strong>Weniger Stress. Mehr Fokus. Mehr Lebensfreude.</strong></p>
      <blockquote>Wer regelmäßig Achtsamkeit praktiziert, schafft Raum für echte Veränderung — hin zu einem achtsameren, gesünderen und erfüllteren Leben.</blockquote>

      <h4>📋 Voraussetzungen</h4>
      <p>5–10 Minuten vor Beginn einwählen, Technik-Check (Audio, Kamera, Internet), Kamera aktiv halten und sich mit Wortbeiträgen einbringen. Die Interaktion mit Referenten und Teilnehmenden ist zentral für den Praxistransfer.</p>
    `,
  },
  {
    id: 'sem-rhetorik',
    icon: '🎤',
    title: 'Rhetorik, Dialektik, Kinesik',
    subtitle: 'Wenn du sprichst, hören alle zu',
    description: 'Wirkungsvoll, passend und adressatengerecht kommunizieren in jeder Situation.',
    next_date: '2026-09-12',
    linkUrl: 'https://www.daskarriereinstitut.de/de/e/rhetorik-dialektik-kinesik-%C3%BCberzeugen-mit-worten-und-wirkung-30',
    rating: '4.9',
    ratingCount: 19,
    bookableUntil: 'Fr. 11. September 2026, 21:59',
    longDescription: `
      <h4>Souverän auftreten, überzeugend kommunizieren</h4>
      <p>Du möchtest in Gesprächen <strong>sicherer auftreten</strong>, deine <strong>Sprache gezielter einsetzen</strong> und mit deiner <strong>Körpersprache bewusst wirken</strong>? Dieses Seminar richtet sich speziell an <strong>Studenten und Berufseinsteiger</strong>, die ihre mündlichen Kommunikationsfähigkeiten verbessern und ihre Wirkung auf andere gezielt stärken möchten.</p>

      <h4>📌 Das erwartet dich</h4>
      <ul>
        <li><strong>Grundlagen der Rhetorik</strong> — klar sprechen, stark argumentieren, gezielt überzeugen</li>
        <li><strong>Einführung in die Dialektik</strong> — souverän argumentieren, Einwände entkräften, Gespräche führen statt verlieren</li>
        <li><strong>Kinesik verstehen und nutzen</strong> — Körpersprache erkennen, bewusst einsetzen, Wirkung steigern</li>
        <li>Tipps & Techniken für <strong>Vorstellungsgespräch, Smalltalk, Konflikt und Präsentation</strong></li>
        <li><strong>Praktische Übungen & individuelles Feedback</strong> — direkt anwenden, direkt verbessern</li>
      </ul>

      <h4>🎯 Dein Ziel</h4>
      <p>Du lernst, wie <strong>Sprache, Argumentation und Körpersprache</strong> zusammenspielen — und wie du diese drei Elemente in unterschiedlichen Situationen gezielt einsetzt, um mehr Wirkung zu erzielen.</p>
      <blockquote>Kommunikation ist kein Talent — sondern ein Handwerk. Und du kannst es lernen.</blockquote>

      <h4>📋 Voraussetzungen</h4>
      <p>5–10 Minuten vor Beginn einwählen, Technik-Check, Kamera aktiv und mit Wortbeiträgen einbringen — entscheidend für den Praxistransfer.</p>
    `,
  },
  {
    id: 'sem-motivation',
    icon: '🔥',
    title: 'Selbstmotivation',
    subtitle: 'Wenn der innere Schweinehund verliert',
    description: 'Wie du dich effektiv motivierst und langfristig diszipliniert an deinen Zielen arbeitest.',
    next_date: '2026-10-10',
    linkUrl: 'https://www.daskarriereinstitut.de/de/e/selbstmotivation-dein-warum-dein-motor-55',
    rating: '4.7',
    ratingCount: 17,
    bookableUntil: 'Fr. 9. Oktober 2026, 21:59',
    longDescription: `
      <h4>Dein Schlüssel zu mehr Antrieb und Leistung</h4>
      <p>In diesem inspirierenden Seminar lernst du, wie du deine <strong>innere Kraftquelle aktivierst</strong> und dich selbst immer wieder neu motivierst — ganz ohne äußeren Druck. Du entdeckst, wie du deine <strong>Leistungsfähigkeit nachhaltig steigerst</strong> und selbst in anspruchsvollen Zeiten <strong>fokussiert und energiegeladen</strong> bleibst.</p>
      <p>Wir stellen dir <strong>wirkungsvolle Methoden und Motivationstechniken</strong> vor, die du direkt im Alltag anwenden kannst. Mit praktischen Übungen stärkst du dein Bewusstsein für deine eigenen Motive und findest neue Wege, dich selbst ins Handeln zu bringen.</p>

      <h4>🔍 Diese Themen erwarten dich</h4>
      <ul>
        <li>Die <strong>Grundlagen der Motivation</strong> — was Menschen wirklich antreibt</li>
        <li><strong>Motivationstheorien</strong> praktisch erklärt und angewendet</li>
        <li>Eigene <strong>Bedürfnisse und innere Motive</strong> besser verstehen</li>
        <li><strong>Konkrete Werkzeuge</strong>, um Motivation gezielt zu aktivieren</li>
        <li>Strategien zum Umgang mit <strong>Motivationskillern und inneren Widerständen</strong></li>
      </ul>

      <h4>🎯 Dein Ziel</h4>
      <p>Schluss mit <strong>Aufschieberitis und Selbstzweifeln</strong> — entwickle eine Motivation, die von innen kommt. Für mehr <strong>Klarheit, Energie und Selbstbestimmung</strong>.</p>
      <blockquote>Selbstmotivation ist kein Zufall — sie ist erlernbar.</blockquote>

      <h4>📋 Voraussetzungen</h4>
      <p>5–10 Minuten vor Beginn einwählen, Technik-Check, Kamera aktiv und mit Wortbeiträgen einbringen.</p>
    `,
  },
  {
    id: 'sem-kommunikation',
    icon: '💬',
    title: 'Kommunikation',
    subtitle: 'Sag, was du meinst — werd verstanden',
    description: 'Effektive Kommunikation mit Kollegen und Geschäftspartnern.',
    next_date: '2026-11-14',
    linkUrl: 'https://www.daskarriereinstitut.de/de/e/kommunikation-verst%C3%A4ndigung-als-schl%C3%BCssel-zum-erfolg-21',
    rating: '4.6',
    ratingCount: 10,
    bookableUntil: 'Fr. 13. November 2026, 22:59',
    longDescription: `
      <h4>Klar, empathisch und wirkungsvoll kommunizieren</h4>
      <p>Dieses Seminar richtet sich an <strong>Fach- und Führungskräfte</strong>, die ihre Kommunikationsfähigkeiten gezielt weiterentwickeln möchten, um im Berufsalltag <strong>klarer, empathischer und überzeugender</strong> zu kommunizieren — ob im Team, mit Kunden oder Geschäftspartnern.</p>
      <p>Du lernst die Grundlagen erfolgreicher Kommunikation kennen und erfährst, wie du <strong>Missverständnisse vermeidest</strong>, Gespräche zielgerichtet führst und eine <strong>vertrauensvolle Zusammenarbeit</strong> förderst.</p>

      <h4>📌 Im Fokus</h4>
      <ul>
        <li><strong>Aktives Zuhören</strong> und klare Botschaften</li>
        <li><strong>Wertschätzendes Feedback</strong> geben und empfangen</li>
        <li>Konstruktiver Umgang mit <strong>Konflikten und Spannungen</strong></li>
        <li>Bewusste Gesprächsführung und nonverbale Signale richtig deuten</li>
      </ul>

      <h4>🎯 Dein Ziel</h4>
      <p>Du erhältst praxisnahe Werkzeuge, mit denen du in jeder Situation <strong>sicher, klar und empathisch kommunizieren</strong> kannst. Ob in Mitarbeitergesprächen, Kundenkontakten oder Team-Meetings — deine Kommunikation wird wirksamer, klarer und verbindlicher.</p>
      <blockquote>Für mehr Klarheit, Vertrauen und Erfolg im Berufsalltag.</blockquote>

      <h4>📋 Voraussetzungen</h4>
      <p>5–10 Minuten vor Beginn einwählen, Technik-Check, Kamera aktiv und mit Wortbeiträgen einbringen.</p>
    `,
  },
  {
    id: 'sem-konflikt',
    icon: '🤜',
    title: 'Konfliktmanagement',
    subtitle: 'Wenn’s knallt, bleibst du cool',
    description: 'Strategien und Techniken zur erfolgreichen Konfliktbewältigung.',
    next_date: '2026-12-12',
    linkUrl: 'https://www.daskarriereinstitut.de/de/e/konfliktmanagement-aus-krisen-chancen-machen-52',
    rating: '5.0',
    ratingCount: 6,
    bookableUntil: 'Fr. 11. Dezember 2026, 22:59',
    longDescription: `
      <h4>Souverän und lösungsorientiert mit Konflikten umgehen</h4>
      <p>Konflikte gehören zum Berufsleben — entscheidend ist, <strong>wie du mit ihnen umgehst</strong>. In diesem Seminar lernst du die wichtigsten <strong>Strategien und Techniken zur erfolgreichen Konfliktbewältigung</strong> — von der frühzeitigen Vermeidung bis zur professionellen Lösung bereits entstandener Konflikte.</p>
      <p>Du erfährst, wie du <strong>Konfliktsituationen richtig analysierst</strong>, konstruktiv kommunizierst und <strong>Konfliktgespräche zielgerichtet und deeskalierend führst</strong>.</p>

      <h4>📌 Besonderer Fokus</h4>
      <ul>
        <li><strong>Reflexion eigener Konflikterfahrungen</strong> — beruflich wie privat</li>
        <li>Entwicklung <strong>praxisnaher, individueller Lösungsansätze</strong></li>
        <li>Mit <strong>emotionalen Situationen ruhig und empathisch</strong> umgehen</li>
        <li>Auch in schwierigen Momenten eine <strong>konstruktive Haltung</strong> bewahren</li>
      </ul>

      <h4>🎯 Dein Ziel</h4>
      <p>Du wirst befähigt, <strong>Konflikte frühzeitig zu erkennen</strong>, souverän zu handeln und Spannungen aktiv in <strong>produktive Lösungen zu verwandeln</strong>. So stärkst du deine persönliche Konfliktkompetenz und trägst aktiv zu einem besseren Miteinander im Arbeitsalltag bei.</p>
      <blockquote>Werde zum sicheren und lösungsorientierten Konfliktmanager in deinem beruflichen Umfeld.</blockquote>

      <h4>📋 Voraussetzungen</h4>
      <p>5–10 Minuten vor Beginn einwählen, Technik-Check, Kamera aktiv und mit Wortbeiträgen einbringen.</p>
    `,
  },
  { id: 'sem-homeoffice', icon: '🏠', title: 'Arbeiten im Home Office', subtitle: 'Home-Office-Profi statt Pyjama-Falle', description: 'Ausgeglichen und effektiv arbeiten — auch von zu Hause.', next_date: '2027-01-09' },
];

// ─── Helpers ─────────────────────────────────────────────────────────────────
function courseGradient(title) {
  const palette = [
    'linear-gradient(135deg, #4a0a14 0%, #2a0508 100%)',
    'linear-gradient(135deg, #1d4e89 0%, #0f2e4f 100%)',
    'linear-gradient(135deg, #5d3a91 0%, #3a2266 100%)',
    'linear-gradient(135deg, #1d4d2e 0%, #0e2818 100%)',
    'linear-gradient(135deg, #8a4a14 0%, #4d2906 100%)',
    'linear-gradient(135deg, #353A3B 0%, #1a1c1d 100%)',
  ];
  const i = (title || 'x').split('').reduce((a, c) => a + c.charCodeAt(0), 0) % palette.length;
  return palette[i];
}

function Icon({ name, size = 16, stroke = 1.7 }) {
  const p = { width: size, height: size, viewBox: '0 0 24 24', fill: 'none',
              stroke: 'currentColor', strokeWidth: stroke,
              strokeLinecap: 'round', strokeLinejoin: 'round' };
  switch (name) {
    case 'play':    return (<svg {...p}><polygon points="6 3 20 12 6 21 6 3" fill="currentColor" stroke="none"/></svg>);
    case 'cal':     return (<svg {...p}><rect x="3" y="4" width="18" height="18" rx="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>);
    case 'crown':   return (<svg {...p}><path d="M2 7l4 5 6-7 6 7 4-5v12H2z"/></svg>);
    case 'lock':    return (<svg {...p}><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>);
    case 'check':   return (<svg {...p}><polyline points="20 6 9 17 4 12"/></svg>);
    case 'spark':   return (<svg {...p}><path d="M5 3v4M3 5h4M19 17v4M17 19h4M12 2l2.4 5.1L20 9l-5.1 2.4L12 16l-2.4-5L4 9l5.4-2L12 2z"/></svg>);
    default: return null;
  }
}

// ─── MAIN COMPONENT ──────────────────────────────────────────────────────────
export default function MasterclassClient({ courses, progress, analysisResults, profile, seminars, seminarRegistrations }) {
  const router = useRouter();

  const plan = profile?.subscription_plan || 'FREE';
  const isPremium = plan !== 'FREE';
  const registeredSeminarIds = useMemo(
    () => new Set((seminarRegistrations || []).map(r => r.seminar_id)),
    [seminarRegistrations]
  );

  // Filter: nur e-learning-Kurse für die Hauptansicht (Seminare separat)
  const eLearningCourses = useMemo(
    () => (courses || []).filter(c => !c.category || c.category === 'e-learning'),
    [courses]
  );

  // Category-Filter
  const allCategories = useMemo(() => {
    const set = new Set(eLearningCourses.map(c => c.category || 'e-learning'));
    return ['alle', ...Array.from(set)];
  }, [eLearningCourses]);

  const [activeCat, setActiveCat] = useState('alle');
  const filteredCourses = useMemo(
    () => activeCat === 'alle' ? eLearningCourses : eLearningCourses.filter(c => (c.category || 'e-learning') === activeCat),
    [eLearningCourses, activeCat]
  );

  // Seminar-Modal-State + automatische Filterung vergangener Termine
  const [openSeminar, setOpenSeminar] = useState(null);
  const upcomingSeminars = useMemo(() => {
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return SEMINARE.filter(s => new Date(s.next_date) >= today);
  }, []);

  // ESC schließt Modal + Scroll-Lock
  useEffect(() => {
    if (!openSeminar) return;
    const onKey = (e) => { if (e.key === 'Escape') setOpenSeminar(null); };
    document.addEventListener('keydown', onKey);
    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = prevOverflow;
    };
  }, [openSeminar]);

  return (
    <div className="masterclass-v2">
      {/* Title block */}
      <div className="title-kicker">
        <span className="pulse" />
        {isPremium ? 'Premium aktiv · alle Kurse freigeschaltet' : 'Karriere-Bildung'}
      </div>
      <h1 className="page-title">
        Masterclass.{' '}
        <span className="faded">Lernen, das wirklich weiterbringt.</span>
      </h1>
      <p className="page-sub">
        Kompakte E-Learning-Kurse, Live-Seminare und exklusive Analyse-Tools — alles, um deine Karriere gezielt zu beschleunigen.
      </p>

      {/* Premium Upsell (nur für FREE-User) */}
      {!isPremium && (
        <div className="mc-upsell">
          <div>
            <div className="mc-upsell-eyebrow"><Icon name="crown" size={12} /> Premium freischalten</div>
            <h2 className="mc-upsell-title">Alle Masterclasses. Alle Seminare. Kein Limit.</h2>
            <p className="mc-upsell-sub">
              Zugriff auf alle E-Learning-Module, monatliches Live-Seminar (Wert 99 €), die Gehalts-Masterclass und persönliches Feedback.
            </p>
            <div className="mc-upsell-list">
              <span><Icon name="check" size={12} /> Alle E-Learning-Kurse</span>
              <span><Icon name="check" size={12} /> 1 Seminar / Monat (Wert 99 €)</span>
              <span><Icon name="check" size={12} /> Gehalts-Masterclass</span>
              <span><Icon name="check" size={12} /> Persönliches CV-Feedback</span>
            </div>
            <div className="mc-upsell-actions">
              <a href="/angebote" className="btn btn-on-dark">Premium starten</a>
            </div>
          </div>
          <div className="mc-upsell-price">
            <div className="amount">15 €</div>
            <div className="per">/ Monat · jederzeit kündbar</div>
          </div>
        </div>
      )}

      {/* Section: E-Learnings */}
      <div className="mc-secthead">
        <h3>E-Learnings <span className="count">{eLearningCourses.length}</span></h3>
      </div>

      {/* Category Filter */}
      {allCategories.length > 2 && (
        <div className="mc-filterbar">
          <div className="mc-chips">
            {allCategories.map(c => (
              <button key={c} className={`mc-chip ${activeCat === c ? 'on' : ''}`} onClick={() => setActiveCat(c)}>
                {c === 'alle' ? 'Alle' : c}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="mc-courses">
        {filteredCourses.length === 0 ? (
          <div className="mc-empty">Keine Kurse in dieser Kategorie.</div>
        ) : (
          filteredCourses.map(c => {
            const total = (c.modules || []).reduce((s, m) => s + (m.lessons || []).length, 0);
            const done = (c.modules || []).reduce(
              (s, m) => s + (m.lessons || []).filter(l => (progress || []).some(p => p.lesson_id === l.id && p.completed)).length,
              0
            );
            const pct = total > 0 ? Math.round((done / total) * 100) : 0;
            const isPremiumLocked = c.is_premium && !isPremium &&
              !(profile?.purchased_products || []).includes(c.id);
            const letter = (c.title || '?').trim()[0]?.toUpperCase() || '?';
            const moduleCount = (c.modules || []).length;
            const badge = pct === 100 ? { text: 'Fertig', kind: 'done' }
              : pct > 0 ? { text: 'Laufend', kind: '' }
              : c.is_premium && !isPremium ? { text: 'Premium', kind: 'premium' }
              : { text: 'Neu', kind: 'new' };
            const status = pct === 100 ? '✓ Fertig'
              : pct === 0 ? (isPremiumLocked ? 'Premium' : 'Starten →')
              : `${pct} %`;

            return (
              <div key={c.id}
                   className={`mc-course ${isPremiumLocked ? 'locked' : ''}`}
                   onClick={() => isPremiumLocked ? router.push('/angebote') : router.push(`/masterclass/${c.id}`)}
                   role="button" tabIndex={0}>
                <div className="mc-course-cover" style={{ background: courseGradient(c.title) }}>
                  <span className="cat">{c.category || 'e-learning'}</span>
                  <span className={`badge ${badge.kind}`}>{badge.text}</span>
                  <span className="mc-letter">{letter}</span>
                  {pct > 0 && (
                    <div className="mc-course-bar">
                      <div className={pct === 100 ? 'done' : ''} style={{ width: `${pct}%` }} />
                    </div>
                  )}
                  {isPremiumLocked && (
                    <div className="mc-lock"><Icon name="lock" size={18} stroke={2} /></div>
                  )}
                </div>
                <div className="mc-course-body">
                  <div className="mc-course-title">{c.title}</div>
                  {c.description && <div className="mc-course-sub">{c.description}</div>}
                  <div className="mc-course-meta">
                    <span>{moduleCount} {moduleCount === 1 ? 'Modul' : 'Module'}</span>
                    {total > 0 && (
                      <>
                        <span className="dot" />
                        <span>{total} {total === 1 ? 'Lektion' : 'Lektionen'}</span>
                      </>
                    )}
                  </div>
                </div>
                <div className="mc-course-foot">
                  <span className={`progress ${pct === 100 ? 'done' : ''}`}>{status}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Section: Bald verfügbar (Coming Soon — Kauf-Anregung) */}
      <div className="mc-secthead" style={{ marginTop: 'calc(var(--gap) * 1.5)' }}>
        <h3>Bald verfügbar <span className="count">{COMING_SOON_MASTERCLASSES.length}</span></h3>
        <span className="link">Vormerken — du bekommst eine Mail beim Launch</span>
      </div>
      <div className="mc-courses">
        {COMING_SOON_MASTERCLASSES.map(c => (
          <div key={c.id} className="mc-course mc-upcoming"
               onClick={() => alert(`„${c.title}" startet ${c.launch}. Du wirst per Mail benachrichtigt sobald die Masterclass live ist.`)}
               role="button" tabIndex={0}>
            <div className="mc-course-cover" style={{ background: c.gradient }}>
              <span className="cat">Coming Soon</span>
              <span className="badge upcoming">{c.launch}</span>
              <span className="mc-letter">{c.letter}</span>
            </div>
            <div className="mc-course-body">
              <div className="mc-course-title">{c.title}</div>
              <div className="mc-course-sub">{c.description}</div>
              <div className="mc-course-meta">
                <Icon name="cal" size={11} />
                <span>Start: {c.launch}</span>
              </div>
            </div>
            <div className="mc-course-foot">
              <span className="coach-name">{c.subtitle}</span>
              <span className="progress upcoming-cta">+ Vormerken</span>
            </div>
          </div>
        ))}
      </div>

      {/* Section: Live-Seminare (nur kommende Termine — vergangene werden automatisch ausgeblendet) */}
      <div className="mc-secthead" style={{ marginTop: 'calc(var(--gap) * 1.5)' }}>
        <h3>Live-Seminare <span className="count">{upcomingSeminars.length}</span></h3>
        <span className="link">monatlich · 90 Min · interaktiv</span>
      </div>
      <div className="mc-seminar-list">
        {upcomingSeminars.map(s => {
          const registered = registeredSeminarIds.has(s.id);
          const nextDate = new Date(s.next_date);
          const dateStr = nextDate.toLocaleDateString('de-DE', { day: '2-digit', month: 'short', year: 'numeric' });
          const weekday = nextDate.toLocaleDateString('de-DE', { weekday: 'short' });
          return (
            <div key={s.id} className="mc-seminar-row" onClick={() => setOpenSeminar(s)} role="button" tabIndex={0}>
              <div className="mc-seminar-date">
                <span className="mc-seminar-date-day">{nextDate.getDate()}</span>
                <span className="mc-seminar-date-month">{nextDate.toLocaleDateString('de-DE', { month: 'short' })}</span>
                <span className="mc-seminar-date-weekday">{weekday}</span>
              </div>
              <div className="mc-seminar-icon">{s.icon}</div>
              <div className="mc-seminar-body">
                <div className="mc-seminar-title">{s.title}</div>
                <div className="mc-seminar-subtitle">{s.subtitle}</div>
                <div className="mc-seminar-desc">{s.description}</div>
              </div>
              <div className="mc-seminar-side">
                {registered ? (
                  <span className="mc-seminar-badge done">✓ Angemeldet</span>
                ) : !isPremium ? (
                  <span className="mc-seminar-badge premium">Premium</span>
                ) : (
                  <span className="mc-seminar-badge open">Anmelden</span>
                )}
                <span className="mc-seminar-meta">90 Min · interaktiv</span>
                <span className="mc-seminar-cta">Details →</span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Seminar Detail Modal */}
      {openSeminar && (() => {
        const sem = openSeminar;
        const registered = registeredSeminarIds.has(sem.id);
        const nextDate = new Date(sem.next_date);
        const dateStr = nextDate.toLocaleDateString('de-DE', { weekday: 'long', day: '2-digit', month: 'long', year: 'numeric' });
        return (
          <div className="mc-modal-overlay" onClick={() => setOpenSeminar(null)}>
            <div className="mc-modal" onClick={(e) => e.stopPropagation()} role="dialog" aria-label={sem.title}>
              <button className="mc-modal-close" onClick={() => setOpenSeminar(null)} aria-label="Schließen">✕</button>

              <div className="mc-modal-header">
                <div className="mc-modal-icon">{sem.icon}</div>
                <div className="mc-modal-header-text">
                  <div className="mc-modal-eyebrow">Live-Seminar</div>
                  <h2 className="mc-modal-title">{sem.title}</h2>
                  <div className="mc-modal-subtitle">{sem.subtitle}</div>
                </div>
              </div>

              <div className="mc-modal-meta">
                <div className="mc-modal-meta-item">
                  <span className="lbl">Nächster Termin</span>
                  <span className="val">{dateStr}</span>
                </div>
                <div className="mc-modal-meta-item">
                  <span className="lbl">Dauer</span>
                  <span className="val">90 Minuten</span>
                </div>
                <div className="mc-modal-meta-item">
                  <span className="lbl">Format</span>
                  <span className="val">Microsoft Teams · interaktiv</span>
                </div>
                <div className="mc-modal-meta-item">
                  <span className="lbl">{sem.rating ? 'Bewertung' : 'Zertifikat'}</span>
                  <span className="val">
                    {sem.rating
                      ? `★ ${sem.rating}/5 · ${sem.ratingCount} Bewertungen`
                      : 'nach Teilnahme'}
                  </span>
                </div>
                {sem.bookableUntil && (
                  <div className="mc-modal-meta-item" style={{ gridColumn: '1 / -1' }}>
                    <span className="lbl">Buchbar bis</span>
                    <span className="val">{sem.bookableUntil}</span>
                  </div>
                )}
              </div>

              <div className="mc-modal-body">
                <p className="mc-modal-lead">{sem.description}</p>
                {sem.longDescription && (
                  <div className="mc-modal-long" dangerouslySetInnerHTML={{ __html: sem.longDescription }} />
                )}
                {!sem.longDescription && (
                  <p className="mc-modal-placeholder">
                    Ausführliche Beschreibung folgt — die Detail-Inhalte werden gerade aus den bestehenden Seminar-Seiten übernommen.
                  </p>
                )}

                {(() => {
                  const coaches = getCoachesForSeminar(sem.id);
                  if (!coaches.length) return null;
                  return (
                    <div className="mc-modal-coaches">
                      <div className="mc-modal-coaches-label">
                        {coaches.length > 1 ? 'Deine Trainer:innen' : 'Deine Trainerin / dein Trainer'}
                      </div>
                      <div className="mc-modal-coaches-list">
                        {coaches.map(c => (
                          <div key={c.id} className="mc-modal-coach">
                            <div className="mc-modal-coach-avatar" style={{ background: c.gradient }}>
                              {c.initials}
                            </div>
                            <div className="mc-modal-coach-info">
                              <div className="mc-modal-coach-name">{c.name}</div>
                              <div className="mc-modal-coach-title">{c.title}</div>
                              <div className="mc-modal-coach-short">{c.short}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <a href="/coaches" className="mc-modal-coaches-link">Alle Coaches kennenlernen →</a>
                    </div>
                  );
                })()}
              </div>

              <div className="mc-modal-actions">
                {registered ? (
                  <span className="mc-seminar-badge done" style={{ padding: '10px 16px', fontSize: 13 }}>✓ Bereits angemeldet</span>
                ) : !isPremium ? (
                  <>
                    <a href="/angebote" className="mc-modal-cta-primary">Premium starten · ab 15 €/Monat</a>
                    <a href="/seminare" className="mc-modal-cta-secondary">Einzeln buchen · 99 €</a>
                  </>
                ) : (
                  <a href={sem.linkUrl || '/seminare'} className="mc-modal-cta-primary" target={sem.linkUrl ? '_blank' : undefined} rel={sem.linkUrl ? 'noopener noreferrer' : undefined}>
                    Jetzt anmelden →
                  </a>
                )}
                {sem.linkUrl && (
                  <a href={sem.linkUrl} target="_blank" rel="noopener noreferrer" className="mc-modal-cta-secondary">
                    Vollständige Beschreibung öffnen →
                  </a>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      {/* Section: Premium-Analyse-Tools */}
      <div className="mc-secthead" style={{ marginTop: 'calc(var(--gap) * 1.5)' }}>
        <h3>Premium-Analyse-Tools <span className="count">{ANALYSE_TOOLS.length}</span></h3>
        <span className="link">wissenschaftlich · individuelles Coaching</span>
      </div>
      <div className="mc-tools-grid">
        {ANALYSE_TOOLS.map(t => (
          <a key={t.id} className="mc-tool" href={t.link} target="_blank" rel="noopener noreferrer">
            <div className="mc-tool-head">
              <div className="mc-tool-icon">{t.icon}</div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div className="mc-tool-title">{t.title}</div>
                <div className="mc-tool-subtitle">{t.subtitle}</div>
              </div>
              <span className="mc-tool-badge"><Icon name="spark" size={12} /> Premium</span>
            </div>
            <ul className="mc-tool-features">
              {t.features.map((f, i) => (
                <li key={i}><Icon name="check" size={12} stroke={2} /> {f}</li>
              ))}
            </ul>
            <div className="mc-tool-foot">
              <span className="mc-tool-pricing">{t.pricing}</span>
              <span className="mc-tool-cta">Buchen →</span>
            </div>
          </a>
        ))}
      </div>
    </div>
  );
}
