'use client';

import { useState, useEffect, useRef, useCallback } from 'react';

const CAREER_EXAMPLES = [
  {
    phase: 'Student',
    icon: '\u{1F393}',
    pitch: 'Viele Unternehmen suchen nach frischen Perspektiven, wissen aber nicht wo. Ich bringe als BWL-Student mit Data-Analytics-Schwerpunkt analytisches Denken und aktuelle Methoden mit. Sie bekommen jemanden, der sofort Mehrwert in Ihren Projekten schafft \u2013 mit dem Blick von morgen.',
  },
  {
    phase: 'Einsteiger',
    icon: '\u{1F680}',
    pitch: 'Teams verlieren oft Zeit durch ineffiziente Prozesse. Ich habe in meinem ersten Jahr bei [Firma] einen Reporting-Prozess automatisiert, der 10 Stunden pro Woche spart. Wenn Sie jemanden suchen, der Probleme l\u00f6st statt nur abarbeitet \u2013 lassen Sie uns sprechen.',
  },
  {
    phase: 'Professional',
    icon: '\u{1F4BC}',
    pitch: 'Viele Projekte scheitern an der Kommunikation zwischen Tech und Business. Als Product Manager \u00fcbersetze ich seit 5 Jahren zwischen beiden Welten. Meine Projekte liefern im Schnitt 20% schneller \u2013 weil alle wirklich verstehen, was gebaut wird.',
  },
  {
    phase: 'F\u00fchrungskraft',
    icon: '\u{1F451}',
    pitch: 'Transformation gelingt nur, wenn Menschen mitgenommen werden. Ich habe bei [Firma] ein 50-k\u00f6pfiges Team durch eine digitale Transformation gef\u00fchrt \u2013 mit 92% Mitarbeiterzufriedenheit. Mein Ansatz: Strategie mit Empathie verbinden.',
  },
];

const STEPS = [
  { id: 'problem', label: 'Problem', prompt: 'Welches Problem l\u00f6st du?', placeholder: 'z.B. "Viele Teams verlieren Zeit durch unklare Kommunikation..."', icon: '\u{1F3AF}' },
  { id: 'loesung', label: 'L\u00f6sung', prompt: 'Wie l\u00f6st du es?', placeholder: 'z.B. "Ich entwickle klare Kommunikationsstrukturen, die..."', icon: '\u{1F4A1}' },
  { id: 'nutzen', label: 'Nutzen', prompt: 'Was hat der Zuh\u00f6rer davon?', placeholder: 'z.B. "Sie sparen 5 Stunden pro Woche und Ihr Team..."', icon: '\u{2B50}' },
];

export default function ElevatorPitchBuilder({ onComplete }) {
  const [currentStep, setCurrentStep] = useState(0);
  const [texts, setTexts] = useState({ problem: '', loesung: '', nutzen: '' });
  const [showPreview, setShowPreview] = useState(false);
  const [timerActive, setTimerActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(60);
  const [copiedPitch, setCopiedPitch] = useState(false);
  const [showExamples, setShowExamples] = useState(false);
  const timerRef = useRef(null);

  const allFilled = texts.problem.trim() && texts.loesung.trim() && texts.nutzen.trim();
  const pitchText = `${texts.problem.trim()} ${texts.loesung.trim()} ${texts.nutzen.trim()}`;

  useEffect(() => {
    if (timerActive && timeLeft > 0) {
      timerRef.current = setTimeout(() => setTimeLeft((t) => t - 1), 1000);
      return () => clearTimeout(timerRef.current);
    }
    if (timeLeft === 0) {
      setTimerActive(false);
    }
  }, [timerActive, timeLeft]);

  const handleTextChange = (stepId, value) => {
    setTexts((prev) => ({ ...prev, [stepId]: value }));
  };

  const handleNext = () => {
    if (currentStep < 2) {
      setCurrentStep(currentStep + 1);
    } else {
      setShowPreview(true);
    }
  };

  const handleBack = () => {
    if (showPreview) {
      setShowPreview(false);
    } else if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const startTimer = () => {
    setTimeLeft(60);
    setTimerActive(true);
  };

  const stopTimer = () => {
    setTimerActive(false);
    clearTimeout(timerRef.current);
  };

  const handleCopyPitch = useCallback(async () => {
    try {
      await navigator.clipboard.writeText(pitchText);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = pitchText;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopiedPitch(true);
    setTimeout(() => setCopiedPitch(false), 2000);
  }, [pitchText]);

  const timerPercent = (timeLeft / 60) * 100;
  const timerColor = timeLeft > 20 ? 'var(--ki-success, #10B981)' : timeLeft > 10 ? 'var(--ki-warning, #F59E0B)' : 'var(--ki-red, #CC1426)';

  // Preview/done phase
  if (showPreview) {
    return (
      <div style={styles.container}>
        <h2 style={styles.heading}>Dein Elevator Pitch</h2>

        <div className="card" style={styles.pitchCard}>
          <div style={styles.pitchQuote}>&ldquo;</div>
          <p style={styles.pitchText}>{pitchText}</p>
          <div style={styles.pitchQuoteEnd}>&rdquo;</div>
        </div>

        <div style={styles.buttonRow}>
          <button
            className="btn btn-secondary"
            onClick={handleCopyPitch}
            style={styles.actionBtn}
          >
            {copiedPitch ? 'Kopiert! \u2713' : 'Pitch kopieren'}
          </button>
          <button className="btn btn-secondary" onClick={handleBack} style={styles.actionBtn}>
            Bearbeiten
          </button>
        </div>

        {/* Timer section */}
        <div style={styles.timerSection}>
          <h3 style={styles.timerTitle}>{'\u{1F3A4}'} Pitch {'\u00fc'}ben (60 Sekunden)</h3>
          <p style={styles.timerSubtext}>
            Lies deinen Pitch laut vor. Du hast 60 Sekunden – wie im echten Aufzug.
          </p>

          <div style={styles.timerRing}>
            <svg width="120" height="120" viewBox="0 0 120 120">
              <circle cx="60" cy="60" r="54" fill="none" stroke="#e0e0e0" strokeWidth="6" />
              <circle
                cx="60" cy="60" r="54"
                fill="none"
                stroke={timerColor}
                strokeWidth="6"
                strokeLinecap="round"
                strokeDasharray={`${(timerPercent / 100) * 339.3} 339.3`}
                transform="rotate(-90 60 60)"
                style={{ transition: 'stroke-dasharray 1s linear, stroke 0.3s' }}
              />
              <text x="60" y="65" textAnchor="middle" fontSize="28" fontWeight="700" fill={timerColor}>
                {timeLeft}
              </text>
            </svg>
          </div>

          <div style={styles.buttonRow}>
            {!timerActive ? (
              <button className="btn btn-primary" onClick={startTimer} style={styles.actionBtn}>
                {timeLeft < 60 ? 'Nochmal' : 'Start'}
              </button>
            ) : (
              <button className="btn btn-secondary" onClick={stopTimer} style={styles.actionBtn}>
                Stopp
              </button>
            )}
          </div>
        </div>

        <div style={styles.actions}>
          <button className="btn btn-primary" onClick={() => onComplete?.({ pitch: pitchText })} style={styles.completeBtn}>
            Abschließen
          </button>
        </div>
      </div>
    );
  }

  // Builder steps
  const step = STEPS[currentStep];
  const stepValue = texts[step.id];

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Elevator Pitch Builder</h2>
      <p style={styles.subtext}>
        Baue deinen perfekten 60-Sekunden-Pitch in 3 Schritten.
      </p>

      {/* Step indicator */}
      <div style={styles.stepIndicator}>
        {STEPS.map((s, i) => (
          <div key={s.id} style={styles.stepDot}>
            <div style={{
              ...styles.dot,
              background: i <= currentStep ? 'var(--ki-red, #CC1426)' : '#e0e0e0',
              color: i <= currentStep ? '#fff' : '#999',
            }}>
              {s.icon}
            </div>
            <span style={{
              ...styles.dotLabel,
              fontWeight: i === currentStep ? 700 : 400,
              color: i === currentStep ? 'var(--ki-text, #333)' : '#aaa',
            }}>
              {s.label}
            </span>
          </div>
        ))}
      </div>

      {/* Current step */}
      <div className="card" style={styles.stepCard}>
        <h3 style={styles.stepTitle}>
          <span style={styles.stepNum}>Schritt {currentStep + 1}</span>
          {step.prompt}
        </h3>
        <textarea
          style={styles.textarea}
          placeholder={step.placeholder}
          value={stepValue}
          onChange={(e) => handleTextChange(step.id, e.target.value)}
          rows={4}
        />
        <p style={styles.charCount}>{stepValue.length} Zeichen</p>
      </div>

      {/* Examples toggle */}
      <button
        className="btn btn-secondary"
        style={styles.exampleToggle}
        onClick={() => setShowExamples(!showExamples)}
      >
        {showExamples ? 'Beispiele ausblenden' : '\u{1F4A1} Beispiele zur Inspiration'}
      </button>

      {showExamples && (
        <div style={styles.examplesGrid}>
          {CAREER_EXAMPLES.map((ex, i) => (
            <div key={i} className="card" style={styles.exampleCard}>
              <div style={styles.exampleHeader}>
                <span>{ex.icon}</span>
                <strong>{ex.phase}</strong>
              </div>
              <p style={styles.exampleText}>{ex.pitch}</p>
            </div>
          ))}
        </div>
      )}

      {/* Navigation */}
      <div style={styles.navRow}>
        {currentStep > 0 && (
          <button className="btn btn-secondary" onClick={handleBack}>
            Zurück
          </button>
        )}
        <button
          className="btn btn-primary"
          onClick={handleNext}
          disabled={!stepValue.trim()}
          style={{ opacity: stepValue.trim() ? 1 : 0.5 }}
        >
          {currentStep < 2 ? 'Weiter' : 'Pitch ansehen'}
        </button>
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
  stepIndicator: {
    display: 'flex',
    justifyContent: 'center',
    gap: 32,
    marginBottom: 24,
  },
  stepDot: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 40,
    height: 40,
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '1.1rem',
    transition: 'all 0.3s ease',
  },
  dotLabel: {
    fontSize: 12,
    transition: 'all 0.2s',
  },
  stepCard: {
    padding: 20,
    borderLeft: '4px solid var(--ki-red, #CC1426)',
    marginBottom: 20,
  },
  stepTitle: {
    fontSize: '1.1rem',
    fontWeight: 600,
    color: 'var(--ki-text, #1a1a1a)',
    margin: '0 0 12px',
    lineHeight: 1.4,
  },
  stepNum: {
    display: 'block',
    fontSize: 12,
    fontWeight: 700,
    color: 'var(--ki-red, #CC1426)',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    marginBottom: 4,
  },
  textarea: {
    width: '100%',
    padding: 14,
    border: '2px solid #e5e7eb',
    borderRadius: 10,
    fontSize: 15,
    fontFamily: 'Instrument Sans, sans-serif',
    lineHeight: 1.6,
    resize: 'vertical',
    color: 'var(--ki-text, #333)',
    background: '#fafafa',
    boxSizing: 'border-box',
    outline: 'none',
    transition: 'border-color 0.2s',
  },
  charCount: {
    fontSize: 12,
    color: '#aaa',
    textAlign: 'right',
    margin: '6px 0 0',
  },
  exampleToggle: {
    fontSize: 14,
    padding: '8px 16px',
    marginBottom: 16,
    display: 'block',
    width: '100%',
  },
  examplesGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))',
    gap: 12,
    marginBottom: 20,
  },
  exampleCard: {
    padding: 14,
    borderLeft: '3px solid #e5e7eb',
  },
  exampleHeader: {
    display: 'flex',
    alignItems: 'center',
    gap: 6,
    fontSize: 14,
    marginBottom: 8,
    color: 'var(--ki-text, #333)',
  },
  exampleText: {
    fontSize: 13,
    color: 'var(--ki-text, #555)',
    lineHeight: 1.5,
    margin: 0,
    fontStyle: 'italic',
  },
  navRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: 8,
  },
  pitchCard: {
    padding: 28,
    textAlign: 'center',
    borderLeft: '4px solid var(--ki-red, #CC1426)',
    marginBottom: 20,
    position: 'relative',
  },
  pitchQuote: {
    fontSize: '3rem',
    color: 'var(--ki-red, #CC1426)',
    lineHeight: 1,
    opacity: 0.3,
  },
  pitchText: {
    fontSize: '1.1rem',
    color: 'var(--ki-text, #1a1a1a)',
    lineHeight: 1.7,
    margin: '8px 0',
    fontStyle: 'italic',
  },
  pitchQuoteEnd: {
    fontSize: '3rem',
    color: 'var(--ki-red, #CC1426)',
    lineHeight: 1,
    opacity: 0.3,
  },
  buttonRow: {
    display: 'flex',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 24,
  },
  actionBtn: {
    fontSize: 14,
    padding: '8px 20px',
  },
  timerSection: {
    textAlign: 'center',
    padding: 24,
    background: '#fafafa',
    borderRadius: 16,
    marginBottom: 24,
  },
  timerTitle: {
    fontSize: '1.1rem',
    fontWeight: 700,
    color: 'var(--ki-text, #1a1a1a)',
    margin: '0 0 6px',
  },
  timerSubtext: {
    fontSize: '0.85rem',
    color: '#888',
    marginBottom: 16,
  },
  timerRing: {
    display: 'flex',
    justifyContent: 'center',
    marginBottom: 16,
  },
  actions: {
    display: 'flex',
    justifyContent: 'center',
    gap: '1rem',
    marginTop: '1rem',
  },
  completeBtn: {
    fontSize: 18,
    padding: '14px 40px',
  },
};
