'use client';

import { useState, useEffect, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import { ABSCHLUSSTEST } from '@/lib/elearning/prioritaeten-content';

const PASS_THRESHOLD = 7;
const XP_REWARD = 500;

export default function AbschlussTestWidget({ onComplete, userId, overrideQuestions }) {
  const [phase, setPhase] = useState('intro'); // intro | quiz | result
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const [answers, setAnswers] = useState([]);
  const [score, setScore] = useState(0);
  const [certNumber, setCertNumber] = useState('');
  const [xpAwarded, setXpAwarded] = useState(false);

  const questions = overrideQuestions || ABSCHLUSSTEST || [];
  const totalQuestions = questions.length;

  const generateCertNumber = () => {
    const rand = Math.floor(10000 + Math.random() * 90000);
    return `KI-2026-${rand}`;
  };

  const handleStartQuiz = () => {
    setPhase('quiz');
    setCurrentQ(0);
    setAnswers([]);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setXpAwarded(false);
  };

  const handleSelectAnswer = (answerIndex) => {
    if (showFeedback) return;

    const question = questions[currentQ];
    const isCorrect = answerIndex === question.correct;

    setSelectedAnswer(answerIndex);
    setShowFeedback(true);

    const newAnswers = [...answers, { questionIndex: currentQ, selected: answerIndex, correct: isCorrect }];
    setAnswers(newAnswers);

    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);

    // Auto-advance after 1.5 seconds
    setTimeout(() => {
      if (currentQ + 1 < totalQuestions) {
        setCurrentQ(currentQ + 1);
        setSelectedAnswer(null);
        setShowFeedback(false);
      } else {
        // Quiz finished
        setPhase('result');
        setCertNumber(generateCertNumber());
        if (newScore >= PASS_THRESHOLD) {
          awardXP(newScore);
        }
      }
    }, 1500);
  };

  const awardXP = async (finalScore) => {
    if (!userId || xpAwarded) return;
    try {
      const supabase = createClient();
      // Get current points
      const { data: profile } = await supabase
        .from('profiles')
        .select('total_points')
        .eq('id', userId)
        .single();

      if (profile) {
        await supabase
          .from('profiles')
          .update({ total_points: (profile.total_points || 0) + XP_REWARD })
          .eq('id', userId);
      }
      setXpAwarded(true);
    } catch (err) {
      console.warn('XP award failed:', err);
    }
  };

  const passed = score >= PASS_THRESHOLD;

  // --- Intro ---
  if (phase === 'intro') {
    return (
      <div style={styles.container}>
        <div className="card" style={styles.introCard}>
          <div style={styles.introIcon}>
            <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
              <path d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2" stroke="var(--ki-red)" strokeWidth="2"/>
              <rect x="9" y="3" width="6" height="4" rx="1" stroke="var(--ki-red)" strokeWidth="2"/>
              <path d="M9 12l2 2 4-4" stroke="var(--ki-red)" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
            </svg>
          </div>
          <h2 style={styles.title}>Abschlusstest</h2>
          <p style={styles.introText}>
            10 Fragen. Du brauchst mindestens <strong>{PASS_THRESHOLD}/10</strong> zum Bestehen.
          </p>
          <p style={styles.introSubtext}>Bei Bestehen erhältst du +{XP_REWARD} XP und dein Zertifikat.</p>
          <button className="btn btn-primary" onClick={handleStartQuiz} style={styles.startBtn}>
            Test starten
          </button>
        </div>
      </div>
    );
  }

  // --- Quiz ---
  if (phase === 'quiz' && questions[currentQ]) {
    const question = questions[currentQ];
    const progressPercent = ((currentQ + 1) / totalQuestions) * 100;

    return (
      <div style={styles.container}>
        {/* Progress bar */}
        <div style={styles.progressHeader}>
          <span style={styles.progressLabel}>{currentQ + 1} / {totalQuestions}</span>
          <div style={styles.progressBar}>
            <div style={{ ...styles.progressFill, width: `${progressPercent}%` }} />
          </div>
        </div>

        {/* Question */}
        <div className="card" style={styles.questionCard}>
          <h3 style={styles.questionText}>{question.frage}</h3>

          <div style={styles.optionsList}>
            {question.optionen.map((option, i) => {
              let optionStyle = { ...styles.optionCard };

              if (showFeedback) {
                if (i === question.correct) {
                  optionStyle = { ...optionStyle, ...styles.optionCorrect };
                } else if (i === selectedAnswer && i !== question.correct) {
                  optionStyle = { ...optionStyle, ...styles.optionWrong };
                } else {
                  optionStyle = { ...optionStyle, opacity: 0.5 };
                }
              } else if (selectedAnswer === i) {
                optionStyle = { ...optionStyle, ...styles.optionSelected };
              }

              return (
                <button
                  key={i}
                  style={optionStyle}
                  onClick={() => handleSelectAnswer(i)}
                  disabled={showFeedback}
                >
                  <span style={styles.optionLetter}>
                    {String.fromCharCode(65 + i)}
                  </span>
                  <span style={styles.optionText}>{option}</span>
                </button>
              );
            })}
          </div>

          {showFeedback && question.erklaerung && (
            <div style={styles.explanationBox}>
              <p style={styles.explanationText}>{question.erklaerung}</p>
            </div>
          )}
        </div>
      </div>
    );
  }

  // --- Results ---
  if (phase === 'result') {
    return (
      <div style={styles.container}>
        {/* Confetti for passing */}
        {passed && <Confetti />}

        <div className="card" style={styles.resultCard}>
          {passed ? (
            <>
              <h2 style={styles.passTitle}>Bestanden!</h2>
              <div style={styles.scoreCircle}>
                <span style={styles.scoreNumber}>{score}</span>
                <span style={styles.scoreDenom}>/ {totalQuestions}</span>
              </div>

              <div style={styles.badgeContainer}>
                <div style={styles.badge}>
                  <svg width="28" height="28" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" fill="var(--ki-red)"/>
                  </svg>
                  <span style={styles.badgeText}>Priority Architect</span>
                </div>
              </div>

              <div style={styles.xpBanner}>+{XP_REWARD} XP</div>

              {/* Certificate */}
              <div style={styles.certificate}>
                <div style={styles.certBorder}>
                  <p style={styles.certIssuer}>Das Karriere-Institut</p>
                  <h3 style={styles.certTitle}>Zertifikat</h3>
                  <p style={styles.certSubtitle}>Prioritätenmanagement</p>
                  <div style={styles.certDivider} />
                  <p style={styles.certScore}>Ergebnis: {score}/{totalQuestions}</p>
                  <p style={styles.certDate}>Datum: {new Date().toLocaleDateString('de-DE')}</p>
                  <p style={styles.certNumber}>Zertifikats-Nr: {certNumber}</p>
                  <p style={styles.certIssuerSmall}>Ausgestellt von Das Karriere-Institut</p>
                </div>
              </div>

              <button
                className="btn btn-secondary"
                onClick={() => alert('Zertifikat-Download wird in Kürze verfügbar sein.')}
                style={{ marginTop: 16, width: '100%' }}
              >
                Zertifikat herunterladen
              </button>

              <button
                className="btn btn-primary"
                onClick={() => onComplete?.({ score, passed: true, certNumber })}
                style={{ marginTop: 12, width: '100%' }}
              >
                Abschließen
              </button>
            </>
          ) : (
            <>
              <h2 style={styles.failTitle}>Nicht bestanden</h2>
              <div style={styles.scoreCircle}>
                <span style={{ ...styles.scoreNumber, color: 'var(--ki-red)' }}>{score}</span>
                <span style={styles.scoreDenom}>/ {totalQuestions}</span>
              </div>
              <p style={styles.failText}>
                Du brauchst mindestens {PASS_THRESHOLD} richtige Antworten. Versuche es nochmal!
              </p>

              <div style={styles.wrongAnswers}>
                <h4 style={styles.wrongTitle}>Falsche Antworten:</h4>
                {answers.filter(a => !a.correct).map((a, i) => {
                  const q = questions[a.questionIndex];
                  return (
                    <div key={i} style={styles.wrongItem}>
                      <p style={styles.wrongQuestion}>{q.frage}</p>
                      <p style={styles.wrongAnswer}>
                        Deine Antwort: <span style={{ color: 'var(--ki-red)' }}>{q.optionen[a.selected]}</span>
                      </p>
                      <p style={styles.correctAnswer}>
                        Richtig: <span style={{ color: 'var(--ki-success)' }}>{q.optionen[q.correct]}</span>
                      </p>
                    </div>
                  );
                })}
              </div>

              <button
                className="btn btn-primary"
                onClick={handleStartQuiz}
                style={{ marginTop: 20, width: '100%' }}
              >
                Nochmal versuchen
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return null;
}

// Confetti component
function Confetti() {
  const colors = ['#CC1426', '#FFD700', '#4CAF50', '#2196F3', '#FF9800', '#9C27B0'];
  const pieces = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    left: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 2,
    color: colors[i % colors.length],
    size: 6 + Math.random() * 6,
    rotation: Math.random() * 360,
  }));

  return (
    <div style={styles.confettiContainer}>
      <style>{`
        @keyframes confettiFall {
          0% { transform: translateY(-20px) rotate(0deg); opacity: 1; }
          100% { transform: translateY(100vh) rotate(720deg); opacity: 0; }
        }
      `}</style>
      {pieces.map(p => (
        <div
          key={p.id}
          style={{
            position: 'absolute',
            left: `${p.left}%`,
            top: -10,
            width: p.size,
            height: p.size,
            background: p.color,
            borderRadius: p.size > 9 ? '50%' : '2px',
            animation: `confettiFall ${p.duration}s ease-out ${p.delay}s forwards`,
          }}
        />
      ))}
    </div>
  );
}

const styles = {
  container: {
    fontFamily: 'Instrument Sans, sans-serif',
    maxWidth: 640,
    margin: '0 auto',
    padding: 16,
    position: 'relative',
  },
  introCard: {
    textAlign: 'center',
    padding: 32,
  },
  introIcon: {
    marginBottom: 16,
  },
  title: {
    fontSize: 26,
    fontWeight: 700,
    color: 'var(--ki-text)',
    marginBottom: 12,
    fontFamily: 'Instrument Sans, sans-serif',
  },
  introText: {
    fontSize: 18,
    color: 'var(--ki-text)',
    lineHeight: 1.6,
    marginBottom: 8,
  },
  introSubtext: {
    fontSize: 14,
    color: '#888',
    marginBottom: 24,
  },
  startBtn: {
    fontSize: 18,
    padding: '14px 40px',
  },
  progressHeader: {
    marginBottom: 20,
  },
  progressLabel: {
    fontSize: 14,
    fontWeight: 600,
    color: '#888',
    display: 'block',
    marginBottom: 6,
  },
  progressBar: {
    height: 6,
    background: '#e0e0e0',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    background: 'var(--ki-red)',
    borderRadius: 3,
    transition: 'width 0.4s ease',
  },
  questionCard: {
    padding: 24,
  },
  questionText: {
    fontSize: 19,
    fontWeight: 600,
    color: 'var(--ki-text)',
    lineHeight: 1.5,
    marginBottom: 24,
    fontFamily: 'Instrument Sans, sans-serif',
  },
  optionsList: {
    display: 'flex',
    flexDirection: 'column',
    gap: 10,
  },
  optionCard: {
    display: 'flex',
    alignItems: 'center',
    gap: 14,
    padding: '14px 18px',
    border: '2px solid #e0e0e0',
    borderRadius: 12,
    background: 'var(--ki-bg, #fff)',
    cursor: 'pointer',
    transition: 'all 0.2s',
    textAlign: 'left',
    fontFamily: 'Instrument Sans, sans-serif',
    fontSize: 15,
    width: '100%',
    boxSizing: 'border-box',
  },
  optionSelected: {
    borderColor: 'var(--ki-red)',
    background: 'rgba(204, 20, 38, 0.04)',
  },
  optionCorrect: {
    borderColor: 'var(--ki-success)',
    background: 'rgba(76, 175, 80, 0.08)',
  },
  optionWrong: {
    borderColor: 'var(--ki-red)',
    background: 'rgba(204, 20, 38, 0.08)',
  },
  optionLetter: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    background: '#f0f0f0',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: 14,
    color: 'var(--ki-text)',
    flexShrink: 0,
  },
  optionText: {
    color: 'var(--ki-text)',
    lineHeight: 1.4,
  },
  explanationBox: {
    marginTop: 16,
    padding: 14,
    background: 'rgba(0,0,0,0.03)',
    borderRadius: 10,
    borderLeft: '3px solid var(--ki-red)',
  },
  explanationText: {
    fontSize: 14,
    color: 'var(--ki-text)',
    lineHeight: 1.5,
    margin: 0,
  },
  resultCard: {
    textAlign: 'center',
    padding: 28,
  },
  passTitle: {
    fontSize: 32,
    fontWeight: 800,
    color: 'var(--ki-success)',
    marginBottom: 16,
    fontFamily: 'Instrument Sans, sans-serif',
  },
  failTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: 'var(--ki-red)',
    marginBottom: 16,
    fontFamily: 'Instrument Sans, sans-serif',
  },
  scoreCircle: {
    display: 'flex',
    alignItems: 'baseline',
    justifyContent: 'center',
    gap: 4,
    marginBottom: 20,
  },
  scoreNumber: {
    fontSize: 56,
    fontWeight: 800,
    color: 'var(--ki-success)',
    lineHeight: 1,
  },
  scoreDenom: {
    fontSize: 22,
    fontWeight: 600,
    color: '#aaa',
  },
  badgeContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 16,
  },
  badge: {
    display: 'inline-flex',
    alignItems: 'center',
    gap: 8,
    padding: '10px 20px',
    background: 'rgba(204, 20, 38, 0.06)',
    borderRadius: 100,
    border: '2px solid var(--ki-red)',
  },
  badgeText: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--ki-red)',
  },
  xpBanner: {
    fontSize: 24,
    fontWeight: 800,
    color: 'var(--ki-warning)',
    marginBottom: 24,
  },
  certificate: {
    marginTop: 8,
    marginBottom: 8,
  },
  certBorder: {
    border: '3px solid var(--ki-red)',
    borderRadius: 16,
    padding: 28,
    background: 'linear-gradient(135deg, rgba(204,20,38,0.02), rgba(204,20,38,0.06))',
  },
  certIssuer: {
    fontSize: 12,
    color: '#aaa',
    textTransform: 'uppercase',
    letterSpacing: '0.1em',
    marginBottom: 4,
  },
  certTitle: {
    fontSize: 28,
    fontWeight: 800,
    color: 'var(--ki-text)',
    marginBottom: 4,
    fontFamily: 'Instrument Sans, sans-serif',
  },
  certSubtitle: {
    fontSize: 16,
    color: 'var(--ki-red)',
    fontWeight: 600,
    marginBottom: 16,
  },
  certDivider: {
    height: 2,
    background: 'var(--ki-red)',
    opacity: 0.2,
    marginBottom: 16,
    borderRadius: 1,
  },
  certScore: {
    fontSize: 15,
    color: 'var(--ki-text)',
    marginBottom: 4,
  },
  certDate: {
    fontSize: 14,
    color: '#888',
    marginBottom: 4,
  },
  certNumber: {
    fontSize: 13,
    color: '#aaa',
    fontFamily: 'monospace',
    marginBottom: 12,
  },
  certIssuerSmall: {
    fontSize: 12,
    color: '#aaa',
    fontStyle: 'italic',
  },
  failText: {
    fontSize: 16,
    color: 'var(--ki-text)',
    lineHeight: 1.5,
    marginBottom: 20,
  },
  wrongAnswers: {
    textAlign: 'left',
    marginTop: 16,
  },
  wrongTitle: {
    fontSize: 16,
    fontWeight: 700,
    color: 'var(--ki-text)',
    marginBottom: 12,
    fontFamily: 'Instrument Sans, sans-serif',
  },
  wrongItem: {
    padding: 14,
    background: 'rgba(0,0,0,0.02)',
    borderRadius: 10,
    marginBottom: 10,
    borderLeft: '3px solid var(--ki-red)',
  },
  wrongQuestion: {
    fontSize: 14,
    fontWeight: 600,
    color: 'var(--ki-text)',
    marginBottom: 6,
    lineHeight: 1.4,
  },
  wrongAnswer: {
    fontSize: 13,
    color: 'var(--ki-text)',
    marginBottom: 2,
  },
  correctAnswer: {
    fontSize: 13,
    color: 'var(--ki-text)',
  },
  confettiContainer: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    pointerEvents: 'none',
    zIndex: 999,
    overflow: 'hidden',
  },
};
