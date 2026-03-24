'use client';

import { useState, useEffect, useRef } from 'react';

export default function ExecutiveAbstractorWidget({ config, onComplete }) {
  const schritte = config?.schritte || [];
  const [currentStep, setCurrentStep] = useState(-1); // -1 = intro
  const [notes, setNotes] = useState({});
  const [timeLeft, setTimeLeft] = useState(120); // 2 min per step
  const [phase, setPhase] = useState('intro'); // intro | running | summary | done
  const timerRef = useRef(null);

  useEffect(() => {
    if (phase === 'running') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            if (currentStep < schritte.length - 1) {
              setCurrentStep(c => c + 1);
              return 120;
            } else {
              setPhase('summary');
              return 0;
            }
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
    return () => {};
  }, [phase, currentStep, schritte.length]);

  function start() {
    setCurrentStep(0);
    setTimeLeft(120);
    setPhase('running');
  }

  function nextStep() {
    clearInterval(timerRef.current);
    if (currentStep < schritte.length - 1) {
      setCurrentStep(c => c + 1);
      setTimeLeft(120);
    } else {
      setPhase('summary');
    }
  }

  const step = schritte[currentStep];
  const formatTime = (s) => `${Math.floor(s / 60)}:${(s % 60).toString().padStart(2, '0')}`;

  return (
    <div className="card" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>📊</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Executive Abstractor: 100 Seiten in 10 Min</span>
      </div>

      {phase === 'intro' && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 16, lineHeight: 1.7 }}>
            Simuliere die 5-Punkte Extraktion. Pro Schritt hast du 2 Minuten.
          </p>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 6, textAlign: 'left', marginBottom: 20 }}>
            {schritte.map((s, i) => (
              <div key={i} style={{ padding: '6px 10px', borderRadius: 'var(--r-md)', background: 'var(--ki-bg-alt)', fontSize: 12, color: 'var(--ki-text-secondary)' }}>
                <strong>Min {s.minute}:</strong> {s.aktion}
              </div>
            ))}
          </div>
          <button onClick={start} className="btn btn-primary">10-Minuten Extraktion starten</button>
        </div>
      )}

      {phase === 'running' && step && (
        <div>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 12 }}>
            <span style={{ fontSize: 12, color: 'var(--ki-text-tertiary)' }}>Schritt {currentStep + 1}/{schritte.length}</span>
            <span style={{
              padding: '4px 10px', borderRadius: 12, fontSize: 13, fontWeight: 700,
              background: timeLeft < 30 ? '#dc262615' : '#8b5cf615',
              color: timeLeft < 30 ? '#dc2626' : '#8b5cf6',
            }}>
              ⏱ {formatTime(timeLeft)}
            </span>
          </div>
          <div style={{ fontSize: 16, fontWeight: 700, color: '#8b5cf6', marginBottom: 4 }}>Min {step.minute}: {step.aktion}</div>
          <p style={{ fontSize: 12, color: 'var(--ki-text-tertiary)', marginBottom: 12 }}>{step.warum}</p>
          <textarea
            className="input"
            value={notes[currentStep] || ''}
            onChange={e => setNotes(prev => ({ ...prev, [currentStep]: e.target.value }))}
            placeholder="Notizen zu diesem Schritt..."
            rows={3}
            style={{ fontSize: 13, resize: 'vertical', marginBottom: 12 }}
          />
          <button onClick={nextStep} className="btn btn-primary" style={{ fontSize: 13 }}>
            {currentStep < schritte.length - 1 ? 'Nächster Schritt →' : 'Zusammenfassung erstellen'}
          </button>
        </div>
      )}

      {phase === 'summary' && (
        <div>
          <div style={{ fontSize: 16, fontWeight: 700, marginBottom: 12 }}>📋 Deine 5-Punkte Zusammenfassung</div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 16 }}>
            {schritte.map((s, i) => (
              <div key={i} style={{ padding: '8px 12px', borderRadius: 'var(--r-md)', background: 'var(--ki-bg-alt)', fontSize: 13 }}>
                <div style={{ fontWeight: 600, color: '#8b5cf6', marginBottom: 2 }}>Min {s.minute}</div>
                <div style={{ color: 'var(--ki-text-secondary)' }}>{notes[i] || '(keine Notizen)'}</div>
              </div>
            ))}
          </div>
          <button onClick={() => { setPhase('done'); }} className="btn btn-primary">Abschließen</button>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>📊</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Executive Abstraction abgeschlossen!</div>
          <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
            Du hast gelernt, 100 Seiten in 10 Minuten zu extrahieren.
          </p>
          <button onClick={onComplete} className="btn btn-primary">✅ Als erledigt markieren (+40 XP)</button>
        </div>
      )}
    </div>
  );
}
