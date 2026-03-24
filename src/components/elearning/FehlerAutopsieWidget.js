'use client';

import { useState } from 'react';

const FRAGEN = [
  { label: 'Was genau ist passiert?', placeholder: 'Fakten beschreiben, keine Bewertung', emoji: '📋' },
  { label: 'Welche Annahme war falsch?', placeholder: 'Was hast du angenommen das nicht stimmte?', emoji: '❌' },
  { label: 'Was hätte ich VORHER wissen müssen?', placeholder: 'Welches Wissen hat gefehlt?', emoji: '📚' },
  { label: 'Was mache ich NÄCHSTES MAL anders?', placeholder: 'Konkreter Aktionsplan', emoji: '🔄' },
  { label: 'Wen kann ich fragen der diese Erfahrung schon hat?', placeholder: 'Name oder Rolle', emoji: '🤝' },
];

export default function FehlerAutopsieWidget({ onComplete }) {
  const [answers, setAnswers] = useState({});
  const [submitted, setSubmitted] = useState(false);

  function update(idx, val) {
    setAnswers(prev => ({ ...prev, [idx]: val }));
  }

  const allFilled = FRAGEN.every((_, i) => (answers[i] || '').length >= 10);

  return (
    <div className="card" style={{ border: '1px solid rgba(139,92,246,0.2)' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 6 }}>
        <span style={{ fontSize: 22 }}>🔬</span>
        <span style={{ fontSize: 15, fontWeight: 700 }}>Fehler-Autopsie</span>
      </div>
      <p style={{ fontSize: 13, color: 'var(--ki-text-secondary)', marginBottom: 16, lineHeight: 1.6 }}>
        Denke an einen Fehler den du kürzlich gemacht hast. Analysiere ihn systematisch — so wird er zu deinem besten Lehrer.
      </p>

      <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
        {FRAGEN.map((f, i) => (
          <div key={i}>
            <label style={{ fontSize: 13, fontWeight: 600, display: 'flex', alignItems: 'center', gap: 6, marginBottom: 4 }}>
              <span>{f.emoji}</span> {f.label}
            </label>
            <textarea
              className="input"
              value={answers[i] || ''}
              onChange={e => update(i, e.target.value)}
              placeholder={f.placeholder}
              rows={2}
              disabled={submitted}
              style={{ resize: 'vertical', fontSize: 13 }}
            />
          </div>
        ))}
      </div>

      {!submitted ? (
        <button
          onClick={() => setSubmitted(true)}
          className="btn btn-primary"
          disabled={!allFilled}
          style={{ marginTop: 16, opacity: allFilled ? 1 : 0.5 }}
        >
          Autopsie abschließen
        </button>
      ) : (
        <div style={{ marginTop: 16 }}>
          <div style={{
            padding: '14px 16px', borderRadius: 'var(--r-md)',
            background: 'rgba(139,92,246,0.06)', border: '1px solid rgba(139,92,246,0.2)',
            marginBottom: 14,
          }}>
            <div style={{ fontSize: 14, fontWeight: 700, color: '#8b5cf6', marginBottom: 4 }}>
              ✅ Fehler-Autopsie abgeschlossen
            </div>
            <div style={{ fontSize: 13, color: 'var(--ki-text-secondary)' }}>
              Dieser Fehler wird dich nicht mehr überraschen. Du hast ihn in einen Lern-Moment verwandelt.
            </div>
          </div>
          <button onClick={onComplete} className="btn btn-primary">
            ✅ Als erledigt markieren (+40 XP)
          </button>
        </div>
      )}
    </div>
  );
}
