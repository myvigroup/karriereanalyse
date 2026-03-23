'use client';

import { useState } from 'react';
import { ZUHOER_STUFEN } from '@/lib/elearning/kommunikation-content';

const STUFEN = [
  { id: 0, label: 'Ignorieren', icon: '\u{1F6AB}', color: '#EF4444' },
  { id: 1, label: 'So-tun-als-ob', icon: '\u{1F3AD}', color: '#F59E0B' },
  { id: 2, label: 'Selektiv', icon: '\u{1F50D}', color: '#F97316' },
  { id: 3, label: 'Aufmerksam', icon: '\u{1F4A1}', color: '#3B82F6' },
  { id: 4, label: 'Empathisch', icon: '\u{2764}\u{FE0F}', color: '#10B981' },
];

const DEFAULT_SNIPPETS = [
  {
    personA: 'Ich hatte heute wirklich einen furchtbaren Tag...',
    personB: 'Mhm... hast du das Spiel gestern gesehen?',
    correct: 0,
    explanation: 'Person B ignoriert das Gesagte komplett und wechselt das Thema.',
  },
  {
    personA: 'Ich mache mir Sorgen um die Pr\u00e4sentation morgen.',
    personB: 'Ja ja, wird schon... mhm... klar...',
    correct: 1,
    explanation: 'Person B gibt nur oberfl\u00e4chliche Reaktionen, ohne wirklich zuzuh\u00f6ren.',
  },
  {
    personA: 'Im Meeting ging es um Budget, Timelines und auch um die neuen Rollen.',
    personB: 'Oh, neue Rollen? Erz\u00e4hl mehr! Was ist mit dem Budget?',
    correct: 2,
    explanation: 'Person B greift nur die interessanten Teile heraus und ignoriert den Rest.',
  },
  {
    personA: 'Ich bin unsicher, ob ich die Stelle annehmen soll.',
    personB: 'Was genau macht dich unsicher? Ist es das Gehalt oder die Aufgaben?',
    correct: 3,
    explanation: 'Person B h\u00f6rt aufmerksam zu und stellt gezielte R\u00fcckfragen.',
  },
  {
    personA: 'Seit der Umstrukturierung f\u00fchle ich mich im Team nicht mehr wohl.',
    personB: 'Das klingt so, als w\u00fcrdest du dich unsichtbar f\u00fchlen. Das muss belastend sein.',
    correct: 4,
    explanation: 'Person B versteht die Emotion dahinter und spiegelt die Gef\u00fchle empathisch wider.',
  },
];

export default function ZuhoerStufenWidget({ onComplete }) {
  const snippets = ZUHOER_STUFEN?.snippets || DEFAULT_SNIPPETS;
  const stufenInfo = ZUHOER_STUFEN?.stufen || STUFEN;

  const [phase, setPhase] = useState('intro'); // 'intro' | 'quiz' | 'done'
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selected, setSelected] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [scores, setScores] = useState([]);

  const current = snippets[currentIndex];

  const handleSelect = (stufenId) => {
    if (showFeedback) return;
    setSelected(stufenId);
    setShowFeedback(true);
    const isCorrect = stufenId === current.correct;
    setScores((prev) => [...prev, isCorrect ? 1 : 0]);
  };

  const handleNext = () => {
    if (currentIndex + 1 < snippets.length) {
      setCurrentIndex(currentIndex + 1);
      setSelected(null);
      setShowFeedback(false);
    } else {
      setPhase('done');
    }
  };

  const totalCorrect = scores.reduce((a, b) => a + b, 0);

  // Intro phase: show staircase
  if (phase === 'intro') {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Die 5 Stufen des Zuh\u00f6rens</h2>
        <p style={styles.subtext}>
          Nicht jedes Zuh\u00f6ren ist gleich. Lerne die 5 Stufen kennen &mdash; von Ignorieren bis Empathisch.
        </p>

        <div style={styles.staircase}>
          {(stufenInfo.length ? stufenInfo : STUFEN).map((stufe, i) => (
            <div key={stufe.id ?? i} style={{
              ...styles.step,
              width: `${60 + i * 10}%`,
              background: `${(stufe.color || STUFEN[i]?.color || '#888')}15`,
              borderLeft: `4px solid ${stufe.color || STUFEN[i]?.color || '#888'}`,
            }}>
              <span style={styles.stepIcon}>{stufe.icon || STUFEN[i]?.icon}</span>
              <div>
                <div style={{ ...styles.stepLabel, color: stufe.color || STUFEN[i]?.color }}>
                  Stufe {i + 1}: {stufe.label || STUFEN[i]?.label}
                </div>
                {stufe.description && (
                  <p style={styles.stepDesc}>{stufe.description}</p>
                )}
              </div>
            </div>
          ))}
        </div>

        <div style={styles.actions}>
          <button className="btn btn-primary" onClick={() => setPhase('quiz')}>
            Jetzt \u00fcben
          </button>
        </div>
      </div>
    );
  }

  // Done phase
  if (phase === 'done') {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Ergebnis</h2>
        <div className="card" style={styles.resultCard}>
          <div style={styles.resultScore}>{totalCorrect}/{snippets.length}</div>
          <p style={styles.resultText}>richtige Antworten</p>
          <div style={styles.progressBarOuter}>
            <div style={{
              ...styles.progressBarInner,
              width: `${(totalCorrect / Math.max(snippets.length, 1)) * 100}%`,
              background: totalCorrect >= 3 ? 'var(--ki-success, #10B981)' : 'var(--ki-warning, #F59E0B)',
            }} />
          </div>
          <p style={styles.feedbackSummary}>
            {totalCorrect >= 4
              ? 'Ausgezeichnet! Du erkennst die Zuh\u00f6rstufen zuverl\u00e4ssig.'
              : totalCorrect >= 3
                ? 'Gut gemacht! Mit etwas \u00dcbung erkennst du noch feinere Unterschiede.'
                : 'Schau dir die Stufen nochmal an. Die Unterschiede sind subtil!'}
          </p>
        </div>
        <div style={styles.actions}>
          <button className="btn btn-primary" onClick={() => onComplete?.({ score: totalCorrect, total: snippets.length })} style={styles.completeBtn}>
            Weiter
          </button>
        </div>
      </div>
    );
  }

  // Quiz phase
  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Welche Stufe ist das?</h2>

      <div style={styles.progressBarOuter}>
        <div style={{ ...styles.progressBarInner, width: `${(currentIndex / Math.max(snippets.length, 1)) * 100}%` }} />
      </div>
      <p style={styles.progressLabel}>{currentIndex + 1} von {snippets.length}</p>

      {/* Dialogue */}
      <div style={styles.dialogueBox}>
        <div style={styles.bubbleA}>
          <span style={styles.personLabel}>Person A</span>
          <p style={styles.bubbleText}>{current.personA}</p>
        </div>
        <div style={styles.bubbleB}>
          <span style={styles.personLabel}>Person B</span>
          <p style={styles.bubbleText}>{current.personB}</p>
        </div>
      </div>

      <p style={styles.questionText}>Auf welcher Stufe h\u00f6rt Person B zu?</p>

      {/* Stufen buttons */}
      <div style={styles.stufenBtns}>
        {STUFEN.map((stufe) => {
          const isSelected = selected === stufe.id;
          const isCorrect = stufe.id === current.correct;
          let btnStyle = { ...styles.stufenBtn };
          if (showFeedback && isCorrect) {
            btnStyle = { ...btnStyle, borderColor: '#10B981', background: '#f0fdf4' };
          } else if (showFeedback && isSelected && !isCorrect) {
            btnStyle = { ...btnStyle, borderColor: '#EF4444', background: '#fef2f2' };
          } else if (isSelected) {
            btnStyle = { ...btnStyle, borderColor: stufe.color };
          }
          return (
            <button
              key={stufe.id}
              style={btnStyle}
              onClick={() => handleSelect(stufe.id)}
              disabled={showFeedback}
            >
              <span style={styles.stufenBtnIcon}>{stufe.icon}</span>
              <span style={styles.stufenBtnLabel}>{stufe.label}</span>
            </button>
          );
        })}
      </div>

      {/* Feedback */}
      {showFeedback && (
        <div className="card" style={{
          ...styles.feedbackCard,
          borderLeft: `4px solid ${selected === current.correct ? '#10B981' : '#EF4444'}`,
        }}>
          <p style={{
            ...styles.feedbackTitle,
            color: selected === current.correct ? '#10B981' : '#EF4444',
          }}>
            {selected === current.correct ? 'Richtig!' : 'Nicht ganz.'}
          </p>
          <p style={styles.feedbackExpl}>{current.explanation}</p>
        </div>
      )}

      {showFeedback && (
        <div style={styles.actions}>
          <button className="btn btn-primary" onClick={handleNext}>
            {currentIndex + 1 < snippets.length ? 'N\u00e4chste Frage' : 'Ergebnis anzeigen'}
          </button>
        </div>
      )}

      {/* Mini staircase indicator */}
      <div style={styles.miniStairs}>
        {STUFEN.map((stufe, i) => (
          <div key={i} style={{
            ...styles.miniStep,
            background: (showFeedback && stufe.id === current.correct) ? stufe.color : `${stufe.color}30`,
            width: `${40 + i * 12}%`,
          }}>
            <span style={styles.miniStepText}>{stufe.icon} {stufe.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Instrument Sans, sans-serif',
    maxWidth: 640,
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
  staircase: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 8,
    marginBottom: 24,
  },
  step: {
    display: 'flex',
    alignItems: 'center',
    gap: 12,
    padding: '12px 16px',
    borderRadius: 8,
  },
  stepIcon: { fontSize: '1.4rem', flexShrink: 0 },
  stepLabel: {
    fontSize: '0.9rem',
    fontWeight: 700,
  },
  stepDesc: {
    fontSize: '0.8rem',
    color: 'var(--ki-text, #666)',
    margin: '2px 0 0',
    lineHeight: 1.4,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1.5rem',
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
  dialogueBox: {
    marginBottom: 20,
  },
  bubbleA: {
    background: '#f0f4ff',
    border: '1px solid #d0d8f0',
    borderRadius: '16px 16px 16px 4px',
    padding: '12px 16px',
    marginBottom: 10,
    maxWidth: '85%',
  },
  bubbleB: {
    background: '#f0fdf4',
    border: '1px solid #bbf7d0',
    borderRadius: '16px 16px 4px 16px',
    padding: '12px 16px',
    marginLeft: 'auto',
    maxWidth: '85%',
  },
  personLabel: {
    fontSize: 11,
    fontWeight: 700,
    color: '#999',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    display: 'block',
    marginBottom: 4,
  },
  bubbleText: {
    fontSize: '0.95rem',
    color: 'var(--ki-text, #333)',
    lineHeight: 1.5,
    margin: 0,
  },
  questionText: {
    fontSize: '1rem',
    fontWeight: 600,
    color: 'var(--ki-text, #333)',
    textAlign: 'center',
    marginBottom: 12,
  },
  stufenBtns: {
    display: 'flex',
    flexDirection: 'column',
    gap: 8,
    marginBottom: 16,
  },
  stufenBtn: {
    display: 'flex',
    alignItems: 'center',
    gap: 10,
    padding: '10px 16px',
    border: '2px solid #e5e7eb',
    borderRadius: 10,
    background: '#fff',
    cursor: 'pointer',
    transition: 'all 0.15s ease',
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: '0.9rem',
    textAlign: 'left',
  },
  stufenBtnIcon: { fontSize: '1.1rem' },
  stufenBtnLabel: { fontWeight: 600, color: 'var(--ki-text, #333)' },
  feedbackCard: {
    padding: 16,
    marginBottom: 8,
  },
  feedbackTitle: {
    fontSize: '1rem',
    fontWeight: 700,
    margin: '0 0 6px',
  },
  feedbackExpl: {
    fontSize: '0.88rem',
    color: 'var(--ki-text, #555)',
    lineHeight: 1.5,
    margin: 0,
  },
  miniStairs: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'flex-end',
    gap: 3,
    marginTop: 24,
    opacity: 0.6,
  },
  miniStep: {
    padding: '4px 10px',
    borderRadius: 4,
    transition: 'background 0.3s ease',
  },
  miniStepText: {
    fontSize: '0.7rem',
    color: '#fff',
    fontWeight: 600,
  },
  resultCard: {
    textAlign: 'center',
    padding: 24,
    marginBottom: 20,
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
  feedbackSummary: {
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
