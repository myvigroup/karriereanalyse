'use client';

import { useState } from 'react';
import { SHUTDOWN_RITUAL } from '@/lib/elearning/balance-content';

export default function ShutdownRitualBuilder({ onComplete }) {
  const schritte = SHUTDOWN_RITUAL.schritte;
  const [currentStep, setCurrentStep] = useState(0);
  const [choices, setChoices] = useState({});
  const [customTexts, setCustomTexts] = useState({});
  const [finished, setFinished] = useState(false);

  const step = schritte[currentStep];
  const isLast = currentStep === schritte.length - 1;

  function handleChoice(stepId, optionText) {
    setChoices(prev => ({ ...prev, [stepId]: optionText }));
  }

  function handleCustom(stepId, text) {
    setCustomTexts(prev => ({ ...prev, [stepId]: text }));
    setChoices(prev => ({ ...prev, [stepId]: text }));
  }

  function handleNext() {
    if (isLast) {
      setFinished(true);
    } else {
      setCurrentStep(prev => prev + 1);
    }
  }

  function handleBack() {
    if (currentStep > 0) setCurrentStep(prev => prev - 1);
  }

  const hasChoice = choices[step?.id];

  function copyRitual() {
    const text = schritte.map(s => `${s.icon} ${s.name}: ${choices[s.id] || '—'}`).join('\n');
    navigator.clipboard?.writeText(text);
  }

  if (finished) {
    return (
      <div className="card" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
          <span style={{ fontSize: 22 }}>🔐</span>
          <span style={{ fontSize: 15, fontWeight: 700 }}>Dein persoenliches Shutdown-Ritual</span>
        </div>

        <div style={{
          padding: '16px', borderRadius: 'var(--r-md)',
          background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)',
          marginBottom: 14,
        }}>
          {schritte.map(s => (
            <div key={s.id} style={{ display: 'flex', gap: 10, marginBottom: 10, alignItems: 'flex-start' }}>
              <span style={{ fontSize: 20, flexShrink: 0 }}>{s.icon}</span>
              <div>
                <div style={{ fontSize: 13, fontWeight: 600, marginBottom: 2 }}>{s.name} ({s.dauer})</div>
                <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>{choices[s.id] || '—'}</div>
              </div>
            </div>
          ))}
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={copyRitual} className="btn btn-secondary" style={{ flex: 1, fontSize: 13 }}>
            Kopieren
          </button>
          <button onClick={() => onComplete?.()} className="btn btn-primary" style={{ flex: 1 }}>
            Ritual speichern (+50 XP)
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🔐</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Shutdown-Ritual Builder</span>
      </div>

      {/* Progress */}
      <div style={{ display: 'flex', gap: 4, marginBottom: 16 }}>
        {schritte.map((s, i) => (
          <div key={s.id} style={{
            flex: 1, height: 4, borderRadius: 2,
            background: i <= currentStep ? '#8b5cf6' : 'var(--ki-border)',
            transition: 'background 0.3s',
          }} />
        ))}
      </div>

      <div style={{ marginBottom: 4, fontSize: 11, color: 'var(--ki-text-tertiary)' }}>
        Schritt {currentStep + 1} von {schritte.length}
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
        <span style={{ fontSize: 24 }}>{step.icon}</span>
        <div>
          <div style={{ fontSize: 15, fontWeight: 700 }}>{step.name}</div>
          <div style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>{step.dauer}</div>
        </div>
      </div>

      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 14, lineHeight: 1.6 }}>
        {step.anleitung}
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, marginBottom: 14 }}>
        {step.optionen.map((opt, i) => (
          <button
            key={i}
            onClick={() => handleChoice(step.id, opt)}
            style={{
              padding: '10px 14px', borderRadius: 'var(--r-sm)',
              background: choices[step.id] === opt ? 'rgba(139,92,246,0.08)' : 'var(--ki-bg-alt)',
              border: choices[step.id] === opt ? '2px solid #8b5cf6' : '1px solid var(--ki-border)',
              cursor: 'pointer', textAlign: 'left', fontSize: 13,
              transition: 'all 0.15s',
            }}
          >
            {opt}
          </button>
        ))}
        {/* Custom option */}
        <input
          className="input"
          placeholder="Oder eigene Variante..."
          value={customTexts[step.id] || ''}
          onChange={e => handleCustom(step.id, e.target.value)}
          style={{ fontSize: 13 }}
        />
      </div>

      <div style={{ display: 'flex', gap: 8 }}>
        {currentStep > 0 && (
          <button onClick={handleBack} className="btn btn-secondary" style={{ fontSize: 13 }}>
            Zurueck
          </button>
        )}
        <button
          onClick={handleNext}
          className="btn btn-primary"
          disabled={!hasChoice}
          style={{ flex: 1, opacity: hasChoice ? 1 : 0.5 }}
        >
          {isLast ? 'Ritual abschliessen' : 'Weiter'}
        </button>
      </div>
    </div>
  );
}
