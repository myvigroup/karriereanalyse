'use client';

import { useState } from 'react';
import { DIGITALE_KOMMUNIKATION } from '@/lib/elearning/kommunikation-content';

const DEFAULT_SLACK_RULES = [
  { regel: 'Thread-Pflicht f\u00fcr Antworten', warum: 'Threads halten Kan\u00e4le \u00fcbersichtlich. Ohne Threads entstehen lange, verwirrende Konversationen, in denen niemand mehr den Kontext findet.' },
  { regel: 'Emoji-Reaktionen statt "OK"-Nachrichten', warum: 'Ein Daumen-hoch-Emoji spart eine Benachrichtigung und reduziert Noise. Jede unn\u00f6tige Nachricht ist eine Unterbrechung.' },
  { regel: 'Status aktiv pflegen', warum: 'Dein Status zeigt dem Team, ob du erreichbar bist, im Meeting sitzt oder fokussiert arbeitest. Das reduziert unn\u00f6tige Pings.' },
  { regel: 'Channels statt DMs f\u00fcr Team-Themen', warum: 'Wissen geh\u00f6rt ins Team, nicht in private Nachrichten. In Channels kann jeder mitlesen und beitragen.' },
  { regel: '@here und @channel sparsam nutzen', warum: 'Jedes @channel benachrichtigt ALLE. Frage dich: Muss das wirklich jeder sofort sehen? Meistens reicht @here oder ein gezielter @mention.' },
];

const DEFAULT_VIDEO_RULES = [
  { regel: 'Kamera an = Respekt', warum: 'Eingeschaltete Kameras verbessern die Kommunikation. Mimik und Gestik sind essentiell f\u00fcr Verst\u00e4ndnis. Kamera aus sendet das Signal: "Mir ist es nicht wichtig."' },
  { regel: 'Mute wenn du nicht sprichst', warum: 'Hintergrundger\u00e4usche st\u00f6ren alle. Ein Klick auf Mute ist einfach und zeigt R\u00fccksicht.' },
  { regel: 'Virtual Background professionell', warum: 'Ein aufger\u00e4umter (virtueller) Hintergrund wirkt professionell. Vermeide ablenkende oder lustige Hintergr\u00fcnde in Business-Calls.' },
  { regel: 'Chat f\u00fcr Fragen nutzen', warum: 'Statt den Sprecher zu unterbrechen: Frage in den Chat schreiben. Der Moderator sammelt und stellt sie geb\u00fcndelt.' },
  { regel: 'P\u00fcnktlich = 2 Minuten vorher', warum: 'Technik-Probleme passieren. Sei 2 Minuten fr\u00fcher da, teste Audio/Video, und starte entspannt statt gehetzt.' },
];

const DEFAULT_KANAL_QUIZ = [
  { situation: 'Kurze R\u00fcckfrage zum Status eines Tasks', correct: 'Chat', feedback: 'Kurze, asynchrone Fragen geh\u00f6ren in den Chat. Kein Meeting n\u00f6tig!' },
  { situation: 'Konfliktkl\u00e4rung mit einem Kollegen', correct: 'Video', feedback: 'Konflikte brauchen Mimik und Tonalit\u00e4t. Text kann leicht missverstanden werden.' },
  { situation: 'Formelle Projektfreigabe dokumentieren', correct: 'Email', feedback: 'E-Mails sind dokumentiert und formal. Perfekt f\u00fcr offizielle Freigaben.' },
  { situation: 'Dringende Frage zu einem Kundenanruf in 10 Minuten', correct: 'Anruf', feedback: 'Bei Zeitdruck ist ein kurzer Anruf der schnellste Kanal.' },
  { situation: 'Wochenbericht ans Team senden', correct: 'Email', feedback: 'Strukturierte Informationen, die nachgelesen werden sollen, geh\u00f6ren in eine E-Mail.' },
  { situation: 'Brainstorming-Session mit 4 Personen', correct: 'Video', feedback: 'Kreative Zusammenarbeit braucht Interaktion â Video ist ideal f\u00fcr Brainstorming.' },
];

const CHANNEL_OPTIONS = [
  { id: 'Chat', icon: '\u{1F4AC}', color: '#3B82F6' },
  { id: 'Email', icon: '\u{1F4E7}', color: '#10B981' },
  { id: 'Anruf', icon: '\u{1F4DE}', color: '#F59E0B' },
  { id: 'Video', icon: '\u{1F4F9}', color: '#8B5CF6' },
];

export default function DigitaleKommWidget({ onComplete }) {
  const slackRules = DIGITALE_KOMMUNIKATION?.slack || DEFAULT_SLACK_RULES;
  const videoRules = DIGITALE_KOMMUNIKATION?.video || DEFAULT_VIDEO_RULES;
  const kanalQuiz = DIGITALE_KOMMUNIKATION?.kanalQuiz || DEFAULT_KANAL_QUIZ;

  const [activeTab, setActiveTab] = useState(0);
  const [expandedRule, setExpandedRule] = useState(null);

  // Quiz state
  const [quizIndex, setQuizIndex] = useState(0);
  const [quizAnswer, setQuizAnswer] = useState(null);
  const [quizFeedback, setQuizFeedback] = useState(false);
  const [quizScores, setQuizScores] = useState([]);
  const [quizDone, setQuizDone] = useState(false);

  const TABS = [
    { label: 'Slack/Teams', icon: '\u{1F4AC}' },
    { label: 'Video-Calls', icon: '\u{1F4F9}' },
    { label: 'Welcher Kanal?', icon: '\u{1F4E1}' },
  ];

  const toggleRule = (index) => {
    setExpandedRule(expandedRule === index ? null : index);
  };

  // Quiz handlers
  const handleQuizAnswer = (channelId) => {
    if (quizFeedback) return;
    setQuizAnswer(channelId);
    setQuizFeedback(true);
    const current = kanalQuiz[quizIndex];
    const isCorrect = channelId === current.correct;
    setQuizScores((prev) => [...prev, isCorrect ? 1 : 0]);
  };

  const handleQuizNext = () => {
    if (quizIndex + 1 < kanalQuiz.length) {
      setQuizIndex(quizIndex + 1);
      setQuizAnswer(null);
      setQuizFeedback(false);
    } else {
      setQuizDone(true);
    }
  };

  const quizCorrect = quizScores.reduce((a, b) => a + b, 0);
  const quizPassed = quizCorrect >= 4;

  const renderRules = (rules, iconTheme) => (
    <div style={styles.rulesList}>
      {rules.map((rule, i) => (
        <div
          key={i}
          className="card"
          style={styles.ruleCard}
          onClick={() => toggleRule(i)}
        >
          <div style={styles.ruleHeader}>
            <div style={styles.ruleBubble}>
              <span style={styles.ruleNum}>{i + 1}</span>
              <span style={styles.ruleText}>{rule.regel}</span>
            </div>
            <span style={styles.expandIcon}>
              {expandedRule === i ? '\u25B2' : '\u25BC'}
            </span>
          </div>
          {expandedRule === i && (
            <div style={styles.ruleDetail}>
              <div style={styles.warumLabel}>Warum?</div>
              <p style={styles.warumText}>{rule.warum}</p>
            </div>
          )}
        </div>
      ))}
    </div>
  );

  const renderQuiz = () => {
    if (quizDone) {
      return (
        <div style={styles.quizResult}>
          <div className="card" style={styles.resultCard}>
            <div style={styles.resultScore}>{quizCorrect}/{kanalQuiz.length}</div>
            <p style={styles.resultText}>richtige Zuordnungen</p>
            <div style={styles.progressBarOuter}>
              <div style={{
                ...styles.progressBarInner,
                width: `${(quizCorrect / Math.max(kanalQuiz.length, 1)) * 100}%`,
                background: quizPassed ? 'var(--ki-success, #10B981)' : 'var(--ki-warning, #F59E0B)',
              }} />
            </div>
            <p style={styles.resultFeedback}>
              {quizPassed
                ? 'Du wei\u00dft genau, welcher Kanal wann passt!'
                : 'Schau dir die Regeln nochmal an â der richtige Kanal macht den Unterschied.'}
            </p>
          </div>
          {quizPassed && (
            <div style={styles.actions}>
              <button className="btn btn-primary" onClick={() => onComplete?.({ score: quizCorrect, total: kanalQuiz.length })} style={styles.completeBtn}>
                Weiter
              </button>
            </div>
          )}
          {!quizPassed && (
            <div style={styles.actions}>
              <button className="btn btn-secondary" onClick={() => {
                setQuizIndex(0);
                setQuizAnswer(null);
                setQuizFeedback(false);
                setQuizScores([]);
                setQuizDone(false);
              }}>
                Nochmal versuchen
              </button>
            </div>
          )}
        </div>
      );
    }

    const current = kanalQuiz[quizIndex];

    return (
      <div>
        <div style={styles.progressBarOuter}>
          <div style={{ ...styles.progressBarInner, width: `${(quizIndex / Math.max(kanalQuiz.length, 1)) * 100}%` }} />
        </div>
        <p style={styles.progressLabel}>{quizIndex + 1} von {kanalQuiz.length}</p>

        <div className="card" style={styles.situationCard}>
          <div style={styles.situationLabel}>Situation:</div>
          <p style={styles.situationText}>{current.situation}</p>
        </div>

        <p style={styles.questionLabel}>Welcher Kanal ist am besten?</p>

        <div style={styles.channelGrid}>
          {CHANNEL_OPTIONS.map((ch) => {
            const isSelected = quizAnswer === ch.id;
            const isCorrect = ch.id === current.correct;
            let cardStyle = { ...styles.channelCard };
            if (quizFeedback && isCorrect) {
              cardStyle = { ...cardStyle, borderColor: '#10B981', background: '#f0fdf4' };
            } else if (quizFeedback && isSelected && !isCorrect) {
              cardStyle = { ...cardStyle, borderColor: '#EF4444', background: '#fef2f2' };
            } else if (isSelected) {
              cardStyle = { ...cardStyle, borderColor: ch.color };
            }
            return (
              <button
                key={ch.id}
                style={cardStyle}
                onClick={() => handleQuizAnswer(ch.id)}
                disabled={quizFeedback}
              >
                <span style={styles.channelIcon}>{ch.icon}</span>
                <span style={styles.channelName}>{ch.id}</span>
              </button>
            );
          })}
        </div>

        {quizFeedback && (
          <>
            <div className="card" style={{
              ...styles.feedbackCard,
              borderLeft: `4px solid ${quizAnswer === current.correct ? '#10B981' : '#EF4444'}`,
            }}>
              <p style={{
                ...styles.feedbackTitle,
                color: quizAnswer === current.correct ? '#10B981' : '#EF4444',
              }}>
                {quizAnswer === current.correct ? 'Richtig!' : `Nicht ganz â richtig w\u00e4re: ${current.correct}`}
              </p>
              <p style={styles.feedbackText}>{current.feedback}</p>
            </div>
            <div style={styles.actions}>
              <button className="btn btn-primary" onClick={handleQuizNext}>
                {quizIndex + 1 < kanalQuiz.length ? 'N\u00e4chste Frage' : 'Ergebnis anzeigen'}
              </button>
            </div>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Digitale Kommunikation</h2>
      <p style={styles.subtext}>
        Regeln und Best Practices für professionelle digitale Kommunikation.
      </p>

      {/* Tab navigation */}
      <div style={styles.tabs}>
        {TABS.map((tab, i) => (
          <button
            key={i}
            style={{
              ...styles.tab,
              borderBottomColor: activeTab === i ? 'var(--ki-red, #CC1426)' : 'transparent',
              color: activeTab === i ? 'var(--ki-red, #CC1426)' : '#888',
              fontWeight: activeTab === i ? 700 : 400,
            }}
            onClick={() => { setActiveTab(i); setExpandedRule(null); }}
          >
            <span style={styles.tabIcon}>{tab.icon}</span>
            <span>{tab.label}</span>
          </button>
        ))}
      </div>

      {/* Tab content */}
      <div style={styles.tabContent}>
        {activeTab === 0 && (
          <>
            <h3 style={styles.sectionTitle}>{'\u{1F4AC}'} Slack/Teams Regeln</h3>
            {renderRules(slackRules)}
          </>
        )}
        {activeTab === 1 && (
          <>
            <h3 style={styles.sectionTitle}>{'\u{1F4F9}'} Video-Call Regeln</h3>
            {renderRules(videoRules)}
          </>
        )}
        {activeTab === 2 && (
          <>
            <h3 style={styles.sectionTitle}>{'\u{1F4E1}'} Welcher Kanal passt?</h3>
            {renderQuiz()}
          </>
        )}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Instrument Sans, sans-serif',
    maxWidth: 700,
    margin: '0 auto',
    padding: '1rem',
  },
  heading: {
    fontSize: '1.5rem',
    fontWeight: 700,
    textAlign: 'center',
    marginBottom: '0.25rem',
    color: 'var(--ki-text, #1a1a1a)',
  },
  subtext: {
    textAlign: 'center',
    fontSize: '0.9rem',
    color: '#888',
    marginBottom: '1.5rem',
    lineHeight: 1.5,
  },
  tabs: {
    display: 'flex',
    gap: 4,
    marginBottom: 20,
    borderBottom: '2px solid #eee',
  },
  tab: {
    flex: 1,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 6,
    padding: '10px 12px',
    background: 'none',
    border: 'none',
    borderBottom: '3px solid transparent',
    cursor: 'pointer',
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: 14,
    transition: 'all 0.2s',
  },
  tabIcon: { fontSize: '1.1rem' },
  tabContent: {
    minHeight: 300,
  },
  sectionTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--ki-text, #1a1a1a)',
    marginBottom: 16,
  },
  rulesList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  ruleCard: {
    padding: 0,
    cursor: 'pointer',
    overflow: 'hidden',
    transition: 'box-shadow 0.2s',
  },
  ruleHeader: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '14px 16px',
  },
  ruleBubble: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  ruleNum: {
    width: 28,
    height: 28,
    borderRadius: '50%',
    background: 'var(--ki-red, #CC1426)',
    color: '#fff',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: 13,
    fontWeight: 700,
    flexShrink: 0,
  },
  ruleText: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--ki-text, #333)',
  },
  expandIcon: {
    fontSize: 12,
    color: '#aaa',
    marginLeft: 12,
  },
  ruleDetail: {
    padding: '0 16px 16px',
    borderTop: '1px solid #eee',
    paddingTop: 12,
  },
  warumLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--ki-red, #CC1426)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 6,
  },
  warumText: {
    fontSize: '0.88rem',
    color: 'var(--ki-text, #555)',
    lineHeight: 1.6,
    margin: 0,
  },
  progressBarOuter: {
    height: 4,
    background: '#e0e0e0',
    borderRadius: 2,
    marginBottom: 6,
    overflow: 'hidden',
  },
  progressBarInner: {
    height: '100%',
    background: 'var(--ki-red, #CC1426)',
    borderRadius: 2,
    transition: 'width 0.4s ease',
  },
  progressLabel: {
    fontSize: 12,
    color: '#aaa',
    marginBottom: 16,
    textAlign: 'center',
  },
  situationCard: {
    padding: 20,
    borderLeft: '4px solid var(--ki-red, #CC1426)',
    marginBottom: 16,
  },
  situationLabel: {
    fontSize: 12,
    fontWeight: 700,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 6,
  },
  situationText: {
    fontSize: '1.05rem',
    fontWeight: 600,
    color: 'var(--ki-text, #1a1a1a)',
    lineHeight: 1.5,
    margin: 0,
  },
  questionLabel: {
    fontSize: '0.95rem',
    fontWeight: 600,
    color: 'var(--ki-text, #333)',
    textAlign: 'center',
    marginBottom: 12,
  },
  channelGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(2, 1fr)',
    gap: 10,
    marginBottom: 16,
  },
  channelCard: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
    padding: '16px 12px',
    border: '2px solid #e5e7eb',
    borderRadius: 12,
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'Instrument Sans, sans-serif',
  },
  channelIcon: { fontSize: '1.5rem' },
  channelName: { fontSize: '0.9rem', fontWeight: 600, color: 'var(--ki-text, #333)' },
  feedbackCard: {
    padding: 16,
    marginBottom: 12,
  },
  feedbackTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    margin: '0 0 6px',
  },
  feedbackText: {
    fontSize: '0.88rem',
    color: 'var(--ki-text, #555)',
    lineHeight: 1.5,
    margin: 0,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem',
  },
  quizResult: {
    marginTop: 8,
  },
  resultCard: {
    textAlign: 'center',
    padding: 24,
    marginBottom: 16,
    borderLeft: '4px solid var(--ki-red, #CC1426)',
  },
  resultScore: {
    fontSize: '2.5rem',
    fontWeight: 700,
    color: 'var(--ki-red, #CC1426)',
  },
  resultText: {
    fontSize: '1rem',
    color: '#888',
    marginBottom: 12,
  },
  resultFeedback: {
    fontSize: '0.95rem',
    color: 'var(--ki-text, #555)',
    lineHeight: 1.5,
    marginTop: 12,
  },
  completeBtn: {
    fontSize: 18,
    padding: '14px 40px',
  },
};
