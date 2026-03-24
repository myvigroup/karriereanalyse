'use client';

import { useState, useEffect, useRef } from 'react';

export default function SyntheseTrainerWidget({ config, onComplete }) {
  const uebungen = config?.uebungen || [];
  const timerDauer = config?.timer || 60;
  const [currentIdx, setCurrentIdx] = useState(0);
  const [phase, setPhase] = useState('intro'); // intro | thinking | answer | done
  const [timeLeft, setTimeLeft] = useState(timerDauer);
  const [answer, setAnswer] = useState('');
  const [answers, setAnswers] = useState([]);
  const timerRef = useRef(null);

  const current = uebungen[currentIdx];

  useEffect(() => {
    if (phase === 'thinking') {
      timerRef.current = setInterval(() => {
        setTimeLeft(t => {
          if (t <= 1) {
            clearInterval(timerRef.current);
            setPhase('answer');
            return 0;
          }
          return t - 1;
        });
      }, 1000);
      return () => clearInterval(timerRef.current);
    }
    return () => {};
  }, [phase]);

  function startRound() {
    setTimeLeft(timerDauer);
    setAnswer('');
    setPhase('thinking');
  }

  function submitAnswer() {
    setAnswers(prev => [...prev, { branchen: current?.branchen, answer, hint: current?.hint }]);
    if (currentIdx + 1 < uebungen.length) {
      setCurrentIdx(c => c + 1);
      setPhase('intro');
    } else {
      setPhase('done');
    }
  }

  return (
    <div className="card" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🔗</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>The Dot Connector: Synthese-Training</span>
      </div>

      {phase === 'intro' && current && (
        <div style={{ textAlign: 'center', padding: '16px 0' }}>
          <p style={{ fontSize: 14, color: 'var(--ki-text-secondary)', marginBottom: 16, lineHeight: 1.7 }}>
            Verbinde 2 scheinbar unverwandte Branchen in 60 Sekunden zu einer Synergie-Idee.
          </p>
          <div style={{ display: 'flex', justifyContent: 'center', gap: 16, marginBottom: 20 }}>
            {current.branchen.map((b, i) => (
              <div key={i} style={{
                padding: '12px 20px', borderRadius: 'var(--r-md)',
                background: 'rgba(139,92,246,0.08)', border: '1px solid rgba(139,92,246,0.2)',
                fontSize: 16, fontWeight: 700, color: '#8b5cf6',
              }}>
                {b}
              </div>
            ))}
          </div>
          <div style={{ fontSize: 20, marginBottom: 16 }}>+</div>
          <button onClick={startRound} className="btn btn-primary">
            60 Sekunden — Los! (Runde {currentIdx + 1}/{uebungen.length})
          </button>
        </div>
      )}

      {phase === 'thinking' && current && (
        <div style={{ textAlign: 'center' }}>
          <div style={{
            width: 80, height: 80, borderRadius: '50%', margin: '0 auto 16px',
            background: timeLeft < 15 ? '#dc262615' : '#8b5cf615',
            border: `3px solid ${timeLeft < 15 ? '#dc2626' : '#8b5cf6'}`,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            fontSize: 28, fontWeight: 800, color: timeLeft < 15 ? '#dc2626' : '#8b5cf6',
          }}>
            {timeLeft}
          </div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>
            {current.branchen.join(' + ')} = ?
          </div>
          <textarea
            className="input"
            value={answer}
            onChange={e => setAnswer(e.target.value)}
            placeholder="Deine Synergie-Idee..."
            rows={3}
            autoFocus
            style={{ fontSize: 14, resize: 'vertical' }}
          />
        </div>
      )}

      {phase === 'answer' && current && (
        <div>
          <div style={{ fontSize: 14, fontWeight: 700, marginBottom: 8 }}>Deine Antwort:</div>
          <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'var(--ki-bg-alt)', marginBottom: 12, fontSize: 14, color: 'var(--ki-text-secondary)' }}>
            {answer || '(keine Antwort)'}
          </div>
          {current.hint && (
            <div style={{ padding: '10px 14px', borderRadius: 'var(--r-md)', background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)', marginBottom: 12, fontSize: 13 }}>
              <strong style={{ color: '#8b5cf6' }}>Mögliche Synergie:</strong> {current.hint}
            </div>
          )}
          <button onClick={submitAnswer} className="btn btn-primary">
            {currentIdx + 1 < uebungen.length ? 'Nächste Runde →' : 'Abschließen'}
          </button>
        </div>
      )}

      {phase === 'done' && (
        <div style={{ textAlign: 'center' }}>
          <div style={{ fontSize: 48, marginBottom: 8 }}>🔗</div>
          <div style={{ fontSize: 18, fontWeight: 700, marginBottom: 4 }}>Synthese-Training abgeschlossen!</div>
          <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16 }}>
            Du hast {uebungen.length} Branchen-Synergien in je 60 Sekunden formuliert.
          </p>
          <button onClick={onComplete} className="btn btn-primary">✅ Als erledigt markieren (+40 XP)</button>
        </div>
      )}
    </div>
  );
}
