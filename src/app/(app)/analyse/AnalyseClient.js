'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { awardPoints } from '@/lib/gamification';
import InfoTooltip from '@/components/ui/InfoTooltip';

// ============================================================
// 13 KOMPETENZFELDER
// ============================================================
const KOMPETENZFELDER = [
  { id: 'selbstwertgefuehl', name: 'Selbstwertgef\u00FChl', icon: '\u{1F6E1}\uFE0F', category: 'Wahrnehmung', color: '#CC1426' },
  { id: 'prioritaeten', name: 'Priorit\u00E4tenmanagement', icon: '\u{1F3AF}', category: 'Wahrnehmung', color: '#E63946' },
  { id: 'selbstreflexion', name: 'Selbstreflexion', icon: '\u{1FA9E}', category: 'Intrapersonal', color: '#8B5CF6' },
  { id: 'selbstfuersorge', name: 'Selbstf\u00FCrsorge', icon: '\u{1F9D8}', category: 'Intrapersonal', color: '#A78BFA' },
  { id: 'kompetenzbewusstsein', name: 'Kompetenzbewusstsein', icon: '\u{1F48E}', category: 'Intrapersonal', color: '#7C3AED' },
  { id: 'kommunikation', name: 'Kommunikation', icon: '\u{1F4AC}', category: 'Interpersonal', color: '#2563EB' },
  { id: 'sozialkompetenz', name: 'Sozialkompetenz', icon: '\u{1F91D}', category: 'Interpersonal', color: '#3B82F6' },
  { id: 'sozialisationskompetenz', name: 'Sozialisationskompetenz', icon: '\u{1F310}', category: 'Interpersonal', color: '#60A5FA' },
  { id: 'praesentation', name: 'Pr\u00E4sentationskompetenz', icon: '\u{1F3A4}', category: 'Interpersonal', color: '#1D4ED8' },
  { id: 'emotionale_intelligenz', name: 'Emotionale Intelligenz', icon: '\u2764\uFE0F', category: 'Regulierung', color: '#059669' },
  { id: 'charisma', name: 'Charisma', icon: '\u2728', category: 'Regulierung', color: '#10B981' },
  { id: 'resilienz', name: 'Resilienz', icon: '\u{1F525}', category: 'Regulierung', color: '#34D399' },
  { id: 'fuehrung', name: 'F\u00FChrungskompetenz', icon: '\u{1F451}', category: 'Regulierung', color: '#047857' },
];

const CATEGORY_INTROS = {
  'Wahrnehmung': { emoji: '\u{1F441}\uFE0F', text: 'Wie nimmst du dich selbst und deine Umgebung wahr?' },
  'Intrapersonal': { emoji: '\u{1FA9E}', text: 'Jetzt geht es um dein Inneres \u2014 Reflexion, F\u00FCrsorge und Bewusstsein.' },
  'Interpersonal': { emoji: '\u{1F4AC}', text: 'Wie wirkst du auf andere? Kommunikation, Auftreten, Soziales.' },
  'Regulierung': { emoji: '\u{1F9E0}', text: 'Emotionen, Widerstandskraft und F\u00FChrung \u2014 die K\u00F6nigsdisziplinen.' },
};

// ============================================================
// 65 SZENARIO-FRAGEN (5 pro Feld)
// ============================================================
const SZENARIEN = {
  selbstwertgefuehl: [
    { scenario: 'Dein Chef bittet dich spontan, in 10 Minuten eine Pr\u00E4sentation vor dem gesamten Team zu halten.', options: [
      { text: 'Kein Problem \u2014 ich stehe gerne im Rampenlicht', score: 10, emoji: '\u{1F60E}' },
      { text: 'Nerv\u00F6s, aber ich zieh\'s durch', score: 7, emoji: '\u{1F624}' },
      { text: 'Ich versuche es, aber mir wird unwohl', score: 4, emoji: '\u{1F630}' },
      { text: 'Ich bitte jemand anderen, das zu \u00FCbernehmen', score: 1, emoji: '\u{1F648}' },
    ]},
    { scenario: 'Ein Kollege kritisiert deine Arbeit vor versammelter Runde. Was passiert in dir?', options: [
      { text: 'Ich nehme es sachlich auf und antworte souver\u00E4n', score: 10, emoji: '\u{1F60C}' },
      { text: 'Es trifft mich kurz, aber ich fange mich schnell', score: 7, emoji: '\u{1F914}' },
      { text: 'Ich gr\u00FCble den Rest des Tages dar\u00FCber', score: 4, emoji: '\u{1F614}' },
      { text: 'Ich zweifle danach an meiner gesamten Kompetenz', score: 1, emoji: '\u{1F622}' },
    ]},
    { scenario: 'Du sollst in deinem Lebenslauf deine drei gr\u00F6\u00DFten St\u00E4rken aufschreiben. Wie f\u00E4llt dir das?', options: [
      { text: 'Leicht \u2014 ich kenne meine St\u00E4rken genau', score: 10, emoji: '\u{1F4AA}' },
      { text: 'Ich brauche etwas Zeit, finde aber gute Punkte', score: 7, emoji: '\u{1F4DD}' },
      { text: 'Ich bin unsicher, was wirklich meine St\u00E4rken sind', score: 4, emoji: '\u{1F937}' },
      { text: 'Ich f\u00E4nde es einfacher, Schw\u00E4chen aufzuz\u00E4hlen', score: 1, emoji: '\u{1F625}' },
    ]},
    { scenario: 'Du bekommst ein Jobangebot mit 30% mehr Gehalt, aber in einem v\u00F6llig neuen Bereich.', options: [
      { text: 'Ich bin \u00FCberzeugt, das schaffe ich', score: 10, emoji: '\u{1F680}' },
      { text: 'Ich w\u00FCrde es versuchen \u2014 ich lerne schnell', score: 7, emoji: '\u{1F4C8}' },
      { text: 'Ich bin unsicher, ob ich dem gewachsen bin', score: 4, emoji: '\u{1F615}' },
      { text: 'Ich bleibe lieber, wo ich mich sicher f\u00FChle', score: 1, emoji: '\u{1F3E0}' },
    ]},
    { scenario: 'Bei einem Networking-Event wirst du gefragt: "Was macht Sie besonders?" Deine Reaktion:', options: [
      { text: 'Ich habe einen klaren Elevator Pitch parat', score: 10, emoji: '\u{1F3AF}' },
      { text: 'Ich erz\u00E4hle frei \u00FCber meine Erfahrungen', score: 7, emoji: '\u{1F5E3}\uFE0F' },
      { text: 'Ich werde verlegen und halte mich bedeckt', score: 4, emoji: '\u{1F633}' },
      { text: 'Ich wechsle schnell das Thema', score: 1, emoji: '\u{1F605}' },
    ]},
  ],
  prioritaeten: [
    { scenario: 'Montag 9 Uhr: Du hast 15 E-Mails, 3 Meeting-Anfragen und ein dringendes Projekt. Was tust du zuerst?', options: [
      { text: 'Projekt zuerst \u2014 Wichtiges vor Dringendem', score: 10, emoji: '\u{1F3AF}' },
      { text: 'Ich scanne die E-Mails kurz und plane dann', score: 7, emoji: '\u{1F4CB}' },
      { text: 'Ich beantworte erst mal alle E-Mails', score: 4, emoji: '\u{1F4E8}' },
      { text: 'Ich f\u00FChle mich \u00FCberw\u00E4ltigt und wei\u00DF nicht, wo anfangen', score: 1, emoji: '\u{1F635}' },
    ]},
    { scenario: 'Dein Vorgesetzter gibt dir eine neue Aufgabe, obwohl du schon am Limit bist.', options: [
      { text: 'Ich kommuniziere klar, was realistisch ist, und schlage Priorit\u00E4ten vor', score: 10, emoji: '\u{1F4AC}' },
      { text: 'Ich nehme es an und reorganisiere meinen Plan', score: 7, emoji: '\u{1F504}' },
      { text: 'Ich nehme es an, auch wenn ich \u00DCberstunden machen muss', score: 4, emoji: '\u{1F62B}' },
      { text: 'Ich sage ja und hoffe, dass es irgendwie klappt', score: 1, emoji: '\u{1F91E}' },
    ]},
    { scenario: 'Du arbeitest konzentriert, als ein Kollege "nur kurz" etwas fragt. Das passiert 5x am Tag.', options: [
      { text: 'Ich habe feste Fokus-Zeiten und kommuniziere das klar', score: 10, emoji: '\u{1F6D1}' },
      { text: 'Ich sage meistens "sp\u00E4ter" und blocke meine Zeit', score: 7, emoji: '\u23F0' },
      { text: 'Ich helfe meistens sofort, verliere aber den Faden', score: 4, emoji: '\u{1F500}' },
      { text: 'Ich kann schlecht Nein sagen und komme nie zu meinen Sachen', score: 1, emoji: '\u{1F614}' },
    ]},
    { scenario: 'Du hast 3 Projekte gleichzeitig. Eines ist spannend, eines langweilig, eines dringend.', options: [
      { text: 'Ich priorisiere nach Impact und Deadline, nicht nach Laune', score: 10, emoji: '\u{1F9E0}' },
      { text: 'Dringendes zuerst, dann das Spannende', score: 7, emoji: '\u{1F4C5}' },
      { text: 'Ich mache das Spannende zuerst, der Rest kann warten', score: 4, emoji: '\u2728' },
      { text: 'Ich springe zwischen allen hin und her', score: 1, emoji: '\u{1F3C3}' },
    ]},
    { scenario: 'Am Abend merkst du: Du warst den ganzen Tag besch\u00E4ftigt, aber nichts Wichtiges geschafft.', options: [
      { text: 'Passiert mir fast nie \u2014 ich plane meinen Tag strategisch', score: 10, emoji: '\u{1F4CA}' },
      { text: 'Manchmal, dann passe ich meine Methode an', score: 7, emoji: '\u{1F504}' },
      { text: 'Kommt h\u00E4ufiger vor, als mir lieb ist', score: 4, emoji: '\u{1F62C}' },
      { text: 'Das ist leider mein Alltag', score: 1, emoji: '\u{1F629}' },
    ]},
  ],
  selbstreflexion: [
    { scenario: 'Ein Projekt ist grandios gescheitert. Was machst du als Erstes?', options: [
      { text: 'Ich analysiere systematisch, was schiefgelaufen ist', score: 10, emoji: '\u{1F50D}' },
      { text: 'Ich spreche mit dem Team \u00FCber Learnings', score: 7, emoji: '\u{1F4AC}' },
      { text: 'Ich \u00E4rgere mich erst mal und analysiere sp\u00E4ter', score: 4, emoji: '\u{1F620}' },
      { text: 'Ich verdr\u00E4nge es und mache weiter', score: 1, emoji: '\u{1F648}' },
    ]},
    { scenario: 'Du erh\u00E4ltst ein 360-Grad-Feedback. Dein Score bei "Teamf\u00E4higkeit" ist \u00FCberraschend niedrig.', options: [
      { text: 'Ich nehme es als wertvolles Signal und frage nach Details', score: 10, emoji: '\u{1F4A1}' },
      { text: 'Ich \u00FCberlege, welche Situationen gemeint sein k\u00F6nnten', score: 7, emoji: '\u{1F914}' },
      { text: 'Ich bin verletzt, aber versuche offen zu bleiben', score: 4, emoji: '\u{1F622}' },
      { text: 'Ich finde das unfair \u2014 die anderen kennen mich nicht richtig', score: 1, emoji: '\u{1F624}' },
    ]},
    { scenario: 'Wie oft reflektierst du bewusst \u00FCber deine Karriere-Entscheidungen?', options: [
      { text: 'Regelm\u00E4\u00DFig \u2014 ich f\u00FChre Tagebuch oder mache Reviews', score: 10, emoji: '\u{1F4D3}' },
      { text: 'Alle paar Monate, wenn ich Zeit habe', score: 7, emoji: '\u{1F4C5}' },
      { text: 'Nur wenn etwas schiefgeht', score: 4, emoji: '\u26A0\uFE0F' },
      { text: 'Ehrlich gesagt: fast nie', score: 1, emoji: '\u{1F937}' },
    ]},
    { scenario: 'Du hast im Meeting eine Idee vorgetragen, die nicht ankam. Danach:', options: [
      { text: 'Ich \u00FCberlege, wie ich es n\u00E4chstes Mal besser pr\u00E4sentiere', score: 10, emoji: '\u{1F4C8}' },
      { text: 'Ich hole Feedback ein, warum es nicht ankam', score: 7, emoji: '\u{1F4AC}' },
      { text: 'Ich bin entt\u00E4uscht und bringe seltener Ideen ein', score: 4, emoji: '\u{1F614}' },
      { text: 'Ich gebe anderen die Schuld f\u00FCr mangelndes Verst\u00E4ndnis', score: 1, emoji: '\u{1F612}' },
    ]},
    { scenario: 'Ein Freund sagt: "Du bist manchmal zu direkt." Wie reagierst du?', options: [
      { text: 'Ich danke f\u00FCr die Ehrlichkeit und reflektiere darüber', score: 10, emoji: '\u{1F64F}' },
      { text: 'Ich \u00FCberlege, in welchen Situationen das zutreffen k\u00F6nnte', score: 7, emoji: '\u{1F914}' },
      { text: 'Ich finde es schwer, das anzunehmen', score: 4, emoji: '\u{1F615}' },
      { text: 'Ich finde Direktheit ist eine St\u00E4rke, nicht mein Problem', score: 1, emoji: '\u{1F4AA}' },
    ]},
  ],
  selbstfuersorge: [
    { scenario: 'Du hast seit 3 Wochen jeden Abend \u00DCberstunden gemacht. Wie gehst du damit um?', options: [
      { text: 'Ich setze klare Grenzen und nehme mir bewusst frei', score: 10, emoji: '\u{1F6D1}' },
      { text: 'Ich plane ein Wochenende zum Aufladen', score: 7, emoji: '\u{1F3D6}\uFE0F' },
      { text: 'Ich wei\u00DF, dass ich was tun sollte, aber kann nicht loslassen', score: 4, emoji: '\u{1F62B}' },
      { text: 'Ich mache weiter \u2014 von alleine wird es nicht besser', score: 1, emoji: '\u{1F9DF}' },
    ]},
    { scenario: 'Dein K\u00F6rper zeigt Stresssymptome (Schlafprobleme, Kopfschmerzen). Was tust du?', options: [
      { text: 'Sofort Gegenma\u00DFnahmen: Sport, Achtsamkeit, Arzttermin', score: 10, emoji: '\u{1F3CB}\uFE0F' },
      { text: 'Ich reduziere Stress wo ich kann', score: 7, emoji: '\u{1F4C9}' },
      { text: 'Ich nehme es wahr, \u00E4ndere aber nichts', score: 4, emoji: '\u{1F611}' },
      { text: 'Ich ignoriere die Signale und mache weiter', score: 1, emoji: '\u{1F635}' },
    ]},
    { scenario: 'Wie sieht dein typischer Feierabend aus?', options: [
      { text: 'Bewusste Erholung: Sport, Hobby, Quality Time', score: 10, emoji: '\u{1F31F}' },
      { text: 'Meistens entspannt, manchmal checke ich nochmal E-Mails', score: 7, emoji: '\u{1F4F1}' },
      { text: 'Ich bin oft zu m\u00FCde f\u00FCr irgendwas Au\u00DFer Netflix', score: 4, emoji: '\u{1F4FA}' },
      { text: 'Feierabend? Der \u00DCbergang ist flie\u00DFend...', score: 1, emoji: '\u{1F4BB}' },
    ]},
    { scenario: 'Dein bester Freund sagt seinen Termin ab. Du hast pl\u00F6tzlich 3 Stunden frei.', options: [
      { text: 'Perfekt \u2014 ich nutze die Zeit f\u00FCr mich bewusst', score: 10, emoji: '\u{1F9D8}' },
      { text: 'Ich freue mich und mache etwas Sch\u00F6nes', score: 7, emoji: '\u{1F60A}' },
      { text: 'Ich arbeite stattdessen einfach weiter', score: 4, emoji: '\u{1F4BC}' },
      { text: 'Ich langweile mich und wei\u00DF nichts mit mir anzufangen', score: 1, emoji: '\u{1F611}' },
    ]},
    { scenario: 'Wie oft sagst du "Nein" zu Anfragen, die deine Grenzen \u00FCberschreiten?', options: [
      { text: 'Regelm\u00E4\u00DFig und selbstbewusst', score: 10, emoji: '\u{1F6E1}\uFE0F' },
      { text: 'Meistens, wenn es wirklich zu viel wird', score: 7, emoji: '\u{1F44D}' },
      { text: 'Selten \u2014 ich will niemanden entt\u00E4uschen', score: 4, emoji: '\u{1F614}' },
      { text: 'Praktisch nie \u2014 ich sage immer ja', score: 1, emoji: '\u{1F62A}' },
    ]},
  ],
  kompetenzbewusstsein: [
    { scenario: 'Jemand fragt dich: "Was kannst du besser als die meisten?" Deine Reaktion:', options: [
      { text: 'Ich kann 3 Dinge sofort benennen', score: 10, emoji: '\u{1F48E}' },
      { text: 'Ich \u00FCberlege kurz, finde aber gute Antworten', score: 7, emoji: '\u{1F914}' },
      { text: 'Ich tu mich schwer damit, mich hervorzuheben', score: 4, emoji: '\u{1F615}' },
      { text: 'Keine Ahnung \u2014 ich bin halt durchschnittlich', score: 1, emoji: '\u{1F937}' },
    ]},
    { scenario: 'Du siehst eine Stellenanzeige, die 80% zu dir passt aber 20% Anforderungen hat, die du nicht erf\u00FCllst.', options: [
      { text: 'Ich bewerbe mich \u2014 die 20% lerne ich schnell', score: 10, emoji: '\u{1F680}' },
      { text: 'Ich bewerbe mich und bin ehrlich \u00FCber die L\u00FCcken', score: 7, emoji: '\u{1F4DD}' },
      { text: 'Ich z\u00F6gere und warte auf eine 100%-Passende', score: 4, emoji: '\u23F3' },
      { text: 'Ich bewerbe mich nicht \u2014 ich erf\u00FClle ja nicht alles', score: 1, emoji: '\u{1F6AB}' },
    ]},
    { scenario: 'Im Jahresgespr\u00E4ch sollst du deine gr\u00F6\u00DFten Erfolge des Jahres nennen.', options: [
      { text: 'Ich habe sie dokumentiert und pr\u00E4sentiere sie klar', score: 10, emoji: '\u{1F4CA}' },
      { text: 'Mir fallen einige ein, ich h\u00E4tte sie besser tracken sollen', score: 7, emoji: '\u{1F4DD}' },
      { text: 'Ich finde es schwer, meine Leistungen "zu verkaufen"', score: 4, emoji: '\u{1F633}' },
      { text: 'Mir f\u00E4llt spontan nichts Besonderes ein', score: 1, emoji: '\u{1F610}' },
    ]},
    { scenario: 'Ein Headhunter ruft an und fragt nach deinem Marktwert. Du:', options: [
      { text: 'Kenne meinen Marktwert und nenne selbstbewusst eine Zahl', score: 10, emoji: '\u{1F4B0}' },
      { text: 'Habe eine ungef\u00E4hre Vorstellung und nenne eine Range', score: 7, emoji: '\u{1F4C8}' },
      { text: 'Bin unsicher und sage "markt\u00FCblich"', score: 4, emoji: '\u{1F937}' },
      { text: 'Habe keine Ahnung und f\u00FChle mich unwohl bei dem Thema', score: 1, emoji: '\u{1F630}' },
    ]},
    { scenario: 'Du vergleichst dich mit erfolgreichen Menschen in deiner Branche. Dein Gef\u00FChl:', options: [
      { text: 'Inspiration \u2014 ich sehe, was m\u00F6glich ist', score: 10, emoji: '\u{1F31F}' },
      { text: 'Motivation \u2014 ich arbeite daran, besser zu werden', score: 7, emoji: '\u{1F4AA}' },
      { text: 'Verunsicherung \u2014 die sind so viel weiter', score: 4, emoji: '\u{1F614}' },
      { text: 'Frustration \u2014 ich werde das nie schaffen', score: 1, emoji: '\u{1F61E}' },
    ]},
  ],
  kommunikation: [
    { scenario: 'Du musst einem schwierigen Stakeholder eine schlechte Nachricht \u00FCberbringen.', options: [
      { text: 'Direkt, klar und mit L\u00F6sungsvorschlag', score: 10, emoji: '\u{1F4AC}' },
      { text: 'Ich bereite mich vor und w\u00E4hle den richtigen Moment', score: 7, emoji: '\u{1F4CB}' },
      { text: 'Ich schreibe lieber eine E-Mail als pers\u00F6nlich zu reden', score: 4, emoji: '\u{1F4E7}' },
      { text: 'Ich schiebe es so lange wie m\u00F6glich auf', score: 1, emoji: '\u{1F62C}' },
    ]},
    { scenario: 'In einer hitzigen Diskussion ist jemand anderer Meinung als du.', options: [
      { text: 'Ich argumentiere sachlich und h\u00F6re aktiv zu', score: 10, emoji: '\u{1F9D0}' },
      { text: 'Ich bringe meine Punkte vor, auch wenn es unbequem ist', score: 7, emoji: '\u{1F5E3}\uFE0F' },
      { text: 'Ich gebe meistens nach, um Konflikte zu vermeiden', score: 4, emoji: '\u{1F54A}\uFE0F' },
      { text: 'Ich schweige und \u00E4rgere mich innerlich', score: 1, emoji: '\u{1F910}' },
    ]},
    { scenario: 'Du schreibst eine wichtige E-Mail an einen C-Level Manager.', options: [
      { text: 'Pr\u00E4gnant, auf den Punkt, mit klarem Call-to-Action', score: 10, emoji: '\u{1F3AF}' },
      { text: 'Professionell formuliert mit gutem Aufbau', score: 7, emoji: '\u{1F4DD}' },
      { text: 'Ich \u00FCberarbeite sie 5x und bin trotzdem unsicher', score: 4, emoji: '\u{1F504}' },
      { text: 'Ich lasse jemand anderen die Mail schreiben', score: 1, emoji: '\u{1F64B}' },
    ]},
    { scenario: 'Ein neuer Kollege hat etwas nicht verstanden. Du erkl\u00E4rst es:', options: [
      { text: 'Klar, geduldig und mit Beispielen angepasst an sein Level', score: 10, emoji: '\u{1F4A1}' },
      { text: 'Ich erkl\u00E4re es gerne, aber manchmal zu detailliert', score: 7, emoji: '\u{1F4DA}' },
      { text: 'Ich verweise auf Dokumentation oder andere Kollegen', score: 4, emoji: '\u{1F449}' },
      { text: 'Ich werde ungeduldig, wenn jemand es nicht schnell versteht', score: 1, emoji: '\u{1F612}' },
    ]},
    { scenario: 'Du merkst, dass dein Gegen\u00FCber in einem Gespr\u00E4ch abschaltet.', options: [
      { text: 'Ich passe sofort meinen Stil an und stelle eine Frage', score: 10, emoji: '\u{1F50D}' },
      { text: 'Ich bemerke es und versuche k\u00FCrzer zu werden', score: 7, emoji: '\u{1F4CF}' },
      { text: 'Ich merke es oft erst danach', score: 4, emoji: '\u{1F914}' },
      { text: 'Mir f\u00E4llt so etwas selten auf', score: 1, emoji: '\u{1F636}' },
    ]},
  ],
  sozialkompetenz: [
    { scenario: 'Zwei Kollegen streiten sich offen im B\u00FCro. Du:', options: [
      { text: 'Ich vermittle diplomatisch und finde einen Kompromiss', score: 10, emoji: '\u2696\uFE0F' },
      { text: 'Ich spreche sp\u00E4ter einzeln mit beiden', score: 7, emoji: '\u{1F4AC}' },
      { text: 'Ich halte mich raus \u2014 nicht mein Problem', score: 4, emoji: '\u{1F645}' },
      { text: 'Konflikte machen mich so unwohl, dass ich den Raum verlasse', score: 1, emoji: '\u{1F6B6}' },
    ]},
    { scenario: 'Ein neuer Mitarbeiter wirkt am ersten Tag verloren. Du:', options: [
      { text: 'Ich gehe aktiv auf ihn zu und biete Hilfe an', score: 10, emoji: '\u{1F91D}' },
      { text: 'Ich stelle mich vor und sage, er kann jederzeit fragen', score: 7, emoji: '\u{1F44B}' },
      { text: 'Wenn er fragt, helfe ich gerne', score: 4, emoji: '\u{1F44D}' },
      { text: 'Das ist Aufgabe von HR, nicht meine', score: 1, emoji: '\u{1F937}' },
    ]},
    { scenario: 'Bei einem Teamabend sitzt du neben jemandem, den du nicht kennst.', options: [
      { text: 'Perfekt \u2014 ich liebe es, neue Leute kennenzulernen', score: 10, emoji: '\u{1F929}' },
      { text: 'Ich starte ein Gespr\u00E4ch und finde Gemeinsamkeiten', score: 7, emoji: '\u{1F60A}' },
      { text: 'Ich warte, bis die andere Person das Gespr\u00E4ch beginnt', score: 4, emoji: '\u{1F610}' },
      { text: 'Ich f\u00FChle mich unwohl und schaue aufs Handy', score: 1, emoji: '\u{1F4F1}' },
    ]},
    { scenario: 'Ein Teammitglied leistet seit Wochen weniger. Das Team leidet darunter.', options: [
      { text: 'Ich suche das Gespr\u00E4ch und frage, wie ich helfen kann', score: 10, emoji: '\u{1F4AC}' },
      { text: 'Ich spreche es im Team an, konstruktiv', score: 7, emoji: '\u{1F465}' },
      { text: 'Ich kompensiere still seine Arbeit', score: 4, emoji: '\u{1F62A}' },
      { text: 'Ich beschwere mich beim Chef', score: 1, emoji: '\u{1F4E2}' },
    ]},
    { scenario: 'Du musst mit jemandem zusammenarbeiten, den du pers\u00F6nlich nicht magst.', options: [
      { text: 'Professionell \u2014 pers\u00F6nliche Differenzen trenne ich von der Arbeit', score: 10, emoji: '\u{1F454}' },
      { text: 'Ich gebe mir M\u00FChe, es funktioniert meistens', score: 7, emoji: '\u{1F44C}' },
      { text: 'Es f\u00E4llt mir schwer, meine Abneigung zu verbergen', score: 4, emoji: '\u{1F612}' },
      { text: 'Ich vermeide die Zusammenarbeit wo es geht', score: 1, emoji: '\u{1F6AB}' },
    ]},
  ],
  sozialisationskompetenz: [
    { scenario: 'Du wechselst in ein neues Unternehmen mit komplett anderer Kultur.', options: [
      { text: 'Ich beobachte, lerne und passe mich bewusst an', score: 10, emoji: '\u{1F50D}' },
      { text: 'Ich bin offen und versuche, schnell Anschluss zu finden', score: 7, emoji: '\u{1F91D}' },
      { text: 'Ich brauche lange, um mich wohlzuf\u00FChlen', score: 4, emoji: '\u{1F422}' },
      { text: 'Ich vermisse mein altes Team und vergleiche st\u00E4ndig', score: 1, emoji: '\u{1F622}' },
    ]},
    { scenario: 'Dein Team wird international \u2014 pl\u00F6tzlich sind 5 verschiedene Kulturen vertreten.', options: [
      { text: 'Fantastisch! Ich liebe kulturelle Vielfalt', score: 10, emoji: '\u{1F30D}' },
      { text: 'Ich bin neugierig und offen f\u00FCr andere Arbeitsweisen', score: 7, emoji: '\u{1F914}' },
      { text: 'Ich finde es manchmal anstrengend, alles zu ber\u00FCcksichtigen', score: 4, emoji: '\u{1F62B}' },
      { text: 'Ich bevorzuge ein homogenes Team', score: 1, emoji: '\u{1F3E0}' },
    ]},
    { scenario: 'Bei einer Konferenz kennst du niemanden. 200 Leute im Raum.', options: [
      { text: 'Ich spreche aktiv 5-10 Leute an und sammle Kontakte', score: 10, emoji: '\u{1F4BC}' },
      { text: 'Ich suche eine offene Gruppe und schlie\u00DFe mich an', score: 7, emoji: '\u{1F465}' },
      { text: 'Ich bleibe am Buffet und hoffe, angesprochen zu werden', score: 4, emoji: '\u{1F37D}\uFE0F' },
      { text: 'Am liebsten w\u00FCrde ich sofort wieder gehen', score: 1, emoji: '\u{1F6AA}' },
    ]},
    { scenario: 'Deine Abteilung wird umstrukturiert. Neues Team, neuer Chef, neue Prozesse.', options: [
      { text: 'Ich sehe es als Chance und gestalte aktiv mit', score: 10, emoji: '\u{1F680}' },
      { text: 'Ich passe mich an, auch wenn es unbequem ist', score: 7, emoji: '\u{1F504}' },
      { text: 'Ich hadere mit der Ver\u00E4nderung und brauche Zeit', score: 4, emoji: '\u{1F615}' },
      { text: 'Ich \u00FCberlege, ob ich nicht lieber k\u00FCndige', score: 1, emoji: '\u{1F6AA}' },
    ]},
    { scenario: 'Du ziehst f\u00FCr den Job in eine neue Stadt, wo du niemanden kennst.', options: [
      { text: 'Abenteuer! Ich baue mir schnell ein neues Netzwerk auf', score: 10, emoji: '\u{1F31F}' },
      { text: 'Aufregend und etwas nerv\u00F6s, aber ich freue mich', score: 7, emoji: '\u{1F60A}' },
      { text: 'Ich habe Angst vor der Einsamkeit', score: 4, emoji: '\u{1F614}' },
      { text: 'Ich w\u00FCrde das nur tun, wenn es absolut nicht anders geht', score: 1, emoji: '\u{1F6AB}' },
    ]},
  ],
  praesentation: [
    { scenario: '100 Leute, Spotlight, B\u00FChne. Du sollst eine Keynote halten.', options: [
      { text: 'Das ist mein Element \u2014 ich liebe es, auf der B\u00FChne zu stehen', score: 10, emoji: '\u{1F3A4}' },
      { text: 'Aufgeregt, aber gut vorbereitet schaffe ich das', score: 7, emoji: '\u{1F4AA}' },
      { text: 'Mir wird schlecht bei dem Gedanken, aber ich w\u00FCrde es versuchen', score: 4, emoji: '\u{1F630}' },
      { text: 'Ausgeschlossen \u2014 das \u00FCberlasse ich anderen', score: 1, emoji: '\u{1F645}' },
    ]},
    { scenario: 'Mitten in deiner Pr\u00E4sentation f\u00E4llt der Beamer aus. Was jetzt?', options: [
      { text: 'Ich improvisiere souver\u00E4n und mache ohne Slides weiter', score: 10, emoji: '\u{1F60E}' },
      { text: 'Ich mache eine kurze Pause und finde eine L\u00F6sung', score: 7, emoji: '\u{1F504}' },
      { text: 'Ich gerate in Panik, fange mich aber', score: 4, emoji: '\u{1F630}' },
      { text: 'Ich bitte darum, die Pr\u00E4sentation zu verschieben', score: 1, emoji: '\u{1F64F}' },
    ]},
    { scenario: 'Nach deiner Pr\u00E4sentation stellt jemand eine aggressive Frage.', options: [
      { text: 'Ich bleibe ruhig und beantworte sie sachlich', score: 10, emoji: '\u{1F9D0}' },
      { text: 'Ich versuche diplomatisch zu antworten', score: 7, emoji: '\u{1F4AC}' },
      { text: 'Ich werde unsicher und stottere', score: 4, emoji: '\u{1F633}' },
      { text: 'Ich werde defensiv oder aggressiv', score: 1, emoji: '\u{1F620}' },
    ]},
    { scenario: 'Du sollst dein Team von einer unpopul\u00E4ren Entscheidung \u00FCberzeugen.', options: [
      { text: 'Ich baue eine \u00FCberzeugende Story mit Fakten und Vision', score: 10, emoji: '\u{1F4CA}' },
      { text: 'Ich erkl\u00E4re die Gr\u00FCnde offen und h\u00F6re Bedenken an', score: 7, emoji: '\u{1F4AC}' },
      { text: 'Ich sage es einfach und hoffe auf Akzeptanz', score: 4, emoji: '\u{1F91E}' },
      { text: 'Ich lasse es meinen Chef kommunizieren', score: 1, emoji: '\u{1F449}' },
    ]},
    { scenario: 'Wie bereitest du dich auf eine wichtige Pr\u00E4sentation vor?', options: [
      { text: 'Story, Struktur, ge\u00FCbt, Backup-Plan, Probelauf', score: 10, emoji: '\u{1F3AF}' },
      { text: 'Gute Slides, einmal durchgesprochen', score: 7, emoji: '\u{1F4DD}' },
      { text: 'Slides am Vorabend, den Rest improvisiere ich', score: 4, emoji: '\u{1F937}' },
      { text: 'Ich bereite mich kaum vor und hoffe auf das Beste', score: 1, emoji: '\u{1F91E}' },
    ]},
  ],
  emotionale_intelligenz: [
    { scenario: 'Dein Kollege ist offensichtlich gestresst und schnauzt dich an.', options: [
      { text: 'Ich erkenne seinen Stress und reagiere empathisch', score: 10, emoji: '\u2764\uFE0F' },
      { text: 'Ich nehme es nicht pers\u00F6nlich und spreche ihn sp\u00E4ter an', score: 7, emoji: '\u{1F44D}' },
      { text: 'Es verletzt mich, aber ich sage nichts', score: 4, emoji: '\u{1F614}' },
      { text: 'Ich schnauze zur\u00FCck', score: 1, emoji: '\u{1F620}' },
    ]},
    { scenario: 'Du merkst, dass du w\u00FCtend bist, bevor du in ein wichtiges Meeting gehst.', options: [
      { text: 'Ich nehme mir 5 Minuten, atme durch und reguliere mich', score: 10, emoji: '\u{1F9D8}' },
      { text: 'Ich versuche die Wut beiseitezuschieben', score: 7, emoji: '\u{1F636}' },
      { text: 'Ich gehe rein und hoffe, dass man es nicht merkt', score: 4, emoji: '\u{1F610}' },
      { text: 'Meine Emotionen bestimmen meistens mein Verhalten', score: 1, emoji: '\u{1F4A5}' },
    ]},
    { scenario: 'Eine Kollegin weint im Meeting. Niemand reagiert. Du:', options: [
      { text: 'Ich spreche sie empathisch an und biete Unterst\u00FCtzung', score: 10, emoji: '\u{1F917}' },
      { text: 'Ich spreche sie nach dem Meeting unter vier Augen an', score: 7, emoji: '\u{1F4AC}' },
      { text: 'Ich f\u00FChle mich unwohl und wei\u00DF nicht, was tun', score: 4, emoji: '\u{1F615}' },
      { text: 'Emotionen geh\u00F6ren nicht ins B\u00FCro', score: 1, emoji: '\u{1F610}' },
    ]},
    { scenario: 'Du erh\u00E4ltst eine Bef\u00F6rderung. Dein Kollege, der auch kandidiert hat, nicht.', options: [
      { text: 'Ich freue mich und spreche empathisch mit ihm dar\u00FCber', score: 10, emoji: '\u{1F91D}' },
      { text: 'Ich feiere leise und bin sensibel ihm gegen\u00FCber', score: 7, emoji: '\u{1F60C}' },
      { text: 'Ich freue mich offen und denke nicht weiter dar\u00FCber nach', score: 4, emoji: '\u{1F389}' },
      { text: 'Mir ist egal, wie er sich f\u00FChlt \u2014 ich habe gewonnen', score: 1, emoji: '\u{1F3C6}' },
    ]},
    { scenario: 'Nach einem langen Tag bemerkst du, dass du gereizt auf alles reagierst.', options: [
      { text: 'Ich erkenne das Muster und ergreife sofort Gegenma\u00DFnahmen', score: 10, emoji: '\u{1F9E0}' },
      { text: 'Ich merke es und versuche mich zusammenzurei\u00DFen', score: 7, emoji: '\u{1F504}' },
      { text: 'Ich bemerke es erst, wenn jemand mich darauf hinweist', score: 4, emoji: '\u{1F914}' },
      { text: 'Ich merke es meistens gar nicht', score: 1, emoji: '\u{1F636}' },
    ]},
  ],
  charisma: [
    { scenario: 'Du betrittst einen Raum voller Fremder. Was passiert?', options: [
      { text: 'Ich sp\u00FCre Blicke und strahle Selbstsicherheit aus', score: 10, emoji: '\u2728' },
      { text: 'Ich trete freundlich auf und komme schnell ins Gespr\u00E4ch', score: 7, emoji: '\u{1F60A}' },
      { text: 'Ich suche eine vertraute Person oder Ecke', score: 4, emoji: '\u{1F50D}' },
      { text: 'Ich f\u00FChle mich unsichtbar', score: 1, emoji: '\u{1F47B}' },
    ]},
    { scenario: 'Du erz\u00E4hlst eine Geschichte auf einer Party. Die Reaktion:', options: [
      { text: 'Alle h\u00F6ren gebannt zu und lachen an den richtigen Stellen', score: 10, emoji: '\u{1F3AD}' },
      { text: 'Die meisten h\u00F6ren zu und reagieren positiv', score: 7, emoji: '\u{1F44D}' },
      { text: 'Manche h\u00F6ren zu, andere schweifen ab', score: 4, emoji: '\u{1F615}' },
      { text: 'Ich erz\u00E4hle selten Geschichten in Gruppen', score: 1, emoji: '\u{1F910}' },
    ]},
    { scenario: 'Ein Recruiter beschreibt dich nach einem Gespr\u00E4ch. Was w\u00FCrde er sagen?', options: [
      { text: '"Beeindruckende Pers\u00F6nlichkeit, starke Ausstrahlung"', score: 10, emoji: '\u{1F31F}' },
      { text: '"Sympathisch und kompetent"', score: 7, emoji: '\u{1F60A}' },
      { text: '"Nett, aber unauff\u00E4llig"', score: 4, emoji: '\u{1F610}' },
      { text: '"Kann mich kaum an ihn/sie erinnern"', score: 1, emoji: '\u{1F47B}' },
    ]},
    { scenario: 'Du sollst jemanden motivieren, der gerade aufgeben will.', options: [
      { text: 'Ich finde die richtigen Worte und entz\u00FCnde wieder ein Feuer', score: 10, emoji: '\u{1F525}' },
      { text: 'Ich h\u00F6re zu und ermutige mit konkreten Vorschl\u00E4gen', score: 7, emoji: '\u{1F4AA}' },
      { text: 'Ich versuche es, bin aber unsicher ob es wirkt', score: 4, emoji: '\u{1F914}' },
      { text: 'Das liegt mir nicht \u2014 ich bin kein Motivator', score: 1, emoji: '\u{1F937}' },
    ]},
    { scenario: 'Nach einem Vortrag kommen Leute auf dich zu. Wie viele?', options: [
      { text: 'Mehrere \u2014 sie wollen mehr erfahren und mich kennenlernen', score: 10, emoji: '\u{1F465}' },
      { text: 'Ein paar \u2014 mit netten Kommentaren', score: 7, emoji: '\u{1F44B}' },
      { text: 'Vielleicht einer, h\u00F6flich', score: 4, emoji: '\u{1F44D}' },
      { text: 'Niemand \u2014 ich verschwinde schnell', score: 1, emoji: '\u{1F6B6}' },
    ]},
  ],
  resilienz: [
    { scenario: 'Du bekommst eine Absage f\u00FCr deinen Traumjob. Deine Reaktion:', options: [
      { text: 'Entt\u00E4uscht, aber ich lerne daraus und bewerbe mich weiter', score: 10, emoji: '\u{1F525}' },
      { text: 'Ich brauche einen Tag, dann geht es weiter', score: 7, emoji: '\u{1F4AA}' },
      { text: 'Ich zweifle an mir und brauche Wochen um mich zu erholen', score: 4, emoji: '\u{1F614}' },
      { text: 'Ich gebe auf und bewerbe mich nie wieder auf so einen Job', score: 1, emoji: '\u{1F6AB}' },
    ]},
    { scenario: 'Drei Dinge gehen gleichzeitig schief: Projekt verz\u00F6gert, Auto kaputt, Streit mit Partner.', options: [
      { text: 'Ich priorisiere, l\u00F6se eins nach dem anderen', score: 10, emoji: '\u{1F9E0}' },
      { text: 'Stressig, aber ich halte durch', score: 7, emoji: '\u{1F62C}' },
      { text: 'Ich f\u00FChle mich \u00FCberw\u00E4ltigt und funktioniere nur noch', score: 4, emoji: '\u{1F9DF}' },
      { text: 'Ich breche zusammen und brauche Hilfe', score: 1, emoji: '\u{1F62D}' },
    ]},
    { scenario: 'Du wirst im Job ungerecht behandelt. Dein Chef ignoriert deinen Beitrag.', options: [
      { text: 'Ich spreche es klar an und fordere Anerkennung ein', score: 10, emoji: '\u{1F4AC}' },
      { text: 'Es frustriert mich, aber ich suche einen konstruktiven Weg', score: 7, emoji: '\u{1F504}' },
      { text: 'Ich schlucke es runter und bin frustriert', score: 4, emoji: '\u{1F620}' },
      { text: 'Ich gebe innerlich auf und mache nur noch Dienst nach Vorschrift', score: 1, emoji: '\u{1F9DF}' },
    ]},
    { scenario: 'Wie schnell erholst du dich nach einem gro\u00DFen R\u00FCckschlag?', options: [
      { text: 'Schnell \u2014 R\u00FCckschl\u00E4ge sind Teil des Weges', score: 10, emoji: '\u{1F680}' },
      { text: 'Ein paar Tage, dann bin ich wieder motiviert', score: 7, emoji: '\u{1F4C8}' },
      { text: 'Wochen \u2014 es nagt lange an mir', score: 4, emoji: '\u23F3' },
      { text: 'Ich erhole mich kaum \u2014 jeder R\u00FCckschlag h\u00E4uft sich', score: 1, emoji: '\u{1F4C9}' },
    ]},
    { scenario: 'Dein Lieblingsprojekt wird gestrichen. 6 Monate Arbeit umsonst.', options: [
      { text: 'Ich sichere die Learnings und nutze sie f\u00FCr das n\u00E4chste Projekt', score: 10, emoji: '\u{1F4A1}' },
      { text: '\u00C4rgerlich, aber so ist Business', score: 7, emoji: '\u{1F937}' },
      { text: 'Ich bin lange frustriert und demotiviert', score: 4, emoji: '\u{1F61E}' },
      { text: 'Ich verliere das Vertrauen in mein Unternehmen', score: 1, emoji: '\u{1F494}' },
    ]},
  ],
  fuehrung: [
    { scenario: 'Dein Team schafft die Deadline nicht. Was tust du?', options: [
      { text: 'Ich priorisiere mit dem Team, kommuniziere klar nach oben, und packe mit an', score: 10, emoji: '\u{1F451}' },
      { text: 'Ich helfe wo ich kann und motiviere das Team', score: 7, emoji: '\u{1F4AA}' },
      { text: 'Ich erh\u00F6he den Druck und erwarte mehr Einsatz', score: 4, emoji: '\u{1F4A2}' },
      { text: 'Ich gebe die Verantwortung ab und melde es meinem Chef', score: 1, emoji: '\u{1F449}' },
    ]},
    { scenario: 'Ein Teammitglied macht einen gro\u00DFen Fehler, der Konsequenzen hat.', options: [
      { text: 'Ich sch\u00FCtze das Teammitglied nach au\u00DFen und kl\u00E4re intern', score: 10, emoji: '\u{1F6E1}\uFE0F' },
      { text: 'Ich bespreche den Fehler konstruktiv im 1:1', score: 7, emoji: '\u{1F4AC}' },
      { text: 'Ich zeige meine Entt\u00E4uschung deutlich', score: 4, emoji: '\u{1F612}' },
      { text: 'Ich mache den Fehler \u00F6ffentlich als Warnung f\u00FCr andere', score: 1, emoji: '\u{1F4E2}' },
    ]},
    { scenario: 'Du musst eine schwierige Entscheidung treffen, die nicht alle gl\u00FCcklich macht.', options: [
      { text: 'Ich entscheide faktenbasiert, kommuniziere transparent und stehe dazu', score: 10, emoji: '\u{1F3AF}' },
      { text: 'Ich w\u00E4ge ab, entscheide und erkl\u00E4re meine Gr\u00FCnde', score: 7, emoji: '\u2696\uFE0F' },
      { text: 'Ich z\u00F6gere lange und versuche es allen recht zu machen', score: 4, emoji: '\u{1F504}' },
      { text: 'Ich vermeide die Entscheidung so lange wie m\u00F6glich', score: 1, emoji: '\u{1F648}' },
    ]},
    { scenario: 'Du \u00FCbernimmst ein demoralisiertes Team. Dein erster Schritt:', options: [
      { text: 'Zuh\u00F6ren, Vertrauen aufbauen, gemeinsame Vision entwickeln', score: 10, emoji: '\u{1F91D}' },
      { text: 'Quick Wins identifizieren und erste Erfolge feiern', score: 7, emoji: '\u{1F389}' },
      { text: 'Klare Ziele setzen und Leistung einfordern', score: 4, emoji: '\u{1F4CB}' },
      { text: 'Ich bin unsicher, wie man ein Team dreht', score: 1, emoji: '\u{1F937}' },
    ]},
    { scenario: 'Dein Star-Performer will k\u00FCndigen. Was tust du?', options: [
      { text: 'Sofortiges 1:1, Gr\u00FCnde verstehen, individuelles Angebot machen', score: 10, emoji: '\u{1F4AC}' },
      { text: 'Ich versuche herauszufinden, was ihn h\u00E4lt', score: 7, emoji: '\u{1F50D}' },
      { text: 'Schade, aber jeder ist ersetzbar', score: 4, emoji: '\u{1F937}' },
      { text: 'Ich lasse ihn gehen, ohne gro\u00DF zu reagieren', score: 1, emoji: '\u{1F44B}' },
    ]},
  ],
};

// ============================================================
// 39 AUSWERTUNGSTEXTE (3 pro Feld: niedrig, mittel, hoch)
// ============================================================
const AUSWERTUNGSTEXTE = {
  selbstwertgefuehl: {
    low: 'Das Benennen der eigenen St\u00E4rken ist f\u00FCr Sie mit einem nicht zu untersch\u00E4tzenden Aufwand verbunden. In herausfordernden Situationen zweifeln Sie daran, ob Sie auf Ihre F\u00E4higkeiten vertrauen k\u00F6nnen. Ihr Karriereindex zeigt: Hier liegt enormes Potenzial. Denn Ihr Einkommen und Ihre Lebensqualit\u00E4t stehen und fallen mit Ihrem Selbstwertempfinden.',
    mid: 'Sie wissen, wo Ihre St\u00E4rken liegen und vertrauen in der Regel auf Ihre F\u00E4higkeiten. Allerdings f\u00E4llt es Ihnen nicht immer leicht, andere Menschen aktiv von sich zu \u00FCberzeugen. Mit gezieltem Training k\u00F6nnen Sie dieses Feld zur echten Karriere-Waffe ausbauen.',
    high: 'Hervorragend \u2014 Sie haben ein starkes Selbstwertgef\u00FChl und strahlen das auch aus. Sie kennen Ihre St\u00E4rken, k\u00F6nnen sie kommunizieren und \u00FCberzeugen andere von Ihrem Wert. Diese Kompetenz ist Ihr Karriere-Turbo.',
  },
  prioritaeten: {
    low: 'Die Priorisierung von Aufgaben f\u00E4llt Ihnen schwer. Sie neigen dazu, Dringendes vor Wichtigem zu erledigen und verlieren dadurch den Fokus auf strategische Ziele. Ein strukturierter Ansatz kann hier einen enormen Unterschied machen.',
    mid: 'Sie haben ein Grundgef\u00FChl f\u00FCr Priorit\u00E4ten, k\u00F6nnten aber strategischer vorgehen. Manchmal lassen Sie sich von der Masse der Aufgaben \u00FCberw\u00E4ltigen. Mit den richtigen Methoden heben Sie Ihre Produktivit\u00E4t auf das n\u00E4chste Level.',
    high: 'Sie sind ein Meister der Priorisierung. Sie unterscheiden klar zwischen wichtig und dringend, setzen Grenzen und arbeiten fokussiert an den Dingen, die den gr\u00F6\u00DFten Impact haben.',
  },
  selbstreflexion: {
    low: 'Selbstreflexion ist derzeit kein fester Bestandteil Ihres Alltags. Sie neigen dazu, aus Misserfolgen keine systematischen Learnings abzuleiten. Dabei ist genau diese F\u00E4higkeit der Schl\u00FCssel zu nachhaltigem Karrierewachstum.',
    mid: 'Sie reflektieren gelegentlich \u00FCber Ihr Handeln und k\u00F6nnen Feedback annehmen. Ein regelm\u00E4\u00DFigerer Reflexionsprozess w\u00FCrde Ihnen helfen, blinde Flecken zu erkennen und schneller zu wachsen.',
    high: 'Sie sind hervorragend darin, Ihr eigenes Handeln zu hinterfragen und daraus zu lernen. Diese F\u00E4higkeit zur Metakognition ist ein enormer Wettbewerbsvorteil.',
  },
  selbstfuersorge: {
    low: 'Ihre Work-Life-Balance ist deutlich aus dem Gleichgewicht. Sie neigen dazu, eigene Bed\u00FCrfnisse hintanzustellen und Grenzen nicht zu setzen. Langfristig gef\u00E4hrdet das sowohl Ihre Gesundheit als auch Ihre Karriere.',
    mid: 'Sie achten grundlegend auf sich, aber in stressigen Phasen vernachl\u00E4ssigen Sie Ihre Selbstf\u00FCrsorge. Klare Routinen und Grenzen k\u00F6nnen hier den Unterschied machen.',
    high: 'Sie pflegen einen gesunden Umgang mit sich selbst, setzen klare Grenzen und sorgen aktiv f\u00FCr Ausgleich. Diese emotionale Hygiene ist die Basis f\u00FCr nachhaltige Hochleistung.',
  },
  kompetenzbewusstsein: {
    low: 'Sie tun sich schwer damit, Ihre eigenen Kompetenzen klar zu benennen und Ihren Marktwert einzusch\u00E4tzen. Das f\u00FChrt dazu, dass Sie Chancen nicht ergreifen und in Verhandlungen unter Ihrem Wert bleiben.',
    mid: 'Sie haben ein Grundbewusstsein f\u00FCr Ihre Kompetenzen, k\u00F6nnten aber strategischer damit umgehen. Eine klarere Positionierung w\u00FCrde Ihre Karrierechancen deutlich verbessern.',
    high: 'Sie kennen Ihren Marktwert, k\u00F6nnen Ihre Kompetenzen klar benennen und positionieren sich selbstbewusst. Das ist die Grundlage f\u00FCr erfolgreiche Gehaltsverhandlungen.',
  },
  kommunikation: {
    low: 'Ihre Kommunikation l\u00E4sst Raum f\u00FCr Verbesserung. Schwierige Gespr\u00E4che vermeiden Sie und Ihre Botschaften kommen nicht immer klar an. Gezielte \u00DCbung kann hier Wunder wirken.',
    mid: 'Sie kommunizieren solide, aber in Drucksituationen oder mit schwierigen Gegen\u00FCbern gibt es Verbesserungspotenzial. Klarheit und \u00DCberzeugungskraft lassen sich trainieren.',
    high: 'Sie sind ein herausragender Kommunikator. Klar, \u00FCberzeugend und empathisch \u2014 Sie passen Ihre Botschaft an Ihr Gegen\u00FCber an und kommen immer auf den Punkt.',
  },
  sozialkompetenz: {
    low: 'Der Umgang mit anderen Menschen kostet Sie Energie. Konflikte vermeiden Sie und in sozialen Situationen f\u00FChlen Sie sich unwohl. Gezielte Schritte k\u00F6nnen hier enormen Impact haben.',
    mid: 'Sie kommen mit den meisten Menschen gut aus, aber in Konfliktsituationen oder mit schwierigen Pers\u00F6nlichkeiten sto\u00DFen Sie an Ihre Grenzen. Hier liegt ungenutztes Potenzial.',
    high: 'Sie bewegen sich sicher in jeder sozialen Situation. Konflikte l\u00F6sen Sie diplomatisch und Sie bauen schnell Vertrauen auf. Eine Schl\u00FCsselkompetenz f\u00FCr F\u00FChrungsrollen.',
  },
  sozialisationskompetenz: {
    low: 'Ver\u00E4nderungen fallen Ihnen schwer. Neue Umgebungen, Teams oder Kulturen verunsichern Sie. In der heutigen Arbeitswelt ist Anpassungsf\u00E4higkeit jedoch essentiell f\u00FCr Karrierewachstum.',
    mid: 'Sie passen sich an neue Situationen an, brauchen aber Zeit. In einer Welt, die sich immer schneller ver\u00E4ndert, w\u00FCrde schnellere Adaptionsf\u00E4higkeit Ihre Karrierechancen deutlich erh\u00F6hen.',
    high: 'Sie sind ein Chamäleon im besten Sinne. Neue Umgebungen, Teams und Kulturen bereichern Sie. Diese Anpassungsf\u00E4higkeit ist in der globalen Arbeitswelt Gold wert.',
  },
  praesentation: {
    low: 'Pr\u00E4sentationen und \u00F6ffentliches Sprechen bereiten Ihnen erhebliches Unbehagen. Da Sichtbarkeit jedoch entscheidend f\u00FCr den Karriereaufstieg ist, lohnt sich gezieltes Training hier besonders.',
    mid: 'Sie k\u00F6nnen pr\u00E4sentieren, aber Ihre Wirkung k\u00F6nnte st\u00E4rker sein. Mit besserer Vorbereitung und mehr Souver\u00E4nit\u00E4t bei Zwischenfragen werden Sie \u00FCberzeugender.',
    high: 'Sie sind ein Natural auf der B\u00FChne. Sicher, \u00FCberzeugend und charismatisch \u2014 Ihre Pr\u00E4sentationsf\u00E4higkeit \u00F6ffnet Ihnen T\u00FCren, die anderen verschlossen bleiben.',
  },
  emotionale_intelligenz: {
    low: 'Das Erkennen und Steuern von Emotionen \u2014 bei sich selbst und anderen \u2014 ist eine Herausforderung f\u00FCr Sie. Emotionale Intelligenz ist jedoch der st\u00E4rkste Pr\u00E4diktor f\u00FCr beruflichen Erfolg.',
    mid: 'Sie sp\u00FCren Emotionen bei anderen und reagieren meistens angemessen. In Drucksituationen k\u00F6nnte Ihre emotionale Regulation jedoch st\u00E4rker sein.',
    high: 'Ihre emotionale Intelligenz ist au\u00DFergew\u00F6hnlich. Sie erkennen feinste Nuancen bei anderen, regulieren Ihre eigenen Emotionen und schaffen dadurch Vertrauen und Verbindung.',
  },
  charisma: {
    low: 'Ihre Ausstrahlung und Pr\u00E4senz in Gruppen k\u00F6nnte st\u00E4rker sein. Charisma ist erlernbar \u2014 und der R\u00FCckgrat jeder F\u00FChrungspers\u00F6nlichkeit.',
    mid: 'Sie haben eine sympathische Ausstrahlung, aber Ihr Charisma k\u00F6nnte magnetischer sein. Mit bewusstem Auftreten und Storytelling verst\u00E4rken Sie Ihre Wirkung.',
    high: 'Sie verf\u00FCgen \u00FCber eine beeindruckende Ausstrahlung. Menschen h\u00F6ren Ihnen zu, folgen Ihnen und erinnern sich an Sie. Diese nat\u00FCrliche Autorität ist ein Karriere-Beschleuniger.',
  },
  resilienz: {
    low: 'R\u00FCckschl\u00E4ge treffen Sie hart und die Erholung dauert lange. In einer Karriere voller Auf und Abs ist Resilienz jedoch die Schl\u00FCsselkompetenz, die Gewinner von Aufgebern unterscheidet.',
    mid: 'Sie erholen sich von R\u00FCckschl\u00E4gen, aber es kostet Sie Energie und Zeit. Mit den richtigen Strategien k\u00F6nnen Sie Ihre Widerstandskraft deutlich steigern.',
    high: 'Sie sind au\u00DFergew\u00F6hnlich widerstandsf\u00E4hig. R\u00FCckschl\u00E4ge betrachten Sie als Lernchancen und erholen sich schnell. Diese Resilienz ist Ihr Fundament f\u00FCr langfristigen Erfolg.',
  },
  fuehrung: {
    low: 'F\u00FChrung ist derzeit nicht Ihre St\u00E4rke. Entscheidungen treffen, Verantwortung \u00FCbernehmen und andere inspirieren \u2014 das sind F\u00E4higkeiten, die sich gezielt entwickeln lassen.',
    mid: 'Sie haben F\u00FChrungspotenzial, aber Ihre F\u00E4higkeit, Teams zu f\u00FChren und schwierige Entscheidungen zu treffen, k\u00F6nnte ausgepr\u00E4gter sein. Gezielte Entwicklung bringt Sie auf das n\u00E4chste Level.',
    high: 'Sie sind eine geborene F\u00FChrungsperson. Sie treffen mutige Entscheidungen, sch\u00FCtzen Ihr Team und inspirieren andere. Diese Kompetenz pr\u00E4destiniert Sie f\u00FCr C-Level-Positionen.',
  },
};

function getAuswertung(fieldId, score) {
  const texts = AUSWERTUNGSTEXTE[fieldId];
  if (!texts) return '';
  if (score <= 40) return texts.low;
  if (score <= 70) return texts.mid;
  return texts.high;
}

function getScoreLevel(score) {
  if (score >= 91) return { label: 'Exzellent', color: '#059669', badge: '\u{1F3C6}' };
  if (score >= 71) return { label: 'Stark', color: '#10B981', badge: '\u{1F4AA}' };
  if (score >= 51) return { label: 'Gut aufgestellt', color: '#F59E0B', badge: '\u{1F44D}' };
  if (score >= 31) return { label: 'Ausbauf\u00E4hig', color: '#F97316', badge: '\u{1F4C8}' };
  return { label: 'Gro\u00DFes Potenzial', color: '#EF4444', badge: '\u{1F331}' };
}

function calculateFieldScore(answers) {
  const sum = answers.reduce((a, b) => a + b, 0);
  return Math.round((sum / 50) * 100);
}

// ============================================================
// RADAR CHART (SVG)
// ============================================================
function RadarChart({ scores, size = 380 }) {
  const cx = size / 2, cy = size / 2, r = size * 0.36;
  const n = KOMPETENZFELDER.length;
  const rings = [20, 40, 60, 80, 100];

  const getPoint = (i, val) => {
    const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
    const dist = (val / 100) * r;
    return { x: cx + Math.cos(angle) * dist, y: cy + Math.sin(angle) * dist };
  };

  const dataPoints = KOMPETENZFELDER.map((f, i) => getPoint(i, scores[f.id] || 0));
  const path = dataPoints.map((p, i) => `${i === 0 ? 'M' : 'L'}${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ') + 'Z';

  return (
    <svg viewBox={`0 0 ${size} ${size}`} style={{ width: '100%', maxWidth: size }}>
      <defs>
        <radialGradient id="radarGrad" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="#CC1426" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#2563EB" stopOpacity="0.05" />
        </radialGradient>
      </defs>
      {/* Background rings */}
      {rings.map(ring => {
        const pts = Array.from({ length: n }, (_, i) => getPoint(i, ring));
        return <polygon key={ring} points={pts.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} fill={ring === 100 ? 'url(#radarGrad)' : 'none'} stroke="var(--grey-5)" strokeWidth="0.5" />;
      })}
      {/* Axis lines */}
      {KOMPETENZFELDER.map((_, i) => {
        const p = getPoint(i, 100);
        return <line key={i} x1={cx} y1={cy} x2={p.x} y2={p.y} stroke="var(--grey-5)" strokeWidth="0.5" />;
      })}
      {/* Data polygon */}
      <polygon points={dataPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ')} fill="rgba(204,20,38,0.12)" stroke="#CC1426" strokeWidth="2.5" strokeLinejoin="round" />
      {/* Data dots */}
      {dataPoints.map((p, i) => <circle key={i} cx={p.x} cy={p.y} r="4" fill="#CC1426" />)}
      {/* Labels */}
      {KOMPETENZFELDER.map((f, i) => {
        const angle = (Math.PI * 2 * i) / n - Math.PI / 2;
        const lx = cx + Math.cos(angle) * (r + 30);
        const ly = cy + Math.sin(angle) * (r + 30);
        return <text key={i} x={lx} y={ly} textAnchor="middle" dominantBaseline="middle" style={{ fontSize: 9, fontWeight: 600, fill: 'var(--ki-text-secondary)', fontFamily: 'Instrument Sans' }}>{f.icon}</text>;
      })}
    </svg>
  );
}

// ============================================================
// MAIN COMPONENT
// ============================================================
export default function AnalyseClient({ profile, existingSession, userId }) {
  const supabase = createClient();
  const [phase, setPhase] = useState(existingSession?.status === 'completed' ? 3 : existingSession?.status === 'in_progress' ? 2 : 1);
  const [fieldIndex, setFieldIndex] = useState(existingSession?.current_field || 0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(existingSession?.answers || {});
  const [fieldScores, setFieldScores] = useState(existingSession?.scores || {});
  const [showFieldResult, setShowFieldResult] = useState(false);
  const [showCategoryIntro, setShowCategoryIntro] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);
  const [dsgvoConsent, setDsgvoConsent] = useState(!!existingSession);
  const [showConfetti, setShowConfetti] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);
  const [resumePrompt, setResumePrompt] = useState(existingSession?.status === 'in_progress');

  const currentField = KOMPETENZFELDER[fieldIndex];
  const currentScenarios = currentField ? SZENARIEN[currentField.id] : [];
  const currentScenario = currentScenarios[questionIndex];
  const overallProgress = ((fieldIndex * 5 + questionIndex) / 65) * 100;

  // Check if category changed
  const prevCategory = fieldIndex > 0 ? KOMPETENZFELDER[fieldIndex - 1]?.category : null;
  const currentCategory = currentField?.category;

  const handleOptionClick = useCallback((option) => {
    setSelectedOption(option);
    setTimeout(() => {
      const fieldId = currentField.id;
      const fieldAnswers = answers[fieldId] || [];
      fieldAnswers[questionIndex] = option.score;
      const newAnswers = { ...answers, [fieldId]: fieldAnswers };
      setAnswers(newAnswers);
      setSelectedOption(null);

      if (questionIndex < 4) {
        setQuestionIndex(questionIndex + 1);
      } else {
        // Field complete
        const score = calculateFieldScore(newAnswers[fieldId]);
        const newScores = { ...fieldScores, [fieldId]: score };
        setFieldScores(newScores);
        setShowFieldResult(true);

        // Save progress
        supabase.from('analysis_sessions').upsert({
          user_id: userId,
          scores: newScores,
          answers: newAnswers,
          overall_score: Math.round(Object.values(newScores).reduce((a, b) => a + b, 0) / Object.keys(newScores).length),
          current_field: fieldIndex,
          status: fieldIndex >= 12 ? 'completed' : 'in_progress',
          completed_at: fieldIndex >= 12 ? new Date().toISOString() : null,
        }, { onConflict: 'user_id' });
      }
    }, 500);
  }, [currentField, answers, questionIndex, fieldScores, fieldIndex, supabase, userId]);

  const nextField = useCallback(async () => {
    setShowFieldResult(false);
    if (fieldIndex >= 12) {
      // All done!
      setPhase(3);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 4000);
      if (!xpAwarded) {
        awardPoints(supabase, userId, 'FIRST_ANALYSIS');
        setXpAwarded(true);
      }
      // Grant 30-day premium trial
      await supabase.from('profiles').update({
        subscription_plan: 'PREMIUM_TRIAL',
        subscription_status: 'active',
        subscription_ends_at: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000).toISOString(),
      }).eq('id', userId);
    } else {
      const nextIdx = fieldIndex + 1;
      const nextCat = KOMPETENZFELDER[nextIdx]?.category;
      if (nextCat !== currentCategory) {
        setShowCategoryIntro(true);
        setTimeout(() => {
          setShowCategoryIntro(false);
          setFieldIndex(nextIdx);
          setQuestionIndex(0);
        }, 2000);
      } else {
        setFieldIndex(nextIdx);
        setQuestionIndex(0);
      }
    }
  }, [fieldIndex, currentCategory, xpAwarded, supabase, userId]);

  const handleResume = (resume) => {
    setResumePrompt(false);
    if (resume) {
      setPhase(2);
      setFieldIndex((existingSession?.current_field || 0) + 1);
      setQuestionIndex(0);
    } else {
      setAnswers({});
      setFieldScores({});
      setFieldIndex(0);
      setQuestionIndex(0);
    }
  };

  // Sorted scores for results
  const sortedScores = useMemo(() => {
    return KOMPETENZFELDER
      .map(f => ({ ...f, score: fieldScores[f.id] || 0, level: getScoreLevel(fieldScores[f.id] || 0) }))
      .sort((a, b) => b.score - a.score);
  }, [fieldScores]);

  const overallScore = useMemo(() => {
    const vals = Object.values(fieldScores);
    return vals.length > 0 ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  }, [fieldScores]);

  // Impostor check
  const impostorDelta = useMemo(() => {
    const selfAware = fieldScores.selbstwertgefuehl || 50;
    const objectiveAvg = overallScore;
    return objectiveAvg - selfAware;
  }, [fieldScores, overallScore]);

  // ============================================================
  // RENDER
  // ============================================================

  // Confetti overlay
  const ConfettiOverlay = () => showConfetti ? (
    <div style={{ position: 'fixed', inset: 0, pointerEvents: 'none', zIndex: 100 }}>
      {Array.from({ length: 60 }, (_, i) => (
        <div key={i} style={{
          position: 'absolute', left: `${Math.random() * 100}%`, top: '-10px',
          width: `${6 + Math.random() * 8}px`, height: `${6 + Math.random() * 8}px`,
          borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          background: ['#CC1426', '#D4A017', '#2D6A4F', '#6366f1', '#f59e0b', '#ec4899'][Math.floor(Math.random() * 6)],
          animation: `confFall ${2 + Math.random() * 2}s ease-in forwards`,
          animationDelay: `${Math.random() * 1.5}s`,
        }} />
      ))}
      <style>{`@keyframes confFall { 0% { transform: translateY(0) rotate(0deg); opacity: 1; } 100% { transform: translateY(100vh) rotate(720deg); opacity: 0; } }`}</style>
    </div>
  ) : null;

  // CSS Animations
  const AnimStyles = () => (
    <style>{`
      @keyframes optPulse { 0% { transform: scale(1); } 50% { transform: scale(1.03); } 100% { transform: scale(1); } }
      @keyframes xpPop { 0% { transform: translateY(0); opacity: 1; } 100% { transform: translateY(-30px); opacity: 0; } }
      @keyframes slideIn { from { opacity: 0; transform: translateX(20px); } to { opacity: 1; transform: translateX(0); } }
    `}</style>
  );

  // PHASE 1: WELCOME
  if (phase === 1) {
    // Resume prompt
    if (resumePrompt) {
      const completed = Object.keys(fieldScores).length;
      return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <div className="card animate-in" style={{ maxWidth: 480, textAlign: 'center', padding: 48 }}>
            <div style={{ fontSize: 48, marginBottom: 16 }}>{'\u{1F504}'}</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>Weitermachen?</h2>
            <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', marginBottom: 24 }}>
              Du hast {completed}/13 Felder abgeschlossen. M\u00F6chtest du fortfahren?
            </p>
            <div style={{ display: 'flex', gap: 12 }}>
              <button className="btn btn-secondary" onClick={() => handleResume(false)} style={{ flex: 1 }}>Neu starten</button>
              <button className="btn btn-primary" onClick={() => handleResume(true)} style={{ flex: 1 }}>Weitermachen</button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <AnimStyles />
        <div className="card animate-in" style={{ maxWidth: 520, textAlign: 'center', padding: 48 }}>
          <div style={{ fontSize: 56, marginBottom: 16 }}>{'\u{1F9E0}'}</div>
          <h1 style={{ fontSize: 28, fontWeight: 700, letterSpacing: '-0.04em', marginBottom: 8 }}>Dein Karriere-Blutbild</h1>
          <p style={{ fontSize: 16, color: 'var(--ki-text-secondary)', marginBottom: 24, lineHeight: 1.6 }}>
            Die Blaupause f\u00FCr deine berufliche Zukunft
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 24, marginBottom: 32 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>13</div>
              <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Kompetenzfelder</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>~15</div>
              <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Minuten</div>
            </div>
            <div style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 24, fontWeight: 700 }}>65</div>
              <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>Szenarien</div>
            </div>
          </div>
          <label style={{ display: 'flex', alignItems: 'flex-start', gap: 10, textAlign: 'left', marginBottom: 24, cursor: 'pointer', fontSize: 13, color: 'var(--ki-text-secondary)' }}>
            <input type="checkbox" checked={dsgvoConsent} onChange={e => setDsgvoConsent(e.target.checked)} style={{ marginTop: 3, accentColor: 'var(--ki-red)', width: 16, height: 16, flexShrink: 0 }} />
            <span>Ich stimme der Verarbeitung meiner Analysedaten gem\u00E4\u00DF der <a href="/datenschutz" target="_blank" style={{ color: 'var(--ki-red)' }}>Datenschutzerkl\u00E4rung</a> zu.</span>
          </label>
          <button className="btn btn-primary" disabled={!dsgvoConsent} onClick={() => setPhase(2)} style={{ width: '100%', padding: '14px 24px', fontSize: 16, opacity: dsgvoConsent ? 1 : 0.5 }}>
            Analyse starten {'\u2192'}
          </button>
        </div>
      </div>
    );
  }

  // PHASE 2: SCENARIOS
  if (phase === 2) {
    // Category intro
    if (showCategoryIntro) {
      const nextCat = KOMPETENZFELDER[fieldIndex + 1]?.category;
      const intro = CATEGORY_INTROS[nextCat];
      return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <AnimStyles />
          <div className="animate-in" style={{ textAlign: 'center', maxWidth: 400 }}>
            <div style={{ fontSize: 64, marginBottom: 16 }}>{intro?.emoji}</div>
            <h2 style={{ fontSize: 22, fontWeight: 700, marginBottom: 8 }}>{nextCat}</h2>
            <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)' }}>{intro?.text}</p>
          </div>
        </div>
      );
    }

    // Field result
    if (showFieldResult) {
      const score = fieldScores[currentField.id] || 0;
      const level = getScoreLevel(score);
      return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <AnimStyles />
          <div className="card animate-in" style={{ maxWidth: 480, textAlign: 'center', padding: 40 }}>
            <div style={{ fontSize: 48, marginBottom: 8 }}>{currentField.icon}</div>
            <h2 style={{ fontSize: 20, fontWeight: 700, marginBottom: 16 }}>{currentField.name}</h2>

            {/* Score bar */}
            <div style={{ marginBottom: 16 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 6 }}>
                <span style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>{level.badge} {level.label}</span>
                <span style={{ fontSize: 18, fontWeight: 700, color: level.color }}>{score}%</span>
              </div>
              <div className="progress-bar" style={{ height: 8 }}>
                <div className="progress-bar-fill" style={{ width: `${score}%`, background: level.color, transition: 'width 1s ease' }} />
              </div>
            </div>

            <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.6, marginBottom: 20, textAlign: 'left' }}>
              {getAuswertung(currentField.id, score)}
            </p>

            <div style={{ padding: '10px 16px', background: 'rgba(204,20,38,0.06)', borderRadius: 'var(--r-md)', marginBottom: 20, fontSize: 14, fontWeight: 600, color: 'var(--ki-red)' }}>
              +50 XP {'\u{1F525}'} Feld abgeschlossen!
            </div>

            {fieldIndex < 12 && (
              <p style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', marginBottom: 16 }}>
                N\u00E4chstes Feld: {KOMPETENZFELDER[fieldIndex + 1]?.icon} {KOMPETENZFELDER[fieldIndex + 1]?.name}
              </p>
            )}

            <button className="btn btn-primary" onClick={nextField} style={{ width: '100%' }}>
              {fieldIndex >= 12 ? 'Ergebnis ansehen' : 'Weiter \u2192'}
            </button>
          </div>
        </div>
      );
    }

    // Scenario question
    if (!currentScenario) return null;

    return (
      <div className="page-container" style={{ maxWidth: 640 }}>
        <AnimStyles />
        {/* Top bar */}
        <div style={{ marginBottom: 24 }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
            <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>{currentCategory} {'>'} {currentField.name}</span>
            <span style={{ fontSize: 20 }}>{currentField.icon}</span>
          </div>
          {/* Progress bar */}
          <div className="progress-bar" style={{ height: 4 }}>
            <div className="progress-bar-fill" style={{ width: `${overallProgress}%`, transition: 'width 0.5s ease' }} />
          </div>
        </div>

        {/* Scenario card */}
        <div className="card" style={{ padding: 28, marginBottom: 20, borderLeft: `4px solid ${currentField.color}` }}>
          <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', marginBottom: 8 }}>{'\u{1F4CD}'} Szenario:</div>
          <p style={{ fontSize: 16, fontWeight: 500, lineHeight: 1.6 }}>{currentScenario.scenario}</p>
        </div>

        {/* Options 2x2 grid */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: 12 }}>
          {currentScenario.options.map((opt, i) => {
            const isSelected = selectedOption === opt;
            return (
              <button key={i} onClick={() => !selectedOption && handleOptionClick(opt)} className="card" style={{
                cursor: selectedOption ? 'default' : 'pointer', padding: 20, textAlign: 'left', border: isSelected ? '2px solid var(--ki-red)' : '2px solid transparent',
                background: isSelected ? 'rgba(204,20,38,0.06)' : 'var(--ki-card)',
                animation: isSelected ? 'optPulse 0.4s ease' : 'none',
                transition: 'all 0.2s ease', opacity: selectedOption && !isSelected ? 0.5 : 1,
              }}>
                <div style={{ fontSize: 24, marginBottom: 8 }}>{opt.emoji}</div>
                <div style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>{opt.text}</div>
              </button>
            );
          })}
        </div>

        {/* Scenario dots */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 6, marginTop: 20 }}>
          {[0, 1, 2, 3, 4].map(i => (
            <div key={i} style={{
              width: i === questionIndex ? 24 : 8, height: 8, borderRadius: 4,
              background: i < questionIndex ? 'var(--ki-red)' : i === questionIndex ? 'var(--ki-red)' : 'var(--grey-4)',
              transition: 'all 0.3s ease',
            }} />
          ))}
          <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginLeft: 8 }}>Szenario {questionIndex + 1}/5</span>
        </div>
      </div>
    );
  }

  // PHASE 3: KARRIERE-PHASE AUSWAHL
  if (phase === 3) {
    const KARRIERE_PHASEN_AUSWAHL = [
      { id: 'student', label: '🎓 Student/in', desc: 'Studium, Praktika, Berufseinstieg' },
      { id: 'einsteiger', label: '🚀 Berufseinsteiger (0-3 Jahre)', desc: 'Erste Festanstellung, Orientierung' },
      { id: 'professional', label: '💼 Berufserfahren (3-10 Jahre)', desc: 'Expertise vertiefen, Karriere beschleunigen' },
      { id: 'fuehrungskraft', label: '👑 Führungskraft', desc: 'Team leiten, strategisch denken' },
      { id: 'investor', label: '💰 Investor / Unternehmer', desc: 'Portfolio, Deals, Skalierung' },
    ];

    async function selectPhase(phaseId) {
      await supabase.from('profiles').update({
        phase: phaseId,
        onboarding_completed: true,
      }).eq('id', userId);
      setPhase(4);
    }

    return (
      <div className="page-container" style={{ maxWidth: 560 }}>
        <ConfettiOverlay />
        <AnimStyles />
        <div style={{ textAlign: 'center', marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🎯</div>
          <h1 className="page-title" style={{ marginBottom: 6 }}>In welcher Karrierephase bist du?</h1>
          <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.7 }}>
            Wir personalisieren alle E-Learnings für deine Phase. Du kannst das jederzeit im Profil ändern.
          </p>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {KARRIERE_PHASEN_AUSWAHL.map(p => (
            <button
              key={p.id}
              onClick={() => selectPhase(p.id)}
              className="card"
              style={{
                display: 'flex', alignItems: 'center', gap: 14,
                padding: '16px 20px', cursor: 'pointer', textAlign: 'left',
                border: '1px solid var(--ki-border)', transition: 'all 0.15s',
              }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = 'var(--ki-red)'; e.currentTarget.style.background = 'rgba(204,20,38,0.02)'; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = 'var(--ki-border)'; e.currentTarget.style.background = ''; }}
            >
              <span style={{ fontSize: 28 }}>{p.label.split(' ')[0]}</span>
              <div>
                <div style={{ fontSize: 15, fontWeight: 600 }}>{p.label.slice(p.label.indexOf(' ') + 1)}</div>
                <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>{p.desc}</div>
              </div>
            </button>
          ))}
        </div>
        <button onClick={() => setPhase(4)} style={{ marginTop: 16, fontSize: 12, color: 'var(--ki-text-tertiary)', background: 'none', border: 'none', cursor: 'pointer', textDecoration: 'underline' }}>
          Überspringen (Standard: Berufseinsteiger)
        </button>
      </div>
    );
  }

  // PHASE 4: RESULTS
  if (phase === 4 || phase === 3.5) {
    const top3 = sortedScores.slice(0, 3);
    const bottom3 = sortedScores.slice(-3).reverse();

    return (
      <div className="page-container" style={{ maxWidth: 720 }}>
        <ConfettiOverlay />
        <AnimStyles />

        <div style={{ textAlign: 'center', marginBottom: 32 }}>
          <h1 className="page-title">Dein Karriere-Blutbild<InfoTooltip moduleId="analyse" profile={profile} /></h1>
          <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)' }}>Erstellt am {new Date().toLocaleDateString('de-DE', { day: 'numeric', month: 'long', year: 'numeric' })}</p>
          <div style={{ fontSize: 48, fontWeight: 700, marginTop: 16 }}>{overallScore}%</div>
          <span className={`pill ${overallScore >= 70 ? 'pill-green' : overallScore >= 40 ? 'pill-gold' : 'pill-red'}`}>
            {getScoreLevel(overallScore).badge} {getScoreLevel(overallScore).label}
          </span>
        </div>

        {/* Radar Chart */}
        <div className="card animate-in" style={{ padding: 24, marginBottom: 24, display: 'flex', justifyContent: 'center' }}>
          <RadarChart scores={fieldScores} />
        </div>

        {/* XP Award */}
        <div style={{ textAlign: 'center', marginBottom: 24 }}>
          <span className="pill pill-red" style={{ fontSize: 14, padding: '8px 20px' }}>+200 XP {'\u{1F3C6}'} Karriere-Blutbild erstellt!</span>
        </div>

        {/* Top 3 / Bottom 3 */}
        <div className="grid-2" style={{ marginBottom: 24 }}>
          <div className="card animate-in">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Deine Top 3 St\u00E4rken</h3>
            {top3.map((f, i) => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--ki-border)' }}>
                <span style={{ fontSize: 16 }}>{['\u{1F947}', '\u{1F948}', '\u{1F949}'][i]}</span>
                <span style={{ fontSize: 16 }}>{f.icon}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{f.name}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: f.level.color }}>{f.score}%</span>
              </div>
            ))}
          </div>
          <div className="card animate-in">
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Deine Top 3 Wachstumsfelder</h3>
            {bottom3.map((f) => (
              <div key={f.id} style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '8px 0', borderBottom: '1px solid var(--ki-border)' }}>
                <span style={{ fontSize: 16 }}>{'\u26A1'}</span>
                <span style={{ fontSize: 16 }}>{f.icon}</span>
                <span style={{ flex: 1, fontSize: 14, fontWeight: 500 }}>{f.name}</span>
                <span style={{ fontSize: 14, fontWeight: 700, color: f.level.color }}>{f.score}%</span>
              </div>
            ))}
          </div>
        </div>

        {/* Impostor Check */}
        {Math.abs(impostorDelta) > 10 && (
          <div className="card animate-in" style={{ marginBottom: 24, padding: 20, borderLeft: '4px solid var(--ki-warning)' }}>
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 8 }}>Impostor-Check</h3>
            <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.6 }}>
              {impostorDelta > 0
                ? `Dein objektiver Score liegt ${impostorDelta}% \u00FCber deiner Selbsteinsch\u00E4tzung. Du untersch\u00E4tzt dich systematisch \u2014 ein klassisches Impostor-Syndrom-Muster.`
                : `Deine Selbsteinsch\u00E4tzung liegt ${Math.abs(impostorDelta)}% \u00FCber deinem objektiven Score. Etwas mehr kritische Reflexion k\u00F6nnte dir helfen.`
              }
            </p>
          </div>
        )}

        {/* All 13 Fields Accordion */}
        <div className="card animate-in" style={{ marginBottom: 24 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Alle 13 Kompetenzfelder</h3>
          {sortedScores.map(f => (
            <FieldAccordion key={f.id} field={f} />
          ))}
        </div>

        {/* Actions */}
        <div style={{ marginBottom: 32 }}>
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Was willst du als N\u00E4chstes tun?</h3>
          <div className="grid-3">
            <a href="/coach" className="card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{'\u{1F916}'}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Mit Coach besprechen</div>
            </a>
            <a href="/masterclass" className="card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{'\u25B6'}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Schw\u00E4chsten Bereich trainieren</div>
            </a>
            <button className="card" onClick={() => { setPhase(1); setResumePrompt(false); setAnswers({}); setFieldScores({}); setFieldIndex(0); setQuestionIndex(0); }} style={{ textAlign: 'center', padding: 20, cursor: 'pointer', border: 'none' }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{'\u{1F504}'}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Analyse wiederholen</div>
            </button>
          </div>
        </div>

        {/* Video Placeholder */}
        <div className="card" style={{ aspectRatio: '16/9', maxHeight: 220, background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexDirection: 'column', gap: 16, marginBottom: 24 }}>
          <div style={{ width: 56, height: 56, borderRadius: '50%', background: 'rgba(204,20,38,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 24, color: 'white' }}>{'\u25B6'}</div>
          <div style={{ color: 'white', fontSize: 15, fontWeight: 600 }}>Wie liest du dein Karriere-Blutbild?</div>
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Video verf\u00FCgbar ab April 2026</div>
        </div>
      </div>
    );
  }

  return null;
}

// Field Accordion sub-component
function FieldAccordion({ field }) {
  const [open, setOpen] = useState(false);
  const text = getAuswertung(field.id, field.score);
  return (
    <div style={{ borderBottom: '1px solid var(--ki-border)' }}>
      <button onClick={() => setOpen(!open)} style={{
        width: '100%', background: 'none', border: 'none', cursor: 'pointer',
        display: 'flex', alignItems: 'center', gap: 10, padding: '12px 0', textAlign: 'left',
      }}>
        <span style={{ fontSize: 18 }}>{field.icon}</span>
        <span style={{ flex: 1, fontSize: 14, fontWeight: 600 }}>{field.name}</span>
        <div style={{ width: 80 }}>
          <div className="progress-bar" style={{ height: 6 }}>
            <div className="progress-bar-fill" style={{ width: `${field.score}%`, background: field.level.color }} />
          </div>
        </div>
        <span style={{ fontSize: 14, fontWeight: 700, color: field.level.color, minWidth: 40, textAlign: 'right' }}>{field.score}%</span>
        <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', transition: 'transform 0.2s', transform: open ? 'rotate(90deg)' : 'none' }}>{'\u25B6'}</span>
      </button>
      {open && (
        <div style={{ padding: '0 0 16px 28px', animation: 'fadeIn 0.3s ease' }}>
          <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.6, marginBottom: 12 }}>{text}</p>
          <a href="/masterclass" className="btn btn-secondary" style={{ fontSize: 12, padding: '6px 14px' }}>
            Jetzt weiterentwickeln {'\u2192'}
          </a>
        </div>
      )}
    </div>
  );
}
