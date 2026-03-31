'use client';
import { useState, useEffect, useCallback, useMemo } from 'react';
import { createClient } from '@/lib/supabase/client';
import { awardPoints } from '@/lib/gamification';
import InfoTooltip from '@/components/ui/InfoTooltip';
import { Eye, Flame, MessageCircle, Compass, Check } from 'lucide-react';

// ── Kompaktere Fortschrittsanzeige für alle 13 Felder ──
function FieldProgress({ fields, currentIndex, scores }) {
  return (
    <div style={{ display: 'flex', gap: 4, justifyContent: 'center', flexWrap: 'wrap', marginBottom: 24 }}>
      {fields.map((f, i) => {
        const done = !!scores[f.id];
        const active = i === currentIndex;
        return (
          <div key={f.id} title={f.name} style={{
            width: 32, height: 32, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 10, fontWeight: 600, transition: 'all 0.2s ease',
            background: done ? 'var(--ki-success)' : active ? 'var(--ki-red)' : 'var(--ki-bg-alt)',
            color: done || active ? 'white' : 'var(--ki-text-tertiary)',
            border: active ? '2px solid var(--ki-red)' : done ? 'none' : '1px solid var(--ki-border)',
          }}>
            {done ? <Check size={14} strokeWidth={2.5} /> : i + 1}
          </div>
        );
      })}
    </div>
  );
}

// ============================================================
// 13 KOMPETENZFELDER
// ============================================================
const KOMPETENZFELDER = [
  { id: 'selbstwertgefuehl', name: 'Selbstwertgefühl', icon: '\u{1F6E1}\uFE0F', category: 'Wahrnehmung', color: '#CC1426' },
  { id: 'prioritaeten', name: 'Prioritätenmanagement', icon: '\u{1F3AF}', category: 'Wahrnehmung', color: '#E63946' },
  { id: 'selbstreflexion', name: 'Selbstreflexion', icon: '\u{1FA9E}', category: 'Intrapersonal', color: '#8B5CF6' },
  { id: 'selbstfuersorge', name: 'Selbstfürsorge', icon: '\u{1F9D8}', category: 'Intrapersonal', color: '#A78BFA' },
  { id: 'kompetenzbewusstsein', name: 'Kompetenzbewusstsein', icon: '\u{1F48E}', category: 'Intrapersonal', color: '#7C3AED' },
  { id: 'kommunikation', name: 'Kommunikation', icon: '\u{1F4AC}', category: 'Interpersonal', color: '#2563EB' },
  { id: 'sozialkompetenz', name: 'Sozialkompetenz', icon: '\u{1F91D}', category: 'Interpersonal', color: '#3B82F6' },
  { id: 'sozialisationskompetenz', name: 'Sozialisationskompetenz', icon: '\u{1F310}', category: 'Interpersonal', color: '#60A5FA' },
  { id: 'praesentation', name: 'Präsentationskompetenz', icon: '\u{1F3A4}', category: 'Interpersonal', color: '#1D4ED8' },
  { id: 'emotionale_intelligenz', name: 'Emotionale Intelligenz', icon: '\u2764\uFE0F', category: 'Regulierung', color: '#059669' },
  { id: 'charisma', name: 'Charisma', icon: '\u2728', category: 'Regulierung', color: '#10B981' },
  { id: 'resilienz', name: 'Resilienz', icon: '\u{1F525}', category: 'Regulierung', color: '#34D399' },
  { id: 'fuehrung', name: 'Führungskompetenz', icon: '\u{1F451}', category: 'Regulierung', color: '#047857' },
];

const CATEGORY_INTROS = {
  'Wahrnehmung': {
    num: '1 / 4', title: 'Wahrnehmung',
    text: 'Wie nimmst du dich selbst und deine Umgebung wahr? In dieser Dimension geht es um dein Auftreten, deine soziale Wahrnehmung und wie du dich präsentierst.',
    fields: ['Selbstwertgefühl', 'Prioritätenmanagement'],
  },
  'Intrapersonal': {
    num: '2 / 4', title: 'Intrapersonal',
    text: 'Jetzt geht es um dein Inneres — Reflexion, Fürsorge und Bewusstsein. Wie gut kennst du dich selbst, und wie gehst du mit deinen Ressourcen um?',
    fields: ['Selbstreflexion', 'Selbstfürsorge', 'Kompetenzbewusstsein'],
  },
  'Interpersonal': {
    num: '3 / 4', title: 'Interpersonal',
    text: 'Wie wirkst du auf andere? Hier analysieren wir deine Kommunikation, dein soziales Geschick und wie du in Gruppen auftrittst.',
    fields: ['Kommunikation', 'Sozialkompetenz', 'Sozialisationskompetenz', 'Präsentationskompetenz'],
  },
  'Regulierung': {
    num: '4 / 4', title: 'Regulierung',
    text: 'Die Königsdisziplinen: Emotionale Intelligenz, Widerstandskraft, Charisma und Führung. Wie steuerst du dich in anspruchsvollen Situationen?',
    fields: ['Emotionale Intelligenz', 'Charisma', 'Resilienz', 'Führungskompetenz'],
  },
};

// ============================================================
// 65 SZENARIO-FRAGEN (5 pro Feld)
// ============================================================
const SZENARIEN = {
  selbstwertgefuehl: [
    { scenario: 'Dein Chef bittet dich spontan, in 10 Minuten eine Präsentation vor dem gesamten Team zu halten.', options: [
      { text: 'Kein Problem — ich stehe gerne im Rampenlicht', score: 10, emoji: '\u{1F60E}' },
      { text: 'Nervös, aber ich zieh\'s durch', score: 7, emoji: '\u{1F624}' },
      { text: 'Ich versuche es, aber mir wird unwohl', score: 4, emoji: '\u{1F630}' },
      { text: 'Ich bitte jemand anderen, das zu übernehmen', score: 1, emoji: '\u{1F648}' },
    ]},
    { scenario: 'Ein Kollege kritisiert deine Arbeit vor versammelter Runde. Was passiert in dir?', options: [
      { text: 'Ich nehme es sachlich auf und antworte souverän', score: 10, emoji: '\u{1F60C}' },
      { text: 'Es trifft mich kurz, aber ich fange mich schnell', score: 7, emoji: '\u{1F914}' },
      { text: 'Ich grüble den Rest des Tages darüber', score: 4, emoji: '\u{1F614}' },
      { text: 'Ich zweifle danach an meiner gesamten Kompetenz', score: 1, emoji: '\u{1F622}' },
    ]},
    { scenario: 'Du sollst in deinem Lebenslauf deine drei größten Stärken aufschreiben. Wie fällt dir das?', options: [
      { text: 'Leicht — ich kenne meine Stärken genau', score: 10, emoji: '\u{1F4AA}' },
      { text: 'Ich brauche etwas Zeit, finde aber gute Punkte', score: 7, emoji: '\u{1F4DD}' },
      { text: 'Ich bin unsicher, was wirklich meine Stärken sind', score: 4, emoji: '\u{1F937}' },
      { text: 'Ich fände es einfacher, Schwächen aufzuzählen', score: 1, emoji: '\u{1F625}' },
    ]},
    { scenario: 'Du bekommst ein Jobangebot mit 30% mehr Gehalt, aber in einem völlig neuen Bereich.', options: [
      { text: 'Ich bin überzeugt, das schaffe ich', score: 10, emoji: '\u{1F680}' },
      { text: 'Ich würde es versuchen — ich lerne schnell', score: 7, emoji: '\u{1F4C8}' },
      { text: 'Ich bin unsicher, ob ich dem gewachsen bin', score: 4, emoji: '\u{1F615}' },
      { text: 'Ich bleibe lieber, wo ich mich sicher fühle', score: 1, emoji: '\u{1F3E0}' },
    ]},
    { scenario: 'Bei einem Networking-Event wirst du gefragt: "Was macht Sie besonders?" Deine Reaktion:', options: [
      { text: 'Ich habe einen klaren Elevator Pitch parat', score: 10, emoji: '\u{1F3AF}' },
      { text: 'Ich erzähle frei über meine Erfahrungen', score: 7, emoji: '\u{1F5E3}\uFE0F' },
      { text: 'Ich werde verlegen und halte mich bedeckt', score: 4, emoji: '\u{1F633}' },
      { text: 'Ich wechsle schnell das Thema', score: 1, emoji: '\u{1F605}' },
    ]},
  ],
  prioritaeten: [
    { scenario: 'Montag 9 Uhr: Du hast 15 E-Mails, 3 Meeting-Anfragen und ein dringendes Projekt. Was tust du zuerst?', options: [
      { text: 'Projekt zuerst — Wichtiges vor Dringendem', score: 10, emoji: '\u{1F3AF}' },
      { text: 'Ich scanne die E-Mails kurz und plane dann', score: 7, emoji: '\u{1F4CB}' },
      { text: 'Ich beantworte erst mal alle E-Mails', score: 4, emoji: '\u{1F4E8}' },
      { text: 'Ich fühle mich überwältigt und weiß nicht, wo anfangen', score: 1, emoji: '\u{1F635}' },
    ]},
    { scenario: 'Dein Vorgesetzter gibt dir eine neue Aufgabe, obwohl du schon am Limit bist.', options: [
      { text: 'Ich kommuniziere klar, was realistisch ist, und schlage Prioritäten vor', score: 10, emoji: '\u{1F4AC}' },
      { text: 'Ich nehme es an und reorganisiere meinen Plan', score: 7, emoji: '\u{1F504}' },
      { text: 'Ich nehme es an, auch wenn ich Überstunden machen muss', score: 4, emoji: '\u{1F62B}' },
      { text: 'Ich sage ja und hoffe, dass es irgendwie klappt', score: 1, emoji: '\u{1F91E}' },
    ]},
    { scenario: 'Du arbeitest konzentriert, als ein Kollege "nur kurz" etwas fragt. Das passiert 5x am Tag.', options: [
      { text: 'Ich habe feste Fokus-Zeiten und kommuniziere das klar', score: 10, emoji: '\u{1F6D1}' },
      { text: 'Ich sage meistens "später" und blocke meine Zeit', score: 7, emoji: '\u23F0' },
      { text: 'Ich helfe meistens sofort, verliere aber den Faden', score: 4, emoji: '\u{1F500}' },
      { text: 'Ich kann schlecht Nein sagen und komme nie zu meinen Sachen', score: 1, emoji: '\u{1F614}' },
    ]},
    { scenario: 'Du hast 3 Projekte gleichzeitig. Eines ist spannend, eines langweilig, eines dringend.', options: [
      { text: 'Ich priorisiere nach Impact und Deadline, nicht nach Laune', score: 10, emoji: '\u{1F9E0}' },
      { text: 'Dringendes zuerst, dann das Spannende', score: 7, emoji: '\u{1F4C5}' },
      { text: 'Ich mache das Spannende zuerst, der Rest kann warten', score: 4, emoji: '\u2728' },
      { text: 'Ich springe zwischen allen hin und her', score: 1, emoji: '\u{1F3C3}' },
    ]},
    { scenario: 'Am Abend merkst du: Du warst den ganzen Tag beschäftigt, aber nichts Wichtiges geschafft.', options: [
      { text: 'Passiert mir fast nie — ich plane meinen Tag strategisch', score: 10, emoji: '\u{1F4CA}' },
      { text: 'Manchmal, dann passe ich meine Methode an', score: 7, emoji: '\u{1F504}' },
      { text: 'Kommt häufiger vor, als mir lieb ist', score: 4, emoji: '\u{1F62C}' },
      { text: 'Das ist leider mein Alltag', score: 1, emoji: '\u{1F629}' },
    ]},
  ],
  selbstreflexion: [
    { scenario: 'Ein Projekt ist grandios gescheitert. Was machst du als Erstes?', options: [
      { text: 'Ich analysiere systematisch, was schiefgelaufen ist', score: 10, emoji: '\u{1F50D}' },
      { text: 'Ich spreche mit dem Team über Learnings', score: 7, emoji: '\u{1F4AC}' },
      { text: 'Ich ärgere mich erst mal und analysiere später', score: 4, emoji: '\u{1F620}' },
      { text: 'Ich verdränge es und mache weiter', score: 1, emoji: '\u{1F648}' },
    ]},
    { scenario: 'Du erhältst ein 360-Grad-Feedback. Dein Score bei "Teamfähigkeit" ist überraschend niedrig.', options: [
      { text: 'Ich nehme es als wertvolles Signal und frage nach Details', score: 10, emoji: '\u{1F4A1}' },
      { text: 'Ich überlege, welche Situationen gemeint sein könnten', score: 7, emoji: '\u{1F914}' },
      { text: 'Ich bin verletzt, aber versuche offen zu bleiben', score: 4, emoji: '\u{1F622}' },
      { text: 'Ich finde das unfair — die anderen kennen mich nicht richtig', score: 1, emoji: '\u{1F624}' },
    ]},
    { scenario: 'Wie oft reflektierst du bewusst über deine Karriere-Entscheidungen?', options: [
      { text: 'Regelmäßig — ich führe Tagebuch oder mache Reviews', score: 10, emoji: '\u{1F4D3}' },
      { text: 'Alle paar Monate, wenn ich Zeit habe', score: 7, emoji: '\u{1F4C5}' },
      { text: 'Nur wenn etwas schiefgeht', score: 4, emoji: '\u26A0\uFE0F' },
      { text: 'Ehrlich gesagt: fast nie', score: 1, emoji: '\u{1F937}' },
    ]},
    { scenario: 'Du hast im Meeting eine Idee vorgetragen, die nicht ankam. Danach:', options: [
      { text: 'Ich überlege, wie ich es nächstes Mal besser präsentiere', score: 10, emoji: '\u{1F4C8}' },
      { text: 'Ich hole Feedback ein, warum es nicht ankam', score: 7, emoji: '\u{1F4AC}' },
      { text: 'Ich bin enttäuscht und bringe seltener Ideen ein', score: 4, emoji: '\u{1F614}' },
      { text: 'Ich gebe anderen die Schuld für mangelndes Verständnis', score: 1, emoji: '\u{1F612}' },
    ]},
    { scenario: 'Ein Freund sagt: "Du bist manchmal zu direkt." Wie reagierst du?', options: [
      { text: 'Ich danke für die Ehrlichkeit und reflektiere darüber', score: 10, emoji: '\u{1F64F}' },
      { text: 'Ich überlege, in welchen Situationen das zutreffen könnte', score: 7, emoji: '\u{1F914}' },
      { text: 'Ich finde es schwer, das anzunehmen', score: 4, emoji: '\u{1F615}' },
      { text: 'Ich finde Direktheit ist eine Stärke, nicht mein Problem', score: 1, emoji: '\u{1F4AA}' },
    ]},
  ],
  selbstfuersorge: [
    { scenario: 'Du hast seit 3 Wochen jeden Abend Überstunden gemacht. Wie gehst du damit um?', options: [
      { text: 'Ich setze klare Grenzen und nehme mir bewusst frei', score: 10, emoji: '\u{1F6D1}' },
      { text: 'Ich plane ein Wochenende zum Aufladen', score: 7, emoji: '\u{1F3D6}\uFE0F' },
      { text: 'Ich weiß, dass ich was tun sollte, aber kann nicht loslassen', score: 4, emoji: '\u{1F62B}' },
      { text: 'Ich mache weiter — von alleine wird es nicht besser', score: 1, emoji: '\u{1F9DF}' },
    ]},
    { scenario: 'Dein Körper zeigt Stresssymptome (Schlafprobleme, Kopfschmerzen). Was tust du?', options: [
      { text: 'Sofort Gegenmaßnahmen: Sport, Achtsamkeit, Arzttermin', score: 10, emoji: '\u{1F3CB}\uFE0F' },
      { text: 'Ich reduziere Stress wo ich kann', score: 7, emoji: '\u{1F4C9}' },
      { text: 'Ich nehme es wahr, ändere aber nichts', score: 4, emoji: '\u{1F611}' },
      { text: 'Ich ignoriere die Signale und mache weiter', score: 1, emoji: '\u{1F635}' },
    ]},
    { scenario: 'Wie sieht dein typischer Feierabend aus?', options: [
      { text: 'Bewusste Erholung: Sport, Hobby, Quality Time', score: 10, emoji: '\u{1F31F}' },
      { text: 'Meistens entspannt, manchmal checke ich nochmal E-Mails', score: 7, emoji: '\u{1F4F1}' },
      { text: 'Ich bin oft zu müde für irgendwas Außer Netflix', score: 4, emoji: '\u{1F4FA}' },
      { text: 'Feierabend? Der Übergang ist fließend...', score: 1, emoji: '\u{1F4BB}' },
    ]},
    { scenario: 'Dein bester Freund sagt seinen Termin ab. Du hast plötzlich 3 Stunden frei.', options: [
      { text: 'Perfekt — ich nutze die Zeit für mich bewusst', score: 10, emoji: '\u{1F9D8}' },
      { text: 'Ich freue mich und mache etwas Schönes', score: 7, emoji: '\u{1F60A}' },
      { text: 'Ich arbeite stattdessen einfach weiter', score: 4, emoji: '\u{1F4BC}' },
      { text: 'Ich langweile mich und weiß nichts mit mir anzufangen', score: 1, emoji: '\u{1F611}' },
    ]},
    { scenario: 'Wie oft sagst du "Nein" zu Anfragen, die deine Grenzen überschreiten?', options: [
      { text: 'Regelmäßig und selbstbewusst', score: 10, emoji: '\u{1F6E1}\uFE0F' },
      { text: 'Meistens, wenn es wirklich zu viel wird', score: 7, emoji: '\u{1F44D}' },
      { text: 'Selten — ich will niemanden enttäuschen', score: 4, emoji: '\u{1F614}' },
      { text: 'Praktisch nie — ich sage immer ja', score: 1, emoji: '\u{1F62A}' },
    ]},
  ],
  kompetenzbewusstsein: [
    { scenario: 'Jemand fragt dich: "Was kannst du besser als die meisten?" Deine Reaktion:', options: [
      { text: 'Ich kann 3 Dinge sofort benennen', score: 10, emoji: '\u{1F48E}' },
      { text: 'Ich überlege kurz, finde aber gute Antworten', score: 7, emoji: '\u{1F914}' },
      { text: 'Ich tu mich schwer damit, mich hervorzuheben', score: 4, emoji: '\u{1F615}' },
      { text: 'Keine Ahnung — ich bin halt durchschnittlich', score: 1, emoji: '\u{1F937}' },
    ]},
    { scenario: 'Du siehst eine Stellenanzeige, die 80% zu dir passt aber 20% Anforderungen hat, die du nicht erfüllst.', options: [
      { text: 'Ich bewerbe mich — die 20% lerne ich schnell', score: 10, emoji: '\u{1F680}' },
      { text: 'Ich bewerbe mich und bin ehrlich über die Lücken', score: 7, emoji: '\u{1F4DD}' },
      { text: 'Ich zögere und warte auf eine 100%-Passende', score: 4, emoji: '\u23F3' },
      { text: 'Ich bewerbe mich nicht — ich erfülle ja nicht alles', score: 1, emoji: '\u{1F6AB}' },
    ]},
    { scenario: 'Im Jahresgespräch sollst du deine größten Erfolge des Jahres nennen.', options: [
      { text: 'Ich habe sie dokumentiert und präsentiere sie klar', score: 10, emoji: '\u{1F4CA}' },
      { text: 'Mir fallen einige ein, ich hätte sie besser tracken sollen', score: 7, emoji: '\u{1F4DD}' },
      { text: 'Ich finde es schwer, meine Leistungen "zu verkaufen"', score: 4, emoji: '\u{1F633}' },
      { text: 'Mir fällt spontan nichts Besonderes ein', score: 1, emoji: '\u{1F610}' },
    ]},
    { scenario: 'Ein Headhunter ruft an und fragt nach deinem Marktwert. Du:', options: [
      { text: 'Kenne meinen Marktwert und nenne selbstbewusst eine Zahl', score: 10, emoji: '\u{1F4B0}' },
      { text: 'Habe eine ungefähre Vorstellung und nenne eine Range', score: 7, emoji: '\u{1F4C8}' },
      { text: 'Bin unsicher und sage "marktüblich"', score: 4, emoji: '\u{1F937}' },
      { text: 'Habe keine Ahnung und fühle mich unwohl bei dem Thema', score: 1, emoji: '\u{1F630}' },
    ]},
    { scenario: 'Du vergleichst dich mit erfolgreichen Menschen in deiner Branche. Dein Gefühl:', options: [
      { text: 'Inspiration — ich sehe, was möglich ist', score: 10, emoji: '\u{1F31F}' },
      { text: 'Motivation — ich arbeite daran, besser zu werden', score: 7, emoji: '\u{1F4AA}' },
      { text: 'Verunsicherung — die sind so viel weiter', score: 4, emoji: '\u{1F614}' },
      { text: 'Frustration — ich werde das nie schaffen', score: 1, emoji: '\u{1F61E}' },
    ]},
  ],
  kommunikation: [
    { scenario: 'Du musst einem schwierigen Stakeholder eine schlechte Nachricht überbringen.', options: [
      { text: 'Direkt, klar und mit Lösungsvorschlag', score: 10, emoji: '\u{1F4AC}' },
      { text: 'Ich bereite mich vor und wähle den richtigen Moment', score: 7, emoji: '\u{1F4CB}' },
      { text: 'Ich schreibe lieber eine E-Mail als persönlich zu reden', score: 4, emoji: '\u{1F4E7}' },
      { text: 'Ich schiebe es so lange wie möglich auf', score: 1, emoji: '\u{1F62C}' },
    ]},
    { scenario: 'In einer hitzigen Diskussion ist jemand anderer Meinung als du.', options: [
      { text: 'Ich argumentiere sachlich und höre aktiv zu', score: 10, emoji: '\u{1F9D0}' },
      { text: 'Ich bringe meine Punkte vor, auch wenn es unbequem ist', score: 7, emoji: '\u{1F5E3}\uFE0F' },
      { text: 'Ich gebe meistens nach, um Konflikte zu vermeiden', score: 4, emoji: '\u{1F54A}\uFE0F' },
      { text: 'Ich schweige und ärgere mich innerlich', score: 1, emoji: '\u{1F910}' },
    ]},
    { scenario: 'Du schreibst eine wichtige E-Mail an einen C-Level Manager.', options: [
      { text: 'Prägnant, auf den Punkt, mit klarem Call-to-Action', score: 10, emoji: '\u{1F3AF}' },
      { text: 'Professionell formuliert mit gutem Aufbau', score: 7, emoji: '\u{1F4DD}' },
      { text: 'Ich überarbeite sie 5x und bin trotzdem unsicher', score: 4, emoji: '\u{1F504}' },
      { text: 'Ich lasse jemand anderen die Mail schreiben', score: 1, emoji: '\u{1F64B}' },
    ]},
    { scenario: 'Ein neuer Kollege hat etwas nicht verstanden. Du erklärst es:', options: [
      { text: 'Klar, geduldig und mit Beispielen angepasst an sein Level', score: 10, emoji: '\u{1F4A1}' },
      { text: 'Ich erkläre es gerne, aber manchmal zu detailliert', score: 7, emoji: '\u{1F4DA}' },
      { text: 'Ich verweise auf Dokumentation oder andere Kollegen', score: 4, emoji: '\u{1F449}' },
      { text: 'Ich werde ungeduldig, wenn jemand es nicht schnell versteht', score: 1, emoji: '\u{1F612}' },
    ]},
    { scenario: 'Du merkst, dass dein Gegenüber in einem Gespräch abschaltet.', options: [
      { text: 'Ich passe sofort meinen Stil an und stelle eine Frage', score: 10, emoji: '\u{1F50D}' },
      { text: 'Ich bemerke es und versuche kürzer zu werden', score: 7, emoji: '\u{1F4CF}' },
      { text: 'Ich merke es oft erst danach', score: 4, emoji: '\u{1F914}' },
      { text: 'Mir fällt so etwas selten auf', score: 1, emoji: '\u{1F636}' },
    ]},
  ],
  sozialkompetenz: [
    { scenario: 'Zwei Kollegen streiten sich offen im Büro. Du:', options: [
      { text: 'Ich vermittle diplomatisch und finde einen Kompromiss', score: 10, emoji: '\u2696\uFE0F' },
      { text: 'Ich spreche später einzeln mit beiden', score: 7, emoji: '\u{1F4AC}' },
      { text: 'Ich halte mich raus — nicht mein Problem', score: 4, emoji: '\u{1F645}' },
      { text: 'Konflikte machen mich so unwohl, dass ich den Raum verlasse', score: 1, emoji: '\u{1F6B6}' },
    ]},
    { scenario: 'Ein neuer Mitarbeiter wirkt am ersten Tag verloren. Du:', options: [
      { text: 'Ich gehe aktiv auf ihn zu und biete Hilfe an', score: 10, emoji: '\u{1F91D}' },
      { text: 'Ich stelle mich vor und sage, er kann jederzeit fragen', score: 7, emoji: '\u{1F44B}' },
      { text: 'Wenn er fragt, helfe ich gerne', score: 4, emoji: '\u{1F44D}' },
      { text: 'Das ist Aufgabe von HR, nicht meine', score: 1, emoji: '\u{1F937}' },
    ]},
    { scenario: 'Bei einem Teamabend sitzt du neben jemandem, den du nicht kennst.', options: [
      { text: 'Perfekt — ich liebe es, neue Leute kennenzulernen', score: 10, emoji: '\u{1F929}' },
      { text: 'Ich starte ein Gespräch und finde Gemeinsamkeiten', score: 7, emoji: '\u{1F60A}' },
      { text: 'Ich warte, bis die andere Person das Gespräch beginnt', score: 4, emoji: '\u{1F610}' },
      { text: 'Ich fühle mich unwohl und schaue aufs Handy', score: 1, emoji: '\u{1F4F1}' },
    ]},
    { scenario: 'Ein Teammitglied leistet seit Wochen weniger. Das Team leidet darunter.', options: [
      { text: 'Ich suche das Gespräch und frage, wie ich helfen kann', score: 10, emoji: '\u{1F4AC}' },
      { text: 'Ich spreche es im Team an, konstruktiv', score: 7, emoji: '\u{1F465}' },
      { text: 'Ich kompensiere still seine Arbeit', score: 4, emoji: '\u{1F62A}' },
      { text: 'Ich beschwere mich beim Chef', score: 1, emoji: '\u{1F4E2}' },
    ]},
    { scenario: 'Du musst mit jemandem zusammenarbeiten, den du persönlich nicht magst.', options: [
      { text: 'Professionell — persönliche Differenzen trenne ich von der Arbeit', score: 10, emoji: '\u{1F454}' },
      { text: 'Ich gebe mir Mühe, es funktioniert meistens', score: 7, emoji: '\u{1F44C}' },
      { text: 'Es fällt mir schwer, meine Abneigung zu verbergen', score: 4, emoji: '\u{1F612}' },
      { text: 'Ich vermeide die Zusammenarbeit wo es geht', score: 1, emoji: '\u{1F6AB}' },
    ]},
  ],
  sozialisationskompetenz: [
    { scenario: 'Du wechselst in ein neues Unternehmen mit komplett anderer Kultur.', options: [
      { text: 'Ich beobachte, lerne und passe mich bewusst an', score: 10, emoji: '\u{1F50D}' },
      { text: 'Ich bin offen und versuche, schnell Anschluss zu finden', score: 7, emoji: '\u{1F91D}' },
      { text: 'Ich brauche lange, um mich wohlzufühlen', score: 4, emoji: '\u{1F422}' },
      { text: 'Ich vermisse mein altes Team und vergleiche ständig', score: 1, emoji: '\u{1F622}' },
    ]},
    { scenario: 'Dein Team wird international — plötzlich sind 5 verschiedene Kulturen vertreten.', options: [
      { text: 'Fantastisch! Ich liebe kulturelle Vielfalt', score: 10, emoji: '\u{1F30D}' },
      { text: 'Ich bin neugierig und offen für andere Arbeitsweisen', score: 7, emoji: '\u{1F914}' },
      { text: 'Ich finde es manchmal anstrengend, alles zu berücksichtigen', score: 4, emoji: '\u{1F62B}' },
      { text: 'Ich bevorzuge ein homogenes Team', score: 1, emoji: '\u{1F3E0}' },
    ]},
    { scenario: 'Bei einer Konferenz kennst du niemanden. 200 Leute im Raum.', options: [
      { text: 'Ich spreche aktiv 5-10 Leute an und sammle Kontakte', score: 10, emoji: '\u{1F4BC}' },
      { text: 'Ich suche eine offene Gruppe und schließe mich an', score: 7, emoji: '\u{1F465}' },
      { text: 'Ich bleibe am Buffet und hoffe, angesprochen zu werden', score: 4, emoji: '\u{1F37D}\uFE0F' },
      { text: 'Am liebsten würde ich sofort wieder gehen', score: 1, emoji: '\u{1F6AA}' },
    ]},
    { scenario: 'Deine Abteilung wird umstrukturiert. Neues Team, neuer Chef, neue Prozesse.', options: [
      { text: 'Ich sehe es als Chance und gestalte aktiv mit', score: 10, emoji: '\u{1F680}' },
      { text: 'Ich passe mich an, auch wenn es unbequem ist', score: 7, emoji: '\u{1F504}' },
      { text: 'Ich hadere mit der Veränderung und brauche Zeit', score: 4, emoji: '\u{1F615}' },
      { text: 'Ich überlege, ob ich nicht lieber kündige', score: 1, emoji: '\u{1F6AA}' },
    ]},
    { scenario: 'Du ziehst für den Job in eine neue Stadt, wo du niemanden kennst.', options: [
      { text: 'Abenteuer! Ich baue mir schnell ein neues Netzwerk auf', score: 10, emoji: '\u{1F31F}' },
      { text: 'Aufregend und etwas nervös, aber ich freue mich', score: 7, emoji: '\u{1F60A}' },
      { text: 'Ich habe Angst vor der Einsamkeit', score: 4, emoji: '\u{1F614}' },
      { text: 'Ich würde das nur tun, wenn es absolut nicht anders geht', score: 1, emoji: '\u{1F6AB}' },
    ]},
  ],
  praesentation: [
    { scenario: '100 Leute, Spotlight, Bühne. Du sollst eine Keynote halten.', options: [
      { text: 'Das ist mein Element — ich liebe es, auf der Bühne zu stehen', score: 10, emoji: '\u{1F3A4}' },
      { text: 'Aufgeregt, aber gut vorbereitet schaffe ich das', score: 7, emoji: '\u{1F4AA}' },
      { text: 'Mir wird schlecht bei dem Gedanken, aber ich würde es versuchen', score: 4, emoji: '\u{1F630}' },
      { text: 'Ausgeschlossen — das überlasse ich anderen', score: 1, emoji: '\u{1F645}' },
    ]},
    { scenario: 'Mitten in deiner Präsentation fällt der Beamer aus. Was jetzt?', options: [
      { text: 'Ich improvisiere souverän und mache ohne Slides weiter', score: 10, emoji: '\u{1F60E}' },
      { text: 'Ich mache eine kurze Pause und finde eine Lösung', score: 7, emoji: '\u{1F504}' },
      { text: 'Ich gerate in Panik, fange mich aber', score: 4, emoji: '\u{1F630}' },
      { text: 'Ich bitte darum, die Präsentation zu verschieben', score: 1, emoji: '\u{1F64F}' },
    ]},
    { scenario: 'Nach deiner Präsentation stellt jemand eine aggressive Frage.', options: [
      { text: 'Ich bleibe ruhig und beantworte sie sachlich', score: 10, emoji: '\u{1F9D0}' },
      { text: 'Ich versuche diplomatisch zu antworten', score: 7, emoji: '\u{1F4AC}' },
      { text: 'Ich werde unsicher und stottere', score: 4, emoji: '\u{1F633}' },
      { text: 'Ich werde defensiv oder aggressiv', score: 1, emoji: '\u{1F620}' },
    ]},
    { scenario: 'Du sollst dein Team von einer unpopulären Entscheidung überzeugen.', options: [
      { text: 'Ich baue eine überzeugende Story mit Fakten und Vision', score: 10, emoji: '\u{1F4CA}' },
      { text: 'Ich erkläre die Gründe offen und höre Bedenken an', score: 7, emoji: '\u{1F4AC}' },
      { text: 'Ich sage es einfach und hoffe auf Akzeptanz', score: 4, emoji: '\u{1F91E}' },
      { text: 'Ich lasse es meinen Chef kommunizieren', score: 1, emoji: '\u{1F449}' },
    ]},
    { scenario: 'Wie bereitest du dich auf eine wichtige Präsentation vor?', options: [
      { text: 'Story, Struktur, geübt, Backup-Plan, Probelauf', score: 10, emoji: '\u{1F3AF}' },
      { text: 'Gute Slides, einmal durchgesprochen', score: 7, emoji: '\u{1F4DD}' },
      { text: 'Slides am Vorabend, den Rest improvisiere ich', score: 4, emoji: '\u{1F937}' },
      { text: 'Ich bereite mich kaum vor und hoffe auf das Beste', score: 1, emoji: '\u{1F91E}' },
    ]},
  ],
  emotionale_intelligenz: [
    { scenario: 'Dein Kollege ist offensichtlich gestresst und schnauzt dich an.', options: [
      { text: 'Ich erkenne seinen Stress und reagiere empathisch', score: 10, emoji: '\u2764\uFE0F' },
      { text: 'Ich nehme es nicht persönlich und spreche ihn später an', score: 7, emoji: '\u{1F44D}' },
      { text: 'Es verletzt mich, aber ich sage nichts', score: 4, emoji: '\u{1F614}' },
      { text: 'Ich schnauze zurück', score: 1, emoji: '\u{1F620}' },
    ]},
    { scenario: 'Du merkst, dass du wütend bist, bevor du in ein wichtiges Meeting gehst.', options: [
      { text: 'Ich nehme mir 5 Minuten, atme durch und reguliere mich', score: 10, emoji: '\u{1F9D8}' },
      { text: 'Ich versuche die Wut beiseitezuschieben', score: 7, emoji: '\u{1F636}' },
      { text: 'Ich gehe rein und hoffe, dass man es nicht merkt', score: 4, emoji: '\u{1F610}' },
      { text: 'Meine Emotionen bestimmen meistens mein Verhalten', score: 1, emoji: '\u{1F4A5}' },
    ]},
    { scenario: 'Eine Kollegin weint im Meeting. Niemand reagiert. Du:', options: [
      { text: 'Ich spreche sie empathisch an und biete Unterstützung', score: 10, emoji: '\u{1F917}' },
      { text: 'Ich spreche sie nach dem Meeting unter vier Augen an', score: 7, emoji: '\u{1F4AC}' },
      { text: 'Ich fühle mich unwohl und weiß nicht, was tun', score: 4, emoji: '\u{1F615}' },
      { text: 'Emotionen gehören nicht ins Büro', score: 1, emoji: '\u{1F610}' },
    ]},
    { scenario: 'Du erhältst eine Beförderung. Dein Kollege, der auch kandidiert hat, nicht.', options: [
      { text: 'Ich freue mich und spreche empathisch mit ihm darüber', score: 10, emoji: '\u{1F91D}' },
      { text: 'Ich feiere leise und bin sensibel ihm gegenüber', score: 7, emoji: '\u{1F60C}' },
      { text: 'Ich freue mich offen und denke nicht weiter darüber nach', score: 4, emoji: '\u{1F389}' },
      { text: 'Mir ist egal, wie er sich fühlt — ich habe gewonnen', score: 1, emoji: '\u{1F3C6}' },
    ]},
    { scenario: 'Nach einem langen Tag bemerkst du, dass du gereizt auf alles reagierst.', options: [
      { text: 'Ich erkenne das Muster und ergreife sofort Gegenmaßnahmen', score: 10, emoji: '\u{1F9E0}' },
      { text: 'Ich merke es und versuche mich zusammenzureißen', score: 7, emoji: '\u{1F504}' },
      { text: 'Ich bemerke es erst, wenn jemand mich darauf hinweist', score: 4, emoji: '\u{1F914}' },
      { text: 'Ich merke es meistens gar nicht', score: 1, emoji: '\u{1F636}' },
    ]},
  ],
  charisma: [
    { scenario: 'Du betrittst einen Raum voller Fremder. Was passiert?', options: [
      { text: 'Ich spüre Blicke und strahle Selbstsicherheit aus', score: 10, emoji: '\u2728' },
      { text: 'Ich trete freundlich auf und komme schnell ins Gespräch', score: 7, emoji: '\u{1F60A}' },
      { text: 'Ich suche eine vertraute Person oder Ecke', score: 4, emoji: '\u{1F50D}' },
      { text: 'Ich fühle mich unsichtbar', score: 1, emoji: '\u{1F47B}' },
    ]},
    { scenario: 'Du erzählst eine Geschichte auf einer Party. Die Reaktion:', options: [
      { text: 'Alle hören gebannt zu und lachen an den richtigen Stellen', score: 10, emoji: '\u{1F3AD}' },
      { text: 'Die meisten hören zu und reagieren positiv', score: 7, emoji: '\u{1F44D}' },
      { text: 'Manche hören zu, andere schweifen ab', score: 4, emoji: '\u{1F615}' },
      { text: 'Ich erzähle selten Geschichten in Gruppen', score: 1, emoji: '\u{1F910}' },
    ]},
    { scenario: 'Ein Recruiter beschreibt dich nach einem Gespräch. Was würde er sagen?', options: [
      { text: '"Beeindruckende Persönlichkeit, starke Ausstrahlung"', score: 10, emoji: '\u{1F31F}' },
      { text: '"Sympathisch und kompetent"', score: 7, emoji: '\u{1F60A}' },
      { text: '"Nett, aber unauffällig"', score: 4, emoji: '\u{1F610}' },
      { text: '"Kann mich kaum an ihn/sie erinnern"', score: 1, emoji: '\u{1F47B}' },
    ]},
    { scenario: 'Du sollst jemanden motivieren, der gerade aufgeben will.', options: [
      { text: 'Ich finde die richtigen Worte und entzünde wieder ein Feuer', score: 10, emoji: '\u{1F525}' },
      { text: 'Ich höre zu und ermutige mit konkreten Vorschlägen', score: 7, emoji: '\u{1F4AA}' },
      { text: 'Ich versuche es, bin aber unsicher ob es wirkt', score: 4, emoji: '\u{1F914}' },
      { text: 'Das liegt mir nicht — ich bin kein Motivator', score: 1, emoji: '\u{1F937}' },
    ]},
    { scenario: 'Nach einem Vortrag kommen Leute auf dich zu. Wie viele?', options: [
      { text: 'Mehrere — sie wollen mehr erfahren und mich kennenlernen', score: 10, emoji: '\u{1F465}' },
      { text: 'Ein paar — mit netten Kommentaren', score: 7, emoji: '\u{1F44B}' },
      { text: 'Vielleicht einer, höflich', score: 4, emoji: '\u{1F44D}' },
      { text: 'Niemand — ich verschwinde schnell', score: 1, emoji: '\u{1F6B6}' },
    ]},
  ],
  resilienz: [
    { scenario: 'Du bekommst eine Absage für deinen Traumjob. Deine Reaktion:', options: [
      { text: 'Enttäuscht, aber ich lerne daraus und bewerbe mich weiter', score: 10, emoji: '\u{1F525}' },
      { text: 'Ich brauche einen Tag, dann geht es weiter', score: 7, emoji: '\u{1F4AA}' },
      { text: 'Ich zweifle an mir und brauche Wochen um mich zu erholen', score: 4, emoji: '\u{1F614}' },
      { text: 'Ich gebe auf und bewerbe mich nie wieder auf so einen Job', score: 1, emoji: '\u{1F6AB}' },
    ]},
    { scenario: 'Drei Dinge gehen gleichzeitig schief: Projekt verzögert, Auto kaputt, Streit mit Partner.', options: [
      { text: 'Ich priorisiere, löse eins nach dem anderen', score: 10, emoji: '\u{1F9E0}' },
      { text: 'Stressig, aber ich halte durch', score: 7, emoji: '\u{1F62C}' },
      { text: 'Ich fühle mich überwältigt und funktioniere nur noch', score: 4, emoji: '\u{1F9DF}' },
      { text: 'Ich breche zusammen und brauche Hilfe', score: 1, emoji: '\u{1F62D}' },
    ]},
    { scenario: 'Du wirst im Job ungerecht behandelt. Dein Chef ignoriert deinen Beitrag.', options: [
      { text: 'Ich spreche es klar an und fordere Anerkennung ein', score: 10, emoji: '\u{1F4AC}' },
      { text: 'Es frustriert mich, aber ich suche einen konstruktiven Weg', score: 7, emoji: '\u{1F504}' },
      { text: 'Ich schlucke es runter und bin frustriert', score: 4, emoji: '\u{1F620}' },
      { text: 'Ich gebe innerlich auf und mache nur noch Dienst nach Vorschrift', score: 1, emoji: '\u{1F9DF}' },
    ]},
    { scenario: 'Wie schnell erholst du dich nach einem großen Rückschlag?', options: [
      { text: 'Schnell — Rückschläge sind Teil des Weges', score: 10, emoji: '\u{1F680}' },
      { text: 'Ein paar Tage, dann bin ich wieder motiviert', score: 7, emoji: '\u{1F4C8}' },
      { text: 'Wochen — es nagt lange an mir', score: 4, emoji: '\u23F3' },
      { text: 'Ich erhole mich kaum — jeder Rückschlag häuft sich', score: 1, emoji: '\u{1F4C9}' },
    ]},
    { scenario: 'Dein Lieblingsprojekt wird gestrichen. 6 Monate Arbeit umsonst.', options: [
      { text: 'Ich sichere die Learnings und nutze sie für das nächste Projekt', score: 10, emoji: '\u{1F4A1}' },
      { text: 'Ärgerlich, aber so ist Business', score: 7, emoji: '\u{1F937}' },
      { text: 'Ich bin lange frustriert und demotiviert', score: 4, emoji: '\u{1F61E}' },
      { text: 'Ich verliere das Vertrauen in mein Unternehmen', score: 1, emoji: '\u{1F494}' },
    ]},
  ],
  fuehrung: [
    { scenario: 'Dein Team schafft die Deadline nicht. Was tust du?', options: [
      { text: 'Ich priorisiere mit dem Team, kommuniziere klar nach oben, und packe mit an', score: 10, emoji: '\u{1F451}' },
      { text: 'Ich helfe wo ich kann und motiviere das Team', score: 7, emoji: '\u{1F4AA}' },
      { text: 'Ich erhöhe den Druck und erwarte mehr Einsatz', score: 4, emoji: '\u{1F4A2}' },
      { text: 'Ich gebe die Verantwortung ab und melde es meinem Chef', score: 1, emoji: '\u{1F449}' },
    ]},
    { scenario: 'Ein Teammitglied macht einen großen Fehler, der Konsequenzen hat.', options: [
      { text: 'Ich schütze das Teammitglied nach außen und kläre intern', score: 10, emoji: '\u{1F6E1}\uFE0F' },
      { text: 'Ich bespreche den Fehler konstruktiv im 1:1', score: 7, emoji: '\u{1F4AC}' },
      { text: 'Ich zeige meine Enttäuschung deutlich', score: 4, emoji: '\u{1F612}' },
      { text: 'Ich mache den Fehler öffentlich als Warnung für andere', score: 1, emoji: '\u{1F4E2}' },
    ]},
    { scenario: 'Du musst eine schwierige Entscheidung treffen, die nicht alle glücklich macht.', options: [
      { text: 'Ich entscheide faktenbasiert, kommuniziere transparent und stehe dazu', score: 10, emoji: '\u{1F3AF}' },
      { text: 'Ich wäge ab, entscheide und erkläre meine Gründe', score: 7, emoji: '\u2696\uFE0F' },
      { text: 'Ich zögere lange und versuche es allen recht zu machen', score: 4, emoji: '\u{1F504}' },
      { text: 'Ich vermeide die Entscheidung so lange wie möglich', score: 1, emoji: '\u{1F648}' },
    ]},
    { scenario: 'Du übernimmst ein demoralisiertes Team. Dein erster Schritt:', options: [
      { text: 'Zuhören, Vertrauen aufbauen, gemeinsame Vision entwickeln', score: 10, emoji: '\u{1F91D}' },
      { text: 'Quick Wins identifizieren und erste Erfolge feiern', score: 7, emoji: '\u{1F389}' },
      { text: 'Klare Ziele setzen und Leistung einfordern', score: 4, emoji: '\u{1F4CB}' },
      { text: 'Ich bin unsicher, wie man ein Team dreht', score: 1, emoji: '\u{1F937}' },
    ]},
    { scenario: 'Dein Star-Performer will kündigen. Was tust du?', options: [
      { text: 'Sofortiges 1:1, Gründe verstehen, individuelles Angebot machen', score: 10, emoji: '\u{1F4AC}' },
      { text: 'Ich versuche herauszufinden, was ihn hält', score: 7, emoji: '\u{1F50D}' },
      { text: 'Schade, aber jeder ist ersetzbar', score: 4, emoji: '\u{1F937}' },
      { text: 'Ich lasse ihn gehen, ohne groß zu reagieren', score: 1, emoji: '\u{1F44B}' },
    ]},
  ],
};

// ============================================================
// 39 AUSWERTUNGSTEXTE (3 pro Feld: niedrig, mittel, hoch)
// ============================================================
const AUSWERTUNGSTEXTE = {
  selbstwertgefuehl: {
    low: 'Das Benennen der eigenen Stärken ist für Sie mit einem nicht zu unterschätzenden Aufwand verbunden. In herausfordernden Situationen zweifeln Sie daran, ob Sie auf Ihre Fähigkeiten vertrauen können. Ihr Karriereindex zeigt: Hier liegt enormes Potenzial. Denn Ihr Einkommen und Ihre Lebensqualität stehen und fallen mit Ihrem Selbstwertempfinden.',
    mid: 'Sie wissen, wo Ihre Stärken liegen und vertrauen in der Regel auf Ihre Fähigkeiten. Allerdings fällt es Ihnen nicht immer leicht, andere Menschen aktiv von sich zu überzeugen. Mit gezieltem Training können Sie dieses Feld zur echten Karriere-Waffe ausbauen.',
    high: 'Hervorragend — Sie haben ein starkes Selbstwertgefühl und strahlen das auch aus. Sie kennen Ihre Stärken, können sie kommunizieren und überzeugen andere von Ihrem Wert. Diese Kompetenz ist Ihr Karriere-Turbo.',
  },
  prioritaeten: {
    low: 'Die Priorisierung von Aufgaben fällt Ihnen schwer. Sie neigen dazu, Dringendes vor Wichtigem zu erledigen und verlieren dadurch den Fokus auf strategische Ziele. Ein strukturierter Ansatz kann hier einen enormen Unterschied machen.',
    mid: 'Sie haben ein Grundgefühl für Prioritäten, könnten aber strategischer vorgehen. Manchmal lassen Sie sich von der Masse der Aufgaben überwältigen. Mit den richtigen Methoden heben Sie Ihre Produktivität auf das nächste Level.',
    high: 'Sie sind ein Meister der Priorisierung. Sie unterscheiden klar zwischen wichtig und dringend, setzen Grenzen und arbeiten fokussiert an den Dingen, die den größten Impact haben.',
  },
  selbstreflexion: {
    low: 'Selbstreflexion ist derzeit kein fester Bestandteil Ihres Alltags. Sie neigen dazu, aus Misserfolgen keine systematischen Learnings abzuleiten. Dabei ist genau diese Fähigkeit der Schlüssel zu nachhaltigem Karrierewachstum.',
    mid: 'Sie reflektieren gelegentlich über Ihr Handeln und können Feedback annehmen. Ein regelmäßigerer Reflexionsprozess würde Ihnen helfen, blinde Flecken zu erkennen und schneller zu wachsen.',
    high: 'Sie sind hervorragend darin, Ihr eigenes Handeln zu hinterfragen und daraus zu lernen. Diese Fähigkeit zur Metakognition ist ein enormer Wettbewerbsvorteil.',
  },
  selbstfuersorge: {
    low: 'Ihre Work-Life-Balance ist deutlich aus dem Gleichgewicht. Sie neigen dazu, eigene Bedürfnisse hintanzustellen und Grenzen nicht zu setzen. Langfristig gefährdet das sowohl Ihre Gesundheit als auch Ihre Karriere.',
    mid: 'Sie achten grundlegend auf sich, aber in stressigen Phasen vernachlässigen Sie Ihre Selbstfürsorge. Klare Routinen und Grenzen können hier den Unterschied machen.',
    high: 'Sie pflegen einen gesunden Umgang mit sich selbst, setzen klare Grenzen und sorgen aktiv für Ausgleich. Diese emotionale Hygiene ist die Basis für nachhaltige Hochleistung.',
  },
  kompetenzbewusstsein: {
    low: 'Sie tun sich schwer damit, Ihre eigenen Kompetenzen klar zu benennen und Ihren Marktwert einzuschätzen. Das führt dazu, dass Sie Chancen nicht ergreifen und in Verhandlungen unter Ihrem Wert bleiben.',
    mid: 'Sie haben ein Grundbewusstsein für Ihre Kompetenzen, könnten aber strategischer damit umgehen. Eine klarere Positionierung würde Ihre Karrierechancen deutlich verbessern.',
    high: 'Sie kennen Ihren Marktwert, können Ihre Kompetenzen klar benennen und positionieren sich selbstbewusst. Das ist die Grundlage für erfolgreiche Gehaltsverhandlungen.',
  },
  kommunikation: {
    low: 'Ihre Kommunikation lässt Raum für Verbesserung. Schwierige Gespräche vermeiden Sie und Ihre Botschaften kommen nicht immer klar an. Gezielte Übung kann hier Wunder wirken.',
    mid: 'Sie kommunizieren solide, aber in Drucksituationen oder mit schwierigen Gegenübern gibt es Verbesserungspotenzial. Klarheit und Überzeugungskraft lassen sich trainieren.',
    high: 'Sie sind ein herausragender Kommunikator. Klar, überzeugend und empathisch — Sie passen Ihre Botschaft an Ihr Gegenüber an und kommen immer auf den Punkt.',
  },
  sozialkompetenz: {
    low: 'Der Umgang mit anderen Menschen kostet Sie Energie. Konflikte vermeiden Sie und in sozialen Situationen fühlen Sie sich unwohl. Gezielte Schritte können hier enormen Impact haben.',
    mid: 'Sie kommen mit den meisten Menschen gut aus, aber in Konfliktsituationen oder mit schwierigen Persönlichkeiten stoßen Sie an Ihre Grenzen. Hier liegt ungenutztes Potenzial.',
    high: 'Sie bewegen sich sicher in jeder sozialen Situation. Konflikte lösen Sie diplomatisch und Sie bauen schnell Vertrauen auf. Eine Schlüsselkompetenz für Führungsrollen.',
  },
  sozialisationskompetenz: {
    low: 'Veränderungen fallen Ihnen schwer. Neue Umgebungen, Teams oder Kulturen verunsichern Sie. In der heutigen Arbeitswelt ist Anpassungsfähigkeit jedoch essentiell für Karrierewachstum.',
    mid: 'Sie passen sich an neue Situationen an, brauchen aber Zeit. In einer Welt, die sich immer schneller verändert, würde schnellere Adaptionsfähigkeit Ihre Karrierechancen deutlich erhöhen.',
    high: 'Sie sind ein Chamäleon im besten Sinne. Neue Umgebungen, Teams und Kulturen bereichern Sie. Diese Anpassungsfähigkeit ist in der globalen Arbeitswelt Gold wert.',
  },
  praesentation: {
    low: 'Präsentationen und öffentliches Sprechen bereiten Ihnen erhebliches Unbehagen. Da Sichtbarkeit jedoch entscheidend für den Karriereaufstieg ist, lohnt sich gezieltes Training hier besonders.',
    mid: 'Sie können präsentieren, aber Ihre Wirkung könnte stärker sein. Mit besserer Vorbereitung und mehr Souveränität bei Zwischenfragen werden Sie überzeugender.',
    high: 'Sie sind ein Natural auf der Bühne. Sicher, überzeugend und charismatisch — Ihre Präsentationsfähigkeit öffnet Ihnen Türen, die anderen verschlossen bleiben.',
  },
  emotionale_intelligenz: {
    low: 'Das Erkennen und Steuern von Emotionen — bei sich selbst und anderen — ist eine Herausforderung für Sie. Emotionale Intelligenz ist jedoch der stärkste Prädiktor für beruflichen Erfolg.',
    mid: 'Sie spüren Emotionen bei anderen und reagieren meistens angemessen. In Drucksituationen könnte Ihre emotionale Regulation jedoch stärker sein.',
    high: 'Ihre emotionale Intelligenz ist außergewöhnlich. Sie erkennen feinste Nuancen bei anderen, regulieren Ihre eigenen Emotionen und schaffen dadurch Vertrauen und Verbindung.',
  },
  charisma: {
    low: 'Ihre Ausstrahlung und Präsenz in Gruppen könnte stärker sein. Charisma ist erlernbar — und der Rückgrat jeder Führungspersönlichkeit.',
    mid: 'Sie haben eine sympathische Ausstrahlung, aber Ihr Charisma könnte magnetischer sein. Mit bewusstem Auftreten und Storytelling verstärken Sie Ihre Wirkung.',
    high: 'Sie verfügen über eine beeindruckende Ausstrahlung. Menschen hören Ihnen zu, folgen Ihnen und erinnern sich an Sie. Diese natürliche Autorität ist ein Karriere-Beschleuniger.',
  },
  resilienz: {
    low: 'Rückschläge treffen Sie hart und die Erholung dauert lange. In einer Karriere voller Auf und Abs ist Resilienz jedoch die Schlüsselkompetenz, die Gewinner von Aufgebern unterscheidet.',
    mid: 'Sie erholen sich von Rückschlägen, aber es kostet Sie Energie und Zeit. Mit den richtigen Strategien können Sie Ihre Widerstandskraft deutlich steigern.',
    high: 'Sie sind außergewöhnlich widerstandsfähig. Rückschläge betrachten Sie als Lernchancen und erholen sich schnell. Diese Resilienz ist Ihr Fundament für langfristigen Erfolg.',
  },
  fuehrung: {
    low: 'Führung ist derzeit nicht Ihre Stärke. Entscheidungen treffen, Verantwortung übernehmen und andere inspirieren — das sind Fähigkeiten, die sich gezielt entwickeln lassen.',
    mid: 'Sie haben Führungspotenzial, aber Ihre Fähigkeit, Teams zu führen und schwierige Entscheidungen zu treffen, könnte ausgeprägter sein. Gezielte Entwicklung bringt Sie auf das nächste Level.',
    high: 'Sie sind eine geborene Führungsperson. Sie treffen mutige Entscheidungen, schützen Ihr Team und inspirieren andere. Diese Kompetenz prädestiniert Sie für C-Level-Positionen.',
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
  if (score >= 31) return { label: 'Ausbaufähig', color: '#F97316', badge: '\u{1F4C8}' };
  return { label: 'Großes Potenzial', color: '#EF4444', badge: '\u{1F331}' };
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
export default function AnalyseClient({ profile, existingSession, userId, autoStart }) {
  const supabase = createClient();
  const initialPhase = existingSession?.status === 'completed' ? 3 : existingSession?.status === 'in_progress' ? 2 : (autoStart ? 2 : 1);
  const [phase, setPhase] = useState(initialPhase);
  const [fieldIndex, setFieldIndex] = useState(existingSession?.current_field || 0);
  const [questionIndex, setQuestionIndex] = useState(0);
  const [answers, setAnswers] = useState(existingSession?.answers || {});
  const [fieldScores, setFieldScores] = useState(existingSession?.scores || {});
  const [showFieldResult, setShowFieldResult] = useState(false);
  const [showCategoryIntro, setShowCategoryIntro] = useState(initialPhase === 2 && !existingSession?.current_field);
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

  const goBack = useCallback(() => {
    if (selectedOption) return; // Nicht während Animation
    if (questionIndex > 0) {
      // Zurück zur vorherigen Frage im selben Feld
      setQuestionIndex(questionIndex - 1);
      const fieldId = currentField.id;
      const fieldAnswers = [...(answers[fieldId] || [])];
      fieldAnswers[questionIndex - 1] = undefined;
      setAnswers({ ...answers, [fieldId]: fieldAnswers });
    } else if (fieldIndex > 0) {
      // Zurück zum letzten Feld, letzte Frage
      const prevIdx = fieldIndex - 1;
      const prevFieldId = KOMPETENZFELDER[prevIdx].id;
      // Score entfernen
      const newScores = { ...fieldScores };
      delete newScores[prevFieldId];
      setFieldScores(newScores);
      setFieldIndex(prevIdx);
      setQuestionIndex(4); // Letzte Frage des vorherigen Feldes
    } else {
      // Ganz am Anfang — zurück zur Preview
      setPhase(1);
    }
  }, [questionIndex, fieldIndex, currentField, answers, fieldScores, selectedOption]);

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
              Du hast {completed}/13 Felder abgeschlossen. Möchtest du fortfahren?
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
      <div className="page-container" style={{ maxWidth: 640 }}>
        <AnimStyles />

        {/* ── Hero ── */}
        <div style={{ textAlign: 'center', padding: '40px 0 44px' }}>
          <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', marginBottom: 20 }}>
            Kostenlos · ca. 15 Minuten
          </div>

          <h1 style={{ fontSize: 34, fontWeight: 700, letterSpacing: '-0.03em', lineHeight: 1.15, marginBottom: 14 }}>
            Dein Karriere-Blutbild
          </h1>

          <p style={{ fontSize: 16, color: 'var(--ki-text-secondary)', lineHeight: 1.65, maxWidth: 420, margin: '0 auto 32px' }}>
            13 Kompetenzfelder. 4 Dimensionen. Ein klares Bild deiner beruflichen Stärken und Potenziale.
          </p>

          <button className="btn btn-primary" onClick={() => setPhase(2)} style={{ padding: '14px 36px', fontSize: 15 }}>
            Analyse starten
          </button>

          <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 14 }}>
            Kein Standardtest — eine strukturierte Analyse deiner Karriere-DNA.
          </p>
        </div>

        {/* ── 4 Dimensionen ── */}
        <div style={{
          display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 14, marginBottom: 36,
        }}>
          {[
            { Icon: Eye, title: 'Wahrnehmung', desc: 'Wie du auftrittst und auf andere wirkst.', fields: 'Sozialkompetenz · Sozialisation · Präsentation' },
            { Icon: Flame, title: 'Antrieb', desc: 'Was dich innerlich leitet und dir Stabilität gibt.', fields: 'Selbstwertgefühl · Kompetenzbewusstsein · Resilienz' },
            { Icon: MessageCircle, title: 'Wirkung', desc: 'Wie du überzeugst, führst und Vertrauen aufbaust.', fields: 'Kommunikation · Charisma · Führung' },
            { Icon: Compass, title: 'Steuerung', desc: 'Wie du Prioritäten setzt und dich regulierst.', fields: 'Prioritäten · Selbstfürsorge · Emotionale Intelligenz · Selbstreflexion' },
          ].map((dim, i) => (
            <div key={i} className="card" style={{ padding: '22px 24px' }}>
              <dim.Icon size={26} strokeWidth={1.5} style={{ marginBottom: 12, color: 'var(--ki-text-secondary)' }} />
              <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 6 }}>{dim.title}</div>
              <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.5, marginBottom: 8 }}>{dim.desc}</div>
              <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', lineHeight: 1.5 }}>{dim.fields}</div>
            </div>
          ))}
        </div>

        {/* ── Stats ── */}
        <div style={{ display: 'flex', justifyContent: 'center', gap: 36, paddingBottom: 32 }}>
          {[['18.000+', 'Mitglieder'], ['13', 'Kompetenzfelder'], ['65', 'Szenarien']].map(([val, label]) => (
            <div key={label} style={{ textAlign: 'center' }}>
              <div style={{ fontSize: 15, fontWeight: 700 }}>{val}</div>
              <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', marginTop: 2 }}>{label}</div>
            </div>
          ))}
        </div>

      </div>
    );
  }

  // PHASE 2: SCENARIOS
  if (phase === 2) {
    // Category intro
    if (showCategoryIntro) {
      // Bei erstem Start: aktuelle Kategorie zeigen, sonst nächste
      const introCat = fieldIndex === 0 && questionIndex === 0 ? currentCategory : KOMPETENZFELDER[fieldIndex + 1]?.category;
      const intro = CATEGORY_INTROS[introCat];
      return (
        <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
          <AnimStyles />
          <div className="animate-in" style={{ textAlign: 'center', maxWidth: 440 }}>
            <div style={{ fontSize: 12, fontWeight: 500, color: 'var(--ki-text-tertiary)', marginBottom: 16, letterSpacing: '0.04em' }}>
              Dimension {intro?.num}
            </div>
            <h2 style={{ fontSize: 26, fontWeight: 700, marginBottom: 12, letterSpacing: '-0.02em' }}>{intro?.title}</h2>
            <p style={{ fontSize: 15, color: 'var(--ki-text-secondary)', lineHeight: 1.6, marginBottom: 24 }}>{intro?.text}</p>

            {/* Felder dieser Dimension */}
            <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: 8, marginBottom: 32 }}>
              {(intro?.fields || []).map(f => (
                <span key={f} style={{
                  padding: '6px 14px', borderRadius: 'var(--r-pill)',
                  background: 'var(--ki-bg-alt)', border: '1px solid var(--ki-border)',
                  fontSize: 13, fontWeight: 500, color: 'var(--ki-text-secondary)',
                }}>{f}</span>
              ))}
            </div>

            <button className="btn btn-primary" onClick={() => {
              setShowCategoryIntro(false);
              if (fieldIndex > 0 || questionIndex > 0) {
                setFieldIndex(fieldIndex + 1);
                setQuestionIndex(0);
              }
            }} style={{ padding: '12px 32px', fontSize: 15 }}>
              Weiter
            </button>
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
          <div className="card animate-in" style={{ maxWidth: 520, textAlign: 'center', padding: 40 }}>
            <FieldProgress fields={KOMPETENZFELDER} currentIndex={fieldIndex} scores={fieldScores} />
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
                Nächstes Feld: {KOMPETENZFELDER[fieldIndex + 1]?.icon} {KOMPETENZFELDER[fieldIndex + 1]?.name}
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
      <div style={{ minHeight: '80vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: 24 }}>
        <AnimStyles />
        <div className="animate-in" style={{ maxWidth: 580, width: '100%' }}>

          {/* Field Progress Circles */}
          <FieldProgress fields={KOMPETENZFELDER} currentIndex={fieldIndex} scores={fieldScores} />

          {/* Top: Progress + Context */}
          <div style={{ marginBottom: 28 }}>
            <div className="progress-bar" style={{ height: 3, marginBottom: 12 }}>
              <div className="progress-bar-fill" style={{ width: `${overallProgress}%`, transition: 'width 0.5s ease' }} />
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <button onClick={goBack} style={{
                  background: 'none', border: 'none', cursor: 'pointer', padding: '4px 8px',
                  fontSize: 14, color: 'var(--ki-text-tertiary)', borderRadius: 'var(--r-sm)',
                  transition: 'color 0.15s ease',
                }} onMouseEnter={e => e.target.style.color = 'var(--ki-text)'} onMouseLeave={e => e.target.style.color = 'var(--ki-text-tertiary)'}>
                  ←
                </button>
                <span style={{ fontSize: 13, fontWeight: 600 }}>{currentField.name}</span>
              </div>
              <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>{questionIndex + 1} / 5</span>
            </div>
          </div>

          {/* Scenario */}
          <div style={{ marginBottom: 24 }}>
            <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 10 }}>Situation</div>
            <p style={{ fontSize: 18, fontWeight: 600, lineHeight: 1.55, color: 'var(--ki-text)' }}>{currentScenario.scenario}</p>
          </div>

          {/* Options */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            {currentScenario.options.map((opt, i) => {
              const isSelected = selectedOption === opt;
              return (
                <button key={i} onClick={() => !selectedOption && handleOptionClick(opt)} style={{
                  display: 'flex', alignItems: 'center', gap: 14, padding: '16px 20px',
                  borderRadius: 'var(--r-md)', cursor: selectedOption ? 'default' : 'pointer',
                  textAlign: 'left', width: '100%',
                  border: isSelected ? '2px solid var(--ki-red)' : '2px solid var(--ki-border)',
                  background: isSelected ? 'rgba(204,20,38,0.04)' : 'var(--ki-card)',
                  animation: isSelected ? 'optPulse 0.3s ease' : 'none',
                  transition: 'all 0.2s ease',
                  opacity: selectedOption && !isSelected ? 0.4 : 1,
                  transform: isSelected ? 'scale(1.01)' : 'scale(1)',
                }}>
                  <span style={{
                    width: 28, height: 28, borderRadius: '50%', flexShrink: 0,
                    background: 'var(--ki-bg-alt)', border: '1px solid var(--ki-border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)',
                  }}>{String.fromCharCode(65 + i)}</span>
                  <span style={{ fontSize: 14, fontWeight: 500, lineHeight: 1.5 }}>{opt.text}</span>
                </button>
              );
            })}
          </div>

          {/* Progress dots */}
          <div style={{ display: 'flex', justifyContent: 'center', gap: 5, marginTop: 24 }}>
            {[0, 1, 2, 3, 4].map(i => (
              <div key={i} style={{
                width: i === questionIndex ? 20 : 6, height: 6, borderRadius: 3,
                background: i <= questionIndex ? 'var(--ki-red)' : 'var(--ki-border)',
                transition: 'all 0.3s ease',
              }} />
            ))}
          </div>

        </div>
      </div>
    );
  }

  // PHASE 3: KARRIERE-PHASE AUSWAHL
  if (phase === 3) {
    const KARRIERE_PHASEN_AUSWAHL = [
      { id: 'studierende', label: 'Studierende', desc: 'Studium, Praktika, Berufseinstieg vorbereiten' },
      { id: 'berufseinsteiger', label: 'Berufseinsteiger (0–3 Jahre)', desc: 'Erste Festanstellung, Orientierung, Skills aufbauen' },
      { id: 'berufserfahren', label: 'Berufserfahren (3–10 Jahre)', desc: 'Expertise vertiefen, Karriere beschleunigen, Gehalt optimieren' },
      { id: 'fuehrungskraft', label: 'Führungskraft / Executive', desc: 'Team leiten, strategisch denken, C-Level Netzwerk' },
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
            <h3 style={{ fontSize: 15, fontWeight: 700, marginBottom: 12 }}>Deine Top 3 Stärken</h3>
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
                ? `Dein objektiver Score liegt ${impostorDelta}% über deiner Selbsteinschätzung. Du unterschätzt dich systematisch — ein klassisches Impostor-Syndrom-Muster.`
                : `Deine Selbsteinschätzung liegt ${Math.abs(impostorDelta)}% über deinem objektiven Score. Etwas mehr kritische Reflexion könnte dir helfen.`
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
          <h3 style={{ fontSize: 16, fontWeight: 700, marginBottom: 16 }}>Was willst du als Nächstes tun?</h3>
          <div className="grid-3">
            <a href="/coach" className="card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{'\u{1F916}'}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Mit Coach besprechen</div>
            </a>
            <a href="/masterclass" className="card" style={{ textDecoration: 'none', color: 'inherit', textAlign: 'center', padding: 20 }}>
              <div style={{ fontSize: 28, marginBottom: 8 }}>{'\u25B6'}</div>
              <div style={{ fontSize: 13, fontWeight: 600 }}>Schwächsten Bereich trainieren</div>
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
          <div style={{ color: 'rgba(255,255,255,0.5)', fontSize: 12 }}>Video verfügbar ab April 2026</div>
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
