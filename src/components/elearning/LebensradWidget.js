'use client';

import { useState } from 'react';

const BEREICHE = [
  { id: 'karriere', label: 'Karriere', icon: '💼', farbe: '#3b82f6' },
  { id: 'gesundheit', label: 'Gesundheit', icon: '💪', farbe: '#22c55e' },
  { id: 'beziehungen', label: 'Beziehungen', icon: '❤️', farbe: '#ef4444' },
  { id: 'wachstum', label: 'Persoenliches Wachstum', icon: '🌱', farbe: '#f59e0b' },
];

function getInterpretation(scores) {
  const values = Object.values(scores);
  if (values.length < 4) return null;
  const avg = values.reduce((a, b) => a + b, 0) / values.length;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const diff = max - min;

  if (diff <= 2 && avg >= 7) return { text: 'Dein Lebensrad ist gut ausbalanciert! Alle Bereiche sind auf einem hohen Niveau. Halte das!', farbe: '#22c55e' };
  if (diff <= 2 && avg >= 4) return { text: 'Dein Lebensrad ist relativ ausgeglichen, aber auf mittlerem Niveau. Es gibt Potenzial in allen Bereichen.', farbe: '#f59e0b' };
  if (diff <= 2) return { text: 'Dein Lebensrad ist gleichmaessig niedrig. Starte mit kleinen Verbesserungen in jedem Bereich.', farbe: '#ef4444' };
  const schwach = BEREICHE.find(b => scores[b.id] === min);
  return { text: `Dein Lebensrad zeigt ein Ungleichgewicht. Der Bereich "${schwach?.label}" braucht mehr Aufmerksamkeit (${min}/10). Fokussiere dich hier zuerst.`, farbe: '#f59e0b' };
}

export default function LebensradWidget({ onComplete }) {
  const [scores, setScores] = useState({});
  const [submitted, setSubmitted] = useState(false);

  const allFilled = BEREICHE.every(b => scores[b.id] !== undefined);

  function handleChange(id, val) {
    if (submitted) return;
    setScores(prev => ({ ...prev, [id]: Number(val) }));
  }

  function handleSubmit() {
    setSubmitted(true);
  }

  const interpretation = submitted ? getInterpretation(scores) : null;
  const maxVal = 10;

  return (
    <div className="card" style={{ border: '1px solid rgba(59,130,246,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🎡</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Dein Lebensrad</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 20, lineHeight: 1.6 }}>
        Bewerte jeden Lebensbereich von 1 (sehr unzufrieden) bis 10 (voellig zufrieden).
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
        {BEREICHE.map(b => (
          <div key={b.id}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
              <span style={{ fontSize: 18 }}>{b.icon}</span>
              <span style={{ fontSize: 14, fontWeight: 600 }}>{b.label}</span>
              <span style={{ fontSize: 13, color: b.farbe, fontWeight: 700, marginLeft: 'auto' }}>
                {scores[b.id] !== undefined ? `${scores[b.id]}/10` : '—'}
              </span>
            </div>
            <input
              type="range"
              min="1"
              max="10"
              value={scores[b.id] || 5}
              onChange={e => handleChange(b.id, e.target.value)}
              disabled={submitted}
              style={{ width: '100%', accentColor: b.farbe }}
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: 10, color: 'var(--ki-text-tertiary)' }}>
              <span>1</span><span>5</span><span>10</span>
            </div>
          </div>
        ))}
      </div>

      {submitted && (
        <div style={{ marginTop: 20 }}>
          {/* Visual bar chart */}
          <div style={{ display: 'flex', gap: 12, alignItems: 'flex-end', height: 120, marginBottom: 16, padding: '0 8px' }}>
            {BEREICHE.map(b => {
              const val = scores[b.id] || 0;
              const pct = (val / maxVal) * 100;
              return (
                <div key={b.id} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
                  <span style={{ fontSize: 11, fontWeight: 700, color: b.farbe }}>{val}</span>
                  <div style={{
                    width: '100%',
                    height: `${pct}%`,
                    background: `linear-gradient(180deg, ${b.farbe}, ${b.farbe}88)`,
                    borderRadius: 'var(--r-sm) var(--r-sm) 0 0',
                    minHeight: 8,
                    transition: 'height 0.4s ease',
                  }} />
                  <span style={{ fontSize: 10, color: 'var(--ki-text-tertiary)', textAlign: 'center' }}>{b.icon}</span>
                </div>
              );
            })}
          </div>

          {interpretation && (
            <div style={{
              padding: '14px 16px',
              borderRadius: 'var(--r-md)',
              background: `${interpretation.farbe}10`,
              border: `1px solid ${interpretation.farbe}30`,
              marginBottom: 14,
            }}>
              <div style={{ fontSize: 13, lineHeight: 1.6, color: 'var(--ki-text-secondary)' }}>
                {interpretation.text}
              </div>
            </div>
          )}

          <button onClick={() => onComplete?.()} className="btn btn-primary">
            Lebensrad speichern (+40 XP)
          </button>
        </div>
      )}

      {!submitted && (
        <button
          onClick={handleSubmit}
          className="btn btn-primary"
          disabled={!allFilled}
          style={{ marginTop: 16, opacity: allFilled ? 1 : 0.5 }}
        >
          Lebensrad auswerten
        </button>
      )}
    </div>
  );
}
