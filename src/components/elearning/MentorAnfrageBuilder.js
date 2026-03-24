'use client';

import { useState } from 'react';

const STILE = [
  { id: 'respektvoll', label: 'Respektvoll', beschreibung: 'Formell, bescheiden, respektiert die Zeit', icon: '🎩' },
  { id: 'wertbasiert', label: 'Wert-zuerst', beschreibung: 'Bietet erst Wert, bittet dann', icon: '🎁' },
  { id: 'langfristig', label: 'Langfristig', beschreibung: 'Transparent, ehrlich, mit klarem Commitment', icon: '🤝' },
];

export default function MentorAnfrageBuilder({ mentorTemplates = {}, onComplete }) {
  const [step, setStep] = useState(0);
  const [mentorName, setMentorName] = useState('');
  const [askText, setAskText] = useState('');
  const [selectedStyle, setSelectedStyle] = useState(null);
  const [copied, setCopied] = useState(false);

  const handleNext = () => {
    if (step === 0 && mentorName.trim()) setStep(1);
    else if (step === 1 && askText.trim()) setStep(2);
  };

  const handleBack = () => {
    if (step > 0) setStep(step - 1);
  };

  const getGeneratedText = () => {
    if (!selectedStyle || !mentorTemplates[selectedStyle]) return '';
    let text = mentorTemplates[selectedStyle].template || '';
    text = text.replace(/\[Name\]/g, mentorName || '[Name]');
    return text;
  };

  const handleCopy = async () => {
    const text = getGeneratedText();
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const textarea = document.createElement('textarea');
      textarea.value = text;
      document.body.appendChild(textarea);
      textarea.select();
      document.execCommand('copy');
      document.body.removeChild(textarea);
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const progress = step === 0 ? 33 : step === 1 ? 66 : 100;

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>Mentor-Anfrage Builder</h2>
      <p style={styles.subtitle}>
        In 3 Schritten zur perfekten Mentor-Anfrage. Personalisiert und kopierfertig.
      </p>

      {/* Progress steps */}
      <div style={styles.stepsRow}>
        {['Wer?', 'Was?', 'Wie?'].map((label, i) => (
          <div key={i} style={styles.stepItem}>
            <div style={{
              ...styles.stepCircle,
              background: i <= step ? 'var(--ki-red, #CC1426)' : '#e0e0e0',
              color: i <= step ? '#fff' : '#999',
            }}>
              {i + 1}
            </div>
            <span style={{ ...styles.stepLabel, color: i <= step ? 'var(--ki-text, #1a1a1a)' : '#999' }}>
              {label}
            </span>
          </div>
        ))}
      </div>
      <div style={styles.progressBarOuter}>
        <div style={{ ...styles.progressBarInner, width: `${progress}%` }} />
      </div>

      {/* Step 0: Who */}
      {step === 0 && (
        <div className="card" style={styles.stepCard}>
          <h3 style={styles.stepTitle}>Schritt 1: Wer ist dein Wunsch-Mentor?</h3>
          <p style={styles.stepDesc}>
            Denke an eine konkrete Person, die dich inspiriert oder die Erfahrung hat, die du brauchst.
          </p>
          <input
            type="text"
            value={mentorName}
            onChange={(e) => setMentorName(e.target.value)}
            placeholder="Name des Mentors"
            style={styles.input}
            onKeyDown={(e) => e.key === 'Enter' && handleNext()}
          />
          <button
            className="btn btn-primary"
            onClick={handleNext}
            disabled={!mentorName.trim()}
            style={styles.nextBtn}
          >
            Weiter
          </button>
        </div>
      )}

      {/* Step 1: What */}
      {step === 1 && (
        <div className="card" style={styles.stepCard}>
          <h3 style={styles.stepTitle}>Schritt 2: Was ist dein Anliegen?</h3>
          <p style={styles.stepDesc}>
            Was genau moechtest du von {mentorName} lernen? Je konkreter, desto besser.
          </p>
          <textarea
            value={askText}
            onChange={(e) => setAskText(e.target.value)}
            placeholder="z.B. Ich moechte lernen, wie man von einer Fach- in eine Fuehrungsrolle wechselt..."
            style={styles.textarea}
            rows={4}
          />
          <div style={styles.navRow}>
            <button className="btn btn-secondary" onClick={handleBack} style={styles.backBtn}>
              Zurueck
            </button>
            <button
              className="btn btn-primary"
              onClick={handleNext}
              disabled={!askText.trim()}
              style={styles.nextBtn}
            >
              Weiter
            </button>
          </div>
        </div>
      )}

      {/* Step 2: Style selection + result */}
      {step === 2 && (
        <div>
          <div className="card" style={styles.stepCard}>
            <h3 style={styles.stepTitle}>Schritt 3: Waehle deinen Stil</h3>
            <p style={styles.stepDesc}>
              Wie moechtest du {mentorName} ansprechen?
            </p>
            <div style={styles.styleGrid}>
              {STILE.map((stil) => (
                <div
                  key={stil.id}
                  className="card"
                  style={{
                    ...styles.styleCard,
                    borderColor: selectedStyle === stil.id ? 'var(--ki-red, #CC1426)' : '#e0e0e0',
                    background: selectedStyle === stil.id ? 'rgba(204, 20, 38, 0.03)' : 'var(--ki-bg, #fff)',
                  }}
                  onClick={() => setSelectedStyle(stil.id)}
                >
                  <span style={styles.styleIcon}>{stil.icon}</span>
                  <strong style={styles.styleName}>{stil.label}</strong>
                  <span style={styles.styleDesc}>{stil.beschreibung}</span>
                </div>
              ))}
            </div>
            <button className="btn btn-secondary" onClick={handleBack} style={styles.backBtn}>
              Zurueck
            </button>
          </div>

          {/* Generated result */}
          {selectedStyle && (
            <div className="card" style={styles.resultCard}>
              <h3 style={styles.resultTitle}>Deine Mentor-Anfrage an {mentorName}</h3>
              <div style={styles.contextBox}>
                <span style={styles.contextLabel}>Dein Anliegen:</span>
                <p style={styles.contextText}>{askText}</p>
              </div>
              <pre style={styles.resultText}>{getGeneratedText()}</pre>
              <button className="btn btn-secondary" onClick={handleCopy} style={styles.copyBtn}>
                {copied ? (
                  <span style={styles.copiedText}>Kopiert!</span>
                ) : (
                  <span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" style={{ marginRight: 6, verticalAlign: 'middle' }}>
                      <rect x="9" y="9" width="13" height="13" rx="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M5 15H4a2 2 0 01-2-2V4a2 2 0 012-2h9a2 2 0 012 2v1" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Kopieren
                  </span>
                )}
              </button>

              <div style={styles.completeSection}>
                <p style={styles.completeText}>
                  Passe den Text an deine Situation an und sende ihn! Denke daran: Respekt + Konkretes Anliegen + Zeitlimit.
                </p>
                <button className="btn btn-primary" onClick={() => onComplete?.()} style={styles.completeBtn}>
                  Weiter
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

const styles = {
  container: { fontFamily: 'Instrument Sans, sans-serif', maxWidth: 640, margin: '0 auto', padding: 16 },
  title: { fontSize: 24, fontWeight: 700, color: 'var(--ki-text, #1a1a1a)', marginBottom: 8 },
  subtitle: { fontSize: 15, color: '#888', marginBottom: 16, lineHeight: 1.5 },
  stepsRow: { display: 'flex', justifyContent: 'center', gap: 32, marginBottom: 12 },
  stepItem: { display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 },
  stepCircle: {
    width: 32, height: 32, borderRadius: '50%', display: 'flex',
    alignItems: 'center', justifyContent: 'center', fontWeight: 700, fontSize: 14,
    transition: 'background 0.3s',
  },
  stepLabel: { fontSize: 12, fontWeight: 600, transition: 'color 0.3s' },
  progressBarOuter: { height: 4, background: '#e0e0e0', borderRadius: 2, marginBottom: 20, overflow: 'hidden' },
  progressBarInner: { height: '100%', background: 'var(--ki-red, #CC1426)', borderRadius: 2, transition: 'width 0.4s ease' },
  stepCard: { padding: 24, marginBottom: 20 },
  stepTitle: { fontSize: 18, fontWeight: 700, color: 'var(--ki-text, #1a1a1a)', margin: '0 0 8px', fontFamily: 'Instrument Sans, sans-serif' },
  stepDesc: { fontSize: 14, color: '#888', marginBottom: 16, lineHeight: 1.5 },
  input: {
    width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8,
    fontSize: 16, fontFamily: 'Instrument Sans, sans-serif', marginBottom: 16, outline: 'none',
    boxSizing: 'border-box', background: 'var(--ki-bg, #fff)', color: 'var(--ki-text, #1a1a1a)',
  },
  textarea: {
    width: '100%', padding: '12px 16px', border: '1px solid #ddd', borderRadius: 8,
    fontSize: 15, fontFamily: 'Instrument Sans, sans-serif', marginBottom: 16, outline: 'none',
    resize: 'vertical', boxSizing: 'border-box', background: 'var(--ki-bg, #fff)', color: 'var(--ki-text, #1a1a1a)',
  },
  navRow: { display: 'flex', gap: 10, justifyContent: 'space-between' },
  nextBtn: { padding: '10px 28px', fontSize: 15 },
  backBtn: { padding: '10px 20px', fontSize: 14 },
  styleGrid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(160px, 1fr))', gap: 12, marginBottom: 16 },
  styleCard: {
    padding: 16, textAlign: 'center', cursor: 'pointer',
    border: '2px solid', transition: 'border-color 0.2s, background 0.2s',
  },
  styleIcon: { fontSize: '2rem', display: 'block', marginBottom: 8 },
  styleName: { fontSize: 15, color: 'var(--ki-text, #1a1a1a)', display: 'block', marginBottom: 4 },
  styleDesc: { fontSize: 12, color: '#888' },
  resultCard: { padding: 20, marginBottom: 20 },
  resultTitle: { fontSize: 18, fontWeight: 700, color: 'var(--ki-text, #1a1a1a)', margin: '0 0 12px', fontFamily: 'Instrument Sans, sans-serif' },
  contextBox: {
    background: '#f8f9fa', border: '1px solid #e8e8e8', borderRadius: 8,
    padding: 12, marginBottom: 14,
  },
  contextLabel: { fontSize: 12, fontWeight: 700, color: '#888' },
  contextText: { fontSize: 14, color: 'var(--ki-text, #555)', margin: '4px 0 0', lineHeight: 1.5 },
  resultText: {
    fontFamily: 'Instrument Sans, sans-serif', fontSize: 14, lineHeight: 1.7,
    color: 'var(--ki-text, #444)', whiteSpace: 'pre-wrap', wordBreak: 'break-word',
    background: '#fafafa', border: '1px solid #e8e8e8', borderRadius: 10,
    padding: 16, margin: '0 0 14px',
  },
  copyBtn: { fontSize: 14, padding: '8px 18px', display: 'inline-flex', alignItems: 'center', marginBottom: 20 },
  copiedText: { color: 'var(--ki-success, #10B981)', fontWeight: 600 },
  completeSection: { textAlign: 'center', padding: 20, background: 'rgba(204, 20, 38, 0.03)', borderRadius: 12 },
  completeText: { fontSize: 15, color: 'var(--ki-text, #333)', marginBottom: 14, lineHeight: 1.5 },
  completeBtn: { fontSize: 18, padding: '14px 40px' },
};
