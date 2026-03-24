'use client';

import { useState, useEffect, useRef } from 'react';

const SCHRITTE = [
  { sekunde: '0-15', aktion: 'Power-Pose: Aufrecht stehen, Arme öffnen', emoji: '💪' },
  { sekunde: '15-30', aktion: 'Atmen: 4 Sek ein → 4 Sek halten → 6 Sek aus', emoji: '🫁' },
  { sekunde: '30-45', aktion: 'Lern-Frage: "Was will ich heute können?"', emoji: '❓' },
  { sekunde: '45-60', aktion: 'Timer stellen: 25 Min Pomodoro', emoji: '⏱' },
];

export default function StateManagementWidget({ onComplete }) {
  const [phase, setPhase] = useState('intro'); // intro | running | done
  const [seconds, setSeconds] = useState(0);
  const timerRef = useRef(null);

  const currentStep = SCHRITTE.findIndex(s => {
    const [start, end] = s.sekunde.split('-').map(Number);
    return seconds >= start && seconds < end;
  });

  useEffect(() => {
    if (phase === 'running') {
      timerRef.current = setInterval(() => {
        setSeconds(s => {
          if (s >= 59) {
            clearInterval(timerRef.current);
            setPhase('done');
            return 60;
          }
          return s + 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
    return () => {};
  }, [phase]);

  return (
    <div className="card" style={{ border: '1px solid rgba(139,92,246,0.2)', textAlign: 'center' }}>
      <div style={{ fontSize: 15, fontWeight: 700, marginBottom: 4 }}>⚡ 60-Sekunden State-Management</div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 20 }}>
        In 60 Sekunden von "Keine Lust" zu "Lernbereit".
      </p>

      {phase === 'intro' && (
        <div>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 20, textAlign: 'left' }}>
            {SCHRITTE.map((s, i) => (
              <div key={i} style={{ display: 'flex', gap: 10, padding: '8px 12px', borderRadius: 'var(--r-md)', background: 'var(--ki-bg-alt)' }}>
                <span style={{ fontSize: 20 }}>{s.emoji}</span>
                <div>
                  <div style={{ fontSize: 11, fontWeight: 600, color: 'var(--ki-text-tertiary)' }}>Sek {s.sekunde}</div>
                  <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>{s.aktion}</div>
                </div>
              </div>
            ))}
          </div>
          <button onClick={() => { setPhase('running'); setSeconds(0); }} className="btn btn-primary">
            60-Sek Ritual starten
          </button>
        </div>
      )}

      {phase === 'running' && (
        <div>
          <div style={{
            width: 120, height: 120, borderRadius: '50%', margin: '0 auto 16px',
            background: 'rgba(139,92,246,0.08)', border: '3px solid #8b5cf6',
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 36, fontWeight: 800, color: '#8b5cf6',
          }}>
            {60 - seconds}
          </div>
          {currentStep >= 0 && (
            <div style={{ marginBottom: 16 }}>
              <div style={{ fontSize: 28, marginBottom: 4 }}>{SCHRITTE[currentStep].emoji}</div>
              <div style={{ fontSize: 16, fontWeight: 700, color: '#8b5cf6' }}>{SCHRITTE[currentStep].aktion}</div>
            </div>
          )}
          <div style={{ height: 4, borderRadius: 2, background: 'var(--ki-bg-alt)', marginBottom: 8 }}>
            <div style={{ height: '100%', borderRadius: 2, background: '#8b5cf6', width: `${(seconds / 60) * 100}%`, transition: 'width 1s linear' }} />
          </div>
        </div>
      )}

      {phase === 'done' && (
        <div>
          <div style={{ fontSize: 48, marginBottom: 8 }}>⚡</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4, color: '#16a34a' }}>Lernbereit!</div>
          <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
            Dein Gehirn ist jetzt im Lern-Modus. Starte sofort deine Pomodoro-Session.
          </p>
          <button onClick={onComplete} className="btn btn-primary">
            ✅ Als erledigt markieren
          </button>
        </div>
      )}
    </div>
  );
}
