'use client';

import { useState } from 'react';

export default function FeynmanUebung({ onComplete }) {
  const [step, setStep] = useState(0); // 0=topic, 1=explain, 2=gaps, 3=simplify, 4=done
  const [topic, setTopic] = useState('');
  const [explanation, setExplanation] = useState('');
  const [gaps, setGaps] = useState('');
  const [simplified, setSimplified] = useState('');

  const steps = [
    { title: 'Schritt 1: Wähle ein Konzept', desc: 'Schreibe ein Konzept aus deinem Job oder Lernstoff auf das du besser verstehen willst.' },
    { title: 'Schritt 2: Erkläre es einem Kind', desc: 'Erkläre das Konzept so einfach, dass ein 10-Jähriger es verstehen würde. Keine Fachbegriffe!' },
    { title: 'Schritt 3: Finde die Lücken', desc: 'Wo bist du ins Stocken geraten? Was konntest du nicht einfach erklären? Das sind deine Wissenslücken.' },
    { title: 'Schritt 4: Vereinfache', desc: 'Gehe zurück zur Quelle, schließe die Lücken und vereinfache deine Erklärung nochmal.' },
  ];

  const current = steps[step] || steps[0];
  const texts = [topic, explanation, gaps, simplified];
  const currentText = texts[step] || '';
  const setters = [setTopic, setExplanation, setGaps, setSimplified];

  function next() {
    if (step < 3) setStep(step + 1);
    else setStep(4);
  }

  return (
    <div className="card" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🎓</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Feynman-Methode</span>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {steps.map((_, i) => (
          <div key={i} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= step ? '#8b5cf6' : 'var(--ki-bg-alt)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      {step < 4 ? (
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 4, color: '#8b5cf6' }}>{current.title}</div>
          <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
            {current.desc}
          </p>
          <textarea
            className="input"
            value={currentText}
            onChange={e => setters[step](e.target.value)}
            placeholder={step === 0 ? 'z.B. "API-Gateway", "Cashflow", "Agile Methode"...' : 'Schreibe hier...'}
            rows={step === 0 ? 2 : 5}
            style={{ resize: 'vertical', marginBottom: 12 }}
          />
          <div style={{ fontSize: 12, color: currentText.length >= 20 ? 'var(--ki-success)' : 'var(--ki-text-tertiary)', marginBottom: 12 }}>
            {currentText.length}/20 Zeichen {currentText.length >= 20 ? '✓' : '(min. 20)'}
          </div>
          <button
            onClick={next}
            className="btn btn-primary"
            disabled={currentText.length < 20}
            style={{ opacity: currentText.length >= 20 ? 1 : 0.5 }}
          >
            {step < 3 ? 'Weiter →' : 'Abschließen'}
          </button>
        </div>
      ) : (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🎓</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 8 }}>Feynman-Methode abgeschlossen!</div>
          <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 8 }}>
            Du hast "{topic}" erfolgreich mit der Feynman-Methode verarbeitet.
          </p>
          <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginBottom: 20 }}>
            Merke: Wenn du es nicht einfach erklären kannst, hast du es nicht verstanden.
          </p>
          <button onClick={onComplete} className="btn btn-primary">
            ✅ Als erledigt markieren (+40 XP)
          </button>
        </div>
      )}
    </div>
  );
}
