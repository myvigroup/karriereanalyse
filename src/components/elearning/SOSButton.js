'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';

const SOS_STEPS = [
  { key: 'atempause', title: 'Atempause', duration: 30 },
  { key: 'triage', title: 'Triage', duration: 120 },
  { key: 'frage', title: 'Die eine Frage', duration: 30 },
  { key: 'sprint', title: '15-Min Sprint', duration: 900 },
  { key: 'reset', title: 'Abend-Reset', duration: null },
];

export default function SOSButton({ userId }) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [breathPhase, setBreathPhase] = useState('ein'); // ein | halten | aus
  const [breathTimer, setBreathTimer] = useState(30);
  const [triageText, setTriageText] = useState('');
  const [triageTimer, setTriageTimer] = useState(0);
  const [oneThingText, setOneThingText] = useState('');
  const [sprintSeconds, setSprintSeconds] = useState(900);
  const [sprintRunning, setSprintRunning] = useState(false);
  const [journalText, setJournalText] = useState('');
  const [saved, setSaved] = useState(false);

  const breathIntervalRef = useRef(null);
  const breathCountdownRef = useRef(null);
  const triageIntervalRef = useRef(null);
  const sprintIntervalRef = useRef(null);

  // Breathing animation cycle: 4s in, 4s hold, 6s out = 14s cycle
  const [breathCycleTime, setBreathCycleTime] = useState(0);

  useEffect(() => {
    if (isOpen && currentStep === 0) {
      // Start breath countdown
      setBreathTimer(30);
      breathCountdownRef.current = setInterval(() => {
        setBreathTimer(prev => {
          if (prev <= 1) {
            clearInterval(breathCountdownRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);

      // Breathing cycle animation
      let t = 0;
      breathIntervalRef.current = setInterval(() => {
        t += 0.1;
        setBreathCycleTime(t);
        const cyclePos = t % 14;
        if (cyclePos < 4) setBreathPhase('ein');
        else if (cyclePos < 8) setBreathPhase('halten');
        else setBreathPhase('aus');
      }, 100);
    }

    return () => {
      clearInterval(breathIntervalRef.current);
      clearInterval(breathCountdownRef.current);
    };
  }, [isOpen, currentStep]);

  // Triage timer (count up)
  useEffect(() => {
    if (isOpen && currentStep === 1) {
      setTriageTimer(0);
      triageIntervalRef.current = setInterval(() => {
        setTriageTimer(prev => prev + 1);
      }, 1000);
    }
    return () => clearInterval(triageIntervalRef.current);
  }, [isOpen, currentStep]);

  // Sprint timer
  useEffect(() => {
    if (sprintRunning && sprintSeconds > 0) {
      sprintIntervalRef.current = setInterval(() => {
        setSprintSeconds(prev => {
          if (prev <= 1) {
            setSprintRunning(false);
            clearInterval(sprintIntervalRef.current);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(sprintIntervalRef.current);
  }, [sprintRunning, sprintSeconds]);

  const handleOpen = () => {
    setIsOpen(true);
    setCurrentStep(0);
    setTriageText('');
    setOneThingText('');
    setSprintSeconds(900);
    setSprintRunning(false);
    setJournalText('');
    setSaved(false);
  };

  const handleClose = () => {
    setIsOpen(false);
    clearInterval(breathIntervalRef.current);
    clearInterval(breathCountdownRef.current);
    clearInterval(triageIntervalRef.current);
    clearInterval(sprintIntervalRef.current);
  };

  const goToStep = (step) => {
    clearInterval(breathIntervalRef.current);
    clearInterval(breathCountdownRef.current);
    clearInterval(triageIntervalRef.current);
    clearInterval(sprintIntervalRef.current);
    setCurrentStep(step);
  };

  const handleSaveJournal = async () => {
    // Save to localStorage
    const key = `sos_journal_${new Date().toISOString().slice(0, 10)}`;
    localStorage.setItem(key, JSON.stringify({
      triage: triageText,
      oneThing: oneThingText,
      journal: journalText,
      timestamp: new Date().toISOString(),
    }));

    // Try Supabase save
    if (userId) {
      try {
        const supabase = createClient();
        await supabase.from('lesson_progress').upsert({
          user_id: userId,
          lesson_key: 'sos_journal',
          extra_data: {
            triage: triageText,
            oneThing: oneThingText,
            journal: journalText,
            date: new Date().toISOString(),
          },
        }, { onConflict: 'user_id,lesson_key' });
      } catch (err) {
        console.warn('Supabase save failed, data is in localStorage:', err);
      }
    }
    setSaved(true);
  };

  const formatTime = (secs) => {
    const m = Math.floor(secs / 60);
    const s = secs % 60;
    return `${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
  };

  // Breathing circle scale
  const cyclePos = breathCycleTime % 14;
  let breathScale = 1;
  if (cyclePos < 4) breathScale = 1 + (cyclePos / 4) * 0.6;
  else if (cyclePos < 8) breathScale = 1.6;
  else breathScale = 1.6 - ((cyclePos - 8) / 6) * 0.6;

  // Sprint progress
  const sprintProgress = 1 - sprintSeconds / 900;
  const sprintCircumference = 2 * Math.PI * 70;

  return (
    <>
      {/* Floating SOS Button */}
      <button
        onClick={handleOpen}
        style={styles.sosButton}
        aria-label="SOS Notfall-Protokoll"
      >
        <span style={styles.sosText}>SOS</span>
        <style>{`
          @keyframes sosPulse {
            0%, 100% { box-shadow: 0 0 0 0 rgba(204, 20, 38, 0.4); }
            50% { box-shadow: 0 0 0 12px rgba(204, 20, 38, 0); }
          }
        `}</style>
      </button>

      {/* Modal */}
      {isOpen && (
        <div style={styles.overlay}>
          <div style={styles.modal}>
            {/* Close button */}
            <button onClick={handleClose} style={styles.closeBtn}>
              <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                <path d="M18 6L6 18M6 6l12 12" stroke="var(--ki-text)" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </button>

            {/* Step indicators */}
            <div style={styles.stepIndicators}>
              {SOS_STEPS.map((step, i) => (
                <button
                  key={i}
                  onClick={() => goToStep(i)}
                  style={{
                    ...styles.stepDot,
                    background: i === currentStep ? 'var(--ki-red)' : i < currentStep ? 'var(--ki-success)' : '#ddd',
                    color: i === currentStep || i < currentStep ? '#fff' : '#888',
                  }}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <p style={styles.stepTitle}>{SOS_STEPS[currentStep].title}</p>

            {/* Step 1: Atempause */}
            {currentStep === 0 && (
              <div style={styles.stepContent}>
                <div style={styles.breathContainer}>
                  <div style={{
                    ...styles.breathCircle,
                    transform: `scale(${breathScale})`,
                  }}>
                    <span style={styles.breathLabel}>
                      {breathPhase === 'ein' ? 'Einatmen' : breathPhase === 'halten' ? 'Halten' : 'Ausatmen'}
                    </span>
                  </div>
                </div>
                <p style={styles.breathInstruction}>4 Sek einatmen, 4 halten, 6 ausatmen</p>
                <p style={styles.timerDisplay}>{breathTimer}s</p>
                <button
                  className="btn btn-primary"
                  onClick={() => goToStep(1)}
                  style={{ marginTop: 20 }}
                >
                  Weiter
                </button>
              </div>
            )}

            {/* Step 2: Triage */}
            {currentStep === 1 && (
              <div style={styles.stepContent}>
                <p style={styles.stepDescription}>Schreibe alles auf, was gerade Stress verursacht:</p>
                <textarea
                  value={triageText}
                  onChange={e => setTriageText(e.target.value)}
                  style={styles.textareaFull}
                  placeholder="Was stresst dich gerade..."
                  autoFocus
                />
                <p style={styles.timerSmall}>{formatTime(triageTimer)}</p>
                <button className="btn btn-primary" onClick={() => goToStep(2)} style={{ marginTop: 12 }}>
                  Weiter
                </button>
              </div>
            )}

            {/* Step 3: Die eine Frage */}
            {currentStep === 2 && (
              <div style={styles.stepContent}>
                <p style={styles.bigQuestion}>
                  Wenn du heute NUR EINE SACHE schaffen könntest &mdash; welche?
                </p>
                <input
                  type="text"
                  value={oneThingText}
                  onChange={e => setOneThingText(e.target.value)}
                  style={styles.singleInput}
                  placeholder="Die eine Sache..."
                  autoFocus
                />
                <button
                  className="btn btn-primary"
                  onClick={() => goToStep(3)}
                  disabled={!oneThingText.trim()}
                  style={{ marginTop: 20, opacity: oneThingText.trim() ? 1 : 0.5 }}
                >
                  Weiter
                </button>
              </div>
            )}

            {/* Step 4: 15-Min Sprint */}
            {currentStep === 3 && (
              <div style={styles.stepContent}>
                <p style={styles.stepDescription}>
                  Fokus: <strong>{oneThingText || 'Deine eine Sache'}</strong>
                </p>
                <div style={styles.sprintTimerContainer}>
                  <svg width="180" height="180" viewBox="0 0 160 160">
                    <circle cx="80" cy="80" r="70" fill="none" stroke="#e0e0e0" strokeWidth="6" />
                    <circle
                      cx="80" cy="80" r="70"
                      fill="none"
                      stroke={sprintSeconds <= 60 ? 'var(--ki-red)' : 'var(--ki-success)'}
                      strokeWidth="6"
                      strokeLinecap="round"
                      strokeDasharray={sprintCircumference}
                      strokeDashoffset={sprintCircumference * (1 - sprintProgress)}
                      style={{ transition: 'stroke-dashoffset 1s linear', transform: 'rotate(-90deg)', transformOrigin: '80px 80px' }}
                    />
                    <text x="80" y="86" textAnchor="middle" style={{
                      fontSize: 28, fontWeight: 700, fill: 'var(--ki-text)', fontFamily: 'Instrument Sans, sans-serif',
                    }}>
                      {formatTime(sprintSeconds)}
                    </text>
                  </svg>
                </div>
                <div style={styles.sprintButtons}>
                  {!sprintRunning ? (
                    <button className="btn btn-primary" onClick={() => setSprintRunning(true)}>
                      {sprintSeconds === 900 ? 'Start' : 'Weiter'}
                    </button>
                  ) : (
                    <button className="btn btn-secondary" onClick={() => setSprintRunning(false)}>
                      Pause
                    </button>
                  )}
                  <button className="btn btn-secondary" onClick={() => { setSprintSeconds(900); setSprintRunning(false); }}>
                    Reset
                  </button>
                </div>
                <button
                  className="btn btn-primary"
                  onClick={() => goToStep(4)}
                  style={{ marginTop: 20 }}
                >
                  Weiter zum Abschluss
                </button>
              </div>
            )}

            {/* Step 5: Abend-Reset */}
            {currentStep === 4 && (
              <div style={styles.stepContent}>
                <p style={styles.resetQuote}>
                  &ldquo;Der Tag war chaotisch. Das ist OK.&rdquo;
                </p>
                <textarea
                  value={journalText}
                  onChange={e => setJournalText(e.target.value)}
                  style={styles.textareaFull}
                  placeholder="Wie war dein Tag? Was nimmst du mit?"
                  rows={6}
                />
                {!saved ? (
                  <button
                    className="btn btn-primary"
                    onClick={handleSaveJournal}
                    style={{ marginTop: 16 }}
                  >
                    Speichern
                  </button>
                ) : (
                  <div style={styles.savedMsg}>Gespeichert!</div>
                )}
                <button
                  className="btn btn-secondary"
                  onClick={handleClose}
                  style={{ marginTop: 12 }}
                >
                  Schließen
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </>
  );
}

const styles = {
  sosButton: {
    position: 'fixed',
    right: 24,
    bottom: 24,
    width: 64,
    height: 64,
    borderRadius: '50%',
    background: 'var(--ki-red)',
    border: 'none',
    cursor: 'pointer',
    zIndex: 1000,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    animation: 'sosPulse 2s infinite',
    boxShadow: '0 4px 20px rgba(204, 20, 38, 0.3)',
  },
  sosText: {
    color: '#fff',
    fontWeight: 800,
    fontSize: 18,
    fontFamily: 'Instrument Sans, sans-serif',
    letterSpacing: '0.05em',
  },
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    background: 'rgba(0,0,0,0.6)',
    zIndex: 1001,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 16,
  },
  modal: {
    background: 'var(--ki-bg, #fff)',
    borderRadius: 20,
    width: '100%',
    maxWidth: 480,
    maxHeight: '90vh',
    overflowY: 'auto',
    padding: 28,
    position: 'relative',
    fontFamily: 'Instrument Sans, sans-serif',
  },
  closeBtn: {
    position: 'absolute',
    top: 16,
    right: 16,
    background: 'none',
    border: 'none',
    cursor: 'pointer',
    padding: 4,
  },
  stepIndicators: {
    display: 'flex',
    justifyContent: 'center',
    gap: 10,
    marginBottom: 8,
  },
  stepDot: {
    width: 32,
    height: 32,
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    fontSize: 14,
    fontWeight: 700,
    fontFamily: 'Instrument Sans, sans-serif',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'background 0.3s',
  },
  stepTitle: {
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 700,
    color: 'var(--ki-text)',
    marginBottom: 20,
  },
  stepContent: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  stepDescription: {
    fontSize: 16,
    color: 'var(--ki-text)',
    marginBottom: 16,
    lineHeight: 1.5,
  },
  breathContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: 180,
    marginBottom: 16,
  },
  breathCircle: {
    width: 120,
    height: 120,
    borderRadius: '50%',
    background: 'linear-gradient(135deg, rgba(204,20,38,0.15), rgba(204,20,38,0.05))',
    border: '3px solid var(--ki-red)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    transition: 'transform 0.3s ease-in-out',
  },
  breathLabel: {
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--ki-red)',
  },
  breathInstruction: {
    fontSize: 14,
    color: '#888',
    marginBottom: 8,
  },
  timerDisplay: {
    fontSize: 32,
    fontWeight: 700,
    color: 'var(--ki-text)',
  },
  timerSmall: {
    fontSize: 16,
    fontWeight: 600,
    color: '#aaa',
    marginTop: 8,
  },
  textareaFull: {
    width: '100%',
    minHeight: 140,
    padding: 16,
    fontSize: 15,
    fontFamily: 'Instrument Sans, sans-serif',
    border: '2px solid #e0e0e0',
    borderRadius: 12,
    resize: 'vertical',
    outline: 'none',
    lineHeight: 1.6,
    boxSizing: 'border-box',
  },
  bigQuestion: {
    fontSize: 22,
    fontWeight: 700,
    color: 'var(--ki-text)',
    lineHeight: 1.4,
    marginBottom: 24,
    padding: '0 8px',
  },
  singleInput: {
    width: '100%',
    padding: 16,
    fontSize: 18,
    fontFamily: 'Instrument Sans, sans-serif',
    border: '2px solid var(--ki-red)',
    borderRadius: 12,
    outline: 'none',
    textAlign: 'center',
    fontWeight: 600,
    boxSizing: 'border-box',
  },
  sprintTimerContainer: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 16,
  },
  sprintButtons: {
    display: 'flex',
    gap: 12,
    justifyContent: 'center',
  },
  resetQuote: {
    fontSize: 20,
    fontStyle: 'italic',
    color: 'var(--ki-text)',
    lineHeight: 1.5,
    marginBottom: 20,
    padding: '16px 20px',
    background: 'rgba(204, 20, 38, 0.04)',
    borderRadius: 12,
    borderLeft: '4px solid var(--ki-red)',
  },
  savedMsg: {
    marginTop: 16,
    fontSize: 16,
    fontWeight: 600,
    color: 'var(--ki-success)',
  },
};
