'use client';

import { useState, useMemo, useEffect, useRef } from 'react';
import { createClient } from '@/lib/supabase/client';
import { awardPoints } from '@/lib/gamification';
import { isLessonVisible, isLessonHighlighted, getPhaseLabel, PHASEN } from '@/lib/elearning/zielgruppen-config';

// Shared widgets (reusable across courses)
import SelbstdiagnoseWidget from '@/components/elearning/SelbstdiagnoseWidget';
import BossFightWidget from '@/components/elearning/BossFightWidget';
import DragDropSortierung from '@/components/elearning/DragDropSortierung';
import SzenarioPlayer from '@/components/elearning/SzenarioPlayer';
import ChronotypTest from '@/components/elearning/ChronotypTest';
import BrainDumpTimer from '@/components/elearning/BrainDumpTimer';
import NeinSkripteWidget from '@/components/elearning/NeinSkripteWidget';
import JournalEntry from '@/components/elearning/JournalEntry';
import AbschlussTestWidget from '@/components/elearning/AbschlussTestWidget';

// Kommunikation-specific widgets
import VierOhrenDragDrop from '@/components/elearning/VierOhrenDragDrop';
import ZuhoerStufenWidget from '@/components/elearning/ZuhoerStufenWidget';
import FeedbackTemplates from '@/components/elearning/FeedbackTemplates';
import EmailTemplates from '@/components/elearning/EmailTemplates';
import ElevatorPitchBuilder from '@/components/elearning/ElevatorPitchBuilder';
import StimmTrainingWidget from '@/components/elearning/StimmTrainingWidget';
import DigitaleKommWidget from '@/components/elearning/DigitaleKommWidget';

// Prioritätenmanagement content
import {
  BOSS_FIGHTS, EISENHOWER_SORTIERUNG, NEIN_SKRIPTE,
  SZENARIEN, JOURNAL_FRAGEN, MODUL_QUIZ, ABSCHLUSSTEST,
} from '@/lib/elearning/prioritaeten-content';

// Kommunikation content
import {
  SELBSTDIAGNOSE_KOMM, BOSS_FIGHTS_KOMM, VIER_OHREN_UEBUNG,
  FEEDBACK_TEMPLATES as FEEDBACK_TEMPLATES_DATA, EMAIL_TEMPLATES as EMAIL_TEMPLATES_DATA,
  SZENARIO_KONFLIKTE, NOTFALL_SKRIPTE_KOMM, STRESS_KOMMUNIKATION,
  SMALLTALK_TOOLKIT, ABSCHLUSSTEST_KOMM, MODUL_QUIZ_KOMM,
  JOURNAL_FRAGEN_KOMM, KOERPERSPRACHE_LESEN,
} from '@/lib/elearning/kommunikation-content';

// Speedreading-specific widgets
import WPMTestWidget from '@/components/elearning/WPMTestWidget';
import SehspannenTrainer from '@/components/elearning/SehspannenTrainer';
import ChunkReadingTrainer from '@/components/elearning/ChunkReadingTrainer';
import PacerSimulator from '@/components/elearning/PacerSimulator';
import ErgonomieCheckWidget from '@/components/elearning/ErgonomieCheckWidget';
import DifferenzierungsMatrix from '@/components/elearning/DifferenzierungsMatrix';
import AtemTimerWidget from '@/components/elearning/AtemTimerWidget';
import RelevanzFilterBuilder from '@/components/elearning/RelevanzFilterBuilder';
import ShareableProgressCard from '@/components/elearning/ShareableProgressCard';

// Speedreading content
import {
  SELBSTDIAGNOSE_SPEED, BOSS_FIGHTS_SPEED, AUGENGESUNDHEIT,
  DIFFERENZIERUNG, RELEVANZ_FILTER, PRE_READ_FOKUS,
  WPM_TEXTE, SEHSPANNEN_CONFIG, CHUNK_READING_CONFIG,
  MODUL_QUIZ_SPEED, JOURNAL_FRAGEN_SPEED, FORTSCHRITT,
} from '@/lib/elearning/speedreading-content';

// Typgerechtes Lernen widgets
import LerntypTest from '@/components/elearning/LerntypTest';
import VergessenskurveWidget from '@/components/elearning/VergessenskurveWidget';
import FeynmanUebung from '@/components/elearning/FeynmanUebung';
import FlowFormelBuilder from '@/components/elearning/FlowFormelBuilder';
import StateManagementWidget from '@/components/elearning/StateManagementWidget';
import FehlerAutopsieWidget from '@/components/elearning/FehlerAutopsieWidget';
import TransferPlannerWidget from '@/components/elearning/TransferPlannerWidget';
import MentorMirrorWidget from '@/components/elearning/MentorMirrorWidget';
import UnlearnAssistantWidget from '@/components/elearning/UnlearnAssistantWidget';
import ExecutiveAbstractorWidget from '@/components/elearning/ExecutiveAbstractorWidget';
import SyntheseTrainerWidget from '@/components/elearning/SyntheseTrainerWidget';
import LernROICalculator from '@/components/elearning/LernROICalculator';

// Typgerechtes Lernen content
import {
  SELBSTDIAGNOSE_LERNEN, LERNTYP_TEST, BOSS_FIGHTS_LERNEN,
  EMOTIONEN_LERNEN, FEHLER_KULTUR, TRANSFER,
  EINSTEIGER_EXTRAS, PROFESSIONAL_EXTRAS, FUEHRUNGSKRAFT_EXTRAS,
  MODUL_QUIZ_LERNEN, JOURNAL_FRAGEN_LERNEN, ABSCHLUSSTEST_LERNEN,
} from '@/lib/elearning/lernen-content';

// Balance widgets
import LebensradWidget from '@/components/elearning/LebensradWidget';
import BurnoutStufenWidget from '@/components/elearning/BurnoutStufenWidget';
import StressAmpelWidget from '@/components/elearning/StressAmpelWidget';
import ShutdownRitualBuilder from '@/components/elearning/ShutdownRitualBuilder';
import EnergieProtokollWidget from '@/components/elearning/EnergieProtokollWidget';
import MicroRecoveryWidget from '@/components/elearning/MicroRecoveryWidget';
import BeziehungsKontoWidget from '@/components/elearning/BeziehungsKontoWidget';

// Balance content
import {
  SELBSTDIAGNOSE_BALANCE, BOSS_FIGHTS_BALANCE, MICRO_RECOVERY,
  BURNOUT_STUFEN, SHUTDOWN_RITUAL, ENERGIE_PROTOKOLL, GRENZ_SKRIPTE,
  MODUL_QUIZ_BALANCE, JOURNAL_FRAGEN_BALANCE, ABSCHLUSSTEST_BALANCE,
} from '@/lib/elearning/balance-content';

// Networking widgets
import NetzwerkMapBuilder from '@/components/elearning/NetzwerkMapBuilder';
import CRMBuilder from '@/components/elearning/CRMBuilder';
import FollowUpTemplates from '@/components/elearning/FollowUpTemplates';
import WertGeschenkeWidget from '@/components/elearning/WertGeschenkeWidget';
import LinkedInTemplates from '@/components/elearning/LinkedInTemplates';
import OpenerGenerator from '@/components/elearning/OpenerGenerator';
import MentorAnfrageBuilder from '@/components/elearning/MentorAnfrageBuilder';
import GeisterCounterWidget from '@/components/elearning/GeisterCounterWidget';

// Networking content
import {
  SELBSTDIAGNOSE_NETZ, BOSS_FIGHTS_NETZ, WERT_GESCHENKE,
  FOLLOW_UP_TEMPLATES, OPENER, MENTOR_TEMPLATES, CRM_CONFIG,
  MODUL_QUIZ_NETZ, JOURNAL_FRAGEN_NETZ, ABSCHLUSSTEST_NETZ,
} from '@/lib/elearning/networking-content';

// Gehaltsverhandlung widgets
import GehaltSimulationWidget from '@/components/elearning/GehaltSimulationWidget';
import {
  SalaryGapWidget, FearSelectorWidget, SelfAssessmentWidget,
  ThreeNumbersWidget, ImpactSentencesWidget, PitchBuilderWidget,
  ArgumentsBuilderWidget, StrategyPickerWidget, EmailTemplateWidget,
  FinalAssessmentWidget,
} from '@/components/elearning/GehaltInteraktivWidget';

// Gehaltsverhandlung content
import { LESSON_CONTENT as GEHALT_CONTENT, QUIZ_GEHALT } from '@/lib/elearning/gehaltsverhandlung-content';

const PRIO_COURSE_ID = 'c1000000-0000-0000-0000-000000000006';
const KOMM_COURSE_ID = 'c1000000-0000-0000-0000-000000000001';
const SPEED_COURSE_ID = 'c1000000-0000-0000-0000-000000000004';
const LERNEN_COURSE_ID = 'c1000000-0000-0000-0000-000000000005';
const BALANCE_COURSE_ID = 'c1000000-0000-0000-0000-000000000002';
const NETZ_COURSE_ID = 'c1000000-0000-0000-0000-000000000003';
const GEHALT_COURSE_ID = 'c1000000-0000-0000-0000-000000000007';

// --- Quiz data per course slug/title keyword ---
const QUIZ_DATA = {
  kommunikation: [
    {
      question: 'Was sind die 4 Ebenen einer Nachricht nach Schulz von Thun?',
      options: [
        'Sachinhalt, Selbstoffenbarung, Beziehung, Appell',
        'Sprache, Ton, Mimik, Gestik',
        'Sender, Empfänger, Kanal, Rückmeldung',
        'Inhalt, Form, Stil, Wirkung',
      ],
      correct: 0,
    },
    {
      question: 'Was bedeutet aktives Zuhören?',
      options: [
        'Schweigen und warten bis der andere fertig ist',
        'Zusammenfassen, nachfragen, Blickkontakt',
        'Notizen machen und Fragen stellen',
        'Nicken und zustimmen',
      ],
      correct: 1,
    },
    {
      question: 'Was ist das Hauptziel konstruktiven Feedbacks?',
      options: [
        'Die eigene Meinung durchsetzen',
        'Den anderen motivieren',
        'Verhalten ändern ohne zu verletzen',
        'Leistung bewerten',
      ],
      correct: 2,
    },
    {
      question: 'Welcher Faktor macht Kommunikation am meisten aus?',
      options: [
        'Die Wortwahl',
        'Die Länge der Aussage',
        'Körpersprache und Tonfall',
        'Das Vokabular',
      ],
      correct: 2,
    },
    {
      question: 'Was blockiert gute Kommunikation am stärksten?',
      options: [
        'Zu wenig Redezeit',
        'Annahmen über den Gesprächspartner',
        'Unterschiedliche Sprachen',
        'Lautstärke',
      ],
      correct: 1,
    },
  ],
  'work-life': [
    {
      question: 'Was ist der häufigste Grund für Burnout?',
      options: [
        'Zu viele Überstunden',
        'Fehlende Kontrolle über die eigene Arbeit',
        'Schlechte Kollegen',
        'Zu wenig Urlaub',
      ],
      correct: 1,
    },
    {
      question: 'Was ist Work-Life-Planning?',
      options: [
        'Strikte Trennung von Beruf und Privatleben',
        'Bewusste Integration von Arbeit und Leben',
        'Urlaub strategisch planen',
        'Arbeitszeiten reduzieren',
      ],
      correct: 1,
    },
    {
      question: 'Welche Strategie hilft bei Grenzen setzen?',
      options: [
        'Alle Anfragen ablehnen',
        'Nicht-Verhandelbar Zeiten festlegen',
        'Das Handy ausschalten',
        'Früher ins Büro kommen',
      ],
      correct: 1,
    },
    {
      question: 'Was fördert körperliches Gleichgewicht?',
      options: [
        'Weniger schlafen',
        'Mehr Koffein',
        'Regelmäßige Bewegung und Pausen',
        'Vitaminsupplemente',
      ],
      correct: 2,
    },
    {
      question: 'Zufriedenheit entsteht durch...',
      options: [
        'Mehr Gehalt',
        'Mehr Freizeit',
        'Übereinstimmung von Werten und Handeln',
        'Statuserreichen',
      ],
      correct: 2,
    },
  ],
  networking: [
    {
      question: 'Die wichtigste Regel beim Networking?',
      options: [
        'Visitenkarten sammeln',
        'Immer der lauteste sein',
        'Erst geben, dann nehmen',
        'Möglichst viele Kontakte knüpfen',
      ],
      correct: 2,
    },
    {
      question: 'Warum ist Expertenwissen beim Networking wichtig?',
      options: [
        'Man kann andere belehren',
        'Man wird als wertvoller Gesprächspartner wahrgenommen',
        'Es spart Gesprächszeit',
        'Es beeindruckt Führungskräfte',
      ],
      correct: 1,
    },
    {
      question: 'Was macht ein gutes Networking-Gespräch aus?',
      options: [
        'Den eigenen Lebenslauf vorstellen',
        'Interesse am anderen zeigen und zuhören',
        'Möglichst viel über sich erzählen',
        'Schnell zum Punkt kommen',
      ],
      correct: 1,
    },
    {
      question: 'Wie oft sollte man wichtige Kontakte pflegen?',
      options: [
        'Täglich',
        'Nur wenn man etwas braucht',
        'Mindestens einmal pro Quartal',
        'Einmal im Jahr',
      ],
      correct: 2,
    },
    {
      question: 'Was unterscheidet dauerhaftes von oberflächlichem Networking?',
      options: [
        'Die Anzahl der Kontakte',
        'Die Plattform',
        'Gegenseitiger Mehrwert und Vertrauen',
        'Die Häufigkeit der Nachrichten',
      ],
      correct: 2,
    },
  ],
  speedreading: [
    {
      question: 'Was ist der häufigste Grund für langsames Lesen?',
      options: [
        'Schlechte Beleuchtung',
        'Zu kleine Schrift',
        'Subvokalisierung (innerliches Mitsprechen)',
        'Ablenkung durch Umgebung',
      ],
      correct: 2,
    },
    {
      question: 'Was ist peripheres Sehen beim Lesen?',
      options: [
        'Randbereiche ignorieren',
        'Mehrere Wörter gleichzeitig erfassen',
        'Schneller mit den Augen bewegen',
        'Den Text überspringen',
      ],
      correct: 1,
    },
    {
      question: 'Wie verdoppelt man die Lesegeschwindigkeit?',
      options: [
        'Mit dem Finger unter der Zeile entlangfahren',
        'Nur Überschriften lesen',
        'Regelmäßiges Training mit Zeitdruck',
        'Größere Bücher lesen',
      ],
      correct: 2,
    },
    {
      question: 'Was verbessert das Textverständnis?',
      options: [
        'Zweimal lesen',
        'Laut vorlesen',
        'Vorwissen aktivieren vor dem Lesen',
        'Kurze Abschnitte wählen',
      ],
      correct: 2,
    },
    {
      question: 'Was ist Skimming?',
      options: [
        'Wort für Wort lesen',
        'Schnelles Überfliegen für Kernaussagen',
        'Rückwärts lesen',
        'Absatzweise lesen',
      ],
      correct: 1,
    },
  ],
  'typgerecht': [
    {
      question: 'Was unterscheidet Hirnbesitzer von Hirnbenutzern?',
      options: [
        'Die Intelligenz',
        'Das Alter beim Lernen',
        'Bewusster Einsatz von Lernstrategien',
        'Die Bildung',
      ],
      correct: 2,
    },
    {
      question: 'Was ist der Spacing-Effekt?',
      options: [
        'Lernpausen zwischen Aufgaben',
        'Verteiltes Lernen ist effektiver als Massen-Lernen',
        'Lernziele verteilen',
        'Inhalte strukturieren',
      ],
      correct: 1,
    },
    {
      question: 'Welcher Lerntyp profitiert von Mindmaps?',
      options: [
        'Der auditive Lerntyp',
        'Der kinästhetische Lerntyp',
        'Der visuelle Lerntyp',
        'Der kommunikative Lerntyp',
      ],
      correct: 2,
    },
    {
      question: 'Was passiert nach 24h ohne Wiederholung?',
      options: [
        'Das Gelernte ist vollständig gespeichert',
        'Ca. 30% wird vergessen',
        'Ca. 70% des Gelernten wird vergessen',
        'Nichts, das Gehirn speichert alles',
      ],
      correct: 2,
    },
    {
      question: 'Was ist die effektivste Lernmethode?',
      options: [
        'Texte mehrfach lesen',
        'Markieren und unterstreichen',
        'Aktives Abrufen (Recall) statt passives Lesen',
        'Audiobooks hören',
      ],
      correct: 2,
    },
  ],
  'priorit': [
    {
      question: 'Was ist das Eisenhower-Prinzip?',
      options: [
        'Aufgaben nach Größe sortieren',
        'Unterscheidung in wichtig/unwichtig und dringend/nicht dringend',
        'Immer die schwerste Aufgabe zuerst',
        'Delegieren oder löschen',
      ],
      correct: 1,
    },
    {
      question: 'Was sollte man mit wichtigen, nicht dringenden Aufgaben tun?',
      options: [
        'Sofort erledigen',
        'Delegieren',
        'Terminieren und strategisch einplanen',
        'Ignorieren',
      ],
      correct: 2,
    },
    {
      question: 'Was ist der häufigste Fehler bei der Priorisierung?',
      options: [
        'Zu viele Aufgaben annehmen',
        'Dringendes vor Wichtigem erledigen',
        'Keine Liste führen',
        'Zu früh aufhören',
      ],
      correct: 1,
    },
    {
      question: 'Was hilft gegen Aufschieberitis?',
      options: [
        'Mehr Kaffee trinken',
        'Den Abgabetermin verlängern',
        'Aufgaben in kleine Schritte zerlegen',
        'Andere bitten zu helfen',
      ],
      correct: 2,
    },
    {
      question: 'Was ist Timeboxing?',
      options: [
        'Aufgaben zeitlich begrenzen',
        'Feste Zeitblöcke für bestimmte Aufgaben reservieren',
        'Zeiten tracken',
        'Weniger Zeit für Meetings einplanen',
      ],
      correct: 1,
    },
  ],
};

function getQuizForCourse(courseTitle) {
  if (!courseTitle) return null;
  const t = courseTitle.toLowerCase();
  if (t.includes('kommunikation')) return QUIZ_DATA.kommunikation;
  if (t.includes('work') || t.includes('life') || t.includes('balance')) return QUIZ_DATA['work-life'];
  if (t.includes('network')) return QUIZ_DATA.networking;
  if (t.includes('speed') || t.includes('lesen') || t.includes('reading')) return QUIZ_DATA.speedreading;
  if (t.includes('typgerecht') || t.includes('lerntyp') || t.includes('lernen')) return QUIZ_DATA['typgerecht'];
  if (t.includes('priorit') || t.includes('zeitmanagement') || t.includes('management')) return QUIZ_DATA['priorit'];
  return null;
}

function getLessonTypeIcon(type) {
  if (type === 'video') return '📹';
  if (type === 'interactive') return '🎮';
  if (type === 'exercise') return '🏋️';
  if (type === 'quiz') return '📝';
  if (type === 'scenario') return '🎭';
  if (type === 'bossfight') return '⚔️';
  return '📄';
}

// =====================
// PRIORITÄTENMANAGEMENT WIDGET ROUTER
// =====================
function PrioLessonRouter({ lesson, lessonType, isCompleted, onMarkComplete, saving, userId, courseTitle }) {
  const title = (lesson.title || '').toLowerCase();
  const modOrder = lesson._moduleSortOrder ?? -1;

  // Helper: get module-specific quiz questions
  function getModulQuiz() {
    const key = `modul_${modOrder}`;
    return MODUL_QUIZ?.[key] || null;
  }

  // Modul 0: Selbstdiagnose
  if (modOrder === 0 && lessonType === 'interactive') {
    return isCompleted ? (
      <CompletedBadge text="Selbstdiagnose abgeschlossen" />
    ) : (
      <SelbstdiagnoseWidget onComplete={onMarkComplete} />
    );
  }

  // Boss-Fight: Cypher (Modul 1)
  if (title.includes('boss-fight') && title.includes('cypher')) {
    return isCompleted ? (
      <CompletedBadge text="Boss-Fight: Cypher besiegt! +150 XP" />
    ) : (
      <BossFightWidget config={BOSS_FIGHTS.cypher} onComplete={onMarkComplete} />
    );
  }

  // Boss-Fight: Dr. Dringend (Modul 7)
  if (title.includes('boss-fight') && title.includes('dringend')) {
    return isCompleted ? (
      <CompletedBadge text="Boss-Fight: Dr. Dringend besiegt! +200 XP" />
    ) : (
      <BossFightWidget config={BOSS_FIGHTS.dr_dringend} onComplete={onMarkComplete} />
    );
  }

  // Drag & Drop Eisenhower (Modul 2)
  if (title.includes('drag') && title.includes('drop')) {
    return isCompleted ? (
      <CompletedBadge text="Eisenhower-Sortierung abgeschlossen" />
    ) : (
      <DragDropSortierung config={EISENHOWER_SORTIERUNG} onComplete={onMarkComplete} />
    );
  }

  // Szenario: Posteingang (Modul 1)
  if (title.includes('posteingang')) {
    return isCompleted ? (
      <CompletedBadge text="Szenario abgeschlossen" />
    ) : (
      <SzenarioPlayer config={SZENARIEN.posteingang} onComplete={onMarkComplete} />
    );
  }

  // Szenario: Tag der Entscheidung (Modul 6)
  if (title.includes('tag der entscheidung')) {
    return isCompleted ? (
      <CompletedBadge text="Szenario abgeschlossen" />
    ) : (
      <SzenarioPlayer config={SZENARIEN.entscheidung} onComplete={onMarkComplete} />
    );
  }

  // Chronotyp-Test (Modul 3)
  if (title.includes('chronotyp')) {
    return isCompleted ? (
      <CompletedBadge text="Chronotyp-Test abgeschlossen" />
    ) : (
      <ChronotypTest onComplete={onMarkComplete} />
    );
  }

  // Tagesplan Generator (Modul 3)
  if (title.includes('tagesplan')) {
    return isCompleted ? (
      <CompletedBadge text="Tagesplan erstellt" />
    ) : (
      <ChronotypTest onComplete={onMarkComplete} />
    );
  }

  // Brain-Dump (Modul 4)
  if (title.includes('brain-dump') || title.includes('brain dump')) {
    return isCompleted ? (
      <CompletedBadge text="Brain-Dump abgeschlossen" />
    ) : (
      <BrainDumpTimer onComplete={onMarkComplete} />
    );
  }

  // Nein-Skripte (Modul 7)
  if (title.includes('skripte')) {
    return isCompleted ? (
      <CompletedBadge text="Nein-Skripte gelernt" />
    ) : (
      <NeinSkripteWidget skripte={NEIN_SKRIPTE} onComplete={onMarkComplete} />
    );
  }

  // Abschlusstest (Modul 8)
  if (title.includes('abschlusstest')) {
    return isCompleted ? (
      <CompletedBadge text="Abschlusstest bestanden! +500 XP" />
    ) : (
      <AbschlussTestWidget onComplete={onMarkComplete} userId={userId} />
    );
  }

  // 30-Tage Transfer-Challenge (Modul 8)
  if (title.includes('30-tage') || title.includes('transfer')) {
    return isCompleted ? (
      <CompletedBadge text="30-Tage Challenge gestartet" />
    ) : (
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🚀</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>30-Tage Transfer-Challenge</h3>
        <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
          Ab heute wendest du jeden Tag eine Technik aus dem Kurs an. Du bekommst täglich einen Impuls.
          Dein Ziel: 30 Tage am Stück Prioritäten bewusst setzen.
        </p>
        <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving}>
          {saving ? 'Startet...' : 'Challenge starten!'}
        </button>
      </div>
    );
  }

  // Module-specific quizzes (Reflexion & Quiz)
  if (lessonType === 'quiz') {
    const modulQuiz = getModulQuiz();
    if (modulQuiz) {
      return (
        <QuizLesson
          lesson={lesson}
          courseTitle={courseTitle}
          isCompleted={isCompleted}
          onMarkComplete={onMarkComplete}
          saving={saving}
          userId={userId}
          overrideQuestions={modulQuiz}
        />
      );
    }
    return (
      <QuizLesson
        lesson={lesson}
        courseTitle={courseTitle}
        isCompleted={isCompleted}
        onMarkComplete={onMarkComplete}
        saving={saving}
        userId={userId}
      />
    );
  }

  // Scenario type fallback
  if (lessonType === 'scenario') {
    return isCompleted ? (
      <CompletedBadge text="Szenario abgeschlossen" />
    ) : (
      <VideoLesson
        lesson={lesson}
        isCompleted={isCompleted}
        onMarkComplete={onMarkComplete}
        saving={saving}
      />
    );
  }

  // Exercise lessons with journal
  if (lessonType === 'exercise') {
    const journalQ = JOURNAL_FRAGEN?.[modOrder] || null;
    if (journalQ) {
      return isCompleted ? (
        <CompletedBadge text="Übung abgeschlossen +40 XP" />
      ) : (
        <div>
          <ExerciseLesson
            lesson={lesson}
            isCompleted={isCompleted}
            onMarkComplete={onMarkComplete}
            saving={saving}
          />
          <div style={{ marginTop: 24 }}>
            <JournalEntry frage={journalQ} modulIndex={modOrder} userId={userId} onComplete={() => {}} />
          </div>
        </div>
      );
    }
    return (
      <ExerciseLesson
        lesson={lesson}
        isCompleted={isCompleted}
        onMarkComplete={onMarkComplete}
        saving={saving}
      />
    );
  }

  // Video lessons with story overlay for story lessons
  if (lessonType === 'video') {
    return (
      <VideoLesson
        lesson={lesson}
        isCompleted={isCompleted}
        onMarkComplete={onMarkComplete}
        saving={saving}
      />
    );
  }

  // Interactive fallback
  if (lessonType === 'interactive') {
    return (
      <InteractiveLesson
        lesson={{ ...lesson, _userId: userId }}
        isCompleted={isCompleted}
        onMarkComplete={onMarkComplete}
        saving={saving}
      />
    );
  }

  // Default fallback
  return (
    <VideoLesson
      lesson={lesson}
      isCompleted={isCompleted}
      onMarkComplete={onMarkComplete}
      saving={saving}
    />
  );
}

// =====================
// KOMMUNIKATION WIDGET ROUTER
// =====================
function KommLessonRouter({ lesson, lessonType, isCompleted, onMarkComplete, saving, userId, courseTitle }) {
  const title = (lesson.title || '').toLowerCase();
  const modOrder = lesson._moduleSortOrder ?? -1;

  function getModulQuiz() {
    const key = `modul_${modOrder}`;
    return MODUL_QUIZ_KOMM?.[key] || null;
  }

  // Modul 0: Selbstdiagnose
  if (modOrder === 0 && lessonType === 'interactive') {
    return isCompleted ? <CompletedBadge text="Kommunikations-Diagnose abgeschlossen" /> : (
      <SelbstdiagnoseWidget onComplete={onMarkComplete} diagnoseData={SELBSTDIAGNOSE_KOMM} />
    );
  }

  // 4-Ohren Drag & Drop (Modul 1)
  if (title.includes('4-ohren') || title.includes('vier-ohren') || (title.includes('drag') && title.includes('drop') && title.includes('ohren'))) {
    return isCompleted ? <CompletedBadge text="4-Ohren Übung abgeschlossen" /> : (
      <VierOhrenDragDrop config={VIER_OHREN_UEBUNG} onComplete={onMarkComplete} />
    );
  }

  // Zuhör-Stufen (Modul 2)
  if (title.includes('stufen') && title.includes('zuh')) {
    return isCompleted ? <CompletedBadge text="Zuhör-Stufen abgeschlossen" /> : (
      <ZuhoerStufenWidget onComplete={onMarkComplete} />
    );
  }

  // Körpersprache lesen (Modul 3)
  if (title.includes('signale') && title.includes('lesen')) {
    return isCompleted ? <CompletedBadge text="Körpersprache-Lesen abgeschlossen" /> : (
      <SzenarioPlayer config={{
        titel: 'Körpersprache lesen: 8 Signale',
        beschreibung: KOERPERSPRACHE_LESEN?.warnung || 'Achte auf Cluster, nicht Einzelsignale.',
        events: (KOERPERSPRACHE_LESEN?.signale || []).slice(0, 5).map(s => ({
          text: `Du siehst: ${s.signal} — ${s.bedeutung_oft}`,
          optionen: [
            { text: s.tipp, impact: 10, feedback: 'Richtig erkannt!' },
            { text: 'Signal ignorieren', impact: 0, feedback: s.tipp },
            { text: 'Direkt ansprechen', impact: 3, feedback: 'Manchmal ok, aber subtiler ist besser.' },
          ]
        })),
      }} onComplete={onMarkComplete} />
    );
  }

  // Stimm-Training (Modul 4)
  if (title.includes('betonungs') || title.includes('stimmkiller') || (modOrder === 4 && lessonType === 'interactive')) {
    return isCompleted ? <CompletedBadge text="Stimm-Training abgeschlossen" /> : (
      <StimmTrainingWidget onComplete={onMarkComplete} />
    );
  }

  // Spiegel-Test (Modul 4 exercise)
  if (title.includes('spiegel-test')) {
    return isCompleted ? <CompletedBadge text="Spiegel-Test abgeschlossen +40 XP" /> : (
      <ExerciseLesson lesson={{...lesson, exercise_prompt: 'Nimm dich 60 Sekunden per Handy auf wie du deinen Elevator Pitch sprichst. Höre es dir an und beantworte: Sprichst du zu schnell? Endest du mit steigender Stimme? Machst du Pausen? Ist deine Stimme monoton?'}} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />
    );
  }

  // Feedback-Templates (Modul 5)
  if (title.includes('feedback-template') || title.includes('5 feedback')) {
    return isCompleted ? <CompletedBadge text="Feedback-Templates gelernt" /> : (
      <FeedbackTemplates templates={FEEDBACK_TEMPLATES_DATA} onComplete={onMarkComplete} />
    );
  }

  // Boss-Fights
  if (title.includes('boss-fight') && title.includes('feedback')) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Feedback-Tornado besiegt! +200 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_KOMM.feedback_tornado} onComplete={onMarkComplete} />
    );
  }
  if (title.includes('boss-fight') && title.includes('konflikt')) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Konflikt-Vulkan besiegt! +250 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_KOMM.konflikt_vulkan} onComplete={onMarkComplete} />
    );
  }
  if (title.includes('boss-fight') && title.includes('stumm')) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Der Stumme Raum besiegt! +300 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_KOMM.stummer_raum} onComplete={onMarkComplete} />
    );
  }
  if (title.includes('boss-fight') && title.includes('eskalation')) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Eskalations-Sturm besiegt! +250 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_KOMM.eskalations_sturm} onComplete={onMarkComplete} />
    );
  }

  // Notfall-Sätze / Stress (Modul 6)
  if (title.includes('notfall') && title.includes('stress')) {
    return isCompleted ? <CompletedBadge text="Notfall-Sätze gelernt" /> : (
      <NeinSkripteWidget skripte={(STRESS_KOMMUNIKATION?.notfall_saetze || []).map((s, i) => ({
        situation: `Stresssituation ${i + 1}`,
        skript: s,
      }))} onComplete={onMarkComplete} />
    );
  }

  // Elevator Pitch Builder (Modul 7)
  if (title.includes('elevator') || title.includes('pitch builder')) {
    return isCompleted ? <CompletedBadge text="Elevator Pitch erstellt" /> : (
      <ElevatorPitchBuilder onComplete={onMarkComplete} />
    );
  }

  // E-Mail Templates (Modul 8)
  if (title.includes('e-mail template') || title.includes('email template') || title.includes('5 e-mail')) {
    return isCompleted ? <CompletedBadge text="E-Mail-Templates gelernt" /> : (
      <EmailTemplates templates={EMAIL_TEMPLATES_DATA} onComplete={onMarkComplete} />
    );
  }

  // Szenarien
  if (title.includes('slack-krieg') || title.includes('slack krieg')) {
    return isCompleted ? <CompletedBadge text="Szenario abgeschlossen" /> : (
      <SzenarioPlayer config={SZENARIO_KONFLIKTE?.email_missverstaendnis} onComplete={onMarkComplete} />
    );
  }
  if (title.includes('stille') && title.includes('bewerbung')) {
    return isCompleted ? <CompletedBadge text="Szenario abgeschlossen" /> : (
      <SzenarioPlayer config={SZENARIO_KONFLIKTE?.gehalts_gespraech} onComplete={onMarkComplete} />
    );
  }
  if (title.includes('international') && title.includes('meeting')) {
    return isCompleted ? <CompletedBadge text="Szenario abgeschlossen" /> : (
      <SzenarioPlayer config={SZENARIO_KONFLIKTE?.gehalts_gespraech} onComplete={onMarkComplete} />
    );
  }

  // Digitale Kommunikation Kanal-Quiz (Modul 9)
  if (title.includes('wann chat') || title.includes('wann mail')) {
    return isCompleted ? <CompletedBadge text="Kanal-Quiz abgeschlossen" /> : (
      <DigitaleKommWidget onComplete={onMarkComplete} />
    );
  }

  // Gesprächs-Opener / Smalltalk (Modul 10)
  if (title.includes('opener') || title.includes('copy & paste')) {
    return isCompleted ? <CompletedBadge text="Gesprächs-Opener gelernt" /> : (
      <NeinSkripteWidget skripte={(SMALLTALK_TOOLKIT?.opener || []).map(o => ({
        situation: o.situation,
        skript: (o.saetze || []).join('\n\nODER:\n\n'),
      }))} onComplete={onMarkComplete} />
    );
  }

  // Abschlusstest (Modul 11)
  if (title.includes('abschlusstest')) {
    return isCompleted ? <CompletedBadge text="Abschlusstest bestanden! +500 XP" /> : (
      <AbschlussTestWidget onComplete={onMarkComplete} userId={userId} overrideQuestions={ABSCHLUSSTEST_KOMM} />
    );
  }

  // 30-Tage Challenge
  if (title.includes('30-tage') || title.includes('challenge starten')) {
    return isCompleted ? <CompletedBadge text="30-Tage Challenge gestartet" /> : (
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>💬</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>30-Tage Kommunikations-Challenge</h3>
        <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
          Ab heute übst du jeden Tag eine Kommunikationstechnik. Woche 1: Zuhören. Woche 2: Feedback. Woche 3: Überzeugen. Woche 4: Meisterschaft.
        </p>
        <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving}>
          {saving ? 'Startet...' : 'Challenge starten!'}
        </button>
      </div>
    );
  }

  // Module-specific quizzes
  if (lessonType === 'quiz') {
    const modulQuiz = getModulQuiz();
    if (modulQuiz) {
      return <QuizLesson lesson={lesson} courseTitle={courseTitle} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} userId={userId} overrideQuestions={modulQuiz} />;
    }
    return <QuizLesson lesson={lesson} courseTitle={courseTitle} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} userId={userId} />;
  }

  // Scenario fallback
  if (lessonType === 'scenario') {
    return <VideoLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  }

  // Exercise with journal
  if (lessonType === 'exercise') {
    const journalQ = JOURNAL_FRAGEN_KOMM?.[modOrder] || null;
    if (journalQ) {
      return isCompleted ? <CompletedBadge text="Übung abgeschlossen +40 XP" /> : (
        <div>
          <ExerciseLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />
          <div style={{ marginTop: 24 }}>
            <JournalEntry frage={journalQ} modulIndex={modOrder} userId={userId} onComplete={() => {}} />
          </div>
        </div>
      );
    }
    return <ExerciseLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  }

  // Video
  if (lessonType === 'video') {
    return <VideoLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  }

  // Interactive fallback
  if (lessonType === 'interactive') {
    return <InteractiveLesson lesson={{ ...lesson, _userId: userId }} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  }

  // Default
  return <VideoLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
}

// =====================
// BALANCE WIDGET ROUTER
// =====================
function BalanceLessonRouter({ lesson, lessonType, isCompleted, onMarkComplete, saving, userId, courseTitle, userPhase }) {
  const title = (lesson.title || '').toLowerCase();
  const modOrder = lesson._moduleSortOrder ?? -1;

  function getModulQuiz() {
    const key = `modul_${modOrder}`;
    return MODUL_QUIZ_BALANCE?.[key] || null;
  }

  // Modul 0: Selbstdiagnose
  if (modOrder === 0 && lessonType === 'interactive') {
    return isCompleted ? <CompletedBadge text="Balance-Diagnose abgeschlossen" /> : (
      <SelbstdiagnoseWidget onComplete={onMarkComplete} diagnoseData={SELBSTDIAGNOSE_BALANCE} />
    );
  }

  // Modul 2: Lebensrad
  if (title.includes('lebensrad') || title.includes('4 bereiche bewerten')) {
    return isCompleted ? <CompletedBadge text="Lebensrad abgeschlossen" /> : (
      <LebensradWidget onComplete={onMarkComplete} />
    );
  }

  // Modul 3: Stress-Ampel
  if (title.includes('stress-ampel') || title.includes('stress-profil')) {
    return isCompleted ? <CompletedBadge text="Stress-Profil erstellt" /> : (
      <StressAmpelWidget onComplete={onMarkComplete} />
    );
  }

  // Modul 4: Shutdown-Ritual
  if (title.includes('shutdown-ritual') || title.includes('shutdown ritual')) {
    return isCompleted ? <CompletedBadge text="Shutdown-Ritual erstellt" /> : (
      <ShutdownRitualBuilder config={SHUTDOWN_RITUAL} onComplete={onMarkComplete} />
    );
  }

  // Modul 4: Boss-Fight Always-On
  if (title.includes('boss-fight') && title.includes('always-on')) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Always-On Dämon besiegt! +200 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_BALANCE.always_on} onComplete={onMarkComplete} />
    );
  }

  // Modul 4: Grenz-Skripte
  if (title.includes('grenz-skripte') || title.includes('5 grenz')) {
    return isCompleted ? <CompletedBadge text="Grenz-Skripte gelernt" /> : (
      <NeinSkripteWidget skripte={(GRENZ_SKRIPTE || []).map(s => ({ situation: s.ziel, skript: s.skript || s.beispiel || s.erklaerung || '' }))} onComplete={onMarkComplete} />
    );
  }

  // Modul 5: Energie-Protokoll
  if (title.includes('energie-protokoll') || title.includes('energie protokoll')) {
    return isCompleted ? <CompletedBadge text="Energie-Protokoll erstellt" /> : (
      <EnergieProtokollWidget onComplete={onMarkComplete} />
    );
  }

  // Modul 6: Micro-Recovery
  if (title.includes('micro-recovery') || title.includes('10 micro')) {
    return isCompleted ? <CompletedBadge text="Micro-Recovery abgeschlossen" /> : (
      <MicroRecoveryWidget config={MICRO_RECOVERY} onComplete={onMarkComplete} />
    );
  }

  // Modul 8: Boss-Fight Mitternachts-Scrolleur
  if (title.includes('boss-fight') && title.includes('mitternachts')) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Mitternachts-Scrolleur besiegt! +200 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_BALANCE.mitternachts_scrolleur} onComplete={onMarkComplete} />
    );
  }

  // Modul 9: Beziehungs-Konto
  if (title.includes('beziehungs-konto') || title.includes('einzahlungen')) {
    return isCompleted ? <CompletedBadge text="Beziehungs-Konto verstanden" /> : (
      <BeziehungsKontoWidget onComplete={onMarkComplete} />
    );
  }

  // Modul 10: Burnout-Stufen
  if (title.includes('selbsttest') && modOrder === 10) {
    return isCompleted ? <CompletedBadge text="Burnout-Check abgeschlossen" /> : (
      <BurnoutStufenWidget config={BURNOUT_STUFEN} onComplete={onMarkComplete} />
    );
  }

  // Modul 12: Abschlusstest
  if (title.includes('abschlusstest')) {
    return isCompleted ? <CompletedBadge text="Abschlusstest bestanden! +500 XP" /> : (
      <AbschlussTestWidget onComplete={onMarkComplete} userId={userId} overrideQuestions={ABSCHLUSSTEST_BALANCE} />
    );
  }

  // 30-Tage Challenge
  if (title.includes('30-tage') || title.includes('challenge')) {
    return isCompleted ? <CompletedBadge text="30-Tage Balance-Challenge gestartet!" /> : (
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>⚖️</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>30-Tage Balance-Challenge</h3>
        <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
          Ab heute übst du jeden Tag eine Balance-Technik. Woche 1: Grenzen. Woche 2: Energie. Woche 3: Beziehungen. Woche 4: Integration.
        </p>
        <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving}>
          {saving ? 'Startet...' : 'Challenge starten!'}
        </button>
      </div>
    );
  }

  // Module-specific quizzes
  if (lessonType === 'quiz') {
    const modulQuiz = getModulQuiz();
    if (modulQuiz) return <QuizLesson lesson={lesson} courseTitle={courseTitle} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} userId={userId} overrideQuestions={modulQuiz} />;
    return <QuizLesson lesson={lesson} courseTitle={courseTitle} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} userId={userId} />;
  }

  if (lessonType === 'exercise') {
    const journalQ = JOURNAL_FRAGEN_BALANCE?.[modOrder] || null;
    if (journalQ) return isCompleted ? <CompletedBadge text="Übung abgeschlossen +40 XP" /> : (
      <div><ExerciseLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} /><div style={{ marginTop: 24 }}><JournalEntry frage={journalQ} modulIndex={modOrder} userId={userId} onComplete={() => {}} /></div></div>
    );
    return <ExerciseLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  }

  if (lessonType === 'scenario') return isCompleted ? <CompletedBadge text="Szenario abgeschlossen" /> : <VideoLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  if (lessonType === 'video') return <VideoLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  if (lessonType === 'interactive') return <InteractiveLesson lesson={{ ...lesson, _userId: userId }} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  return <VideoLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
}

// =====================
// NETWORKING WIDGET ROUTER
// =====================
function NetworkingLessonRouter({ lesson, lessonType, isCompleted, onMarkComplete, saving, userId, courseTitle, userPhase }) {
  const title = (lesson.title || '').toLowerCase();
  const modOrder = lesson._moduleSortOrder ?? -1;

  function getModulQuiz() {
    const key = `modul_${modOrder}`;
    return MODUL_QUIZ_NETZ?.[key] || null;
  }

  // Modul 0: Selbstdiagnose
  if (modOrder === 0 && lessonType === 'interactive') {
    return isCompleted ? <CompletedBadge text="Networking-Diagnose abgeschlossen" /> : (
      <SelbstdiagnoseWidget onComplete={onMarkComplete} diagnoseData={SELBSTDIAGNOSE_NETZ} />
    );
  }

  // Modul 2: Netzwerk-Map
  if (title.includes('netzwerk-map') || title.includes('netzwerk map')) {
    return isCompleted ? <CompletedBadge text="Netzwerk-Map erstellt" /> : (
      <NetzwerkMapBuilder onComplete={onMarkComplete} />
    );
  }

  // Modul 3: Wert-Geschenke
  if (title.includes('wert-geschenke') || title.includes('12 wert')) {
    return isCompleted ? <CompletedBadge text="Wert-Geschenke gelernt" /> : (
      <WertGeschenkeWidget config={WERT_GESCHENKE} onComplete={onMarkComplete} />
    );
  }

  // Boss-Fights
  if (title.includes('boss-fight') && title.includes('vampir')) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Netzwerk-Vampir besiegt! +200 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_NETZ.netzwerk_vampir} onComplete={onMarkComplete} />
    );
  }
  if (title.includes('boss-fight') && (title.includes('hölle') || title.includes('hoelle'))) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Networking-Hölle besiegt! +200 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_NETZ.networking_hoelle} onComplete={onMarkComplete} />
    );
  }
  if (title.includes('boss-fight') && title.includes('marathon')) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Networking-Marathon besiegt! +200 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_NETZ.networking_marathon} onComplete={onMarkComplete} />
    );
  }
  if (title.includes('boss-fight') && title.includes('gatekeeper')) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Gatekeeper besiegt! +250 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_NETZ.gatekeeper} onComplete={onMarkComplete} />
    );
  }

  // Modul 4: Opener
  if (title.includes('opener') || title.includes('gesprächs-opener')) {
    return isCompleted ? <CompletedBadge text="Opener gelernt" /> : (
      <OpenerGenerator config={OPENER} onComplete={onMarkComplete} />
    );
  }

  // Modul 5: LinkedIn Templates
  if (title.includes('vernetzungsanfragen') || title.includes('8 templates')) {
    return isCompleted ? <CompletedBadge text="LinkedIn-Templates gelernt" /> : (
      <LinkedInTemplates onComplete={onMarkComplete} />
    );
  }

  // Modul 6: Follow-Up Templates
  if (title.includes('follow-up template') || title.includes('7 follow')) {
    return isCompleted ? <CompletedBadge text="Follow-Up Templates gelernt" /> : (
      <FollowUpTemplates templates={FOLLOW_UP_TEMPLATES} onComplete={onMarkComplete} />
    );
  }

  // Modul 8: CRM
  if (title.includes('ampel') || title.includes('crm') || title.includes('deep context')) {
    return isCompleted ? <CompletedBadge text="CRM eingerichtet" /> : (
      <CRMBuilder config={CRM_CONFIG} onComplete={onMarkComplete} />
    );
  }

  // Modul 9: Mentor-Anfrage
  if (title.includes('mentor') && title.includes('template')) {
    return isCompleted ? <CompletedBadge text="Mentor-Anfrage erstellt" /> : (
      <MentorAnfrageBuilder config={MENTOR_TEMPLATES} onComplete={onMarkComplete} />
    );
  }

  // Modul 10: Hub-Finder
  if (title.includes('hub-finder') || title.includes('multiplikatoren')) {
    return isCompleted ? <CompletedBadge text="Hubs identifiziert" /> : (
      <InteractiveLesson lesson={{ ...lesson, _userId: userId }} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />
    );
  }

  // Modul 17: Geister-Counter
  if (title.includes('geister')) {
    return isCompleted ? <CompletedBadge text="Absage-Resilienz aufgebaut" /> : (
      <GeisterCounterWidget config={GEISTER_COUNTER} onComplete={onMarkComplete} />
    );
  }

  // Abschlusstest
  if (title.includes('abschlusstest')) {
    return isCompleted ? <CompletedBadge text="Abschlusstest bestanden! +500 XP" /> : (
      <AbschlussTestWidget onComplete={onMarkComplete} userId={userId} overrideQuestions={ABSCHLUSSTEST_NETZ} />
    );
  }

  // 30-Tage Challenge
  if (title.includes('30-tage') || title.includes('challenge')) {
    return isCompleted ? <CompletedBadge text="30-Tage Networking-Challenge gestartet!" /> : (
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🤝</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>30-Tage Networking-Challenge</h3>
        <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
          Woche 1: Inventur. Woche 2: Kontakte aktivieren. Woche 3: Events. Woche 4: System aufbauen.
        </p>
        <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving}>
          {saving ? 'Startet...' : 'Challenge starten!'}
        </button>
      </div>
    );
  }

  // Quizzes
  if (lessonType === 'quiz') {
    const modulQuiz = getModulQuiz();
    if (modulQuiz) return <QuizLesson lesson={lesson} courseTitle={courseTitle} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} userId={userId} overrideQuestions={modulQuiz} />;
    return <QuizLesson lesson={lesson} courseTitle={courseTitle} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} userId={userId} />;
  }

  if (lessonType === 'exercise') {
    const journalQ = JOURNAL_FRAGEN_NETZ?.[modOrder] || null;
    if (journalQ) return isCompleted ? <CompletedBadge text="Übung abgeschlossen +40 XP" /> : (
      <div><ExerciseLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} /><div style={{ marginTop: 24 }}><JournalEntry frage={journalQ} modulIndex={modOrder} userId={userId} onComplete={() => {}} /></div></div>
    );
    return <ExerciseLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  }

  if (lessonType === 'scenario') return isCompleted ? <CompletedBadge text="Szenario abgeschlossen" /> : <VideoLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  if (lessonType === 'video') return <VideoLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  if (lessonType === 'interactive') return <InteractiveLesson lesson={{ ...lesson, _userId: userId }} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  return <VideoLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
}

// =====================
// TYPGERECHTES LERNEN WIDGET ROUTER
// =====================
function LernenLessonRouter({ lesson, lessonType, isCompleted, onMarkComplete, saving, userId, courseTitle }) {
  const title = (lesson.title || '').toLowerCase();
  const modOrder = lesson._moduleSortOrder ?? -1;

  function getModulQuiz() {
    const key = `modul_${modOrder}`;
    return MODUL_QUIZ_LERNEN?.[key] || null;
  }

  // Modul 0: Selbstdiagnose
  if (modOrder === 0 && lessonType === 'interactive') {
    return isCompleted ? <CompletedBadge text="Lern-Diagnose abgeschlossen" /> : (
      <SelbstdiagnoseWidget onComplete={onMarkComplete} diagnoseData={SELBSTDIAGNOSE_LERNEN} />
    );
  }

  // Modul 1: Mythen entlarvt (interactive)
  if (title.includes('mythen')) {
    return isCompleted ? <CompletedBadge text="Mythen entlarvt" /> : (
      <InteractiveLesson lesson={{ ...lesson, _userId: userId, statements: ['Multitasking funktioniert beim Lernen', 'Wir nutzen nur 10% unseres Gehirns', 'Es gibt feste Lerntypen', 'Markieren ist eine effektive Lernmethode'] }} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />
    );
  }

  // Modul 2: Lerntyp-Test (VARK)
  if (title.includes('lerntyp-test') || title.includes('vark')) {
    return isCompleted ? <CompletedBadge text="Lerntyp-Test abgeschlossen" /> : (
      <LerntypTest config={LERNTYP_TEST} onComplete={onMarkComplete} />
    );
  }

  // Modul 2: Lerntyp-Report
  if (title.includes('lerntyp-report')) {
    return isCompleted ? <CompletedBadge text="Lerntyp-Report erstellt" /> : (
      <MentorMirrorWidget config={EINSTEIGER_EXTRAS.mentor_mirror} onComplete={onMarkComplete} />
    );
  }

  // Modul 3: Boss-Fight Langeweile-Drache
  if (title.includes('boss-fight') && title.includes('langeweile')) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Langeweile-Drache besiegt! +200 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_LERNEN.langeweile_drache} onComplete={onMarkComplete} />
    );
  }

  // Modul 3: State-Management
  if (title.includes('state-management') || title.includes('60 sekunden lernbereit')) {
    return isCompleted ? <CompletedBadge text="State-Management abgeschlossen" /> : (
      <StateManagementWidget onComplete={onMarkComplete} />
    );
  }

  // Modul 4: Boss-Fight Vergessens-Tsunami
  if (title.includes('boss-fight') && title.includes('vergessen')) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Vergessens-Tsunami besiegt! +200 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_LERNEN.vergessens_tsunami} onComplete={onMarkComplete} />
    );
  }

  // Modul 4: Vergessenskurve (video but with widget)
  if (title.includes('ebbinghaus') || title.includes('vergessenskurve')) {
    return isCompleted ? <CompletedBadge text="Vergessenskurve verstanden" /> : (
      <VergessenskurveWidget onComplete={onMarkComplete} />
    );
  }

  // Modul 5: Mind-Mapping (interactive)
  if (title.includes('mind-mapping') || title.includes('sketchnotes')) {
    return isCompleted ? <CompletedBadge text="Mind-Mapping abgeschlossen" /> : (
      <InteractiveLesson lesson={{ ...lesson, _userId: userId, statements: ['Zentrale Idee in die Mitte', 'Hauptäste = Hauptthemen', 'Unteräste = Details', 'Farben und Symbole nutzen'] }} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />
    );
  }

  // Modul 5: Feynman-Methode
  if (title.includes('feynman')) {
    return isCompleted ? <CompletedBadge text="Feynman-Methode angewendet +40 XP" /> : (
      <FeynmanUebung onComplete={onMarkComplete} />
    );
  }

  // Modul 6: Active Recall (interactive)
  if (title.includes('active recall')) {
    return isCompleted ? <CompletedBadge text="Active Recall verstanden" /> : (
      <InteractiveLesson lesson={{ ...lesson, _userId: userId, statements: ['Aus dem Gedächtnis abrufen statt nochmal lesen', 'Sich selbst testen ist 3x effektiver', 'Fehler beim Abrufen stärken das Gedächtnis', 'Karteikarten nutzen den Recall-Effekt'] }} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />
    );
  }

  // Modul 6: Boss-Fight Prüfungs-Panik
  if (title.includes('boss-fight') && (title.includes('prüfung') || title.includes('panik'))) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Prüfungs-Panik besiegt! +200 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_LERNEN.pruefungs_panik} onComplete={onMarkComplete} />
    );
  }

  // Modul 7: Flow-Formel
  if (title.includes('flow-formel') || title.includes('flow formel') || (modOrder === 7 && lessonType === 'exercise')) {
    return isCompleted ? <CompletedBadge text="Flow-Formel erstellt +40 XP" /> : (
      <FlowFormelBuilder onComplete={onMarkComplete} />
    );
  }

  // Modul 9: Musik beim Lernen
  if (title.includes('musik')) {
    return isCompleted ? <CompletedBadge text="Musik-Analyse abgeschlossen" /> : (
      <InteractiveLesson lesson={{ ...lesson, _userId: userId, statements: ['Instrumentale Musik kann Fokus verbessern', 'Lyrics stören die Sprachverarbeitung', 'Lo-Fi Beats haben konstantes Tempo = gut', 'Stille ist manchmal besser als Musik'] }} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />
    );
  }

  // Modul 10: Fehler-Autopsie
  if (title.includes('fehler-autopsie') || title.includes('fehler autopsie')) {
    return isCompleted ? <CompletedBadge text="Fehler-Autopsie abgeschlossen +40 XP" /> : (
      <FehlerAutopsieWidget onComplete={onMarkComplete} />
    );
  }

  // Modul 10: Boss-Fight Perfektionismus
  if (title.includes('boss-fight') && title.includes('perfektionismus')) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Perfektionismus-Parasit besiegt! +200 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_LERNEN.perfektionismus_parasit} onComplete={onMarkComplete} />
    );
  }

  // Modul 11: Transfer-Planner (WENN-DANN)
  if (title.includes('wenn-dann') || title.includes('24-stunden') || (modOrder === 11 && lessonType === 'exercise')) {
    return isCompleted ? <CompletedBadge text="Transfer-Plan erstellt +40 XP" /> : (
      <TransferPlannerWidget beispiele={TRANSFER.wenn_dann.beispiele} onComplete={onMarkComplete} />
    );
  }

  // Modul 13: Abschlusstest
  if (title.includes('abschlusstest')) {
    return isCompleted ? <CompletedBadge text="Abschlusstest bestanden! +500 XP" /> : (
      <AbschlussTestWidget onComplete={onMarkComplete} userId={userId} overrideQuestions={ABSCHLUSSTEST_LERNEN} />
    );
  }

  // Modul 13: 30-Tage Challenge
  if (title.includes('30-tage') || title.includes('challenge')) {
    return isCompleted ? <CompletedBadge text="30-Tage Lern-Challenge gestartet!" /> : (
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>🧠</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>30-Tage Lern-Challenge</h3>
        <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
          Ab heute lernst du jeden Tag 20 Minuten mit einer Technik aus diesem Kurs. Woche 1: Feynman. Woche 2: Active Recall. Woche 3: Transfer. Woche 4: Meisterschaft.
        </p>
        <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving}>
          {saving ? 'Startet...' : 'Challenge starten!'}
        </button>
      </div>
    );
  }

  // Module-specific quizzes
  if (lessonType === 'quiz') {
    const modulQuiz = getModulQuiz();
    if (modulQuiz) {
      return <QuizLesson lesson={lesson} courseTitle={courseTitle} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} userId={userId} overrideQuestions={modulQuiz} />;
    }
    return <QuizLesson lesson={lesson} courseTitle={courseTitle} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} userId={userId} />;
  }

  // Exercise with journal
  if (lessonType === 'exercise') {
    const journalQ = JOURNAL_FRAGEN_LERNEN?.[modOrder] || null;
    if (journalQ) {
      return isCompleted ? <CompletedBadge text="Übung abgeschlossen +40 XP" /> : (
        <div>
          <ExerciseLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />
          <div style={{ marginTop: 24 }}>
            <JournalEntry frage={journalQ} modulIndex={modOrder} userId={userId} onComplete={() => {}} />
          </div>
        </div>
      );
    }
    return <ExerciseLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  }

  // Video
  if (lessonType === 'video') {
    return <VideoLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  }

  // Interactive fallback
  if (lessonType === 'interactive') {
    return <InteractiveLesson lesson={{ ...lesson, _userId: userId }} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  }

  // Default
  return <VideoLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
}

// =====================
// SPEEDREADING WIDGET ROUTER
// =====================
// GEHALTSVERHANDLUNG LESSON ROUTER
// =====================
function GehaltLessonRouter({ lesson, lessonType, isCompleted, onMarkComplete, saving }) {
  const lessonId = lesson.id;

  // Map lesson IDs to content keys
  const ID_TO_KEY = {
    'b7010000-0000-0000-0000-000000000101': '1.1',
    'b7010000-0000-0000-0000-000000000102': '1.2',
    'b7010000-0000-0000-0000-000000000103': '1.3',
    'b7010000-0000-0000-0000-000000000201': '2.1',
    'b7010000-0000-0000-0000-000000000202': '2.2',
    'b7010000-0000-0000-0000-000000000203': '2.3',
    'b7010000-0000-0000-0000-000000000301': '3.1',
    'b7010000-0000-0000-0000-000000000302': '3.2',
    'b7010000-0000-0000-0000-000000000303': '3.3',
    'b7010000-0000-0000-0000-000000000304': '3.4',
    'b7010000-0000-0000-0000-000000000401': '4.1',
    'b7010000-0000-0000-0000-000000000402': '4.2',
    'b7010000-0000-0000-0000-000000000403': '4.3',
    'b7010000-0000-0000-0000-000000000404': '4.4',
    'b7010000-0000-0000-0000-000000000405': '4.5',
    'b7010000-0000-0000-0000-000000000501': '5.1',
    'b7010000-0000-0000-0000-000000000502': '5.2',
  };

  const key = ID_TO_KEY[lessonId];
  const content = GEHALT_CONTENT[key];

  if (!content) {
    return <VideoLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  }

  // ── Simulations (4.3, 4.4, 4.5) ───────────────────────────────────
  if (content.type === 'simulation') {
    return (
      <div>
        {content.vimeoId && (
          <div style={{ borderRadius: 'var(--r-lg)', overflow: 'hidden', background: '#000', aspectRatio: '16/9', marginBottom: 24 }}>
            <iframe
              src={`https://player.vimeo.com/video/${content.vimeoId}?title=0&byline=0&portrait=0&dnt=1`}
              style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
              allow="autoplay; fullscreen; picture-in-picture"
              allowFullScreen
              title={content.title}
            />
          </div>
        )}
        <GehaltSimulationWidget
          simulationKey={content.simulationKey}
          maxScore={content.maxScore}
          ratingLabels={content.ratingLabels}
          endMessage={content.endMessage}
          isCompleted={isCompleted}
          onMarkComplete={onMarkComplete}
          saving={saving}
        />
      </div>
    );
  }

  // ── Video lessons with interactive widget below ────────────────────
  const takeaways = content.takeaways || [];

  function VideoBlock() {
    return (
      <>
        {/* Video placeholder */}
        <div style={{
          borderRadius: 'var(--r-lg)', overflow: 'hidden',
          background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
          aspectRatio: '16/9', display: 'flex', alignItems: 'center', justifyContent: 'center',
          flexDirection: 'column', gap: 16, marginBottom: 24,
        }}>
          <div style={{
            width: 72, height: 72, borderRadius: '50%',
            background: 'rgba(204,20,38,0.2)', border: '2px solid rgba(204,20,38,0.4)',
            display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
          }}>▶</div>
          <div style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>{lesson.title}</div>
          <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>
            Video · {content.duration || lesson.duration_minutes + ' Min.'}
          </div>
        </div>

        {/* Takeaways */}
        {takeaways.length > 0 && (
          <div className="card" style={{ marginBottom: 24, background: 'var(--ki-bg-alt)', border: 'none' }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              Key Takeaways
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {takeaways.map((t, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, lineHeight: 1.6 }}>
                  <span style={{ color: 'var(--ki-red)', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
                  <span style={{ color: 'var(--ki-text-secondary)' }}>{t}</span>
                </div>
              ))}
            </div>
          </div>
        )}
      </>
    );
  }

  // 1.1 — Salary gap
  if (key === '1.1') {
    return (
      <div>
        <VideoBlock />
        <SalaryGapWidget onSave={() => {}} />
        {!isCompleted ? (
          <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Speichert...' : '✅ Als erledigt markieren (+30 XP)'}
          </button>
        ) : (
          <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen +30 XP</span>
        )}
      </div>
    );
  }

  // 1.2 — Fear selector
  if (key === '1.2') {
    return (
      <div>
        <VideoBlock />
        <FearSelectorWidget fearOptions={content.fearOptions} onSave={() => {}} />
        {!isCompleted ? (
          <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Speichert...' : '✅ Als erledigt markieren (+30 XP)'}
          </button>
        ) : (
          <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen +30 XP</span>
        )}
      </div>
    );
  }

  // 1.3 — Self assessment
  if (key === '1.3') {
    return (
      <div>
        <VideoBlock />
        <SelfAssessmentWidget sliderLabels={content.sliderLabels} sliderFeedback={content.sliderFeedback} onSave={() => {}} />
        {!isCompleted ? (
          <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Speichert...' : '✅ Als erledigt markieren (+30 XP)'}
          </button>
        ) : (
          <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen +30 XP</span>
        )}
      </div>
    );
  }

  // 2.1 — Three numbers
  if (key === '2.1') {
    return (
      <div>
        <VideoBlock />
        {/* Research sources */}
        {content.researchSources && (
          <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Deine 3 Recherche-Quellen (5 Min.)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              {content.researchSources.map((s, i) => (
                <div key={i} style={{ display: 'flex', gap: 12, alignItems: 'flex-start' }}>
                  <div style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</div>
                  <div>
                    <div style={{ fontSize: 14, fontWeight: 600, color: 'var(--ki-text)' }}>{s.name}</div>
                    <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)' }}>{s.tip}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        <ThreeNumbersWidget onSave={() => {}} />
        {!isCompleted ? (
          <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Speichert...' : '✅ Als erledigt markieren (+30 XP)'}
          </button>
        ) : (
          <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen +30 XP</span>
        )}
      </div>
    );
  }

  // 2.2 — Chef decoder (video + info card)
  if (key === '2.2') {
    return (
      <div>
        <VideoBlock />
        {content.chefDecoder && (
          <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              Chef-Decoder: Was bedeutet was?
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              {content.chefDecoder.map((d, i) => (
                <div key={i} style={{ padding: '12px 14px', borderRadius: 10, background: 'var(--ki-card)', border: '1px solid var(--ki-border)' }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ki-text)', marginBottom: 4 }}>{d.reaction}</div>
                  <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', lineHeight: 1.5 }}>→ {d.meaning}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!isCompleted ? (
          <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Speichert...' : '✅ Als erledigt markieren (+30 XP)'}
          </button>
        ) : (
          <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen +30 XP</span>
        )}
      </div>
    );
  }

  // 2.3 — Impact sentences
  if (key === '2.3') {
    return (
      <div>
        <VideoBlock />
        {/* Factor pyramid */}
        {content.factorLevels && (
          <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Argument-Hierarchie (stärkstes zuerst)
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
              {content.factorLevels.map((f, i) => (
                <div key={i} style={{
                  padding: '12px 14px', borderRadius: 10, background: 'var(--ki-card)', border: '1px solid var(--ki-border)',
                  borderLeft: `4px solid ${i === 0 ? '#16a34a' : i === 1 ? '#2563EB' : '#d97706'}`,
                }}>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ki-text)', marginBottom: 4 }}>
                    Level {f.level}: {f.title}
                  </div>
                  <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', fontStyle: 'italic' }}>{f.example}</div>
                </div>
              ))}
            </div>
          </div>
        )}
        <ImpactSentencesWidget factorLevels={content.factorLevels} onSave={() => {}} />
        {!isCompleted ? (
          <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Speichert...' : '✅ Als erledigt markieren (+30 XP)'}
          </button>
        ) : (
          <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen +30 XP</span>
        )}
      </div>
    );
  }

  // 3.1 — Comparison video
  if (key === '3.1') {
    return (
      <div>
        <VideoBlock />
        {content.comparisonData && (
          <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 12 }}>
              {[content.comparisonData.unprepared, content.comparisonData.prepared].map((d, i) => (
                <div key={i} style={{
                  padding: '14px 16px', borderRadius: 10, textAlign: 'center',
                  background: i === 1 ? 'rgba(34,197,94,0.06)' : 'var(--ki-card)',
                  border: `2px solid ${i === 1 ? 'rgba(34,197,94,0.25)' : 'var(--ki-border)'}`,
                }}>
                  <div style={{ fontSize: 12, fontWeight: 700, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', marginBottom: 6 }}>{d.label}</div>
                  <div style={{ fontSize: 22, fontWeight: 800, color: i === 1 ? '#16a34a' : 'var(--ki-text)' }}>{d.pct}</div>
                  <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginTop: 4 }}>{d.euro}</div>
                </div>
              ))}
            </div>
            <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', textAlign: 'center', marginTop: 10 }}>
              {content.comparisonData.note}
            </div>
          </div>
        )}
        {!isCompleted ? (
          <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Speichert...' : '✅ Als erledigt markieren (+30 XP)'}
          </button>
        ) : (
          <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen +30 XP</span>
        )}
      </div>
    );
  }

  // 3.2 — Pitch builder
  if (key === '3.2') {
    return (
      <div>
        <VideoBlock />
        <PitchBuilderWidget examplePitches={content.examplePitches} onSave={() => {}} />
        {!isCompleted ? (
          <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Speichert...' : '✅ Als erledigt markieren (+30 XP)'}
          </button>
        ) : (
          <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen +30 XP</span>
        )}
      </div>
    );
  }

  // 3.3 — Arguments builder
  if (key === '3.3') {
    return (
      <div>
        <VideoBlock />
        <ArgumentsBuilderWidget weakArguments={content.weakArguments} soWhatExamples={content.soWhatExamples} onSave={() => {}} />
        {!isCompleted ? (
          <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Speichert...' : '✅ Als erledigt markieren (+30 XP)'}
          </button>
        ) : (
          <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen +30 XP</span>
        )}
      </div>
    );
  }

  // 3.4 — Strategy picker
  if (key === '3.4') {
    return (
      <div>
        <VideoBlock />
        <StrategyPickerWidget strategies={content.strategies} batnaOptions={content.batnaOptions} onSave={() => {}} />
        {!isCompleted ? (
          <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Speichert...' : '✅ Als erledigt markieren (+30 XP)'}
          </button>
        ) : (
          <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen +30 XP</span>
        )}
      </div>
    );
  }

  // 4.1 — Opening (video + opening script)
  if (key === '4.1') {
    return (
      <div>
        <VideoBlock />
        {content.openingScript && (
          <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              Eröffnungssatz — Gut vs. Schlecht
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
              <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(239,68,68,0.04)', border: '1px solid rgba(239,68,68,0.15)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#dc2626', textTransform: 'uppercase', marginBottom: 6 }}>✗ So nicht</div>
                <div style={{ fontSize: 13, color: 'var(--ki-text)', fontStyle: 'italic' }}>{content.openingScript.bad}</div>
              </div>
              <div style={{ padding: '12px 14px', borderRadius: 10, background: 'rgba(34,197,94,0.04)', border: '1px solid rgba(34,197,94,0.2)' }}>
                <div style={{ fontSize: 11, fontWeight: 700, color: '#16a34a', textTransform: 'uppercase', marginBottom: 6 }}>✓ So geht's</div>
                <div style={{ fontSize: 13, color: 'var(--ki-text)', fontWeight: 600 }}>{content.openingScript.good}</div>
              </div>
            </div>
          </div>
        )}
        {content.timing && (
          <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              Bestes Timing
            </div>
            {content.timing.map((t, i) => (
              <div key={i} style={{ display: 'flex', gap: 8, fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 6 }}>
                <span>{t.icon}</span> <span>{t.text}</span>
              </div>
            ))}
          </div>
        )}
        {!isCompleted ? (
          <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Speichert...' : '✅ Als erledigt markieren (+30 XP)'}
          </button>
        ) : (
          <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen +30 XP</span>
        )}
      </div>
    );
  }

  // 4.2 — Reactions (video + reactions list)
  if (key === '4.2') {
    return (
      <div>
        <VideoBlock />
        {content.reactions && (
          <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              5 Reaktionen & deine beste Antwort
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
              {content.reactions.map((r, i) => (
                <div key={i} style={{ borderBottom: i < content.reactions.length - 1 ? '1px solid var(--ki-border)' : 'none', paddingBottom: 14 }}>
                  <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ki-text)', marginBottom: 6 }}>{r.trigger}</div>
                  <div style={{ fontSize: 12, color: '#dc2626', marginBottom: 6 }}>
                    <strong>Falle:</strong> {r.trap}
                  </div>
                  <div style={{ fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
                    ✓ {r.answer}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!isCompleted ? (
          <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Speichert...' : '✅ Als erledigt markieren (+30 XP)'}
          </button>
        ) : (
          <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen +30 XP</span>
        )}
      </div>
    );
  }

  // 5.1 — Closing + email template
  if (key === '5.1') {
    return (
      <div>
        <VideoBlock />
        {content.closingMistakes && (
          <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
              3 Fehler beim Abschluss (und wie du sie vermeidest)
            </div>
            {content.closingMistakes.map((m, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12 }}>
                <div style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 12, fontWeight: 700, color: '#dc2626', flexShrink: 0 }}>
                  {i + 1}
                </div>
                <div>
                  <div style={{ fontSize: 13, fontWeight: 700, color: 'var(--ki-text)', marginBottom: 2 }}>{m.mistake}</div>
                  <div style={{ fontSize: 12, color: 'var(--ki-text-secondary)', lineHeight: 1.5 }}>Risiko: {m.risk}</div>
                </div>
              </div>
            ))}
          </div>
        )}
        {content.emailTemplate && <EmailTemplateWidget template={content.emailTemplate} />}
        {!isCompleted ? (
          <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving} style={{ width: '100%' }}>
            {saving ? 'Speichert...' : '✅ Als erledigt markieren (+30 XP)'}
          </button>
        ) : (
          <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen +30 XP</span>
        )}
      </div>
    );
  }

  // 5.2 — Final (no variants, three questions, market fact + final assessment)
  if (key === '5.2') {
    return (
      <div>
        <VideoBlock />
        {content.noVariants && (
          <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              3 Varianten eines "Nein"
            </div>
            {content.noVariants.map((v, i) => (
              <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 10 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: 'var(--ki-text)', minWidth: 120 }}>{v.type}</div>
                <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>→ {v.action}</div>
              </div>
            ))}
          </div>
        )}
        {content.threeQuestions && (
          <div className="card" style={{ background: 'var(--ki-bg-alt)', border: 'none', marginBottom: 24 }}>
            <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 12 }}>
              3 Fragen nach jedem Nein
            </div>
            {content.threeQuestions.map((q, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, marginBottom: 8, fontSize: 14, color: 'var(--ki-text)', lineHeight: 1.6 }}>
                <span style={{ color: 'var(--ki-red)', fontWeight: 700, flexShrink: 0 }}>{i + 1}.</span>
                <span>{q}</span>
              </div>
            ))}
          </div>
        )}
        {content.marketSwitchFact && (
          <div style={{
            padding: '12px 16px', borderRadius: 10, marginBottom: 24,
            background: 'rgba(245,158,11,0.05)', border: '1px solid rgba(245,158,11,0.15)',
            fontSize: 13, color: '#92400e', lineHeight: 1.6,
          }}>
            💡 {content.marketSwitchFact}
          </div>
        )}
        <FinalAssessmentWidget onSave={onMarkComplete} />
        {isCompleted && (
          <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px', display: 'inline-block' }}>✅ Kurs abgeschlossen +30 XP</span>
        )}
      </div>
    );
  }

  // Fallback
  return <VideoLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
}

// =====================
function SpeedLessonRouter({ lesson, lessonType, isCompleted, onMarkComplete, saving, userId, courseTitle }) {
  const title = (lesson.title || '').toLowerCase();
  const modOrder = lesson._moduleSortOrder ?? -1;

  function getModulQuiz() {
    const key = `modul_${modOrder}`;
    return MODUL_QUIZ_SPEED?.[key] || null;
  }

  // Modul 0: Selbstdiagnose
  if (modOrder === 0 && lessonType === 'interactive') {
    return isCompleted ? <CompletedBadge text="Lese-Diagnose abgeschlossen" /> : (
      <SelbstdiagnoseWidget onComplete={onMarkComplete} diagnoseData={SELBSTDIAGNOSE_SPEED} />
    );
  }

  // Modul 2: Atem-Übung (Fokus-Aktivierung)
  if (title.includes('atem') || title.includes('fokus-aktivierung')) {
    return isCompleted ? <CompletedBadge text="Fokus aktiviert!" /> : (
      <AtemTimerWidget config={PRE_READ_FOKUS} onComplete={onMarkComplete} />
    );
  }

  // Modul 2: WPM-Test (erster Test)
  if (title.includes('wpm-test') || (title.includes('wpm') && title.includes('test')) || title.includes('erster wpm')) {
    return isCompleted ? <CompletedBadge text="WPM-Test abgeschlossen" /> : (
      <WPMTestWidget texte={WPM_TEXTE} ghostWPM={0} onComplete={onMarkComplete} userId={userId} />
    );
  }

  // Modul 2: Textverständnis messen
  if (title.includes('textverständnis messen') || title.includes('textverstaendnis messen')) {
    return isCompleted ? <CompletedBadge text="Textverständnis gemessen" /> : (
      <WPMTestWidget texte={WPM_TEXTE.slice(1)} ghostWPM={0} onComplete={onMarkComplete} userId={userId} />
    );
  }

  // Modul 3: Ergonomie-Check
  if (title.includes('ergonomie')) {
    return isCompleted ? <CompletedBadge text="Ergonomie-Check abgeschlossen" /> : (
      <ErgonomieCheckWidget config={AUGENGESUNDHEIT.ergonomie_check} onComplete={onMarkComplete} />
    );
  }

  // Modul 4: Pacer-Simulator
  if (title.includes('pacer')) {
    return isCompleted ? <CompletedBadge text="Pacer-Training abgeschlossen" /> : (
      <PacerSimulator onComplete={onMarkComplete} />
    );
  }

  // Boss-Fight: Subvokalisierungs-Dämon (Modul 4)
  if (title.includes('boss-fight') && title.includes('subvokalisierung')) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Subvokalisierungs-Dämon besiegt! +150 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_SPEED.subvokalisierung} onComplete={onMarkComplete} />
    );
  }

  // Modul 5: Sehspannen-Trainer
  if (title.includes('sehspannen') || title.includes('4 level')) {
    return isCompleted ? <CompletedBadge text="Sehspannen-Training abgeschlossen" /> : (
      <SehspannenTrainer config={SEHSPANNEN_CONFIG} onComplete={onMarkComplete} />
    );
  }

  // Modul 6: Chunk-Reading Trainer
  if (title.includes('chunk-reading') || title.includes('chunk reading')) {
    return isCompleted ? <CompletedBadge text="Chunk-Reading Training abgeschlossen" /> : (
      <ChunkReadingTrainer config={CHUNK_READING_CONFIG} onComplete={onMarkComplete} />
    );
  }

  // Boss-Fight: Report-Berg (Modul 7)
  if (title.includes('boss-fight') && title.includes('report')) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Report-Berg besiegt! +200 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_SPEED.report_berg} onComplete={onMarkComplete} />
    );
  }

  // Modul 8: Differenzierungs-Matrix (Drag & Drop)
  if (title.includes('lese-modus') || title.includes('differenzierung') || (title.includes('drag') && title.includes('drop') && modOrder === 8)) {
    return isCompleted ? <CompletedBadge text="Differenzierungs-Matrix abgeschlossen" /> : (
      <DifferenzierungsMatrix config={DIFFERENZIERUNG.uebung} onComplete={onMarkComplete} />
    );
  }

  // Boss-Fight: Informationsflut (Modul 9)
  if (title.includes('boss-fight') && title.includes('informationsflut')) {
    return isCompleted ? <CompletedBadge text="Boss-Fight: Informationsflut besiegt! +250 XP" /> : (
      <BossFightWidget config={BOSS_FIGHTS_SPEED.informationsflut} onComplete={onMarkComplete} />
    );
  }

  // Modul 9: Relevanz-Filter / Lese-Diät
  if (title.includes('lese-diät') || title.includes('lese-diaet') || title.includes('persönliche lese')) {
    return isCompleted ? <CompletedBadge text="Lese-Diät erstellt +40 XP" /> : (
      <RelevanzFilterBuilder config={RELEVANZ_FILTER} onComplete={onMarkComplete} />
    );
  }

  // Modul 12: WPM Re-Test (Ghost Mode)
  if (title.includes('re-test') || title.includes('ghost')) {
    return isCompleted ? <CompletedBadge text="WPM Re-Test abgeschlossen" /> : (
      <WPMTestWidget texte={WPM_TEXTE} ghostWPM={250} onComplete={onMarkComplete} userId={userId} />
    );
  }

  // Modul 12: Shareable Progress Card
  if (title.includes('shareable') || title.includes('progress card')) {
    return isCompleted ? <CompletedBadge text="Progress Card erstellt!" /> : (
      <ShareableProgressCard startWPM={250} currentWPM={0} verstaendnis={0} tage={0} onComplete={onMarkComplete} />
    );
  }

  // Modul 12: Abschlusstest
  if (title.includes('abschlusstest')) {
    return isCompleted ? <CompletedBadge text="Abschlusstest bestanden! +500 XP" /> : (
      <AbschlussTestWidget onComplete={onMarkComplete} userId={userId} />
    );
  }

  // Modul 14: 30-Tage Challenge
  if (title.includes('30-tage') || title.includes('challenge')) {
    return isCompleted ? <CompletedBadge text="30-Tage Challenge gestartet!" /> : (
      <div className="card" style={{ padding: 32, textAlign: 'center' }}>
        <div style={{ fontSize: 48, marginBottom: 16 }}>📖</div>
        <h3 style={{ fontSize: 20, fontWeight: 700, marginBottom: 8 }}>30-Tage Speedreading Challenge</h3>
        <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 24, lineHeight: 1.7 }}>
          Ab heute übst du jeden Tag eine Speedreading-Technik. Woche 1: Beobachtung. Woche 2: Technik. Woche 3: Anwendung. Woche 4: Meisterschaft.
        </p>
        <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving}>
          {saving ? 'Startet...' : 'Challenge starten!'}
        </button>
      </div>
    );
  }

  // Module-specific quizzes
  if (lessonType === 'quiz') {
    const modulQuiz = getModulQuiz();
    if (modulQuiz) {
      return <QuizLesson lesson={lesson} courseTitle={courseTitle} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} userId={userId} overrideQuestions={modulQuiz} />;
    }
    return <QuizLesson lesson={lesson} courseTitle={courseTitle} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} userId={userId} />;
  }

  // Exercise with journal
  if (lessonType === 'exercise') {
    const journalQ = JOURNAL_FRAGEN_SPEED?.[modOrder] || null;
    if (journalQ) {
      return isCompleted ? <CompletedBadge text="Übung abgeschlossen +40 XP" /> : (
        <div>
          <ExerciseLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />
          <div style={{ marginTop: 24 }}>
            <JournalEntry frage={journalQ} modulIndex={modOrder} userId={userId} onComplete={() => {}} />
          </div>
        </div>
      );
    }
    return <ExerciseLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  }

  // Video
  if (lessonType === 'video') {
    return <VideoLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  }

  // Interactive fallback
  if (lessonType === 'interactive') {
    return <InteractiveLesson lesson={{ ...lesson, _userId: userId }} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
  }

  // Default
  return <VideoLesson lesson={lesson} isCompleted={isCompleted} onMarkComplete={onMarkComplete} saving={saving} />;
}

// Kompetenz-Boost: Zeigt Motivations-Kontext bei schwachen Bereichen
function CompetencyBoostBanner({ competency, lessonTitle }) {
  if (!competency || competency.level === 'stark' || competency.level === 'ausbaufaehig') return null;
  const tips = {
    kritisch: [
      'Nimm dir extra Zeit für diese Lektion — jeder Schritt zählt doppelt.',
      'Tipp: Mach dir Notizen. Bei einem Score unter 35% ist aktives Mitschreiben 3x effektiver.',
      'Du startest bei {score}% — nach diesem Modul wirst du den Unterschied spüren.',
      'Dein Gehirn baut gerade neue Verbindungen auf. Das fühlt sich anstrengend an — aber genau das ist Wachstum.',
    ],
    schwach: [
      'Fokus-Tipp: Lies jede Übung aufmerksam — hier liegt dein größter Hebel.',
      'Dein Score von {score}% zeigt Potenzial. Dieser Kurs bringt dich auf 60%+.',
      'Wende das Gelernte innerhalb von 24 Stunden an — das verdoppelt den Effekt.',
    ],
  };
  const pool = tips[competency.level] || tips.schwach;
  const tip = pool[Math.floor(Math.random() * pool.length)].replace('{score}', competency.score);
  return (
    <div style={{
      padding: '10px 14px', borderRadius: 'var(--r-md)', marginBottom: 16,
      background: competency.level === 'kritisch' ? 'rgba(239,68,68,0.04)' : 'rgba(245,158,11,0.04)',
      border: `1px solid ${competency.level === 'kritisch' ? 'rgba(239,68,68,0.12)' : 'rgba(245,158,11,0.12)'}`,
      fontSize: 12, color: 'var(--ki-text-secondary)', lineHeight: 1.6,
      display: 'flex', alignItems: 'flex-start', gap: 8,
    }}>
      <span style={{ fontSize: 16, flexShrink: 0 }}>{competency.level === 'kritisch' ? '🧠' : '💡'}</span>
      <span>{tip}</span>
    </div>
  );
}

// Skipped lesson card (module hidden for user's phase)
function SkippedLessonCard({ reason, alternativeText }) {
  return (
    <div style={{
      padding: 32, textAlign: 'center', background: 'var(--ki-bg-alt)',
      borderRadius: 16, border: '2px dashed var(--ki-border)',
      maxWidth: 480, margin: '40px auto',
    }}>
      <div style={{ fontSize: 40, marginBottom: 12 }}>🚀</div>
      <h3 style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Abkürzung genommen!</h3>
      <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.7, marginBottom: 16 }}>
        {reason || 'Dieses Modul wurde für deine Karrierephase übersprungen.'}
      </p>
      {alternativeText && (
        <p style={{ fontSize: 13, color: '#2563EB', fontWeight: 600 }}>
          Empfohlener Fokus: {alternativeText}
        </p>
      )}
      <p style={{ fontSize: 11, color: 'var(--ki-text-tertiary)', marginTop: 12 }}>
        Du kannst es trotzdem ansehen — klicke einfach auf "Als erledigt markieren".
      </p>
    </div>
  );
}

// Completed badge for already-done prio lessons
function CompletedBadge({ text }) {
  return (
    <div className="card" style={{
      padding: '24px 32px',
      textAlign: 'center',
      background: 'rgba(34,197,94,0.05)',
      border: '1px solid rgba(34,197,94,0.2)',
    }}>
      <span style={{ fontSize: 32, display: 'block', marginBottom: 8 }}>✅</span>
      <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>{text}</span>
    </div>
  );
}

// Confetti particle component
function ConfettiParticles({ count = 20 }) {
  const particles = useMemo(() => {
    return Array.from({ length: count }, (_, i) => ({
      id: i,
      left: Math.random() * 100,
      delay: Math.random() * 0.6,
      color: ['var(--ki-red)', '#f59e0b', '#10b981', '#3b82f6', '#8b5cf6'][i % 5],
      size: 6 + Math.random() * 8,
    }));
  }, [count]);

  return (
    <div style={{ position: 'absolute', inset: 0, pointerEvents: 'none', overflow: 'hidden' }}>
      {particles.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            top: -10,
            left: `${p.left}%`,
            width: p.size,
            height: p.size,
            borderRadius: Math.random() > 0.5 ? '50%' : 2,
            background: p.color,
            animation: `confFall 1.2s ease-in ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

// =====================
// LESSON TYPE VIEWS
// =====================

function VideoLesson({ lesson, isCompleted, onMarkComplete, saving }) {
  const takeaways = lesson.takeaways || [
    'Kernkonzepte verstehen und anwenden',
    'Praktische Techniken für den Alltag',
    'Schritt-für-Schritt Vorgehen',
    'Langfristige Gewohnheiten aufbauen',
  ];

  return (
    <div>
      {/* Video */}
      <div style={{
        borderRadius: 'var(--r-lg)',
        overflow: 'hidden',
        aspectRatio: '16/9',
        marginBottom: 24,
        background: '#000',
      }}>
        {lesson.vimeoId ? (
          <iframe
            src={`https://player.vimeo.com/video/${lesson.vimeoId}?title=0&byline=0&portrait=0&dnt=1`}
            style={{ width: '100%', height: '100%', border: 'none', display: 'block' }}
            allow="autoplay; fullscreen; picture-in-picture"
            allowFullScreen
            title={lesson.title}
          />
        ) : (
          <div style={{
            width: '100%', height: '100%',
            background: 'linear-gradient(135deg, #1a1a2e 0%, #16213e 60%, #0f3460 100%)',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column', gap: 16,
          }}>
            <div style={{
              width: 72, height: 72, borderRadius: '50%',
              background: 'rgba(204,20,38,0.2)', border: '2px solid rgba(204,20,38,0.4)',
              display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 28,
            }}>▶</div>
            <div style={{ color: 'white', fontSize: 16, fontWeight: 600 }}>Video wird vorbereitet</div>
            <div style={{ color: 'rgba(255,255,255,0.45)', fontSize: 13 }}>Inhalt folgt in Kürze</div>
          </div>
        )}
      </div>

      {/* Key takeaways */}
      <div className="card" style={{ marginBottom: 24, background: 'var(--ki-bg-alt)', border: 'none' }}>
        <div style={{ fontSize: 12, fontWeight: 600, color: 'var(--ki-text-tertiary)', textTransform: 'uppercase', letterSpacing: '0.06em', marginBottom: 14 }}>
          Key Takeaways
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {takeaways.map((t, i) => (
            <div key={i} style={{ display: 'flex', alignItems: 'flex-start', gap: 10, fontSize: 14, lineHeight: 1.6 }}>
              <span style={{ color: 'var(--ki-red)', fontWeight: 700, flexShrink: 0, marginTop: 1 }}>✓</span>
              <span style={{ color: 'var(--ki-text-secondary)' }}>{t}</span>
            </div>
          ))}
        </div>
      </div>

      {!isCompleted ? (
        <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving} style={{ gap: 8 }}>
          {saving ? 'Speichert...' : '✅ Als erledigt markieren (+30 XP)'}
        </button>
      ) : (
        <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen +30 XP</span>
      )}
    </div>
  );
}

function InteractiveLesson({ lesson, isCompleted, onMarkComplete, saving }) {
  const statements = lesson.statements || [
    'Ziele klar definieren und schriftlich festhalten',
    'Prioritäten täglich neu bewerten',
    'Feedback aktiv einholen und einarbeiten',
    'Reflexion als festen Bestandteil einplanen',
  ];

  const [ranking, setRanking] = useState(Array.from({ length: statements.length }, (_, i) => i));
  const [confirmed, setConfirmed] = useState(false);
  const [xpAwarded, setXpAwarded] = useState(false);
  const supabase = createClient();

  function moveItem(fromIdx, toIdx) {
    if (confirmed) return;
    const newRanking = [...ranking];
    const [item] = newRanking.splice(fromIdx, 1);
    newRanking.splice(toIdx, 0, item);
    setRanking(newRanking);
  }

  async function handleConfirm() {
    setConfirmed(true);
    if (!xpAwarded) {
      setXpAwarded(true);
      const { data: prof } = await supabase.from('profiles').select('total_points').eq('id', lesson._userId).single().catch(() => ({ data: null }));
    }
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: 24, border: '1px solid rgba(204,20,38,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 22 }}>🎮</span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Interaktive Übung</span>
        </div>
        <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
          Bringe die folgenden Aussagen in die Reihenfolge, die für dich am sinnvollsten ist (1 = höchste Priorität). Klicke auf ↑ / ↓ um die Reihenfolge zu ändern.
        </p>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          {ranking.map((stmtIdx, pos) => (
            <div
              key={stmtIdx}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 12,
                padding: '12px 14px',
                borderRadius: 'var(--r-md)',
                background: confirmed ? 'rgba(34,197,94,0.07)' : 'var(--ki-bg-alt)',
                border: confirmed ? '1px solid rgba(34,197,94,0.25)' : '1px solid var(--ki-border)',
                transition: 'all 0.15s',
              }}
            >
              <span style={{
                width: 26,
                height: 26,
                borderRadius: '50%',
                background: confirmed ? 'var(--ki-success)' : 'var(--ki-red)',
                color: 'white',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: 12,
                fontWeight: 700,
                flexShrink: 0,
              }}>{pos + 1}</span>
              <span style={{ flex: 1, fontSize: 14, lineHeight: 1.5 }}>{statements[stmtIdx]}</span>
              {!confirmed && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <button
                    onClick={() => pos > 0 && moveItem(pos, pos - 1)}
                    disabled={pos === 0}
                    style={{ background: 'none', border: 'none', cursor: pos === 0 ? 'default' : 'pointer', opacity: pos === 0 ? 0.3 : 1, fontSize: 14, padding: '2px 6px', color: 'var(--ki-text-secondary)' }}
                  >↑</button>
                  <button
                    onClick={() => pos < ranking.length - 1 && moveItem(pos, pos + 1)}
                    disabled={pos === ranking.length - 1}
                    style={{ background: 'none', border: 'none', cursor: pos === ranking.length - 1 ? 'default' : 'pointer', opacity: pos === ranking.length - 1 ? 0.3 : 1, fontSize: 14, padding: '2px 6px', color: 'var(--ki-text-secondary)' }}
                  >↓</button>
                </div>
              )}
            </div>
          ))}
        </div>
        {!confirmed ? (
          <button onClick={handleConfirm} className="btn btn-primary" style={{ marginTop: 16 }}>
            Bestätigen (+20 XP Bonus)
          </button>
        ) : (
          <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.2)', fontSize: 13, color: '#16a34a', fontWeight: 600 }}>
            ✅ Reihenfolge bestätigt! +20 XP
          </div>
        )}
      </div>

      {!isCompleted ? (
        <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving}>
          {saving ? 'Speichert...' : '✅ Als erledigt markieren'}
        </button>
      ) : (
        <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen</span>
      )}
    </div>
  );
}

function ExerciseLesson({ lesson, isCompleted, onMarkComplete, saving }) {
  const [text, setText] = useState('');
  const [aiFeedback, setAiFeedback] = useState(false);

  const prompt = lesson.exercise_prompt || lesson.description || 'Wende das Gelernte an und beschreibe deine Erfahrungen, Gedanken und konkreten nächsten Schritte.';
  const charCount = text.length;
  const isReady = charCount >= 100;

  return (
    <div>
      <div className="card" style={{ marginBottom: 24, border: '1px solid rgba(204,20,38,0.12)', background: 'rgba(204,20,38,0.02)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 10 }}>
          <span style={{ fontSize: 22 }}>🏋️</span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Praxisübung</span>
        </div>
        <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.7, marginBottom: 18 }}>
          {prompt}
        </p>
        <textarea
          className="input"
          value={text}
          onChange={e => setText(e.target.value)}
          placeholder="Schreibe hier deine Antwort... (mindestens 100 Zeichen)"
          rows={6}
          style={{ resize: 'vertical', marginBottom: 8 }}
          disabled={isCompleted}
        />
        <div style={{ fontSize: 12, color: isReady ? 'var(--ki-success)' : 'var(--ki-text-tertiary)', marginBottom: 16 }}>
          {charCount}/100 Zeichen {isReady ? '✓' : ''}
        </div>
        <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
          <button
            onClick={() => setAiFeedback(true)}
            className="btn btn-secondary"
            style={{ fontSize: 13 }}
          >
            🤖 KI-Feedback
          </button>
          {aiFeedback && (
            <div style={{ width: '100%', padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--ki-bg-alt)', border: '1px solid var(--ki-border)', fontSize: 13, color: 'var(--ki-text-secondary)' }}>
              Feature kommt bald 🚀
            </div>
          )}
        </div>
      </div>

      {!isCompleted ? (
        <button
          onClick={onMarkComplete}
          className="btn btn-primary"
          disabled={saving || !isReady}
          style={{ opacity: isReady ? 1 : 0.5 }}
        >
          {saving ? 'Speichert...' : '✅ Als erledigt markieren (+40 XP)'}
        </button>
      ) : (
        <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen +40 XP</span>
      )}
    </div>
  );
}

function QuizLesson({ lesson, courseTitle, isCompleted, onMarkComplete, saving, userId, overrideQuestions }) {
  const supabase = createClient();
  const questions = overrideQuestions || getQuizForCourse(courseTitle) || [];
  const [answers, setAnswers] = useState({});
  const [results, setResults] = useState({});
  const [xpPills, setXpPills] = useState({});
  const [confettiQ, setConfettiQ] = useState(null);
  const [quizDone, setQuizDone] = useState(false);
  const [quizSaved, setQuizSaved] = useState(false);
  const [score, setScore] = useState(0);
  const retryTimers = useRef({});

  const correctCount = Object.values(results).filter(r => r === 'correct').length;
  const allAnswered = questions.length > 0 && questions.every((_, i) => results[i] === 'correct');

  useEffect(() => {
    if (allAnswered && !quizDone) {
      setQuizDone(true);
      const sc = questions.length > 0 ? Math.round((correctCount / questions.length) * 100) : 0;
      setScore(sc);
      handleSaveQuiz(sc);
    }
  }, [allAnswered]);

  async function handleSaveQuiz(sc) {
    if (quizSaved) return;
    setQuizSaved(true);
    const xp = sc === 100 ? 100 : 50;
    await supabase.from('lesson_progress').upsert({
      user_id: userId,
      lesson_id: lesson.id,
      quiz_score: sc,
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' });
    const { data: prof } = await supabase.from('profiles').select('total_points').eq('id', userId).single().catch(() => ({ data: null }));
    if (prof) {
      await supabase.from('profiles').update({ total_points: (prof.total_points || 0) + xp }).eq('id', userId);
    }
  }

  async function handleAnswer(qIndex, optIndex) {
    if (results[qIndex] === 'correct') return;
    const isCorrect = optIndex === questions[qIndex].correct;
    setAnswers(prev => ({ ...prev, [qIndex]: optIndex }));
    setResults(prev => ({ ...prev, [qIndex]: isCorrect ? 'correct' : 'wrong' }));
    if (isCorrect) {
      setConfettiQ(qIndex);
      setXpPills(prev => ({ ...prev, [qIndex]: true }));
      setTimeout(() => setXpPills(prev => ({ ...prev, [qIndex]: false })), 2500);
      setTimeout(() => setConfettiQ(null), 1400);
    } else {
      if (retryTimers.current[qIndex]) clearTimeout(retryTimers.current[qIndex]);
      retryTimers.current[qIndex] = setTimeout(() => {
        setAnswers(prev => ({ ...prev, [qIndex]: undefined }));
        setResults(prev => ({ ...prev, [qIndex]: 'retry' }));
      }, 1500);
    }
  }

  if (questions.length === 0) {
    return (
      <div className="card" style={{ marginBottom: 24 }}>
        <p style={{ color: 'var(--ki-text-secondary)', fontSize: 14 }}>Keine Quiz-Fragen für diesen Kurs gefunden.</p>
        {!isCompleted ? (
          <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving} style={{ marginTop: 16 }}>
            {saving ? 'Speichert...' : '✅ Als erledigt markieren'}
          </button>
        ) : (
          <span className="pill pill-green" style={{ marginTop: 16, display: 'inline-block', fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen</span>
        )}
      </div>
    );
  }

  return (
    <div>
      <div className="card" style={{ marginBottom: 24, border: '1px solid rgba(204,20,38,0.15)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
          <span style={{ fontSize: 22 }}>📝</span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Quiz</span>
          <span style={{ marginLeft: 'auto', fontSize: 13, color: 'var(--ki-text-tertiary)' }}>
            {correctCount}/{questions.length} richtig
          </span>
        </div>
        <p style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', marginBottom: 20 }}>
          Beantworte alle Fragen. Bei falscher Antwort kannst du es erneut versuchen.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>
          {questions.map((q, qi) => {
            const result = results[qi];
            const selected = answers[qi];
            const isCorrect = result === 'correct';
            const isWrong = result === 'wrong';
            const showXp = xpPills[qi];
            const showConfetti = confettiQ === qi;
            return (
              <div key={qi} style={{ position: 'relative' }}>
                {showConfetti && <ConfettiParticles count={16} />}
                <div style={{ fontSize: 14, fontWeight: 600, marginBottom: 12, lineHeight: 1.5 }}>
                  {qi + 1}. {q.question}
                  {showXp && (
                    <span style={{
                      marginLeft: 10,
                      fontSize: 12,
                      fontWeight: 700,
                      background: 'var(--ki-success)',
                      color: 'white',
                      padding: '2px 10px',
                      borderRadius: 20,
                      animation: 'optPulse 0.4s ease',
                    }}>+XP 🎉</span>
                  )}
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                  {q.options.map((opt, oi) => {
                    const isThisCorrect = oi === q.correct;
                    const isSelected = selected === oi;
                    let bg = 'var(--ki-bg-alt)';
                    let border = '1px solid var(--ki-border)';
                    let color = 'var(--ki-text)';
                    if (isCorrect && isThisCorrect) { bg = 'rgba(34,197,94,0.1)'; border = '1px solid rgba(34,197,94,0.4)'; color = '#16a34a'; }
                    else if (isWrong && isSelected) { bg = 'rgba(239,68,68,0.08)'; border = '1px solid rgba(239,68,68,0.4)'; color = '#dc2626'; }
                    return (
                      <button
                        key={oi}
                        onClick={() => handleAnswer(qi, oi)}
                        disabled={isCorrect}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          padding: '10px 14px',
                          borderRadius: 'var(--r-md)',
                          background: bg,
                          border,
                          color,
                          cursor: isCorrect ? 'default' : 'pointer',
                          textAlign: 'left',
                          fontSize: 14,
                          fontWeight: isSelected ? 600 : 400,
                          transition: 'all 0.15s',
                          animation: (isWrong && isSelected) ? 'optPulse 0.35s ease' : 'none',
                        }}
                      >
                        <span style={{
                          width: 22,
                          height: 22,
                          borderRadius: '50%',
                          flexShrink: 0,
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 700,
                          background: isCorrect && isThisCorrect ? 'rgba(34,197,94,0.2)' : isWrong && isSelected ? 'rgba(239,68,68,0.2)' : 'var(--ki-card)',
                          border: '1px solid currentColor',
                        }}>
                          {isCorrect && isThisCorrect ? '✓' : isWrong && isSelected ? '✗' : String.fromCharCode(65 + oi)}
                        </span>
                        {opt}
                      </button>
                    );
                  })}
                </div>
                {isWrong && (
                  <div style={{ marginTop: 8, padding: '8px 12px', borderRadius: 'var(--r-sm)', background: 'rgba(239,68,68,0.06)', fontSize: 13, color: '#dc2626' }}>
                    Nicht ganz richtig – schau dir den Lerninhalt nochmal an und versuche es erneut.
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {quizDone && (
          <div style={{ marginTop: 24, padding: '16px 18px', borderRadius: 'var(--r-md)', background: 'rgba(34,197,94,0.08)', border: '1px solid rgba(34,197,94,0.25)' }}>
            <div style={{ fontSize: 16, fontWeight: 700, color: '#16a34a', marginBottom: 4 }}>
              🎉 Quiz abgeschlossen! Score: {score}%
            </div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
              {score === 100 ? '+100 XP für perfektes Ergebnis!' : '+50 XP für Quiz-Abschluss!'}
            </div>
          </div>
        )}
      </div>

      {!isCompleted ? (
        <button onClick={onMarkComplete} className="btn btn-primary" disabled={saving}>
          {saving ? 'Speichert...' : '✅ Als erledigt markieren'}
        </button>
      ) : (
        <span className="pill pill-green" style={{ fontSize: 14, padding: '8px 18px' }}>✅ Abgeschlossen</span>
      )}
    </div>
  );
}

// =====================
// COURSE COMPLETION SCREEN
// =====================

function CourseCompletionScreen({ course, quizScore }) {
  return (
    <div style={{ position: 'relative', textAlign: 'center', padding: '48px 24px', maxWidth: 560, margin: '0 auto' }}>
      <ConfettiParticles count={40} />
      <div style={{ fontSize: 64, marginBottom: 16 }}>🎉</div>
      <h2 style={{ fontSize: 28, fontWeight: 800, letterSpacing: '-0.03em', marginBottom: 8 }}>
        E-Learning abgeschlossen!
      </h2>
      <p style={{ fontSize: 16, color: 'var(--ki-text-secondary)', marginBottom: 8 }}>
        {course.title}
      </p>
      {quizScore !== null && (
        <p style={{ fontSize: 14, color: 'var(--ki-text-tertiary)', marginBottom: 24 }}>
          Quiz-Score: {quizScore}%
        </p>
      )}
      <div style={{ display: 'flex', justifyContent: 'center', gap: 12, marginBottom: 32, flexWrap: 'wrap' }}>
        <span className="pill pill-gold" style={{ fontSize: 15, padding: '8px 18px' }}>+200 XP</span>
        <span className="pill pill-green" style={{ fontSize: 15, padding: '8px 18px' }}>🏅 Zertifikat erhalten</span>
      </div>
      <div style={{ display: 'flex', gap: 12, justifyContent: 'center', flexWrap: 'wrap' }}>
        <button className="btn btn-secondary" onClick={() => alert('Zertifikat-Feature kommt bald!')}>
          Zertifikat ansehen
        </button>
        <a href="/masterclass" className="btn btn-primary">
          Nächster Kurs →
        </a>
      </div>
    </div>
  );
}

// =====================
// MAIN COMPONENT
// =====================

export default function CoursePlayerClient({ course, progress, analysisResults, profile, userId }) {
  const supabase = createClient();

  const isPrioCourse = course.id === PRIO_COURSE_ID;
  const isKommCourse = course.id === KOMM_COURSE_ID;
  const isSpeedCourse = course.id === SPEED_COURSE_ID;
  const isLernenCourse = course.id === LERNEN_COURSE_ID;
  const isBalanceCourse = course.id === BALANCE_COURSE_ID;
  const isNetzCourse = course.id === NETZ_COURSE_ID;
  const isGehaltCourse = course.id === GEHALT_COURSE_ID;
  const isEnhancedCourse = isPrioCourse || isKommCourse || isSpeedCourse || isLernenCourse || isBalanceCourse || isNetzCourse || isGehaltCourse;

  // --- User Phase (Zielgruppen-Personalisierung) ---
  const [userPhase, setUserPhase] = useState(profile?.phase || 'berufseinsteiger');

  useEffect(() => {
    async function loadPhase() {
      if (!userId) return;
      const { data } = await supabase.from('profiles').select('phase').eq('id', userId).single().catch(() => ({ data: null }));
      if (data?.phase) setUserPhase(data.phase);
    }
    loadPhase();
  }, [userId]);

  // --- Analyse-Score für diesen Kurs (Kompetenz-Personalisierung) ---
  // 4 Stufen: kritisch (<35), schwach (35-49), ausbaufähig (50-69), stark (70+)
  const courseCompetency = useMemo(() => {
    if (!analysisResults || !course?.competency_link) return null;
    const match = analysisResults.find(r => r.field_slug === course.competency_link);
    if (!match) return null;
    const score = Math.round(match.score);
    const level = score < 35 ? 'kritisch' : score < 50 ? 'schwach' : score < 70 ? 'ausbaufaehig' : 'stark';
    return { score, level, title: match.field_title, icon: match.field_icon };
  }, [analysisResults, course?.competency_link]);

  // Flatten lessons from ALL modules (sorted by module sort_order, then lesson sort_order)
  const allLessons = useMemo(() => {
    const modules = (course.modules || []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
    const lessons = [];
    for (const mod of modules) {
      const sorted = (mod.lessons || []).sort((a, b) => (a.sort_order ?? 0) - (b.sort_order ?? 0));
      for (const lesson of sorted) {
        lessons.push({ ...lesson, _moduleTitle: mod.title, _moduleSortOrder: mod.sort_order ?? 0 });
      }
    }
    return lessons;
  }, [course]);

  // Filter lessons by user phase (hide irrelevant modules)
  const filteredLessons = useMemo(() => {
    if (!course?.id) return allLessons;
    return allLessons.filter(lesson => isLessonVisible(course.id, lesson.title, userPhase));
  }, [allLessons, course?.id, userPhase]);

  const [currentIndex, setCurrentIndex] = useState(0);
  const [progressMap, setProgressMap] = useState(() => {
    const map = {};
    (progress || []).forEach(p => { map[p.lesson_id] = p; });
    return map;
  });
  const [saving, setSaving] = useState(false);

  const currentLesson = filteredLessons[currentIndex];
  const completedCount = filteredLessons.filter(l => progressMap[l.id]?.completed).length;
  const totalCount = filteredLessons.length;
  const progressPct = totalCount > 0 ? Math.round((completedCount / totalCount) * 100) : 0;
  const allDone = totalCount > 0 && completedCount === totalCount;

  // Sequential unlock: lesson at index i is unlocked if all previous are completed
  function isUnlocked(index) {
    if (index === 0) return true;
    return filteredLessons.slice(0, index).every(l => progressMap[l.id]?.completed);
  }

  function navigateTo(index) {
    if (!isUnlocked(index)) return;
    setCurrentIndex(index);
  }

  async function markComplete(xp) {
    if (!currentLesson) return;
    setSaving(true);
    await supabase.from('lesson_progress').upsert({
      user_id: userId,
      lesson_id: currentLesson.id,
      completed: true,
      completed_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    }, { onConflict: 'user_id,lesson_id' });
    setProgressMap(prev => ({
      ...prev,
      [currentLesson.id]: { ...prev[currentLesson.id], completed: true },
    }));
    // Award XP via zentrale Funktion (verhindert Dopplung)
    const finalXP = xp || getXpForType(currentLesson?.lesson_type || currentLesson?.type || 'video');
    await awardPoints(supabase, userId, null, finalXP);
    // Kurs-Abschluss Bonus (150 XP) wenn alle Lektionen fertig
    const newCompleted = filteredLessons.filter(l => l.id === currentLesson.id || progressMap[l.id]?.completed).length;
    if (newCompleted === totalCount && totalCount > 0) {
      await awardPoints(supabase, userId, 'COMPLETE_COURSE');
    }
    setSaving(false);
  }

  function getXpForType(type) {
    // Schwächen-Boost: 2x für kritisch, 1.5x für schwach (basierend auf Analyse-Score)
    const boost = courseCompetency?.level === 'kritisch' ? 2 : courseCompetency?.level === 'schwach' ? 1.5 : 1;
    if (type === 'exercise' || type === 'interactive') return Math.round(40 * boost);
    if (type === 'boss_fight' || type === 'boss-fight') return Math.round(60 * boost);
    if (type === 'quiz') return 0; // Quiz vergibt eigene XP
    if (type === 'abschlusstest') return Math.round(100 * boost);
    return Math.round(30 * boost); // Standard: Video, Text, etc.
  }

  const isCompleted = currentLesson ? !!progressMap[currentLesson.id]?.completed : false;
  const lessonType = currentLesson?.lesson_type || currentLesson?.type || 'video';

  // Get quiz score for completion screen
  const quizLesson = filteredLessons.find(l => (l.lesson_type || l.type) === 'quiz');
  const quizScore = quizLesson ? (progressMap[quizLesson.id]?.quiz_score ?? null) : null;

  return (
    <div className="page-container animate-in" style={{ maxWidth: 1400 }}>
      <style>{`
        @keyframes optPulse { 0%{transform:scale(1)} 50%{transform:scale(1.03)} 100%{transform:scale(1)} }
        @keyframes confFall { 0%{transform:translateY(0) rotate(0deg);opacity:1} 100%{transform:translateY(200px) rotate(720deg);opacity:0} }
      `}</style>

      {/* Back link */}
      <a
        href="/masterclass"
        style={{ fontSize: 13, color: 'var(--ki-text-secondary)', display: 'inline-flex', alignItems: 'center', gap: 6, marginBottom: 20, textDecoration: 'none' }}
      >
        ← Zurück
      </a>

      {/* Course Header */}
      <div style={{ marginBottom: 28 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 10, flexWrap: 'wrap' }}>
          {course.icon && <span style={{ fontSize: 28 }}>{course.icon}</span>}
          <h1 className="page-title" style={{ margin: 0 }}>{course.title}</h1>
          <span className="pill pill-grey" style={{ fontSize: 13 }}>
            Modul {currentIndex + 1}/{totalCount}
          </span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div className="progress-bar" style={{ flex: 1, maxWidth: 320 }}>
            <div className="progress-bar-fill" style={{ width: `${progressPct}%` }} />
          </div>
          <span style={{ fontSize: 13, color: 'var(--ki-text-tertiary)', flexShrink: 0 }}>
            {completedCount}/{totalCount} abgeschlossen
          </span>
        </div>

        {/* Kompetenz-Score Banner (aus Karriere-Analyse) */}
        {courseCompetency && (() => {
          const cfg = {
            kritisch: { bg: 'rgba(239,68,68,0.08)', border: 'rgba(239,68,68,0.25)', color: '#dc2626', label: '🚨 Kritischer Bereich — Hier liegt dein größtes Wachstumspotenzial', sub: 'Dieser Kurs wird dir Schritt für Schritt die Grundlagen aufbauen. Jede Lektion zählt.' },
            schwach: { bg: 'rgba(245,158,11,0.06)', border: 'rgba(245,158,11,0.2)', color: '#d97706', label: '⚡ Entwicklungsbereich — Hier wirst du am meisten wachsen', sub: 'Du hast eine Basis — dieser Kurs macht sie solide.' },
            ausbaufaehig: { bg: 'rgba(59,130,246,0.05)', border: 'rgba(59,130,246,0.15)', color: '#2563eb', label: '📈 Ausbaufähig — Gutes Fundament, Potenzial nach oben', sub: 'Fokussiere dich auf die fortgeschrittenen Module.' },
            stark: { bg: 'rgba(34,197,94,0.05)', border: 'rgba(34,197,94,0.15)', color: '#16a34a', label: '💪 Stärke — Verfeinere und meistere dein Können', sub: 'Du bist schon gut. Die Boss-Fights und Abschlussübungen sind dein Fokus.' },
          }[courseCompetency.level];
          return (
            <div style={{ marginTop: 12, padding: '12px 16px', borderRadius: 'var(--r-md)', background: cfg.bg, border: `1px solid ${cfg.border}`, display: 'flex', alignItems: 'center', gap: 12 }}>
              <div style={{ width: 44, height: 44, borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 17, fontWeight: 800, background: `${cfg.color}15`, color: cfg.color, flexShrink: 0 }}>
                {courseCompetency.score}%
              </div>
              <div style={{ flex: 1 }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: cfg.color }}>{cfg.label}</div>
                <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginTop: 2 }}>
                  {courseCompetency.title}: {courseCompetency.score}% — {cfg.sub}
                </div>
              </div>
            </div>
          );
        })()}
      </div>

      {/* Course Completion Screen */}
      {allDone ? (
        <CourseCompletionScreen course={course} quizScore={quizScore} />
      ) : (
        <div className="course-layout">
          {/* LEFT: Current lesson content */}
          <div>
            {currentLesson && (
              <>
                {/* Lesson header */}
                <div style={{ marginBottom: 20 }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 6, flexWrap: 'wrap' }}>
                    <span style={{ fontSize: 22 }}>{getLessonTypeIcon(lessonType)}</span>
                    <h2 style={{ fontSize: 22, fontWeight: 700, letterSpacing: '-0.02em', margin: 0 }}>{currentLesson.title}</h2>
                    {currentLesson.duration_minutes && (
                      <span style={{ fontSize: 13, color: 'var(--ki-text-tertiary)' }}>{currentLesson.duration_minutes} Min.</span>
                    )}
                  </div>
                  {currentLesson.description && (
                    <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', lineHeight: 1.7, margin: 0 }}>
                      {currentLesson.description}
                    </p>
                  )}
                </div>

                {/* Kompetenz-Boost bei schwachen Bereichen */}
                <CompetencyBoostBanner competency={courseCompetency} lessonTitle={currentLesson.title} />

                {/* Lesson type view */}
                {isBalanceCourse ? (
                  <BalanceLessonRouter
                    lesson={currentLesson}
                    lessonType={lessonType}
                    isCompleted={isCompleted}
                    onMarkComplete={() => markComplete(getXpForType(lessonType))}
                    saving={saving}
                    userId={userId}
                    courseTitle={course.title}
                    userPhase={userPhase}
                  />
                ) : isGehaltCourse ? (
                  <GehaltLessonRouter
                    lesson={currentLesson}
                    lessonType={lessonType}
                    isCompleted={isCompleted}
                    onMarkComplete={() => markComplete(getXpForType(lessonType))}
                    saving={saving}
                    userId={userId}
                  />
                ) : isNetzCourse ? (
                  <NetworkingLessonRouter
                    lesson={currentLesson}
                    lessonType={lessonType}
                    isCompleted={isCompleted}
                    onMarkComplete={() => markComplete(getXpForType(lessonType))}
                    saving={saving}
                    userId={userId}
                    courseTitle={course.title}
                    userPhase={userPhase}
                  />
                ) : isLernenCourse ? (
                  <LernenLessonRouter
                    lesson={currentLesson}
                    lessonType={lessonType}
                    isCompleted={isCompleted}
                    onMarkComplete={() => markComplete(getXpForType(lessonType))}
                    saving={saving}
                    userId={userId}
                    courseTitle={course.title}
                    userPhase={userPhase}
                  />
                ) : isSpeedCourse ? (
                  <SpeedLessonRouter
                    lesson={currentLesson}
                    lessonType={lessonType}
                    isCompleted={isCompleted}
                    onMarkComplete={() => markComplete(getXpForType(lessonType))}
                    saving={saving}
                    userId={userId}
                    courseTitle={course.title}
                    userPhase={userPhase}
                  />
                ) : isKommCourse ? (
                  <KommLessonRouter
                    lesson={currentLesson}
                    lessonType={lessonType}
                    isCompleted={isCompleted}
                    onMarkComplete={() => markComplete(getXpForType(lessonType))}
                    saving={saving}
                    userId={userId}
                    courseTitle={course.title}
                    userPhase={userPhase}
                  />
                ) : isPrioCourse ? (
                  <PrioLessonRouter
                    lesson={currentLesson}
                    lessonType={lessonType}
                    isCompleted={isCompleted}
                    onMarkComplete={() => markComplete(getXpForType(lessonType))}
                    saving={saving}
                    userId={userId}
                    courseTitle={course.title}
                    userPhase={userPhase}
                  />
                ) : (
                  <>
                    {lessonType === 'video' && (
                      <VideoLesson
                        lesson={currentLesson}
                        isCompleted={isCompleted}
                        onMarkComplete={() => markComplete(getXpForType(lessonType))}
                        saving={saving}
                      />
                    )}
                    {lessonType === 'interactive' && (
                      <InteractiveLesson
                        lesson={{ ...currentLesson, _userId: userId }}
                        isCompleted={isCompleted}
                        onMarkComplete={() => markComplete(getXpForType(lessonType))}
                        saving={saving}
                      />
                    )}
                    {lessonType === 'exercise' && (
                      <ExerciseLesson
                        lesson={currentLesson}
                        isCompleted={isCompleted}
                        onMarkComplete={() => markComplete(getXpForType(lessonType))}
                        saving={saving}
                      />
                    )}
                    {lessonType === 'quiz' && (
                      <QuizLesson
                        lesson={currentLesson}
                        courseTitle={course.title}
                        isCompleted={isCompleted}
                        onMarkComplete={() => markComplete(getXpForType(lessonType))}
                        saving={saving}
                        userId={userId}
                      />
                    )}
                    {!['video', 'interactive', 'exercise', 'quiz'].includes(lessonType) && (
                      <VideoLesson
                        lesson={currentLesson}
                        isCompleted={isCompleted}
                        onMarkComplete={() => markComplete(getXpForType(lessonType))}
                        saving={saving}
                      />
                    )}
                  </>
                )}

                {/* Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: 28, marginTop: 28, borderTop: '1px solid var(--ki-border)' }}>
                  <button
                    onClick={() => navigateTo(currentIndex - 1)}
                    className="btn btn-secondary"
                    disabled={currentIndex === 0}
                    style={{ opacity: currentIndex === 0 ? 0.4 : 1 }}
                  >
                    ← Zurück
                  </button>
                  <span style={{ fontSize: 13, color: 'var(--ki-text-tertiary)' }}>
                    {currentIndex + 1} / {totalCount}
                  </span>
                  <button
                    onClick={() => navigateTo(currentIndex + 1)}
                    className="btn btn-primary"
                    disabled={currentIndex >= totalCount - 1 || !isCompleted}
                    style={{ opacity: (currentIndex >= totalCount - 1 || !isCompleted) ? 0.4 : 1 }}
                  >
                    Weiter →
                  </button>
                </div>
              </>
            )}
          </div>

          {/* RIGHT: Module Sidebar */}
          <div style={{ position: 'sticky', top: 24 }}>
            <div className="card" style={{ padding: 0, overflow: 'hidden' }}>
              <div style={{ padding: '18px 18px 14px' }}>
                <div style={{ fontSize: 13, fontWeight: 600, color: 'var(--ki-text-tertiary)', marginBottom: 10 }}>
                  Kurs-Inhalt
                </div>
                {/* Phase Banner */}
                {(() => {
                  const pLabel = course?.id ? getPhaseLabel(course.id, userPhase) : null;
                  return pLabel ? (
                    <div style={{
                      padding: '8px 12px', background: 'rgba(37,99,235,0.05)',
                      borderRadius: 8, border: '1px solid rgba(37,99,235,0.1)',
                      marginBottom: 8, fontSize: 11, color: 'var(--ki-text-secondary)',
                      display: 'flex', alignItems: 'center', gap: 4,
                    }}>
                      <span>🎯</span> {pLabel}
                    </div>
                  ) : null;
                })()}
              </div>
              <div style={{ maxHeight: 'calc(100vh - 260px)', overflowY: 'auto' }}>
                {filteredLessons.map((lesson, idx) => {
                  const isActive = idx === currentIndex;
                  const isDone = !!progressMap[lesson.id]?.completed;
                  const locked = !isUnlocked(idx);
                  const type = lesson.lesson_type || lesson.type || 'video';
                  const highlighted = isLessonHighlighted(course.id, lesson.title, userPhase);
                  let statusIcon = locked ? '🔒' : isDone ? '✅' : isActive ? '▶' : '○';
                  // Show module header for multi-module courses
                  const showModuleHeader = isEnhancedCourse && (idx === 0 || lesson._moduleSortOrder !== filteredLessons[idx - 1]?._moduleSortOrder);
                  return (
                    <div key={lesson.id}>
                      {showModuleHeader && (
                        <div style={{
                          padding: '10px 18px 4px',
                          fontSize: 11,
                          fontWeight: 700,
                          color: 'var(--ki-red)',
                          textTransform: 'uppercase',
                          letterSpacing: '0.05em',
                          borderTop: idx > 0 ? '1px solid var(--ki-border)' : 'none',
                          marginTop: idx > 0 ? 4 : 0,
                        }}>
                          {lesson._moduleTitle}
                        </div>
                      )}
                      <button
                        onClick={() => !locked && navigateTo(idx)}
                        disabled={locked}
                        style={{
                          display: 'flex',
                          alignItems: 'center',
                          gap: 10,
                          width: '100%',
                          padding: '10px 18px',
                          border: 'none',
                          background: isActive ? 'rgba(204,20,38,0.06)' : 'transparent',
                          cursor: locked ? 'not-allowed' : 'pointer',
                          textAlign: 'left',
                          transition: 'background 0.15s',
                          borderLeft: isActive ? '3px solid var(--ki-red)' : '3px solid transparent',
                          opacity: locked ? 0.5 : 1,
                        }}
                      >
                        <span style={{ fontSize: 14, flexShrink: 0 }}>{statusIcon}</span>
                        <span style={{ fontSize: 12, flexShrink: 0 }}>{getLessonTypeIcon(type)}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{
                            fontSize: 13,
                            fontWeight: isActive ? 600 : 400,
                            color: isActive ? 'var(--ki-text)' : 'var(--ki-text-secondary)',
                            whiteSpace: 'nowrap',
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                          }}>
                            {lesson.title}
                            {highlighted && (
                              <span style={{
                                fontSize: 9, fontWeight: 700, color: '#CC1426',
                                background: 'rgba(204,20,38,0.08)', padding: '1px 5px',
                                borderRadius: 99, marginLeft: 4, whiteSpace: 'nowrap',
                              }}>⭐</span>
                            )}
                          </div>
                          {lesson.duration_minutes && (
                            <div style={{ fontSize: 11, color: 'var(--ki-text-tertiary)' }}>{lesson.duration_minutes} Min.</div>
                          )}
                        </div>
                      </button>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
